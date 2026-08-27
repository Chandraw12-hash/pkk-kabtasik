<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LaporanKegiatan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LaporanKegiatanController extends Controller
{
    /**
     * Kader submit laporan kegiatan baru dari mobile.
     * Laporan ini TIDAK tampil publik — cuma masuk ke daftar admin
     * di dashboard web (menu "Laporan Kegiatan").
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'kategori_pokja' => 'required|in:I,II,III,IV',
            'data_angka' => 'nullable|array',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'kecamatan' => 'nullable|string|max:255',
            'desa_kelurahan' => 'nullable|string|max:255',
            'nama_dasawisma' => 'nullable|string|max:255',
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('laporan-kegiatan', 'public');
        }

        $laporan = LaporanKegiatan::create([
            'user_id' => $request->user()->id,
            'judul' => $validated['judul'],
            'deskripsi' => $validated['deskripsi'] ?? null,
            'kategori_pokja' => $validated['kategori_pokja'],
            'data_angka' => $validated['data_angka'] ?? null,
            'foto' => $fotoPath,
            'kecamatan' => $validated['kecamatan'] ?? null,
            'desa_kelurahan' => $validated['desa_kelurahan'] ?? null,
            'nama_dasawisma' => $validated['nama_dasawisma'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Laporan berhasil dikirim.',
            'data' => $laporan,
        ], 201);
    }

    /**
     * Riwayat laporan milik kader yang sedang login SAJA —
     * tidak pernah menampilkan laporan kader lain.
     */
    public function index(Request $request)
    {
        $laporans = LaporanKegiatan::where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return response()->json($laporans);
    }

    /**
     * Detail 1 laporan milik sendiri. Kalau ID-nya bukan milik kader
     * yang login, dianggap tidak ditemukan (bukan malah bocor punya
     * kader lain).
     */
    public function show(Request $request, LaporanKegiatan $laporan_kegiatan)
    {
        if ($laporan_kegiatan->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Laporan tidak ditemukan.',
            ], 404);
        }

        return response()->json($laporan_kegiatan);
    }
}
