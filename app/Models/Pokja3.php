<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pokja3 extends Model
{
    use HasFactory;

    protected $table = 'pokja_threes';

    protected $fillable = [
        'kecamatan',
        'rumah_sehat',
        'rumah_tidak_sehat',
        'pemanfaatan_pekarangan',
        'industri_rumah_tangga',
    ];
}
