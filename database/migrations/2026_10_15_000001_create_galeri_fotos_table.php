<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Foto tambahan galeri kegiatan — maks 4 tambahan + 1 cover = 5,
     * cermin pola berita_fotos. Cover tetap di kolom galeris.foto.
     */
    public function up(): void
    {
        Schema::create('galeri_fotos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('galeri_id')->constrained('galeris')->cascadeOnDelete();
            $table->string('foto', 500);
            $table->unsignedInteger('urutan')->default(0);
            $table->timestamps();

            $table->index(['galeri_id', 'urutan']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('galeri_fotos');
    }
};
