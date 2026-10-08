<?php

namespace App\Imports;

use App\Models\Pokja3;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Illuminate\Support\Facades\Log;

class Pokja3Import implements ToModel, WithHeadingRow, WithBatchInserts, WithChunkReading, WithValidation, SkipsOnFailure
{
    use SkipsFailures; // <-- INI YANG WAJIB ADA, sumber method failures()

    public int $importedCount = 0;

    public function model(array $row)
    {
        $row = array_change_key_case($row, CASE_LOWER);

        $kecamatan = $row['nama_kecamatan'] ?? $row['kecamatan'] ?? null;

        if (empty($kecamatan)) {
            Log::warning('Import Pokja III: baris dilewati, nama_kecamatan kosong', ['row' => $row]);
            return null;
        }

        $this->importedCount++;

        return new Pokja3([
            'nama_kecamatan'          => trim($kecamatan),
            'kecamatan'               => trim($kecamatan),
            'kategori'                => $row['kategori'] ?? 'Umum',
            'rumah_sehat'             => (int) ($row['rumah_sehat'] ?? 0),
            'rumah_tidak_sehat'       => (int) ($row['rumah_tidak_sehat'] ?? 0),
            'pemanfaatan_pekarangan'  => (int) ($row['pemanfaatan_pekarangan'] ?? 0),
            'industri_rumah_tangga'   => (int) ($row['industri_rumah_tangga'] ?? 0),
            'jumlah_kader'            => (int) ($row['jumlah_kader'] ?? 0),
            'jumlah_kader_p'          => (int) ($row['jumlah_kader_p'] ?? 0),
            'makanan_pokok'           => (int) ($row['makanan_pokok'] ?? 0),
            'hatinya_pkk'             => (int) ($row['hatinya_pkk'] ?? 0),
            'jumlah_rumah'            => (int) ($row['jumlah_rumah'] ?? 0),
            'kader_tata_laksana'      => (int) ($row['kader_tata_laksana'] ?? 0),
            'makanan_non_beras'       => (int) ($row['makanan_non_beras'] ?? 0),
            'peternakan'              => (int) ($row['peternakan'] ?? 0),
            'perikanan'               => (int) ($row['perikanan'] ?? 0),
            'warung_hidup'            => (int) ($row['warung_hidup'] ?? 0),
            'lumbung_hidup'           => (int) ($row['lumbung_hidup'] ?? 0),
            'toga'                    => (int) ($row['toga'] ?? 0),
            'tanaman_keras'           => (int) ($row['tanaman_keras'] ?? 0),
            'tanaman_lainnya'         => (int) ($row['tanaman_lainnya'] ?? 0),
            'industri_pangan'         => (int) ($row['industri_pangan'] ?? 0),
            'industri_sandang'        => (int) ($row['industri_sandang'] ?? 0),
            'industri_jasa'           => (int) ($row['industri_jasa'] ?? 0),
        ]);
    }

    public function rules(): array
    {
        return [
            'nama_kecamatan'         => 'required|string|max:100',
            'kategori'               => 'nullable|string|max:50',
            'rumah_sehat'            => 'nullable|numeric|min:0',
            'rumah_tidak_sehat'      => 'nullable|numeric|min:0',
            'pemanfaatan_pekarangan' => 'nullable|numeric|min:0',
            'industri_rumah_tangga'  => 'nullable|numeric|min:0',
            'jumlah_kader'           => 'nullable|numeric|min:0',
            'jumlah_kader_p'         => 'nullable|numeric|min:0',
            'makanan_pokok'          => 'nullable|numeric|min:0',
            'hatinya_pkk'            => 'nullable|numeric|min:0',
            'jumlah_rumah'           => 'nullable|numeric|min:0',
            'kader_tata_laksana'     => 'nullable|numeric|min:0',
            'makanan_non_beras'      => 'nullable|numeric|min:0',
            'peternakan'             => 'nullable|numeric|min:0',
            'perikanan'              => 'nullable|numeric|min:0',
            'warung_hidup'           => 'nullable|numeric|min:0',
            'lumbung_hidup'          => 'nullable|numeric|min:0',
            'toga'                   => 'nullable|numeric|min:0',
            'tanaman_keras'          => 'nullable|numeric|min:0',
            'tanaman_lainnya'        => 'nullable|numeric|min:0',
            'industri_pangan'        => 'nullable|numeric|min:0',
            'industri_sandang'       => 'nullable|numeric|min:0',
            'industri_jasa'          => 'nullable|numeric|min:0',
        ];
    }

    public function customValidationMessages(): array
    {
        return [
            'nama_kecamatan.required' => 'Kolom nama_kecamatan wajib diisi.',
            'rumah_sehat.numeric'     => 'Kolom rumah_sehat harus berupa angka.',
        ];
    }

    public function batchSize(): int
    {
        return 500;
    }

    public function chunkSize(): int
    {
        return 500;
    }
}
