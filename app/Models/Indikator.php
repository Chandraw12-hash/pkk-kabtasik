<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DasawismaWarga extends Model
{
    use HasFactory;

    protected $table = 'dasawisma_wargas';

    protected $fillable = [
        'user_id',
        'dasa_wisma',
        'nama_kepala_rumah_tangga',
        'no_registrasi',
        'no_ktp_kk',
        'nama',
        'jabatan',
        'jenis_kelamin',
        'tempat_lahir',
        'tanggal_lahir',
        'status_perkawinan',
        'status_dalam_keluarga',
        'status_keluarga_lainnya',
        'agama',
        'alamat',
        'rt_rw',
        'desa',
        'kecamatan',
        'kabupaten',
        'pendidikan',
        'pekerjaan',
        'akseptor_kb',
        'jenis_akseptor_kb',
        'aktif_posyandu',
        'frekuensi_posyandu',
        'ikut_bkb',
        'memiliki_tabungan',
        'ikut_kelompok_belajar',
        'jenis_kelompok_belajar',
        'ikut_paud',
        'ikut_koperasi',
        'jenis_koperasi',
        'tahun',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
        'akseptor_kb' => 'boolean',
        'aktif_posyandu' => 'boolean',
        'ikut_bkb' => 'boolean',
        'memiliki_tabungan' => 'boolean',
        'ikut_kelompok_belajar' => 'boolean',
        'ikut_paud' => 'boolean',
        'ikut_koperasi' => 'boolean',
        'tahun' => 'integer',
        'frekuensi_posyandu' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

class DasawismaKeluarga extends Model
{
    use HasFactory;

    protected $table = 'dasawisma_keluargas';

    protected $fillable = [
        'user_id',
        'dasa_wisma',
        'rt',
        'rw',
        'desa',
        'kecamatan',
        'kabupaten',
        'provinsi',
        'nama_kepala_rumah_tangga',
        'jumlah_anggota_l',
        'jumlah_anggota_p',
        'jumlah_kk',
        'balita_anak',
        'pus',
        'wus',
        'tiga_buta',
        'ibu_hamil',
        'ibu_menyusui',
        'lansia',
        'anggota_keluarga',
        'makanan_pokok',
        'sarana_mck_septic_tank',
        'jumlah_jamban',
        'sumber_air',
        'tempat_pembuangan_sampah',
        'spal_penyerapan_air',
        'kriteria_rumah',
        'aktifitas_up2k',
        'jenis_usaha_up2k',
        'aktifitas_usaha_kesling',
        'tahun',
    ];

    protected $casts = [
        'anggota_keluarga' => 'array',
        'jumlah_anggota_l' => 'integer',
        'jumlah_anggota_p' => 'integer',
        'jumlah_kk' => 'integer',
        'balita_anak' => 'integer',
        'pus' => 'integer',
        'wus' => 'integer',
        'tiga_buta' => 'integer',
        'ibu_hamil' => 'integer',
        'ibu_menyusui' => 'integer',
        'lansia' => 'integer',
        'sarana_mck_septic_tank' => 'boolean',
        'jumlah_jamban' => 'integer',
        'tempat_pembuangan_sampah' => 'boolean',
        'spal_penyerapan_air' => 'boolean',
        'aktifitas_up2k' => 'boolean',
        'aktifitas_usaha_kesling' => 'boolean',
        'tahun' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

class DasawismaCatatanKegiatan extends Model
{
    use HasFactory;

    protected $table = 'dasawisma_catatan_kegiatans';

    protected $fillable = [
        'user_id',
        'catatan_keluarga_dari',
        'anggota_kelompok_dasa_wisma',
        'tahun',
        'kriteria_rumah',
        'jamban_keluarga',
        'jumlah_jamban',
        'sumber_air',
        'tempat_sampah',
        'daftar_anggota_kegiatan',
    ];

    protected $casts = [
        'tahun' => 'integer',
        'jamban_keluarga' => 'boolean',
        'jumlah_jamban' => 'integer',
        'tempat_sampah' => 'boolean',
        'daftar_anggota_kegiatan' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

class Indikator extends Model
{
    protected $table = 'indikator';

    protected $fillable = [
        'nama_indikator',
    ];
}

