<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tabel Dasawisma yang perlu kolom approval kecamatan.
     */
    private array $tables = [
        'daftar_wargas',
        'data_dasa_wismas',
        'catatan_keluargas',
        'kegiatan_wargas',
        'pemanfaatan_pekarangans',
        'industri_rumah_tanggas',
        'kegiatan_dasa_wismas',
        'rekap_bumil_dasa_wismas',
    ];

    public function up(): void
    {
        foreach ($this->tables as $tableName) {
            Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                // ══════════════════════════════════════════════════
                // APPROVAL KECAMATAN — Cek per kolom (anti-duplicate)
                // ══════════════════════════════════════════════════

                if (!Schema::hasColumn($tableName, 'kecamatan_status')) {
                    $table->enum('kecamatan_status', ['pending', 'approved', 'rejected'])
                          ->default('pending');
                }

                if (!Schema::hasColumn($tableName, 'kecamatan_approved_by')) {
                    $table->foreignId('kecamatan_approved_by')
                          ->nullable()
                          ->constrained('users')
                          ->nullOnDelete();
                }

                if (!Schema::hasColumn($tableName, 'kecamatan_approved_at')) {
                    $table->timestamp('kecamatan_approved_at')
                          ->nullable();
                }

                if (!Schema::hasColumn($tableName, 'kecamatan_rejected_reason')) {
                    $table->text('kecamatan_rejected_reason')
                          ->nullable();
                }
            });
        }
    }

    public function down(): void
    {
        foreach ($this->tables as $tableName) {
            Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                // Drop foreign keys dulu (kalau ada)
                if (Schema::hasColumn($tableName, 'kecamatan_approved_by')) {
                    $table->dropForeign([$tableName . '_kecamatan_approved_by_foreign']);
                }

                // Drop kolom yang ada aja
                $columnsToDrop = [];
                foreach ([
                    'kecamatan_status',
                    'kecamatan_approved_by',
                    'kecamatan_approved_at',
                    'kecamatan_rejected_reason',
                ] as $col) {
                    if (Schema::hasColumn($tableName, $col)) {
                        $columnsToDrop[] = $col;
                    }
                }

                if (!empty($columnsToDrop)) {
                    $table->dropColumn($columnsToDrop);
                }
            });
        }
    }
};
