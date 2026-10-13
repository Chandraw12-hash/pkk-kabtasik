<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pokja4DataDukung extends Model
{
    use HasFactory;

    protected $table = 'pokja4_data_dukung';

    protected $fillable = [
        'kecamatan', 'nama_kecamatan', 'tahun', 'semester',
        'jumlah_penduduk', 'jumlah_kepala_keluarga', 'jumlah_rumah',
        'jumlah_laki_laki', 'jumlah_perempuan', 'jumlah_usia_produktif',
        'jumlah_pasangan_usia_subur', 'jumlah_ibu_hamil', 'jumlah_bayi_0_2',
        'jumlah_bayi_asi_eksklusif', 'jumlah_balita_2_5', 'jumlah_anak_6_14',
        'jumlah_lansia', 'jumlah_peserta_kb_aktif', 'jumlah_ibu_menyusui',
        'jumlah_keluarga_sejahtera', 'jumlah_keluarga_pra_sejahtera', 'jumlah_mbr',
        'jumlah_kader_pkk_rt_rw', 'jumlah_kader_pkk_kesehatan',
        'jumlah_kelompok_dasa_wisma', 'jumlah_kader_dasa_wisma',
        'jumlah_posyandu_aktif', 'jumlah_bidan_desa', 'jumlah_bank_sampah',
        'jumlah_posko_bencana',
        'evaluasi', 'keterangan',
        'provinsi', 'kabupaten_kota', 'program',
        'pj_desa', 'pj_desa_hp', 'pj_kecamatan', 'pj_kecamatan_hp',
        'pj_kabupaten', 'pj_kabupaten_hp', 'pj_provinsi', 'pj_provinsi_hp',
    ];

    protected $casts = [
        'tahun' => 'integer',
        'jumlah_penduduk' => 'integer',
        'jumlah_kepala_keluarga' => 'integer',
        'jumlah_rumah' => 'integer',
        'jumlah_laki_laki' => 'integer',
        'jumlah_perempuan' => 'integer',
        'jumlah_usia_produktif' => 'integer',
        'jumlah_pasangan_usia_subur' => 'integer',
        'jumlah_ibu_hamil' => 'integer',
        'jumlah_bayi_0_2' => 'integer',
        'jumlah_bayi_asi_eksklusif' => 'integer',
        'jumlah_balita_2_5' => 'integer',
        'jumlah_anak_6_14' => 'integer',
        'jumlah_lansia' => 'integer',
        'jumlah_peserta_kb_aktif' => 'integer',
        'jumlah_ibu_menyusui' => 'integer',
        'jumlah_keluarga_sejahtera' => 'integer',
        'jumlah_keluarga_pra_sejahtera' => 'integer',
        'jumlah_mbr' => 'integer',
        'jumlah_kader_pkk_rt_rw' => 'integer',
        'jumlah_kader_pkk_kesehatan' => 'integer',
        'jumlah_kelompok_dasa_wisma' => 'integer',
        'jumlah_kader_dasa_wisma' => 'integer',
        'jumlah_posyandu_aktif' => 'integer',
        'jumlah_bidan_desa' => 'integer',
        'jumlah_bank_sampah' => 'integer',
        'jumlah_posko_bencana' => 'integer',
    ];
}
