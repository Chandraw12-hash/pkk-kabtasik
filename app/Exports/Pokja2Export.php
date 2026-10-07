<?php

namespace App\Exports;

use App\Models\Pokja2;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class Pokja2Export implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected ?string $search;

    public function __construct(?string $search = null)
    {
        $this->search = $search;
    }

    public function collection()
    {
        return Pokja2::query()
            ->when($this->search, function ($query, $search) {
                $query->where('kecamatan', 'like', "%{$search}%")
                      ->orWhere('nama_kecamatan', 'like', "%{$search}%")
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
            'Jumlah Kader',
            'Kader Khusus BKB',
            'Kader Khusus Koperasi',
            'Kader Khusus Keterampilan',
            'Kelompok BKB',
            'Kelompok UP2K',
            'Kelompok Usaha Bersama',
            'Jumlah Koperasi',
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
            $row->jumlah_kader ?? 0,
            $row->kader_khusus_bkb ?? 0,
            $row->kader_khusus_koperasi ?? 0,
            $row->kader_khusus_keterampilan ?? 0,
            $row->kelompok_bkb ?? 0,
            $row->kelompok_up2k ?? 0,
            $row->kelompok_usaha_bersama ?? 0,
            $row->jumlah_koperasi ?? 0,
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
