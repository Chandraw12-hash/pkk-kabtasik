<?php

namespace App\Http\Controllers\Backend\Desa;

use App\Http\Controllers\Controller;
use App\Models\RekapKegiatanWarga;
use App\Imports\RekapKegiatanWargaImport;
use App\Exports\RekapKegiatanWargaTemplateExport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Throwable;

class KegiatanDesaController extends Controller
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
     * List rekap kegiatan warga — tab level (RT, RW, Dusun, Desa)
     *
     * Data sumber: level RT (dari import)
     * Level RW, Dusun, Desa: AGREGASI LIVE via GROUP BY
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $level = $request->input('level', 'rt');
        if (!in_array($level, ['rt', 'rw', 'dusun', 'desa'], true)) {
            $level = 'rt';
        }
        $tahun = (int) $request->input('tahun', date('Y'));

        // === BASE QUERY — selalu filter level RT (baris input) ===
        $baseQuery = RekapKegiatanWarga::query()
            ->where('kecamatan', $user->kecamatan)
            ->where('desa', $user->desa)
            ->where('tahun', $tahun)
            ->where('level', 'rt');

        if ($level === 'rt') {
            // === LEVEL RT — baris apa adanya ===
            $query = clone $baseQuery;

            if ($request->filled('dusun')) {
                $query->where('dusun', $request->dusun);
            }

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

        } elseif ($level === 'rw') {
            // === LEVEL RW — GROUP BY dusun + rw ===
            $data = (clone $baseQuery)
                ->selectRaw(
                    'kecamatan, desa, nama_kecamatan, nama_desa, dusun, nama_dusun, rw, '
                    . 'COUNT(*) as jumlah_rt, ' . $this->sumSelect()
                )
                ->groupBy('kecamatan', 'desa', 'nama_kecamatan', 'nama_desa', 'dusun', 'nama_dusun', 'rw')
                ->orderBy('dusun')
                ->orderBy('rw')
                ->paginate(15)
                ->withQueryString();

        } elseif ($level === 'dusun') {
            // === LEVEL DUSUN — GROUP BY dusun ===
            $data = (clone $baseQuery)
                ->selectRaw(
                    'kecamatan, desa, nama_kecamatan, nama_desa, dusun, nama_dusun, '
                    . 'COUNT(DISTINCT rw) as jumlah_rw, COUNT(*) as jumlah_rt, ' . $this->sumSelect()
                )
                ->groupBy('kecamatan', 'desa', 'nama_kecamatan', 'nama_desa', 'dusun', 'nama_dusun')
                ->orderBy('dusun')
                ->paginate(15)
                ->withQueryString();

        } else {
            // === LEVEL DESA — GROUP BY dusun (breakdown per dusun di dalam desa) ===
            $data = (clone $baseQuery)
                ->selectRaw(
                    'kecamatan, desa, nama_kecamatan, nama_desa, dusun, nama_dusun, '
                    . 'COUNT(DISTINCT rw) as jumlah_rw, COUNT(*) as jumlah_rt, '
                    . $this->sumSelect()
                )
                ->groupBy('kecamatan', 'desa', 'nama_kecamatan', 'nama_desa', 'dusun', 'nama_dusun')
                ->orderBy('dusun')
                ->paginate(15)
                ->withQueryString();
        }

        // === STATISTIK PER LEVEL (COUNT) ===
        $statsPerLevel = [
            'rt' => (clone $baseQuery)->count(),
            'rw' => (clone $baseQuery)->distinct('rw')->count('rw'),
            'dusun' => (clone $baseQuery)->distinct('dusun')->count('dusun'),
            'desa' => (clone $baseQuery)->distinct('dusun')->count('dusun'),
        ];

        // === STATISTIK TOTAL ===
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
     * Handle import Excel — SINGLE SHEET (level RT)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls', 'max:10240'],
            'tahun' => ['nullable', 'integer', 'min:2000', 'max:2100'],
            'replace' => ['nullable', 'boolean'],
        ]);

        $user = auth()->user();
        $tahun = (int) $request->input('tahun', date('Y'));
        $replace = $request->boolean('replace');
        $fileName = $request->file('file')->getClientOriginalName();

        try {
            DB::beginTransaction();

            // === REPLACE MODE — hapus data lama ===
            if ($replace) {
                RekapKegiatanWarga::query()
                    ->where('kecamatan', $user->kecamatan)
                    ->where('desa', $user->desa)
                    ->where('tahun', $tahun)
                    ->delete();
            }

            // === IMPORTER — SINGLE SHEET ===
            $import = new RekapKegiatanWargaImport(
                $user->kecamatan,
                $user->desa,
                $tahun,
                'rt'  // level input: RT
            );

            Excel::import($import, $request->file('file'));

            $success = $import->getSuccessCount();
            $skip = $import->getSkipCount();
            $importErrors = $import->getErrors();

            // === KALAU GA ADA DATA MASUK ===
            if ($success === 0 && empty($importErrors)) {
                DB::rollBack();
                return redirect()->back()->withInput()
                    ->with('error', 'Import tidak menghasilkan data. Pastikan struktur file Excel sesuai template.');
            }

            DB::commit();

            // === LOG ===
            Log::info('Import Rekap Kegiatan berhasil', [
                'user_id' => auth()->id(),
                'kecamatan' => $user->kecamatan,
                'desa' => $user->desa,
                'tahun' => $tahun,
                'file' => $fileName,
                'success' => $success,
                'skip' => $skip,
                'errors' => count($importErrors),
            ]);

            if (!empty($importErrors)) {
                return redirect()
                    ->route('desa.kegiatan.index', ['tahun' => $tahun])
                    ->with('warning',
                        "Import selesai dengan catatan: {$success} data masuk, {$skip} di-skip, dan " .
                        count($importErrors) . " baris memiliki masalah."
                    );
            }

            return redirect()
                ->route('desa.kegiatan.index', ['tahun' => $tahun])
                ->with('success',
                    "Import berhasil! {$success} data masuk, {$skip} di-skip. Level RW, Dusun, dan Desa akan dihitung otomatis."
                );

        } catch (Throwable $e) {
            DB::rollBack();

            Log::error('IMPORT REKAP KEGIATAN GAGAL', [
                'user_id' => auth()->id(),
                'kecamatan' => $user->kecamatan ?? null,
                'desa' => $user->desa ?? null,
                'tahun' => $tahun,
                'file' => $fileName,
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
        $filename = 'Template-Kegiatan-' . date('Y-m-d') . '.xlsx';

        return Excel::download(
            new RekapKegiatanWargaTemplateExport(),
            $filename
        );
    }

    /**
     * Hapus data per dusun (semua RT di dusun tersebut)
     */
    public function destroyDusun(Request $request, string $dusun)
    {
        $user = auth()->user();
        $tahun = (int) $request->input('tahun', date('Y'));

        $deleted = RekapKegiatanWarga::query()
            ->where('kecamatan', $user->kecamatan)
            ->where('desa', $user->desa)
            ->where('tahun', $tahun)
            ->where('level', 'rt')
            ->where('dusun', $dusun)
            ->delete();

        return redirect()
            ->route('desa.kegiatan.index', ['tahun' => $tahun, 'level' => 'dusun'])
            ->with('success', "Data dusun {$dusun} berhasil dihapus ({$deleted} record RT).");
    }
}
