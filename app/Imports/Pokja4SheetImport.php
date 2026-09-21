<?php

namespace App\Imports;

use App\Models\Pokja4;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Illuminate\Support\Facades\Log;

class Pokja4SheetImport implements ToModel, WithHeadingRow, WithBatchInserts, WithChunkReading, WithValidation, SkipsOnFailure
{
    use SkipsFailures;

    public int $importedCount = 0;

    public function model(array $row)
    {
        $row = array_change_key_case($row, CASE_LOWER);

        $kecamatan = $row['nama_kecamatan'] ?? $row['kecamatan'] ?? null;

        if (empty($kecamatan)) {
            Log::warning('Import Pokja IV: baris dilewati, nama_kecamatan kosong');
            return null;
        }

        $this->importedCount++;

        return new Pokja4([
            'nama_kecamatan'   => trim($kecamatan),
            'kecamatan'        => trim($kecamatan),
            'kategori'         => $row['kategori'] ?? 'Umum',

            // Lama
            'posyandu'         => (int) ($row['posyandu'] ?? 0),
            'akseptor_kb'      => (int) ($row['akseptor_kb'] ?? 0),
            'phbs'             => (int) ($row['phbs'] ?? 0),
            'jamban_keluarga'  => (int) ($row['jamban_keluarga'] ?? 0),

            // ✅ Baru — 23 kolom
            'kader_kesehatan'     => (int) ($row['kader_kesehatan'] ?? 0),
            'kader_gizi'          => (int) ($row['kader_gizi'] ?? 0),
            'kader_kesling'       => (int) ($row['kader_kesling'] ?? 0),
            'kader_phbs'          => (int) ($row['kader_phbs'] ?? 0),
            'kader_kb'            => (int) ($row['kader_kb'] ?? 0),
            'imunisasi'           => (int) ($row['imunisasi'] ?? 0),
            'pkg'                 => (int) ($row['pkg'] ?? 0),
            'tbc'                 => (int) ($row['tbc'] ?? 0),
            'spal'                => (int) ($row['spal'] ?? 0),
            'tps'                 => (int) ($row['tps'] ?? 0),
            'mck'                 => (int) ($row['mck'] ?? 0),
            'air_pdam'            => (int) ($row['air_pdam'] ?? 0),
            'air_sumur'           => (int) ($row['air_sumur'] ?? 0),
            'air_lainnya'         => (int) ($row['air_lainnya'] ?? 0),
            'jumlah_pus'          => (int) ($row['jumlah_pus'] ?? 0),
            'jumlah_wus'          => (int) ($row['jumlah_wus'] ?? 0),
            'akseptor_kb_l'       => (int) ($row['akseptor_kb_l'] ?? 0),
            'akseptor_kb_p'       => (int) ($row['akseptor_kb_p'] ?? 0),
            'tabungan_keluarga'   => (int) ($row['tabungan_keluarga'] ?? 0),
            'asuransi_kesehatan'  => (int) ($row['asuransi_kesehatan'] ?? 0),
            'program_kesehatan'   => $row['program_kesehatan'] ?? null,
            'program_lingkungan'  => $row['program_lingkungan'] ?? null,
            'program_perencanaan' => $row['program_perencanaan'] ?? null,
        ]);
    }

    public function rules(): array
    {
        return [
            'nama_kecamatan'  => 'required|string|max:100',
            'kategori'        => 'nullable|string|max:50',
            'posyandu'        => 'nullable|numeric|min:0',
            'akseptor_kb'     => 'nullable|numeric|min:0',
            'phbs'            => 'nullable|numeric|min:0',
            'jamban_keluarga' => 'nullable|numeric|min:0',
            // Kolom baru — nullable
            'kader_kesehatan' => 'nullable|numeric|min:0',
            'kader_gizi' => 'nullable|numeric|min:0',
            'kader_kesling' => 'nullable|numeric|min:0',
            'kader_phbs' => 'nullable|numeric|min:0',
            'kader_kb' => 'nullable|numeric|min:0',
            'imunisasi' => 'nullable|numeric|min:0',
            'pkg' => 'nullable|numeric|min:0',
            'tbc' => 'nullable|numeric|min:0',
            'spal' => 'nullable|numeric|min:0',
            'tps' => 'nullable|numeric|min:0',
            'mck' => 'nullable|numeric|min:0',
            'air_pdam' => 'nullable|numeric|min:0',
            'air_sumur' => 'nullable|numeric|min:0',
            'air_lainnya' => 'nullable|numeric|min:0',
            'jumlah_pus' => 'nullable|numeric|min:0',
            'jumlah_wus' => 'nullable|numeric|min:0',
            'akseptor_kb_l' => 'nullable|numeric|min:0',
            'akseptor_kb_p' => 'nullable|numeric|min:0',
            'tabungan_keluarga' => 'nullable|numeric|min:0',
            'asuransi_kesehatan' => 'nullable|numeric|min:0',
        ];
    }

    public function customValidationMessages(): array
    {
        return [
            'nama_kecamatan.required' => 'Kolom nama_kecamatan wajib diisi.',
            'posyandu.numeric'        => 'Kolom posyandu harus berupa angka.',
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
