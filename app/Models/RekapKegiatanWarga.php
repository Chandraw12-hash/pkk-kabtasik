<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RekapKegiatanWarga extends Model
{
    use HasFactory;

    protected $table = 'rekap_kegiatan_warga';

    protected $fillable = [
        // Wilayah
        'wilayah_id', 'tahun',
        'kecamatan', 'nama_kecamatan',
        'desa', 'nama_desa',
        'dusun', 'nama_dusun',
        'rw', 'rt', 'level',

        // Statistik
        'jumlah_dusun', 'jumlah_rw', 'jumlah_rt', 'jumlah_dasa_wisma',
        'jumlah_krt', 'jumlah_kk',
        'total_l', 'total_p',
        'balita_l', 'balita_p',
        'pus', 'wus', 'ibu_hamil', 'ibu_menyusui', 'lansia',
        'buta_l', 'buta_p',
        'rumah_sehat', 'rumah_kurang_sehat',
        'memiliki_tempat_sampah', 'memiliki_spal', 'memiliki_stiker_p4k',
        'air_pdam', 'air_sumur', 'air_sungai', 'air_dll',
        'jumlah_jamban_keluarga',
        'makanan_pokok_beras', 'makanan_pokok_non_beras',
        'kegiatan_up2k', 'kegiatan_tanah_pekarangan',
        'kegiatan_industri_rumah_tangga', 'kegiatan_kesehatan_lingkungan',
        'keterangan',

        // Approval Desa
        'status', 'approved_by', 'approved_at', 'rejected_reason',

        // Approval Kecamatan
        'kecamatan_status', 'kecamatan_approved_by',
        'kecamatan_approved_at', 'kecamatan_rejected_reason',

        // Meta
        'created_by', 'updated_by',
    ];

    protected $casts = [
        'tahun' => 'integer',
        'jumlah_dusun' => 'integer',
        'jumlah_rw' => 'integer',
        'jumlah_rt' => 'integer',
        'jumlah_dasa_wisma' => 'integer',
        'jumlah_krt' => 'integer',
        'jumlah_kk' => 'integer',
        'total_l' => 'integer', 'total_p' => 'integer',
        'balita_l' => 'integer', 'balita_p' => 'integer',
        'pus' => 'integer', 'wus' => 'integer',
        'ibu_hamil' => 'integer', 'ibu_menyusui' => 'integer',
        'lansia' => 'integer',
        'buta_l' => 'integer', 'buta_p' => 'integer',
        'rumah_sehat' => 'integer', 'rumah_kurang_sehat' => 'integer',
        'memiliki_tempat_sampah' => 'integer',
        'memiliki_spal' => 'integer',
        'memiliki_stiker_p4k' => 'integer',
        'air_pdam' => 'integer', 'air_sumur' => 'integer',
        'air_sungai' => 'integer', 'air_dll' => 'integer',
        'jumlah_jamban_keluarga' => 'integer',
        'makanan_pokok_beras' => 'integer',
        'makanan_pokok_non_beras' => 'integer',
        'kegiatan_up2k' => 'integer',
        'kegiatan_tanah_pekarangan' => 'integer',
        'kegiatan_industri_rumah_tangga' => 'integer',
        'kegiatan_kesehatan_lingkungan' => 'integer',

        // Approval
        'approved_at' => 'datetime',
        'kecamatan_approved_at' => 'datetime',
    ];

    protected $appends = [
        'total_anggota_keluarga',
        'total_balita',
        'total_buta',
        'total_air',
    ];

    /* ============================================================
     * ACCESSOR — Total turunan
     * ============================================================ */

    public function getTotalAnggotaKeluargaAttribute(): int
    {
        return ($this->total_l ?? 0) + ($this->total_p ?? 0);
    }

    public function getTotalBalitaAttribute(): int
    {
        return ($this->balita_l ?? 0) + ($this->balita_p ?? 0);
    }

    public function getTotalButaAttribute(): int
    {
        return ($this->buta_l ?? 0) + ($this->buta_p ?? 0);
    }

    public function getTotalAirAttribute(): int
    {
        return ($this->air_pdam ?? 0) + ($this->air_sumur ?? 0)
            + ($this->air_sungai ?? 0) + ($this->air_dll ?? 0);
    }

    /* ============================================================
     * RELASI
     * ============================================================ */

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

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /* ============================================================
     * SCOPE — Filter umum
     * ============================================================ */

    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('status', 'approved');
    }

    public function scopeRejected(Builder $query): Builder
    {
        return $query->where('status', 'rejected');
    }

    public function scopeKecamatanPending(Builder $query): Builder
    {
        return $query->where('kecamatan_status', 'pending');
    }

    public function scopeKecamatanApproved(Builder $query): Builder
    {
        return $query->where('kecamatan_status', 'approved');
    }

    public function scopeKecamatanRejected(Builder $query): Builder
    {
        return $query->where('kecamatan_status', 'rejected');
    }

    /* ============================================================
     * SCOPE — Filter wilayah
     * ============================================================ */

    public function scopeByDesa(Builder $query, string $kecamatan, string $desa): Builder
    {
        return $query->where('kecamatan', $kecamatan)
            ->where('desa', $desa);
    }

    public function scopeByKecamatan(Builder $query, string $kecamatan): Builder
    {
        return $query->where('kecamatan', $kecamatan);
    }

    public function scopeByLevel(Builder $query, string $level): Builder
    {
        return $query->where('level', $level);
    }

    public function scopeByTahun(Builder $query, int $tahun): Builder
    {
        return $query->where('tahun', $tahun);
    }

    /* ============================================================
     * SCOPE — Kabupaten (hanya yang lolos 2 layer)
     * ============================================================ */

    public function scopeFullyApproved(Builder $query): Builder
    {
        return $query->where('status', 'approved')
            ->where('kecamatan_status', 'approved');
    }

    /* ============================================================
     * HELPER
     * ============================================================ */

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    public function isKecamatanApproved(): bool
    {
        return $this->kecamatan_status === 'approved';
    }
}
