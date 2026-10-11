<?php

namespace App\Exports;

use App\Models\Pokja2;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

/**
 * Export agregat Pokja II per kecamatan (tombol Export kabupaten).
 * Cermin tabel output website: tanpa split gender (L+P digabung),
 * header grup + nomor kolom 1-36 + baris JUMLAH.
 * Rincian L/P hanya lewat Pokja2RincianExport (super-admin).
 */
class Pokja2Export implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize, WithEvents
{
    protected ?string $search;

    /** Kolom data (34) sesuai urutan tabel website. */
    public const KOLOM = [
        'warga_buta' => null,
        'kelompok_belajar_paket_a' => 'kelompok_belajar_paket_a',
        'warga_belajar_paket_a' => 'warga_belajar_paket_a',
        'kelompok_belajar_paket_b' => 'kelompok_belajar_paket_b',
        'warga_belajar_paket_b' => 'warga_belajar_paket_b',
        'kelompok_belajar_paket_c' => 'kelompok_belajar_paket_c',
        'warga_belajar_paket_c' => 'warga_belajar_paket_c',
        'kf' => 'kf',
        'warga_belajar_kf' => 'warga_belajar_kf',
        'paud' => 'paud',
        'taman_bacaan' => 'taman_bacaan',
        'kelompok_bkb' => 'kelompok_bkb',
        'peserta_bkb' => 'peserta_bkb',
        'ibu_set_bkb' => 'ibu_set_bkb',
        'ape_bkb' => 'ape_bkb',
        'kelompok_simulasi_bkb' => 'kelompok_simulasi_bkb',
        'tutor_kf' => 'tutor_kf',
        'tutor_paud' => 'tutor_paud',
        'kader_bkb' => 'kader_bkb',
        'kelompok_kader_koperasi' => 'kelompok_kader_koperasi',
        'kader_keterampilan' => 'kader_keterampilan',
        'lp3_pkk' => 'lp3_pkk',
        'tp3_pkk' => 'tp3_pkk',
        'damas_pkk' => 'damas_pkk',
        'up2k_pemula_kelompok' => 'up2k_pemula_kelompok',
        'up2k_pemula_peserta' => 'up2k_pemula_peserta',
        'up2k_madya_kelompok' => 'up2k_madya_kelompok',
        'up2k_madya_peserta' => 'up2k_madya_peserta',
        'up2k_utama_kelompok' => 'up2k_utama_kelompok',
        'up2k_utama_peserta' => 'up2k_utama_peserta',
        'up2k_mandiri_kelompok' => 'up2k_mandiri_kelompok',
        'up2k_mandiri_peserta' => 'up2k_mandiri_peserta',
        'koperasi_berbadan_hukum' => 'koperasi_berbadan_hukum',
        'anggota_koperasi' => 'anggota_koperasi',
    ];

    protected const SUB = [
        '', 'Jml. KLP', 'Belajar', 'Jml. KLP', 'Belajar', 'Jml. KLP', 'Belajar',
        'Jml. KLP', 'Belajar', '', '',
        'Jml. KLP', 'Peserta', 'Jml. Ibu (SET)', 'Jml. APE', 'Simulasi',
        'KF', 'PAUD Sejenis', '', '', '', '', '', '',
        'Jml. Klp', 'Peserta', 'Jml. Klp', 'Peserta',
        'Jml. Klp', 'Peserta', 'Jml. Klp', 'Peserta',
        'Jml. Klp', 'Jml. Anggota',
    ];

    protected array $rows = [];

    protected array $totals = [];

    public function __construct(?string $search = null)
    {
        $this->search = $search;
    }

    public function collection()
    {
        $this->rows = Pokja2::query()
            ->when($this->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('kecamatan', 'like', "%{$search}%")
                        ->orWhere('nama_kecamatan', 'like', "%{$search}%");
                });
            })
            ->orderBy('kecamatan', 'asc')
            ->get()
            ->all();

        return collect($this->rows);
    }

    public function headings(): array
    {
        $r1 = array_merge(
            ['NO', 'KECAMATAN', 'PENDIDIKAN KETERAMPILAN'],
            array_fill(0, 10, ''),
            ['JUMLAH KADER KHUSUS'],
            array_fill(0, 12, ''),
            ['PENGEMBANGAN KEHIDUPAN BERKOPERASI'],
            array_fill(0, 9, ''),
            ['KET.']
        );
        $r2 = [
            '', '',
            'Jml. Warga Yang Masih 3 (Tiga) Buta',
            'Paket A', '', 'Paket B', '', 'Paket C', '', 'KF', '',
            'PAUD Sejenis', 'Taman Bacaan',
            'BKB', '', '', '', '', 'Tutor', '',
            'BKB', 'Koperasi', 'Keterampilan', 'LP3 PKK', 'TP3 PKK', 'Damas PKK',
            'Pemula', '', 'Madya', '', 'Utama', '', 'Mandiri', '',
            'Koperasi Berbadan Hukum', '',
            '',
        ];
        $r3 = array_merge(['', ''], self::SUB, ['']);
        $r4 = [];
        for ($i = 1; $i <= 36; $i++) {
            $r4[] = $i;
        }
        $r4[] = '';

        return [$r1, $r2, $r3, $r4];
    }

    public function map($row): array
    {
        static $no = 0;
        $no++;

        $out = [$no, $row->kecamatan ?? $row->nama_kecamatan ?? '-'];
        foreach (self::KOLOM as $label => $kolom) {
            if ($kolom === null) {
                $out[] = (int) ($row->warga_buta_l ?? 0) + (int) ($row->warga_buta_p ?? 0);
            } else {
                $out[] = (int) ($row->{$kolom} ?? 0);
            }
        }
        $out[] = $row->keterangan ?? '-';

        foreach ($out as $i => $v) {
            if ($i >= 2 && $i < count($out) - 1 && is_numeric($v)) {
                $this->totals[$i] = ($this->totals[$i] ?? 0) + $v;
            }
        }

        return $out;
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => [
                    'bold' => true,
                    'color' => ['rgb' => 'FFFFFF'],
                ],
                'fill' => [
                    'fillType' => 'solid',
                    'startColor' => ['rgb' => '0D9488'],
                ],
                'alignment' => [
                    'horizontal' => 'center',
                    'vertical' => 'center',
                    'wrapText' => true,
                ],
            ],
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $n = count($this->rows);
                $fr = 5 + $n;
                $last = 'AK';

                foreach ([['C', 'M'], ['N', 'Z'], ['AA', 'AJ']] as [$a, $b]) {
                    $sheet->mergeCells("{$a}1:{$b}1");
                }
                $sheet->mergeCells('A1:A3');
                $sheet->mergeCells('B1:B3');
                $sheet->mergeCells('AK1:AK4');
                foreach ([['C', 'C'], ['D', 'E'], ['F', 'G'], ['H', 'I'], ['J', 'K']] as [$a, $b]) {
                    $sheet->mergeCells("{$a}2:{$b}2");
                }
                foreach (['L', 'M', 'V', 'W', 'X', 'Y', 'Z', 'AA'] as $c) {
                    $sheet->mergeCells("{$c}2:{$c}4");
                }
                $sheet->mergeCells('N2:R2');
                $sheet->mergeCells('S2:T2');
                foreach ([['AB', 'AC'], ['AD', 'AE'], ['AF', 'AG'], ['AH', 'AI'], ['AJ', 'AK']] as [$a, $b]) {
                    $sheet->mergeCells("{$a}2:{$b}2");
                }

                $sheet->setCellValue("A{$fr}", 'JUMLAH');
                $sheet->mergeCells("A{$fr}:B{$fr}");
                for ($i = 2; $i < 36; $i++) {
                    $sheet->setCellValue(self::col($i + 1).$fr, $this->totals[$i] ?? 0);
                }
                $sheet->setCellValue("AK{$fr}", '-');

                $sheet->getStyle("A1:AK4")->applyFromArray([
                    'font' => ['bold' => true],
                    'alignment' => ['horizontal' => 'center', 'vertical' => 'center', 'wrapText' => true],
                ]);
                $sheet->getStyle('A1:AK1')->applyFromArray([
                    'font' => ['color' => ['rgb' => 'FFFFFF']],
                    'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => '0D9488']],
                ]);
                $sheet->getStyle("A{$fr}:AK{$fr}")->applyFromArray([
                    'font' => ['bold' => true],
                    'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => 'F1F5F9']],
                ]);
                $sheet->getStyle("A1:AK{$fr}")->applyFromArray([
                    'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'CBD5E1']]],
                ]);
                $sheet->freezePane('C5');
                $sheet->getRowDimension(1)->setRowHeight(30);
                $sheet->getRowDimension(4)->setRowHeight(18);
            },
        ];
    }

    protected static function col(int $i): string
    {
        $s = '';
        while ($i > 0) {
            $m = ($i - 1) % 26;
            $s = chr(65 + $m).$s;
            $i = intdiv($i - 1, 26);
        }

        return $s;
    }
}
