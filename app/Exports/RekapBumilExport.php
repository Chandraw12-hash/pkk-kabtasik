<?php

namespace App\Exports;

use App\Models\RekapBumil;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class RekapBumilExport implements
    FromCollection,
    WithHeadings,
    WithMapping,
    WithStyles,
    ShouldAutoSize
{
    protected string $kecamatan;
    protected string $desa;
    protected int $tahun;
    protected ?string $level;
    protected ?int $bulan;

    public function __construct(
        string $kecamatan,
        string $desa,
        int $tahun,
        ?string $level = null,
        ?int $bulan = null
    ) {
        $this->kecamatan = $kecamatan;
        $this->desa = $desa;
        $this->tahun = $tahun;
        $this->level = $level;
        $this->bulan = $bulan;
    }

    /**
     * Data yang di-export — filter by kecamatan, desa, tahun, level, bulan
     */
    public function collection()
    {
        return RekapBumil::query()
            ->where('kecamatan', $this->kecamatan)
            ->where('desa', $this->desa)
            ->where('tahun', $this->tahun)
            ->when($this->level, fn($q) => $q->where('level', $this->level))
            ->when($this->bulan, fn($q) => $q->where('bulan', $this->bulan))
            ->orderBy('bulan')
            ->orderBy('dusun')
            ->orderBy('rw')
            ->orderBy('rt')
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
            'Bulan',
            'Kecamatan',
            'Desa',
            'Dusun',
            'RW',
            'RT',
            'Nama Dasawisma',
            'Level',
            'Jumlah Dusun',
            'Jumlah RW',
            'Jumlah RT',
            'Dasa Wisma',
            'Ibu Hamil',
            'Ibu Melahirkan',
            'Ibu Nifas',
            'Ibu Meninggal',
            'Bayi Lahir L',
            'Bayi Lahir P',
            'Akte Ada',
            'Akte Tidak Ada',
            'Bayi Meninggal L',
            'Bayi Meninggal P',
            'Balita Meninggal L',
            'Balita Meninggal P',
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
            $row->nama_bulan ?? $row->bulan ?? '-',
            $row->nama_kecamatan ?? $row->kecamatan,
            $row->nama_desa ?? $row->desa,
            $row->nama_dusun ?? $row->dusun ?? '-',
            $row->rw ?? '-',
            $row->rt ?? '-',
            $row->nama_dasawisma ?? '-',
            strtoupper($row->level ?? '-'),
            $row->jumlah_dusun ?? 0,
            $row->jumlah_rw ?? 0,
            $row->jumlah_rt ?? 0,
            $row->jumlah_dasa_wisma ?? 0,
            $row->ibu_hamil ?? 0,
            $row->ibu_melahirkan ?? 0,
            $row->ibu_nifas ?? 0,
            $row->ibu_meninggal ?? 0,
            $row->bayi_lahir_l ?? 0,
            $row->bayi_lahir_p ?? 0,
            $row->akte_ada ?? 0,
            $row->akte_tidak_ada ?? 0,
            $row->bayi_meninggal_l ?? 0,
            $row->bayi_meninggal_p ?? 0,
            $row->balita_meninggal_l ?? 0,
            $row->balita_meninggal_p ?? 0,
        ];
    }

    /**
     * Style header — background pink, text putih, bold
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
                    'startColor' => ['rgb' => 'DB2777'],
                ],
                'alignment' => [
                    'horizontal' => 'center',
                    'vertical' => 'center',
                ],
            ],
        ];
    }
}