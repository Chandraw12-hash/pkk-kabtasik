<?php

namespace App\Imports;

use App\Models\RekapKegiatanWarga;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithCalculatedFormulas;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Maatwebsite\Excel\Validators\Failure;
use Throwable;

class RekapKegiatanWargaImport implements
    ToModel,
    WithStartRow,
    SkipsEmptyRows,
    SkipsOnError,
    SkipsOnFailure,
    WithChunkReading,
    WithCalculatedFormulas
{
    // === PETA KOLOM (0-based) — 1 baris Excel = 1 RT ===
    private const COL_NO = 0;
    private const COL_NAMA_DUSUN = 1;
    private const COL_RW = 2;
    private const COL_RT = 3;
    private const COL_JUMLAH_RT = 4;
    private const COL_JUMLAH_DASA_WISMA = 5;
    private const COL_JUMLAH_KRT = 6;
    private const COL_JUMLAH_KK = 7;
    private const COL_TOTAL_L = 8;
    private const COL_TOTAL_P = 9;
    private const COL_BALITA_L = 10;
    private const COL_BALITA_P = 11;
    private const COL_PUS = 12;
    private const COL_WUS = 13;
    private const COL_IBU_HAMIL = 14;
    private const COL_IBU_MENYUSUI = 15;
    private const COL_LANSIA = 16;
    private const COL_BUTA_L = 17;
    private const COL_BUTA_P = 18;
    private const COL_RUMAH_SEHAT = 19;
    private const COL_RUMAH_KURANG_SEHAT = 20;
    private const COL_TEMPAT_SAMPAH = 21;
    private const COL_SPAL = 22;
    private const COL_STIKER_P4K = 23;
    private const COL_PDAM = 24;
    private const COL_SUMUR = 25;
    private const COL_SUNGAI = 26;
    private const COL_AIR_DLL = 27;
    private const COL_JAMBAN = 28;
    private const COL_POKOK_BERAS = 29;
    private const COL_NON_BERAS = 30;
    private const COL_UP2K = 31;
    private const COL_TANAH_PEKARANGAN = 32;
    private const COL_INDUSTRI_RT = 33;
    private const COL_KESLING = 34;
    private const COL_KET = 35;

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
        $this->kecamatan = trim($kecamatan);
        $this->desa = trim($desa);
        $this->tahun = $tahun;
        $this->level = $level;
    }

    public function startRow(): int
    {
        return 3;
    }

    public function model(array $row)
    {
        if ($this->isEmptyRow($row)) {
            $this->skipCount++;
            return null;
        }

        $namaDusun = $this->clean($row[self::COL_NAMA_DUSUN] ?? null);
        $rw = $this->cleanRw($row[self::COL_RW] ?? null);
        $rt = $this->clean($row[self::COL_RT] ?? null);

        // Dusun dan RW wajib ada, kalau tidak baris tidak bisa dinaikkan ke level atas
        if ($namaDusun === null || $rw === null || $rt === null) {
            $this->skipCount++;
            $this->errors[] = [
                'type' => 'validation',
                'message' => 'Baris di-skip: Nama Dusun, RW, atau RT kosong.',
                'values' => [
                    'no' => $row[self::COL_NO] ?? null,
                    'dusun' => $namaDusun,
                    'rw' => $rw,
                    'rt' => $rt,
                ],
            ];
            return null;
        }

        $uniqueKey = [
            'kecamatan' => $this->kecamatan,
            'desa' => $this->desa,
            'tahun' => $this->tahun,
            'level' => $this->level,
            'dusun' => $namaDusun,
            'rw' => $rw,
            'rt' => $rt,
        ];

        $data = array_merge($uniqueKey, [
            'nama_kecamatan' => $this->kecamatan,
            'nama_desa' => $this->desa,
            'nama_dusun' => $namaDusun,

            // jumlah_dusun & jumlah_rw dihitung sistem, tidak diinput
            'jumlah_rt' => $this->toInt($row[self::COL_JUMLAH_RT] ?? null),
            'jumlah_dasa_wisma' => $this->toInt($row[self::COL_JUMLAH_DASA_WISMA] ?? null),
            'jumlah_krt' => $this->toInt($row[self::COL_JUMLAH_KRT] ?? null),
            'jumlah_kk' => $this->toInt($row[self::COL_JUMLAH_KK] ?? null),

            'total_l' => $this->toInt($row[self::COL_TOTAL_L] ?? null),
            'total_p' => $this->toInt($row[self::COL_TOTAL_P] ?? null),
            'balita_l' => $this->toInt($row[self::COL_BALITA_L] ?? null),
            'balita_p' => $this->toInt($row[self::COL_BALITA_P] ?? null),
            'pus' => $this->toInt($row[self::COL_PUS] ?? null),
            'wus' => $this->toInt($row[self::COL_WUS] ?? null),
            'ibu_hamil' => $this->toInt($row[self::COL_IBU_HAMIL] ?? null),
            'ibu_menyusui' => $this->toInt($row[self::COL_IBU_MENYUSUI] ?? null),
            'lansia' => $this->toInt($row[self::COL_LANSIA] ?? null),
            'buta_l' => $this->toInt($row[self::COL_BUTA_L] ?? null),
            'buta_p' => $this->toInt($row[self::COL_BUTA_P] ?? null),

            'rumah_sehat' => $this->toInt($row[self::COL_RUMAH_SEHAT] ?? null),
            'rumah_kurang_sehat' => $this->toInt($row[self::COL_RUMAH_KURANG_SEHAT] ?? null),
            'memiliki_tempat_sampah' => $this->toInt($row[self::COL_TEMPAT_SAMPAH] ?? null),
            'memiliki_spal' => $this->toInt($row[self::COL_SPAL] ?? null),
            'memiliki_stiker_p4k' => $this->toInt($row[self::COL_STIKER_P4K] ?? null),

            'air_pdam' => $this->toInt($row[self::COL_PDAM] ?? null),
            'air_sumur' => $this->toInt($row[self::COL_SUMUR] ?? null),
            'air_sungai' => $this->toInt($row[self::COL_SUNGAI] ?? null),
            'air_dll' => $this->toInt($row[self::COL_AIR_DLL] ?? null),

            'jumlah_jamban_keluarga' => $this->toInt($row[self::COL_JAMBAN] ?? null),

            'makanan_pokok_beras' => $this->toInt($row[self::COL_POKOK_BERAS] ?? null),
            'makanan_pokok_non_beras' => $this->toInt($row[self::COL_NON_BERAS] ?? null),

            'kegiatan_up2k' => $this->toInt($row[self::COL_UP2K] ?? null),
            'kegiatan_tanah_pekarangan' => $this->toInt($row[self::COL_TANAH_PEKARANGAN] ?? null),
            'kegiatan_industri_rumah_tangga' => $this->toInt($row[self::COL_INDUSTRI_RT] ?? null),
            'kegiatan_kesehatan_lingkungan' => $this->toInt($row[self::COL_KESLING] ?? null),

            'keterangan' => $this->clean($row[self::COL_KET] ?? null),
            'created_by' => auth()->id(),
        ]);

        $result = RekapKegiatanWarga::updateOrCreate($uniqueKey, $data);

        if ($result) {
            $this->successCount++;
        }

        return $result;
    }

    public function chunkSize(): int
    {
        return 100;
    }

    public function onError(Throwable $e): void
    {
        $this->errors[] = ['type' => 'exception', 'message' => $e->getMessage()];

        Log::warning('RekapKegiatanWargaImport error', [
            'level' => $this->level,
            'kecamatan' => $this->kecamatan,
            'desa' => $this->desa,
            'tahun' => $this->tahun,
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
        }
    }

    public function getSuccessCount(): int { return $this->successCount; }
    public function getSkipCount(): int { return $this->skipCount; }
    public function getErrors(): array { return $this->errors; }

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

    /** RW dari Excel bisa terbaca 1, 1.0, "01", atau "RW 01". Samakan jadi "1". */
    private function cleanRw($value): ?string
    {
        $value = $this->clean($value);
        if ($value === null) return null;
        if (is_numeric($value)) return (string) (int) $value;
        if (preg_match('/(\d+)/', $value, $m)) return (string) (int) $m[1];
        return $value;
    }
}
