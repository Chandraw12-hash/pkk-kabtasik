<?php

namespace App\Http\Controllers\Backend\Desa;

use App\Http\Controllers\Controller;
use App\Exports\DataUmumPkkExport;
use App\Exports\RekapKegiatanWargaExport;
use App\Exports\RekapBumilExport;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ExportDesaController extends Controller
{
    /**
     * Halaman export
     */
    public function index()
    {
        $user = auth()->user();

        return Inertia::render('Backend/Desa/Export/Index', [
            'user' => [
                'name' => $user->name,
                'kecamatan' => $user->kecamatan,
                'desa' => $user->desa,
                'nama_desa' => $user->nama_desa,
            ],
        ]);
    }

    /**
     * Export Data Umum PKK ke Excel
     */
    public function exportDataUmum(Request $request)
    {
        $user = auth()->user();
        $tahun = (int) $request->input('tahun', date('Y'));
        $level = $request->input('level');

        $filename = $this->buildFilename('Data-Umum-PKK', $user->desa, $tahun);

        return Excel::download(
            new DataUmumPkkExport(
                $user->kecamatan,
                $user->desa,
                $tahun,
                $level
            ),
            $filename
        );
    }

    /**
     * Export Kegiatan ke Excel
     */
    public function exportKegiatan(Request $request)
    {
        $user = auth()->user();
        $tahun = (int) $request->input('tahun', date('Y'));
        $level = $request->input('level');

        $filename = $this->buildFilename('Rekap-Kegiatan', $user->desa, $tahun);

        return Excel::download(
            new RekapKegiatanWargaExport(
                $user->kecamatan,
                $user->desa,
                $tahun,
                $level
            ),
            $filename
        );
    }

    /**
     * Export Bumil ke Excel
     */
    public function exportBumil(Request $request)
    {
        $user = auth()->user();
        $tahun = (int) $request->input('tahun', date('Y'));
        $level = $request->input('level');
        $bulan = $request->filled('bulan') ? (int) $request->input('bulan') : null;

        $filename = $this->buildFilename('Rekap-Bumil', $user->desa, $tahun);

        return Excel::download(
            new RekapBumilExport(
                $user->kecamatan,
                $user->desa,
                $tahun,
                $level,
                $bulan
            ),
            $filename
        );
    }

    /**
     * Build nama file yang aman
     */
    private function buildFilename(string $prefix, ?string $desa, int $tahun): string
    {
        // Fallback kalau desa kosong
        $desaSlug = $desa
            ? Str::slug($desa, '-')
            : 'Desa';

        return $prefix . '-' . $desaSlug . '-' . $tahun . '-' . date('Y-m-d') . '.xlsx';
    }
}