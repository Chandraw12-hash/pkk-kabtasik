<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Galeri;
use Illuminate\Http\Request;

class GaleriController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->input('limit', 12);

        $galeri = Galeri::latest()
            ->paginate($limit)
            ->through(function ($item) {
                return [
                    'id' => $item->id,
                    'judul' => $item->judul,
                    'caption' => $item->caption,
                    'foto_url' => $item->foto_url ?? null,
                    'created_at' => $item->created_at?->toIso8601String(),
                    'created_at_formatted' => $item->created_at?->translatedFormat('d F Y'),
                ];
            });

        return response()->json([
            'success' => true,
            'message' => 'Daftar galeri',
            'data' => $galeri,
        ]);
    }

    public function show($id)
    {
        $galeri = Galeri::find($id);

        if (!$galeri) {
            return response()->json([
                'success' => false,
                'message' => 'Galeri tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail galeri',
            'data' => [
                'id' => $galeri->id,
                'judul' => $galeri->judul,
                'caption' => $galeri->caption,
                'foto_url' => $galeri->foto_url ?? null,
                'created_at' => $galeri->created_at?->toIso8601String(),
                'created_at_formatted' => $galeri->created_at?->translatedFormat('d F Y'),
            ],
        ]);
    }
}
