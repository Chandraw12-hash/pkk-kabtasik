<?php

namespace App\Http\Controllers\Backend\Desa;

use App\Http\Controllers\Controller;
use App\Models\RekapKegiatanWarga;
use App\Imports\RekapKegiatanWargaImport;
use App\Exports\RekapKegiatanWargaTemplateExport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class KegiatanDesaController extends Controller
{
    /**
     * List rekap kegiatan warga — dengan tab level (RT, RW, Dusun, Desa)
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $level = $request->input('level', 'rt');
        $tahun = (int) $request->input('tahun', date('Y'));

        $query = RekapKegiatanWarga::query()
            ->where('kecamatan', $user->kecamatan)
            ->where('desa', $user->desa)
            ->where('level', $level)
            ->where('tahun', $tahun);

        // Filter dusun
        if ($request->filled('dusun')) {
            $query->where('dusun', $request->dusun);
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_dusun', 'ilike', "%{$search}%")
                  ->orWhere('rw', 'ilike', "%{$search}%")
                  ->orWhere('rt', 'ilike', "%{$search}%");
            });
        }

        $data = $query->orderBy('dusun')
            ->orderBy('rw')
            ->orderBy('rt')
            ->paginate(15)
            ->withQueryString();

        // Statistik per level
        $statsPerLevel = [];
        foreach (['rt', 'rw', 'dusun', 'desa'] as $lvl) {
            $statsPerLevel[$lvl] = RekapKegiatanWarga::where('kecamatan', $user->kecamatan)
                ->where('desa', $user->desa)
                ->where('tahun', $tahun)
                ->where('level', $lvl)
                ->count();
        }

        // Query dasar untuk statistik
        $baseQuery = RekapKegiatanWarga::query()
            ->where('kecamatan', $user->kecamatan)
            ->where('desa', $user->desa)
            ->where('tahun', $tahun)
            ->where('level', $level);

        $stats = [
            'total_kk' => (int) (clone $baseQuery)->sum('jumlah_kk'),
            'total_jiwa' => (int) ((clone $baseQuery)
                ->selectRaw('COALESCE(SUM(total_l + total_p), 0) as total')
                ->value('total') ?? 0),
            'total_dasa_wisma' => (int) (clone $baseQuery)->sum('jumlah_dasa_wisma'),
            'per_level' => $statsPerLevel,
        ];

        return Inertia::render('Backend/Desa/Kegiatan/Index', [
            'data' => $data,
            'stats' => $stats,
            'activeLevel' => $level,
            'filters' => $request->only(['tahun', 'dusun', 'search']),
        ]);
    }

    /**
     * Halaman import kegiatan
     */
    public function import()
    {
        return Inertia::render('Backend/Desa/Kegiatan/Import');
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
        $level = $request->input('level', 'rt');
        $replace = $request->boolean('replace');

        try {
            DB::beginTransaction();

            // Kalau mode replace — hapus data lama
            if ($replace) {
                RekapKegiatanWarga::where('kecamatan', $user->kecamatan)
                    ->where('desa', $user->desa)
                    ->where('tahun', $tahun)
                    ->where('level', $level)
                    ->delete();
            }

            // Jalankan import
            $import = new RekapKegiatanWargaImport(
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
                ->route('desa.kegiatan.index', ['level' => $level, 'tahun' => $tahun])
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
        $filename = 'Template-Kegiatan-' . date('Y-m-d') . '.xlsx';

        return Excel::download(
            new RekapKegiatanWargaTemplateExport(),
            $filename
        );
    }
}