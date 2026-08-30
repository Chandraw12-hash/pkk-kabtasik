<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('surveys', function (Blueprint $table) {
            $table->id();
            $table->string('nama')->nullable();
            $table->string('email')->nullable();
            $table->integer('rating')->default(5);
            $table->text('saran')->nullable();
            $table->string('status', 20)->default('active'); // active / inactive
            $table->string('ip_address')->nullable();
            $table->timestamps();

            $table->index('rating');
            $table->index('status');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('surveys');
    }
};
