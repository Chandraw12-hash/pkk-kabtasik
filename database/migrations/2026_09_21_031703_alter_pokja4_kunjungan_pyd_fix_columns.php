<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ─── STEP 1: TAMBAH kolom kecamatan ─────────────────
        if (!Schema::hasColumn('pokja4_kunjungan_pyd', 'kecamatan')) {
            Schema::table('pokja4_kunjungan_pyd', function (Blueprint $table) {
                $table->string('kecamatan')->nullable()->after('id');
            });
        }

        // ─── STEP 2: RENAME kolom ──────────────────────────
        Schema::table('pokja4_kunjungan_pyd', function (Blueprint $table) {
            if (Schema::hasColumn('pokja4_kunjungan_pyd', 'bayi_l')) {
                $table->renameColumn('bayi_l', 'bayi_0_12_l');
            }
            if (Schema::hasColumn('pokja4_kunjungan_pyd', 'bayi_p')) {
                $table->renameColumn('bayi_p', 'bayi_0_12_p');
            }
            if (Schema::hasColumn('pokja4_kunjungan_pyd', 'balita_l')) {
                $table->renameColumn('balita_l', 'balita_1_5_l');
            }
            if (Schema::hasColumn('pokja4_kunjungan_pyd', 'balita_p')) {
                $table->renameColumn('balita_p', 'balita_1_5_p');
            }
            if (Schema::hasColumn('pokja4_kunjungan_pyd', 'ibu_pus')) {
                $table->renameColumn('ibu_pus', 'pus');
            }
            if (Schema::hasColumn('pokja4_kunjungan_pyd', 'kematian_ibu_hamil')) {
                $table->renameColumn('kematian_ibu_hamil', 'kematian_ibu');
            }
        });

        // ─── STEP 3: HAPUS kolom lama ──────────────────────
        Schema::table('pokja4_kunjungan_pyd', function (Blueprint $table) {
            $columnsToDrop = [];
            if (Schema::hasColumn('pokja4_kunjungan_pyd', 'kematian_ibu_melahirkan')) {
                $columnsToDrop[] = 'kematian_ibu_melahirkan';
            }
            if (Schema::hasColumn('pokja4_kunjungan_pyd', 'kematian_ibu_nifas')) {
                $columnsToDrop[] = 'kematian_ibu_nifas';
            }
            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });

        // ─── STEP 4: TAMBAH kolom baru ─────────────────────
        Schema::table('pokja4_kunjungan_pyd', function (Blueprint $table) {
            if (!Schema::hasColumn('pokja4_kunjungan_pyd', 'bayi_0_12_laki_l')) {
                $table->integer('bayi_0_12_laki_l')->default(0)->after('bayi_0_12_p');
            }
            if (!Schema::hasColumn('pokja4_kunjungan_pyd', 'bayi_0_12_laki_p')) {
                $table->integer('bayi_0_12_laki_p')->default(0)->after('bayi_0_12_laki_l');
            }
            if (!Schema::hasColumn('pokja4_kunjungan_pyd', 'balita_1_5_laki_l')) {
                $table->integer('balita_1_5_laki_l')->default(0)->after('balita_1_5_p');
            }
            if (!Schema::hasColumn('pokja4_kunjungan_pyd', 'balita_1_5_laki_p')) {
                $table->integer('balita_1_5_laki_p')->default(0)->after('balita_1_5_laki_l');
            }
        });
    }

    public function down(): void
    {
        // Reverse — opsional
    }
};
