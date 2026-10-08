<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Kolom rincian format resmi 20 kolom Pokja III yang dipakai
     * halaman web (tabel rekap) dan aplikasi Android (laporan mobile).
     * Tanpa kolom ini, sinkronisasi Android -> web gagal (SQL unknown column)
     * dan tabel web hanya menampilkan 0.
     */
    private array $columns = [
        // Jumlah kader
        'kader_tata_laksana',
        // Makanan pokok
        'makanan_non_beras',
        // Pemanfaatan pekarangan / Hatinya PKK
        'peternakan',
        'perikanan',
        'warung_hidup',
        'lumbung_hidup',
        'toga',
        'tanaman_keras',
        'tanaman_lainnya',
        // Industri rumah tangga
        'industri_pangan',
        'industri_sandang',
        'industri_jasa',
    ];

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pokja_threes', function (Blueprint $table) {
            foreach ($this->columns as $column) {
                if (! Schema::hasColumn('pokja_threes', $column)) {
                    $table->integer($column)->default(0);
                }
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pokja_threes', function (Blueprint $table) {
            $existing = array_values(array_filter(
                $this->columns,
                fn ($column) => Schema::hasColumn('pokja_threes', $column)
            ));

            if (! empty($existing)) {
                $table->dropColumn($existing);
            }
        });
    }
};
