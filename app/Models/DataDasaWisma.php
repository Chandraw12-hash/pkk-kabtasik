<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class DataDasaWisma extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'kecamatan', 'desa', 'dusun', 'rt', 'rw', 'nama_dasawisma', 'nama_krt',
        'jumlah_kk', 'jumlah_jiwa_l', 'jumlah_jiwa_p', 'jumlah_balita', 'jumlah_pus',
        'jumlah_wus', 'jumlah_lansia', 'status', 'approved_by', 'approved_at',
        'rejected_reason', 'created_by',
    ];

    protected function casts(): array
    {
        return [
            'approved_at' => 'datetime',
            'jumlah_kk' => 'integer',
            'jumlah_jiwa_l' => 'integer',
            'jumlah_jiwa_p' => 'integer',
            'jumlah_balita' => 'integer',
            'jumlah_pus' => 'integer',
            'jumlah_wus' => 'integer',
            'jumlah_lansia' => 'integer',
        ];
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
