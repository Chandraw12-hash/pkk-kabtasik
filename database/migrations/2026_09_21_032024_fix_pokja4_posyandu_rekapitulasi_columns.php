<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ═══════════════════════════════════════════════════════
        // 1. POKJA4_KEGIATAN_POSYANDU — TAMBAH kecamatan
        // ═══════════════════════════════════════════════════════
        if (!Schema::hasColumn('pokja4_kegiatan_posyandu', 'kecamatan')) {
            DB::statement('ALTER TABLE pokja4_kegiatan_posyandu ADD COLUMN kecamatan VARCHAR(255)');
            echo "✅ Tambah kolom kecamatan di pokja4_kegiatan_posyandu\n";
        }

        // ═══════════════════════════════════════════════════════
        // 2. POKJA4_REKAPITULASI — FIX kolom
        // ═══════════════════════════════════════════════════════

        // 2a. Rename nama_kecamatan → kecamatan
        if (Schema::hasColumn('pokja4_rekapitulasi', 'nama_kecamatan')) {
            DB::statement('ALTER TABLE pokja4_rekapitulasi RENAME COLUMN nama_kecamatan TO kecamatan');
            echo "✅ Rename nama_kecamatan → kecamatan\n";
        }

        // Kalau nama_kecamatan ga ada dan kecamatan juga ga ada → tambah
        if (!Schema::hasColumn('pokja4_rekapitulasi', 'kecamatan')) {
            DB::statement('ALTER TABLE pokja4_rekapitulasi ADD COLUMN kecamatan VARCHAR(255)');
            echo "✅ Tambah kolom kecamatan di pokja4_rekapitulasi\n";
        }

        // 2b. Rename bayi_akte_ada → akte_ada
        if (Schema::hasColumn('pokja4_rekapitulasi', 'bayi_akte_ada')) {
            DB::statement('ALTER TABLE pokja4_rekapitulasi RENAME COLUMN bayi_akte_ada TO akte_ada');
            echo "✅ Rename bayi_akte_ada → akte_ada\n";
        }

        // 2c. Rename bayi_akte_tidak → akte_tidak
        if (Schema::hasColumn('pokja4_rekapitulasi', 'bayi_akte_tidak')) {
            DB::statement('ALTER TABLE pokja4_rekapitulasi RENAME COLUMN bayi_akte_tidak TO akte_tidak');
            echo "✅ Rename bayi_akte_tidak → akte_tidak\n";
        }
    }

    public function down(): void
    {
        // Reverse — opsional
        if (Schema::hasColumn('pokja4_kegiatan_posyandu', 'kecamatan')) {
            DB::statement('ALTER TABLE pokja4_kegiatan_posyandu DROP COLUMN kecamatan');
        }
        if (Schema::hasColumn('pokja4_rekapitulasi', 'kecamatan')) {
            DB::statement('ALTER TABLE pokja4_rekapitulasi RENAME COLUMN kecamatan TO nama_kecamatan');
        }
        if (Schema::hasColumn('pokja4_rekapitulasi', 'akte_ada')) {
            DB::statement('ALTER TABLE pokja4_rekapitulasi RENAME COLUMN akte_ada TO bayi_akte_ada');
        }
        if (Schema::hasColumn('pokja4_rekapitulasi', 'akte_tidak')) {
            DB::statement('ALTER TABLE pokja4_rekapitulasi RENAME COLUMN akte_tidak TO bayi_akte_tidak');
        }
    }
};
