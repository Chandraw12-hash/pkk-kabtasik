<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AdminDesaSeeder extends Seeder
{
    public function run(): void
    {
        // ============================================================
        // 1. BUAT ROLE ADMIN DESA
        // ============================================================
        $role = Role::firstOrCreate([
            'name' => 'admin desa',
            'guard_name' => 'web',
        ]);

        // ============================================================
        // 2. BUAT PERMISSIONS
        // ============================================================
        $permissions = [
            'access-admin-desa',
            'import-data-desa',
            'view-data-desa',
            'export-data-desa',
            'print-data-desa',
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate([
                'name' => $perm,
                'guard_name' => 'web',
            ]);
        }

        // ============================================================
        // 3. ASSIGN PERMISSIONS KE ROLE
        // ============================================================
        $role->syncPermissions($permissions);

        // ============================================================
        // 4. BUAT USER TEST ADMIN DESA
        // ============================================================
        $user = User::firstOrCreate(
            ['username' => 'admindesa_test2'],
            [
                'name' => 'Admin Desa Test 2',
                'email' => 'admindesa2@test.com',
                'password' => Hash::make('password'),
                'kecamatan' => 'Culamega',
                'desa' => 'Desa Test',
                'nama_desa' => 'Desa Test',
                'status' => 'active',
            ]
        );

        // ============================================================
        // 5. ASSIGN ROLE KE USER
        // ============================================================
        $user->assignRole('admin desa');

        $this->command->info('✅ Admin Desa Seeder: role + permissions + user test — selesai.');
    }
}
