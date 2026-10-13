<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DasawismaSeeder extends Seeder
{
    /**
     * 1 akun Dasawisma per desa (351 akun) berbasis
     * AdminDesaSeeder::DATA_DESA (39 kecamatan).
     *
     * Format username: {desa}.{kecamatan} (slug tanpa spasi, lowercase —
     * pola pendek ramah ibu-ibu, hemat ~10 char vs prefix dasawisma.).
     * Tetap unik 100% karena selalu bawa nama kecamatan (22 nama desa
     * kembar antar kecamatan, mis. tanjungsari x4).
     * Contoh: cikunir.singaparna (18 char).
     * Password default: password123
     */
    public function run(): void
    {
        // 1. Permission + role dasawisma (idempoten).
        // NOTE: RolePermissionSeeder membuat role dasawisma tanpa permission,
        // jadi di sini sekalian dilengkapi agar login mobile lolos gate.
        $permission = Permission::firstOrCreate(['name' => 'access-dasawisma']);

        $role = Role::firstOrCreate(['name' => 'dasawisma', 'guard_name' => 'web']);
        $role->syncPermissions([$permission]);

        $this->command->info('✅ Role "dasawisma" siap dengan permission access-dasawisma');
        $this->command->info('');

        // 2. Loop semua kecamatan & desa.
        $totalKecamatan = 0;
        $totalDesa = 0;
        $totalDibuat = 0;
        $totalDiupdate = 0;

        foreach (AdminDesaSeeder::DATA_DESA as $kecamatan => $desaList) {
            $totalKecamatan++;

            foreach ($desaList as $namaDesa) {
                $totalDesa++;

                $slugDesa = strtolower(str_replace(' ', '', trim($namaDesa)));
                $slugKecamatan = strtolower(str_replace(' ', '', trim($kecamatan)));
                $username = $slugDesa . '.' . $slugKecamatan;

                $existing = User::where('username', $username)->first();

                $user = User::updateOrCreate(
                    ['username' => $username],
                    [
                        'name' => 'Dasawisma ' . trim($namaDesa) . ' — Kec. ' . trim($kecamatan),
                        'email' => $username . '@pkk-tasikmalaya.go.id',
                        'password' => Hash::make('password123'),
                        'kecamatan' => trim($kecamatan),
                        'desa' => trim($namaDesa),
                        'nama_desa' => trim($namaDesa),
                        'status' => 'active',
                        'email_verified_at' => now(),
                    ]
                );

                $user->syncRoles([$role]);

                if ($existing) {
                    $totalDiupdate++;
                } else {
                    $totalDibuat++;
                }
            }
        }

        // 3. Bersihkan pola lama (dasawisma.{desa}.{kecamatan}) agar tak dobel
        // dengan pola pendek. Akun generik 'dasawisma' (tanpa titik) tidak
        // tersentuh pola LIKE ini. Aman: 351 akun lama baru dibuat seeder dan
        // belum punya laporan/berita.
        $polaLamaDihapus = User::where('username', 'LIKE', 'dasawisma.%')->delete();
        $this->command->info("🧹 Pola lama dasawisma.* dihapus: {$polaLamaDihapus}");

        // 4. Info.
        $this->command->info('========================================');
        $this->command->info('📋 HASIL SEEDER DASAWISMA');
        $this->command->info('========================================');
        $this->command->info("  Kecamatan     : {$totalKecamatan}");
        $this->command->info("  Total Desa    : {$totalDesa}");
        $this->command->info("  User Baru     : {$totalDibuat}");
        $this->command->info("  User Diupdate : {$totalDiupdate}");
        $this->command->info('');
        $this->command->info('========================================');
        $this->command->info('📋 INFO LOGIN DASAWISMA');
        $this->command->info('========================================');
        $this->command->info('Format username: {desa}.{kecamatan}');
        $this->command->info('Password default: password123');
        $this->command->info('');
        $this->command->info('Contoh Singaparna:');
        $this->command->info('  - cikunten.singaparna');
        $this->command->info('  - singaparna.singaparna');
        $this->command->info('  - cikunir.singaparna');
        $this->command->info('========================================');
    }
}
