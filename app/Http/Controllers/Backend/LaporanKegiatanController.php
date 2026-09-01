<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\LaporanKegiatan;
use App\Models\Pokja1;
use App\Models\Pokja2;
use App\Models\Pokja3;
use App\Models\Pokja4;
use App\Models\DataUmumSekretariat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LaporanKegiatanController extends Controller
{
    public function index(Request $request)
    {
        $search   = $request->input('search');
        $status   = $request->input('status');
        $pokja    = $request->input('pokja');
        $perPage  = (int) $request->input('per_page', 10);

        $laporans = LaporanKegiatan::query()
            ->with(['user:id,name', 'reviewer:id,name'])
            ->when($search, function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->where('judul', 'like', "%{$search}%")
                        ->orWhere('kecamatan', 'like', "%{$search}%")
                        ->orWhere('desa_kelurahan', 'like', "%{$search}%")
                        ->orWhere('nama_dasawisma', 'like', "%{$search}%");
                });
            })
            ->when($status, fn ($q) => $q->where('status', $status))
            ->when($pokja, fn ($q) => $q->where('kategori_pokja', $pokja))
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        if (
            !$request->header('X-Inertia') &&
            ($request->wantsJson() || $request->ajax())
        ) {
            return response()->json($laporans);
        }

        return Inertia::render('Backend/LaporanKegiatan/Index', [
            'laporans' => $laporans,
            'filters'  => $request->only(['search', 'status', 'pokja', 'per_page']),
        ]);
    }

    public function show(LaporanKegiatan $laporan_kegiatan)
    {
        $laporan_kegiatan->load(['user:id,name', 'reviewer:id,name']);

        return Inertia::render('Backend/LaporanKegiatan/Show', [
            'laporan' => $laporan_kegiatan,
        ]);
    }

    /**
     * Approve laporan dan update statistik Pokja.
     *
     * FIX: Sebelumnya, laporan tanpa data kecamatan DITOLAK total —
     * status tetap 'pending' dan admin tidak diberi tahu kenapa (flash
     * 'warning' tidak pernah ditampilkan di frontend). Sekarang laporan
     * TETAP BISA disetujui walau kecamatan kosong; hanya update statistik
     * Pokja yang di-skip untuk laporan itu (karena statistik butuh
     * kecamatan sebagai kunci rekap).
     */
    public function approve(Request $request, LaporanKegiatan $laporan_kegiatan)
    {
        // Cek apakah laporan sudah di-approve sebelumnya
        if ($laporan_kegiatan->status === 'approved') {
            return redirect()
                ->back()
                ->with('warning', 'Laporan sudah disetujui sebelumnya.');
        }

        $statistikTerupdate = false;

        // Statistik Pokja cuma bisa diupdate kalau ada kecamatan DAN data_angka.
        // Kalau salah satu kosong, statistik di-skip tapi laporan tetap approved.
        if (!empty($laporan_kegiatan->kecamatan) && !empty($laporan_kegiatan->data_angka)) {
            $this->updateStatistikPokja($laporan_kegiatan);
            $statistikTerupdate = true;
        }

        // Update status laporan — ini SELALU jalan, terlepas dari statistik.
        $laporan_kegiatan->update([
            'status'      => 'approved',
            'reviewed_at' => now(),
            'reviewed_by' => $request->user()->id,
        ]);

        if ($statistikTerupdate) {
            return redirect()
                ->back()
                ->with('success', 'Laporan berhasil disetujui dan data telah masuk ke statistik Pokja.');
        }

        return redirect()
            ->back()
            ->with('warning', 'Laporan disetujui, tetapi TIDAK masuk ke statistik Pokja karena data kecamatan atau data angka kosong. Lengkapi data laporan ini kalau ingin statistiknya tercatat.');
    }

    /**
     * Reject laporan
     */
    public function reject(Request $request, LaporanKegiatan $laporan_kegiatan)
    {
        $laporan_kegiatan->update([
            'status'      => 'rejected',
            'reviewed_at' => now(),
            'reviewed_by' => $request->user()->id,
        ]);

        return redirect()
            ->back()
            ->with('error', 'Laporan ditolak.');
    }

    /**
     * Update statistik Pokja berdasarkan laporan yang disetujui
     */
    private function updateStatistikPokja(LaporanKegiatan $laporan)
    {
        $kecamatan = $laporan->kecamatan;
        $pokja = $laporan->kategori_pokja;
        $dataAngka = $laporan->data_angka ?? [];

        // Pastikan kecamatan tidak null
        if (empty($kecamatan)) {
            return;
        }

        switch ($pokja) {
            case 'I':
                $this->updatePokja1($kecamatan, $dataAngka);
                break;
            case 'II':
                $this->updatePokja2($kecamatan, $dataAngka);
                break;
            case 'III':
                $this->updatePokja3($kecamatan, $dataAngka);
                break;
            case 'IV':
                $this->updatePokja4($kecamatan, $dataAngka);
                break;
            case 'SEKRETARIAT':
                $this->updateSekretariat($kecamatan, $dataAngka);
                break;
        }
    }

    /**
     * Update statistik Pokja I
     */
    private function updatePokja1($kecamatan, $dataAngka)
    {
        $pokja = Pokja1::firstOrCreate(
            ['kecamatan' => $kecamatan],
            [
                'nama_kecamatan' => $kecamatan,
                'kategori' => 'Pokja I',
                'judul_kegiatan' => 'Rekapitulasi Pokja I - ' . $kecamatan,
                'deskripsi' => 'Data rekapitulasi Pokja I Kecamatan ' . $kecamatan,
                'pkbn_l' => 0,
                'pkbn_p' => 0,
                'pkdrt_l' => 0,
                'pkdrt_p' => 0,
                'pola_asuh_l' => 0,
                'pola_asuh_p' => 0,
                'lansia_l' => 0,
                'lansia_p' => 0,
                'kader_pokja1_l' => 0,
                'kader_pokja1_p' => 0,
            ]
        );

        $pokja->increment('pkbn_l', $dataAngka['pkbn_l'] ?? 0);
        $pokja->increment('pkbn_p', $dataAngka['pkbn_p'] ?? 0);
        $pokja->increment('pkdrt_l', $dataAngka['pkdrt_l'] ?? 0);
        $pokja->increment('pkdrt_p', $dataAngka['pkdrt_p'] ?? 0);
        $pokja->increment('pola_asuh_l', $dataAngka['pola_asuh_l'] ?? 0);
        $pokja->increment('pola_asuh_p', $dataAngka['pola_asuh_p'] ?? 0);
        $pokja->increment('lansia_l', $dataAngka['lansia_l'] ?? 0);
        $pokja->increment('lansia_p', $dataAngka['lansia_p'] ?? 0);
        $pokja->increment('kader_pokja1_l', $dataAngka['kader_pokja1_l'] ?? 0);
        $pokja->increment('kader_pokja1_p', $dataAngka['kader_pokja1_p'] ?? 0);
    }

    /**
     * Update statistik Pokja II
     */
    private function updatePokja2($kecamatan, $dataAngka)
    {
        $pokja = Pokja2::firstOrCreate(
            ['kecamatan' => $kecamatan],
            [
                'nama_kecamatan' => $kecamatan,
                'kategori' => 'Pokja II',
                'judul_kegiatan' => 'Rekapitulasi Pokja II - ' . $kecamatan,
                'deskripsi' => 'Data rekapitulasi Pokja II Kecamatan ' . $kecamatan,
                'warga_buta_l' => 0,
                'warga_buta_p' => 0,
                'kelompok_belajar_paket_a' => 0,
                'kelompok_belajar_paket_b' => 0,
                'kelompok_belajar_paket_c' => 0,
                'kf' => 0,
                'paud' => 0,
                'koperasi_berbadan_hukum' => 0,
            ]
        );

        $pokja->increment('warga_buta_l', $dataAngka['warga_buta_l'] ?? 0);
        $pokja->increment('warga_buta_p', $dataAngka['warga_buta_p'] ?? 0);
        $pokja->increment('kelompok_belajar_paket_a', $dataAngka['kelompok_belajar_paket_a'] ?? 0);
        $pokja->increment('kelompok_belajar_paket_b', $dataAngka['kelompok_belajar_paket_b'] ?? 0);
        $pokja->increment('kelompok_belajar_paket_c', $dataAngka['kelompok_belajar_paket_c'] ?? 0);
        $pokja->increment('kf', $dataAngka['kf'] ?? 0);
        $pokja->increment('paud', $dataAngka['paud'] ?? 0);
        $pokja->increment('koperasi_berbadan_hukum', $dataAngka['koperasi_berbadan_hukum'] ?? 0);
    }

    /**
     * Update statistik Pokja III
     */
    private function updatePokja3($kecamatan, $dataAngka)
    {
        $pokja = Pokja3::firstOrCreate(
            ['kecamatan' => $kecamatan],
            [
                'nama_kecamatan' => $kecamatan,
                'kategori' => 'Pokja III',
                'judul_kegiatan' => 'Rekapitulasi Pokja III - ' . $kecamatan,
                'deskripsi' => 'Data rekapitulasi Pokja III Kecamatan ' . $kecamatan,
                'rumah_sehat' => 0,
                'rumah_tidak_sehat' => 0,
                'pemanfaatan_pekarangan' => 0,
                'industri_rumah_tangga' => 0,
            ]
        );

        $pokja->increment('rumah_sehat', $dataAngka['rumah_sehat'] ?? 0);
        $pokja->increment('rumah_tidak_sehat', $dataAngka['rumah_tidak_sehat'] ?? 0);
        $pokja->increment('pemanfaatan_pekarangan', $dataAngka['pemanfaatan_pekarangan'] ?? 0);
        $pokja->increment('industri_rumah_tangga', $dataAngka['industri_rumah_tangga'] ?? 0);
    }

    /**
     * Update statistik Pokja IV
     */
    private function updatePokja4($kecamatan, $dataAngka)
    {
        $pokja = Pokja4::firstOrCreate(
            ['kecamatan' => $kecamatan],
            [
                'nama_kecamatan' => $kecamatan,
                'kategori' => 'Pokja IV',
                'judul_kegiatan' => 'Rekapitulasi Pokja IV - ' . $kecamatan,
                'deskripsi' => 'Data rekapitulasi Pokja IV Kecamatan ' . $kecamatan,
                'posyandu' => 0,
                'akseptor_kb' => 0,
                'phbs' => 0,
                'jamban_keluarga' => 0,
            ]
        );

        $pokja->increment('posyandu', $dataAngka['posyandu'] ?? 0);
        $pokja->increment('akseptor_kb', $dataAngka['akseptor_kb'] ?? 0);
        $pokja->increment('phbs', $dataAngka['phbs'] ?? 0);
        $pokja->increment('jamban_keluarga', $dataAngka['jamban_keluarga'] ?? 0);
    }

    /**
     * Update statistik Sekretariat
     */
    private function updateSekretariat($kecamatan, $dataAngka)
    {
        $sekretariat = DataUmumSekretariat::firstOrCreate(
            ['kecamatan' => $kecamatan],
            [
                'nama_kecamatan' => $kecamatan,
                'kategori' => 'Sekretariat',
                'judul_kegiatan' => 'Rekapitulasi Sekretariat - ' . $kecamatan,
                'deskripsi' => 'Data rekapitulasi Sekretariat Kecamatan ' . $kecamatan,
                'jumlah_kk' => 0,
                'jumlah_dasa_wisma' => 0,
                'jiwa_l' => 0,
                'jiwa_p' => 0,
                'kader_umum_l' => 0,
                'kader_umum_p' => 0,
                'kader_khusus_l' => 0,
                'kader_khusus_p' => 0,
                'tp_pkk_l' => 0,
                'tp_pkk_p' => 0,
            ]
        );

        $sekretariat->increment('jumlah_kk', $dataAngka['jumlah_kk'] ?? 0);
        $sekretariat->increment('jumlah_dasa_wisma', $dataAngka['jumlah_dasa_wisma'] ?? 0);
        $sekretariat->increment('jiwa_l', $dataAngka['jiwa_l'] ?? 0);
        $sekretariat->increment('jiwa_p', $dataAngka['jiwa_p'] ?? 0);
        $sekretariat->increment('kader_umum_l', $dataAngka['kader_umum_l'] ?? 0);
        $sekretariat->increment('kader_umum_p', $dataAngka['kader_umum_p'] ?? 0);
        $sekretariat->increment('kader_khusus_l', $dataAngka['kader_khusus_l'] ?? 0);
        $sekretariat->increment('kader_khusus_p', $dataAngka['kader_khusus_p'] ?? 0);
        $sekretariat->increment('tp_pkk_l', $dataAngka['tp_pkk_l'] ?? 0);
        $sekretariat->increment('tp_pkk_p', $dataAngka['tp_pkk_p'] ?? 0);
    }

    public function markReviewed(Request $request, LaporanKegiatan $laporan_kegiatan)
    {
        $laporan_kegiatan->update([
            'status'      => 'reviewed',
            'reviewed_at' => now(),
            'reviewed_by' => $request->user()->id,
        ]);

        return redirect()
            ->back()
            ->with('success', 'Laporan ditandai sudah direview.');
    }

    public function destroy(LaporanKegiatan $laporan_kegiatan)
    {
        if ($laporan_kegiatan->foto && Storage::disk('public')->exists($laporan_kegiatan->foto)) {
            Storage::disk('public')->delete($laporan_kegiatan->foto);
        }

        $laporan_kegiatan->delete();

        return redirect()
            ->route('be.laporan-kegiatan.index')
            ->with('success', 'Laporan berhasil dihapus.');
    }
}
