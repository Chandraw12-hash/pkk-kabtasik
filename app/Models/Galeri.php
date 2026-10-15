<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Galeri extends Model
{
    use HasFactory;

    protected $table = 'galeris';

    protected $fillable = [
        'judul',
        'deskripsi',
        'foto',
        'tanggal',
    ];

    protected $casts = [
        'tanggal' => 'date',
    ];

    protected $appends = ['foto_url'];

    public function fotos()
    {
        return $this->hasMany(GaleriFoto::class, 'galeri_id')->orderBy('urutan');
    }

    /** Daftar URL foto tambahan (tanpa cover) — cermin Berita::galeri. */
    public function getGaleriAttribute(): array
    {
        return $this->fotos
            ->map(fn ($f) => $f->foto_url)
            ->filter()
            ->values()
            ->all();
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
