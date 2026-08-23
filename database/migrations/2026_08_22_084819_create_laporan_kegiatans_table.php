<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('laporan_kegiatans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('judul');
            $table->text('deskripsi')->nullable();
            // I, II, III, IV
            $table->string('kategori_pokja', 10);
            // angka dinamis per kategori (JSON)
            $table->json('data_angka')->nullable();
            $table->string('foto')->nullable();
            // wilayah pengirim (isi dari profil dasawisma nanti)
            $table->string('kecamatan')->nullable();
            $table->string('desa_kelurahan')->nullable();
            $table->string('nama_dasawisma')->nullable();
            // pending | reviewed
            $table->string('status', 20)->default('pending');
            $table->timestamp('reviewed_at')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['status', 'created_at']);
            $table->index('kategori_pokja');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('laporan_kegiatans');
    }
};
