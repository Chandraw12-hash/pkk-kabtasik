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
    Schema::table('pokja_fours', function (Blueprint $table) {
        $table->string('kecamatan')->nullable();
        $table->integer('posyandu')->default(0);
        $table->integer('akseptor_kb')->default(0);
        $table->integer('phbs')->default(0);
        $table->integer('jamban_keluarga')->default(0);
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
