<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Imports\Pokja4Import;
use App\Models\Pokja4;
use App\Models\Pokja4KegiatanPosyandu;
use App\Models\Pokja4KunjunganPyd;
use App\Models\Pokja4Rekapitulasi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class Pokja4Controller extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $perPage = (int) $request->input('per_page', 10);
        $tahun = (int) $request->input('tahun', date('Y'));

        $query = Pokja4::query()
            ->where('tahun', $tahun)
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama_kecamatan', 'like', "%{$search}%")
                        ->orWhere('kecamatan', 'like', "%{$search}%");
                });
            });

        $pokjaData = $query
            ->orderBy('kecamatan')
            ->orderBy('nama_kecamatan')
            ->paginate($perPage)
            ->withQueryString();

        $kunjunganPyd = Pokja4KunjunganPyd::query()
            ->where('tahun', $tahun)
            ->orderBy('bulan')
            ->get();

        $kegiatanPosyandu = Pokja4KegiatanPosyandu::query()
            ->where('tahun', $tahun)
            ->orderBy('bulan')
            ->get();

        $rekapitulasi = Pokja4Rekapitulasi::query()
            ->where('tahun', $tahun)
            ->orderBy('kecamatan')
            ->get();

        $tahunList = Pokja4::query()
            ->select('tahun')
            ->whereNotNull('tahun')
            ->distinct()
            ->pluck('tahun')
            ->merge(
                Pokja4KunjunganPyd::query()
                    ->select('tahun')
                    ->whereNotNull('tahun')
                    ->distinct()
                    ->pluck('tahun')
            )
            ->merge(
                Pokja4KegiatanPosyandu::query()
                    ->select('tahun')
                    ->whereNotNull('tahun')
                    ->distinct()
                    ->pluck('tahun')
            )
            ->merge(
                Pokja4Rekapitulasi::query()
                    ->select('tahun')
                    ->whereNotNull('tahun')
                    ->distinct()
                    ->pluck('tahun')
            )
            ->unique()
            ->sortDesc()
            ->values();

        if ($tahunList->isEmpty()) {
            $tahunList = collect([date('Y')]);
        }

        if ($request->expectsJson()) {
            return response()->json([
                'pokjas' => $pokjaData,
                'kunjungan_pyd' => $kunjunganPyd,
                'kegiatan_posyandu' => $kegiatanPosyandu,
                'rekapitulasi' => $rekapitulasi,
                'tahunList' => $tahunList,
            ]);
        }

        return Inertia::render('Backend/Pokja4/Index', [
            'pokjas' => $pokjaData,
            'kunjungan_pyd' => $kunjunganPyd,
            'kegiatan_posyandu' => $kegiatanPosyandu,
            'rekapitulasi' => $rekapitulasi,
            'filters' => $request->only(['search', 'per_page', 'tahun', 'active_tab']),
            'tahunList' => $tahunList,
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

            // Lama
            'posyandu'         => 'nullable|numeric|min:0',
            'akseptor_kb'      => 'nullable|numeric|min:0',
            'phbs'             => 'nullable|numeric|min:0',
            'jamban_keluarga'  => 'nullable|numeric|min:0',

            // ✅ Baru — dari Excel (23 kolom)
            'kader_kesehatan'     => 'nullable|numeric|min:0',
            'kader_gizi'          => 'nullable|numeric|min:0',
            'kader_kesling'       => 'nullable|numeric|min:0',
            'kader_phbs'          => 'nullable|numeric|min:0',
            'kader_kb'            => 'nullable|numeric|min:0',
            'imunisasi'           => 'nullable|numeric|min:0',
            'pkg'                 => 'nullable|numeric|min:0',
            'tbc'                 => 'nullable|numeric|min:0',
            'spal'                => 'nullable|numeric|min:0',
            'tps'                 => 'nullable|numeric|min:0',
            'mck'                 => 'nullable|numeric|min:0',
            'air_pdam'            => 'nullable|numeric|min:0',
            'air_sumur'           => 'nullable|numeric|min:0',
            'air_lainnya'         => 'nullable|numeric|min:0',
            'jumlah_pus'          => 'nullable|numeric|min:0',
            'jumlah_wus'          => 'nullable|numeric|min:0',
            'akseptor_kb_l'       => 'nullable|numeric|min:0',
            'akseptor_kb_p'       => 'nullable|numeric|min:0',
            'tabungan_keluarga'   => 'nullable|numeric|min:0',
            'asuransi_kesehatan'  => 'nullable|numeric|min:0',
            'program_kesehatan'   => 'nullable|string|max:255',
            'program_lingkungan'  => 'nullable|string|max:255',
            'program_perencanaan' => 'nullable|string|max:255',
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

            // Lama
            'posyandu'         => 'nullable|numeric|min:0',
            'akseptor_kb'      => 'nullable|numeric|min:0',
            'phbs'             => 'nullable|numeric|min:0',
            'jamban_keluarga'  => 'nullable|numeric|min:0',

            // ✅ Baru — dari Excel (23 kolom)
            'kader_kesehatan'     => 'nullable|numeric|min:0',
            'kader_gizi'          => 'nullable|numeric|min:0',
            'kader_kesling'       => 'nullable|numeric|min:0',
            'kader_phbs'          => 'nullable|numeric|min:0',
            'kader_kb'            => 'nullable|numeric|min:0',
            'imunisasi'           => 'nullable|numeric|min:0',
            'pkg'                 => 'nullable|numeric|min:0',
            'tbc'                 => 'nullable|numeric|min:0',
            'spal'                => 'nullable|numeric|min:0',
            'tps'                 => 'nullable|numeric|min:0',
            'mck'                 => 'nullable|numeric|min:0',
            'air_pdam'            => 'nullable|numeric|min:0',
            'air_sumur'           => 'nullable|numeric|min:0',
            'air_lainnya'         => 'nullable|numeric|min:0',
            'jumlah_pus'          => 'nullable|numeric|min:0',
            'jumlah_wus'          => 'nullable|numeric|min:0',
            'akseptor_kb_l'       => 'nullable|numeric|min:0',
            'akseptor_kb_p'       => 'nullable|numeric|min:0',
            'tabungan_keluarga'   => 'nullable|numeric|min:0',
            'asuransi_kesehatan'  => 'nullable|numeric|min:0',
            'program_kesehatan'   => 'nullable|string|max:255',
            'program_lingkungan'  => 'nullable|string|max:255',
            'program_perencanaan' => 'nullable|string|max:255',
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
        $importedCount = $import->getImportedCount();

        $failuresFormatted = $failures->map(function ($failure) {
            return [
                'row'    => $failure->row(),
                'errors' => $failure->errors(),
            ];
        })->values();

        if ($importedCount === 0 && $failuresFormatted->count() > 0) {
            return response()->json([
                'message'  => 'Import gagal. Tidak ada baris yang berhasil disimpan. Periksa format header file Anda.',
                'failures' => $failuresFormatted,
            ], 422);
        }

        return response()->json([
            'message'  => "Import selesai. {$importedCount} baris berhasil disimpan.",
            'imported' => $importedCount,
            'failures' => $failuresFormatted,
        ]);
    }
}
