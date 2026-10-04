<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kegiatan_dasa_wismas', function (Blueprint $table) {
            $table->id();
            $table->string('kecamatan');
            $table->string('desa');
            $table->string('dusun')->nullable();
            $table->string('rt', 20)->nullable();
            $table->string('rw', 20)->nullable();
            $table->string('dasawisma')->nullable();
            $table->year('tahun')->default((int) date('Y'));
            $table->unsignedInteger('jumlah_dusun')->default(0);
            $table->unsignedInteger('jumlah_rw')->default(0);
            $table->unsignedInteger('jumlah_rt')->default(0);
            $table->unsignedInteger('jumlah_dasa_wisma')->default(0);
            $table->unsignedInteger('jumlah_krt')->default(0);
            $table->unsignedInteger('jumlah_kk')->default(0);
            $table->unsignedInteger('total_l')->default(0);
            $table->unsignedInteger('total_p')->default(0);
            $table->unsignedInteger('balita_l')->default(0);
            $table->unsignedInteger('balita_p')->default(0);
            $table->unsignedInteger('pus')->default(0);
            $table->unsignedInteger('wus')->default(0);
            $table->unsignedInteger('ibu_hamil')->default(0);
            $table->unsignedInteger('ibu_menyusui')->default(0);
            $table->unsignedInteger('lansia')->default(0);
            $table->unsignedInteger('buta_l')->default(0);
            $table->unsignedInteger('buta_p')->default(0);
            $table->unsignedInteger('rumah_sehat')->default(0);
            $table->unsignedInteger('rumah_kurang_sehat')->default(0);
            $table->unsignedInteger('memiliki_tempat_sampah')->default(0);
            $table->unsignedInteger('memiliki_spal')->default(0);
            $table->unsignedInteger('memiliki_stiker_p4k')->default(0);
            $table->unsignedInteger('air_pdam')->default(0);
            $table->unsignedInteger('air_sumur')->default(0);
            $table->unsignedInteger('air_sungai')->default(0);
            $table->unsignedInteger('air_dll')->default(0);
            $table->unsignedInteger('jumlah_jamban_keluarga')->default(0);
            $table->unsignedInteger('makanan_pokok_beras')->default(0);
            $table->unsignedInteger('makanan_pokok_non_beras')->default(0);
            $table->unsignedInteger('kegiatan_up2k')->default(0);
            $table->unsignedInteger('kegiatan_tanah_pekarangan')->default(0);
            $table->unsignedInteger('kegiatan_industri_rumah_tangga')->default(0);
            $table->unsignedInteger('kegiatan_kesehatan_lingkungan')->default(0);
            $table->text('keterangan')->nullable();
            $table->string('status')->default('pending')->index();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->text('rejected_reason')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['kecamatan', 'desa', 'tahun']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kegiatan_dasa_wismas');
    }
};
