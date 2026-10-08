<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('laporan_kegiatans', function (Blueprint $table) {
            // Kop Laporan Data Dukung dari aplikasi mobile
            $table->string('provinsi', 100)->nullable()->after('nama_dasawisma');
            $table->string('kabupaten_kota', 100)->nullable()->after('provinsi');
            $table->string('program', 255)->nullable()->after('kabupaten_kota');
            $table->string('pj_desa', 100)->nullable()->after('program');
            $table->string('pj_desa_hp', 30)->nullable()->after('pj_desa');
            $table->string('pj_kecamatan', 100)->nullable()->after('pj_desa_hp');
            $table->string('pj_kecamatan_hp', 30)->nullable()->after('pj_kecamatan');
            $table->string('pj_kabupaten', 100)->nullable()->after('pj_kecamatan_hp');
            $table->string('pj_kabupaten_hp', 30)->nullable()->after('pj_kabupaten');
            $table->string('pj_provinsi', 100)->nullable()->after('pj_kabupaten_hp');
            $table->string('pj_provinsi_hp', 30)->nullable()->after('pj_provinsi');
        });
    }

    public function down(): void
    {
        Schema::table('laporan_kegiatans', function (Blueprint $table) {
            $table->dropColumn([
                'provinsi', 'kabupaten_kota', 'program',
                'pj_desa', 'pj_desa_hp', 'pj_kecamatan', 'pj_kecamatan_hp',
                'pj_kabupaten', 'pj_kabupaten_hp', 'pj_provinsi', 'pj_provinsi_hp',
            ]);
        });
    }
};
