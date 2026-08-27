<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DataUmumSekretariat extends Model
{
    use HasFactory;

    protected $table = 'data_umum_sekretariats';

    protected $fillable = [
        'kategori',
        'kecamatan',
        'nama_kecamatan',
        'jumlah_pkk_rw',
        'jumlah_pkk_rt',
        'jumlah_dasa_wisma',
        'jumlah_krt',
        'jumlah_kk',
        'jiwa_l',
        'jiwa_p',
        'tp_pkk_l',
        'tp_pkk_p',
        'kader_umum_l',
        'kader_umum_p',
        'kader_khusus_l',
        'kader_khusus_p',
    ];

    protected $casts = [
        'jumlah_pkk_rw' => 'integer',
        'jumlah_pkk_rt' => 'integer',
        'jumlah_dasa_wisma' => 'integer',
        'jumlah_krt' => 'integer',
        'jumlah_kk' => 'integer',
        'jiwa_l' => 'integer',
        'jiwa_p' => 'integer',
        'tp_pkk_l' => 'integer',
        'tp_pkk_p' => 'integer',
        'kader_umum_l' => 'integer',
        'kader_umum_p' => 'integer',
        'kader_khusus_l' => 'integer',
        'kader_khusus_p' => 'integer',
    ];

    protected $appends = [
        'total_jiwa',
        'total_tp_pkk',
        'total_kader_umum',
        'total_kader_khusus',
        'total_kader',
    ];

    /**
     * Get total jiwa (L + P)
     */
    public function getTotalJiwaAttribute(): int
    {
        return ($this->jiwa_l ?? 0) + ($this->jiwa_p ?? 0);
    }

    /**
     * Get total TP PKK (L + P)
     */
    public function getTotalTpPkkAttribute(): int
    {
        return ($this->tp_pkk_l ?? 0) + ($this->tp_pkk_p ?? 0);
    }

    /**
     * Get total kader umum (L + P)
     */
    public function getTotalKaderUmumAttribute(): int
    {
        return ($this->kader_umum_l ?? 0) + ($this->kader_umum_p ?? 0);
    }

    /**
     * Get total kader khusus (L + P)
     */
    public function getTotalKaderKhususAttribute(): int
    {
        return ($this->kader_khusus_l ?? 0) + ($this->kader_khusus_p ?? 0);
    }

    /**
     * Get total semua kader (umum + khusus)
     */
    public function getTotalKaderAttribute(): int
    {
        return $this->total_kader_umum + $this->total_kader_khusus;
    }

    /**
     * Get rasio jiwa (L vs P) dalam persen
     */
    public function getRasioJiwaAttribute(): array
    {
        $total = $this->total_jiwa;
        if ($total === 0) {
            return ['l' => 0, 'p' => 0];
        }
        return [
            'l' => round(($this->jiwa_l / $total) * 100, 1),
            'p' => round(($this->jiwa_p / $total) * 100, 1),
        ];
    }

    /**
     * Get rasio kader (L vs P) dalam persen
     */
    public function getRasioKaderAttribute(): array
    {
        $total = $this->total_kader;
        if ($total === 0) {
            return ['l' => 0, 'p' => 0];
        }
        $totalL = ($this->kader_umum_l ?? 0) + ($this->kader_khusus_l ?? 0);
        $totalP = ($this->kader_umum_p ?? 0) + ($this->kader_khusus_p ?? 0);
        return [
            'l' => round(($totalL / $total) * 100, 1),
            'p' => round(($totalP / $total) * 100, 1),
        ];
    }

    /**
     * Get total kader per kecamatan
     */
    public static function getTotalByKecamatan($kecamatan): ?self
    {
        return self::where('kecamatan', $kecamatan)
            ->orWhere('nama_kecamatan', $kecamatan)
            ->first();
    }

    /**
     * Get all statistik per kecamatan
     */
    public static function getStatistikPerKecamatan()
    {
        return self::select(
            'kecamatan',
            'nama_kecamatan',
            'jumlah_kk',
            'jumlah_dasa_wisma',
            'jiwa_l',
            'jiwa_p',
            'kader_umum_l',
            'kader_umum_p',
            'kader_khusus_l',
            'kader_khusus_p',
            'tp_pkk_l',
            'tp_pkk_p'
        )->get();
    }

    /**
     * Get total seluruh kecamatan
     */
    public static function getTotalSemuaKecamatan(): array
    {
        $data = self::selectRaw('
            SUM(jumlah_kk) as total_kk,
            SUM(jumlah_dasa_wisma) as total_dasa_wisma,
            SUM(jiwa_l) as total_jiwa_l,
            SUM(jiwa_p) as total_jiwa_p,
            SUM(kader_umum_l) as total_kader_umum_l,
            SUM(kader_umum_p) as total_kader_umum_p,
            SUM(kader_khusus_l) as total_kader_khusus_l,
            SUM(kader_khusus_p) as total_kader_khusus_p,
            SUM(tp_pkk_l) as total_tp_pkk_l,
            SUM(tp_pkk_p) as total_tp_pkk_p
        ')->first();

        return [
            'total_kk' => $data->total_kk ?? 0,
            'total_dasa_wisma' => $data->total_dasa_wisma ?? 0,
            'total_jiwa' => ($data->total_jiwa_l ?? 0) + ($data->total_jiwa_p ?? 0),
            'total_kader' => ($data->total_kader_umum_l ?? 0) + ($data->total_kader_umum_p ?? 0) + ($data->total_kader_khusus_l ?? 0) + ($data->total_kader_khusus_p ?? 0),
        ];
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
            ->orWhere('nama_kecamatan', 'like', "%{$keyword}%");
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
            $q->where('jumlah_kk', '>', 0)
                ->orWhere('jumlah_dasa_wisma', '>', 0)
                ->orWhere('jiwa_l', '>', 0)
                ->orWhere('jiwa_p', '>', 0);
        });
    }

    // ============================================
    // RELATIONS
    // ============================================

    /**
     * Get semua data pokja yang terkait dengan kecamatan ini
     */
    public function pokja1()
    {
        return $this->hasOne(Pokja1::class, 'kecamatan', 'kecamatan');
    }

    public function pokja2()
    {
        return $this->hasOne(Pokja2::class, 'kecamatan', 'kecamatan');
    }

    public function pokja3()
    {
        return $this->hasOne(Pokja3::class, 'kecamatan', 'kecamatan');
    }

    public function pokja4()
    {
        return $this->hasOne(Pokja4::class, 'kecamatan', 'kecamatan');
    }
}
