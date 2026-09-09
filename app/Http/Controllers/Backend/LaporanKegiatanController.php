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
use Illuminate\Support\Facades\Log;
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

        $pendingCount = LaporanKegiatan::where('status', 'pending')->count();
        $approvedCount = LaporanKegiatan::where('status', 'approved')->count();
        $rejectedCount = LaporanKegiatan::where('status', 'rejected')->count();
        $reviewedCount = LaporanKegiatan::where('status', 'reviewed')->count();
        $totalCount = LaporanKegiatan::count();

        if (!$request->header('X-Inertia') && ($request->wantsJson() || $request->ajax())) {
            return response()->json($laporans);
        }

        return Inertia::render('Backend/LaporanKegiatan/Index', [
            'laporans' => $laporans,
            'filters'  => $request->only(['search', 'status', 'pokja', 'per_page']),
            'pendingCount' => $pendingCount,
            'approvedCount' => $approvedCount,
            'rejectedCount' => $rejectedCount,
            'reviewedCount' => $reviewedCount,
            'totalCount' => $totalCount,
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
     * 🔥 APPROVE LAPORAN + UPDATE STATISTIK
     */
    public function approve(Request $request, LaporanKegiatan $laporan_kegiatan)
    {
        if ($laporan_kegiatan->status === 'approved') {
            return redirect()->back()->with('warning', 'Laporan sudah disetujui sebelumnya.');
        }

        Log::info('📝 Approve Laporan:', [
            'id' => $laporan_kegiatan->id,
            'judul' => $laporan_kegiatan->judul,
            'kecamatan' => $laporan_kegiatan->kecamatan,
            'kategori_pokja' => $laporan_kegiatan->kategori_pokja,
        ]);

        $statistikTerupdate = false;

        // 🔥 DECODE DATA_ANGKA SAMPAI BENER-BENER ARRAY
        $dataAngka = $laporan_kegiatan->data_angka;
        if (is_string($dataAngka)) {
            $dataAngka = json_decode($dataAngka, true);
            if (is_string($dataAngka)) {
                $dataAngka = json_decode($dataAngka, true);
            }
        }

        // 🔥 CEK VALID DATA
        $isValidData = !empty($laporan_kegiatan->kecamatan)
            && is_array($dataAngka)
            && !empty($dataAngka)
            && !(count($dataAngka) === 1 && isset($dataAngka['_dummy']));

        if ($isValidData) {
            $this->updateStatistikPokja($laporan_kegiatan, $dataAngka);
            $statistikTerupdate = true;
            Log::info('✅ Statistik Pokja berhasil diupdate untuk laporan ID: ' . $laporan_kegiatan->id);
        } else {
            Log::warning('⚠️ Statistik Pokja GAGAL diupdate:', [
                'laporan_id' => $laporan_kegiatan->id,
                'kecamatan' => $laporan_kegiatan->kecamatan,
                'data_angka' => $dataAngka,
            ]);
        }

        $laporan_kegiatan->update([
            'status'      => 'approved',
            'reviewed_at' => now(),
            'reviewed_by' => $request->user()->id,
        ]);

        if ($statistikTerupdate) {
            return redirect()->back()->with('success', '✅ Laporan berhasil disetujui dan data masuk ke statistik Pokja.');
        }

        return redirect()->back()->with('warning', '⚠️ Laporan disetujui, tetapi TIDAK masuk ke statistik Pokja karena data tidak valid.');
    }

    /**
     * 🔥 REJECT LAPORAN
     */
    public function reject(Request $request, LaporanKegiatan $laporan_kegiatan)
    {
        $laporan_kegiatan->update([
            'status'      => 'rejected',
            'reviewed_at' => now(),
            'reviewed_by' => $request->user()->id,
        ]);

        return redirect()->back()->with('error', '❌ Laporan ditolak.');
    }

    /**
     * 🔥 APPROVE BATCH
     */
    public function approveBatch(Request $request)
    {
        $ids = $request->input('ids', []);

        if (empty($ids)) {
            return redirect()->back()->with('warning', 'Tidak ada laporan yang dipilih.');
        }

        $laporans = LaporanKegiatan::whereIn('id', $ids)
            ->where('status', 'pending')
            ->get();

        $count = 0;
        foreach ($laporans as $laporan) {
            // 🔥 DECODE DATA_ANGKA
            $dataAngka = $laporan->data_angka;
            if (is_string($dataAngka)) {
                $dataAngka = json_decode($dataAngka, true);
                if (is_string($dataAngka)) {
                    $dataAngka = json_decode($dataAngka, true);
                }
            }

            $isValidData = !empty($laporan->kecamatan)
                && is_array($dataAngka)
                && !empty($dataAngka)
                && !(count($dataAngka) === 1 && isset($dataAngka['_dummy']));

            if ($isValidData) {
                $this->updateStatistikPokja($laporan, $dataAngka);
            }

            $laporan->update([
                'status' => 'approved',
                'reviewed_at' => now(),
                'reviewed_by' => $request->user()->id,
            ]);
            $count++;
        }

        return redirect()->back()->with('success', "✅ {$count} laporan berhasil disetujui.");
    }

    public function markReviewed(Request $request, LaporanKegiatan $laporan_kegiatan)
    {
        $laporan_kegiatan->update([
            'status'      => 'reviewed',
            'reviewed_at' => now(),
            'reviewed_by' => $request->user()->id,
        ]);

        return redirect()->back()->with('success', '📋 Laporan ditandai sudah direview.');
    }

    public function destroy(LaporanKegiatan $laporan_kegiatan)
    {
        if ($laporan_kegiatan->foto && Storage::disk('public')->exists($laporan_kegiatan->foto)) {
            Storage::disk('public')->delete($laporan_kegiatan->foto);
        }

        $laporan_kegiatan->delete();

        return redirect()
            ->route('be.laporan-kegiatan.index')
            ->with('success', '🗑️ Laporan berhasil dihapus.');
    }

    // ─── 🔥 UPDATE STATISTIK POKJA ────────────────────────────────────────────
    private function updateStatistikPokja(LaporanKegiatan $laporan, array $dataAngka)
    {
        $kecamatan = $laporan->kecamatan;
        $pokja = $laporan->kategori_pokja;

        if (empty($kecamatan) || empty($dataAngka)) {
            return;
        }

        Log::info('📊 Update Statistik Pokja:', [
            'laporan_id' => $laporan->id,
            'pokja' => $pokja,
            'kecamatan' => $kecamatan,
        ]);

        switch ($pokja) {
            case 'I':  $this->updatePokja1($kecamatan, $dataAngka); break;
            case 'II': $this->updatePokja2($kecamatan, $dataAngka); break;
            case 'III': $this->updatePokja3($kecamatan, $dataAngka); break;
            case 'IV': $this->updatePokja4($kecamatan, $dataAngka); break;
            case 'SEKRETARIAT': $this->updateSekretariat($kecamatan, $dataAngka); break;
            default:
                Log::warning('⚠️ Kategori Pokja tidak dikenal: ' . $pokja);
        }
    }

    private function updatePokja1($kecamatan, $dataAngka)
    {
        $pokja = Pokja1::firstOrCreate(
            ['kecamatan' => $kecamatan],
            [
                'nama_kecamatan' => $kecamatan,
                'kategori' => 'Pokja I',
                'judul_kegiatan' => "Rekapitulasi Pokja I - $kecamatan",
                'deskripsi' => "Data rekapitulasi otomatis dari laporan mobile",
            ]
        );

        $fields = ['pkbn_l', 'pkbn_p', 'pkdrt_l', 'pkdrt_p', 'pola_asuh_l', 'pola_asuh_p', 'lansia_l', 'lansia_p', 'kader_pokja1_l', 'kader_pokja1_p'];
        foreach ($fields as $field) {
            $value = $dataAngka[$field] ?? 0;
            if ($value > 0) {
                $pokja->increment($field, $value);
            }
        }
        $pokja->save();

        Log::info('✅ Pokja I updated untuk: ' . $kecamatan);
    }

    private function updatePokja2($kecamatan, $dataAngka)
    {
        $pokja = Pokja2::firstOrCreate(
            ['kecamatan' => $kecamatan],
            [
                'nama_kecamatan' => $kecamatan,
                'kategori' => 'Pokja II',
                'judul_kegiatan' => "Rekapitulasi Pokja II - $kecamatan",
                'deskripsi' => "Data rekapitulasi otomatis dari laporan mobile",
            ]
        );

        $fields = ['warga_buta_l', 'warga_buta_p', 'kelompok_belajar_paket_a', 'kelompok_belajar_paket_b', 'kelompok_belajar_paket_c', 'kf', 'paud', 'koperasi_berbadan_hukum'];
        foreach ($fields as $field) {
            $value = $dataAngka[$field] ?? 0;
            if ($value > 0) {
                $pokja->increment($field, $value);
            }
        }
        $pokja->save();

        Log::info('✅ Pokja II updated untuk: ' . $kecamatan);
    }

    private function updatePokja3($kecamatan, $dataAngka)
    {
        $pokja = Pokja3::firstOrCreate(
            ['kecamatan' => $kecamatan],
            [
                'nama_kecamatan' => $kecamatan,
                'kategori' => 'Pokja III',
                'judul_kegiatan' => "Rekapitulasi Pokja III - $kecamatan",
                'deskripsi' => "Data rekapitulasi otomatis dari laporan mobile",
            ]
        );

        $fields = ['rumah_sehat', 'rumah_tidak_sehat', 'pemanfaatan_pekarangan', 'industri_rumah_tangga'];
        foreach ($fields as $field) {
            $value = $dataAngka[$field] ?? 0;
            if ($value > 0) {
                $pokja->increment($field, $value);
            }
        }
        $pokja->save();

        Log::info('✅ Pokja III updated untuk: ' . $kecamatan);
    }

    private function updatePokja4($kecamatan, $dataAngka)
    {
        $pokja = Pokja4::firstOrCreate(
            ['kecamatan' => $kecamatan],
            [
                'nama_kecamatan' => $kecamatan,
                'kategori' => 'Pokja IV',
                'judul_kegiatan' => "Rekapitulasi Pokja IV - $kecamatan",
                'deskripsi' => "Data rekapitulasi otomatis dari laporan mobile",
            ]
        );

        $fields = ['posyandu', 'akseptor_kb', 'phbs', 'jamban_keluarga'];
        foreach ($fields as $field) {
            $value = $dataAngka[$field] ?? 0;
            if ($value > 0) {
                $pokja->increment($field, $value);
            }
        }
        $pokja->save();

        Log::info('✅ Pokja IV updated untuk: ' . $kecamatan);
    }

    private function updateSekretariat($kecamatan, $dataAngka)
    {
        $sekretariat = DataUmumSekretariat::firstOrCreate(
            ['kecamatan' => $kecamatan],
            [
                'nama_kecamatan' => $kecamatan,
                'kategori' => 'Sekretariat',
                'judul_kegiatan' => "Rekapitulasi Sekretariat - $kecamatan",
                'deskripsi' => "Data rekapitulasi otomatis dari laporan mobile",
            ]
        );

        $fields = ['jumlah_kk', 'jumlah_dasa_wisma', 'jiwa_l', 'jiwa_p', 'kader_umum_l', 'kader_umum_p', 'kader_khusus_l', 'kader_khusus_p', 'tp_pkk_l', 'tp_pkk_p'];
        foreach ($fields as $field) {
            $value = $dataAngka[$field] ?? 0;
            if ($value > 0) {
                $sekretariat->increment($field, $value);
            }
        }
        $sekretariat->save();

        Log::info('✅ Sekretariat updated untuk: ' . $kecamatan);
    }
}
