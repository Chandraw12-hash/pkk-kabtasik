<?php

namespace App\Exports;

use App\Models\Pokja4DataDukung;
use App\Models\Pokja4DataProgram;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class Pokja4DataDukungExport implements WithMultipleSheets
{
    protected $tahun;

    protected $semester;

    public function __construct($tahun = null, $semester = null)
    {
        $this->tahun = $tahun ?? date('Y');
        $this->semester = $semester ?? ((int) date('n') <= 6 ? 'I' : 'II');
    }

    public function sheets(): array
    {
        return [
            new Pokja4DataDukungSheet($this->tahun, $this->semester),
            new Pokja4DataProgramSheet($this->tahun, $this->semester),
        ];
    }
}

abstract class Pokja4DataDukungBaseSheet implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize, WithColumnWidths, WithTitle
{
    protected $tahun;

    protected $semester;

    protected $no = 0;

    public function __construct($tahun, $semester)
    {
        $this->tahun = $tahun;
        $this->semester = $semester;
    }

    abstract protected function titleText(): string;

    abstract protected function sheetTitle(): string;

    abstract protected function columns(): array;

    abstract protected function query();

    public function collection()
    {
        return $this->query()
            ->where('tahun', $this->tahun)
            ->where('semester', $this->semester)
            ->orderBy('kecamatan')
            ->get();
    }

    public function headings(): array
    {
        $w = array_fill(0, count($this->columns()) + 1, '');

        return [
            array_merge([$this->titleText()], $w),
            array_merge(
                ['TP. PKK KABUPATEN TASIKMALAYA — TAHUN ' . $this->tahun . ' SEMESTER ' . $this->semester],
                $w
            ),
            array_merge(['NO', 'KECAMATAN'], array_keys($this->columns())),
        ];
    }

    public function map($item): array
    {
        $this->no++;

        $out = [$this->no, $item->kecamatan ?? $item->nama_kecamatan ?? '-'];
        foreach ($this->columns() as $kolom) {
            $out[] = $item->{$kolom} ?? 0;
        }

        return $out;
    }

    public function styles(Worksheet $sheet)
    {
        $last = $sheet->getHighestColumn();
        $sheet->mergeCells("A1:{$last}1");
        $sheet->mergeCells("A2:{$last}2");
        $sheet->getStyle('A1')->applyFromArray([
            'font' => ['bold' => true, 'size' => 14],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
        ]);
        $sheet->getStyle('A2')->applyFromArray([
            'font' => ['bold' => true, 'size' => 12],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
        ]);
        $sheet->getStyle("A3:{$last}3")->applyFromArray([
            'font' => ['bold' => true, 'size' => 10, 'color' => ['rgb' => 'FFFFFF']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER, 'wrapText' => true],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '0072BC']],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => '000000']]],
        ]);
        $sheet->getStyle("A4:{$last}" . $sheet->getHighestRow())->applyFromArray([
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => '000000']]],
            'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
        ]);

        return [];
    }

    public function columnWidths(): array
    {
        return ['A' => 5, 'B' => 20];
    }

    public function title(): string
    {
        return $this->sheetTitle();
    }
}

class Pokja4DataDukungSheet extends Pokja4DataDukungBaseSheet
{
    protected function titleText(): string
    {
        return 'A. DATA DUKUNG PER KECAMATAN';
    }

    protected function sheetTitle(): string
    {
        return 'A. Data Dukung';
    }

    protected function query()
    {
        return Pokja4DataDukung::query();
    }

    protected function columns(): array
    {
        return [
            'Jumlah Penduduk' => 'jumlah_penduduk',
            'Jumlah Kepala Keluarga' => 'jumlah_kepala_keluarga',
            'Jumlah Rumah' => 'jumlah_rumah',
            'Jumlah Laki-Laki' => 'jumlah_laki_laki',
            'Jumlah Perempuan' => 'jumlah_perempuan',
            'Jumlah Usia Produktif (15-64)' => 'jumlah_usia_produktif',
            'Jumlah Pasangan Usia Subur' => 'jumlah_pasangan_usia_subur',
            'Jumlah Ibu Hamil' => 'jumlah_ibu_hamil',
            'Jumlah Bayi (0-2 Thn)' => 'jumlah_bayi_0_2',
            'Jumlah Bayi ASI Eksklusif' => 'jumlah_bayi_asi_eksklusif',
            'Jumlah Balita (2-5 Thn)' => 'jumlah_balita_2_5',
            'Jumlah Anak (6-14 Thn)' => 'jumlah_anak_6_14',
            'Jumlah Lansia' => 'jumlah_lansia',
            'Jumlah Peserta KB Aktif' => 'jumlah_peserta_kb_aktif',
            'Jumlah Ibu Menyusui' => 'jumlah_ibu_menyusui',
            'Jumlah Keluarga Sejahtera' => 'jumlah_keluarga_sejahtera',
            'Jumlah Keluarga Pra Sejahtera' => 'jumlah_keluarga_pra_sejahtera',
            'Jumlah MBR' => 'jumlah_mbr',
            'Jumlah Kader PKK RT/RW' => 'jumlah_kader_pkk_rt_rw',
            'Jumlah Kader PKK Kesehatan' => 'jumlah_kader_pkk_kesehatan',
            'Jumlah Kelompok Dasa Wisma' => 'jumlah_kelompok_dasa_wisma',
            'Jumlah Kader Dasa Wisma' => 'jumlah_kader_dasa_wisma',
            'Jumlah Posyandu Aktif' => 'jumlah_posyandu_aktif',
            'Jumlah Bidan Desa' => 'jumlah_bidan_desa',
            'Jumlah Bank Sampah' => 'jumlah_bank_sampah',
            'Jumlah Posko Bencana' => 'jumlah_posko_bencana',
            'Evaluasi' => 'evaluasi',
            'Keterangan' => 'keterangan',
        ];
    }
}

class Pokja4DataProgramSheet extends Pokja4DataDukungBaseSheet
{
    protected function titleText(): string
    {
        return 'B. DATA PROGRAM GKS PER KECAMATAN';
    }

    protected function sheetTitle(): string
    {
        return 'B. Data Program';
    }

    protected function query()
    {
        return Pokja4DataProgram::query();
    }

    protected function columns(): array
    {
        return [
            '[Stunting] Bayi Prematur' => 'stunting_bayi_prematur',
            '[Stunting] BBLR' => 'stunting_bblr',
            '[Stunting] Balita Kurang Gizi' => 'stunting_balita_kurang_gizi',
            '[Stunting] Balita Stunting' => 'stunting_balita_stunting',
            '[Stunting] Rutin Timbang' => 'stunting_rutin_timbang',
            '[Stunting] Jarak Lahir Dekat' => 'stunting_jarak_dekat',
            '[Stunting] Hamil Tak Direncanakan' => 'stunting_tidak_direncanakan',
            '[PHBS] TBC' => 'phbs_tbc',
            '[PHBS] Jamban Sehat' => 'phbs_jamban_sehat',
            '[PHBS] Air Bersih' => 'phbs_air_bersih',
            '[PHBS] Diare' => 'phbs_diare',
            '[PHBS] Sadar Gizi' => 'phbs_sadar_gizi',
            '[PHBS] Tanpa Rokok' => 'phbs_tanpa_rokok',
            '[PHBS] BABS' => 'phbs_babs',
            '[Kesga] Bumil Rutin' => 'kesga_bumil_rutin',
            '[Kesga] Ayah Merokok' => 'kesga_ayah_merokok',
            '[Kesga] Kematian Nifas' => 'kesga_kematian_nifas',
            '[Kesga] Kanker Serviks' => 'kesga_kanker_serviks',
            '[Kesga] Imunisasi Lengkap' => 'kesga_imunisasi_lengkap',
            '[Kesga] Sakit Terdata' => 'kesga_sakit_terdata',
            '[Kesga] Kematian Bayi/Balita' => 'kesga_kematian_bayi_balita',
            '[Kebakaran] Kasus' => 'kebakaran_kasus',
            '[Kebakaran] Listrik Standar' => 'kebakaran_listrik_standar',
            '[Kebakaran] APAR' => 'kebakaran_apar',
            '[Kebakaran] Semi Permanen' => 'kebakaran_semi_permanen',
            '[Kebakaran] P3K' => 'kebakaran_p3k',
            '[Kebakaran] Edukasi RT' => 'kebakaran_edukasi_rt',
            '[Kebakaran] Edukasi Kader' => 'kebakaran_edukasi_kader',
            '[Bencana] Relawan' => 'bencana_relawan',
            '[Bencana] Edukasi RT' => 'bencana_edukasi_rt',
            '[Bencana] Edukasi Kader' => 'bencana_edukasi_kader',
            '[Bencana] Posko Alternatif' => 'bencana_posko_alternatif',
            '[Bencana] Relawan Terdata' => 'bencana_relawan_terdata',
            '[Bencana] Tas Siaga' => 'bencana_tas_siaga',
            '[Bencana] Fasum Rusak' => 'bencana_fasum_rusak',
            '[Lingkungan] Bak Sampah' => 'lingkungan_bak_sampah',
            '[Lingkungan] Bank Sampah' => 'lingkungan_bank_sampah',
            '[Lingkungan] SPAL' => 'lingkungan_spal',
            '[Lingkungan] Banjir' => 'lingkungan_banjir',
            '[Lingkungan] Bak Desa' => 'lingkungan_bak_desa',
            '[Lingkungan] Rumah Sehat' => 'lingkungan_rumah_sehat',
            '[Lingkungan] KLB' => 'lingkungan_klb',
            '[Berkualitas] 2 Anak' => 'berkualitas_2_anak',
            '[Berkualitas] Berobat' => 'berkualitas_berobat',
            '[Berkualitas] Menular' => 'berkualitas_menular',
            '[Berkualitas] Tidak Menular' => 'berkualitas_tidak_menular',
            '[Berkualitas] Lahir Sehat' => 'berkualitas_lahir_sehat',
            '[Berkualitas] Cukup Bulan' => 'berkualitas_cukup_bulan',
            '[Berkualitas] Gangguan Jiwa' => 'berkualitas_gangguan_jiwa',
            '[Keuangan] Asuransi' => 'keuangan_asuransi',
            '[Keuangan] Tanpa Kerja' => 'keuangan_tanpa_kerja',
            '[Keuangan] Tanpa Kerja Tetap' => 'keuangan_tanpa_kerja_tetap',
            '[Keuangan] Penghasilan Tetap' => 'keuangan_penghasilan_tetap',
            '[Keuangan] TABULIN' => 'keuangan_tabulin',
            '[Keuangan] Tabungan' => 'keuangan_tabungan',
            '[Keuangan] Aset' => 'keuangan_aset',
            '[PUS] Lahir Sehat' => 'pus_lahir_sehat',
            '[PUS] Wanita KB' => 'pus_wanita_kb',
            '[PUS] Pria KB' => 'pus_pria_kb',
            '[PUS] Reproduksi' => 'pus_reproduksi',
            '[PUS] Nikah Dini' => 'pus_nikah_dini',
            '[PUS] Hamil Beresiko' => 'pus_hamil_beresiko',
            '[PUS] IMS' => 'pus_ims',
            'Evaluasi' => 'evaluasi',
            'Keterangan' => 'keterangan',
        ];
    }
}
