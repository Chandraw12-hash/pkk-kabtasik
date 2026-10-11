<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Database\Seeders\AdminDesaSeeder;
use Illuminate\Http\Request;

class WilayahController extends Controller
{
    /**
     * GET /api/wilayah/kecamatan
     * Master 39 kecamatan Kab. Tasikmalaya (public).
     */
    public function kecamatan()
    {
        return response()->json([
            'success' => true,
            'data' => array_keys(AdminDesaSeeder::DATA_DESA),
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
        $map = AdminDesaSeeder::DATA_DESA;
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
