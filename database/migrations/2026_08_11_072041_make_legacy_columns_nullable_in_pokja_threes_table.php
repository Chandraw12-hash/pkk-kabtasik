<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Kolom-kolom lama (peninggalan skema sebelumnya) yang sekarang
        // tidak lagi diisi oleh Pokja3Controller / Pokja3Import.
        // Kita longgarkan constraint NOT NULL-nya agar insert data rekap
        // (kategori, kecamatan, rumah_sehat, dst) tidak lagi ditolak.
        if (Schema::hasColumn('pokja_threes', 'judul_kegiatan')) {
            DB::statement('ALTER TABLE pokja_threes ALTER COLUMN judul_kegiatan DROP NOT NULL');
        }
        if (Schema::hasColumn('pokja_threes', 'deskripsi')) {
            DB::statement('ALTER TABLE pokja_threes ALTER COLUMN deskripsi DROP NOT NULL');
        }
        if (Schema::hasColumn('pokja_threes', 'foto')) {
            DB::statement('ALTER TABLE pokja_threes ALTER COLUMN foto DROP NOT NULL');
        }
    }

    public function down(): void
    {
        // Sengaja tidak dikembalikan ke NOT NULL otomatis di rollback,
        // karena kemungkinan sudah ada baris dengan nilai null yang akan
        // membuat rollback ini gagal. Kembalikan manual jika benar-benar perlu.
    }
};
