<?php

namespace App\Exports;

use App\Models\KegiatanDasaWisma;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class DasawismaKegiatanExcelExport implements FromArray, WithColumnFormatting, WithEvents, ShouldAutoSize
{
    /**
     * @param array<int, KegiatanDasaWisma> $records
     */
    public function __construct(private readonly array $records)
    {
    }

    public function array(): array
    {
        $blankHeader = array_fill(0, 37, '');
        $rows = [$blankHeader, $blankHeader];

        foreach ($this->records as $index => $record) {
            $rows[] = [
                $index + 1,
                $record->dusun,
                $record->rw,
                $record->rt,
                $record->jumlah_dusun,
                $record->jumlah_rw,
                $record->jumlah_rt,
                $record->jumlah_dasa_wisma,
                $record->jumlah_krt,
                $record->jumlah_kk,
                $record->total_l,
                $record->total_p,
                $record->balita_l,
                $record->balita_p,
                $record->pus,
                $record->wus,
                $record->ibu_hamil,
                $record->ibu_menyusui,
                $record->lansia,
                $record->buta_l,
                $record->buta_p,
                $record->rumah_sehat,
                $record->rumah_kurang_sehat,
                $record->memiliki_tempat_sampah,
                $record->memiliki_spal,
                $record->memiliki_stiker_p4k,
                $record->air_pdam,
                $record->air_sumur,
                $record->air_sungai,
                $record->air_dll,
                $record->jumlah_jamban_keluarga,
                $record->makanan_pokok_beras,
                $record->makanan_pokok_non_beras,
                $record->kegiatan_up2k,
                $record->kegiatan_tanah_pekarangan,
                $record->kegiatan_industri_rumah_tangga,
                $record->kegiatan_kesehatan_lingkungan,
            ];
        }

        return $rows;
    }

    public function columnFormats(): array
    {
        return [
            'C' => NumberFormat::FORMAT_TEXT,
            'D' => NumberFormat::FORMAT_TEXT,
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event): void {
                $sheet = $event->sheet->getDelegate();
                $headerRow1 = [
                    'No.', 'Nama Dusun', 'RW', 'RT', 'Jumlah Dusun', 'Jumlah RW',
                    'Jumlah RT', 'Jumlah Dasa Wisma', 'Jumlah KRT', 'Jumlah KK',
                    'Jumlah Anggota Keluarga', '', 'Balita', '', 'PUS', 'WUS',
                    'Ibu Hamil', 'Ibu Menyusui', 'Lansia', '3 Buta', '',
                    'Kriteria Rumah', '', '', '', '', 'Sumber Air Keluarga', '', '', '',
                    'Jumlah Jamban Keluarga', 'Makanan', '', 'Warga Mengikuti Kegiatan',
                    '', '', '',
                ];
                $headerRow2 = [
                    '', '', '', '', '', '', '', '', '', '', 'Total L', 'Total P',
                    'Balita L', 'Balita P', '', '', '', '', '', 'L', 'P',
                    'Sehat', 'Kurang Sehat', 'Sampah', 'SPAL', 'Stiker P4K',
                    'PDAM', 'Sumur', 'Sungai', 'DLL', '', 'Pokok Beras', 'Non Beras',
                    'UP2K', 'Tanah Pekarangan', 'Industri RT', 'Kesling',
                ];

                foreach ($headerRow1 as $column => $value) {
                    $sheet->setCellValueByColumnAndRow($column + 1, 1, $value);
                }
                foreach ($headerRow2 as $column => $value) {
                    $sheet->setCellValueByColumnAndRow($column + 1, 2, $value);
                }

                foreach (['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'O', 'P', 'Q', 'R', 'S', 'AE'] as $column) {
                    $sheet->mergeCells("{$column}1:{$column}2");
                }
                foreach (['K1:L1', 'M1:N1', 'T1:U1', 'V1:Z1', 'AA1:AD1', 'AF1:AG1', 'AH1:AK1'] as $range) {
                    $sheet->mergeCells($range);
                }

                $sheet->getStyle('A1:AK2')->applyFromArray([
                    'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                    'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '0F766E']],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                        'wrapText' => true,
                    ],
                ]);
                $sheet->freezePane('A3');
                $sheet->setAutoFilter('A2:AK2');
                $sheet->getRowDimension(1)->setRowHeight(30);
                $sheet->getRowDimension(2)->setRowHeight(28);
            },
        ];
    }
}
