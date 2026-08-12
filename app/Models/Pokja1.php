<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pokja1 extends Model
{
    use HasFactory;

    protected $table = 'pokja_ones';

    protected $fillable = [
        'judul_kegiatan',
        'deskripsi',
        'foto',
        'kategori',
        'kecamatan',
        'nama_kecamatan',
        'pkbn_l',
        'pkbn_p',
        'pkdrt_l',
        'pkdrt_p',
        'pola_asuh_l',
        'pola_asuh_p',
        'lansia_l',
        'lansia_p',
        'kader_pokja1_l',
        'kader_pokja1_p',
    ];
}
