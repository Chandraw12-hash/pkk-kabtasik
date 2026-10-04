<?php

use App\Http\Controllers\Backend\Dasawisma\CatatanKeluargaController;
use App\Http\Controllers\Backend\Dasawisma\DaftarWargaController;
use App\Http\Controllers\Backend\Dasawisma\DataDasaWismaController;
use App\Http\Controllers\Backend\Dasawisma\DashboardDasawismaController;
use App\Http\Controllers\Backend\Dasawisma\IndustriRumahTanggaController;
use App\Http\Controllers\Backend\Dasawisma\KegiatanDasaWismaController;
use App\Http\Controllers\Backend\Dasawisma\KegiatanWargaController;
use App\Http\Controllers\Backend\Dasawisma\PemanfaatanPekaranganController;
use App\Http\Controllers\Backend\Dasawisma\RekapBumilDasaWismaController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('dasawisma')
    ->name('dasawisma.')
    ->middleware(['auth', 'verified', 'scope.desa', 'role:dasawisma|admin desa|kecamatan|admin'])
    ->group(function (): void {
        Route::get('/', [DashboardDasawismaController::class, 'index'])->name('dashboard');

        $resources = [
            'daftar-warga' => [DaftarWargaController::class, 'daftar-warga'],
            'data-dasa-wisma' => [DataDasaWismaController::class, 'data-dasa-wisma'],
            'catatan-keluarga' => [CatatanKeluargaController::class, 'catatan-keluarga'],
            'kegiatan-warga' => [KegiatanWargaController::class, 'kegiatan-warga'],
            'pemanfaatan-pekarangan' => [PemanfaatanPekaranganController::class, 'pemanfaatan-pekarangan'],
            'industri-rumah-tangga' => [IndustriRumahTanggaController::class, 'industri-rumah-tangga'],
            'kegiatan-dasa-wisma' => [KegiatanDasaWismaController::class, 'kegiatan-dasa-wisma'],
            'rekap-bumil' => [RekapBumilDasaWismaController::class, 'rekap-bumil'],
        ];

        foreach ($resources as $slug => [$controller, $name]) {
            Route::prefix($slug)->name($name.'.')->group(function () use ($controller): void {
                Route::get('/', [$controller, 'index'])->name('index');
                Route::get('/create', [$controller, 'create'])->name('create');
                Route::post('/', [$controller, 'store'])->name('store');
                Route::post('/import', [$controller, 'importExcel'])->name('import');
                Route::get('/template', [$controller, 'templateExcel'])->name('template');
                Route::get('/export', [$controller, 'exportExcel'])->name('export');
                Route::post('/bulk-approve', [$controller, 'bulkApprove'])->name('bulk-approve');
                Route::get('/{id}/edit', [$controller, 'edit'])->whereNumber('id')->name('edit');
                Route::get('/{id}', [$controller, 'show'])->whereNumber('id')->name('show');
                Route::put('/{id}', [$controller, 'update'])->whereNumber('id')->name('update');
                Route::delete('/{id}', [$controller, 'destroy'])->whereNumber('id')->name('destroy');
                Route::post('/{id}/approve', [$controller, 'approve'])->whereNumber('id')->name('approve');
                Route::post('/{id}/reject', [$controller, 'reject'])->whereNumber('id')->name('reject');
            });
        }

        Route::get('/panduan/rumah-layak-huni', fn () => Inertia::render('Dasawisma/Panduan/RumahLayakHuni'))
            ->name('panduan.rumah-layak-huni');
        Route::get('/panduan/tidak-layak-huni', fn () => Inertia::render('Dasawisma/Panduan/TidakLayakHuni'))
            ->name('panduan.tidak-layak-huni');
    });
