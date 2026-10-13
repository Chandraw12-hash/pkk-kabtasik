<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Kembaran 2026_10_08_000002 (hasil merge 2 branch): tabel dibuat
        // di sana. Skip agar migrate tetap jalan di semua mesin.
        if (Schema::hasTable('pokja4_data_program')) {
            return;
        }

        Schema::create('pokja4_data_program', function (Blueprint $table) {
            $table->id();
            $table->string('kecamatan');
            $table->integer('tahun');
            $table->string('semester', 2)->default('I');

            // I. PEDULI STUNTING
            $table->integer('stunting_bayi_prematur')->default(0);
            $table->integer('stunting_bblr')->default(0);
            $table->integer('stunting_balita_kurang_gizi')->default(0);
            $table->integer('stunting_balita_stunting')->default(0);
            $table->integer('stunting_rutin_timbang')->default(0);
            $table->integer('stunting_jarak_dekat')->default(0);
            $table->integer('stunting_tidak_direncanakan')->default(0);

            // II. PHBS
            $table->integer('phbs_tbc')->default(0);
            $table->integer('phbs_jamban_sehat')->default(0);
            $table->integer('phbs_air_bersih')->default(0);
            $table->integer('phbs_diare')->default(0);
            $table->integer('phbs_sadar_gizi')->default(0);
            $table->integer('phbs_tanpa_rokok')->default(0);
            $table->integer('phbs_babs')->default(0);

            // III. KESEHATAN KELUARGA
            $table->integer('kesga_bumil_rutin')->default(0);
            $table->integer('kesga_ayah_merokok')->default(0);
            $table->integer('kesga_kematian_nifas')->default(0);
            $table->integer('kesga_kanker_serviks')->default(0);
            $table->integer('kesga_imunisasi_lengkap')->default(0);
            $table->integer('kesga_sakit_terdata')->default(0);
            $table->integer('kesga_kematian_bayi_balita')->default(0);

            // IV. SIAGA KEBAKARAN
            $table->integer('kebakaran_kasus')->default(0);
            $table->integer('kebakaran_listrik_standar')->default(0);
            $table->integer('kebakaran_apar')->default(0);
            $table->integer('kebakaran_semi_permanen')->default(0);
            $table->integer('kebakaran_p3k')->default(0);
            $table->integer('kebakaran_edukasi_rt')->default(0);
            $table->integer('kebakaran_edukasi_kader')->default(0);

            // V. MITIGASI BENCANA ALAM
            $table->integer('bencana_relawan')->default(0);
            $table->integer('bencana_edukasi_rt')->default(0);
            $table->integer('bencana_edukasi_kader')->default(0);
            $table->integer('bencana_posko_alternatif')->default(0);
            $table->integer('bencana_relawan_terdata')->default(0);
            $table->integer('bencana_tas_siaga')->default(0);
            $table->integer('bencana_fasum_rusak')->default(0);

            // VI. PEDULI LINGKUNGAN
            $table->integer('lingkungan_bak_sampah')->default(0);
            $table->integer('lingkungan_bank_sampah')->default(0);
            $table->integer('lingkungan_spal')->default(0);
            $table->integer('lingkungan_banjir')->default(0);
            $table->integer('lingkungan_bak_desa')->default(0);
            $table->integer('lingkungan_rumah_sehat')->default(0);
            $table->integer('lingkungan_klb')->default(0);

            // VII. KELUARGA BERKUALITAS
            $table->integer('berkualitas_2_anak')->default(0);
            $table->integer('berkualitas_berobat')->default(0);
            $table->integer('berkualitas_menular')->default(0);
            $table->integer('berkualitas_tidak_menular')->default(0);
            $table->integer('berkualitas_lahir_sehat')->default(0);
            $table->integer('berkualitas_cukup_bulan')->default(0);
            $table->integer('berkualitas_gangguan_jiwa')->default(0);

            // VIII. KEUANGAN SEHAT
            $table->integer('keuangan_asuransi')->default(0);
            $table->integer('keuangan_tanpa_kerja')->default(0);
            $table->integer('keuangan_tanpa_kerja_tetap')->default(0);
            $table->integer('keuangan_penghasilan_tetap')->default(0);
            $table->integer('keuangan_tabulin')->default(0);
            $table->integer('keuangan_tabungan')->default(0);
            $table->integer('keuangan_aset')->default(0);

            // IX. PASANGAN USIA SUBUR
            $table->integer('pus_lahir_sehat')->default(0);
            $table->integer('pus_wanita_kb')->default(0);
            $table->integer('pus_pria_kb')->default(0);
            $table->integer('pus_reproduksi')->default(0);
            $table->integer('pus_nikah_dini')->default(0);
            $table->integer('pus_hamil_beresiko')->default(0);
            $table->integer('pus_ims')->default(0);

            $table->text('evaluasi')->nullable();
            $table->timestamps();

            $table->unique(['kecamatan', 'tahun', 'semester']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pokja4_data_program');
    }
};
