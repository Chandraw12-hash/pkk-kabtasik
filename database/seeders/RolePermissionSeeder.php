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
        // 1. Buat Permission
        $permissions = [
            'view-users', 'create-user', 'edit-user', 'delete-user', 'manage-roles',
            'view-profile', 'edit-profile',
            'view-kader', 'create-kader', 'edit-kader', 'delete-kader',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // 2. Buat Role & Assign Permission
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->givePermissionTo(Permission::all());

        $userRole = Role::firstOrCreate(['name' => 'user']);
        $userRole->givePermissionTo(['view-kader', 'create-kader', 'edit-kader', 'delete-kader']);

        $pkkRole = Role::firstOrCreate(['name' => 'pkk']);
        $pkkRole->givePermissionTo(['view-kader', 'create-kader', 'edit-kader', 'delete-kader', 'view-profile', 'edit-profile']);

        // 3. Buat User Default untuk Setiap Role

        // 3.1 User Admin
        $admin = User::updateOrCreate(
            ['email' => 'admin@pkk.test'],
            [
                'name' => 'Super Admin PKK',
                'username' => 'adminpkk',
                'password' => bcrypt('password123'),
            ]
        );
        $admin->assignRole($adminRole);

        // 3.2 User PKK
        $pkk = User::updateOrCreate(
            ['email' => 'pkk@pkk.test'],
            [
                'name' => 'Pengurus PKK',
                'username' => 'pkk_user',
                'password' => bcrypt('password123'),
            ]
        );
        $pkk->assignRole($pkkRole);

        // 3.3 User Biasa
        $user = User::updateOrCreate(
            ['email' => 'user@pkk.test'],
            [
                'name' => 'User Kader',
                'username' => 'user_biasa',
                'password' => bcrypt('password123'),
            ]
        );
        $user->assignRole($userRole);
    }
}
