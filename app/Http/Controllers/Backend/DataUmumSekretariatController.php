<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\DataUmumPkk;
use App\Models\RekapKegiatanWarga;
use App\Models\RekapBumil;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DataUmumSekretariatController extends Controller
{
    // ============================================================
    // TAB 1 — DATA UMUM PKK
    // ✅ Filter: level=desa, dusun=NULL, kecamatan_status=approved
    // ============================================================
    public function index(Request $request)
    {
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);
        $tahun = $request->input('tahun', date('Y'));

        $query = DataUmumPkk::query()
            ->where('level', 'desa')
            ->whereNull('dusun')
            ->where('kecamatan_status', 'approved')   // ✅ cuma approved kecamatan
            ->where('tahun', $tahun);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('kecamatan', 'like', "%{$search}%")
                    ->orWhere('nama_kecamatan', 'like', "%{$search}%");
            });
        }

        $sekretariatData = $query
            ->select([
                'kecamatan',
                DB::raw('MAX(nama_kecamatan) as nama_kecamatan'),
                'tahun',
                DB::raw('SUM(jumlah_dusun) as jumlah_dusun'),
                DB::raw('SUM(jumlah_pkk_rw) as jumlah_pkk_rw'),
                DB::raw('SUM(jumlah_pkk_rt) as jumlah_pkk_rt'),
                DB::raw('SUM(jumlah_dasa_wisma) as jumlah_dasa_wisma'),
                DB::raw('SUM(jumlah_krt) as jumlah_krt'),
                DB::raw('SUM(jumlah_kk) as jumlah_kk'),
                DB::raw('SUM(jiwa_l) as jiwa_l'),
                DB::raw('SUM(jiwa_p) as jiwa_p'),
                DB::raw('SUM(jiwa_tidak_terpilah) as jiwa_tidak_terpilah'),
                DB::raw('SUM(tp_pkk_l) as tp_pkk_l'),
                DB::raw('SUM(tp_pkk_p) as tp_pkk_p'),
                DB::raw('SUM(kader_umum_l) as kader_umum_l'),
                DB::raw('SUM(kader_umum_p) as kader_umum_p'),
                DB::raw('SUM(kader_khusus_l) as kader_khusus_l'),
                DB::raw('SUM(kader_khusus_p) as kader_khusus_p'),
                DB::raw('SUM(sekretariat_honorer_l) as sekretariat_honorer_l'),
                DB::raw('SUM(sekretariat_honorer_p) as sekretariat_honorer_p'),
                DB::raw('SUM(sekretariat_bantuan_l) as sekretariat_bantuan_l'),
                DB::raw('SUM(sekretariat_bantuan_p) as sekretariat_bantuan_p'),
            ])
            ->groupBy('kecamatan', 'tahun')
            ->orderBy('kecamatan')
            ->paginate($perPage)
            ->withQueryString();

        // ✅ FIX: cuma tampil tahun dari data approved
        $tahunList = DataUmumPkk::where('level', 'desa')
            ->whereNull('dusun')
            ->where('kecamatan_status', 'approved')   // ✅ TAMBAH
            ->select('tahun')
            ->distinct()
            ->orderByDesc('tahun')
            ->pluck('tahun');

        if ($tahunList->isEmpty()) {
            $tahunList = collect([date('Y')]);
        }

        return Inertia::render('Backend/Sekretariat/Index', [
            'sekretariats' => $sekretariatData,
            'filters' => $request->only(['search', 'per_page', 'tahun']),
            'tahunList' => $tahunList,
            'activeTab' => 'umum',
        ]);
    }

    // ============================================================
    // TAB 2 — DATA KEGIATAN
    // ============================================================
    public function kegiatan(Request $request)
    {
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);
        $tahun = $request->input('tahun', date('Y'));

        $query = RekapKegiatanWarga::query()
            ->where('level', 'rt')
            ->where('tahun', $tahun);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('kecamatan', 'like', "%{$search}%")
                    ->orWhere('nama_kecamatan', 'like', "%{$search}%");
            });
        }

        $data = $query
            ->select([
                'kecamatan',
                DB::raw('MAX(nama_kecamatan) as nama_kecamatan'),
                'tahun',
                DB::raw('SUM(jumlah_dusun) as jumlah_dusun'),
                DB::raw('SUM(jumlah_rw) as jumlah_rw'),
                DB::raw('SUM(jumlah_rt) as jumlah_rt'),
                DB::raw('SUM(jumlah_dasa_wisma) as jumlah_dasa_wisma'),
                DB::raw('SUM(jumlah_krt) as jumlah_krt'),
                DB::raw('SUM(jumlah_kk) as jumlah_kk'),
                DB::raw('SUM(total_l) as total_l'),
                DB::raw('SUM(total_p) as total_p'),
                DB::raw('SUM(balita_l) as balita_l'),
                DB::raw('SUM(balita_p) as balita_p'),
                DB::raw('SUM(pus) as pus'),
                DB::raw('SUM(wus) as wus'),
                DB::raw('SUM(ibu_hamil) as ibu_hamil'),
                DB::raw('SUM(ibu_menyusui) as ibu_menyusui'),
                DB::raw('SUM(lansia) as lansia'),
                DB::raw('SUM(buta_l) as buta_l'),
                DB::raw('SUM(buta_p) as buta_p'),
                DB::raw('SUM(rumah_sehat) as rumah_sehat'),
                DB::raw('SUM(rumah_kurang_sehat) as rumah_kurang_sehat'),
                DB::raw('SUM(memiliki_tempat_sampah) as memiliki_tempat_sampah'),
                DB::raw('SUM(memiliki_spal) as memiliki_spal'),
                DB::raw('SUM(memiliki_stiker_p4k) as memiliki_stiker_p4k'),
                DB::raw('SUM(air_pdam) as air_pdam'),
                DB::raw('SUM(air_sumur) as air_sumur'),
                DB::raw('SUM(air_sungai) as air_sungai'),
                DB::raw('SUM(air_dll) as air_dll'),
                DB::raw('SUM(jumlah_jamban_keluarga) as jumlah_jamban_keluarga'),
                DB::raw('SUM(makanan_pokok_beras) as makanan_pokok_beras'),
                DB::raw('SUM(makanan_pokok_non_beras) as makanan_pokok_non_beras'),
                DB::raw('SUM(kegiatan_up2k) as kegiatan_up2k'),
                DB::raw('SUM(kegiatan_tanah_pekarangan) as kegiatan_tanah_pekarangan'),
                DB::raw('SUM(kegiatan_industri_rumah_tangga) as kegiatan_industri_rumah_tangga'),
                DB::raw('SUM(kegiatan_kesehatan_lingkungan) as kegiatan_kesehatan_lingkungan'),
            ])
            ->groupBy('kecamatan', 'tahun')
            ->orderBy('kecamatan')
            ->paginate($perPage)
            ->withQueryString();

        $tahunList = RekapKegiatanWarga::where('level', 'rt')
            ->select('tahun')
            ->distinct()
            ->orderByDesc('tahun')
            ->pluck('tahun');

        if ($tahunList->isEmpty()) {
            $tahunList = collect([date('Y')]);
        }

        return Inertia::render('Backend/Sekretariat/Kegiatan', [
            'data' => $data,
            'filters' => $request->only(['search', 'per_page', 'tahun']),
            'tahunList' => $tahunList,
            'activeTab' => 'kegiatan',
        ]);
    }

    // ============================================================
    // TAB 3 — REKAP BUMIL
    // ============================================================
    public function bumil(Request $request)
    {
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);
        $tahun = $request->input('tahun', date('Y'));

        $query = RekapBumil::query()
            ->where('level', 'rt')
            ->where('tahun', $tahun);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('kecamatan', 'like', "%{$search}%")
                    ->orWhere('nama_kecamatan', 'like', "%{$search}%");
            });
        }

        $data = $query
            ->select([
                'kecamatan',
                DB::raw('MAX(nama_kecamatan) as nama_kecamatan'),
                'tahun',
                DB::raw('SUM(jumlah_dusun) as jumlah_dusun'),
                DB::raw('SUM(jumlah_rw) as jumlah_rw'),
                DB::raw('SUM(jumlah_rt) as jumlah_rt'),
                DB::raw('SUM(jumlah_dasa_wisma) as jumlah_dasa_wisma'),
                DB::raw('SUM(ibu_hamil) as ibu_hamil'),
                DB::raw('SUM(ibu_melahirkan) as ibu_melahirkan'),
                DB::raw('SUM(ibu_nifas) as ibu_nifas'),
                DB::raw('SUM(ibu_meninggal) as ibu_meninggal'),
                DB::raw('SUM(bayi_lahir_l) as bayi_lahir_l'),
                DB::raw('SUM(bayi_lahir_p) as bayi_lahir_p'),
                DB::raw('SUM(akte_ada) as akte_ada'),
                DB::raw('SUM(akte_tidak_ada) as akte_tidak_ada'),
                DB::raw('SUM(bayi_meninggal_l) as bayi_meninggal_l'),
                DB::raw('SUM(bayi_meninggal_p) as bayi_meninggal_p'),
                DB::raw('SUM(balita_meninggal_l) as balita_meninggal_l'),
                DB::raw('SUM(balita_meninggal_p) as balita_meninggal_p'),
            ])
            ->groupBy('kecamatan', 'tahun')
            ->orderBy('kecamatan')
            ->paginate($perPage)
            ->withQueryString();

        $tahunList = RekapBumil::where('level', 'rt')
            ->select('tahun')
            ->distinct()
            ->orderByDesc('tahun')
            ->pluck('tahun');

        if ($tahunList->isEmpty()) {
            $tahunList = collect([date('Y')]);
        }

        return Inertia::render('Backend/Sekretariat/Bumil', [
            'data' => $data,
            'filters' => $request->only(['search', 'per_page', 'tahun']),
            'tahunList' => $tahunList,
            'activeTab' => 'bumil',
        ]);
    }

    // ============================================================
    // EXPORT — Data Umum PKK (CSV)
    // ✅ Filter kecamatan_status = approved
    // ============================================================
    public function export(Request $request)
    {
        $tahun = $request->input('tahun', date('Y'));

        $data = DataUmumPkk::where('level', 'desa')
            ->whereNull('dusun')
            ->where('kecamatan_status', 'approved')
            ->where('tahun', $tahun)
            ->select([
                'kecamatan',
                'tahun',
                DB::raw('SUM(jumlah_dusun) as jumlah_dusun'),
                DB::raw('SUM(jumlah_pkk_rw) as jumlah_pkk_rw'),
                DB::raw('SUM(jumlah_pkk_rt) as jumlah_pkk_rt'),
                DB::raw('SUM(jumlah_dasa_wisma) as jumlah_dasa_wisma'),
                DB::raw('SUM(jumlah_krt) as jumlah_krt'),
                DB::raw('SUM(jumlah_kk) as jumlah_kk'),
                DB::raw('SUM(jiwa_l) as jiwa_l'),
                DB::raw('SUM(jiwa_p) as jiwa_p'),
                DB::raw('SUM(jiwa_tidak_terpilah) as jiwa_tidak_terpilah'),
                DB::raw('SUM(kader_umum_l) as kader_umum_l'),
                DB::raw('SUM(kader_umum_p) as kader_umum_p'),
                DB::raw('SUM(kader_khusus_l) as kader_khusus_l'),
                DB::raw('SUM(kader_khusus_p) as kader_khusus_p'),
            ])
            ->groupBy('kecamatan', 'tahun')
            ->orderBy('kecamatan')
            ->get();

        $filename = 'data-pkk-sekretariat-' . $tahun . '-' . date('Y-m-d') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($data) {
            $file = fopen('php://output', 'w');

            fputcsv($file, [
                'Kecamatan',
                'PKK RW',
                'PKK RT',
                'Dasawisma',
                'KK',
                'Jiwa L',
                'Jiwa P',
                'Belum Terpilah',
                'Kader Umum L',
                'Kader Umum P',
                'Kader Khusus L',
                'Kader Khusus P',
                'Tahun',
            ]);

            foreach ($data as $row) {
                fputcsv($file, [
                    $row->kecamatan,
                    $row->jumlah_pkk_rw ?? 0,
                    $row->jumlah_pkk_rt ?? 0,
                    $row->jumlah_dasa_wisma ?? 0,
                    $row->jumlah_kk ?? 0,
                    $row->jiwa_l ?? 0,
                    $row->jiwa_p ?? 0,
                    $row->jiwa_tidak_terpilah ?? 0,
                    $row->kader_umum_l ?? 0,
                    $row->kader_umum_p ?? 0,
                    $row->kader_khusus_l ?? 0,
                    $row->kader_khusus_p ?? 0,
                    $row->tahun,
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
