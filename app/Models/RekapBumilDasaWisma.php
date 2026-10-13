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
        'kecamatan', 'desa', 'dusun', 'rt', 'rw', 'dasawisma', 'daftar_warga_id', 'tahun', 'nama', 'suami_nama', 'umur', 'hamile',
        'anak_ke', 'jarak_hamil', 'tinggi_badan', 'berat_badan', 'lingkar_lengan',
        'hb', 'tekanan_darah', 'imunisasi', 'fe', 'keterangan', 'status', 'approved_by',
        'approved_at', 'rejected_reason', 'created_by',
        // Pelacakan bulanan per ibu
        'bulan', 'status_ibu',
        'bayi_nama', 'bayi_jenis_kelamin', 'bayi_tanggal_lahir', 'bayi_akta',
        'kematian_kategori', 'kematian_umur_bulan', 'kematian_nama', 'kematian_jenis_kelamin',
        'kematian_tanggal', 'kematian_sebab',
    ];

    protected function casts(): array
    {
        return [
            'tahun' => 'integer',
            'bulan' => 'integer',
            'bayi_tanggal_lahir' => 'date',
            'bayi_akta' => 'boolean',
            'kematian_tanggal' => 'date',
            'approved_at' => 'datetime',
            'kecamatan_approved_at' => 'datetime',
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

    /**
     * KK asal ibu (dipilih di form HP dari daftar KK dasawisma).
     * Nullable: input manual tanpa KK tetap sah.
     */
    public function daftarWarga(): BelongsTo
    {
        return $this->belongsTo(DaftarWarga::class, 'daftar_warga_id');
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
