<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

class RekapKegiatanWargaTemplateExport implements
    FromArray,
    WithTitle,
    WithColumnFormatting,
    WithEvents,
    ShouldAutoSize
{
    private const MAX_ROWS = 500;
    private const TOTAL_COLS = 37; // A..AK

    public function title(): string
    {
        return 'Data Kegiatan';
    }

    public function array(): array
    {
        return [];
    }

    public function columnFormats(): array
    {
        return [
            'C' => NumberFormat::FORMAT_TEXT,  // RW
            'D' => NumberFormat::FORMAT_TEXT,  // RT
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();

                // ============================================================
                // HEADER — 37 kolom (A..AK). 1 baris Excel = 1 RT
                // ============================================================
                $headerRow1 = [
                    'No.',                              // A  (0)
                    'Nama Dusun',                       // B  (1)
                    'RW',                               // C  (2)
                    'RT',                               // D  (3)
                    'Jumlah Dusun',                     // E  (4)
                    'Jumlah RW',                        // F  (5)
                    'Jumlah RT',                        // G  (6)
                    'Jumlah Dasa Wisma',                // H  (7)
                    'Jumlah KRT',                       // I  (8)
                    'Jumlah KK',                        // J  (9)
                    'Jumlah Anggota Keluarga', '',      // K-L  (10-11)
                    'Balita', '',                       // M-N  (12-13)
                    'PUS',                              // O  (14)
                    'WUS',                              // P  (15)
                    'Ibu Hamil',                        // Q  (16)
                    'Ibu Menyusui',                     // R  (17)
                    'Lansia',                           // S  (18)
                    '3 Buta', '',                       // T-U  (19-20)
                    'Kriteria Rumah', '', '', '', '',   // V-Z  (21-25)
                    'Sumber Air Keluarga', '', '', '',  // AA-AD (26-29)
                    'Jumlah Jamban Keluarga',           // AE (30)
                    'Makanan', '',                      // AF-AG (31-32)
                    'Warga Mengikuti Kegiatan', '', '', '', // AH-AK (33-36)
                ];

                $headerRow2 = [
                    // 0-9: A-J
                    '', '', '', '', '', '', '', '', '', '',
                    // 10-11: K-L
                    'Total L', 'Total P',
                    // 12-13: M-N
                    'Balita L', 'Balita P',
                    // 14-18: O-S
                    '', '', '', '', '',
                    // 19-20: T-U
                    'L', 'P',
                    // 21-25: V-Z
                    'Sehat', 'Kurang Sehat', 'Sampah', 'SPAL', 'Stiker P4K',
                    // 26-29: AA-AD
                    'PDAM', 'Sumur', 'Sungai', 'DLL',
                    // 30: AE
                    '',
                    // 31-32: AF-AG
                    'Pokok Beras', 'Non Beras',
                    // 33-36: AH-AK
                    'UP2K', 'Tanah Pekarangan', 'Industri RT', 'Kesling',
                ];

                assert(count($headerRow1) === self::TOTAL_COLS, 'headerRow1 harus 37 kolom');
                assert(count($headerRow2) === self::TOTAL_COLS, 'headerRow2 harus 37 kolom');

                foreach ($headerRow1 as $col => $value) {
                    $sheet->setCellValueByColumnAndRow($col + 1, 1, $value);
                }
                foreach ($headerRow2 as $col => $value) {
                    $sheet->setCellValueByColumnAndRow($col + 1, 2, $value);
                }

                // ============================================================
                // CONTOH DATA — 5 baris — 37 kolom
                // ============================================================
                $contohData = [
                    [1, 'Dusun 1', '01', '01', 1, 1, 1, 10, 10, 25, 25, 20, 2, 2, 2, 5, 1, 1, 3, 0, 0, 15, 10, 20, 18, 15, 5, 18, 2, 0, 20, 22, 3, 5, 15, 3, 8],
                    [2, 'Dusun 1', '01', '02', 1, 1, 1, 12, 12, 30, 28, 24, 3, 2, 3, 6, 2, 1, 4, 0, 0, 18, 12, 24, 20, 18, 6, 22, 2, 0, 24, 26, 4, 6, 18, 4, 10],
                    [3, 'Dusun 2', '01', '01', 1, 1, 1, 8, 8, 20, 19, 21, 2, 3, 2, 4, 1, 2, 2, 0, 0, 12, 8, 16, 14, 12, 4, 14, 2, 0, 16, 18, 2, 4, 12, 2, 6],
                    [4, 'Dusun 2', '01', '02', 1, 1, 1, 10, 10, 26, 24, 27, 2, 2, 3, 5, 1, 0, 5, 1, 1, 16, 10, 20, 16, 14, 5, 18, 3, 0, 20, 20, 4, 5, 14, 3, 8],
                    [5, 'Dusun 3', '02', '01', 1, 1, 1, 11, 11, 28, 27, 25, 3, 2, 2, 6, 1, 2, 3, 0, 0, 17, 11, 22, 18, 16, 6, 20, 2, 0, 22, 24, 3, 6, 16, 4, 9],
                ];

                $rowStart = 3;
                foreach ($contohData as $r => $row) {
                    foreach ($row as $c => $value) {
                        $sheet->setCellValueByColumnAndRow($c + 1, $rowStart + $r, $value);
                    }
                }

                // ============================================================
                // MERGE HEADER
                // ============================================================
                foreach (['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'O', 'P', 'Q', 'R', 'S', 'AE'] as $col) {
                    $sheet->mergeCells("{$col}1:{$col}2");
                }
                $sheet->mergeCells('K1:L1');
                $sheet->mergeCells('M1:N1');
                $sheet->mergeCells('T1:U1');
                $sheet->mergeCells('V1:Z1');
                $sheet->mergeCells('AA1:AD1');
                $sheet->mergeCells('AF1:AG1');
                $sheet->mergeCells('AH1:AK1');

                // ============================================================
                // STYLE HEADER
                // ============================================================
                $lastCol = 'AK';

                $sheet->getStyle("A1:{$lastCol}2")->applyFromArray([
                    'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF'], 'size' => 10],
                    'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '7C3AED']],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                        'wrapText' => true,
                    ],
                    'borders' => [
                        'allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'FFFFFF']],
                    ],
                ]);

                $sheet->getRowDimension(1)->setRowHeight(35);
                $sheet->getRowDimension(2)->setRowHeight(25);

                // ============================================================
                // STYLE DATA
                // ============================================================
                $lastRow = self::MAX_ROWS + 2;

                $sheet->getStyle("A3:{$lastCol}{$lastRow}")->applyFromArray([
                    'borders' => [
                        'allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E5E7EB']],
                    ],
                ]);

                $sheet->getStyle("A3:{$lastCol}7")->applyFromArray([
                    'font' => ['italic' => true, 'color' => ['rgb' => '9CA3AF']],
                ]);

                $sheet->getStyle("C3:D{$lastRow}")
                    ->getNumberFormat()
                    ->setFormatCode(NumberFormat::FORMAT_TEXT);

                $sheet->freezePane('E3');
            },
        ];
    }
}
