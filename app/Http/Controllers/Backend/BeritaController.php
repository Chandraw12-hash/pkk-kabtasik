<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BeritaController extends Controller
{
    public function index()
    {
        $beritas = Berita::latest()->get();

        return Inertia::render('Backend/Berita/Index', [
            'beritas' => $beritas,
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
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('berita-photos', 'public');
        }

        Berita::create([
            'judul' => $request->judul,
            'konten' => $request->konten,
            'foto' => $fotoPath,
        ]);

        return redirect()->route('be.berita.index')->with('success', 'Berita berhasil ditambahkan.');
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
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
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
            'konten' => $request->konten,
            'foto' => $fotoPath,
        ]);

        return redirect()->route('be.berita.index')->with('success', 'Berita berhasil diperbarui.');
    }

    public function destroy(Berita $berita)
    {
        if ($berita->foto && Storage::disk('public')->exists($berita->foto)) {
            Storage::disk('public')->delete($berita->foto);
        }

        $berita->delete();

        return redirect()->route('be.berita.index')->with('success', 'Berita berhasil dihapus.');
    }
}
