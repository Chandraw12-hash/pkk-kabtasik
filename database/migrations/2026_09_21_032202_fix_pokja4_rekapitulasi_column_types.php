<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ✅ Ubah dusun, rw, rt, dasa_wisma — integer → string
        if (Schema::hasColumn('pokja4_rekapitulasi', 'dusun')) {
            DB::statement('ALTER TABLE pokja4_rekapitulasi ALTER COLUMN dusun TYPE VARCHAR(255) USING dusun::text');
            echo "✅ dusun: integer → string\n";
        }

        if (Schema::hasColumn('pokja4_rekapitulasi', 'rw')) {
            DB::statement('ALTER TABLE pokja4_rekapitulasi ALTER COLUMN rw TYPE VARCHAR(255) USING rw::text');
            echo "✅ rw: integer → string\n";
        }

        if (Schema::hasColumn('pokja4_rekapitulasi', 'rt')) {
            DB::statement('ALTER TABLE pokja4_rekapitulasi ALTER COLUMN rt TYPE VARCHAR(255) USING rt::text');
            echo "✅ rt: integer → string\n";
        }

        if (Schema::hasColumn('pokja4_rekapitulasi', 'dasa_wisma')) {
            DB::statement('ALTER TABLE pokja4_rekapitulasi ALTER COLUMN dasa_wisma TYPE VARCHAR(255) USING dasa_wisma::text');
            echo "✅ dasa_wisma: integer → string\n";
        }
    }

    public function down(): void
    {
        // Reverse — opsional
    }
};
