<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\DaftarWarga;
use Database\Seeders\AdminDesaSeeder;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PetaSebaranController extends Controller
{
    /**
     * PETA SEBARAN — pin rumah dasawisma (khusus kabupaten/super-admin).
     * Pin = baris daftar_warga yang punya latitude+longitude.
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'kecamatan' => ['nullable', 'string', 'max:255'],
            'desa' => ['nullable', 'string', 'max:255'],
            'kriteria' => ['nullable', Rule::in(['Sehat', 'Kurang Sehat'])],
        ]);

        $base = DaftarWarga::query()->whereNotNull('latitude')->whereNotNull('longitude');

        $pins = (clone $base)
            ->when($validated['kecamatan'] ?? null, fn ($q, $k) => $q->where('kecamatan', $k))
            ->when($validated['desa'] ?? null, fn ($q, $d) => $q->where('desa', $d))
            ->when($validated['kriteria'] ?? null, fn ($q, $k) => $q->where('kriteria_rumah', $k))
            ->orderBy('kecamatan')
            ->orderBy('desa')
            ->limit(10000)
            ->get(['id', 'nama_kepala_keluarga', 'alamat', 'kecamatan', 'desa', 'latitude', 'longitude', 'kriteria_rumah', 'status'])
            ->map(fn ($r) => [
                'id' => $r->id,
                'nama' => $r->nama_kepala_keluarga,
                'alamat' => $r->alamat,
                'kecamatan' => $r->kecamatan,
                'desa' => $r->desa,
                'lat' => (float) $r->latitude,
                'lng' => (float) $r->longitude,
                'kriteria' => $r->kriteria_rumah,
                'status' => $r->status,
            ]);

        // JSON hanya untuk axios (filter tanpa reload) — pola sama KaderController.
        if (
            !$request->header('X-Inertia') &&
            ($request->wantsJson() || $request->ajax())
        ) {
            return response()->json(['pins' => $pins]);
        }

        $stats = [
            'total' => (clone $base)->count(),
            'sehat' => (clone $base)->where('kriteria_rumah', 'Sehat')->count(),
            'kurang_sehat' => (clone $base)->where('kriteria_rumah', 'Kurang Sehat')->count(),
        ];

        return Inertia::render('Backend/PetaSebaran/Index', [
            'pins' => $pins,
            'stats' => $stats,
            'filters' => $request->only(['kecamatan', 'desa', 'kriteria']),
            'kecamatanList' => array_keys(AdminDesaSeeder::DATA_DESA),
            'desaByKecamatan' => AdminDesaSeeder::DATA_DESA,
        ]);
    }
}
