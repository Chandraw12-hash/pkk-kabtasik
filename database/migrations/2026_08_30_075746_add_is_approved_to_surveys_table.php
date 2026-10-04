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
        // 1. DAFTAR WARGA TP PKK (Form 1)
        if (!Schema::hasTable('dasawisma_wargas')) {
            Schema::create('dasawisma_wargas', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('dasa_wisma')->nullable();
                $table->string('nama_kepala_rumah_tangga')->nullable();
                $table->string('no_registrasi')->nullable();
                $table->string('no_ktp_kk')->nullable();
                $table->string('nama');
                $table->string('jabatan')->nullable();
                $table->enum('jenis_kelamin', ['L', 'P'])->default('P');
                $table->string('tempat_lahir')->nullable();
                $table->date('tanggal_lahir')->nullable();
                $table->string('status_perkawinan')->nullable(); // Menikah, Lajang, Janda, Duda
                $table->string('status_dalam_keluarga')->nullable(); // Kepala Rumah Tangga, Anggota Keluarga Status...
                $table->string('status_keluarga_lainnya')->nullable();
                $table->string('agama')->nullable(); // Islam, Kristen, Katolik, Hindu, Budha, Konghuchu, Kepercayaan, Lain-lain
                $table->text('alamat')->nullable();
                $table->string('rt_rw')->nullable();
                $table->string('desa')->nullable();
                $table->string('kecamatan')->nullable();
                $table->string('kabupaten')->default('Kabupaten Tasikmalaya');

                // Pendidikan & Pekerjaan
                $table->string('pendidikan')->nullable(); // Tidak Tamat SD, SD/MI, SMP/Sederajat, SMA/SMK/Sederajat, Diploma, S1, S2, S3
                $table->string('pekerjaan')->nullable(); // Petani, Pedagang, Swasta, Wirausaha, PNS, TNI/Polri, Lainnya

                // Indikator PKK
                $table->boolean('akseptor_kb')->default(false);
                $table->string('jenis_akseptor_kb')->nullable();
                $table->boolean('aktif_posyandu')->default(false);
                $table->integer('frekuensi_posyandu')->nullable();
                $table->boolean('ikut_bkb')->default(false);
                $table->boolean('memiliki_tabungan')->default(false);
                $table->boolean('ikut_kelompok_belajar')->default(false);
                $table->string('jenis_kelompok_belajar')->nullable(); // Paket A, Paket B, Paket C, KF
                $table->boolean('ikut_paud')->default(false);
                $table->boolean('ikut_koperasi')->default(false);
                $table->string('jenis_koperasi')->nullable();

                $table->year('tahun')->default(2026);
                $table->timestamps();
            });
        }

        // 2. DATA KELUARGA (Form 2)
        if (!Schema::hasTable('dasawisma_keluargas')) {
            Schema::create('dasawisma_keluargas', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('dasa_wisma')->nullable();
                $table->string('rt')->nullable();
                $table->string('rw')->nullable();
                $table->string('desa')->nullable();
                $table->string('kecamatan')->nullable();
                $table->string('kabupaten')->default('Kabupaten Tasikmalaya');
                $table->string('provinsi')->default('Jawa Barat');
                $table->string('nama_kepala_rumah_tangga')->nullable();

                // Rekap Anggota
                $table->integer('jumlah_anggota_l')->default(0);
                $table->integer('jumlah_anggota_p')->default(0);
                $table->integer('jumlah_kk')->default(1);
                $table->integer('balita_anak')->default(0);
                $table->integer('pus')->default(0);
                $table->integer('wus')->default(0);
                $table->integer('tiga_buta')->default(0);
                $table->integer('ibu_hamil')->default(0);
                $table->integer('ibu_menyusui')->default(0);
                $table->integer('lansia')->default(0);

                // Anggota Keluarga Detail (JSON Array)
                $table->json('anggota_keluarga')->nullable();

                // Lingkungan & Sanitasi
                $table->string('makanan_pokok')->nullable(); // Beras, Non Beras
                $table->boolean('sarana_mck_septic_tank')->default(false);
                $table->integer('jumlah_jamban')->nullable();
                $table->string('sumber_air')->nullable(); // PDAM, Sumur, Sungai, Lainnya
                $table->boolean('tempat_pembuangan_sampah')->default(false);
                $table->boolean('spal_penyerapan_air')->default(false);
                $table->string('kriteria_rumah')->nullable(); // Sehat, Kurang Sehat
                $table->boolean('aktifitas_up2k')->default(false);
                $table->string('jenis_usaha_up2k')->nullable();
                $table->boolean('aktifitas_usaha_kesling')->default(false);

                $table->year('tahun')->default(2026);
                $table->timestamps();
            });
        }

        // 3. CATATAN KELUARGA (Form 3 - 10 Program Pokok PKK)
        if (!Schema::hasTable('dasawisma_catatan_kegiatans')) {
            Schema::create('dasawisma_catatan_kegiatans', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('catatan_keluarga_dari')->nullable();
                $table->string('anggota_kelompok_dasa_wisma')->nullable();
                $table->year('tahun')->default(2026);
                $table->string('kriteria_rumah')->nullable(); // Layak huni / tidak layak huni
                $table->boolean('jamban_keluarga')->default(false);
                $table->integer('jumlah_jamban')->nullable();
                $table->string('sumber_air')->nullable();
                $table->boolean('tempat_sampah')->default(false);

                // Rekap Anggota & Checklist 10 Program PKK (JSON Array)
                $table->json('daftar_anggota_kegiatan')->nullable();

                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dasawisma_catatan_kegiatans');
        Schema::dropIfExists('dasawisma_keluargas');
        Schema::dropIfExists('dasawisma_wargas');
    }
};
