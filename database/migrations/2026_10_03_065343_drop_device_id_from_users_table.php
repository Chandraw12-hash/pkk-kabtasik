php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $columns = [];

            if (Schema::hasColumn('users', 'device_id')) {
                $columns[] = 'device_id';
            }

            if (Schema::hasColumn('users', 'device_bound_at')) {
                $columns[] = 'device_bound_at';
            }

            if (!empty($columns)) {
                $table->dropColumn($columns);
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'device_id')) {
                $table->string('device_id')->nullable()->after('last_login');
            }

            if (!Schema::hasColumn('users', 'device_bound_at')) {
                $table->timestamp('device_bound_at')->nullable()->after('device_id');
            }
        });
    }
};