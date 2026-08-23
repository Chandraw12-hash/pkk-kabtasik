<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kaders', function (Blueprint $table) {
            $table->id();
            $table->string('nama_lengkap');
            $table->string('nik')->unique()->nullable();
            $table->string('tempat_lahir')->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->enum('jenis_kelamin', ['L', 'P'])->nullable();
            $table->string('alamat')->nullable();
            $table->string('rt')->nullable();
            $table->string('rw')->nullable();
            $table->string('desa_kelurahan')->nullable();
            $table->string('kecamatan')->nullable();
            $table->string('kabupaten_kota')->default('Tasikmalaya');
            $table->string('provinsi')->default('Jawa Barat');
            $table->string('no_hp')->nullable();
            $table->string('email')->nullable();
            $table->string('pendidikan_terakhir')->nullable();
            $table->string('pekerjaan')->nullable();
            $table->string('status_kader', 20)->default('aktif'); // aktif, nonaktif, alih
            $table->string('jabatan')->nullable();
            $table->string('foto')->nullable();
            $table->text('catatan')->nullable();
            $table->timestamps();

            $table->index('nik');
            $table->index('kecamatan');
            $table->index('desa_kelurahan');
            $table->index('status_kader');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kaders');
    }
};
