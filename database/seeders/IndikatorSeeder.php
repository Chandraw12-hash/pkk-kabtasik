<?php

namespace Database\Seeders;

use App\Models\Indikator;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class IndikatorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $indikators = [
            '1. Tingkat Kematangan Kebijakan Internal Arsitektur SPBE Instansi Pusat/Pemerintahan Daerah',
            '2. Tingkat Kematangan Kebijakan Internal Peta Rencana SPBE Instansi Pusat/Pemerintahan Daerah',
            '3. Tingkat Kematangan Kebijakan Internal Manjemen Data',
            '4. Tingkat Kematangan Kebijakan Internal Pengembangan Aplikasi SPBE',
            '5. Tingkat Kematangan Kebijakan Internal Layanan Pusat Data',
            '6. Tingkat Kematangan Kebijakan Internal Layanan Jaringan Intra Instansi Pusat/Pemerintah Daerah',
            '7. Tingkat Kematangan Kebijakan Internal Penggunaan Sistem Penghubung Layanan Instansi Pusat/Pemerintah Daerah',
            '8. Tingkat Kematangan Kebijakan Internal Manajemem Keamanan Informasi',
            '9. Tingkat Kematangan Kebijakan Internal Audit TIK',
            '10. Tingkat Kematangan Kebijakan Internal Tim Koordinasi SPBE Instansi Pusat/Pemerintah Daerah',
            '11. Tingkat Kematangan Arsitektur SPBE Instansi Pusat/Pemerintah Daerah',
            '12. Tingkat Kematangan Peta Rencana SPBE Instansi Pusat/Pemerintah Daerah',
            '13. Tingkat Kematangan Keterpaduan Rencana dan Anggaran SPBE',
            '14. Tingkat Kematangan Inovasi Proses Bisnis SPBE',
            '15. Tingkat Kematangan Pembangunan Aplikasi SPBE',
            '16. Tingkat Kematangan Layanan Pusat Data',
            '17. Tingkat Kematangan Layanan Jaringan Intra Instansi Pusat/Pemerintah Daerah',
            '18. Tingkat Kematangan Penggunaan Sistem Penghubung Layanan Instansi Pusat/Pemerintah Daerah',
            '19. Tingkat Kematangan Tim Koordinasi SPBE Instansi Pusat/Pemerintah Daerah',
            '20. Tingkat Kematangan Kolaborasi Penerapan SPBE',
            '21. Tingkat Kematangan Penerapan Manajemeen Risiko SPBE',
            '22. Tingkat Kematangan Penerapan Manajemen Keamanan Informasi',
            '23. Tingkat Kematangan Penerapan Manajemen Data',
            '24. Tingkat Kematangan Penerapan Manajemen Aset TIK',
            '25. Tingkat Kematangan Penerapan Kompetensi Sumber Daya Manusia SPBE',
            '26. Tingkat Kematangan Penerapan Manajemen Pengetahuan',
            '27. Tingkat Kematangan Penerapan Manajemen Perubahan',
            '28. Tingkat Kematangan Penerapan Manajemen Layanan SPBE',
            '29. Tingkat Kematangan Pelaksanaan Audit Infrastruktur SPBE',
            '30. Tingkat Kematangan Pelaksanaan Audit SPBE',
            '31. Tingkat Kematangan Pelaksanaan Audit Keamanan SPBE',
            '32. Tingkat Kematangan Layanan Perencanaan',
            '33. Tingkat Kematangan Layanan Penganggaran',
            '34. Tingkat Kematangan Layanan Keuangan',
            '35. Tingkat Kematangan Layanan Pengadaan Barang dan Jasa',
            '36. Tingkat Kematangan Layanan Kepegawaian',
            '37. Tingkat Kematangan Layanan Kearsipan Dinamis',
            '38. Tingkat Kematangan Layanan Pengelolaan Barang Milik Negara/Daerah',
            '39. Tingkat Kematangan Layanan Internal Pemerintah',
            '40. Tingkat Kematangan Layanan Akuntabilitas Kinerja Organisasi',
            '41. Tingkat Kematangan Layanan Kinerja Pegawai',
            '42. Tingkat Kematangan Layanan Pengaduan Pelayanan Publik',
            '43. Tingkat Kematangan Layanan Data Terbuka',
            '44. Tingkat Kematangan Layanan Jaringan Dokumentasi dan Informasi Hukum (JDIH)',
            '45. Tingkat Kematangan Layanan Publik Sektor 1',
            '46. Tingkat Kematangan Layanan Publik Sektor 2',
            '47. Tingkat Kematangan Layanan Publik Sektor 3',
        ];

        foreach ($indikators as $nama) {
            Indikator::create([
                'nama_indikator' => $nama,
            ]);
        }
    }
}
