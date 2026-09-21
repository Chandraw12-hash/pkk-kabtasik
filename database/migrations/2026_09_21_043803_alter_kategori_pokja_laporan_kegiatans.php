<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // ✅ Ubah tipe kolom kategori_pokja — dari varchar(10) ke varchar(30)
        DB::statement('ALTER TABLE laporan_kegiatans ALTER COLUMN kategori_pokja TYPE VARCHAR(30)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reverse — ubah balik ke varchar(10)
        DB::statement('ALTER TABLE laporan_kegiatans ALTER COLUMN kategori_pokja TYPE VARCHAR(10)');
    }
};
