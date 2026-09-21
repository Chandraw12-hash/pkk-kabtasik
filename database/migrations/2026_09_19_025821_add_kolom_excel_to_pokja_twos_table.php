<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pokja_twos', function (Blueprint $table) {
            // Grup Pendidikan — Warga Belajar (4)
            $table->integer('warga_belajar_paket_a')->default(0)->after('kelompok_belajar_paket_a');
            $table->integer('warga_belajar_paket_b')->default(0)->after('kelompok_belajar_paket_b');
            $table->integer('warga_belajar_paket_c')->default(0)->after('kelompok_belajar_paket_c');
            $table->integer('warga_belajar_kf')->default(0)->after('kf');

            // Taman Bacaan (1)
            $table->integer('taman_bacaan')->default(0)->after('warga_belajar_kf');

            // Grup Kesehatan — BKB (4)
            $table->integer('kelompok_bkb')->default(0);
            $table->integer('peserta_bkb')->default(0);
            $table->integer('ape_bkb')->default(0);
            $table->integer('kelompok_simulasi_bkb')->default(0);

            // Grup Kader (8)
            $table->integer('tutor_kf')->default(0);
            $table->integer('tutor_paud')->default(0);
            $table->integer('kader_bkb')->default(0);
            $table->integer('kelompok_kader_koperasi')->default(0);
            $table->integer('kader_keterampilan')->default(0);
            $table->integer('kader_dilatih_pengelolaan')->default(0);
            $table->integer('kader_dilatih_tp_pkk')->default(0);
            $table->integer('kader_dilatih_damas')->default(0);

            // Grup UP2K (8)
            $table->integer('up2k_pemula_kelompok')->default(0);
            $table->integer('up2k_pemula_peserta')->default(0);
            $table->integer('up2k_madya_kelompok')->default(0);
            $table->integer('up2k_madya_peserta')->default(0);
            $table->integer('up2k_utama_kelompok')->default(0);
            $table->integer('up2k_utama_peserta')->default(0);
            $table->integer('up2k_mandiri_kelompok')->default(0);
            $table->integer('up2k_mandiri_peserta')->default(0);

            // Grup Koperasi (1)
            $table->integer('anggota_koperasi')->default(0);
        });
    }

    public function down(): void
    {
        Schema::table('pokja_twos', function (Blueprint $table) {
            $table->dropColumn([
                'warga_belajar_paket_a', 'warga_belajar_paket_b', 'warga_belajar_paket_c', 'warga_belajar_kf',
                'taman_bacaan',
                'kelompok_bkb', 'peserta_bkb', 'ape_bkb', 'kelompok_simulasi_bkb',
                'tutor_kf', 'tutor_paud', 'kader_bkb', 'kelompok_kader_koperasi',
                'kader_keterampilan', 'kader_dilatih_pengelolaan', 'kader_dilatih_tp_pkk', 'kader_dilatih_damas',
                'up2k_pemula_kelompok', 'up2k_pemula_peserta', 'up2k_madya_kelompok', 'up2k_madya_peserta',
                'up2k_utama_kelompok', 'up2k_utama_peserta', 'up2k_mandiri_kelompok', 'up2k_mandiri_peserta',
                'anggota_koperasi',
            ]);
        });
    }
};
