<?php

namespace App\Http\Controllers\Backend\Kecamatan;

use App\Http\Controllers\Controller;
use App\Models\DataUmumPkk;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DataUmumKecamatanController extends Controller
{
    /**
     * List Data Umum PKK — rekap per desa di kecamatan user
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $kecamatan = $user->kecamatan;
        $tahun = (int) $request->input('tahun', date('Y'));

        // Query dasar — filter kecamatan + tahun
        $baseQuery = DataUmumPkk::query()
            ->where('kecamatan', $kecamatan)
            ->where('tahun', $tahun)
            ->where('level', 'desa');

        // Search desa
        if ($request->filled('search')) {
            $search = $request->search;
            $baseQuery->where(function ($q) use ($search) {
                $q->where('nama_desa', 'ilike', "%{$search}%")
                  ->orWhere('desa', 'ilike', "%{$search}%");
            });
        }

        // Rekap per desa — group by desa
        $data = (clone $baseQuery)
            ->selectRaw('
                desa,
                MAX(nama_desa) as nama_desa,
                SUM(jumlah_kk) as jumlah_kk,
                SUM(jumlah_krt) as jumlah_krt,
                SUM(jiwa_l) as jiwa_l,
                SUM(jiwa_p) as jiwa_p,
                SUM(jumlah_dasa_wisma) as jumlah_dasa_wisma,
                SUM(jumlah_pkk_rw) as jumlah_pkk_rw,
                SUM(jumlah_pkk_rt) as jumlah_pkk_rt
            ')
            ->groupBy('desa')
            ->orderBy('desa')
            ->paginate(15)
            ->withQueryString();

        // Statistik total kecamatan
        $stats = [
            'total_desa' => (clone $baseQuery)->distinct('desa')->count('desa'),
            'total_kk' => (int) (clone $baseQuery)->sum('jumlah_kk'),
            'total_jiwa' => (int) ((clone $baseQuery)
                ->selectRaw('COALESCE(SUM(jiwa_l + jiwa_p), 0) as total')
                ->value('total') ?? 0),
            'total_dasa_wisma' => (int) (clone $baseQuery)->sum('jumlah_dasa_wisma'),
        ];

        return Inertia::render('Backend/Kecamatan/DataUmum/Index', [
            'kecamatan' => $kecamatan,
            'data' => $data,
            'stats' => $stats,
            'filters' => $request->only(['tahun', 'search']),
        ]);
    }

    /**
     * Detail per desa — semua data dusun
     */
    public function show(Request $request, string $desa)
    {
        $user = auth()->user();
        $kecamatan = $user->kecamatan;
        $tahun = (int) $request->input('tahun', date('Y'));

        $data = DataUmumPkk::query()
            ->where('kecamatan', $kecamatan)
            ->where('desa', $desa)
            ->where('tahun', $tahun)
            ->orderBy('dusun')
            ->paginate(20)
            ->withQueryString();

        // Info desa
        $infoDesa = DataUmumPkk::query()
            ->where('kecamatan', $kecamatan)
            ->where('desa', $desa)
            ->where('tahun', $tahun)
            ->first();

        // Statistik desa
        $stats = [
            'total_data' => DataUmumPkk::where('kecamatan', $kecamatan)
                ->where('desa', $desa)
                ->where('tahun', $tahun)
                ->count(),
            'total_kk' => (int) DataUmumPkk::where('kecamatan', $kecamatan)
                ->where('desa', $desa)
                ->where('tahun', $tahun)
                ->sum('jumlah_kk'),
            'total_jiwa' => (int) (DataUmumPkk::where('kecamatan', $kecamatan)
                ->where('desa', $desa)
                ->where('tahun', $tahun)
                ->selectRaw('COALESCE(SUM(jiwa_l + jiwa_p), 0) as total')
                ->value('total') ?? 0),
            'total_dasa_wisma' => (int) DataUmumPkk::where('kecamatan', $kecamatan)
                ->where('desa', $desa)
                ->where('tahun', $tahun)
                ->sum('jumlah_dasa_wisma'),
        ];

        return Inertia::render('Backend/Kecamatan/DataUmum/Show', [
            'kecamatan' => $kecamatan,
            'desa' => $desa,
            'nama_desa' => $infoDesa?->nama_desa ?? $desa,
            'data' => $data,
            'stats' => $stats,
            'filters' => $request->only(['tahun']),
        ]);
    }
}
