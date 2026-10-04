<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class CatatanKeluarga extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'daftar_warga_id', 'nama_anggota', 'nik', 'jenis_kelamin', 'tanggal_lahir',
        'umur', 'hubungan_keluarga', 'pendidikan', 'pekerjaan', 'status_perkawinan',
        'status', 'approved_by', 'approved_at', 'rejected_reason', 'created_by',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_lahir' => 'date',
            'approved_at' => 'datetime',
            'umur' => 'integer',
        ];
    }

    public function daftarWarga(): BelongsTo
    {
        return $this->belongsTo(DaftarWarga::class, 'daftar_warga_id');
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
        return $query->whereHas('daftarWarga', fn (Builder $parent) => $parent->where('desa', $desa));
    }
}
