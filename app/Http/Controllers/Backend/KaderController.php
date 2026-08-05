<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\Kader;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KaderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $kaders = Kader::latest()->get();

        return Inertia::render('Backend/Kader/Index', [
            'kaders' => $kaders
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Backend/Kader/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'nik' => 'nullable|string|max:20|unique:kader,nik',
            'jabatan' => 'required|in:Ketua,Wakil Ketua,Sekretaris,Bendahara,Ketua Pokja I,Ketua Pokja II,Ketua Pokja III,Ketua Pokja IV,Anggota',
            'pokja' => 'nullable|in:I,II,III,IV,Sekretariat',
            'kecamatan' => 'nullable|string|max:255',
            'desa_kelurahan' => 'nullable|string|max:255',
            'no_hp' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
            'foto' => 'nullable|string|max:255',
            'status_aktif' => 'boolean',
            'tanggal_bergabung' => 'nullable|date',
        ]);

        Kader::create($request->all());

        return redirect()->route('be.kader.index')
            ->with('success', 'Data kader berhasil ditambahkan!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $kader = Kader::findOrFail($id);

        return Inertia::render('Backend/Kader/Show', [
            'kader' => $kader
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $kader = Kader::findOrFail($id);

        return Inertia::render('Backend/Kader/Edit', [
            'kader' => $kader
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $kader = Kader::findOrFail($id);

        $request->validate([
            'nama' => 'required|string|max:255',
            'nik' => 'nullable|string|max:20|unique:kader,nik,' . $id,
            'jabatan' => 'required|in:Ketua,Wakil Ketua,Sekretaris,Bendahara,Ketua Pokja I,Ketua Pokja II,Ketua Pokja III,Ketua Pokja IV,Anggota',
            'pokja' => 'nullable|in:I,II,III,IV,Sekretariat',
            'kecamatan' => 'nullable|string|max:255',
            'desa_kelurahan' => 'nullable|string|max:255',
            'no_hp' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
            'foto' => 'nullable|string|max:255',
            'status_aktif' => 'boolean',
            'tanggal_bergabung' => 'nullable|date',
        ]);

        $kader->update($request->all());

        return redirect()->route('be.kader.index')
            ->with('success', 'Data kader berhasil diupdate!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $kader = Kader::findOrFail($id);
        $kader->delete();

        return redirect()->route('be.kader.index')
            ->with('success', 'Data kader berhasil dihapus!');
    }
}
