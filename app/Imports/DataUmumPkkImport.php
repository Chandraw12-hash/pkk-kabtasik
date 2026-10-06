<?php

namespace App\Imports;

use App\Models\DataUmumPkk;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithCalculatedFormulas;
use Maatwebsite\Excel\Validators\Failure;
use Illuminate\Support\Facades\Log;

class DataUmumPkkImport implements
    ToModel,
    WithHeadingRow,
    WithValidation,
    SkipsEmptyRows,
    SkipsOnError,
    SkipsOnFailure,
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

    public function __construct(string $kecamatan, string $desa, int $tahun, string $level = 'desa')
    {
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

        // Skip kalau tidak ada dusun DAN tidak ada jumlah
        if (empty($row['dusun']) && empty($row['nama_dusun']) && empty($row['jumlah_kk'])) {
            $this->skipCount++;
            return null;
        }

        $this->successCount++;

        // === KUNCI UNIK — untuk cek duplikat ===
        $uniqueKey = [
            'kecamatan' => $this->kecamatan,
            'desa' => $this->desa,
            'tahun' => $this->tahun,
            'level' => $this->level,
            'dusun' => $this->clean($row['dusun'] ?? null),
        ];

        // === DATA LENGKAP ===
        $data = array_merge($uniqueKey, [
            'nama_kecamatan' => $this->kecamatan,
            'nama_desa' => $this->desa,
            'nama_dusun' => $this->clean($row['nama_dusun'] ?? $row['dusun'] ?? null),

            // === JUMLAH KELOMPOK ===
            'jumlah_dusun' => $this->toInt($row['jumlah_dusun'] ?? null),
            'jumlah_pkk_rw' => $this->toInt($row['pkk_rw'] ?? $row['jumlah_pkk_rw'] ?? null),
            'jumlah_pkk_rt' => $this->toInt($row['pkk_rt'] ?? $row['jumlah_pkk_rt'] ?? null),
            'jumlah_dasa_wisma' => $this->toInt($row['dasa_wisma'] ?? $row['jumlah_dasa_wisma'] ?? null),
            'jumlah_krt' => $this->toInt($row['krt'] ?? $row['jumlah_krt'] ?? null),
            'jumlah_kk' => $this->toInt($row['kk'] ?? $row['jumlah_kk'] ?? null),

            // === JUMLAH JIWA ===
            'jiwa_l' => $this->toInt($row['jiwa_l'] ?? $row['l'] ?? null),
            'jiwa_p' => $this->toInt($row['jiwa_p'] ?? $row['p'] ?? null),

            // === ANGGOTA TP PKK ===
            'tp_pkk_l' => $this->toInt($row['tp_pkk_l'] ?? null),
            'tp_pkk_p' => $this->toInt($row['tp_pkk_p'] ?? null),

            // === KADER ===
            'kader_umum_l' => $this->toInt($row['kader_umum_l'] ?? null),
            'kader_umum_p' => $this->toInt($row['kader_umum_p'] ?? null),
            'kader_khusus_l' => $this->toInt($row['kader_khusus_l'] ?? null),
            'kader_khusus_p' => $this->toInt($row['kader_khusus_p'] ?? null),

            // === SEKRETARIAT ===
            'sekretariat_honorer_l' => $this->toInt($row['sekretariat_honorer_l'] ?? null),
            'sekretariat_honorer_p' => $this->toInt($row['sekretariat_honorer_p'] ?? null),
            'sekretariat_bantuan_l' => $this->toInt($row['sekretariat_bantuan_l'] ?? null),
            'sekretariat_bantuan_p' => $this->toInt($row['sekretariat_bantuan_p'] ?? null),

            // === META ===
            'created_by' => auth()->id(),
        ]);
        if (array_key_exists('jiwa_tidak_terpilah', $row)) {
            $data['jiwa_tidak_terpilah'] = $this->toInt($row['jiwa_tidak_terpilah']);
        }

        // === UPSERT — update kalau ada, insert kalau belum ===
        return DataUmumPkk::updateOrCreate($uniqueKey, $data);
    }

    public function rules(): array
    {
        return [
            'dusun' => 'nullable|string|max:255',
            'nama_dusun' => 'nullable|string|max:255',
            'jumlah_dusun' => 'nullable|numeric|min:0',
            'pkk_rw' => 'nullable|numeric|min:0',
            'pkk_rt' => 'nullable|numeric|min:0',
            'dasa_wisma' => 'nullable|numeric|min:0',
            'krt' => 'nullable|numeric|min:0',
            'kk' => 'nullable|numeric|min:0',
            'jiwa_l' => 'nullable|numeric|min:0',
            'jiwa_p' => 'nullable|numeric|min:0',
            'jiwa_tidak_terpilah' => 'nullable|numeric|min:0',
        ];
    }

    public function chunkSize(): int
    {
        return 100;
    }

    public function onError(\Throwable $e): void
    {
        $this->errors[] = $e->getMessage();
        Log::warning('DataUmumPkkImport error: ' . $e->getMessage());
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
            Log::warning('DataUmumPkkImport validation failed', [
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

    private function isEmptyRow(array $row): bool
    {
        foreach ($row as $value) {
            if ($value !== null && $value !== '' && $value !== 0 && $value !== '0') {
                return false;
            }
        }
        return true;
    }

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

        $cleaned = preg_replace('/[^\d-]/', '', (string) $value);

        return (int) ($cleaned ?: 0);
    }

    private function clean($value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        return trim((string) $value);
    }
}
