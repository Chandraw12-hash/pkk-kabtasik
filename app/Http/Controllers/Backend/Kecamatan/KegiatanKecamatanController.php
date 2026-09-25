<?php

namespace App\Http\Controllers\Backend\Kecamatan;

use App\Http\Controllers\Controller;
use App\Models\RekapKegiatanWarga;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KegiatanKecamatanController extends Controller
{
    /**
     * List Rekap Kegiatan — rekap per desa di kecamatan user
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $kecamatan = $user->kecamatan;
        $tahun = (int) $request->input('tahun', date('Y'));

        // === BASE QUERY ===
        // Data sumber: level 'rt' — ga filter level 'desa'
        $baseQuery = RekapKegiatanWarga::query()
            ->where('kecamatan', $kecamatan)
            ->where('tahun', $tahun)
            ->where('level', 'rt');

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
                SUM(jumlah_kk) as jumlah_kk,
                SUM(jumlah_krt) as jumlah_krt,
                SUM(total_l) as total_l,
                SUM(total_p) as total_p,
                SUM(jumlah_dasa_wisma) as jumlah_dasa_wisma,
                SUM(balita_l) as balita_l,
                SUM(balita_p) as balita_p,
                SUM(ibu_hamil) as ibu_hamil,
                SUM(ibu_menyusui) as ibu_menyusui,
                SUM(lansia) as lansia
            ')
            ->groupBy('desa')
            ->orderBy('desa')
            ->paginate(15)
            ->withQueryString();

        // Statistik total
        $stats = [
            'total_desa' => (clone $baseQuery)->distinct('desa')->count('desa'),
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
     * Detail per desa
     */
    public function show(Request $request, string $desa)
    {
        $user = auth()->user();
        $kecamatan = $user->kecamatan;
        $tahun = (int) $request->input('tahun', date('Y'));

        // === QUERY — level rt, by desa ===
        $data = RekapKegiatanWarga::query()
            ->where('kecamatan', $kecamatan)
            ->where('desa', $desa)
            ->where('tahun', $tahun)
            ->where('level', 'rt')
            ->orderBy('dusun')
            ->orderBy('rw')
            ->orderBy('rt')
            ->paginate(20)
            ->withQueryString();

        $infoDesa = RekapKegiatanWarga::query()
            ->where('kecamatan', $kecamatan)
            ->where('desa', $desa)
            ->where('tahun', $tahun)
            ->where('level', 'rt')
            ->first();

        // Statistik desa
        $baseQuery = RekapKegiatanWarga::query()
            ->where('kecamatan', $kecamatan)
            ->where('desa', $desa)
            ->where('tahun', $tahun)
            ->where('level', 'rt');

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
