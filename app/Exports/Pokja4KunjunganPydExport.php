<?php

namespace App\Exports;

use App\Models\Pokja4KunjunganPyd;
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

class Pokja4KunjunganPydExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize, WithColumnWidths, WithTitle
{
    protected $tahun;

    public function __construct($tahun = null)
    {
        $this->tahun = $tahun ?? date('Y');
    }

    public function collection()
    {
        return Pokja4KunjunganPyd::where('tahun', $this->tahun)
            ->orderBy('kecamatan')
            ->orderBy('bulan')
            ->get();
    }

    public function headings(): array
    {
        return [
            ['DATA KUNJUNGAN PYD POKJA IV', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['TP. PKK KABUPATEN TASIKMALAYA — TAHUN ' . $this->tahun, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['NO', 'KECAMATAN', 'BULAN', 'BAYI 0-12 (L)', 'BAYI 0-12 (P)', 'BALITA 1-5 (L)', 'BALITA 1-5 (P)', 'WUS', 'PUS', 'IBU HAMIL', 'IBU MENYUSUI', 'BAYI LAHIR', 'BAYI MENINGGAL', 'KEMATIAN IBU', 'KADER', 'PLKB', 'MEDIS', 'KET.'],
        ];
    }

    public function map($item): array
    {
        static $no = 1;

        return [
            $no++,
            $item->kecamatan ?? '-',
            $item->nama_bulan ?? $item->bulan ?? '-',
            $item->bayi_0_12_l ?? 0,
            $item->bayi_0_12_p ?? 0,
            $item->balita_1_5_l ?? 0,
            $item->balita_1_5_p ?? 0,
            $item->wus ?? 0,
            $item->pus ?? 0,
            $item->ibu_hamil ?? 0,
            $item->ibu_menyusui ?? 0,
            $item->bayi_lahir ?? 0,
            $item->bayi_meninggal ?? 0,
            $item->kematian_ibu ?? 0,
            $item->petugas_kader ?? 0,
            $item->petugas_plkb ?? 0,
            $item->petugas_medis ?? 0,
            $item->keterangan ?? '-',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $last = 'R';
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
        return 'Kunjungan PYD';
    }
}
