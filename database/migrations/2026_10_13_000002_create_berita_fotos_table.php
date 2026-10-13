<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Galeri foto berita (maks 4 foto tambahan + 1 cover = maks 5 per berita).
     * Cover tetap di kolom beritas.foto agar list/hero/mobile tak berubah.
     */
    public function up(): void
    {
        Schema::create('berita_fotos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('berita_id')->constrained('beritas')->cascadeOnDelete();
            $table->string('foto', 500);
            $table->integer('urutan')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('berita_fotos');
    }
};
