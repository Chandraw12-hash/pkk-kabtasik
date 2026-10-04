<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rekap_bumil_dasa_wismas', function (Blueprint $table) {
            $table->id();
            $table->string('kecamatan');
            $table->string('desa');
            $table->string('dusun')->nullable();
            $table->string('rt', 20)->nullable();
            $table->string('rw', 20)->nullable();
            $table->year('tahun');
            $table->string('nama');
            $table->unsignedSmallInteger('umur')->nullable();
            $table->unsignedSmallInteger('hamile')->nullable();
            $table->unsignedSmallInteger('anak_ke')->nullable();
            $table->unsignedSmallInteger('jarak_hamil')->nullable();
            $table->decimal('tinggi_badan', 6, 2)->nullable();
            $table->decimal('berat_badan', 6, 2)->nullable();
            $table->decimal('lingkar_lengan', 6, 2)->nullable();
            $table->decimal('hb', 6, 2)->nullable();
            $table->string('tekanan_darah', 40)->nullable();
            $table->text('imunisasi')->nullable();
            $table->text('fe')->nullable();
            $table->text('keterangan')->nullable();
            $table->string('status')->default('pending')->index();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->text('rejected_reason')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['kecamatan', 'desa', 'tahun']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rekap_bumil_dasa_wismas');
    }
};
