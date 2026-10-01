<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Eviden;
use App\Models\User;
use App\Models\Kader;
use App\Models\DataUmumPkk;
use App\Models\Pokja1;
use App\Models\Pokja2;
use App\Models\Pokja3;
use App\Models\Pokja4;
use App\Models\Galeri;
use App\Models\Berita;
use App\Models\Agenda;
use App\Models\Infografis;
use App\Models\LaporanKegiatan;
use App\Models\Survey;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->hasRole('admin')) {
            // ─── DATA KADER (REAL) ──────────────────────────────────────────────
            $totalKader = Kader::count();
            $kaderAktif = Kader::where('status_aktif', true)->count();

            // ─── DATA POKJA & SEKRETARIAT (REAL) ──────────────────────────────
            // ✅ FIX: Ganti DataUmumSekretariat → DataUmumPkk (level kecamatan)
            $totalSekretariat = DataUmumPkk::where('level', 'kecamatan')->count();
            $totalPokja1 = Pokja1::count();
            $totalPokja2 = Pokja2::count();
            $totalPokja3 = Pokja3::count();
            $totalPokja4 = Pokja4::count();
            $totalDataPokja = $totalSekretariat + $totalPokja1 + $totalPokja2 + $totalPokja3 + $totalPokja4;

            // ─── LAPORAN KEGIATAN (REAL) ──────────────────────────────────────
            $totalLaporan = LaporanKegiatan::count();
            $laporanPending = LaporanKegiatan::where('status', 'pending')->count();
            $laporanApproved = LaporanKegiatan::where('status', 'approved')->count();
            $laporanRejected = LaporanKegiatan::where('status', 'rejected')->count();
            $laporanReviewed = LaporanKegiatan::where('status', 'reviewed')->count();

            // ─── EVIDEN (REAL) ──────────────────────────────────────────────────
            $evidenPending = Eviden::where('status', 'pending')->count();
            $evidenValid = Eviden::where('status', 'valid')->count();
            $evidenRejected = Eviden::where('status', 'ditolak')->count();

            // ─── GABUNGKAN LAPORAN + EVIDEN ──────────────────────────────────
            $totalEvidenMasuk = $totalLaporan + $totalDataPokja;
            $pendingCount = $laporanPending + $evidenPending;
            $validCount = $laporanApproved + $evidenValid;
            $rejectedCount = $laporanRejected + $laporanReviewed + $evidenRejected;

            // ─── DATA KONTEN (REAL) ──────────────────────────────────────────────
            $totalGaleri = Galeri::count();
            $totalBerita = Berita::count();
            $totalAgenda = Agenda::count();
            $totalInfografis = Infografis::count();

            // ─── SURVEY (REAL) ──────────────────────────────────────────────────
            $totalSurvey = Survey::count();
            $surveyPublished = Survey::where('status', 'published')->count();

            // ─── PERSENTASE VERIFIKASI ──────────────────────────────────────────
            $totalVerifikasi = $validCount + $pendingCount + $rejectedCount;
            $verifikasiPersentase = $totalVerifikasi > 0
                ? round(($validCount / $totalVerifikasi) * 100, 0)
                : 0;

            // ─── STATS (REAL SEMUA) ──────────────────────────────────────────────
            $stats = [
                'totalKader' => $totalKader,
                'kaderAktif' => $kaderAktif,
                'totalDataPokja' => $totalDataPokja,
                'totalLaporan' => $totalLaporan,
                'totalEvidenMasuk' => $totalEvidenMasuk,
                'laporanPending' => $pendingCount,
                'laporanApproved' => $validCount,
                'laporanRejected' => $rejectedCount,
                'laporanReviewed' => $laporanReviewed,
                'totalGaleri' => $totalGaleri,
                'totalBerita' => $totalBerita,
                'totalAgenda' => $totalAgenda,
                'totalInfografis' => $totalInfografis,
                'totalSurvey' => $totalSurvey,
                'surveyPublished' => $surveyPublished,
                'verifikasiPersentase' => $verifikasiPersentase,
            ];

            // ─── GRAFIK LINE (REAL) ──────────────────────────────────────────────
            $lineData = collect(range(5, 0))->map(function ($i) {
                $date = now()->subMonths($i);
                $month = $date->format('M');

                $total = LaporanKegiatan::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count();

                $terverifikasi = LaporanKegiatan::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->where('status', 'approved')
                    ->count();

                return [
                    'name' => $month,
                    'uploaded' => $total,
                    'verified' => $terverifikasi,
                ];
            })->toArray();

            // ─── GRAFIK BAR (REAL) ──────────────────────────────────────────────
            $barData = [
                ['name' => 'Pokja I', 'doc' => $totalPokja1],
                ['name' => 'Pokja II', 'doc' => $totalPokja2],
                ['name' => 'Pokja III', 'doc' => $totalPokja3],
                ['name' => 'Pokja IV', 'doc' => $totalPokja4],
                ['name' => 'Sekretariat', 'doc' => $totalSekretariat],
            ];

            // ─── PIE DATA (REAL) ──────────────────────────────────────────────────
            $pieData = [
                ['name' => 'Terverifikasi', 'value' => $validCount, 'color' => '#10b981'],
                ['name' => 'Pending', 'value' => $pendingCount, 'color' => '#f59e0b'],
                ['name' => 'Ditolak', 'value' => $rejectedCount, 'color' => '#f43f5e'],
            ];

            // ─── AKTIVITAS (REAL DARI DATABASE) ──────────────────────────────────
            $activities = LaporanKegiatan::latest()->take(5)->get()->map(function ($ev) {
                $pokjaMapping = [
                    'pokja1' => 'Pokja I',
                    'pokja2' => 'Pokja II',
                    'pokja3' => 'Pokja III',
                    'pokja4' => 'Pokja IV',
                    'sekretariat' => 'Sekretariat',
                ];

                $pokjaName = $ev->pokja ?? 'Pokja IV';
                if (isset($pokjaMapping[$pokjaName])) {
                    $pokjaName = $pokjaMapping[$pokjaName];
                }

                return [
                    'pokja' => $pokjaName,
                    'action' => 'Melaporkan Eviden Kegiatan PKK Kabupaten Tasikmalaya',
                    'time' => $ev->created_at ? $ev->created_at->diffForHumans() : 'Baru saja',
                ];
            })->toArray();

            return Inertia::render('Backend/Dashboard/Index', compact('stats', 'lineData', 'barData', 'pieData', 'activities'));

        } else {
            // ─── USER BIASA ──────────────────────────────────────────────────────
            $stats = [
                'totalKader' => Kader::count(),
                'kaderAktif' => Kader::where('status_aktif', true)->count(),
                'totalDataPokja' => 0,
                'totalLaporan' => LaporanKegiatan::where('user_id', $user->id)->count(),
                'totalEvidenMasuk' => 0,
                'laporanPending' => LaporanKegiatan::where('user_id', $user->id)->where('status', 'pending')->count(),
                'laporanApproved' => LaporanKegiatan::where('user_id', $user->id)->where('status', 'approved')->count(),
                'laporanRejected' => LaporanKegiatan::where('user_id', $user->id)->where('status', 'rejected')->count(),
                'laporanReviewed' => LaporanKegiatan::where('user_id', $user->id)->where('status', 'reviewed')->count(),
                'totalGaleri' => 0,
                'totalBerita' => 0,
                'totalAgenda' => 0,
                'totalInfografis' => 0,
                'totalSurvey' => 0,
                'surveyPublished' => 0,
                'verifikasiPersentase' => 0,
            ];

            $lineData = [];
            $barData = [];

            $totalVerifikasi = $stats['laporanApproved'] + $stats['laporanPending'] + $stats['laporanRejected'];
            $verifikasiPersentase = $totalVerifikasi > 0 ? round(($stats['laporanApproved'] / $totalVerifikasi) * 100, 0) : 0;
            $stats['verifikasiPersentase'] = $verifikasiPersentase;

            $pieData = [
                ['name' => 'Terverifikasi', 'value' => $stats['laporanApproved'], 'color' => '#10b981'],
                ['name' => 'Pending', 'value' => $stats['laporanPending'], 'color' => '#f59e0b'],
                ['name' => 'Ditolak', 'value' => $stats['laporanRejected'], 'color' => '#f43f5e'],
            ];

            $activities = LaporanKegiatan::where('user_id', $user->id)->latest()->take(5)->get()->map(function ($ev) {
                return [
                    'pokja' => $ev->pokja ?? 'Pokja IV',
                    'action' => 'Melaporkan kegiatan',
                    'time' => $ev->created_at ? $ev->created_at->diffForHumans() : 'Baru saja',
                ];
            })->toArray();

            return Inertia::render('Backend/Dashboard/Index', compact('stats', 'lineData', 'barData', 'pieData', 'activities'));
        }
    }
}
