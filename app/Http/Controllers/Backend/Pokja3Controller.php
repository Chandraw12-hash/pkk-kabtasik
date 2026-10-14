<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Exports\Pokja3Export;
use App\Imports\Pokja3Import;
use App\Models\Pokja3;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class Pokja3Controller extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);

        $pokjaData = Pokja3::when($search, function ($query, $search) {
                $query->where('nama_kecamatan', 'like', "%{$search}%")
                      ->orWhere('kecamatan', 'like', "%{$search}%")
                      ->orWhere('kategori', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Backend/Pokja3/Index', [
            'pokjas' => $pokjaData,
            'filters' => $request->only(['search', 'per_page']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Backend/Pokja3/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kategori'                => 'nullable|string|max:50',
            'kecamatan'               => 'required|string|max:100',
            'nama_kecamatan'          => 'required|string|max:100',
            'judul_kegiatan'          => 'nullable|string|max:255',
            'deskripsi'               => 'nullable|string',
            'keterangan'              => 'nullable|string',
            'rumah_sehat'             => 'nullable|numeric|min:0',
            'rumah_tidak_sehat'       => 'nullable|numeric|min:0',
            'pemanfaatan_pekarangan'  => 'nullable|numeric|min:0',
            'industri_rumah_tangga'   => 'nullable|numeric|min:0',
            'jumlah_kader'            => 'nullable|numeric|min:0',
            'jumlah_kader_p'          => 'nullable|numeric|min:0',
            'makanan_pokok'           => 'nullable|numeric|min:0',
            'hatinya_pkk'             => 'nullable|numeric|min:0',
            'jumlah_rumah'            => 'nullable|numeric|min:0',
            'kader_tata_laksana'      => 'nullable|numeric|min:0',
            'makanan_non_beras'       => 'nullable|numeric|min:0',
            'peternakan'              => 'nullable|numeric|min:0',
            'perikanan'               => 'nullable|numeric|min:0',
            'warung_hidup'            => 'nullable|numeric|min:0',
            'lumbung_hidup'           => 'nullable|numeric|min:0',
            'toga'                    => 'nullable|numeric|min:0',
            'tanaman_keras'           => 'nullable|numeric|min:0',
            'tanaman_lainnya'         => 'nullable|numeric|min:0',
            'industri_pangan'         => 'nullable|numeric|min:0',
            'industri_sandang'        => 'nullable|numeric|min:0',
            'industri_jasa'           => 'nullable|numeric|min:0',
        ]);

        $validated['kategori'] = $validated['kategori'] ?? 'Umum';

        Pokja3::create($validated);

        return redirect()->route('be.pokja3.index')->with('success', 'Data Pokja III berhasil ditambahkan.');
    }

    public function edit(Pokja3 $pokja3)
    {
        return Inertia::render('Backend/Pokja3/Edit', ['pokja' => $pokja3]);
    }

    public function update(Request $request, Pokja3 $pokja3)
    {
        $validated = $request->validate([
            'kategori'                => 'nullable|string|max:50',
            'kecamatan'               => 'required|string|max:100',
            'nama_kecamatan'          => 'required|string|max:100',
            'judul_kegiatan'          => 'nullable|string|max:255',
            'deskripsi'               => 'nullable|string',
            'keterangan'              => 'nullable|string',
            'rumah_sehat'             => 'nullable|numeric|min:0',
            'rumah_tidak_sehat'       => 'nullable|numeric|min:0',
            'pemanfaatan_pekarangan'  => 'nullable|numeric|min:0',
            'industri_rumah_tangga'   => 'nullable|numeric|min:0',
            'jumlah_kader'            => 'nullable|numeric|min:0',
            'jumlah_kader_p'          => 'nullable|numeric|min:0',
            'makanan_pokok'           => 'nullable|numeric|min:0',
            'hatinya_pkk'             => 'nullable|numeric|min:0',
            'jumlah_rumah'            => 'nullable|numeric|min:0',
            'kader_tata_laksana'      => 'nullable|numeric|min:0',
            'makanan_non_beras'       => 'nullable|numeric|min:0',
            'peternakan'              => 'nullable|numeric|min:0',
            'perikanan'               => 'nullable|numeric|min:0',
            'warung_hidup'            => 'nullable|numeric|min:0',
            'lumbung_hidup'           => 'nullable|numeric|min:0',
            'toga'                    => 'nullable|numeric|min:0',
            'tanaman_keras'           => 'nullable|numeric|min:0',
            'tanaman_lainnya'         => 'nullable|numeric|min:0',
            'industri_pangan'         => 'nullable|numeric|min:0',
            'industri_sandang'        => 'nullable|numeric|min:0',
            'industri_jasa'           => 'nullable|numeric|min:0',
        ]);

        $validated['kategori'] = $validated['kategori'] ?? 'Umum';

        $pokja3->update($validated);

        return redirect()->route('be.pokja3.index')->with('success', 'Data Pokja III berhasil diperbarui.');
    }

    public function destroy(Pokja3 $pokja3)
    {
        $pokja3->delete();

        return redirect()->route('be.pokja3.index')->with('success', 'Data Pokja III berhasil dihapus.');
    }

    /**
     * Export data Pokja III ke Excel.
     * Dipanggil oleh route be.pokja3.export
     */
    public function export(Request $request)
    {
        $filename = 'data-pokja-3-' . date('Y-m-d') . '.xlsx';

        return Excel::download(new Pokja3Export($request->input('search')), $filename);
    }

    /**
     * Handle upload & import file Excel/CSV untuk data Pokja III.
     * Dipanggil oleh route be.pokja3.import
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:5120', // maks 5MB
        ]);

        $import = new Pokja3Import();

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
