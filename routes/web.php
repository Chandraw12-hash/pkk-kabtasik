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

// Controller Sekretariat & Pokja
use App\Http\Controllers\Backend\DataUmumSekretariatController;
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

    // Program & Data Publik
    Route::get('/program/program-kerja', [IndexController::class, 'programKerja'])->name('program.programKerja');
    Route::get('/program/galeri-kegiatan', [IndexController::class, 'galeriKegiatan'])->name('program.galeriKegiatan');
    Route::get('/program/mars-pkk', [IndexController::class, 'marsPkk'])->name('program.marsPkk');
    Route::get('/program/dokumen', [IndexController::class, 'dokumen'])->name('program.dokumen');

    // Berita Publik (list + detail)
    Route::get('/berita', [IndexController::class, 'berita'])->name('berita');
    Route::get('/berita/{slug}', [IndexController::class, 'showBerita'])->name('berita.show');

    // Data Publik Sekretariat & Pokja
    Route::get('/sekretariat', [IndexController::class, 'sekretariatPublic'])->name('sekretariat');
    Route::get('/pokja-1', [IndexController::class, 'pokja1Public'])->name('pokja1');
    Route::get('/pokja-2', [IndexController::class, 'pokja2Public'])->name('pokja2');
    Route::get('/pokja-3', [IndexController::class, 'pokja3Public'])->name('pokja3');
    Route::get('/pokja-4', [IndexController::class, 'pokja4Public'])->name('pokja4');
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

    // Dashboard
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Master Data - Kader
    Route::resource('kader', KaderController::class)
        ->names('kader')
        ->except(['show']);

    // ============================================
    // SEKRETARIAT & POKJA + IMPORT EXCEL
    // ============================================
    Route::resource('sekretariat', DataUmumSekretariatController::class)
        ->names('sekretariat')
        ->except(['show']);
    Route::post('sekretariat/import', [DataUmumSekretariatController::class, 'import'])
        ->name('sekretariat.import');

    Route::resource('pokja1', Pokja1Controller::class)
        ->names('pokja1')
        ->except(['show']);
    Route::post('pokja1/import', [Pokja1Controller::class, 'import'])
        ->name('pokja1.import');

    Route::resource('pokja2', Pokja2Controller::class)
        ->names('pokja2')
        ->except(['show']);
    Route::post('pokja2/import', [Pokja2Controller::class, 'import'])
        ->name('pokja2.import');

    Route::resource('pokja3', Pokja3Controller::class)
        ->names('pokja3')
        ->except(['show']);
    Route::post('pokja3/import', [Pokja3Controller::class, 'import'])
        ->name('pokja3.import');

    Route::resource('pokja4', Pokja4Controller::class)
        ->names('pokja4')
        ->except(['show']);
    Route::post('pokja4/import', [Pokja4Controller::class, 'import'])
        ->name('pokja4.import');

    // Galeri & Berita
    Route::resource('galeri', GaleriController::class)
        ->names('galeri')
        ->except(['show']);

    Route::resource('berita', BeritaController::class)
        ->names('berita')
        ->parameters(['berita' => 'berita']);

    // User Management
    Route::resource('users', UserController::class)
        ->names('users')
        ->except(['show']);

    Route::resource('roles', RoleController::class)
        ->names('roles')
        ->except(['show']);

    // Settings
    Route::prefix('settings')->name('settings.')->group(function () {
        Route::middleware('role:admin')->group(function () {
            Route::get('/profile', [ConfigController::class, 'profile'])->name('profile');
            Route::patch('/profile', [ConfigController::class, 'updateProfile'])->name('profile.update');
            Route::put('/password', [ConfigController::class, 'updatePassword'])->name('password.update');

            Route::get('/app', [ConfigController::class, 'app'])->name('app');
            Route::post('/app', [ConfigController::class, 'updateApp'])->name('app.update');
        });
    });
});
