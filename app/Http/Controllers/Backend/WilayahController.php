<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\WilayahDesa;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class WilayahController extends Controller
{
    /**
     * MASTER WILAYAH — kelola kecamatan → desa via UI (super-admin only).
     * Aturan main (ditampilkan di halaman):
     * - Boleh: tambah kecamatan/desa baru (pemekaran), nonaktifkan.
     * - Dilarang: rename/hapus — kecamatan & desa tersimpan sebagai STRING
     *   di puluhan tabel data (users, daftar_wargas, rekap, pokja, ...),
     *   rename akan memutus data lama. Nonaktifkan saja: hilang dari
     *   dropdown/LINTAS validasi, tapi data lama tetap utuh & tampil.
     */
    public function index(Request $request)
    {
        $search = trim((string) $request->input('search', ''));

        $all = WilayahDesa::query()
            ->orderBy('kecamatan')
            ->orderBy('desa')
            ->get(['id', 'kecamatan', 'desa', 'is_active']);

        if ($search !== '') {
            $all = $all->filter(fn ($r) =>
                mb_stripos($r->kecamatan, $search) !== false
                || mb_stripos($r->desa, $search) !== false
            )->values();
        }

        $grouped = [];
        foreach ($all as $row) {
            $grouped[$row->kecamatan][] = [
                'id' => $row->id,
                'desa' => $row->desa,
                'is_active' => (bool) $row->is_active,
            ];
        }
        ksort($grouped);

        $stats = [
            'kecamatan' => (int) WilayahDesa::query()->distinct()->count('kecamatan'),
            'desa' => (int) WilayahDesa::count(),
            'desa_aktif' => (int) WilayahDesa::where('is_active', true)->count(),
            'desa_nonaktif' => (int) WilayahDesa::where('is_active', false)->count(),
        ];

        return Inertia::render('Backend/Wilayah/Index', [
            'grouped' => $grouped,
            'stats' => $stats,
            'filters' => $request->only(['search']),
        ]);
    }

    public function storeKecamatan(Request $request)
    {
        $validated = $request->validate([
            'kecamatan' => ['required', 'string', 'max:255', 'regex:/^[A-Za-z0-9 .\'\-]+$/'],
            'desa' => ['required', 'string', 'max:255', 'regex:/^[A-Za-z0-9 .\'\-]+$/'],
        ], [
            'kecamatan.regex' => 'Nama kecamatan hanya huruf, angka, spasi, titik, petik, strip.',
            'desa.regex' => 'Nama desa hanya huruf, angka, spasi, titik, petik, strip.',
        ]);

        $kecamatan = trim($validated['kecamatan']);
        $desa = trim($validated['desa']);

        if (WilayahDesa::where('kecamatan', $kecamatan)->exists()) {
            return redirect()->back()->withErrors([
                'kecamatan' => "Kecamatan {$kecamatan} sudah ada.",
            ]);
        }

        WilayahDesa::create(['kecamatan' => $kecamatan, 'desa' => $desa, 'is_active' => true]);
        WilayahDesa::flushCache();

        ActivityLogger::log('wilayah.create-kecamatan', null, "Kecamatan baru: {$kecamatan} (desa awal {$desa})");

        return redirect()->route('be.wilayah.index')
            ->with('success', "Kecamatan {$kecamatan} + Desa {$desa} ditambahkan. Buatkan akun admin desa & dasawisma via Users.");
    }

    public function storeDesa(Request $request)
    {
        $validated = $request->validate([
            'kecamatan' => ['required', 'string', 'max:255', Rule::in(WilayahDesa::kecamatanList())],
            'desa' => ['required', 'string', 'max:255', 'regex:/^[A-Za-z0-9 .\'\-]+$/'],
        ], [
            'kecamatan.in' => 'Pilih kecamatan yang terdaftar.',
            'desa.regex' => 'Nama desa hanya huruf, angka, spasi, titik, petik, strip.',
        ]);

        $kecamatan = trim($validated['kecamatan']);
        $desa = trim($validated['desa']);

        if (WilayahDesa::where('kecamatan', $kecamatan)->where('desa', $desa)->exists()) {
            return redirect()->back()->withErrors([
                'desa' => "Desa {$desa} sudah ada di {$kecamatan}.",
            ]);
        }

        $indukAktif = WilayahDesa::where('kecamatan', $kecamatan)->where('is_active', true)->exists();

        WilayahDesa::create(['kecamatan' => $kecamatan, 'desa' => $desa, 'is_active' => $indukAktif]);
        WilayahDesa::flushCache();

        ActivityLogger::log('wilayah.create-desa', null, "Desa baru: {$desa} ({$kecamatan})");

        return redirect()->route('be.wilayah.index')
            ->with('success', "Desa {$desa} ditambahkan ke {$kecamatan}. Buatkan akun admin desa & dasawisma via Users.");
    }

    public function toggleDesa(int $id)
    {
        $row = WilayahDesa::findOrFail($id);
        $row->update(['is_active' => ! $row->is_active]);
        WilayahDesa::flushCache();

        $aksi = $row->is_active ? 'diaktifkan' : 'dinonaktifkan';
        ActivityLogger::log('wilayah.toggle-desa', $row, "Desa {$row->desa} ({$row->kecamatan}) {$aksi}");

        return redirect()->back()->with('success', "Desa {$row->desa} {$aksi}.");
    }

    public function toggleKecamatan(Request $request)
    {
        $validated = $request->validate([
            'kecamatan' => ['required', 'string', 'max:255'],
        ]);
        $kecamatan = trim($validated['kecamatan']);

        $adaAktif = WilayahDesa::where('kecamatan', $kecamatan)->where('is_active', true)->exists();

        DB::transaction(function () use ($kecamatan, $adaAktif) {
            WilayahDesa::where('kecamatan', $kecamatan)->update(['is_active' => ! $adaAktif]);
        });
        WilayahDesa::flushCache();

        $aksi = $adaAktif ? 'dinonaktifkan (semua desanya ikut)' : 'diaktifkan kembali';
        ActivityLogger::log('wilayah.toggle-kecamatan', null, "Kecamatan {$kecamatan} {$aksi}");

        return redirect()->back()->with('success', "Kecamatan {$kecamatan} {$aksi}.");
    }
}
