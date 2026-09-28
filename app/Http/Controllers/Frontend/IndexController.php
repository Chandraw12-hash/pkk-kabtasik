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
use App\Models\Pokja4KunjunganPyd;
use App\Models\Pokja4KegiatanPosyandu;
use App\Models\Pokja4Rekapitulasi;
use App\Models\Survey;
use App\Models\StrukturOrganisasi;
use App\Models\LaporanKegiatan;

// ✅ TAMBAH — 3 Model Baru
use App\Models\DataUmumPkk;
use App\Models\RekapKegiatanWarga;
use App\Models\RekapBumil;

use Illuminate\Http\Request;
use Inertia\Inertia;

class IndexController extends Controller
{
    public function index()
    {
        $isSurveyActive = true;

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

        $beritaTerbaru = Berita::where('status', 'approved')
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
                    'link' => $item->slug ? '/berita/' . $item->slug : '/berita/' . $item->id,
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
        $pokja3 = Pokja3::latest()->take(6)->get();
        $pokja4 = Pokja4::latest()->take(6)->get();

        $kebijakan = collect([
            ['id' => 1, 'judul' => 'Peraturan Presiden No. 95 Tahun 2018', 'deskripsi' => 'Tentang Sistem Pemerintahan Berbasis Elektronik', 'file_path' => '#', 'urutan' => 1],
            ['id' => 2, 'judul' => 'Peraturan Bupati Tasikmalaya', 'deskripsi' => 'Penyelenggaraan SPBE di Lingkungan Pemerintah Kabupaten Tasikmalaya', 'file_path' => '#', 'urutan' => 2],
            ['id' => 3, 'judul' => 'Arsitektur SPBE', 'deskripsi' => 'Dokumen Arsitektur SPBE Kabupaten Tasikmalaya', 'file_path' => '#', 'urutan' => 3],
        ])->map(fn($item) => (object) $item);

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
            'videos' => collect([]),
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

    public function laporanKegiatanPublic(Request $request)
    {
        $search = $request->input('search');
        $pokja = $request->input('pokja');
        $perPage = (int) $request->input('per_page', 12);

        $laporans = LaporanKegiatan::query()
            ->with('user:id,name')
            ->where('status', 'approved')
            ->when($search, function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->where('judul', 'like', "%{$search}%")
                        ->orWhere('kecamatan', 'like', "%{$search}%")
                        ->orWhere('desa_kelurahan', 'like', "%{$search}%")
                        ->orWhere('nama_dasawisma', 'like', "%{$search}%");
                });
            })
            ->when($pokja, fn($q) => $q->where('kategori_pokja', $pokja))
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Frontend/LaporanKegiatan/Index', [
            'laporans' => $laporans,
            'filters' => $request->only(['search', 'pokja', 'per_page']),
        ]);
    }

    public function surveyKepuasan()
    {
        return Inertia::render('Frontend/Survey/Index', ['isActive' => true]);
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

        return redirect()->back()->with('success', 'Terima kasih atas partisipasi Anda! 🙏');
    }

    public function sejarah() { return Inertia::render('Frontend/Profil/Sejarah'); }
    public function tugasFungsi() { return Inertia::render('Frontend/Profil/TugasFungsi'); }
    public function visiMisi() { return Inertia::render('Frontend/Profil/VisiMisi'); }

    public function strukturOrganisasi()
    {
        $ketua = StrukturOrganisasi::where('kategori', 'ketua')->where('is_active', true)->first();
        $pimpinanInti = StrukturOrganisasi::where('kategori', 'pimpinan_inti')->where('is_active', true)->orderBy('urutan', 'asc')->get();
        $pokja = [];
        $pokjaLabels = ['I', 'II', 'III', 'IV'];
        foreach ($pokjaLabels as $num) {
            $pokja[$num] = StrukturOrganisasi::where('kategori', 'pokja_' . strtolower($num))->where('is_active', true)->orderBy('urutan', 'asc')->get();
        }
        return Inertia::render('Frontend/Profil/StrukturOrganisasi', [
            'ketua' => $ketua,
            'pimpinanInti' => $pimpinanInti,
            'pokja' => $pokja,
        ]);
    }

    public function programKerja() { return Inertia::render('Frontend/Program/ProgramKerja'); }
    public function ketentuanSeragam() { return Inertia::render('Frontend/Profil/KetentuanSeragam'); }

    public function galeriKegiatan(Request $request)
    {
        $galeri = Galeri::when($request->search, function ($query) use ($request) {
            return $query->where('judul', 'like', '%' . $request->search . '%');
        })->orderBy('created_at', 'desc')->paginate(12)->withQueryString();

        return Inertia::render('Frontend/Program/GaleriKegiatan', [
            'galeri' => $galeri,
            'filters' => $request->only(['search']),
        ]);
    }

    public function marsPkk() { return Inertia::render('Frontend/Program/MarsPkk'); }
    public function dokumen() { return Inertia::render('Frontend/Program/Dokumen'); }

    public function berita(Request $request)
    {
        $search = $request->get('search');
        $kategori = $request->get('kategori');
        $kecamatan = $request->get('kecamatan');

        $query = Berita::where('status', 'approved')->latest();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('judul', 'like', '%' . $search . '%')
                    ->orWhere('konten', 'like', '%' . $search . '%');
            });
        }
        if ($kategori) { $query->where('kategori', $kategori); }
        if ($kecamatan) { $query->where('kecamatan', $kecamatan); }

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
            'filters' => ['search' => $search, 'kategori' => $kategori, 'kecamatan' => $kecamatan],
        ]);
    }

    public function showBerita($slug)
    {
        $berita = Berita::query()
            ->where('slug', $slug)
            ->when(is_numeric($slug), function ($q) use ($slug) { $q->orWhere('id', $slug); })
            ->where('status', 'approved')
            ->firstOrFail();

        $beritaLainnya = Berita::where('id', '!=', $berita->id)
            ->where('status', 'approved')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Frontend/Berita/Show', [
            'berita' => $berita,
            'beritaLainnya' => $beritaLainnya,
        ]);
    }

    // ✅ FIX: Sekretariat — kirim 4 props
    public function sekretariatPublic(Request $request)
    {
        $search = $request->input('search');
        $tahun = $request->input('year', $request->input('tahun', date('Y')));
        $perPage = (int) $request->input('per_page', 15);

        // Data Umum Sekretariat (existing)
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

        // ✅ Data Umum PKK
        $dataUmumPkk = DataUmumPkk::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('kecamatan', 'like', "%{$search}%")
                        ->orWhere('nama_kecamatan', 'like', "%{$search}%");
                });
            })
            ->when($tahun, fn($q) => $q->where('tahun', $tahun))
            ->orderBy('kecamatan', 'asc')
            ->get();

        // ✅ Rekap Kegiatan Warga (sumber: baris input level RW dari admin desa)
        $rekapKegiatanWarga = RekapKegiatanWarga::query()
            ->where('level', 'rw')
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('kecamatan', 'like', "%{$search}%")
                        ->orWhere('nama_kecamatan', 'like', "%{$search}%");
                });
            })
            ->when($tahun, fn($q) => $q->where('tahun', $tahun))
            ->orderBy('kecamatan', 'asc')
            ->get();
        $rekapKegiatanWarga = $this->gabungkanRekapKegiatanPerKecamatan(
            $rekapKegiatanWarga
        );

        // ✅ Rekap Bumil
        $rekapBumil = RekapBumil::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('kecamatan', 'like', "%{$search}%")
                        ->orWhere('nama_kecamatan', 'like', "%{$search}%");
                });
            })
            ->when($tahun, fn($q) => $q->where('tahun', $tahun))
            ->orderBy('bulan', 'asc')
            ->orderBy('kecamatan', 'asc')
            ->get();

        return Inertia::render('Frontend/data-data/Sekretariat/Index', [
            'data' => $dataUmumPkk,
            'dataKegiatan' => $rekapKegiatanWarga,
            'rekapBumil' => $rekapBumil,
            'filters' => $request->only(['search', 'per_page', 'year', 'tahun', 'kecamatan', 'activeTab']),
        ]);
    }

    /**
     * Tabel publik = 1 baris per kecamatan. Sumbernya baris input level RW
     * dari semua desa, jadi counter dijumlahkan per kecamatan.
     * jumlah_dusun & jumlah_rw dihitung dari baris yang masuk (tidak diinput).
     */
    private function gabungkanRekapKegiatanPerKecamatan($items)
    {
        // jumlah_dusun & jumlah_rw sengaja tidak di sini, dihitung terpisah di bawah
        $numericFields = [
            'jumlah_rt', 'jumlah_dasa_wisma',
            'jumlah_krt', 'jumlah_kk', 'total_l', 'total_p',
            'balita_l', 'balita_p', 'pus', 'wus', 'ibu_hamil',
            'ibu_menyusui', 'lansia', 'buta_l', 'buta_p', 'rumah_sehat',
            'rumah_kurang_sehat', 'memiliki_tempat_sampah', 'memiliki_spal',
            'memiliki_stiker_p4k', 'air_pdam', 'air_sumur', 'air_sungai',
            'air_dll', 'jumlah_jamban_keluarga', 'makanan_pokok_beras',
            'makanan_pokok_non_beras', 'kegiatan_up2k',
            'kegiatan_tanah_pekarangan', 'kegiatan_industri_rumah_tangga',
            'kegiatan_kesehatan_lingkungan',
        ];

        return $items
            ->groupBy(function ($item) {
                return mb_strtolower(trim(
                    $item->nama_kecamatan ?: $item->kecamatan ?: 'Tidak diketahui'
                ));
            })
            ->map(function ($group) use ($numericFields) {
                $first = $group->first();
                $merged = $first->toArray();

                foreach ($numericFields as $field) {
                    $merged[$field] = $group->sum(
                        fn ($item) => (int) ($item->{$field} ?? 0)
                    );
                }

                // 1 baris = 1 RW. Dusun dihitung unik per desa + dusun,
                // karena beda desa bisa punya nama dusun yang sama.
                $merged['jumlah_rw'] = $group->count();
                $merged['jumlah_dusun'] = $group
                    ->map(fn ($item) => mb_strtolower(trim(
                        ($item->desa ?? '') . '|' . ($item->dusun ?? '')
                    )))
                    ->unique()
                    ->count();

                // Baris gabungan ini level kecamatan, kosongkan identitas baris pertama
                $merged['desa'] = null;
                $merged['nama_desa'] = null;
                $merged['dusun'] = null;
                $merged['nama_dusun'] = null;
                $merged['rw'] = null;
                $merged['rt'] = null;

                $merged['nama_kecamatan'] = $first->nama_kecamatan ?: $first->kecamatan;
                $merged['kecamatan'] = $first->kecamatan ?: $first->nama_kecamatan;

                return $merged;
            })
            ->sortBy('kecamatan')
            ->values();
    }

    // ✅ FIX: Pokja1 — filter tahun + search nama_wilayah
    public function pokja1Public(Request $request)
    {
        $search = $request->input('search');
        $tahun = $request->input('tahun', date('Y'));
        $perPage = (int) $request->input('per_page', 15);

        $data = Pokja1::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('kecamatan', 'like', "%{$search}%")
                        ->orWhere('nama_kecamatan', 'like', "%{$search}%")
                        ->orWhere('nama_wilayah', 'like', "%{$search}%");
                });
            })
            ->when($tahun, fn($q) => $q->where('tahun', $tahun))
            ->orderBy('kecamatan', 'asc')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Frontend/data-data/Pokja1', [
            'data' => $data,
            'filters' => $request->only(['search', 'per_page', 'tahun']),
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

    // ✅ FIX: Pokja4 — kirim 4 props + activeTab
    public function pokja4Public(Request $request)
    {
        $search = $request->input('search');
        $tahun = $request->input('tahun', date('Y'));
        $activeTab = $request->input('activeTab', 'pokja4');
        $perPage = (int) $request->input('per_page', 15);

        $data = Pokja4::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('kecamatan', 'like', "%{$search}%")
                        ->orWhere('nama_kecamatan', 'like', "%{$search}%");
                });
            })
            ->when($tahun, function ($query) use ($tahun) {
                $query->where('tahun', $tahun);
            })
            ->orderBy('kecamatan', 'asc')
            ->paginate($perPage)
            ->withQueryString();

        $kunjunganPyd = Pokja4KunjunganPyd::where('tahun', $tahun)
            ->orderBy('bulan')
            ->get();

        $kegiatanPosyandu = Pokja4KegiatanPosyandu::where('tahun', $tahun)
            ->orderBy('bulan')
            ->get();

        $rekapitulasi = Pokja4Rekapitulasi::where('tahun', $tahun)
            ->orderBy('kecamatan')
            ->get();

        return Inertia::render('Frontend/data-data/Pokja4/Index', [
            'data' => $data,
            'kunjungan_pyd' => $kunjunganPyd,
            'kegiatan_posyandu' => $kegiatanPosyandu,
            'rekapitulasi' => $rekapitulasi,
            'filters' => $request->only(['search', 'per_page', 'tahun', 'activeTab']),
        ]);
    }

    // ============================================================
    // ✅ TAMBAH — 3 METHOD BARU — DATA UMUM PKK, REKAP KEGIATAN, REKAP BUMIL
    // ============================================================

    /**
     * Halaman Data Umum PKK
     */
    public function dataUmumPkkPublic(Request $request)
    {
        $search = $request->input('search');
        $tahun = $request->input('tahun', date('Y'));
        $level = $request->input('level');
        $perPage = (int) $request->input('per_page', 15);

        $data = DataUmumPkk::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('kecamatan', 'like', "%{$search}%")
                        ->orWhere('nama_kecamatan', 'like', "%{$search}%")
                        ->orWhere('desa', 'like', "%{$search}%")
                        ->orWhere('nama_desa', 'like', "%{$search}%");
                });
            })
            ->when($tahun, function ($query) use ($tahun) {
                $query->where('tahun', $tahun);
            })
            ->when($level, function ($query) use ($level) {
                $query->where('level', $level);
            })
            ->orderBy('kecamatan', 'asc')
            ->orderBy('desa', 'asc')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Frontend/data-data/DataUmumPkk/Index', [
            'data' => $data,
            'filters' => $request->only(['search', 'per_page', 'tahun', 'level']),
        ]);
    }

    /**
     * Halaman Rekap Kegiatan Warga
     */
    public function rekapKegiatanWargaPublic(Request $request)
    {
        $search = $request->input('search');
        $tahun = $request->input('tahun', date('Y'));
        $level = $request->input('level');
        $perPage = (int) $request->input('per_page', 15);

        $data = RekapKegiatanWarga::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('kecamatan', 'like', "%{$search}%")
                        ->orWhere('nama_kecamatan', 'like', "%{$search}%")
                        ->orWhere('desa', 'like', "%{$search}%")
                        ->orWhere('nama_desa', 'like', "%{$search}%");
                });
            })
            ->when($tahun, function ($query) use ($tahun) {
                $query->where('tahun', $tahun);
            })
            ->when($level, function ($query) use ($level) {
                $query->where('level', $level);
            })
            ->orderBy('kecamatan', 'asc')
            ->orderBy('desa', 'asc')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Frontend/data-data/RekapKegiatanWarga/Index', [
            'data' => $data,
            'filters' => $request->only(['search', 'per_page', 'tahun', 'level']),
        ]);
    }

    /**
     * Halaman Rekap Bumil
     */
    public function rekapBumilPublic(Request $request)
    {
        $search = $request->input('search');
        $tahun = $request->input('tahun', date('Y'));
        $bulan = $request->input('bulan');
        $level = $request->input('level');
        $perPage = (int) $request->input('per_page', 15);

        $data = RekapBumil::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('kecamatan', 'like', "%{$search}%")
                        ->orWhere('nama_kecamatan', 'like', "%{$search}%")
                        ->orWhere('desa', 'like', "%{$search}%")
                        ->orWhere('nama_desa', 'like', "%{$search}%");
                });
            })
            ->when($tahun, function ($query) use ($tahun) {
                $query->where('tahun', $tahun);
            })
            ->when($bulan, function ($query) use ($bulan) {
                $query->where('bulan', $bulan);
            })
            ->when($level, function ($query) use ($level) {
                $query->where('level', $level);
            })
            ->orderBy('tahun', 'desc')
            ->orderBy('bulan', 'asc')
            ->orderBy('kecamatan', 'asc')
            ->orderBy('desa', 'asc')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Frontend/data-data/RekapBumil/Index', [
            'data' => $data,
            'filters' => $request->only(['search', 'per_page', 'tahun', 'bulan', 'level']),
        ]);
    }

    // JSON — sama
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
            ->orderBy('kecamatan', 'asc')->paginate($perPage)->withQueryString();
        return response()->json($data);
    }

    public function pokja1Json(Request $request)
    {
        $search = $request->input('search');
        $tahun = $request->input('tahun', date('Y'));
        $perPage = (int) $request->input('per_page', 15);
        $data = Pokja1::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('kecamatan', 'like', "%{$search}%")
                        ->orWhere('nama_kecamatan', 'like', "%{$search}%")
                        ->orWhere('nama_wilayah', 'like', "%{$search}%");
                });
            })
            ->when($tahun, fn($q) => $q->where('tahun', $tahun))
            ->orderBy('kecamatan', 'asc')->paginate($perPage)->withQueryString();
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
            ->orderBy('kecamatan', 'asc')->paginate($perPage)->withQueryString();
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
            ->orderBy('kecamatan', 'asc')->paginate($perPage)->withQueryString();
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
            ->orderBy('kecamatan', 'asc')->paginate($perPage)->withQueryString();
        return response()->json($data);
    }

    // ============================================================
    // ✅ TAMBAH — 3 METHOD JSON BARU
    // ============================================================

    public function dataUmumPkkJson(Request $request)
    {
        $search = $request->input('search');
        $tahun = $request->input('tahun', date('Y'));
        $perPage = (int) $request->input('per_page', 15);
        $data = DataUmumPkk::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('kecamatan', 'like', "%{$search}%")
                        ->orWhere('nama_kecamatan', 'like', "%{$search}%");
                });
            })
            ->when($tahun, fn($q) => $q->where('tahun', $tahun))
            ->orderBy('kecamatan', 'asc')->paginate($perPage)->withQueryString();
        return response()->json($data);
    }

    public function rekapKegiatanWargaJson(Request $request)
    {
        $search = $request->input('search');
        $tahun = $request->input('tahun', date('Y'));
        $perPage = (int) $request->input('per_page', 15);
        $data = RekapKegiatanWarga::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('kecamatan', 'like', "%{$search}%")
                        ->orWhere('nama_kecamatan', 'like', "%{$search}%");
                });
            })
            ->when($tahun, fn($q) => $q->where('tahun', $tahun))
            ->orderBy('kecamatan', 'asc')->paginate($perPage)->withQueryString();
        return response()->json($data);
    }

    public function rekapBumilJson(Request $request)
    {
        $search = $request->input('search');
        $tahun = $request->input('tahun', date('Y'));
        $bulan = $request->input('bulan');
        $perPage = (int) $request->input('per_page', 15);
        $data = RekapBumil::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('kecamatan', 'like', "%{$search}%")
                        ->orWhere('nama_kecamatan', 'like', "%{$search}%");
                });
            })
            ->when($tahun, fn($q) => $q->where('tahun', $tahun))
            ->when($bulan, fn($q) => $q->where('bulan', $bulan))
            ->orderBy('kecamatan', 'asc')->paginate($perPage)->withQueryString();
        return response()->json($data);
    }
}
