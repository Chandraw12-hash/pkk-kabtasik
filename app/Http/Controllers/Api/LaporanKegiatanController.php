<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LaporanKegiatan;
use App\Models\Pokja1;
use App\Models\Pokja2;
use App\Models\Pokja3;
use App\Models\Pokja4;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class LaporanKegiatanController extends Controller
{
    // ─── 🔥 PUBLIC: INDEX (HANYA YANG APPROVED) ────────────────────────────
    public function index(Request $request)
    {
        $query = LaporanKegiatan::with('user')
            ->where('status', 'approved')
            ->orderBy('created_at', 'desc');

        if ($request->pokja) {
            $query->where('kategori_pokja', $request->pokja);
        }

        if ($request->kecamatan) {
            $query->where('kecamatan', 'like', '%' . $request->kecamatan . '%');
        }

        if ($request->desa) {
            $query->where('desa_kelurahan', 'like', '%' . $request->desa . '%');
        }

        $laporans = $query->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $laporans
        ]);
    }

    // ============================================================
    // 🔥🔥🔥 ADMIN: INDEX SEMUA LAPORAN (PENDING, APPROVED, REJECTED)
    // ============================================================
    // Endpoint: GET /api/admin/laporan-kegiatan
    // Dipakai di mobile admin untuk halaman "Verifikasi Laporan"
    // ============================================================
    public function adminIndex(Request $request)
    {
        $query = LaporanKegiatan::with('user')
            ->orderBy('created_at', 'desc');

        // Filter optional (bisa dipakai di frontend untuk filter)
        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->pokja) {
            $query->where('kategori_pokja', $request->pokja);
        }
        if ($request->kecamatan) {
            $query->where('kecamatan', 'like', '%' . $request->kecamatan . '%');
        }
        if ($request->desa) {
            $query->where('desa_kelurahan', 'like', '%' . $request->desa . '%');
        }

        // 🔥 Admin: return SEMUA data (no pagination)
        $laporans = $query->get();

        return response()->json([
            'success' => true,
            'data' => $laporans,
        ]);
    }

    // ─── 🔥 PUBLIC: SHOW DETAIL ─────────────────────────────────────────────
    public function show($id)
    {
        $laporan = LaporanKegiatan::with('user')
            ->where('status', 'approved')
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $laporan
        ]);
    }

    // ─── 🔥 KADER: RIWAYAT LAPORAN SENDIRI ──────────────────────────────────
    public function myLaporan(Request $request)
    {
        $laporans = LaporanKegiatan::where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $laporans
        ]);
    }

    // ─── 🔥 KADER: DETAIL LAPORAN SENDIRI ───────────────────────────────────
    public function showMyLaporan(Request $request, $id)
    {
        $laporan = LaporanKegiatan::where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $laporan
        ]);
    }

    // ─── 🔥 KADER: SUBMIT LAPORAN ────────────────────────────────────────────
    public function store(Request $request)
    {
        if ($request->has('data_angka') && is_string($request->data_angka)) {
            $decoded = json_decode($request->data_angka, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $request->merge(['data_angka' => $decoded]);
            } else {
                return response()->json([
                    'error' => 'Format data_angka tidak valid: ' . json_last_error_msg()
                ], 422);
            }
        }

        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'kategori_pokja' => 'required|in:I,II,III,IV',
            'data_angka' => 'nullable|array',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'kecamatan' => 'nullable|string|max:255',
            'desa_kelurahan' => 'nullable|string|max:255',
            'nama_dasawisma' => 'nullable|string|max:255',
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('laporan-kegiatan', 'public');
        }

        $user = $request->user();

        $kecamatan = $validated['kecamatan'] ?? $user->kecamatan ?? null;
        $desaKelurahan = $validated['desa_kelurahan'] ?? $user->desa_kelurahan ?? null;
        $namaDasawisma = $validated['nama_dasawisma'] ?? $user->nama_dasawisma ?? null;

        if (empty($kecamatan)) {
            Log::warning('Laporan tanpa kecamatan dari user ID: ' . $user->id);
        }

        $dataAngka = $validated['data_angka'] ?? [];

        $pokjaFields = [
            'I' => ['pkbn_l', 'pkbn_p', 'pkdrt_l', 'pkdrt_p', 'pola_asuh_l', 'pola_asuh_p', 'lansia_l', 'lansia_p', 'kader_pokja1_l', 'kader_pokja1_p'],
            'II' => ['warga_buta_l', 'warga_buta_p', 'kelompok_belajar_paket_a', 'kelompok_belajar_paket_b', 'kelompok_belajar_paket_c', 'kf', 'paud', 'koperasi_berbadan_hukum'],
            'III' => ['rumah_sehat', 'rumah_tidak_sehat', 'pemanfaatan_pekarangan', 'industri_rumah_tangga'],
            'IV' => ['posyandu', 'akseptor_kb', 'phbs', 'jamban_keluarga'],
        ];

        $expectedFields = $pokjaFields[$validated['kategori_pokja']] ?? [];
        $filteredData = [];
        foreach ($expectedFields as $field) {
            $filteredData[$field] = $dataAngka[$field] ?? 0;
        }

        $isValid = false;
        foreach ($filteredData as $value) {
            if ($value > 0) {
                $isValid = true;
                break;
            }
        }

        if (!$isValid) {
            return response()->json([
                'error' => 'Data angka tidak valid. Minimal satu field harus diisi > 0.',
                'expected_fields' => $expectedFields,
            ], 422);
        }

        $dataAngka = $filteredData;

        $laporan = LaporanKegiatan::create([
            'user_id' => $user->id,
            'judul' => $validated['judul'],
            'deskripsi' => $validated['deskripsi'] ?? null,
            'kategori_pokja' => $validated['kategori_pokja'],
            'data_angka' => $dataAngka,
            'foto' => $fotoPath,
            'kecamatan' => $kecamatan,
            'desa_kelurahan' => $desaKelurahan,
            'nama_dasawisma' => $namaDasawisma,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Laporan berhasil dikirim.',
            'data' => $laporan,
        ], 201);
    }

    // ─── 🔥 KADER: UPDATE LAPORAN (HANYA PENDING) ────────────────────────────
    public function update(Request $request, $id)
    {
        $laporan = LaporanKegiatan::where('user_id', $request->user()->id)
            ->where('status', 'pending')
            ->findOrFail($id);

        $validated = $request->validate([
            'judul' => 'sometimes|string|max:255',
            'deskripsi' => 'nullable|string',
            'kategori_pokja' => 'sometimes|in:I,II,III,IV',
            'data_angka' => 'nullable|array',
            'kecamatan' => 'nullable|string|max:255',
            'desa_kelurahan' => 'nullable|string|max:255',
            'nama_dasawisma' => 'nullable|string|max:255',
        ]);

        if (isset($validated['data_angka']) && is_string($validated['data_angka'])) {
            $validated['data_angka'] = json_decode($validated['data_angka'], true);
        }

        $laporan->update($validated);

        return response()->json([
            'message' => 'Laporan berhasil diperbarui.',
            'data' => $laporan,
        ]);
    }

    // ─── 🔥 KADER: HAPUS LAPORAN (HANYA PENDING) ────────────────────────────
    public function destroy(Request $request, $id)
    {
        $laporan = LaporanKegiatan::where('user_id', $request->user()->id)
            ->where('status', 'pending')
            ->findOrFail($id);

        if ($laporan->foto) {
            Storage::disk('public')->delete($laporan->foto);
        }

        $laporan->delete();

        return response()->json([
            'message' => 'Laporan berhasil dihapus.',
        ]);
    }

    // ============================================================
    // 🔥 APPROVE & REJECT LAPORAN (ADMIN)
    // ============================================================

    public function approve(Request $request, $id)
    {
        try {
            $laporan = LaporanKegiatan::findOrFail($id);

            if ($laporan->status === 'approved') {
                return response()->json([
                    'success' => false,
                    'message' => 'Laporan ini sudah disetujui sebelumnya.',
                ], 400);
            }

            $laporan->update([
                'status' => 'approved',
                'reviewed_at' => now(),
                'reviewed_by' => $request->user()->id,
            ]);

            $this->sinkronkanKePokja($laporan);

            Log::info('✅ Laporan #' . $id . ' di-APPROVE oleh user #' . $request->user()->id);

            return response()->json([
                'success' => true,
                'message' => 'Laporan berhasil disetujui dan data Pokja telah disinkronkan.',
                'data' => $laporan->fresh(['user']),
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Laporan tidak ditemukan.',
            ], 404);
        } catch (\Exception $e) {
            Log::error('❌ Error approve laporan: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal approve: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function reject(Request $request, $id)
    {
        try {
            $laporan = LaporanKegiatan::findOrFail($id);

            if ($laporan->status === 'rejected') {
                return response()->json([
                    'success' => false,
                    'message' => 'Laporan ini sudah ditolak sebelumnya.',
                ], 400);
            }

            $request->validate([
                'alasan' => 'nullable|string|max:500',
            ]);

            $laporan->update([
                'status' => 'rejected',
                'reviewed_at' => now(),
                'reviewed_by' => $request->user()->id,
            ]);

            Log::info('❌ Laporan #' . $id . ' di-REJECT oleh user #' . $request->user()->id);

            return response()->json([
                'success' => true,
                'message' => 'Laporan berhasil ditolak.',
                'data' => $laporan->fresh(['user']),
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Laporan tidak ditemukan.',
            ], 404);
        } catch (\Exception $e) {
            Log::error('❌ Error reject laporan: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal reject: ' . $e->getMessage(),
            ], 500);
        }
    }

    // ─── 🔥 SINKRONKAN KE POKJA ──────────────────────────────────────────────
    private function sinkronkanKePokja(LaporanKegiatan $laporan)
    {
        $kecamatan = $laporan->kecamatan;
        if (empty($kecamatan)) {
            Log::warning('Sinkronisasi gagal: kecamatan kosong untuk laporan ID: ' . $laporan->id);
            return;
        }

        $dataAngka = $laporan->data_angka;
        if (is_string($dataAngka)) {
            $dataAngka = json_decode($dataAngka, true);
        }
        if (is_string($dataAngka)) {
            $dataAngka = json_decode($dataAngka, true);
        }

        if (!is_array($dataAngka) || empty($dataAngka)) {
            Log::warning('Sinkronisasi gagal: data_angka kosong untuk laporan ID: ' . $laporan->id);
            return;
        }

        if (count($dataAngka) === 1 && isset($dataAngka['_dummy'])) {
            Log::warning('⚠️ data_angka hanya dummy, skip sinkronisasi:', [
                'laporan_id' => $laporan->id,
            ]);
            return;
        }

        Log::info('Sinkronisasi Pokja ' . $laporan->kategori_pokja . ' untuk kecamatan: ' . $kecamatan);

        switch ($laporan->kategori_pokja) {
            case 'I':
                $this->sinkronkanPokja1($kecamatan, $dataAngka);
                break;
            case 'II':
                $this->sinkronkanPokja2($kecamatan, $dataAngka);
                break;
            case 'III':
                $this->sinkronkanPokja3($kecamatan, $dataAngka);
                break;
            case 'IV':
                $this->sinkronkanPokja4($kecamatan, $dataAngka);
                break;
            default:
                Log::warning('Kategori Pokja tidak dikenal: ' . $laporan->kategori_pokja);
        }
    }

    // ─── SINKRON POKJA 1 ──────────────────────────────────────────────────────
    private function sinkronkanPokja1($kecamatan, $data)
    {
        $pokja = Pokja1::firstOrNew(['kecamatan' => $kecamatan]);

        $pokja->pkbn_l = ($pokja->pkbn_l ?? 0) + ($data['pkbn_l'] ?? 0);
        $pokja->pkbn_p = ($pokja->pkbn_p ?? 0) + ($data['pkbn_p'] ?? 0);
        $pokja->pkdrt_l = ($pokja->pkdrt_l ?? 0) + ($data['pkdrt_l'] ?? 0);
        $pokja->pkdrt_p = ($pokja->pkdrt_p ?? 0) + ($data['pkdrt_p'] ?? 0);
        $pokja->pola_asuh_l = ($pokja->pola_asuh_l ?? 0) + ($data['pola_asuh_l'] ?? 0);
        $pokja->pola_asuh_p = ($pokja->pola_asuh_p ?? 0) + ($data['pola_asuh_p'] ?? 0);
        $pokja->lansia_l = ($pokja->lansia_l ?? 0) + ($data['lansia_l'] ?? 0);
        $pokja->lansia_p = ($pokja->lansia_p ?? 0) + ($data['lansia_p'] ?? 0);
        $pokja->kader_pokja1_l = ($pokja->kader_pokja1_l ?? 0) + ($data['kader_pokja1_l'] ?? 0);
        $pokja->kader_pokja1_p = ($pokja->kader_pokja1_p ?? 0) + ($data['kader_pokja1_p'] ?? 0);

        $pokja->nama_kecamatan = $kecamatan;
        $pokja->kategori = 'Pokja I';
        $pokja->judul_kegiatan = "Rekapitulasi Pokja I - $kecamatan";
        $pokja->deskripsi = "Data rekapitulasi otomatis dari laporan mobile";
        $pokja->save();

        Log::info('Pokja 1 berhasil disinkronkan untuk: ' . $kecamatan);
    }

    // ─── SINKRON POKJA 2 ──────────────────────────────────────────────────────
    private function sinkronkanPokja2($kecamatan, $data)
    {
        $pokja = Pokja2::firstOrNew(['kecamatan' => $kecamatan]);

        $pokja->warga_buta_l = ($pokja->warga_buta_l ?? 0) + ($data['warga_buta_l'] ?? 0);
        $pokja->warga_buta_p = ($pokja->warga_buta_p ?? 0) + ($data['warga_buta_p'] ?? 0);
        $pokja->kelompok_belajar_paket_a = ($pokja->kelompok_belajar_paket_a ?? 0) + ($data['kelompok_belajar_paket_a'] ?? 0);
        $pokja->kelompok_belajar_paket_b = ($pokja->kelompok_belajar_paket_b ?? 0) + ($data['kelompok_belajar_paket_b'] ?? 0);
        $pokja->kelompok_belajar_paket_c = ($pokja->kelompok_belajar_paket_c ?? 0) + ($data['kelompok_belajar_paket_c'] ?? 0);
        $pokja->kf = ($pokja->kf ?? 0) + ($data['kf'] ?? 0);
        $pokja->paud = ($pokja->paud ?? 0) + ($data['paud'] ?? 0);
        $pokja->koperasi_berbadan_hukum = ($pokja->koperasi_berbadan_hukum ?? 0) + ($data['koperasi_berbadan_hukum'] ?? 0);

        $pokja->nama_kecamatan = $kecamatan;
        $pokja->kategori = 'Pokja II';
        $pokja->judul_kegiatan = "Rekapitulasi Pokja II - $kecamatan";
        $pokja->deskripsi = "Data rekapitulasi otomatis dari laporan mobile";
        $pokja->save();

        Log::info('Pokja 2 berhasil disinkronkan untuk: ' . $kecamatan);
    }

    // ─── SINKRON POKJA 3 ──────────────────────────────────────────────────────
    private function sinkronkanPokja3($kecamatan, $data)
    {
        $pokja = Pokja3::firstOrNew(['kecamatan' => $kecamatan]);

        $pokja->rumah_sehat = ($pokja->rumah_sehat ?? 0) + ($data['rumah_sehat'] ?? 0);
        $pokja->rumah_tidak_sehat = ($pokja->rumah_tidak_sehat ?? 0) + ($data['rumah_tidak_sehat'] ?? 0);
        $pokja->pemanfaatan_pekarangan = ($pokja->pemanfaatan_pekarangan ?? 0) + ($data['pemanfaatan_pekarangan'] ?? 0);
        $pokja->industri_rumah_tangga = ($pokja->industri_rumah_tangga ?? 0) + ($data['industri_rumah_tangga'] ?? 0);

        $pokja->nama_kecamatan = $kecamatan;
        $pokja->kategori = 'Pokja III';
        $pokja->judul_kegiatan = "Rekapitulasi Pokja III - $kecamatan";
        $pokja->deskripsi = "Data rekapitulasi otomatis dari laporan mobile";
        $pokja->save();

        Log::info('Pokja 3 berhasil disinkronkan untuk: ' . $kecamatan);
    }

    // ─── SINKRON POKJA 4 ──────────────────────────────────────────────────────
    private function sinkronkanPokja4($kecamatan, $data)
    {
        $pokja = Pokja4::firstOrNew(['kecamatan' => $kecamatan]);

        $pokja->posyandu = ($pokja->posyandu ?? 0) + ($data['posyandu'] ?? 0);
        $pokja->akseptor_kb = ($pokja->akseptor_kb ?? 0) + ($data['akseptor_kb'] ?? 0);
        $pokja->phbs = ($pokja->phbs ?? 0) + ($data['phbs'] ?? 0);
        $pokja->jamban_keluarga = ($pokja->jamban_keluarga ?? 0) + ($data['jamban_keluarga'] ?? 0);

        $pokja->nama_kecamatan = $kecamatan;
        $pokja->kategori = 'Pokja IV';
        $pokja->judul_kegiatan = "Rekapitulasi Pokja IV - $kecamatan";
        $pokja->deskripsi = "Data rekapitulasi otomatis dari laporan mobile";
        $pokja->save();

        Log::info('Pokja 4 berhasil disinkronkan untuk: ' . $kecamatan);
    }
}
