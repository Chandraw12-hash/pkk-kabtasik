<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pokja4KegiatanPosyandu extends Model
{
    use HasFactory;

    protected $table = 'pokja4_kegiatan_posyandu';

    protected $fillable = [
        // ✅ TAMBAH: kecamatan — penting untuk data isolation
        'kecamatan',
        'bulan', 'nama_bulan', 'tahun',

        // Ibu Hamil & Menyusui
        'ibu_hamil', 'ibu_hamil_diperiksa', 'ibu_hamil_dapat_fe',
        'menyusui',

        // KB
        'kb_iud', 'kb_mow', 'kb_mop', 'kb_implan', 'kb_pil', 'kb_suntik', 'kb_kondom',

        // Balita
        'balita_l', 'balita_p',
        'balita_kia_l', 'balita_kia_p',
        'balita_ditimbang_l', 'balita_ditimbang_p',
        'balita_naik_l', 'balita_naik_p',

        // Vitamin
        'vit_a_1', 'vit_a_2',

        // Imunisasi
        'imunisasi_tt_1', 'imunisasi_tt_2', 'imunisasi_bcg',
        'imunisasi_dpt_1', 'imunisasi_dpt_2', 'imunisasi_dpt_3',
        'imunisasi_polio_1', 'imunisasi_polio_2', 'imunisasi_polio_3', 'imunisasi_polio_4',
        'imunisasi_campak',
        'imunisasi_hepatitis_1', 'imunisasi_hepatitis_2', 'imunisasi_hepatitis_3',

        // Diare
        'balita_diare', 'balita_oralit',

        'keterangan',
    ];

    // ✅ FIX: cast lengkap — bukan cuma komentar
    protected $casts = [
        'bulan' => 'integer',
        'tahun' => 'integer',

        // Ibu Hamil & Menyusui
        'ibu_hamil' => 'integer',
        'ibu_hamil_diperiksa' => 'integer',
        'ibu_hamil_dapat_fe' => 'integer',
        'menyusui' => 'integer',

        // KB
        'kb_iud' => 'integer',
        'kb_mow' => 'integer',
        'kb_mop' => 'integer',
        'kb_implan' => 'integer',
        'kb_pil' => 'integer',
        'kb_suntik' => 'integer',
        'kb_kondom' => 'integer',

        // Balita
        'balita_l' => 'integer',
        'balita_p' => 'integer',
        'balita_kia_l' => 'integer',
        'balita_kia_p' => 'integer',
        'balita_ditimbang_l' => 'integer',
        'balita_ditimbang_p' => 'integer',
        'balita_naik_l' => 'integer',
        'balita_naik_p' => 'integer',

        // Vitamin
        'vit_a_1' => 'integer',
        'vit_a_2' => 'integer',

        // Imunisasi
        'imunisasi_tt_1' => 'integer',
        'imunisasi_tt_2' => 'integer',
        'imunisasi_bcg' => 'integer',
        'imunisasi_dpt_1' => 'integer',
        'imunisasi_dpt_2' => 'integer',
        'imunisasi_dpt_3' => 'integer',
        'imunisasi_polio_1' => 'integer',
        'imunisasi_polio_2' => 'integer',
        'imunisasi_polio_3' => 'integer',
        'imunisasi_polio_4' => 'integer',
        'imunisasi_campak' => 'integer',
        'imunisasi_hepatitis_1' => 'integer',
        'imunisasi_hepatitis_2' => 'integer',
        'imunisasi_hepatitis_3' => 'integer',

        // Diare
        'balita_diare' => 'integer',
        'balita_oralit' => 'integer',
    ];

    protected $appends = [
        'total_akseptor_kb',
        'total_balita_ditimbang',
        'total_imunisasi',
        'total_balita',
        'total_ibu_hamil',
    ];

    // ─── ACCESSORS ──────────────────────────────────────────────────────────

    public function getTotalAkseptorKbAttribute(): int
    {
        return ($this->kb_iud ?? 0)
            + ($this->kb_mow ?? 0)
            + ($this->kb_mop ?? 0)
            + ($this->kb_implan ?? 0)
            + ($this->kb_pil ?? 0)
            + ($this->kb_suntik ?? 0)
            + ($this->kb_kondom ?? 0);
    }

    public function getTotalBalitaDitimbangAttribute(): int
    {
        return ($this->balita_ditimbang_l ?? 0) + ($this->balita_ditimbang_p ?? 0);
    }

    public function getTotalImunisasiAttribute(): int
    {
        return ($this->imunisasi_tt_1 ?? 0)
            + ($this->imunisasi_tt_2 ?? 0)
            + ($this->imunisasi_bcg ?? 0)
            + ($this->imunisasi_dpt_1 ?? 0)
            + ($this->imunisasi_dpt_2 ?? 0)
            + ($this->imunisasi_dpt_3 ?? 0)
            + ($this->imunisasi_polio_1 ?? 0)
            + ($this->imunisasi_polio_2 ?? 0)
            + ($this->imunisasi_polio_3 ?? 0)
            + ($this->imunisasi_polio_4 ?? 0)
            + ($this->imunisasi_campak ?? 0)
            + ($this->imunisasi_hepatitis_1 ?? 0)
            + ($this->imunisasi_hepatitis_2 ?? 0)
            + ($this->imunisasi_hepatitis_3 ?? 0);
    }

    // ✅ TAMBAH: total balita (L + P)
    public function getTotalBalitaAttribute(): int
    {
        return ($this->balita_l ?? 0) + ($this->balita_p ?? 0);
    }

    // ✅ TAMBAH: total ibu hamil (jumlah + diperiksa)
    public function getTotalIbuHamilAttribute(): int
    {
        return $this->ibu_hamil ?? 0;
    }
}
