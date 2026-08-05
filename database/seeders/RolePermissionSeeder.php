<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Buat Permission
        $permissions = [
            // User Management
            'view-users',
            'create-user',
            'edit-user',
            'delete-user',
            'manage-roles',

            // Profile
            'view-profile',
            'edit-profile',

            // Eviden (SPBE - nanti bisa dihapus/dikomen)
            'view-eviden',
            'create-eviden',
            'edit-eviden',
            'delete-eviden',

            // Indikator (SPBE - nanti bisa dihapus/dikomen)
            'view-indikator',
            'create-indikator',
            'edit-indikator',
            'delete-indikator',

            // ===== TAMBAHAN UNTUK KADER PKK =====
            'view-kader',
            'create-kader',
            'edit-kader',
            'delete-kader',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // 2. Buat Role & Assign Permission
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->givePermissionTo(Permission::all());

        $userRole = Role::firstOrCreate(['name' => 'user']);
        $userRole->givePermissionTo([
            // Permission untuk user biasa
            'view-eviden',
            'create-eviden',
            'edit-eviden',
            'delete-eviden',

            // ===== TAMBAHAN UNTUK KADER =====
            'view-kader',
            'create-kader',
            'edit-kader',
            'delete-kader',
        ]);

        // ===== TAMBAHAN ROLE KHUSUS PKK =====
        $pkkRole = Role::firstOrCreate(['name' => 'pkk']);
        $pkkRole->givePermissionTo([
            'view-kader',
            'create-kader',
            'edit-kader',
            'delete-kader',
            'view-profile',
            'edit-profile',
        ]);

        // 3. Buat User Contoh & Assign Role
        // 3.1 User Admin
        $admin = User::firstOrCreate(
            ['username' => 'admin'],
            [
                'name' => 'Admin PKK',
                'email' => 'admin@pkk.tasikmalaya.go.id',
                'password' => bcrypt('password'),
            ]
        );
        $admin->assignRole($adminRole);

        // 3.2 User Biasa
        $user = User::firstOrCreate(
            ['username' => 'user'],
            [
                'name' => 'User PKK',
                'email' => 'user@pkk.tasikmalaya.go.id',
                'password' => bcrypt('password'),
            ]
        );
        $user->assignRole($userRole);

        // 3.3 User Khusus PKK (Role pkk)
        $pkkUser = User::firstOrCreate(
            ['username' => 'pkk'],
            [
                'name' => 'Pengurus PKK',
                'email' => 'pkk@tasikmalaya.go.id',
                'password' => bcrypt('password'),
            ]
        );
        $pkkUser->assignRole($pkkRole);

        // 4. Data User Lainnya (Komentari dulu atau hapus yang gak perlu)
        // Ini data SPBE, bisa dikomen dulu atau dihapus total
        /*
        $users = [
            [
                'username' => 'bappeda',
                'password' => 'Bappeda@2025',
                'name' => 'BAPPEDA',
            ],
            [
                'username' => 'dukcapil',
                'password' => 'Dukcapil@2025',
                'name' => 'Disdukcapil',
            ],
            [
                'username' => 'dinkes',
                'password' => 'Dinkes@2025',
                'name' => 'Dinas Kesehatan',
            ],
            [
                'username' => 'bpkpd',
                'password' => 'Bpkpd@2025',
                'name' => 'BPKPD',
            ],
            [
                'username' => 'inspektorat',
                'password' => 'Inspektorat@2025',
                'name' => 'Inspektorat',
            ],
            [
                'username' => 'setdaorg',
                'password' => 'SetdaOrg@2025',
                'name' => 'Setda Organisasi',
            ],
            [
                'username' => 'setdalpse',
                'password' => 'SetdaLpse@2025',
                'name' => 'Setda LPSE',
            ],
            [
                'username' => 'setdahukum',
                'password' => 'SetdaHukum@2025',
                'name' => 'Setda Hukum',
            ],
            [
                'username' => 'setdaarsip',
                'password' => 'SetdaArsip@2025',
                'name' => 'Setda Kearsipan',
            ],
            [
                'username' => 'dpmptsp',
                'password' => 'dpmptsp@2025',
                'name' => 'DPMPTSP',
            ],
            [
                'username' => 'bkpsdm',
                'password' => 'Bkpsdm@2025',
                'name' => 'BKPSDM',
            ],
        ];

        foreach ($users as $userData) {
            $user = User::firstOrCreate(
                ['username' => $userData['username']],
                [
                    'name' => $userData['name'],
                    'email' => $userData['username'] . '@spbe.local',
                    'password' => bcrypt($userData['password']),
                ]
            );

            $user->assignRole($userRole);
        }
        */
    }
}
