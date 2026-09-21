<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pokja4 extends Model
{
    use HasFactory;

    protected $table = 'pokja_fours';

    protected $fillable = [
        // Lama
        'kategori',
        'kecamatan',
        'nama_kecamatan',
        'tahun',
        'judul_kegiatan',
        'deskripsi',
        'foto',
        'posyandu',
        'akseptor_kb',
        'phbs',
        'jamban_keluarga',

        // ✅ Baru — dari Excel (23 kolom)
        'kader_kesehatan',
        'kader_gizi',
        'kader_kesling',
        'kader_phbs',
        'kader_kb',
        'imunisasi',
        'pkg',
        'tbc',
        'spal',
        'tps',
        'mck',
        'air_pdam',
        'air_sumur',
        'air_lainnya',
        'jumlah_pus',
        'jumlah_wus',
        'akseptor_kb_l',
        'akseptor_kb_p',
        'tabungan_keluarga',
        'asuransi_kesehatan',
        'program_kesehatan',
        'program_lingkungan',
        'program_perencanaan',
    ];

    protected $casts = [
        // Lama
        'tahun'=> 'integer',
        'posyandu' => 'integer',
        'akseptor_kb' => 'integer',
        'phbs' => 'integer',
        'jamban_keluarga' => 'integer',

        // ✅ Baru
        'kader_kesehatan' => 'integer',
        'kader_gizi' => 'integer',
        'kader_kesling' => 'integer',
        'kader_phbs' => 'integer',
        'kader_kb' => 'integer',
        'imunisasi' => 'integer',
        'pkg' => 'integer',
        'tbc' => 'integer',
        'spal' => 'integer',
        'tps' => 'integer',
        'mck' => 'integer',
        'air_pdam' => 'integer',
        'air_sumur' => 'integer',
        'air_lainnya' => 'integer',
        'jumlah_pus' => 'integer',
        'jumlah_wus' => 'integer',
        'akseptor_kb_l' => 'integer',
        'akseptor_kb_p' => 'integer',
        'tabungan_keluarga' => 'integer',
        'asuransi_kesehatan' => 'integer',
    ];

    protected $appends = [
        // Lama
        'total_posyandu',
        'total_akseptor_kb',
        'total_phbs',
        'total_jamban_keluarga',
        'total_keseluruhan',
        'rata_rata_per_kecamatan',
        'data_per_kategori',
        // ✅ Baru
        'total_kader',
        'total_lingkungan',
        'total_perencanaan',
    ];

    // ============================================
    // ACCESSORS — Lama
    // ============================================

    public function getTotalPosyanduAttribute(): int
    {
        return $this->posyandu ?? 0;
    }

    public function getTotalAkseptorKbAttribute(): int
    {
        return $this->akseptor_kb ?? 0;
    }

    public function getTotalPhbsAttribute(): int
    {
        return $this->phbs ?? 0;
    }

    public function getTotalJambanKeluargaAttribute(): int
    {
        return $this->jamban_keluarga ?? 0;
    }

    public function getTotalKeseluruhanAttribute(): int
    {
        return $this->total_posyandu +
               $this->total_akseptor_kb +
               $this->total_phbs +
               $this->total_jamban_keluarga;
    }

    // ============================================
    // ACCESSORS — Baru
    // ============================================

    public function getTotalKaderAttribute(): int
    {
        return ($this->kader_kesehatan ?? 0) +
               ($this->kader_gizi ?? 0) +
               ($this->kader_kesling ?? 0) +
               ($this->kader_phbs ?? 0) +
               ($this->kader_kb ?? 0);
    }

    public function getTotalLingkunganAttribute(): int
    {
        return ($this->jamban_keluarga ?? 0) +
               ($this->spal ?? 0) +
               ($this->tps ?? 0) +
               ($this->mck ?? 0) +
               ($this->air_pdam ?? 0) +
               ($this->air_sumur ?? 0) +
               ($this->air_lainnya ?? 0);
    }

    public function getTotalPerencanaanAttribute(): int
    {
        return ($this->jumlah_pus ?? 0) +
               ($this->jumlah_wus ?? 0) +
               ($this->akseptor_kb_l ?? 0) +
               ($this->akseptor_kb_p ?? 0) +
               ($this->tabungan_keluarga ?? 0) +
               ($this->asuransi_kesehatan ?? 0);
    }

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

    public function getDataPerKategoriAttribute(): array
    {
        return [
            'posyandu' => ['total' => $this->posyandu ?? 0],
            'akseptor_kb' => ['total' => $this->akseptor_kb ?? 0],
            'phbs' => ['total' => $this->phbs ?? 0],
            'jamban_keluarga' => ['total' => $this->jamban_keluarga ?? 0],
        ];
    }

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

    public static function getByKecamatan($kecamatan): ?self
    {
        return self::where('kecamatan', $kecamatan)
            ->orWhere('nama_kecamatan', $kecamatan)
            ->first();
    }

    public static function getTopKecamatan($limit = 5, $field = 'posyandu')
    {
        return self::orderBy($field, 'desc')
            ->limit($limit)
            ->get(['kecamatan', 'nama_kecamatan', $field]);
    }

    // ============================================
    // SCOPES
    // ============================================

    public function scopeByKecamatan($query, $kecamatan)
    {
        return $query->where('kecamatan', $kecamatan)
            ->orWhere('nama_kecamatan', $kecamatan);
    }

    public function scopeSearch($query, $keyword)
    {
        return $query->where('kecamatan', 'like', "%{$keyword}%")
            ->orWhere('nama_kecamatan', 'like', "%{$keyword}%")
            ->orWhere('judul_kegiatan', 'like', "%{$keyword}%");
    }

    public function scopeOrderByKecamatan($query, $direction = 'asc')
    {
        return $query->orderBy('kecamatan', $direction);
    }

    public function scopeHasData($query)
    {
        return $query->where(function ($q) {
            $q->where('posyandu', '>', 0)
                ->orWhere('akseptor_kb', '>', 0)
                ->orWhere('phbs', '>', 0)
                ->orWhere('jamban_keluarga', '>', 0);
        });
    }

    public function scopeMinPosyandu($query, $min)
    {
        return $query->where('posyandu', '>=', $min);
    }

    public function scopeMinPhbs($query, $min)
    {
        return $query->where('phbs', '>=', $min);
    }

    // ============================================
    // RELATIONS
    // ============================================

    public function sekretariat()
    {
        return $this->hasOne(DataUmumSekretariat::class, 'kecamatan', 'kecamatan');
    }

    public function incrementStatistik(array $data): void
    {
        foreach ($data as $field => $value) {
            if (in_array($field, $this->fillable) && is_numeric($value)) {
                $this->increment($field, $value);
            }
        }
    }
}
