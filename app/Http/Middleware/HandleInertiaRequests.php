<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Berita;
use App\Models\LaporanKegiatan;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        // ============================================================
        // PENDING COUNTS — Berita (admin kabupaten aja)
        // ============================================================
        $pendingBerita = 0;
        $pendingLaporan = 0;

        if ($user && $user->hasAnyRole(['admin', 'super-admin'])) {
            $pendingBerita = Berita::where('status', 'pending')->count();
            $pendingLaporan = LaporanKegiatan::where('status', 'pending')->count();
        }

        // ============================================================
        // PENDING COUNTS KECAMATAN — Khusus Admin Kecamatan
        // ============================================================
        // Query otomatis filter by Global Scope (KecamatanScope)
        $pendingLaporanKecamatan = 0;
        $approvedLaporanKecamatan = 0;
        $pendingBeritaKecamatan = 0; // 🔥 TAMBAH: berita pending khusus kecamatan

        if ($user && $user->hasRole('kecamatan') && !empty($user->kecamatan)) {
            $pendingLaporanKecamatan = LaporanKegiatan::where('status', 'pending')->count();
            $approvedLaporanKecamatan = LaporanKegiatan::where('status', 'approved')->count();
            $pendingBeritaKecamatan = Berita::where('status', 'pending')->count(); // 🔥 TAMBAH
        }

        return [
            ...parent::share($request),

            'auth' => [
                'user' => $user,
                'roles' => $user?->getRoleNames(),
                'permissions' => $user?->getAllPermissions()->pluck('name'),
                'is_impersonating' => $request->session()->has('impersonator_id'),
            ],

            // ✅ Pending counts untuk admin kabupaten (lonceng notifikasi)
            'pending_counts' => [
                'berita' => $pendingBerita,
                'laporan' => $pendingLaporan,
                'total' => $pendingBerita + $pendingLaporan,

                // 🔥 Pending counts untuk admin kecamatan
                'laporan_pending' => $pendingLaporanKecamatan,
                'laporan_approved' => $approvedLaporanKecamatan,
                'berita_pending' => $pendingBeritaKecamatan, // 🔥 TAMBAH
                'total_kecamatan' => $pendingLaporanKecamatan + $pendingBeritaKecamatan, // 🔥 gabung laporan + berita
            ],

            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'message' => fn () => $request->session()->get('message'),
                'error' => fn () => $request->session()->get('error'),
            ],

            'app_settings' => function () {
                return \Illuminate\Support\Facades\Cache::remember('app_settings', 3600, function () {
                    return \Illuminate\Support\Facades\DB::table('settings')
                        ->whereIn('key', ['app_name', 'app_logo', 'primary_color'])
                        ->pluck('value', 'key');
                });
            },
        ];
    }
}
