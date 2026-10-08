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
    ];
}
