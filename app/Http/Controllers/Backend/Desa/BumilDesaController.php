<?php

namespace App\Http\Controllers\Backend\Desa;

use App\Http\Controllers\Controller;
use App\Models\RekapBumil;
use App\Imports\RekapBumilImport;
use App\Exports\RekapBumilTemplateExport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Throwable;

class BumilDesaController extends Controller
{
    /**
     * List rekap bumil — dengan tab level (RT, RW, Dusun, Desa)
     *
     * Data sumber: level RT (dari import)
     * Level RW, Dusun, Desa: AGREGASI LIVE via GROUP BY
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $level = $request->input('level', 'rt');
        $tahun = (int) $request->input('tahun', date('Y'));
        $bulan = $request->filled('bulan') ? (int) $request->bulan : null;

        // === BASE QUERY — selalu filter level RT ===
        $baseQuery = RekapBumil::query()
            ->where('kecamatan', $user->kecamatan)
            ->where('desa', $user->desa)
            ->where('tahun', $tahun)
            ->where('level', 'rt');

        if ($bulan) {
            $baseQuery->where('bulan', $bulan);
        }

        // === QUERY — tergantung level ===
        if ($level === 'rt') {
            // === LEVEL RT ===
            $query = clone $baseQuery;

            if ($request->filled('dusun')) {
                $query->where('dusun', $request->dusun);
            }

            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('nama_dusun', 'ilike', "%{$search}%")
                      ->orWhere('nama_dasawisma', 'ilike', "%{$search}%");
                });
            }

            $data = $query->orderBy('bulan')
                ->orderBy('dusun')
                ->orderBy('rw')
                ->orderBy('rt')
                ->paginate(15)
                ->withQueryString();

        } elseif ($level === 'rw') {
            // === LEVEL RW — GROUP BY dusun + rw ===
            $data = (clone $baseQuery)
                ->selectRaw('
                    kecamatan, desa, nama_kecamatan, nama_desa,
                    bulan, nama_bulan,
                    dusun, nama_dusun, rw,
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
                ->groupBy(
                    'kecamatan', 'desa', 'nama_kecamatan', 'nama_desa',
                    'bulan', 'nama_bulan',
                    'dusun', 'nama_dusun', 'rw'
                )
                ->orderBy('bulan')
                ->orderBy('dusun')
                ->orderBy('rw')
                ->paginate(15)
                ->withQueryString();

        } elseif ($level === 'dusun') {
            // === LEVEL DUSUN — GROUP BY dusun ===
            $data = (clone $baseQuery)
                ->selectRaw('
                    kecamatan, desa, nama_kecamatan, nama_desa,
                    bulan, nama_bulan,
                    dusun, nama_dusun,
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
                ->groupBy(
                    'kecamatan', 'desa', 'nama_kecamatan', 'nama_desa',
                    'bulan', 'nama_bulan',
                    'dusun', 'nama_dusun'
                )
                ->orderBy('bulan')
                ->orderBy('dusun')
                ->paginate(15)
                ->withQueryString();

        } elseif ($level === 'desa') {
            // === LEVEL DESA — GROUP BY bulan ===
            $data = (clone $baseQuery)
                ->selectRaw('
                    kecamatan, desa, nama_kecamatan, nama_desa,
                    bulan, nama_bulan,
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
                ->groupBy(
                    'kecamatan', 'desa', 'nama_kecamatan', 'nama_desa',
                    'bulan', 'nama_bulan'
                )
                ->orderBy('bulan')
                ->paginate(15)
                ->withQueryString();

        } else {
            $data = (clone $baseQuery)->paginate(15)->withQueryString();
        }

        // === STATISTIK PER LEVEL ===
        $statsPerLevel = [
            'rt' => (clone $baseQuery)->count(),
            'rw' => (clone $baseQuery)->distinct('rw')->count('rw'),
            'dusun' => (clone $baseQuery)->distinct('dusun')->count('dusun'),
            'desa' => 1,
        ];

        // === STATISTIK TOTAL ===
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
     * Handle import Excel — SINGLE SHEET (level RT)
     */
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls|max:10240',
            'tahun' => 'nullable|integer|min:2000|max:2100',
            'bulan' => 'nullable|integer|min:1|max:12',
            'replace' => 'nullable|boolean',
        ]);

        $user = auth()->user();
        $tahun = (int) $request->input('tahun', date('Y'));
        $bulan = (int) $request->input('bulan', date('n'));
        $replace = $request->boolean('replace');

        try {
            DB::beginTransaction();

            // === REPLACE MODE ===
            if ($replace) {
                RekapBumil::where('kecamatan', $user->kecamatan)
                    ->where('desa', $user->desa)
                    ->where('tahun', $tahun)
                    ->where('bulan', $bulan)
                    ->delete();
            }

            // === IMPORTER — SINGLE SHEET, level RT ===
            $import = new RekapBumilImport(
                $user->kecamatan,
                $user->desa,
                $tahun,
                'rt',   // ← level default
                $bulan
            );

            Excel::import($import, $request->file('file'));

            $success = $import->getSuccessCount();
            $skip = $import->getSkipCount();

            // === KALAU GA ADA DATA MASUK ===
            if ($success === 0) {
                DB::rollBack();
                return redirect()->back()->withInput()
                    ->with('error', 'Import tidak menghasilkan data. Pastikan struktur file Excel sesuai template.');
            }

            DB::commit();

            // === LOG ===
            Log::info('Import Rekap Bumil berhasil', [
                'user_id' => auth()->id(),
                'kecamatan' => $user->kecamatan,
                'desa' => $user->desa,
                'tahun' => $tahun,
                'bulan' => $bulan,
                'success' => $success,
                'skip' => $skip,
            ]);

            return redirect()
                ->route('desa.bumil.index', ['tahun' => $tahun])
                ->with('success',
                    "Import berhasil! {$success} data masuk, {$skip} di-skip. Level RW, Dusun, Desa akan dihitung otomatis."
                );

        } catch (Throwable $e) {
            DB::rollBack();

            Log::error('IMPORT REKAP BUMIL GAGAL', [
                'user_id' => auth()->id(),
                'kecamatan' => $user->kecamatan ?? null,
                'desa' => $user->desa ?? null,
                'tahun' => $tahun,
                'bulan' => $bulan,
                'message' => $e->getMessage(),
                'exception_file' => $e->getFile(),
                'exception_line' => $e->getLine(),
            ]);

            return redirect()->back()->withInput()
                ->with('error', 'Import gagal: ' . $e->getMessage());
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
