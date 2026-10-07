<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Umur (bulan) untuk kategorisasi kematian otomatis:
// <12 bln = bayi, 12-59 bln = balita (asumsi, perlu konfirmasi).
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rekap_bumil_dasa_wismas', function (Blueprint $table): void {
            $table->unsignedSmallInteger('kematian_umur_bulan')->nullable()->after('kematian_kategori');
        });
    }

    public function down(): void
    {
        Schema::table('rekap_bumil_dasa_wismas', function (Blueprint $table): void {
            $table->dropColumn('kematian_umur_bulan');
        });
    }
};
