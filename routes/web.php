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

use App\Http\Controllers\Backend\Api\ApiEvidenceController;    


Route::as('fe.')->group(function () {
    Route::get('/', [IndexController::class, 'index'])->name('beranda');
});

Route::middleware('guest')->group(function () {
    Route::get('login', [LoginController::class, 'create'])->name('login');
    Route::post('login', [LoginController::class, 'store'])->middleware('throttle:5,1');
});

Route::post('/logout', [LoginController::class, 'destroy'])->name('logout')->middleware('auth');


// resources/web.php

Route::middleware(['auth'])->prefix('dashboard')->name('be.')->group(function () {
    
    // Dashboard Utama
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');



    // Manajemen Users (Gunakan plural 'users')
    Route::resource('users', UserController::class)
        ->names('users')
        ->except(['show']);

    // Manajemen Roles
    Route::resource('roles', RoleController::class)
        ->names('roles')
        ->except(['show']);

    // Settings Routes
    Route::prefix('settings')->name('settings.')->group(function () {
        // Profile Routes (Admin only)
        Route::middleware('role:admin')->group(function () {
            Route::get('/profile', [ConfigController::class, 'profile'])->name('profile');
            Route::patch('/profile', [ConfigController::class, 'updateProfile'])->name('profile.update');
            Route::put('/password', [ConfigController::class, 'updatePassword'])->name('password.update');
        });

        // App Routes (Admin Only)
        Route::middleware('role:admin')->group(function () {
            Route::get('/app', [ConfigController::class, 'app'])->name('app');
            Route::post('/app', [ConfigController::class, 'updateApp'])->name('app.update');
        });
    });



    // Indikator Routes
    Route::get('indikator/export', [IndikatorController::class, 'export'])->name('indikator.export');
    Route::post('indikator/import', [IndikatorController::class, 'import'])->name('indikator.import');
    Route::resource('indikator', IndikatorController::class)
        ->names('indikator')
        ->except(['show', 'create', 'edit']);

    // API Internal Routes
    Route::get('/api/indikator/{id}/detail', [ApiEvidenceController::class, 'getIndikatorDetail'])
        ->name('api.indikator.detail');

    // Eviden Routes
    Route::resource('eviden', EvidenController::class)
        ->names('eviden')
        ->except(['show']);

    Route::get('/eviden/file/{id}/download', [EvidenController::class, 'downloadFile'])->name('eviden.file.download');
    Route::delete('/eviden/file/{id}', [EvidenController::class, 'deleteFile'])->name('eviden.file.delete');





});
