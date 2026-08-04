<?php

namespace App\Http\Controllers\Frontend;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IndexController extends Controller
{
    public function index()
    {
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
            'year' => $currentYear,
        ]);
    }

}
