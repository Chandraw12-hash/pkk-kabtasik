<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ForceJsonResponse
{
    /**
     * Paksa semua request yang lewat sini (grup route "api") dianggap
     * mengharapkan JSON, apapun header Accept yang dikirim client.
     *
     * Tanpa ini, kalau validasi gagal dan client (Postman/app) tidak
     * kirim header "Accept: application/json" secara eksplisit, Laravel
     * diam-diam redirect ke halaman sebelumnya (perilaku default untuk
     * form web) alih-alih balikin JSON error — bikin bingung karena
     * responsnya jadi HTML, bukan pesan error yang jelas.
     */
    public function handle(Request $request, Closure $next)
    {
        $request->headers->set('Accept', 'application/json');

        return $next($request);
    }
}
