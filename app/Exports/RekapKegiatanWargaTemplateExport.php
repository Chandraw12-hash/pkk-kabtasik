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
 * Template Excel untuk import Rekap Kegiatan Warga.
 *
 * Format agregat — sesuai Excel PKK (Kegiatan RT/RW/Dusun/Desa).
 *
 * Kolom:
 * A: dusun | B: rw | C: rt | D: jumlah_dusun | E: jumlah_rw | F: jumlah_rt
 * G: dasa_wisma | H: krt | I: kk | J: total_l | K: total_p
 * L: balita_l | M: balita_p | N: pus | O: wus | P: ibu_hamil | Q: ibu_menyusui
 * R: lansia | S: buta_l | T: buta_p
 * U: rumah_sehat | V: rumah_kurang_sehat | W: tempat_sampah | X: spal | Y: stiker_p4k
 * Z: pdam | AA: sumur | AB: sungai | AC: air_dll | AD: jamban
 * AE: pokok_beras | AF: non_beras | AG: up2k | AH: tanah_pekarangan
 * AI: industri_rumah_tangga | AJ: kesehatan_lingkungan
 */
class RekapKegiatanWargaTemplateExport implements
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
        return 'Template Kegiatan';
    }

    public function headings(): array
    {
        return [
            'dusun',
            'rw',
            'rt',
            'jumlah_dusun',
            'jumlah_rw',
            'jumlah_rt',
            'dasa_wisma',
            'krt',
            'kk',
            'total_l',
            'total_p',
            'balita_l',
            'balita_p',
            'pus',
            'wus',
            'ibu_hamil',
            'ibu_menyusui',
            'lansia',
            'buta_l',
            'buta_p',
            'rumah_sehat',
            'rumah_kurang_sehat',
            'tempat_sampah',
            'spal',
            'stiker_p4k',
            'pdam',
            'sumur',
            'sungai',
            'air_dll',
            'jamban',
            'pokok_beras',
            'non_beras',
            'up2k',
            'tanah_pekarangan',
            'industri_rumah_tangga',
            'kesehatan_lingkungan',
        ];
    }

    public function array(): array
    {
        // Baris contoh — angka rekap
        return [
            [
                'Dusun 1', '01', '01',
                1, 1, 1, 10, 10, 25, 25, 0,
                2, 0, 2, 0, 1, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0,
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
                $lastCol = 'AJ';

                // Header — ungu
                $sheet->getStyle("A1:{$lastCol}1")->applyFromArray([
                    'font' => [
                        'bold' => true,
                        'color' => ['rgb' => 'FFFFFF'],
                        'size' => 10,
                    ],
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => '7C3AED'],
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