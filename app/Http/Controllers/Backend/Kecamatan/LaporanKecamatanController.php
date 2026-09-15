<?php

namespace App\Http\Controllers\Backend\Kecamatan;

use App\Http\Controllers\Controller;
use App\Models\LaporanKegiatan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LaporanKecamatanController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $kecamatan = $user->kecamatan;

        // ============================================================
        // QUERY (auto-filter by Global Scope)
        // ============================================================
        $query = LaporanKegiatan::with(['user:id,name']);

        // Filter by Pokja
        if ($request->filled('pokja')) {
            $query->where('kategori_pokja', $request->pokja);
        }

        // Filter by Status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by Desa
        if ($request->filled('desa')) {
            $query->whereRaw('UPPER(TRIM(desa_kelurahan)) = ?', [
                strtoupper(trim($request->desa))
            ]);
        }

        // Search
        if ($request->filled('search')) {
            $keyword = $request->search;
            $query->where(function ($q) use ($keyword) {
                $q->where('judul', 'ILIKE', "%{$keyword}%")
                    ->orWhere('nama_dasawisma', 'ILIKE', "%{$keyword}%")
                    ->orWhere('desa_kelurahan', 'ILIKE', "%{$keyword}%");
            });
        }

        $laporan = $query->latest()->paginate(15)->withQueryString();

        // Daftar desa unik untuk filter
        $daftarDesa = LaporanKegiatan::whereNotNull('desa_kelurahan')
            ->where('desa_kelurahan', '!=', '')
            ->distinct()
            ->orderBy('desa_kelurahan')
            ->pluck('desa_kelurahan');

        return Inertia::render('Backend/Kecamatan/Laporan/Index', [
            'kecamatan'  => $kecamatan,
            'laporan'    => $laporan,
            'daftarDesa' => $daftarDesa,
            'filters'    => $request->only(['pokja', 'status', 'desa', 'search']),
        ]);
    }

    public function show(Request $request, $id)
    {
        $user = $request->user();

        // Ambil laporan (auto-filter by scope)
        $laporan = LaporanKegiatan::with(['user:id,name', 'reviewer:id,name'])
            ->findOrFail($id);

        // Cek policy
        if (!$user->can('view', $laporan)) {
            abort(403, 'Anda tidak boleh mengakses laporan ini.');
        }

        return Inertia::render('Backend/Kecamatan/Laporan/Show', [
            'kecamatan' => $user->kecamatan,
            'laporan'   => $laporan,
        ]);
    }
}
