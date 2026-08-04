<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeadersMiddleware
{
    /**
     * Menambahkan security headers pada setiap response HTTP.
     *
     * Headers ini melindungi dari:
     * - MIME-type sniffing (X-Content-Type-Options)
     * - Clickjacking (X-Frame-Options)
     * - Reflected XSS (X-XSS-Protection)
     * - Referrer leakage (Referrer-Policy)
     * - Unauthorized browser feature access (Permissions-Policy)
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Mencegah browser menebak MIME type — harus sesuai Content-Type header
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // Mencegah halaman di-embed dalam iframe oleh domain lain (anti-clickjacking)
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');

        // Mengaktifkan filter XSS bawaan browser (proteksi reflected XSS)
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // Membatasi informasi referrer yang dikirim ke domain lain
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Membatasi akses fitur browser (kamera, mikrofon, geolocation, dll)
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

        return $response;
    }
}
