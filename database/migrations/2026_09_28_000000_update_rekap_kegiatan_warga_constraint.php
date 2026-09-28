<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE rekap_kegiatan_warga DROP CONSTRAINT IF EXISTS rekap_kegiatan_warga_unique_v2');
        DB::statement('ALTER TABLE rekap_kegiatan_warga ADD CONSTRAINT rekap_kegiatan_warga_unique_v2 UNIQUE (kecamatan, tahun, level, dusun, rw, rt)');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE rekap_kegiatan_warga DROP CONSTRAINT IF EXISTS rekap_kegiatan_warga_unique_v2');
        DB::statement('ALTER TABLE rekap_kegiatan_warga ADD CONSTRAINT rekap_kegiatan_warga_unique_v2 UNIQUE (kecamatan, tahun, level)');
    }
};
