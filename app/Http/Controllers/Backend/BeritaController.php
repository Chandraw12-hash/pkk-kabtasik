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

    /**
     * Pesan validasi Bahasa Indonesia (reusable)
     */
    private const VALIDATION_MESSAGES = [
        'judul.required' => 'Judul berita wajib diisi.',
        'judul.string' => 'Judul berita harus berupa teks.',
        'judul.max' => 'Judul berita maksimal 255 karakter.',
        'konten.required' => 'Konten berita wajib diisi.',
        'konten.string' => 'Konten berita harus berupa teks.',
        'kategori.required' => 'Kategori wajib dipilih.',
        'kategori.in' => 'Kategori tidak valid.',
        'kecamatan.max' => 'Nama kecamatan maksimal 255 karakter.',
        'foto.image' => 'File harus berupa gambar.',
        'foto.mimes' => 'Format gambar harus JPG, JPEG, PNG, atau WEBP.',
        'foto.max' => 'Ukuran gambar maksimal 5MB.',
        'status.in' => 'Status tidak valid.',
        'reason.max' => 'Alasan penolakan maksimal 500 karakter.',
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

        // ✅ FIX: Handle berbagai format filter status
        if ($status !== null && $status !== '') {
            if (in_array($status, ['approved', 'pending', 'rejected', 'draft'])) {
                $query->where('status', $status);
            } elseif ($status === 'true' || $status === '1') {
                $query->where('status_publikasi', true);
            } elseif ($status === 'false' || $status === '0') {
                $query->where('status_publikasi', false);
            }
        }

        $beritas = $query->paginate($perPage)->withQueryString();

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

    /**
     * STORE — Simpan berita baru
     * ✅ FIX: Admin hormati pilihan checkbox, Kader otomatis pending
     */
    public function store(Request $request)
    {
        $validated = $request->validate(
            [
                'judul' => 'required|string|max:255',
                'konten' => 'required|string',
                'kategori' => 'required|string|in:Artikel,Pemberitaan Desa,Pengumuman,Kegiatan',
                'kecamatan' => 'nullable|string|max:255',
                'foto' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
                'status_publikasi' => 'nullable|boolean',
            ],
            self::VALIDATION_MESSAGES
        );

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('berita-photos', 'public');
        }

        $isAdmin = auth()->user()->hasAnyRole(['admin', 'super-admin']);

        // ✅ FIX: Admin hormati pilihan dari form, Kader otomatis pending
        if ($isAdmin) {
            $statusPublikasi = (bool) $request->input('status_publikasi', false);
            $status = $statusPublikasi ? 'approved' : 'draft';
        } else {
            $statusPublikasi = false;
            $status = 'pending';
        }

        Berita::create([
            'judul' => $validated['judul'],
            'slug' => Str::slug($validated['judul']) . '-' . time(),
            'konten' => $validated['konten'],
            'kategori' => $validated['kategori'],
            'kecamatan' => $validated['kecamatan'] ?? null,
            'status' => $status,
            'status_publikasi' => $statusPublikasi,
            'foto' => $fotoPath,
            'created_by' => auth()->id(),
            'user_id' => auth()->id(),
        ]);

        $message = $isAdmin
            ? ($statusPublikasi
                ? 'Berita berhasil ditambahkan dan langsung dipublikasikan.'
                : 'Berita berhasil disimpan sebagai draft.')
            : 'Berita berhasil dikirim dan menunggu persetujuan admin.';

        return redirect()
            ->route('be.berita.index')
            ->with('success', $message);
    }

    public function show(Berita $berita)
    {
        return Inertia::render('Backend/Berita/Show', [
            'berita' => $berita,
        ]);
    }

    public function edit(Berita $berita)
    {
        return Inertia::render('Backend/Berita/Edit', [
            'berita' => $berita,
            'kecamatanList' => self::KECAMATAN_LIST,
        ]);
    }

    /**
     * UPDATE — Perbarui berita
     * ✅ FIX: Admin hormati pilihan checkbox
     */
    public function update(Request $request, Berita $berita)
    {
        $validated = $request->validate(
            [
                'judul' => 'required|string|max:255',
                'konten' => 'required|string',
                'kategori' => 'required|string|in:Artikel,Pemberitaan Desa,Pengumuman,Kegiatan',
                'kecamatan' => 'nullable|string|max:255',
                'foto' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
                'remove_image' => 'nullable|boolean',
                'status_publikasi' => 'nullable|boolean',
            ],
            self::VALIDATION_MESSAGES
        );

        // === HANDLE FOTO ===
        $fotoPath = $berita->foto;

        if ($request->hasFile('foto')) {
            if ($fotoPath && Storage::disk('public')->exists($fotoPath)) {
                Storage::disk('public')->delete($fotoPath);
            }
            $fotoPath = $request->file('foto')->store('berita-photos', 'public');
        } elseif ($request->boolean('remove_image') && $fotoPath) {
            if (Storage::disk('public')->exists($fotoPath)) {
                Storage::disk('public')->delete($fotoPath);
            }
            $fotoPath = null;
        }

        // === HANDLE STATUS ===
        $isAdmin = auth()->user()->hasAnyRole(['admin', 'super-admin']);

        // ✅ FIX: Admin hormati pilihan, Kader tetap pending
        if ($isAdmin) {
            $statusPublikasi = (bool) $request->input('status_publikasi', false);
            $status = $statusPublikasi ? 'approved' : 'draft';
        } else {
            $statusPublikasi = false;
            $status = 'pending';
        }

        $berita->update([
            'judul' => $validated['judul'],
            'slug' => Str::slug($validated['judul']) . '-' . $berita->id . '-' . time(),
            'konten' => $validated['konten'],
            'kategori' => $validated['kategori'],
            'kecamatan' => $validated['kecamatan'] ?? null,
            'status' => $status,
            'status_publikasi' => $statusPublikasi,
            'foto' => $fotoPath,
        ]);

        $message = $isAdmin
            ? ($statusPublikasi
                ? 'Berita berhasil diperbarui dan dipublikasikan.'
                : 'Berita berhasil diperbarui sebagai draft.')
            : 'Berita berhasil diperbarui dan menunggu persetujuan admin.';

        return redirect()
            ->route('be.berita.index')
            ->with('success', $message);
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
        $newStatus = $berita->status === 'approved' ? 'draft' : 'approved';

        $berita->update([
            'status' => $newStatus,
            'status_publikasi' => $newStatus === 'approved',
        ]);

        $statusLabel = $newStatus === 'approved' ? 'Dipublikasikan' : 'Draft';

        return redirect()
            ->back()
            ->with('success', "Status berita berhasil diubah menjadi: {$statusLabel}");
    }

    // ================================================================
    // BERITA PENDING
    // ================================================================

    public function pending(Request $request)
    {
        $search = $request->input('search');
        $kecamatan = $request->input('kecamatan');

        $query = Berita::where('status', 'pending');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('judul', 'like', "%{$search}%")
                    ->orWhere('konten', 'like', "%{$search}%");
            });
        }

        if ($kecamatan) {
            $query->where('kecamatan', $kecamatan);
        }

        $beritaPending = $query->latest()
            ->with('user:id,name,username,kecamatan')
            ->paginate(10)
            ->withQueryString();

        $kecamatanList = Berita::where('status', 'pending')
            ->whereNotNull('kecamatan')
            ->distinct()
            ->pluck('kecamatan');

        $totalPending = Berita::where('status', 'pending')->count();

        return Inertia::render('Backend/Berita/Pending', [
            'beritaPending' => $beritaPending,
            'kecamatanList' => $kecamatanList,
            'totalPending' => $totalPending,
            'filters' => [
                'search' => $search,
                'kecamatan' => $kecamatan,
            ],
        ]);
    }

    /**
     * APPROVE — Setujui berita pending
     * ✅ FIX: judul & deskripsi jadi nullable
     */
    public function approve(Request $request, Berita $berita)
    {
        $validated = $request->validate(
            [
                'judul' => 'nullable|string|max:255',
                'deskripsi' => 'nullable|string',
            ],
            self::VALIDATION_MESSAGES
        );

        $updateData = [
            'status' => 'approved',
            'status_publikasi' => true,
            'approved_at' => now(),
            'approved_by' => auth()->id(),
        ];

        if ($request->filled('judul')) {
            $updateData['judul'] = $request->judul;
            $updateData['slug'] = Str::slug($request->judul) . '-' . uniqid();
        }

        if ($request->filled('deskripsi')) {
            $updateData['konten'] = $request->deskripsi;
        }

        $berita->update($updateData);
        \App\Services\ActivityLogger::log('berita.approve', $berita, "Berita disetujui: {$berita->judul}");

        return redirect()
            ->route('be.berita.pending')
            ->with('success', 'Berita berhasil disetujui dan dipublikasikan.');
    }

    /**
     * REJECT — Tolak berita pending
     */
    public function reject(Request $request, Berita $berita)
    {
        $validated = $request->validate(
            [
                'reason' => 'nullable|string|max:500',
            ],
            self::VALIDATION_MESSAGES
        );

        $berita->update([
            'status' => 'rejected',
            'status_publikasi' => false,
            'reject_reason' => $validated['reason'] ?? 'Tidak memenuhi kriteria publikasi.',
            'approved_by' => auth()->id(),
        ]);
        \App\Services\ActivityLogger::log('berita.reject', $berita, "Berita ditolak: {$berita->judul}");

        return redirect()
            ->route('be.berita.pending')
            ->with('success', 'Berita berhasil ditolak.');
    }

    // ============================================
    // PUBLIC METHODS (FRONTEND)
    // ============================================

    public function indexPublic(Request $request)
    {
        $search = $request->get('search');
        $kategori = $request->get('kategori');
        $kecamatan = $request->get('kecamatan');
        $perPage = (int) $request->get('per_page', 9);

        $query = Berita::where('status', 'approved')->latest();

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

        $kecamatanList = Berita::where('status', 'approved')
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

    public function showPublic($slug)
    {
        $berita = Berita::where('slug', $slug)
            ->where('status', 'approved')
            ->firstOrFail();

        $beritaLainnya = Berita::where('id', '!=', $berita->id)
            ->where('status', 'approved')
            ->where('kecamatan', $berita->kecamatan)
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Frontend/Berita/Show', [
            'berita' => $berita,
            'beritaLainnya' => $beritaLainnya,
        ]);
    }

    // ============================================
    // API METHODS (JSON)
    // ============================================

    public function apiLatestBerita()
    {
        $berita = Berita::where('status', 'approved')
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

    public function apiIndex(Request $request)
    {
        $search = $request->input('search');
        $kategori = $request->input('kategori');
        $kecamatan = $request->input('kecamatan');
        $limit = $request->input('limit', 10);

        $berita = Berita::where('status', 'approved')
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

        $kecamatanList = Berita::where('status', 'approved')
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

    public function apiShow($slug)
    {
        $berita = Berita::where('slug', $slug)
            ->where('status', 'approved')
            ->first();

        if (!$berita) {
            return response()->json([
                'success' => false,
                'message' => 'Berita tidak ditemukan.',
            ], 404);
        }

        $related = Berita::where('id', '!=', $berita->id)
            ->where('status', 'approved')
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

    /**
     * Get total pending berita (for sidebar badge)
     */
    public function pendingCount()
    {
        $count = Berita::where('status', 'pending')->count();

        return response()->json([
            'success' => true,
            'count' => $count,
        ]);
    }
}
