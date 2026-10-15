<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GaleriFoto extends Model
{
    protected $table = 'galeri_fotos';

    protected $fillable = ['galeri_id', 'foto', 'urutan'];

    protected $appends = ['foto_url'];

    public function galeri()
    {
        return $this->belongsTo(Galeri::class, 'galeri_id');
    }

    public function getFotoUrlAttribute(): ?string
    {
        $foto = $this->foto;
        if (!$foto) {
            return null;
        }
        if (str_starts_with($foto, 'http')) {
            return $foto;
        }
        $foto = ltrim(preg_replace('#^(storage/|public/)#', '', $foto), '/');

        return asset('storage/' . $foto);
    }
}
