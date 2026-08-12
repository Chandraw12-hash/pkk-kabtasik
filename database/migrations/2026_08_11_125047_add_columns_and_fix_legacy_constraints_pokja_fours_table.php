<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1) Tambahkan kolom baru yang dipakai model Pokja4 tapi belum ada di tabel
        Schema::table('pokja_fours', function (Blueprint $table) {
            if (!Schema::hasColumn('pokja_fours', 'kategori')) {
                $table->string('kategori')->default('Umum')->after('id');
            }
            if (!Schema::hasColumn('pokja_fours', 'kecamatan')) {
                $table->string('kecamatan')->nullable()->after('kategori');
            }
            if (!Schema::hasColumn('pokja_fours', 'nama_kecamatan')) {
                $table->string('nama_kecamatan')->nullable()->after('kecamatan');
            }
            if (!Schema::hasColumn('pokja_fours', 'posyandu')) {
                $table->integer('posyandu')->default(0)->after('nama_kecamatan');
            }
            if (!Schema::hasColumn('pokja_fours', 'akseptor_kb')) {
                $table->integer('akseptor_kb')->default(0)->after('posyandu');
            }
            if (!Schema::hasColumn('pokja_fours', 'phbs')) {
                $table->integer('phbs')->default(0)->after('akseptor_kb');
            }
            if (!Schema::hasColumn('pokja_fours', 'jamban_keluarga')) {
                $table->integer('jamban_keluarga')->default(0)->after('phbs');
            }
        });

        // 2) Longgarkan constraint NOT NULL pada kolom lama (peninggalan skema
        //    judul_kegiatan/deskripsi/foto) yang sudah tidak diisi lagi oleh
        //    Pokja4Controller / Pokja4Import.
        if (Schema::hasColumn('pokja_fours', 'judul_kegiatan')) {
            DB::statement('ALTER TABLE pokja_fours ALTER COLUMN judul_kegiatan DROP NOT NULL');
        }
        if (Schema::hasColumn('pokja_fours', 'deskripsi')) {
            DB::statement('ALTER TABLE pokja_fours ALTER COLUMN deskripsi DROP NOT NULL');
        }
        if (Schema::hasColumn('pokja_fours', 'foto')) {
            DB::statement('ALTER TABLE pokja_fours ALTER COLUMN foto DROP NOT NULL');
        }
    }

    public function down(): void
    {
        Schema::table('pokja_fours', function (Blueprint $table) {
            $columns = [
                'kategori',
                'kecamatan',
                'nama_kecamatan',
                'posyandu',
                'akseptor_kb',
                'phbs',
                'jamban_keluarga',
            ];
            foreach ($columns as $column) {
                if (Schema::hasColumn('pokja_fours', $column)) {
                    $table->dropColumn($column);
                }
            }
        });

        // Kolom legacy sengaja tidak dikembalikan ke NOT NULL otomatis,
        // karena kemungkinan sudah ada baris berisi null.
    }
};
