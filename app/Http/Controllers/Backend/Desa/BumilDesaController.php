<?php

namespace App\Http\Controllers\Backend\Desa;

use App\Http\Controllers\Controller;
use App\Models\RekapBumil;
use App\Models\RekapBumilDasaWisma;
use App\Imports\RekapBumilImport;
use App\Exports\RekapBumilTemplateExport;
use App\Services\RekapBumilGenerator;
use Illuminate\Http\RedirectResponse;
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
        // Filter status hanya di level RT (antrean approve). Default pending.
        $status = (string) $request->input('status', 'pending');
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

            if (in_array($status, ['pending', 'approved', 'rejected'], true)) {
                $query->where('status', $status);
            } else {
                $status = 'all';
            }

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

        } elseif ($level === 'desa') {            // === LEVEL DESA — GROUP BY bulan ===
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

        } elseif ($level === 'ibu') {
            // === LEVEL DATA IBU — catatan per ibu dari kader (approve di sini) ===
            $ibuQuery = RekapBumilDasaWisma::query()
                ->where('kecamatan', $user->kecamatan)
                ->where('desa', $user->desa)
                ->where('tahun', $tahun);

            if ($bulan) {
                $ibuQuery->where('bulan', $bulan);
            }

            if ($request->filled('search')) {
                $searchIbu = $request->search;
                $ibuQuery->where(function ($q) use ($searchIbu) {
                    $q->where('nama', 'ilike', "%{$searchIbu}%")
                        ->orWhere('bayi_nama', 'ilike', "%{$searchIbu}%");
                });
            }

            if (in_array($status, ['pending', 'approved', 'rejected'], true)) {
                $ibuQuery->where('status', $status);
            }

            $data = $ibuQuery->with(['approvedBy:id,name'])
                ->orderBy('bulan')
                ->orderBy('nama')
                ->paginate(15)
                ->withQueryString()
                ->through(fn (RekapBumilDasaWisma $r): array => [
                    'id' => $r->id,
                    'nama' => $r->nama,
                    'suami_nama' => $r->suami_nama,
                    'status_ibu' => $r->status_ibu,
                    'bulan' => $r->bulan,
                    'nama_bulan' => RekapBumilGenerator::BULAN[(int) $r->bulan] ?? $r->bulan,
                    'tahun' => $r->tahun,
                    'dusun' => $r->dusun,
                    'rw' => $r->rw,
                    'rt' => $r->rt,
                    'bayi_nama' => $r->bayi_nama,
                    'status' => $r->status,
                    'rejected_reason' => $r->rejected_reason,
                    'approved_by_name' => $r->approvedBy?->name,
                ]);
        } else {
            $data = (clone $baseQuery)->paginate(15)->withQueryString();
        }

        // === STATISTIK PER LEVEL ===
        $statsPerLevel = [
            'rt' => (clone $baseQuery)->count(),
            'rw' => (clone $baseQuery)->distinct('rw')->count('rw'),
            'dusun' => (clone $baseQuery)->distinct('dusun')->count('dusun'),
            'desa' => 1,
            'ibu' => RekapBumilDasaWisma::query()
                ->where('kecamatan', $user->kecamatan)
                ->where('desa', $user->desa)
                ->where('tahun', $tahun)
                ->count(),
        ];

        // === STATISTIK TOTAL ===
        $stats = [
            'total_ibu_hamil' => (int) (clone $baseQuery)->sum('ibu_hamil'),
            'total_ibu_melahirkan' => (int) (clone $baseQuery)->sum('ibu_melahirkan'),
            'total_bayi_lahir' => (int) ((clone $baseQuery)
                ->selectRaw('COALESCE(SUM(bayi_lahir_l + bayi_lahir_p), 0) as total')
                ->value('total') ?? 0),
            'total_ibu_meninggal' => (int) (clone $baseQuery)->sum('ibu_meninggal'),
            'pending' => (int) (clone $baseQuery)->where('status', 'pending')->count(),
            'approved' => (int) (clone $baseQuery)->where('status', 'approved')->count(),
            'per_level' => $statsPerLevel,
        ];

        return Inertia::render('Backend/Desa/Bumil/Index', [
            'data' => $data,
            'stats' => $stats,
            'activeLevel' => $level,
            'filters' => array_merge(
                $request->only(['tahun', 'bulan', 'dusun', 'search']),
                ['status' => $status],
            ),
            'flash' => ['success' => session('success'), 'error' => session('error')],
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

    /**
     * POST /desa/bumil/generate-rekap
     * Buat/perbarui baris rekap RT per bulan otomatis dari catatan
     * per-ibu yang sudah disetujui. Baris yang sudah disetujui tidak diubah.
     */
    public function generateRekap(Request $request, RekapBumilGenerator $generator): RedirectResponse
    {
        $user = $request->user();
        $tahun = (int) $request->input('tahun', date('Y'));
        $bulan = $request->filled('bulan') ? (int) $request->input('bulan') : null;

        $summary = $generator->generateDesa(
            (string) $user->kecamatan,
            (string) $user->desa,
            $tahun,
            $bulan,
            (int) $user->id,
        );

        $total = $summary['created'] + $summary['updated'];

        return back()->with(
            'success',
            "Rekap bumil dibuat dari data yang sudah disetujui: "
            ."{$summary['created']} baris baru, {$summary['updated']} diperbarui, "
            ."{$summary['skipped_locked']} terkunci (sudah disetujui). Total $total baris siap approve."
        );
    }

    /**
     * POST /desa/bumil/{id}/approve
     */
    public function approve(Request $request, int $id): RedirectResponse
    {
        $record = $this->pendingRecord($request, $id);

        $record->forceFill([
            'status' => 'approved',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
            'rejected_reason' => null,
        ])->save();

        return back()->with('success', 'Baris rekap bumil berhasil disetujui.');
    }

    /**
     * POST /desa/bumil/{id}/reject
     */
    public function reject(Request $request, int $id): RedirectResponse
    {
        $validated = $request->validate([
            'reason' => ['required', 'string', 'max:2000'],
        ]);

        $record = $this->pendingRecord($request, $id);

        $record->forceFill([
            'status' => 'rejected',
            'approved_by' => null,
            'approved_at' => null,
            'rejected_reason' => $validated['reason'],
        ])->save();

        return back()->with('success', 'Baris rekap bumil ditolak.');
    }

    /**
     * POST /desa/bumil/bulk-approve
     */
    public function bulkApprove(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer'],
        ]);

        $user = $request->user();

        $count = RekapBumil::query()
            ->where('kecamatan', $user->kecamatan)
            ->where('desa', $user->desa)
            ->where('level', 'rt')
            ->where('status', 'pending')
            ->whereIn('id', $validated['ids'])
            ->update([
                'status' => 'approved',
                'approved_by' => $user->id,
                'approved_at' => now(),
                'rejected_reason' => null,
            ]);

        return back()->with('success', "$count baris rekap bumil disetujui.");
    }

    private function pendingRecord(Request $request, int $id): RekapBumil
    {
        $user = $request->user();

        return RekapBumil::query()
            ->where('kecamatan', $user->kecamatan)
            ->where('desa', $user->desa)
            ->where('level', 'rt')
            ->where('status', 'pending')
            ->whereKey($id)
            ->firstOrFail();
    }

    /**
     * POST /desa/bumil/ibu/{id}/approve
     * Menyetujui catatan per ibu (rekap bulan otomatis ikut terhitung).
     */
    public function ibuApprove(Request $request, int $id, RekapBumilGenerator $generator): RedirectResponse
    {
        $user = $request->user();

        $record = RekapBumilDasaWisma::query()
            ->where('kecamatan', $user->kecamatan)
            ->where('desa', $user->desa)
            ->where('status', 'pending')
            ->whereKey($id)
            ->firstOrFail();

        $record->forceFill([
            'status' => 'approved',
            'approved_by' => $user->id,
            'approved_at' => now(),
            'rejected_reason' => null,
        ])->save();

        try {
            $generator->generateRtBulan(
                (string) $record->kecamatan,
                (string) $record->desa,
                $record->dusun,
                $record->rw,
                $record->rt,
                (int) ($record->tahun ?? date('Y')),
                (int) ($record->bulan ?? date('n')),
                (int) $user->id,
            );
        } catch (Throwable $e) {
            report($e);
        }

        return back()->with('success', 'Data ibu disetujui dan masuk rekap.');
    }

    /**
     * POST /desa/bumil/ibu/{id}/reject
     */
    public function ibuReject(Request $request, int $id): RedirectResponse
    {
        $validated = $request->validate([
            'reason' => ['required', 'string', 'max:2000'],
        ]);

        $user = $request->user();

        $record = RekapBumilDasaWisma::query()
            ->where('kecamatan', $user->kecamatan)
            ->where('desa', $user->desa)
            ->where('status', 'pending')
            ->whereKey($id)
            ->firstOrFail();

        $record->forceFill([
            'status' => 'rejected',
            'approved_by' => null,
            'approved_at' => null,
            'rejected_reason' => $validated['reason'],
        ])->save();

        return back()->with('success', 'Data ibu ditolak.');
    }
}
