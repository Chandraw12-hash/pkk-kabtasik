<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pokja2 extends Model
{
    use HasFactory;

    protected $table = 'pokja_twos';

    protected $fillable = [
        'kategori',
        'kecamatan',
        'nama_kecamatan',
        'judul_kegiatan',
        'deskripsi',
        'foto',
        'warga_buta_l',
        'warga_buta_p',
        'kelompok_belajar_paket_a',
        'kelompok_belajar_paket_b',
        'kelompok_belajar_paket_c',
        'kf',
        'paud',
        'koperasi_berbadan_hukum',
    ];

    protected $casts = [
        'warga_buta_l' => 'integer',
        'warga_buta_p' => 'integer',
        'kelompok_belajar_paket_a' => 'integer',
        'kelompok_belajar_paket_b' => 'integer',
        'kelompok_belajar_paket_c' => 'integer',
        'kf' => 'integer',
        'paud' => 'integer',
        'koperasi_berbadan_hukum' => 'integer',
    ];

    protected $appends = [
        'total_warga_buta',
        'total_kelompok_belajar',
        'total_paud',
        'total_koperasi',
        'total_keseluruhan',
    ];

    /**
     * Get total Warga Buta (L + P)
     */
    public function getTotalWargaButaAttribute(): int
    {
        return ($this->warga_buta_l ?? 0) + ($this->warga_buta_p ?? 0);
    }

    /**
     * Get total Kelompok Belajar (Paket A + B + C)
     */
    public function getTotalKelompokBelajarAttribute(): int
    {
        return ($this->kelompok_belajar_paket_a ?? 0) +
               ($this->kelompok_belajar_paket_b ?? 0) +
               ($this->kelompok_belajar_paket_c ?? 0);
    }

    /**
     * Get total PAUD
     */
    public function getTotalPaudAttribute(): int
    {
        return $this->paud ?? 0;
    }

    /**
     * Get total Koperasi Berbadan Hukum
     */
    public function getTotalKoperasiAttribute(): int
    {
        return $this->koperasi_berbadan_hukum ?? 0;
    }

    /**
     * Get total keseluruhan semua kategori
     */
    public function getTotalKeseluruhanAttribute(): int
    {
        return $this->total_warga_buta +
               $this->total_kelompok_belajar +
               $this->total_paud +
               $this->total_koperasi;
    }

    /**
     * Get rasio gender (L vs P) dalam persen untuk Warga Buta
     */
    public function getRasioWargaButaAttribute(): array
    {
        $total = $this->total_warga_buta;
        if ($total === 0) {
            return ['l' => 0, 'p' => 0];
        }
        return [
            'l' => round(($this->warga_buta_l / $total) * 100, 1),
            'p' => round(($this->warga_buta_p / $total) * 100, 1),
        ];
    }

    /**
     * Get data per kategori
     */
    public function getDataPerKategoriAttribute(): array
    {
        return [
            'warga_buta' => [
                'l' => $this->warga_buta_l ?? 0,
                'p' => $this->warga_buta_p ?? 0,
                'total' => $this->total_warga_buta,
            ],
            'kelompok_belajar' => [
                'paket_a' => $this->kelompok_belajar_paket_a ?? 0,
                'paket_b' => $this->kelompok_belajar_paket_b ?? 0,
                'paket_c' => $this->kelompok_belajar_paket_c ?? 0,
                'total' => $this->total_kelompok_belajar,
            ],
            'kf' => [
                'total' => $this->kf ?? 0,
            ],
            'paud' => [
                'total' => $this->paud ?? 0,
            ],
            'koperasi' => [
                'total' => $this->koperasi_berbadan_hukum ?? 0,
            ],
        ];
    }

    // ============================================
    // STATIC METHODS
    // ============================================

    /**
     * Get total semua kecamatan
     */
    public static function getTotalSemuaKecamatan(): array
    {
        $data = self::selectRaw('
            SUM(warga_buta_l) as total_warga_buta_l,
            SUM(warga_buta_p) as total_warga_buta_p,
            SUM(kelompok_belajar_paket_a) as total_paket_a,
            SUM(kelompok_belajar_paket_b) as total_paket_b,
            SUM(kelompok_belajar_paket_c) as total_paket_c,
            SUM(kf) as total_kf,
            SUM(paud) as total_paud,
            SUM(koperasi_berbadan_hukum) as total_koperasi
        ')->first();

        return [
            'warga_buta' => [
                'l' => $data->total_warga_buta_l ?? 0,
                'p' => $data->total_warga_buta_p ?? 0,
                'total' => ($data->total_warga_buta_l ?? 0) + ($data->total_warga_buta_p ?? 0),
            ],
            'kelompok_belajar' => [
                'paket_a' => $data->total_paket_a ?? 0,
                'paket_b' => $data->total_paket_b ?? 0,
                'paket_c' => $data->total_paket_c ?? 0,
                'total' => ($data->total_paket_a ?? 0) + ($data->total_paket_b ?? 0) + ($data->total_paket_c ?? 0),
            ],
            'kf' => $data->total_kf ?? 0,
            'paud' => $data->total_paud ?? 0,
            'koperasi' => $data->total_koperasi ?? 0,
        ];
    }

    /**
     * Get data by kecamatan
     */
    public static function getByKecamatan($kecamatan): ?self
    {
        return self::where('kecamatan', $kecamatan)
            ->orWhere('nama_kecamatan', $kecamatan)
            ->first();
    }

    // ============================================
    // SCOPES
    // ============================================

    /**
     * Scope: Filter by kecamatan
     */
    public function scopeByKecamatan($query, $kecamatan)
    {
        return $query->where('kecamatan', $kecamatan)
            ->orWhere('nama_kecamatan', $kecamatan);
    }

    /**
     * Scope: Search by kecamatan or nama_kecamatan
     */
    public function scopeSearch($query, $keyword)
    {
        return $query->where('kecamatan', 'like', "%{$keyword}%")
            ->orWhere('nama_kecamatan', 'like', "%{$keyword}%")
            ->orWhere('judul_kegiatan', 'like', "%{$keyword}%");
    }

    /**
     * Scope: Order by kecamatan
     */
    public function scopeOrderByKecamatan($query, $direction = 'asc')
    {
        return $query->orderBy('kecamatan', $direction);
    }

    /**
     * Scope: Get only with data
     */
    public function scopeHasData($query)
    {
        return $query->where(function ($q) {
            $q->where('warga_buta_l', '>', 0)
                ->orWhere('warga_buta_p', '>', 0)
                ->orWhere('kelompok_belajar_paket_a', '>', 0)
                ->orWhere('kelompok_belajar_paket_b', '>', 0)
                ->orWhere('kelompok_belajar_paket_c', '>', 0)
                ->orWhere('kf', '>', 0)
                ->orWhere('paud', '>', 0)
                ->orWhere('koperasi_berbadan_hukum', '>', 0);
        });
    }

    // ============================================
    // RELATIONS
    // ============================================

    /**
     * Get Sekretariat data for same kecamatan
     */
    public function sekretariat()
    {
        return $this->hasOne(DataUmumSekretariat::class, 'kecamatan', 'kecamatan');
    }

    /**
     * Increment statistik
     */
    public function incrementStatistik(array $data): void
    {
        foreach ($data as $field => $value) {
            if (in_array($field, $this->fillable) && is_numeric($value)) {
                $this->increment($field, $value);
            }
        }
    }
}
