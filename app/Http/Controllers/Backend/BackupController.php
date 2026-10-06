<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Process;
use Inertia\Inertia;
use Carbon\Carbon;

class BackupController extends Controller
{
    /**
     * Directory tempat backup disimpan (relative to storage/app).
     */
    protected string $backupDir = 'backups';



    /**
     * Tampilkan halaman daftar backup.
     */
    public function index()
    {
        $backups = $this->getBackupList();

        // Info database
        $dbInfo = [
            'connection' => config('database.default'),
            'database' => config('database.connections.' . config('database.default') . '.database'),
            'host' => config('database.connections.' . config('database.default') . '.host'),
        ];

        // Statistik database
        $dbStats = $this->getDatabaseStats();

        return Inertia::render('Backend/Backup/Index', [
            'backups' => $backups,
            'dbInfo' => $dbInfo,
            'dbStats' => $dbStats,
        ]);
    }

    /**
     * Buat backup baru.
     */
    public function store(Request $request)
    {
        $request->validate([
            'description' => 'nullable|string|max:255',
        ]);

        try {
            // Pastikan direktori backup ada
            if (!Storage::disk('local')->exists($this->backupDir)) {
                Storage::disk('local')->makeDirectory($this->backupDir);
            }

            $timestamp = Carbon::now()->format('Y-m-d_H-i-s');
            $dbName = config('database.connections.' . config('database.default') . '.database');
            $filename = "backup_{$dbName}_{$timestamp}.sql";
            $filepath = storage_path("app/{$this->backupDir}/{$filename}");

            // Jalankan pg_dump
            $host = config('database.connections.pgsql.host', '127.0.0.1');
            $port = config('database.connections.pgsql.port', '5432');
            $database = config('database.connections.pgsql.database');
            $username = config('database.connections.pgsql.username');
            $password = config('database.connections.pgsql.password');

            // Set environment variable untuk password
            $envPassword = "PGPASSWORD={$password}";

            $command = PHP_OS_FAMILY === 'Windows'
                ? "set {$envPassword} && pg_dump -h {$host} -p {$port} -U {$username} -F p -b -v -f \"{$filepath}\" {$database}"
                : "{$envPassword} pg_dump -h {$host} -p {$port} -U {$username} -F p -b -v -f \"{$filepath}\" {$database}";

            // Jalankan command
            $result = Process::timeout(300)->run($command);

            if (!file_exists($filepath) || filesize($filepath) === 0) {
                // Fallback: gunakan PHP native untuk export
                $this->phpNativeBackup($filepath);
            }

            // Simpan metadata
            $meta = [
                'filename' => $filename,
                'description' => $request->input('description', ''),
                'size' => filesize($filepath),
                'created_at' => Carbon::now()->toIso8601String(),
                'created_by' => auth()->user()->name,
                'db_name' => $dbName,
                'tables_count' => $this->getTablesCount(),
            ];

            Storage::disk('local')->put(
                "{$this->backupDir}/{$filename}.json",
                json_encode($meta, JSON_PRETTY_PRINT)
            );

            return redirect()->route('be.backup.index')->with('success', "Backup berhasil dibuat: {$filename}");
        } catch (\Throwable $e) {
            return redirect()->route('be.backup.index')->with('error', "Gagal membuat backup: {$e->getMessage()}");
        }
    }

    /**
     * Download backup file.
     */
    public function download(string $filename)
    {
        $path = "{$this->backupDir}/{$filename}";

        if (!Storage::disk('local')->exists($path)) {
            return redirect()->route('be.backup.index')->with('error', 'File backup tidak ditemukan.');
        }

        return Storage::disk('local')->download($path, $filename);
    }

    /**
     * Hapus backup file.
     */
    public function destroy(string $filename)
    {
        $sqlPath = "{$this->backupDir}/{$filename}";
        $metaPath = "{$this->backupDir}/{$filename}.json";

        if (Storage::disk('local')->exists($sqlPath)) {
            Storage::disk('local')->delete($sqlPath);
        }

        if (Storage::disk('local')->exists($metaPath)) {
            Storage::disk('local')->delete($metaPath);
        }

        return redirect()->route('be.backup.index')->with('success', 'Backup berhasil dihapus.');
    }

    /**
     * Ambil daftar backup yang ada.
     */
    protected function getBackupList(): array
    {
        if (!Storage::disk('local')->exists($this->backupDir)) {
            return [];
        }

        $files = Storage::disk('local')->files($this->backupDir);
        $backups = [];

        foreach ($files as $file) {
            if (!str_ends_with($file, '.sql')) {
                continue;
            }

            $filename = basename($file);
            $metaFile = "{$file}.json";
            $meta = [];

            if (Storage::disk('local')->exists($metaFile)) {
                $meta = json_decode(Storage::disk('local')->get($metaFile), true) ?? [];
            }

            $backups[] = [
                'filename' => $filename,
                'size' => Storage::disk('local')->size($file),
                'size_human' => $this->formatBytes(Storage::disk('local')->size($file)),
                'created_at' => $meta['created_at'] ?? Carbon::createFromTimestamp(
                    Storage::disk('local')->lastModified($file)
                )->toIso8601String(),
                'created_by' => $meta['created_by'] ?? 'System',
                'description' => $meta['description'] ?? '',
                'db_name' => $meta['db_name'] ?? '-',
                'tables_count' => $meta['tables_count'] ?? 0,
            ];
        }

        // Urutkan terbaru dulu
        usort($backups, fn($a, $b) => strcmp($b['created_at'], $a['created_at']));

        return $backups;
    }

    /**
     * Dapatkan statistik database.
     */
    protected function getDatabaseStats(): array
    {
        try {
            $tables = $this->getTablesList();
            $totalRows = 0;
            $tableDetails = [];

            foreach ($tables as $table) {
                $count = DB::table($table)->count();
                $totalRows += $count;
                $tableDetails[] = [
                    'name' => $table,
                    'rows' => $count,
                ];
            }

            // Urutkan berdasarkan jumlah rows terbanyak
            usort($tableDetails, fn($a, $b) => $b['rows'] - $a['rows']);

            // Ukuran database
            $dbSizeResult = DB::select("SELECT pg_database_size(current_database()) as size");
            $dbSize = $dbSizeResult[0]->size ?? 0;

            return [
                'tables_count' => count($tables),
                'total_rows' => $totalRows,
                'db_size' => $dbSize,
                'db_size_human' => $this->formatBytes($dbSize),
                'top_tables' => array_slice($tableDetails, 0, 10),
            ];
        } catch (\Throwable $e) {
            return [
                'tables_count' => 0,
                'total_rows' => 0,
                'db_size' => 0,
                'db_size_human' => '0 B',
                'top_tables' => [],
            ];
        }
    }

    /**
     * Dapatkan daftar tabel di database.
     */
    protected function getTablesList(): array
    {
        $tables = DB::select("
            SELECT tablename FROM pg_tables 
            WHERE schemaname = 'public' 
            ORDER BY tablename
        ");

        return array_map(fn($t) => $t->tablename, $tables);
    }

    /**
     * Dapatkan jumlah tabel.
     */
    protected function getTablesCount(): int
    {
        return count($this->getTablesList());
    }

    /**
     * Fallback: backup menggunakan PHP native (tanpa pg_dump).
     */
    protected function phpNativeBackup(string $filepath): void
    {
        $tables = $this->getTablesList();
        $output = "-- PKK Kabupaten Tasikmalaya Database Backup\n";
        $output .= "-- Generated: " . Carbon::now()->toDateTimeString() . "\n";
        $output .= "-- Database: " . config('database.connections.pgsql.database') . "\n";
        $output .= "-- ============================================\n\n";

        $output .= "SET statement_timeout = 0;\n";
        $output .= "SET lock_timeout = 0;\n";
        $output .= "SET client_encoding = 'UTF8';\n";
        $output .= "SET standard_conforming_strings = on;\n\n";

        foreach ($tables as $table) {
            // Skip tabel session & cache
            if (in_array($table, ['sessions', 'cache', 'cache_locks', 'jobs', 'failed_jobs'])) {
                $output .= "-- Skipped system table: {$table}\n\n";
                continue;
            }

            $output .= "-- ============================================\n";
            $output .= "-- Table: {$table}\n";
            $output .= "-- ============================================\n\n";

            // Export data as INSERT statements
            $rows = DB::table($table)->get();
            if ($rows->isEmpty()) {
                $output .= "-- (no data)\n\n";
                continue;
            }

            foreach ($rows as $row) {
                $rowArray = (array)$row;
                $columns = array_keys($rowArray);
                $values = array_map(function ($val) {
                    if ($val === null) return 'NULL';
                    if (is_bool($val)) return $val ? 'TRUE' : 'FALSE';
                    if (is_numeric($val)) return $val;
                    return "'" . str_replace("'", "''", (string)$val) . "'";
                }, array_values($rowArray));

                $colStr = '"' . implode('", "', $columns) . '"';
                $valStr = implode(', ', $values);
                $output .= "INSERT INTO \"{$table}\" ({$colStr}) VALUES ({$valStr});\n";
            }
            $output .= "\n";
        }

        file_put_contents($filepath, $output);
    }

    /**
     * Format bytes ke human readable.
     */
    protected function formatBytes(int $bytes, int $precision = 2): string
    {
        if ($bytes <= 0) return '0 B';

        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $pow = floor(log($bytes) / log(1024));
        $pow = min($pow, count($units) - 1);

        return round($bytes / pow(1024, $pow), $precision) . ' ' . $units[$pow];
    }
}
