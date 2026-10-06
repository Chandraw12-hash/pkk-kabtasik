<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        // Permission yang dibutuhkan halaman Users/Roles/Settings.
        // Dibuat idempotent agar aman dijalankan berulang.
        $permissions = [
            'access-admin',
            'access-dasawisma',
            'access-pokja1',
            'access-pokja2',
            'access-pokja3',
            'access-pokja4',
            'approve-berita',
            'reject-berita',
            'approve-laporan',
            'reject-laporan',
            'view-users',
            'create-user',
            'edit-user',
            'delete-user',
            'manage-roles',
            'manage-settings',
            'view-activity-logs',
            'manage-backup',
            'view-system-health',
        ];

        foreach ($permissions as $name) {
            Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
        }

        // Role super-admin = semua permission + bypass via Gate::before.
        $superAdmin = Role::firstOrCreate(['name' => 'super-admin', 'guard_name' => 'web']);
        $superAdmin->givePermissionTo(Permission::all());

        // Role admin tetap diberi hak kelola harian agar tidak terkunci,
        // tapi TANPA hak paling sensitif (dicabut di bawah).
        $admin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $admin->givePermissionTo(Permission::all());
        $admin->revokePermissionTo([
            'manage-backup',
            'view-activity-logs',
            'view-system-health',
        ]);

        // Akun super admin default. Ganti password setelah login pertama.
        $user = User::updateOrCreate(
            ['email' => 'superadmin@pkk.test'],
            [
                'name' => 'Super Administrator',
                'username' => 'superadmin',
                'password' => Hash::make('password123'),
                'status' => 'active',
            ]
        );
        $user->syncRoles([$superAdmin]);

        // Bersihkan cache permission Spatie.
        app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

        $this->command->info('Super Admin : superadmin / password123 (SEGERA GANTI!)');
    }
}
