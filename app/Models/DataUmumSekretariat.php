<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DataUmumSekretariat extends Model
{
    use HasFactory;

   protected $fillable = [
    'kategori',
    'kecamatan',
    'nama_kecamatan',
    'jumlah_pkk_rw',
    'jumlah_pkk_rt',
    'jumlah_dasa_wisma',
    'jumlah_krt',
    'jumlah_kk',
    'jiwa_l',
    'jiwa_p',
    'tp_pkk_l',
    'tp_pkk_p',
    'kader_umum_l',
    'kader_umum_p',
    'kader_khusus_l',
    'kader_khusus_p',
];
}
