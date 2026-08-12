<?php

namespace App\Imports;

use App\Models\Pokja1;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;

class Pokja1Import implements ToModel, WithHeadingRow, WithBatchInserts, WithChunkReading
{
    public function model(array $row)
    {
        if (empty($row['kecamatan'])) {
            return null;
        }

        $kecamatan = $row['kecamatan'];

        return new Pokja1([
            // Default lebih bermakna: kalau file Excel tidak punya kolom judul_kegiatan/deskripsi,
            // data tetap informatif alih-alih tampil sebagai tanda "-" polos di halaman admin.
            'judul_kegiatan' => $row['judul_kegiatan'] ?? "Rekap Data - {$kecamatan}",
            'deskripsi'      => $row['deskripsi'] ?? "Data hasil import rekapitulasi Pokja I untuk Kecamatan {$kecamatan}.",
            'kategori'       => $row['kategori'] ?? 'Umum',
            'kecamatan'      => $kecamatan,
            'nama_kecamatan' => $kecamatan,
            'pkbn_l'         => $row['pkbn_l'] ?? 0,
            'pkbn_p'         => $row['pkbn_p'] ?? 0,
            'pkdrt_l'        => $row['pkdrt_l'] ?? 0,
            'pkdrt_p'        => $row['pkdrt_p'] ?? 0,
            'pola_asuh_l'    => $row['pola_asuh_l'] ?? 0,
            'pola_asuh_p'    => $row['pola_asuh_p'] ?? 0,
            'lansia_l'       => $row['lansia_l'] ?? 0,
            'lansia_p'       => $row['lansia_p'] ?? 0,
            'kader_pokja1_l' => $row['kader_pokja1_l'] ?? 0,
            'kader_pokja1_p' => $row['kader_pokja1_p'] ?? 0,
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
