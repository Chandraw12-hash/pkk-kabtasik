<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
{
    Schema::table('pokja_twos', function (Blueprint $table) {
        $table->string('kecamatan')->nullable();
        $table->integer('warga_buta_l')->default(0);
        $table->integer('warga_buta_p')->default(0);
        $table->integer('kelompok_belajar_paket_a')->default(0);
        $table->integer('kelompok_belajar_paket_b')->default(0);
        $table->integer('kelompok_belajar_paket_c')->default(0);
        $table->integer('kf')->default(0);
        $table->integer('paud')->default(0);
        $table->integer('koperasi_berbadan_hukum')->default(0);
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
