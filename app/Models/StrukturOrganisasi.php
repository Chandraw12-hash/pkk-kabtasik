<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StrukturOrganisasi extends Model
{
    use HasFactory;

    /**
     * Tentukan nama tabel secara eksplisit
     */
    protected $table = 'struktur_organisasi';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nama',
        'jabatan',
        'kategori',
        'pokja',
        'foto',
        'urutan',
        'is_active',
        'deskripsi',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
        'urutan' => 'integer',
    ];

    /**
     * 🔥 Scope untuk filter data aktif
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * 🔥 Scope untuk filter berdasarkan kategori
     */
    public function scopeKategori($query, $kategori)
    {
        return $query->where('kategori', $kategori);
    }

    /**
     * 🔥 Scope untuk filter berdasarkan pokja
     */
    public function scopePokja($query, $pokja)
    {
        return $query->where('pokja', $pokja);
    }

    /**
     * 🔥 Scope untuk urutkan berdasarkan urutan
     */
    public function scopeUrut($query)
    {
        return $query->orderBy('urutan', 'asc');
    }

    /**
     * 🔥 Accessor untuk foto (full URL)
     */
    public function getFotoUrlAttribute()
    {
        if ($this->foto) {
            return asset('storage/' . $this->foto);
        }
        return null;
    }

    /**
     * 🔥 Helper cek apakah ini ketua
     */
    public function isKetua(): bool
    {
        return $this->kategori === 'ketua';
    }

    /**
     * 🔥 Helper cek apakah ini pimpinan inti
     */
    public function isPimpinanInti(): bool
    {
        return $this->kategori === 'pimpinan_inti';
    }

    /**
     * 🔥 Helper cek apakah ini pokja
     */
    public function isPokja(): bool
    {
        return str_starts_with($this->kategori, 'pokja_');
    }

    /**
     * 🔥 Helper dapatkan label kategori
     */
    public function getKategoriLabelAttribute()
    {
        $labels = [
            'ketua' => 'Ketua TP PKK',
            'pimpinan_inti' => 'Pimpinan Inti',
            'pokja_i' => 'Pokja I',
            'pokja_ii' => 'Pokja II',
            'pokja_iii' => 'Pokja III',
            'pokja_iv' => 'Pokja IV',
        ];

        return $labels[$this->kategori] ?? $this->kategori;
    }

    /**
     * 🔥 Helper dapatkan label pokja
     */
    public function getPokjaLabelAttribute()
    {
        if (!$this->pokja) return null;

        $labels = [
            'I' => 'Pokja I',
            'II' => 'Pokja II',
            'III' => 'Pokja III',
            'IV' => 'Pokja IV',
        ];

        return $labels[$this->pokja] ?? $this->pokja;
    }
}
