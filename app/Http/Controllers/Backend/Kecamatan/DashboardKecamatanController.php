<?php

namespace App\Http\Controllers\Backend\Kecamatan;

use App\Http\Controllers\Controller;
use App\Models\LaporanKegiatan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardKecamatanController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $kecamatan = $user->kecamatan;

        // ============================================================
        // STATISTIK DASHBOARD (auto-filter by Global Scope)
        // ============================================================
        $totalLaporan = LaporanKegiatan::count();
        $totalApproved = LaporanKegiatan::where('status', 'approved')->count();
        $totalPending = LaporanKegiatan::where('status', 'pending')->count();
        $totalRejected = LaporanKegiatan::where('status', 'rejected')->count();

        // ============================================================
        // JUMLAH DESA & DASA WISMA UNIK (normalisasi UPPER/TRIM)
        // ============================================================
        $totalDesa = LaporanKegiatan::whereNotNull('desa_kelurahan')
            ->where('desa_kelurahan', '!=', '')
            ->distinct()
            ->count('desa_kelurahan');

        $totalDasaWisma = LaporanKegiatan::whereNotNull('nama_dasawisma')
            ->where('nama_dasawisma', '!=', '')
            ->distinct()
            ->count('nama_dasawisma');

        // ============================================================
        // REKAP PER POKJA
        // ============================================================
        $rekapPokja = [
            'I'   => LaporanKegiatan::where('kategori_pokja', 'I')->count(),
            'II'  => LaporanKegiatan::where('kategori_pokja', 'II')->count(),
            'III' => LaporanKegiatan::where('kategori_pokja', 'III')->count(),
            'IV'  => LaporanKegiatan::where('kategori_pokja', 'IV')->count(),
        ];

        // ============================================================
        // 5 LAPORAN TERBARU
        // ============================================================
        $laporanTerbaru = LaporanKegiatan::latest()
            ->limit(5)
            ->get(['id', 'judul', 'kategori_pokja', 'status', 'created_at']);

        return Inertia::render('Backend/Kecamatan/Dashboard', [
            'kecamatan'      => $kecamatan,
            'statistik'      => [
                'totalLaporan'   => $totalLaporan,
                'totalApproved'  => $totalApproved,
                'totalPending'   => $totalPending,
                'totalRejected'  => $totalRejected,
                'totalDesa'      => $totalDesa,
                'totalDasaWisma' => $totalDasaWisma,
            ],
            'rekapPokja'     => $rekapPokja,
            'laporanTerbaru' => $laporanTerbaru,
        ]);
    }
}
