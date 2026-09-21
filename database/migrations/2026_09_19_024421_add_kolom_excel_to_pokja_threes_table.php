<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pokja_threes', function (Blueprint $table) {
            // Tambah kolom dari Excel
            $table->integer('jumlah_kader')->default(0)->after('kecamatan');
            $table->integer('jumlah_kader_p')->default(0)->after('jumlah_kader');
            $table->integer('makanan_pokok')->default(0)->after('jumlah_kader_p');
            $table->integer('hatinya_pkk')->default(0)->after('pemanfaatan_pekarangan');
            $table->integer('jumlah_rumah')->default(0)->after('industri_rumah_tangga');
        });
    }

    public function down(): void
    {
        Schema::table('pokja_threes', function (Blueprint $table) {
            $table->dropColumn([
                'jumlah_kader',
                'jumlah_kader_p',
                'makanan_pokok',
                'hatinya_pkk',
                'jumlah_rumah',
            ]);
        });
    }
};
