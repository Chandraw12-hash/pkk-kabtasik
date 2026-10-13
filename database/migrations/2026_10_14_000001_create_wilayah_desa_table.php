<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Master wilayah (kecamatan → desa) yang bisa dikelola super-admin via UI.
     * Pengganti AdminDesaSeeder::DATA_DESA yang hardcoded — pemekaran desa
     * tak lagi butuh edit kode + deploy. Baris hanya tambah/nonaktif
     * (tanpa rename/hapus) agar referensi string kecamatan/desa di
     * tabel data lama (users, daftar_wargas, rekap, ...) tetap utuh.
     */
    public function up(): void
    {
        Schema::create('wilayah_desa', function (Blueprint $table) {
            $table->id();
            $table->string('kecamatan', 255);
            $table->string('desa', 255);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['kecamatan', 'desa']);
            $table->index('kecamatan');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wilayah_desa');
    }
};
