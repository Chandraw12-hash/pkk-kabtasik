<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Imports\Pokja4Import;
use App\Models\Pokja4;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class Pokja4Controller extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);

        $pokjaData = Pokja4::when($search, function ($query, $search) {
                $query->where('nama_kecamatan', 'like', "%{$search}%")
                      ->orWhere('kecamatan', 'like', "%{$search}%")
                      ->orWhere('kategori', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Backend/Pokja4/Index', [
            'pokjas' => $pokjaData,
            'filters' => $request->only(['search', 'per_page']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Backend/Pokja4/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kategori'         => 'nullable|string|max:50',
            'kecamatan'        => 'required|string|max:100',
            'nama_kecamatan'   => 'required|string|max:100',
            'posyandu'         => 'nullable|numeric|min:0',
            'akseptor_kb'      => 'nullable|numeric|min:0',
            'phbs'             => 'nullable|numeric|min:0',
            'jamban_keluarga'  => 'nullable|numeric|min:0',
        ]);

        $validated['kategori'] = $validated['kategori'] ?? 'Umum';

        Pokja4::create($validated);

        return redirect()->route('be.pokja4.index')->with('success', 'Data Pokja IV berhasil ditambahkan.');
    }

    public function edit(Pokja4 $pokja4)
    {
        return Inertia::render('Backend/Pokja4/Edit', ['pokja' => $pokja4]);
    }

    public function update(Request $request, Pokja4 $pokja4)
    {
        $validated = $request->validate([
            'kategori'         => 'nullable|string|max:50',
            'kecamatan'        => 'required|string|max:100',
            'nama_kecamatan'   => 'required|string|max:100',
            'posyandu'         => 'nullable|numeric|min:0',
            'akseptor_kb'      => 'nullable|numeric|min:0',
            'phbs'             => 'nullable|numeric|min:0',
            'jamban_keluarga'  => 'nullable|numeric|min:0',
        ]);

        $validated['kategori'] = $validated['kategori'] ?? 'Umum';

        $pokja4->update($validated);

        return redirect()->route('be.pokja4.index')->with('success', 'Data Pokja IV berhasil diperbarui.');
    }

    public function destroy(Pokja4 $pokja4)
    {
        $pokja4->delete();

        return redirect()->route('be.pokja4.index')->with('success', 'Data Pokja IV berhasil dihapus.');
    }

    /**
     * Handle upload & import file Excel/CSV untuk data Pokja IV.
     * Dipanggil oleh route be.pokja4.import
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:5120', // maks 5MB
        ]);

        $import = new Pokja4Import();

        try {
            Excel::import($import, $request->file('file'));
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal memproses file: ' . $e->getMessage(),
            ], 422);
        }

        $failures = $import->failures();

        $failuresFormatted = $failures->map(function ($failure) {
            return [
                'row'    => $failure->row(),
                'errors' => $failure->errors(),
            ];
        })->values();

        if ($import->importedCount === 0 && $failuresFormatted->count() > 0) {
            return response()->json([
                'message'  => 'Import gagal. Tidak ada baris yang berhasil disimpan. Periksa format header file Anda.',
                'failures' => $failuresFormatted,
            ], 422);
        }

        return response()->json([
            'message'  => "Import selesai. {$import->importedCount} baris berhasil disimpan.",
            'imported' => $import->importedCount,
            'failures' => $failuresFormatted,
        ]);
    }
}
