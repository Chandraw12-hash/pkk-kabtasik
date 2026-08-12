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
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Illuminate\Support\Facades\Log;

/**
 * Import utama. Hanya sheet PERTAMA (data asli) yang diproses;
 * sheet lain (mis. "Penjelasan Kolom") otomatis diabaikan lewat sheets().
 */
class Pokja4Import implements WithMultipleSheets
{
    public Pokja4SheetImport $sheetImport;

    public function __construct()
    {
        $this->sheetImport = new Pokja4SheetImport();
    }

    public function sheets(): array
    {
        // Index 0 = sheet pertama saja yang diproses.
        // Kalau nama sheet data Anda berbeda-beda, ini tetap aman
        // karena selalu mengambil sheet pertama apa pun namanya.
        return [
            0 => $this->sheetImport,
        ];
    }

    public function failures()
    {
        return $this->sheetImport->failures();
    }

    public function getImportedCount(): int
    {
        return $this->sheetImport->importedCount;
    }
}

/**
 * Logika import per-baris yang sesungguhnya, dipakai untuk sheet pertama saja.
 */
class Pokja4SheetImport implements ToModel, WithHeadingRow, WithBatchInserts, WithChunkReading, WithValidation, SkipsOnFailure
{
    use SkipsFailures;

    public int $importedCount = 0;

    public function model(array $row)
    {
        $row = array_change_key_case($row, CASE_LOWER);

        $kecamatan = $row['nama_kecamatan'] ?? $row['kecamatan'] ?? null;

        if (empty($kecamatan)) {
            Log::warning('Import Pokja IV: baris dilewati, nama_kecamatan kosong', ['row' => $row]);
            return null;
        }

        $this->importedCount++;

        return new Pokja4([
            'nama_kecamatan'   => trim($kecamatan),
            'kecamatan'        => trim($kecamatan),
            'kategori'         => $row['kategori'] ?? 'Umum',
            'posyandu'         => (int) ($row['posyandu'] ?? 0),
            'akseptor_kb'      => (int) ($row['akseptor_kb'] ?? 0),
            'phbs'             => (int) ($row['phbs'] ?? 0),
            'jamban_keluarga'  => (int) ($row['jamban_keluarga'] ?? 0),
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
