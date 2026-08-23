<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('agendas', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->text('deskripsi')->nullable();
            $table->date('tanggal');
            $table->time('waktu')->nullable();
            $table->string('lokasi')->nullable();
            $table->string('status')->default('upcoming'); // upcoming, ongoing, completed, cancelled
            $table->string('slug')->unique()->nullable(); // untuk URL SEO friendly
            $table->string('gambar')->nullable(); // untuk thumbnail agenda
            $table->timestamps();

            // Index untuk performa query
            $table->index('tanggal');
            $table->index('status');

            // Composite index untuk filter tanggal + status
            $table->index(['tanggal', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('agendas');
    }
};
