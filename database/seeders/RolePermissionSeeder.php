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
        // ─── 1. BUAT PERMISSION ──────────────────────────────────────────────────
        $permissions = [
            // Admin
            'access-admin',

            // Dasawisma (Mobile)
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

        // ─── 2. ROLE ADMIN ──────────────────────────────────────────────────────────
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->givePermissionTo(Permission::all());

        // ─── 3. ROLE DASAWISMA (MOBILE) ──────────────────────────────────────────
        $dasawismaRole = Role::firstOrCreate(['name' => 'dasawisma']);
        $dasawismaRole->givePermissionTo(['access-dasawisma']);

        // ─── 4. BUAT USER ADMIN ──────────────────────────────────────────────────
        $admin = User::updateOrCreate(
            ['email' => 'admin@pkk.test'],
            [
                'name' => 'Admin Kabupaten',
                'username' => 'adminpkk',
                'password' => bcrypt('password123'),
            ]
        );
        $admin->assignRole($adminRole);

        // ─── 5. BUAT USER DASAWISMA (MOBILE) ────────────────────────────────────
        $dasawisma = User::updateOrCreate(
            ['email' => 'pkk@pkk.test'],
            [
                'name' => 'Pengurus PKK',
                'username' => 'pkk_user',
                'password' => bcrypt('password123'),
            ]
        );
        $dasawisma->assignRole($dasawismaRole);
    }
}
