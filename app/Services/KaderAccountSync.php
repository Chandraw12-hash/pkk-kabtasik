<?php

namespace App\Services;

use App\Models\Kader;
use App\Models\User;

/**
 * Sinkronisasi Data Kader <-> Akun User.
 * Satu arah utama: akun (sumber) -> baris kader (cermin).
 * Kolom manual (nik, jabatan, alamat, foto, tanggal_bergabung)
 * TIDAK PERNAH ditimpa sinkronisasi.
 */
class KaderAccountSync
{
    /** Role yang otomatis punya baris kader. */
    public const KADER_ROLES = ['pokja1', 'pokja2', 'pokja3', 'pokja4', 'dasawisma'];

    /** Role -> kolom pokja kader (I/II/III/IV/null). */
    public const ROLE_POKJA = [
        'pokja1' => 'I',
        'pokja2' => 'II',
        'pokja3' => 'III',
        'pokja4' => 'IV',
    ];

    /**
     * Cerminkan akun ke baris kader. Return Kader|null (null = role tak relevan).
     */
    public static function syncFromUser(User $user): ?Kader
    {
        $roles = $user->getRoleNames()->map(fn ($r) => strtolower($r))->all();
        $kaderRole = null;
        foreach (self::KADER_ROLES as $candidate) {
            if (in_array($candidate, $roles, true)) {
                $kaderRole = $candidate;
                break;
            }
        }
        if ($kaderRole === null) {
            return null;
        }

        $row = Kader::where('user_id', $user->id)->first();
        if (! $row) {
            // Tautkan baris manual yang cocok (nama + kecamatan) bila ada.
            $row = Kader::whereNull('user_id')
                ->where('nama', $user->name)
                ->when($user->kecamatan, fn ($q) => $q->where('kecamatan', $user->kecamatan))
                ->first();
        }

        $data = [
            'user_id' => $user->id,
            'nama' => $user->name,
            'pokja' => self::ROLE_POKJA[$kaderRole] ?? null,
            'kecamatan' => $user->kecamatan,
            'desa_kelurahan' => $user->desa ?? $user->nama_desa,
            'no_hp' => $user->no_hp,
            'status_aktif' => ($user->status ?? 'active') === 'active',
        ];

        if (! $row) {
            $row = new Kader(['jabatan' => 'Anggota']);
        }
        $row->fill($data);
        // Jangan kosongkan jabatan manual yang sudah ada.
        if (empty($row->getOriginal('jabatan')) && empty($row->jabatan)) {
            $row->jabatan = 'Anggota';
        }
        $row->save();

        return $row->fresh();
    }

    /**
     * Akun dihapus: lepas tautan, tandai nonaktif, arsip baris tetap ada.
     */
    public static function unlinkUser(User $user): void
    {
        Kader::where('user_id', $user->id)->update([
            'user_id' => null,
            'status_aktif' => false,
        ]);
    }
}
