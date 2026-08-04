<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Indikator extends Model
{
    // Specify table if not plural 'indikators'
    protected $table = 'indikator';

    protected $fillable = [
        'nama_indikator',
    ];


}
