<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WilayahDesa;
use Illuminate\Http\Request;

class WilayahController extends Controller
{
    /**
     * GET /api/wilayah/kecamatan
     * Master kecamatan Kab. Tasikmalaya dari tabel wilayah_desa (public).
     */
    public function kecamatan()
    {
        return response()->json([
            'success' => true,
            'data' => WilayahDesa::kecamatanList(),
        ]);
    }

    /**
     * GET /api/wilayah/desa?kecamatan=Singaparna
     * Tanpa query: kembalikan peta kecamatan => [desa].
     * Dengan query: kembalikan list desa pada kecamatan tsb
     * (case-insensitive; tidak ketemu → list kosong).
     */
    public function desa(Request $request)
    {
        $map = WilayahDesa::dataDesa();
        $kecamatan = trim((string) $request->query('kecamatan', ''));

        if ($kecamatan === '') {
            return response()->json([
                'success' => true,
                'data' => $map,
            ]);
        }

        $list = [];
        foreach ($map as $nama => $desa) {
            if (strcasecmp($nama, $kecamatan) === 0) {
                $list = array_values($desa);
                $kecamatan = $nama;
                break;
            }
        }

        return response()->json([
            'success' => true,
            'data' => $list,
            'kecamatan' => $kecamatan,
        ]);
    }
}
