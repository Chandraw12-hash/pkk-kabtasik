<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\StrukturOrganisasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\StrukturOrganisasiImport;

class StrukturOrganisasiController extends Controller
{
    /**
     * Kategori options dipakai di beberapa method — ditarik jadi satu
     * biar tidak duplikat dan gampang di-maintain.
     */
    private function kategoriOptions(): array
    {
        return [
            'ketua' => 'Ketua TP PKK',
            'pimpinan_inti' => 'Pimpinan Inti',
            'pokja_i' => 'Pokja I',
            'pokja_ii' => 'Pokja II',
            'pokja_iii' => 'Pokja III',
            'pokja_iv' => 'Pokja IV',
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pengurus = StrukturOrganisasi::orderBy('kategori')
            ->orderBy('urutan')
            ->get()
            ->groupBy('kategori');

        return Inertia::render('Backend/StrukturOrganisasi/Index', [
            'pengurus' => $pengurus,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Backend/StrukturOrganisasi/Create', [
            'kategoriOptions' => $this->kategoriOptions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'jabatan' => 'required|string|max:255',
            'kategori' => 'required|string|in:ketua,pimpinan_inti,pokja_i,pokja_ii,pokja_iii,pokja_iv',
            'pokja' => 'nullable|string|max:10',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'urutan' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
            'deskripsi' => 'nullable|string',
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('struktur-organisasi', 'public');
        }

        StrukturOrganisasi::create([
            'nama' => $validated['nama'],
            'jabatan' => $validated['jabatan'],
            'kategori' => $validated['kategori'],
            'pokja' => $validated['pokja'] ?? null,
            'foto' => $fotoPath,
            'urutan' => $validated['urutan'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
            'deskripsi' => $validated['deskripsi'] ?? null,
        ]);

        return redirect()
            ->route('be.struktur-organisasi.index')
            ->with('success', 'Pengurus berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $pengurus = StrukturOrganisasi::findOrFail($id);

        return Inertia::render('Backend/StrukturOrganisasi/Show', [
            'pengurus' => $pengurus,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $pengurus = StrukturOrganisasi::findOrFail($id);

        return Inertia::render('Backend/StrukturOrganisasi/Edit', [
            'pengurus' => $pengurus,
            'kategoriOptions' => $this->kategoriOptions(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * PENTING: route ini HARUS diakses via POST dengan field `_method=put`
     * di body (bukan PUT/PATCH asli), karena frontend mengirim file dan
     * PHP tidak mengisi $_FILES pada request dengan method PUT asli.
     * Laravel otomatis mengenali `_method` dan tetap meroute ke sini
     * selama route didefinisikan sebagai Route::put() / Route::resource().
     */
    public function update(Request $request, string $id)
    {
        $pengurus = StrukturOrganisasi::findOrFail($id);

        $validated = $request->validate([
            'nama' => 'nullable|string|max:255',
            'jabatan' => 'nullable|string|max:255',
            'kategori' => 'nullable|string|in:ketua,pimpinan_inti,pokja_i,pokja_ii,pokja_iii,pokja_iv',
            'pokja' => 'nullable|string|max:10',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'urutan' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
            'deskripsi' => 'nullable|string',
        ]);

        // Field kosong/tidak dikirim → pertahankan nilai lama
        $nama = $validated['nama'] ?? $pengurus->nama;
        $jabatan = $validated['jabatan'] ?? $pengurus->jabatan;
        $kategori = $validated['kategori'] ?? $pengurus->kategori;

        // Foto: default tetap foto lama, hanya diganti kalau ada file baru
        $fotoPath = $pengurus->foto;

        if ($request->hasFile('foto')) {
            if ($fotoPath && Storage::disk('public')->exists($fotoPath)) {
                Storage::disk('public')->delete($fotoPath);
            }
            $fotoPath = $request->file('foto')->store('struktur-organisasi', 'public');
        }

        $pengurus->update([
            'nama' => $nama,
            'jabatan' => $jabatan,
            'kategori' => $kategori,
            'pokja' => $validated['pokja'] ?? $pengurus->pokja,
            'foto' => $fotoPath,
            'urutan' => $validated['urutan'] ?? $pengurus->urutan,
            'is_active' => $validated['is_active'] ?? $pengurus->is_active,
            'deskripsi' => $validated['deskripsi'] ?? $pengurus->deskripsi,
        ]);

        \Log::info('Update Struktur Organisasi:', [
            'id' => $id,
            'nama' => $nama,
            'foto' => $fotoPath,
            'has_file' => $request->hasFile('foto'),
            'method' => $request->method(),
            'content_type' => $request->header('Content-Type'),
        ]);

        return redirect()
            ->route('be.struktur-organisasi.index')
            ->with('success', 'Pengurus berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $pengurus = StrukturOrganisasi::findOrFail($id);

        if ($pengurus->foto && Storage::disk('public')->exists($pengurus->foto)) {
            Storage::disk('public')->delete($pengurus->foto);
        }

        $pengurus->delete();

        return redirect()
            ->route('be.struktur-organisasi.index')
            ->with('success', 'Pengurus berhasil dihapus.');
    }

    /**
     * Toggle active status
     */
    public function toggleStatus($id)
    {
        $pengurus = StrukturOrganisasi::findOrFail($id);
        $pengurus->update([
            'is_active' => !$pengurus->is_active,
        ]);

        return redirect()
            ->back()
            ->with('success', 'Status pengurus berhasil diubah.');
    }

    /**
     * Import data from Excel file
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:2048'
        ]);

        try {
            Excel::import(new StrukturOrganisasiImport, $request->file('file'));

            return redirect()
                ->back()
                ->with('success', 'Data berhasil diimport!');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Gagal import data: ' . $e->getMessage());
        }
    }
}
