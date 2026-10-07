<?php

namespace App\Http\Controllers\Backend\Kecamatan;

use App\Http\Controllers\Controller;
use App\Models\RekapBumil;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BumilKecamatanController extends Controller
{
    /**
     * List Rekap Bumil — rekap per desa di kecamatan user
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $kecamatan = $user->kecamatan;
        $tahun = (int) $request->input('tahun', date('Y'));

        // === BASE QUERY — level 'rt', hanya yang sudah disetujui desa ===
        $baseQuery = RekapBumil::query()
            ->where('kecamatan', $kecamatan)
            ->where('tahun', $tahun)
            ->where('level', 'rt')
            ->where('status', 'approved');

        // Filter bulan
        if ($request->filled('bulan')) {
            $baseQuery->where('bulan', $request->bulan);
        }

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
            ->groupBy('desa')
            ->orderBy('desa')
            ->paginate(15)
            ->withQueryString();

        // Statistik total
        $stats = [
            'total_desa' => (clone $baseQuery)->distinct('desa')->count('desa'),
            'total_ibu_hamil' => (int) (clone $baseQuery)->sum('ibu_hamil'),
            'total_ibu_melahirkan' => (int) (clone $baseQuery)->sum('ibu_melahirkan'),
            'total_bayi_lahir' => (int) ((clone $baseQuery)
                ->selectRaw('COALESCE(SUM(bayi_lahir_l + bayi_lahir_p), 0) as total')
                ->value('total') ?? 0),
            'total_ibu_meninggal' => (int) (clone $baseQuery)->sum('ibu_meninggal'),
        ];

        return Inertia::render('Backend/Kecamatan/Bumil/Index', [
            'kecamatan' => $kecamatan,
            'data' => $data,
            'stats' => $stats,
            'filters' => $request->only(['tahun', 'bulan', 'search']),
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

        // === QUERY — level rt, by desa, hanya yang sudah disetujui desa ===
        // (persetujuan kecamatan lewat kolom kecamatan_status per baris)
        $data = RekapBumil::query()
            ->where('kecamatan', $kecamatan)
            ->where('desa', $desa)
            ->where('tahun', $tahun)
            ->where('level', 'rt')
            ->where('status', 'approved')
            ->orderBy('bulan')
            ->orderBy('dusun')
            ->orderBy('rw')
            ->orderBy('rt')
            ->paginate(20)
            ->withQueryString();

        $infoDesa = RekapBumil::query()
            ->where('kecamatan', $kecamatan)
            ->where('desa', $desa)
            ->where('tahun', $tahun)
            ->where('level', 'rt')
            ->first();

        // === BASE QUERY untuk statistik ===
        $baseQuery = RekapBumil::query()
            ->where('kecamatan', $kecamatan)
            ->where('desa', $desa)
            ->where('tahun', $tahun)
            ->where('level', 'rt')
            ->where('status', 'approved');

        $stats = [
            'total_data' => (clone $baseQuery)->count(),
            'total_ibu_hamil' => (int) (clone $baseQuery)->sum('ibu_hamil'),
            'total_ibu_melahirkan' => (int) (clone $baseQuery)->sum('ibu_melahirkan'),
            'total_bayi_lahir' => (int) ((clone $baseQuery)
                ->selectRaw('COALESCE(SUM(bayi_lahir_l + bayi_lahir_p), 0) as total')
                ->value('total') ?? 0),
            'total_ibu_meninggal' => (int) (clone $baseQuery)->sum('ibu_meninggal'),
        ];

        return Inertia::render('Backend/Kecamatan/Bumil/Show', [
            'kecamatan' => $kecamatan,
            'desa' => $desa,
            'nama_desa' => $infoDesa?->nama_desa ?? $desa,
            'data' => $data,
            'stats' => $stats,
            'filters' => $request->only(['tahun']),
            'flash' => ['success' => session('success'), 'error' => session('error')],
        ]);
    }

    /**
     * POST kecamatan/data-pkk/bumil/{id}/approve
     * Menyetujui baris rekap yang sudah disetujui desa.
     */
    public function approve(Request $request, int $id): RedirectResponse
    {
        $user = auth()->user();

        $record = RekapBumil::query()
            ->where('kecamatan', $user->kecamatan)
            ->where('level', 'rt')
            ->where('status', 'approved')
            ->where('kecamatan_status', 'pending')
            ->whereKey($id)
            ->firstOrFail();

        $record->forceFill([
            'kecamatan_status' => 'approved',
            'kecamatan_approved_by' => $user->id,
            'kecamatan_approved_at' => now(),
            'kecamatan_rejected_reason' => null,
        ])->save();

        return back()->with('success', 'Baris rekap bumil disetujui kecamatan.');
    }

    /**
     * POST kecamatan/data-pkk/bumil/{id}/reject
     */
    public function reject(Request $request, int $id): RedirectResponse
    {
        $validated = $request->validate([
            'reason' => ['required', 'string', 'max:2000'],
        ]);

        $user = auth()->user();

        $record = RekapBumil::query()
            ->where('kecamatan', $user->kecamatan)
            ->where('level', 'rt')
            ->where('status', 'approved')
            ->where('kecamatan_status', 'pending')
            ->whereKey($id)
            ->firstOrFail();

        $record->forceFill([
            'kecamatan_status' => 'rejected',
            'kecamatan_approved_by' => null,
            'kecamatan_approved_at' => null,
            'kecamatan_rejected_reason' => $validated['reason'],
        ])->save();

        return back()->with('success', 'Baris rekap bumil ditolak kecamatan.');
    }

    /**
     * GET kecamatan/data-pkk/bumil/approval
     * Antrean persetujuan: baris yang sudah disetujui desa,
     * menunggu keputusan kecamatan.
     */
    public function approval(Request $request)
    {
        $user = auth()->user();
        $kecamatan = $user->kecamatan;
        $tahun = (int) $request->input('tahun', date('Y'));
        $status = (string) $request->input('status', 'all');

        $baseQuery = RekapBumil::query()
            ->where('kecamatan', $kecamatan)
            ->where('tahun', $tahun)
            ->where('level', 'rt')
            ->where('status', 'approved');

        if ($request->filled('bulan')) {
            $baseQuery->where('bulan', (int) $request->input('bulan'));
        }

        if (in_array($status, ['pending', 'approved', 'rejected'], true)) {
            $baseQuery->where('kecamatan_status', $status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $baseQuery->where(function ($q) use ($search) {
                $q->where('nama_desa', 'ilike', "%{$search}%")
                    ->orWhere('desa', 'ilike', "%{$search}%")
                    ->orWhere('nama_dusun', 'ilike', "%{$search}%")
                    ->orWhere('rw', 'ilike', "%{$search}%")
                    ->orWhere('rt', 'ilike', "%{$search}%");
            });
        }

        $stats = [
            'total' => (clone $baseQuery)->count(),
            'pending' => (clone $baseQuery)->where('kecamatan_status', 'pending')->count(),
            'approved' => (clone $baseQuery)->where('kecamatan_status', 'approved')->count(),
            'rejected' => (clone $baseQuery)->where('kecamatan_status', 'rejected')->count(),
        ];

        $data = (clone $baseQuery)
            ->with(['approvedBy:id,name', 'kecamatanApprovedBy:id,name', 'creator:id,name'])
            ->orderBy('desa')
            ->orderBy('bulan')
            ->orderBy('dusun')
            ->paginate(20)
            ->withQueryString()
            ->through(function (RekapBumil $record): array {
                $arr = $record->toArray();
                $arr['created_by_name'] = $record->creator?->name;
                $arr['approved_by_name'] = $record->approvedBy?->name;
                $arr['kecamatan_approved_by_name'] = $record->kecamatanApprovedBy?->name;

                return $arr;
            });

        return Inertia::render('Backend/Kecamatan/Bumil/Approval', [
            'kecamatan' => $kecamatan,
            'data' => $data,
            'stats' => $stats,
            'filters' => [
                'tahun' => $tahun,
                'bulan' => $request->input('bulan', ''),
                'status' => $status,
                'search' => $request->input('search', ''),
            ],
            'flash' => ['success' => session('success'), 'error' => session('error')],
        ]);
    }

    /**
     * POST kecamatan/data-pkk/bumil/bulk-approve
     */
    public function bulkApprove(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer'],
        ]);

        $user = auth()->user();

        $count = RekapBumil::query()
            ->where('kecamatan', $user->kecamatan)
            ->where('level', 'rt')
            ->where('status', 'approved')
            ->where('kecamatan_status', 'pending')
            ->whereIn('id', $validated['ids'])
            ->update([
                'kecamatan_status' => 'approved',
                'kecamatan_approved_by' => $user->id,
                'kecamatan_approved_at' => now(),
                'kecamatan_rejected_reason' => null,
            ]);

        return back()->with('success', "$count baris rekap bumil disetujui kecamatan.");
    }
}
