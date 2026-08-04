<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('file_eviden', function (Blueprint $table) {
            $table->id();
            $table->foreignId('eviden_id')->constrained('eviden')->onDelete('cascade');
            $table->string('file_path');
            $table->string('file_type'); // Changed enum to string for flexibility or use specific enum if strict
            $table->string('original_name');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('file_eviden');
    }
};
