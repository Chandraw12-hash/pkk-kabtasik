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
            'view-users',
            'create-user',
            'edit-user',
            'delete-user',
            'manage-roles',

            'view-profile',
            'edit-profile',

            'view-eviden',
            'create-eviden',
            'edit-eviden',
            'delete-eviden',

            'view-indikator',
            'create-indikator',
            'edit-indikator',
            'delete-indikator',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // 2. Buat Role & Assign Permission
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->givePermissionTo(Permission::all());

        $userRole = Role::firstOrCreate(['name' => 'user']);
        $userRole->givePermissionTo([
            'view-eviden',
            'create-eviden',
            'edit-eviden',
            'delete-eviden',
        ]);

        // 3. Buat User Contoh & Assign Role
        // 3. Buat User Admin IP
        $admin = User::firstOrCreate(
            ['username' => 'admin'], // Kunci pencarian
            [
                'name' => 'Admin IP',
                'email' => 'admin@gmail.com',
                'password' => bcrypt('password'),
            ]
        );
        $admin->assignRole($adminRole);
        
        $user = User::firstOrCreate(
            ['username' => 'user'], // Kunci pencarian
            [
                'name' => 'User',
                'email' => 'user@gmail.com',
                'password' => bcrypt('password'),
            ]
        );
        $user->assignRole($userRole);

        // 4. Data User Biasa (Tanpa SKPD)
        $users = [
            [
                'username' => 'user',
                'password' => 'password',
                'name' => 'User',
            ],
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
    }
}
