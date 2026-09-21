<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. TAMBAH kecamatan
        if (!Schema::hasColumn('pokja4_kunjungan_pyd', 'kecamatan')) {
            DB::statement('ALTER TABLE pokja4_kunjungan_pyd ADD COLUMN kecamatan VARCHAR(255) NULL AFTER id');
        }

        // 2. RENAME kolom via SQL
        if (Schema::hasColumn('pokja4_kunjungan_pyd', 'bayi_l')) {
            DB::statement('ALTER TABLE pokja4_kunjungan_pyd CHANGE bayi_l bayi_0_12_l INT DEFAULT 0');
        }
        if (Schema::hasColumn('pokja4_kunjungan_pyd', 'bayi_p')) {
            DB::statement('ALTER TABLE pokja4_kunjungan_pyd CHANGE bayi_p bayi_0_12_p INT DEFAULT 0');
        }
        if (Schema::hasColumn('pokja4_kunjungan_pyd', 'balita_l')) {
            DB::statement('ALTER TABLE pokja4_kunjungan_pyd CHANGE balita_l balita_1_5_l INT DEFAULT 0');
        }
        if (Schema::hasColumn('pokja4_kunjungan_pyd', 'balita_p')) {
            DB::statement('ALTER TABLE pokja4_kunjungan_pyd CHANGE balita_p balita_1_5_p INT DEFAULT 0');
        }
        if (Schema::hasColumn('pokja4_kunjungan_pyd', 'ibu_pus')) {
            DB::statement('ALTER TABLE pokja4_kunjungan_pyd CHANGE ibu_pus pus INT DEFAULT 0');
        }
        if (Schema::hasColumn('pokja4_kunjungan_pyd', 'kematian_ibu_hamil')) {
            DB::statement('ALTER TABLE pokja4_kunjungan_pyd CHANGE kematian_ibu_hamil kematian_ibu INT DEFAULT 0');
        }

        // 3. HAPUS kolom lama
        if (Schema::hasColumn('pokja4_kunjungan_pyd', 'kematian_ibu_melahirkan')) {
            DB::statement('ALTER TABLE pokja4_kunjungan_pyd DROP COLUMN kematian_ibu_melahirkan');
        }
        if (Schema::hasColumn('pokja4_kunjungan_pyd', 'kematian_ibu_nifas')) {
            DB::statement('ALTER TABLE pokja4_kunjungan_pyd DROP COLUMN kematian_ibu_nifas');
        }

        // 4. TAMBAH kolom baru
        if (!Schema::hasColumn('pokja4_kunjungan_pyd', 'bayi_0_12_laki_l')) {
            DB::statement('ALTER TABLE pokja4_kunjungan_pyd ADD COLUMN bayi_0_12_laki_l INT DEFAULT 0');
        }
        if (!Schema::hasColumn('pokja4_kunjungan_pyd', 'bayi_0_12_laki_p')) {
            DB::statement('ALTER TABLE pokja4_kunjungan_pyd ADD COLUMN bayi_0_12_laki_p INT DEFAULT 0');
        }
        if (!Schema::hasColumn('pokja4_kunjungan_pyd', 'balita_1_5_laki_l')) {
            DB::statement('ALTER TABLE pokja4_kunjungan_pyd ADD COLUMN balita_1_5_laki_l INT DEFAULT 0');
        }
        if (!Schema::hasColumn('pokja4_kunjungan_pyd', 'balita_1_5_laki_p')) {
            DB::statement('ALTER TABLE pokja4_kunjungan_pyd ADD COLUMN balita_1_5_laki_p INT DEFAULT 0');
        }
    }

    public function down(): void
    {
        // Reverse — opsional
    }
};
