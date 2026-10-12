<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    /**
     * Display the login view.
     */
    public function create()
    {
        return Inertia::render('Auth/Login');
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(Request $request)
    {
        // Validasi disesuaikan dengan form frontend yang mengirim 'username'
        $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required'],
        ]);

        $usernameOrEmail = $request->input('username');

        // Deteksi otomatis: apakah yang diketik user berupa email atau username
        $fieldType = filter_var($usernameOrEmail, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        $credentials = [
            $fieldType => $usernameOrEmail,
            'password' => $request->input('password'),
        ];

        // Rate limiting berdasarkan input username/email + IP
        $throttleKey = Str::transliterate(
            Str::lower($usernameOrEmail) . '|' . $request->ip()
        );

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);

            throw ValidationException::withMessages([
                'username' => "Terlalu banyak percobaan login. Silakan coba lagi dalam {$seconds} detik.",
            ]);
        }

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            RateLimiter::clear($throttleKey);

            $request->session()->regenerate();

            // ============================================================
            // 🔥 REDIRECT BERDASARKAN ROLE
            // ============================================================
            $user = Auth::user();

            // Blokir akun nonaktif.
            if (($user->status ?? 'active') !== 'active') {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                throw ValidationException::withMessages([
                    'username' => 'Akun Anda dinonaktifkan. Hubungi super admin.',
                ]);
            }

            // Akun mobile (pokja & dasawisma) khusus aplikasi Android —
            // jangan biarkan masuk web (dulu lolos lalu nyasar ke dashboard
            // kabupaten atau area dasawisma web).
            if ($user->hasAnyRole(['pokja1', 'pokja2', 'pokja3', 'pokja4', 'dasawisma'])) {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                throw ValidationException::withMessages([
                    'username' => 'Akun ini khusus aplikasi Android. Silakan login lewat HP.',
                ]);
            }

            // Cap waktu login terakhir.
            $user->forceFill(['last_login' => now()])->saveQuietly();
            \App\Services\ActivityLogger::log('auth.login', $user, "Login: {$user->username}");

            $home = $this->roleHome($user);

            // Jangan biarkan url.intended lama menimpa redirect peran
            // (mis. kecamatan buka /dashboard sebelum login lalu malah
            // mendarat di dashboard kabupaten). Intended hanya dipakai
            // bila masih di dalam area peran + halaman profil sendiri.
            $intendedPath = parse_url((string) $request->session()->get('url.intended'), PHP_URL_PATH) ?: '/';
            if (! $this->intendedAllowed($intendedPath, $home)) {
                $request->session()->forget('url.intended');
            }

            return redirect()->intended($home);
        }

        RateLimiter::hit($throttleKey);

        throw ValidationException::withMessages([
            'username' => trans('auth.failed'),
        ]);
    }

    /**
     * Halaman utama per peran (dipakai sebagai default redirect login).
     */
    private function roleHome($user): string
    {
        if ($user->hasRole('admin desa')) {
            return '/desa';
        }

        if ($user->hasRole('kecamatan')) {
            return '/kecamatan';
        }

        return route('be.dashboard');
    }

    /**
     * Intended URL boleh dipakai hanya bila masih di area peran
     * (home + turunannya), halaman depan, atau halaman profil sendiri.
     */
    private function intendedAllowed(string $path, string $home): bool
    {
        $homePath = parse_url($home, PHP_URL_PATH) ?: '/';
        $prefix = rtrim($homePath, '/') . '/';

        return $path === $homePath
            || str_starts_with($path . '/', $prefix)
            || $path === '/'
            || str_starts_with($path, '/dashboard/settings');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
    {
        if (Auth::check()) {
            \App\Services\ActivityLogger::log('auth.logout', Auth::user(), 'Logout: ' . Auth::user()->username);
        }

        // Keluar juga dari mode pinjam-masuk jika ada.
        $request->session()->forget('impersonator_id');

        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
