<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pokja2 extends Model
{
    use HasFactory;

    protected $table = 'pokja_twos';

    protected $fillable = [
        // Lama
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

        // ✅ Baru — dari PDF (28 kolom)
        'warga_belajar_paket_a',
        'warga_belajar_paket_b',
        'warga_belajar_paket_c',
        'warga_belajar_kf',
        'taman_bacaan',
        'kelompok_bkb',
        'peserta_bkb',
        'ape_bkb',
        'kelompok_simulasi_bkb',
        'tutor_kf',
        'tutor_paud',
        'kader_bkb',
        'kelompok_kader_koperasi',
        'kader_keterampilan',
        'kader_dilatih_pengelolaan',
        'kader_dilatih_tp_pkk',
        'kader_dilatih_damas',
        'up2k_pemula_kelompok',
        'up2k_pemula_peserta',
        'up2k_madya_kelompok',
        'up2k_madya_peserta',
        'up2k_utama_kelompok',
        'up2k_utama_peserta',
        'up2k_mandiri_kelompok',
        'up2k_mandiri_peserta',
        'anggota_koperasi',

        // ✅ BARU — 5 kolom dari Excel Pokja II
        'ibu_set_bkb',
        'lp3_pkk',
        'tp3_pkk',
        'damas_pkk',
        'keterangan',
    ];

    protected $casts = [
        // Lama
        'warga_buta_l' => 'integer',
        'warga_buta_p' => 'integer',
        'kelompok_belajar_paket_a' => 'integer',
        'kelompok_belajar_paket_b' => 'integer',
        'kelompok_belajar_paket_c' => 'integer',
        'kf' => 'integer',
        'paud' => 'integer',
        'koperasi_berbadan_hukum' => 'integer',

        // ✅ Baru
        'warga_belajar_paket_a' => 'integer',
        'warga_belajar_paket_b' => 'integer',
        'warga_belajar_paket_c' => 'integer',
        'warga_belajar_kf' => 'integer',
        'taman_bacaan' => 'integer',
        'kelompok_bkb' => 'integer',
        'peserta_bkb' => 'integer',
        'ape_bkb' => 'integer',
        'kelompok_simulasi_bkb' => 'integer',
        'tutor_kf' => 'integer',
        'tutor_paud' => 'integer',
        'kader_bkb' => 'integer',
        'kelompok_kader_koperasi' => 'integer',
        'kader_keterampilan' => 'integer',
        'kader_dilatih_pengelolaan' => 'integer',
        'kader_dilatih_tp_pkk' => 'integer',
        'kader_dilatih_damas' => 'integer',
        'up2k_pemula_kelompok' => 'integer',
        'up2k_pemula_peserta' => 'integer',
        'up2k_madya_kelompok' => 'integer',
        'up2k_madya_peserta' => 'integer',
        'up2k_utama_kelompok' => 'integer',
        'up2k_utama_peserta' => 'integer',
        'up2k_mandiri_kelompok' => 'integer',
        'up2k_mandiri_peserta' => 'integer',
        'anggota_koperasi' => 'integer',

        // ✅ BARU — 5 kolom
        'ibu_set_bkb' => 'integer',
        'lp3_pkk' => 'integer',
        'tp3_pkk' => 'integer',
        'damas_pkk' => 'integer',
    ];

    protected $appends = [
        'total_warga_buta',
        'total_kelompok_belajar',
        'total_warga_belajar',
        'total_bkb',
        'total_kader',
        'total_up2k',
        'total_paud',
        'total_koperasi',
        'total_keseluruhan',
    ];

    // ============================================
    // ACCESSORS — Lama
    // ============================================

    public function getTotalWargaButaAttribute(): int
    {
        return ($this->warga_buta_l ?? 0) + ($this->warga_buta_p ?? 0);
    }

    public function getTotalKelompokBelajarAttribute(): int
    {
        return ($this->kelompok_belajar_paket_a ?? 0) +
               ($this->kelompok_belajar_paket_b ?? 0) +
               ($this->kelompok_belajar_paket_c ?? 0);
    }

    public function getTotalPaudAttribute(): int
    {
        return $this->paud ?? 0;
    }

    public function getTotalKoperasiAttribute(): int
    {
        return $this->koperasi_berbadan_hukum ?? 0;
    }

    public function getTotalKeseluruhanAttribute(): int
    {
        return $this->total_warga_buta +
               $this->total_kelompok_belajar +
               $this->total_paud +
               $this->total_koperasi;
    }

    // ============================================
    // ACCESSORS — Baru (dari PDF)
    // ============================================

    public function getTotalWargaBelajarAttribute(): int
    {
        return ($this->warga_belajar_paket_a ?? 0) +
               ($this->warga_belajar_paket_b ?? 0) +
               ($this->warga_belajar_paket_c ?? 0) +
               ($this->warga_belajar_kf ?? 0);
    }

    public function getTotalBkbAttribute(): int
    {
        return ($this->kelompok_bkb ?? 0) +
               ($this->peserta_bkb ?? 0) +
               ($this->ibu_set_bkb ?? 0) +
               ($this->ape_bkb ?? 0) +
               ($this->kelompok_simulasi_bkb ?? 0);
    }

    public function getTotalKaderAttribute(): int
    {
        return ($this->tutor_kf ?? 0) +
               ($this->tutor_paud ?? 0) +
               ($this->kader_bkb ?? 0) +
               ($this->kelompok_kader_koperasi ?? 0) +
               ($this->kader_keterampilan ?? 0) +
               ($this->kader_dilatih_pengelolaan ?? 0) +
               ($this->kader_dilatih_tp_pkk ?? 0) +
               ($this->kader_dilatih_damas ?? 0) +
               ($this->lp3_pkk ?? 0) +
               ($this->tp3_pkk ?? 0) +
               ($this->damas_pkk ?? 0);
    }

    public function getTotalUp2kAttribute(): int
    {
        return ($this->up2k_pemula_kelompok ?? 0) +
               ($this->up2k_pemula_peserta ?? 0) +
               ($this->up2k_madya_kelompok ?? 0) +
               ($this->up2k_madya_peserta ?? 0) +
               ($this->up2k_utama_kelompok ?? 0) +
               ($this->up2k_utama_peserta ?? 0) +
               ($this->up2k_mandiri_kelompok ?? 0) +
               ($this->up2k_mandiri_peserta ?? 0);
    }

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
            'kf' => ['total' => $this->kf ?? 0],
            'paud' => ['total' => $this->paud ?? 0],
            'koperasi' => ['total' => $this->koperasi_berbadan_hukum ?? 0],
        ];
    }

    // ============================================
    // STATIC METHODS
    // ============================================

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

    public static function getByKecamatan($kecamatan): ?self
    {
        return self::where('kecamatan', $kecamatan)
            ->orWhere('nama_kecamatan', $kecamatan)
            ->first();
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

    public function incrementStatistik(array $data): void
    {
        foreach ($data as $field => $value) {
            if (in_array($field, $this->fillable) && is_numeric($value)) {
                $this->increment($field, $value);
            }
        }
    }
}
