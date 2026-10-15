<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\Galeri;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class GaleriController extends Controller
{
    // ========= PERBAIKAN PENTING DI SINI =========
    public function index(Request $request)
    {
        $galeris = Galeri::withCount('fotos')->when($request->search, function ($query) use ($request) {
                $query->where('judul', 'like', '%' . $request->search . '%');
            })
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 10)
            ->withQueryString();

        return Inertia::render('Backend/Galeri/Index', [
            'galeris' => $galeris,
            'filters' => $request->only(['search', 'per_page'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Backend/Galeri/Create');
    }

    public function store(Request $request)
    {
        // Validasi (cover + galeri maks total 5 foto)
        $request->validate([
            'judul' => 'required|string|max:255',
            'tanggal' => 'required|date',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:30720',
            'galeri' => 'nullable|array|max:5',
            'galeri.*' => 'image|mimes:jpeg,png,jpg|max:30720',
        ]);

        // Tanpa cover, galeri pertama jadi cover.
        $galeriFiles = collect($request->file('galeri', []))->filter()->values();

        // Simpan file dengan nama unik agar tidak bentrok
        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('galeri-photos', 'public');
        }
        if (!$fotoPath && $galeriFiles->isNotEmpty()) {
            $fotoPath = $galeriFiles->shift()->store('galeri-photos', 'public');
        }
        $galeriFiles = $galeriFiles->take($fotoPath ? 4 : 5);

        // Simpan ke database
        $galeri = Galeri::create([
            'judul' => $request->judul,
            'tanggal' => $request->tanggal,
            'foto' => $fotoPath,
        ]);

        foreach ($galeriFiles as $i => $file) {
            $galeri->fotos()->create([
                'foto' => $file->store('galeri-photos', 'public'),
                'urutan' => $i,
            ]);
        }

        return redirect()->route('be.galeri.index')->with('success', 'Galeri kegiatan berhasil ditambahkan.');
    }

    public function edit(Galeri $galeri)
    {
        return Inertia::render('Backend/Galeri/Edit', [
            'galeri' => $galeri->load('fotos'),
        ]);
    }

    public function update(Request $request, Galeri $galeri)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'tanggal' => 'required|date',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:30720',
            'galeri' => 'nullable|array|max:5',
            'galeri.*' => 'image|mimes:jpeg,png,jpg|max:30720',
            'hapus_galeri' => 'nullable|array',
            'hapus_galeri.*' => 'integer|exists:galeri_fotos,id',
        ]);

        // === HAPUS GALERI TERPILIH ===
        $hapusIds = collect($request->input('hapus_galeri', []))->filter()->values();
        if ($hapusIds->isNotEmpty()) {
            $rows = $galeri->fotos()->whereIn('id', $hapusIds)->get();
            foreach ($rows as $row) {
                if ($row->foto && Storage::disk('public')->exists($row->foto)) {
                    Storage::disk('public')->delete($row->foto);
                }
                $row->delete();
            }
        }

        $fotoPath = $galeri->foto;
        if ($request->hasFile('foto')) {
            if ($fotoPath && Storage::disk('public')->exists($fotoPath)) {
                Storage::disk('public')->delete($fotoPath);
            }
            $fotoPath = $request->file('foto')->store('galeri-photos', 'public');
        }

        // === TAMBAH GALERI BARU (total baris galeri maks 4) ===
        $sisaSlot = max(0, 4 - $galeri->fotos()->count());
        $baru = collect($request->file('galeri', []))->filter()->values()->take($sisaSlot);
        if ($baru->isNotEmpty()) {
            $mulai = (int) ($galeri->fotos()->max('urutan') ?? -1) + 1;
            foreach ($baru as $i => $file) {
                $galeri->fotos()->create([
                    'foto' => $file->store('galeri-photos', 'public'),
                    'urutan' => $mulai + $i,
                ]);
            }
        }

        // Cover kosong + galeri tersisa: promosikan yang pertama jadi cover.
        if (!$fotoPath) {
            $pertama = $galeri->fotos()->orderBy('urutan')->first();
            if ($pertama) {
                $fotoPath = $pertama->foto;
                $pertama->delete();
            }
        }

        $galeri->update([
            'judul' => $request->judul,
            'tanggal' => $request->tanggal,
            'foto' => $fotoPath,
        ]);

        return redirect()->route('be.galeri.index')->with('success', 'Galeri kegiatan berhasil diperbarui.');
    }

    public function destroy(Galeri $galeri)
    {
        if ($galeri->foto && Storage::disk('public')->exists($galeri->foto)) {
            Storage::disk('public')->delete($galeri->foto);
        }
        foreach ($galeri->fotos as $row) {
            if ($row->foto && Storage::disk('public')->exists($row->foto)) {
                Storage::disk('public')->delete($row->foto);
            }
        }

        $galeri->delete();

        return redirect()->route('be.galeri.index')->with('success', 'Galeri kegiatan berhasil dihapus.');
    }
}
