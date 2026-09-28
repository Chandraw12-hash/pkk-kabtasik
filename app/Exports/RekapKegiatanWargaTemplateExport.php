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
    private const TOTAL_COLS = 35; // A..AI

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
            'B' => NumberFormat::FORMAT_TEXT, // Nama Dusun
            'C' => NumberFormat::FORMAT_TEXT, // RW
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();

                // ============================================================
                // HEADER — 35 kolom (A..AI). 1 baris Excel = 1 RW
                // Urutan HARUS sama dengan peta kolom di RekapKegiatanWargaImport
                // ============================================================
                $headerRow1 = [
                    'No.',                              // A  (0)
                    'Nama Dusun',                       // B  (1)
                    'RW',                               // C  (2)
                    'Jumlah RT',                        // D  (3)
                    'Jumlah Dasa Wisma',                // E  (4)
                    'Jumlah KRT',                       // F  (5)
                    'Jumlah KK',                        // G  (6)
                    'Jumlah Anggota Keluarga', '',      // H-I  (7-8)
                    'Balita', '',                       // J-K  (9-10)
                    'PUS',                              // L  (11)
                    'WUS',                              // M  (12)
                    'Ibu Hamil',                        // N  (13)
                    'Ibu Menyusui',                     // O  (14)
                    'Lansia',                           // P  (15)
                    '3 Buta', '',                       // Q-R  (16-17)
                    'Kriteria Rumah', '', '', '', '',   // S-W  (18-22)
                    'Sumber Air Keluarga', '', '', '',  // X-AA (23-26)
                    'Jumlah Jamban Keluarga',           // AB (27)
                    'Makanan', '',                      // AC-AD (28-29)
                    'Warga Mengikuti Kegiatan', '', '', '', // AE-AH (30-33)
                    'Ket',                              // AI (34)
                ];

                $headerRow2 = [
                    '', '', '', '', '', '', '',         // A-G
                    'Total L', 'Total P',               // H-I
                    'Balita L', 'Balita P',             // J-K
                    '', '', '', '', '',                 // L-P
                    'L', 'P',                           // Q-R
                    'Sehat', 'Kurang Sehat', 'Sampah', 'SPAL', 'Stiker P4K', // S-W
                    'PDAM', 'Sumur', 'Sungai', 'DLL',   // X-AA
                    '',                                 // AB
                    'Pokok Beras', 'Non Beras',         // AC-AD
                    'UP2K', 'Tanah Pekarangan', 'Industri RT', 'Kesling', // AE-AH
                    '',                                 // AI
                ];

                assert(count($headerRow1) === self::TOTAL_COLS, 'headerRow1 harus 35 kolom');
                assert(count($headerRow2) === self::TOTAL_COLS, 'headerRow2 harus 35 kolom');

                foreach ($headerRow1 as $col => $value) {
                    $sheet->setCellValueByColumnAndRow($col + 1, 1, $value);
                }
                foreach ($headerRow2 as $col => $value) {
                    $sheet->setCellValueByColumnAndRow($col + 1, 2, $value);
                }

                // ============================================================
                // CONTOH DATA — 5 baris RW (hapus sebelum upload data asli)
                // No | Dusun | RW | Jml RT | Dasa Wisma | KRT | KK |
                // Total L | Total P | Balita L | Balita P | PUS | WUS | Ibu Hamil | Ibu Menyusui |
                // Lansia | Buta L | Buta P | Sehat | Kurang Sehat | Sampah | SPAL | Stiker P4K |
                // PDAM | Sumur | Sungai | DLL | Jamban | Pokok Beras | Non Beras |
                // UP2K | Tanah Pekarangan | Industri RT | Kesling | Ket
                // ============================================================
                $contohData = [
                    [1, 'Bojongsari', '1', 4, 8, 150, 160, 270, 260, 20, 18, 40, 110, 3, 4, 45, 0, 0, 120, 30, 140, 130, 110, 60, 85, 5, 0, 150, 155, 5, 12, 40, 6, 18, ''],
                    [2, 'Bojongsari', '2', 3, 6, 120, 130, 220, 215, 15, 14, 32, 90, 2, 3, 38, 0, 0, 100, 20, 115, 105, 90, 50, 70, 5, 0, 120, 125, 5, 10, 32, 5, 14, ''],
                    [3, 'Cikuya', '1', 4, 7, 140, 150, 250, 245, 18, 16, 36, 100, 2, 4, 42, 1, 0, 110, 30, 130, 120, 100, 55, 80, 5, 0, 140, 145, 5, 11, 36, 6, 16, ''],
                    [4, 'Cikuya', '2', 3, 5, 110, 115, 200, 195, 14, 12, 30, 85, 1, 2, 35, 0, 1, 95, 15, 100, 95, 80, 45, 65, 5, 0, 110, 112, 3, 8, 28, 4, 12, ''],
                    [5, 'Cintabodas', '1', 5, 9, 170, 180, 310, 300, 22, 20, 45, 125, 4, 5, 50, 0, 0, 140, 30, 160, 150, 125, 70, 95, 5, 0, 170, 175, 5, 14, 45, 7, 20, ''],
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
                foreach (['A', 'B', 'C', 'D', 'E', 'F', 'G', 'L', 'M', 'N', 'O', 'P', 'AB', 'AI'] as $col) {
                    $sheet->mergeCells("{$col}1:{$col}2");
                }
                $sheet->mergeCells('H1:I1');   // Jumlah Anggota Keluarga
                $sheet->mergeCells('J1:K1');   // Balita
                $sheet->mergeCells('Q1:R1');   // 3 Buta
                $sheet->mergeCells('S1:W1');   // Kriteria Rumah
                $sheet->mergeCells('X1:AA1');  // Sumber Air
                $sheet->mergeCells('AC1:AD1'); // Makanan
                $sheet->mergeCells('AE1:AH1'); // Kegiatan

                // ============================================================
                // STYLE HEADER
                // ============================================================
                $lastCol = 'AI';

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

                // Baris contoh (3-7) abu-abu miring
                $sheet->getStyle("A3:{$lastCol}7")->applyFromArray([
                    'font' => ['italic' => true, 'color' => ['rgb' => '9CA3AF']],
                ]);

                // Nama Dusun & RW sebagai teks
                $sheet->getStyle("B3:C{$lastRow}")
                    ->getNumberFormat()
                    ->setFormatCode(NumberFormat::FORMAT_TEXT);

                // Freeze sampai kolom RW, supaya identitas dusun/RW tetap terlihat saat scroll
                $sheet->freezePane('D3');
            },
        ];
    }
}
