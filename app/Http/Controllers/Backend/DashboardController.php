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
            // Data Dummy untuk Admin System (Global Stats)
            $stats = [
                'total_skpd' => 45, // Dummy
                'total_eviden' => 1250, // Dummy
                'total_indikator' => 48, // Dummy
                'total_users' => 150, // Dummy
                'verifikasi_pending' => 15, // Dummy
                'verifikasi_valid' => 1100, // Dummy
                'verifikasi_ditolak' => 135, // Dummy
            ];

            // 1. Line Chart Data (Monthly) - Dummy
            $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            $lineData = [];
            foreach ($months as $month) {
                $lineData[] = [
                    'name' => $month,
                    'uploaded' => rand(50, 200),
                    'verified' => rand(30, 150),
                ];
            }

            // 2. Bar Chart Data (Top 5 SKPD) - Dummy
            $barData = [
                ['name' => 'Dinas Kominfo', 'doc' => 245],
                ['name' => 'Bappelitbangda', 'doc' => 180],
                ['name' => 'Dinas Pendidikan', 'doc' => 150],
                ['name' => 'Dinas Kesehatan', 'doc' => 120],
                ['name' => 'BKPSDM', 'doc' => 100],
            ];

            // 3. Pie Chart Data (Status) - Dummy
            $pieData = [
                ['name' => 'Terverifikasi', 'value' => $stats['verifikasi_valid'], 'color' => '#10b981'],
                ['name' => 'Pending', 'value' => $stats['verifikasi_pending'], 'color' => '#f59e0b'],
                ['name' => 'Ditolak', 'value' => $stats['verifikasi_ditolak'], 'color' => '#f43f5e'],
            ];

            // 4. Recent Activities - Dummy
            $activities = [
                [
                    'opd' => 'Dinas Kominfo',
                    'action' => 'Mengunggah Eviden Indikator 1.1',
                    'time' => '2 menit yang lalu',
                ],
                [
                    'opd' => 'Bappelitbangda',
                    'action' => 'Mengunggah Eviden Indikator 2.3',
                    'time' => '15 menit yang lalu',
                ],
                [
                    'opd' => 'Dinas Pendidikan',
                    'action' => 'Revisi Eviden Indikator 4.1',
                    'time' => '1 jam yang lalu',
                ],
                [
                    'opd' => 'Dinas Kesehatan',
                    'action' => 'Mengunggah Eviden Indikator 3.2',
                    'time' => '3 jam yang lalu',
                ],
                [
                    'opd' => 'BKPSDM',
                    'action' => 'Mengunggah Eviden Indikator 1.2',
                    'time' => 'Kemarin',
                ],
            ];

            return Inertia::render('Backend/Dashboard/Index', compact('stats', 'lineData', 'barData', 'pieData', 'activities'));

        } else {
            // Data untuk User SKPD (Personal Stats) - Dummy
            $stats = [
                'total_eviden' => 45,
                'verifikasi_pending' => 5,
                'verifikasi_valid' => 35,
                'verifikasi_ditolak' => 5,
            ];

            return Inertia::render('Dashboard/SkpdDashboard', compact('stats'));
        }
    }
}
