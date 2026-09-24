<?php

namespace App\Http\Controllers\Backend\Desa;

use App\Http\Controllers\Controller;
use App\Models\DataUmumPkk;
use App\Imports\DataUmumPkkImport;
use App\Exports\DataUmumPkkTemplateExport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class DataUmumDesaController extends Controller
{
    /**
     * List data umum PKK desa
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $tahun = (int) $request->input('tahun', date('Y'));

        $query = DataUmumPkk::query()
            ->where('kecamatan', $user->kecamatan)
            ->where('desa', $user->desa)
            ->where('tahun', $tahun);

        // Filter level
        if ($request->filled('level')) {
            $query->where('level', $request->level);
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
                  ->orWhere('dusun', 'ilike', "%{$search}%");
            });
        }

        $data = $query->orderBy('dusun')
            ->orderBy('level')
            ->paginate(15)
            ->withQueryString();

        // Statistik — pakai query dasar
        $baseQuery = DataUmumPkk::query()
            ->where('kecamatan', $user->kecamatan)
            ->where('desa', $user->desa)
            ->where('tahun', $tahun);

        $stats = [
            'total_data' => (clone $baseQuery)->count(),
            'total_kk' => (int) (clone $baseQuery)->sum('jumlah_kk'),
            'total_jiwa' => (int) ((clone $baseQuery)
                ->selectRaw('COALESCE(SUM(jiwa_l + jiwa_p), 0) as total')
                ->value('total') ?? 0),
            'total_dasa_wisma' => (int) (clone $baseQuery)->sum('jumlah_dasa_wisma'),
        ];

        return Inertia::render('Backend/Desa/DataUmum/Index', [
            'data' => $data,
            'stats' => $stats,
            'filters' => $request->only(['tahun', 'level', 'dusun', 'search']),
        ]);
    }

    /**
     * Halaman import data umum
     */
    public function import()
    {
        return Inertia::render('Backend/Desa/DataUmum/Import');
    }

    /**
     * Handle import Excel
     */
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls|max:10240',
            'tahun' => 'nullable|integer',
            'level' => 'nullable|in:rt,rw,dusun,desa',
            'replace' => 'nullable|boolean',
        ]);

        $user = auth()->user();
        $tahun = (int) $request->input('tahun', date('Y'));
        $level = $request->input('level', 'desa');
        $replace = $request->boolean('replace');

        try {
            DB::beginTransaction();

            // Kalau mode replace — hapus data lama
            if ($replace) {
                DataUmumPkk::where('kecamatan', $user->kecamatan)
                    ->where('desa', $user->desa)
                    ->where('tahun', $tahun)
                    ->where('level', $level)
                    ->delete();
            }

            // Jalankan import
            $import = new DataUmumPkkImport(
                $user->kecamatan,
                $user->desa,
                $tahun,
                $level
            );

            Excel::import($import, $request->file('file'));

            DB::commit();

            $success = $import->getSuccessCount();
            $skip = $import->getSkipCount();

            return redirect()
                ->route('desa.data-umum.index', ['tahun' => $tahun])
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
        $filename = 'Template-Data-Umum-PKK-' . date('Y-m-d') . '.xlsx';

        return Excel::download(
            new DataUmumPkkTemplateExport(),
            $filename
        );
    }
}