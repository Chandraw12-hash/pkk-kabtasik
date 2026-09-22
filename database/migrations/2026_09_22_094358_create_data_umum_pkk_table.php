<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('data_umum_pkk', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wilayah_id')->nullable();  // FK — nanti
            $table->year('tahun')->default(2025);
            $table->string('kecamatan');
            $table->string('nama_kecamatan')->nullable();
            $table->string('desa')->nullable();
            $table->string('nama_desa')->nullable();
            $table->string('dusun')->nullable();
            $table->string('nama_dusun')->nullable();
            $table->string('level')->default('kecamatan');  // kecamatan / desa

            // Jumlah Kelompok
            $table->integer('jumlah_dusun')->default(0);
            $table->integer('jumlah_pkk_rw')->default(0);
            $table->integer('jumlah_pkk_rt')->default(0);
            $table->integer('jumlah_dasa_wisma')->default(0);

            // Jumlah KRT & KK
            $table->integer('jumlah_krt')->default(0);
            $table->integer('jumlah_kk')->default(0);

            // Jumlah Jiwa
            $table->integer('jiwa_l')->default(0);
            $table->integer('jiwa_p')->default(0);

            // Jumlah Kader
            $table->integer('tp_pkk_l')->default(0);
            $table->integer('tp_pkk_p')->default(0);
            $table->integer('kader_umum_l')->default(0);
            $table->integer('kader_umum_p')->default(0);
            $table->integer('kader_khusus_l')->default(0);
            $table->integer('kader_khusus_p')->default(0);

            // Jumlah Tenaga Sekretariat
            $table->integer('sekretariat_honorer_l')->default(0);
            $table->integer('sekretariat_honorer_p')->default(0);
            $table->integer('sekretariat_bantuan_l')->default(0);
            $table->integer('sekretariat_bantuan_p')->default(0);

            $table->text('keterangan')->nullable();

            // Audit
            $table->foreignId('created_by')->nullable();
            $table->foreignId('updated_by')->nullable();
            $table->timestamps();

            // Index
            $table->unique(['kecamatan', 'tahun', 'level']);
            $table->index(['tahun', 'level']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('data_umum_pkk');
    }
};
