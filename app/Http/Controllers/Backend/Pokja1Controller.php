<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pokja1;
use App\Models\LaporanKegiatan;
use App\Imports\Pokja1Import;
use App\Exports\Pokja1Export;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Inertia\Inertia;

class Pokja1Controller extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);

        $pokjaData = Pokja1::when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('judul_kegiatan', 'like', "%{$search}%")
                      ->orWhere('deskripsi', 'like', "%{$search}%")
                      ->orWhere('kecamatan', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        // ─── Sheet baru: Laporan Kegiatan Pokja I (kabupaten) ───
        // Menampilkan laporan mobile kategori I (numerik + Buku Kegiatan Lamp. 4.13)
        // agar admin kabupaten bisa melihat rincian kegiatan per kecamatan.
        $laporanSearch = $request->input('laporan_search');
        $laporanStatus = $request->input('laporan_status');
        $laporanPerPage = (int) $request->input('laporan_per_page', 10);

        $laporanQuery = LaporanKegiatan::query()
            ->with(['user:id,name'])
            ->where('kategori_pokja', 'I')
            ->when($laporanSearch, function ($q) use ($laporanSearch) {
                $q->where(function ($q) use ($laporanSearch) {
                    $q->where('judul', 'like', "%{$laporanSearch}%")
                      ->orWhere('kecamatan', 'like', "%{$laporanSearch}%")
                      ->orWhere('desa_kelurahan', 'like', "%{$laporanSearch}%")
                      ->orWhere('nama_dasawisma', 'like', "%{$laporanSearch}%");
                });
            })
            ->when($laporanStatus, fn ($q) => $q->where('status', $laporanStatus))
            ->latest();

        $laporanKegiatan = $laporanQuery->paginate($laporanPerPage, ['*'], 'laporan_page')
            ->withQueryString();

        // Hitung ringkasan baris Buku Kegiatan (Lamp. 4.13) yang sudah disetujui
        $bukuKegiatanCount = (clone $laporanQuery)
            ->where('status', 'approved')
            ->get()
            ->reduce(function ($carry, $laporan) {
                $data = $laporan->data_angka;
                if (is_string($data)) {
                    $data = json_decode($data, true);
                }
                if (
                    is_array($data)
                    && ($data['jenis_formulir'] ?? null) === 'buku_kegiatan_lampiran_413'
                    && is_array($data['buku_kegiatan'] ?? null)
                ) {
                    return $carry + count($data['buku_kegiatan']);
                }
                return $carry;
            }, 0);

        if ($request->expectsJson()) {
            return response()->json([
                'pokjas' => $pokjaData,
                'laporan_kegiatan' => $laporanKegiatan,
                'buku_kegiatan_count' => $bukuKegiatanCount,
                'laporan_loaded' => true,
            ]);
        }

        return Inertia::render('Backend/Pokja1/Index', [
            'pokjas' => $pokjaData,
            'laporan_kegiatan' => $laporanKegiatan,
            'buku_kegiatan_count' => $bukuKegiatanCount,
            'laporan_loaded' => true,
            'filters' => $request->only(['search', 'per_page', 'laporan_search', 'laporan_status', 'laporan_per_page', 'active_tab']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Backend/Pokja1/Create');
    }

    /**
     * 6 program format publik (KISAH/KILAS/KRISAN/KIAT/KISAK/PKBN),
     * masing-masing: kegiatan, volume, metode, sasaran.
     */
    private const PROGRAMS = ['kisah', 'kilas', 'krisan', 'kiat', 'kisak', 'pkbn'];

    private function baseRules(): array
    {
        $rules = [
            'kecamatan'      => 'required|string|max:100',
            'nama_kecamatan' => 'nullable|string|max:100',
            'nama_wilayah'   => 'nullable|string|max:100',
            'tahun'          => 'nullable|integer|min:2000|max:2100',
            'kader_umum'     => 'nullable|integer|min:0',
            'kader_khusus'   => 'nullable|integer|min:0',
            'keterangan'     => 'nullable|string',
            'judul_kegiatan' => 'nullable|string|max:255',
            'deskripsi'      => 'nullable|string',
            'kategori'       => 'nullable|string|max:100',
            'foto'           => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ];
        foreach (self::PROGRAMS as $program) {
            $rules["{$program}_kegiatan"] = 'nullable|string|max:255';
            $rules["{$program}_volume"]   = 'nullable|integer|min:0';
            $rules["{$program}_metode"]   = 'nullable|string|max:255';
            $rules["{$program}_sasaran"]  = 'nullable|integer|min:0';
        }

        return $rules;
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->baseRules());

        if ($request->hasFile('foto')) {
            $validated['foto'] = $request->file('foto')->store('pokja1-photos', 'public');
        }

        // Sinkronkan kolom nama_kecamatan (duplikat historis) dengan kecamatan
        $validated['nama_kecamatan'] = $validated['kecamatan'] ?? null;

        Pokja1::create($validated);

        return redirect()->route('be.pokja1.index')->with('success', 'Data Pokja I berhasil ditambahkan.');
    }

    public function edit(Pokja1 $pokja1)
    {
        return Inertia::render('Backend/Pokja1/Edit', [
            'pokja' => $pokja1,
        ]);
    }

    public function update(Request $request, Pokja1 $pokja1)
    {
        $validated = $request->validate($this->baseRules());

        if ($request->hasFile('foto')) {
            if ($pokja1->foto && Storage::disk('public')->exists($pokja1->foto)) {
                Storage::disk('public')->delete($pokja1->foto);
            }
            $validated['foto'] = $request->file('foto')->store('pokja1-photos', 'public');
        } else {
            // Tidak upload foto baru -> pertahankan foto lama
            unset($validated['foto']);
        }

        // Sinkronkan kolom nama_kecamatan (duplikat historis) dengan kecamatan
        $validated['nama_kecamatan'] = $validated['kecamatan'] ?? $pokja1->nama_kecamatan;

        $pokja1->update($validated);

        return redirect()->route('be.pokja1.index')->with('success', 'Data Pokja I berhasil diperbarui.');
    }

    public function destroy(Pokja1 $pokja1)
    {
        if ($pokja1->foto && Storage::disk('public')->exists($pokja1->foto)) {
            Storage::disk('public')->delete($pokja1->foto);
        }

        $pokja1->delete();

        return redirect()->route('be.pokja1.index')->with('success', 'Data Pokja I berhasil dihapus.');
    }

    /**
     * Export data Pokja I ke Excel.
     * Dipanggil oleh route be.pokja1.export (route sudah ada, method belum).
     */
    public function export(Request $request)
    {
        $filename = 'data-pokja-1-' . date('Y-m-d') . '.xlsx';

        return Excel::download(new Pokja1Export($request->input('search')), $filename);
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:2048',
        ]);

        try {
            Excel::import(new Pokja1Import, $request->file('file'));

            return redirect()->route('be.pokja1.index')->with('success', 'Data Pokja I berhasil diimport!');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['file' => 'Terjadi kesalahan saat import data: ' . $e->getMessage()]);
        }
    }
}
