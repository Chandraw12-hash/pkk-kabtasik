<?php

namespace App\Http\Controllers\Backend\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ApiEvidenceController extends Controller
{
    public function getIndikatorDetail($id)
    {
        // $id = $request->query('id');

        $dataIndikator = $this->dataIndikatorDetail();

        if ($id) {
            $filteredData = collect($dataIndikator)->firstWhere('indikator_id', (int) $id);

            if ($filteredData) {
                return response()->json([
                    'status' => true,
                    'data' => $filteredData
                ], 200);
            } else {
                return response()->json(['message' => 'Data tidak ditemukan'], 404);
            }
        }

        return response()->json($dataIndikator);
    }

    public function dataIndikatorDetail()
    {
        $data = [
            // indikator 0
            [
                'indikator_id' => 1,
                'nama_indikator' => 'Kebijakan Internal Arsitektur SPBE Pemerintah Daerah',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Konsep kebijakan internal terkait Arsitektur SPBE Instansi Pusat/Pemerintah Daerah belum atau telah tersedia.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kebijakan internal Arsitektur SPBE Instansi Pusat/Pemerintah Daerah telah ditetapkan. Kondisi: Kebijakan internal Arsitektur SPBE Instansi Pusat/Pemerintah Daerah tersebut belum memuat secara lengkap pengaturan mengenai referensi Arsitektur dan domain Arsitektur SPBE (Proses Bisnis, Data dan Informasi, Infrastruktur SPBE, Aplikasi SPBE, Keamanan SPBE, dan Layanan SPBE).'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan kebijakan internal Arsitektur SPBE Instansi Pusat/Pemerintah Daerah telah memuat secara lengkap pengaturan mengenai referensi Arsitektur dan domain Arsitektur SPBE (Proses Bisnis, Data dan Informasi, Infrastruktur SPBE, Aplikasi SPBE, Keamanan SPBE, dan Layanan SPBE).'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi, kebijakan internal Arsitektur SPBE Instansi Pusat/Pemerintah Daerah telah mengatur integrasi SPBE antar Instansi Pusat, antar Pemerintah Daerah, dan/atau antar Instansi Pusat dan Pemerintah Daerah, dan kebijakan internal Arsitektur SPBE Instansi Pusat/Pemerintah Daerah telah direviu dan dievaluasi secara periodik.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi serta hasil reviu dan evaluasi kebijakan internal Arsitektur Instansi Pusat/Pemerintah Daerah SPBE telah ditindaklanjuti dengan kebijakan baru.'
                    ],
                ]
            ],
            // indikator 1
            [
                'indikator_id' => 2,
                'nama_indikator' => 'Kebijakan Internal Peta Rencana SPBE Pemerintah Daerah',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Konsep kebijakan internal terkait Peta Rencana SPBE Instansi Pusat/Pemerintah Daerah belum atau telah tersedia.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kebijakan internal Peta Rencana SPBE Instansi Pusat/Pemerintah Daerah telah ditetapkan. Kondisi: Kebijakan internal Peta Rencana SPBE Instansi Pusat/Pemerintah Daerah tersebut belum mengatur muatan Peta Rencana SPBE secara lengkap (Tata Kelola SPBE, Manajemen SPBE, Layanan SPBE, Infrastruktur SPBE, Aplikasi SPBE, Keamanan SPBE, dan Audit TIK).'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan kebijakan internal Peta Rencana SPBE Instansi Pusat/Pemerintah Daerah telah mengatur seluruh muatan Peta Rencana SPBE secara lengkap (Tata Kelola SPBE, Manajemen SPBE, Layanan SPBE, Infrastruktur SPBE, Aplikasi SPBE, Keamanan SPBE, dan Audit TIK).'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi, kebijakan internal Peta Rencana SPBE Instansi Pusat/Pemerintah Daerah telah mengatur keselarasan antara Peta Rencana SPBE Instansi Pusat/Pemerintah Daerah dan Peta Rencana SPBE Nasional. Selain itu, Kebijakan internal Peta Rencana SPBE Instansi Pusat/Pemerintah Daerah telah direviu dan dievaluasi secara periodik.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi serta hasil reviu dan evaluasi kebijakan internal Peta Rencana SPBE Instansi.'
                    ],
                ]
            ],
            // indikator 2
            [
                'indikator_id' => 3,
                'nama_indikator' => 'Kebijakan Internal Manajemen Data SPBE Pemerintah Daerah',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Konsep kebijakan internal terkait Manajemen Data di Instansi Pusat/Pemerintah Daerah belum atau telah tersedia.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kebijakan internal Manajemen Data di Instansi Pusat/Pemerintah Daerah telah ditetapkan.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kondisi: Kebijakan internal Manajemen Data di Instansi Pusat/Pemerintah Daerah tersebut hanya mengatur sebagian dari rangkaian proses pengelolaan arsitektur data, data induk, data referensi, basis data, kualitas data dan interoperabilitas data.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan kebijakan internal Manajemen Data di Instansi Pusat/Pemerintah Daerah telah mengatur seluruh rangkaian proses pengelolaan arsitektur data, data induk, data referensi, basis data, kualitas data dan interoperabilitas data.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi serta hasil reviu dan evaluasi kebijakan internal Manajemen Data di Instansi Pusat/Pemerintah Daerah telah ditindaklanjuti dengan kebijakan baru.'
                    ],
                ]
            ],
            // indikator 3
            [
                'indikator_id' => 4,
                'nama_indikator' => 'Kriteria tingkat 5 telah terpenuhi, reviu dan evaluasi kebijakan internal Pembanguna n Pengembang an Aplikasi SPBE di Instansi Pusat/Pemerintah Daerah SPBE telah ditindaklanju ti dengan kebijakan baru.',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Konsep kebijakan internal terkait siklus Pembangunan Aplikasi SPBE di Instansi Pusat/Pemerintah Daerah belum atau telah tersedia.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kebijakan internal terkait siklus Pembangunan Aplikasi SPBE di Instansi Pusat/Pemerintah Daerah telah ditetapkan. Kondisi: Kebijakan internal terkait Pembangunan Aplikasi SPBE telah mengatur siklus pembangunan aplikasi.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan Kebijakan internal terkait siklus Pembangunan Aplikasi SPBE telah mengatur proses konsultasi terkait siklus Pembangunan Aplikasi SPBE dengan unit kerja/perangkat daerah yang menjalankan fungsi pengelolaan TIK di Instansi Pusat/Pemerintah Daerah.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi, kebijakan internal terkait siklus Pembangunan Aplikasi SPBE di Instansi Pusat/Pemerintah Daerah telah mengatur keterpaduan dan pengendalian Pembangunan Aplikasi SPBE oleh unit kerja/perangkat daerah yang menjalankan fungsi pengelolaan TIK di Instansi Pusat/Pemerintah Daerah. Selain itu, kebijakan internal Pembangunan Aplikasi SPBE direviu dan dievaluasi secara periodik.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi serta hasil reviu dan evaluasi kebijakan internal Pembangunan Aplikasi SPBE di Instansi Pusat/Pemerintah Daerah SPBE telah ditindaklanjuti dengan kebijakan baru.'
                    ],
                ]
            ],
            // indikator 4
            [
                'indikator_id' => 5,
                'nama_indikator' => 'Kebijakan Internal Layanan Pusat Data SPBE Pemerintah Daerah',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Konsep kebijakan internal terkait Layanan Pusat Data yang digunakan di Instansi Pusat/Pemerintah Daerah belum atau telah tersedia.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kebijakan internal terkait Layanan Pusat Data yang digunakan di Instansi Pusat/Pemerintah Daerah telah ditetapkan. Kondisi: Kebijakan internal terkait Layanan Pusat Data telah mengatur penggunaan Layanan Pusat Data untuk sebagian unit kerja/perangkat daerah di Instansi Pusat/Pemerintah Daerah.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan kebijakan internal terkait Layanan Pusat Data telah mengatur penggunaan Layanan Pusat Data untuk seluruh unit kerja/perangkat daerah di Instansi Pusat/Pemerintah Daerah.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi, kebijakan internal terkait Layanan Pusat Data yang digunakan di Instansi Pusat/Pemerintah Daerah telah mengatur interkoneksi Layanan Pusat Data dengan Pusat Data Nasional dan/atau mengatur penggunaan Layanan Pusat Data Nasional. Selain itu, kebijakan internal terkait penggunaan Layanan Pusat Data di Instansi Pusat/Pemerintah Daerah telah direviu dan dievaluasi secara periodik.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi serta hasil reviu dan evaluasi kebijakan internal terkait Layanan Pusat Data yang digunakan di Instansi Pusat/Pemerintah Daerah SPBE telah ditindaklanjuti dengan kebijakan baru.'
                    ],
                ]
            ],
            // indikator 5
            [
                'indikator_id' => 6,
                'nama_indikator' => 'Kriteria tingkat 5 telah terpenuhi,rev iu dan evaluasi kebijakan internal terkait Layanan Pusat Data yang digunakan di Instansi Pusat/Pemerintah Daerah SPBE telah ditindaklanjuti dengan kebijakan baru.',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Konsep kebijakan internal terkait Layanan Jaringan Intra Instansi Pusat/Pemerintah Daerah belum atau telah tersedia.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kebijakan internal terkait Layanan Jaringan Intra Instansi Pusat/Pemerintah Daerah telah ditetapkan. Kondisi: Kebijakan internal terkait Layanan Jaringan Intra Instansi Pusat/Pemerintah Daerah telah mengatur Layanan Jaringan Intra untuk sebagian unit kerja/perangkat daerah di Instansi Pusat/Pemerintah Daerah.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan kebijakan internal terkait Layanan Jaringan Intra Instansi Pusat/Pemerintah Daerah telah mengatur Layanan Jaringan Intra untuk seluruh unit kerja/perangkat daerah di Instansi Pusat/Pemerintah Daerah.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi dan kebijakan internal terkait Layanan Jaringan Intra Instansi Pusat/Pemerintah Daerah telah mengatur interkoneksi Layanan Jaringan Intra Instansi Pusat/Pemerintah Daerah dengan Jaringan Intra Pemerintah dan/atau Jaringan Intra Instansi Pusat/Pemerintah Daerah lain. Selain itu, kebijakan internal terkait Layanan Jaringan Intra Instansi Pusat/Pemerintah Daerah telah direviu dan dievaluasi secara periodik.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi serta hasil reviu dan evaluasi kebijakan internal terkait Layanan Jaringan Intra Instansi Pusat/Pemerintah Daerah telah ditindaklanjuti dengan kebijakan baru.'
                    ],
                ]
            ],
            // indikator 6
            [
                'indikator_id' => 7,
                'nama_indikator' => 'Kebijakan Internal Penggunaan Sistem Penghubung Layanan Instansi Pusat/Pemerintah Daerah Pemerintah Daerah',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Konsep kebijakan internal terkait Penggunaan Sistem Penghubung Layanan Instansi Pusat/Pemerintah Daerah belum atau telah tersedia.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kebijakan internal terkait Penggunaan Sistem Penghubung Layanan Instansi Pusat/Pemerintah Daerah telah ditetapkan. Kondisi: Kebijakan internal terkait Penggunaan Sistem Penghubung Layanan Instansi Pusat/Pemerintah Daerah telah mengatur penggunaan Sistem Penghubung Layanan Instansi Pusat/Pemerintah Daerah untuk sebagian unit kerja/perangkat daerah di Instansi Pusat/Pemerintah Daerah.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan kebijakan internal terkait Penggunaan Sistem Penghubung Layanan Instansi Pusat/Pemerintah Daerah telah mengatur penggunaan Sistem Penghubung Layanan untuk seluruh unit kerja/perangkat daerah di Instansi Pusat/Pemerintah Daerah.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi, kebijakan internal terkait Penggunaan Sistem Penghubung Layanan Instansi Pusat/Pemerintah Daerah telah mengatur keterhubungan dengan Sistem Penghubung Layanan Pemerintah. Selain itu, kebijakan internal terkait Penggunaan Sistem Penghubung Layanan Instansi Pusat/Pemerintah Daerah telah direviu dan dievaluasi secara periodik.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi serta hasil reviu dan evaluasi kebijakan internal terkait Penggunaan Sistem Penghubung Layanan Instansi Pusat/Pemerintah Daerah telah ditindaklanjuti dengan kebijakan baru.'
                    ],
                ]
            ],
            // indikator 7
            [
                'indikator_id' => 8,
                'nama_indikator' => 'Kebijakan Internal Manajemen Keamanan Informasi Pemerintah Daerah',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Konsep kebijakan internal terkait Manajemen Keamanan Informasi belum atau telah tersedia.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kebijakan internal terkait Manajemen Keamanan Informasi telah ditetapkan. Kondisi: Kebijakan internal terkait Manajemen Keamanan Informasi belum mengatur secara lengkap mengenai cakupan Manajemen Keamanan Informasi (penetapan ruang lingkup, penetapan penanggung jawab, perencanaan, dukungan pengoperasian, evaluasi kinerja, dan perbaikan berkelanjutan terhadap Keamanan Informasi).'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan kebijakan internal terkait Manajemen Keamanan Informasi mengatur seluruh cakupan Manajemen Keamanan Informasi secara lengkap (penetapan ruang lingkup, penetapan penanggung jawab, perencanaan, dukungan pengoperasian, evaluasi kinerja, dan perbaikan berkelanjutan terhadap Keamanan Informasi).'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi, dan kebijakan internal terkait Manajemen Keamanan Informasi telah mengatur penerapan untuk seluruh unit kerja/perangkat daerah di Instansi Pusat/Pemerintah Daerah. Selain itu, kebijakan internal terkait Manajemen Keamanan Informasi telah direviu dan dievaluasi secara periodik.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi serta hasil reviu dan evaluasi kebijakan internal terkait Manajemen Keamanan Informasi telah ditindaklanjuti dengan kebijakan baru.'
                    ],
                ]
            ],
            // indikator 8
            [
                'indikator_id' => 9,
                'nama_indikator' => 'Kebijakan Internal Audit TIK Pemerintah Daerah',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Konsep kebijakan internal terkait Audit TIK belum atau telah tersedia.'
                    ],
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Kebijakan internal Audit TIK telah ditetapkan. Kondisi: Kebijakan internal terkait Audit TIK hanya mengatur pelaksanaan sebagian Audit TIK (Audit Infrastruktur SPBE, Audit Aplikasi SPBE, dan Audit Keamanan SPBE).'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan kebijakan internal terkait Audit TIK telah mengatur pelaksanaan seluruh Audit TIK (Audit Infrastruktur SPBE Audit Aplikasi SPBE, dan Audit Keamanan SPBE).'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi dan kebijakan internal terkait Audit TIK telah direviu dan dievaluasi secara periodik.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi serta hasil reviu dan evaluasi kebijakan internal terkait Audit TIK telah ditindaklanjuti dengan kebijakan baru.'
                    ],
                ]
            ],
            // indikator 9
            [
                'indikator_id' => 10,
                'nama_indikator' => 'Kebijakan Internal Tim Koordinasi SPBE Instansi Pusat/Pemerintah Daerah',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Konsep kebijakan internal terkait Tim Koordinasi SPBE Instansi Pusat/Pemerintah Daerah belum atau telah tersedia.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kebijakan internal Tim Koordinasi SPBE Instansi Pusat/Pemerintah Daerah telah ditetapkan. Kondisi: Kebijakan internal terkait Tim Koordinasi SPBE Instansi Pusat/Pemerintah Daerah telah mencakup pengaturan tugas-tugas Tim Koordinasi SPBE Instansi Pusat/Pemerintah Daerah yang mendukung penerapan SPBE pada sebagian unit kerja/perangkat daerah di Instansi Pusat/Pemerintah Daerah.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan kebijakan internal terkait Tim Koordinasi SPBE Instansi Pusat/Pemerintah Daerah telah mencakup pengaturan tugas-tugas Tim Koordinasi SPBE Instansi Pusat/Pemerintah Daerah yang mendukung penerapan SPBE pada seluruh unit kerja/perangkat daerah di Instansi Pusat/Pemerintah Daerah.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi, kebijakan internal terkait Tim Koordinasi SPBE Instansi Pusat/Pemerintah Daerah yang mendukung penerapan SPBE antar Instansi Pusat, antar Pemerintah Daerah, dan/atau antar Instansi Pusat dan Pemerintah Daerah, dan kebijakan internal terkait Tim Koordinasi SPBE Instansi Pusat/Pemerintah Daerah telah direviu dan dievaluasi secara periodik.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi serta hasil reviu dan evaluasi kebijakan internal terkait Tim Koordinasi SPBE Instansi Pusat/Pemerintah Daerah telah ditindaklanjuti dengan kebijakan baru.'
                    ],
                ]
            ],
            // indikator 10
            [
                'indikator_id' => 11,
                'nama_indikator' => 'Tingkat Kematangan Arsitektur SPBE Pemerintah Daerah',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Konsep dokumen Arsitektur SPBE belum atau telah tersedia.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Dokumen Arsitektur SPBE telah tersedia. Kondisi: Dokumen Arsitektur SPBE tidak/belum mencakup referensi dan domain Arsitektur SPBE Instansi Pusat/Pemerintah Daerah secara lengkap yaitu referensi dan domain arsitektur Proses Bisnis, Data dan Informasi, Infrastruktur SPBE, Aplikasi SPBE, Keamanan SPBE, dan Layanan SPBE.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan dokumen Arsitektur SPBE telah mencakup seluruh referensi dan domain Arsitektur SPBE Instansi Pusat/Pemerintah Daerah yaitu referensi dan domain arsitektur Proses Bisnis, Data dan Informasi, Infrastruktur SPBE, Aplikasi SPBE, Keamanan SPBE, dan Layanan SPBE.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi dan dokumen Arsitektur SPBE Instansi Pusat/Pemerintah Daerah telah berpedoman pada Arsitektur SPBE Nasional. Selain itu, dokumen Arsitektur SPBE Instansi Pusat/Pemerintah Daerah telah dilakukan reviu dan evaluasi secara periodik.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi dan dokumen Arsitektur SPBE Instansi Pusat/Pemerintah Daerah telah dilakukan pemutakhiran sebagai tindak lanjut hasil reviu dan evaluasi.'
                    ]
                ]
            ],
            // indikator 11 
            [
                'indikator_id' => 12,
                'nama_indikator' => 'Tingkat Kematangan Kebijakan Internal Peta Rencana SPBE Pemerintah Daerah',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Konsep dokumen Peta Rencana SPBE Instansi Pusat/Pemerintah Daerah belum atau telah tersedia.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Dokumen Peta Rencana SPBE telah tersedia. Kondisi: dokumen Peta Rencana SPBE tidak/belum mencakup muatan Peta Rencana SPBE Instansi Pusat/Pemerintah Daerah secara lengkap yaitu peta rencana Tata Kelola SPBE, Manajemen SPBE, Layanan SPBE, Infrastruktur SPBE, Aplikasi SPBE, Keamanan SPBE, Audit Teknologi SPBE dan Audit TIK.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan dokumen Peta Rencana SPBE telah mencakup seluruh muatan Peta Rencana SPBE Instansi Pusat/Pemerintah Daerah secara lengkap yaitu peta rencana Tata Kelola SPBE, Manajemen SPBE, Layanan SPBE, Infrastruktur SPBE, Aplikasi SPBE, Keamanan SPBE, Audit Teknologi SPBE dan Audit TIK.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi dan dokumen Peta Rencana SPBE Instansi Pusat/Pemerintah Daerah telah diterapkan secara konsisten melalui rencana kerja dan anggaran 3 (tiga) tahun terakhir. Selain itu, dokumen Peta Rencana SPBE Instansi Pusat/Pemerintah Daerah telah dilakukan reviu dan evaluasi secara periodik.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi dan dokumen Peta Rencana SPBE Instansi Pusat/Pemerintah Daerah telah dilakukan pemutakhiran sebagai tindak lanjut hasil reviu dan evaluasi.'
                    ],
                ]
            ],
            // indikator 12
            [
                'indikator_id' => 13,
                'nama_indikator' => 'Rencana dan Anggaran',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Rencana dan Anggaran SPBE belum atau telah tertuang dalam rencana kerja dan anggaran tahunan.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 1 telah terpenuhi dan Rencana dan Anggaran SPBE pada unit kerja/perangkat daerah tidak seluruhnya dikonsultasikan kepada unit pengelola TIK di Instansi Pusat/Pemerintah Daerah.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan seluruh Rencana dan Anggaran SPBE unit kerja/perangkat daerah telah dikonsultasikan kepada unit pengelola TIK di Instansi Pusat/Pemerintah Daerah.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi. Seluruh Rencana dan Anggaran SPBE Instansi Pusat/Pemerintah Daerah telah terpadu dan dapat dikendalikan oleh unit kerja/lembaga daerah yang menjalankan fungsi perencanaan dan penganggaran. Selain itu, Rencana dan Anggaran SPBE telah direviu dan dievaluasi secara periodik.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi serta Rencana dan Anggaran SPBE telah dilakukan perbaikan untuk tahun anggaran berikutnya sebagai tindak lanjut hasil reviu dan evaluasi.'
                    ],
                ]
            ],
            // indikator 13
            [
                'indikator_id' => 14,
                'nama_indikator' => 'Tingkat Kematangan Inovasi Proses Bisnis SPBE Pemerintah Daerah',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Dokumen Proses Bisnis Instansi Pusat/Pemerintah belum atau telah tersedia. Kondisi: Dokumen Proses Bisnis Instansi Pusat/Pemeritah Daerah belum memenuhi standar.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 1 telah terpenuhi dan dokumen Proses Bisnis Instansi Pusat/Pemeritah Daerah telah memenuhi standar.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan Proses Bisnis Instansi Pusat/Pemeritah Daerah telah dilakukan perbaikan sebagai bentuk inovasi Proses Bisnis untuk mewujudkan proses bisnis yang lebih efisien.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi, Inovasi Proses bisnis telah diterapkan ke dalam sistem elektronik/sistem aplikasi, serta telah dilakukan reviu dan evaluasi secara periodik.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi dan melakukan perbaikan Inovasi Proses Bisnis yang diterapkan ke dalam sistem elektronik/ sistem aplikasi sebagai tindak lanjut hasil reviu dan evaluasi.'
                    ],
                ]
            ],
            // indikator 14
            [
                'indikator_id' => 15,
                'nama_indikator' => 'Pembangunan Aplikasi SPBE',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Proses pembangunan Aplikasi SPBE belum atau telah dilakukan secara adhoc (sewaktu-waktu, tidak terencana). Kondisi: Proses pembangunan Aplikasi SPBE belum memenuhi siklus pembangunan aplikasi.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 1 telah terpenuhi dan proses pembangunan Aplikasi SPBE telah dilakukan sesuai siklus pembangunan aplikasi.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan proses pembangunan aplikasi SPBE telah dikonsultasikan kepada unit kerja/perangkat daerah yang melaksanakan fungsi pengelolaan TIK di Instansi Pusat/Pemerintah Daerah.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi dan Pembangunan Aplikasi SPBE Instansi Pusat/Pemerintah Daerah telah terpadu dan dapat dikendalikan oleh unit kerja/lembaga daerah yang menjalankan fungsi pengelolaan TIK di Instansi Pusat/Pemerintah Daerah. selain itu, Pembangunan Aplikasi SPBE direviu dan dievaluasi secara periodik.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi dan Aplikasi SPBE telah dikembangkan secara optimal untuk meningkatkan efektivitas dan efisiensi terhadap perubahan lingkungan, teknologi, dan kebutuhan Instansi Pusat/Pemerintah Daerah sebagai tindak lanjut hasil reviu dan evaluasi.'
                    ],
                ]
            ],
            // indikator 15
            [
                'indikator_id' => 16,
                'nama_indikator' => 'Layanan Pusat Data',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Layanan Pusat Data belum atau telah tersedia digunakan oleh Instansi Pusat/Pemerintah Daerah.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 1 telah terpenuhi. Kondisi: Layanan Pusat Data tidak/belum digunakan oleh seluruh unit kerja/perangkat daerah di Instansi Pusat/Pemerintah Daerah.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan Layanan Pusat Data telah digunakan oleh seluruh unit kerja/perangkat daerah di Instansi Pusat/Pemerintah Daerah. Selain itu, terdapat prosedur pengoperasian baku Layanan Pusat Data.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi dan terdapat interkoneksi Layanan Pusat Data dengan Pusat Data Nasional/Pusat Data Instansi Pusat/Pusat Data Pemerintah Daerah lain dan/atau penggunaan Layanan Pusat Data Nasional. Selain itu, penggunaan Layanan Pusat Data di Instansi Pusat/Pemerintah Daerah telah direviu dan dievaluasi secara periodik.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi serta hasil reviu dan evaluasi penggunaan Layanan Pusat Data di Instansi Pusat/Pemerintah Daerah telah ditindaklanjuti dengan melakukan perbaikan terhadap Layanan Pusat Data.'
                    ],
                ]
            ],
            // indikator 16
            [
                'indikator_id' => 17,
                'nama_indikator' => 'Jaringan Intra Pemerintah Daerah',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Layanan Jaringan Intra Instansi Pusat/Pemerintah Daerah belum atau telah tersedia.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 1 telah terpenuhi. Kondisi: Layanan Jaringan Intra Instansi Pusat/Pemerintah Daerah tidak/belum diterapkan di seluruh unit kerja/perangkat daerah di Instansi Pusat/Pemerintah Daerah.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan Layanan Jaringan Intra Instansi Pusat/Pemerintah Daerah telah diterapkan di seluruh unit kerja/perangkat daerah di Instansi Pusat/Pemerintah Daerah.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi dan terdapat interkoneksi Layanan Jaringan Intra Instansi Pusat/Pemerintah Daerah dengan Jaringan Intra Pemerintah dan/atau Jaringan Intra Instansi Pusat/Pemerintah Daerah lain. Selain itu, Layanan Jaringan Intra Instansi Pusat/Pemerintah Daerah telah direviu dan dievaluasi secara periodik.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi serta hasil reviu dan evaluasi Layanan Jaringan Intra Instansi Pusat/Pemerintah Daerah telah ditindaklanjuti dengan melakukan perbaikan terhadap Layanan Jaringan Intra Instansi Pusat/Pemerintah Daerah.'
                    ],
                ]
            ],
            // indikator 17
            [
                'indikator_id' => 18,
                'nama_indikator' => 'Penggunaan Sistem Penghubung Layanan Instansi Pusat/Pemerintah Daerah',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Sistem penghubung layanan Instansi Pusat dan Pemerintah Daerah belum atau telah tersedia.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 1 telah terpenuhi. Kondisi: Sistem penghubung layanan Instansi Pusat dan Pemerintah Daerah tidak/belum diterapkan di seluruh unit kerja/perangkat daerah di Instansi Pusat/Pemerintah Daerah.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan sistem penghubung layanan Instansi Pusat dan Pemerintah Daerah telah diterapkan di seluruh unit kerja/perangkat daerah di Instansi Pusat/Pemerintah Daerah.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi, sistem penghubung layanan Instansi Pusat dan Pemerintah Daerah telah terintegrasi dengan sistem penghubungan layanan pemerintah dan/atau sistem penghubung layanan Instansi Pusat/Pemerintah Daerah lain. Selain itu, sistem penghubung layanan Instansi Pusat/Pemerintah Daerah telah direviu dan dievaluasi secara periodik.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi serta hasil reviu dan evaluasi sistem penghubung layanan Instansi Pusat dan Pemerintah Daerah telah ditindaklanjuti dengan melakukan perbaikan.'
                    ],
                ]
            ],
            // indikator 18
            [
                'indikator_id' => 19,
                'nama_indikator' => 'Tim Koordinasi SPBE Instansi Pusat/Pemerintah Daerah',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Tim Koordinasi SPBE Instansi Pusat/Pemerintah Daerah belum atau telah terbentuk. Kondisi: Tugas/program kerja Tim Koordinasi SPBE Instansi Pusat/Pemerintah Daerah dilaksanakan sewaktu-waktu atau tanpa perencanaan.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 1 telah terpenuhi dan tugas/program kerja Tim Koordinasi SPBE Instansi Pusat/Pemerintah Daerah telah dilaksanakan sesuai perencanaan. Kondisi: tugas/program kerja Tim Koordinasi SPBE Instansi Pusat/Pemerintah Daerah tidak/belum dilaksanakan seluruhnya.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan tugas/program kerja Tim Koordinasi SPBE Instansi Pusat/Pemerintah Daerah telah dilaksanakan seluruhnya. Kondisi: program kerja Tim Koordinasi SPBE Instansi Pusat/Pemerintah Daerah belum dikomunikasikan/dikoordinasikan kepada semua unit kerja/perangkat daerah terkait di Instansi Pusat/Pemerintah Daerah.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi dan program kerja Tim Koordinasi SPBE Instansi Pusat/Pemerintah Daerah telah dikomunikasikan/dikoordinasikan kepada semua unit kerja/perangkat daerah terkait di Instansi Pusat/Pemerintah Daerah. Selain itu, tugas/program kerja Tim Koordinasi SPBE Instansi Pusat/Pemerintah Daerah telah dilakukan reviu dan evaluasi.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi dan hasil reviu dan evaluasi tugas/program kerja Tim Koordinasi SPBE Instansi Pusat/Pemerintah Daerah telah ditindaklanjuti melalui perbaikan tugas/program kerja Tim Koordinasi SPBE Instansi Pusat/Pemerintah Daerah dan pelaksanaannya.'
                    ],
                ]
            ],
            // indikator 19
            [
                'indikator_id' => 20,
                'nama_indikator' => 'Kolaborasi Penerapan SPBE',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Kolaborasi antar unit kerja/perangkat daerah di Instansi Pusat/Perangkat Daerah dalam penerapan SPBE belum atau telah dilaksanakan. Kondisi: Kolaborasi antar unit kerja/perangkat daerah di Instansi Pusat/Perangkat Daerah dalam penerapan SPBE dilaksanakan sewaktu-waktu atau tanpa perencanaan.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 1 telah terpenuhi dan kolaborasi antar unit kerja/perangkat daerah di Instansi Pusat/Perangkat Daerah dalam penerapan SPBE telah dilaksanakan sesuai perencanaan. Kondisi: Kolaborasi antar unit kerja/perangkat daerah di Instansi Pusat/Perangkat Daerah dalam penerapan SPBE tidak dibentuk secara formal.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan kolaborasi antar unit kerja/perangkat daerah di Instansi Pusat/Perangkat Daerah dalam penerapan SPBE telah dilaksanakan oleh tim yang dibentuk secara formal. Kondisi: Kolaborasi antar unit kerja/perangkat daerah dalam penerapan SPBE tidak/belum dilaksanakan pada seluruh unit kerja/perangkat daerah di Instansi Pusat/Perangkat Daerah (kolaborasi dibentuk berdasarkan adanya kegiatan bersama).'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi dan kolaborasi antar unit kerja/perangkat daerah dalam penerapan SPBE telah dilaksanakan secara terpadu pada seluruh unit kerja/perangkat daerah di Instansi Pusat/Pemerintah Daerah yang dikoordinasikan oleh menteri/kepala lembaga/kepala daerah atau sekretaris kementerian/lembaga/pemerintah daerah. Selain itu, kolaborasi dalam penerapan SPBE telah dilakukan reviu dan evaluasi.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi dan hasil reviu dan evaluasi kolaborasi dalam penerapan SPBE telah ditindaklanjuti melalui perbaikan pelaksanaan kolaborasi dalam penerapan SPBE.'
                    ],
                ]
            ],
            // indikator 20
            [
                'indikator_id' => 21,
                'nama_indikator' => 'Penerapan Manajemen Resiko SPBE',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Kegiatan Manajemen Risiko SPBE belum atau telah diterapkan. Kondisi: Kegiatan Manajemen Risiko SPBE diterapkan tanpa program kegiatan yang terarah dan terencana.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 1 telah terpenuhi dan kegiatan Manajemen Risiko SPBE diterapkan dengan program kegiatan yang terarah dan terencana. Kondisi: Penerapan Manajemen Risiko SPBE dilaksanakan tanpa mengacu pada pedoman manajemen risiko SPBE.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan Manajemen Risiko SPBE telah dilaksanakan dengan mengacu pada pedoman manajemen risiko SPBE.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi dan kebijakann strategis Manajemen Risiko SPBE telah ditetapkan oleh Komite Manajemen Risiko SPBE atau Tim Koordinasi SPBE Instansi Pusat/Pemerintah Daerah dan diterapkan ke seluruh unit kerja/perangkat daerah di Instansi Pusat/Pemerintah Daerah. Selain itu, penerapan Manajemen Risiko SPBE telah direviu dan dievaluasi secara periodik.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi serta hasil reviu dan evaluasi Manajemen Risiko SPBE ditindaklanjuti melalui perbaikan penerapan Manajemen Risiko SPBE.'
                    ],
                ]
            ],
            // indikator 21
            [
                'indikator_id' => 22,
                'nama_indikator' => 'Penerapan Manajemen Keamanan Informasi',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Pengendalian Keamanan Informasi belum atau telah tersedia dalam tahap pembangunan.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Pengendalian Keamanan Informasi telah tersedia. Kondisi: Pengendalian Keamanan Informasi telah dilaksanakan pada sebagian unit kerja/perangkat daerah di Instansi Pusat/Pemerintah Daerah.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan pengendalian Keamanan Informasi telah dilaksanakan pada seluruh unit kerja/perangkat daerah di Instansi Pusat/Pemerintah Daerah dengan berdasarkan Risiko SPBE.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi dan pengendalian Keamanan Informasi dilakukan melalui strategi Keamanan Informasi yang ditetapkan oleh Tim Koordinasi SPBE Instansi Pusat/Pemerintah Daerah. Selain itu, pengendalian Keamanan Informasi telah dilakukan reviu dan evaluasi secara periodik.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi serta hasil reviu dan evaluasi pengendalian Keamanan Informasi ditindaklanjuti melalui perbaikan penerapan proses pengendalian Keamanan Informasi.'
                    ]
                ]
            ],
            // indikator 22
            [
                'indikator_id' => 23,
                'nama_indikator' => 'Penerapan Manajemen Data',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Kegiatan Manajemen Data belum atau telah diterapkan. Kondisi: Kegiatan Manajemen Data diterapkan tanpa program kegiatan yang terarah dan terencana'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 1 telah terpenuhi dan kegiatan Manajemen Data diterapkan dengan program kegiatan yang terarah dan terencana. Kondisi: Manajemen Data dilaksanakan tanpa mengacu pada pedoman Manajemen Data.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan Manajemen Data telah dilaksanakan dengan mengacu pada pedoman Manajemen Data yang mencakup pengelolaan arsitektur data, data induk, data referensi, basis data, kualitas data, dan interoperabilitas data.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi dan Manajemen Data dilaksanakan melalui strategi pengelolaan data yang ditetapkan Forum Satu Data atau Tim Koordinasi SPBE Instansi Pusat/Pemerintah Daerah dan diterapkan ke seluruh unit kerja/perangkat daerah di Instansi Pusat/Pemerintah Daerah. Selain itu, penerapan Manajemen Data telah direviu dan dievaluasi secara periodik.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi serta hasil reviu dan evaluasi Manajemen Data ditindaklanjuti melalui perbaikan penerapan Manajemen Data.'
                    ],
                ]
            ],
            // indikator 23
            [
                'indikator_id' => 24,
                'nama_indikator' => 'Penerapan Manajemen Aset TIK',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Kegiatan Manajemen Aset TIK belum atau telah diterapkan. Kondisi: Kegiatan Manajemen Aset TIK diterapkan tanpa program kegiatan yang terarah dan terencana.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 1 telah terpenuhi dan kegiatan Manajemen Aset TIK diterapkan dengan program kegiatan yang terarah dan terencana. Kondisi: Manajemen Aset TIK dilaksanakan tanpa mengacu pada pedoman Manajemen Aset TIK yang mencakup proses perencanaan, pengadaan, pemanfaatan/penggunaan, dan penghapusan aset TIK.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan Manajemen Aset TIK telah dilaksanakan dengan mengacu pada pedoman Manajemen Aset TIK yang mencakup proses perencanaan, pengadaan, pemanfaatan/penggunaan, dan penghapusan aset TIK.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi, Manajemen Aset TIK dilaksanakan melalui strategi pengelolaan aset TIK oleh unit kerja/ perangkat daerah yang menjalankan fungsi pengelolaan TIK di Instansi Pusat/Pemerintah Daerah dan diterapkan ke seluruh unit kerja/perangkat daerah di Instansi Pusat/Pemerintah Daerah. Selain itu, penerapan Manajemen Aset TIK telah direviu dan dievaluasi secara periodik.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi serta hasil reviu dan evaluasi Manajemen Aset TIK ditindaklanjuti melalui perbaikan penerapan Manajemen Aset TIK.'
                    ],
                ]
            ],
            // indikator 24
            [
                'indikator_id' => 25,
                'nama_indikator' => 'Penerapan Kompetensi Sumber Daya Manusia',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Pemenuhan kompetensi Sumber Daya Manusia belum atau telah diupayakan. Kondisi: Pemenuhan kompetensi Sumber Daya Manusia SPBE dilakukan tanpa perencanaan Sumber Daya Manusia.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 1 telah terpenuhi dan pemenuhan kompetensi Sumber Daya Manusia SPBE dilakukan sesuai dengan perencanaan Sumber Daya Manusia. Kondisi: Kompetensi Sumber Daya Manusia SPBE tidak/belum terpenuhi seluruhnya yaitu kompetensi di bidang proses bisnis memerintahan, arsitektur SPBE, data dan informasi, keamanan SPBE, aplikasi SPBE, dan infrastruktur SPBE.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan kompetensi Sumber Daya Manusia SPBE telah terpenuhi seluruhnya yaitu kompetensi di bidang proses bisnis memerintahan, arsitektur SPBE, data dan informasi, keamanan SPBE, aplikasi SPBE, dan infrastruktur SPBE.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi, peningkatan dan penilaian kompetensi Sumber Daya Manusia SPBE telah dilakukan. Selain itu, pemenuhan kompetensi Sumber Daya Manusia SPBE telah dilakukan reviu dan evaluasi secara periodik.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi serta hasil reviu dan evaluasi telah ditindaklanjuti melalui perbaikan perencanaan dan pemenuhan kompetensi Sumber Daya Manusia SPBE.'
                    ],
                ]
            ],
            // indikator 25
            [
                'indikator_id' => 26,
                'nama_indikator' => 'Penerapan Pengetahuan',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Manajemen Pengetahuan SPBE belum atau telah diterapkan. Kondisi: Manajemen Pengetahuan SPBE diterapkan tanpa perencanaan.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 1 telah terpenuhi dan dilaksanakan dengan perencanaan. Kondisi: Manajemen Pengetahuan SPBE telah dilaksanakan tanpa pedoman di Instansi Pusat/Pemerintah Daerah.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi, Manajemen Pengetahuan SPBE dilaksanakan dengan mengacu pada pedoman di Instansi Pusat/Pemerintah Daerah dan Manajemen Pengetahuan SPBE diterapkan dengan menggunakan sistem aplikasi manajemen pengetahuan.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi, semua unit kerja/perangkat daerah telah menerapkan Manajemen Pengetahuan SPBE dengan menggunakan sistem aplikasi manajemen pengetahuan yang terintegrasi serta telah dilakukan reviu dan evaluasi terhadap penerapan Manajemen Pengetahuan SPBE.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi serta hasil reviu dan evaluasi terhadap penerapan Manajemen Pengetahuan SPBE telah ditindaklanjuti melalui perbaikan Manajemen Pengetahuan SPBE.
'
                    ],
                ]
            ],
            // indikator 26
            [
                'indikator_id' => 27,
                'nama_indikator' => 'Penerapan Manajemen Perubahan',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Kegiatan Manajemen Perubahan SPBE belum atau telah dilaksanakan. Kondisi: Kegiatan Manajemen Perubahan SPBE dilaksanakan tanpa perencanaan.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 1 telah terpenuhi dan kegiatan Manajemen Perubahan SPBE dilaksanakan dengan perencanaan. Kondisi: Kegiatan Manajemen Perubahan SPBE tidak/belum dilaksanakan oleh seluruh unit kerja/perangkat daerah terkait di Instansi Pusat/Pemerintah Daerah dengan caranya masing masing.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan kegiatan Manajemen Perubahan SPBE dilaksanakan oleh seluruh unit kerja/perangkat daerah terkait di Instansi Pusat/Pemerintah Daerah sesuai pedoman Manajemen Perubahan.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi dan kegiatan Manajemen Perubahan SPBE telah dilakukan reviu dan evaluasi.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi serta hasil reviu dan evaluasi telah ditindaklanjuti melalui perbaikan Manajemen Perubahan SPBE.'
                    ],
                ]
            ],
            // indikator 27
            [
                'indikator_id' => 28,
                'nama_indikator' => 'Penerapan Manajemen Layanan SPBE',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Manajemen Layanan SPBE belum atau telah dilaksanakan. Kondisi: Manajemen Layanan SPBE dilaksanakan tanpa perencanaan.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 1 telah terpenuhi dan Manajemen Layanan SPBE dilaksanakan dengan perencanaan. Kondisi: Manajemen Layanan SPBE tidak/belum dilaksanakan pada seluruh proses Manajemen Layanan SPBE yaitu Pelayanan Pengguna SPBE dan Pengoperasian Layanan SPBE.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan Manajemen Layanan SPBE dilaksanakan pada seluruh proses Manajemen Layanan SPBE yaitu Pelayanan Pengguna SPBE dan Pengoperasian Layanan SPBE.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi, Manajemen Layanan SPBE telah diterapkan dengan menggunakan sistem aplikasi manajemen layanan, dan kegiatan Manajemen Layanan SPBE telah dilakukan reviu dan evaluasi.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi serta hasil reviu dan evaluasi telah ditindaklanjuti melalui perbaikan Manajemen Layanan SPBE.'
                    ],
                ]
            ],
            // indikator 28
            [
                'indikator_id' => 29,
                'nama_indikator' => 'Penerapan Manajemen Audit Infrastruktur SPBE',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Kegiatan Audit Infrastruktur SPBE belum atau telah dilaksanakan. Kondisi: Kegiatan Audit Infrastruktur dilaksanakan tanpa perencanaan yang berkesinambungan.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 1 telah terpenuhi dan kegiatan Audit Infrastruktur dilaksanakan sesuai dengan perencanaan yang berkesinambungan. Kondisi: Kegiatan Audit Infrastruktur dilaksanakan tanpa pedoman Audit Infrastruktur.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan kegiatan Audit Infrastruktur dilaksanakan sesuai dengan pedoman Audit Infrastruktur. Kondisi: kegiatan Audit Infrastruktur dilaksanakan oleh auditor TIK/Sistem Informasi internal Instansi Pusat/Pemerintah Daerah.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi dan kegiatan Audit Infrastruktur dilaksanakan oleh auditor TIK/Sistem Informasi eksternal yang memiliki sertifikasi auditor TIK/Sistem Informasi.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi dan hasil audit Infrastruktur SPBE telah ditindaklanjuti melalui perbaikan penerapan Infrastruktur SPBE.'
                    ],
                ]
            ],
            // indikator 29
            [
                'indikator_id' => 30,
                'nama_indikator' => 'Pelaksanaan Audit Aplikasi SPBE',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Kegiatan Audit Aplikasi SPBE belum atau telah dilaksanakan. Kondisi: Kegiatan Audit Aplikasi dilaksanakan tanpa perencanaan yang berkesinambungan.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 1 telah terpenuhi dan kegiatan Audit Aplikasi dilaksanakan sesuai dengan perencanaan yang berkesinambungan. Kondisi: Kegiatan Audit Aplikasi dilaksanakan tanpa pedoman Audit Aplikasi SPBE.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan kegiatan Audit Aplikasi dilaksanakan sesuai dengan pedoman Audit Aplikasi SPBE. Kondisi: kegiatan Audit Aplikasi dilaksanakan oleh auditor TIK/Sistem Informasi internal Instansi Pusat/Pemerintah Daerah.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi dan kegiatan Audit Aplikasi dilaksanakan oleh auditor TIK/Sistem Informasi eksternal yang memiliki sertifikasi auditor TIK/Sistem Informasi.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi dan hasil audit Aplikasi SPBE telah ditindaklanjuti melalui perbaikan penerapan Aplikasi SPBE.'
                    ],
                ]
            ],
            // indikator 30
            [
                'indikator_id' => 31,
                'nama_indikator' => 'Pelaksanaan Audit Keamanan SPBE',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Kegiatan Audit Keamanan SPBE belum atau telah dilaksanakan. Kondisi: Kegiatan Audit Keamanan dilaksanakan tanpa perencanaan yang berkesinambungan.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 1 telah terpenuhi dan kegiatan Audit Keamanan dilaksanakan sesuai dengan perencanaan yang berkesinambungan. Kondisi: Kegiatan Audit Keamanan dilaksanakan tanpa pedoman Audit Keamanan.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan kegiatan Audit Keamanan dilaksanakan sesuai dengan pedoman Audit Keamanan. Kondisi: kegiatan Audit Keamanan dilaksanakan oleh auditor TIK/Sistem Keamanan Informasi internal Instansi Pusat/Pemerintah Daerah.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi dan kegiatan Audit Keamanan dilaksanakan oleh auditor TIK/Sistem Keamanan Informasi eksternal yang memiliki sertifikasi auditor TIK/Sistem Keamanan Informasi.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi dan hasil audit Keamanan SPBE telah ditindaklanjuti melalui perbaikan penerapan Keamanan SPBE.'
                    ],
                ]
            ],
            // indikator 31
            [
                'indikator_id' => 32,
                'nama_indikator' => 'Layanan Perencanaan',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Layanan Perencanan Berbasis Elektronik hanya memberikan layanan informasi terkait perencanaan kegiatan pemerintah.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 1 telah terpenuhi dan Layanan Perencanan Berbasis Elektronik memberikan layanan interaksi terkait perencanaan kegiatan pemerintah seperti pencarian informasi, pengunggahan dan pengunduhan dokumen perencanaan.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan Layanan Perencanaan Berbasis Elektronik memberikan layanan transaksi kepada pengguna terkait perencanaan kegiatan pemerintah seperti otomasi alur kerja, transaksi basis data, validasi data, mekanisme persetujuan, dan analitik data.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi dan Layanan Perencanaan Berbasis Elektronik memberikan layanan kolaborasi dengan layanan elektronik lain, misalnya layanan penganggaran berbasis elektronik, layanan keuangan berbasis elektronik, layanan pengadaan berbasis elektronik, layanan perencanaan berbasis elektronik Instansi Pusat/Pemerintah Daerah lain, dan/atau layanan SPBE Instansi Pusat/Pemerintah Daerah lain.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi dan Layanan Perencanaan Berbasis Elektronik telah dilakukan perbaikan berdasarkan hasil reviu dan evaluasi terhadap perubahan lingkungan, peraturan perundang undangan, teknologi atau kebutuhan Instansi Pusat/Pemerintah Daerah.'
                    ],
                ]
            ],
            // indikator 32
            [
                'indikator_id' => 33,
                'nama_indikator' => 'Layanan Penganggaran',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Layanan Penganggaran Berbasis Elektronik hanya memberikan layanan informasi terkait penganggaran kegiatan pemerintah.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 1 telah terpenuhi dan Layanan Penganggaran Berbasis Elektronik memberikan layanan interaksi terkait penganggaran kegiatan pemerintah seperti pencarian informasi, pengunggahan dan pengunduhan dokumen penganggaran.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan Layanan Penganggaran Berbasis Elektronik memberikan layanan transaksi kepada pengguna terkait penganggaran kegiatan pemerintah seperti otomasi alur kerja, transaksi basis data, validasi data, mekanisme persetujuan, dan analitik data.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi dan Layanan Penganggaran Berbasis Elektronik memberikan layanan kolaborasi dengan layanan elektronik lain, misalnya layanan perencanaan berbasis elektronik, layanan keuangan berbasis elektronik, layanan pengadaan berbasis elektronik, layanan penganggaran berbasis elektronik Instansi Pusat/Pemerintah Daerah lain, dan/atau layanan SPBE Instansi Pusat/Pemerintah Daerah lain.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi dan Layanan Penganggaran Berbasis Elektronik telah dilakukan perbaikan berdasarkan hasil reviu dan evaluasi terhadap perubahan lingkungan, peraturan perundang-undangan, teknologi atau kebutuhan Instansi Pusat/Pemerintah Daerah.'
                    ],
                ]
            ],
            // indikator 33
            [
                'indikator_id' => 34,
                'nama_indikator' => 'Layanan Keuangan',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Layanan Keuangan Berbasis Elektronik hanya memberikan layanan informasi terkait keuangan di Instansi Pusat/Pemerintah.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 1 telah terpenuhi dan Layanan Keuangan Berbasis Elektronik memberikan layanan interaksi terkait keuangan seperti pencarian informasi, pengunggahan dan pengunduhan dokumen.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan Layanan Keuangan Berbasis Elektronik memberikan layanan transaksi kepada pengguna terkait keuangan seperti otomasi alur kerja, transaksi basis data, validasi data, mekanisme persetujuan, dan analitik data.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi dan Layanan Keuangan Berbasis Elektronik memberikan layanan kolaborasi dengan layanan elektronik lain, misalnya Layanan Penganggaran Berbasis Elektronik, Layanan Pengadaan Berbasis Elektronik, Layanan Perencanaan Berbasis Elektronik, Layanan Keuangan Berbasis Elektronik Instansi Pusat/Pemerintah Daerah lain, dan/atau layanan SPBE Instansi Pusat/Pemerintah Daerah lain.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi dan Layanan Keuangan Berbasis Elektronik telah dilakukan perbaikan berdasarkan hasil reviu dan evaluasi terhadap perubahan lingkungan, peraturan perundang undangan, teknologi atau kebutuhan Instansi Pusat/Pemerintah Daerah.'
                    ],
                ]
            ],
            // indikator 34
            [
                'indikator_id' => 35,
                'nama_indikator' => 'Layanan Pengadaan Barang Dan Jasa',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Layanan Pengadaan Barang dan Jasa Berbasis Elektronik hanya memberikan layanan informasi terkait pengadaan barang dan jasa di Instansi Pusat/Pemerintah.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 1 telah terpenuhi dan Layanan Pengadaan Barang dan Jasa Berbasis Elektronik memberikan layanan interaksi terkait pengadaan barang dan jasa seperti pencarian informasi, pengunggahan dan pengunduhan dokumen.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan Layanan Pengadaan Barang dan Jasa Berbasis Elektronik memberikan layanan transaksi kepada pengguna terkait pengadaan barang dan jasa seperti otomasi alur kerja, transaksi basis data, validasi data, mekanisme persetujuan, dan analitik data.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi dan Layanan Pengadaan Barang dan Jasa Berbasis Elektronik memberikan layanan kolaborasi dengan layanan elektronik lain, misalnya Layanan Penganggaran Berbasis Elektronik, Layanan Perencanaan Berbasis Elektronik, Layanan Keuangan Berbasis Elektronik, Layanan Pengadaan Barang dan Jasa Berbasis Elektronik Instansi Pusat/Pemerintah Daerah lain, dan/atau layanan SPBE Instansi Pusat/Pemerintah Daerah lain.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi dan Layanan Pengadaan Barang dan Jasa Berbasis Elektronik telah dilakukan perbaikan berdasarkan hasil reviu dan evaluasi terhadap perubahan lingkungan, peraturan perundang-undangan, teknologi atau kebutuhan Instansi Pusat/Pemerintah Daerah.'
                    ],
                ]
            ],
            // indikator 35
            [
                'indikator_id' => 36,
                'nama_indikator' => 'Layanan Kepegawaian',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Layanan Kepegawaian Berbasis Elektronik hanya memberikan layanan informasi terkait kepegawaian.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 1 telah terpenuhi dan Layanan Kepegawaian Berbasis Elektronik memberikan layanan interaksi terkait kepegawaian seperti pencarian informasi, pengunggahan dan pengunduhan dokumen.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan Layanan Kepegawaian Berbasis Elektronik memberikan layanan transaksi kepada pengguna terkait kepegawaian seperti otomasi alur kerja, transaksi basis data, validasi data, mekanisme persetujuan, dan analitik data.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi dan Layanan Kepegawaian Berbasis Elektronik memberikan layanan kolaborasi dengan layanan elektronik lain, misalnya Layanan Kinerja Berbasis Elektronik, Layanan Keuangan Berbasis Elektronik, Layanan Kepegawaian Berbasis Elektronik Instansi Pusat/Pemerintah Daerah lain, dan/atau layanan SPBE Instansi Pusat/Pemerintah Daerah lain.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi dan Layanan Kepegawaian Berbasis Elektronik telah dilakukan perbaikan berdasarkan hasil reviu dan evaluasi terhadap perubahan lingkungan, peraturan perundang undangan, teknologi atau kebutuhan Instansi Pusat/Pemerintah Daerah.'
                    ],
                ]
            ],
            // indikator 36
            [
                'indikator_id' => 37,
                'nama_indikator' => 'Layanan Kearsipan Dinamis',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Layanan Kearsipan Dinamis Berbasis Elektronik hanya memberikan layanan informasi terkait kearsipan dinamis.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 1 telah terpenuhi dan Layanan Kearsipan Dinamis Berbasis Elektronik memberikan layanan interaksi terkait kearsipan dinamis seperti pencarian informasi, pengunggahan dan pengunduhan dokumen.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan Layanan Kearsipan Dinamis Berbasis Elektronik memberikan layanan transaksi kepada pengguna terkait kearsipan dinamis seperti otomasi alur kerja, transaksi basis data, validasi data, mekanisme persetujuan, dan analitik data.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi dan Layanan Kearsipan Dinamis Berbasis Elektronik memberikan layanan kolaborasi dengan layanan elektronik lain, misalnya Layanan Pengadaan Barang dan Jasa Berbasis Elektronik, Layanan Kepegawaian Berbasis Elektronik, Layanan Kearsipan Dinamis Berbasis Elektronik Instansi Pusat/Pemerintah Daerah lain, dan/atau layanan SPBE Instansi Pusat/Pemerintah Daerah lain.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi dan Layanan Kearsipan Dinamis Berbasis Elektronik telah dilakukan perbaikan berdasarkan hasil reviu dan evaluasi terhadap perubahan lingkungan, peraturan perundang-undangan, teknologi atau kebutuhan Instansi Pusat/Pemerintah Daerah.'
                    ],
                ]
            ],
            // indikator 37
            [
                'indikator_id' => 38,
                'nama_indikator' => 'Layanan Pengelolaan Barang Milik Negara/Daerah',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Layanan Pengelolaan Barang Milik Negara/Daerah Berbasis Elektronik hanya memberikan layanan informasi terkait pengelolaan barang milik negara.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 1 telah terpenuhi dan Layanan Pengelolaan Barang Milik Negara/Daerah Berbasis Elektronik memberikan layanan interaksi terkait pengelolaan barang milik negara/daerah seperti pencarian informasi, pengunggahan dan pengunduhan dokumen.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan Layanan Pengelolaan Barang Milik Negara/Daerah Berbasis Elektronik memberikan layanan transaksi kepada pengguna terkait pengelolaan barang milik negara/daerah seperti otomasi alur kerja, transaksi basis data, validasi data, mekanisme persetujuan, dan analitik data.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi dan Layanan Pengelolaan Barang Milik Negara/Daerah Berbasis Elektronik memberikan layanan kolaborasi dengan layanan elektronik lain, misalnya Layanan Penganggaran Berbasis Elektronik, Layanan Pengadaan Barang dan Jasa Berbasis Elektronik, Layanan Keuangan Berbasis Elektronik, Layanan Pengelolaan Barang Milik Negara/Daerah Berbasis Elektronik Instansi Pusat/Pemerintah Daerah lain, dan/atau layanan SPBE Instansi Pusat/Pemerintah Daerah lain.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi dan Layanan Pengelolaan Barang Milik Negara/Daerah Berbasis Elektronik telah dilakukan perbaikan berdasarkan hasil reviu dan evaluasi terhadap perubahan lingkungan, peraturan perundang-undangan, teknologi atau kebutuhan Instansi Pusat/Pemerintah Daerah.'
                    ],
                ]
            ],
            // indikator 38
            [
                'indikator_id' => 39,
                'nama_indikator' => 'Layanan Pengawasan Internal Pemerintah',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Layanan Pengawasan Internal Pemerintah Berbasis Elektronik hanya memberikan layanan informasi terkait pengawasan internal pemerintah.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 1 telah terpenuhi dan Layanan Pengawasan Internal Pemerintah Berbasis Elektronik memberikan layanan interaksi terkait pengawasan internal pemerintah seperti pencarian informasi, pengunggahan dan pengunduhan dokumen.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan Layanan Pengawasan Internal Pemerintah Berbasis Elektronik memberikan layanan transaksi kepada pengguna terkait pengawasan internal pemerintah seperti otomasi alur kerja, transaksi basis data, validasi data, mekanisme persetujuan, dan analitik data.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi dan Layanan Pengawasan Internal Pemerintah Berbasis Elektronik memberikan layanan kolaborasi dengan layanan elektronik lain, misalnya Layanan Kepegawaian Berbasis Elektronik, Layanan Akuntabilitas Kinerja Berbasis Elektronik, Layanan Pengawasan Internal Pemerintah Berbasis Elektronik Instansi Pusat/Pemerintah Daerah lain, dan/atau layanan SPBE Instansi Pusat/Pemerintah Daerah lain.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi dan Layanan Pengawasan Internal Berbasis Elektronik telah dilakukan perbaikan berdasarkan hasil reviu dan evaluasi terhadap perubahan lingkungan, peraturan perundang-undangan, teknologi atau kebutuhan Instansi Pusat/Pemerintah Daerah.'
                    ],
                ]
            ],
            // indikator 39
            [
                'indikator_id' => 40,
                'nama_indikator' => 'Layanan Akuntabilitas Kinerja Organisasi',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Layanan Akuntabilitas Kinerja Instansi Pusat/Pemerintah Daerah Berbasis Elektronik hanya memberikan layanan informasi terkait akuntabilitas kinerja Instansi Pusat/Pemerintah Daerah.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 1 telah terpenuhi dan Layanan Akuntabilitas Kinerja Instansi Pusat/Pemerintah Daerah Berbasis Elektronik memberikan layanan interaksi terkait akuntabilitas kinerja Instansi Pusat/Pemerintah Daerah seperti pencarian informasi, pengunggahan dan pengunduhan dokumen.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan Layanan Akuntabilitas Kinerja Instansi Pusat/Pemerintah Daerah Berbasis Elektronik memberikan layanan transaksi kepada pengguna terkait akuntabilitas kinerja Instansi Pusat/Pemerintah Daerah seperti otomasi alur kerja, transaksi basis data, validasi data, mekanisme persetujuan, dan analitik data.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => '	Kriteria tingkat 3 telah terpenuhi dan Layanan Akuntabilitas Kinerja Instansi Pusat/Pemerintah Daerah Berbasis Elektronik memberikan layanan kolaborasi dengan layanan elektronik lain, misalnya Layanan Penganggaran Berbasis Elektronik, Layanan Pengadaan Berbasis Elektronik, Layanan Perencanaan Berbasis Elektronik, Layanan Keuangan Berbasis Elektronik, Layanan Akuntabilitas Kinerja Instansi Pusat/Pemerintah Daerah Berbasis Elektronik Instansi Pusat/Pemerintah Daerah lain, dan/atau layanan SPBE Instansi Pusat/Pemerintah Daerah lain.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi dan Layanan Akuntabilitas Kinerja Instansi Pusat/Pemerintah Daerah Berbasis Elektronik telah dilakukan perbaikan berdasarkan hasil reviu dan evaluasi terhadap perubahan lingkungan, peraturan perundang-undangan, teknologi atau kebutuhan Instansi Pusat/Pemerintah Daerah.'
                    ],
                ]
            ],
            // indikator 40
            [
                'indikator_id' => 41,
                'nama_indikator' => 'Layanan Kinerja Pegawai',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Layanan Kinerja Pegawai Berbasis Elektronik hanya memberikan layanan informasi terkait kinerja pegawai.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 1 telah terpenuhi dan Layanan Kinerja Pegawai Berbasis Elektronik memberikan layanan interaksi terkait kinerja pegawai seperti pencarian informasi, pengunggahan dan pengunduhan dokumen.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan Layanan Kinerja Pegawai Berbasis Elektronik memberikan layanan transaksi kepada pengguna terkait kinerja pegawai seperti otomasi alur kerja, transaksi basis data, validasi data, mekanisme persetujuan, dan analitik data.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi dan Layanan Kinerja Pegawai Berbasis Elektronik memberikan layanan kolaborasi dengan layanan elektronik lain, misalnya Layanan Perencanaan Berbasis Elektronik, Layanan Akuntabilitas Berbasis Elektronik, Layanan Kinerja Pegawai Berbasis Elektronik Instansi Pusat/Pemerintah Daerah lain, dan/atau layanan SPBE Instansi Pusat/Pemerintah Daerah lain.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi dan Layanan Kinerja Pegawai Berbasis Elektronik telah dilakukan perbaikan berdasarkan hasil reviu dan evaluasi terhadap perubahan lingkungan, peraturan perundang-undangan, teknologi atau kebutuhan Instansi Pusat/Pemerintah Daerah.'
                    ],
                ]
            ],
            // indikator 41
            [
                'indikator_id' => 42,
                'nama_indikator' => 'Layanan Pengaduan Pelayanan Publik',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Layanan Pengaduan Pelayanan Publik Berbasis Elektronik hanya memberikan layanan informasi terkait pengaduan pelayanan publik.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 1 telah terpenuhi dan Layanan Pengaduan Pelayanan Publik Berbasis Elektronik memberikan layanan interaksi terkait pengaduan pelayanan publik seperti pencarian informasi, pengunggahan dan pengunduhan dokumen.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan proses pembangunan aplikasi SPBE telah dikonsultasikan kepada unit kerja/perangkat daerah yang melaksanakan fungsi pengelolaan TIK di InstKriteria tingkat 2 telah terpenuhi dan Layanan Pengaduan Pelayanan Publik Berbasis Elektronik memberikan layanan transaksi kepada pengguna terkait pengaduan pelayanan publik seperti otomasi alur kerja, transaksi basis data, validasi data, mekanisme persetujuan, dan analitik data.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi dan Layanan Pengaduan Pelayanan Publik Berbasis Elektronik memberikan layanan kolaborasi dengan layanan elektronik lain, misalnya Layanan Kepegawaian Berbasis Elektronik, Layanan Pengaduan Pelayanan Publik Berbasis Elektronik Instansi Pusat/Pemerintah Daerah lain, dan/atau layanan SPBE Instansi Pusat/Pemerintah Daerah lain.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi dan Layanan Pengaduan Pelayanan Publik Berbasis Elektronik telah dilakukan perbaikan berdasarkan hasil reviu dan evaluasi terhadap perubahan lingkungan, peraturan perundang-undangan, teknologi atau kebutuhan Instansi Pusat/Pemerintah Daerah.'
                    ],
                ]
            ],
            // indikator 42
            [
                'indikator_id' => 43,
                'nama_indikator' => 'Layanan Data Terbuka',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Layanan Data Terbuka Berbasis Elektronik hanya memberikan layanan informasi terkait data terbuka.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 1 telah terpenuhi dan Layanan Data Terbuka Berbasis Elektronik memberikan layanan interaksi terkait data terbuka seperti pencarian informasi, pengunggahan dan pengunduhan dokumen.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan Layanan Data Terbuka Berbasis Elektronik memberikan layanan transaksi kepada pengguna terkait data terbuka seperti otomasi pertukaran data, otomasi alur kerja, transaksi basis data, validasi data, mekanisme persetujuan, dan analitik data.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi dan Layanan Data Terbuka Berbasis Elektronik memberikan layanan kolaborasi dengan layanan elektronik lain, misalnya Layanan Data Terbuka Berbasis Elektronik Instansi Pusat/Pemerintah Daerah lain, dan/atau layanan SPBE Instansi Pusat/Pemerintah Daerah lain.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi dan Layanan Data Terbuka Berbasis Elektronik telah dilakukan perbaikan berdasarkan hasil reviu dan evaluasi terhadap perubahan lingkungan, peraturan perundang undangan, teknologi atau kebutuhan Instansi Pusat/Pemerintah Daerah.'
                    ],
                ]
            ],
            // indikator 43
            [
                'indikator_id' => 44,
                'nama_indikator' => 'Layanan Jaringan Dokumentasi dan Informasi Hukum (JDIH)',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Layanan Jaringan Dokumentasi dan Informasi Hukum Berbasis Elektronik hanya memberikan layanan informasi terkait jaringan dokumentasi dan informasi hukum.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 1 telah terpenuhi dan Layanan Jaringan Dokumentasi dan Informasi Hukum Berbasis Elektronik memberikan layanan interaksi terkait jaringan dokumentasi dan informasi hukum seperti pencarian informasi, pengunggahan dan pengunduhan dokumen.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan Layanan Jaringan Dokumentasi dan Informasi Hukum Berbasis Elektronik memberikan layanan transaksi kepada pengguna terkait jaringan dokumentasi dan informasi hukum seperti otomasi alur kerja, transaksi basis data, validasi data, mekanisme persetujuan, dan analitik data.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi dan Layanan Jaringan Dokumentasi dan Informasi Hukum Berbasis Elektronik memberikan layanan kolaborasi dengan layanan elektronik lain, misalnya Layanan Jaringan Dokumentasi dan Informasi Hukum Berbasis Elektronik Instansi Pusat/Pemerintah Daerah lain, dan/atau layanan SPBE Instansi Pusat/Pemerintah Daerah lain.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi dan Layanan Jaringan Dokumentasi dan Informasi Hukum Berbasis Elektronik telah dilakukan perbaikan berdasarkan hasil reviu dan evaluasi terhadap perubahan lingkungan, peraturan perundang-undangan, teknologi atau kebutuhan Instansi Pusat/Pemerintah Daerah.'
                    ],
                ]
            ],
            // indikator 44
            [
                'indikator_id' => 45,
                'nama_indikator' => 'Layanan Publik Sektor 1',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Layanan Publik Sektoral Berbasis Elektronik hanya memberikan layanan informasi terkait Publik Sektoral kegiatan pemerintah.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 1 telah terpenuhi dan Layanan Publik Sektoral Berbasis Elektronik memberikan layanan interaksi terkait Publik Sektoral kegiatan pemerintah seperti pencarian informasi, pengunggahan dan pengunduhan dokumen Layanan Publik Sektoral.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan Layanan Publik Sektoral Berbasis Elektronik memberikan layanan transaksi kepada pengguna terkait Publik Sektoral kegiatan pemerintah seperti otomasi alur kerja, transaksi basis data, validasi data, mekanisme persetujuan, dan analitik data.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi dan Layanan Publik Sektoral Berbasis Elektronik memberikan layanan kolaborasi dengan layanan elektronik lain, misalnya Layanan Publik Sektoral Berbasis Elektronik Instansi Pusat/Pemerintah Daerah lain, dan/atau layanan SPBE Instansi Pusat/Pemerintah Daerah lain.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi dan Layanan Publik Sektoral Berbasis Elektronik telah dilakukan perbaikan berdasarkan hasil reviu dan evaluasi terhadap perubahan lingkungan, peraturan perundang-undangan, teknologi dan kebutuhan Instansi Pusat/Pemerintah Daerah.'
                    ],
                ]
            ],
            // indikator 45
            [
                'indikator_id' => 46,
                'nama_indikator' => 'Layanan Publik Sektor 2',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Layanan Publik Sektoral Berbasis Elektronik hanya memberikan layanan informasi terkait Publik Sektoral kegiatan pemerintah.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 1 telah terpenuhi dan Layanan Publik Sektoral Berbasis Elektronik memberikan layanan interaksi terkait Publik Sektoral kegiatan pemerintah seperti pencarian informasi, pengunggahan dan pengunduhan dokumen Layanan Publik Sektoral.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan Layanan Publik Sektoral Berbasis Elektronik memberikan layanan transaksi kepada pengguna terkait Publik Sektoral kegiatan pemerintah seperti otomasi alur kerja, transaksi basis data, validasi data, mekanisme persetujuan, dan analitik data.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi dan Layanan Publik Sektoral Berbasis Elektronik memberikan layanan kolaborasi dengan layanan elektronik lain, misalnya Layanan Publik Sektoral Berbasis Elektronik Instansi Pusat/Pemerintah Daerah lain, dan/atau layanan SPBE Instansi Pusat/Pemerintah Daerah lain.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi dan Layanan Publik Sektoral Berbasis Elektronik telah dilakukan perbaikan berdasarkan hasil reviu dan evaluasi terhadap perubahan lingkungan, peraturan perundang-undangan, teknologi dan kebutuhan Instansi Pusat/Pemerintah Daerah.'
                    ],
                ]
            ],
            // indikator 46
            [
                'indikator_id' => 47,
                'nama_indikator' => 'Layanan Publik Sektor 3',
                'deskripsi' => [
                    [
                        'tingkat' => 'I',
                        'kriteria_kenaikan_tingkat' => 'Layanan Publik Sektoral Berbasis Elektronik hanya memberikan layanan informasi terkait Publik Sektoral kegiatan pemerintah.'
                    ],
                    [
                        'tingkat' => 'II',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 1 telah terpenuhi dan Layanan Publik Sektoral Berbasis Elektronik memberikan layanan interaksi terkait Publik Sektoral kegiatan pemerintah seperti pencarian informasi, pengunggahan dan pengunduhan dokumen Layanan Publik Sektoral.'
                    ],
                    [
                        'tingkat' => 'III',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 2 telah terpenuhi dan Layanan Publik Sektoral Berbasis Elektronik memberikan layanan transaksi kepada pengguna terkait Publik Sektoral kegiatan pemerintah seperti otomasi alur kerja, transaksi basis data, validasi data, mekanisme persetujuan, dan analitik data.'
                    ],
                    [
                        'tingkat' => 'IV',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 3 telah terpenuhi dan Layanan Publik Sektoral Berbasis Elektronik memberikan layanan kolaborasi dengan layanan elektronik lain, misalnya Layanan Publik Sektoral Berbasis Elektronik Instansi Pusat/Pemerintah Daerah lain, dan/atau layanan SPBE Instansi Pusat/Pemerintah Daerah lain.'
                    ],
                    [
                        'tingkat' => 'V',
                        'kriteria_kenaikan_tingkat' => 'Kriteria tingkat 4 telah terpenuhi dan Layanan Publik Sektoral Berbasis Elektronik telah dilakukan perbaikan berdasarkan hasil reviu dan evaluasi terhadap perubahan lingkungan, peraturan perundang-undangan, teknologi dan kebutuhan Instansi Pusat/Pemerintah Daerah.'
                    ],
                ]
            ],
        ];

        return  $data;
    }
}
