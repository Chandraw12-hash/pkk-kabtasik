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

        foreach (['dasawisma', 'user'] as $staleName) {
            $staleRole = Role::where('name', $staleName)->first();
            if ($staleRole) {
                $staleRole->syncPermissions([]);
                $staleRole->delete();
            }
        }

        // ─── 4. BUAT USER ADMIN ──────────────────────────────────
        $admin = User::updateOrCreate(
            ['email' => 'admin@pkk.test'],
            [
                'name' => 'Admin Kabupaten',
                'username' => 'adminpkk',
                'password' => bcrypt('password123'),
                'status' => 'active',
            ]
        );
        $admin->syncRoles([$adminRole]);

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

        // ─── 6. INFO LOGIN ───────────────────────────────────────
        $this->command->info('');
        $this->command->info('========================================');
        $this->command->info('📋 INFO LOGIN MOBILE');
        $this->command->info('========================================');
        $this->command->info('Admin  : adminpkk / password123');
        $this->command->info('Pokja I: pokja1 / password123');
        $this->command->info('Pokja II: pokja2 / password123');
        $this->command->info('Pokja III: pokja3 / password123');
        $this->command->info('Pokja IV: pokja4 / password123');
        $this->command->info('========================================');
    }
}
