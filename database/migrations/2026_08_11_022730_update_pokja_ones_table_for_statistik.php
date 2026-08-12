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
    Schema::table('pokja_ones', function (Blueprint $table) {
        // hapus kolom lama (opsional, hati-hati jika sudah ada data)
        // $table->dropColumn(['judul_kegiatan', 'deskripsi', 'foto']);

        $table->string('kecamatan')->nullable();
        $table->integer('pkbn_l')->default(0);
        $table->integer('pkbn_p')->default(0);
        $table->integer('pkdrt_l')->default(0);
        $table->integer('pkdrt_p')->default(0);
        $table->integer('pola_asuh_l')->default(0);
        $table->integer('pola_asuh_p')->default(0);
        $table->integer('lansia_l')->default(0);
        $table->integer('lansia_p')->default(0);
        $table->integer('kader_pokja1_l')->default(0);
        $table->integer('kader_pokja1_p')->default(0);
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
