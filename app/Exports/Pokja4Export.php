<?php

namespace App\Exports;

use App\Models\Pokja4;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class Pokja4Export implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnWidths, WithTitle
{
    protected $tahun;

    public function __construct($tahun = '2025')
    {
        $this->tahun = $tahun;
    }

    // ✅ FIX: Filter by tahun
    public function collection()
    {
        return Pokja4::where('tahun', $this->tahun)
            ->orderBy('kecamatan')
            ->get();
    }

    public function headings(): array
    {
        return [
            // Grup 1 — Header Utama
            ['DATA KEGIATAN POKJA IV', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['TP. PKK KABUPATEN TASIKMALAYA — TAHUN ' . $this->tahun, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            // Header kolom
            ['NO', 'KECAMATAN', 'KADER KES.', 'GIZI', 'KESLING', 'PHBS', 'KB', 'POSYANDU', 'IMUNISASI', 'PKG', 'TBC', 'JAMBAN', 'SPAL', 'TPS', 'MCK', 'AIR PDAM', 'AIR SUMUR', 'AIR LAIN', 'PUS', 'WUS', 'KB L', 'KB P', 'TABUNGAN', 'ASURANSI', 'PROGRAM KESEHATAN', 'PROGRAM LINGKUNGAN', 'PROGRAM PERENCANAAN'],
        ];
    }

    public function map($item): array
    {
        static $no = 1;

        return [
            $no++,
            $item->nama_kecamatan ?? $item->kecamatan ?? '-',
            $item->kader_kesehatan ?? 0,
            $item->kader_gizi ?? 0,
            $item->kader_kesling ?? 0,
            $item->kader_phbs ?? 0,
            $item->kader_kb ?? 0,
            $item->posyandu ?? 0,
            $item->imunisasi ?? 0,
            $item->pkg ?? 0,
            $item->tbc ?? 0,
            $item->jamban_keluarga ?? 0,
            $item->spal ?? 0,
            $item->tps ?? 0,
            $item->mck ?? 0,
            $item->air_pdam ?? 0,
            $item->air_sumur ?? 0,
            $item->air_lainnya ?? 0,
            $item->jumlah_pus ?? 0,
            $item->jumlah_wus ?? 0,
            $item->akseptor_kb_l ?? 0,
            $item->akseptor_kb_p ?? 0,
            $item->tabungan_keluarga ?? 0,
            $item->asuransi_kesehatan ?? 0,
            $item->program_kesehatan ?? '-',
            $item->program_lingkungan ?? '-',
            $item->program_perencanaan ?? '-',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        // Merge judul
        $sheet->mergeCells('A1:AA1');
        $sheet->mergeCells('A2:AA2');

        // Style judul
        $sheet->getStyle('A1')->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 14,
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ]);

        $sheet->getStyle('A2')->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 12,
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ]);

        // Style header kolom
        $sheet->getStyle('A3:AA3')->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 10,
                'color' => ['rgb' => 'FFFFFF'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
                'wrapText' => true,
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '0072BC'],
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => '000000'],
                ],
            ],
        ]);

        // Style semua data
        $sheet->getStyle('A4:AA' . ($sheet->getHighestRow()))->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => '000000'],
                ],
            ],
            'alignment' => [
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ]);

        return [];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 5,
            'B' => 20,
            'C' => 12,
            'D' => 10,
            'E' => 12,
            'F' => 10,
            'G' => 8,
            'H' => 12,
            'I' => 12,
            'J' => 10,
            'K' => 8,
            'L' => 10,
            'M' => 10,
            'N' => 8,
            'O' => 8,
            'P' => 12,
            'Q' => 12,
            'R' => 12,
            'S' => 8,
            'T' => 8,
            'U' => 8,
            'V' => 8,
            'W' => 12,
            'X' => 12,
            'Y' => 12,
            'Z' => 12,
            'AA' => 12,
        ];
    }

    public function title(): string
    {
        return 'Pokja IV';
    }
}
