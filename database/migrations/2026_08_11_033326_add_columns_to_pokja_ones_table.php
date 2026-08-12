<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pokja_ones', function (Blueprint $table) {
            if (!Schema::hasColumn('pokja_ones', 'kategori')) {
                $table->string('kategori')->nullable();
            }
            if (!Schema::hasColumn('pokja_ones', 'kecamatan')) {
                $table->string('kecamatan')->nullable();
            }
            if (!Schema::hasColumn('pokja_ones', 'nama_kecamatan')) {
                $table->string('nama_kecamatan')->nullable();
            }
            if (!Schema::hasColumn('pokja_ones', 'pkbn_l')) {
                $table->integer('pkbn_l')->default(0);
            }
            if (!Schema::hasColumn('pokja_ones', 'pkbn_p')) {
                $table->integer('pkbn_p')->default(0);
            }
            if (!Schema::hasColumn('pokja_ones', 'pkdrt_l')) {
                $table->integer('pkdrt_l')->default(0);
            }
            if (!Schema::hasColumn('pokja_ones', 'pkdrt_p')) {
                $table->integer('pkdrt_p')->default(0);
            }
            if (!Schema::hasColumn('pokja_ones', 'pola_asuh_l')) {
                $table->integer('pola_asuh_l')->default(0);
            }
            if (!Schema::hasColumn('pokja_ones', 'pola_asuh_p')) {
                $table->integer('pola_asuh_p')->default(0);
            }
            if (!Schema::hasColumn('pokja_ones', 'lansia_l')) {
                $table->integer('lansia_l')->default(0);
            }
            if (!Schema::hasColumn('pokja_ones', 'lansia_p')) {
                $table->integer('lansia_p')->default(0);
            }
            if (!Schema::hasColumn('pokja_ones', 'kader_pokja1_l')) {
                $table->integer('kader_pokja1_l')->default(0);
            }
            if (!Schema::hasColumn('pokja_ones', 'kader_pokja1_p')) {
                $table->integer('kader_pokja1_p')->default(0);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pokja_ones', function (Blueprint $table) {
            $table->dropColumn([
                'kategori',
                'kecamatan',
                'nama_kecamatan',
                'pkbn_l',
                'pkbn_p',
                'pkdrt_l',
                'pkdrt_p',
                'pola_asuh_l',
                'pola_asuh_p',
                'lansia_l',
                'lansia_p',
                'kader_pokja1_l',
                'kader_pokja1_p'
            ]);
        });
    }
};
