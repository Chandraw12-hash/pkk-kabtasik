<?php

namespace App\Http\Controllers\Backend\Kecamatan;

use App\Http\Controllers\Controller;
use App\Models\DataUmumPkk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DataUmumKecamatanController extends Controller
{
    /**
     * List Data Umum PKK — rekap per desa di kecamatan user
     * ✅ FIX: cuma agregat desa (level=desa, dusun IS NULL) — ga double
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $kecamatan = $user->kecamatan;
        $tahun = (int) $request->input('tahun', date('Y'));

        // ══════════════════════════════════════════════════════
        // Query — cuma aggregat desa
        // ══════════════════════════════════════════════════════
        $baseQuery = DataUmumPkk::query()
            ->where('kecamatan', $kecamatan)
            ->where('tahun', $tahun)
            ->where('level', 'desa')
            ->whereNull('dusun');   // ← ✅ FIX — cuma aggregat desa

        // Search desa
        if ($request->filled('search')) {
            $search = $request->search;
            $baseQuery->where(function ($q) use ($search) {
                $q->where('nama_desa', 'ilike', "%{$search}%")
                  ->orWhere('desa', 'ilike', "%{$search}%");
            });
        }

        // Filter status approval kecamatan
        if ($request->filled('status')) {
            $baseQuery->where('kecamatan_status', $request->status);
        }

        // ══════════════════════════════════════════════════════
        // Data — udah per desa (karena udah 1 record per desa)
        // ══════════════════════════════════════════════════════
        $data = $baseQuery
            ->orderBy('desa')
            ->paginate(15)
            ->withQueryString();

        // ══════════════════════════════════════════════════════
        // Statistik
        // ══════════════════════════════════════════════════════
        $statsQuery = DataUmumPkk::query()
            ->where('kecamatan', $kecamatan)
            ->where('tahun', $tahun)
            ->where('level', 'desa')
            ->whereNull('dusun');

        $stats = [
            'total_desa' => (clone $statsQuery)->count(),
            'total_kk' => (int) ((clone $statsQuery)->sum('jumlah_kk') ?? 0),
            'total_jiwa' => (int) ((clone $statsQuery)->sum('jiwa_l') ?? 0)
                + (int) ((clone $statsQuery)->sum('jiwa_p') ?? 0)
                + (int) ((clone $statsQuery)->sum('jiwa_tidak_terpilah') ?? 0),
            'total_dasa_wisma' => (int) ((clone $statsQuery)->sum('jumlah_dasa_wisma') ?? 0),
            'pending' => (clone $statsQuery)->where('kecamatan_status', 'pending')->count(),
            'approved' => (clone $statsQuery)->where('kecamatan_status', 'approved')->count(),
            'rejected' => (clone $statsQuery)->where('kecamatan_status', 'rejected')->count(),
        ];

        return Inertia::render('Backend/Kecamatan/DataUmum/Index', [
            'kecamatan' => $kecamatan,
            'data' => $data,
            'stats' => $stats,
            'filters' => $request->only(['tahun', 'search', 'status']),
        ]);
    }

    /**
     * ✅ HALAMAN APPROVAL — List desa pending
     */
    public function approvalIndex(Request $request)
    {
        $user = auth()->user();
        $kecamatan = $user->kecamatan;
        $tahun = (int) $request->input('tahun', date('Y'));
        $status = $request->input('status', 'pending');

        $query = DataUmumPkk::query()
            ->where('kecamatan', $kecamatan)
            ->where('tahun', $tahun)
            ->where('level', 'desa')
            ->whereNull('dusun');

        if ($status !== 'all') {
            $query->where('kecamatan_status', $status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_desa', 'ilike', "%{$search}%")
                  ->orWhere('desa', 'ilike', "%{$search}%");
            });
        }

        $data = $query->orderBy('desa')
            ->paginate(15)
            ->withQueryString();

        // Stats
        $statsBase = DataUmumPkk::query()
            ->where('kecamatan', $kecamatan)
            ->where('tahun', $tahun)
            ->where('level', 'desa')
            ->whereNull('dusun');

        $stats = [
            'pending' => (clone $statsBase)->where('kecamatan_status', 'pending')->count(),
            'approved' => (clone $statsBase)->where('kecamatan_status', 'approved')->count(),
            'rejected' => (clone $statsBase)->where('kecamatan_status', 'rejected')->count(),
            'total' => (clone $statsBase)->count(),
        ];

        return Inertia::render('Backend/Kecamatan/DataUmum/Approval', [
            'kecamatan' => $kecamatan,
            'data' => $data,
            'stats' => $stats,
            'filters' => $request->only(['tahun', 'status', 'search']),
        ]);
    }

    /**
     * ✅ APPROVE 1 desa
     */
    public function approve(Request $request, int $id)
    {
        $user = auth()->user();

        $data = DataUmumPkk::where('id', $id)
            ->where('kecamatan', $user->kecamatan)
            ->where('level', 'desa')
            ->whereNull('dusun')
            ->firstOrFail();

        $data->update([
            'kecamatan_status' => 'approved',
            'kecamatan_approved_by' => $user->id,
            'kecamatan_approved_at' => now(),
            'kecamatan_rejected_reason' => null,
        ]);

        return redirect()
            ->back()
            ->with('success', "✅ Desa {$data->nama_desa} berhasil disetujui.");
    }

    /**
     * ✅ REJECT 1 desa
     */
    public function reject(Request $request, int $id)
    {
        $request->validate([
            'reason' => ['required', 'string', 'max:1000'],
        ]);

        $user = auth()->user();

        $data = DataUmumPkk::where('id', $id)
            ->where('kecamatan', $user->kecamatan)
            ->where('level', 'desa')
            ->whereNull('dusun')
            ->firstOrFail();

        $data->update([
            'kecamatan_status' => 'rejected',
            'kecamatan_approved_by' => $user->id,
            'kecamatan_approved_at' => now(),
            'kecamatan_rejected_reason' => $request->reason,
        ]);

        return redirect()
            ->back()
            ->with('success', "⚠️ Desa {$data->nama_desa} ditolak.");
    }

    /**
     * ✅ BULK APPROVE — semua desa pending
     */
    public function bulkApprove(Request $request)
    {
        $user = auth()->user();
        $tahun = (int) $request->input('tahun', date('Y'));

        $count = DataUmumPkk::where('kecamatan', $user->kecamatan)
            ->where('tahun', $tahun)
            ->where('level', 'desa')
            ->whereNull('dusun')
            ->where('kecamatan_status', 'pending')
            ->update([
                'kecamatan_status' => 'approved',
                'kecamatan_approved_by' => $user->id,
                'kecamatan_approved_at' => now(),
                'kecamatan_rejected_reason' => null,
            ]);

        return redirect()
            ->back()
            ->with('success', "✅ {$count} desa berhasil disetujui.");
    }

    /**
     * Detail per desa — semua data dusun + aggregat desa
     */
    public function show(Request $request, string $desa)
    {
        $user = auth()->user();
        $kecamatan = $user->kecamatan;
        $tahun = (int) $request->input('tahun', date('Y'));

        // ✅ Ambil aggregat desa (1 record)
        $aggregatDesa = DataUmumPkk::where('kecamatan', $kecamatan)
            ->where('desa', $desa)
            ->where('tahun', $tahun)
            ->where('level', 'desa')
            ->whereNull('dusun')
            ->first();

        // ✅ Ambil per dusun
        $dataDusun = DataUmumPkk::where('kecamatan', $kecamatan)
            ->where('desa', $desa)
            ->where('tahun', $tahun)
            ->where('level', 'desa')
            ->whereNotNull('dusun')
            ->orderBy('dusun')
            ->get();

        // Info desa
        $infoDesa = $aggregatDesa ?? $dataDusun->first();

        return Inertia::render('Backend/Kecamatan/DataUmum/Show', [
            'kecamatan' => $kecamatan,
            'desa' => $desa,
            'nama_desa' => $infoDesa?->nama_desa ?? $desa,
            'aggregatDesa' => $aggregatDesa,
            'dataDusun' => $dataDusun,
            'filters' => $request->only(['tahun']),
        ]);
    }
}
