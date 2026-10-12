<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pokja4_data_dukung', function (Blueprint $table) {
            $table->id();
            $table->string('kecamatan');
            $table->integer('tahun');
            $table->string('semester', 2)->default('I');

            // META / KOP LAPORAN
            $table->string('provinsi')->nullable();
            $table->string('kabupaten_kota')->nullable();
            $table->string('desa_kelurahan')->nullable();
            $table->string('program')->nullable();
            $table->string('pj_desa')->nullable();
            $table->string('pj_desa_hp')->nullable();
            $table->string('pj_kecamatan')->nullable();
            $table->string('pj_kecamatan_hp')->nullable();
            $table->string('pj_kabupaten')->nullable();
            $table->string('pj_kabupaten_hp')->nullable();
            $table->string('pj_provinsi')->nullable();
            $table->string('pj_provinsi_hp')->nullable();

            // A. DATA DUKUNG — 26 INDIKATOR
            $table->integer('jumlah_penduduk')->default(0);
            $table->integer('jumlah_kepala_keluarga')->default(0);
            $table->integer('jumlah_rumah')->default(0);
            $table->integer('jumlah_laki_laki')->default(0);
            $table->integer('jumlah_perempuan')->default(0);
            $table->integer('jumlah_usia_produktif')->default(0);
            $table->integer('jumlah_pasangan_usia_subur')->default(0);
            $table->integer('jumlah_ibu_hamil')->default(0);
            $table->integer('jumlah_bayi_0_2')->default(0);
            $table->integer('jumlah_bayi_asi_eksklusif')->default(0);
            $table->integer('jumlah_balita_2_5')->default(0);
            $table->integer('jumlah_anak_6_14')->default(0);
            $table->integer('jumlah_lansia')->default(0);
            $table->integer('jumlah_peserta_kb_aktif')->default(0);
            $table->integer('jumlah_ibu_menyusui')->default(0);
            $table->integer('jumlah_keluarga_sejahtera')->default(0);
            $table->integer('jumlah_keluarga_pra_sejahtera')->default(0);
            $table->integer('jumlah_mbr')->default(0);
            $table->integer('jumlah_kader_pkk_rt_rw')->default(0);
            $table->integer('jumlah_kader_pkk_kesehatan')->default(0);
            $table->integer('jumlah_kelompok_dasa_wisma')->default(0);
            $table->integer('jumlah_kader_dasa_wisma')->default(0);
            $table->integer('jumlah_posyandu_aktif')->default(0);
            $table->integer('jumlah_bidan_desa')->default(0);
            $table->integer('jumlah_bank_sampah')->default(0);
            $table->integer('jumlah_posko_bencana')->default(0);

            $table->text('evaluasi')->nullable();
            $table->text('keterangan')->nullable();
            $table->timestamps();

            $table->unique(['kecamatan', 'tahun', 'semester']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pokja4_data_dukung');
    }
};
