<?php

namespace App\Http\Controllers\Backend\Dasawisma;

use App\Http\Controllers\Controller;
use App\Models\LaporanKegiatan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardDasawismaController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        // Statistik laporan milik user ini
        $totalLaporan = LaporanKegiatan::where('user_id', $user->id)->count();
        $laporanPending = LaporanKegiatan::where('user_id', $user->id)->where('status', 'pending')->count();
        $laporanApproved = LaporanKegiatan::where('user_id', $user->id)->where('status', 'approved')->count();
        $laporanRejected = LaporanKegiatan::where('user_id', $user->id)->where('status', 'rejected')->count();

        // Laporan terbaru
        $laporanTerbaru = LaporanKegiatan::where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'judul' => $item->judul ?? $item->jenis_kegiatan ?? 'Laporan',
                    'status' => $item->status,
                    'created_at' => $item->created_at?->format('d M Y H:i'),
                    'diff' => $item->created_at?->diffForHumans(),
                ];
            });

        // Grafik laporan per bulan (6 bulan terakhir)
        $chartData = collect(range(5, 0))->map(function ($i) use ($user) {
            $date = now()->subMonths($i);
            return [
                'bulan' => $date->format('M'),
                'total' => LaporanKegiatan::where('user_id', $user->id)
                    ->whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count(),
            ];
        })->toArray();

        return Inertia::render('Backend/Dasawisma/Dashboard', [
            'user' => [
                'name' => $user->name,
                'username' => $user->username,
            ],
            'stats' => [
                'totalLaporan' => $totalLaporan,
                'laporanPending' => $laporanPending,
                'laporanApproved' => $laporanApproved,
                'laporanRejected' => $laporanRejected,
            ],
            'laporanTerbaru' => $laporanTerbaru,
            'chartData' => $chartData,
        ]);
    }
}
