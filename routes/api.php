<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LaporanKegiatanController;
use App\Http\Controllers\Api\BeritaController;
use App\Http\Controllers\Api\GaleriController;
use App\Http\Controllers\Api\AgendaApiController;

// ============================================
// PUBLIC ROUTES
// ============================================

Route::post('/login', [AuthController::class, 'login']);

// ============================================
// 🔥🔥🔥 ROUTE KHUSUS - HARUS DI ATAS {slug}!
// ============================================
Route::get('/berita/kecamatan-teraktif', [BeritaController::class, 'kecamatanTeraktif']);

// ============================================
// BERITA
// ============================================
Route::get('/berita', [BeritaController::class, 'index']);
Route::get('/berita/latest', [BeritaController::class, 'latest']);
Route::get('/berita/{slug}', [BeritaController::class, 'show']);  // 🔥 DI BAWAH!
Route::get('/berita/kecamatan/list', [BeritaController::class, 'getKecamatan']);
Route::get('/berita/kategori/{kategori}', [BeritaController::class, 'byKategori']);
Route::get('/berita/kecamatan/{kecamatan}', [BeritaController::class, 'byKecamatan']);

// ============================================
// GALERI
// ============================================
Route::get('/galeri', [GaleriController::class, 'index']);
Route::get('/galeri/{id}', [GaleriController::class, 'show']);

// ============================================
// AGENDA
// ============================================
Route::get('/agenda', [AgendaApiController::class, 'index']);
Route::get('/agenda/{id}', [AgendaApiController::class, 'show']);
Route::get('/agenda/calendar', [AgendaApiController::class, 'calendar']);

// ============================================
// PROTECTED ROUTES
// ============================================
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::post('/laporan-kegiatan', [LaporanKegiatanController::class, 'store']);
    Route::get('/laporan-kegiatan', [LaporanKegiatanController::class, 'index']);
    Route::get('/laporan-kegiatan/{laporan_kegiatan}', [LaporanKegiatanController::class, 'show']);
    Route::delete('/laporan-kegiatan/{laporan_kegiatan}', [LaporanKegiatanController::class, 'destroy']);
});
