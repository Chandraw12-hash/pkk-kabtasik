<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use App\Models\Galeri;
use App\Models\Agenda;
use App\Models\Infografis;
use App\Models\DataUmumSekretariat;
use App\Models\Pokja1;
use App\Models\Pokja2;
use App\Models\Pokja3;
use App\Models\Pokja4;
use App\Models\Survey;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IndexController extends Controller
{
    public function index()
    {
        $isSurveyActive = true;

        // Hanya pakai kolom yang ada: status = published
        $testimoniSurvey = Survey::query()
            ->where('status', 'published')
            ->latest()
            ->take(6)
            ->get(['id', 'nama', 'rating', 'saran', 'created_at'])
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nama' => $item->nama ?: 'Anonim',
                    'rating' => (int) $item->rating,
                    'saran' => $item->saran,
                    'created_at' => $item->created_at,
                ];
            });

        $beritaTerbaru = Berita::where('status_publikasi', true)
            ->latest()
            ->take(6)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'judul' => $item->judul,
                    'slug' => $item->slug,
                    'deskripsi' => $item->konten,
                    'konten' => $item->konten,
                    'foto' => $item->foto,
                    'foto_url' => $item->foto_url ?? null,
                    'created_at' => $item->created_at,
                    'link' => $item->slug
                        ? '/berita/' . $item->slug
                        : '/berita/' . $item->id,
                ];
            });

        $galeriTerbaru = Galeri::latest()
            ->take(8)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'judul' => $item->judul ?? null,
                    'caption' => $item->judul ?? $item->caption ?? null,
                    'tanggal' => $item->tanggal ?? null,
                    'foto' => $item->foto,
                    'foto_url' => $item->foto_url ?? null,
                    'created_at' => $item->created_at,
                ];
            });

        $agendaTerbaru = Agenda::where('status', '!=', 'cancelled')
            ->whereDate('tanggal', '>=', now()->subDays(1))
            ->orderBy('tanggal', 'asc')
            ->orderBy('waktu', 'asc')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'judul' => $item->judul,
                    'deskripsi' => $item->deskripsi,
                    'tanggal' => $item->tanggal instanceof \DateTime
                        ? $item->tanggal->format('Y-m-d')
                        : $item->tanggal,
                    'waktu' => $item->waktu
                        ? (method_exists($item->waktu, 'format')
                            ? $item->waktu->format('H:i')
                            : substr($item->waktu, 0, 5))
                        : null,
                    'lokasi' => $item->lokasi,
                    'status' => $item->status,
                ];
            });

        $videos = collect([]);

        $infografis = Infografis::where('status', 'active')
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'judul' => $item->judul,
                    'deskripsi' => $item->deskripsi,
                    'gambar_url' => $item->gambar_url,
                    'kategori' => $item->kategori,
                ];
            });

        $sekretariat = DataUmumSekretariat::latest()->take(6)->get();
        $pokja1 = Pokja1::latest()->take(6)->get();
        $pokja2 = Pokja2::latest()->take(6)->get();

        // 🔥 FIX: TAMBAHKAN select() UNTUK POKJA 3 AGAR KOLOM YANG DIBUTUHKAN TERAMBIL
        $pokja3 = Pokja3::select(
            'id', 'kecamatan', 'nama_kecamatan',
            'rumah_sehat', 'rumah_tidak_sehat',
            'pemanfaatan_pekarangan', 'industri_rumah_tangga',
            'kategori', 'judul_kegiatan', 'deskripsi', 'created_at'
        )->latest()->take(6)->get();

        // 🔥 FIX: TAMBAHKAN select() UNTUK POKJA 4 AGAR KOLOM YANG DIBUTUHKAN TERAMBIL
        $pokja4 = Pokja4::select(
            'id', 'kecamatan', 'nama_kecamatan',
            'posyandu', 'akseptor_kb', 'phbs', 'jamban_keluarga',
            'kategori', 'judul_kegiatan', 'deskripsi', 'created_at'
        )->latest()->take(6)->get();

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
        ])->map(fn ($item) => (object) $item);

        $chartData = collect([
            ['year' => '2019', 'value' => 1.8],
            ['year' => '2020', 'value' => 2.1],
            ['year' => '2021', 'value' => 2.4],
            ['year' => '2022', 'value' => 2.6],
            ['year' => '2023', 'value' => 3.2],
            ['year' => '2024', 'value' => 3.5],
        ]);

        $domainData = collect([
            ['id' => 1, 'title' => 'Domain Kebijakan SPBE', 'nilai' => 3.5],
            ['id' => 2, 'title' => 'Domain Tata Kelola SPBE', 'nilai' => 3.2],
            ['id' => 3, 'title' => 'Domain Manajemen SPBE', 'nilai' => 3.0],
            ['id' => 4, 'title' => 'Domain Layanan SPBE', 'nilai' => 3.8],
        ]);

        return Inertia::render('Frontend/Beranda', [
            'kebijakan' => $kebijakan,
            'chartData' => $chartData,
            'domainData' => $domainData,
            'berita' => $beritaTerbaru,
            'galeri' => $galeriTerbaru,
            'agenda' => $agendaTerbaru,
            'videos' => $videos,
            'infografis' => $infografis,
            'sekretariat' => $sekretariat,
            'pokja1' => $pokja1,
            'pokja2' => $pokja2,
            'pokja3' => $pokja3,
            'pokja4' => $pokja4,
            'year' => (int) date('Y'),
            'isSurveyActive' => $isSurveyActive,
            'testimoniSurvey' => $testimoniSurvey,
        ]);
    }

    public function surveyKepuasan()
    {
        return Inertia::render('Frontend/Survey/Index', [
            'isActive' => true,
        ]);
    }

    public function surveyStore(Request $request)
    {
        $request->validate([
            'nama' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'saran' => 'nullable|string|max:1000',
        ]);

        Survey::create([
            'nama' => $request->nama ?? 'Anonim',
            'email' => $request->email,
            'rating' => $request->rating,
            'saran' => $request->saran,
            'ip_address' => $request->ip(),
            'status' => 'pending',
        ]);

        return redirect()
            ->back()
            ->with('success', 'Terima kasih atas partisipasi Anda! 🙏');
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
            'filters' => $request->only(['search']),
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

    public function berita(Request $request)
    {
        $search = $request->get('search');
        $kategori = $request->get('kategori');
        $kecamatan = $request->get('kecamatan');

        $query = Berita::where('status_publikasi', true)->latest();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('judul', 'like', '%' . $search . '%')
                    ->orWhere('konten', 'like', '%' . $search . '%');
            });
        }

        if ($kategori) {
            $query->where('kategori', $kategori);
        }

        if ($kecamatan) {
            $query->where('kecamatan', $kecamatan);
        }

        $beritas = $query->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'judul' => $item->judul,
                'slug' => $item->slug,
                'deskripsi' => $item->konten,
                'konten' => $item->konten,
                'kategori' => $item->kategori,
                'kecamatan' => $item->kecamatan,
                'foto' => $item->foto,
                'foto_url' => $item->foto_url ?? null,
                'created_at' => $item->created_at,
            ];
        });

        return Inertia::render('Frontend/Berita/Index', [
            'berita' => $beritas,
            'filters' => [
                'search' => $search,
                'kategori' => $kategori,
                'kecamatan' => $kecamatan,
            ],
        ]);
    }

    public function showBerita($slug)
    {
        $berita = Berita::query()
            ->where('slug', $slug)
            ->when(is_numeric($slug), function ($q) use ($slug) {
                $q->orWhere('id', $slug);
            })
            ->firstOrFail();

        $beritaLainnya = Berita::where('id', '!=', $berita->id)
            ->where('status_publikasi', true)
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Frontend/Berita/Show', [
            'berita' => $berita,
            'beritaLainnya' => $beritaLainnya,
        ]);
    }

    public function sekretariatPublic(Request $request)
    {
        $search = $request->input('search');
        $perPage = (int) $request->input('per_page', 15);

        $data = DataUmumSekretariat::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('kecamatan', 'like', "%{$search}%")
                        ->orWhere('nama_kecamatan', 'like', "%{$search}%");
                });
            })
            ->orderBy('kecamatan', 'asc')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Frontend/data-data/Sekretariat', [
            'data' => $data,
            'filters' => $request->only(['search', 'per_page']),
        ]);
    }

    public function pokja1Public(Request $request)
    {
        $search = $request->input('search');
        $perPage = (int) $request->input('per_page', 15);

        $data = Pokja1::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('kecamatan', 'like', "%{$search}%")
                        ->orWhere('nama_kecamatan', 'like', "%{$search}%");
                });
            })
            ->orderBy('kecamatan', 'asc')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Frontend/data-data/Pokja1', [
            'data' => $data,
            'filters' => $request->only(['search', 'per_page']),
        ]);
    }

    public function pokja2Public(Request $request)
    {
        $search = $request->input('search');
        $perPage = (int) $request->input('per_page', 15);

        $data = Pokja2::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('kecamatan', 'like', "%{$search}%")
                        ->orWhere('nama_kecamatan', 'like', "%{$search}%");
                });
            })
            ->orderBy('kecamatan', 'asc')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Frontend/data-data/Pokja2', [
            'data' => $data,
            'filters' => $request->only(['search', 'per_page']),
        ]);
    }

    public function pokja3Public(Request $request)
    {
        $search = $request->input('search');
        $perPage = (int) $request->input('per_page', 15);

        $data = Pokja3::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('kecamatan', 'like', "%{$search}%")
                        ->orWhere('nama_kecamatan', 'like', "%{$search}%");
                });
            })
            ->orderBy('kecamatan', 'asc')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Frontend/data-data/Pokja3', [
            'data' => $data,
            'filters' => $request->only(['search', 'per_page']),
        ]);
    }

    public function pokja4Public(Request $request)
    {
        $search = $request->input('search');
        $perPage = (int) $request->input('per_page', 15);

        $data = Pokja4::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('kecamatan', 'like', "%{$search}%")
                        ->orWhere('nama_kecamatan', 'like', "%{$search}%");
                });
            })
            ->orderBy('kecamatan', 'asc')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Frontend/data-data/Pokja4', [
            'data' => $data,
            'filters' => $request->only(['search', 'per_page']),
        ]);
    }

    public function sekretariatJson(Request $request)
    {
        $search = $request->input('search');
        $perPage = (int) $request->input('per_page', 15);

        $data = DataUmumSekretariat::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('kecamatan', 'like', "%{$search}%")
                        ->orWhere('nama_kecamatan', 'like', "%{$search}%");
                });
            })
            ->orderBy('kecamatan', 'asc')
            ->paginate($perPage)
            ->withQueryString();

        return response()->json($data);
    }

    public function pokja1Json(Request $request)
    {
        $search = $request->input('search');
        $perPage = (int) $request->input('per_page', 15);

        $data = Pokja1::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('kecamatan', 'like', "%{$search}%")
                        ->orWhere('nama_kecamatan', 'like', "%{$search}%");
                });
            })
            ->orderBy('kecamatan', 'asc')
            ->paginate($perPage)
            ->withQueryString();

        return response()->json($data);
    }

    public function pokja2Json(Request $request)
    {
        $search = $request->input('search');
        $perPage = (int) $request->input('per_page', 15);

        $data = Pokja2::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('kecamatan', 'like', "%{$search}%")
                        ->orWhere('nama_kecamatan', 'like', "%{$search}%");
                });
            })
            ->orderBy('kecamatan', 'asc')
            ->paginate($perPage)
            ->withQueryString();

        return response()->json($data);
    }

    public function pokja3Json(Request $request)
    {
        $search = $request->input('search');
        $perPage = (int) $request->input('per_page', 15);

        $data = Pokja3::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('kecamatan', 'like', "%{$search}%")
                        ->orWhere('nama_kecamatan', 'like', "%{$search}%");
                });
            })
            ->orderBy('kecamatan', 'asc')
            ->paginate($perPage)
            ->withQueryString();

        return response()->json($data);
    }

    public function pokja4Json(Request $request)
    {
        $search = $request->input('search');
        $perPage = (int) $request->input('per_page', 15);

        $data = Pokja4::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('kecamatan', 'like', "%{$search}%")
                        ->orWhere('nama_kecamatan', 'like', "%{$search}%");
                });
            })
            ->orderBy('kecamatan', 'asc')
            ->paginate($perPage)
            ->withQueryString();

        return response()->json($data);
    }
}
