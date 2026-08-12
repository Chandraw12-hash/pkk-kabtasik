<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use App\Models\Galeri;
use App\Models\DataUmumSekretariat;
use App\Models\Pokja1;
use App\Models\Pokja2;
use App\Models\Pokja3;
use App\Models\Pokja4;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IndexController extends Controller
{
    public function index()
    {
        // Ambil data berita terbaru
        $beritaTerbaru = Berita::latest()->take(3)->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'judul' => $item->judul,
                'slug' => $item->slug,
                'deskripsi' => $item->konten,
                'foto' => $item->foto,
                'foto_url' => $item->foto_url,
                'created_at' => $item->created_at,
                'link' => '/berita/' . $item->slug,
            ];
        });

        // Ambil data galeri terbaru (8 foto) agar muncul di Landing Page
        $galeriTerbaru = Galeri::latest()->take(8)->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'judul' => $item->judul,
                'tanggal' => $item->tanggal,
                'foto' => $item->foto,
                'foto_url' => $item->foto_url,
            ];
        });

        // Ambil data Sekretariat & Pokja 1-4 untuk ditampilkan di Landing Page
        $sekretariat = DataUmumSekretariat::latest()->take(6)->get();
        $pokja1 = Pokja1::latest()->take(6)->get();
        $pokja2 = Pokja2::latest()->take(6)->get();
        $pokja3 = Pokja3::latest()->take(6)->get();
        $pokja4 = Pokja4::latest()->take(6)->get();

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
            'galeri' => $galeriTerbaru,
            'sekretariat' => $sekretariat,
            'pokja1' => $pokja1,
            'pokja2' => $pokja2,
            'pokja3' => $pokja3,
            'pokja4' => $pokja4,
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

    public function galeriKegiatan(Request $request)
    {
        $galeri = Galeri::when($request->search, function ($query) use ($request) {
                return $query->where('judul', 'like', '%' . $request->search . '%');
            })
            ->orderBy('created_at', 'desc')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Frontend/Program/GaleriKegiatan', [
            'galeri' => $galeri,
            'filters' => $request->only(['search'])
        ]);
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

    // ==========================================
    // METHOD EKSPLORASI (DIARAHKAN KE data-data)
    // ==========================================
    public function sekretariatPublic()
    {
        return Inertia::render('Frontend/data-data/Sekretariat', [
            'data' => DataUmumSekretariat::latest()->paginate(10)
        ]);
    }

    public function pokja1Public()
    {
        return Inertia::render('Frontend/data-data/Pokja1', [
            'data' => Pokja1::latest()->paginate(10)
        ]);
    }

    public function pokja2Public()
    {
        return Inertia::render('Frontend/data-data/Pokja2', [
            'data' => Pokja2::latest()->paginate(10)
        ]);
    }

    public function pokja3Public()
    {
        return Inertia::render('Frontend/data-data/Pokja3', [
            'data' => Pokja3::latest()->paginate(10)
        ]);
    }

    public function pokja4Public()
    {
        return Inertia::render('Frontend/data-data/Pokja4', [
            'data' => Pokja4::latest()->paginate(10)
        ]);
    }
}
