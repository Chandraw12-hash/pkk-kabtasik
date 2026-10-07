<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Kolom Nama Suami mengikuti sheet Rekap Bumil Dasa Wisma.
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rekap_bumil_dasa_wismas', function (Blueprint $table): void {
            $table->string('suami_nama')->nullable()->after('nama');
        });
    }

    public function down(): void
    {
        Schema::table('rekap_bumil_dasa_wismas', function (Blueprint $table): void {
            $table->dropColumn('suami_nama');
        });
    }
};
