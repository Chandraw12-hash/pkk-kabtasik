<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Kolom KATEGORI sesuai Format Dasa Wisma (Excel):
     * - Industri RT: pangan, sandang, konveksi, jasa lainnya.
     * - Pekarangan: peternakan, perikanan, warung hidup, toga,
     *   tanaman keras lainnya.
     * Nullable: data lama tanpa kategori tetap sah.
     */
    public function up(): void
    {
        Schema::table('industri_rumah_tanggas', function (Blueprint $table) {
            if (!Schema::hasColumn('industri_rumah_tanggas', 'kategori')) {
                $table->string('kategori', 50)->nullable()->after('dasawisma');
            }
        });

        Schema::table('pemanfaatan_pekarangans', function (Blueprint $table) {
            if (!Schema::hasColumn('pemanfaatan_pekarangans', 'kategori')) {
                $table->string('kategori', 50)->nullable()->after('dasawisma');
            }
        });
    }

    public function down(): void
    {
        Schema::table('industri_rumah_tanggas', function (Blueprint $table) {
            $table->dropColumn(['kategori']);
        });
        Schema::table('pemanfaatan_pekarangans', function (Blueprint $table) {
            $table->dropColumn(['kategori']);
        });
    }
};
