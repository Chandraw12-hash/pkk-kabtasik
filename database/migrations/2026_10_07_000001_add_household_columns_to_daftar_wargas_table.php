<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// KK sebagai sumber tunggal: kolom demografi + rumah tangga agar
// rekap bisa dihitung otomatis (SUM) tanpa input manual ulang.
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('daftar_wargas', function (Blueprint $table): void {
            // Demografi (diisi form KK, default 0)
            $table->unsignedInteger('jumlah_balita_l')->default(0);
            $table->unsignedInteger('jumlah_balita_p')->default(0);
            $table->unsignedInteger('jumlah_pus')->default(0);
            $table->unsignedInteger('jumlah_wus')->default(0);
            $table->unsignedInteger('jumlah_ibu_hamil')->default(0);
            $table->unsignedInteger('jumlah_ibu_menyusui')->default(0);
            $table->unsignedInteger('jumlah_lansia')->default(0);
            $table->unsignedInteger('jumlah_buta_l')->default(0);
            $table->unsignedInteger('jumlah_buta_p')->default(0);

            // Rumah tangga
            $table->string('kriteria_rumah', 50)->nullable();
            $table->string('sumber_air', 50)->nullable();
            $table->boolean('memiliki_tempat_sampah')->default(false);
            $table->boolean('memiliki_spal')->default(false);
            $table->boolean('memiliki_stiker_p4k')->default(false);
            $table->boolean('mempunyai_mck')->default(false);
            $table->unsignedInteger('jumlah_mck')->default(0);
            $table->string('makanan_pokok', 50)->nullable();
            $table->boolean('ikut_up2k')->default(false);
            $table->boolean('ikut_kesling')->default(false);
        });
    }

    public function down(): void
    {
        Schema::table('daftar_wargas', function (Blueprint $table): void {
            $table->dropColumn([
                'jumlah_balita_l', 'jumlah_balita_p',
                'jumlah_pus', 'jumlah_wus',
                'jumlah_ibu_hamil', 'jumlah_ibu_menyusui',
                'jumlah_lansia', 'jumlah_buta_l', 'jumlah_buta_p',
                'kriteria_rumah', 'sumber_air',
                'memiliki_tempat_sampah', 'memiliki_spal',
                'memiliki_stiker_p4k', 'mempunyai_mck', 'jumlah_mck',
                'makanan_pokok', 'ikut_up2k', 'ikut_kesling',
            ]);
        });
    }
};
