<?php

namespace App\Http\Controllers\Backend\Kecamatan;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BeritaKecamatanController extends Controller
{
    /**
     * INDEX — List berita dari kecamatan sendiri (view-only)
     */
    public function index(Request $request)
    {
        // ✅ Ambil kecamatan dari user yang login
        $userKecamatan = auth()->user()->kecamatan;

        if (!$userKecamatan) {
            abort(403, 'Anda tidak memiliki akses ke kecamatan.');
        }

        $search = $request->get('search');
        $kategori = $request->get('kategori');
        $status = $request->get('status');
        $perPage = (int) $request->get('per_page', 10);

        // ✅ DATA ISOLATION: cuma berita dari kecamatan sendiri
        $query = Berita::query()
            ->where('kecamatan', $userKecamatan)
            ->latest();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('judul', 'like', '%' . $search . '%')
                    ->orWhere('konten', 'like', '%' . $search . '%');
            });
        }

        if ($kategori) {
            $query->where('kategori', $kategori);
        }

        if ($status !== null && $status !== '') {
            if (in_array($status, ['approved', 'pending', 'rejected', 'draft'])) {
                $query->where('status', $status);
            }
        }

        $beritas = $query->paginate($perPage)->withQueryString();

        // Statistik ringkas untuk kecamatan
        $stats = [
            'total' => Berita::where('kecamatan', $userKecamatan)->count(),
            'pending' => Berita::where('kecamatan', $userKecamatan)
                ->where('status', 'pending')->count(),
            'approved' => Berita::where('kecamatan', $userKecamatan)
                ->where('status', 'approved')->count(),
            'rejected' => Berita::where('kecamatan', $userKecamatan)
                ->where('status', 'rejected')->count(),
        ];

        return Inertia::render('Backend/Kecamatan/Berita/Index', [
            'beritas' => $beritas,
            'stats' => $stats,
            'kecamatan' => $userKecamatan,
            'filters' => [
                'search' => $search,
                'kategori' => $kategori,
                'status' => $status,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * SHOW — Detail berita (view-only, data isolation)
     */
    public function show($id)
    {
        $userKecamatan = auth()->user()->kecamatan;

        if (!$userKecamatan) {
            abort(403, 'Anda tidak memiliki akses ke kecamatan.');
        }

        // ✅ DATA ISOLATION: cuma berita dari kecamatan sendiri
        $berita = Berita::where('kecamatan', $userKecamatan)
            ->with('user:id,name,username,kecamatan')
            ->findOrFail($id);

        return Inertia::render('Backend/Kecamatan/Berita/Show', [
            'berita' => $berita,
            'kecamatan' => $userKecamatan,
        ]);
    }
}
