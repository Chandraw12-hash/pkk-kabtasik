<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IndexController extends Controller
{
    public function index()
    {
        // Ambil data berita terbaru dan sertakan accessor foto_url secara eksplisit dalam array mapping
        $beritaTerbaru = Berita::latest()->take(3)->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'judul' => $item->judul,
                'slug' => $item->slug,
                'deskripsi' => $item->konten,
                'foto' => $item->foto,
                'foto_url' => $item->foto_url, // FIX: Memasukkan foto_url agar terbawa ke frontend React
                'created_at' => $item->created_at,
                'link' => '/berita/' . $item->slug,
            ];
        });

        // Dummy Data Kebijakan
        $kebijakan = collect([
            [
                'id' => 1,
                'judul' => 'Peraturan Presiden No. 95 Tahun 2018',
                'deskripsi' => 'Tentang Sistem Pemerintahan Berbasis Elektronik',
                'file_path' => '#',
                'urutan' => 1,
            ],
            [
                'id' => 2,
                'judul' => 'Peraturan Bupati Tasikmalaya',
                'deskripsi' => 'Penyelenggaraan SPBE di Lingkungan Pemerintah Kabupaten Tasikmalaya',
                'file_path' => '#',
                'urutan' => 2,
            ],
            [
                'id' => 3,
                'judul' => 'Arsitektur SPBE',
                'deskripsi' => 'Dokumen Arsitektur SPBE Kabupaten Tasikmalaya',
                'file_path' => '#',
                'urutan' => 3,
            ],
        ])->map(function ($item) {
            return (object) $item;
        });

        // Dummy Data Chart (Tren Indeks SPBE)
        $chartData = collect([
            ['year' => '2019', 'value' => 1.8],
            ['year' => '2020', 'value' => 2.1],
            ['year' => '2021', 'value' => 2.4],
            ['year' => '2022', 'value' => 2.6],
            ['year' => '2023', 'value' => 3.2],
            ['year' => '2024', 'value' => 3.5],
        ]);

        // Dummy Data Domain
        $domainData = collect([
            ['id' => 1, 'title' => 'Domain Kebijakan SPBE', 'nilai' => 3.5],
            ['id' => 2, 'title' => 'Domain Tata Kelola SPBE', 'nilai' => 3.2],
            ['id' => 3, 'title' => 'Domain Manajemen SPBE', 'nilai' => 3.0],
            ['id' => 4, 'title' => 'Domain Layanan SPBE', 'nilai' => 3.8],
        ]);

        $currentYear = date('Y');

        return Inertia::render('Frontend/Beranda', [
            'kebijakan' => $kebijakan,
            'chartData' => $chartData,
            'domainData' => $domainData,
            'berita' => $beritaTerbaru,
            'year' => $currentYear,
        ]);
    }

    public function sejarah()
    {
        return Inertia::render('Frontend/Profil/Sejarah');
    }

    public function tugasFungsi()
    {
        return Inertia::render('Frontend/Profil/TugasFungsi');
    }

    public function visiMisi()
    {
        return Inertia::render('Frontend/Profil/VisiMisi');
    }

    public function strukturOrganisasi()
    {
        return Inertia::render('Frontend/Profil/StrukturOrganisasi');
    }

    public function programKerja()
    {
        return Inertia::render('Frontend/Program/ProgramKerja');
    }

    public function ketentuanSeragam()
    {
        return Inertia::render('Frontend/Profil/KetentuanSeragam');
    }

    public function galeriKegiatan()
    {
        return Inertia::render('Frontend/Program/GaleriKegiatan');
    }

    public function marsPkk()
    {
        return Inertia::render('Frontend/Program/MarsPkk');
    }

    public function dokumen()
    {
        return Inertia::render('Frontend/Program/Dokumen');
    }

    public function berita()
    {
        // Mengambil data berita dengan paginasi
        $beritas = Berita::latest()->paginate(9);

        return Inertia::render('Frontend/Berita/Index', [
            'beritas' => $beritas
        ]);
    }

    public function showBerita($slug)
    {
        $berita = Berita::where('slug', $slug)->firstOrFail();
        $beritaLainnya = Berita::where('slug', '!=', $slug)->latest()->take(3)->get();

        return Inertia::render('Frontend/Berita/Show', [
            'berita' => $berita,
            'beritaLainnya' => $beritaLainnya,
        ]);
    }
}
