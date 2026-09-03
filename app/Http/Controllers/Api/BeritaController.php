<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BeritaController extends Controller
{
    /**
     * Get list of berita with filters
     * GET /api/berita
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $kategori = $request->input('kategori');
        $kecamatan = $request->input('kecamatan');
        $limit = $request->input('limit', 10);

        $berita = Berita::where('status_publikasi', true)
            ->when($search, function ($query) use ($search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('judul', 'like', "%{$search}%")
                        ->orWhere('konten', 'like', "%{$search}%");
                });
            })
            ->when($kategori, function ($query) use ($kategori) {
                return $query->where('kategori', $kategori);
            })
            ->when($kecamatan, function ($query) use ($kecamatan) {
                return $query->where('kecamatan', $kecamatan);
            })
            ->latest()
            ->paginate($limit)
            ->through(function ($item) {
                return [
                    'id' => $item->id,
                    'judul' => $item->judul,
                    'slug' => $item->slug,
                    'konten' => $item->konten,
                    'deskripsi_singkat' => $item->deskripsi_singkat ?? substr(strip_tags($item->konten), 0, 150),
                    'kategori' => $item->kategori,
                    'kecamatan' => $item->kecamatan,
                    'foto_url' => $item->foto_url ?? null,
                    'created_at' => $item->created_at?->toIso8601String(),
                    'created_at_formatted' => $item->created_at?->translatedFormat('d F Y'),
                ];
            });

        // Get list of unique kecamatan for filter
        $kecamatanList = Berita::where('status_publikasi', true)
            ->select('kecamatan')
            ->distinct()
            ->whereNotNull('kecamatan')
            ->pluck('kecamatan');

        return response()->json([
            'success' => true,
            'message' => 'Daftar berita',
            'data' => $berita,
            'filters' => [
                'kecamatan' => $kecamatanList,
                'kategori' => ['Artikel', 'Pemberitaan Desa', 'Pengumuman'],
            ],
        ]);
    }

    /**
     * Get detail berita by slug
     * GET /api/berita/{slug}
     */
    public function show($slug)
    {
        $berita = Berita::where('slug', $slug)
            ->where('status_publikasi', true)
            ->first();

        if (!$berita) {
            return response()->json([
                'success' => false,
                'message' => 'Berita tidak ditemukan',
            ], 404);
        }

        // Update view count (if views column exists)
        if (method_exists($berita, 'increment')) {
            $berita->increment('views');
        }

        // Berita terkait (same kecamatan)
        $related = Berita::where('id', '!=', $berita->id)
            ->where('status_publikasi', true)
            ->when($berita->kecamatan, function ($query) use ($berita) {
                return $query->where('kecamatan', $berita->kecamatan);
            })
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'judul' => $item->judul,
                    'slug' => $item->slug,
                    'kategori' => $item->kategori,
                    'kecamatan' => $item->kecamatan,
                    'foto_url' => $item->foto_url ?? null,
                    'created_at_formatted' => $item->created_at?->translatedFormat('d F Y'),
                ];
            });

        return response()->json([
            'success' => true,
            'message' => 'Detail berita',
            'data' => [
                'id' => $berita->id,
                'judul' => $berita->judul,
                'slug' => $berita->slug,
                'konten' => $berita->konten,
                'deskripsi' => strip_tags($berita->konten),
                'kategori' => $berita->kategori,
                'kecamatan' => $berita->kecamatan,
                'foto_url' => $berita->foto_url ?? null,
                'views' => $berita->views ?? 0,
                'created_at' => $berita->created_at?->toIso8601String(),
                'created_at_formatted' => $berita->created_at?->translatedFormat('d F Y'),
                'related' => $related,
            ],
        ]);
    }

    /**
     * Get list of kecamatan for filter
     * GET /api/berita/kecamatan
     */
    public function getKecamatan()
    {
        $kecamatanList = Berita::where('status_publikasi', true)
            ->select('kecamatan')
            ->distinct()
            ->whereNotNull('kecamatan')
            ->pluck('kecamatan');

        return response()->json([
            'success' => true,
            'data' => $kecamatanList,
        ]);
    }

    /**
     * Get latest berita for landing page
     * GET /api/berita/latest
     */
    public function latest(Request $request)
    {
        $limit = $request->input('limit', 6);

        $berita = Berita::where('status_publikasi', true)
            ->latest()
            ->limit($limit)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'judul' => $item->judul,
                    'slug' => $item->slug,
                    'kategori' => $item->kategori,
                    'kecamatan' => $item->kecamatan,
                    'foto_url' => $item->foto_url ?? null,
                    'deskripsi_singkat' => $item->deskripsi_singkat ?? substr(strip_tags($item->konten), 0, 150),
                    'created_at_formatted' => $item->created_at?->translatedFormat('d F Y'),
                ];
            });

        return response()->json([
            'success' => true,
            'message' => 'Berita terbaru',
            'data' => $berita,
        ]);
    }

    /**
     * Get berita by kategori
     * GET /api/berita/kategori/{kategori}
     */
    public function byKategori(Request $request, $kategori)
    {
        $limit = $request->input('limit', 10);

        $berita = Berita::where('status_publikasi', true)
            ->where('kategori', $kategori)
            ->latest()
            ->paginate($limit)
            ->through(function ($item) {
                return [
                    'id' => $item->id,
                    'judul' => $item->judul,
                    'slug' => $item->slug,
                    'konten' => $item->konten,
                    'deskripsi_singkat' => $item->deskripsi_singkat ?? substr(strip_tags($item->konten), 0, 150),
                    'kategori' => $item->kategori,
                    'kecamatan' => $item->kecamatan,
                    'foto_url' => $item->foto_url ?? null,
                    'created_at_formatted' => $item->created_at?->translatedFormat('d F Y'),
                ];
            });

        return response()->json([
            'success' => true,
            'message' => 'Berita kategori ' . $kategori,
            'data' => $berita,
        ]);
    }

    /**
     * Get berita by kecamatan
     * GET /api/berita/kecamatan/{kecamatan}
     */
    public function byKecamatan(Request $request, $kecamatan)
    {
        $limit = $request->input('limit', 10);

        $berita = Berita::where('status_publikasi', true)
            ->where('kecamatan', $kecamatan)
            ->latest()
            ->paginate($limit)
            ->through(function ($item) {
                return [
                    'id' => $item->id,
                    'judul' => $item->judul,
                    'slug' => $item->slug,
                    'konten' => $item->konten,
                    'deskripsi_singkat' => $item->deskripsi_singkat ?? substr(strip_tags($item->konten), 0, 150),
                    'kategori' => $item->kategori,
                    'kecamatan' => $item->kecamatan,
                    'foto_url' => $item->foto_url ?? null,
                    'created_at_formatted' => $item->created_at?->translatedFormat('d F Y'),
                ];
            });

        return response()->json([
            'success' => true,
            'message' => 'Berita kecamatan ' . $kecamatan,
            'data' => $berita,
        ]);
    }

    // ================================================================
    // 🔥🔥🔥 KECAMATAN TERAKTIF - TANPA DUMMY
    // ================================================================

    /**
     * Get top 5 kecamatan with most berita
     * GET /api/berita/kecamatan-teraktif
     */
    public function kecamatanTeraktif(Request $request)
    {
        $range = $request->input('range', 'all');

        $query = Berita::where('status_publikasi', true)
            ->whereNotNull('kecamatan')
            ->where('kecamatan', '!=', '');

        // Filter berdasarkan range
        if ($range === 'month') {
            $query->whereMonth('created_at', now()->month)
                  ->whereYear('created_at', now()->year);
        } elseif ($range === 'week') {
            $query->whereBetween('created_at', [now()->subDays(7), now()]);
        } elseif ($range === 'year') {
            $query->whereYear('created_at', now()->year);
        }

        // Group by kecamatan dan hitung
        $data = $query->select('kecamatan', DB::raw('count(*) as total'))
            ->groupBy('kecamatan')
            ->orderBy('total', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'kecamatan' => $item->kecamatan,
                    'total' => (int) $item->total,
                ];
            });

        // 🔥🔥🔥 HAPUS DATA DUMMY! TAPI PASTIKAN DATA TETAP ARRAY
        // Kalau data kosong, tetap kirim array kosong
        if ($data->isEmpty()) {
            $data = collect(); // array kosong
        }

        return response()->json([
            'success' => true,
            'message' => 'Top 5 kecamatan teraktif',
            'data' => $data,
            'periode' => [
                'bulan' => (int) now()->month,
                'tahun' => (int) now()->year,
                'nama_bulan' => now()->translatedFormat('F'),
                'range' => $range,
            ],
        ]);
    }
}
