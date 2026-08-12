<?php

namespace App\Imports;

use App\Models\DataUmumSekretariat;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;

class SekretariatImport implements ToModel, WithHeadingRow, WithBatchInserts, WithChunkReading
{
    public function model(array $row)
    {
        if (empty($row['kecamatan'])) {
            return null;
        }

        return new DataUmumSekretariat([
    'kategori'          => $row['kategori'] ?? 'Umum',
    'kecamatan'         => $row['kecamatan'] ?? null,
    'nama_kecamatan'    => $row['kecamatan'] ?? null, // isi juga kolom NOT NULL ini
    'jumlah_pkk_rw'     => $row['jumlah_pkk_rw'] ?? 0,
    'jumlah_pkk_rt'     => $row['jumlah_pkk_rt'] ?? 0,
    'jumlah_dasa_wisma' => $row['jumlah_dasa_wisma'] ?? 0,
    'jumlah_krt'        => $row['jumlah_krt'] ?? 0,
    'jumlah_kk'         => $row['jumlah_kk'] ?? 0,
    'jiwa_l'            => $row['jiwa_l'] ?? 0,
    'jiwa_p'            => $row['jiwa_p'] ?? 0,
    'tp_pkk_l'          => $row['tp_pkk_l'] ?? 0,
    'tp_pkk_p'          => $row['tp_pkk_p'] ?? 0,
    'kader_umum_l'      => $row['kader_umum_l'] ?? 0,
    'kader_umum_p'      => $row['kader_umum_p'] ?? 0,
    'kader_khusus_l'    => $row['kader_khusus_l'] ?? 0,
    'kader_khusus_p'    => $row['kader_khusus_p'] ?? 0,
]);
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
