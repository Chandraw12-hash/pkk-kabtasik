<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LaporanKegiatanController;
use App\Http\Controllers\Api\BeritaController;
use App\Http\Controllers\Api\GaleriController;
use App\Http\Controllers\Api\AgendaApiController;

// ✅ TAMBAH — 3 Controller Baru
use App\Http\Controllers\Api\DataUmumPkkApiController;
use App\Http\Controllers\Api\RekapKegiatanWargaApiController;
use App\Http\Controllers\Api\RekapBumilApiController;
use App\Http\Controllers\Api\DasawismaDaftarWargaController;
use App\Http\Controllers\Api\DasawismaBumilController;
use App\Http\Controllers\Api\DasawismaCatatanKeluargaController;
use App\Http\Controllers\Api\DasawismaIndustriRumahTanggaController;
use App\Http\Controllers\Api\DasawismaKegiatanWargaController;
use App\Http\Controllers\Api\DasawismaPemanfaatanPekaranganController;
use App\Http\Controllers\Api\WilayahController;
use App\Http\Controllers\Api\NotifikasiController;

// ─── WILAYAH (PUBLIC — master dropdown kecamatan → desa mobile) ───
Route::middleware('throttle:60,1')->group(function () {
    Route::get('/wilayah/kecamatan', [WilayahController::class, 'kecamatan']);
    Route::get('/wilayah/desa', [WilayahController::class, 'desa']);
});

// ============================================
// PUBLIC ROUTES (TANPA AUTH)
// ============================================

Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

// ─── LAPORAN KEGIATAN (PUBLIC) ────────────────────────────────
// ⚠️ PENTING: Route SPESIFIK didaftarkan DULU, baru wildcard {id}
// 🔒 Throttle 60/menit: endpoint publik rawan scraping/brute-force enumerasi.
Route::middleware('throttle:60,1')->group(function () {
    Route::get('/laporan-kegiatan', [LaporanKegiatanController::class, 'index']);
});

// ✅ FIX: Route my-laporan & saya di ATAS — sebelum {id}
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/laporan-kegiatan/saya', [LaporanKegiatanController::class, 'myLaporan']);
    Route::get('/laporan-kegiatan/my-laporan', [LaporanKegiatanController::class, 'myLaporan']);
});

// ❌ Route {id} di BAWAH — biar ga "makan" route spesifik
Route::get('/laporan-kegiatan/{id}', [LaporanKegiatanController::class, 'show'])->middleware('throttle:60,1');

// ─── BERITA (PUBLIC) ──────────────────────────────────────────
Route::middleware('throttle:60,1')->group(function () {
    Route::get('/berita/kecamatan-teraktif', [BeritaController::class, 'kecamatanTeraktif']);
    Route::get('/berita/kecamatan/list', [BeritaController::class, 'getKecamatan']);
    Route::get('/berita', [BeritaController::class, 'index']);
    Route::get('/berita/latest', [BeritaController::class, 'latest']);
    Route::get('/berita/kategori/{kategori}', [BeritaController::class, 'byKategori']);
    Route::get('/berita/kecamatan/{kecamatan}', [BeritaController::class, 'byKecamatan']);
    Route::get('/berita/{slug}', [BeritaController::class, 'show']);
});

// ─── GALERI (PUBLIC) ──────────────────────────────────────────
Route::middleware('throttle:60,1')->group(function () {
    Route::get('/galeri', [GaleriController::class, 'index']);
    Route::get('/galeri/{id}', [GaleriController::class, 'show']);
});

// ─── AGENDA (PUBLIC) ──────────────────────────────────────────
Route::middleware('throttle:60,1')->group(function () {
    Route::get('/agenda', [AgendaApiController::class, 'index']);
    Route::get('/agenda/calendar', [AgendaApiController::class, 'calendar']);
    Route::get('/agenda/{id}', [AgendaApiController::class, 'show']);
});

// ✅ TAMBAH — DATA UMUM PKK (PUBLIC)
Route::middleware('throttle:60,1')->group(function () {
    Route::get('/data-umum-pkk/rekap', [DataUmumPkkApiController::class, 'rekap']);
    Route::get('/data-umum-pkk', [DataUmumPkkApiController::class, 'index']);
    Route::get('/data-umum-pkk/{id}', [DataUmumPkkApiController::class, 'show']);
});

// ✅ TAMBAH — REKAP KEGIATAN WARGA (PUBLIC)
Route::middleware('throttle:60,1')->group(function () {
    Route::get('/rekap-kegiatan-warga/rekap', [RekapKegiatanWargaApiController::class, 'rekap']);
    Route::get('/rekap-kegiatan-warga', [RekapKegiatanWargaApiController::class, 'index']);
    Route::get('/rekap-kegiatan-warga/{id}', [RekapKegiatanWargaApiController::class, 'show']);
});

// ✅ TAMBAH — REKAP BUMIL (PUBLIC)
Route::middleware('throttle:60,1')->group(function () {
    Route::get('/rekap-bumil/rekap', [RekapBumilApiController::class, 'rekap']);
    Route::get('/rekap-bumil', [RekapBumilApiController::class, 'index']);
    Route::get('/rekap-bumil/{id}', [RekapBumilApiController::class, 'show']);
});

// ============================================
// PROTECTED ROUTES (BUTUH AUTH)
// ============================================
Route::middleware('auth:sanctum')->group(function () {

    // ─── AUTH ─────────────────────────────────────────────────
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    Route::get('/dasawisma/daftar-warga', [DasawismaDaftarWargaController::class, 'index']);
    Route::post('/dasawisma/daftar-warga', [DasawismaDaftarWargaController::class, 'store']);
    Route::put('/dasawisma/daftar-warga/{id}', [DasawismaDaftarWargaController::class, 'update'])
        ->whereNumber('id');
    Route::delete('/dasawisma/daftar-warga/{id}', [DasawismaDaftarWargaController::class, 'destroy'])
        ->whereNumber('id');

    // ─── BUMIL PER IBU (DASAWISMA — alur sama seperti daftar-warga) ──
    Route::get('/dasawisma/bumil', [DasawismaBumilController::class, 'index']);
    Route::post('/dasawisma/bumil', [DasawismaBumilController::class, 'store']);
    Route::get('/dasawisma/bumil/{id}', [DasawismaBumilController::class, 'show'])
        ->whereNumber('id');
    Route::put('/dasawisma/bumil/{id}', [DasawismaBumilController::class, 'update'])
        ->whereNumber('id');
    Route::delete('/dasawisma/bumil/{id}', [DasawismaBumilController::class, 'destroy'])
        ->whereNumber('id');

    // ─── KEGIATAN WARGA (DASAWISMA — alur sama seperti daftar-warga) ──
    Route::get('/dasawisma/kegiatan-warga', [DasawismaKegiatanWargaController::class, 'index']);
    Route::post('/dasawisma/kegiatan-warga', [DasawismaKegiatanWargaController::class, 'store']);
    Route::get('/dasawisma/kegiatan-warga/{id}', [DasawismaKegiatanWargaController::class, 'show'])
        ->whereNumber('id');
    Route::put('/dasawisma/kegiatan-warga/{id}', [DasawismaKegiatanWargaController::class, 'update'])
        ->whereNumber('id');
    Route::delete('/dasawisma/kegiatan-warga/{id}', [DasawismaKegiatanWargaController::class, 'destroy'])
        ->whereNumber('id');

    // ─── CATATAN KELUARGA (DASAWISMA — alur sama seperti daftar-warga) ──
    Route::get('/dasawisma/catatan-keluarga', [DasawismaCatatanKeluargaController::class, 'index']);
    Route::post('/dasawisma/catatan-keluarga', [DasawismaCatatanKeluargaController::class, 'store']);
    Route::get('/dasawisma/catatan-keluarga/{id}', [DasawismaCatatanKeluargaController::class, 'show'])
        ->whereNumber('id');
    Route::put('/dasawisma/catatan-keluarga/{id}', [DasawismaCatatanKeluargaController::class, 'update'])
        ->whereNumber('id');
    Route::delete('/dasawisma/catatan-keluarga/{id}', [DasawismaCatatanKeluargaController::class, 'destroy'])
        ->whereNumber('id');

    // ─── PEMANFAATAN PEKARANGAN (DASAWISMA — alur sama seperti daftar-warga) ──
    Route::get('/dasawisma/pemanfaatan-pekarangan', [DasawismaPemanfaatanPekaranganController::class, 'index']);
    Route::post('/dasawisma/pemanfaatan-pekarangan', [DasawismaPemanfaatanPekaranganController::class, 'store']);
    Route::get('/dasawisma/pemanfaatan-pekarangan/{id}', [DasawismaPemanfaatanPekaranganController::class, 'show'])
        ->whereNumber('id');
    Route::put('/dasawisma/pemanfaatan-pekarangan/{id}', [DasawismaPemanfaatanPekaranganController::class, 'update'])
        ->whereNumber('id');
    Route::delete('/dasawisma/pemanfaatan-pekarangan/{id}', [DasawismaPemanfaatanPekaranganController::class, 'destroy'])
        ->whereNumber('id');

    // ─── INDUSTRI RUMAH TANGGA (DASAWISMA — alur sama seperti daftar-warga) ──
    Route::get('/dasawisma/industri-rumah-tangga', [DasawismaIndustriRumahTanggaController::class, 'index']);
    Route::post('/dasawisma/industri-rumah-tangga', [DasawismaIndustriRumahTanggaController::class, 'store']);
    Route::get('/dasawisma/industri-rumah-tangga/{id}', [DasawismaIndustriRumahTanggaController::class, 'show'])
        ->whereNumber('id');
    Route::put('/dasawisma/industri-rumah-tangga/{id}', [DasawismaIndustriRumahTanggaController::class, 'update'])
        ->whereNumber('id');
    Route::delete('/dasawisma/industri-rumah-tangga/{id}', [DasawismaIndustriRumahTanggaController::class, 'destroy'])
        ->whereNumber('id');

    // ─── LAPORAN KEGIATAN (CRUD) ──────────────────────────────
    // ⚠️ Route SPESIFIK DULU
    Route::get('/laporan-kegiatan/saya', [LaporanKegiatanController::class, 'myLaporan']);
    Route::get('/laporan-kegiatan/my-laporan', [LaporanKegiatanController::class, 'myLaporan']);
    Route::get('/admin/laporan-kegiatan', [LaporanKegiatanController::class, 'adminIndex']);

    Route::post('/laporan-kegiatan', [LaporanKegiatanController::class, 'store']);
    Route::put('/laporan-kegiatan/{id}/approve', [LaporanKegiatanController::class, 'approve']);
    Route::put('/laporan-kegiatan/{id}/reject', [LaporanKegiatanController::class, 'reject']);
    Route::put('/laporan-kegiatan/{id}', [LaporanKegiatanController::class, 'update']);
    Route::delete('/laporan-kegiatan/{id}', [LaporanKegiatanController::class, 'destroy']);

    // ─── NOTIFIKASI (LONCENG HP — agenda baru dari kabupaten) ───
    Route::get('/notifikasi', [NotifikasiController::class, 'index']);
    Route::get('/notifikasi/unread-count', [NotifikasiController::class, 'unreadCount']);
    Route::post('/notifikasi/baca-semua', [NotifikasiController::class, 'bacaSemua']);
    Route::post('/notifikasi/{id}/baca', [NotifikasiController::class, 'tandaiBaca']);

    // ─── BERITA (MOBILE) ──────────────────────────────────────
    Route::post('/berita', [BeritaController::class, 'store']);
    Route::get('/my-berita', [BeritaController::class, 'myBerita']);
    Route::get('/my-berita/{id}', [BeritaController::class, 'showMyBerita']);
    Route::put('/my-berita/{id}', [BeritaController::class, 'update']);
    Route::delete('/my-berita/{id}', [BeritaController::class, 'destroy']);

    // ─── BERITA (ADMIN APPROVE/REJECT) ────────────────────────
    Route::get('/admin/berita/pending', [BeritaController::class, 'pending']);
    Route::put('/admin/berita/{id}/approve', [BeritaController::class, 'approve']);
    Route::put('/admin/berita/{id}/reject', [BeritaController::class, 'reject']);

    // ✅ TAMBAH — DATA UMUM PKK (CRUD)
    Route::post('/data-umum-pkk', [DataUmumPkkApiController::class, 'store']);
    Route::put('/data-umum-pkk/{id}', [DataUmumPkkApiController::class, 'update']);
    Route::delete('/data-umum-pkk/{id}', [DataUmumPkkApiController::class, 'destroy']);

    // ✅ TAMBAH — REKAP KEGIATAN WARGA (CRUD)
    Route::post('/rekap-kegiatan-warga', [RekapKegiatanWargaApiController::class, 'store']);
    Route::put('/rekap-kegiatan-warga/{id}', [RekapKegiatanWargaApiController::class, 'update']);
    Route::delete('/rekap-kegiatan-warga/{id}', [RekapKegiatanWargaApiController::class, 'destroy']);

    // ✅ TAMBAH — REKAP BUMIL (CRUD)
    Route::post('/rekap-bumil', [RekapBumilApiController::class, 'store']);
    Route::put('/rekap-bumil/{id}', [RekapBumilApiController::class, 'update']);
    Route::delete('/rekap-bumil/{id}', [RekapBumilApiController::class, 'destroy']);
});
