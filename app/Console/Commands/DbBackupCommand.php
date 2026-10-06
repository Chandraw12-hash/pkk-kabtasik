<?php

namespace App\Console\Commands;

use App\Http\Controllers\Backend\BackupController;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class DbBackupCommand extends Command
{
    protected $signature = 'backup:run {--description=Backup otomatis harian}';

    protected $description = 'Buat backup database via BackupController';

    public function handle(): int
    {
        $controller = app(BackupController::class);

        $ref = new \ReflectionMethod($controller, 'runDump');
        $ref->setAccessible(true);

        $filename = 'backup_' . config('database.connections.' . config('database.default') . '.database')
            . '_' . now()->format('Y-m-d_H-i-s') . '.sql';

        if (! Storage::disk('local')->exists('backups')) {
            Storage::disk('local')->makeDirectory('backups');
        }

        $filepath = storage_path("app/backups/{$filename}");
        $ref->invoke($controller, $filepath);

        Storage::disk('local')->put("backups/{$filename}.json", json_encode([
            'filename' => $filename,
            'description' => (string) $this->option('description'),
            'size' => file_exists($filepath) ? filesize($filepath) : 0,
            'checksum_sha256' => file_exists($filepath) ? hash_file('sha256', $filepath) : null,
            'created_at' => now()->toIso8601String(),
            'created_by' => 'Scheduler',
            'db_name' => config('database.connections.' . config('database.default') . '.database'),
            'tables_count' => 0,
        ], JSON_PRETTY_PRINT));

        // Panggil prune via refleksi juga.
        $prune = new \ReflectionMethod($controller, 'pruneOldBackups');
        $prune->setAccessible(true);
        $prune->invoke($controller);

        $this->info("Backup selesai: {$filename}");

        return self::SUCCESS;
    }
}
