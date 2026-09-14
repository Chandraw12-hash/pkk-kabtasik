<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Login khusus untuk aplikasi mobile (kader & admin).
     * Support login pakai USERNAME atau EMAIL.
     */
    public function login(Request $request)
    {
        // Username & email sama-sama opsional, tapi salah satu WAJIB ada.
        $request->validate([
            'username' => 'required_without:email|string',
            'email'    => 'required_without:username|email',
            'password' => 'required|string',
        ]);

        // Cari user by username ATAU email
        $user = User::where(function ($query) use ($request) {
                if ($request->filled('username')) {
                    $query->where('username', $request->username);
                }
                if ($request->filled('email')) {
                    $query->orWhere('email', $request->email);
                }
            })
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Username/Email atau password salah.',
            ], 401);
        }

        // Cek status user
        if ($user->status !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'Akun Anda tidak aktif. Silakan hubungi admin.',
            ], 403);
        }

        // Cek role - boleh kader_dasawisma, pkk, admin, atau dasawisma
        if (!$user->hasAnyRole(['kader_dasawisma', 'pkk', 'admin', 'dasawisma'])) {
            return response()->json([
                'success' => false,
                'message' => 'Akun ini tidak memiliki akses ke aplikasi mobile.',
            ], 403);
        }

        // Hapus token lama supaya tidak menumpuk
        $user->tokens()->where('name', 'mobile-app')->delete();

        $token = $user->createToken('mobile-app')->plainTextToken;

        // 🔥 Tentukan primary role (prioritas)
        $primaryRole = 'dasawisma';
        $priority = ['admin', 'pkk', 'kader_dasawisma', 'dasawisma', 'user'];
        $userRoles = $user->roles->pluck('name')->toArray();

        foreach ($priority as $role) {
            if (in_array($role, $userRoles)) {
                $primaryRole = $role;
                break;
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil.',
            'data' => [
                'token' => $token,
                'user' => [
                    'id'       => $user->id,
                    'name'     => $user->name,
                    'username' => $user->username,
                    'email'    => $user->email,
                    'status'   => $user->status,
                    'roles'    => $user->roles->pluck('name'),
                    'role'     => $primaryRole,   // ← TAMBAH INI
                ],
            ],
        ]);
    }

    /**
     * Logout — cabut token yang sedang dipakai request ini saja
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil.',
        ]);
    }

    /**
     * Profil user yang sedang login
     */
    public function me(Request $request)
    {
        $user = $request->user();

        // Tentukan primary role
        $primaryRole = 'dasawisma';
        $priority = ['admin', 'pkk', 'kader_dasawisma', 'dasawisma', 'user'];
        $userRoles = $user->roles->pluck('name')->toArray();

        foreach ($priority as $role) {
            if (in_array($role, $userRoles)) {
                $primaryRole = $role;
                break;
            }
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id'       => $user->id,
                'name'     => $user->name,
                'username' => $user->username,
                'email'    => $user->email,
                'status'   => $user->status,
                'roles'    => $user->roles->pluck('name'),
                'role'     => $primaryRole,   // ← TAMBAH INI
            ],
        ]);
    }
}
