<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LaporanKegiatanController;
use App\Http\Controllers\Api\BeritaController;
use App\Http\Controllers\Api\GaleriController;
use App\Http\Controllers\Api\AgendaApiController;

/*
|--------------------------------------------------------------------------
| API Routes - Mobile PKK Kabupaten Tasikmalaya
|--------------------------------------------------------------------------
|
| Base URL: http://localhost:8000/api
|
*/

// ============================================
// PUBLIC ROUTES (Tidak perlu token)
// ============================================

// Login
Route::post('/login', [AuthController::class, 'login']);

// ============================================
// BERITA (Read-only, publik) - SUPPORT KECAMATAN
// ============================================
Route::get('/berita', [BeritaController::class, 'index']);
Route::get('/berita/latest', [BeritaController::class, 'latest']);
Route::get('/berita/{slug}', [BeritaController::class, 'show']);
Route::get('/berita/kecamatan/list', [BeritaController::class, 'getKecamatan']);
Route::get('/berita/kategori/{kategori}', [BeritaController::class, 'byKategori']);
Route::get('/berita/kecamatan/{kecamatan}', [BeritaController::class, 'byKecamatan']);

// ============================================
// GALERI (Read-only, publik)
// ============================================
Route::get('/galeri', [GaleriController::class, 'index']);
Route::get('/galeri/{id}', [GaleriController::class, 'show']);

// ============================================
// AGENDA (Read-only, publik)
// ============================================
Route::get('/agenda', [AgendaApiController::class, 'index']);
Route::get('/agenda/{id}', [AgendaApiController::class, 'show']);
Route::get('/agenda/calendar', [AgendaApiController::class, 'calendar']);

// ============================================
// PROTECTED ROUTES (Harus login + token)
// ============================================
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Laporan Kegiatan (CRUD untuk kader)
    // Kader cuma bisa lihat/kirim laporan miliknya sendiri
    Route::post('/laporan-kegiatan', [LaporanKegiatanController::class, 'store']);
    Route::get('/laporan-kegiatan', [LaporanKegiatanController::class, 'index']);
    Route::get('/laporan-kegiatan/{laporan_kegiatan}', [LaporanKegiatanController::class, 'show']);
    Route::delete('/laporan-kegiatan/{laporan_kegiatan}', [LaporanKegiatanController::class, 'destroy']);
});
