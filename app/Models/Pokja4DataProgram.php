<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pokja4DataProgram extends Model
{
    use HasFactory;

    protected $table = 'pokja4_data_program';

    protected $fillable = [
<<<<<<< HEAD
        'kecamatan', 'nama_kecamatan', 'tahun', 'semester',
        'stunting_bayi_prematur', 'stunting_bblr', 'stunting_balita_kurang_gizi',
        'stunting_balita_stunting', 'stunting_rutin_timbang', 'stunting_jarak_dekat',
        'stunting_tidak_direncanakan',
        'phbs_tbc', 'phbs_jamban_sehat', 'phbs_air_bersih', 'phbs_diare',
        'phbs_sadar_gizi', 'phbs_tanpa_rokok', 'phbs_babs',
        'kesga_bumil_rutin', 'kesga_ayah_merokok', 'kesga_kematian_nifas',
        'kesga_kanker_serviks', 'kesga_imunisasi_lengkap', 'kesga_sakit_terdata',
        'kesga_kematian_bayi_balita',
        'kebakaran_kasus', 'kebakaran_listrik_standar', 'kebakaran_apar',
        'kebakaran_semi_permanen', 'kebakaran_p3k', 'kebakaran_edukasi_rt',
        'kebakaran_edukasi_kader',
        'bencana_relawan', 'bencana_edukasi_rt', 'bencana_edukasi_kader',
        'bencana_posko_alternatif', 'bencana_relawan_terdata', 'bencana_tas_siaga',
        'bencana_fasum_rusak',
        'lingkungan_bak_sampah', 'lingkungan_bank_sampah', 'lingkungan_spal',
        'lingkungan_banjir', 'lingkungan_bak_desa', 'lingkungan_rumah_sehat',
        'lingkungan_klb',
        'berkualitas_2_anak', 'berkualitas_berobat', 'berkualitas_menular',
        'berkualitas_tidak_menular', 'berkualitas_lahir_sehat',
        'berkualitas_cukup_bulan', 'berkualitas_gangguan_jiwa',
        'keuangan_asuransi', 'keuangan_tanpa_kerja', 'keuangan_tanpa_kerja_tetap',
        'keuangan_penghasilan_tetap', 'keuangan_tabulin', 'keuangan_tabungan',
        'keuangan_aset',
        'pus_lahir_sehat', 'pus_wanita_kb', 'pus_pria_kb', 'pus_reproduksi',
        'pus_nikah_dini', 'pus_hamil_beresiko', 'pus_ims',
        'evaluasi', 'keterangan',
=======
        'kecamatan',
        'tahun',
        'semester',

        // I. Peduli Stunting
        'stunting_bayi_prematur',
        'stunting_bblr',
        'stunting_balita_kurang_gizi',
        'stunting_balita_stunting',
        'stunting_rutin_timbang',
        'stunting_jarak_dekat',
        'stunting_tidak_direncanakan',

        // II. PHBS
        'phbs_tbc',
        'phbs_jamban_sehat',
        'phbs_air_bersih',
        'phbs_diare',
        'phbs_sadar_gizi',
        'phbs_tanpa_rokok',
        'phbs_babs',

        // III. Kesehatan Keluarga
        'kesga_bumil_rutin',
        'kesga_ayah_merokok',
        'kesga_kematian_nifas',
        'kesga_kanker_serviks',
        'kesga_imunisasi_lengkap',
        'kesga_sakit_terdata',
        'kesga_kematian_bayi_balita',

        // IV. Siaga Kebakaran
        'kebakaran_kasus',
        'kebakaran_listrik_standar',
        'kebakaran_apar',
        'kebakaran_semi_permanen',
        'kebakaran_p3k',
        'kebakaran_edukasi_rt',
        'kebakaran_edukasi_kader',

        // V. Mitigasi Bencana Alam
        'bencana_relawan',
        'bencana_edukasi_rt',
        'bencana_edukasi_kader',
        'bencana_posko_alternatif',
        'bencana_relawan_terdata',
        'bencana_tas_siaga',
        'bencana_fasum_rusak',

        // VI. Peduli Lingkungan
        'lingkungan_bak_sampah',
        'lingkungan_bank_sampah',
        'lingkungan_spal',
        'lingkungan_banjir',
        'lingkungan_bak_desa',
        'lingkungan_rumah_sehat',
        'lingkungan_klb',

        // VII. Keluarga Berkualitas
        'berkualitas_2_anak',
        'berkualitas_berobat',
        'berkualitas_menular',
        'berkualitas_tidak_menular',
        'berkualitas_lahir_sehat',
        'berkualitas_cukup_bulan',
        'berkualitas_gangguan_jiwa',

        // VIII. Keuangan Sehat
        'keuangan_asuransi',
        'keuangan_tanpa_kerja',
        'keuangan_tanpa_kerja_tetap',
        'keuangan_penghasilan_tetap',
        'keuangan_tabulin',
        'keuangan_tabungan',
        'keuangan_aset',

        // IX. Pasangan Usia Subur
        'pus_lahir_sehat',
        'pus_wanita_kb',
        'pus_pria_kb',
        'pus_reproduksi',
        'pus_nikah_dini',
        'pus_hamil_beresiko',
        'pus_ims',

        'evaluasi',
>>>>>>> 622b2a4 (menambahkan sheet laporan di admin kabupaten untuk pokja1)
    ];

    protected $casts = [
        'tahun' => 'integer',
<<<<<<< HEAD
=======
        'stunting_bayi_prematur' => 'integer',
        'stunting_bblr' => 'integer',
        'stunting_balita_kurang_gizi' => 'integer',
        'stunting_balita_stunting' => 'integer',
        'stunting_rutin_timbang' => 'integer',
        'stunting_jarak_dekat' => 'integer',
        'stunting_tidak_direncanakan' => 'integer',
        'phbs_tbc' => 'integer',
        'phbs_jamban_sehat' => 'integer',
        'phbs_air_bersih' => 'integer',
        'phbs_diare' => 'integer',
        'phbs_sadar_gizi' => 'integer',
        'phbs_tanpa_rokok' => 'integer',
        'phbs_babs' => 'integer',
        'kesga_bumil_rutin' => 'integer',
        'kesga_ayah_merokok' => 'integer',
        'kesga_kematian_nifas' => 'integer',
        'kesga_kanker_serviks' => 'integer',
        'kesga_imunisasi_lengkap' => 'integer',
        'kesga_sakit_terdata' => 'integer',
        'kesga_kematian_bayi_balita' => 'integer',
        'kebakaran_kasus' => 'integer',
        'kebakaran_listrik_standar' => 'integer',
        'kebakaran_apar' => 'integer',
        'kebakaran_semi_permanen' => 'integer',
        'kebakaran_p3k' => 'integer',
        'kebakaran_edukasi_rt' => 'integer',
        'kebakaran_edukasi_kader' => 'integer',
        'bencana_relawan' => 'integer',
        'bencana_edukasi_rt' => 'integer',
        'bencana_edukasi_kader' => 'integer',
        'bencana_posko_alternatif' => 'integer',
        'bencana_relawan_terdata' => 'integer',
        'bencana_tas_siaga' => 'integer',
        'bencana_fasum_rusak' => 'integer',
        'lingkungan_bak_sampah' => 'integer',
        'lingkungan_bank_sampah' => 'integer',
        'lingkungan_spal' => 'integer',
        'lingkungan_banjir' => 'integer',
        'lingkungan_bak_desa' => 'integer',
        'lingkungan_rumah_sehat' => 'integer',
        'lingkungan_klb' => 'integer',
        'berkualitas_2_anak' => 'integer',
        'berkualitas_berobat' => 'integer',
        'berkualitas_menular' => 'integer',
        'berkualitas_tidak_menular' => 'integer',
        'berkualitas_lahir_sehat' => 'integer',
        'berkualitas_cukup_bulan' => 'integer',
        'berkualitas_gangguan_jiwa' => 'integer',
        'keuangan_asuransi' => 'integer',
        'keuangan_tanpa_kerja' => 'integer',
        'keuangan_tanpa_kerja_tetap' => 'integer',
        'keuangan_penghasilan_tetap' => 'integer',
        'keuangan_tabulin' => 'integer',
        'keuangan_tabungan' => 'integer',
        'keuangan_aset' => 'integer',
        'pus_lahir_sehat' => 'integer',
        'pus_wanita_kb' => 'integer',
        'pus_pria_kb' => 'integer',
        'pus_reproduksi' => 'integer',
        'pus_nikah_dini' => 'integer',
        'pus_hamil_beresiko' => 'integer',
        'pus_ims' => 'integer',
>>>>>>> 622b2a4 (menambahkan sheet laporan di admin kabupaten untuk pokja1)
    ];
}
