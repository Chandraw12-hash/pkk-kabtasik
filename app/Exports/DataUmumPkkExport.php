<?php

namespace App\Exports;

use App\Models\DataUmumPkk;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class DataUmumPkkExport implements
    FromCollection,
    WithHeadings,
    WithMapping,
    WithStyles,
    ShouldAutoSize
{
    protected string $kecamatan;
    protected ?string $desa;
    protected int $tahun;
    protected ?string $level;

    public function __construct(
        string $kecamatan,
        ?string $desa,
        int $tahun,
        ?string $level = null
    ) {
        $this->kecamatan = $kecamatan;
        $this->desa = $desa;
        $this->tahun = $tahun;
        $this->level = $level;
    }

    /**
     * Data yang di-export — filter by kecamatan, desa (nullable), tahun, level
     */
    public function collection()
    {
        return DataUmumPkk::query()
            ->where('kecamatan', $this->kecamatan)
            ->when($this->desa, fn($q) => $q->where('desa', $this->desa))
            ->where('tahun', $this->tahun)
            ->when($this->level, fn($q) => $q->where('level', $this->level))
            ->orderBy('desa')
            ->orderBy('dusun')
            ->orderBy('level')
            ->get();
    }

    /**
     * Header kolom Excel
     */
    public function headings(): array
    {
        return [
            'No',
            'Tahun',
            'Kecamatan',
            'Desa',
            'Dusun',
            'Level',
            'Jumlah Dusun',
            'PKK RW',
            'PKK RT',
            'Dasa Wisma',
            'KRT',
            'KK',
            'Jiwa L',
            'Jiwa P',
            'Jiwa Belum Terpilah',
            'TP PKK L',
            'TP PKK P',
            'Kader Umum L',
            'Kader Umum P',
            'Kader Khusus L',
            'Kader Khusus P',
            'Sekretariat Honorer L',
            'Sekretariat Honorer P',
            'Sekretariat Bantuan L',
            'Sekretariat Bantuan P',
        ];
    }

    /**
     * Mapping data per baris
     */
    public function map($row): array
    {
        static $no = 0;
        $no++;

        return [
            $no,
            $row->tahun,
            $row->nama_kecamatan ?? $row->kecamatan,
            $row->nama_desa ?? $row->desa,
            $row->nama_dusun ?? $row->dusun ?? '-',
            strtoupper($row->level ?? '-'),
            $row->jumlah_dusun ?? 0,
            $row->jumlah_pkk_rw ?? 0,
            $row->jumlah_pkk_rt ?? 0,
            $row->jumlah_dasa_wisma ?? 0,
            $row->jumlah_krt ?? 0,
            $row->jumlah_kk ?? 0,
            $row->jiwa_l ?? 0,
            $row->jiwa_p ?? 0,
            $row->jiwa_tidak_terpilah ?? 0,
            $row->tp_pkk_l ?? 0,
            $row->tp_pkk_p ?? 0,
            $row->kader_umum_l ?? 0,
            $row->kader_umum_p ?? 0,
            $row->kader_khusus_l ?? 0,
            $row->kader_khusus_p ?? 0,
            $row->sekretariat_honorer_l ?? 0,
            $row->sekretariat_honorer_p ?? 0,
            $row->sekretariat_bantuan_l ?? 0,
            $row->sekretariat_bantuan_p ?? 0,
        ];
    }

    /**
     * Style header — background teal, text putih, bold
     */
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
