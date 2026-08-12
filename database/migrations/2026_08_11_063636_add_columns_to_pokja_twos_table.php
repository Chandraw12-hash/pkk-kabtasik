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
        if (Schema::hasTable('pokja_twos')) {
            Schema::table('pokja_twos', function (Blueprint $table) {
                if (!Schema::hasColumn('pokja_twos', 'kategori')) {
                    $table->string('kategori')->nullable();
                }
                if (!Schema::hasColumn('pokja_twos', 'kecamatan')) {
                    $table->string('kecamatan')->nullable();
                }
                if (!Schema::hasColumn('pokja_twos', 'nama_kecamatan')) {
                    $table->string('nama_kecamatan')->nullable();
                }
                if (!Schema::hasColumn('pokja_twos', 'warga_buta_l')) {
                    $table->integer('warga_buta_l')->default(0);
                }
                if (!Schema::hasColumn('pokja_twos', 'warga_buta_p')) {
                    $table->integer('warga_buta_p')->default(0);
                }
                if (!Schema::hasColumn('pokja_twos', 'kelompok_belajar_paket_a')) {
                    $table->integer('kelompok_belajar_paket_a')->default(0);
                }
                if (!Schema::hasColumn('pokja_twos', 'kelompok_belajar_paket_b')) {
                    $table->integer('kelompok_belajar_paket_b')->default(0);
                }
                if (!Schema::hasColumn('pokja_twos', 'kelompok_belajar_paket_c')) {
                    $table->integer('kelompok_belajar_paket_c')->default(0);
                }
                if (!Schema::hasColumn('pokja_twos', 'kf')) {
                    $table->integer('kf')->default(0);
                }
                if (!Schema::hasColumn('pokja_twos', 'paud')) {
                    $table->integer('paud')->default(0);
                }
                if (!Schema::hasColumn('pokja_twos', 'koperasi_berbadan_hukum')) {
                    $table->integer('koperasi_berbadan_hukum')->default(0);
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pokja_twos', function (Blueprint $table) {
            $table->dropColumn([
                'kategori',
                'kecamatan',
                'nama_kecamatan',
                'warga_buta_l',
                'warga_buta_p',
                'kelompok_belajar_paket_a',
                'kelompok_belajar_paket_b',
                'kelompok_belajar_paket_c',
                'kf',
                'paud',
                'koperasi_berbadan_hukum',
            ]);
        });
    }
};
