<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AdminDesaSeeder extends Seeder
{
    /**
     * 39 Kecamatan Kabupaten Tasikmalaya + daftar desa.
     * Format: 'Nama Kecamatan' => ['Desa 1', 'Desa 2', ...]
     * Total: 39 kecamatan, 351 desa
     *
     * Dipakai juga oleh Api\WilayahController sebagai master
     * dropdown kecamatan → desa di aplikasi mobile.
     */
    public const DATA_DESA = [
        'Cipatujah' => [
            'Ciheras', 'Cipatujah', 'Sindangkerta', 'Cikawungading',
            'Bantarkalong', 'Darawati', 'Nagrog', 'Pameutingan',
            'Tobongjaya', 'Cipanas', 'Kertasari', 'Ciandum',
            'Nangelasari', 'Padawaras', 'Sukahurip',
        ],
        'Karangnunggal' => [
            'Cidadap', 'Ciawi', 'Cikupa', 'Karangnunggal',
            'Karangmekar', 'Cikukulu', 'Cibatuireng', 'Cibatu',
            'Sarimanggu', 'Sukawangun', 'Cintawangi', 'Cikapinis',
            'Sarimukti', 'Kujang',
        ],
        'Cikalong' => [
            'Cikalong', 'Kalapagenep', 'Cikancra', 'Singkir',
            'Panyiaran', 'Cibeber', 'Cikadu', 'Mandalajaya',
            'Cidadali', 'Cimanuk', 'Sindangjaya', 'Kubangsari',
            'Tonjongsari',
        ],
        'Pancatengah' => [
            'Cibuniasih', 'Pangliaran', 'Tonjong', 'Cibongas',
            'Tawang', 'Neglasari', 'Cikawung', 'Jayamukti',
            'Margaluyu', 'Mekarsari', 'Pancawangi',
        ],
        'Cikatomas' => [
            'Gunungsari', 'Cilumba', 'Pakemitan', 'Cogreg',
            'Cayur', 'Lengkongbarang', 'Sindangasih',
            'Tanjungbarang', 'Linggalaksana',
        ],
        'Cibalong' => [
            'Cisempur', 'Setiawaras', 'Eureunpalay',
            'Cibalong', 'Singajaya', 'Parung',
        ],
        'Parungponteng' => [
            'Parungponteng', 'Cigunung', 'Cibanteng', 'Barumekar',
            'Cibungur', 'Burujuljaya', 'Girikencana', 'Karyabakti',
        ],
        'Bantarkalong' => [
            'Simpang', 'Parakanhonje', 'Pamijahan', 'Sukamaju',
            'Wangunsari', 'Hegarwangi', 'Wakap', 'Sirnagalih',
        ],
        'Bojongasih' => [
            'Mertajaya', 'Cikadongdong', 'Bojongasih',
            'Sindangsari', 'Girijaya', 'Toblongan',
        ],
        'Culamega' => [
            'Cikuya', 'Cintabodas', 'Cipicung', 'Bojongsari',
            'Mekarlaksana',
        ],
        'Bojonggambir' => [
            'Bojongkapol', 'Pedangkamulyan', 'Bojonggambir',
            'Ciroyom', 'Wandasari', 'Campakasari', 'Mangkonjaya',
            'Kertanegla', 'Purwaraharja', 'Girimukti',
        ],
        'Sodonghilir' => [
            'Parumasan', 'Cukangkawung', 'Sodonghilir', 'Cikalong',
            'Cipaingeun', 'Leuwidulang', 'Muncang', 'Sepatnunggal',
            'Cukangjayaguna', 'Raksajaya', 'Pakalongan', 'Sukabakti',
        ],
        'Taraju' => [
            'Taraju', 'Cikubang', 'Deudeul', 'Purwarahayu',
            'Singasari', 'Banyuasih', 'Raksasari', 'Kertaraharja',
            'Pageralam',
        ],
        'Salawu' => [
            'Jahiang', 'Serang', 'Salawu', 'Neglasari',
            'Tanjungsari', 'Tenjowaringin', 'Sundawenang',
            'Kawungsari', 'Sukarasa', 'Kutawaringin',
            'Karangmukti', 'Margalaksana',
        ],
        'Puspahiang' => [
            'Mandalasari', 'Sukasari', 'Puspasari', 'Puspahiang',
            'Luyubakti', 'Pusparahayu', 'Cimanggu', 'Puspajaya',
        ],
        'Tanjungjaya' => [
            'Cikeusal', 'Cibalanarik', 'Sukanagara', 'Tanjungjaya',
            'Cilolohan', 'Cintajaya', 'Sukasenang',
        ],
        'Sukaraja' => [
            'Sukapura', 'Leuwibudah', 'Sirnajaya', 'Mekarjaya',
            'Linggaraja', 'Janggala', 'Margalaksana', 'Tarunajaya',
        ],
        'Salopa' => [
            'Mandalahayu', 'Mulyasari', 'Kawitan', 'Mandalawangi',
            'Karyawangi', 'Tanjungsari', 'Mandalaguna',
            'Karyamandala', 'Banjarwaringin',
        ],
        'Jatiwaras' => [
            'Kaputihan', 'Setiawangi', 'Sukakerta', 'Neglasari',
            'Jatiwaras', 'Papayan', 'Ciwarak', 'Kersagalih',
            'Mandalamekar', 'Kertarahayu', 'Mandalahurip',
        ],
        'Cineam' => [
            'Cisarua', 'Cikondang', 'Cijulang', 'Ciampanan',
            'Cineam', 'Rajadatu', 'Ancol', 'Nagaratengah',
            'Pasirmukti', 'Madiasari',
        ],
        'Karangjaya' => [
            'Sirnajaya', 'Karang Jaya', 'Karanglayung', 'Citalahab',
        ],
        'Manonjaya' => [
            'Cihaur', 'Cilangkap', 'Pasirpanjang', 'Cibeber',
            'Kamulyan', 'Manonjaya', 'Margaluyu', 'Pasirbatang',
            'Kalimanggis', 'Margahayu', 'Batusumur', 'Gunajaya',
        ],
        'Gunungtanjung' => [
            'Cinunjang', 'Gunungtanjung', 'Bojongsari', 'Jatijaya',
            'Tanjungsari', 'Giriwangi', 'Malatisuka',
        ],
        'Singaparna' => [
            'Cikunten', 'Singaparna', 'Cipakat', 'Cintaraja',
            'Cikunir', 'Cikadongdong', 'Sukaasih', 'Sukamulya',
            'Singasari', 'Sukaherang',
        ],
        'Mangunreja' => [
            'Sukasukur', 'Salebu', 'Mangunreja', 'Margajaya',
            'Pasirsalam', 'Sukaluyu',
        ],
        'Sukarame' => [
            'Sukarame', 'Sukamenak', 'Sukakarsa', 'Padasuka',
            'Sukarapih', 'Wargakerta',
        ],
        'Cigalontang' => [
            'Kersamaju', 'Nangtang', 'Pusparaja', 'Jayapura',
            'Lengkongjaya', 'Nangerang', 'Sukamanah', 'Sirnaraja',
            'Cidugaleun', 'Parentas', 'Puspamukti', 'Tenjonagara',
            'Cigalontang', 'Sirnagalih', 'Tanjungkarang', 'Sirnaputra',
        ],
        'Leuwisari' => [
            'Arjasari', 'Ciawang', 'Cigadog', 'Linggawangi',
            'Jayamukti', 'Mandalagiri', 'Linggamulya',
        ],
        'Padakembang' => [
            'Cilampunghilir', 'Rancapaku', 'Mekarjaya', 'Cisaruni',
            'Padakembang',
        ],
        'Sariwangi' => [
            'Sariwangi', 'Sukaharja', 'Jayaratu', 'Linggasirna',
            'Sirnasari', 'Sukamulih', 'Selawangi', 'Jayaputra',
        ],
        'Sukaratu' => [
            'Linggajati', 'Tawangbanteng', 'Sinagar', 'Gunungsari',
            'Sukamahi', 'Sukagalih', 'Sukaratu', 'Indrajaya',
        ],
        'Cisayong' => [
            'Cisayong', 'Sukajadi', 'Sukasukur', 'Sukamukti',
            'Nusawangi', 'Cikadu', 'Cileuleus', 'Jatihurip',
            'Sukasetia', 'Purwasari', 'Sukaraharja', 'Mekarwangi',
            'Santanamekar',
        ],
        'Sukahening' => [
            'Banyurasa', 'Calincing', 'Sukahening', 'Kiarajangkung',
            'Kudadepa', 'Banyuresmi', 'Sundakerta',
        ],
        'Rajapolah' => [
            'Dawagung', 'Rajapolah', 'Manggungjaya', 'Manggungsari',
            'Sukaraja', 'Rajamandala', 'Sukanagalih', 'Tanjungpura',
        ],
        'Jamanis' => [
            'Condong', 'Bojonggaok', 'Sindangraja', 'Karangmulya',
            'Geresik', 'Karangsembung', 'Tanjungmekar', 'Karangresik',
        ],
        'Ciawi' => [
            'Gombong', 'Bugel', 'Margasari', 'Pakemitan',
            'Ciawi', 'Sukamantri', 'Pasirhuni', 'Citamba',
            'Kertamukti', 'Kurniabakti', 'Pakemitankidul',
        ],
        'Kadipaten' => [
            'Kadipaten', 'Dirgahayu', 'Cibahayu', 'Mekarsari',
            'Buniasih', 'Pamoyanan',
        ],
        'Pagerageung' => [
            'Cipacing', 'Pagerageung', 'Sukamaju', 'Tanjungkerta',
            'Puteran', 'Guranteng', 'Nanggewer', 'Sukapada',
            'Pagersari', 'Sukadana',
        ],
        'Sukaresik' => [
            'Cipondok', 'Sukamenak', 'Sukaratu', 'Banjarsari',
            'Tanjungsari', 'Sukapancar', 'Sukaresik', 'Margamulya',
        ],
    ];

    public function run(): void
    {
        // ============================================================
        // 1. BIKIN PERMISSION KHUSUS ADMIN DESA
        // ============================================================
        $permissions = [
            'access-admin-desa',
            'import-data-desa',
            'view-data-desa',
            'export-data-desa',
            'print-data-desa',
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm]);
        }

        $this->command->info('✅ Permission admin desa dibuat: ' . count($permissions));

        // ============================================================
        // 2. BIKIN ROLE ADMIN DESA
        // ============================================================
        $role = Role::firstOrCreate(['name' => 'admin desa']);
        $role->syncPermissions($permissions);

        $this->command->info('✅ Role "admin desa" dibuat dengan ' . count($permissions) . ' permission');
        $this->command->info('');

        // ============================================================
        // 3. LOOPING SEMUA KECAMATAN & DESA
        // ============================================================
        $totalKecamatan = 0;
        $totalDesa = 0;
        $totalDibuat = 0;
        $totalDiupdate = 0;

        foreach (self::DATA_DESA as $kecamatan => $desaList) {
            $totalKecamatan++;

            foreach ($desaList as $namaDesa) {
                $totalDesa++;

                // Normalisasi username
                // Contoh: "Ciheras" + "Cipatujah" → "admindesa.ciheras.cipatujah"
                $slugDesa = strtolower(str_replace(' ', '', trim($namaDesa)));
                $slugKecamatan = strtolower(str_replace(' ', '', trim($kecamatan)));
                $username = 'admindesa.' . $slugDesa . '.' . $slugKecamatan;

                // Cek — udah ada atau belum
                $existing = User::where('username', $username)->first();

                // Bikin / update user
                $user = User::updateOrCreate(
                    ['username' => $username],
                    [
                        'name' => 'Admin Desa ' . trim($namaDesa) . ' — Kec. ' . trim($kecamatan),
                        'email' => $username . '@pkk-tasikmalaya.go.id',
                        'password' => Hash::make('password123'),
                        'kecamatan' => trim($kecamatan),
                        'desa' => trim($namaDesa),
                        'nama_desa' => trim($namaDesa),
                        'status' => 'active',
                        'email_verified_at' => now(),
                    ]
                );

                // Assign role
                $user->syncRoles(['admin desa']);

                if ($existing) {
                    $totalDiupdate++;
                } else {
                    $totalDibuat++;
                }
            }
        }

        // ============================================================
        // 4. INFO
        // ============================================================
        $this->command->info('========================================');
        $this->command->info('📋 HASIL SEEDER ADMIN DESA');
        $this->command->info('========================================');
        $this->command->info("  Kecamatan     : {$totalKecamatan}");
        $this->command->info("  Total Desa    : {$totalDesa}");
        $this->command->info("  User Baru     : {$totalDibuat}");
        $this->command->info("  User Diupdate : {$totalDiupdate}");
        $this->command->info('');
        $this->command->info('========================================');
        $this->command->info('📋 INFO LOGIN ADMIN DESA');
        $this->command->info('========================================');
        $this->command->info('Format username: admindesa.{desa}.{kecamatan}');
        $this->command->info('Password default: password123');
        $this->command->info('');
        $this->command->info('Contoh:');
        $this->command->info('  - admindesa.ciheras.cipatujah');
        $this->command->info('  - admindesa.cikalong.cikalong');
        $this->command->info('  - admindesa.sukaresik.sukaresik');
        $this->command->info('========================================');
    }
}
