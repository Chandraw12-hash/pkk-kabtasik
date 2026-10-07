<?php

namespace App\Exports;

use App\Models\Pokja1;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class Pokja1Export implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected ?string $search;

    public function __construct(?string $search = null)
    {
        $this->search = $search;
    }

    public function collection()
    {
        return Pokja1::query()
            ->when($this->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('judul_kegiatan', 'like', "%{$search}%")
                      ->orWhere('deskripsi', 'like', "%{$search}%")
                      ->orWhere('kecamatan', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->get();
    }

    public function headings(): array
    {
        return [
            'No',
            'Kecamatan',
            'Judul Kegiatan',
            'Kategori',
            'Tahun',
            'PKBN (L)',
            'PKBN (P)',
            'PKDRT (L)',
            'PKDRT (P)',
            'Pola Asuh (L)',
            'Pola Asuh (P)',
            'Lansia (L)',
            'Lansia (P)',
            'Kader Pokja 1 (L)',
            'Kader Pokja 1 (P)',
            'Kader Umum',
            'Kader Khusus',
            'Deskripsi',
        ];
    }

    public function map($row): array
    {
        static $no = 0;
        $no++;

        return [
            $no,
            $row->nama_kecamatan ?? $row->kecamatan ?? '-',
            $row->judul_kegiatan ?? '-',
            $row->kategori ?? '-',
            $row->tahun ?? '-',
            $row->pkbn_l ?? 0,
            $row->pkbn_p ?? 0,
            $row->pkdrt_l ?? 0,
            $row->pkdrt_p ?? 0,
            $row->pola_asuh_l ?? 0,
            $row->pola_asuh_p ?? 0,
            $row->lansia_l ?? 0,
            $row->lansia_p ?? 0,
            $row->kader_pokja1_l ?? 0,
            $row->kader_pokja1_p ?? 0,
            $row->kader_umum ?? 0,
            $row->kader_khusus ?? 0,
            $row->deskripsi ?? '-',
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
