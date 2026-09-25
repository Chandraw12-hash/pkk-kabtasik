<?php

namespace App\Imports;

use App\Models\RekapBumil;
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
use Throwable;

class RekapBumilImport implements
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
    protected int $bulan;

    protected int $successCount = 0;
    protected int $skipCount = 0;
    protected array $errors = [];

    public function __construct(
        string $kecamatan,
        string $desa,
        int $tahun,
        string $level = 'rt',
        ?int $bulan = null
    ) {
        $this->kecamatan = trim($kecamatan);
        $this->desa = trim($desa);
        $this->tahun = $tahun;
        $this->level = $level;
        $this->bulan = $bulan ?? (int) date('n');
    }

    public function model(array $row)
    {
        // Skip baris kosong
        if ($this->isEmptyRow($row)) {
            $this->skipCount++;
            return null;
        }

        // Skip baris tanpa identitas
        if (
            empty($row['dusun']) &&
            empty($row['nama_dusun']) &&
            empty($row['nama_dasawisma']) &&
            empty($row['dasawisma'])
        ) {
            $this->skipCount++;
            return null;
        }

        // === KUNCI UNIK ===
        $uniqueKey = [
            'kecamatan' => $this->kecamatan,
            'desa' => $this->desa,
            'tahun' => $this->tahun,
            'bulan' => $this->bulan,
            'level' => $this->level,
            'dusun' => $this->clean($row['dusun'] ?? null),
            'rw' => $this->clean($row['rw'] ?? null),
            'rt' => $this->clean($row['rt'] ?? null),
        ];

        // === DATA LENGKAP ===
        $data = array_merge($uniqueKey, [
            'nama_kecamatan' => $this->kecamatan,
            'nama_desa' => $this->desa,
            'nama_bulan' => $this->namaBulan($this->bulan),
            'nama_dusun' => $this->clean($row['nama_dusun'] ?? $row['dusun'] ?? null),
            'nama_dasawisma' => $this->clean(
                $row['nama_dasawisma'] ?? $row['dasawisma'] ?? null
            ),

            // JUMLAH KELOMPOK
            'jumlah_dusun' => $this->toInt($row['jumlah_dusun'] ?? null),
            'jumlah_rw' => $this->toInt($row['jumlah_rw'] ?? null),
            'jumlah_rt' => $this->toInt($row['jumlah_rt'] ?? null),
            'jumlah_dasa_wisma' => $this->toInt(
                $row['dasa_wisma'] ?? $row['jumlah_dasa_wisma'] ?? null
            ),

            // IBU
            'ibu_hamil' => $this->toInt($row['hamil'] ?? $row['ibu_hamil'] ?? null),
            'ibu_melahirkan' => $this->toInt(
                $row['melahirkan'] ?? $row['ibu_melahirkan'] ?? null
            ),
            'ibu_nifas' => $this->toInt($row['nifas'] ?? $row['ibu_nifas'] ?? null),
            'ibu_meninggal' => $this->toInt($row['ibu_meninggal'] ?? null),

            // BAYI LAHIR
            'bayi_lahir_l' => $this->toInt(
                $row['bayi_lahir_l'] ?? $row['lahir_l'] ?? null
            ),
            'bayi_lahir_p' => $this->toInt(
                $row['bayi_lahir_p'] ?? $row['lahir_p'] ?? null
            ),

            // AKTE
            'akte_ada' => $this->toInt($row['akte_ada'] ?? null),
            'akte_tidak_ada' => $this->toInt($row['akte_tidak_ada'] ?? null),

            // MENINGGAL
            'bayi_meninggal_l' => $this->toInt($row['bayi_meninggal_l'] ?? null),
            'bayi_meninggal_p' => $this->toInt($row['bayi_meninggal_p'] ?? null),
            'balita_meninggal_l' => $this->toInt($row['balita_meninggal_l'] ?? null),
            'balita_meninggal_p' => $this->toInt($row['balita_meninggal_p'] ?? null),

            // META
            'created_by' => auth()->id(),
        ]);

        // === UPSERT ===
        $result = RekapBumil::updateOrCreate($uniqueKey, $data);

        // Counter nambah kalau DB berhasil
        if ($result) {
            $this->successCount++;
        }

        return $result;
    }

    public function rules(): array
    {
        return [
            'dusun' => 'nullable|string|max:255',
            'nama_dusun' => 'nullable|string|max:255',
            'rw' => 'nullable|string|max:10',
            'rt' => 'nullable|string|max:10',
            'nama_dasawisma' => 'nullable|string|max:255',
            'ibu_hamil' => 'nullable|numeric|min:0',
            'ibu_melahirkan' => 'nullable|numeric|min:0',
            'ibu_nifas' => 'nullable|numeric|min:0',
            'ibu_meninggal' => 'nullable|numeric|min:0',
            'bayi_lahir_l' => 'nullable|numeric|min:0',
            'bayi_lahir_p' => 'nullable|numeric|min:0',
            'akte_ada' => 'nullable|numeric|min:0',
            'akte_tidak_ada' => 'nullable|numeric|min:0',
            'bayi_meninggal_l' => 'nullable|numeric|min:0',
            'bayi_meninggal_p' => 'nullable|numeric|min:0',
            'balita_meninggal_l' => 'nullable|numeric|min:0',
            'balita_meninggal_p' => 'nullable|numeric|min:0',
        ];
    }

    public function chunkSize(): int
    {
        return 100;
    }

    public function onError(Throwable $e): void
    {
        $this->errors[] = [
            'type' => 'exception',
            'message' => $e->getMessage(),
        ];

        Log::warning('RekapBumilImport error', [
            'level' => $this->level,
            'kecamatan' => $this->kecamatan,
            'desa' => $this->desa,
            'tahun' => $this->tahun,
            'bulan' => $this->bulan,
            'message' => $e->getMessage(),
        ]);
    }

    public function onFailure(Failure ...$failures): void
    {
        foreach ($failures as $failure) {
            $this->errors[] = [
                'type' => 'validation',
                'row' => $failure->row(),
                'attribute' => $failure->attribute(),
                'errors' => $failure->errors(),
                'values' => $failure->values(),
            ];

            Log::warning('RekapBumilImport validation failed', [
                'level' => $this->level,
                'row' => $failure->row(),
                'attribute' => $failure->attribute(),
                'errors' => $failure->errors(),
            ]);
        }
    }

    public function getSuccessCount(): int { return $this->successCount; }
    public function getSkipCount(): int { return $this->skipCount; }
    public function getErrors(): array { return $this->errors; }

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
        if ($value === null || $value === '' || $value === '-') return 0;
        if (is_int($value)) return $value;
        if (is_float($value)) return (int) $value;

        $cleaned = preg_replace('/[^\d-]/', '', (string) $value);
        return (int) ($cleaned ?: 0);
    }

    private function clean($value): ?string
    {
        if ($value === null) return null;
        $value = trim((string) $value);
        return $value === '' ? null : $value;
    }

    private function namaBulan(int $bulan): string
    {
        $bulanIndo = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember',
        ];
        return $bulanIndo[$bulan] ?? 'Januari';
    }
}
