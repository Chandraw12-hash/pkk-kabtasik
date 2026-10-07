<?php

namespace App\Http\Controllers\Backend\Desa;

use App\Http\Controllers\Controller;
use App\Models\RekapKegiatanWarga;
use App\Models\User;
use App\Notifications\DasawismaRecordNotification;
use App\Imports\RekapKegiatanWargaImport;
use App\Exports\RekapKegiatanWargaTemplateExport;
use App\Services\RekapKegiatanGenerator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
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
     * Buat pattern pencarian desa yang tahan terhadap variasi format.
     * User disimpan: "Cikunir" | DB disimpan: "DESA CIKUNIR"
     */
    private function desaPattern(string $desa): string
    {
        return '%' . strtolower(trim($desa)) . '%';
    }

    /**
     * Buat pattern pencarian kecamatan.
     */
    private function kecamatanNormalized(string $kecamatan): string
    {
        return strtolower(trim($kecamatan));
    }

    /**
     * List rekap kegiatan warga — tab level (RT, RW, Dusun, Desa).
     *
     * Level RT: tampil semua status (pending/approved/rejected) → untuk approve
     * Level RW/Dusun/Desa: roll-up hanya dari data yang sudah APPROVED
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $level = $request->input('level', 'rt');
        if (!in_array($level, ['rt', 'rw', 'dusun', 'desa'], true)) {
            $level = 'rt';
        }
        $tahun = (int) $request->input('tahun', date('Y'));
        $status = (string) $request->input('status', 'all');

        $desaPattern = $this->desaPattern($user->desa);
        $kecamatanNorm = $this->kecamatanNormalized($user->kecamatan);

        // === BASE QUERY — filter level RT (baris input) ===
        $baseQuery = RekapKegiatanWarga::query()
            ->whereRaw('LOWER(kecamatan) = ?', [$kecamatanNorm])
            ->whereRaw('LOWER(desa) LIKE ?', [$desaPattern])
            ->where('tahun', $tahun)
            ->where('level', 'rt');

        // === ROLL-UP QUERY — hanya approved ===
        $rollupQuery = (clone $baseQuery)->where('status', 'approved');

        if ($level === 'rt') {
            $query = clone $baseQuery;

            if (in_array($status, ['pending', 'approved', 'rejected'], true)) {
                $query->where('status', $status);
            }

            if ($request->filled('dusun')) {
                $query->where('dusun', $request->dusun);
            }

            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function (Builder $q) use ($search) {
                    $q->where('nama_dusun', 'ilike', "%{$search}%")
                      ->orWhere('rw', 'ilike', "%{$search}%")
                      ->orWhere('rt', 'ilike', "%{$search}%")
                      ->orWhere('keterangan', 'ilike', "%{$search}%");
                });
            }

            $data = $query->with(['approvedBy:id,name', 'creator:id,name'])
                ->orderBy('dusun')
                ->orderBy('rw')
                ->orderBy('rt')
                ->paginate(15)
                ->withQueryString()
                ->through(function (RekapKegiatanWarga $record) {
                    $arr = $record->toArray();
                    $arr['created_by_name'] = $record->creator?->name;
                    $arr['approved_by_name'] = $record->approvedBy?->name;
                    return $arr;
                });

        } elseif ($level === 'rw') {
            $data = $rollupQuery
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
            $data = $rollupQuery
                ->selectRaw(
                    'kecamatan, desa, nama_kecamatan, nama_desa, dusun, nama_dusun, '
                    . 'COUNT(DISTINCT rw) as jumlah_rw, COUNT(*) as jumlah_rt, ' . $this->sumSelect()
                )
                ->groupBy('kecamatan', 'desa', 'nama_kecamatan', 'nama_desa', 'dusun', 'nama_dusun')
                ->orderBy('dusun')
                ->paginate(15)
                ->withQueryString();

        } else {
            $data = $rollupQuery
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

        // === STATISTIK PER LEVEL ===
        $statsPerLevel = [
            'rt' => (clone $baseQuery)->count(),
            'rw' => (clone $rollupQuery)->distinct('rw')->count('rw'),
            'dusun' => (clone $rollupQuery)->distinct('dusun')->count('dusun'),
            'desa' => (clone $rollupQuery)->distinct('dusun')->count('dusun'),
        ];

        // === STATISTIK TOTAL ===
        $stats = [
            'total_kk' => (int) (clone $rollupQuery)->sum('jumlah_kk'),
            'total_jiwa' => (int) ((clone $rollupQuery)
                ->selectRaw('COALESCE(SUM(total_l + total_p), 0) as total')
                ->value('total') ?? 0),
            'total_dasa_wisma' => (int) (clone $rollupQuery)->sum('jumlah_dasa_wisma'),
            'per_level' => $statsPerLevel,
            'pending' => (clone $baseQuery)->where('status', 'pending')->count(),
            'approved' => (clone $baseQuery)->where('status', 'approved')->count(),
            'rejected' => (clone $baseQuery)->where('status', 'rejected')->count(),
        ];

        return Inertia::render('Backend/Desa/Kegiatan/Index', [
            'data' => $data,
            'stats' => $stats,
            'activeLevel' => $level,
            'filters' => [
                'tahun' => $tahun,
                'dusun' => $request->input('dusun'),
                'search' => $request->input('search'),
                'status' => $status,
            ],
        ]);
    }

    /**
     * Halaman import kegiatan.
     */
    public function import()
    {
        return Inertia::render('Backend/Desa/Kegiatan/Import');
    }

    /**
     * Handle import Excel — SINGLE SHEET (level RT).
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

            if ($replace) {
                RekapKegiatanWarga::query()
                    ->where('kecamatan', $user->kecamatan)
                    ->where('desa', $user->desa)
                    ->where('tahun', $tahun)
                    ->where('level', 'rt')
                    ->delete();
            }

            $import = new RekapKegiatanWargaImport(
                $user->kecamatan,
                $user->desa,
                $tahun,
                'rt'
            );

            Excel::import($import, $request->file('file'));

            $success = $import->getSuccessCount();
            $skip = $import->getSkipCount();
            $importErrors = $import->getErrors();

            if ($success === 0 && empty($importErrors)) {
                DB::rollBack();
                return redirect()->back()->withInput()
                    ->with('error', 'Import tidak menghasilkan data. Pastikan struktur file Excel sesuai template.');
            }

            DB::commit();

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
                    "Import berhasil! {$success} data masuk dengan status PENDING. Silakan tinjau dan setujui."
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
     * Download template Excel.
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
     * Hapus data per dusun — hanya yang belum approved.
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
            ->whereIn('status', ['pending', 'rejected'])
            ->delete();

        return redirect()
            ->route('desa.kegiatan.index', ['tahun' => $tahun, 'level' => 'dusun'])
            ->with('success', "Data dusun {$dusun} berhasil dihapus ({$deleted} record RT).");
    }

    /* ============================================================
     * APPROVAL — Admin Desa
     * ============================================================ */

    /**
     * POST /desa/kegiatan/{id}/approve
     */
    public function approve(Request $request, int $id): RedirectResponse
    {
        $record = DB::transaction(function () use ($request, $id): RekapKegiatanWarga {
            $record = $this->pendingRecord($request, $id, lock: true);

            $record->forceFill([
                'status' => 'approved',
                'approved_by' => $request->user()->id,
                'approved_at' => now(),
                'rejected_reason' => null,
            ])->save();

            return $record;
        });

        $this->notifyOwner($record, 'Data rekap kegiatan warga Anda telah disetujui Admin Desa.');

        return back()->with('success', 'Data rekap kegiatan berhasil disetujui.');
    }

    /**
     * POST /desa/kegiatan/generate-rekap
     * Buat/perbarui baris rekap RT otomatis dari data yang sudah disetujui
     * (KK + detail). Baris yang sudah disetujui tidak dioverwrite.
     */
    public function generateRekap(Request $request, RekapKegiatanGenerator $generator): RedirectResponse
    {
        $user = $request->user();
        $tahun = (int) $request->input('tahun', date('Y'));

        $summary = $generator->generateDesa(
            (string) $user->kecamatan,
            (string) $user->desa,
            $tahun,
            (int) $user->id,
        );

        $total = $summary['created'] + $summary['updated'];

        return back()->with(
            'success',
            "Rekap $tahun dibuat dari data yang sudah disetujui: "
            ."{$summary['created']} baris baru, {$summary['updated']} diperbarui, "
            ."{$summary['skipped_locked']} terkunci (sudah disetujui), "
            ."{$summary['skipped_empty']} kosong. Total $total baris siap approve."
        );
    }

    /**
     * POST /desa/kegiatan/{id}/reject
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

        $this->notifyOwner(
            $record,
            'Data rekap kegiatan warga perlu diperbaiki: ' . $validated['reason'],
        );

        return back()->with('success', 'Data ditolak dan alasan dikirim ke petugas.');
    }

    /**
     * POST /desa/kegiatan/bulk-approve
     */
    public function bulkApprove(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer'],
        ]);

        $user = $request->user();
        $desaPattern = $this->desaPattern($user->desa);
        $kecamatanNorm = $this->kecamatanNormalized($user->kecamatan);

        $count = DB::transaction(function () use ($validated, $user, $desaPattern, $kecamatanNorm): int {
            $records = RekapKegiatanWarga::query()
                ->whereRaw('LOWER(kecamatan) = ?', [$kecamatanNorm])
                ->whereRaw('LOWER(desa) LIKE ?', [$desaPattern])
                ->where('level', 'rt')
                ->whereIn('id', $validated['ids'])
                ->where('status', 'pending')
                ->lockForUpdate()
                ->get();

            foreach ($records as $record) {
                $record->forceFill([
                    'status' => 'approved',
                    'approved_by' => $user->id,
                    'approved_at' => now(),
                    'rejected_reason' => null,
                ])->save();

                $this->notifyOwner($record, 'Data rekap kegiatan warga Anda telah disetujui Admin Desa.');
            }

            return $records->count();
        });

        if ($count === 0) {
            return back()->with('warning', 'Tidak ada data yang bisa disetujui. Pastikan data masih berstatus pending dan berada di wilayah Anda.');
        }

        return back()->with('success', $count . ' data berhasil disetujui.');
    }

    /* ============================================================
     * HELPER
     * ============================================================ */

    private function pendingRecord(Request $request, int $id, bool $lock = false): RekapKegiatanWarga
    {
        $user = $request->user();
        $desaPattern = $this->desaPattern($user->desa);
        $kecamatanNorm = $this->kecamatanNormalized($user->kecamatan);

        $query = RekapKegiatanWarga::query()
            ->whereRaw('LOWER(kecamatan) = ?', [$kecamatanNorm])
            ->whereRaw('LOWER(desa) LIKE ?', [$desaPattern])
            ->where('level', 'rt')
            ->where('status', 'pending')
            ->whereKey($id);

        return ($lock ? $query->lockForUpdate() : $query)->firstOrFail();
    }

    private function notifyOwner(RekapKegiatanWarga $record, string $message): void
    {
        $owner = User::query()->find($record->created_by);
        if ($owner) {
            $owner->notify(new DasawismaRecordNotification(
                $message,
                '/desa/kegiatan',
                $record->id,
            ));
        }
    }
}
