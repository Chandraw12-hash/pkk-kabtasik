<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FileEviden extends Model
{
    protected $table = 'file_eviden';

    protected $fillable = [
        'eviden_id',
        'file_path',
        'file_type',
        'original_name',
    ];

    public function eviden()
    {
        return $this->belongsTo(Eviden::class, 'eviden_id');
    }
}
