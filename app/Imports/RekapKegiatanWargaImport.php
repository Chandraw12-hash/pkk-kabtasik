<?php

namespace App\Imports;

use App\Models\RekapKegiatanWarga;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithCalculatedFormulas;
use Maatwebsite\Excel\Validators\Failure;
use Illuminate\Support\Facades\Log;

class RekapKegiatanWargaImport implements
    ToModel,
    WithHeadingRow,
    WithValidation,
    SkipsEmptyRows,
    SkipsOnError,
    SkipsOnFailure,
    WithBatchInserts,
    WithChunkReading,
    WithCalculatedFormulas
{
    protected string $kecamatan;
    protected string $desa;
    protected int $tahun;
    protected string $level;

    protected int $successCount = 0;
    protected int $skipCount = 0;
    protected array $errors = [];

    public function __construct(
        string $kecamatan,
        string $desa,
        int $tahun,
        string $level = 'rt'
    ) {
        $this->kecamatan = $kecamatan;
        $this->desa = $desa;
        $this->tahun = $tahun;
        $this->level = $level;
    }

    public function model(array $row)
    {
        // Skip kalau baris benar-benar kosong
        if ($this->isEmptyRow($row)) {
            $this->skipCount++;
            return null;
        }

        // Skip kalau tidak ada identitas sama sekali
        if (
            empty($row['dusun']) &&
            empty($row['nama_dusun']) &&
            empty($row['rw']) &&
            empty($row['rt']) &&
            empty($row['kk'])
        ) {
            $this->skipCount++;
            return null;
        }

        $this->successCount++;

        return new RekapKegiatanWarga([
            // === IDENTITAS WILAYAH ===
            'kecamatan' => $this->kecamatan,
            'nama_kecamatan' => $this->kecamatan,
            'desa' => $this->desa,
            'nama_desa' => $this->desa,
            'tahun' => $this->tahun,
            'level' => $this->level,

            // === WILAYAH ===
            'dusun' => $this->clean($row['dusun'] ?? null),
            'nama_dusun' => $this->clean($row['nama_dusun'] ?? $row['dusun'] ?? null),
            'rw' => $this->clean($row['rw'] ?? null),
            'rt' => $this->clean($row['rt'] ?? null),

            // === JUMLAH KELOMPOK ===
            'jumlah_dusun' => $this->toInt($row['jumlah_dusun'] ?? null),
            'jumlah_rw' => $this->toInt($row['jumlah_rw'] ?? null),
            'jumlah_rt' => $this->toInt($row['jumlah_rt'] ?? null),
            'jumlah_dasa_wisma' => $this->toInt(
                $row['dasa_wisma'] ?? $row['jumlah_dasa_wisma'] ?? null
            ),
            'jumlah_krt' => $this->toInt($row['krt'] ?? $row['jumlah_krt'] ?? null),
            'jumlah_kk' => $this->toInt($row['kk'] ?? $row['jumlah_kk'] ?? null),

            // === ANGGOTA KELUARGA ===
            'total_l' => $this->toInt($row['total_l'] ?? $row['l'] ?? null),
            'total_p' => $this->toInt($row['total_p'] ?? $row['p'] ?? null),
            'balita_l' => $this->toInt($row['balita_l'] ?? null),
            'balita_p' => $this->toInt($row['balita_p'] ?? null),
            'pus' => $this->toInt($row['pus'] ?? null),
            'wus' => $this->toInt($row['wus'] ?? null),
            'ibu_hamil' => $this->toInt($row['ibu_hamil'] ?? null),
            'ibu_menyusui' => $this->toInt($row['ibu_menyusui'] ?? null),
            'lansia' => $this->toInt($row['lansia'] ?? null),
            'buta_l' => $this->toInt($row['buta_l'] ?? null),
            'buta_p' => $this->toInt($row['buta_p'] ?? null),

            // === KRITERIA RUMAH ===
            'rumah_sehat' => $this->toInt($row['rumah_sehat'] ?? null),
            'rumah_kurang_sehat' => $this->toInt($row['rumah_kurang_sehat'] ?? null),
            'memiliki_tempat_sampah' => $this->toInt(
                $row['tempat_sampah'] ?? $row['memiliki_tempat_sampah'] ?? null
            ),
            'memiliki_spal' => $this->toInt(
                $row['spal'] ?? $row['memiliki_spal'] ?? null
            ),
            'memiliki_stiker_p4k' => $this->toInt(
                $row['stiker_p4k'] ?? $row['memiliki_stiker_p4k'] ?? null
            ),

            // === SUMBER AIR ===
            'air_pdam' => $this->toInt($row['pdam'] ?? $row['air_pdam'] ?? null),
            'air_sumur' => $this->toInt($row['sumur'] ?? $row['air_sumur'] ?? null),
            'air_sungai' => $this->toInt($row['sungai'] ?? $row['air_sungai'] ?? null),
            'air_dll' => $this->toInt($row['air_dll'] ?? null),

            // === JAMBAN ===
            'jumlah_jamban_keluarga' => $this->toInt(
                $row['jamban'] ?? $row['jumlah_jamban_keluarga'] ?? null
            ),

            // === MAKANAN POKOK ===
            'makanan_pokok_beras' => $this->toInt(
                $row['pokok_beras'] ?? $row['makanan_pokok_beras'] ?? null
            ),
            'makanan_pokok_non_beras' => $this->toInt(
                $row['non_beras'] ?? $row['makanan_pokok_non_beras'] ?? null
            ),

            // === KEGIATAN WARGA ===
            'kegiatan_up2k' => $this->toInt(
                $row['up2k'] ?? $row['kegiatan_up2k'] ?? null
            ),
            'kegiatan_tanah_pekarangan' => $this->toInt(
                $row['tanah_pekarangan'] ?? $row['kegiatan_tanah_pekarangan'] ?? null
            ),
            'kegiatan_industri_rumah_tangga' => $this->toInt(
                $row['industri_rumah_tangga'] ?? $row['kegiatan_industri_rumah_tangga'] ?? null
            ),
            'kegiatan_kesehatan_lingkungan' => $this->toInt(
                $row['kesehatan_lingkungan'] ?? $row['kegiatan_kesehatan_lingkungan'] ?? null
            ),

            // === META ===
            'created_by' => auth()->id(),
        ]);
    }

    public function rules(): array
    {
        return [
            'dusun' => 'nullable|string|max:255',
            'nama_dusun' => 'nullable|string|max:255',
            'rw' => 'nullable|string|max:10',
            'rt' => 'nullable|string|max:10',
            'jumlah_kk' => 'nullable|numeric|min:0',
            'jumlah_krt' => 'nullable|numeric|min:0',
            'total_l' => 'nullable|numeric|min:0',
            'total_p' => 'nullable|numeric|min:0',
            'balita_l' => 'nullable|numeric|min:0',
            'balita_p' => 'nullable|numeric|min:0',
            'pus' => 'nullable|numeric|min:0',
            'wus' => 'nullable|numeric|min:0',
            'ibu_hamil' => 'nullable|numeric|min:0',
            'ibu_menyusui' => 'nullable|numeric|min:0',
            'lansia' => 'nullable|numeric|min:0',
        ];
    }

    public function batchSize(): int
    {
        return 100;
    }

    public function chunkSize(): int
    {
        return 100;
    }

    public function onError(\Throwable $e): void
    {
        $this->errors[] = $e->getMessage();
        Log::warning('RekapKegiatanWargaImport error: ' . $e->getMessage());
    }

    public function onFailure(Failure ...$failures): void
    {
        foreach ($failures as $failure) {
            $this->errors[] = [
                'row' => $failure->row(),
                'attribute' => $failure->attribute(),
                'errors' => $failure->errors(),
                'values' => $failure->values(),
            ];
            Log::warning('RekapKegiatanWargaImport validation failed', [
                'row' => $failure->row(),
                'attribute' => $failure->attribute(),
                'errors' => $failure->errors(),
            ]);
        }
    }

    public function getSuccessCount(): int
    {
        return $this->successCount;
    }

    public function getSkipCount(): int
    {
        return $this->skipCount;
    }

    public function getErrors(): array
    {
        return $this->errors;
    }

    // ============================================================
    // HELPER METHODS
    // ============================================================

    /**
     * Cek apakah baris benar-benar kosong
     */
    private function isEmptyRow(array $row): bool
    {
        foreach ($row as $value) {
            if ($value !== null && $value !== '' && $value !== 0 && $value !== '0') {
                return false;
            }
        }
        return true;
    }

    /**
     * Convert ke integer — handle string kosong, null, koma, titik
     */
    private function toInt($value): int
    {
        if ($value === null || $value === '' || $value === '-') {
            return 0;
        }

        if (is_int($value)) {
            return $value;
        }

        if (is_float($value)) {
            return (int) $value;
        }

        // Handle string: "1.000" atau "1,000"
        $cleaned = preg_replace('/[^\d-]/', '', (string) $value);

        return (int) ($cleaned ?: 0);
    }

    /**
     * Clean string — trim, null kalau kosong
     */
    private function clean($value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        return trim((string) $value);
    }
}