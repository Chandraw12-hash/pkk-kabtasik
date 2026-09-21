<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pokja4_kegiatan_posyandu', function (Blueprint $table) {
            $table->id();
            $table->integer('bulan');
            $table->string('nama_bulan');
            $table->integer('tahun')->default(2025);

            // IBU HAMIL
            $table->integer('ibu_hamil')->default(0);
            $table->integer('ibu_hamil_diperiksa')->default(0);
            $table->integer('ibu_hamil_dapat_fe')->default(0);

            // MENYUSUI
            $table->integer('menyusui')->default(0);

            // AKSEPTOR KB
            $table->integer('kb_iud')->default(0);
            $table->integer('kb_mow')->default(0);
            $table->integer('kb_mop')->default(0);
            $table->integer('kb_implan')->default(0);
            $table->integer('kb_pil')->default(0);
            $table->integer('kb_suntik')->default(0);
            $table->integer('kb_kondom')->default(0);

            // PENIMBANGAN BALITA
            $table->integer('balita_l')->default(0);
            $table->integer('balita_p')->default(0);
            $table->integer('balita_kia_l')->default(0);
            $table->integer('balita_kia_p')->default(0);
            $table->integer('balita_ditimbang_l')->default(0);
            $table->integer('balita_ditimbang_p')->default(0);
            $table->integer('balita_naik_l')->default(0);
            $table->integer('balita_naik_p')->default(0);
            $table->integer('vit_a_1')->default(0);
            $table->integer('vit_a_2')->default(0);

            // IMUNISASI
            $table->integer('imunisasi_tt_1')->default(0);
            $table->integer('imunisasi_tt_2')->default(0);
            $table->integer('imunisasi_bcg')->default(0);
            $table->integer('imunisasi_dpt_1')->default(0);
            $table->integer('imunisasi_dpt_2')->default(0);
            $table->integer('imunisasi_dpt_3')->default(0);
            $table->integer('imunisasi_polio_1')->default(0);
            $table->integer('imunisasi_polio_2')->default(0);
            $table->integer('imunisasi_polio_3')->default(0);
            $table->integer('imunisasi_polio_4')->default(0);
            $table->integer('imunisasi_campak')->default(0);
            $table->integer('imunisasi_hepatitis_1')->default(0);
            $table->integer('imunisasi_hepatitis_2')->default(0);
            $table->integer('imunisasi_hepatitis_3')->default(0);

            // DIARE
            $table->integer('balita_diare')->default(0);
            $table->integer('balita_oralit')->default(0);

            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pokja4_kegiatan_posyandu');
    }
};
