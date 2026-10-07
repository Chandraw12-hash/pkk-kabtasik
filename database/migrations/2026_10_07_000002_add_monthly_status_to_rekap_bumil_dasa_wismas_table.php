<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Catatan per-ibu bulanan: 1 baris = 1 ibu + 1 status per bulan.
// Kolom klinis lama (umur, Hb, dsb.) tetap; yang ditambah hanya
// pelacakan status bulanan + kelahiran + kematian.
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rekap_bumil_dasa_wismas', function (Blueprint $table): void {
            $table->string('dasawisma')->nullable()->after('rw');
            $table->unsignedSmallInteger('bulan')->nullable()->after('tahun');
            $table->string('status_ibu', 20)->default('hamil')->after('bulan');

            // Catatan kelahiran (diisi bila status_ibu = melahirkan)
            $table->string('bayi_nama')->nullable()->after('status_ibu');
            $table->string('bayi_jenis_kelamin', 5)->nullable()->after('bayi_nama');
            $table->date('bayi_tanggal_lahir')->nullable()->after('bayi_jenis_kelamin');
            $table->boolean('bayi_akta')->nullable()->after('bayi_tanggal_lahir');

            // Catatan kematian (diisi bila ada yang meninggal)
            $table->string('kematian_kategori', 20)->nullable()->after('bayi_akta');
            $table->string('kematian_nama')->nullable()->after('kematian_kategori');
            $table->string('kematian_jenis_kelamin', 5)->nullable()->after('kematian_nama');
            $table->date('kematian_tanggal')->nullable()->after('kematian_jenis_kelamin');
            $table->text('kematian_sebab')->nullable()->after('kematian_tanggal');

            $table->index(['tahun', 'bulan', 'status_ibu']);
        });
    }

    public function down(): void
    {
        Schema::table('rekap_bumil_dasa_wismas', function (Blueprint $table): void {
            $table->dropIndex(['tahun', 'bulan', 'status_ibu']);
            $table->dropColumn([
                'bulan', 'status_ibu',
                'bayi_nama', 'bayi_jenis_kelamin', 'bayi_tanggal_lahir', 'bayi_akta',
                'kematian_kategori', 'kematian_nama', 'kematian_jenis_kelamin',
                'kematian_tanggal', 'kematian_sebab',
            ]);
        });
    }
};
