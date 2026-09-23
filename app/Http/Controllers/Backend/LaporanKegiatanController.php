<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\LaporanKegiatan;
use App\Models\Pokja1;
use App\Models\Pokja2;
use App\Models\Pokja3;
use App\Models\Pokja4;
use App\Models\Pokja4KunjunganPyd;
use App\Models\Pokja4KegiatanPosyandu;
use App\Models\Pokja4Rekapitulasi;
use App\Models\DataUmumSekretariat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Carbon\Carbon;

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

        $dataAngka = $laporan_kegiatan->data_angka;
        if (is_string($dataAngka)) {
            $dataAngka = json_decode($dataAngka, true);
            if (is_string($dataAngka)) {
                $dataAngka = json_decode($dataAngka, true);
            }
        }

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

    public function reject(Request $request, LaporanKegiatan $laporan_kegiatan)
    {
        $laporan_kegiatan->update([
            'status'      => 'rejected',
            'reviewed_at' => now(),
            'reviewed_by' => $request->user()->id,
        ]);

        return redirect()->back()->with('error', '❌ Laporan ditolak.');
    }

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
            case 'IV-PYD': $this->updateKunjunganPyd($kecamatan, $dataAngka); break;
            case 'IV-POSYANDU': $this->updateKegiatanPosyandu($kecamatan, $dataAngka); break;
            case 'IV-REKAP': $this->updateRekapitulasi($kecamatan, $dataAngka); break;
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

        // Kader — angka — increment
        foreach (['kader_umum', 'kader_khusus'] as $field) {
            $value = (int) ($dataAngka[$field] ?? 0);
            if ($value > 0) {
                $pokja->increment($field, $value);
            }
        }

        // 6 program — kegiatan (text), volume (int), metode (text), sasaran (int)
        $programs = ['kisah', 'kilas', 'krisan', 'kiat', 'kisak', 'pkbn'];

        foreach ($programs as $prog) {
            // Kegiatan — text — replace
            $kegiatan = $dataAngka["{$prog}_kegiatan"] ?? null;
            if (!empty($kegiatan)) {
                $pokja->{"{$prog}_kegiatan"} = $kegiatan;
            }

            // Volume — int — increment
            $volume = (int) ($dataAngka["{$prog}_volume"] ?? 0);
            if ($volume > 0) {
                $pokja->increment("{$prog}_volume", $volume);
            }

            // Metode — text — replace
            $metode = $dataAngka["{$prog}_metode"] ?? null;
            if (!empty($metode)) {
                $pokja->{"{$prog}_metode"} = $metode;
            }

            // Sasaran — int — increment
            $sasaran = (int) ($dataAngka["{$prog}_sasaran"] ?? 0);
            if ($sasaran > 0) {
                $pokja->increment("{$prog}_sasaran", $sasaran);
            }
        }

        // Keterangan — text — replace
        $keterangan = $dataAngka['keterangan'] ?? null;
        if (!empty($keterangan)) {
            $pokja->keterangan = $keterangan;
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

        $fields = [
            'posyandu', 'akseptor_kb', 'phbs', 'jamban_keluarga',
            'kader_kesehatan', 'kader_gizi', 'kader_kesling', 'kader_phbs', 'kader_kb',
            'imunisasi', 'pkg', 'tbc',
            'spal', 'tps', 'mck',
            'air_pdam', 'air_sumur', 'air_lainnya',
            'jumlah_pus', 'jumlah_wus',
            'akseptor_kb_l', 'akseptor_kb_p',
            'tabungan_keluarga', 'asuransi_kesehatan',
        ];
        foreach ($fields as $field) {
            $value = $dataAngka[$field] ?? 0;
            if ($value > 0) {
                $pokja->increment($field, $value);
            }
        }

        $pokja->program_kesehatan = $dataAngka['program_kesehatan'] ?? $pokja->program_kesehatan;
        $pokja->program_lingkungan = $dataAngka['program_lingkungan'] ?? $pokja->program_lingkungan;
        $pokja->program_perencanaan = $dataAngka['program_perencanaan'] ?? $pokja->program_perencanaan;

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

    private function updateKunjunganPyd($kecamatan, $dataAngka)
    {
        $bulan = $dataAngka['bulan'] ?? null;
        $tahun = $dataAngka['tahun'] ?? date('Y');

        if (!$bulan) {
            Log::warning('Kunjungan PYD: bulan kosong');
            return;
        }

        $bulanInt = (int) $bulan;
        $namaBulan = Carbon::create()
            ->month($bulanInt)
            ->locale('id')
            ->translatedFormat('F');

        $record = Pokja4KunjunganPyd::firstOrNew([
            'kecamatan' => $kecamatan,
            'bulan' => $bulanInt,
            'tahun' => $tahun,
        ]);

        $record->nama_bulan = $namaBulan;

        $record->bayi_0_12_l = $dataAngka['bayi_0_12_l'] ?? 0;
        $record->bayi_0_12_p = $dataAngka['bayi_0_12_p'] ?? 0;
        $record->bayi_0_12_laki_l = $dataAngka['bayi_0_12_laki_l'] ?? 0;
        $record->bayi_0_12_laki_p = $dataAngka['bayi_0_12_laki_p'] ?? 0;
        $record->balita_1_5_l = $dataAngka['balita_1_5_l'] ?? 0;
        $record->balita_1_5_p = $dataAngka['balita_1_5_p'] ?? 0;
        $record->balita_1_5_laki_l = $dataAngka['balita_1_5_laki_l'] ?? 0;
        $record->balita_1_5_laki_p = $dataAngka['balita_1_5_laki_p'] ?? 0;
        $record->wus = $dataAngka['wus'] ?? 0;
        $record->pus = $dataAngka['pus'] ?? 0;
        $record->ibu_hamil = $dataAngka['ibu_hamil'] ?? 0;
        $record->ibu_menyusui = $dataAngka['ibu_menyusui'] ?? 0;
        $record->bayi_lahir = $dataAngka['bayi_lahir'] ?? 0;
        $record->bayi_meninggal = $dataAngka['bayi_meninggal'] ?? 0;
        $record->kematian_ibu = $dataAngka['kematian_ibu'] ?? 0;
        $record->petugas_kader = $dataAngka['petugas_kader'] ?? 0;
        $record->petugas_plkb = $dataAngka['petugas_plkb'] ?? 0;
        $record->petugas_medis = $dataAngka['petugas_medis'] ?? 0;
        $record->keterangan = $dataAngka['keterangan'] ?? null;

        $record->save();

        Log::info('✅ Kunjungan PYD updated untuk: ' . $kecamatan . ' bulan ' . $bulanInt . ' (' . $namaBulan . ')');
    }

    private function updateKegiatanPosyandu($kecamatan, $dataAngka)
    {
        $bulan = $dataAngka['bulan'] ?? null;
        $tahun = $dataAngka['tahun'] ?? date('Y');

        if (!$bulan) {
            Log::warning('Kegiatan Posyandu: bulan kosong');
            return;
        }

        $bulanInt = (int) $bulan;
        $namaBulan = Carbon::create()
            ->month($bulanInt)
            ->locale('id')
            ->translatedFormat('F');

        $record = Pokja4KegiatanPosyandu::firstOrNew([
            'kecamatan' => $kecamatan,
            'bulan' => $bulanInt,
            'tahun' => $tahun,
        ]);

        $record->nama_bulan = $namaBulan;

        $record->ibu_hamil = $dataAngka['ibu_hamil'] ?? 0;
        $record->ibu_hamil_diperiksa = $dataAngka['ibu_hamil_diperiksa'] ?? 0;
        $record->ibu_hamil_dapat_fe = $dataAngka['ibu_hamil_dapat_fe'] ?? 0;
        $record->menyusui = $dataAngka['menyusui'] ?? 0;

        $record->kb_iud = $dataAngka['kb_iud'] ?? 0;
        $record->kb_mow = $dataAngka['kb_mow'] ?? 0;
        $record->kb_mop = $dataAngka['kb_mop'] ?? 0;
        $record->kb_implan = $dataAngka['kb_implan'] ?? 0;
        $record->kb_pil = $dataAngka['kb_pil'] ?? 0;
        $record->kb_suntik = $dataAngka['kb_suntik'] ?? 0;
        $record->kb_kondom = $dataAngka['kb_kondom'] ?? 0;

        $record->balita_l = $dataAngka['balita_l'] ?? 0;
        $record->balita_p = $dataAngka['balita_p'] ?? 0;
        $record->balita_kia_l = $dataAngka['balita_kia_l'] ?? 0;
        $record->balita_kia_p = $dataAngka['balita_kia_p'] ?? 0;
        $record->balita_ditimbang_l = $dataAngka['balita_ditimbang_l'] ?? 0;
        $record->balita_ditimbang_p = $dataAngka['balita_ditimbang_p'] ?? 0;
        $record->balita_naik_l = $dataAngka['balita_naik_l'] ?? 0;
        $record->balita_naik_p = $dataAngka['balita_naik_p'] ?? 0;

        $record->vit_a_1 = $dataAngka['vit_a_1'] ?? 0;
        $record->vit_a_2 = $dataAngka['vit_a_2'] ?? 0;

        $record->imunisasi_tt_1 = $dataAngka['imunisasi_tt_1'] ?? 0;
        $record->imunisasi_tt_2 = $dataAngka['imunisasi_tt_2'] ?? 0;
        $record->imunisasi_bcg = $dataAngka['imunisasi_bcg'] ?? 0;
        $record->imunisasi_dpt_1 = $dataAngka['imunisasi_dpt_1'] ?? 0;
        $record->imunisasi_dpt_2 = $dataAngka['imunisasi_dpt_2'] ?? 0;
        $record->imunisasi_dpt_3 = $dataAngka['imunisasi_dpt_3'] ?? 0;
        $record->imunisasi_polio_1 = $dataAngka['imunisasi_polio_1'] ?? 0;
        $record->imunisasi_polio_2 = $dataAngka['imunisasi_polio_2'] ?? 0;
        $record->imunisasi_polio_3 = $dataAngka['imunisasi_polio_3'] ?? 0;
        $record->imunisasi_polio_4 = $dataAngka['imunisasi_polio_4'] ?? 0;
        $record->imunisasi_campak = $dataAngka['imunisasi_campak'] ?? 0;
        $record->imunisasi_hepatitis_1 = $dataAngka['imunisasi_hepatitis_1'] ?? 0;
        $record->imunisasi_hepatitis_2 = $dataAngka['imunisasi_hepatitis_2'] ?? 0;
        $record->imunisasi_hepatitis_3 = $dataAngka['imunisasi_hepatitis_3'] ?? 0;

        $record->balita_diare = $dataAngka['balita_diare'] ?? 0;
        $record->balita_oralit = $dataAngka['balita_oralit'] ?? 0;

        $record->keterangan = $dataAngka['keterangan'] ?? null;

        $record->save();

        Log::info('✅ Kegiatan Posyandu updated untuk: ' . $kecamatan . ' bulan ' . $bulanInt . ' (' . $namaBulan . ')');
    }

    private function updateRekapitulasi($kecamatan, $dataAngka)
    {
        $tahun = $dataAngka['tahun'] ?? date('Y');

        $record = Pokja4Rekapitulasi::firstOrNew([
            'kecamatan' => $kecamatan,
            'tahun' => $tahun,
        ]);

        $record->dusun = $dataAngka['dusun'] ?? null;
        $record->rw = $dataAngka['rw'] ?? null;
        $record->rt = $dataAngka['rt'] ?? null;
        $record->dasa_wisma = $dataAngka['dasa_wisma'] ?? null;
        $record->ibu_hamil = $dataAngka['ibu_hamil'] ?? 0;
        $record->ibu_melahirkan = $dataAngka['ibu_melahirkan'] ?? 0;
        $record->ibu_nifas = $dataAngka['ibu_nifas'] ?? 0;
        $record->ibu_meninggal = $dataAngka['ibu_meninggal'] ?? 0;
        $record->bayi_lahir_l = $dataAngka['bayi_lahir_l'] ?? 0;
        $record->bayi_lahir_p = $dataAngka['bayi_lahir_p'] ?? 0;
        $record->akte_ada = $dataAngka['akte_ada'] ?? 0;
        $record->akte_tidak = $dataAngka['akte_tidak'] ?? 0;
        $record->bayi_meninggal_l = $dataAngka['bayi_meninggal_l'] ?? 0;
        $record->bayi_meninggal_p = $dataAngka['bayi_meninggal_p'] ?? 0;
        $record->balita_meninggal_l = $dataAngka['balita_meninggal_l'] ?? 0;
        $record->balita_meninggal_p = $dataAngka['balita_meninggal_p'] ?? 0;
        $record->keterangan = $dataAngka['keterangan'] ?? null;

        $record->save();

        Log::info('✅ Rekapitulasi updated untuk: ' . $kecamatan);
    }
}
