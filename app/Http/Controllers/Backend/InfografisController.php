<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\Infografis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;

class InfografisController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');
        $kategori = $request->get('kategori');
        $perPage = (int) $request->get('per_page', 10);

        $query = Infografis::query()->latest();

        if ($search) {
            $query->where('judul', 'like', '%' . $search . '%');
        }

        if ($kategori) {
            $query->where('kategori', $kategori);
        }

        $infografis = $query->paginate($perPage)->withQueryString();

        $kategoriList = Infografis::select('kategori')->distinct()->whereNotNull('kategori')->pluck('kategori');

        return Inertia::render('Backend/Infografis/Index', [
            'infografis' => $infografis,
            'kategoriList' => $kategoriList,
            'filters' => [
                'search' => $search,
                'kategori' => $kategori,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Backend/Infografis/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'kategori' => 'nullable|string|max:255',
            'gambar' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
            'urutan' => 'nullable|integer',
        ]);

        $gambarPath = null;
        if ($request->hasFile('gambar')) {
            $gambarPath = $request->file('gambar')->store('infografis', 'public');
        }

        Infografis::create([
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'kategori' => $request->kategori,
            'gambar' => $gambarPath,
            'urutan' => $request->urutan ?? 0,
            'status' => 'active',
        ]);

        return redirect()->route('be.infografis.index')->with('success', 'Infografis berhasil ditambahkan.');
    }

    public function edit(Infografis $infografis)
    {
        return Inertia::render('Backend/Infografis/Edit', [
            'infografis' => $infografis,
        ]);
    }

    public function update(Request $request, Infografis $infografis)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'kategori' => 'nullable|string|max:255',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'urutan' => 'nullable|integer',
        ]);

        $gambarPath = $infografis->gambar;
        if ($request->hasFile('gambar')) {
            if ($gambarPath && Storage::disk('public')->exists($gambarPath)) {
                Storage::disk('public')->delete($gambarPath);
            }
            $gambarPath = $request->file('gambar')->store('infografis', 'public');
        }

        $infografis->update([
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'kategori' => $request->kategori,
            'gambar' => $gambarPath,
            'urutan' => $request->urutan ?? 0,
        ]);

        return redirect()->route('be.infografis.index')->with('success', 'Infografis berhasil diperbarui.');
    }

    public function destroy(Infografis $infografis)
    {
        if ($infografis->gambar && Storage::disk('public')->exists($infografis->gambar)) {
            Storage::disk('public')->delete($infografis->gambar);
        }
        $infografis->delete();

        return redirect()->route('be.infografis.index')->with('success', 'Infografis berhasil dihapus.');
    }

    public function toggleStatus(Infografis $infografis)
    {
        $infografis->update([
            'status' => $infografis->status === 'active' ? 'inactive' : 'active'
        ]);

        return redirect()->back()->with('success', 'Status infografis berhasil diubah.');
    }
}
