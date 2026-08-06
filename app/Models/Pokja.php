<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pokja extends Model
{
    use HasFactory;

    protected $table = 'pokjas';

    protected $fillable = [
        'kategori',
        'judul_kegiatan',
        'deskripsi',
        'foto',
    ];
}
