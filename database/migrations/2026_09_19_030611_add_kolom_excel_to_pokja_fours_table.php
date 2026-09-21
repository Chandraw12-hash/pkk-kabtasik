<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pokja_fours', function (Blueprint $table) {
            // Grup Kesehatan — Kader (5)
            $table->integer('kader_kesehatan')->default(0);
            $table->integer('kader_gizi')->default(0);
            $table->integer('kader_kesling')->default(0);
            $table->integer('kader_phbs')->default(0);
            $table->integer('kader_kb')->default(0);

            // Kesehatan — lainnya (3)
            $table->integer('imunisasi')->default(0);
            $table->integer('pkg')->default(0);
            $table->integer('tbc')->default(0);

            // Grup Lingkungan (7)
            $table->integer('spal')->default(0);
            $table->integer('tps')->default(0);
            $table->integer('mck')->default(0);
            $table->integer('air_pdam')->default(0);
            $table->integer('air_sumur')->default(0);
            $table->integer('air_lainnya')->default(0);

            // Grup Perencanaan (6)
            $table->integer('jumlah_pus')->default(0);
            $table->integer('jumlah_wus')->default(0);
            $table->integer('akseptor_kb_l')->default(0);
            $table->integer('akseptor_kb_p')->default(0);
            $table->integer('tabungan_keluarga')->default(0);
            $table->integer('asuransi_kesehatan')->default(0);

            // Grup Program (3)
            $table->string('program_kesehatan')->nullable();
            $table->string('program_lingkungan')->nullable();
            $table->string('program_perencanaan')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('pokja_fours', function (Blueprint $table) {
            $table->dropColumn([
                'kader_kesehatan', 'kader_gizi', 'kader_kesling', 'kader_phbs', 'kader_kb',
                'imunisasi', 'pkg', 'tbc',
                'spal', 'tps', 'mck',
                'air_pdam', 'air_sumur', 'air_lainnya',
                'jumlah_pus', 'jumlah_wus',
                'akseptor_kb_l', 'akseptor_kb_p',
                'tabungan_keluarga', 'asuransi_kesehatan',
                'program_kesehatan', 'program_lingkungan', 'program_perencanaan',
            ]);
        });
    }
};
