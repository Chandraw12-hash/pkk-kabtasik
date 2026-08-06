<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\Galeri;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class GaleriController extends Controller
{
    public function index()
    {
        $galeris = Galeri::latest()->get();

        return Inertia::render('Backend/Galeri/Index', [
            'galeris' => $galeris,
        ]);
    }

    public function create()
    {
        return Inertia::render('Backend/Galeri/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'foto' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $fotoPath = $request->file('foto')->store('galeri-photos', 'public');

        Galeri::create([
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'foto' => $fotoPath,
        ]);

        return redirect()->route('be.galeri.index')->with('success', 'Galeri kegiatan berhasil ditambahkan.');
    }

    public function edit(Galeri $galeri)
    {
        return Inertia::render('Backend/Galeri/Edit', [
            'galeri' => $galeri,
        ]);
    }

    public function update(Request $request, Galeri $galeri)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $fotoPath = $galeri->foto;
        if ($request->hasFile('foto')) {
            if ($fotoPath && Storage::disk('public')->exists($fotoPath)) {
                Storage::disk('public')->delete($fotoPath);
            }
            $fotoPath = $request->file('foto')->store('galeri-photos', 'public');
        }

        $galeri->update([
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'foto' => $fotoPath,
        ]);

        return redirect()->route('be.galeri.index')->with('success', 'Galeri kegiatan berhasil diperbarui.');
    }

    public function destroy(Galeri $galeri)
    {
        if ($galeri->foto && Storage::disk('public')->exists($galeri->foto)) {
            Storage::disk('public')->delete($galeri->foto);
        }

        $galeri->delete();

        return redirect()->route('be.galeri.index')->with('success', 'Galeri kegiatan berhasil dihapus.');
    }
}
