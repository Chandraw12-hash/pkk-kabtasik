<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Cek apakah role 'admin' sudah ada, jika belum buat otomatis
        $adminRole = Role::firstOrCreate(['name' => 'admin']);

        // Buat user admin baru (jika email belum terdaftar)
        // PERBAIKAN: Tambahkan 'username' di sini
        $user = User::firstOrCreate(
            ['email' => 'admin@pkk.test'],
            [
                'name' => 'Super Admin PKK',
                'username' => 'adminpkk', // Tambahkan username unik di sini
                'password' => bcrypt('password123'),
            ]
        );

        // Berikan role admin ke user tersebut (jika belum punya role)
        if (!$user->hasRole('admin')) {
            $user->assignRole($adminRole);
        }

        // Informasi akun di terminal
        $this->command->info('User admin berhasil dibuat.');
        $this->command->info('Email: admin@pkk.test');
        $this->command->info('Username: adminpkk');
        $this->command->info('Password: password123');
    }
}
