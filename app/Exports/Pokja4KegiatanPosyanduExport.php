<?php

namespace App\Exports;

use App\Models\Pokja4KegiatanPosyandu;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class Pokja4KegiatanPosyanduExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize, WithColumnWidths, WithTitle
{
    protected $tahun;

    protected const KOLOM = [
        'ibu_hamil', 'ibu_hamil_diperiksa', 'ibu_hamil_dapat_fe', 'menyusui',
        'kb_iud', 'kb_mow', 'kb_mop', 'kb_implan', 'kb_pil', 'kb_suntik', 'kb_kondom',
        'balita_l', 'balita_p', 'balita_kia_l', 'balita_kia_p',
        'balita_ditimbang_l', 'balita_ditimbang_p', 'balita_naik_l', 'balita_naik_p',
        'vit_a_1', 'vit_a_2',
        'imunisasi_tt_1', 'imunisasi_tt_2', 'imunisasi_bcg',
        'imunisasi_dpt_1', 'imunisasi_dpt_2', 'imunisasi_dpt_3',
        'imunisasi_polio_1', 'imunisasi_polio_2', 'imunisasi_polio_3', 'imunisasi_polio_4',
        'imunisasi_campak',
        'imunisasi_hepatitis_1', 'imunisasi_hepatitis_2', 'imunisasi_hepatitis_3',
        'balita_diare', 'balita_oralit',
    ];

    public function __construct($tahun = null)
    {
        $this->tahun = $tahun ?? date('Y');
    }

    public function collection()
    {
        return Pokja4KegiatanPosyandu::where('tahun', $this->tahun)
            ->orderBy('kecamatan')
            ->orderBy('bulan')
            ->get();
    }

    public function headings(): array
    {
        $w = array_fill(0, 40, '');
        $h3 = array_merge(
            ['NO', 'KECAMATAN', 'BULAN'],
            array_map(fn ($k) => strtoupper(str_replace('_', ' ', $k)), self::KOLOM),
            ['KET.']
        );

        return [
            array_merge(['DATA KEGIATAN POSYANDU POKJA IV'], $w),
            array_merge(['TP. PKK KABUPATEN TASIKMALAYA — TAHUN ' . $this->tahun], $w),
            $h3,
        ];
    }

    public function map($item): array
    {
        static $no = 1;

        $out = [$no++, $item->kecamatan ?? '-', $item->nama_bulan ?? $item->bulan ?? '-'];
        foreach (self::KOLOM as $k) {
            $out[] = $item->{$k} ?? 0;
        }
        $out[] = $item->keterangan ?? '-';

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
        return ['A' => 5, 'B' => 20, 'C' => 14];
    }

    public function title(): string
    {
        return 'Kegiatan Posyandu';
    }
}
