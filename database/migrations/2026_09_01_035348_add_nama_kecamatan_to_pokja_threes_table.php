<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pokja_threes', function (Blueprint $table) {
            $table->string('nama_kecamatan')->nullable()->after('kecamatan');
        });
    }

    public function down(): void
    {
        Schema::table('pokja_threes', function (Blueprint $table) {
            $table->dropColumn('nama_kecamatan');
        });
    }
};
