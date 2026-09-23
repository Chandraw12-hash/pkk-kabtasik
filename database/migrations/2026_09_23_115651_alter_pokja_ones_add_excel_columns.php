<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pokja_ones', function (Blueprint $table) {
            // === HAPUS KOLOM LAMA ===
            $table->dropColumn([
                'pkbn_l', 'pkbn_p',
                'pkdrt_l', 'pkdrt_p',
                'pola_asuh_l', 'pola_asuh_p',
                'lansia_l', 'lansia_p',
                'kader_pokja1_l', 'kader_pokja1_p',
            ]);
        });

        Schema::table('pokja_ones', function (Blueprint $table) {
            // === TAMBAH KOLOM BARU ===
            $table->string('nama_wilayah')->nullable()->after('kecamatan');
            $table->integer('kader_umum')->default(0);
            $table->integer('kader_khusus')->default(0);
            $table->year('tahun')->nullable();

            // KISAH
            $table->text('kisah_kegiatan')->nullable();
            $table->integer('kisah_volume')->default(0);
            $table->string('kisah_metode')->nullable();
            $table->integer('kisah_sasaran')->default(0);

            // KILAS
            $table->text('kilas_kegiatan')->nullable();
            $table->integer('kilas_volume')->default(0);
            $table->string('kilas_metode')->nullable();
            $table->integer('kilas_sasaran')->default(0);

            // KRISAN
            $table->text('krisan_kegiatan')->nullable();
            $table->integer('krisan_volume')->default(0);
            $table->string('krisan_metode')->nullable();
            $table->integer('krisan_sasaran')->default(0);

            // KIAT
            $table->text('kiat_kegiatan')->nullable();
            $table->integer('kiat_volume')->default(0);
            $table->string('kiat_metode')->nullable();
            $table->integer('kiat_sasaran')->default(0);

            // KISAK
            $table->text('kisak_kegiatan')->nullable();
            $table->integer('kisak_volume')->default(0);
            $table->string('kisak_metode')->nullable();
            $table->integer('kisak_sasaran')->default(0);

            // PKBN
            $table->text('pkbn_kegiatan')->nullable();
            $table->integer('pkbn_volume')->default(0);
            $table->string('pkbn_metode')->nullable();
            $table->integer('pkbn_sasaran')->default(0);

            // Keterangan
            $table->text('keterangan')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('pokja_ones', function (Blueprint $table) {
            $table->dropColumn([
                'nama_wilayah', 'kader_umum', 'kader_khusus', 'tahun',
                'kisah_kegiatan', 'kisah_volume', 'kisah_metode', 'kisah_sasaran',
                'kilas_kegiatan', 'kilas_volume', 'kilas_metode', 'kilas_sasaran',
                'krisan_kegiatan', 'krisan_volume', 'krisan_metode', 'krisan_sasaran',
                'kiat_kegiatan', 'kiat_volume', 'kiat_metode', 'kiat_sasaran',
                'kisak_kegiatan', 'kisak_volume', 'kisak_metode', 'kisak_sasaran',
                'pkbn_kegiatan', 'pkbn_volume', 'pkbn_metode', 'pkbn_sasaran',
                'keterangan',
            ]);
        });

        Schema::table('pokja_ones', function (Blueprint $table) {
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
};
