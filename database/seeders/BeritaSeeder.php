<?php

namespace Database\Seeders;

use App\Models\Berita;
use App\Models\BeritaFoto;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BeritaSeeder extends Seeder
{
    /**
     * Isi berita launching: 6 berita + 2-3 foto tambahan tiap berita.
     * Foto fisik: storage/app/public/berita-photos/poto1-6.jpeg (disalin
     * dari public/assets/berita/). Status langsung approved agar tampil
     * di publik saat launching. IDEMPOTEN (child dulu, baru parent).
     *
     * Mapping cover:
     * poto1 = jajaran pembina (Ibu Bupati, Ibu Wakil Bupati, Ibu Sekda)
     * poto2 = bendahara & sekretaris
     * poto3-6 = Pokja I s.d. IV
     */
    public function run(): void
    {
        DB::transaction(function () {
            DB::table('berita_fotos')->delete();
            DB::table('beritas')->delete();

            $admin = User::where('username', 'superadmin')->first() ?? User::first();
            $userId = $admin?->id;

            $beritas = [
                [
                    'judul' => 'Pengukuhan Pengurus TP PKK Kabupaten Tasikmalaya Masa Bakti 2025-2030',
                    'konten' => '<p>Tim Penggerak PKK Kabupaten Tasikmalaya resmi mengukuhkan jajaran pengurus masa bakti 2025-2030. Pengukuhan dipimpin langsung oleh Ibu Bupati Tasikmalaya selaku Ketua Pembina TP PKK, didampingi Ibu Wakil Bupati dan Ibu Sekretaris Daerah.</p><p>Dalam sambutannya, Ibu Bupati menekankan peran strategis PKK sebagai mitra pemerintah dalam pemberdayaan keluarga, penurunan stunting, dan penguatan ketahanan pangan di 39 kecamatan.</p><p>Pengurus baru diharapkan segera menyusun program kerja yang selaras dengan 10 Program Pokok PKK serta bersinergi dengan perangkat daerah terkait.</p>',
                    'kategori' => 'Kegiatan',
                    'foto' => 'berita-photos/poto1.jpeg',
                    'tanggal' => '2026-01-10',
                    'fotos' => [
                        ['foto' => 'berita-photos/poto2.jpeg', 'urutan' => 1],
                        ['foto' => 'berita-photos/poto3.jpeg', 'urutan' => 2],
                    ],
                ],
                [
                    'judul' => 'Rapat Koordinasi Sekretariat TP PKK: Bendahara dan Sekretaris Susun Rencana Kerja 2026',
                    'konten' => '<p>Unsur sekretariat TP PKK Kabupaten Tasikmalaya yang terdiri atas sekretaris dan bendahara menggelar rapat koordinasi penyusunan rencana kerja dan anggaran tahun 2026.</p><p>Rapat membahas tertib administrasi, pengelolaan keuangan organisasi, serta penyiapan data dukung pelaporan ke TP PKK Provinsi Jawa Barat.</p><p>Dihasilkan kesepakatan kalender kegiatan triwulanan dan pembagian tugas pendampingan pokja I sampai IV.</p>',
                    'kategori' => 'Pemberitaan Desa',
                    'foto' => 'berita-photos/poto2.jpeg',
                    'tanggal' => '2026-02-05',
                    'fotos' => [
                        ['foto' => 'berita-photos/poto1.jpeg', 'urutan' => 1],
                        ['foto' => 'berita-photos/poto4.jpeg', 'urutan' => 2],
                        ['foto' => 'berita-photos/poto5.jpeg', 'urutan' => 3],
                    ],
                ],
                [
                    'judul' => 'Pokja I Gelar Pembinaan Pola Asuh Anak dan Remaja di Era Digital',
                    'konten' => '<p>Kelompok Kerja I TP PKK Kabupaten Tasikmalaya melaksanakan pembinaan pola asuh anak dan remaja bagi kader di tingkat kecamatan.</p><p>Kegiatan mengangkat materi penghayatan nilai Pancasila dalam keluarga, pendampingan anak bermedia sosial, serta pencegahan kenakalan remaja melalui penguatan komunikasi orang tua dan anak.</p><p>Peserta yang terdiri atas para Ketua Pokja I desa diharapkan menularkan materi ini melalui pertemuan rutin dasawisma.</p>',
                    'kategori' => 'Kegiatan',
                    'foto' => 'berita-photos/poto3.jpeg',
                    'tanggal' => '2026-04-18',
                    'fotos' => [
                        ['foto' => 'berita-photos/poto1.jpeg', 'urutan' => 1],
                        ['foto' => 'berita-photos/poto4.jpeg', 'urutan' => 2],
                    ],
                ],
                [
                    'judul' => 'Pokja II Dorong PAUD dan Taman Bacaan di Setiap Desa',
                    'konten' => '<p>Kelompok Kerja II TP PKK Kabupaten Tasikmalaya mendorong penguatan layanan PAUD sejenis dan taman bacaan masyarakat di seluruh desa.</p><p>Melalui program Bina Keluarga Balita (BKB), kader dilatih memantau tumbuh kembang anak usia dini sekaligus menggerakkan minat baca keluarga.</p><p>Desa percontohan yang telah memiliki taman bacaan aktif mendapat apresiasi dan didorong menjadi rujukan bagi desa sekitar.</p>',
                    'kategori' => 'Kegiatan',
                    'foto' => 'berita-photos/poto4.jpeg',
                    'tanggal' => '2026-06-12',
                    'fotos' => [
                        ['foto' => 'berita-photos/poto2.jpeg', 'urutan' => 1],
                        ['foto' => 'berita-photos/poto6.jpeg', 'urutan' => 2],
                        ['foto' => 'berita-photos/poto3.jpeg', 'urutan' => 3],
                    ],
                ],
                [
                    'judul' => 'Pokja III Panen Bersama Kebun Hatinya PKK: Wujudkan Ketahanan Pangan Keluarga',
                    'konten' => '<p>Kelompok Kerja III TP PKK Kabupaten Tasikmalaya menggelar panen bersama kebun Hatinya PKK sebagai wujud gerakan pemanfaatan pekarangan.</p><p>Kegiatan Aku Hatinya PKK mengajak setiap keluarga menanam sayur, tanaman obat keluarga, dan beternak skala rumah tangga untuk memenuhi kebutuhan pangan bergizi sehari-hari.</p><p>Hasil panen disalurkan kepada keluarga penerima manfaat serta dipamerkan dalam lomba cipta menu B2SA tingkat kabupaten.</p>',
                    'kategori' => 'Kegiatan',
                    'foto' => 'berita-photos/poto5.jpeg',
                    'tanggal' => '2026-08-22',
                    'fotos' => [
                        ['foto' => 'berita-photos/poto1.jpeg', 'urutan' => 1],
                        ['foto' => 'berita-photos/poto6.jpeg', 'urutan' => 2],
                    ],
                ],
                [
                    'judul' => 'Pokja IV Gencarkan Posyandu dan Edukasi Cegah Stunting',
                    'konten' => '<p>Kelompok Kerja IV TP PKK Kabupaten Tasikmalaya menggencarkan revitalisasi posyandu dan edukasi pencegahan stunting di seluruh kecamatan.</p><p>Kader kesehatan dilatih pemantauan tumbuh kembang balita, pemberian makanan tambahan, serta pendampingan ibu hamil dan menyusui.</p><p>Program ini mendukung target penurunan prevalensi stunting melalui konvergensi layanan kesehatan, pangan bergizi, dan lingkungan bersih di tingkat keluarga.</p>',
                    'kategori' => 'Kegiatan',
                    'foto' => 'berita-photos/poto6.jpeg',
                    'tanggal' => '2026-10-02',
                    'fotos' => [
                        ['foto' => 'berita-photos/poto2.jpeg', 'urutan' => 1],
                        ['foto' => 'berita-photos/poto5.jpeg', 'urutan' => 2],
                        ['foto' => 'berita-photos/poto4.jpeg', 'urutan' => 3],
                    ],
                ],
            ];

            foreach ($beritas as $data) {
                $fotos = $data['fotos'] ?? [];
                unset($data['fotos']);

                $berita = Berita::create(array_merge($data, [
                    'slug' => Str::slug($data['judul']) . '-' . time() . '-' . Str::random(4),
                    'status' => 'approved',
                    'user_id' => $userId,
                ]));

                foreach ($fotos as $foto) {
                    BeritaFoto::create(array_merge($foto, [
                        'berita_id' => $berita->id,
                    ]));
                }
            }

            $this->command->info(count($beritas) . ' berita berhasil di-seed.');
        });
    }
}
