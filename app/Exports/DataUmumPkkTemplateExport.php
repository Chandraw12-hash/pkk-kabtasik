<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class DataUmumPkkTemplateExport implements FromArray, WithHeadings, WithStyles, ShouldAutoSize
{
    public function array(): array
    {
        // Baris contoh — biar admin desa tahu formatnya
        return [
            [
                'Dusun 1', 1, 1, 1, 10, 10, 25, 25, 0, 2,
                0, 2, 0, 1, 0, 0, 0, 0,
            ],
            [
                'Dusun 2', 1, 1, 1, 15, 15, 30, 28, 0, 2,
                0, 3, 0, 1, 0, 0, 0, 0,
            ],
        ];
    }

    public function headings(): array
    {
        return [
            'dusun',
            'jumlah_dusun',
            'pkk_rw',
            'pkk_rt',
            'dasa_wisma',
            'krt',
            'kk',
            'jiwa_l',
            'jiwa_p',
            'tp_pkk_l',
            'tp_pkk_p',
            'kader_umum_l',
            'kader_umum_p',
            'kader_khusus_l',
            'kader_khusus_p',
            'sekretariat_honorer_l',
            'sekretariat_honorer_p',
            'sekretariat_bantuan_l',
            'sekretariat_bantuan_p',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => [
                    'fillType' => 'solid',
                    'startColor' => ['rgb' => '0D9488'],
                ],
                'alignment' => ['horizontal' => 'center', 'vertical' => 'center'],
            ],
        ];
    }
}