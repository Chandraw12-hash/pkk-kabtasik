<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DataUmumPkk extends Model
{
    use HasFactory;

    protected $table = 'data_umum_pkk';

    // ══════════════════════════════════════════════════════════
    // FILLABLE — termasuk 4 kolom baru untuk approval kecamatan
    // ══════════════════════════════════════════════════════════
    protected $fillable = [
        'wilayah_id', 'tahun',
        'kecamatan', 'nama_kecamatan',
        'desa', 'nama_desa',
        'dusun', 'nama_dusun',
        'level',

        // Field approval desa
        'status', 'approved_by', 'approved_at', 'rejected_reason',

        // ✅ Field approval kecamatan (BARU)
        'kecamatan_status',
        'kecamatan_approved_by',
        'kecamatan_approved_at',
        'kecamatan_rejected_reason',

        // Field jumlah
        'jumlah_dusun', 'jumlah_pkk_rw', 'jumlah_pkk_rt', 'jumlah_dasa_wisma',
        'jumlah_krt', 'jumlah_kk',
        'jiwa_l', 'jiwa_p', 'jiwa_tidak_terpilah',
        'tp_pkk_l', 'tp_pkk_p',
        'kader_umum_l', 'kader_umum_p',
        'kader_khusus_l', 'kader_khusus_p',
        'sekretariat_honorer_l', 'sekretariat_honorer_p',
        'sekretariat_bantuan_l', 'sekretariat_bantuan_p',
        'keterangan', 'created_by', 'updated_by',
    ];

    // ══════════════════════════════════════════════════════════
    // CASTS
    // ══════════════════════════════════════════════════════════
    protected $casts = [
        'tahun' => 'integer',
        'jumlah_dusun' => 'integer',
        'jumlah_pkk_rw' => 'integer',
        'jumlah_pkk_rt' => 'integer',
        'jumlah_dasa_wisma' => 'integer',
        'jumlah_krt' => 'integer',
        'jumlah_kk' => 'integer',
        'jiwa_l' => 'integer',
        'jiwa_p' => 'integer',
        'jiwa_tidak_terpilah' => 'integer',
        'tp_pkk_l' => 'integer',
        'tp_pkk_p' => 'integer',
        'kader_umum_l' => 'integer',
        'kader_umum_p' => 'integer',
        'kader_khusus_l' => 'integer',
        'kader_khusus_p' => 'integer',
        'sekretariat_honorer_l' => 'integer',
        'sekretariat_honorer_p' => 'integer',
        'sekretariat_bantuan_l' => 'integer',
        'sekretariat_bantuan_p' => 'integer',

        // ✅ Tanggal untuk audit trail
        'approved_at' => 'datetime',
        'kecamatan_approved_at' => 'datetime',
    ];

    // ══════════════════════════════════════════════════════════
    // APPENDS — untuk akses via $model->total_jiwa
    // ══════════════════════════════════════════════════════════
    protected $appends = [
        'total_jiwa',
        'total_kader',
        'total_sekretariat',
    ];

    // ══════════════════════════════════════════════════════════
    // RELATIONS — untuk audit trail
    // ══════════════════════════════════════════════════════════

    /**
     * User yang approve di level desa
     */
    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * ✅ User yang approve di level kecamatan (BARU)
     */
    public function kecamatanApprovedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'kecamatan_approved_by');
    }

    /**
     * User yang buat record
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * User yang terakhir update
     */
    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    // ══════════════════════════════════════════════════════════
    // ACCESSORS — total per kategori
    // ══════════════════════════════════════════════════════════

    public function getTotalJiwaAttribute(): int
    {
        return ($this->jiwa_l ?? 0) + ($this->jiwa_p ?? 0)
            + ($this->jiwa_tidak_terpilah ?? 0);
    }

    public function getTotalKaderAttribute(): int
    {
        return ($this->tp_pkk_l ?? 0) + ($this->tp_pkk_p ?? 0)
            + ($this->kader_umum_l ?? 0) + ($this->kader_umum_p ?? 0)
            + ($this->kader_khusus_l ?? 0) + ($this->kader_khusus_p ?? 0);
    }

    public function getTotalSekretariatAttribute(): int
    {
        return ($this->sekretariat_honorer_l ?? 0) + ($this->sekretariat_honorer_p ?? 0)
            + ($this->sekretariat_bantuan_l ?? 0) + ($this->sekretariat_bantuan_p ?? 0);
    }

    // ══════════════════════════════════════════════════════════
    // HELPER METHODS — untuk approval & status
    // ══════════════════════════════════════════════════════════

    /**
     * Apakah data ini adalah agregat desa?
     * (level = desa, dusun = null)
     */
    public function isAggregateDesa(): bool
    {
        return $this->level === 'desa' && $this->dusun === null;
    }

    /**
     * Apakah data ini per dusun?
     * (level = desa, dusun != null)
     */
    public function isPerDusun(): bool
    {
        return $this->level === 'desa' && $this->dusun !== null;
    }

    /**
     * Apakah data desa sudah di-approve kecamatan?
     */
    public function isApprovedKecamatan(): bool
    {
        return $this->kecamatan_status === 'approved';
    }

    /**
     * Apakah data desa pending approval kecamatan?
     */
    public function isPendingKecamatan(): bool
    {
        return $this->kecamatan_status === 'pending';
    }

    /**
     * Apakah data desa di-reject kecamatan?
     */
    public function isRejectedKecamatan(): bool
    {
        return $this->kecamatan_status === 'rejected';
    }

    /**
     * Approve di level kecamatan
     */
    public function approveKecamatan(int $userId): bool
    {
        return $this->update([
            'kecamatan_status' => 'approved',
            'kecamatan_approved_by' => $userId,
            'kecamatan_approved_at' => now(),
            'kecamatan_rejected_reason' => null,
        ]);
    }

    /**
     * Reject di level kecamatan
     */
    public function rejectKecamatan(int $userId, string $reason): bool
    {
        return $this->update([
            'kecamatan_status' => 'rejected',
            'kecamatan_approved_by' => $userId,
            'kecamatan_approved_at' => now(),
            'kecamatan_rejected_reason' => $reason,
        ]);
    }

    // ══════════════════════════════════════════════════════════
    // SCOPES — untuk query yang sering dipakai
    // ══════════════════════════════════════════════════════════

    /**
     * Scope: cuma agregat desa (level=desa, dusun=null)
     */
    public function scopeAggregateDesa($query)
    {
        return $query->where('level', 'desa')->whereNull('dusun');
    }

    /**
     * Scope: cuma per dusun (level=desa, dusun!=null)
     */
    public function scopePerDusun($query)
    {
        return $query->where('level', 'desa')->whereNotNull('dusun');
    }

    /**
     * Scope: filter kecamatan
     */
    public function scopeByKecamatan($query, string $kecamatan)
    {
        return $query->where('kecamatan', $kecamatan);
    }

    /**
     * Scope: filter desa
     */
    public function scopeByDesa($query, string $desa)
    {
        return $query->where('desa', $desa);
    }

    /**
     * Scope: filter tahun
     */
    public function scopeByTahun($query, int $tahun)
    {
        return $query->where('tahun', $tahun);
    }

    /**
     * Scope: cuma yang approved kecamatan
     */
    public function scopeApprovedKecamatan($query)
    {
        return $query->where('kecamatan_status', 'approved');
    }

    /**
     * Scope: cuma yang pending kecamatan
     */
    public function scopePendingKecamatan($query)
    {
        return $query->where('kecamatan_status', 'pending');
    }

    /**
     * Scope: cuma yang rejected kecamatan
     */
    public function scopeRejectedKecamatan($query)
    {
        return $query->where('kecamatan_status', 'rejected');
    }
}
