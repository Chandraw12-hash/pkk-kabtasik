<?php

namespace Database\Seeders;

use App\Models\Galeri;
use App\Models\GaleriFoto;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GaleriSeeder extends Seeder
{
    /**
     * Isi galeri launching: 8 kegiatan + 2-3 foto tambahan tiap galeri.
     * Foto fisik: storage/app/public/galeri/poto1-6.jpeg (disalin dari
     * public/assets/galeri/). Path DB tanpa prefix storage/public.
     * IDEMPOTEN: hapus child dulu, baru parent, dalam 1 transaksi.
     */
    public function run(): void
    {
        DB::transaction(function () {
            DB::table('galeri_fotos')->delete();
            DB::table('galeris')->delete();

            $galeris = [
                [
                    'judul' => 'Rapat Koordinasi TP PKK Kabupaten Tasikmalaya',
                    'deskripsi' => 'Rapat koordinasi pengurus TP PKK dalam rangka persiapan HKG PKK ke-53 tingkat Kabupaten.',
                    'foto' => 'galeri/poto1.jpeg',
                    'tanggal' => '2026-01-15',
                    'fotos' => [
                        ['foto' => 'galeri/poto3.jpeg', 'urutan' => 1],
                        ['foto' => 'galeri/poto4.jpeg', 'urutan' => 2],
                        ['foto' => 'galeri/poto5.jpeg', 'urutan' => 3],
                    ],
                ],
                [
                    'judul' => 'Pelatihan Kader Posyandu Se-Kabupaten Tasikmalaya',
                    'deskripsi' => 'Pelatihan peningkatan kapasitas kader posyandu dalam mendukung program kesehatan ibu dan anak.',
                    'foto' => 'galeri/poto2.jpeg',
                    'tanggal' => '2026-02-20',
                    'fotos' => [
                        ['foto' => 'galeri/poto4.jpeg', 'urutan' => 1],
                        ['foto' => 'galeri/poto6.jpeg', 'urutan' => 2],
                    ],
                ],
                [
                    'judul' => 'Peringatan HKG PKK ke-53 Tingkat Kabupaten Tasikmalaya',
                    'deskripsi' => 'Peringatan Hari Kesatuan Gerak PKK ke-53 dengan berbagai kegiatan bakti sosial dan lomba.',
                    'foto' => 'galeri/poto3.jpeg',
                    'tanggal' => '2026-03-08',
                    'fotos' => [
                        ['foto' => 'galeri/poto1.jpeg', 'urutan' => 1],
                        ['foto' => 'galeri/poto2.jpeg', 'urutan' => 2],
                        ['foto' => 'galeri/poto5.jpeg', 'urutan' => 3],
                    ],
                ],
                [
                    'judul' => 'Bimbingan Teknis Kader Dasawisma',
                    'deskripsi' => 'Bimtek peningkatan kompetensi kader dasawisma dalam pencatatan dan pelaporan data keluarga.',
                    'foto' => 'galeri/poto4.jpeg',
                    'tanggal' => '2026-04-12',
                    'fotos' => [
                        ['foto' => 'galeri/poto2.jpeg', 'urutan' => 1],
                        ['foto' => 'galeri/poto6.jpeg', 'urutan' => 2],
                    ],
                ],
                [
                    'judul' => 'Gerakan Tanam Sayur di Pekarangan (Aku Hatinya PKK)',
                    'deskripsi' => 'Gerakan pemanfaatan pekarangan untuk tanaman sayur guna mendukung ketahanan pangan keluarga.',
                    'foto' => 'galeri/poto5.jpeg',
                    'tanggal' => '2026-05-18',
                    'fotos' => [
                        ['foto' => 'galeri/poto1.jpeg', 'urutan' => 1],
                        ['foto' => 'galeri/poto3.jpeg', 'urutan' => 2],
                        ['foto' => 'galeri/poto6.jpeg', 'urutan' => 3],
                    ],
                ],
                [
                    'judul' => 'Penyuluhan Kesehatan Ibu dan Anak',
                    'deskripsi' => 'Penyuluhan kesehatan bagi ibu hamil dan ibu menyusui dalam rangka menurunkan angka stunting.',
                    'foto' => 'galeri/poto6.jpeg',
                    'tanggal' => '2026-06-25',
                    'fotos' => [
                        ['foto' => 'galeri/poto2.jpeg', 'urutan' => 1],
                        ['foto' => 'galeri/poto4.jpeg', 'urutan' => 2],
                    ],
                ],
                [
                    'judul' => 'Bakti Sosial Bersih Lingkungan',
                    'deskripsi' => 'Kegiatan gotong royong membersihkan lingkungan dalam rangka memperingati HUT Kabupaten Tasikmalaya.',
                    'foto' => 'galeri/poto1.jpeg',
                    'tanggal' => '2026-08-15',
                    'fotos' => [
                        ['foto' => 'galeri/poto3.jpeg', 'urutan' => 1],
                        ['foto' => 'galeri/poto5.jpeg', 'urutan' => 2],
                        ['foto' => 'galeri/poto6.jpeg', 'urutan' => 3],
                    ],
                ],
                [
                    'judul' => 'Lomba Cipta Menu B2SA (Beragam, Bergizi, Seimbang, Aman)',
                    'deskripsi' => 'Lomba cipta menu B2SA antar kader PKK kecamatan untuk mendukung pola makan sehat keluarga.',
                    'foto' => 'galeri/poto2.jpeg',
                    'tanggal' => '2026-10-05',
                    'fotos' => [
                        ['foto' => 'galeri/poto4.jpeg', 'urutan' => 1],
                        ['foto' => 'galeri/poto1.jpeg', 'urutan' => 2],
                    ],
                ],
            ];

            foreach ($galeris as $data) {
                $fotos = $data['fotos'] ?? [];
                unset($data['fotos']);

                $galeri = Galeri::create($data);

                foreach ($fotos as $foto) {
                    GaleriFoto::create(array_merge($foto, [
                        'galeri_id' => $galeri->id,
                    ]));
                }
            }

            $this->command->info(count($galeris) . ' galeri berhasil di-seed.');
        });
    }
}
