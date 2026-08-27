<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use Illuminate\Http\Request;

class BeritaController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $limit = $request->input('limit', 10);

        $berita = Berita::where('status_publikasi', true)
            ->when($search, function ($query) use ($search) {
                return $query->where('judul', 'like', "%{$search}%")
                    ->orWhere('konten', 'like', "%{$search}%");
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
                    'foto_url' => $item->foto_url ?? null,
                    'created_at' => $item->created_at?->toIso8601String(),
                    'created_at_formatted' => $item->created_at?->translatedFormat('d F Y'),
                ];
            });

        return response()->json([
            'success' => true,
            'message' => 'Daftar berita',
            'data' => $berita,
        ]);
    }

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

        // Update view count
        $berita->increment('views');

        // Berita terkait
        $related = Berita::where('id', '!=', $berita->id)
            ->where('status_publikasi', true)
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'judul' => $item->judul,
                    'slug' => $item->slug,
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
                'kategori' => $berita->kategori,
                'foto_url' => $berita->foto_url ?? null,
                'views' => $berita->views ?? 0,
                'created_at' => $berita->created_at?->toIso8601String(),
                'created_at_formatted' => $berita->created_at?->translatedFormat('d F Y'),
                'related' => $related,
            ],
        ]);
    }
}
