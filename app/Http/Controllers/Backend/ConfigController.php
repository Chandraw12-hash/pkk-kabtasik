<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class ConfigController extends Controller
{
    /**
     * Display the user profile settings page.
     */
    public function profile(Request $request)
    {
        return Inertia::render('Backend/Settings/Profile', [
            'mustVerifyEmail' => $request->user() instanceof \Illuminate\Contracts\Auth\MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'photo' => ['nullable', 'image', 'max:1024'], // 1MB Max
        ]);

        if ($request->hasFile('photo')) {
            // Delete old photo if exists (optional logic)
            // Store new photo
            $path = $request->file('photo')->store('profile-photos', 'public');
            // In a real app, you might save this path to a 'profile_photo_path' column
            // For now, we assume standard Laravel behavior or simple update
             $user->forceFill([
                'profile_photo_path' => $path,
            ]);
        }

        $user->fill($request->only('name', 'email'));

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return redirect()->route('be.settings.profile')->with('success', 'Profil berhasil diperbarui.');
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Password berhasil diperbarui.');
    }

    /**
     * Display the application settings page (Admin Only).
     */
    public function app()
    {
        // Fetch settings from DB
        $settings = DB::table('settings')->pluck('value', 'key');

        return Inertia::render('Backend/Settings/App', [
            'settings' => $settings,
            'tokens' => $this->deviceTokens(request()->user()),
            'sessions' => $this->deviceSessions(request()),
        ]);
    }

    /**
     * Update the application settings (Admin Only).
     */
    public function updateApp(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'app_name' => 'required|string|max:255',
            'app_logo' => 'nullable|image|max:2048', // 2MB
            'primary_color' => 'nullable|string|max:7', // Hex color
        ]);

        // Simpan App Name
        DB::table('settings')->updateOrInsert(
            ['key' => 'app_name'],
            ['value' => $validated['app_name'], 'updated_at' => now()]
        );

        // Simpan Primary Color
        if ($request->has('primary_color')) {
             DB::table('settings')->updateOrInsert(
                ['key' => 'primary_color'],
                ['value' => $validated['primary_color'], 'updated_at' => now()]
            );
        }

         // Handle Logo Upload
        if ($request->hasFile('app_logo')) {
            $path = $request->file('app_logo')->store('app-logo', 'public');
            DB::table('settings')->updateOrInsert(
                ['key' => 'app_logo'],
                ['value' => $path, 'updated_at' => now()]
            );
        }

        // Clear Cache agar perubahan langsung terlihat
        \Illuminate\Support\Facades\Cache::forget('app_settings');

        return redirect()->route('be.settings.app')->with('success', 'Pengaturan aplikasi berhasil disimpan.');
    }

    /**
     * Daftar token API (perangkat mobile) milik user.
     */
    protected function deviceTokens($user): array
    {
        return $user->tokens()->orderByDesc('last_used_at')->orderByDesc('id')->get()->map(function ($t) {
            return [
                'id' => $t->id,
                'name' => $t->name,
                'last_used' => $t->last_used_at ? $t->last_used_at->diffForHumans() : 'Belum dipakai',
                'created' => $t->created_at ? $t->created_at->format('d/m/Y H:i') : '-',
            ];
        })->values()->toArray();
    }

    /**
     * Sesi web lain milik user (selain sesi berjalan).
     */
    protected function deviceSessions(Request $request): array
    {
        try {
            return DB::table('sessions')
                ->where('user_id', $request->user()->id)
                ->where('id', '!=', $request->session()->getId())
                ->orderByDesc('last_activity')
                ->get()
                ->map(function ($s) {
                    return [
                        'id' => $s->id,
                        'ip' => $s->ip_address ?? '-',
                        'device' => $this->deviceLabel($s->user_agent ?? ''),
                        'last_used' => \Carbon\Carbon::createFromTimestamp($s->last_activity)->diffForHumans(),
                    ];
                })
                ->values()
                ->toArray();
        } catch (\Throwable $e) {
            return [];
        }
    }

    protected function deviceLabel(string $agent): string
    {
        $os = str_contains($agent, 'Android') ? 'Android' : (str_contains($agent, 'iPhone') || str_contains($agent, 'iPad') ? 'iOS' : (str_contains($agent, 'Windows') ? 'Windows' : (str_contains($agent, 'Mac') ? 'macOS' : (str_contains($agent, 'Linux') ? 'Linux' : 'Perangkat'))));
        foreach (['Edge' => 'Edge', 'Chrome' => 'Chrome', 'Firefox' => 'Firefox', 'Safari' => 'Safari'] as $key => $name) {
            if (str_contains($agent, $key) && ! ($key === 'Chrome' && str_contains($agent, 'Edge')) && ! ($key === 'Safari' && str_contains($agent, 'Chrome'))) {
                return $name . ' • ' . $os;
            }
        }

        return $os;
    }

    /**
     * Logout dari semua perangkat: cabut semua token API + sesi web lain.
     */
    public function logoutAllDevices(Request $request)
    {
        $user = $request->user();
        $user->tokens()->delete();
        try {
            DB::table('sessions')
                ->where('user_id', $user->id)
                ->where('id', '!=', $request->session()->getId())
                ->delete();
        } catch (\Throwable $e) {
        }

        return back()->with('success', 'Semua perangkat lain berhasil di-logout.');
    }

    /**
     * Cabut satu token API milik sendiri.
     */
    public function revokeToken(Request $request, int $id)
    {
        $request->user()->tokens()->where('id', $id)->delete();

        return back()->with('success', 'Akses perangkat dicabut.');
    }

    /**
     * Cabut satu sesi web lain milik sendiri.
     */
    public function revokeSession(Request $request, string $id)
    {
        try {
            DB::table('sessions')
                ->where('user_id', $request->user()->id)
                ->where('id', '!=', $request->session()->getId())
                ->where('id', $id)
                ->delete();
        } catch (\Throwable $e) {
        }

        return back()->with('success', 'Sesi perangkat dicabut.');
    }
}
