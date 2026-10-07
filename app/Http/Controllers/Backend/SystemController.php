<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SystemController extends Controller
{
    public function index()
    {
        $dbSize = 0;
        try {
            $row = DB::select('SELECT pg_database_size(current_database()) as size');
            $dbSize = (int) ($row[0]->size ?? 0);
        } catch (\Throwable $e) {
            // non-pgsql / gagal query → 0
        }

        $diskFree = @disk_free_space(storage_path('app'));
        $diskTotal = @disk_total_space(storage_path('app'));

        $queuePending = 0;
        try {
            if (\Illuminate\Support\Facades\Schema::hasTable('jobs')) {
                $queuePending = DB::table('jobs')->count();
            }
        } catch (\Throwable $e) {
            $queuePending = 0;
        }

        $backupCount = 0;
        try {
            if (Storage::disk('local')->exists('backups')) {
                $backupCount = count(array_filter(
                    Storage::disk('local')->files('backups'),
                    fn ($f) => str_ends_with($f, '.sql')
                ));
            }
        } catch (\Throwable $e) {
            $backupCount = 0;
        }

        return Inertia::render('Backend/System/Index', [
            'health' => [
                'php' => PHP_VERSION,
                'laravel' => app()->version(),
                'db_size' => $dbSize,
                'db_size_human' => $this->formatBytes($dbSize),
                'disk_free' => $diskFree ?: 0,
                'disk_free_human' => $this->formatBytes((int) ($diskFree ?: 0)),
                'disk_total' => $diskTotal ?: 0,
                'disk_total_human' => $this->formatBytes((int) ($diskTotal ?: 0)),
                'queue_pending' => $queuePending,
                'backup_count' => $backupCount,
                'maintenance' => app()->isDownForMaintenance(),
                'commit' => trim((string) @shell_exec('git rev-parse --short HEAD')) ?: '-',
            ],
        ]);
    }

    public function clearCache()
    {
        Artisan::call('optimize:clear');
        ActivityLogger::log('system.cache-clear', null, 'Cache dibersihkan via System Health');

        return back()->with('success', 'Cache berhasil dibersihkan.');
    }

    public function toggleMaintenance(Request $request)
    {
        $request->validate(['down' => 'required|boolean']);

        if ($request->boolean('down')) {
            Artisan::call('down', ['--render' => 'errors::503', '--retry' => 60]);
            ActivityLogger::log('system.maintenance-down', null, 'Maintenance mode DIAKTIFKAN');
            $msg = 'Maintenance mode AKTIF. Hati-hati, pengunjung tidak bisa akses.';
        } else {
            Artisan::call('up');
            ActivityLogger::log('system.maintenance-up', null, 'Maintenance mode DIMATIKAN');
            $msg = 'Maintenance mode dimatikan. Situs kembali online.';
        }

        return back()->with('success', $msg);
    }

    protected function formatBytes(int $bytes): string
    {
        if ($bytes <= 0) {
            return '0 B';
        }
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $pow = min((int) floor(log($bytes) / log(1024)), count($units) - 1);

        return round($bytes / pow(1024, $pow), 2) . ' ' . $units[$pow];
    }
}
