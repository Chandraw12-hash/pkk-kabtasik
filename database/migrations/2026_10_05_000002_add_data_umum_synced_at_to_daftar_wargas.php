<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('daftar_wargas', function (Blueprint $table): void {
            $table->timestamp('data_umum_synced_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('daftar_wargas', function (Blueprint $table): void {
            $table->dropColumn('data_umum_synced_at');
        });
    }
};
