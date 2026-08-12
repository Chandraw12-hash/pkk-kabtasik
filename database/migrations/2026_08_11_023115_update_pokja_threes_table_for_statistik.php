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
    Schema::table('pokja_threes', function (Blueprint $table) {
        $table->string('kecamatan')->nullable();
        $table->integer('rumah_sehat')->default(0);
        $table->integer('rumah_tidak_sehat')->default(0);
        $table->integer('pemanfaatan_pekarangan')->default(0);
        $table->integer('industri_rumah_tangga')->default(0);
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
