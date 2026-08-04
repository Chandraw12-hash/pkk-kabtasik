<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class EvidenController extends Controller
{
    public function __construct()
    {
        $this->middleware('role:admin');
    }

    private function getDummySkpds()
    {
        return [
            ['id' => 1, 'nama_skpd' => 'Dinas Komunikasi dan Informatika'],
            ['id' => 2, 'nama_skpd' => 'Bappelitbangda'],
            ['id' => 3, 'nama_skpd' => 'Dinas Pendidikan'],
            ['id' => 4, 'nama_skpd' => 'Dinas Kesehatan'],
            ['id' => 5, 'nama_skpd' => 'BKPSDM'],
        ];
    }

    private function getDummyIndikators()
    {
        return [
            ['id' => 1, 'nama_indikator' => 'Indikator 1: Tingkat Kematangan Kebijakan Internal Arsitektur SPBE'],
            ['id' => 2, 'nama_indikator' => 'Indikator 2: Tingkat Kematangan Peta Rencana SPBE'],
            ['id' => 3, 'nama_indikator' => 'Indikator 3: Tingkat Kematangan Manajemen Data'],
            ['id' => 4, 'nama_indikator' => 'Indikator 4: Tingkat Kematangan Aplikasi Umum'],
            ['id' => 5, 'nama_indikator' => 'Indikator 5: Tingkat Kematangan Keamanan SPBE'],
        ];
    }

    private function getDummyEvidens($perPage = 10)
    {
        $data = [];
        $statuses = ['pending', 'terverifikasi', 'ditolak'];
        $skpds = $this->getDummySkpds();
        $indikators = $this->getDummyIndikators();

        // Generate dummy data
        for ($i = 1; $i <= 50; $i++) {
            $skpdIndex = array_rand($skpds);
            $indikatorIndex = array_rand($indikators);
            
            $data[] = [
                'id' => $i,
                'uuid' => Str::uuid(),
                'tahun' => (string) rand(2023, 2025),
                'status' => $statuses[array_rand($statuses)],
                'indikator' => $indikators[$indikatorIndex],
                'skpd' => $skpds[$skpdIndex],
                'files' => [
                    [
                        'id' => $i,
                        'file_path' => 'dummy/path/file.pdf',
                        'original_name' => 'Dokumen_Bukti_Dukung_' . $i . '.pdf'
                    ]
                ]
            ];
        }

        // Mock Pagination
        $currentPage = request('page', 1);
        $total = count($data);
        $lastPage = ceil($total / $perPage);
        $offset = ($currentPage - 1) * $perPage;
        $items = array_slice($data, $offset, $perPage);

        return [
            'data' => $items,
            'current_page' => (int) $currentPage,
            'per_page' => $perPage,
            'last_page' => $lastPage,
            'total' => $total,
            'links' => [
                 [
                    'url' => $currentPage > 1 ? url()->current() . '?page=' . ($currentPage - 1) : null,
                    'label' => '&laquo; Previous',
                    'active' => false,
                ],
                [
                    'url' => url()->current() . '?page=' . $currentPage,
                    'label' => (string) $currentPage,
                    'active' => true,
                ],
                [
                    'url' => $currentPage < $lastPage ? url()->current() . '?page=' . ($currentPage + 1) : null,
                    'label' => 'Next &raquo;',
                    'active' => false,
                ],
            ]
        ];
    }

    public function index()
    {
        $evidens = $this->getDummyEvidens(request('per_page', 10));
        $indikators = $this->getDummyIndikators();
        $skpds = $this->getDummySkpds();

        return Inertia::render('Backend/Eviden/Index', [
            'evidens' => $evidens,
            'indikators' => $indikators,
            'skpds' => $skpds,
            'filters' => request()->only(['search', 'per_page', 'status', 'skpd_id', 'tahun']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Backend/Eviden/Create', [
            'indikators' => $this->getDummyIndikators(),
            'skpds' => $this->getDummySkpds(),
        ]);
    }

    public function edit($uuid)
    {
        // Mock finding data
        $eviden = [
            'id' => 1,
            'uuid' => $uuid,
            'tahun' => '2024',
            'status' => 'pending',
            'indikator' => $this->getDummyIndikators()[0],
            'skpd' => $this->getDummySkpds()[0],
            'files' => []
        ];

        return Inertia::render('Backend/Eviden/Edit', [
            'eviden' => $eviden,
            'indikators' => $this->getDummyIndikators(),
            'skpds' => $this->getDummySkpds(),
        ]);
    }

    public function store(Request $request)
    {
        return redirect()->route('be.eviden.index')->with('success', 'Data Eviden berhasil ditambahkan (Simulasi).');
    }

    public function update(Request $request, $uuid)
    {
        return redirect()->back()->with('success', 'Data Eviden berhasil diperbarui (Simulasi).');
    }

    public function deleteFile($id)
    {
        return redirect()->back()->with('success', 'File berhasil dihapus (Simulasi).');
    }

    public function downloadFile($id)
    {
        return redirect()->back()->with('error', 'Ini adalah file dummy. Tidak bisa didownload.');
    }

    public function destroy($uuid)
    {
        return redirect()->back()->with('success', 'Data Eviden berhasil dihapus (Simulasi).');
    }
}
