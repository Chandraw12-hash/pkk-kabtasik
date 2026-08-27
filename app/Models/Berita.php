<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Berita extends Model
{
    use HasFactory;

    protected $table = 'beritas';

    protected $fillable = [
        'judul',
        'slug',
        'konten',
        'kategori',
        'kecamatan',
        'foto',
        'status_publikasi',
        // 'user_id',
    ];

    protected $casts = [
        'status_publikasi' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ============= APPENDS =============
    protected $appends = ['foto_url', 'deskripsi_singkat', 'tanggal_formatted'];

    // ============================================================
    // RELATIONS
    // ============================================================

    /**
     * Relasi ke User (penulis berita)
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // ============================================================
    // ACCESSORS
    // ============================================================

    /**
     * Accessor untuk URL foto
     */
    public function getFotoUrlAttribute()
    {
        if ($this->foto) {
            $path = $this->foto;

            if (str_starts_with($path, 'storage/')) {
                $path = substr($path, 8);
            }

            if (str_starts_with($path, 'public/')) {
                $path = substr($path, 7);
            }

            return asset('storage/' . $path);
        }
        return null;
    }

    /**
     * Accessor untuk deskripsi singkat (150 karakter pertama)
     */
    public function getDeskripsiSingkatAttribute()
    {
        $konten = strip_tags($this->konten);
        return Str::limit($konten, 150);
    }

    /**
     * Accessor untuk deskripsi lengkap (tanpa HTML)
     */
    public function getDeskripsiAttribute()
    {
        return strip_tags($this->konten);
    }

    /**
     * Accessor untuk tanggal format Indonesia
     */
    public function getTanggalFormattedAttribute()
    {
        if ($this->created_at) {
            return $this->created_at->locale('id')->translatedFormat('d F Y');
        }
        return null;
    }

    // ============================================================
    // MUTATORS
    // ============================================================

    /**
     * Setter untuk judul dan slug
     */
    public function setJudulAttribute($value)
    {
        $this->attributes['judul'] = $value;

        $slug = Str::slug($value);
        $originalSlug = $slug;
        $count = 1;

        while (static::where('slug', $slug)->where('id', '!=', $this->id ?? 0)->exists()) {
            $slug = "{$originalSlug}-{$count}";
            $count++;
        }

        $this->attributes['slug'] = $slug;
    }

    // ============================================================
    // SCOPES
    // ============================================================

    /**
     * Scope untuk berita yang dipublikasikan
     */
    public function scopePublished($query)
    {
        return $query->where('status_publikasi', true);
    }

    /**
     * Scope untuk berita terbaru
     */
    public function scopeLatest($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    /**
     * Scope untuk filter by kecamatan
     */
    public function scopeByKecamatan($query, $kecamatan)
    {
        return $query->where('kecamatan', $kecamatan);
    }

    /**
     * Scope untuk filter by kategori
     */
    public function scopeByKategori($query, $kategori)
    {
        return $query->where('kategori', $kategori);
    }

    // ============================================================
    // HELPERS
    // ============================================================

    /**
     * Cek apakah berita sudah dipublikasikan
     */
    public function isPublished()
    {
        return $this->status_publikasi === true;
    }

    /**
     * Get daftar kecamatan yang memiliki berita
     */
    public static function getKecamatanList()
    {
        return self::select('kecamatan')
            ->distinct()
            ->whereNotNull('kecamatan')
            ->pluck('kecamatan');
    }
}
