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
        'jumlah_kk', 'jumlah_laki_laki', 'jumlah_perempuan',
        'jumlah_balita_l', 'jumlah_balita_p',
        'jumlah_pus', 'jumlah_wus',
        'jumlah_ibu_hamil', 'jumlah_ibu_menyusui',
        'jumlah_lansia', 'jumlah_buta_l', 'jumlah_buta_p',
        'kriteria_rumah', 'sumber_air',
        'memiliki_tempat_sampah', 'memiliki_spal', 'memiliki_stiker_p4k',
        'mempunyai_mck', 'jumlah_mck',
        'makanan_pokok', 'ikut_up2k', 'ikut_kesling',
        'kategori', 'status', 'approved_by', 'approved_at', 'rejected_reason', 'created_by',
    ];

    protected function casts(): array
    {
        return [
            'approved_at' => 'datetime',
            'data_umum_synced_at' => 'datetime',
            'jumlah_anggota' => 'integer',
            'jumlah_kk' => 'integer',
            'jumlah_laki_laki' => 'integer',
            'jumlah_perempuan' => 'integer',
            'jumlah_balita_l' => 'integer',
            'jumlah_balita_p' => 'integer',
            'jumlah_pus' => 'integer',
            'jumlah_wus' => 'integer',
            'jumlah_ibu_hamil' => 'integer',
            'jumlah_ibu_menyusui' => 'integer',
            'jumlah_lansia' => 'integer',
            'jumlah_buta_l' => 'integer',
            'jumlah_buta_p' => 'integer',
            'memiliki_tempat_sampah' => 'boolean',
            'memiliki_spal' => 'boolean',
            'memiliki_stiker_p4k' => 'boolean',
            'mempunyai_mck' => 'boolean',
            'jumlah_mck' => 'integer',
            'ikut_up2k' => 'boolean',
            'ikut_kesling' => 'boolean',
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
