<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pokja4 extends Model
{
    use HasFactory;

    protected $table = 'pokja_fours';

    protected $fillable = [
        'kategori',
        'kecamatan',
        'nama_kecamatan',
        'posyandu',
        'akseptor_kb',
        'phbs',
        'jamban_keluarga',
    ];
}
