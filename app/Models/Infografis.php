<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Infografis extends Model
{
    protected $fillable = [
        'judul', 'deskripsi', 'gambar', 'kategori', 'status', 'urutan'
    ];

    protected $casts = [
        'urutan' => 'integer',
        'created_at' => 'datetime',
    ];

    public function getGambarUrlAttribute()
    {
        if (!$this->gambar) return null;
        return asset('storage/' . $this->gambar);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByKategori($query, $kategori)
    {
        return $query->where('kategori', $kategori);
    }
}
