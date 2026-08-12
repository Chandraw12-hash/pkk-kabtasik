<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pokja2;
use App\Imports\Pokja2Import; // <-- Pastikan file ini ada di app/Imports/
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel; // <-- Facade untuk Excel
use Inertia\Inertia;

class Pokja2Controller extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);

        $pokjaData = Pokja2::when($search, function ($query, $search) {
                $query->where('kecamatan', 'like', "%{$search}%")
                      ->orWhere('nama_kecamatan', 'like', "%{$search}%")
                      ->orWhere('kategori', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Backend/Pokja2/Index', [
            'pokjas' => $pokjaData,
            'filters' => $request->only(['search', 'per_page']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Backend/Pokja2/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'kategori' => 'required|string|max:255',
            'kecamatan' => 'required|string|max:255',
            'nama_kecamatan' => 'nullable|string|max:255',
        ]);

        Pokja2::create($request->all());

        return redirect()->route('be.pokja2.index')->with('success', 'Data Pokja II berhasil ditambahkan.');
    }

    public function edit(Pokja2 $pokja2)
    {
        return Inertia::render('Backend/Pokja2/Edit', ['pokja' => $pokja2]);
    }

    public function update(Request $request, Pokja2 $pokja2)
    {
        $request->validate([
            'kategori' => 'required|string|max:255',
            'kecamatan' => 'required|string|max:255',
        ]);

        $pokja2->update($request->all());

        return redirect()->route('be.pokja2.index')->with('success', 'Data Pokja II berhasil diperbarui.');
    }

    public function destroy(Pokja2 $pokja2)
    {
        $pokja2->delete();

        return redirect()->route('be.pokja2.index')->with('success', 'Data Pokja II berhasil dihapus.');
    }

    /**
     * Method tambahan untuk menangani import file Excel Pokja II.
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:2048',
        ]);

        try {
            Excel::import(new Pokja2Import, $request->file('file'));

            return redirect()->route('be.pokja2.index')->with('success', 'Data Pokja II berhasil diimport!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['file' => 'Terjadi kesalahan saat import data: ' . $e->getMessage()]);
        }
    }
}
