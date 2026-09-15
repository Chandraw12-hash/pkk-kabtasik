<?php

namespace App\Http\Controllers\Backend\Kecamatan;

use App\Http\Controllers\Controller;
use App\Models\LaporanKegiatan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PrintKecamatanController extends Controller
{
    /**
     * Print laporan kecamatan.
     */
    public function print(Request $request, $jenis = 'kecamatan')
    {
        $user = $request->user();
        $kecamatan = $user->kecamatan;

        // Ambil data (auto-filter by scope)
        $laporan = LaporanKegiatan::latest()->get();

        return Inertia::render('Backend/Kecamatan/Print/Print', [
            'kecamatan' => $kecamatan,
            'jenis'     => $jenis,
            'laporan'   => $laporan,
            'tanggal'   => now()->format('d F Y'),
        ]);
    }
}
