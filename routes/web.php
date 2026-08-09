<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Backend\UserController;
use App\Http\Controllers\Backend\RoleController;
use App\Http\Controllers\Backend\ConfigController;
use App\Http\Controllers\Frontend\IndexController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Backend\DashboardController;
use App\Http\Controllers\Backend\KaderController;
use App\Http\Controllers\Backend\GaleriController;
use App\Http\Controllers\Backend\BeritaController;

// Controller Sekretariat & Pokja yang Terpisah
use App\Http\Controllers\Backend\SekretariatController;
use App\Http\Controllers\Backend\Pokja1Controller;
use App\Http\Controllers\Backend\Pokja2Controller;
use App\Http\Controllers\Backend\Pokja3Controller;
use App\Http\Controllers\Backend\Pokja4Controller;

// ============================================
// FRONTEND ROUTES (Public)
// ============================================
Route::as('fe.')->group(function () {
    Route::get('/', [IndexController::class, 'index'])->name('beranda');

    // Profil
    Route::get('/profil/sejarah', [IndexController::class, 'sejarah'])->name('profil.sejarah');
    Route::get('/profil/tugas-fungsi', [IndexController::class, 'tugasFungsi'])->name('profil.tugasFungsi');
    Route::get('/profil/visi-misi', [IndexController::class, 'visiMisi'])->name('profil.visiMisi');
    Route::get('/profil/struktur-organisasi', [IndexController::class, 'strukturOrganisasi'])->name('profil.strukturOrganisasi');
    Route::get('/profil/ketentuan-seragam', [IndexController::class, 'ketentuanSeragam'])->name('profil.ketentuanSeragam');

    // Program
    Route::get('/program/program-kerja', [IndexController::class, 'programKerja'])->name('program.programKerja');
    Route::get('/program/galeri-kegiatan', [IndexController::class, 'galeriKegiatan'])->name('program.galeriKegiatan');
    Route::get('/program/mars-pkk', [IndexController::class, 'marsPkk'])->name('program.marsPkk');
    Route::get('/program/dokumen', [IndexController::class, 'dokumen'])->name('program.dokumen');

    // ============= FIX UNTUK BERITA =============
    // CUKUP 1 ROUTE INI SAJA. HAPUS ROUTE DETAIL {slug}.
    // Jika di Index.tsx kamu menggunakan sistem modal/state, route ini sudah cukup.
    Route::get('/berita', [BeritaController::class, 'indexPublic'])->name('berita');
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
    // MANAJEMEN SEKRETARIAT & POKJA (TERPISAH)
    // ============================================
    Route::resource('sekretariat', SekretariatController::class)->names('sekretariat')->except(['show']);
    Route::resource('pokja1', Pokja1Controller::class)->names('pokja1')->except(['show']);
    Route::resource('pokja2', Pokja2Controller::class)->names('pokja2')->except(['show']);
    Route::resource('pokja3', Pokja3Controller::class)->names('pokja3')->except(['show']);
    Route::resource('pokja4', Pokja4Controller::class)->names('pokja4')->except(['show']);

    // ============================================
    // MANAJEMEN KONTEN (Galeri & Berita)
    // ============================================

    // Galeri
    Route::resource('galeri', GaleriController::class)
        ->names('galeri')
        ->except(['show']);

    // Berita (Backend tetap full CRUD)
    Route::resource('berita', BeritaController::class)
        ->names('berita')
        ->parameters(['berita' => 'berita']);

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
