<?php

namespace App\Policies;

use App\Models\LaporanKegiatan;
use App\Models\User;

class LaporanKegiatanPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'kecamatan']);
    }

    public function view(User $user, LaporanKegiatan $laporan): bool
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        if ($user->hasRole('kecamatan')) {
            return $this->sameKecamatan($user, $laporan);
        }

        return false;
    }

    public function export(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'kecamatan']);
    }

    public function print(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'kecamatan']);
    }

    public function update(User $user, LaporanKegiatan $laporan): bool
    {
        return $user->hasRole('admin');
    }

    public function delete(User $user, LaporanKegiatan $laporan): bool
    {
        return $user->hasRole('admin');
    }

    public function approve(User $user, LaporanKegiatan $laporan): bool
    {
        return $user->hasRole('admin');
    }

    public function reject(User $user, LaporanKegiatan $laporan): bool
    {
        return $user->hasRole('admin');
    }

    private function sameKecamatan(User $user, LaporanKegiatan $laporan): bool
    {
        if (empty($user->kecamatan) || empty($laporan->kecamatan)) {
            return false;
        }

        return strtoupper(trim($user->kecamatan)) === strtoupper(trim($laporan->kecamatan));
    }
}
