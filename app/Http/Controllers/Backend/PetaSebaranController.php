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
     * Layer oranye = rumah dengan balita stunting (jumlah_balita_stunting > 0),
     * prioritas di atas hijau/merah. Layer bumil (pink) tampil sebagai
     * filter + badge + stats (tak mengubah warna dot).
     * Angka stunting agregat Pokja 4 (pokja4_data_program) tak punya
     * koordinat jadi tak dipakai di sini.
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'kecamatan' => ['nullable', 'string', 'max:255'],
            'desa' => ['nullable', 'string', 'max:255'],
            'kriteria' => ['nullable', Rule::in(['Sehat', 'Kurang Sehat'])],
            'stunting' => ['nullable', Rule::in(['semua', 'ada', 'tidak'])],
            'bumil' => ['nullable', Rule::in(['semua', 'ada', 'tidak'])],
        ]);

        // Ibu hamil aktif (status_ibu=hamil, tolak dikecualikan) per KK.
        $bumilScope = fn ($q) => $q->where('status_ibu', 'hamil')
            ->where('status', '!=', 'rejected');

        $base = DaftarWarga::query()->whereNotNull('latitude')->whereNotNull('longitude');

        $pins = (clone $base)
            ->when($validated['kecamatan'] ?? null, fn ($q, $k) => $q->where('kecamatan', $k))
            ->when($validated['desa'] ?? null, fn ($q, $d) => $q->where('desa', $d))
            ->when($validated['kriteria'] ?? null, fn ($q, $k) => $q->where('kriteria_rumah', $k))
            ->when($validated['stunting'] ?? null, function ($q, $s) {
                if ($s === 'ada') {
                    $q->where('jumlah_balita_stunting', '>', 0);
                } elseif ($s === 'tidak') {
                    $q->where(function ($w) {
                        $w->whereNull('jumlah_balita_stunting')->orWhere('jumlah_balita_stunting', '<=', 0);
                    });
                }
            })
            ->when($validated['bumil'] ?? null, function ($q, $s) use ($bumilScope) {
                if ($s === 'ada') {
                    $q->whereHas('bumil', $bumilScope);
                } elseif ($s === 'tidak') {
                    $q->whereDoesntHave('bumil', $bumilScope);
                }
            })
            ->withCount(['bumil as bumil_hamil_count' => $bumilScope])
            ->orderBy('kecamatan')
            ->orderBy('desa')
            ->limit(10000)
            ->get(['id', 'nama_kepala_keluarga', 'alamat', 'kecamatan', 'desa', 'latitude', 'longitude', 'kriteria_rumah', 'jumlah_balita_stunting', 'status'])
            ->map(fn ($r) => [
                'id' => $r->id,
                'nama' => $r->nama_kepala_keluarga,
                'alamat' => $r->alamat,
                'kecamatan' => $r->kecamatan,
                'desa' => $r->desa,
                'lat' => (float) $r->latitude,
                'lng' => (float) $r->longitude,
                'kriteria' => $r->kriteria_rumah,
                'stunting' => (int) ($r->jumlah_balita_stunting ?? 0),
                'bumil' => (int) ($r->bumil_hamil_count ?? 0),
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
            'stunting' => (clone $base)->where('jumlah_balita_stunting', '>', 0)->count(),
            'bumil' => (clone $base)->whereHas('bumil', fn ($q) => $q
                ->where('status_ibu', 'hamil')->where('status', '!=', 'rejected'))->count(),
        ];

        return Inertia::render('Backend/PetaSebaran/Index', [
            'pins' => $pins,
            'stats' => $stats,
            'filters' => $request->only(['kecamatan', 'desa', 'kriteria', 'stunting', 'bumil']),
            'kecamatanList' => array_keys(AdminDesaSeeder::DATA_DESA),
            'desaByKecamatan' => AdminDesaSeeder::DATA_DESA,
        ]);
    }
}
