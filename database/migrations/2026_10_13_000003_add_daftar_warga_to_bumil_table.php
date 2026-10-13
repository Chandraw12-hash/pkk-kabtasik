<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tautkan catatan ibu ke KK (daftar_wargas) agar Nama Suami bisa
     * dipilih dari anggota keluarga + sebaran bumil bisa ikut pin peta KK.
     * Nullable: data lama + input manual tanpa KK tetap sah.
     */
    public function up(): void
    {
        Schema::table('rekap_bumil_dasa_wismas', function (Blueprint $table) {
            if (!Schema::hasColumn('rekap_bumil_dasa_wismas', 'daftar_warga_id')) {
                $table->foreignId('daftar_warga_id')
                    ->nullable()
                    ->after('dasawisma')
                    ->constrained('daftar_wargas')
                    ->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('rekap_bumil_dasa_wismas', function (Blueprint $table) {
            $table->dropConstrainedForeignId('daftar_warga_id');
        });
    }
};
