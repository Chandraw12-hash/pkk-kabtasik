<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rekap_kegiatan_warga', function (Blueprint $table) {
            // ══════════════════════════════════════════════════════
            // APPROVAL DESA — Cek per kolom (anti-duplicate)
            // ══════════════════════════════════════════════════════

            if (!Schema::hasColumn('rekap_kegiatan_warga', 'status')) {
                $table->enum('status', ['pending', 'approved', 'rejected'])
                      ->default('pending')
                      ->after('keterangan');
            }

            if (!Schema::hasColumn('rekap_kegiatan_warga', 'approved_by')) {
                $table->foreignId('approved_by')
                      ->nullable()
                      ->after('status')
                      ->constrained('users')
                      ->nullOnDelete();
            }

            if (!Schema::hasColumn('rekap_kegiatan_warga', 'approved_at')) {
                $table->timestamp('approved_at')
                      ->nullable()
                      ->after('approved_by');
            }

            if (!Schema::hasColumn('rekap_kegiatan_warga', 'rejected_reason')) {
                $table->text('rejected_reason')
                      ->nullable()
                      ->after('approved_at');
            }

            // ══════════════════════════════════════════════════════
            // APPROVAL KECAMATAN — Cek per kolom
            // ══════════════════════════════════════════════════════

            if (!Schema::hasColumn('rekap_kegiatan_warga', 'kecamatan_status')) {
                $table->enum('kecamatan_status', ['pending', 'approved', 'rejected'])
                      ->default('pending')
                      ->after('rejected_reason');
            }

            if (!Schema::hasColumn('rekap_kegiatan_warga', 'kecamatan_approved_by')) {
                $table->foreignId('kecamatan_approved_by')
                      ->nullable()
                      ->after('kecamatan_status')
                      ->constrained('users')
                      ->nullOnDelete();
            }

            if (!Schema::hasColumn('rekap_kegiatan_warga', 'kecamatan_approved_at')) {
                $table->timestamp('kecamatan_approved_at')
                      ->nullable()
                      ->after('kecamatan_approved_by');
            }

            if (!Schema::hasColumn('rekap_kegiatan_warga', 'kecamatan_rejected_reason')) {
                $table->text('kecamatan_rejected_reason')
                      ->nullable()
                      ->after('kecamatan_approved_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('rekap_kegiatan_warga', function (Blueprint $table) {
            // Drop foreign keys dulu (kalau ada)
            if (Schema::hasColumn('rekap_kegiatan_warga', 'approved_by')) {
                $table->dropForeign(['approved_by']);
            }
            if (Schema::hasColumn('rekap_kegiatan_warga', 'kecamatan_approved_by')) {
                $table->dropForeign(['kecamatan_approved_by']);
            }

            // Drop kolom yang ada aja
            $columnsToDrop = [];
            foreach ([
                'status',
                'approved_by',
                'approved_at',
                'rejected_reason',
                'kecamatan_status',
                'kecamatan_approved_by',
                'kecamatan_approved_at',
                'kecamatan_rejected_reason',
            ] as $col) {
                if (Schema::hasColumn('rekap_kegiatan_warga', $col)) {
                    $columnsToDrop[] = $col;
                }
            }

            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};
