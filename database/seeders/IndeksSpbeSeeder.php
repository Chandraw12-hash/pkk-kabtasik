<?php

namespace Database\Seeders;

use App\Models\IndeksSpbe;
use Illuminate\Database\Seeder;

class IndeksSpbeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Root: SPBE
        $spbe = IndeksSpbe::create(['nama_indeks' => 'SPBE', 'jenis' => 'indeks', 'urutan' => 1]);
        $spbe->nilaiIndeks()->create(['tahun' => 2025, 'nilai' => 4.00]);

        // 1. Domain Kebijakan SPBE
        $domainKebijakan = IndeksSpbe::create(['nama_indeks' => 'Domain Kebijakan SPBE', 'parent_id' => $spbe->id, 'jenis' => 'domain', 'urutan' => 1]);
        $domainKebijakan->nilaiIndeks()->create(['tahun' => 2025, 'nilai' => 4.70]);

            // Aspek
            $aspekKebijakanInternal = IndeksSpbe::create(['nama_indeks' => 'Kebijakan Internal Tata Kelola SPBE', 'parent_id' => $domainKebijakan->id, 'jenis' => 'aspek', 'urutan' => 1]);
            $aspekKebijakanInternal->nilaiIndeks()->create(['tahun' => 2025, 'nilai' => 4.70]);


        // 2. Domain Tata Kelola SPBE
        $domainTataKelola = IndeksSpbe::create(['nama_indeks' => 'Domain Tata Kelola SPBE', 'parent_id' => $spbe->id, 'jenis' => 'domain', 'urutan' => 2]);
        $domainTataKelola->nilaiIndeks()->create(['tahun' => 2025, 'nilai' => 4.40]);

            // Aspek
            $aspekPerencanaan = IndeksSpbe::create(['nama_indeks' => 'Perencanaan Strategis SPBE', 'parent_id' => $domainTataKelola->id, 'jenis' => 'aspek', 'urutan' => 1]);
            $aspekPerencanaan->nilaiIndeks()->create(['tahun' => 2025, 'nilai' => 4.00]);

            $aspekTIK = IndeksSpbe::create(['nama_indeks' => 'Teknologi Informasi dan Komunikasi', 'parent_id' => $domainTataKelola->id, 'jenis' => 'aspek', 'urutan' => 2]);
            $aspekTIK->nilaiIndeks()->create(['tahun' => 2025, 'nilai' => 5.00]);

            $aspekPenyelenggara = IndeksSpbe::create(['nama_indeks' => 'Penyelenggara SPBE', 'parent_id' => $domainTataKelola->id, 'jenis' => 'aspek', 'urutan' => 3]);
            $aspekPenyelenggara->nilaiIndeks()->create(['tahun' => 2025, 'nilai' => 4.00]);


        // 3. Domain Manajemen SPBE
        $domainManajemen = IndeksSpbe::create(['nama_indeks' => 'Domain Manajemen SPBE', 'parent_id' => $spbe->id, 'jenis' => 'domain', 'urutan' => 3]);
        $domainManajemen->nilaiIndeks()->create(['tahun' => 2025, 'nilai' => 1.64]);

            // Aspek
            $aspekPenerapan = IndeksSpbe::create(['nama_indeks' => 'Penerapan Manajemen SPBE', 'parent_id' => $domainManajemen->id, 'jenis' => 'aspek', 'urutan' => 1]);
            $aspekPenerapan->nilaiIndeks()->create(['tahun' => 2025, 'nilai' => 1.88]);

            $aspekAudit = IndeksSpbe::create(['nama_indeks' => 'Audit TIK', 'parent_id' => $domainManajemen->id, 'jenis' => 'aspek', 'urutan' => 2]);
            $aspekAudit->nilaiIndeks()->create(['tahun' => 2025, 'nilai' => 1.00]);


        // 4. Domain Layanan SPBE
        $domainLayanan = IndeksSpbe::create(['nama_indeks' => 'Domain Layanan SPBE', 'parent_id' => $spbe->id, 'jenis' => 'domain', 'urutan' => 4]);
        $domainLayanan->nilaiIndeks()->create(['tahun' => 2025, 'nilai' => 4.45]);

            // Aspek
            $aspekLayananAdmin = IndeksSpbe::create(['nama_indeks' => 'Layanan Administrasi Pemerintahan Berbasis Elektronik', 'parent_id' => $domainLayanan->id, 'jenis' => 'aspek', 'urutan' => 1]);
            $aspekLayananAdmin->nilaiIndeks()->create(['tahun' => 2025, 'nilai' => 4.30]);

            $aspekLayananPublik = IndeksSpbe::create(['nama_indeks' => 'Layanan Publik Berbasis Elektronik', 'parent_id' => $domainLayanan->id, 'jenis' => 'aspek', 'urutan' => 2]);
            $aspekLayananPublik->nilaiIndeks()->create(['tahun' => 2025, 'nilai' => 4.67]);

    }
}
