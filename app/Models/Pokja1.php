<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pokja1 extends Model
{
    use HasFactory;

    protected $table = 'pokja_ones';

    protected $fillable = [
        'judul_kegiatan',
        'deskripsi',
        'foto',
        'kategori',
        'kecamatan',
        'nama_kecamatan',
        'pkbn_l',
        'pkbn_p',
        'pkdrt_l',
        'pkdrt_p',
        'pola_asuh_l',
        'pola_asuh_p',
        'lansia_l',
        'lansia_p',
        'kader_pokja1_l',
        'kader_pokja1_p',
    ];

    protected $casts = [
        'pkbn_l' => 'integer',
        'pkbn_p' => 'integer',
        'pkdrt_l' => 'integer',
        'pkdrt_p' => 'integer',
        'pola_asuh_l' => 'integer',
        'pola_asuh_p' => 'integer',
        'lansia_l' => 'integer',
        'lansia_p' => 'integer',
        'kader_pokja1_l' => 'integer',
        'kader_pokja1_p' => 'integer',
    ];

    protected $appends = [
        'total_pkbn',
        'total_pkdrt',
        'total_pola_asuh',
        'total_lansia',
        'total_kader',
        'total_keseluruhan',
    ];

    /**
     * Get total PKBN (L + P)
     */
    public function getTotalPkbnAttribute(): int
    {
        return ($this->pkbn_l ?? 0) + ($this->pkbn_p ?? 0);
    }

    /**
     * Get total PKDRT (L + P)
     */
    public function getTotalPkdrtAttribute(): int
    {
        return ($this->pkdrt_l ?? 0) + ($this->pkdrt_p ?? 0);
    }

    /**
     * Get total Pola Asuh (L + P)
     */
    public function getTotalPolaAsuhAttribute(): int
    {
        return ($this->pola_asuh_l ?? 0) + ($this->pola_asuh_p ?? 0);
    }

    /**
     * Get total Lansia (L + P)
     */
    public function getTotalLansiaAttribute(): int
    {
        return ($this->lansia_l ?? 0) + ($this->lansia_p ?? 0);
    }

    /**
     * Get total Kader (L + P)
     */
    public function getTotalKaderAttribute(): int
    {
        return ($this->kader_pokja1_l ?? 0) + ($this->kader_pokja1_p ?? 0);
    }

    /**
     * Get total keseluruhan semua kategori (L + P)
     */
    public function getTotalKeseluruhanAttribute(): int
    {
        return $this->total_pkbn + $this->total_pkdrt + $this->total_pola_asuh + $this->total_lansia + $this->total_kader;
    }

    /**
     * Get rasio gender (L vs P) dalam persen untuk semua kategori
     */
    public function getRasioGenderAttribute(): array
    {
        $totalL = ($this->pkbn_l ?? 0) + ($this->pkdrt_l ?? 0) + ($this->pola_asuh_l ?? 0) + ($this->lansia_l ?? 0) + ($this->kader_pokja1_l ?? 0);
        $totalP = ($this->pkbn_p ?? 0) + ($this->pkdrt_p ?? 0) + ($this->pola_asuh_p ?? 0) + ($this->lansia_p ?? 0) + ($this->kader_pokja1_p ?? 0);
        $total = $totalL + $totalP;

        if ($total === 0) {
            return ['l' => 0, 'p' => 0];
        }

        return [
            'l' => round(($totalL / $total) * 100, 1),
            'p' => round(($totalP / $total) * 100, 1),
        ];
    }

    /**
     * Get data per kategori dengan gender
     */
    public function getDataPerKategoriAttribute(): array
    {
        return [
            'pkbn' => [
                'l' => $this->pkbn_l ?? 0,
                'p' => $this->pkbn_p ?? 0,
                'total' => $this->total_pkbn,
            ],
            'pkdrt' => [
                'l' => $this->pkdrt_l ?? 0,
                'p' => $this->pkdrt_p ?? 0,
                'total' => $this->total_pkdrt,
            ],
            'pola_asuh' => [
                'l' => $this->pola_asuh_l ?? 0,
                'p' => $this->pola_asuh_p ?? 0,
                'total' => $this->total_pola_asuh,
            ],
            'lansia' => [
                'l' => $this->lansia_l ?? 0,
                'p' => $this->lansia_p ?? 0,
                'total' => $this->total_lansia,
            ],
            'kader' => [
                'l' => $this->kader_pokja1_l ?? 0,
                'p' => $this->kader_pokja1_p ?? 0,
                'total' => $this->total_kader,
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
            SUM(pkbn_l) as total_pkbn_l,
            SUM(pkbn_p) as total_pkbn_p,
            SUM(pkdrt_l) as total_pkdrt_l,
            SUM(pkdrt_p) as total_pkdrt_p,
            SUM(pola_asuh_l) as total_pola_asuh_l,
            SUM(pola_asuh_p) as total_pola_asuh_p,
            SUM(lansia_l) as total_lansia_l,
            SUM(lansia_p) as total_lansia_p,
            SUM(kader_pokja1_l) as total_kader_l,
            SUM(kader_pokja1_p) as total_kader_p
        ')->first();

        return [
            'pkbn' => [
                'l' => $data->total_pkbn_l ?? 0,
                'p' => $data->total_pkbn_p ?? 0,
                'total' => ($data->total_pkbn_l ?? 0) + ($data->total_pkbn_p ?? 0),
            ],
            'pkdrt' => [
                'l' => $data->total_pkdrt_l ?? 0,
                'p' => $data->total_pkdrt_p ?? 0,
                'total' => ($data->total_pkdrt_l ?? 0) + ($data->total_pkdrt_p ?? 0),
            ],
            'pola_asuh' => [
                'l' => $data->total_pola_asuh_l ?? 0,
                'p' => $data->total_pola_asuh_p ?? 0,
                'total' => ($data->total_pola_asuh_l ?? 0) + ($data->total_pola_asuh_p ?? 0),
            ],
            'lansia' => [
                'l' => $data->total_lansia_l ?? 0,
                'p' => $data->total_lansia_p ?? 0,
                'total' => ($data->total_lansia_l ?? 0) + ($data->total_lansia_p ?? 0),
            ],
            'kader' => [
                'l' => $data->total_kader_l ?? 0,
                'p' => $data->total_kader_p ?? 0,
                'total' => ($data->total_kader_l ?? 0) + ($data->total_kader_p ?? 0),
            ],
            'grand_total' => [
                'l' => ($data->total_pkbn_l ?? 0) + ($data->total_pkdrt_l ?? 0) + ($data->total_pola_asuh_l ?? 0) + ($data->total_lansia_l ?? 0) + ($data->total_kader_l ?? 0),
                'p' => ($data->total_pkbn_p ?? 0) + ($data->total_pkdrt_p ?? 0) + ($data->total_pola_asuh_p ?? 0) + ($data->total_lansia_p ?? 0) + ($data->total_kader_p ?? 0),
                'total' => 0, // akan dihitung di bawah
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
            $q->where('pkbn_l', '>', 0)
                ->orWhere('pkbn_p', '>', 0)
                ->orWhere('pkdrt_l', '>', 0)
                ->orWhere('pkdrt_p', '>', 0)
                ->orWhere('pola_asuh_l', '>', 0)
                ->orWhere('pola_asuh_p', '>', 0)
                ->orWhere('lansia_l', '>', 0)
                ->orWhere('lansia_p', '>', 0)
                ->orWhere('kader_pokja1_l', '>', 0)
                ->orWhere('kader_pokja1_p', '>', 0);
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
