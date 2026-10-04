<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class KegiatanDasaWisma extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'kecamatan', 'desa', 'dusun', 'rt', 'rw', 'dasawisma', 'tahun',
        'jumlah_dusun', 'jumlah_rw', 'jumlah_rt', 'jumlah_dasa_wisma', 'jumlah_krt',
        'jumlah_kk', 'total_l', 'total_p', 'balita_l', 'balita_p', 'pus', 'wus',
        'ibu_hamil', 'ibu_menyusui', 'lansia', 'buta_l', 'buta_p', 'rumah_sehat',
        'rumah_kurang_sehat', 'memiliki_tempat_sampah', 'memiliki_spal',
        'memiliki_stiker_p4k', 'air_pdam', 'air_sumur', 'air_sungai', 'air_dll',
        'jumlah_jamban_keluarga', 'makanan_pokok_beras', 'makanan_pokok_non_beras',
        'kegiatan_up2k', 'kegiatan_tanah_pekarangan', 'kegiatan_industri_rumah_tangga',
        'kegiatan_kesehatan_lingkungan', 'keterangan', 'status', 'approved_by',
        'approved_at', 'rejected_reason', 'created_by',
    ];

    protected function casts(): array
    {
        return [
            'tahun' => 'integer',
            'approved_at' => 'datetime',
            'jumlah_dusun' => 'integer', 'jumlah_rw' => 'integer', 'jumlah_rt' => 'integer',
            'jumlah_dasa_wisma' => 'integer', 'jumlah_krt' => 'integer', 'jumlah_kk' => 'integer',
            'total_l' => 'integer', 'total_p' => 'integer', 'balita_l' => 'integer',
            'balita_p' => 'integer', 'pus' => 'integer', 'wus' => 'integer',
            'ibu_hamil' => 'integer', 'ibu_menyusui' => 'integer', 'lansia' => 'integer',
            'buta_l' => 'integer', 'buta_p' => 'integer', 'rumah_sehat' => 'integer',
            'rumah_kurang_sehat' => 'integer', 'memiliki_tempat_sampah' => 'integer',
            'memiliki_spal' => 'integer', 'memiliki_stiker_p4k' => 'integer',
            'air_pdam' => 'integer', 'air_sumur' => 'integer', 'air_sungai' => 'integer',
            'air_dll' => 'integer', 'jumlah_jamban_keluarga' => 'integer',
            'makanan_pokok_beras' => 'integer', 'makanan_pokok_non_beras' => 'integer',
            'kegiatan_up2k' => 'integer', 'kegiatan_tanah_pekarangan' => 'integer',
            'kegiatan_industri_rumah_tangga' => 'integer',
            'kegiatan_kesehatan_lingkungan' => 'integer',
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
