<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Titik GPS rumah untuk Peta Sebaran (khusus data dasawisma).
     * Nullable: pin opsional di form HP, peta terisi dari yang memasang pin.
     */
    public function up(): void
    {
        Schema::table('daftar_wargas', function (Blueprint $table) {
            $table->double('latitude')->nullable()->after('alamat');
            $table->double('longitude')->nullable()->after('latitude');
        });
    }

    public function down(): void
    {
        Schema::table('daftar_wargas', function (Blueprint $table) {
            $table->dropColumn(['latitude', 'longitude']);
        });
    }
};
