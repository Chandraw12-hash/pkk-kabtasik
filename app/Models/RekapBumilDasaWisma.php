<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class RekapBumilDasaWisma extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'kecamatan', 'desa', 'dusun', 'rt', 'rw', 'tahun', 'nama', 'umur', 'hamile',
        'anak_ke', 'jarak_hamil', 'tinggi_badan', 'berat_badan', 'lingkar_lengan',
        'hb', 'tekanan_darah', 'imunisasi', 'fe', 'keterangan', 'status', 'approved_by',
        'approved_at', 'rejected_reason', 'created_by',
    ];

    protected function casts(): array
    {
        return [
            'tahun' => 'integer',
            'approved_at' => 'datetime',
            'umur' => 'integer',
            'hamile' => 'integer',
            'anak_ke' => 'integer',
            'jarak_hamil' => 'integer',
            'tinggi_badan' => 'decimal:2',
            'berat_badan' => 'decimal:2',
            'lingkar_lengan' => 'decimal:2',
            'hb' => 'decimal:2',
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
