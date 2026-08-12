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
