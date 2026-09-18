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

            // Dasawisma / Pokja (Mobile)
            'access-dasawisma',

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

        // ─── 3. ROLE POKJA (MOBILE) ─────────────────────────────
        $pokjaRole = Role::firstOrCreate(['name' => 'pokja']);
        $pokjaRole->givePermissionTo(['access-dasawisma']);

        // ─── 4. ROLE DASAWISMA (MOBILE) ─────────────────────────
        $dasawismaRole = Role::firstOrCreate(['name' => 'dasawisma']);
        $dasawismaRole->givePermissionTo(['access-dasawisma']);

        // ─── 5. BUAT USER ADMIN ──────────────────────────────────
        $admin = User::updateOrCreate(
            ['email' => 'admin@pkk.test'],
            [
                'name' => 'Admin Kabupaten',
                'username' => 'adminpkk',
                'password' => bcrypt('password123'),
                'status' => 'active',
            ]
        );
        $admin->syncRoles([$adminRole]); // syncRoles — biar ga ada role lain

        // ─── 6. BUAT USER POKJA (MOBILE) ────────────────────────
        $pokja = User::updateOrCreate(
            ['email' => 'pkk@pkk.test'],
            [
                'name' => 'Pengurus PKK',
                'username' => 'pkk_user',
                'password' => bcrypt('password123'),
                'status' => 'active',
            ]
        );
        $pokja->syncRoles([$pokjaRole]); // ✅ FIX: assign role POKJA, bukan dasawisma

        // ─── 7. BUAT USER DASAWISMA (MOBILE) ────────────────────
        $dasawisma = User::updateOrCreate(
            ['email' => 'melati@pkk.test'],
            [
                'name' => 'Kader Dasawisma Melati',
                'username' => 'dasawisma.melati',
                'password' => bcrypt('password123'),
                'status' => 'active',
            ]
        );
        $dasawisma->syncRoles([$dasawismaRole]); // ✅ FIX: assign role DASAWISMA

        // ─── 8. INFO LOGIN ───────────────────────────────────────
        $this->command->info('');
        $this->command->info('========================================');
        $this->command->info('📋 INFO LOGIN MOBILE');
        $this->command->info('========================================');
        $this->command->info('Admin  : adminpkk / password123');
        $this->command->info('Pokja  : pkk_user / password123');
        $this->command->info('Dasawisma: dasawisma.melati / password123');
        $this->command->info('========================================');
    }
}
