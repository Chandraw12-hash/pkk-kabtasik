<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LaporanKegiatanController;
use App\Http\Controllers\Api\BeritaController;
use App\Http\Controllers\Api\GaleriController;
use App\Http\Controllers\Api\AgendaApiController;

// ============================================
// PUBLIC ROUTES (TANPA AUTH)
// ============================================

Route::post('/login', [AuthController::class, 'login']);

// ─── LAPORAN KEGIATAN (PUBLIC) ────────────────────────────────────────────
// 🔥 PINDAHKAN KE PUBLIC BIAR BISA DILIHAT SEMUA ORANG
Route::get('/laporan-kegiatan', [LaporanKegiatanController::class, 'index']);
Route::get('/laporan-kegiatan/{id}', [LaporanKegiatanController::class, 'show']);

// ─── BERITA (PUBLIC) ──────────────────────────────────────────────────────
Route::get('/berita/kecamatan-teraktif', [BeritaController::class, 'kecamatanTeraktif']);
Route::get('/berita/kecamatan/list', [BeritaController::class, 'getKecamatan']);
Route::get('/berita', [BeritaController::class, 'index']);
Route::get('/berita/latest', [BeritaController::class, 'latest']);
Route::get('/berita/kategori/{kategori}', [BeritaController::class, 'byKategori']);
Route::get('/berita/kecamatan/{kecamatan}', [BeritaController::class, 'byKecamatan']);
Route::get('/berita/{slug}', [BeritaController::class, 'show']);

// ─── GALERI (PUBLIC) ──────────────────────────────────────────────────────
Route::get('/galeri', [GaleriController::class, 'index']);
Route::get('/galeri/{id}', [GaleriController::class, 'show']);

// ─── AGENDA (PUBLIC) ──────────────────────────────────────────────────────
Route::get('/agenda', [AgendaApiController::class, 'index']);
Route::get('/agenda/{id}', [AgendaApiController::class, 'show']);
Route::get('/agenda/calendar', [AgendaApiController::class, 'calendar']);

// ============================================
// PROTECTED ROUTES (BUTUH AUTH)
// ============================================
Route::middleware('auth:sanctum')->group(function () {

    // ─── AUTH ──────────────────────────────────────────────────────────────
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // ─── LAPORAN KEGIATAN (CRUD) ──────────────────────────────────────────
    // 🔥 STORE, UPDATE, DELETE HARUS AUTH
    Route::post('/laporan-kegiatan', [LaporanKegiatanController::class, 'store']);
    Route::put('/laporan-kegiatan/{id}', [LaporanKegiatanController::class, 'update']);
    Route::delete('/laporan-kegiatan/{id}', [LaporanKegiatanController::class, 'destroy']);
    Route::get('/laporan-kegiatan/saya', [LaporanKegiatanController::class, 'myLaporan']);

    // ─── BERITA (MOBILE CRUD) ─────────────────────────────────────────────
    Route::post('/berita', [BeritaController::class, 'store']);
    Route::get('/berita/saya', [BeritaController::class, 'myBerita']);
    Route::get('/berita/saya/{id}', [BeritaController::class, 'showMyBerita']);
    Route::put('/berita/saya/{id}', [BeritaController::class, 'update']);
    Route::delete('/berita/saya/{id}', [BeritaController::class, 'destroy']);

    // ─── BERITA (ADMIN APPROVE/REJECT) ────────────────────────────────────
    Route::get('/admin/berita/pending', [BeritaController::class, 'pending']);
    Route::put('/admin/berita/{id}/approve', [BeritaController::class, 'approve']);
    Route::put('/admin/berita/{id}/reject', [BeritaController::class, 'reject']);
});

// ============================================
// TEST ROUTE
// ============================================
Route::get('/test-routes', function () {
    $routes = [];
    foreach (Route::getRoutes() as $route) {
        if (str_contains($route->uri(), 'berita') || str_contains($route->uri(), 'laporan')) {
            $routes[] = [
                'method' => implode('|', $route->methods()),
                'uri' => $route->uri(),
                'name' => $route->getName(),
            ];
        }
    }
    return response()->json($routes);
});
