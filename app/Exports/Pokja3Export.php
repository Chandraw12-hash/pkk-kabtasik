<?php

namespace App\Exports;

use App\Models\Pokja3;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class Pokja3Export implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected ?string $search;

    public function __construct(?string $search = null)
    {
        $this->search = $search;
    }

    public function collection()
    {
        return Pokja3::query()
            ->when($this->search, function ($query, $search) {
                $query->where('nama_kecamatan', 'like', "%{$search}%")
                      ->orWhere('kecamatan', 'like', "%{$search}%")
                      ->orWhere('kategori', 'like', "%{$search}%");
            })
            ->latest()
            ->get();
    }

    public function headings(): array
    {
        return [
            'No',
            'Kecamatan',
            'Nama Kecamatan',
            'Kategori',
            'Rumah Sehat',
            'Rumah Tidak Sehat',
            'Pemanfaatan Pekarangan',
            'Industri Rumah Tangga',
            'Tanggal Input',
        ];
    }

    public function map($row): array
    {
        static $no = 0;
        $no++;

        return [
            $no,
            $row->kecamatan ?? '-',
            $row->nama_kecamatan ?? $row->kecamatan ?? '-',
            $row->kategori ?? '-',
            $row->rumah_sehat ?? 0,
            $row->rumah_tidak_sehat ?? 0,
            $row->pemanfaatan_pekarangan ?? 0,
            $row->industri_rumah_tangga ?? 0,
            $row->created_at ? $row->created_at->format('d/m/Y H:i') : '-',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => [
                    'bold' => true,
                    'color' => ['rgb' => 'FFFFFF'],
                ],
                'fill' => [
                    'fillType' => 'solid',
                    'startColor' => ['rgb' => '0D9488'],
                ],
                'alignment' => [
                    'horizontal' => 'center',
                    'vertical' => 'center',
                ],
            ],
        ];
    }
}
