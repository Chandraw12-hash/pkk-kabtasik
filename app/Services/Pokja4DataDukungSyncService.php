<?php

namespace App\Services;

use App\Models\LaporanKegiatan;
use App\Models\Pokja4DataDukung;
use App\Models\Pokja4DataProgram;
use Illuminate\Support\Facades\Log;

/**
 * Sinkronisasi Laporan Data Dukung Pokja IV dari aplikasi mobile
 * ke tabel admin kabupaten (pokja4_data_dukung + pokja4_data_program).
 *
 * Dipakai dari approve API (mobile) maupun approve web, supaya
 * input Flutter selalu masuk ke Data Pokja IV admin kabupaten
 * dan TIDAK ke halaman public.
 */
class Pokja4DataDukungSyncService
{
    /**
     * Key aplikasi Android => kolom tabel admin (kontrak DataDukung.tsx).
     */
    public const DUKUNG_MAP = [
        'jumlah_penduduk' => 'jumlah_penduduk',
        'jumlah_kk' => 'jumlah_kepala_keluarga',
        'jumlah_rumah' => 'jumlah_rumah',
        'jumlah_laki' => 'jumlah_laki_laki',
        'jumlah_perempuan' => 'jumlah_perempuan',
        'jumlah_usia_produktif' => 'jumlah_usia_produktif',
        'jumlah_pus' => 'jumlah_pasangan_usia_subur',
        'jumlah_ibu_hamil' => 'jumlah_ibu_hamil',
        'jumlah_bayi_0_2' => 'jumlah_bayi_0_2',
        'jumlah_bayi_asi' => 'jumlah_bayi_asi_eksklusif',
        'jumlah_balita' => 'jumlah_balita_2_5',
        'jumlah_anak' => 'jumlah_anak_6_14',
        'jumlah_lansia' => 'jumlah_lansia',
        'jumlah_kb_aktif' => 'jumlah_peserta_kb_aktif',
        'jumlah_ibu_menyusui' => 'jumlah_ibu_menyusui',
        'jumlah_keluarga_sejahtera' => 'jumlah_keluarga_sejahtera',
        'jumlah_keluarga_pra_sejahtera' => 'jumlah_keluarga_pra_sejahtera',
        'jumlah_mbr' => 'jumlah_mbr',
        'jumlah_kader_pkk_rt_rw' => 'jumlah_kader_pkk_rt_rw',
        'jumlah_kader_pkk_kesehatan' => 'jumlah_kader_pkk_kesehatan',
        'jumlah_dasa_wisma' => 'jumlah_kelompok_dasa_wisma',
        'jumlah_kader_dasa_wisma' => 'jumlah_kader_dasa_wisma',
        'jumlah_posyandu_aktif' => 'jumlah_posyandu_aktif',
        'jumlah_bidan_desa' => 'jumlah_bidan_desa',
        'jumlah_bank_sampah' => 'jumlah_bank_sampah',
        'jumlah_posko_bencana' => 'jumlah_posko_bencana',
    ];

    public const PROGRAM_MAP = [
        'bayi_prematur' => 'stunting_bayi_prematur',
        'bayi_bblr' => 'stunting_bblr',
        'balita_kurang_gizi' => 'stunting_balita_kurang_gizi',
        'balita_stunting' => 'stunting_balita_stunting',
        'bayi_balita_periksa' => 'stunting_rutin_timbang',
        'ibu_lahir_jarak_dekat' => 'stunting_jarak_dekat',
        'hamil_tidak_direncanakan' => 'stunting_tidak_direncanakan',
        'penduduk_tbc' => 'phbs_tbc',
        'rumah_jamban_sehat' => 'phbs_jamban_sehat',
        'rumah_bak_air' => 'phbs_air_bersih',
        'kasus_diare' => 'phbs_diare',
        'keluarga_sadar_gizi' => 'phbs_sadar_gizi',
        'rumah_tanpa_asap_rokok' => 'phbs_tanpa_rokok',
        'penduduk_babs' => 'phbs_babs',
        'ibu_hamil_periksa' => 'kesga_bumil_rutin',
        'ayah_merokok' => 'kesga_ayah_merokok',
        'kematian_ibu_nifas' => 'kesga_kematian_nifas',
        'kanker_serviks' => 'kesga_kanker_serviks',
        'bayi_balita_imunisasi' => 'kesga_imunisasi_lengkap',
        'bayi_balita_sakit' => 'kesga_sakit_terdata',
        'kematian_bayi_balita' => 'kesga_kematian_bayi_balita',
        'kebakaran_rumah_tangga' => 'kebakaran_kasus',
        'rumah_listrik_standar' => 'kebakaran_listrik_standar',
        'rumah_alat_pemadam' => 'kebakaran_apar',
        'rumah_semi_permanen' => 'kebakaran_semi_permanen',
        'rumah_kotak_p3k' => 'kebakaran_p3k',
        'rumah_info_mitigasi_kebakaran' => 'kebakaran_edukasi_rt',
        'kader_edukasi_kebakaran' => 'kebakaran_edukasi_kader',
        'relawan_bencana_alam' => 'bencana_relawan',
        'rumah_info_mitigasi_alam' => 'bencana_edukasi_rt',
        'kader_edukasi_alam' => 'bencana_edukasi_kader',
        'fasilitas_posko_bencana' => 'bencana_posko_alternatif',
        'relawan_bencana_alam_2' => 'bencana_relawan_terdata',
        'rumah_tas_siaga' => 'bencana_tas_siaga',
        'kerusakan_fasilitas_umum' => 'bencana_fasum_rusak',
        'keluarga_bak_sampah' => 'lingkungan_bak_sampah',
        'keluarga_anggota_bank_sampah' => 'lingkungan_bank_sampah',
        'keluarga_spal' => 'lingkungan_spal',
        'kasus_banjir' => 'lingkungan_banjir',
        'bak_sampah_desa' => 'lingkungan_bak_desa',
        'rumah_sehat' => 'lingkungan_rumah_sehat',
        'kasus_klb' => 'lingkungan_klb',
        'keluarga_2_anak' => 'berkualitas_2_anak',
        'penduduk_berobat' => 'berkualitas_berobat',
        'penyakit_menular' => 'berkualitas_menular',
        'penyakit_tidak_menular' => 'berkualitas_tidak_menular',
        'bayi_lahir_sehat' => 'berkualitas_lahir_sehat',
        'bayi_cukup_bulan' => 'berkualitas_cukup_bulan',
        'keluarga_gangguan_jiwa' => 'berkualitas_gangguan_jiwa',
        'keluarga_asuransi' => 'keuangan_asuransi',
        'kk_pengangguran' => 'keuangan_tanpa_kerja',
        'kk_tidak_tetap' => 'keuangan_tanpa_kerja_tetap',
        'kk_penghasilan_tetap' => 'keuangan_penghasilan_tetap',
        'ibu_hamil_tabulin' => 'keuangan_tabulin',
        'keluarga_tabungan' => 'keuangan_tabungan',
        'keluarga_aset_investasi' => 'keuangan_aset',
        'ibu_melahirkan_bayi_sehat' => 'pus_lahir_sehat',
        'wanita_peserta_kb' => 'pus_wanita_kb',
        'pria_peserta_kb' => 'pus_pria_kb',
        'pus_masalah_reproduksi' => 'pus_reproduksi',
        'pus_nikah_di_bawah_19' => 'pus_nikah_dini',
        'wus_hamil_beresiko' => 'pus_hamil_beresiko',
        'pus_penyakit_seksual' => 'pus_ims',
    ];

    public static function semesterDariTanggal(?\DateTimeInterface $tanggal): string
    {
        $bulan = $tanggal ? (int) $tanggal->format('n') : (int) now()->format('n');

        return $bulan <= 6 ? 'I' : 'II';
    }

    public static function kopDariLaporan(LaporanKegiatan $laporan): array
    {
        return [
            'provinsi' => $laporan->provinsi,
            'kabupaten_kota' => $laporan->kabupaten_kota,
            'program' => $laporan->program,
            'pj_desa' => $laporan->pj_desa,
            'pj_desa_hp' => $laporan->pj_desa_hp,
            'pj_kecamatan' => $laporan->pj_kecamatan,
            'pj_kecamatan_hp' => $laporan->pj_kecamatan_hp,
            'pj_kabupaten' => $laporan->pj_kabupaten,
            'pj_kabupaten_hp' => $laporan->pj_kabupaten_hp,
            'pj_provinsi' => $laporan->pj_provinsi,
            'pj_provinsi_hp' => $laporan->pj_provinsi_hp,
        ];
    }

    public static function syncDataDukung(LaporanKegiatan $laporan): void
    {
        $data = $laporan->data_angka;
        if (is_string($data)) {
            $data = json_decode($data, true);
        }
        if (! is_array($data)) {
            return;
        }

        $tahun = $laporan->created_at ? $laporan->created_at->year : now()->year;
        $semester = self::semesterDariTanggal(
            $laporan->created_at ? $laporan->created_at->toDateTime() : null
        );

        $row = Pokja4DataDukung::firstOrNew([
            'kecamatan' => $laporan->kecamatan,
            'tahun' => $tahun,
            'semester' => $semester,
        ]);
        $row->nama_kecamatan = $row->nama_kecamatan ?? $laporan->kecamatan;

        foreach (self::DUKUNG_MAP as $kunciAplikasi => $kolom) {
            $row->{$kolom} = (int) ($row->{$kolom} ?? 0) + (int) ($data[$kunciAplikasi] ?? 0);
        }

        foreach (['evaluasi', 'keterangan'] as $teks) {
            if (! empty($data[$teks])) {
                $row->{$teks} = $data[$teks];
            }
        }

        foreach (self::kopDariLaporan($laporan) as $kolom => $nilai) {
            if (! empty($nilai) && empty($row->{$kolom})) {
                $row->{$kolom} = $nilai;
            }
        }

        $row->save();

        Log::info('Pokja IV Data Dukung disinkronkan untuk: '.$laporan->kecamatan);
    }

    public static function syncDataProgram(LaporanKegiatan $laporan): void
    {
        $data = $laporan->data_angka;
        if (is_string($data)) {
            $data = json_decode($data, true);
        }
        if (! is_array($data)) {
            return;
        }

        $tahun = $laporan->created_at ? $laporan->created_at->year : now()->year;
        $semester = self::semesterDariTanggal(
            $laporan->created_at ? $laporan->created_at->toDateTime() : null
        );

        $row = Pokja4DataProgram::firstOrNew([
            'kecamatan' => $laporan->kecamatan,
            'tahun' => $tahun,
            'semester' => $semester,
        ]);
        $row->nama_kecamatan = $row->nama_kecamatan ?? $laporan->kecamatan;

        foreach (self::PROGRAM_MAP as $kunciAplikasi => $kolom) {
            $row->{$kolom} = (int) ($row->{$kolom} ?? 0) + (int) ($data[$kunciAplikasi] ?? 0);
        }

        foreach (['evaluasi', 'keterangan'] as $teks) {
            if (! empty($data[$teks])) {
                $row->{$teks} = $data[$teks];
            }
        }

        $row->save();

        Log::info('Pokja IV Data Program disinkronkan untuk: '.$laporan->kecamatan);
    }
}
