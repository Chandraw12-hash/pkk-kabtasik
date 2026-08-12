<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('data_umum_sekretariats', function (Blueprint $table) {
            $table->id();
            $table->string('kategori'); // Untuk membedakan apakah ini 'Data Umum' atau 'Sekretariat'
            $table->string('nama_kecamatan');
            $table->integer('total_kk')->default(0);
            $table->integer('jumlah_dasa_wisma')->default(0);
            $table->integer('kader_umum')->default(0);
            $table->integer('kader_khusus')->default(0);
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('data_umum_sekretariats');
    }
};
