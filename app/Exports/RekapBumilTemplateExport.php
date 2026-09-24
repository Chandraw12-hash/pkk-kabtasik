<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

/**
 * Template Excel untuk import Rekap Bumil.
 *
 * Format agregat — sesuai Excel PKK (Bumil RT/RW/Dusun/Desa).
 *
 * Kolom:
 * A: dusun | B: rw | C: rt | D: nama_dasawisma
 * E: jumlah_dusun | F: jumlah_rw | G: jumlah_rt | H: dasa_wisma
 * I: hamil | J: melahirkan | K: nifas | L: ibu_meninggal
 * M: bayi_lahir_l | N: bayi_lahir_p
 * O: akte_ada | P: akte_tidak_ada
 * Q: bayi_meninggal_l | R: bayi_meninggal_p
 * S: balita_meninggal_l | T: balita_meninggal_p
 */
class RekapBumilTemplateExport implements
    FromArray,
    WithHeadings,
    WithTitle,
    WithColumnFormatting,
    WithEvents,
    ShouldAutoSize
{
    private const MAX_ROWS = 500;

    public function title(): string
    {
        return 'Template Bumil';
    }

    public function headings(): array
    {
        return [
            'dusun',
            'rw',
            'rt',
            'nama_dasawisma',
            'jumlah_dusun',
            'jumlah_rw',
            'jumlah_rt',
            'dasa_wisma',
            'hamil',
            'melahirkan',
            'nifas',
            'ibu_meninggal',
            'bayi_lahir_l',
            'bayi_lahir_p',
            'akte_ada',
            'akte_tidak_ada',
            'bayi_meninggal_l',
            'bayi_meninggal_p',
            'balita_meninggal_l',
            'balita_meninggal_p',
        ];
    }

    /**
     * Satu baris contoh agar pengguna paham format pengisian.
     */
    public function array(): array
    {
        return [
            [
                'Dusun 1', '01', '01', 'Dasawisma A',
                1, 1, 1, 1,
                2, 1, 1, 0,
                1, 1, 1, 0,
                0, 0, 0, 0,
            ],
        ];
    }

    public function columnFormats(): array
    {
        return [
            'B' => NumberFormat::FORMAT_TEXT,
            'C' => NumberFormat::FORMAT_TEXT,
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $lastRow = self::MAX_ROWS + 1;
                $lastCol = 'T';

                // Header — pink
                $sheet->getStyle("A1:{$lastCol}1")->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'color' => ['rgb' => 'FFFFFF'],
                        'size' => 10,
                    ],
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'DB2777'],
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                        'wrapText' => true,
                    ],
                ]);
                $sheet->getRowDimension(1)->setRowHeight(30);

                // Border area data
                $sheet->getStyle("A1:{$lastCol}{$lastRow}")->applyFromArray([
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => Border::BORDER_THIN,
                            'color' => ['rgb' => 'E5E7EB'],
                        ],
                    ],
                ]);

                // Baris contoh: italic abu-abu
                $sheet->getStyle("A2:{$lastCol}2")->applyFromArray([
                    'font' => ['italic' => true, 'color' => ['rgb' => '9CA3AF']],
                ]);

                // Format teks untuk RW & RT
                $sheet->getStyle("B2:C{$lastRow}")
                    ->getNumberFormat()
                    ->setFormatCode(NumberFormat::FORMAT_TEXT);

                // Freeze header
                $sheet->freezePane('A2');
            },
        ];
    }
}