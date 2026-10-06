<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('data_umum_pkk', function (Blueprint $table): void {
            $table->unsignedInteger('jiwa_tidak_terpilah')->default(0)->after('jiwa_p');
        });

        Schema::table('daftar_wargas', function (Blueprint $table): void {
            $table->unsignedInteger('jumlah_kk')->default(1)->after('jumlah_anggota');
            $table->unsignedInteger('jumlah_laki_laki')->default(0)->after('jumlah_kk');
            $table->unsignedInteger('jumlah_perempuan')->default(0)->after('jumlah_laki_laki');
        });
    }

    public function down(): void
    {
        Schema::table('daftar_wargas', function (Blueprint $table): void {
            $table->dropColumn(['jumlah_kk', 'jumlah_laki_laki', 'jumlah_perempuan']);
        });

        Schema::table('data_umum_pkk', function (Blueprint $table): void {
            $table->dropColumn('jiwa_tidak_terpilah');
        });
    }
};
