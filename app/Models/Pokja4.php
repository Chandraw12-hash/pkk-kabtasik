<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pokja4 extends Model
{
    use HasFactory;

    protected $table = 'pokja_fours';

    protected $fillable = [
        'kategori',
        'kecamatan',
        'nama_kecamatan',
        'judul_kegiatan',
        'deskripsi',
        'foto',
        'posyandu',
        'akseptor_kb',
        'phbs',
        'jamban_keluarga',
    ];

    protected $casts = [
        'posyandu' => 'integer',
        'akseptor_kb' => 'integer',
        'phbs' => 'integer',
        'jamban_keluarga' => 'integer',
    ];

    protected $appends = [
        'total_posyandu',
        'total_akseptor_kb',
        'total_phbs',
        'total_jamban_keluarga',
        'total_keseluruhan',
        'rata_rata_per_kecamatan',
        'data_per_kategori',
    ];

    /**
     * Get total Posyandu
     */
    public function getTotalPosyanduAttribute(): int
    {
        return $this->posyandu ?? 0;
    }

    /**
     * Get total Akseptor KB
     */
    public function getTotalAkseptorKbAttribute(): int
    {
        return $this->akseptor_kb ?? 0;
    }

    /**
     * Get total PHBS
     */
    public function getTotalPhbsAttribute(): int
    {
        return $this->phbs ?? 0;
    }

    /**
     * Get total Jamban Keluarga
     */
    public function getTotalJambanKeluargaAttribute(): int
    {
        return $this->jamban_keluarga ?? 0;
    }

    /**
     * Get total keseluruhan semua kategori
     */
    public function getTotalKeseluruhanAttribute(): int
    {
        return $this->total_posyandu +
               $this->total_akseptor_kb +
               $this->total_phbs +
               $this->total_jamban_keluarga;
    }

    /**
     * Get rata-rata per kecamatan (per kategori)
     */
    public function getRataRataPerKecamatanAttribute(): array
    {
        $totalKecamatan = self::count();
        if ($totalKecamatan === 0) {
            return [
                'posyandu' => 0,
                'akseptor_kb' => 0,
                'phbs' => 0,
                'jamban_keluarga' => 0,
            ];
        }

        $total = self::selectRaw('
            SUM(posyandu) as total_posyandu,
            SUM(akseptor_kb) as total_akseptor_kb,
            SUM(phbs) as total_phbs,
            SUM(jamban_keluarga) as total_jamban_keluarga
        ')->first();

        return [
            'posyandu' => round(($total->total_posyandu ?? 0) / $totalKecamatan, 1),
            'akseptor_kb' => round(($total->total_akseptor_kb ?? 0) / $totalKecamatan, 1),
            'phbs' => round(($total->total_phbs ?? 0) / $totalKecamatan, 1),
            'jamban_keluarga' => round(($total->total_jamban_keluarga ?? 0) / $totalKecamatan, 1),
        ];
    }

    /**
     * Get data per kategori
     */
    public function getDataPerKategoriAttribute(): array
    {
        return [
            'posyandu' => [
                'total' => $this->posyandu ?? 0,
            ],
            'akseptor_kb' => [
                'total' => $this->akseptor_kb ?? 0,
            ],
            'phbs' => [
                'total' => $this->phbs ?? 0,
            ],
            'jamban_keluarga' => [
                'total' => $this->jamban_keluarga ?? 0,
            ],
        ];
    }

    /**
     * Get persentase kontribusi per kategori terhadap total
     */
    public function getPersentaseKontribusiAttribute(): array
    {
        $total = $this->total_keseluruhan;
        if ($total === 0) {
            return [
                'posyandu' => 0,
                'akseptor_kb' => 0,
                'phbs' => 0,
                'jamban_keluarga' => 0,
            ];
        }

        return [
            'posyandu' => round(($this->posyandu / $total) * 100, 1),
            'akseptor_kb' => round(($this->akseptor_kb / $total) * 100, 1),
            'phbs' => round(($this->phbs / $total) * 100, 1),
            'jamban_keluarga' => round(($this->jamban_keluarga / $total) * 100, 1),
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
            SUM(posyandu) as total_posyandu,
            SUM(akseptor_kb) as total_akseptor_kb,
            SUM(phbs) as total_phbs,
            SUM(jamban_keluarga) as total_jamban_keluarga
        ')->first();

        $total = ($data->total_posyandu ?? 0) +
                 ($data->total_akseptor_kb ?? 0) +
                 ($data->total_phbs ?? 0) +
                 ($data->total_jamban_keluarga ?? 0);

        return [
            'posyandu' => $data->total_posyandu ?? 0,
            'akseptor_kb' => $data->total_akseptor_kb ?? 0,
            'phbs' => $data->total_phbs ?? 0,
            'jamban_keluarga' => $data->total_jamban_keluarga ?? 0,
            'total' => $total,
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

    /**
     * Get top kecamatan by posyandu
     */
    public static function getTopKecamatan($limit = 5, $field = 'posyandu')
    {
        return self::orderBy($field, 'desc')
            ->limit($limit)
            ->get(['kecamatan', 'nama_kecamatan', $field]);
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
            $q->where('posyandu', '>', 0)
                ->orWhere('akseptor_kb', '>', 0)
                ->orWhere('phbs', '>', 0)
                ->orWhere('jamban_keluarga', '>', 0);
        });
    }

    /**
     * Scope: Filter by minimum posyandu
     */
    public function scopeMinPosyandu($query, $min)
    {
        return $query->where('posyandu', '>=', $min);
    }

    /**
     * Scope: Filter by minimum PHBS
     */
    public function scopeMinPhbs($query, $min)
    {
        return $query->where('phbs', '>=', $min);
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
