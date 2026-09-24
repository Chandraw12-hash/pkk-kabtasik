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

            // Kalau role admin desa → redirect ke /desa
            if ($user->hasRole('admin desa')) {
                return redirect()->intended('/desa');
            }

            // Kalau role kecamatan → redirect ke /kecamatan
            if ($user->hasRole('kecamatan')) {
                return redirect()->intended('/kecamatan');
            }

            // Kalau role admin → redirect ke /dashboard
            if ($user->hasRole('admin')) {
                return redirect()->intended(route('be.dashboard'));
            }

            // Fallback: redirect ke dashboard
            return redirect()->intended(route('be.dashboard'));
        }

        RateLimiter::hit($throttleKey);

        throw ValidationException::withMessages([
            'username' => trans('auth.failed'),
        ]);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
