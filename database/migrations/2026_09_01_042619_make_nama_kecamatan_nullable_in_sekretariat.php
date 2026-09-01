<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('data_umum_sekretariats', function (Blueprint $table) {
            $table->string('nama_kecamatan')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('data_umum_sekretariats', function (Blueprint $table) {
            $table->string('nama_kecamatan')->nullable(false)->change();
        });
    }
};
