<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rekap_kegiatan_warga', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wilayah_id')->nullable();
            $table->year('tahun')->default(2025);
            $table->string('kecamatan');
            $table->string('nama_kecamatan')->nullable();
            $table->string('desa')->nullable();
            $table->string('nama_desa')->nullable();
            $table->string('dusun')->nullable();
            $table->string('nama_dusun')->nullable();
            $table->string('rw')->nullable();
            $table->string('rt')->nullable();
            $table->string('level')->default('kecamatan');

            // Jumlah Wilayah
            $table->integer('jumlah_dusun')->default(0);
            $table->integer('jumlah_rw')->default(0);
            $table->integer('jumlah_rt')->default(0);
            $table->integer('jumlah_dasa_wisma')->default(0);

            // KRT & KK
            $table->integer('jumlah_krt')->default(0);
            $table->integer('jumlah_kk')->default(0);

            // Anggota Keluarga
            $table->integer('total_l')->default(0);
            $table->integer('total_p')->default(0);
            $table->integer('balita_l')->default(0);
            $table->integer('balita_p')->default(0);
            $table->integer('pus')->default(0);
            $table->integer('wus')->default(0);
            $table->integer('ibu_hamil')->default(0);
            $table->integer('ibu_menyusui')->default(0);
            $table->integer('lansia')->default(0);
            $table->integer('buta_l')->default(0);
            $table->integer('buta_p')->default(0);

            // Kriteria Rumah
            $table->integer('rumah_sehat')->default(0);
            $table->integer('rumah_kurang_sehat')->default(0);
            $table->integer('memiliki_tempat_sampah')->default(0);
            $table->integer('memiliki_spal')->default(0);
            $table->integer('memiliki_stiker_p4k')->default(0);

            // Sumber Air
            $table->integer('air_pdam')->default(0);
            $table->integer('air_sumur')->default(0);
            $table->integer('air_sungai')->default(0);
            $table->integer('air_dll')->default(0);

            // Jamban
            $table->integer('jumlah_jamban_keluarga')->default(0);

            // Makanan Pokok
            $table->integer('makanan_pokok_beras')->default(0);
            $table->integer('makanan_pokok_non_beras')->default(0);

            // Warga Mengikuti Kegiatan
            $table->integer('kegiatan_up2k')->default(0);
            $table->integer('kegiatan_tanah_pekarangan')->default(0);
            $table->integer('kegiatan_industri_rumah_tangga')->default(0);
            $table->integer('kegiatan_kesehatan_lingkungan')->default(0);

            $table->text('keterangan')->nullable();

            // Audit
            $table->foreignId('created_by')->nullable();
            $table->foreignId('updated_by')->nullable();
            $table->timestamps();

            // Index
            $table->unique(['kecamatan', 'tahun', 'level']);
            $table->index(['tahun', 'level']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rekap_kegiatan_warga');
    }
};
