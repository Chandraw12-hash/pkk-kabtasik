<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\LaporanKegiatan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LaporanKegiatanController extends Controller
{
    public function index(Request $request)
    {
        $search   = $request->input('search');
        $status   = $request->input('status');
        $pokja    = $request->input('pokja');
        $perPage  = (int) $request->input('per_page', 10);

        $laporans = LaporanKegiatan::query()
            ->with(['user:id,name'])
            ->when($search, function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->where('judul', 'like', "%{$search}%")
                        ->orWhere('kecamatan', 'like', "%{$search}%")
                        ->orWhere('desa_kelurahan', 'like', "%{$search}%")
                        ->orWhere('nama_dasawisma', 'like', "%{$search}%");
                });
            })
            ->when($status, fn ($q) => $q->where('status', $status))
            ->when($pokja, fn ($q) => $q->where('kategori_pokja', $pokja))
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        if (
            !$request->header('X-Inertia') &&
            ($request->wantsJson() || $request->ajax())
        ) {
            return response()->json($laporans);
        }

        return Inertia::render('Backend/LaporanKegiatan/Index', [
            'laporans' => $laporans,
            'filters'  => $request->only(['search', 'status', 'pokja', 'per_page']),
        ]);
    }

    public function show(LaporanKegiatan $laporan_kegiatan)
    {
        $laporan_kegiatan->load(['user:id,name', 'reviewer:id,name']);

        return Inertia::render('Backend/LaporanKegiatan/Show', [
            'laporan' => $laporan_kegiatan,
        ]);
    }

    public function markReviewed(Request $request, LaporanKegiatan $laporan_kegiatan)
    {
        $laporan_kegiatan->update([
            'status'      => 'reviewed',
            'reviewed_at' => now(),
            'reviewed_by' => $request->user()->id,
        ]);

        return redirect()
            ->back()
            ->with('success', 'Laporan ditandai sudah direview.');
    }

    public function destroy(LaporanKegiatan $laporan_kegiatan)
    {
        if ($laporan_kegiatan->foto && Storage::disk('public')->exists($laporan_kegiatan->foto)) {
            Storage::disk('public')->delete($laporan_kegiatan->foto);
        }

        $laporan_kegiatan->delete();

        return redirect()
            ->route('be.laporan-kegiatan.index')
            ->with('success', 'Laporan berhasil dihapus.');
    }
}
