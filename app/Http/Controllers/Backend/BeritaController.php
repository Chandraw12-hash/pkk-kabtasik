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
    /**
     * 39 KECAMATAN KABUPATEN TASIKMALAYA (RESMI, sesuai Permendagri No. 137 Tahun 2017)
     * Diurutkan alfabet A-Z
     */
    private const KECAMATAN_LIST = [
        'Bantarkalong',
        'Bojongasih',
        'Bojonggambir',
        'Ciawi',
        'Cibalong',
        'Cigalontang',
        'Cikalong',
        'Cikatomas',
        'Cineam',
        'Cipatujah',
        'Cisayong',
        'Culamega',
        'Gunungtanjung',
        'Jamanis',
        'Jatiwaras',
        'Kadipaten',
        'Karangjaya',
        'Karangnunggal',
        'Leuwisari',
        'Mangunreja',
        'Manonjaya',
        'Padakembang',
        'Pagerageung',
        'Pancatengah',
        'Parungponteng',
        'Puspahiang',
        'Rajapolah',
        'Salawu',
        'Salopa',
        'Sariwangi',
        'Singaparna',
        'Sodonghilir',
        'Sukahening',
        'Sukaraja',
        'Sukarame',
        'Sukaratu',
        'Sukaresik',
        'Tanjungjaya',
        'Taraju',
    ];

    // ============================================
    // BACKEND METHODS
    // ============================================

    public function index(Request $request)
    {
        $search = $request->get('search');
        $kategori = $request->get('kategori');
        $kecamatan = $request->get('kecamatan');
        $status = $request->get('status');
        $perPage = (int) $request->get('per_page', 10);

        $query = Berita::query()->latest();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('judul', 'like', '%' . $search . '%')
                    ->orWhere('konten', 'like', '%' . $search . '%');
            });
        }

        if ($kategori) {
            $query->where('kategori', $kategori);
        }

        if ($kecamatan) {
            $query->where('kecamatan', $kecamatan);
        }

        if ($status !== null && $status !== '') {
            $query->where('status_publikasi', $status === 'true');
        }

        $beritas = $query->paginate($perPage)->withQueryString();

        // Daftar kecamatan unik untuk filter
        $kecamatanList = Berita::select('kecamatan')
            ->distinct()
            ->whereNotNull('kecamatan')
            ->pluck('kecamatan');

        if ($request->wantsJson()) {
            return response()->json($beritas);
        }

        return Inertia::render('Backend/Berita/Index', [
            'beritas' => $beritas,
            'kecamatanList' => $kecamatanList,
            'filters' => [
                'search' => $search,
                'kategori' => $kategori,
                'kecamatan' => $kecamatan,
                'status' => $status,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Backend/Berita/Create', [
            'kecamatanList' => self::KECAMATAN_LIST,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'konten' => 'required|string',
            'kategori' => 'required|string|in:Artikel,Pemberitaan Desa,Pengumuman',
            'kecamatan' => 'nullable|string|max:255',
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
            'kecamatan' => $request->kecamatan,
            'status_publikasi' => $request->status_publikasi ?? true,
            'foto' => $fotoPath,
            // 'user_id' => auth()->id(), // COMMENT KARENA KOLOMNYA TIDAK ADA
        ]);

        return redirect()
            ->route('be.berita.index')
            ->with('success', 'Berita berhasil ditambahkan.');
    }

    public function edit(Berita $berita)
    {
        return Inertia::render('Backend/Berita/Edit', [
            'berita' => $berita,
            'kecamatanList' => self::KECAMATAN_LIST,
        ]);
    }

    public function update(Request $request, Berita $berita)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'konten' => 'required|string',
            'kategori' => 'required|string|in:Artikel,Pemberitaan Desa,Pengumuman',
            'kecamatan' => 'nullable|string|max:255',
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
            'kecamatan' => $request->kecamatan,
            'status_publikasi' => $request->status_publikasi ?? true,
            'foto' => $fotoPath,
            // 'user_id' => auth()->id(), // COMMENT KARENA KOLOMNYA TIDAK ADA
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

    public function toggleStatus(Berita $berita)
    {
        $berita->update([
            'status_publikasi' => !$berita->status_publikasi,
        ]);

        return redirect()
            ->back()
            ->with('success', 'Status berita berhasil diubah.');
    }

    // ============================================
    // PUBLIC METHODS (FRONTEND)
    // ============================================

    /**
     * Menampilkan semua berita untuk public (frontend)
     * Route: /berita
     */
    public function indexPublic(Request $request)
    {
        $search = $request->get('search');
        $kategori = $request->get('kategori');
        $kecamatan = $request->get('kecamatan');
        $perPage = (int) $request->get('per_page', 9);

        $query = Berita::where('status_publikasi', true)->latest();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('judul', 'like', '%' . $search . '%')
                    ->orWhere('konten', 'like', '%' . $search . '%');
            });
        }

        if ($kategori) {
            $query->where('kategori', $kategori);
        }

        if ($kecamatan) {
            $query->where('kecamatan', $kecamatan);
        }

        $beritas = $query->paginate($perPage);

        // Daftar kecamatan untuk filter
        $kecamatanList = Berita::where('status_publikasi', true)
            ->select('kecamatan')
            ->distinct()
            ->whereNotNull('kecamatan')
            ->pluck('kecamatan');

        if ($request->wantsJson()) {
            return response()->json([
                'berita' => $beritas->items(),
                'pagination' => [
                    'current_page' => $beritas->currentPage(),
                    'last_page' => $beritas->lastPage(),
                    'per_page' => $beritas->perPage(),
                    'total' => $beritas->total(),
                ],
                'filters' => [
                    'kecamatan' => $kecamatanList,
                ],
            ]);
        }

        return Inertia::render('Frontend/Berita/Index', [
            'berita' => $beritas->items(),
            'pagination' => [
                'current_page' => $beritas->currentPage(),
                'last_page' => $beritas->lastPage(),
                'per_page' => $beritas->perPage(),
                'total' => $beritas->total(),
            ],
            'filters' => [
                'search' => $search,
                'kategori' => $kategori,
                'kecamatan' => $kecamatan,
                'per_page' => $perPage,
            ],
            'kecamatanList' => $kecamatanList,
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

        // Berita terkait di kecamatan yang sama
        $beritaLainnya = Berita::where('id', '!=', $berita->id)
            ->where('status_publikasi', true)
            ->where('kecamatan', $berita->kecamatan)
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Frontend/Berita/Show', [
            'berita' => $berita,
            'beritaLainnya' => $beritaLainnya,
        ]);
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
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'judul' => $item->judul,
                    'slug' => $item->slug,
                    'kategori' => $item->kategori,
                    'kecamatan' => $item->kecamatan,
                    'foto_url' => $item->foto_url,
                    'deskripsi_singkat' => $item->deskripsi_singkat,
                    'created_at_formatted' => $item->tanggal_formatted,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $berita,
        ]);
    }

    /**
     * API endpoint untuk mengambil semua berita dengan filter (JSON)
     * Route: /api/berita
     */
    public function apiIndex(Request $request)
    {
        $search = $request->input('search');
        $kategori = $request->input('kategori');
        $kecamatan = $request->input('kecamatan');
        $limit = $request->input('limit', 10);

        $berita = Berita::where('status_publikasi', true)
            ->when($search, function ($query) use ($search) {
                return $query->where('judul', 'like', "%{$search}%")
                    ->orWhere('konten', 'like', "%{$search}%");
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
                    'deskripsi_singkat' => $item->deskripsi_singkat,
                    'kategori' => $item->kategori,
                    'kecamatan' => $item->kecamatan,
                    'foto_url' => $item->foto_url,
                    'created_at' => $item->created_at?->toIso8601String(),
                    'created_at_formatted' => $item->tanggal_formatted,
                ];
            });

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
            ],
        ]);
    }

    /**
     * API endpoint untuk detail berita (JSON)
     * Route: /api/berita/{slug}
     */
    public function apiShow($slug)
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

        $related = Berita::where('id', '!=', $berita->id)
            ->where('status_publikasi', true)
            ->where('kecamatan', $berita->kecamatan)
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'judul' => $item->judul,
                    'slug' => $item->slug,
                    'foto_url' => $item->foto_url,
                    'created_at_formatted' => $item->tanggal_formatted,
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
                'deskripsi' => $berita->deskripsi,
                'kategori' => $berita->kategori,
                'kecamatan' => $berita->kecamatan,
                'foto_url' => $berita->foto_url,
                'created_at' => $berita->created_at?->toIso8601String(),
                'created_at_formatted' => $berita->tanggal_formatted,
                'related' => $related,
            ],
        ]);
    }
}
