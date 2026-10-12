<?php

namespace App\Exports;

use App\Models\Kader;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class KaderExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize, WithColumnWidths, WithTitle
{
    protected ?string $search;

    protected ?string $pokja;

    public function __construct(?string $search = null, ?string $pokja = null)
    {
        $this->search = $search;
        $this->pokja = $pokja;
    }

    public function collection()
    {
        return Kader::query()
            ->with(['user:id,username'])
            ->when($this->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                        ->orWhere('kecamatan', 'like', "%{$search}%")
                        ->orWhere('desa_kelurahan', 'like', "%{$search}%")
                        ->orWhere('nik', 'like', "%{$search}%")
                        ->orWhere('jabatan', 'like', "%{$search}%");
                });
            })
            ->when($this->pokja, function ($query, $pokja) {
                $query->where('pokja', $pokja);
            })
            ->orderBy('kecamatan', 'asc')
            ->orderBy('desa_kelurahan', 'asc')
            ->orderBy('nama', 'asc')
            ->get();
    }

    public function headings(): array
    {
        $row1 = array_merge(['DATA KADER PKK'], array_fill(0, 10, ''));
        $row2 = array_merge(['TP. PKK KABUPATEN TASIKMALAYA'], array_fill(0, 10, ''));

        $filter = [];
        if ($this->pokja) {
            $filter[] = 'Filter Pokja: ' . ($this->pokja === 'DASAWISMA' ? 'Dasawisma' : 'Pokja ' . $this->pokja);
        }
        if ($this->search) {
            $filter[] = 'Cari: ' . $this->search;
        }
        $row3 = array_merge(
            [$filter !== [] ? implode(' • ', $filter) : 'Semua data'],
            array_fill(0, 10, '')
        );

        $row4 = ['NO', 'NAMA', 'NIK', 'JABATAN', 'POKJA', 'KECAMATAN', 'DESA/KELURAHAN', 'NO HP', 'STATUS', 'AKUN', 'TGL BERGABUNG'];

        return [$row1, $row2, $row3, $row4];
    }

    public function map($row): array
    {
        static $no = 0;
        $no++;

        return [
            $no,
            $row->nama ?? '-',
            $row->nik ?? '-',
            $row->jabatan ?? '-',
            $row->pokja === 'DASAWISMA'
                ? 'Dasawisma'
                : ($row->pokja === 'Sekretariat'
                    ? 'Sekretariat'
                    : ($row->pokja ? 'Pokja ' . $row->pokja : '-')),
            $row->kecamatan ?? '-',
            $row->desa_kelurahan ?? '-',
            $row->no_hp ?? '-',
            $row->status_aktif ? 'Aktif' : 'Nonaktif',
            $row->user->username ?? 'Belum ada',
            $row->tanggal_bergabung ? date('d-m-Y', strtotime($row->tanggal_bergabung)) : '-',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $last = $sheet->getHighestColumn();
        $sheet->mergeCells("A1:{$last}1");
        $sheet->mergeCells("A2:{$last}2");
        $sheet->mergeCells("A3:{$last}3");

        $sheet->getStyle('A1')->applyFromArray([
            'font' => ['bold' => true, 'size' => 14],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
        ]);
        $sheet->getStyle('A2')->applyFromArray([
            'font' => ['bold' => true, 'size' => 12],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
        ]);
        $sheet->getStyle('A3')->applyFromArray([
            'font' => ['italic' => true, 'size' => 10],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
        ]);
        $sheet->getStyle("A4:{$last}4")->applyFromArray([
            'font' => ['bold' => true, 'size' => 10, 'color' => ['rgb' => 'FFFFFF']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER, 'wrapText' => true],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '0072BC']],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => '000000']]],
        ]);
        $sheet->getStyle("A5:{$last}" . $sheet->getHighestRow())->applyFromArray([
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => '000000']]],
            'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
        ]);

        return [];
    }

    public function columnWidths(): array
    {
        return ['A' => 5, 'B' => 28, 'C' => 20];
    }

    public function title(): string
    {
        return 'Data Kader';
    }
}
