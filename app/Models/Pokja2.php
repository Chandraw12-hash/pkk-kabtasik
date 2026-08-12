<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pokja2 extends Model
{
    use HasFactory;

    protected $table = 'pokja_twos';

    protected $fillable = [
        'kategori',
        'kecamatan',
        'nama_kecamatan',
        'judul_kegiatan',           // <--- Ditambahkan agar sesuai dengan import
        'deskripsi',                // <--- Ditambahkan agar sesuai dengan import
        'warga_buta_l',
        'warga_buta_p',
        'kelompok_belajar_paket_a',
        'kelompok_belajar_paket_b',
        'kelompok_belajar_paket_c',
        'kf',
        'paud',
        'koperasi_berbadan_hukum',
    ];
}
