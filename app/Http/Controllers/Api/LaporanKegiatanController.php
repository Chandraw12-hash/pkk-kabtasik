<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LaporanKegiatan;
use App\Models\Pokja1;
use App\Models\Pokja2;
use App\Models\Pokja3;
use App\Models\Pokja4;
use App\Models\Pokja4KunjunganPyd;
use App\Models\Pokja4KegiatanPosyandu;
use App\Models\Pokja4Rekapitulasi;
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
    public function adminIndex(Request $request)
    {
        $query = LaporanKegiatan::with('user')
            ->orderBy('created_at', 'desc');

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
            'kategori_pokja' => 'required|in:I,II,III,IV,IV-PYD,IV-POSYANDU,IV-REKAP',
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

        if (!$user->canSubmitPokjaKategori($validated['kategori_pokja'])) {
            return response()->json([
                'success' => false,
                'message' => 'Akun ini hanya boleh mengirim data ' . implode(', ', $user->allowedPokjaKategori() ?? []) . '.',
                'allowed_kategori' => $user->allowedPokjaKategori() ?? [],
            ], 403);
        }

        $kecamatan = $validated['kecamatan'] ?? $user->kecamatan ?? null;
        $desaKelurahan = $validated['desa_kelurahan'] ?? $user->desa_kelurahan ?? null;
        $namaDasawisma = $validated['nama_dasawisma'] ?? $user->nama_dasawisma ?? null;

        if (empty($kecamatan)) {
            Log::warning('Laporan tanpa kecamatan dari user ID: ' . $user->id);
        }

        $dataAngka = $validated['data_angka'] ?? [];

        // ✅ FIX: Pokja I, II, III, IV + 3 sheet baru
        $pokjaFields = [
            'I' => [
                'kader_umum',
                'kader_khusus',
                'kisah_kegiatan',
                'kisah_volume',
                'kisah_metode',
                'kisah_sasaran',
                'kilas_kegiatan',
                'kilas_volume',
                'kilas_metode',
                'kilas_sasaran',
                'krisan_kegiatan',
                'krisan_volume',
                'krisan_metode',
                'krisan_sasaran',
                'kiat_kegiatan',
                'kiat_volume',
                'kiat_metode',
                'kiat_sasaran',
                'kisak_kegiatan',
                'kisak_volume',
                'kisak_metode',
                'kisak_sasaran',
                'pkbn_kegiatan',
                'pkbn_volume',
                'pkbn_metode',
                'pkbn_sasaran',
                'keterangan',
            ],
            'II' => [
                'warga_buta_l',
                'warga_buta_p',
                'kelompok_belajar_paket_a',
                'kelompok_belajar_paket_b',
                'kelompok_belajar_paket_c',
                'kf',
                'paud',
                'koperasi_berbadan_hukum',
                'warga_belajar_paket_a',
                'warga_belajar_paket_b',
                'warga_belajar_paket_c',
                'warga_belajar_kf',
                'taman_bacaan',
                'kelompok_bkb',
                'peserta_bkb',
                'ape_bkb',
                'kelompok_simulasi_bkb',
                'tutor_kf',
                'tutor_paud',
                'kader_bkb',
                'kelompok_kader_koperasi',
                'kader_keterampilan',
                'kader_dilatih_pengelolaan',
                'kader_dilatih_tp_pkk',
                'kader_dilatih_damas',
                'up2k_pemula_kelompok',
                'up2k_pemula_peserta',
                'up2k_madya_kelompok',
                'up2k_madya_peserta',
                'up2k_utama_kelompok',
                'up2k_utama_peserta',
                'up2k_mandiri_kelompok',
                'up2k_mandiri_peserta',
                'anggota_koperasi',

                // ✅ TAMBAH 5 FIELD BARU
                'ibu_set_bkb',
                'lp3_pkk',
                'tp3_pkk',
                'damas_pkk',
                'keterangan',
            ],
            'III' => [
                'rumah_sehat',
                'rumah_tidak_sehat',
                'pemanfaatan_pekarangan',
                'industri_rumah_tangga',
                'jumlah_kader',
                'jumlah_kader_p',
                'makanan_pokok',
                'hatinya_pkk',
                'jumlah_rumah',

                // ✅ Rincian format resmi 20 kolom (web + Android)
                'kader_tata_laksana',
                'makanan_non_beras',
                'peternakan',
                'perikanan',
                'warung_hidup',
                'lumbung_hidup',
                'toga',
                'tanaman_keras',
                'tanaman_lainnya',
                'industri_pangan',
                'industri_sandang',
                'industri_jasa',

                'keterangan',
            ],
            'IV' => [
                'posyandu',
                'akseptor_kb',
                'phbs',
                'jamban_keluarga',
                'kader_kesehatan',
                'kader_gizi',
                'kader_kesling',
                'kader_phbs',
                'kader_kb',
                'imunisasi',
                'pkg',
                'tbc',
                'spal',
                'tps',
                'mck',
                'air_pdam',
                'air_sumur',
                'air_lainnya',
                'jumlah_pus',
                'jumlah_wus',
                'akseptor_kb_l',
                'akseptor_kb_p',
                'tabungan_keluarga',
                'asuransi_kesehatan',
                'program_kesehatan',
                'program_lingkungan',
                'program_perencanaan',
                'keterangan',
            ],
            'IV-PYD' => [
                'bulan',
                'tahun',
                'bayi_0_12_l',
                'bayi_0_12_p',
                'bayi_0_12_laki_l',
                'bayi_0_12_laki_p',
                'balita_1_5_l',
                'balita_1_5_p',
                'balita_1_5_laki_l',
                'balita_1_5_laki_p',
                'wus',
                'pus',
                'ibu_hamil',
                'ibu_menyusui',
                'bayi_lahir',
                'bayi_meninggal',
                'kematian_ibu',
                'petugas_kader',
                'petugas_plkb',
                'petugas_medis',
                'keterangan',
            ],
            'IV-POSYANDU' => [
                'bulan',
                'tahun',
                'ibu_hamil',
                'ibu_hamil_diperiksa',
                'ibu_hamil_dapat_fe',
                'menyusui',
                'kb_iud',
                'kb_mow',
                'kb_mop',
                'kb_implan',
                'kb_pil',
                'kb_suntik',
                'kb_kondom',
                'balita_l',
                'balita_p',
                'balita_kia_l',
                'balita_kia_p',
                'balita_ditimbang_l',
                'balita_ditimbang_p',
                'balita_naik_l',
                'balita_naik_p',
                'vit_a_1',
                'vit_a_2',
                'imunisasi_tt_1',
                'imunisasi_tt_2',
                'imunisasi_bcg',
                'imunisasi_dpt_1',
                'imunisasi_dpt_2',
                'imunisasi_dpt_3',
                'imunisasi_polio_1',
                'imunisasi_polio_2',
                'imunisasi_polio_3',
                'imunisasi_polio_4',
                'imunisasi_campak',
                'imunisasi_hepatitis_1',
                'imunisasi_hepatitis_2',
                'imunisasi_hepatitis_3',
                'balita_diare',
                'balita_oralit',
                'keterangan',
            ],
            'IV-REKAP' => [
                'tahun',
                'dusun',
                'rw',
                'rt',
                'dasa_wisma',
                'ibu_hamil',
                'ibu_melahirkan',
                'ibu_nifas',
                'ibu_meninggal',
                'bayi_lahir_l',
                'bayi_lahir_p',
                'akte_ada',
                'akte_tidak',
                'bayi_meninggal_l',
                'bayi_meninggal_p',
                'balita_meninggal_l',
                'balita_meninggal_p',
                'keterangan',
            ],
        ];

        $expectedFields = $pokjaFields[$validated['kategori_pokja']] ?? [];
        $filteredData = [];
        foreach ($expectedFields as $field) {
            $filteredData[$field] = $dataAngka[$field] ?? 0;
        }

        // ✅ Pokja III: terjemahkan alias key baru dari aplikasi Android
        // (jumlah_kader_pangan, pangan_beras, pangan_peternakan, ...) ke nama
        // kolom DB. Tanpa ini, whitelist di atas membuang semua key baru
        // sehingga laporan tersimpan 0 walau di HP sudah diisi.
        if ($validated['kategori_pokja'] === 'III') {
            $aliasMap = [
                'jumlah_kader' => ['jumlah_kader_pangan', 'jumlah_kader'],
                'jumlah_kader_p' => ['jumlah_kader_sandang', 'jumlah_kader_p'],
                'makanan_pokok' => ['pangan_beras', 'makanan_pokok'],
                'makanan_non_beras' => ['pangan_non_beras', 'makanan_non_beras'],
                'kader_tata_laksana' => ['jumlah_kader_tata_laksana', 'kader_tata_laksana'],
                'peternakan' => ['pangan_peternakan', 'peternakan'],
                'perikanan' => ['pangan_perikanan', 'perikanan'],
                'warung_hidup' => ['pangan_warung_hidup', 'warung_hidup'],
                'lumbung_hidup' => ['pangan_lumbung_hidup', 'lumbung_hidup'],
                'toga' => ['pangan_toga', 'toga'],
                'tanaman_keras' => ['pangan_tanaman_keras', 'tanaman_keras'],
                'tanaman_lainnya' => ['pangan_tanaman_lainnya', 'tanaman_lainnya'],
            ];
            foreach ($aliasMap as $kolom => $aliases) {
                foreach ($aliases as $alias) {
                    if (isset($dataAngka[$alias]) && is_numeric($dataAngka[$alias]) && (int) $dataAngka[$alias] !== 0) {
                        $filteredData[$kolom] = (int) $dataAngka[$alias];
                        break;
                    }
                }
            }
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
            'kategori_pokja' => 'sometimes|in:I,II,III,IV,IV-PYD,IV-POSYANDU,IV-REKAP',
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
                $tahun = $laporan->created_at ? $laporan->created_at->year : now()->year;
                $this->sinkronkanPokja1($kecamatan, $dataAngka, $tahun);
                break;
            case 'II':
                $this->sinkronkanPokja2($kecamatan, $dataAngka);
                break;
            case 'III':
                $this->sinkronkanPokja3($kecamatan, $dataAngka);
                break;
            case 'IV':
                $tahun = $laporan->created_at ? $laporan->created_at->year : now()->year;
                $this->sinkronkanPokja4($kecamatan, $dataAngka, $tahun);
                break;
            case 'IV-PYD':
                $this->sinkronkanKunjunganPyd($kecamatan, $dataAngka);
                break;
            case 'IV-POSYANDU':
                $this->sinkronkanKegiatanPosyandu($kecamatan, $dataAngka);
                break;
            case 'IV-REKAP':
                $this->sinkronkanRekapitulasi($kecamatan, $dataAngka);
                break;
            default:
                Log::warning('Kategori Pokja tidak dikenal: ' . $laporan->kategori_pokja);
        }
    }

    // ─── SINKRON POKJA 1 ──────────────────────────────────────────────────────
    private function sinkronkanPokja1($kecamatan, $data, int $tahun)
    {
        $pokja = Pokja1::firstOrNew(['kecamatan' => $kecamatan]);
        $pokja->tahun = $pokja->tahun ?? $tahun;

        $pokja->kader_umum = ($pokja->kader_umum ?? 0) + ($data['kader_umum'] ?? 0);
        $pokja->kader_khusus = ($pokja->kader_khusus ?? 0) + ($data['kader_khusus'] ?? 0);

        $programs = ['kisah', 'kilas', 'krisan', 'kiat', 'kisak', 'pkbn'];

        foreach ($programs as $prog) {
            if (isset($data["{$prog}_kegiatan"]) && !empty($data["{$prog}_kegiatan"])) {
                $pokja->{"{$prog}_kegiatan"} = $data["{$prog}_kegiatan"];
            }

            $pokja->{"{$prog}_volume"} = ($pokja->{"{$prog}_volume"} ?? 0)
                + (int)($data["{$prog}_volume"] ?? 0);

            if (isset($data["{$prog}_metode"]) && !empty($data["{$prog}_metode"])) {
                $pokja->{"{$prog}_metode"} = $data["{$prog}_metode"];
            }

            $pokja->{"{$prog}_sasaran"} = ($pokja->{"{$prog}_sasaran"} ?? 0)
                + (int)($data["{$prog}_sasaran"] ?? 0);
        }

        if (isset($data['keterangan']) && !empty($data['keterangan'])) {
            $pokja->keterangan = $data['keterangan'];
        }

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

        // Field Lama
        $pokja->warga_buta_l = ($pokja->warga_buta_l ?? 0) + ($data['warga_buta_l'] ?? 0);
        $pokja->warga_buta_p = ($pokja->warga_buta_p ?? 0) + ($data['warga_buta_p'] ?? 0);
        $pokja->kelompok_belajar_paket_a = ($pokja->kelompok_belajar_paket_a ?? 0) + ($data['kelompok_belajar_paket_a'] ?? 0);
        $pokja->kelompok_belajar_paket_b = ($pokja->kelompok_belajar_paket_b ?? 0) + ($data['kelompok_belajar_paket_b'] ?? 0);
        $pokja->kelompok_belajar_paket_c = ($pokja->kelompok_belajar_paket_c ?? 0) + ($data['kelompok_belajar_paket_c'] ?? 0);
        $pokja->kf = ($pokja->kf ?? 0) + ($data['kf'] ?? 0);
        $pokja->paud = ($pokja->paud ?? 0) + ($data['paud'] ?? 0);
        $pokja->koperasi_berbadan_hukum = ($pokja->koperasi_berbadan_hukum ?? 0) + ($data['koperasi_berbadan_hukum'] ?? 0);

        // Field Baru
        $pokja->warga_belajar_paket_a = ($pokja->warga_belajar_paket_a ?? 0) + ($data['warga_belajar_paket_a'] ?? 0);
        $pokja->warga_belajar_paket_b = ($pokja->warga_belajar_paket_b ?? 0) + ($data['warga_belajar_paket_b'] ?? 0);
        $pokja->warga_belajar_paket_c = ($pokja->warga_belajar_paket_c ?? 0) + ($data['warga_belajar_paket_c'] ?? 0);
        $pokja->warga_belajar_kf = ($pokja->warga_belajar_kf ?? 0) + ($data['warga_belajar_kf'] ?? 0);
        $pokja->taman_bacaan = ($pokja->taman_bacaan ?? 0) + ($data['taman_bacaan'] ?? 0);
        $pokja->kelompok_bkb = ($pokja->kelompok_bkb ?? 0) + ($data['kelompok_bkb'] ?? 0);
        $pokja->peserta_bkb = ($pokja->peserta_bkb ?? 0) + ($data['peserta_bkb'] ?? 0);
        $pokja->ape_bkb = ($pokja->ape_bkb ?? 0) + ($data['ape_bkb'] ?? 0);
        $pokja->kelompok_simulasi_bkb = ($pokja->kelompok_simulasi_bkb ?? 0) + ($data['kelompok_simulasi_bkb'] ?? 0);
        $pokja->tutor_kf = ($pokja->tutor_kf ?? 0) + ($data['tutor_kf'] ?? 0);
        $pokja->tutor_paud = ($pokja->tutor_paud ?? 0) + ($data['tutor_paud'] ?? 0);
        $pokja->kader_bkb = ($pokja->kader_bkb ?? 0) + ($data['kader_bkb'] ?? 0);
        $pokja->kelompok_kader_koperasi = ($pokja->kelompok_kader_koperasi ?? 0) + ($data['kelompok_kader_koperasi'] ?? 0);
        $pokja->kader_keterampilan = ($pokja->kader_keterampilan ?? 0) + ($data['kader_keterampilan'] ?? 0);
        $pokja->kader_dilatih_pengelolaan = ($pokja->kader_dilatih_pengelolaan ?? 0) + ($data['kader_dilatih_pengelolaan'] ?? 0);
        $pokja->kader_dilatih_tp_pkk = ($pokja->kader_dilatih_tp_pkk ?? 0) + ($data['kader_dilatih_tp_pkk'] ?? 0);
        $pokja->kader_dilatih_damas = ($pokja->kader_dilatih_damas ?? 0) + ($data['kader_dilatih_damas'] ?? 0);
        $pokja->up2k_pemula_kelompok = ($pokja->up2k_pemula_kelompok ?? 0) + ($data['up2k_pemula_kelompok'] ?? 0);
        $pokja->up2k_pemula_peserta = ($pokja->up2k_pemula_peserta ?? 0) + ($data['up2k_pemula_peserta'] ?? 0);
        $pokja->up2k_madya_kelompok = ($pokja->up2k_madya_kelompok ?? 0) + ($data['up2k_madya_kelompok'] ?? 0);
        $pokja->up2k_madya_peserta = ($pokja->up2k_madya_peserta ?? 0) + ($data['up2k_madya_peserta'] ?? 0);
        $pokja->up2k_utama_kelompok = ($pokja->up2k_utama_kelompok ?? 0) + ($data['up2k_utama_kelompok'] ?? 0);
        $pokja->up2k_utama_peserta = ($pokja->up2k_utama_peserta ?? 0) + ($data['up2k_utama_peserta'] ?? 0);
        $pokja->up2k_mandiri_kelompok = ($pokja->up2k_mandiri_kelompok ?? 0) + ($data['up2k_mandiri_kelompok'] ?? 0);
        $pokja->up2k_mandiri_peserta = ($pokja->up2k_mandiri_peserta ?? 0) + ($data['up2k_mandiri_peserta'] ?? 0);
        $pokja->anggota_koperasi = ($pokja->anggota_koperasi ?? 0) + ($data['anggota_koperasi'] ?? 0);

        // ✅ 5 FIELD BARU
        $pokja->ibu_set_bkb = ($pokja->ibu_set_bkb ?? 0) + ($data['ibu_set_bkb'] ?? 0);
        $pokja->lp3_pkk = ($pokja->lp3_pkk ?? 0) + ($data['lp3_pkk'] ?? 0);
        $pokja->tp3_pkk = ($pokja->tp3_pkk ?? 0) + ($data['tp3_pkk'] ?? 0);
        $pokja->damas_pkk = ($pokja->damas_pkk ?? 0) + ($data['damas_pkk'] ?? 0);

        if (isset($data['keterangan']) && !empty($data['keterangan'])) {
            $pokja->keterangan = $data['keterangan'];
        }

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

        // Helper: ambil angka dari salah satu alias key (format baru Android
        // memakai prefix jumlah_kader_* / pangan_*, format lama tanpa prefix).
        // Prioritas ke key baru, fallback ke key lama.
        $val = function (string ...$keys) use ($data): int {
            foreach ($keys as $key) {
                if (isset($data[$key]) && is_numeric($data[$key]) && (int) $data[$key] !== 0) {
                    return (int) $data[$key];
                }
            }
            foreach ($keys as $key) {
                if (array_key_exists($key, $data) && is_numeric($data[$key])) {
                    return (int) $data[$key];
                }
            }
            return 0;
        };

        $pokja->rumah_sehat = ($pokja->rumah_sehat ?? 0) + $val('rumah_sehat');
        $pokja->rumah_tidak_sehat = ($pokja->rumah_tidak_sehat ?? 0) + $val('rumah_tidak_sehat');
        $pokja->pemanfaatan_pekarangan = ($pokja->pemanfaatan_pekarangan ?? 0) + $val('pemanfaatan_pekarangan');
        $pokja->industri_rumah_tangga = ($pokja->industri_rumah_tangga ?? 0) + $val('industri_rumah_tangga');

        // Jumlah kader: baru (jumlah_kader_pangan/sandang) + lama (jumlah_kader/jumlah_kader_p)
        $pokja->jumlah_kader = ($pokja->jumlah_kader ?? 0) + $val('jumlah_kader_pangan', 'jumlah_kader');
        $pokja->jumlah_kader_p = ($pokja->jumlah_kader_p ?? 0) + $val('jumlah_kader_sandang', 'jumlah_kader_p');
        // Makanan pokok: baru (pangan_beras) + lama (makanan_pokok)
        $pokja->makanan_pokok = ($pokja->makanan_pokok ?? 0) + $val('pangan_beras', 'makanan_pokok');
        $pokja->hatinya_pkk = ($pokja->hatinya_pkk ?? 0) + $val('hatinya_pkk');
        $pokja->jumlah_rumah = ($pokja->jumlah_rumah ?? 0) + $val('jumlah_rumah');

        // ✅ Rincian format resmi 20 kolom (web + Android baru + lama)
        $pokja->kader_tata_laksana = ($pokja->kader_tata_laksana ?? 0) + $val('jumlah_kader_tata_laksana', 'kader_tata_laksana');
        $pokja->makanan_non_beras = ($pokja->makanan_non_beras ?? 0) + $val('pangan_non_beras', 'makanan_non_beras');
        $pokja->peternakan = ($pokja->peternakan ?? 0) + $val('pangan_peternakan', 'peternakan');
        $pokja->perikanan = ($pokja->perikanan ?? 0) + $val('pangan_perikanan', 'perikanan');
        $pokja->warung_hidup = ($pokja->warung_hidup ?? 0) + $val('pangan_warung_hidup', 'warung_hidup');
        $pokja->lumbung_hidup = ($pokja->lumbung_hidup ?? 0) + $val('pangan_lumbung_hidup', 'lumbung_hidup');
        $pokja->toga = ($pokja->toga ?? 0) + $val('pangan_toga', 'toga');
        $pokja->tanaman_keras = ($pokja->tanaman_keras ?? 0) + $val('pangan_tanaman_keras', 'tanaman_keras');
        $pokja->tanaman_lainnya = ($pokja->tanaman_lainnya ?? 0) + $val('pangan_tanaman_lainnya', 'tanaman_lainnya');
        $pokja->industri_pangan = ($pokja->industri_pangan ?? 0) + $val('industri_pangan');
        $pokja->industri_sandang = ($pokja->industri_sandang ?? 0) + $val('industri_sandang');
        $pokja->industri_jasa = ($pokja->industri_jasa ?? 0) + $val('industri_jasa');

        if (isset($data['keterangan']) && !empty($data['keterangan'])) {
            $pokja->keterangan = $data['keterangan'];
        }

        $pokja->nama_kecamatan = $kecamatan;
        $pokja->kategori = 'Pokja III';
        $pokja->judul_kegiatan = "Rekapitulasi Pokja III - $kecamatan";
        $pokja->deskripsi = "Data rekapitulasi otomatis dari laporan mobile";
        $pokja->save();

        Log::info('Pokja 3 berhasil disinkronkan untuk: ' . $kecamatan);
    }

    // ─── SINKRON POKJA 4 ──────────────────────────────────────────────────────
    private function sinkronkanPokja4($kecamatan, $data, int $tahun)
    {
        $pokja = Pokja4::firstOrNew([
            'kecamatan' => $kecamatan,
            'tahun' => $tahun,
        ]);
        $pokja->tahun = $tahun;

        $pokja->posyandu = ($pokja->posyandu ?? 0) + ($data['posyandu'] ?? 0);
        $pokja->akseptor_kb = ($pokja->akseptor_kb ?? 0) + ($data['akseptor_kb'] ?? 0);
        $pokja->phbs = ($pokja->phbs ?? 0) + ($data['phbs'] ?? 0);
        $pokja->jamban_keluarga = ($pokja->jamban_keluarga ?? 0) + ($data['jamban_keluarga'] ?? 0);

        $pokja->kader_kesehatan = ($pokja->kader_kesehatan ?? 0) + ($data['kader_kesehatan'] ?? 0);
        $pokja->kader_gizi = ($pokja->kader_gizi ?? 0) + ($data['kader_gizi'] ?? 0);
        $pokja->kader_kesling = ($pokja->kader_kesling ?? 0) + ($data['kader_kesling'] ?? 0);
        $pokja->kader_phbs = ($pokja->kader_phbs ?? 0) + ($data['kader_phbs'] ?? 0);
        $pokja->kader_kb = ($pokja->kader_kb ?? 0) + ($data['kader_kb'] ?? 0);
        $pokja->imunisasi = ($pokja->imunisasi ?? 0) + ($data['imunisasi'] ?? 0);
        $pokja->pkg = ($pokja->pkg ?? 0) + ($data['pkg'] ?? 0);
        $pokja->tbc = ($pokja->tbc ?? 0) + ($data['tbc'] ?? 0);
        $pokja->spal = ($pokja->spal ?? 0) + ($data['spal'] ?? 0);
        $pokja->tps = ($pokja->tps ?? 0) + ($data['tps'] ?? 0);
        $pokja->mck = ($pokja->mck ?? 0) + ($data['mck'] ?? 0);
        $pokja->air_pdam = ($pokja->air_pdam ?? 0) + ($data['air_pdam'] ?? 0);
        $pokja->air_sumur = ($pokja->air_sumur ?? 0) + ($data['air_sumur'] ?? 0);
        $pokja->air_lainnya = ($pokja->air_lainnya ?? 0) + ($data['air_lainnya'] ?? 0);
        $pokja->jumlah_pus = ($pokja->jumlah_pus ?? 0) + ($data['jumlah_pus'] ?? 0);
        $pokja->jumlah_wus = ($pokja->jumlah_wus ?? 0) + ($data['jumlah_wus'] ?? 0);
        $pokja->akseptor_kb_l = ($pokja->akseptor_kb_l ?? 0) + ($data['akseptor_kb_l'] ?? 0);
        $pokja->akseptor_kb_p = ($pokja->akseptor_kb_p ?? 0) + ($data['akseptor_kb_p'] ?? 0);
        $pokja->tabungan_keluarga = ($pokja->tabungan_keluarga ?? 0) + ($data['tabungan_keluarga'] ?? 0);
        $pokja->asuransi_kesehatan = ($pokja->asuransi_kesehatan ?? 0) + ($data['asuransi_kesehatan'] ?? 0);
        $pokja->program_kesehatan = $data['program_kesehatan'] ?? $pokja->program_kesehatan;
        $pokja->program_lingkungan = $data['program_lingkungan'] ?? $pokja->program_lingkungan;
        $pokja->program_perencanaan = $data['program_perencanaan'] ?? $pokja->program_perencanaan;

        if (isset($data['keterangan']) && !empty($data['keterangan'])) {
            $pokja->keterangan = $data['keterangan'];
        }

        $pokja->nama_kecamatan = $kecamatan;
        $pokja->kategori = 'Pokja IV';
        $pokja->judul_kegiatan = "Rekapitulasi Pokja IV - $kecamatan";
        $pokja->deskripsi = "Data rekapitulasi otomatis dari laporan mobile";
        $pokja->save();

        Log::info('Pokja 4 berhasil disinkronkan untuk: ' . $kecamatan);
    }

    // ─── SINKRON KUNJUNGAN PYD ────────────────────────────────────────────────
    private function sinkronkanKunjunganPyd($kecamatan, $data)
    {
        $bulan = $data['bulan'] ?? null;
        $tahun = $data['tahun'] ?? date('Y');

        if (!$bulan) {
            Log::warning('Kunjungan PYD: bulan kosong');
            return;
        }

        $record = Pokja4KunjunganPyd::firstOrNew([
            'kecamatan' => $kecamatan,
            'bulan' => $bulan,
            'tahun' => $tahun,
        ]);

        foreach ([
            'bayi_0_12_l',
            'bayi_0_12_p',
            'bayi_0_12_laki_l',
            'bayi_0_12_laki_p',
            'balita_1_5_l',
            'balita_1_5_p',
            'balita_1_5_laki_l',
            'balita_1_5_laki_p',
            'wus',
            'pus',
            'ibu_hamil',
            'ibu_menyusui',
            'bayi_lahir',
            'bayi_meninggal',
            'kematian_ibu',
            'petugas_kader',
            'petugas_plkb',
            'petugas_medis',
        ] as $field) {
            $record->{$field} = (int) ($record->{$field} ?? 0)
                + (int) ($data[$field] ?? 0);
        }
        $record->keterangan = $data['keterangan'] ?? $record->keterangan;

        $record->save();

        Log::info('Kunjungan PYD berhasil disinkronkan untuk: ' . $kecamatan . ' bulan ' . $bulan);
    }

    // ─── SINKRON KEGIATAN POSYANDU ────────────────────────────────────────────
    private function sinkronkanKegiatanPosyandu($kecamatan, $data)
    {
        $bulan = $data['bulan'] ?? null;
        $tahun = $data['tahun'] ?? date('Y');

        if (!$bulan) {
            Log::warning('Kegiatan Posyandu: bulan kosong');
            return;
        }

        $record = Pokja4KegiatanPosyandu::firstOrNew([
            'kecamatan' => $kecamatan,
            'bulan' => $bulan,
            'tahun' => $tahun,
        ]);

        $record->ibu_hamil = $data['ibu_hamil'] ?? 0;
        $record->ibu_hamil_diperiksa = $data['ibu_hamil_diperiksa'] ?? 0;
        $record->ibu_hamil_dapat_fe = $data['ibu_hamil_dapat_fe'] ?? 0;
        $record->menyusui = $data['menyusui'] ?? 0;

        $record->kb_iud = $data['kb_iud'] ?? 0;
        $record->kb_mow = $data['kb_mow'] ?? 0;
        $record->kb_mop = $data['kb_mop'] ?? 0;
        $record->kb_implan = $data['kb_implan'] ?? 0;
        $record->kb_pil = $data['kb_pil'] ?? 0;
        $record->kb_suntik = $data['kb_suntik'] ?? 0;
        $record->kb_kondom = $data['kb_kondom'] ?? 0;

        $record->balita_l = $data['balita_l'] ?? 0;
        $record->balita_p = $data['balita_p'] ?? 0;
        $record->balita_kia_l = $data['balita_kia_l'] ?? 0;
        $record->balita_kia_p = $data['balita_kia_p'] ?? 0;
        $record->balita_ditimbang_l = $data['balita_ditimbang_l'] ?? 0;
        $record->balita_ditimbang_p = $data['balita_ditimbang_p'] ?? 0;
        $record->balita_naik_l = $data['balita_naik_l'] ?? 0;
        $record->balita_naik_p = $data['balita_naik_p'] ?? 0;

        $record->vit_a_1 = $data['vit_a_1'] ?? 0;
        $record->vit_a_2 = $data['vit_a_2'] ?? 0;

        $record->imunisasi_tt_1 = $data['imunisasi_tt_1'] ?? 0;
        $record->imunisasi_tt_2 = $data['imunisasi_tt_2'] ?? 0;
        $record->imunisasi_bcg = $data['imunisasi_bcg'] ?? 0;
        $record->imunisasi_dpt_1 = $data['imunisasi_dpt_1'] ?? 0;
        $record->imunisasi_dpt_2 = $data['imunisasi_dpt_2'] ?? 0;
        $record->imunisasi_dpt_3 = $data['imunisasi_dpt_3'] ?? 0;
        $record->imunisasi_polio_1 = $data['imunisasi_polio_1'] ?? 0;
        $record->imunisasi_polio_2 = $data['imunisasi_polio_2'] ?? 0;
        $record->imunisasi_polio_3 = $data['imunisasi_polio_3'] ?? 0;
        $record->imunisasi_polio_4 = $data['imunisasi_polio_4'] ?? 0;
        $record->imunisasi_campak = $data['imunisasi_campak'] ?? 0;
        $record->imunisasi_hepatitis_1 = $data['imunisasi_hepatitis_1'] ?? 0;
        $record->imunisasi_hepatitis_2 = $data['imunisasi_hepatitis_2'] ?? 0;
        $record->imunisasi_hepatitis_3 = $data['imunisasi_hepatitis_3'] ?? 0;

        $record->balita_diare = $data['balita_diare'] ?? 0;
        $record->balita_oralit = $data['balita_oralit'] ?? 0;

        $record->keterangan = $data['keterangan'] ?? null;

        $record->save();

        Log::info('Kegiatan Posyandu berhasil disinkronkan untuk: ' . $kecamatan . ' bulan ' . $bulan);
    }

    // ─── SINKRON REKAPITULASI ────────────────────────────────────────────────
    private function sinkronkanRekapitulasi($kecamatan, $data)
    {
        $tahun = $data['tahun'] ?? date('Y');

        $record = Pokja4Rekapitulasi::firstOrNew([
            'kecamatan' => $kecamatan,
            'tahun' => $tahun,
        ]);

        $record->dusun = $data['dusun'] ?? null;
        $record->rw = $data['rw'] ?? null;
        $record->rt = $data['rt'] ?? null;
        $record->dasa_wisma = $data['dasa_wisma'] ?? null;
        $record->ibu_hamil = $data['ibu_hamil'] ?? 0;
        $record->ibu_melahirkan = $data['ibu_melahirkan'] ?? 0;
        $record->ibu_nifas = $data['ibu_nifas'] ?? 0;
        $record->ibu_meninggal = $data['ibu_meninggal'] ?? 0;
        $record->bayi_lahir_l = $data['bayi_lahir_l'] ?? 0;
        $record->bayi_lahir_p = $data['bayi_lahir_p'] ?? 0;
        $record->akte_ada = $data['akte_ada'] ?? 0;
        $record->akte_tidak = $data['akte_tidak'] ?? 0;
        $record->bayi_meninggal_l = $data['bayi_meninggal_l'] ?? 0;
        $record->bayi_meninggal_p = $data['bayi_meninggal_p'] ?? 0;
        $record->balita_meninggal_l = $data['balita_meninggal_l'] ?? 0;
        $record->balita_meninggal_p = $data['balita_meninggal_p'] ?? 0;
        $record->keterangan = $data['keterangan'] ?? null;

        $record->save();

        Log::info('Rekapitulasi berhasil disinkronkan untuk: ' . $kecamatan);
    }
}
