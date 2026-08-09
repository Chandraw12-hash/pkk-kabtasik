<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('beritas', function (Blueprint $table) {
            // Tambahkan kolom kategori
            $table->string('kategori')->nullable()->after('judul');

            // Tambahkan kolom status_publikasi
            $table->boolean('status_publikasi')->default(true)->after('konten');
        });
    }

    public function down(): void
    {
        Schema::table('beritas', function (Blueprint $table) {
            $table->dropColumn(['kategori', 'status_publikasi']);
        });
    }
};
