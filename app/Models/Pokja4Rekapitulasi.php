<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pokja4Rekapitulasi extends Model
{
    use HasFactory;

    protected $table = 'pokja4_rekapitulasi';

    protected $fillable = [
        // ✅ FIX: kecamatan — match controller
        'kecamatan',
        'tahun',

        // String fields — dusun/rw/rt/dasa_wisma
        'dusun', 'rw', 'rt', 'dasa_wisma',

        // Ibu
        'ibu_hamil', 'ibu_melahirkan', 'ibu_nifas', 'ibu_meninggal',

        // Bayi lahir
        'bayi_lahir_l', 'bayi_lahir_p',

        // Akte — ✅ FIX: samain dengan controller
        'akte_ada', 'akte_tidak',

        // Bayi meninggal
        'bayi_meninggal_l', 'bayi_meninggal_p',

        // Balita meninggal
        'balita_meninggal_l', 'balita_meninggal_p',

        'keterangan',
    ];

    protected $casts = [
        'tahun' => 'integer',
        // ✅ FIX: dusun/rw/rt/dasa_wisma — STRING, bukan integer
        'dusun' => 'string',
        'rw' => 'string',
        'rt' => 'string',
        'dasa_wisma' => 'string',
        // Integer fields
        'ibu_hamil' => 'integer',
        'ibu_melahirkan' => 'integer',
        'ibu_nifas' => 'integer',
        'ibu_meninggal' => 'integer',
        'bayi_lahir_l' => 'integer',
        'bayi_lahir_p' => 'integer',
        'akte_ada' => 'integer',
        'akte_tidak' => 'integer',
        'bayi_meninggal_l' => 'integer',
        'bayi_meninggal_p' => 'integer',
        'balita_meninggal_l' => 'integer',
        'balita_meninggal_p' => 'integer',
    ];

    protected $appends = [
        'total_bayi_lahir',
        'total_bayi_meninggal',
        'total_balita_meninggal',
        'total_ibu',
    ];

    // ─── ACCESSORS ──────────────────────────────────────────────────────────

    public function getTotalBayiLahirAttribute(): int
    {
        return ($this->bayi_lahir_l ?? 0) + ($this->bayi_lahir_p ?? 0);
    }

    public function getTotalBayiMeninggalAttribute(): int
    {
        return ($this->bayi_meninggal_l ?? 0) + ($this->bayi_meninggal_p ?? 0);
    }

    public function getTotalBalitaMeninggalAttribute(): int
    {
        return ($this->balita_meninggal_l ?? 0) + ($this->balita_meninggal_p ?? 0);
    }

    // ✅ TAMBAH: total ibu (hamil + melahirkan + nifas)
    public function getTotalIbuAttribute(): int
    {
        return ($this->ibu_hamil ?? 0)
            + ($this->ibu_melahirkan ?? 0)
            + ($this->ibu_nifas ?? 0);
    }
}
