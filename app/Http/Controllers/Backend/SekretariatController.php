<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\Pokja;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SekretariatController extends Controller
{
    public function index()
    {
        $pokjas = Pokja::where('kategori', 'Sekretariat')->latest()->get();

        return Inertia::render('Backend/Sekretariat/Index', [
            'pokjas' => $pokjas,
        ]);
    }

    public function create()
    {
        return Inertia::render('Backend/Sekretariat/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul_kegiatan' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('sekretariat-photos', 'public');
        }

        Pokja::create([
            'kategori' => 'Sekretariat',
            'judul_kegiatan' => $request->judul_kegiatan,
            'deskripsi' => $request->deskripsi,
            'foto' => $fotoPath,
        ]);

        return redirect()->route('be.sekretariat.index')->with('success', 'Data Sekretariat berhasil ditambahkan.');
    }

    public function edit(Pokja $pokja)
    {
        return Inertia::render('Backend/Sekretariat/Edit', [
            'pokja' => $pokja,
        ]);
    }

    public function update(Request $request, Pokja $pokja)
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
            $fotoPath = $request->file('foto')->store('sekretariat-photos', 'public');
        }

        $pokja->update([
            'judul_kegiatan' => $request->judul_kegiatan,
            'deskripsi' => $request->deskripsi,
            'foto' => $fotoPath,
        ]);

        return redirect()->route('be.sekretariat.index')->with('success', 'Data Sekretariat berhasil diperbarui.');
    }

    public function destroy(Pokja $pokja)
    {
        if ($pokja->foto && Storage::disk('public')->exists($pokja->foto)) {
            Storage::disk('public')->delete($pokja->foto);
        }

        $pokja->delete();

        return redirect()->route('be.sekretariat.index')->with('success', 'Data Sekretariat berhasil dihapus.');
    }
}
