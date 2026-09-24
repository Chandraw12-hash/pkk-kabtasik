<?php

namespace App\Http\Controllers\Backend\Desa;

use App\Http\Controllers\Controller;
use App\Models\RekapBumil;
use App\Imports\RekapBumilImport;
use App\Exports\RekapBumilTemplateExport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class BumilDesaController extends Controller
{
    /**
     * List rekap bumil — dengan tab level (RT, RW, Dusun, Desa)
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $level = $request->input('level', 'rt');
        $tahun = (int) $request->input('tahun', date('Y'));

        $query = RekapBumil::query()
            ->where('kecamatan', $user->kecamatan)
            ->where('desa', $user->desa)
            ->where('level', $level)
            ->where('tahun', $tahun);

        // Filter bulan
        if ($request->filled('bulan')) {
            $query->where('bulan', $request->bulan);
        }

        // Filter dusun
        if ($request->filled('dusun')) {
            $query->where('dusun', $request->dusun);
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_dusun', 'ilike', "%{$search}%")
                  ->orWhere('nama_dasawisma', 'ilike', "%{$search}%");
            });
        }

        $data = $query->orderBy('bulan')
            ->orderBy('dusun')
            ->paginate(15)
            ->withQueryString();

        // Statistik per level
        $statsPerLevel = [];
        foreach (['rt', 'rw', 'dusun', 'desa'] as $lvl) {
            $statsPerLevel[$lvl] = RekapBumil::where('kecamatan', $user->kecamatan)
                ->where('desa', $user->desa)
                ->where('tahun', $tahun)
                ->where('level', $lvl)
                ->count();
        }

        // Query dasar untuk statistik
        $baseQuery = RekapBumil::query()
            ->where('kecamatan', $user->kecamatan)
            ->where('desa', $user->desa)
            ->where('tahun', $tahun)
            ->where('level', $level);

        $stats = [
            'total_ibu_hamil' => (int) (clone $baseQuery)->sum('ibu_hamil'),
            'total_ibu_melahirkan' => (int) (clone $baseQuery)->sum('ibu_melahirkan'),
            'total_bayi_lahir' => (int) ((clone $baseQuery)
                ->selectRaw('COALESCE(SUM(bayi_lahir_l + bayi_lahir_p), 0) as total')
                ->value('total') ?? 0),
            'total_ibu_meninggal' => (int) (clone $baseQuery)->sum('ibu_meninggal'),
            'per_level' => $statsPerLevel,
        ];

        return Inertia::render('Backend/Desa/Bumil/Index', [
            'data' => $data,
            'stats' => $stats,
            'activeLevel' => $level,
            'filters' => $request->only(['tahun', 'bulan', 'dusun', 'search']),
        ]);
    }

    /**
     * Halaman import bumil
     */
    public function import()
    {
        return Inertia::render('Backend/Desa/Bumil/Import');
    }

    /**
     * Handle import Excel
     */
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls|max:10240',
            'tahun' => 'nullable|integer',
            'bulan' => 'nullable|integer|min:1|max:12',
            'level' => 'nullable|in:rt,rw,dusun,desa',
            'replace' => 'nullable|boolean',
        ]);

        $user = auth()->user();
        $tahun = (int) $request->input('tahun', date('Y'));
        $bulan = (int) $request->input('bulan', date('n'));
        $level = $request->input('level', 'rt');
        $replace = $request->boolean('replace');

        try {
            DB::beginTransaction();

            // Kalau mode replace — hapus data lama
            if ($replace) {
                RekapBumil::where('kecamatan', $user->kecamatan)
                    ->where('desa', $user->desa)
                    ->where('tahun', $tahun)
                    ->where('bulan', $bulan)
                    ->where('level', $level)
                    ->delete();
            }

            // Jalankan import
            $import = new RekapBumilImport(
                $user->kecamatan,
                $user->desa,
                $tahun,
                $level,
                $bulan
            );

            Excel::import($import, $request->file('file'));

            DB::commit();

            $success = $import->getSuccessCount();
            $skip = $import->getSkipCount();

            return redirect()
                ->route('desa.bumil.index', ['level' => $level, 'tahun' => $tahun])
                ->with('success', "✅ Import berhasil! {$success} data masuk, {$skip} data di-skip.");

        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->with('error', '❌ Import gagal: ' . $e->getMessage());
        }
    }

    /**
     * Download template Excel
     */
    public function downloadTemplate()
    {
        $filename = 'Template-Bumil-' . date('Y-m-d') . '.xlsx';

        return Excel::download(
            new RekapBumilTemplateExport(),
            $filename
        );
    }
}