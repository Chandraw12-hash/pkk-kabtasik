<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\Kader;
use Database\Seeders\AdminDesaSeeder;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class KaderController extends Controller
{
    public function index(Request $request)
    {
        $search  = $request->input('search');
        $perPage = (int) $request->input('per_page', 10);

        $kaders = Kader::query()
            ->with(['user:id,username'])
            ->when($search, function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                        ->orWhere('kecamatan', 'like', "%{$search}%")
                        ->orWhere('desa_kelurahan', 'like', "%{$search}%")
                        ->orWhere('nik', 'like', "%{$search}%")
                        ->orWhere('jabatan', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        // JSON hanya untuk axios — JANGAN untuk navigasi Inertia
        if (
            !$request->header('X-Inertia') &&
            ($request->wantsJson() || $request->ajax())
        ) {
            return response()->json($kaders);
        }

        return Inertia::render('Backend/Kader/Index', [
            'kaders'  => $kaders,
            'filters' => $request->only(['search', 'per_page']),
        ]);
    }

    public function create()
    {
        // Input manual dimatikan: baris kader terisi otomatis dari akun
        // (observer + sinkron). NIK/jabatan dilengkapi lewat Edit.
        abort(404);
    }

    public function store(Request $request)
    {
        // Input manual dimatikan: baris kader terisi otomatis dari akun.
        abort(404);
    }

    public function show(string $id)
    {
        $kader = Kader::findOrFail($id);

        return Inertia::render('Backend/Kader/Show', [
            'kader' => $kader,
        ]);
    }

    public function edit(string $id)
    {
        $kader = Kader::findOrFail($id);

        return Inertia::render('Backend/Kader/Edit', [
            'kader' => $kader,
            'kecamatanList' => array_keys(AdminDesaSeeder::DATA_DESA),
            'desaByKecamatan' => AdminDesaSeeder::DATA_DESA,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $kader = Kader::findOrFail($id);

        $validated = $request->validate([
            'nama'              => 'required|string|max:255',
            'nik'               => 'nullable|string|max:20|unique:kader,nik,' . $id,
            'jabatan'           => 'required|in:Ketua,Wakil Ketua,Sekretaris,Bendahara,Ketua Pokja I,Ketua Pokja II,Ketua Pokja III,Ketua Pokja IV,Anggota',
            'pokja'             => 'nullable|in:I,II,III,IV,Sekretariat',
            'kecamatan'         => ['nullable', 'string', 'max:255', Rule::in(array_keys(AdminDesaSeeder::DATA_DESA))],
            'desa_kelurahan'    => 'nullable|string|max:255',
            'no_hp'             => 'nullable|string|max:20',
            'alamat'            => 'nullable|string',
            'foto'              => 'nullable|string|max:255',
            'status_aktif'      => 'boolean',
            'tanggal_bergabung' => 'nullable|date',
        ]);

        $validated['status_aktif'] = $request->boolean('status_aktif', $kader->status_aktif);

        $kader->update($validated);

        return redirect()
            ->route('be.kader.index')
            ->with('success', 'Data kader berhasil diupdate!');
    }

    public function destroy(string $id)
    {
        $kader = Kader::findOrFail($id);
        $kader->delete();

        return redirect()
            ->route('be.kader.index')
            ->with('success', 'Data kader berhasil dihapus!');
    }
}
