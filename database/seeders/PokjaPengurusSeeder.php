<?php

namespace Database\Seeders;

use App\Models\Kader;
use App\Models\User;
use App\Services\KaderAccountSync;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class PokjaPengurusSeeder extends Seeder
{
    /**
     * 30 akun pengurus Pokja I-IV berbasis tabel struktur_organisasi.
     * - name: nama asli sesuai struktur (tampil di akun + Data Kader).
     * - username/email: pola pendek nama-depan.pokjaN agar mudah diketik
     *   ibu-ibu (eva.pokja1 vs eva.pokja2 tetap unik karena bawa pokja).
     * - role: pokja1-4 (akses mobile + terkunci kategorinya masing-masing).
     * - Jabatan cermin dipetakan ke nilai yang diizinkan check constraint
     *   kader.jabatan (Ketua Pokja X / Wakil Ketua / Sekretaris / Anggota).
     * - Akun generik pokja1-4 (Pengurus Pokja X) TIDAK disentuh.
     * Password default: password123
     */
    private const PENGURUS = [
        // ===== POKJA I =====
        ['nama' => 'Suci Tarini, S.STP., MM.', 'username' => 'suci.pokja1', 'role' => 'pokja1', 'jabatan' => 'Ketua Pokja I'],
        ['nama' => 'Rossi Hermawaty, S.', 'username' => 'rossi.pokja1', 'role' => 'pokja1', 'jabatan' => 'Wakil Ketua'],
        ['nama' => 'Priliana Susanti, ST., M.Si.', 'username' => 'priliana.pokja1', 'role' => 'pokja1', 'jabatan' => 'Sekretaris'],
        ['nama' => "Eni Nur'aeni, S.Pd.I", 'username' => 'eni.pokja1', 'role' => 'pokja1', 'jabatan' => 'Anggota'],
        ['nama' => 'Ustadzah Aroh Siti Saharah', 'username' => 'aroh.pokja1', 'role' => 'pokja1', 'jabatan' => 'Anggota'],
        ['nama' => 'Nining Cahyaningsih, SH., M.H', 'username' => 'nining.pokja1', 'role' => 'pokja1', 'jabatan' => 'Anggota'],
        ['nama' => 'Eva Tita Maesaroh, SE', 'username' => 'eva.pokja1', 'role' => 'pokja1', 'jabatan' => 'Anggota'],
        ['nama' => 'Hj. Iyen Nuryanah, S.ST,M., M.Si.', 'username' => 'iyen.pokja1', 'role' => 'pokja1', 'jabatan' => 'Anggota'],
        // ===== POKJA II =====
        ['nama' => 'Dr. Depon Nurul Aida, S.Ag, M.Pd.', 'username' => 'depon.pokja2', 'role' => 'pokja2', 'jabatan' => 'Ketua Pokja II'],
        ['nama' => 'Hj. Elin Karilna Sahroni, S.IP.', 'username' => 'elin.pokja2', 'role' => 'pokja2', 'jabatan' => 'Wakil Ketua'],
        ['nama' => 'Hj. Rade Maulida.', 'username' => 'rade.pokja2', 'role' => 'pokja2', 'jabatan' => 'Sekretaris'],
        ['nama' => 'Nuraeni', 'username' => 'nuraeni.pokja2', 'role' => 'pokja2', 'jabatan' => 'Anggota'],
        ['nama' => 'Ipa Sunarti', 'username' => 'ipa.pokja2', 'role' => 'pokja2', 'jabatan' => 'Anggota'],
        ['nama' => 'Eva Sri Sugiarti, S.KM., M.Si', 'username' => 'eva.pokja2', 'role' => 'pokja2', 'jabatan' => 'Anggota'],
        ['nama' => 'Ati Suciati, SH', 'username' => 'ati.pokja2', 'role' => 'pokja2', 'jabatan' => 'Anggota'],
        ['nama' => 'Ela Susilawati.', 'username' => 'ela.pokja2', 'role' => 'pokja2', 'jabatan' => 'Anggota'],
        // ===== POKJA III =====
        ['nama' => 'Ida Rosida, S.P.', 'username' => 'ida.pokja3', 'role' => 'pokja3', 'jabatan' => 'Ketua Pokja III'],
        ['nama' => 'Wiwik Hikmawati, S.P., M.P.', 'username' => 'wiwik.pokja3', 'role' => 'pokja3', 'jabatan' => 'Wakil Ketua'],
        ['nama' => 'Dewi Sartika, S.I.Kom.', 'username' => 'dewi.pokja3', 'role' => 'pokja3', 'jabatan' => 'Sekretaris'],
        ['nama' => 'Nengsih Siti Aisah, S.Pd', 'username' => 'nengsih.pokja3', 'role' => 'pokja3', 'jabatan' => 'Anggota'],
        ['nama' => 'Ai Nurfadilah, S.Pd', 'username' => 'ai.pokja3', 'role' => 'pokja3', 'jabatan' => 'Anggota'],
        ['nama' => 'Yani Suryani, S.P', 'username' => 'yani.pokja3', 'role' => 'pokja3', 'jabatan' => 'Anggota'],
        ['nama' => 'Irman Hirdasah.', 'username' => 'irman.pokja3', 'role' => 'pokja3', 'jabatan' => 'Anggota'],
        // ===== POKJA IV =====
        ['nama' => 'Mutiarawati.', 'username' => 'mutiarawati.pokja4', 'role' => 'pokja4', 'jabatan' => 'Ketua Pokja IV'],
        ['nama' => 'Lilis Herlinawati, SE.', 'username' => 'lilis.pokja4', 'role' => 'pokja4', 'jabatan' => 'Wakil Ketua'],
        ['nama' => 'Nando Bangkit Muhamad, SE., MM.', 'username' => 'nando.pokja4', 'role' => 'pokja4', 'jabatan' => 'Sekretaris'],
        ['nama' => 'dr. Nia Nuraeni SPKJ', 'username' => 'nia.pokja4', 'role' => 'pokja4', 'jabatan' => 'Anggota'],
        ['nama' => 'Candrawati PD. S.IP', 'username' => 'candrawati.pokja4', 'role' => 'pokja4', 'jabatan' => 'Anggota'],
        ['nama' => 'Desti Anggraeni', 'username' => 'desti.pokja4', 'role' => 'pokja4', 'jabatan' => 'Anggota'],
        ['nama' => 'Sri Handayani.', 'username' => 'sri.pokja4', 'role' => 'pokja4', 'jabatan' => 'Anggota'],
    ];

    public function run(): void
    {
        $dibuat = 0;
        $diupdate = 0;

        foreach (self::PENGURUS as $p) {
            $existing = User::where('username', $p['username'])->first();

            $user = User::updateOrCreate(
                ['username' => $p['username']],
                [
                    'name' => $p['nama'],
                    'email' => $p['username'] . '@pkk-tasikmalaya.go.id',
                    'password' => Hash::make('password123'),
                    'kecamatan' => null,
                    'desa' => null,
                    'nama_desa' => null,
                    'status' => 'active',
                    'email_verified_at' => now(),
                ]
            );

            $user->syncRoles([$p['role']]);

            // Cerminkan ke Data Kader (observer created tak jalan untuk
            // seeder karena role ditempel setelah create — pola sama
            // seperti UserController@store), lalu set jabatan asli.
            KaderAccountSync::syncFromUser($user->fresh());
            Kader::where('user_id', $user->id)->update(['jabatan' => $p['jabatan']]);

            if ($existing) {
                $diupdate++;
            } else {
                $dibuat++;
            }
        }

        // Pastikan role pokja1-4 punya permission mobile (idempoten).
        foreach (['pokja1', 'pokja2', 'pokja3', 'pokja4'] as $roleName) {
            $role = Role::firstOrCreate(['name' => $roleName]);
            $role->syncPermissions(['access-' . $roleName]);
        }

        $this->command->info('========================================');
        $this->command->info('📋 HASIL SEEDER PENGURUS POKJA');
        $this->command->info('========================================');
        $this->command->info('  Total       : ' . count(self::PENGURUS));
        $this->command->info("  User Baru   : {$dibuat}");
        $this->command->info("  User Update : {$diupdate}");
        $this->command->info('');
        $this->command->info('Format username: nama-depan.pokjaN (password123)');
        $this->command->info('Contoh ketua: suci.pokja1, depon.pokja2, ida.pokja3, mutiarawati.pokja4');
        $this->command->info('Akun generik pokja1-4 tidak disentuh.');
        $this->command->info('========================================');
    }
}
