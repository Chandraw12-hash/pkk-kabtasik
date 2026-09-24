<?php

namespace App\Exports;

use App\Models\RekapKegiatanWarga;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class RekapKegiatanWargaExport implements
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

    public function __construct(
        string $kecamatan,
        string $desa,
        int $tahun,
        ?string $level = null
    ) {
        $this->kecamatan = $kecamatan;
        $this->desa = $desa;
        $this->tahun = $tahun;
        $this->level = $level;
    }

    /**
     * Data yang di-export — filter by kecamatan, desa, tahun, level
     */
    public function collection()
    {
        return RekapKegiatanWarga::query()
            ->where('kecamatan', $this->kecamatan)
            ->where('desa', $this->desa)
            ->where('tahun', $this->tahun)
            ->when($this->level, fn($q) => $q->where('level', $this->level))
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
            'Kecamatan',
            'Desa',
            'Dusun',
            'RW',
            'RT',
            'Level',
            'Jumlah Dusun',
            'Jumlah RW',
            'Jumlah RT',
            'Dasa Wisma',
            'KRT',
            'KK',
            'Total L',
            'Total P',
            'Balita L',
            'Balita P',
            'PUS',
            'WUS',
            'Ibu Hamil',
            'Ibu Menyusui',
            'Lansia',
            'Buta L',
            'Buta P',
            'Rumah Sehat',
            'Rumah Kurang Sehat',
            'Tempat Sampah',
            'SPAL',
            'Stiker P4K',
            'Air PDAM',
            'Air Sumur',
            'Air Sungai',
            'Air DLL',
            'Jamban Keluarga',
            'Makanan Pokok Beras',
            'Makanan Non Beras',
            'UP2K',
            'Tanah Pekarangan',
            'Industri Rumah Tangga',
            'Kesehatan Lingkungan',
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
            $row->rw ?? '-',
            $row->rt ?? '-',
            strtoupper($row->level ?? '-'),
            $row->jumlah_dusun ?? 0,
            $row->jumlah_rw ?? 0,
            $row->jumlah_rt ?? 0,
            $row->jumlah_dasa_wisma ?? 0,
            $row->jumlah_krt ?? 0,
            $row->jumlah_kk ?? 0,
            $row->total_l ?? 0,
            $row->total_p ?? 0,
            $row->balita_l ?? 0,
            $row->balita_p ?? 0,
            $row->pus ?? 0,
            $row->wus ?? 0,
            $row->ibu_hamil ?? 0,
            $row->ibu_menyusui ?? 0,
            $row->lansia ?? 0,
            $row->buta_l ?? 0,
            $row->buta_p ?? 0,
            $row->rumah_sehat ?? 0,
            $row->rumah_kurang_sehat ?? 0,
            $row->memiliki_tempat_sampah ?? 0,
            $row->memiliki_spal ?? 0,
            $row->memiliki_stiker_p4k ?? 0,
            $row->air_pdam ?? 0,
            $row->air_sumur ?? 0,
            $row->air_sungai ?? 0,
            $row->air_dll ?? 0,
            $row->jumlah_jamban_keluarga ?? 0,
            $row->makanan_pokok_beras ?? 0,
            $row->makanan_pokok_non_beras ?? 0,
            $row->kegiatan_up2k ?? 0,
            $row->kegiatan_tanah_pekarangan ?? 0,
            $row->kegiatan_industri_rumah_tangga ?? 0,
            $row->kegiatan_kesehatan_lingkungan ?? 0,
        ];
    }

    /**
     * Style header — background ungu, text putih, bold
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
                    'startColor' => ['rgb' => '7C3AED'],
                ],
                'alignment' => [
                    'horizontal' => 'center',
                    'vertical' => 'center',
                ],
            ],
        ];
    }
}