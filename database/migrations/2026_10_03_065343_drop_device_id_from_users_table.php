<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop kolom dulu — index otomatis ke-drop juga
            $table->dropColumn(['device_id', 'device_bound_at']);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('device_id')->nullable()->after('last_login');
            $table->timestamp('device_bound_at')->nullable()->after('device_id');
        });
    }
};
