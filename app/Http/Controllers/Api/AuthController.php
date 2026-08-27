<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Login khusus untuk aplikasi mobile kader Dasa Wisma.
     * Hanya role 'user' yang boleh lewat sini — admin & pkk tetap
     * lewat login web biasa (LoginController), sesuai kesepakatan
     * supaya dashboard web tidak "kebanjiran" akun kader lapangan.
     */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'email' => 'required_without:username|email',
            'password' => 'required|string',
        ]);

        // Cari user berdasarkan username ATAU email
        $user = User::where('username', $request->username)
            ->orWhere('email', $request->email)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Username/Email atau password salah.',
            ], 401);
        }

        // Cek status user
        if ($user->status !== 'active') {
            return response()->json([
                'message' => 'Akun Anda tidak aktif. Silakan hubungi admin.',
            ], 403);
        }

        // Cek role - boleh kader_dasawisma, pkk, atau admin
        if (!$user->hasAnyRole(['kader_dasawisma', 'pkk', 'admin'])) {
            return response()->json([
                'message' => 'Akun ini tidak memiliki akses ke aplikasi mobile.',
            ], 403);
        }

        // Hapus token lama supaya tidak menumpuk
        $user->tokens()->where('name', 'mobile-app')->delete();

        $token = $user->createToken('mobile-app')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil.',
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'email' => $user->email,
                    'roles' => $user->roles->pluck('name'),
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
     * Profil kader yang sedang login
     */
    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'status' => $user->status,
                'roles' => $user->roles->pluck('name'),
            ],
        ]);
    }
}
