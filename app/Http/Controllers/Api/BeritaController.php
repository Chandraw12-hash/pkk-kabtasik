<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use App\Support\ContentSanitizer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class BeritaController extends Controller
{
    // ================================================================
    // 🔥 MOBILE - SUBMIT BERITA
    // ================================================================

    /**
     * Submit berita dari mobile (kader)
     * POST /api/berita
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'judul' => 'required|string|max:255',
            'konten' => 'required|string',
            'kategori' => 'nullable|string|max:50',
            'kecamatan' => 'nullable|string|max:100',
            'foto' => 'nullable|string', // base64
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();
        $data['slug'] = Str::slug($request->judul) . '-' . uniqid();
        $data['status'] = 'pending';
        // 🔒 Sanitasi HTML: <script>/event-handler/javascript: dibuang server-side.
        $data['konten'] = ContentSanitizer::clean($request->input('konten', ''));
        $data['user_id'] = $request->user()->id;
        $data['created_by'] = $request->user()->id;

        // 🔥 FIX: Handle foto base64 dengan try-catch
        if ($request->foto) {
            try {
                $data['foto'] = $this->uploadBase64Image($request->foto);
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal upload foto: ' . $e->getMessage()
                ], 400);
            }
        }

        $berita = Berita::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Berita berhasil dikirim, menunggu persetujuan admin.',
            'data' => $this->formatBerita($berita)
        ], 201);
    }

    /**
     * Get berita milik user yang login
     * GET /api/berita/saya
     */
    public function myBerita(Request $request)
    {
        $berita = Berita::where('user_id', $request->user()->id)
            ->orWhere('created_by', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                return $this->formatBerita($item);
            });

        return response()->json([
            'success' => true,
            'message' => 'Berita saya',
            'data' => $berita
        ]);
    }

    /**
     * Get detail berita milik user sendiri
     * GET /api/berita/saya/{id}
     */
    public function showMyBerita(Request $request, $id)
    {
        $berita = Berita::where('id', $id)
            ->where(function ($query) use ($request) {
                $query->where('user_id', $request->user()->id)
                    ->orWhere('created_by', $request->user()->id);
            })
            ->first();

        if (!$berita) {
            return response()->json([
                'success' => false,
                'message' => 'Berita tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $this->formatBerita($berita)
        ]);
    }

    /**
     * Update berita sendiri (hanya jika status pending)
     * PUT /api/berita/saya/{id}
     */
    public function update(Request $request, $id)
    {
        $berita = Berita::where('id', $id)
            ->where(function ($query) use ($request) {
                $query->where('user_id', $request->user()->id)
                    ->orWhere('created_by', $request->user()->id);
            })
            ->first();

        if (!$berita) {
            return response()->json([
                'success' => false,
                'message' => 'Berita tidak ditemukan'
            ], 404);
        }

        if ($berita->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Berita sudah diproses admin, tidak bisa diubah.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'judul' => 'sometimes|string|max:255',
            'konten' => 'sometimes|string',
            'kategori' => 'nullable|string|max:50',
            'kecamatan' => 'nullable|string|max:100',
            'foto' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();

        // 🔒 Sanitasi HTML saat update milik sendiri.
        if ($request->has('konten')) {
            $data['konten'] = ContentSanitizer::clean($request->input('konten', ''));
        }

        if ($request->has('judul') && $request->judul !== $berita->judul) {
            $data['slug'] = Str::slug($request->judul) . '-' . uniqid();
        }

        if ($request->foto) {
            if ($berita->foto) {
                $this->deleteImage($berita->foto);
            }
            try {
                $data['foto'] = $this->uploadBase64Image($request->foto);
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal upload foto: ' . $e->getMessage()
                ], 400);
            }
        }

        $berita->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Berita berhasil diupdate.',
            'data' => $this->formatBerita($berita)
        ]);
    }

    /**
     * Hapus berita sendiri (hanya jika status pending)
     * DELETE /api/berita/saya/{id}
     */
    public function destroy(Request $request, $id)
    {
        $berita = Berita::where('id', $id)
            ->where(function ($query) use ($request) {
                $query->where('user_id', $request->user()->id)
                    ->orWhere('created_by', $request->user()->id);
            })
            ->first();

        if (!$berita) {
            return response()->json([
                'success' => false,
                'message' => 'Berita tidak ditemukan'
            ], 404);
        }

        if ($berita->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Berita sudah diproses admin, tidak bisa dihapus.'
            ], 403);
        }

        if ($berita->foto) {
            $this->deleteImage($berita->foto);
        }

        $berita->delete();

        return response()->json([
            'success' => true,
            'message' => 'Berita berhasil dihapus.'
        ]);
    }

    // ================================================================
    // 🔥 PUBLIC - BERITA
    // ================================================================

    public function index(Request $request)
    {
        $search = $request->input('search');
        $kategori = $request->input('kategori');
        $kecamatan = $request->input('kecamatan');
        $limit = $request->input('limit', 10);

        $berita = Berita::where('status', 'approved')
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
                return $this->formatBeritaPublic($item);
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
                'kategori' => ['Artikel', 'Pemberitaan Desa', 'Pengumuman', 'Kegiatan'],
            ],
        ]);
    }

    public function show($slug)
    {
        $berita = Berita::where('slug', $slug)
            ->where('status', 'approved')
            ->first();

        if (!$berita) {
            return response()->json([
                'success' => false,
                'message' => 'Berita tidak ditemukan',
            ], 404);
        }

        if (method_exists($berita, 'increment')) {
            $berita->increment('views');
        }

        $related = Berita::where('id', '!=', $berita->id)
            ->where('status', 'approved')
            ->when($berita->kecamatan, function ($query) use ($berita) {
                return $query->where('kecamatan', $berita->kecamatan);
            })
            ->latest()
            ->limit(10)
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
                'konten' => ContentSanitizer::clean($berita->konten),
                'deskripsi' => strip_tags(ContentSanitizer::clean($berita->konten)),
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

    public function getKecamatan()
    {
        $kecamatanList = Berita::where('status', 'approved')
            ->select('kecamatan')
            ->distinct()
            ->whereNotNull('kecamatan')
            ->pluck('kecamatan');

        return response()->json([
            'success' => true,
            'data' => $kecamatanList,
        ]);
    }

    public function latest(Request $request)
    {
        $limit = $request->input('limit', 6);

        $berita = Berita::where('status', 'approved')
            ->latest()
            ->limit($limit)
            ->get()
            ->map(function ($item) {
                return $this->formatBeritaPublic($item);
            });

        return response()->json([
            'success' => true,
            'message' => 'Berita terbaru',
            'data' => $berita,
        ]);
    }

    public function byKategori(Request $request, $kategori)
    {
        $limit = $request->input('limit', 10);

        $berita = Berita::where('status', 'approved')
            ->where('kategori', $kategori)
            ->latest()
            ->paginate($limit)
            ->through(function ($item) {
                return $this->formatBeritaPublic($item);
            });

        return response()->json([
            'success' => true,
            'message' => 'Berita kategori ' . $kategori,
            'data' => $berita,
        ]);
    }

    public function byKecamatan(Request $request, $kecamatan)
    {
        $limit = $request->input('limit', 10);

        $berita = Berita::where('status', 'approved')
            ->where('kecamatan', $kecamatan)
            ->latest()
            ->paginate($limit)
            ->through(function ($item) {
                return $this->formatBeritaPublic($item);
            });

        return response()->json([
            'success' => true,
            'message' => 'Berita kecamatan ' . $kecamatan,
            'data' => $berita,
        ]);
    }

    public function kecamatanTeraktif(Request $request)
    {
        $range = $request->input('range', 'all');

        $query = Berita::where('status', 'approved')
            ->whereNotNull('kecamatan')
            ->where('kecamatan', '!=', '');

        if ($range === 'month') {
            $query->whereMonth('created_at', now()->month)
                  ->whereYear('created_at', now()->year);
        } elseif ($range === 'week') {
            $query->whereBetween('created_at', [now()->subDays(7), now()]);
        } elseif ($range === 'year') {
            $query->whereYear('created_at', now()->year);
        }

        $data = $query->select('kecamatan', DB::raw('count(*) as total'))
            ->groupBy('kecamatan')
            ->orderBy('total', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'kecamatan' => $item->kecamatan,
                    'total' => (int) $item->total,
                ];
            });

        if ($data->isEmpty()) {
            $data = collect();
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

    // ================================================================
    // 🔥 ADMIN - APPROVE/REJECT BERITA
    // ================================================================

    public function pending(Request $request)
    {
        // 🔒 Antrean pending hanya untuk admin kabupaten / super-admin.
        abort_unless(
            $request->user()->hasAnyRole(['admin', 'super-admin']),
            403,
            'Hanya admin yang dapat melihat antrean berita.'
        );

        $berita = Berita::where('status', 'pending')
            ->with('user:id,name,username,kecamatan')
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($item) {
                $formatted = $this->formatBerita($item);
                $formatted['user'] = $item->user ? [
                    'id' => $item->user->id,
                    'name' => $item->user->name,
                    'username' => $item->user->username,
                    'kecamatan' => $item->user->kecamatan,
                ] : null;
                return $formatted;
            });

        return response()->json([
            'success' => true,
            'data' => $berita,
            'total' => $berita->count()
        ]);
    }

    /**
     * 🔥 APPROVE - PASTIKAN STATUS 'approved'
     */
    public function approve(Request $request, $id)
    {
        // 🔒 Hanya admin kabupaten / super-admin yang boleh approve via API.
        // Akun mobile (pokja1-4, dasawisma) wajib ditolak 403.
        abort_unless(
            $request->user()->hasAnyRole(['admin', 'super-admin']),
            403,
            'Hanya admin yang dapat menyetujui berita.'
        );

        $berita = Berita::find($id);

        if (!$berita) {
            return response()->json([
                'success' => false,
                'message' => 'Berita tidak ditemukan'
            ], 404);
        }

        if ($berita->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Berita sudah diproses sebelumnya.'
            ], 400);
        }

        // 🔥 VALIDASI INPUT
        $validated = $request->validate([
            'judul' => 'sometimes|string|max:255',
            'deskripsi' => 'nullable|string',
        ]);

        // 🔥 UPDATE DATA
        $updateData = [
            'status' => 'approved',        // ← HARUS 'approved'!
            'status_publikasi' => true,
            'approved_at' => now(),
            'approved_by' => auth()->id(),
        ];

        // Update judul jika ada
        if ($request->has('judul') && !empty($request->judul)) {
            $updateData['judul'] = $request->judul;
            $updateData['slug'] = Str::slug($request->judul) . '-' . uniqid();
        }

        // Update konten jika ada
        if ($request->has('deskripsi') && !empty($request->deskripsi)) {
            $updateData['konten'] = ContentSanitizer::clean($request->input('deskripsi'));
        }

        $berita->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Berita berhasil disetujui!',
            'data' => $this->formatBerita($berita)
        ]);
    }

    /**
     * 🔥 REJECT - PASTIKAN STATUS 'rejected'
     */
    public function reject(Request $request, $id)
    {
        // 🔒 Hanya admin kabupaten / super-admin yang boleh reject via API.
        abort_unless(
            $request->user()->hasAnyRole(['admin', 'super-admin']),
            403,
            'Hanya admin yang dapat menolak berita.'
        );

        $berita = Berita::find($id);

        if (!$berita) {
            return response()->json([
                'success' => false,
                'message' => 'Berita tidak ditemukan'
            ], 404);
        }

        if ($berita->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Berita sudah diproses sebelumnya.'
            ], 400);
        }

        $data = [
            'status' => 'rejected',        // ← HARUS 'rejected'!
            'status_publikasi' => false,
            'approved_by' => auth()->id(),
        ];

        if ($request->has('reason') && !empty($request->reason)) {
            $data['reject_reason'] = $request->reason;
        }

        $berita->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Berita berhasil ditolak.',
            'data' => $this->formatBerita($berita)
        ]);
    }

    // ================================================================
    // 🔥 HELPER FUNCTIONS
    // ================================================================

    private function formatBerita($item)
    {
        $konten = ContentSanitizer::clean($item->konten);
        return [
            'id' => $item->id,
            'judul' => $item->judul,
            'slug' => $item->slug,
            'konten' => $konten,
            'deskripsi_singkat' => $item->deskripsi_singkat ?? substr(strip_tags($konten), 0, 150),
            'kategori' => $item->kategori,
            'kecamatan' => $item->kecamatan,
            'foto_url' => $item->foto_url ?? null,
            'status' => $item->status,
            'status_label' => $this->getStatusLabel($item->status),
            'user_id' => $item->user_id,
            'created_at' => $item->created_at?->toIso8601String(),
            'created_at_formatted' => $item->created_at?->translatedFormat('d F Y'),
            'updated_at' => $item->updated_at?->toIso8601String(),
        ];
    }

    private function formatBeritaPublic($item)
    {
        $konten = ContentSanitizer::clean($item->konten);
        return [
            'id' => $item->id,
            'judul' => $item->judul,
            'slug' => $item->slug,
            'konten' => $konten,
            'deskripsi_singkat' => $item->deskripsi_singkat ?? substr(strip_tags($konten), 0, 150),
            'kategori' => $item->kategori,
            'kecamatan' => $item->kecamatan,
            'foto_url' => $item->foto_url ?? null,
            'created_at' => $item->created_at?->toIso8601String(),
            'created_at_formatted' => $item->created_at?->translatedFormat('d F Y'),
        ];
    }

    private function getStatusLabel($status)
    {
        $labels = [
            'pending' => 'Menunggu Persetujuan',
            'approved' => 'Disetujui',
            'rejected' => 'Ditolak',
            'draft' => 'Draft',
        ];
        return $labels[$status] ?? ucfirst($status);
    }

    /**
     * Upload base64 image — sumber DSLR (20-50 MB) via HP.
     * Terima sampai 30 MB, lalu perkecil di server via GD: sisi terpanjang
     * maks 1920px, simpan JPEG q80 (±300-600 KB). GIF ditolak.
     * Syarat php.ini saat deploy: post_max_size & upload_max_filesize 32M,
     * memory_limit 512M (kanvas DSLR 50 MP ≈ 200 MB di RAM).
     */
    private function uploadBase64Image($base64Image)
    {
        // CEK APAKAH ADA PREFIX data:image
        if (strpos($base64Image, 'data:image') !== false) {
            $parts = explode(',', $base64Image, 2);
            $base64Image = $parts[1] ?? '';
        }

        // HAPUS WHITESPACE
        $base64Image = trim($base64Image);

        // DECODE (strict: tolak karakter non-base64)
        $image = base64_decode($base64Image, true);

        // CEK APAKAH DECODE BERHASIL
        if ($image === false) {
            throw new \Exception('Gagal mendecode base64 image');
        }

        // BATAS MASUK 30 MB (file DSLR; cek hasil decode, bukan panjang string).
        if (strlen($image) > 30 * 1024 * 1024) {
            throw new \Exception('Ukuran foto maksimal 30 MB');
        }

        // CEK IMAGE VALID + tolak GIF sejak magic bytes.
        $info = @getimagesizefromstring($image);
        if ($info === false) {
            throw new \Exception('File bukan gambar yang valid (gunakan JPG/PNG/WEBP)');
        }
        if ($info[2] === IMAGETYPE_GIF) {
            throw new \Exception('Format GIF tidak diperbolehkan (gunakan JPG/PNG/WEBP)');
        }
        if (! in_array($info[2], [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_WEBP], true)) {
            throw new \Exception('Format gambar tidak didukung (gunakan JPG/PNG/WEBP)');
        }

        // Batas 50 megapiksel agar GD tidak makan RAM berlebih di server.
        if ($info[0] * $info[1] > 50 * 1000 * 1000) {
            throw new \Exception('Resolusi foto terlalu besar, kecilkan dulu sebelum upload');
        }

        $src = @imagecreatefromstring($image);
        if ($src === false) {
            throw new \Exception('Gambar rusak dan tidak bisa diproses');
        }

        try {
            $width = imagesx($src);
            $height = imagesy($src);

            // Koreksi orientasi EXIF (foto portrait kamera).
            $src = $this->applyExifOrientation($src, $image);
            $width = imagesx($src);
            $height = imagesy($src);

            // Perkecil bila sisi terpanjang > 1920px.
            $maxSide = 1920;
            if (max($width, $height) > $maxSide) {
                $ratio = $maxSide / max($width, $height);
                $newWidth = (int) round($width * $ratio);
                $newHeight = (int) round($height * $ratio);
                $dst = imagecreatetruecolor($newWidth, $newHeight);
                imagecopyresampled($dst, $src, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
                imagedestroy($src);
                $src = $dst;
            }

            $dir = storage_path('app/public/berita');
            if (!file_exists($dir)) {
                mkdir($dir, 0775, true);
            }
            $filename = 'berita-' . time() . '-' . uniqid() . '.jpg';
            $path = $dir . '/' . $filename;
            if (! imagejpeg($src, $path, 80)) {
                throw new \Exception('Gagal menyimpan foto');
            }
        } finally {
            if (isset($src) && $src instanceof \GdImage) {
                imagedestroy($src);
            }
        }

        return 'berita/' . $filename;
    }

    /**
     * Putar kanvas sesuai tag EXIF Orientation (1, 3, 6, 8).
     *
     * @param \GdImage $src
     * @return \GdImage
     */
    private function applyExifOrientation($src, string $bytes)
    {
        if (! function_exists('exif_read_data')) {
            return $src;
        }
        $tmp = tempnam(sys_get_temp_dir(), 'exif');
        if ($tmp === false) {
            return $src;
        }
        file_put_contents($tmp, $bytes);
        $exif = @exif_read_data($tmp);
        @unlink($tmp);
        if (! is_array($exif) || ! isset($exif['Orientation'])) {
            return $src;
        }
        $rotated = match ((int) $exif['Orientation']) {
            3 => imagerotate($src, 180, 0),
            6 => imagerotate($src, -90, 0),
            8 => imagerotate($src, 90, 0),
            default => $src,
        };
        if ($rotated !== $src) {
            imagedestroy($src);
        }

        return $rotated;
    }

    /**
     * Get MIME type from base64 string
     */
    private function getMimeTypeFromBase64($base64)
    {
        // Cek magic bytes dari base64
        $decoded = base64_decode($base64);
        if ($decoded === false) {
            return 'image/jpeg';
        }

        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_buffer($finfo, $decoded);
        finfo_close($finfo);

        return $mimeType;
    }

    private function deleteImage($path)
    {
        $fullPath = storage_path('app/public/' . $path);
        if (file_exists($fullPath)) {
            unlink($fullPath);
        }
    }
}
