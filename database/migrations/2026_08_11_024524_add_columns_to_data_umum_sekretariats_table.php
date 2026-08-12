<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('data_umum_sekretariats', function (Blueprint $table) {
            // Cek satu-satu, jika kolom belum ada, maka tambahkan
            if (!Schema::hasColumn('data_umum_sekretariats', 'kecamatan')) {
                $table->string('kecamatan')->nullable();
            }
            if (!Schema::hasColumn('data_umum_sekretariats', 'jumlah_pkk_rw')) {
                $table->integer('jumlah_pkk_rw')->default(0)->nullable();
            }
            if (!Schema::hasColumn('data_umum_sekretariats', 'jumlah_pkk_rt')) {
                $table->integer('jumlah_pkk_rt')->default(0)->nullable();
            }
            if (!Schema::hasColumn('data_umum_sekretariats', 'jumlah_dasa_wisma')) {
                $table->integer('jumlah_dasa_wisma')->default(0)->nullable();
            }
            if (!Schema::hasColumn('data_umum_sekretariats', 'jumlah_krt')) {
                $table->integer('jumlah_krt')->default(0)->nullable();
            }
            if (!Schema::hasColumn('data_umum_sekretariats', 'jumlah_kk')) {
                $table->integer('jumlah_kk')->default(0)->nullable();
            }
            if (!Schema::hasColumn('data_umum_sekretariats', 'jiwa_l')) {
                $table->integer('jiwa_l')->default(0)->nullable();
            }
            if (!Schema::hasColumn('data_umum_sekretariats', 'jiwa_p')) {
                $table->integer('jiwa_p')->default(0)->nullable();
            }
            if (!Schema::hasColumn('data_umum_sekretariats', 'tp_pkk_l')) {
                $table->integer('tp_pkk_l')->default(0)->nullable();
            }
            if (!Schema::hasColumn('data_umum_sekretariats', 'tp_pkk_p')) {
                $table->integer('tp_pkk_p')->default(0)->nullable();
            }
            if (!Schema::hasColumn('data_umum_sekretariats', 'kader_umum_l')) {
                $table->integer('kader_umum_l')->default(0)->nullable();
            }
            if (!Schema::hasColumn('data_umum_sekretariats', 'kader_umum_p')) {
                $table->integer('kader_umum_p')->default(0)->nullable();
            }
            if (!Schema::hasColumn('data_umum_sekretariats', 'kader_khusus_l')) {
                $table->integer('kader_khusus_l')->default(0)->nullable();
            }
            if (!Schema::hasColumn('data_umum_sekretariats', 'kader_khusus_p')) {
                $table->integer('kader_khusus_p')->default(0)->nullable();
            }
        });
    }

    public function down(): void
    {
        // Biarkan kosong agar tidak menghapus data kalau di-rollback
    }
};
