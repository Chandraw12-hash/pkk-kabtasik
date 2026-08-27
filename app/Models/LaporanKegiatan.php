<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class LaporanKegiatan extends Model
{
    protected $table = 'laporan_kegiatans';

    protected $fillable = [
        'user_id',
        'judul',
        'deskripsi',
        'kategori_pokja',
        'data_angka',
        'foto',
        'kecamatan',
        'desa_kelurahan',
        'nama_dasawisma',
        'status',
        'reviewed_at',
        'reviewed_by',
    ];

    protected $casts = [
        'data_angka'  => 'array',
        'reviewed_at' => 'datetime',
    ];

    protected $appends = ['foto_url', 'status_label', 'status_color'];

    /**
     * Get foto URL
     */
    public function getFotoUrlAttribute(): ?string
    {
        if (!$this->foto) {
            return null;
        }
        if (str_starts_with($this->foto, 'http')) {
            return $this->foto;
        }
        return Storage::disk('public')->url($this->foto);
    }

    /**
     * Get status label in Indonesian
     */
    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'pending'   => 'Menunggu',
            'reviewed'  => 'Sudah Direview',
            'approved'  => 'Disetujui ✅',
            'rejected'  => 'Ditolak ❌',
            default     => $this->status,
        };
    }

    /**
     * Get status color for badge
     */
    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            'pending'   => 'warning',
            'reviewed'  => 'info',
            'approved'  => 'success',
            'rejected'  => 'danger',
            default     => 'default',
        };
    }

    /**
     * Check if laporan is pending
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if laporan is approved
     */
    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    /**
     * Check if laporan is rejected
     */
    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    /**
     * Check if laporan is reviewed
     */
    public function isReviewed(): bool
    {
        return $this->status === 'reviewed';
    }

    /**
     * Approve laporan
     */
    public function approve(int $reviewerId): void
    {
        $this->update([
            'status'      => 'approved',
            'reviewed_at' => now(),
            'reviewed_by' => $reviewerId,
        ]);
    }

    /**
     * Reject laporan
     */
    public function reject(int $reviewerId): void
    {
        $this->update([
            'status'      => 'rejected',
            'reviewed_at' => now(),
            'reviewed_by' => $reviewerId,
        ]);
    }

    /**
     * Mark as reviewed
     */
    public function markAsReviewed(int $reviewerId): void
    {
        $this->update([
            'status'      => 'reviewed',
            'reviewed_at' => now(),
            'reviewed_by' => $reviewerId,
        ]);
    }

    /**
     * Scope: Only pending laporan
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope: Only approved laporan
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope: Only rejected laporan
     */
    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    /**
     * Scope: Only reviewed laporan
     */
    public function scopeReviewed($query)
    {
        return $query->where('status', 'reviewed');
    }

    /**
     * Scope: By kategori pokja
     */
    public function scopeByPokja($query, string $pokja)
    {
        return $query->where('kategori_pokja', $pokja);
    }

    /**
     * Scope: By kecamatan
     */
    public function scopeByKecamatan($query, string $kecamatan)
    {
        return $query->where('kecamatan', $kecamatan);
    }

    /**
     * Scope: Search by judul or nama_dasawisma
     */
    public function scopeSearch($query, string $keyword)
    {
        return $query->where(function ($q) use ($keyword) {
            $q->where('judul', 'like', "%{$keyword}%")
                ->orWhere('nama_dasawisma', 'like', "%{$keyword}%")
                ->orWhere('kecamatan', 'like', "%{$keyword}%")
                ->orWhere('desa_kelurahan', 'like', "%{$keyword}%");
        });
    }

    /**
     * Get data angka as array with default empty array
     */
    public function getDataAngka(): array
    {
        return $this->data_angka ?? [];
    }

    /**
     * Get specific data angka field
     */
    public function getDataAngkaField(string $field, $default = 0)
    {
        return $this->data_angka[$field] ?? $default;
    }

    /**
     * Get pokja display name
     */
    public function getPokjaDisplayAttribute(): string
    {
        return match ($this->kategori_pokja) {
            'I'     => 'Pokja I - Penghayatan & Pengamalan Pancasila',
            'II'    => 'Pokja II - Pendidikan & Keterampilan',
            'III'   => 'Pokja III - Pangan, Sandang, Perumahan',
            'IV'    => 'Pokja IV - Kesehatan & Lingkungan',
            default => $this->kategori_pokja,
        };
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
