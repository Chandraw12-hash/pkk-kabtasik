<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Backend\UserController;
use App\Http\Controllers\Backend\RoleController;
use App\Http\Controllers\Backend\ConfigController;
use App\Http\Controllers\Frontend\IndexController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Backend\IndikatorController;
use App\Http\Controllers\Backend\EvidenController;
use App\Http\Controllers\Backend\DashboardController;
use App\Http\Controllers\Backend\KaderController;
use App\Http\Controllers\Backend\Api\ApiEvidenceController;

// ============================================
// FRONTEND ROUTES (Public)
// ============================================
Route::as('fe.')->group(function () {
    Route::get('/', [IndexController::class, 'index'])->name('beranda');
    Route::get('/profil/sejarah', [IndexController::class, 'sejarah'])->name('profil.sejarah');
    Route::get('/profil/tugas-fungsi', [IndexController::class, 'tugasFungsi'])->name('profil.tugasFungsi');
    Route::get('/profil/visi-misi', [IndexController::class, 'visiMisi'])->name('profil.visiMisi');
    Route::get('/profil/struktur-organisasi', [IndexController::class, 'strukturOrganisasi'])->name('profil.strukturOrganisasi');
    Route::get('/profil/ketentuan-seragam', [IndexController::class, 'ketentuanSeragam'])->name('profil.ketentuanSeragam');
    Route::get('/program/program-kerja', [IndexController::class, 'programKerja'])->name('program.programKerja');
    Route::get('/program/galeri-kegiatan', [IndexController::class, 'galeriKegiatan'])->name('program.galeriKegiatan');
    Route::get('/program/mars-pkk', [IndexController::class, 'marsPkk'])->name('program.marsPkk');
    Route::get('/program/dokumen', [IndexController::class, 'dokumen'])->name('program.dokumen');
    Route::get('/berita', [IndexController::class, 'berita'])->name('berita');
});

// ============================================
// AUTH ROUTES
// ============================================
Route::middleware('guest')->group(function () {
    Route::get('login', [LoginController::class, 'create'])->name('login');
    Route::post('login', [LoginController::class, 'store'])->middleware('throttle:5,1');
});

Route::post('/logout', [LoginController::class, 'destroy'])->name('logout')->middleware('auth');

// ============================================
// BACKEND ROUTES (Protected with Auth)
// ============================================
Route::middleware(['auth'])->prefix('dashboard')->name('be.')->group(function () {

    // ============================================
    // DASHBOARD
    // ============================================
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // ============================================
    // MASTER DATA - KADER PKK
    // ============================================
    Route::resource('kader', KaderController::class)
        ->names('kader')
        ->except(['show']);

    // ============================================
    // MASTER DATA - EVIDEN (SPBE - DIKOMENTAR DULU)
    // ============================================
    /*
    Route::resource('eviden', EvidenController::class)
        ->names('eviden')
        ->except(['show']);

    Route::get('/eviden/file/{id}/download', [EvidenController::class, 'downloadFile'])->name('eviden.file.download');
    Route::delete('/eviden/file/{id}', [EvidenController::class, 'deleteFile'])->name('eviden.file.delete');
    */

    // ============================================
    // MASTER DATA - INDIKATOR (SPBE - DIKOMENTAR DULU)
    // ============================================
    /*
    Route::get('indikator/export', [IndikatorController::class, 'export'])->name('indikator.export');
    Route::post('indikator/import', [IndikatorController::class, 'import'])->name('indikator.import');
    Route::resource('indikator', IndikatorController::class)
        ->names('indikator')
        ->except(['show', 'create', 'edit']);

    // API Internal Routes
    Route::get('/api/indikator/{id}/detail', [ApiEvidenceController::class, 'getIndikatorDetail'])
        ->name('api.indikator.detail');
    */

    // ============================================
    // USER MANAGEMENT
    // ============================================
    Route::resource('users', UserController::class)
        ->names('users')
        ->except(['show']);

    Route::resource('roles', RoleController::class)
        ->names('roles')
        ->except(['show']);

    // ============================================
    // SETTINGS
    // ============================================
    Route::prefix('settings')->name('settings.')->group(function () {

        // Profile Settings (Admin only)
        Route::middleware('role:admin')->group(function () {
            Route::get('/profile', [ConfigController::class, 'profile'])->name('profile');
            Route::patch('/profile', [ConfigController::class, 'updateProfile'])->name('profile.update');
            Route::put('/password', [ConfigController::class, 'updatePassword'])->name('password.update');
        });

        // App Settings (Admin only)
        Route::middleware('role:admin')->group(function () {
            Route::get('/app', [ConfigController::class, 'app'])->name('app');
            Route::post('/app', [ConfigController::class, 'updateApp'])->name('app.update');
        });
    });

});
