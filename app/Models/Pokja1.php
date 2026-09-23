<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pokja1 extends Model
{
    use HasFactory;

    protected $table = 'pokja_ones';

    protected $fillable = [
        // Header
        'kecamatan',
        'nama_kecamatan',
        'nama_wilayah',
        'tahun',
        'kader_umum',
        'kader_khusus',

        // KISAH
        'kisah_kegiatan', 'kisah_volume', 'kisah_metode', 'kisah_sasaran',

        // KILAS
        'kilas_kegiatan', 'kilas_volume', 'kilas_metode', 'kilas_sasaran',

        // KRISAN
        'krisan_kegiatan', 'krisan_volume', 'krisan_metode', 'krisan_sasaran',

        // KIAT
        'kiat_kegiatan', 'kiat_volume', 'kiat_metode', 'kiat_sasaran',

        // KISAK
        'kisak_kegiatan', 'kisak_volume', 'kisak_metode', 'kisak_sasaran',

        // PKBN
        'pkbn_kegiatan', 'pkbn_volume', 'pkbn_metode', 'pkbn_sasaran',

        // Keterangan
        'keterangan',

        // Kolom lama — opsional — kalau masih ada di DB
        'judul_kegiatan', 'deskripsi', 'foto', 'kategori',
    ];

    protected $casts = [
        'tahun' => 'integer',
        'kader_umum' => 'integer',
        'kader_khusus' => 'integer',

        'kisah_volume' => 'integer', 'kisah_sasaran' => 'integer',
        'kilas_volume' => 'integer', 'kilas_sasaran' => 'integer',
        'krisan_volume' => 'integer', 'krisan_sasaran' => 'integer',
        'kiat_volume' => 'integer', 'kiat_sasaran' => 'integer',
        'kisak_volume' => 'integer', 'kisak_sasaran' => 'integer',
        'pkbn_volume' => 'integer', 'pkbn_sasaran' => 'integer',
    ];

    protected $appends = [
        'total_kader',
        'total_sasaran',
    ];

    // ============================================
    // ACCESSORS
    // ============================================

    /**
     * Total kader — umum + khusus
     */
    public function getTotalKaderAttribute(): int
    {
        return ($this->kader_umum ?? 0) + ($this->kader_khusus ?? 0);
    }

    /**
     * Total sasaran — dari 6 program
     */
    public function getTotalSasaranAttribute(): int
    {
        return ($this->kisah_sasaran ?? 0)
            + ($this->kilas_sasaran ?? 0)
            + ($this->krisan_sasaran ?? 0)
            + ($this->kiat_sasaran ?? 0)
            + ($this->kisak_sasaran ?? 0)
            + ($this->pkbn_sasaran ?? 0);
    }

    /**
     * Data per program — untuk chart / summary
     */
    public function getDataPerProgramAttribute(): array
    {
        return [
            'kisah' => [
                'kegiatan' => $this->kisah_kegiatan ?? '',
                'volume' => $this->kisah_volume ?? 0,
                'metode' => $this->kisah_metode ?? '',
                'sasaran' => $this->kisah_sasaran ?? 0,
            ],
            'kilas' => [
                'kegiatan' => $this->kilas_kegiatan ?? '',
                'volume' => $this->kilas_volume ?? 0,
                'metode' => $this->kilas_metode ?? '',
                'sasaran' => $this->kilas_sasaran ?? 0,
            ],
            'krisan' => [
                'kegiatan' => $this->krisan_kegiatan ?? '',
                'volume' => $this->krisan_volume ?? 0,
                'metode' => $this->krisan_metode ?? '',
                'sasaran' => $this->krisan_sasaran ?? 0,
            ],
            'kiat' => [
                'kegiatan' => $this->kiat_kegiatan ?? '',
                'volume' => $this->kiat_volume ?? 0,
                'metode' => $this->kiat_metode ?? '',
                'sasaran' => $this->kiat_sasaran ?? 0,
            ],
            'kisak' => [
                'kegiatan' => $this->kisak_kegiatan ?? '',
                'volume' => $this->kisak_volume ?? 0,
                'metode' => $this->kisak_metode ?? '',
                'sasaran' => $this->kisak_sasaran ?? 0,
            ],
            'pkbn' => [
                'kegiatan' => $this->pkbn_kegiatan ?? '',
                'volume' => $this->pkbn_volume ?? 0,
                'metode' => $this->pkbn_metode ?? '',
                'sasaran' => $this->pkbn_sasaran ?? 0,
            ],
        ];
    }

    // ============================================
    // STATIC METHODS
    // ============================================

    /**
     * Total semua kecamatan — untuk summary
     */
    public static function getTotalSemuaKecamatan(): array
    {
        $data = self::selectRaw('
            SUM(kader_umum) as total_kader_umum,
            SUM(kader_khusus) as total_kader_khusus,
            SUM(kisah_volume) as total_kisah_volume,
            SUM(kisah_sasaran) as total_kisah_sasaran,
            SUM(kilas_volume) as total_kilas_volume,
            SUM(kilas_sasaran) as total_kilas_sasaran,
            SUM(krisan_volume) as total_krisan_volume,
            SUM(krisan_sasaran) as total_krisan_sasaran,
            SUM(kiat_volume) as total_kiat_volume,
            SUM(kiat_sasaran) as total_kiat_sasaran,
            SUM(kisak_volume) as total_kisak_volume,
            SUM(kisak_sasaran) as total_kisak_sasaran,
            SUM(pkbn_volume) as total_pkbn_volume,
            SUM(pkbn_sasaran) as total_pkbn_sasaran
        ')->first();

        return [
            'kader_umum' => $data->total_kader_umum ?? 0,
            'kader_khusus' => $data->total_kader_khusus ?? 0,
            'total_kader' => ($data->total_kader_umum ?? 0) + ($data->total_kader_khusus ?? 0),
            'kisah' => [
                'volume' => $data->total_kisah_volume ?? 0,
                'sasaran' => $data->total_kisah_sasaran ?? 0,
            ],
            'kilas' => [
                'volume' => $data->total_kilas_volume ?? 0,
                'sasaran' => $data->total_kilas_sasaran ?? 0,
            ],
            'krisan' => [
                'volume' => $data->total_krisan_volume ?? 0,
                'sasaran' => $data->total_krisan_sasaran ?? 0,
            ],
            'kiat' => [
                'volume' => $data->total_kiat_volume ?? 0,
                'sasaran' => $data->total_kiat_sasaran ?? 0,
            ],
            'kisak' => [
                'volume' => $data->total_kisak_volume ?? 0,
                'sasaran' => $data->total_kisak_sasaran ?? 0,
            ],
            'pkbn' => [
                'volume' => $data->total_pkbn_volume ?? 0,
                'sasaran' => $data->total_pkbn_sasaran ?? 0,
            ],
        ];
    }

    /**
     * Get data by kecamatan
     */
    public static function getByKecamatan($kecamatan): ?self
    {
        return self::where('kecamatan', $kecamatan)
            ->orWhere('nama_kecamatan', $kecamatan)
            ->orWhere('nama_wilayah', $kecamatan)
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
            ->orWhere('nama_kecamatan', $kecamatan)
            ->orWhere('nama_wilayah', $kecamatan);
    }

    /**
     * Scope: Search
     */
    public function scopeSearch($query, $keyword)
    {
        return $query->where('kecamatan', 'like', "%{$keyword}%")
            ->orWhere('nama_kecamatan', 'like', "%{$keyword}%")
            ->orWhere('nama_wilayah', 'like', "%{$keyword}%");
    }

    /**
     * Scope: Order by kecamatan
     */
    public function scopeOrderByKecamatan($query, $direction = 'asc')
    {
        return $query->orderBy('kecamatan', $direction);
    }

    /**
     * Scope: Has data
     */
    public function scopeHasData($query)
    {
        return $query->where(function ($q) {
            $q->where('kisah_sasaran', '>', 0)
                ->orWhere('kilas_sasaran', '>', 0)
                ->orWhere('krisan_sasaran', '>', 0)
                ->orWhere('kiat_sasaran', '>', 0)
                ->orWhere('kisak_sasaran', '>', 0)
                ->orWhere('pkbn_sasaran', '>', 0);
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
}
