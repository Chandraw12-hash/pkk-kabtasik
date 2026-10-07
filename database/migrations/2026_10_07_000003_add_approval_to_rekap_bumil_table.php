<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Alur approval rekap bumil: pending (desa) -> approved (desa) ->
// approve kecamatan (kecamatan_status). Kolom mengikuti rekap_kegiatan_warga.
// Guard hasColumn agar aman dijalankan ulang (publish).
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rekap_bumil', function (Blueprint $table): void {
            if (! Schema::hasColumn('rekap_bumil', 'status')) {
                $table->string('status')->default('pending')->index()->after('keterangan');
            }
            if (! Schema::hasColumn('rekap_bumil', 'approved_by')) {
                $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete()->after('status');
            }
            if (! Schema::hasColumn('rekap_bumil', 'approved_at')) {
                $table->timestamp('approved_at')->nullable()->after('approved_by');
            }
            if (! Schema::hasColumn('rekap_bumil', 'rejected_reason')) {
                $table->text('rejected_reason')->nullable()->after('approved_at');
            }
            if (! Schema::hasColumn('rekap_bumil', 'kecamatan_status')) {
                $table->string('kecamatan_status', 20)->default('pending')->after('rejected_reason');
            }
            if (! Schema::hasColumn('rekap_bumil', 'kecamatan_approved_by')) {
                $table->foreignId('kecamatan_approved_by')->nullable()->constrained('users')->nullOnDelete()->after('kecamatan_status');
            }
            if (! Schema::hasColumn('rekap_bumil', 'kecamatan_approved_at')) {
                $table->timestamp('kecamatan_approved_at')->nullable()->after('kecamatan_approved_by');
            }
            if (! Schema::hasColumn('rekap_bumil', 'kecamatan_rejected_reason')) {
                $table->text('kecamatan_rejected_reason')->nullable()->after('kecamatan_approved_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('rekap_bumil', function (Blueprint $table): void {
            $table->dropForeign(['kecamatan_approved_by']);
            $table->dropForeign(['approved_by']);
            $table->dropColumn([
                'status', 'approved_by', 'approved_at', 'rejected_reason',
                'kecamatan_status', 'kecamatan_approved_by',
                'kecamatan_approved_at', 'kecamatan_rejected_reason',
            ]);
        });
    }
};
