<?php

namespace App\Http\Controllers\Backend\Kecamatan;

use App\Http\Controllers\Controller;
use App\Models\RekapKegiatanWarga;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KegiatanKecamatanController extends Controller
{
    private const SUM_COLUMNS = [
        'jumlah_rt', 'jumlah_dasa_wisma', 'jumlah_krt', 'jumlah_kk',
        'total_l', 'total_p', 'balita_l', 'balita_p', 'pus', 'wus',
        'ibu_hamil', 'ibu_menyusui', 'lansia', 'buta_l', 'buta_p',
        'rumah_sehat', 'rumah_kurang_sehat', 'memiliki_tempat_sampah',
        'memiliki_spal', 'memiliki_stiker_p4k',
        'air_pdam', 'air_sumur', 'air_sungai', 'air_dll',
        'jumlah_jamban_keluarga',
        'makanan_pokok_beras', 'makanan_pokok_non_beras',
        'kegiatan_up2k', 'kegiatan_tanah_pekarangan',
        'kegiatan_industri_rumah_tangga', 'kegiatan_kesehatan_lingkungan',
    ];

    private function sumSelect(): string
    {
        return collect(self::SUM_COLUMNS)
            ->map(fn ($c) => "COALESCE(SUM({$c}), 0) as {$c}")
            ->implode(', ');
    }

    /**
     * List Rekap Kegiatan — rekap per desa di kecamatan user
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $kecamatan = $user->kecamatan;
        $tahun = (int) $request->input('tahun', date('Y'));

        // === BASE QUERY — pakai level 'rt' ===
        $baseQuery = RekapKegiatanWarga::query()
            ->where('kecamatan', $kecamatan)
            ->where('tahun', $tahun)
            ->where('level', 'rt');  // ← FIX: ganti dari 'rw' ke 'rt'

        // Search desa
        if ($request->filled('search')) {
            $search = $request->search;
            $baseQuery->where(function ($q) use ($search) {
                $q->where('nama_desa', 'ilike', "%{$search}%")
                  ->orWhere('desa', 'ilike', "%{$search}%");
            });
        }

        // Rekap per desa
        $data = (clone $baseQuery)
            ->selectRaw(
                'desa, MAX(nama_desa) as nama_desa, '
                . 'COUNT(DISTINCT dusun) as jumlah_dusun, '
                . 'COUNT(DISTINCT rw) as jumlah_rw, '  // ← hitung RW unik
                . $this->sumSelect()
            )
            ->groupBy('desa')
            ->orderBy('desa')
            ->paginate(15)
            ->withQueryString();

        // Statistik total
        $stats = [
            'total_desa' => (clone $baseQuery)->distinct()->count('desa'),
            'total_kk' => (int) (clone $baseQuery)->sum('jumlah_kk'),
            'total_jiwa' => (int) ((clone $baseQuery)
                ->selectRaw('COALESCE(SUM(total_l + total_p), 0) as total')
                ->value('total') ?? 0),
            'total_dasa_wisma' => (int) (clone $baseQuery)->sum('jumlah_dasa_wisma'),
        ];

        return Inertia::render('Backend/Kecamatan/Kegiatan/Index', [
            'kecamatan' => $kecamatan,
            'data' => $data,
            'stats' => $stats,
            'filters' => $request->only(['tahun', 'search']),
        ]);
    }

    /**
     * Detail per desa — 1 baris = 1 RT
     */
    public function show(Request $request, string $desa)
    {
        $user = auth()->user();
        $kecamatan = $user->kecamatan;
        $tahun = (int) $request->input('tahun', date('Y'));

        // === BASE QUERY — level rt, by desa ===
        $baseQuery = RekapKegiatanWarga::query()
            ->where('kecamatan', $kecamatan)
            ->where('desa', $desa)
            ->where('tahun', $tahun)
            ->where('level', 'rt');  // ← FIX: ganti dari 'rw' ke 'rt'

        $data = (clone $baseQuery)
            ->orderBy('dusun')
            ->orderByRaw("CAST(NULLIF(regexp_replace(rw, '\\D', '', 'g'), '') AS INTEGER)")
            ->orderByRaw("CAST(NULLIF(regexp_replace(rt, '\\D', '', 'g'), '') AS INTEGER)")
            ->paginate(20)
            ->withQueryString();

        $infoDesa = (clone $baseQuery)->first();

        // Statistik desa
        $stats = [
            'total_data' => (clone $baseQuery)->count(),
            'total_kk' => (int) (clone $baseQuery)->sum('jumlah_kk'),
            'total_jiwa' => (int) ((clone $baseQuery)
                ->selectRaw('COALESCE(SUM(total_l + total_p), 0) as total')
                ->value('total') ?? 0),
            'total_dasa_wisma' => (int) (clone $baseQuery)->sum('jumlah_dasa_wisma'),
        ];

        return Inertia::render('Backend/Kecamatan/Kegiatan/Show', [
            'kecamatan' => $kecamatan,
            'desa' => $desa,
            'nama_desa' => $infoDesa?->nama_desa ?? $desa,
            'data' => $data,
            'stats' => $stats,
            'filters' => $request->only(['tahun']),
        ]);
    }
}
