<?php

namespace App\Http\Controllers\Backend\Kecamatan;

use App\Http\Controllers\Controller;
use App\Exports\DataUmumPkkExport;
use App\Exports\RekapKegiatanWargaExport;
use App\Exports\RekapBumilExport;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;

class ExportKecamatanPkkController extends Controller
{
    /**
     * Export Data Umum PKK tingkat kecamatan
     */
    public function dataUmum(Request $request)
    {
        $user = auth()->user();
        $tahun = (int) $request->input('tahun', date('Y'));

        $filename = $this->buildFilename('Data-Umum-PKK-Kec', $user->kecamatan, $tahun);

        return Excel::download(
            new DataUmumPkkExport(
                $user->kecamatan,
                null,     // ← null = semua desa di kecamatan
                $tahun,
                'desa'    // ← level desa
            ),
            $filename
        );
    }

    /**
     * Export Kegiatan tingkat kecamatan
     */
    public function kegiatan(Request $request)
    {
        $user = auth()->user();
        $tahun = (int) $request->input('tahun', date('Y'));

        $filename = $this->buildFilename('Rekap-Kegiatan-Kec', $user->kecamatan, $tahun);

        return Excel::download(
            new RekapKegiatanWargaExport(
                $user->kecamatan,
                null,
                $tahun,
                'desa'
            ),
            $filename
        );
    }

    /**
     * Export Bumil tingkat kecamatan
     */
    public function bumil(Request $request)
    {
        $user = auth()->user();
        $tahun = (int) $request->input('tahun', date('Y'));

        $filename = $this->buildFilename('Rekap-Bumil-Kec', $user->kecamatan, $tahun);

        return Excel::download(
            new RekapBumilExport(
                $user->kecamatan,
                null,
                $tahun,
                'desa'
            ),
            $filename
        );
    }

    /**
     * Build nama file yang aman
     */
    private function buildFilename(string $prefix, ?string $kecamatan, int $tahun): string
    {
        $kecSlug = $kecamatan
            ? Str::slug($kecamatan, '-')
            : 'Kecamatan';

        return $prefix . '-' . $kecSlug . '-' . $tahun . '-' . date('Y-m-d') . '.xlsx';
    }
}
