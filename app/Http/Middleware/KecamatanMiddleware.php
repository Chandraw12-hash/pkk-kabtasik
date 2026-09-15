<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class KecamatanMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        if (!$user->hasRole('kecamatan')) {
            abort(403, 'Akses ditolak. Hanya Admin Kecamatan.');
        }

        if (empty($user->kecamatan)) {
            abort(403, 'Akun Anda belum memiliki wilayah kecamatan. Hubungi Admin Kabupaten.');
        }

        return $next($request);
    }
}
