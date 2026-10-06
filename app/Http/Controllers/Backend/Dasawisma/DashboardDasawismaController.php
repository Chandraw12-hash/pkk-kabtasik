<?php

namespace App\Http\Controllers\Backend\Dasawisma;

use App\Http\Controllers\Controller;
use App\Models\CatatanKeluarga;
use App\Models\DaftarWarga;
use App\Models\DataDasaWisma;
use App\Models\IndustriRumahTangga;
use App\Models\KegiatanDasaWisma;
use App\Models\KegiatanWarga;
use App\Models\LaporanKegiatan;
use App\Models\PemanfaatanPekarangan;
use App\Models\RekapBumilDasaWisma;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardDasawismaController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $resources = [
            ['model' => DaftarWarga::class, 'label' => 'Daftar Warga', 'href' => '/dasawisma/daftar-warga'],
            ['model' => DataDasaWisma::class, 'label' => 'Data Dasa Wisma', 'href' => '/dasawisma/data-dasa-wisma'],
            ['model' => CatatanKeluarga::class, 'label' => 'Catatan Keluarga', 'href' => '/dasawisma/catatan-keluarga'],
            ['model' => KegiatanWarga::class, 'label' => 'Kegiatan Warga', 'href' => '/dasawisma/kegiatan-warga'],
            ['model' => PemanfaatanPekarangan::class, 'label' => 'Pemanfaatan Pekarangan', 'href' => '/dasawisma/pemanfaatan-pekarangan'],
            ['model' => IndustriRumahTangga::class, 'label' => 'Industri Rumah Tangga', 'href' => '/dasawisma/industri-rumah-tangga'],
            ['model' => KegiatanDasaWisma::class, 'label' => 'Kegiatan Dasa Wisma', 'href' => '/dasawisma/kegiatan-dasa-wisma'],
            ['model' => RekapBumilDasaWisma::class, 'label' => 'Rekap Bumil', 'href' => '/dasawisma/rekap-bumil'],
        ];
        $totals = ['total' => 0, 'pending' => 0, 'approved' => 0, 'rejected' => 0];
        $modules = [];

        foreach ($resources as $resource) {
            $model = $resource['model'];
            $query = $model::query();

            if ($user->hasRole('super-admin')) {
                // Super Admin — lihat semua status tanpa filter.
            } elseif ($user->hasRole('admin')) {
                $query->where('status', 'approved');
            } elseif ($resource['model'] === CatatanKeluarga::class) {
                $query->whereHas('daftarWarga', function ($parent) use ($user) {
                    if ($user->hasRole('kecamatan')) {
                        $parent->where('kecamatan', $user->kecamatan);
                    } else {
                        $parent->where('kecamatan', $user->kecamatan)
                            ->where('desa', $user->desa);
                    }
                });
                if ($user->hasRole('dasawisma')) {
                    $query->where('created_by', $user->id);
                }
            } elseif ($user->hasRole('kecamatan')) {
                $query->where('kecamatan', $user->kecamatan);
            } elseif ($user->hasRole('admin desa')) {
                $query->where('kecamatan', $user->kecamatan)->where('desa', $user->desa);
            } else {
                $query->where('created_by', $user->id);
            }

            $moduleCount = (clone $query)->count();
            $modules[] = [
                'label' => $resource['label'],
                'href' => $resource['href'],
                'count' => $moduleCount,
            ];
            $totals['total'] += $moduleCount;

            if (!$user->hasRole('admin')) {
                foreach (['pending', 'approved', 'rejected'] as $status) {
                    $totals[$status] += (clone $query)->where('status', $status)->count();
                }
            } else {
                $totals['approved'] += $moduleCount;
            }
        }

        $laporanQuery = LaporanKegiatan::query();
        if (!$user->hasAnyRole(['admin', 'kecamatan', 'admin desa'])) {
            $laporanQuery->where('user_id', $user->id);
        } elseif ($user->hasRole('kecamatan')) {
            $laporanQuery->where('kecamatan', $user->kecamatan);
        } elseif ($user->hasRole('admin desa')) {
            $laporanQuery->where('kecamatan', $user->kecamatan)
                ->where('desa_kelurahan', $user->desa);
        }

        return Inertia::render('Dasawisma/Dashboard', [
            'user' => [
                'name' => $user->name,
                'username' => $user->username,
                'kecamatan' => $user->kecamatan,
                'desa' => $user->desa,
            ],
            'stats' => $totals,
            'modules' => $modules,
            'reports' => [
                'total' => (clone $laporanQuery)->count(),
                'pending' => (clone $laporanQuery)->where('status', 'pending')->count(),
            ],
            'notifications' => $user->unreadNotifications()
                ->latest()
                ->limit(5)
                ->get()
                ->map(fn ($notification) => [
                    'id' => $notification->id,
                    'message' => $notification->data['message'] ?? 'Ada pembaruan data Dasa Wisma.',
                    'url' => $notification->data['url'] ?? '/dasawisma',
                    'created_at' => $notification->created_at?->diffForHumans(),
                ])
                ->all(),
        ]);
    }
}
