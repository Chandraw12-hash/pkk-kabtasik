<?php

namespace App\Http\Controllers\Backend\Kecamatan;

use App\Http\Controllers\Controller;
use App\Models\RekapBumil;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BumilKecamatanController extends Controller
{
    /**
     * List Rekap Bumil — rekap per desa di kecamatan user
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $kecamatan = $user->kecamatan;
        $tahun = (int) $request->input('tahun', date('Y'));

        // === BASE QUERY — level 'rt' ===
        $baseQuery = RekapBumil::query()
            ->where('kecamatan', $kecamatan)
            ->where('tahun', $tahun)
            ->where('level', 'rt');

        // Filter bulan
        if ($request->filled('bulan')) {
            $baseQuery->where('bulan', $request->bulan);
        }

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
            ->selectRaw('
                desa,
                MAX(nama_desa) as nama_desa,
                SUM(ibu_hamil) as ibu_hamil,
                SUM(ibu_melahirkan) as ibu_melahirkan,
                SUM(ibu_nifas) as ibu_nifas,
                SUM(ibu_meninggal) as ibu_meninggal,
                SUM(bayi_lahir_l) as bayi_lahir_l,
                SUM(bayi_lahir_p) as bayi_lahir_p,
                SUM(akte_ada) as akte_ada,
                SUM(akte_tidak_ada) as akte_tidak_ada,
                SUM(bayi_meninggal_l) as bayi_meninggal_l,
                SUM(bayi_meninggal_p) as bayi_meninggal_p,
                SUM(balita_meninggal_l) as balita_meninggal_l,
                SUM(balita_meninggal_p) as balita_meninggal_p
            ')
            ->groupBy('desa')
            ->orderBy('desa')
            ->paginate(15)
            ->withQueryString();

        // Statistik total
        $stats = [
            'total_desa' => (clone $baseQuery)->distinct('desa')->count('desa'),
            'total_ibu_hamil' => (int) (clone $baseQuery)->sum('ibu_hamil'),
            'total_ibu_melahirkan' => (int) (clone $baseQuery)->sum('ibu_melahirkan'),
            'total_bayi_lahir' => (int) ((clone $baseQuery)
                ->selectRaw('COALESCE(SUM(bayi_lahir_l + bayi_lahir_p), 0) as total')
                ->value('total') ?? 0),
            'total_ibu_meninggal' => (int) (clone $baseQuery)->sum('ibu_meninggal'),
        ];

        return Inertia::render('Backend/Kecamatan/Bumil/Index', [
            'kecamatan' => $kecamatan,
            'data' => $data,
            'stats' => $stats,
            'filters' => $request->only(['tahun', 'bulan', 'search']),
        ]);
    }

    /**
     * Detail per desa
     */
    public function show(Request $request, string $desa)
    {
        $user = auth()->user();
        $kecamatan = $user->kecamatan;
        $tahun = (int) $request->input('tahun', date('Y'));

        // === QUERY — level rt, by desa ===
        $data = RekapBumil::query()
            ->where('kecamatan', $kecamatan)
            ->where('desa', $desa)
            ->where('tahun', $tahun)
            ->where('level', 'rt')
            ->orderBy('bulan')
            ->orderBy('dusun')
            ->orderBy('rw')
            ->orderBy('rt')
            ->paginate(20)
            ->withQueryString();

        $infoDesa = RekapBumil::query()
            ->where('kecamatan', $kecamatan)
            ->where('desa', $desa)
            ->where('tahun', $tahun)
            ->where('level', 'rt')
            ->first();

        // === BASE QUERY untuk statistik ===
        $baseQuery = RekapBumil::query()
            ->where('kecamatan', $kecamatan)
            ->where('desa', $desa)
            ->where('tahun', $tahun)
            ->where('level', 'rt');

        $stats = [
            'total_data' => (clone $baseQuery)->count(),
            'total_ibu_hamil' => (int) (clone $baseQuery)->sum('ibu_hamil'),
            'total_ibu_melahirkan' => (int) (clone $baseQuery)->sum('ibu_melahirkan'),
            'total_bayi_lahir' => (int) ((clone $baseQuery)
                ->selectRaw('COALESCE(SUM(bayi_lahir_l + bayi_lahir_p), 0) as total')
                ->value('total') ?? 0),
            'total_ibu_meninggal' => (int) (clone $baseQuery)->sum('ibu_meninggal'),
        ];

        return Inertia::render('Backend/Kecamatan/Bumil/Show', [
            'kecamatan' => $kecamatan,
            'desa' => $desa,
            'nama_desa' => $infoDesa?->nama_desa ?? $desa,
            'data' => $data,
            'stats' => $stats,
            'filters' => $request->only(['tahun']),
        ]);
    }
}
