<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
            AdminUserSeeder::class,
            IndikatorSeeder::class,
            RoleKecamatanSeeder::class,
            AdminDesaSeeder::class,  // ← TAMBAH INI
            WilayahDesaSeeder::class, // master wilayah → tabel (UI super-admin)
            DasawismaSeeder::class, // 1 akun dasawisma per desa (351)
            PokjaPengurusSeeder::class, // 30 akun pengurus Pokja I-IV
            SuperAdminSeeder::class,
            GaleriSeeder::class, // 8 galeri launching (foto lokal)
            BeritaSeeder::class, // 6 berita launching (foto lokal)
        ]);
    }
}
