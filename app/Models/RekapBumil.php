<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RekapBumil extends Model
{
    use HasFactory;

    protected $table = 'rekap_bumil';

    protected $fillable = [
        'wilayah_id', 'tahun', 'bulan', 'nama_bulan',
        'kecamatan', 'nama_kecamatan',
        'desa', 'nama_desa',
        'dusun', 'nama_dusun',
        'rw', 'rt', 'nama_dasawisma', 'level',
        'jumlah_dusun', 'jumlah_rw', 'jumlah_rt', 'jumlah_dasa_wisma',
        'ibu_hamil', 'ibu_melahirkan', 'ibu_nifas', 'ibu_meninggal',
        'bayi_lahir_l', 'bayi_lahir_p',
        'akte_ada', 'akte_tidak_ada',
        'bayi_meninggal_l', 'bayi_meninggal_p',
        'balita_meninggal_l', 'balita_meninggal_p',
        'keterangan',
        // Approval desa
        'status', 'approved_by', 'approved_at', 'rejected_reason',
        // Approval kecamatan
        'kecamatan_status', 'kecamatan_approved_by',
        'kecamatan_approved_at', 'kecamatan_rejected_reason',
        'created_by', 'updated_by',
    ];

    protected $casts = [
        'tahun' => 'integer',
        'bulan' => 'integer',
        'jumlah_dusun' => 'integer',
        'jumlah_rw' => 'integer',
        'jumlah_rt' => 'integer',
        'jumlah_dasa_wisma' => 'integer',
        'ibu_hamil' => 'integer',
        'ibu_melahirkan' => 'integer',
        'ibu_nifas' => 'integer',
        'ibu_meninggal' => 'integer',
        'bayi_lahir_l' => 'integer',
        'bayi_lahir_p' => 'integer',
        'akte_ada' => 'integer',
        'akte_tidak_ada' => 'integer',
        'bayi_meninggal_l' => 'integer',
        'bayi_meninggal_p' => 'integer',
        'balita_meninggal_l' => 'integer',
        'balita_meninggal_p' => 'integer',
    ];

    protected $appends = [
        'total_bayi_lahir',
        'total_bayi_meninggal',
        'total_balita_meninggal',
        'total_ibu_meninggal',
    ];

    public function getTotalBayiLahirAttribute(): int
    {
        return ($this->bayi_lahir_l ?? 0) + ($this->bayi_lahir_p ?? 0);
    }

    public function getTotalBayiMeninggalAttribute(): int
    {
        return ($this->bayi_meninggal_l ?? 0) + ($this->bayi_meninggal_p ?? 0);
    }

    public function getTotalBalitaMeninggalAttribute(): int
    {
        return ($this->balita_meninggal_l ?? 0) + ($this->balita_meninggal_p ?? 0);
    }

    public function getTotalIbuMeninggalAttribute(): int
    {
        return $this->ibu_meninggal ?? 0;
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function kecamatanApprovedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'kecamatan_approved_by');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }
}
