<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RekapBumil;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RekapBumilApiController extends Controller
{
    /**
     * GET /api/rekap-bumil
     */
    public function index(Request $request)
    {
        $query = RekapBumil::query();

        if ($request->filled('tahun')) {
            $query->where('tahun', $request->tahun);
        }

        if ($request->filled('bulan')) {
            $query->where('bulan', $request->bulan);
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

        $data = $query->orderBy('tahun', 'desc')
            ->orderBy('bulan')
            ->orderBy('kecamatan')
            ->orderBy('desa')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    /**
     * POST /api/rekap-bumil
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tahun' => 'required|integer|min:2020|max:2100',
            'bulan' => 'required|integer|min:1|max:12',
            'nama_bulan' => 'nullable|string|max:20',
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
            'nama_dasawisma' => 'nullable|string|max:255',
            'jumlah_dusun' => 'nullable|integer|min:0',
            'jumlah_rw' => 'nullable|integer|min:0',
            'jumlah_rt' => 'nullable|integer|min:0',
            'jumlah_dasa_wisma' => 'nullable|integer|min:0',
            'ibu_hamil' => 'nullable|integer|min:0',
            'ibu_melahirkan' => 'nullable|integer|min:0',
            'ibu_nifas' => 'nullable|integer|min:0',
            'ibu_meninggal' => 'nullable|integer|min:0',
            'bayi_lahir_l' => 'nullable|integer|min:0',
            'bayi_lahir_p' => 'nullable|integer|min:0',
            'akte_ada' => 'nullable|integer|min:0',
            'akte_tidak_ada' => 'nullable|integer|min:0',
            'bayi_meninggal_l' => 'nullable|integer|min:0',
            'bayi_meninggal_p' => 'nullable|integer|min:0',
            'balita_meninggal_l' => 'nullable|integer|min:0',
            'balita_meninggal_p' => 'nullable|integer|min:0',
            'keterangan' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Anti-dobel: wilayah_id + tahun + bulan + level
        $exists = RekapBumil::where('wilayah_id', $request->wilayah_id)
            ->where('tahun', $request->tahun)
            ->where('bulan', $request->bulan)
            ->where('level', $request->level)
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Data sudah ada untuk wilayah, tahun, bulan, dan level yang sama',
            ], 409);
        }

        $data = RekapBumil::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Data berhasil disimpan',
            'data' => $data,
        ], 201);
    }

    /**
     * GET /api/rekap-bumil/{id}
     */
    public function show($id)
    {
        $data = RekapBumil::find($id);

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
     * PUT /api/rekap-bumil/{id}
     */
    public function update(Request $request, $id)
    {
        $data = RekapBumil::find($id);

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
     * DELETE /api/rekap-bumil/{id}
     */
    public function destroy($id)
    {
        $data = RekapBumil::find($id);

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
     * GET /api/rekap-bumil/rekap
     */
    public function rekap(Request $request)
    {
        $tahun = $request->get('tahun', date('Y'));
        $bulan = $request->get('bulan');
        $level = $request->get('level', 'kecamatan');

        $query = RekapBumil::where('tahun', $tahun)
            ->where('level', $level);

        if ($bulan) {
            $query->where('bulan', $bulan);
        }

        $data = $query->get();

        return response()->json([
            'success' => true,
            'tahun' => $tahun,
            'bulan' => $bulan,
            'level' => $level,
            'data' => $data,
        ]);
    }
}
