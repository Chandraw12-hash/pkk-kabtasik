<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pokja4KunjunganPyd extends Model
{
    use HasFactory;

    protected $table = 'pokja4_kunjungan_pyd';

    protected $fillable = [
        'kecamatan',
        'bulan', 'nama_bulan', 'tahun',
        // Bayi 0-12 bulan
        'bayi_0_12_l', 'bayi_0_12_p',
        'bayi_0_12_laki_l', 'bayi_0_12_laki_p',
        // Balita 1-5 tahun
        'balita_1_5_l', 'balita_1_5_p',
        'balita_1_5_laki_l', 'balita_1_5_laki_p',
        // WUS, PUS, Ibu
        'wus', 'pus', 'ibu_hamil', 'ibu_menyusui',
        // Bayi lahir/meninggal
        'bayi_lahir', 'bayi_meninggal',
        // Kematian ibu
        'kematian_ibu',
        // Petugas
        'petugas_kader', 'petugas_plkb', 'petugas_medis',
        'keterangan',
    ];

    protected $casts = [
        'bulan' => 'integer',
        'tahun' => 'integer',
        'bayi_0_12_l' => 'integer', 'bayi_0_12_p' => 'integer',
        'bayi_0_12_laki_l' => 'integer', 'bayi_0_12_laki_p' => 'integer',
        'balita_1_5_l' => 'integer', 'balita_1_5_p' => 'integer',
        'balita_1_5_laki_l' => 'integer', 'balita_1_5_laki_p' => 'integer',
        'wus' => 'integer', 'pus' => 'integer',
        'ibu_hamil' => 'integer', 'ibu_menyusui' => 'integer',
        'bayi_lahir' => 'integer', 'bayi_meninggal' => 'integer',
        'kematian_ibu' => 'integer',
        'petugas_kader' => 'integer', 'petugas_plkb' => 'integer', 'petugas_medis' => 'integer',
    ];

    protected $appends = [
        'total_bayi',
        'total_balita',
    ];

    public function getTotalBayiAttribute(): int
    {
        return ($this->bayi_0_12_l ?? 0)
            + ($this->bayi_0_12_p ?? 0)
            + ($this->bayi_0_12_laki_l ?? 0)
            + ($this->bayi_0_12_laki_p ?? 0);
    }

    public function getTotalBalitaAttribute(): int
    {
        return ($this->balita_1_5_l ?? 0)
            + ($this->balita_1_5_p ?? 0)
            + ($this->balita_1_5_laki_l ?? 0)
            + ($this->balita_1_5_laki_p ?? 0);
    }
}
