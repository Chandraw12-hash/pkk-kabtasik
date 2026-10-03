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

// ============================================
// PUBLIC ROUTES (TANPA AUTH)
// ============================================

Route::post('/login', [AuthController::class, 'login']);

// ─── LAPORAN KEGIATAN (PUBLIC) ────────────────────────────────
// ⚠️ PENTING: Route SPESIFIK didaftarkan DULU, baru wildcard {id}
Route::get('/laporan-kegiatan', [LaporanKegiatanController::class, 'index']);

// ✅ FIX: Route my-laporan & saya di ATAS — sebelum {id}
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/laporan-kegiatan/saya', [LaporanKegiatanController::class, 'myLaporan']);
    Route::get('/laporan-kegiatan/my-laporan', [LaporanKegiatanController::class, 'myLaporan']);
});

// ❌ Route {id} di BAWAH — biar ga "makan" route spesifik
Route::get('/laporan-kegiatan/{id}', [LaporanKegiatanController::class, 'show']);

// ─── BERITA (PUBLIC) ──────────────────────────────────────────
Route::get('/berita/kecamatan-teraktif', [BeritaController::class, 'kecamatanTeraktif']);
Route::get('/berita/kecamatan/list', [BeritaController::class, 'getKecamatan']);
Route::get('/berita', [BeritaController::class, 'index']);
Route::get('/berita/latest', [BeritaController::class, 'latest']);
Route::get('/berita/kategori/{kategori}', [BeritaController::class, 'byKategori']);
Route::get('/berita/kecamatan/{kecamatan}', [BeritaController::class, 'byKecamatan']);
Route::get('/berita/{slug}', [BeritaController::class, 'show']);

// ─── GALERI (PUBLIC) ──────────────────────────────────────────
Route::get('/galeri', [GaleriController::class, 'index']);
Route::get('/galeri/{id}', [GaleriController::class, 'show']);

// ─── AGENDA (PUBLIC) ──────────────────────────────────────────
Route::get('/agenda', [AgendaApiController::class, 'index']);
Route::get('/agenda/calendar', [AgendaApiController::class, 'calendar']);
Route::get('/agenda/{id}', [AgendaApiController::class, 'show']);

// ✅ TAMBAH — DATA UMUM PKK (PUBLIC)
Route::get('/data-umum-pkk/rekap', [DataUmumPkkApiController::class, 'rekap']);
Route::get('/data-umum-pkk', [DataUmumPkkApiController::class, 'index']);
Route::get('/data-umum-pkk/{id}', [DataUmumPkkApiController::class, 'show']);

// ✅ TAMBAH — REKAP KEGIATAN WARGA (PUBLIC)
Route::get('/rekap-kegiatan-warga/rekap', [RekapKegiatanWargaApiController::class, 'rekap']);
Route::get('/rekap-kegiatan-warga', [RekapKegiatanWargaApiController::class, 'index']);
Route::get('/rekap-kegiatan-warga/{id}', [RekapKegiatanWargaApiController::class, 'show']);

// ✅ TAMBAH — REKAP BUMIL (PUBLIC)
Route::get('/rekap-bumil/rekap', [RekapBumilApiController::class, 'rekap']);
Route::get('/rekap-bumil', [RekapBumilApiController::class, 'index']);
Route::get('/rekap-bumil/{id}', [RekapBumilApiController::class, 'show']);

// ============================================
// PROTECTED ROUTES (BUTUH AUTH)
// ============================================
Route::middleware('auth:sanctum')->group(function () {

    // ─── AUTH ─────────────────────────────────────────────────
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

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

// ============================================
// TEST ROUTE
// ============================================
Route::get('/test-routes', function () {
    $routes = [];
    foreach (Route::getRoutes() as $route) {
        if (str_contains($route->uri(), 'laporan')) {
            $routes[] = [
                'method' => implode('|', $route->methods()),
                'uri' => $route->uri(),
                'name' => $route->getName(),
            ];
        }
    }
    return response()->json($routes);
});
