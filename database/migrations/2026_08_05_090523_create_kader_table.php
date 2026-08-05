<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kader', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('nik', 20)->nullable()->unique();
            $table->enum('jabatan', [
                'Ketua',
                'Wakil Ketua',
                'Sekretaris',
                'Bendahara',
                'Ketua Pokja I',
                'Ketua Pokja II',
                'Ketua Pokja III',
                'Ketua Pokja IV',
                'Anggota',
            ])->default('Anggota');
            $table->enum('pokja', ['I', 'II', 'III', 'IV', 'Sekretariat'])->nullable();
            $table->string('kecamatan')->nullable();
            $table->string('desa_kelurahan')->nullable();
            $table->string('no_hp', 20)->nullable();
            $table->string('alamat')->nullable();
            $table->string('foto')->nullable();
            $table->boolean('status_aktif')->default(true);
            $table->date('tanggal_bergabung')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kader');
    }
};
