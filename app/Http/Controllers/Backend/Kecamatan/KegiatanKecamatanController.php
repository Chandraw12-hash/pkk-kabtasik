<?php

namespace App\Http\Controllers\Backend\Kecamatan;

use App\Http\Controllers\Controller;
use App\Models\RekapKegiatanWarga;
use App\Models\User;
use App\Notifications\DasawismaRecordNotification;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Throwable;

class KegiatanKecamatanController extends Controller
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
     * Normalisasi kecamatan (case-insensitive).
     */
    private function kecamatanNormalized(string $kecamatan): string
    {
        return strtolower(trim($kecamatan));
    }

    /**
     * List Rekap Kegiatan — rekap per desa di kecamatan user.
     * Default HANYA tampil data yang sudah approved desa.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $kecamatan = $user->kecamatan;
        $tahun = (int) $request->input('tahun', date('Y'));
        $kecNorm = $this->kecamatanNormalized($kecamatan);

        // === BASE QUERY — hanya data yang sudah APPROVED DESA ===
        $baseQuery = RekapKegiatanWarga::query()
            ->whereRaw('LOWER(kecamatan) = ?', [$kecNorm])
            ->where('tahun', $tahun)
            ->where('level', 'rt')
            ->where('status', 'approved');   // ✅ hanya approved desa

        // Search desa
        if ($request->filled('search')) {
            $search = $request->search;
            $baseQuery->where(function (Builder $q) use ($search) {
                $q->where('nama_desa', 'ilike', "%{$search}%")
                  ->orWhere('desa', 'ilike', "%{$search}%");
            });
        }

        // === Rekap per desa ===
        $data = (clone $baseQuery)
            ->selectRaw(
                'desa, MAX(nama_desa) as nama_desa, '
                . 'COUNT(DISTINCT dusun) as jumlah_dusun, '
                . 'COUNT(DISTINCT rw) as jumlah_rw, '
                . $this->sumSelect()
            )
            ->groupBy('desa')
            ->orderBy('desa')
            ->paginate(15)
            ->withQueryString();

        // === STATISTIK ===
        $stats = [
            'total_desa' => (clone $baseQuery)->distinct()->count('desa'),
            'total_kk' => (int) (clone $baseQuery)->sum('jumlah_kk'),
            'total_jiwa' => (int) ((clone $baseQuery)
                ->selectRaw('COALESCE(SUM(total_l + total_p), 0) as total')
                ->value('total') ?? 0),
            'total_dasa_wisma' => (int) (clone $baseQuery)->sum('jumlah_dasa_wisma'),
            'kecamatan_pending' => (clone $baseQuery)->where('kecamatan_status', 'pending')->count(),
            'kecamatan_approved' => (clone $baseQuery)->where('kecamatan_status', 'approved')->count(),
            'kecamatan_rejected' => (clone $baseQuery)->where('kecamatan_status', 'rejected')->count(),
        ];

        return Inertia::render('Backend/Kecamatan/Kegiatan/Index', [
            'kecamatan' => $kecamatan,
            'data' => $data,
            'stats' => $stats,
            'filters' => $request->only(['tahun', 'search']),
        ]);
    }

    /**
     * Halaman approval — list data approved desa, nunggu approve kecamatan.
     */
    public function approval(Request $request)
    {
        $user = auth()->user();
        $kecamatan = $user->kecamatan;
        $tahun = (int) $request->input('tahun', date('Y'));
        $status = (string) $request->input('status', 'pending');
        $kecNorm = $this->kecamatanNormalized($kecamatan);

        // === BASE QUERY — approved desa ===
        $baseQuery = RekapKegiatanWarga::query()
            ->whereRaw('LOWER(kecamatan) = ?', [$kecNorm])
            ->where('tahun', $tahun)
            ->where('level', 'rt')
            ->where('status', 'approved');   // ✅ hanya approved desa

        // Filter status kecamatan
        if (in_array($status, ['pending', 'approved', 'rejected'], true)) {
            $baseQuery->where('kecamatan_status', $status);
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $baseQuery->where(function (Builder $q) use ($search) {
                $q->where('nama_desa', 'ilike', "%{$search}%")
                  ->orWhere('desa', 'ilike', "%{$search}%")
                  ->orWhere('nama_dusun', 'ilike', "%{$search}%")
                  ->orWhere('rw', 'ilike', "%{$search}%")
                  ->orWhere('rt', 'ilike', "%{$search}%");
            });
        }

        // === STATISTIK ===
        $statsBase = RekapKegiatanWarga::query()
            ->whereRaw('LOWER(kecamatan) = ?', [$kecNorm])
            ->where('tahun', $tahun)
            ->where('level', 'rt')
            ->where('status', 'approved');

        $stats = [
            'total' => (clone $statsBase)->count(),
            'pending' => (clone $statsBase)->where('kecamatan_status', 'pending')->count(),
            'approved' => (clone $statsBase)->where('kecamatan_status', 'approved')->count(),
            'rejected' => (clone $statsBase)->where('kecamatan_status', 'rejected')->count(),
        ];

        // === DATA ===
        $data = $baseQuery
            ->with(['approvedBy:id,name', 'kecamatanApprovedBy:id,name', 'creator:id,name'])
            ->orderBy('desa')
            ->orderBy('dusun')
            ->orderByRaw("CAST(NULLIF(regexp_replace(rw, '\\D', '', 'g'), '') AS INTEGER)")
            ->orderByRaw("CAST(NULLIF(regexp_replace(rt, '\\D', '', 'g'), '') AS INTEGER)")
            ->paginate(20)
            ->withQueryString()
            ->through(function (RekapKegiatanWarga $record): array {
                $arr = $record->toArray();
                $arr['created_by_name'] = $record->creator?->name;
                $arr['approved_by_name'] = $record->approvedBy?->name;
                $arr['kecamatan_approved_by_name'] = $record->kecamatanApprovedBy?->name;
                return $arr;
            });

        return Inertia::render('Backend/Kecamatan/Kegiatan/Approval', [
            'kecamatan' => $kecamatan,
            'data' => $data,
            'stats' => $stats,
            'filters' => [
                'tahun' => $tahun,
                'status' => $status,
                'search' => $request->input('search'),
            ],
        ]);
    }

    /**
     * Detail per desa — 1 baris = 1 RT.
     */
    public function show(Request $request, string $desa)
    {
        $user = auth()->user();
        $kecamatan = $user->kecamatan;
        $tahun = (int) $request->input('tahun', date('Y'));
        $kecNorm = $this->kecamatanNormalized($kecamatan);

        // === BASE QUERY — level rt, by desa, approved desa ===
        $baseQuery = RekapKegiatanWarga::query()
            ->whereRaw('LOWER(kecamatan) = ?', [$kecNorm])
            ->where('desa', $desa)
            ->where('tahun', $tahun)
            ->where('level', 'rt')
            ->where('status', 'approved');   // ✅ hanya approved desa

        $data = (clone $baseQuery)
            ->orderBy('dusun')
            ->orderByRaw("CAST(NULLIF(regexp_replace(rw, '\\D', '', 'g'), '') AS INTEGER)")
            ->orderByRaw("CAST(NULLIF(regexp_replace(rt, '\\D', '', 'g'), '') AS INTEGER)")
            ->paginate(20)
            ->withQueryString();

        $infoDesa = (clone $baseQuery)->first();

        // Statistik desa
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

    /* ============================================================
     * APPROVAL KECAMATAN
     * ============================================================ */

    /**
     * POST /kecamatan/data-pkk/kegiatan/{id}/approve
     * Approve 1 record — set kecamatan_status = 'approved'.
     */
    public function approve(Request $request, int $id): RedirectResponse
    {
        $record = DB::transaction(function () use ($request, $id): RekapKegiatanWarga {
            $record = $this->pendingKecamatanRecord($request, $id, lock: true);

            $record->forceFill([
                'kecamatan_status' => 'approved',
                'kecamatan_approved_by' => $request->user()->id,
                'kecamatan_approved_at' => now(),
                'kecamatan_rejected_reason' => null,
            ])->save();

            return $record;
        });

        $this->notifyOwner($record, 'Data rekap kegiatan warga Anda telah disetujui Kecamatan.');

        return back()->with('success', 'Data rekap kegiatan berhasil disetujui.');
    }

    /**
     * POST /kecamatan/data-pkk/kegiatan/{id}/reject
     */
    public function reject(Request $request, int $id): RedirectResponse
    {
        $validated = $request->validate([
            'reason' => ['required', 'string', 'max:2000'],
        ]);

        $record = $this->pendingKecamatanRecord($request, $id);

        $record->forceFill([
            'kecamatan_status' => 'rejected',
            'kecamatan_approved_by' => null,
            'kecamatan_approved_at' => null,
            'kecamatan_rejected_reason' => $validated['reason'],
        ])->save();

        $this->notifyOwner(
            $record,
            'Data rekap kegiatan warga perlu diperbaiki oleh Kecamatan: ' . $validated['reason'],
        );

        return back()->with('success', 'Data ditolak dan alasan dikirim ke desa.');
    }

    /**
     * POST /kecamatan/data-pkk/kegiatan/bulk-approve
     */
    public function bulkApprove(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer'],
        ]);

        $user = $request->user();
        $kecNorm = $this->kecamatanNormalized($user->kecamatan);

        $count = DB::transaction(function () use ($validated, $user, $kecNorm): int {
            $records = RekapKegiatanWarga::query()
                ->whereRaw('LOWER(kecamatan) = ?', [$kecNorm])
                ->where('level', 'rt')
                ->where('status', 'approved')
                ->where('kecamatan_status', 'pending')
                ->whereIn('id', $validated['ids'])
                ->lockForUpdate()
                ->get();

            foreach ($records as $record) {
                $record->forceFill([
                    'kecamatan_status' => 'approved',
                    'kecamatan_approved_by' => $user->id,
                    'kecamatan_approved_at' => now(),
                    'kecamatan_rejected_reason' => null,
                ])->save();

                $this->notifyOwner($record, 'Data rekap kegiatan warga Anda telah disetujui Kecamatan.');
            }

            return $records->count();
        });

        if ($count === 0) {
            return back()->with('warning', 'Tidak ada data yang bisa disetujui. Pastikan data masih berstatus pending di kecamatan Anda.');
        }

        return back()->with('success', $count . ' data berhasil disetujui.');
    }

    /* ============================================================
     * HELPER
     * ============================================================ */

    private function pendingKecamatanRecord(
        Request $request,
        int $id,
        bool $lock = false
    ): RekapKegiatanWarga {
        $user = $request->user();
        $kecNorm = $this->kecamatanNormalized($user->kecamatan);

        $query = RekapKegiatanWarga::query()
            ->whereRaw('LOWER(kecamatan) = ?', [$kecNorm])
            ->where('level', 'rt')
            ->where('status', 'approved')           // harus approved desa dulu
            ->where('kecamatan_status', 'pending')  // dan pending kecamatan
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
