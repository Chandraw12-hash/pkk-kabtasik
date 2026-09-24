<?php

namespace App\Http\Controllers\Backend\Desa;

use App\Http\Controllers\Controller;
use App\Models\DataUmumPkk;
use App\Models\RekapBumil;
use App\Models\RekapKegiatanWarga;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class DashboardDesaController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $kecamatan = $user->kecamatan;
        $desa = $user->desa;
        $tahun = (int) $request->input('tahun', date('Y'));

        // Cache key — unik per user + tahun
        $cacheKey = "desa_dashboard_{$kecamatan}_{$desa}_{$tahun}";

        // Cache 5 menit — biar ga query terus
        $stats = Cache::remember($cacheKey, now()->addMinutes(5), function () use ($kecamatan, $desa, $tahun) {
            // Data Umum PKK — ambil data terbaru
            $dataUmum = DataUmumPkk::query()
                ->where('kecamatan', $kecamatan)
                ->where('desa', $desa)
                ->where('tahun', $tahun)
                ->latest()
                ->first();

            // Kegiatan — pakai 1 query
            $kegiatanStats = RekapKegiatanWarga::query()
                ->where('kecamatan', $kecamatan)
                ->where('desa', $desa)
                ->where('tahun', $tahun)
                ->selectRaw('COUNT(*) as total_count, COALESCE(SUM(jumlah_kk), 0) as total_kk')
                ->first();

            // Bumil — pakai 1 query
            $bumilStats = RekapBumil::query()
                ->where('kecamatan', $kecamatan)
                ->where('desa', $desa)
                ->where('tahun', $tahun)
                ->selectRaw('COUNT(*) as total_count, COALESCE(SUM(ibu_hamil), 0) as total_ibu_hamil')
                ->first();

            return [
                'data_umum' => $dataUmum ? [
                    'jumlah_kk' => (int) $dataUmum->jumlah_kk,
                    'jumlah_krt' => (int) $dataUmum->jumlah_krt,
                    'jiwa_l' => (int) $dataUmum->jiwa_l,
                    'jiwa_p' => (int) $dataUmum->jiwa_p,
                    'jumlah_dasa_wisma' => (int) $dataUmum->jumlah_dasa_wisma,
                ] : null,
                'kegiatan_count' => (int) ($kegiatanStats->total_count ?? 0),
                'kegiatan_total_kk' => (int) ($kegiatanStats->total_kk ?? 0),
                'bumil_count' => (int) ($bumilStats->total_count ?? 0),
                'bumil_ibu_hamil' => (int) ($bumilStats->total_ibu_hamil ?? 0),
            ];
        });

        return Inertia::render('Backend/Desa/Dashboard', [
            'user' => [
                'name' => $user->name,
                'kecamatan' => $user->kecamatan,
                'desa' => $user->desa,
                'nama_desa' => $user->nama_desa,
            ],
            'tahun' => $tahun,
            'stats' => $stats,
        ]);
    }
}