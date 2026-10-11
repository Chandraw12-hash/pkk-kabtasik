<?php

namespace App\Exports;

use App\Models\Pokja4Rekapitulasi;
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

class Pokja4RekapitulasiExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize, WithColumnWidths, WithTitle
{
    protected $tahun;

    public function __construct($tahun = null)
    {
        $this->tahun = $tahun ?? date('Y');
    }

    public function collection()
    {
        return Pokja4Rekapitulasi::where('tahun', $this->tahun)
            ->orderBy('kecamatan')
            ->get();
    }

    public function headings(): array
    {
        return [
            ['DATA REKAPITULASI POKJA IV', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['TP. PKK KABUPATEN TASIKMALAYA — TAHUN ' . $this->tahun, '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['NO', 'KECAMATAN', 'IBU HAMIL', 'MELAHIRKAN', 'NIFAS', 'MENINGGAL', 'BAYI LAHIR (L)', 'BAYI LAHIR (P)', 'AKTE ADA', 'AKTE TIDAK', 'BAYI MENINGGAL (L)', 'BAYI MENINGGAL (P)', 'BALITA MENINGGAL (L)', 'BALITA MENINGGAL (P)', 'KET.'],
        ];
    }

    public function map($item): array
    {
        static $no = 1;

        return [
            $no++,
            $item->kecamatan ?? '-',
            $item->ibu_hamil ?? 0,
            $item->ibu_melahirkan ?? 0,
            $item->ibu_nifas ?? 0,
            $item->ibu_meninggal ?? 0,
            $item->bayi_lahir_l ?? 0,
            $item->bayi_lahir_p ?? 0,
            $item->akte_ada ?? 0,
            $item->akte_tidak ?? 0,
            $item->bayi_meninggal_l ?? 0,
            $item->bayi_meninggal_p ?? 0,
            $item->balita_meninggal_l ?? 0,
            $item->balita_meninggal_p ?? 0,
            $item->keterangan ?? '-',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $last = 'O';
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
        return 'Rekapitulasi';
    }
}
