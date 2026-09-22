<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RekapKegiatanWarga;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RekapKegiatanWargaApiController extends Controller
{
    /**
     * GET /api/rekap-kegiatan-warga
     */
    public function index(Request $request)
    {
        $query = RekapKegiatanWarga::query();

        if ($request->filled('tahun')) {
            $query->where('tahun', $request->tahun);
        }

        if ($request->filled('level')) {
            $query->where('level', $request->level);
        }

        if ($request->filled('wilayah_id')) {
            $query->where('wilayah_id', $request->wilayah_id);
        }

        if ($request->filled('kecamatan')) {
            $query->where('kecamatan', $request->kecamatan);
        }

        if ($request->filled('desa')) {
            $query->where('desa', $request->desa);
        }

        if ($request->filled('dusun')) {
            $query->where('dusun', $request->dusun);
        }

        if ($request->filled('rw')) {
            $query->where('rw', $request->rw);
        }

        if ($request->filled('rt')) {
            $query->where('rt', $request->rt);
        }

        $data = $query->orderBy('tahun', 'desc')
            ->orderBy('kecamatan')
            ->orderBy('desa')
            ->orderBy('dusun')
            ->orderBy('rw')
            ->orderBy('rt')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    /**
     * POST /api/rekap-kegiatan-warga
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tahun' => 'required|integer|min:2020|max:2100',
            'level' => 'required|in:kecamatan,desa,dusun,rw,rt,dasa_wisma',
            'wilayah_id' => 'nullable|integer',
            'kecamatan' => 'nullable|string|max:255',
            'nama_kecamatan' => 'nullable|string|max:255',
            'desa' => 'nullable|string|max:255',
            'nama_desa' => 'nullable|string|max:255',
            'dusun' => 'nullable|string|max:255',
            'nama_dusun' => 'nullable|string|max:255',
            'rw' => 'nullable|string|max:10',
            'rt' => 'nullable|string|max:10',
            'jumlah_dusun' => 'nullable|integer|min:0',
            'jumlah_rw' => 'nullable|integer|min:0',
            'jumlah_rt' => 'nullable|integer|min:0',
            'jumlah_dasa_wisma' => 'nullable|integer|min:0',
            'jumlah_krt' => 'nullable|integer|min:0',
            'jumlah_kk' => 'nullable|integer|min:0',
            'total_l' => 'nullable|integer|min:0',
            'total_p' => 'nullable|integer|min:0',
            'balita_l' => 'nullable|integer|min:0',
            'balita_p' => 'nullable|integer|min:0',
            'pus' => 'nullable|integer|min:0',
            'wus' => 'nullable|integer|min:0',
            'ibu_hamil' => 'nullable|integer|min:0',
            'ibu_menyusui' => 'nullable|integer|min:0',
            'lansia' => 'nullable|integer|min:0',
            'buta_l' => 'nullable|integer|min:0',
            'buta_p' => 'nullable|integer|min:0',
            'rumah_sehat' => 'nullable|integer|min:0',
            'rumah_kurang_sehat' => 'nullable|integer|min:0',
            'memiliki_tempat_sampah' => 'nullable|integer|min:0',
            'memiliki_spal' => 'nullable|integer|min:0',
            'memiliki_stiker_p4k' => 'nullable|integer|min:0',
            'air_pdam' => 'nullable|integer|min:0',
            'air_sumur' => 'nullable|integer|min:0',
            'air_sungai' => 'nullable|integer|min:0',
            'air_dll' => 'nullable|integer|min:0',
            'jumlah_jamban_keluarga' => 'nullable|integer|min:0',
            'makanan_pokok_beras' => 'nullable|integer|min:0',
            'makanan_pokok_non_beras' => 'nullable|integer|min:0',
            'kegiatan_up2k' => 'nullable|integer|min:0',
            'kegiatan_tanah_pekarangan' => 'nullable|integer|min:0',
            'kegiatan_industri_rumah_tangga' => 'nullable|integer|min:0',
            'kegiatan_kesehatan_lingkungan' => 'nullable|integer|min:0',
            'keterangan' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = RekapKegiatanWarga::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Data berhasil disimpan',
            'data' => $data,
        ], 201);
    }

    /**
     * GET /api/rekap-kegiatan-warga/{id}
     */
    public function show($id)
    {
        $data = RekapKegiatanWarga::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    /**
     * PUT /api/rekap-kegiatan-warga/{id}
     */
    public function update(Request $request, $id)
    {
        $data = RekapKegiatanWarga::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak ditemukan',
            ], 404);
        }

        $data->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Data berhasil diupdate',
            'data' => $data,
        ]);
    }

    /**
     * DELETE /api/rekap-kegiatan-warga/{id}
     */
    public function destroy($id)
    {
        $data = RekapKegiatanWarga::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak ditemukan',
            ], 404);
        }

        $data->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data berhasil dihapus',
        ]);
    }

    /**
     * GET /api/rekap-kegiatan-warga/rekap
     */
    public function rekap(Request $request)
    {
        $tahun = $request->get('tahun', date('Y'));
        $level = $request->get('level', 'kecamatan');

        $data = RekapKegiatanWarga::where('tahun', $tahun)
            ->where('level', $level)
            ->get();

        return response()->json([
            'success' => true,
            'tahun' => $tahun,
            'level' => $level,
            'data' => $data,
        ]);
    }
}
