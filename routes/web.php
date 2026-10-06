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

// Agenda & Laporan Kegiatan (mobile)
use App\Http\Controllers\Backend\AgendaController;
use App\Http\Controllers\Backend\LaporanKegiatanController;

// Infografis
use App\Http\Controllers\Backend\InfografisController;

// Survey
use App\Http\Controllers\Backend\SurveyController;
use App\Http\Controllers\Frontend\SurveyController as FrontendSurveyController;

// Struktur Organisasi
use App\Http\Controllers\Backend\StrukturOrganisasiController;

// Weather
use App\Http\Controllers\Api\WeatherController;

// ✅ Export Pokja IV
use App\Exports\Pokja4Export;
use App\Exports\Pokja4KunjunganPydExport;
use App\Exports\Pokja4KegiatanPosyanduExport;
use App\Exports\Pokja4RekapitulasiExport;
use Maatwebsite\Excel\Facades\Excel;

// ============================================
// KECAMATAN CONTROLLERS
// ============================================
use App\Http\Controllers\Backend\Kecamatan\DashboardKecamatanController;
use App\Http\Controllers\Backend\Kecamatan\LaporanKecamatanController;
use App\Http\Controllers\Backend\Kecamatan\RekapKecamatanController;
use App\Http\Controllers\Backend\Kecamatan\ExportKecamatanController;
use App\Http\Controllers\Backend\Kecamatan\PrintKecamatanController;
use App\Http\Controllers\Backend\Kecamatan\BeritaKecamatanController;

// ✅ KECAMATAN PKK CONTROLLERS
use App\Http\Controllers\Backend\Kecamatan\DataUmumKecamatanController;
use App\Http\Controllers\Backend\Kecamatan\KegiatanKecamatanController;
use App\Http\Controllers\Backend\Kecamatan\BumilKecamatanController;
use App\Http\Controllers\Backend\Kecamatan\ExportKecamatanPkkController;

// ============================================
// DESA CONTROLLERS
// ============================================
use App\Http\Controllers\Backend\Desa\DashboardDesaController;
use App\Http\Controllers\Backend\Desa\DataUmumDesaController;
use App\Http\Controllers\Backend\Desa\KegiatanDesaController;
use App\Http\Controllers\Backend\Desa\BumilDesaController;
use App\Http\Controllers\Backend\Desa\ExportDesaController;
use App\Http\Controllers\Backend\Desa\DaftarWargaApprovalController;

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

    // AGENDA
    Route::get('/agenda', function () {
        return redirect('/#data');
    })->name('agenda');

    // Laporan Kegiatan Public
    Route::get('/laporan-kegiatan', [IndexController::class, 'laporanKegiatanPublic'])->name('laporan-kegiatan');

    // Survey
    Route::get('/survey-kepuasan', [FrontendSurveyController::class, 'index'])->name('survey.kepuasan');
    Route::post('/survey-kepuasan', [FrontendSurveyController::class, 'store'])
        ->middleware('throttle:5,10')
        ->name('survey.kepuasan.store');

    // Data Publik Sekretariat & Pokja
    Route::get('/sekretariat', [IndexController::class, 'sekretariatPublic'])->name('sekretariat');
    Route::get('/pokja-1', [IndexController::class, 'pokja1Public'])->name('pokja1');
    Route::get('/pokja-2', [IndexController::class, 'pokja2Public'])->name('pokja2');
    Route::get('/pokja-3', [IndexController::class, 'pokja3Public'])->name('pokja3');
    Route::get('/pokja-4', [IndexController::class, 'pokja4Public'])->name('pokja4');

    // ✅ 3 Route Baru Frontend
    Route::get('/data-umum-pkk', [IndexController::class, 'dataUmumPkkPublic'])->name('data-umum-pkk');
    Route::get('/rekap-kegiatan-warga', [IndexController::class, 'rekapKegiatanWargaPublic'])->name('rekap-kegiatan-warga');
    Route::get('/rekap-bumil', [IndexController::class, 'rekapBumilPublic'])->name('rekap-bumil');

    // ✅ EXPORT POKJA IV — 4 route
    Route::get('/pokja-4/export', function () {
        $tahun = request('tahun', date('Y'));
        $filename = 'data-pokja-4-' . $tahun . '-' . date('Y-m-d') . '.xlsx';
        return Excel::download(new Pokja4Export($tahun), $filename);
    })->name('pokja4.export');

    Route::get('/pokja-4/export-pyd', function () {
        $tahun = request('tahun', date('Y'));
        $filename = 'data-kunjungan-pyd-' . $tahun . '-' . date('Y-m-d') . '.xlsx';
        return Excel::download(new Pokja4KunjunganPydExport($tahun), $filename);
    })->name('pokja4.export-pyd');

    Route::get('/pokja-4/export-posyandu', function () {
        $tahun = request('tahun', date('Y'));
        $filename = 'data-kegiatan-posyandu-' . $tahun . '-' . date('Y-m-d') . '.xlsx';
        return Excel::download(new Pokja4KegiatanPosyanduExport($tahun), $filename);
    })->name('pokja4.export-posyandu');

    Route::get('/pokja-4/export-rekap', function () {
        $tahun = request('tahun', date('Y'));
        $filename = 'data-rekapitulasi-' . $tahun . '-' . date('Y-m-d') . '.xlsx';
        return Excel::download(new Pokja4RekapitulasiExport($tahun), $filename);
    })->name('pokja4.export-rekap');
});

// ============================================
// API ROUTES (JSON untuk AJAX/Axios/Mobile)
// ============================================
Route::prefix('api')->name('api.')->group(function () {
    Route::get('/sekretariat', [IndexController::class, 'sekretariatJson'])->name('sekretariat');
    Route::get('/pokja-1', [IndexController::class, 'pokja1Json'])->name('pokja1');
    Route::get('/pokja-2', [IndexController::class, 'pokja2Json'])->name('pokja2');
    Route::get('/pokja-3', [IndexController::class, 'pokja3Json'])->name('pokja3');
    Route::get('/pokja-4', [IndexController::class, 'pokja4Json'])->name('pokja4');

    // ✅ 3 Route Baru API
    Route::get('/data-umum-pkk', [IndexController::class, 'dataUmumPkkJson'])->name('data-umum-pkk');
    Route::get('/rekap-kegiatan-warga', [IndexController::class, 'rekapKegiatanWargaJson'])->name('rekap-kegiatan-warga');
    Route::get('/rekap-bumil', [IndexController::class, 'rekapBumilJson'])->name('rekap-bumil');

    // API Berita (mobile)
    Route::get('/berita/latest', [BeritaController::class, 'apiLatestBerita'])->name('berita.latest');
    Route::get('/berita', [BeritaController::class, 'apiIndex'])->name('berita.index');
    Route::get('/berita/{slug}', [BeritaController::class, 'apiShow'])->name('berita.show');

    // API Cuaca
    Route::get('/weather', [WeatherController::class, 'current'])->name('weather');
});

// ============================================
// AUTH ROUTES
// ============================================
Route::middleware('guest')->group(function () {
    Route::get('login', [LoginController::class, 'create'])->name('login');
    Route::post('login', [LoginController::class, 'store'])->middleware('throttle:5,1');
});

Route::post('/logout', [LoginController::class, 'destroy'])
    ->name('logout')
    ->middleware('auth');

// ============================================
// BACKEND ROUTES — ADMIN KABUPATEN
// ============================================
Route::middleware(['auth'])->prefix('dashboard')->name('be.')->group(function () {

    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('kader', KaderController::class)
        ->names('kader')
        ->except(['show']);

    // ============================================================
    // SEKRETARIAT — 3 TAB
    // ============================================================
    Route::prefix('sekretariat')->name('sekretariat.')->group(function () {
        Route::get('/', [DataUmumSekretariatController::class, 'index'])->name('index');
        Route::get('/kegiatan', [DataUmumSekretariatController::class, 'kegiatan'])->name('kegiatan');
        Route::get('/bumil', [DataUmumSekretariatController::class, 'bumil'])->name('bumil');
        Route::get('/export', [DataUmumSekretariatController::class, 'export'])->name('export');
    });

    // ============================================================
    // POKJA 1-4
    // ============================================================
    Route::resource('pokja1', Pokja1Controller::class)->names('pokja1')->except(['show']);
    Route::post('pokja1/import', [Pokja1Controller::class, 'import'])->name('pokja1.import');

    Route::resource('pokja2', Pokja2Controller::class)->names('pokja2')->except(['show']);
    Route::post('pokja2/import', [Pokja2Controller::class, 'import'])->name('pokja2.import');

    Route::resource('pokja3', Pokja3Controller::class)->names('pokja3')->except(['show']);
    Route::post('pokja3/import', [Pokja3Controller::class, 'import'])->name('pokja3.import');

    Route::resource('pokja4', Pokja4Controller::class)->names('pokja4')->except(['show']);
    Route::post('pokja4/import', [Pokja4Controller::class, 'import'])->name('pokja4.import');

    Route::resource('galeri', GaleriController::class)->names('galeri')->except(['show']);

    // BERITA
    Route::get('berita/pending', [BeritaController::class, 'pending'])->name('berita.pending');
    Route::get('berita/pending-count', [BeritaController::class, 'pendingCount'])->name('berita.pending-count');
    Route::post('berita/{berita}/approve', [BeritaController::class, 'approve'])->name('berita.approve');
    Route::post('berita/{berita}/reject', [BeritaController::class, 'reject'])->name('berita.reject');
    Route::post('berita/{berita}/toggle-status', [BeritaController::class, 'toggleStatus'])->name('berita.toggle-status');
    Route::resource('berita', BeritaController::class)->names('berita')->parameters(['berita' => 'berita']);

    // INFOGRAFIS
    Route::resource('infografis', InfografisController::class)->except(['show']);
    Route::patch('infografis/{infografis}/toggle-status', [InfografisController::class, 'toggleStatus'])->name('infografis.toggle-status');

    // AGENDA
    Route::resource('agenda', AgendaController::class)->names('agenda')->except(['show']);
    Route::get('agenda/{agenda}', [AgendaController::class, 'show'])->name('agenda.show');
    Route::delete('agenda/bulk-destroy', [AgendaController::class, 'bulkDestroy'])->name('agenda.bulk-destroy');
    Route::put('agenda/bulk-update-status', [AgendaController::class, 'bulkUpdateStatus'])->name('agenda.bulk-update-status');
    Route::get('agenda/export', [AgendaController::class, 'export'])->name('agenda.export');
    Route::get('agenda/calendar/data', [AgendaController::class, 'calendar'])->name('agenda.calendar');
    Route::post('agenda/auto-update-status', [AgendaController::class, 'autoUpdateStatus'])->name('agenda.auto-update-status');

    // LAPORAN KEGIATAN
    Route::resource('laporan-kegiatan', LaporanKegiatanController::class)->names('laporan-kegiatan')->only(['index', 'show', 'destroy']);
    Route::post('laporan-kegiatan/approve-batch', [LaporanKegiatanController::class, 'approveBatch'])->name('laporan-kegiatan.approve-batch');
    Route::patch('laporan-kegiatan/{laporan_kegiatan}/review', [LaporanKegiatanController::class, 'markReviewed'])->name('laporan-kegiatan.review');
    Route::patch('laporan-kegiatan/{laporan_kegiatan}/approve', [LaporanKegiatanController::class, 'approve'])->name('laporan-kegiatan.approve');
    Route::patch('laporan-kegiatan/{laporan_kegiatan}/reject', [LaporanKegiatanController::class, 'reject'])->name('laporan-kegiatan.reject');

    // SURVEY
    Route::get('/survey', [SurveyController::class, 'index'])->name('survey.index');
    Route::get('/survey/export', [SurveyController::class, 'export'])->name('survey.export');
    Route::get('/survey/{survey}', [SurveyController::class, 'show'])->name('survey.show');
    Route::patch('/survey/{survey}/toggle-status', [SurveyController::class, 'toggleStatus'])->name('survey.toggle-status');
    Route::delete('/survey/{survey}', [SurveyController::class, 'destroy'])->name('survey.destroy');

    // USERS
    Route::middleware('permission:view-users')->group(function () {
        Route::get('users', [UserController::class, 'index'])->name('users.index');
    });
    Route::middleware('permission:create-user')->group(function () {
        Route::get('users/create', [UserController::class, 'create'])->name('users.create');
        Route::post('users', [UserController::class, 'store'])->name('users.store');
    });
    Route::middleware('permission:edit-user')->group(function () {
        Route::get('users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
        Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
    });
    Route::middleware('permission:delete-user')->group(function () {
        Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    });

    Route::get('roles/cleanup-pkk-now', function () {
        $role = \Spatie\Permission\Models\Role::where('name', 'pkk')->first();
        if ($role) {
            $role->syncPermissions([]);
            $role->users()->detach();
            $role->delete();
            return redirect()->route('be.roles.index')->with('success', 'Role pkk berhasil dihapus permanen.');
        }
        return redirect()->route('be.roles.index')->with('message', 'Role pkk sudah tidak ada.');
    })->name('roles.cleanup-pkk');

    Route::resource('roles', RoleController::class)->names('roles')->except(['show']);

    // SETTINGS
    Route::prefix('settings')->name('settings.')->group(function () {
        Route::middleware('role:admin')->group(function () {
            Route::get('/profile', [ConfigController::class, 'profile'])->name('profile');
            Route::patch('/profile', [ConfigController::class, 'updateProfile'])->name('profile.update');
            Route::put('/password', [ConfigController::class, 'updatePassword'])->name('password.update');
            Route::get('/app', [ConfigController::class, 'app'])->name('app');
            Route::post('/app', [ConfigController::class, 'updateApp'])->name('app.update');
        });
    });

    // STRUKTUR ORGANISASI
    Route::resource('struktur-organisasi', StrukturOrganisasiController::class)->names('struktur-organisasi')->except(['show']);
    Route::post('struktur-organisasi/import', [StrukturOrganisasiController::class, 'import'])->name('struktur-organisasi.import');
    Route::patch('struktur-organisasi/{id}/toggle-status', [StrukturOrganisasiController::class, 'toggleStatus'])->name('struktur-organisasi.toggle-status');
});

// ============================================================
// ROUTES: ADMIN SEKRETARIAT KECAMATAN
// ============================================================
Route::prefix('kecamatan')
    ->name('kecamatan.')
    ->middleware(['auth', 'kecamatan'])
    ->group(function () {

        Route::get('/', [DashboardKecamatanController::class, 'index'])->name('dashboard');

        Route::get('laporan', [LaporanKecamatanController::class, 'index'])->name('laporan.index');
        Route::get('laporan/{id}', [LaporanKecamatanController::class, 'show'])->name('laporan.show');

        Route::get('berita', [BeritaKecamatanController::class, 'index'])->name('berita.index');
        Route::get('berita/{id}', [BeritaKecamatanController::class, 'show'])->name('berita.show');

        Route::get('rekap/kecamatan', [RekapKecamatanController::class, 'kecamatan'])->name('rekap.kecamatan');
        Route::get('rekap/desa', [RekapKecamatanController::class, 'desa'])->name('rekap.desa');
        Route::get('rekap/dasa-wisma', [RekapKecamatanController::class, 'dasaWisma'])->name('rekap.dasa-wisma');

        Route::get('export/excel', [ExportKecamatanController::class, 'excel'])->name('export.excel');
        Route::get('export/pdf', [ExportKecamatanController::class, 'pdf'])->name('export.pdf');

        Route::get('print/{jenis?}', [PrintKecamatanController::class, 'print'])->name('print');

        // ═══════════════════════════════════════════════════════
        // DATA PKK — APPROVAL KECAMATAN
        // ⚠️ URUTAN: STATIC dulu, DYNAMIC terakhir
        // ═══════════════════════════════════════════════════════

        // ✅ NEW: Halaman approval kecamatan (STATIC)
        Route::get('data-pkk/umum/approval', [DataUmumKecamatanController::class, 'approvalIndex'])
            ->name('data-umum.approval');

        // ✅ NEW: Bulk approve (STATIC)
        Route::post('data-pkk/umum/bulk-approve', [DataUmumKecamatanController::class, 'bulkApprove'])
            ->name('data-umum.bulk-approve');

        // ✅ Existing: List per desa (STATIC)
        Route::get('data-pkk/umum', [DataUmumKecamatanController::class, 'index'])
            ->name('data-umum.index');

        // ✅ NEW: Approve/Reject per desa (DYNAMIC id)
        Route::post('data-pkk/umum/{id}/approve', [DataUmumKecamatanController::class, 'approve'])
            ->whereNumber('id')
            ->name('data-umum.approve');
        Route::post('data-pkk/umum/{id}/reject', [DataUmumKecamatanController::class, 'reject'])
            ->whereNumber('id')
            ->name('data-umum.reject');

        // ✅ Detail per desa (DYNAMIC desa — TERAKHIR)
        Route::get('data-pkk/umum/{desa}', [DataUmumKecamatanController::class, 'show'])
            ->name('data-umum.show');

        // ═══════════════════════════════════════════════════════
        // KEGIATAN
        // ═══════════════════════════════════════════════════════
        Route::get('data-pkk/kegiatan', [KegiatanKecamatanController::class, 'index'])->name('kegiatan.index');
        Route::get('data-pkk/kegiatan/{desa}', [KegiatanKecamatanController::class, 'show'])->name('kegiatan.show');

        // ═══════════════════════════════════════════════════════
        // BUMIL
        // ═══════════════════════════════════════════════════════
        Route::get('data-pkk/bumil', [BumilKecamatanController::class, 'index'])->name('bumil.index');
        Route::get('data-pkk/bumil/{desa}', [BumilKecamatanController::class, 'show'])->name('bumil.show');

        // ═══════════════════════════════════════════════════════
        // EXPORT
        // ═══════════════════════════════════════════════════════
        Route::get('data-pkk/export/umum', [ExportKecamatanPkkController::class, 'dataUmum'])->name('export.data-umum');
        Route::get('data-pkk/export/kegiatan', [ExportKecamatanPkkController::class, 'kegiatan'])->name('export.kegiatan');
        Route::get('data-pkk/export/bumil', [ExportKecamatanPkkController::class, 'bumil'])->name('export.bumil');
    });

// ============================================================
// ROUTES: ADMIN DESA
// ============================================================
Route::prefix('desa')
    ->name('desa.')
    ->middleware(['auth', 'role:admin desa', 'scope.desa'])
    ->group(function () {

        Route::get('/', [DashboardDesaController::class, 'index'])->name('dashboard');

        // ═══════════════════════════════════════════════════════
        // DAFTAR WARGA — APPROVAL
        // ═══════════════════════════════════════════════════════
        Route::get('/daftar-warga', [DaftarWargaApprovalController::class, 'index'])
            ->name('daftar-warga.index');
        Route::post('/daftar-warga/{id}/approve', [DaftarWargaApprovalController::class, 'approve'])
            ->whereNumber('id')
            ->name('daftar-warga.approve');
        Route::post('/daftar-warga/{id}/reject', [DaftarWargaApprovalController::class, 'reject'])
            ->whereNumber('id')
            ->name('daftar-warga.reject');

        // ═══════════════════════════════════════════════════════
        // DATA UMUM PKK
        // ═══════════════════════════════════════════════════════
        Route::get('/data-umum', [DataUmumDesaController::class, 'index'])
            ->name('data-umum.index');

        // ✅ Edit agregat desa (1 baris)
        Route::get('/data-umum/edit-desa', [DataUmumDesaController::class, 'editDesa'])
            ->name('data-umum.edit-desa');
        Route::put('/data-umum/update-desa', [DataUmumDesaController::class, 'updateDesa'])
            ->name('data-umum.update-desa');

        // ✅ Sync agregat desa (manual trigger)
        Route::post('/data-umum/sync-aggregate', [DataUmumDesaController::class, 'syncAggregate'])
            ->name('data-umum.sync-aggregate');

        // ✅ Import & Template
        Route::get('/data-umum/import', [DataUmumDesaController::class, 'import'])
            ->name('data-umum.import');
        Route::post('/data-umum/import', [DataUmumDesaController::class, 'store'])
            ->name('data-umum.store');
        Route::get('/data-umum/template', [DataUmumDesaController::class, 'downloadTemplate'])
            ->name('data-umum.template');

        // ✅ Edit & Update per dusun — harus di bawah route statis
        Route::get('/data-umum/{id}/edit', [DataUmumDesaController::class, 'edit'])
            ->whereNumber('id')
            ->name('data-umum.edit');
        Route::put('/data-umum/{id}', [DataUmumDesaController::class, 'update'])
            ->whereNumber('id')
            ->name('data-umum.update');

        // ═══════════════════════════════════════════════════════
        // KEGIATAN
        // ═══════════════════════════════════════════════════════
        Route::get('/kegiatan', [KegiatanDesaController::class, 'index'])->name('kegiatan.index');
        Route::get('/kegiatan/import', [KegiatanDesaController::class, 'import'])->name('kegiatan.import');
        Route::post('/kegiatan/import', [KegiatanDesaController::class, 'store'])->name('kegiatan.store');
        Route::get('/kegiatan/template', [KegiatanDesaController::class, 'downloadTemplate'])->name('kegiatan.template');
        Route::delete('/kegiatan/dusun/{dusun}', [KegiatanDesaController::class, 'destroyDusun'])->name('kegiatan.dusun.destroy');

        // ═══════════════════════════════════════════════════════
        // BUMIL
        // ═══════════════════════════════════════════════════════
        Route::get('/bumil', [BumilDesaController::class, 'index'])->name('bumil.index');
        Route::get('/bumil/import', [BumilDesaController::class, 'import'])->name('bumil.import');
        Route::post('/bumil/import', [BumilDesaController::class, 'store'])->name('bumil.store');
        Route::get('/bumil/template', [BumilDesaController::class, 'downloadTemplate'])->name('bumil.template');

        // ═══════════════════════════════════════════════════════
        // EXPORT
        // ═══════════════════════════════════════════════════════
        Route::get('/export', [ExportDesaController::class, 'index'])->name('export.index');
        Route::get('/export/data-umum', [ExportDesaController::class, 'exportDataUmum'])->name('export.data-umum');
        Route::get('/export/kegiatan', [ExportDesaController::class, 'exportKegiatan'])->name('export.kegiatan');
        Route::get('/export/bumil', [ExportDesaController::class, 'exportBumil'])->name('export.bumil');
    });

require __DIR__ . '/dasawisma.php';
