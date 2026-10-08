<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pokja3 extends Model
{
    use HasFactory;

    protected $table = 'pokja_threes';

    protected $fillable = [
        // Lama
        'kategori',
        'kecamatan',
        'nama_kecamatan',
        'judul_kegiatan',
        'deskripsi',
        'foto',
        'rumah_sehat',
        'rumah_tidak_sehat',
        'pemanfaatan_pekarangan',
        'industri_rumah_tangga',

        // ✅ Baru — dari Excel (5 kolom — sesuai migration)
        'jumlah_kader',
        'jumlah_kader_p',
        'makanan_pokok',
        'hatinya_pkk',
        'jumlah_rumah',

        // ✅ Rincian format resmi 20 kolom (web + Android)
        'kader_tata_laksana',
        'makanan_non_beras',
        'peternakan',
        'perikanan',
        'warung_hidup',
        'lumbung_hidup',
        'toga',
        'tanaman_keras',
        'tanaman_lainnya',
        'industri_pangan',
        'industri_sandang',
        'industri_jasa',
    ];

    protected $casts = [
        // Lama
        'rumah_sehat' => 'integer',
        'rumah_tidak_sehat' => 'integer',
        'pemanfaatan_pekarangan' => 'integer',
        'industri_rumah_tangga' => 'integer',

        // ✅ Baru
        'jumlah_kader' => 'integer',
        'jumlah_kader_p' => 'integer',
        'makanan_pokok' => 'integer',
        'hatinya_pkk' => 'integer',
        'jumlah_rumah' => 'integer',

        // ✅ Rincian format resmi 20 kolom (web + Android)
        'kader_tata_laksana' => 'integer',
        'makanan_non_beras' => 'integer',
        'peternakan' => 'integer',
        'perikanan' => 'integer',
        'warung_hidup' => 'integer',
        'lumbung_hidup' => 'integer',
        'toga' => 'integer',
        'tanaman_keras' => 'integer',
        'tanaman_lainnya' => 'integer',
        'industri_pangan' => 'integer',
        'industri_sandang' => 'integer',
        'industri_jasa' => 'integer',
    ];

    protected $appends = [
        'total_rumah',
        'total_pemanfaatan_pekarangan',
        'total_industri_rumah_tangga',
        'total_keseluruhan',
        'persentase_rumah_sehat',
    ];

    public function getTotalRumahAttribute(): int
    {
        return ($this->rumah_sehat ?? 0) + ($this->rumah_tidak_sehat ?? 0);
    }

    public function getTotalPemanfaatanPekaranganAttribute(): int
    {
        return $this->pemanfaatan_pekarangan ?? 0;
    }

    public function getTotalIndustriRumahTanggaAttribute(): int
    {
        return $this->industri_rumah_tangga ?? 0;
    }

    public function getTotalKeseluruhanAttribute(): int
    {
        return $this->total_rumah +
               $this->total_pemanfaatan_pekarangan +
               $this->total_industri_rumah_tangga;
    }

    public function getPersentaseRumahSehatAttribute(): float
    {
        $total = $this->total_rumah;
        if ($total === 0) {
            return 0;
        }
        return round(($this->rumah_sehat / $total) * 100, 1);
    }

    public function getDataPerKategoriAttribute(): array
    {
        return [
            'rumah' => [
                'sehat' => $this->rumah_sehat ?? 0,
                'tidak_sehat' => $this->rumah_tidak_sehat ?? 0,
                'total' => $this->total_rumah,
                'persentase_sehat' => $this->persentase_rumah_sehat,
            ],
            'pemanfaatan_pekarangan' => [
                'total' => $this->pemanfaatan_pekarangan ?? 0,
            ],
            'industri_rumah_tangga' => [
                'total' => $this->industri_rumah_tangga ?? 0,
            ],
        ];
    }

    public static function getTotalSemuaKecamatan(): array
    {
        $data = self::selectRaw('
            SUM(rumah_sehat) as total_rumah_sehat,
            SUM(rumah_tidak_sehat) as total_rumah_tidak_sehat,
            SUM(pemanfaatan_pekarangan) as total_pemanfaatan_pekarangan,
            SUM(industri_rumah_tangga) as total_industri_rumah_tangga
        ')->first();

        $totalRumah = ($data->total_rumah_sehat ?? 0) + ($data->total_rumah_tidak_sehat ?? 0);

        return [
            'rumah' => [
                'sehat' => $data->total_rumah_sehat ?? 0,
                'tidak_sehat' => $data->total_rumah_tidak_sehat ?? 0,
                'total' => $totalRumah,
                'persentase_sehat' => $totalRumah > 0 ? round(($data->total_rumah_sehat / $totalRumah) * 100, 1) : 0,
            ],
            'pemanfaatan_pekarangan' => $data->total_pemanfaatan_pekarangan ?? 0,
            'industri_rumah_tangga' => $data->total_industri_rumah_tangga ?? 0,
        ];
    }

    public static function getByKecamatan($kecamatan): ?self
    {
        return self::where('kecamatan', $kecamatan)
            ->orWhere('nama_kecamatan', $kecamatan)
            ->first();
    }

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
            $q->where('rumah_sehat', '>', 0)
                ->orWhere('rumah_tidak_sehat', '>', 0)
                ->orWhere('pemanfaatan_pekarangan', '>', 0)
                ->orWhere('industri_rumah_tangga', '>', 0);
        });
    }

    public function scopeRumahSehatMinimum($query, $percentage)
    {
        return $query->whereRaw('(rumah_sehat / (rumah_sehat + rumah_tidak_sehat) * 100) >= ?', [$percentage]);
    }

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
