<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Support\Str;

class Eviden extends Model
{
    protected $table = 'eviden';

    protected $fillable = [
        'uuid',
        'user_id',
        'indikator_id',
        'skpd_id',
        'tahun',
        'status',
    ];

    public static function boot()
    {
        parent::boot();
        self::creating(function ($model) {
            $model->uuid = (string) Str::uuid();
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function indikator()
    {
        return $this->belongsTo(Indikator::class);
    }



    public function files()
    {
        return $this->hasMany(FileEviden::class, 'eviden_id');
    }

    public function getRouteKeyName()
    {
        return 'uuid';
    }
}
