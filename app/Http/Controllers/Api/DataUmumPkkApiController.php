<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DataUmumPkk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DataUmumPkkApiController extends Controller
{
    /**
     * GET /api/data-umum-pkk
     * List data umum PKK — filter tahun, level, wilayah
     */
    public function index(Request $request)
    {
        $query = DataUmumPkk::query();

        // Filter tahun
        if ($request->filled('tahun')) {
            $query->where('tahun', $request->tahun);
        }

        // Filter level
        if ($request->filled('level')) {
            $query->where('level', $request->level);
        }

        // Filter wilayah
        if ($request->filled('wilayah_id')) {
            $query->where('wilayah_id', $request->wilayah_id);
        }

        if ($request->filled('kecamatan')) {
            $query->where('kecamatan', $request->kecamatan);
        }

        if ($request->filled('desa')) {
            $query->where('desa', $request->desa);
        }

        $data = $query->orderBy('tahun', 'desc')
            ->orderBy('kecamatan')
            ->orderBy('desa')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    /**
     * POST /api/data-umum-pkk
     * Simpan data umum PKK baru
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
            'jumlah_dusun' => 'nullable|integer|min:0',
            'jumlah_pkk_rw' => 'nullable|integer|min:0',
            'jumlah_pkk_rt' => 'nullable|integer|min:0',
            'jumlah_dasa_wisma' => 'nullable|integer|min:0',
            'jumlah_krt' => 'nullable|integer|min:0',
            'jumlah_kk' => 'nullable|integer|min:0',
            'jiwa_l' => 'nullable|integer|min:0',
            'jiwa_p' => 'nullable|integer|min:0',
            'jiwa_tidak_terpilah' => 'nullable|integer|min:0',
            'tp_pkk_l' => 'nullable|integer|min:0',
            'tp_pkk_p' => 'nullable|integer|min:0',
            'kader_umum_l' => 'nullable|integer|min:0',
            'kader_umum_p' => 'nullable|integer|min:0',
            'kader_khusus_l' => 'nullable|integer|min:0',
            'kader_khusus_p' => 'nullable|integer|min:0',
            'sekretariat_honorer_l' => 'nullable|integer|min:0',
            'sekretariat_honorer_p' => 'nullable|integer|min:0',
            'sekretariat_bantuan_l' => 'nullable|integer|min:0',
            'sekretariat_bantuan_p' => 'nullable|integer|min:0',
            'keterangan' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Anti-dobel: cek kombinasi wilayah_id + tahun + level
        $exists = DataUmumPkk::where('wilayah_id', $request->wilayah_id)
            ->where('tahun', $request->tahun)
            ->where('level', $request->level)
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Data sudah ada untuk wilayah, tahun, dan level yang sama',
            ], 409);
        }

        $data = DataUmumPkk::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Data berhasil disimpan',
            'data' => $data,
        ], 201);
    }

    /**
     * GET /api/data-umum-pkk/{id}
     * Detail data umum PKK
     */
    public function show($id)
    {
        $data = DataUmumPkk::find($id);

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
     * PUT /api/data-umum-pkk/{id}
     * Update data umum PKK
     */
    public function update(Request $request, $id)
    {
        $data = DataUmumPkk::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak ditemukan',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'tahun' => 'sometimes|integer|min:2020|max:2100',
            'level' => 'sometimes|in:kecamatan,desa,dusun,rw,rt,dasa_wisma',
            'wilayah_id' => 'nullable|integer',
            'kecamatan' => 'nullable|string|max:255',
            'nama_kecamatan' => 'nullable|string|max:255',
            'desa' => 'nullable|string|max:255',
            'nama_desa' => 'nullable|string|max:255',
            'dusun' => 'nullable|string|max:255',
            'nama_dusun' => 'nullable|string|max:255',
            'jumlah_dusun' => 'nullable|integer|min:0',
            'jumlah_pkk_rw' => 'nullable|integer|min:0',
            'jumlah_pkk_rt' => 'nullable|integer|min:0',
            'jumlah_dasa_wisma' => 'nullable|integer|min:0',
            'jumlah_krt' => 'nullable|integer|min:0',
            'jumlah_kk' => 'nullable|integer|min:0',
            'jiwa_l' => 'nullable|integer|min:0',
            'jiwa_p' => 'nullable|integer|min:0',
            'jiwa_tidak_terpilah' => 'nullable|integer|min:0',
            'tp_pkk_l' => 'nullable|integer|min:0',
            'tp_pkk_p' => 'nullable|integer|min:0',
            'kader_umum_l' => 'nullable|integer|min:0',
            'kader_umum_p' => 'nullable|integer|min:0',
            'kader_khusus_l' => 'nullable|integer|min:0',
            'kader_khusus_p' => 'nullable|integer|min:0',
            'sekretariat_honorer_l' => 'nullable|integer|min:0',
            'sekretariat_honorer_p' => 'nullable|integer|min:0',
            'sekretariat_bantuan_l' => 'nullable|integer|min:0',
            'sekretariat_bantuan_p' => 'nullable|integer|min:0',
            'keterangan' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Data berhasil diupdate',
            'data' => $data,
        ]);
    }

    /**
     * DELETE /api/data-umum-pkk/{id}
     * Hapus data umum PKK
     */
    public function destroy($id)
    {
        $data = DataUmumPkk::find($id);

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
     * GET /api/data-umum-pkk/rekap
     * Roll-up: RT → RW → Dusun → Desa → Kecamatan
     */
    public function rekap(Request $request)
    {
        $tahun = $request->get('tahun', date('Y'));
        $level = $request->get('level', 'kecamatan');

        $data = DataUmumPkk::where('tahun', $tahun)
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
