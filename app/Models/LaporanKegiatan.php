<?php

namespace App\Models;

use App\Models\Scopes\KecamatanScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class LaporanKegiatan extends Model
{
    protected $table = 'laporan_kegiatans';

    protected $fillable = [
        'user_id',
        'judul',
        'deskripsi',
        'kategori_pokja',
        'data_angka',
        'foto',
        'kecamatan',
        'desa_kelurahan',
        'nama_dasawisma',
        'provinsi',
        'kabupaten_kota',
        'program',
        'pj_desa',
        'pj_desa_hp',
        'pj_kecamatan',
        'pj_kecamatan_hp',
        'pj_kabupaten',
        'pj_kabupaten_hp',
        'pj_provinsi',
        'pj_provinsi_hp',
        'status',
        'reviewed_at',
        'reviewed_by',
    ];

    protected $casts = [
        'data_angka'  => 'array',
        'reviewed_at' => 'datetime',
    ];

    protected $appends = ['foto_url', 'status_label', 'status_color', 'pokja_display'];

    // ============================================================
    // 🔥 TAMBAH: GLOBAL SCOPE — Auto Filter Kecamatan
    // ============================================================
    protected static function booted(): void
    {
        static::addGlobalScope(new KecamatanScope);
    }

    // ─── ACCESSORS ──────────────────────────────────────────────────────────────

    public function getFotoUrlAttribute(): ?string
    {
        if (!$this->foto) {
            return null;
        }
        if (str_starts_with($this->foto, 'http')) {
            return $this->foto;
        }
        return Storage::disk('public')->url($this->foto);
    }

    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'pending'   => 'Menunggu',
            'reviewed'  => 'Sudah Direview',
            'approved'  => 'Disetujui ✅',
            'rejected'  => 'Ditolak ❌',
            default     => $this->status ?? 'Unknown',
        };
    }

    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            'pending'   => 'warning',
            'reviewed'  => 'info',
            'approved'  => 'success',
            'rejected'  => 'danger',
            default     => 'default',
        };
    }

    // ✅ UPDATE: tambah 3 case untuk sheet baru
    public function getPokjaDisplayAttribute(): string
    {
        return match ($this->kategori_pokja) {
            'I'            => 'Pokja I - Penghayatan & Pengamalan Pancasila',
            'II'           => 'Pokja II - Pendidikan & Keterampilan',
            'III'          => 'Pokja III - Pangan, Sandang, Perumahan',
            'IV'           => 'Pokja IV - Kesehatan & Lingkungan',
            'IV-PYD'       => 'Pokja IV - Kunjungan PYD',
            'IV-POSYANDU'  => 'Pokja IV - Kegiatan Posyandu',
            'IV-REKAP'     => 'Pokja IV - Rekapitulasi',
            'SEKRETARIAT'  => 'Sekretariat',
            default        => $this->kategori_pokja ?? 'Unknown',
        };
    }

    // ─── CHECKERS ──────────────────────────────────────────────────────────────

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

    public function isReviewed(): bool
    {
        return $this->status === 'reviewed';
    }

    // ─── ACTIONS ──────────────────────────────────────────────────────────────

    public function approve(int $reviewerId): void
    {
        $this->update([
            'status'      => 'approved',
            'reviewed_at' => now(),
            'reviewed_by' => $reviewerId,
        ]);
    }

    public function reject(int $reviewerId): void
    {
        $this->update([
            'status'      => 'rejected',
            'reviewed_at' => now(),
            'reviewed_by' => $reviewerId,
        ]);
    }

    public function markAsReviewed(int $reviewerId): void
    {
        $this->update([
            'status'      => 'reviewed',
            'reviewed_at' => now(),
            'reviewed_by' => $reviewerId,
        ]);
    }

    // ─── DATA ANGKA HELPERS ──────────────────────────────────────────────────

    public function getDataAngka(): array
    {
        return is_array($this->data_angka) ? $this->data_angka : [];
    }

    public function getDataAngkaField(string $field, $default = 0)
    {
        $data = $this->getDataAngka();
        return $data[$field] ?? $default;
    }

    // ─── SCOPES ──────────────────────────────────────────────────────────────

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    public function scopeReviewed($query)
    {
        return $query->where('status', 'reviewed');
    }

    public function scopeByPokja($query, string $pokja)
    {
        return $query->where('kategori_pokja', $pokja);
    }

    public function scopeByKecamatan($query, string $kecamatan)
    {
        return $query->where('kecamatan', $kecamatan);
    }

    public function scopeSearch($query, string $keyword)
    {
        return $query->where(function ($q) use ($keyword) {
            $q->where('judul', 'like', "%{$keyword}%")
                ->orWhere('nama_dasawisma', 'like', "%{$keyword}%")
                ->orWhere('kecamatan', 'like', "%{$keyword}%")
                ->orWhere('desa_kelurahan', 'like', "%{$keyword}%");
        });
    }

    // ─── RELATIONS ──────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
