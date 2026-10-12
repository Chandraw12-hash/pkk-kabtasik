<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Tambah nilai 'DASAWISMA' ke check constraint kader.pokja agar
     * akun dasawisma setara kader pokja di Data Kader (badge Dasawisma).
     * Kolom aslinya varchar + CHECK (bukan native enum), jadi cukup
     * drop + re-add constraint. NULL tetap lolos CHECK seperti semula.
     */
    public function up(): void
    {
        DB::statement('ALTER TABLE kader DROP CONSTRAINT IF EXISTS kader_pokja_check');
        DB::statement("ALTER TABLE kader ADD CONSTRAINT kader_pokja_check CHECK (pokja IN ('I', 'II', 'III', 'IV', 'Sekretariat', 'DASAWISMA'))");
    }

    public function down(): void
    {
        DB::statement("UPDATE kader SET pokja = NULL WHERE pokja = 'DASAWISMA'");
        DB::statement('ALTER TABLE kader DROP CONSTRAINT IF EXISTS kader_pokja_check');
        DB::statement("ALTER TABLE kader ADD CONSTRAINT kader_pokja_check CHECK (pokja IN ('I', 'II', 'III', 'IV', 'Sekretariat'))");
    }
};
