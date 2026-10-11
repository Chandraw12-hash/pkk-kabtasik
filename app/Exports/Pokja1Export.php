<?php

namespace App\Exports;

use App\Models\Pokja1;
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

class Pokja1Export implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize, WithColumnWidths, WithTitle
{
    protected ?string $search;

    protected const PROGRAMS = ['kisah', 'kilas', 'krisan', 'kiat', 'kisak', 'pkbn'];

    protected const PROGRAM_LABELS = [
        'kisah' => 'KISAH',
        'kilas' => 'KILAS',
        'krisan' => 'KRISAN',
        'kiat' => 'KIAT',
        'kisak' => 'KISAK',
        'pkbn' => 'PKBN',
    ];

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
            ->orderBy('kecamatan', 'asc')
            ->get();
    }

    public function headings(): array
    {
        $row1 = array_merge(
            ['DATA KEGIATAN POKJA I'],
            array_fill(0, 29, '')
        );
        $row2 = array_merge(
            ['TP. PKK KABUPATEN TASIKMALAYA'],
            array_fill(0, 29, '')
        );
        $row3 = ['NO', 'KECAMATAN', 'TAHUN', 'KADER UMUM', 'KADER KHUSUS'];
        foreach (self::PROGRAMS as $p) {
            $row3[] = self::PROGRAM_LABELS[$p] . ' (KEGIATAN)';
            $row3[] = self::PROGRAM_LABELS[$p] . ' (VOLUME)';
            $row3[] = self::PROGRAM_LABELS[$p] . ' (METODE)';
            $row3[] = self::PROGRAM_LABELS[$p] . ' (SASARAN)';
        }
        $row3[] = 'KETERANGAN';

        return [$row1, $row2, $row3];
    }

    public function map($row): array
    {
        static $no = 0;
        $no++;

        $out = [
            $no,
            $row->nama_kecamatan ?? $row->kecamatan ?? '-',
            $row->tahun ?? '-',
            $row->kader_umum ?? 0,
            $row->kader_khusus ?? 0,
        ];
        foreach (self::PROGRAMS as $p) {
            $out[] = $row->{$p . '_kegiatan'} ?? '-';
            $out[] = $row->{$p . '_volume'} ?? 0;
            $out[] = $row->{$p . '_metode'} ?? '-';
            $out[] = $row->{$p . '_sasaran'} ?? 0;
        }
        $out[] = $row->keterangan ?? '-';

        return $out;
    }

    public function styles(Worksheet $sheet)
    {
        $last = $sheet->getHighestColumn();
        $sheet->mergeCells("A1:{$last}1");
        $sheet->mergeCells("A2:{$last}2");

        $sheet->getStyle('A1')->applyFromArray([
            'font' => ['bold' => true, 'size' => 14],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
        ]);
        $sheet->getStyle('A2')->applyFromArray([
            'font' => ['bold' => true, 'size' => 12],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
        ]);
        $sheet->getStyle("A3:{$last}3")->applyFromArray([
            'font' => ['bold' => true, 'size' => 10, 'color' => ['rgb' => 'FFFFFF']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER, 'wrapText' => true],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '0072BC']],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => '000000']]],
        ]);
        $sheet->getStyle("A4:{$last}" . $sheet->getHighestRow())->applyFromArray([
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => '000000']]],
            'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
        ]);

        return [];
    }

    public function columnWidths(): array
    {
        return ['A' => 5, 'B' => 20];
    }

    public function title(): string
    {
        return 'Pokja I';
    }
}
