<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DataUmumPkk extends Model
{
    use HasFactory;

    protected $table = 'data_umum_pkk';

    protected $fillable = [
        'wilayah_id', 'tahun',
        'kecamatan', 'nama_kecamatan',
        'desa', 'nama_desa',
        'dusun', 'nama_dusun',
        'level',
        'jumlah_dusun', 'jumlah_pkk_rw', 'jumlah_pkk_rt', 'jumlah_dasa_wisma',
        'jumlah_krt', 'jumlah_kk',
        'jiwa_l', 'jiwa_p',
        'tp_pkk_l', 'tp_pkk_p',
        'kader_umum_l', 'kader_umum_p',
        'kader_khusus_l', 'kader_khusus_p',
        'sekretariat_honorer_l', 'sekretariat_honorer_p',
        'sekretariat_bantuan_l', 'sekretariat_bantuan_p',
        'keterangan', 'created_by', 'updated_by',
    ];

    protected $casts = [
        'tahun' => 'integer',
        'jumlah_dusun' => 'integer',
        'jumlah_pkk_rw' => 'integer',
        'jumlah_pkk_rt' => 'integer',
        'jumlah_dasa_wisma' => 'integer',
        'jumlah_krt' => 'integer',
        'jumlah_kk' => 'integer',
        'jiwa_l' => 'integer', 'jiwa_p' => 'integer',
        'tp_pkk_l' => 'integer', 'tp_pkk_p' => 'integer',
        'kader_umum_l' => 'integer', 'kader_umum_p' => 'integer',
        'kader_khusus_l' => 'integer', 'kader_khusus_p' => 'integer',
        'sekretariat_honorer_l' => 'integer', 'sekretariat_honorer_p' => 'integer',
        'sekretariat_bantuan_l' => 'integer', 'sekretariat_bantuan_p' => 'integer',
    ];

    protected $appends = [
        'total_jiwa',
        'total_kader',
        'total_sekretariat',
    ];

    public function getTotalJiwaAttribute(): int
    {
        return ($this->jiwa_l ?? 0) + ($this->jiwa_p ?? 0);
    }

    public function getTotalKaderAttribute(): int
    {
        return ($this->tp_pkk_l ?? 0) + ($this->tp_pkk_p ?? 0)
            + ($this->kader_umum_l ?? 0) + ($this->kader_umum_p ?? 0)
            + ($this->kader_khusus_l ?? 0) + ($this->kader_khusus_p ?? 0);
    }

    public function getTotalSekretariatAttribute(): int
    {
        return ($this->sekretariat_honorer_l ?? 0) + ($this->sekretariat_honorer_p ?? 0)
            + ($this->sekretariat_bantuan_l ?? 0) + ($this->sekretariat_bantuan_p ?? 0);
    }
}
