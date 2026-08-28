<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('infografis', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->text('deskripsi')->nullable();
            $table->string('gambar')->nullable();
            $table->string('kategori')->nullable();
            $table->string('status', 20)->default('active');
            $table->integer('urutan')->default(0);
            $table->timestamps();

            $table->index('status');
            $table->index('kategori');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('infografis');
    }
};
