<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tanggal kegiatan berita (terpisah dari created_at = waktu input).
     * Cermin kolom tanggal di galeris. Tampilan publik pakai ini
     * dengan fallback created_at.
     */
    public function up(): void
    {
        Schema::table('beritas', function (Blueprint $table) {
            if (!Schema::hasColumn('beritas', 'tanggal')) {
                $table->date('tanggal')->nullable()->after('kategori');
            }
        });
    }

    public function down(): void
    {
        Schema::table('beritas', function (Blueprint $table) {
            $table->dropColumn('tanggal');
        });
    }
};
