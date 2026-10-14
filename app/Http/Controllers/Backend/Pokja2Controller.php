<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pokja2;
use App\Imports\Pokja2Import; // <-- Pastikan file ini ada di app/Imports/
use App\Exports\Pokja2Export;
use App\Exports\Pokja2RincianExport;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel; // <-- Facade untuk Excel
use Inertia\Inertia;

class Pokja2Controller extends Controller
{
    /**
     * Kolom angka format publik (tabel website): Pendidikan + Kader +
     * Koperasi + 3 pelatihan tambahan yang tampil di Index backend.
     */
    private const NUMERIK = [
        'warga_buta_l', 'warga_buta_p',
        'kelompok_belajar_paket_a', 'warga_belajar_paket_a',
        'kelompok_belajar_paket_b', 'warga_belajar_paket_b',
        'kelompok_belajar_paket_c', 'warga_belajar_paket_c',
        'kf', 'warga_belajar_kf', 'paud', 'taman_bacaan',
        'kelompok_bkb', 'peserta_bkb', 'ibu_set_bkb', 'ape_bkb',
        'kelompok_simulasi_bkb', 'tutor_kf', 'tutor_paud', 'kader_bkb',
        'kelompok_kader_koperasi', 'kader_keterampilan',
        'kader_dilatih_pengelolaan', 'kader_dilatih_tp_pkk', 'kader_dilatih_damas',
        'lp3_pkk', 'tp3_pkk', 'damas_pkk',
        'up2k_pemula_kelompok', 'up2k_pemula_peserta',
        'up2k_madya_kelompok', 'up2k_madya_peserta',
        'up2k_utama_kelompok', 'up2k_utama_peserta',
        'up2k_mandiri_kelompok', 'up2k_mandiri_peserta',
        'koperasi_berbadan_hukum', 'anggota_koperasi',
    ];

    private function baseRules(): array
    {
        $rules = [
            'kategori' => 'required|string|max:255',
            'kecamatan' => 'required|string|max:255',
            'nama_kecamatan' => 'nullable|string|max:255',
            'judul_kegiatan' => 'nullable|string|max:255',
            'deskripsi' => 'nullable|string',
            'keterangan' => 'nullable|string',
        ];
        foreach (self::NUMERIK as $field) {
            $rules[$field] = 'nullable|integer|min:0';
        }

        return $rules;
    }
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
        $validated = $request->validate($this->baseRules());

        Pokja2::create($validated);

        return redirect()->route('be.pokja2.index')->with('success', 'Data Pokja II berhasil ditambahkan.');
    }

    public function edit(Pokja2 $pokja2)
    {
        return Inertia::render('Backend/Pokja2/Edit', ['pokja' => $pokja2]);
    }

    public function update(Request $request, Pokja2 $pokja2)
    {
        $validated = $request->validate($this->baseRules());

        $pokja2->update($validated);

        return redirect()->route('be.pokja2.index')->with('success', 'Data Pokja II berhasil diperbarui.');
    }

    public function destroy(Pokja2 $pokja2)
    {
        $pokja2->delete();

        return redirect()->route('be.pokja2.index')->with('success', 'Data Pokja II berhasil dihapus.');
    }

    /**
     * Export agregat Pokja II ke Excel (cermin tabel output website).
     * Dipanggil oleh route be.pokja2.export (tombol Export kabupaten).
     */
    public function export(Request $request)
    {
        $filename = 'data-pokja-2-' . date('Y-m-d') . '.xlsx';

        return Excel::download(new Pokja2Export($request->input('search')), $filename);
    }

    /**
     * Export rincian L/P Pokja II ke Excel — khusus super-admin (Kominfo).
     */
    public function exportRincian(Request $request)
    {
        $filename = 'data-pokja-2-rincian-' . date('Y-m-d') . '.xlsx';

        return Excel::download(new Pokja2RincianExport($request->input('search')), $filename);
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
