<?php

namespace App\Http\Controllers\Backend\Kecamatan;

use App\Http\Controllers\Controller;
use App\Models\LaporanKegiatan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RekapKecamatanController extends Controller
{
    /**
     * Rekap per Kecamatan — total semua laporan di kecamatan ini.
     */
    public function kecamatan(Request $request)
    {
        $user = $request->user();
        $kecamatan = $user->kecamatan;

        // ============================================================
        // REKAP KECAMATAN
        // ============================================================
        $rekap = LaporanKegiatan::select([
                DB::raw('UPPER(TRIM(kecamatan)) as kecamatan'),
                DB::raw('COUNT(*) as jumlah_laporan'),
                DB::raw('COUNT(DISTINCT UPPER(TRIM(desa_kelurahan))) as jumlah_desa'),
                DB::raw('COUNT(DISTINCT UPPER(TRIM(nama_dasawisma))) as jumlah_dasa_wisma'),
            ])
            ->groupBy(DB::raw('UPPER(TRIM(kecamatan))'))
            ->first();

        // ============================================================
        // REKAP PER POKJA
        // ============================================================
        $rekapPokja = LaporanKegiatan::select([
                'kategori_pokja',
                DB::raw('COUNT(*) as jumlah'),
            ])
            ->groupBy('kategori_pokja')
            ->orderBy('kategori_pokja')
            ->get();

        return Inertia::render('Backend/Kecamatan/Rekap/Kecamatan', [
            'kecamatan'  => $kecamatan,
            'rekap'      => $rekap,
            'rekapPokja' => $rekapPokja,
        ]);
    }

    /**
     * Rekap per Desa.
     */
    public function desa(Request $request)
    {
        $user = $request->user();
        $kecamatan = $user->kecamatan;

        $rekap = LaporanKegiatan::select([
                DB::raw('UPPER(TRIM(desa_kelurahan)) as desa'),
                DB::raw('COUNT(*) as jumlah_laporan'),
                DB::raw('COUNT(DISTINCT UPPER(TRIM(nama_dasawisma))) as jumlah_dasa_wisma'),
            ])
            ->whereNotNull('desa_kelurahan')
            ->where('desa_kelurahan', '!=', '')
            ->groupBy(DB::raw('UPPER(TRIM(desa_kelurahan))'))
            ->orderBy('desa')
            ->get();

        return Inertia::render('Backend/Kecamatan/Rekap/Desa', [
            'kecamatan' => $kecamatan,
            'rekap'     => $rekap,
        ]);
    }

    /**
     * Rekap per Dasa Wisma.
     */
    public function dasaWisma(Request $request)
    {
        $user = $request->user();
        $kecamatan = $user->kecamatan;

        $rekap = LaporanKegiatan::select([
                DB::raw('UPPER(TRIM(nama_dasawisma)) as dasa_wisma'),
                DB::raw('UPPER(TRIM(desa_kelurahan)) as desa'),
                DB::raw('COUNT(*) as jumlah_laporan'),
            ])
            ->whereNotNull('nama_dasawisma')
            ->where('nama_dasawisma', '!=', '')
            ->groupBy(
                DB::raw('UPPER(TRIM(nama_dasawisma))'),
                DB::raw('UPPER(TRIM(desa_kelurahan))')
            )
            ->orderBy('dasa_wisma')
            ->get();

        return Inertia::render('Backend/Kecamatan/Rekap/DasaWisma', [
            'kecamatan' => $kecamatan,
            'rekap'     => $rekap,
        ]);
    }
}
