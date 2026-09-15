<?php

namespace App\Http\Controllers\Backend\Kecamatan;

use App\Http\Controllers\Controller;
use App\Models\LaporanKegiatan;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class ExportKecamatanController extends Controller
{
    /**
     * Export Excel — List Laporan Kecamatan.
     *
     * URL: /kecamatan/export/excel
     */
    public function excel(Request $request)
    {
        $user = $request->user();
        $kecamatan = $user->kecamatan;

        $filename = 'laporan-kecamatan-' . strtolower(str_replace(' ', '-', $kecamatan)) . '-' . date('Ymd-His') . '.xlsx';

        return Excel::download(
            new LaporanKecamatanExport($kecamatan),
            $filename
        );
    }

    /**
     * Export PDF — List Laporan Kecamatan.
     *
     * URL: /kecamatan/export/pdf
     */
    public function pdf(Request $request)
    {
        $user = $request->user();
        $kecamatan = $user->kecamatan;

        // Ambil data (auto-filter by Global Scope)
        $laporan = LaporanKegiatan::with(['user:id,name'])
            ->latest()
            ->get();

        $pdf = Pdf::loadView('pdf.laporan-kecamatan', [
            'kecamatan' => $kecamatan,
            'laporan' => $laporan,
            'tanggal' => Carbon::now()->locale('id')->isoFormat('D MMMM Y'),
        ])->setPaper('a4', 'landscape');

        $filename = 'laporan-kecamatan-' . strtolower(str_replace(' ', '-', $kecamatan)) . '-' . date('Ymd-His') . '.pdf';

        return $pdf->download($filename);
    }
}

/**
 * ============================================================
 * EXPORT CLASS: LaporanKecamatanExport
 *
 * Class untuk export Excel — implement:
 * - FromCollection: ambil data
 * - WithHeadings: header kolom
 * - WithMapping: format data per baris
 * - WithStyles: style Excel
 * - WithTitle: nama sheet
 * - ShouldAutoSize: auto-width kolom
 * ============================================================
 */
class LaporanKecamatanExport implements
    FromCollection,
    WithHeadings,
    WithMapping,
    WithStyles,
    WithTitle,
    ShouldAutoSize
{
    protected $kecamatan;
    protected $rowNumber = 0;

    public function __construct($kecamatan)
    {
        $this->kecamatan = $kecamatan;
    }

    /**
     * Ambil data (auto-filter by Global Scope).
     */
    public function collection()
    {
        return LaporanKegiatan::with(['user:id,name'])
            ->latest()
            ->get();
    }

    /**
     * Header kolom Excel.
     */
    public function headings(): array
    {
        return [
            'No',
            'Tanggal',
            'Judul Laporan',
            'Kategori Pokja',
            'Desa/Kelurahan',
            'Dasa Wisma',
            'Status',
            'Pelapor',
            'Deskripsi',
        ];
    }

    /**
     * Mapping data per baris.
     */
    public function map($laporan): array
    {
        $this->rowNumber++;

        $statusLabel = match ($laporan->status) {
            'pending'   => 'Menunggu',
            'reviewed'  => 'Direview',
            'approved'  => 'Disetujui',
            'rejected'  => 'Ditolak',
            default     => $laporan->status,
        };

        return [
            $this->rowNumber,
            $laporan->created_at ? $laporan->created_at->format('d/m/Y') : '-',
            $laporan->judul,
            'Pokja ' . $laporan->kategori_pokja,
            $laporan->desa_kelurahan ?? '-',
            $laporan->nama_dasawisma ?? '-',
            $statusLabel,
            $laporan->user->name ?? 'Anonim',
            $laporan->deskripsi ?? '-',
        ];
    }

    /**
     * Style Excel.
     */
    public function styles(Worksheet $sheet)
    {
        // ============================================================
        // HEADER STYLE
        // ============================================================
        $sheet->getStyle('A1:I1')->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
                'size' => 11,
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '0D9488'], // Teal
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => '0F766E'],
                ],
            ],
        ]);

        // Row height header
        $sheet->getRowDimension(1)->setRowHeight(28);

        // ============================================================
        // BODY BORDERS
        // ============================================================
        $highestRow = $sheet->getHighestRow();
        $sheet->getStyle('A1:I' . $highestRow)->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => 'E2E8F0'],
                ],
            ],
            'alignment' => [
                'vertical' => Alignment::VERTICAL_TOP,
                'wrapText' => true,
            ],
        ]);

        // Center untuk kolom No, Tanggal, Pokja, Status
        $sheet->getStyle('A2:A' . $highestRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('B2:B' . $highestRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('D2:D' . $highestRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('G2:G' . $highestRow)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        return $sheet;
    }

    /**
     * Nama sheet.
     */
    public function title(): string
    {
        return 'Laporan Kecamatan';
    }
}
