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

/**
 * PENTING: urutan & jumlah kolom di sini HARUS SAMA PERSIS dengan
 * konstanta COL_* di App\Imports\RekapKegiatanWargaImport. Kalau nambah/
 * hapus/geser kolom di sini, WAJIB update juga importer-nya.
 *
 * Total kolom: 36 (A sampai AJ). $headerRow1 dan $headerRow2 di bawah
 * masing-masing WAJIB punya persis 36 elemen — sebelumnya ada bug di
 * mana array ini kelebihan 2 elemen kosong sehingga semua kolom setelah
 * "Balita" geser 2 posisi dari merge-nya.
 */
class RekapKegiatanWargaTemplateExport implements
    FromArray,
    WithTitle,
    WithColumnFormatting,
    WithEvents,
    ShouldAutoSize
{
    private const MAX_ROWS = 500;

    public function title(): string
    {
        return 'Data Kegiatan';
    }

    public function array(): array
    {
        // Baris kosong — header & data dibuat manual di registerEvents()
        return [];
    }

    public function columnFormats(): array
    {
        return [
            'B' => NumberFormat::FORMAT_TEXT,
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();

                // ============================================================
                // HEADER — 36 kolom (A..AJ), index 0..35
                // ============================================================
                $headerRow1 = [
                    'No.',                          // A  (0)
                    'Nama Kecamatan',                // B  (1)
                    'Jumlah Dusun',                  // C  (2)
                    'Jumlah RW',                     // D  (3)
                    'Jumlah RT',                     // E  (4)
                    'Jumlah Dasa Wisma',              // F  (5)
                    'Jumlah KRT',                    // G  (6)
                    'Jumlah KK',                     // H  (7)
                    'Jumlah Anggota Keluarga', '',    // I-J  (8-9)
                    'Balita', '',                    // K-L  (10-11)
                    'PUS',                           // M  (12)
                    'WUS',                           // N  (13)
                    'Ibu Hamil',                     // O  (14)
                    'Ibu Menyusui',                  // P  (15)
                    'Lansia',                        // Q  (16)
                    '3 Buta', '',                    // R-S  (17-18)
                    'Kriteria Rumah', '', '', '', '', // T-X  (19-23)
                    'Sumber Air Keluarga', '', '', '', // Y-AB (24-27)
                    'Jumlah Jamban Keluarga',        // AC (28)
                    'Makanan', '',                   // AD-AE (29-30)
                    'Warga Mengikuti Kegiatan', '', '', '', // AF-AI (31-34)
                    'Ket',                           // AJ (35)
                ];

                $headerRow2 = [
                    '', '', '', '', '', '', '', '',  // A-H — tidak ada sub-header
                    'Total L', 'Total P',            // I-J
                    'Balita L', 'Balita P',          // K-L
                    '',                               // M (PUS)
                    '',                               // N (WUS)
                    '',                               // O (Ibu Hamil)
                    '',                               // P (Ibu Menyusui)
                    '',                               // Q (Lansia)
                    'L', 'P',                        // R-S (3 Buta)
                    'Sehat', 'Kurang Sehat', 'Sampah', 'SPAL', 'Stiker P4K', // T-X
                    'PDAM', 'Sumur', 'Sungai', 'DLL', // Y-AB
                    '',                               // AC (Jamban)
                    'Pokok Beras', 'Non Beras',       // AD-AE
                    'UP2K', 'Tanah Pekarangan', 'Industri RT', 'Kesling', // AF-AI
                    '',                               // AJ (Ket)
                ];

                // Sanity check saat development — jangan sampai lolos lagi ke prod
                assert(count($headerRow1) === 36, 'headerRow1 harus 36 kolom (A..AJ)');
                assert(count($headerRow2) === 36, 'headerRow2 harus 36 kolom (A..AJ)');

                foreach ($headerRow1 as $col => $value) {
                    $sheet->setCellValueByColumnAndRow($col + 1, 1, $value);
                }
                foreach ($headerRow2 as $col => $value) {
                    $sheet->setCellValueByColumnAndRow($col + 1, 2, $value);
                }

                // ============================================================
                // CONTOH DATA — 5 baris (dari baris 3), 36 kolom
                // ============================================================
                $contohData = [
                    ['Dusun 1', 1, 1, 1, 10, 10, 25, 25, 25, 0, 2, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
                    ['Dusun 2', 1, 1, 1, 12, 12, 30, 30, 28, 0, 3, 3, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
                    ['Dusun 3', 1, 1, 1, 8, 8, 20, 20, 19, 0, 2, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
                    ['Dusun 4', 1, 1, 1, 10, 10, 26, 26, 24, 0, 2, 3, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
                    ['Dusun 5', 1, 1, 1, 11, 11, 28, 28, 27, 0, 3, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ''],
                ];

                $rowStart = 3;
                foreach ($contohData as $r => $row) {
                    foreach ($row as $c => $value) {
                        $sheet->setCellValueByColumnAndRow($c + 1, $rowStart + $r, $value);
                    }
                }

                // ============================================================
                // MERGE HEADER — 36 kolom, A..AJ
                // ============================================================
                $sheet->mergeCells('A1:A2');   // No
                $sheet->mergeCells('B1:B2');   // Nama Kecamatan
                $sheet->mergeCells('C1:C2');   // Jumlah Dusun
                $sheet->mergeCells('D1:D2');   // Jumlah RW
                $sheet->mergeCells('E1:E2');   // Jumlah RT
                $sheet->mergeCells('F1:F2');   // Jumlah Dasa Wisma
                $sheet->mergeCells('G1:G2');   // Jumlah KRT
                $sheet->mergeCells('H1:H2');   // Jumlah KK
                $sheet->mergeCells('I1:J1');   // Jumlah Anggota Keluarga (Total L/P)
                $sheet->mergeCells('K1:L1');   // Balita (L/P)
                $sheet->mergeCells('M1:M2');   // PUS
                $sheet->mergeCells('N1:N2');   // WUS
                $sheet->mergeCells('O1:O2');   // Ibu Hamil
                $sheet->mergeCells('P1:P2');   // Ibu Menyusui
                $sheet->mergeCells('Q1:Q2');   // Lansia
                $sheet->mergeCells('R1:S1');   // 3 Buta (L/P)
                $sheet->mergeCells('T1:X1');   // Kriteria Rumah
                $sheet->mergeCells('Y1:AB1');  // Sumber Air Keluarga
                $sheet->mergeCells('AC1:AC2'); // Jumlah Jamban Keluarga
                $sheet->mergeCells('AD1:AE1'); // Makanan
                $sheet->mergeCells('AF1:AI1'); // Warga Mengikuti Kegiatan
                $sheet->mergeCells('AJ1:AJ2'); // Ket

                // ============================================================
                // STYLE HEADER
                // ============================================================
                $lastCol = 'AJ';

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
                // STYLE BARIS DATA
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

                $sheet->getStyle("B3:B{$lastRow}")
                    ->getNumberFormat()
                    ->setFormatCode(NumberFormat::FORMAT_TEXT);

                $sheet->freezePane('B3');
            },
        ];
    }
}
