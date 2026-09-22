<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RekapKegiatanWarga extends Model
{
    use HasFactory;

    protected $table = 'rekap_kegiatan_warga';

    protected $fillable = [
        'wilayah_id', 'tahun',
        'kecamatan', 'nama_kecamatan',
        'desa', 'nama_desa',
        'dusun', 'nama_dusun',
        'rw', 'rt', 'level',
        'jumlah_dusun', 'jumlah_rw', 'jumlah_rt', 'jumlah_dasa_wisma',
        'jumlah_krt', 'jumlah_kk',
        'total_l', 'total_p',
        'balita_l', 'balita_p',
        'pus', 'wus', 'ibu_hamil', 'ibu_menyusui', 'lansia',
        'buta_l', 'buta_p',
        'rumah_sehat', 'rumah_kurang_sehat',
        'memiliki_tempat_sampah', 'memiliki_spal', 'memiliki_stiker_p4k',
        'air_pdam', 'air_sumur', 'air_sungai', 'air_dll',
        'jumlah_jamban_keluarga',
        'makanan_pokok_beras', 'makanan_pokok_non_beras',
        'kegiatan_up2k', 'kegiatan_tanah_pekarangan',
        'kegiatan_industri_rumah_tangga', 'kegiatan_kesehatan_lingkungan',
        'keterangan', 'created_by', 'updated_by',
    ];

    protected $casts = [
        'tahun' => 'integer',
        'jumlah_dusun' => 'integer',
        'jumlah_rw' => 'integer',
        'jumlah_rt' => 'integer',
        'jumlah_dasa_wisma' => 'integer',
        'jumlah_krt' => 'integer',
        'jumlah_kk' => 'integer',
        'total_l' => 'integer', 'total_p' => 'integer',
        'balita_l' => 'integer', 'balita_p' => 'integer',
        'pus' => 'integer', 'wus' => 'integer',
        'ibu_hamil' => 'integer', 'ibu_menyusui' => 'integer',
        'lansia' => 'integer',
        'buta_l' => 'integer', 'buta_p' => 'integer',
        'rumah_sehat' => 'integer', 'rumah_kurang_sehat' => 'integer',
        'memiliki_tempat_sampah' => 'integer',
        'memiliki_spal' => 'integer',
        'memiliki_stiker_p4k' => 'integer',
        'air_pdam' => 'integer', 'air_sumur' => 'integer',
        'air_sungai' => 'integer', 'air_dll' => 'integer',
        'jumlah_jamban_keluarga' => 'integer',
        'makanan_pokok_beras' => 'integer',
        'makanan_pokok_non_beras' => 'integer',
        'kegiatan_up2k' => 'integer',
        'kegiatan_tanah_pekarangan' => 'integer',
        'kegiatan_industri_rumah_tangga' => 'integer',
        'kegiatan_kesehatan_lingkungan' => 'integer',
    ];

    protected $appends = [
        'total_anggota_keluarga',
        'total_balita',
        'total_buta',
        'total_air',
    ];

    public function getTotalAnggotaKeluargaAttribute(): int
    {
        return ($this->total_l ?? 0) + ($this->total_p ?? 0);
    }

    public function getTotalBalitaAttribute(): int
    {
        return ($this->balita_l ?? 0) + ($this->balita_p ?? 0);
    }

    public function getTotalButaAttribute(): int
    {
        return ($this->buta_l ?? 0) + ($this->buta_p ?? 0);
    }

    public function getTotalAirAttribute(): int
    {
        return ($this->air_pdam ?? 0) + ($this->air_sumur ?? 0)
            + ($this->air_sungai ?? 0) + ($this->air_dll ?? 0);
    }
}
