<?php

namespace App\Imports;

use App\Models\Pokja2;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Illuminate\Support\Facades\Log;

class Pokja2Import implements ToModel, WithHeadingRow, WithBatchInserts, WithChunkReading, WithValidation, SkipsOnFailure
{
    use SkipsFailures; // otomatis kumpulkan baris yang gagal validasi, bisa ditampilkan ke user

    public function model(array $row)
    {
        $row = array_change_key_case($row, CASE_LOWER);
        $kecamatan = $row['kecamatan'] ?? $row['nama_kecamatan'] ?? null;

        if (empty($kecamatan)) {
            Log::warning('Import Pokja II: baris dilewati, kecamatan kosong', ['row' => $row]);
            return null;
        }

        return new Pokja2([
            'judul_kegiatan'           => $row['judul_kegiatan'] ?? "Rekap Data - {$kecamatan}",
            'deskripsi'                => $row['deskripsi'] ?? "Data hasil import rekapitulasi Pokja II untuk Kecamatan {$kecamatan}.",
            'kategori'                 => $row['kategori'] ?? 'Umum',
            'kecamatan'                => $kecamatan,
            'nama_kecamatan'           => $kecamatan,
            'warga_buta_l'             => (int) ($row['warga_buta_l'] ?? $row['warga_buta_laki_laki'] ?? 0),
            'warga_buta_p'             => (int) ($row['warga_buta_p'] ?? $row['warga_buta_perempuan'] ?? 0),
            'kelompok_belajar_paket_a' => (int) ($row['kelompok_belajar_paket_a'] ?? $row['paket_a'] ?? 0),
            'kelompok_belajar_paket_b' => (int) ($row['kelompok_belajar_paket_b'] ?? $row['paket_b'] ?? 0),
            'kelompok_belajar_paket_c' => (int) ($row['kelompok_belajar_paket_c'] ?? $row['paket_c'] ?? 0),
            'kf'                       => (int) ($row['kf'] ?? 0),
            'paud'                     => (int) ($row['paud'] ?? 0),
            'koperasi_berbadan_hukum'  => (int) ($row['koperasi_berbadan_hukum'] ?? $row['koperasi'] ?? 0),
        ]);
    }

    public function rules(): array
    {
        return [
            'kecamatan' => 'required|string',
            'warga_buta_l' => 'nullable|numeric',
            'warga_buta_p' => 'nullable|numeric',
        ];
    }

    public function batchSize(): int { return 500; }
    public function chunkSize(): int { return 500; }
}
