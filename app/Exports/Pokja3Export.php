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
            'Jumlah Kader',
            'Jumlah Kader P',
            'Kader Tata Laksana',
            'Makanan Pokok',
            'Makanan Non Beras',
            'Rumah Sehat',
            'Rumah Tidak Sehat',
            'Pemanfaatan Pekarangan',
            'Hatinya Pkk',
            'Peternakan',
            'Perikanan',
            'Warung Hidup',
            'Lumbung Hidup',
            'Toga',
            'Tanaman Keras',
            'Tanaman Lainnya',
            'Industri Rumah Tangga',
            'Industri Pangan',
            'Industri Sandang',
            'Industri Jasa',
            'Jumlah Rumah',
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
            $row->jumlah_kader_p ?? 0,
            $row->kader_tata_laksana ?? 0,
            $row->makanan_pokok ?? 0,
            $row->makanan_non_beras ?? 0,
            $row->rumah_sehat ?? 0,
            $row->rumah_tidak_sehat ?? 0,
            $row->pemanfaatan_pekarangan ?? 0,
            $row->hatinya_pkk ?? 0,
            $row->peternakan ?? 0,
            $row->perikanan ?? 0,
            $row->warung_hidup ?? 0,
            $row->lumbung_hidup ?? 0,
            $row->toga ?? 0,
            $row->tanaman_keras ?? 0,
            $row->tanaman_lainnya ?? 0,
            $row->industri_rumah_tangga ?? 0,
            $row->industri_pangan ?? 0,
            $row->industri_sandang ?? 0,
            $row->industri_jasa ?? 0,
            $row->jumlah_rumah ?? 0,
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
