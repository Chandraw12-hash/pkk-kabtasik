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

// ============================================
// 🔥🔥🔥 ROUTE KHUSUS - HARUS DI ATAS {slug}!
// ============================================
Route::get('/berita/kecamatan-teraktif', [BeritaController::class, 'kecamatanTeraktif']);
Route::get('/berita/kecamatan/list', [BeritaController::class, 'getKecamatan']); // 🔥 PINDAH KE SINI

// ============================================
// BERITA - PUBLIC
// ============================================
Route::get('/berita', [BeritaController::class, 'index']);
Route::get('/berita/latest', [BeritaController::class, 'latest']);
Route::get('/berita/kategori/{kategori}', [BeritaController::class, 'byKategori']);
Route::get('/berita/kecamatan/{kecamatan}', [BeritaController::class, 'byKecamatan']);
Route::get('/berita/{slug}', [BeritaController::class, 'show']); // 🔥 SLUG HARUS DI BAWAH!

// ============================================
// GALERI - PUBLIC
// ============================================
Route::get('/galeri', [GaleriController::class, 'index']);
Route::get('/galeri/{id}', [GaleriController::class, 'show']);

// ============================================
// AGENDA - PUBLIC
// ============================================
Route::get('/agenda', [AgendaApiController::class, 'index']);
Route::get('/agenda/{id}', [AgendaApiController::class, 'show']);
Route::get('/agenda/calendar', [AgendaApiController::class, 'calendar']);

// ============================================
// 🔥 PROTECTED ROUTES (BUTUH AUTH)
// ============================================
Route::middleware('auth:sanctum')->group(function () {
    // ===== AUTH =====
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // ===== LAPORAN KEGIATAN =====
    Route::post('/laporan-kegiatan', [LaporanKegiatanController::class, 'store']);
    Route::get('/laporan-kegiatan', [LaporanKegiatanController::class, 'index']);
    Route::get('/laporan-kegiatan/{laporan_kegiatan}', [LaporanKegiatanController::class, 'show']);
    Route::delete('/laporan-kegiatan/{laporan_kegiatan}', [LaporanKegiatanController::class, 'destroy']);

    // ============================================
    // 🔥🔥🔥 MOBILE - BERITA CRUD
    // ============================================
    Route::post('/berita', [BeritaController::class, 'store']);                    // Submit berita
    Route::get('/berita/saya', [BeritaController::class, 'myBerita']);             // Lihat berita sendiri
    Route::get('/berita/saya/{id}', [BeritaController::class, 'showMyBerita']);    // Detail berita sendiri
    Route::put('/berita/saya/{id}', [BeritaController::class, 'update']);          // Update berita sendiri
    Route::delete('/berita/saya/{id}', [BeritaController::class, 'destroy']);      // Hapus berita sendiri

    // ============================================
    // 🔥🔥🔥 ADMIN - APPROVE/REJECT BERITA
    // ============================================
    Route::get('/admin/berita/pending', [BeritaController::class, 'pending']);
    Route::put('/admin/berita/{id}/approve', [BeritaController::class, 'approve']);
    Route::put('/admin/berita/{id}/reject', [BeritaController::class, 'reject']);
});

// ============================================
// 🔥🔥🔥 TEST ROUTE - CEK APAKAH ROUTE TERDAFTAR
// ============================================
Route::get('/test-routes', function () {
    $routes = [];
    foreach (Route::getRoutes() as $route) {
        if (str_contains($route->uri(), 'berita')) {
            $routes[] = [
                'method' => implode('|', $route->methods()),
                'uri' => $route->uri(),
                'name' => $route->getName(),
            ];
        }
    }
    return response()->json($routes);
});
