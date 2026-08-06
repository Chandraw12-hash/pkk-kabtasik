<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pokjas', function (Blueprint $table) {
            $table->id();
            $table->enum('kategori', ['Pokja I', 'Pokja II', 'Pokja III', 'Pokja IV']);
            $table->string('judul_kegiatan');
            $table->text('deskripsi')->nullable();
            $table->string('foto')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pokjas');
    }
};
