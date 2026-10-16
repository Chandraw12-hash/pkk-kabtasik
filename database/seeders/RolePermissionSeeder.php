<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // ─── 1. BUAT PERMISSION ──────────────────────────────────
        $permissions = [
            // Admin
            'access-admin',

            // Akses aplikasi mobile
            'access-dasawisma',
            'access-pokja1',
            'access-pokja2',
            'access-pokja3',
            'access-pokja4',

            // Berita - Approve/Reject (khusus Admin)
            'approve-berita',
            'reject-berita',

            // Laporan - Approve/Reject (khusus Admin)
            'approve-laporan',
            'reject-laporan',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // ─── 2. ROLE ADMIN ──────────────────────────────────────
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->givePermissionTo(Permission::all());

        // ─── 3. ROLE POKJA PER BIDANG (MOBILE) ─────────────────
        $pokjaRoles = [
            'pokja1' => 'Pokja I',
            'pokja2' => 'Pokja II',
            'pokja3' => 'Pokja III',
            'pokja4' => 'Pokja IV',
        ];

        foreach (array_keys($pokjaRoles) as $roleName) {
            $role = Role::firstOrCreate(['name' => $roleName]);
            $role->syncPermissions(["access-{$roleName}"]);
        }

        // Migrasikan akun lama agar tidak kehilangan akses mobile.
        $legacyPokjaRole = Role::where('name', 'pokja')->first();
        if ($legacyPokjaRole) {
            foreach ($legacyPokjaRole->users as $legacyUser) {
                $legacyUser->syncRoles(['pokja1']);
            }
            $legacyPokjaRole->delete();
        }

        foreach (['user', 'pkk'] as $staleName) {
            $staleRole = Role::where('name', $staleName)->first();
            if ($staleRole) {
                $staleRole->syncPermissions([]);
                $staleRole->delete();
            }
        }

        // Role Dasawisma khusus Web
        Role::firstOrCreate(['name' => 'dasawisma', 'guard_name' => 'web']);

        // ─── 4. BUAT 5 USER ADMIN KABUPATEN ─────────────────────
        $admins = [
            ['username' => 'adminpkkA', 'name' => 'Admin Kabupaten A'],
            ['username' => 'adminpkkB', 'name' => 'Admin Kabupaten B'],
            ['username' => 'adminpkkC', 'name' => 'Admin Kabupaten C'],
            ['username' => 'adminpkkD', 'name' => 'Admin Kabupaten D'],
            ['username' => 'adminpkkE', 'name' => 'Admin Kabupaten E'],
        ];

        foreach ($admins as $data) {
            $user = User::updateOrCreate(
                ['username' => $data['username']],
                [
                    'name' => $data['name'],
                    'email' => $data['username'] . '@pkk.test',
                    'password' => bcrypt('password123'),
                    'status' => 'active',
                ]
            );
            $user->syncRoles([$adminRole]);
        }

        // ─── 5. BUAT AKUN POKJA PER BIDANG ─────────────────────
        foreach ($pokjaRoles as $roleName => $label) {
            $user = User::updateOrCreate(
                ['email' => "{$roleName}@pkk.test"],
                [
                    'name' => "Pengurus {$label}",
                    'username' => $roleName,
                    'password' => bcrypt('password123'),
                    'status' => 'active',
                ]
            );
            $user->syncRoles([$roleName]);
        }

        // ─── 5b. BUAT USER DASA WISMA (WEB) ─────────────────────
        $dasawismaRole = Role::firstOrCreate(['name' => 'dasawisma', 'guard_name' => 'web']);
        $dasawismaUser = User::updateOrCreate(
            ['username' => 'dasawisma'],
            [
                'name' => 'Kader Dasawisma',
                'email' => 'dasawisma@pkk.test',
                'password' => bcrypt('password123'),
                'status' => 'active',
            ]
        );
        $dasawismaUser->syncRoles([$dasawismaRole]);

        // ─── 6. INFO LOGIN ───────────────────────────────────────
        $this->command->info('');
        $this->command->info('========================================');
        $this->command->info('📋 INFO LOGIN APLIKASI');
        $this->command->info('========================================');
        $this->command->info('Admin Kabupaten:');
        $this->command->info('  adminpkkA / password123');
        $this->command->info('  adminpkkB / password123');
        $this->command->info('  adminpkkC / password123');
        $this->command->info('  adminpkkD / password123');
        $this->command->info('  adminpkkE / password123');
        $this->command->info('');
        $this->command->info('Dasawisma (Web)  : dasawisma / password123');
        $this->command->info('Pokja I (Mobile) : pokja1 / password123');
        $this->command->info('Pokja II (Mobile): pokja2 / password123');
        $this->command->info('Pokja III (Mobile): pokja3 / password123');
        $this->command->info('Pokja IV (Mobile): pokja4 / password123');
        $this->command->info('========================================');
    }
}
