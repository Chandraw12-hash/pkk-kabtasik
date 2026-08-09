<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BeritaController extends Controller
{
    // ============================================
    // BACKEND METHODS (Yang sudah ada)
    // ============================================

    public function index(Request $request)
    {
        $search = $request->get('search');
        $perPage = (int) $request->get('per_page', 10);

        $query = Berita::query()->latest();

        if ($search) {
            $query->where('judul', 'like', '%' . $search . '%');
        }

        $beritas = $query->paginate($perPage)->withQueryString();

        if ($request->wantsJson()) {
            return response()->json($beritas);
        }

        return Inertia::render('Backend/Berita/Index', [
            'beritas' => $beritas,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Backend/Berita/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'konten' => 'required|string',
            'kategori' => 'required|string',
            'status_publikasi' => 'boolean',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('berita-photos', 'public');
        }

        Berita::create([
            'judul' => $request->judul,
            'slug' => Str::slug($request->judul) . '-' . time(),
            'konten' => $request->konten,
            'kategori' => $request->kategori,
            'status_publikasi' => $request->status_publikasi ?? true,
            'foto' => $fotoPath,
        ]);

        return redirect()
            ->route('be.berita.index')
            ->with('success', 'Berita berhasil ditambahkan.');
    }

    public function edit(Berita $berita)
    {
        return Inertia::render('Backend/Berita/Edit', [
            'berita' => $berita,
        ]);
    }

    public function update(Request $request, Berita $berita)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'konten' => 'required|string',
            'kategori' => 'required|string',
            'status_publikasi' => 'boolean',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $fotoPath = $berita->foto;

        if ($request->hasFile('foto')) {
            if ($fotoPath && Storage::disk('public')->exists($fotoPath)) {
                Storage::disk('public')->delete($fotoPath);
            }
            $fotoPath = $request->file('foto')->store('berita-photos', 'public');
        }

        $berita->update([
            'judul' => $request->judul,
            'slug' => Str::slug($request->judul) . '-' . $berita->id,
            'konten' => $request->konten,
            'kategori' => $request->kategori,
            'status_publikasi' => $request->status_publikasi ?? true,
            'foto' => $fotoPath,
        ]);

        return redirect()
            ->route('be.berita.index')
            ->with('success', 'Berita berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $berita = Berita::findOrFail($id);

        if ($berita->foto && Storage::disk('public')->exists($berita->foto)) {
            Storage::disk('public')->delete($berita->foto);
        }

        $berita->delete();

        return redirect()
            ->route('be.berita.index')
            ->with('success', 'Berita berhasil dihapus.');
    }

    // ============================================
    // PUBLIC METHODS (TAMBAHKAN INI)
    // ============================================

    /**
     * Menampilkan semua berita untuk public (frontend)
     * Route: /berita
     */
    public function indexPublic(Request $request)
    {
        $search = $request->get('search');
        $perPage = (int) $request->get('per_page', 9);

        $query = Berita::where('status_publikasi', true)->latest();

        if ($search) {
            $query->where('judul', 'like', '%' . $search . '%');
        }

        $beritas = $query->paginate($perPage);

        if ($request->wantsJson()) {
            return response()->json($beritas);
        }

        return Inertia::render('Public/Berita', [
            'beritas' => $beritas,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Menampilkan detail berita untuk public (frontend)
     * Route: /berita/{slug}
     */
    public function showPublic($slug)
    {
        $berita = Berita::where('slug', $slug)
            ->where('status_publikasi', true)
            ->firstOrFail();

        return Inertia::render('Public/BeritaDetail', [
            'berita' => $berita,
        ]);
    }

    /**
     * Mengambil 3 berita terbaru untuk landing page
     * Digunakan di Welcome/IndexController
     */
    public function getLatestBerita()
    {
        $berita = Berita::where('status_publikasi', true)
            ->latest()
            ->take(3)
            ->get();

        return $berita;
    }

    /**
     * API endpoint untuk mengambil berita terbaru (JSON)
     * Route: /api/berita/latest
     */
    public function apiLatestBerita()
    {
        $berita = Berita::where('status_publikasi', true)
            ->latest()
            ->take(3)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $berita
        ]);
    }
}
