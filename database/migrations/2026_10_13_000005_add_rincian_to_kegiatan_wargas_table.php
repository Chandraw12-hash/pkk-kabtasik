<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Rincian kegiatan sesuai Format Dasa Wisma (Excel KEGIATAN WARGA):
     * Penghayatan dan Pengamalan Pancasila, Kerjabakti, Rukun Kematian,
     * Kegiatan Keagamaan, Jimpitan, Arisan, Lain-lain.
     * Kolom info tambahan — rekap tetap pakai kolom `kegiatan`
     * (up2k/pekarangan/industri/kesehatan/lainnya). Nullable.
     */
    public function up(): void
    {
        Schema::table('kegiatan_wargas', function (Blueprint $table) {
            if (!Schema::hasColumn('kegiatan_wargas', 'rincian')) {
                $table->string('rincian', 100)->nullable()->after('kegiatan');
            }
        });
    }

    public function down(): void
    {
        Schema::table('kegiatan_wargas', function (Blueprint $table) {
            $table->dropColumn(['rincian']);
        });
    }
};
