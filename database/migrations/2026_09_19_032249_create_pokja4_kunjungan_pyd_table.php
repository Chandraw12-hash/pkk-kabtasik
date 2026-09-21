<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pokja4_kunjungan_pyd', function (Blueprint $table) {
            $table->id();
            $table->integer('bulan'); // 1-12
            $table->string('nama_bulan'); // Januari, Februari, dst
            $table->integer('tahun')->default(2025);

            // JUMLAH PENGUNJUNG
            // Bayi 0-12 bulan
            $table->integer('bayi_l')->default(0);
            $table->integer('bayi_p')->default(0);
            // Balita 1-5 tahun
            $table->integer('balita_l')->default(0);
            $table->integer('balita_p')->default(0);
            // WUS
            $table->integer('wus')->default(0);
            // Ibu
            $table->integer('ibu_pus')->default(0);
            $table->integer('ibu_hamil')->default(0);
            $table->integer('ibu_menyusui')->default(0);

            // JUMLAH BAYI
            $table->integer('bayi_lahir')->default(0);
            $table->integer('bayi_meninggal')->default(0);

            // KEMATIAN IBU
            $table->integer('kematian_ibu_hamil')->default(0);
            $table->integer('kematian_ibu_melahirkan')->default(0);
            $table->integer('kematian_ibu_nifas')->default(0);

            // JUMLAH PETUGAS HADIR
            $table->integer('petugas_kader')->default(0);
            $table->integer('petugas_plkb')->default(0);
            $table->integer('petugas_medis')->default(0);

            // KET
            $table->text('keterangan')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pokja4_kunjungan_pyd');
    }
};
