<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pokja4_rekapitulasi', function (Blueprint $table) {
            $table->id();
            $table->string('nama_kecamatan');
            $table->integer('tahun')->default(2025);

            // WILAYAH
            $table->integer('dusun')->default(0);
            $table->integer('rw')->default(0);
            $table->integer('rt')->default(0);
            $table->integer('dasa_wisma')->default(0);

            // IBU
            $table->integer('ibu_hamil')->default(0);
            $table->integer('ibu_melahirkan')->default(0);
            $table->integer('ibu_nifas')->default(0);
            $table->integer('ibu_meninggal')->default(0);

            // BAYI
            $table->integer('bayi_lahir_l')->default(0);
            $table->integer('bayi_lahir_p')->default(0);
            $table->integer('bayi_akte_ada')->default(0);
            $table->integer('bayi_akte_tidak')->default(0);
            $table->integer('bayi_meninggal_l')->default(0);
            $table->integer('bayi_meninggal_p')->default(0);

            // BALITA MENINGGAL
            $table->integer('balita_meninggal_l')->default(0);
            $table->integer('balita_meninggal_p')->default(0);

            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pokja4_rekapitulasi');
    }
};
