<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // ============================================================
        // DROP CONSTRAINT LAMA
        // ============================================================
        DB::statement('ALTER TABLE data_umum_pkk DROP CONSTRAINT IF EXISTS data_umum_pkk_kecamatan_tahun_level_unique');
        DB::statement('ALTER TABLE rekap_kegiatan_warga DROP CONSTRAINT IF EXISTS rekap_kegiatan_warga_kecamatan_tahun_level_unique');
        DB::statement('ALTER TABLE rekap_bumil DROP CONSTRAINT IF EXISTS rekap_bumil_kecamatan_tahun_bulan_level_unique');

        // ============================================================
        // BIKIN CONSTRAINT BARU — dengan desa + dusun
        // ============================================================

        // Data Umum — unique per kecamatan + desa + tahun + level + dusun
        Schema::table('data_umum_pkk', function (Blueprint $table) {
            $table->unique(
                ['kecamatan', 'desa', 'tahun', 'level', 'dusun'],
                'data_umum_pkk_unique_v2'
            );
        });

        // Kegiatan — unique per kecamatan + desa + tahun + level + dusun + rw + rt
        Schema::table('rekap_kegiatan_warga', function (Blueprint $table) {
            $table->unique(
                ['kecamatan', 'desa', 'tahun', 'level', 'dusun', 'rw', 'rt'],
                'rekap_kegiatan_warga_unique_v2'
            );
        });

        // Bumil — unique per kecamatan + desa + tahun + bulan + level + dusun + rw + rt
        Schema::table('rekap_bumil', function (Blueprint $table) {
            $table->unique(
                ['kecamatan', 'desa', 'tahun', 'bulan', 'level', 'dusun', 'rw', 'rt'],
                'rekap_bumil_unique_v2'
            );
        });
    }

    public function down(): void
    {
        // Drop constraint baru
        DB::statement('ALTER TABLE data_umum_pkk DROP CONSTRAINT IF EXISTS data_umum_pkk_unique_v2');
        DB::statement('ALTER TABLE rekap_kegiatan_warga DROP CONSTRAINT IF EXISTS rekap_kegiatan_warga_unique_v2');
        DB::statement('ALTER TABLE rekap_bumil DROP CONSTRAINT IF EXISTS rekap_bumil_unique_v2');

        // Bikin ulang constraint lama
        Schema::table('data_umum_pkk', function (Blueprint $table) {
            $table->unique(['kecamatan', 'tahun', 'level'], 'data_umum_pkk_kecamatan_tahun_level_unique');
        });
        Schema::table('rekap_kegiatan_warga', function (Blueprint $table) {
            $table->unique(['kecamatan', 'tahun', 'level'], 'rekap_kegiatan_warga_kecamatan_tahun_level_unique');
        });
        Schema::table('rekap_bumil', function (Blueprint $table) {
            $table->unique(['kecamatan', 'tahun', 'bulan', 'level'], 'rekap_bumil_kecamatan_tahun_bulan_level_unique');
        });
    }
};
