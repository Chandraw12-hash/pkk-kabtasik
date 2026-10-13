<?php

namespace Database\Seeders;

use App\Models\WilayahDesa;
use Illuminate\Database\Seeder;

class WilayahDesaSeeder extends Seeder
{
    /**
     * Pindahkan master 39 kecamatan / 351 desa dari konstanta
     * AdminDesaSeeder::DATA_DESA ke tabel wilayah_desa agar bisa
     * dikelola super-admin via UI (tambah kecamatan/desa, nonaktifkan).
     * Idempoten: hanya tambah yang belum ada.
     */
    public function run(): void
    {
        $result = WilayahDesa::syncFromSeeder(AdminDesaSeeder::DATA_DESA);

        $this->command->info(
            "Wilayah desa: +{$result['added']} baru, total {$result['total']} baris."
        );
    }
}
