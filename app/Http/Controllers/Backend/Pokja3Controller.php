<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\Pokja;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class Pokja3Controller extends Controller
{
    public function index(): Response
    {
        $pokjas = Pokja::where('kategori', 'Pokja III')->latest()->get();

        return Inertia::render('Backend/Pokja3/Index', [
            'pokjas' => $pokjas,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Backend/Pokja3/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'judul_kegiatan' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('pokja3-photos', 'public');
        }

        Pokja::create([
            'kategori' => 'Pokja III',
            'judul_kegiatan' => $request->judul_kegiatan,
            'deskripsi' => $request->deskripsi,
            'foto' => $fotoPath,
        ]);

        return redirect()->route('be.pokja3.index')->with('success', 'Data Pokja III berhasil ditambahkan.');
    }

    public function edit(Pokja $pokja): Response
    {
        return Inertia::render('Backend/Pokja3/Edit', [
            'pokja' => $pokja,
        ]);
    }

    public function update(Request $request, Pokja $pokja): RedirectResponse
    {
        $request->validate([
            'judul_kegiatan' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $fotoPath = $pokja->foto;
        if ($request->hasFile('foto')) {
            if ($fotoPath && Storage::disk('public')->exists($fotoPath)) {
                Storage::disk('public')->delete($fotoPath);
            }
            $fotoPath = $request->file('foto')->store('pokja3-photos', 'public');
        }

        $pokja->update([
            'judul_kegiatan' => $request->judul_kegiatan,
            'deskripsi' => $request->deskripsi,
            'foto' => $fotoPath,
        ]);

        return redirect()->route('be.pokja3.index')->with('success', 'Data Pokja III berhasil diperbarui.');
    }

    public function destroy(Pokja $pokja): RedirectResponse
    {
        if ($pokja->foto && Storage::disk('public')->exists($pokja->foto)) {
            Storage::disk('public')->delete($pokja->foto);
        }

        $pokja->delete();

        return redirect()->route('be.pokja3.index')->with('success', 'Data Pokja III berhasil dihapus.');
    }
}
