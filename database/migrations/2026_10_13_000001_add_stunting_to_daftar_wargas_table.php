<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Kasus stunting per rumah untuk Peta Sebaran (layer oranye).
     * Diisi kader dari wizard HP Langkah 3 (0 = tidak ada kasus).
     * Kolom sudah ada di DB (migrasi 12 Okt) — dibuat ulang agar
     * riwayat migrate konsisten; artisan akan skip otomatis.
     */
    public function up(): void
    {
        Schema::table('daftar_wargas', function (Blueprint $table) {
            if (!Schema::hasColumn('daftar_wargas', 'jumlah_balita_stunting')) {
                $table->integer('jumlah_balita_stunting')->default(0)->after('jumlah_balita_p');
            }
        });
    }

    public function down(): void
    {
        Schema::table('daftar_wargas', function (Blueprint $table) {
            $table->dropColumn(['jumlah_balita_stunting']);
        });
    }
};
