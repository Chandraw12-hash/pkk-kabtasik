<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rekap_bumil', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wilayah_id')->nullable();
            $table->year('tahun')->default(2025);
            $table->integer('bulan')->nullable();  // 1-12
            $table->string('nama_bulan')->nullable();
            $table->string('kecamatan');
            $table->string('nama_kecamatan')->nullable();
            $table->string('desa')->nullable();
            $table->string('nama_desa')->nullable();
            $table->string('dusun')->nullable();
            $table->string('nama_dusun')->nullable();
            $table->string('rw')->nullable();
            $table->string('rt')->nullable();
            $table->string('nama_dasawisma')->nullable();
            $table->string('level')->default('kecamatan');

            // Jumlah Wilayah
            $table->integer('jumlah_dusun')->default(0);
            $table->integer('jumlah_rw')->default(0);
            $table->integer('jumlah_rt')->default(0);
            $table->integer('jumlah_dasa_wisma')->default(0);

            // Jumlah Ibu
            $table->integer('ibu_hamil')->default(0);
            $table->integer('ibu_melahirkan')->default(0);
            $table->integer('ibu_nifas')->default(0);
            $table->integer('ibu_meninggal')->default(0);

            // Jumlah Bayi
            $table->integer('bayi_lahir_l')->default(0);
            $table->integer('bayi_lahir_p')->default(0);
            $table->integer('akte_ada')->default(0);
            $table->integer('akte_tidak_ada')->default(0);
            $table->integer('bayi_meninggal_l')->default(0);
            $table->integer('bayi_meninggal_p')->default(0);

            // Jumlah Balita Meninggal
            $table->integer('balita_meninggal_l')->default(0);
            $table->integer('balita_meninggal_p')->default(0);

            $table->text('keterangan')->nullable();

            // Audit
            $table->foreignId('created_by')->nullable();
            $table->foreignId('updated_by')->nullable();
            $table->timestamps();

            // Index
            $table->unique(['kecamatan', 'tahun', 'bulan', 'level']);
            $table->index(['tahun', 'bulan', 'level']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rekap_bumil');
    }
};
