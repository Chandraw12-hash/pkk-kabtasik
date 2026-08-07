<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Eviden;
use App\Models\Indikator;
use App\Models\User;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->hasRole('admin')) {
            // Data Dummy untuk Admin (Global Stats)
            $stats = [
                'total_kader' => 320,
                'total_kegiatan' => 145,
                'total_program' => 10,
                'total_users' => 25,
                'verifikasi_pending' => 8,
                'verifikasi_valid' => 120,
                'verifikasi_ditolak' => 17,
            ];

            $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            $lineData = [];
            foreach ($months as $month) {
                $lineData[] = [
                    'name' => $month,
                    'uploaded' => rand(10, 40),
                    'verified' => rand(5, 30),
                ];
            }

            $barData = [
                ['name' => 'Pokja I', 'doc' => 42],
                ['name' => 'Pokja II', 'doc' => 38],
                ['name' => 'Pokja III', 'doc' => 35],
                ['name' => 'Pokja IV', 'doc' => 30],
                ['name' => 'Sekretariat', 'doc' => 20],
            ];

            $pieData = [
                ['name' => 'Terverifikasi', 'value' => $stats['verifikasi_valid'], 'color' => '#10b981'],
                ['name' => 'Pending', 'value' => $stats['verifikasi_pending'], 'color' => '#f59e0b'],
                ['name' => 'Ditolak', 'value' => $stats['verifikasi_ditolak'], 'color' => '#f43f5e'],
            ];

            $activities = [
                [
                    'opd' => 'Pokja I',
                    'action' => 'Melaporkan Kegiatan Gotong Royong Desa Sukamaju',
                    'time' => '2 menit yang lalu',
                ],
                [
                    'opd' => 'Pokja II',
                    'action' => 'Melaporkan Pelatihan Keterampilan Membatik',
                    'time' => '15 menit yang lalu',
                ],
                [
                    'opd' => 'Pokja III',
                    'action' => 'Revisi Laporan Kegiatan Pangan Bergizi',
                    'time' => '1 jam yang lalu',
                ],
                [
                    'opd' => 'Pokja IV',
                    'action' => 'Melaporkan Kegiatan Posyandu Balita',
                    'time' => '3 jam yang lalu',
                ],
                [
                    'opd' => 'Sekretariat',
                    'action' => 'Menambahkan Data Kader Baru',
                    'time' => 'Kemarin',
                ],
            ];

            return Inertia::render('Backend/Dashboard/Index', compact('stats', 'lineData', 'barData', 'pieData', 'activities'));

        } else {
            // Data untuk User PKK / User biasa
            $stats = [
                'total_kegiatan' => 12,
                'verifikasi_pending' => 2,
                'verifikasi_valid' => 9,
                'verifikasi_ditolak' => 1,
            ];

            // FIX: Arahkan ke file yang ada di folder Backend atau buat komponen yang aman
            // Sementara kita lempar ke Backend/Dashboard/Index dengan data stats versi user
            $lineData = [];
            $barData = [];
            $pieData = [
                ['name' => 'Terverifikasi', 'value' => $stats['verifikasi_valid'], 'color' => '#10b981'],
                ['name' => 'Pending', 'value' => $stats['verifikasi_pending'], 'color' => '#f59e0b'],
                ['name' => 'Ditolak', 'value' => $stats['verifikasi_ditolak'], 'color' => '#f43f5e'],
            ];
            $activities = [];

            return Inertia::render('Backend/Dashboard/Index', compact('stats', 'lineData', 'barData', 'pieData', 'activities'));
        }
    }
}
