<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('data_dasa_wismas', function (Blueprint $table) {
            $table->id();
            $table->string('kecamatan');
            $table->string('desa');
            $table->string('dusun')->nullable();
            $table->string('rt', 20)->nullable();
            $table->string('rw', 20)->nullable();
            $table->string('nama_dasawisma');
            $table->string('nama_krt')->nullable();
            $table->unsignedInteger('jumlah_kk')->default(0);
            $table->unsignedInteger('jumlah_jiwa_l')->default(0);
            $table->unsignedInteger('jumlah_jiwa_p')->default(0);
            $table->unsignedInteger('jumlah_balita')->default(0);
            $table->unsignedInteger('jumlah_pus')->default(0);
            $table->unsignedInteger('jumlah_wus')->default(0);
            $table->unsignedInteger('jumlah_lansia')->default(0);
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
        Schema::dropIfExists('data_dasa_wismas');
    }
};
