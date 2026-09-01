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

class LaporanKegiatanController extends Controller
{
    /**
     * Kader submit laporan kegiatan baru dari mobile.
     * Laporan ini TIDAK tampil publik — cuma masuk ke daftar admin
     * di dashboard web (menu "Laporan Kegiatan").
     */
    public function store(Request $request)
    {
        // 🔥 FIX: 'data_angka' datang sebagai STRING JSON
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

        // 🔥 Ambil kecamatan dari validated atau dari user
        $kecamatan = $validated['kecamatan'] ?? $user->kecamatan ?? null;
        $desaKelurahan = $validated['desa_kelurahan'] ?? $user->desa_kelurahan ?? null;
        $namaDasawisma = $validated['nama_dasawisma'] ?? $user->nama_dasawisma ?? null;

        // 🔥 Logging untuk debugging
        if (empty($kecamatan)) {
            \Log::warning('Laporan tanpa kecamatan dari user ID: ' . $user->id);
        }

        // 🔥 Simpan laporan
        $dataAngka = $validated['data_angka'] ?? [];

        $laporan = LaporanKegiatan::create([
            'user_id' => $user->id,
            'judul' => $validated['judul'],
            'deskripsi' => $validated['deskripsi'] ?? null,
            'kategori_pokja' => $validated['kategori_pokja'],
            'data_angka' => json_encode($dataAngka),
            'foto' => $fotoPath,
            'kecamatan' => $kecamatan,
            'desa_kelurahan' => $desaKelurahan,
            'nama_dasawisma' => $namaDasawisma,
            'status' => 'pending',
        ]);

        // 🔥🔥🔥 SINKRONKAN DATA KE POKJA (OTOMATIS)
        $this->sinkronkanKePokja($laporan);

        return response()->json([
            'message' => 'Laporan berhasil dikirim.',
            'data' => $laporan,
        ], 201);
    }

    /**
     * 🔥 Sinkronkan laporan dari mobile ke tabel Pokja yang sesuai
     */
    private function sinkronkanKePokja(LaporanKegiatan $laporan)
    {
        $kecamatan = $laporan->kecamatan;
        if (empty($kecamatan)) {
            \Log::warning('Sinkronisasi gagal: kecamatan kosong untuk laporan ID: ' . $laporan->id);
            return;
        }

        // 🔥 Decode data_angka
        $dataAngka = [];
        if (is_string($laporan->data_angka)) {
            $dataAngka = json_decode($laporan->data_angka, true);
        } elseif (is_array($laporan->data_angka)) {
            $dataAngka = $laporan->data_angka;
        }

        if (!is_array($dataAngka) || empty($dataAngka)) {
            \Log::warning('Sinkronisasi gagal: data_angka kosong untuk laporan ID: ' . $laporan->id);
            return;
        }

        \Log::info('Sinkronisasi Pokja ' . $laporan->kategori_pokja . ' untuk kecamatan: ' . $kecamatan);

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
                \Log::warning('Kategori Pokja tidak dikenal: ' . $laporan->kategori_pokja);
        }
    }

    /**
     * 🔥 Sinkronkan ke Pokja 1
     */
    private function sinkronkanPokja1($kecamatan, $data)
    {
        $pokja = Pokja1::firstOrNew(['kecamatan' => $kecamatan]);

        // 🔥 Update semua field dengan nilai dari data_angka
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

        // 🔥 Set field wajib
        $pokja->nama_kecamatan = $kecamatan;
        $pokja->kategori = 'Pokja I';
        $pokja->judul_kegiatan = "Rekapitulasi Pokja I - $kecamatan";
        $pokja->deskripsi = "Data rekapitulasi otomatis dari laporan mobile";
        $pokja->save();

        \Log::info('Pokja 1 berhasil disinkronkan untuk: ' . $kecamatan);
    }

    /**
     * 🔥 Sinkronkan ke Pokja 2
     */
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

        \Log::info('Pokja 2 berhasil disinkronkan untuk: ' . $kecamatan);
    }

    /**
     * 🔥 Sinkronkan ke Pokja 3
     */
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

        \Log::info('Pokja 3 berhasil disinkronkan untuk: ' . $kecamatan);
    }

    /**
     * 🔥 Sinkronkan ke Pokja 4
     */
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

        \Log::info('Pokja 4 berhasil disinkronkan untuk: ' . $kecamatan);
    }

    /**
     * Riwayat laporan milik kader yang sedang login SAJA
     */
    public function index(Request $request)
    {
        $laporans = LaporanKegiatan::where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return response()->json($laporans);
    }

    /**
     * Detail 1 laporan milik sendiri
     */
    public function show(Request $request, LaporanKegiatan $laporan_kegiatan)
    {
        if ($laporan_kegiatan->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Laporan tidak ditemukan.',
            ], 404);
        }

        return response()->json($laporan_kegiatan);
    }
}
