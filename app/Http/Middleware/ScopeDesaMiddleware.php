<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ScopeDesaMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();

        if (!$user) {
            return redirect('/login');
        }

        // Admin Desa — wajib punya kecamatan + desa
        if ($user->hasRole('admin desa')) {
            if (empty($user->kecamatan) || empty($user->desa)) {
                abort(403, 'Admin Desa harus punya kecamatan dan desa');
            }

            session([
                'scope_kecamatan' => $user->kecamatan,
                'scope_desa' => $user->desa,
                'scope_level' => 'desa',
            ]);
        }

        // Kecamatan — wajib punya kecamatan
        if ($user->hasRole('kecamatan')) {
            if (empty($user->kecamatan)) {
                abort(403, 'Admin Kecamatan harus punya kecamatan');
            }

            session([
                'scope_kecamatan' => $user->kecamatan,
                'scope_desa' => null,
                'scope_level' => 'kecamatan',
            ]);
        }

        // Admin — no scope
        if ($user->hasRole('admin')) {
            session([
                'scope_kecamatan' => null,
                'scope_desa' => null,
                'scope_level' => 'kabupaten',
            ]);
        }

        return $next($request);
    }
}
