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
    // TAMBAH DATA — input langsung kabupaten (upsert agregat NULL).
    // Baris yang dibuat: level=desa, dusun=NULL, status+kecamatan_status
    // =approved, sehingga langsung masuk roll-up tabel + publik + export.
    // Bila (kecamatan, desa, tahun) sudah ada (dari alur desa), angkanya
    // DITIMPA — dicatat di log aktivitas. Inilah bedanya dengan Pokja:
    // sekretariat tidak punya antrean pending, kabupaten = penentu akhir.
    // ============================================================
    public function create()
    {
        return Inertia::render('Backend/Sekretariat/Create', [
            'kecamatanList' => \App\Models\WilayahDesa::kecamatanList(),
            'desaByKecamatan' => \App\Models\WilayahDesa::dataDesa(),
        ]);
    }

    public function store(Request $request)
    {
        $angka = [
            'jumlah_dusun', 'jumlah_pkk_rw', 'jumlah_pkk_rt', 'jumlah_dasa_wisma',
            'jumlah_krt', 'jumlah_kk', 'jiwa_l', 'jiwa_p', 'jiwa_tidak_terpilah',
            'tp_pkk_l', 'tp_pkk_p', 'kader_umum_l', 'kader_umum_p',
            'kader_khusus_l', 'kader_khusus_p', 'sekretariat_honorer_l', 'sekretariat_honorer_p',
            'sekretariat_bantuan_l', 'sekretariat_bantuan_p',
        ];
        $rules = [
            'kecamatan' => ['required', 'string', 'max:255', \Illuminate\Validation\Rule::in(\App\Models\WilayahDesa::kecamatanList())],
            'desa' => ['required', 'string', 'max:255'],
            'tahun' => ['required', 'integer', 'min:2000', 'max:2100'],
            'keterangan' => ['nullable', 'string'],
        ];
        foreach ($angka as $field) {
            $rules[$field] = ['nullable', 'integer', 'min:0'];
        }
        $validated = $request->validate($rules, [
            'kecamatan.required' => 'Pilih kecamatan.',
            'kecamatan.in' => 'Pilih kecamatan yang terdaftar di master wilayah.',
            'desa.required' => 'Pilih desa.',
        ]);

        // Desa harus milik kecamatan yang dipilih (cermin validasi akun).
        $available = \App\Models\WilayahDesa::desaOf($validated['kecamatan']);
        if (!in_array($validated['desa'], $available, true)) {
            return redirect()->back()->withErrors([
                'desa' => "Desa {$validated['desa']} tidak ada di {$validated['kecamatan']}.",
            ])->withInput();
        }

        $user = auth()->user();
        $ada = DataUmumPkk::where('kecamatan', $validated['kecamatan'])
            ->where('desa', $validated['desa'])
            ->where('tahun', $validated['tahun'])
            ->where('level', 'desa')
            ->whereNull('dusun')
            ->exists();

        $data = [
            'nama_kecamatan' => $validated['kecamatan'],
            'nama_desa' => $validated['desa'],
            'level' => 'desa',
            'dusun' => null,
            'nama_dusun' => null,
            // Tabel data_umum_pkk tak punya kolom status desa (hanya
            // kecamatan_status) — agregat kabupaten langsung approved.
            'kecamatan_status' => 'approved',
            'kecamatan_approved_by' => $user->id,
            'kecamatan_approved_at' => now(),
            'kecamatan_rejected_reason' => null,
            'keterangan' => $validated['keterangan'] ?? null,
            'updated_by' => $user->id,
        ];
        foreach ($angka as $field) {
            $data[$field] = (int) ($validated[$field] ?? 0);
        }

        DataUmumPkk::updateOrCreate(
            [
                'kecamatan' => $validated['kecamatan'],
                'desa' => $validated['desa'],
                'tahun' => $validated['tahun'],
                'level' => 'desa',
            ] + ['dusun' => null],
            $data + ['created_by' => $user->id],
        );
        \App\Services\ActivityLogger::log(
            'sekretariat.upsert',
            null,
            ($ada ? 'Timpa' : 'Tambah') . " agregat {$validated['desa']} ({$validated['kecamatan']}, {$validated['tahun']}) oleh kabupaten"
        );

        return redirect()->route('be.sekretariat.index', ['tahun' => $validated['tahun']])
            ->with('success', $ada
                ? "Angka {$validated['desa']} diperbarui (menimpa data alur desa)."
                : "Data {$validated['desa']} ditambahkan dan langsung tampil di publik.");
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
