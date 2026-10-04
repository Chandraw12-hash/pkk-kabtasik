<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('industri_rumah_tanggas', function (Blueprint $table) {
            $table->id();
            $table->string('kecamatan');
            $table->string('desa');
            $table->string('dusun')->nullable();
            $table->string('rt', 20)->nullable();
            $table->string('rw', 20)->nullable();
            $table->string('dasawisma')->nullable();
            $table->string('jenis_industri');
            $table->string('pemilik');
            $table->unsignedInteger('jumlah_tenaga_kerja')->default(0);
            $table->decimal('omzet', 15, 2)->nullable();
            $table->string('status')->default('pending')->index();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->text('rejected_reason')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['kecamatan', 'desa']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('industri_rumah_tanggas');
    }
};
