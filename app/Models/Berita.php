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
        'status', // pending | approved | rejected
        'user_id',
        'tanggal',
    ];

    protected $casts = [
        'status' => 'string',
        'tanggal' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ============= APPENDS =============
    protected $appends = ['foto_url', 'deskripsi_singkat', 'tanggal_formatted', 'status_label'];

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

            // Cek apakah foto sudah memiliki asset URL
            if (filter_var($path, FILTER_VALIDATE_URL)) {
                return $path;
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
        if ($this->tanggal) {
            return $this->tanggal->locale('id')->translatedFormat('d F Y');
        }
        if ($this->created_at) {
            return $this->created_at->locale('id')->translatedFormat('d F Y');
        }
        return null;
    }

    /**
     * Accessor untuk label status
     */
    public function getStatusLabelAttribute()
    {
        $labels = [
            'pending' => 'Menunggu Persetujuan',
            'approved' => 'Disetujui',
            'rejected' => 'Ditolak',
            'draft' => 'Draft',
        ];
        return $labels[$this->status] ?? ucfirst($this->status);
    }

    /**
     * Accessor untuk badge status
     */
    public function getStatusBadgeAttribute()
    {
        $badges = [
            'pending' => 'bg-yellow-100 text-yellow-800',
            'approved' => 'bg-green-100 text-green-800',
            'rejected' => 'bg-red-100 text-red-800',
            'draft' => 'bg-gray-100 text-gray-800',
        ];
        return $badges[$this->status] ?? 'bg-gray-100 text-gray-800';
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
     * Scope untuk berita yang dipublikasikan (approved)
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope untuk berita yang pending
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope untuk berita yang approved
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope untuk berita yang rejected
     */
    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    /**
     * Scope untuk berita yang bukan rejected (pending + approved)
     */
    public function scopeNotRejected($query)
    {
        return $query->where('status', '!=', 'rejected');
    }

    /**
     * Scope untuk berita terbaru
     */
    public function scopeLatest($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    /**
     * Scope untuk berita terbaru berdasarkan tanggal
     */
    public function scopeLatestByTanggal($query)
    {
        return $query->orderBy('tanggal', 'desc');
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

    /**
     * Scope untuk filter by user
     */
    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    // ============================================================
    // HELPERS
    // ============================================================

    /**
     * Cek apakah berita pending
     */
    public function isPending()
    {
        return $this->status === 'pending';
    }

    /**
     * Cek apakah berita approved
     */
    public function isApproved()
    {
        return $this->status === 'approved';
    }

    /**
     * Cek apakah berita rejected
     */
    public function isRejected()
    {
        return $this->status === 'rejected';
    }

    /**
     * Cek apakah berita sudah dipublikasikan
     */
    public function isPublished()
    {
        return $this->status === 'approved';
    }

    /**
     * Approve berita
     */
    public function approve()
    {
        $this->update([
            'status' => 'approved',
            'tanggal' => now(),
        ]);
        return $this;
    }

    /**
     * Reject berita
     */
    public function reject()
    {
        $this->update([
            'status' => 'rejected'
        ]);
        return $this;
    }

    /**
     * Pending berita (kembalikan ke pending)
     */
    public function setPending()
    {
        $this->update([
            'status' => 'pending'
        ]);
        return $this;
    }

    /**
     * Get daftar kecamatan yang memiliki berita approved
     */
    public static function getKecamatanList()
    {
        return self::where('status', 'approved')
            ->select('kecamatan')
            ->distinct()
            ->whereNotNull('kecamatan')
            ->pluck('kecamatan');
    }

    /**
     * Get daftar kategori yang memiliki berita
     */
    public static function getKategoriList()
    {
        return self::select('kategori')
            ->distinct()
            ->whereNotNull('kategori')
            ->pluck('kategori');
    }

    /**
     * Get daftar status dengan label
     */
    public static function getStatusList()
    {
        return [
            'pending' => 'Menunggu Persetujuan',
            'approved' => 'Disetujui',
            'rejected' => 'Ditolak',
            'draft' => 'Draft',
        ];
    }
}
