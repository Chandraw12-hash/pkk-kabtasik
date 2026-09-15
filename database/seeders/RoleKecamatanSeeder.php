<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Hash;

class RoleKecamatanSeeder extends Seeder
{
    /**
     * 39 Kecamatan Kabupaten Tasikmalaya (resmi, Permendagri No. 137 Tahun 2017)
     * Diurutkan alfabet A-Z
     */
    private const KECAMATAN_LIST = [
        'Bantarkalong',
        'Bojongasih',
        'Bojonggambir',
        'Ciawi',
        'Cibalong',
        'Cigalontang',
        'Cikalong',
        'Cikatomas',
        'Cineam',
        'Cipatujah',
        'Cisayong',
        'Culamega',
        'Gunungtanjung',
        'Jamanis',
        'Jatiwaras',
        'Kadipaten',
        'Karangjaya',
        'Karangnunggal',
        'Leuwisari',
        'Mangunreja',
        'Manonjaya',
        'Padakembang',
        'Pagerageung',
        'Pancatengah',
        'Parungponteng',
        'Puspahiang',
        'Rajapolah',
        'Salawu',
        'Salopa',
        'Sariwangi',
        'Singaparna',
        'Sodonghilir',
        'Sukahening',
        'Sukaraja',
        'Sukarame',
        'Sukaratu',
        'Sukaresik',
        'Tanjungjaya',
        'Taraju',
    ];

    public function run(): void
    {
        // ============================================================
        // 1. BIKIN PERMISSION KHUSUS KECAMATAN
        // ============================================================
        $permissions = [
            'view_laporan_kecamatan',
            'view_rekap_kecamatan',
            'export_excel_kecamatan',
            'export_pdf_kecamatan',
            'print_laporan_kecamatan',
            'view_notifikasi_kecamatan',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $this->command->info('✅ Permission kecamatan dibuat: ' . count($permissions));

        // ============================================================
        // 2. BIKIN ROLE KECAMATAN
        // ============================================================
        $role = Role::firstOrCreate(['name' => 'kecamatan']);
        $role->syncPermissions($permissions);

        $this->command->info('✅ Role "kecamatan" dibuat dengan ' . count($permissions) . ' permission');

        // ============================================================
        // 3. BIKIN USER UNTUK SEMUA 39 KECAMATAN
        // ============================================================
        $this->command->info('');
        $this->command->info('📋 Bikin user untuk ' . count(self::KECAMATAN_LIST) . ' kecamatan...');
        $this->command->info('');

        foreach (self::KECAMATAN_LIST as $namaKecamatan) {
            // Normalisasi nama kecamatan untuk username
            // Contoh: "Bantarkalong" → "kecamatan.bantarkalong"
            $slug = strtolower(str_replace(' ', '', trim($namaKecamatan)));
            $username = 'kecamatan.' . $slug;

            // Bikin / update user
            // ✅ FIX: updateOrCreate memastikan kolom `kecamatan` SELALU terisi
            //    walau user-nya sudah ada sebelumnya
            $user = User::updateOrCreate(
                ['username' => $username],
                [
                    'name' => 'Sekretaris TP PKK Kec. ' . trim($namaKecamatan),
                    'email' => $username . '@pkk-tasikmalaya.go.id',
                    'password' => Hash::make('password123'),
                    'kecamatan' => trim($namaKecamatan), // ✅ PASTI TERISI
                    'status' => 'active',
                ]
            );

            // Assign role kecamatan
            $user->syncRoles(['kecamatan']);

            $this->command->info("  ✅ {$username} → Kec. {$namaKecamatan}");
        }

        // ============================================================
        // 4. INFO LOGIN
        // ============================================================
        $this->command->info('');
        $this->command->info('========================================');
        $this->command->info('📋 INFO LOGIN ADMIN KECAMATAN');
        $this->command->info('========================================');
        $this->command->info('Format username: kecamatan.{namakecamatan}');
        $this->command->info('Password default: password123');
        $this->command->info('');
        $this->command->info('Contoh:');
        $this->command->info('  - kecamatan.singaparna');
        $this->command->info('  - kecamatan.cikalong');
        $this->command->info('  - kecamatan.sukaresik');
        $this->command->info('========================================');
    }
}
