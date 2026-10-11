<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\KaderAccountSync;
use Illuminate\Console\Command;

class SinkronKaderAkun extends Command
{
    protected $signature = 'kader:sinkron-akun';

    protected $description = 'Cerminkan akun kader (pokja/dasawisma) ke Data Kader + tautkan yang cocok';

    public function handle(): int
    {
        $dibuat = 0;
        $ditaut = 0;
        $dilewat = 0;

        $users = User::all();
        foreach ($users as $user) {
            $sebelum = \App\Models\Kader::where('user_id', $user->id)->count();
            $hasil = KaderAccountSync::syncFromUser($user);
            if ($hasil === null) {
                $dilewat++;
                continue;
            }
            if ($sebelum > 0) {
                $ditaut++;
            } else {
                $dibuat++;
            }
        }

        $this->info("Selesai: {$dibuat} baris baru, {$ditaut} diperbarui, {$dilewat} dilewat (role non-kader).");

        return self::SUCCESS;
    }
}
