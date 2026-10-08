<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pokja4DataProgram extends Model
{
    use HasFactory;

    protected $table = 'pokja4_data_program';

    protected $fillable = [
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
    ];

    protected $casts = [
        'tahun' => 'integer',
    ];
}
