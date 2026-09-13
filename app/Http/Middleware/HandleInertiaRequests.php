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
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        // ✅ Hitung pending (berita + laporan) untuk admin
        $pendingBerita = 0;
        $pendingLaporan = 0;

        if ($user && $user->hasAnyRole(['admin', 'super-admin'])) {
            $pendingBerita = Berita::where('status', 'pending')->count();
            $pendingLaporan = LaporanKegiatan::where('status', 'pending')->count();
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'roles' => $user?->getRoleNames(),
                'permissions' => $user?->getAllPermissions()->pluck('name'),
            ],
            // ✅ TAMBAH: Pending counts untuk notifikasi lonceng
            'pending_counts' => [
                'berita' => $pendingBerita,
                'laporan' => $pendingLaporan,
                'total' => $pendingBerita + $pendingLaporan,
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
