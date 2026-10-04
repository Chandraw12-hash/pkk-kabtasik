<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class DaftarWarga extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'kecamatan', 'desa', 'dusun', 'rt', 'rw', 'dasawisma',
        'nama_kepala_keluarga', 'nik', 'no_kk', 'alamat', 'jumlah_anggota',
        'kategori', 'status', 'approved_by', 'approved_at', 'rejected_reason', 'created_by',
    ];

    protected function casts(): array
    {
        return ['approved_at' => 'datetime', 'jumlah_anggota' => 'integer'];
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function anggota(): HasMany
    {
        return $this->hasMany(CatatanKeluarga::class, 'daftar_warga_id');
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
