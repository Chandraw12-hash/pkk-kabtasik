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
            $table->string('kecamatan', 100);
            $table->string('nama_kecamatan', 100)->nullable();
            $table->integer('tahun');
            $table->string('semester', 5)->default('I');

            // A. Data Dukung — kontrak key dengan DataDukung.tsx
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

            // Kop laporan (dari aplikasi mobile)
            $table->string('provinsi', 100)->nullable();
            $table->string('kabupaten_kota', 100)->nullable();
            $table->string('program', 255)->nullable();
            $table->string('pj_desa', 100)->nullable();
            $table->string('pj_desa_hp', 30)->nullable();
            $table->string('pj_kecamatan', 100)->nullable();
            $table->string('pj_kecamatan_hp', 30)->nullable();
            $table->string('pj_kabupaten', 100)->nullable();
            $table->string('pj_kabupaten_hp', 30)->nullable();
            $table->string('pj_provinsi', 100)->nullable();
            $table->string('pj_provinsi_hp', 30)->nullable();

            $table->timestamps();

            $table->unique(['kecamatan', 'tahun', 'semester'], 'pokja4_dukung_kec_thn_sem');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pokja4_data_dukung');
    }
};
