<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tambah 5 kolom ke tabel pokja_twos — sesuai Excel Pokja II
     */
    public function up(): void
    {
        Schema::table('pokja_twos', function (Blueprint $table) {
            // BKB — Jml. Ibu (SET)
            $table->integer('ibu_set_bkb')->default(0)->after('peserta_bkb');

            // Kader Dilatih — LP3 PKK, TP3 PKK, Damas PKK
            $table->integer('lp3_pkk')->default(0)->after('kader_dilatih_damas');
            $table->integer('tp3_pkk')->default(0)->after('lp3_pkk');
            $table->integer('damas_pkk')->default(0)->after('tp3_pkk');

            // Keterangan
            $table->text('keterangan')->nullable()->after('anggota_koperasi');
        });
    }

    public function down(): void
    {
        Schema::table('pokja_twos', function (Blueprint $table) {
            $table->dropColumn([
                'ibu_set_bkb',
                'lp3_pkk',
                'tp3_pkk',
                'damas_pkk',
                'keterangan',
            ]);
        });
    }
};
