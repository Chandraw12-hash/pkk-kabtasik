<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pokja_fours', function (Blueprint $table) {
            $table->integer('tahun')->default(2025)->after('nama_kecamatan');
        });
    }

    public function down(): void
    {
        Schema::table('pokja_fours', function (Blueprint $table) {
            $table->dropColumn('tahun');
        });
    }
};
