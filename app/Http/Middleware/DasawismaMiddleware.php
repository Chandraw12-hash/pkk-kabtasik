<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DasawismaMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        if (!$user->hasRole('dasawisma')) {
            abort(403, 'Akses ditolak. Hanya Kader Dasawisma.');
        }

        return $next($request);
    }
}
