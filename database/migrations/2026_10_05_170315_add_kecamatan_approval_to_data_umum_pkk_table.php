<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('data_umum_pkk', function (Blueprint $table) {
            $table->enum('kecamatan_status', ['pending', 'approved', 'rejected'])
                  ->default('pending')
                  ->after('status');
            $table->foreignId('kecamatan_approved_by')
                  ->nullable()
                  ->after('kecamatan_status')
                  ->constrained('users')
                  ->nullOnDelete();
            $table->timestamp('kecamatan_approved_at')
                  ->nullable()
                  ->after('kecamatan_approved_by');
            $table->text('kecamatan_rejected_reason')
                  ->nullable()
                  ->after('kecamatan_approved_at');
        });
    }

    public function down(): void
    {
        Schema::table('data_umum_pkk', function (Blueprint $table) {
            $table->dropForeign(['kecamatan_approved_by']);
            $table->dropColumn([
                'kecamatan_status',
                'kecamatan_approved_by',
                'kecamatan_approved_at',
                'kecamatan_rejected_reason',
            ]);
        });
    }
};
