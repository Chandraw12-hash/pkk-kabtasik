<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class KegiatanWarga extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'kecamatan', 'desa', 'dusun', 'rt', 'rw', 'dasawisma', 'kegiatan',
        'rincian',
        'jumlah_peserta', 'keterangan', 'tanggal', 'status', 'approved_by',
        'approved_at', 'rejected_reason', 'created_by',
    ];

    /** Rincian Excel KEGIATAN WARGA (info tambahan, rekap tetap kolom kegiatan). */
    public const RINCIAN = [
        'Penghayatan dan Pengamalan Pancasila',
        'Kerjabakti',
        'Rukun Kematian',
        'Kegiatan Keagamaan',
        'Jimpitan',
        'Arisan',
        'Lain-lain',
    ];

    protected function casts(): array
    {
        return ['tanggal' => 'date', 'approved_at' => 'datetime', 'jumlah_peserta' => 'integer'];
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('status', 'approved');
    }

    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', 'pending');
    }

    public function scopeByDesa(Builder $query, string $desa): Builder
    {
        return $query->where('desa', $desa);
    }
}
