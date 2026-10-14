<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
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

    protected int $retentionDays = 14;

    protected int $maxTotalBytes = 2147483648; // 2 GB

    /**
     * Validasi nama file agar aman dari path traversal.
     */
    protected function resolveFilename(string $filename): string
    {
        $base = basename($filename);

        if ($base !== $filename || ! preg_match('/^[A-Za-z0-9_\-\.]+\.sql$/', $base)) {
            abort(422, 'Nama file backup tidak valid.');
        }

        return $base;
    }



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
                'checksum_sha256' => hash_file('sha256', $filepath),
                'created_at' => Carbon::now()->toIso8601String(),
                'created_by' => auth()->user()->name,
                'db_name' => $dbName,
                'tables_count' => $this->getTablesCount(),
            ];

            Storage::disk('local')->put(
                "{$this->backupDir}/{$filename}.json",
                json_encode($meta, JSON_PRETTY_PRINT)
            );

            $this->pruneOldBackups();

            ActivityLogger::log('backup.create', null, "Backup dibuat: {$filename}");

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
        $filename = $this->resolveFilename($filename);
        $path = "{$this->backupDir}/{$filename}";

        if (!Storage::disk('local')->exists($path)) {
            return redirect()->route('be.backup.index')->with('error', 'File backup tidak ditemukan.');
        }

        ActivityLogger::log('backup.download', null, "Backup diunduh: {$filename}");

        return Storage::disk('local')->download($path, $filename);
    }

    /**
     * Hapus backup file.
     */
    public function destroy(string $filename)
    {
        $filename = $this->resolveFilename($filename);
        $sqlPath = "{$this->backupDir}/{$filename}";
        $metaPath = "{$this->backupDir}/{$filename}.json";

        if (Storage::disk('local')->exists($sqlPath)) {
            Storage::disk('local')->delete($sqlPath);
        }

        if (Storage::disk('local')->exists($metaPath)) {
            Storage::disk('local')->delete($metaPath);
        }

        ActivityLogger::log('backup.delete', null, "Backup dihapus: {$filename}");

        return redirect()->route('be.backup.index')->with('success', 'Backup berhasil dihapus.');
    }

    /**
     * Upload file backup .sql dari luar.
     */
    public function upload(Request $request)
    {
        // 🔒 Maks 50 MB (51200 KB): cegah upload dump raksasa yang DoS disk.
        $request->validate([
            'file' => 'required|file|mimetypes:text/plain,text/sql,application/sql,application/octet-stream|max:51200',
            'description' => 'nullable|string|max:255',
        ]);

        $uploaded = $request->file('file');
        $original = pathinfo($uploaded->getClientOriginalName(), PATHINFO_FILENAME);
        $safe = preg_replace('/[^A-Za-z0-9_\-]/', '_', $original);
        $filename = 'uploaded_' . Carbon::now()->format('Y-m-d_H-i-s') . '_' . substr($safe, 0, 40) . '.sql';
        $filename = $this->resolveFilename($filename);

        if (!Storage::disk('local')->exists($this->backupDir)) {
            Storage::disk('local')->makeDirectory($this->backupDir);
        }

        Storage::disk('local')->putFileAs($this->backupDir, $uploaded, $filename);
        $fullPath = storage_path("app/{$this->backupDir}/{$filename}");

        Storage::disk('local')->put(
            "{$this->backupDir}/{$filename}.json",
            json_encode([
                'filename' => $filename,
                'description' => $request->input('description', 'Upload manual'),
                'size' => filesize($fullPath),
                'checksum_sha256' => hash_file('sha256', $fullPath),
                'created_at' => Carbon::now()->toIso8601String(),
                'created_by' => auth()->user()->name . ' (upload)',
                'db_name' => config('database.connections.' . config('database.default') . '.database'),
                'tables_count' => 0,
            ], JSON_PRETTY_PRINT)
        );

        $this->pruneOldBackups();

        ActivityLogger::log('backup.upload', null, "Backup diupload: {$filename}");

        return redirect()->route('be.backup.index')->with('success', "Backup berhasil diupload: {$filename}");
    }

    /**
     * Restore database dari file backup. Wajib ketik nama file persis.
     * Otomatis buat backup pengaman sebelum restore.
     */
    public function restore(Request $request)
    {
        $request->validate([
            'filename' => 'required|string|max:255',
            'confirmation' => 'required|string|max:255',
        ]);

        $filename = $this->resolveFilename($request->input('filename'));

        if ($request->input('confirmation') !== $filename) {
            return redirect()->route('be.backup.index')->with('error', 'Konfirmasi nama file tidak cocok. Restore dibatalkan.');
        }

        $path = "{$this->backupDir}/{$filename}";
        if (!Storage::disk('local')->exists($path)) {
            return redirect()->route('be.backup.index')->with('error', 'File backup tidak ditemukan.');
        }

        // 🔒 Restore dibatasi 50 MB: file lebih besar rawan timeout & penuhi disk.
        $size = Storage::disk('local')->size($path);
        if ($size > 50 * 1024 * 1024) {
            return redirect()->route('be.backup.index')->with('error', 'Restore dibatalkan: file backup melebihi 50 MB.');
        }

        // 🔒 Pastikan koneksi DB aplikasi BUKAN superuser Postgres.
        // Restore via role superuser (mis. `postgres`) memberi dampak berlebih
        // jika file SQL disusupi perintah berbahaya — tolak sejak awal.
        if ($this->databaseRoleIsSuperuser()) {
            return redirect()->route('be.backup.index')->with('error', 'Restore dibatalkan: role database aplikasi adalah superuser. Gunakan role terbatas (non-superuser).');
        }

        $lock = Cache::lock('db-restore', 600);
        if (! $lock->get()) {
            return redirect()->route('be.backup.index')->with('error', 'Ada proses restore lain yang sedang berjalan.');
        }

        try {
            // Backup pengaman sebelum restore.
            $safetyName = 'pre-restore_' . Carbon::now()->format('Y-m-d_H-i-s') . '.sql';
            $safetyPath = storage_path("app/{$this->backupDir}/{$safetyName}");
            $this->runDump($safetyPath);

            // Jalankan restore via psql.
            $filepath = storage_path("app/{$path}");
            $this->runRestore($filepath);

            ActivityLogger::log('backup.restore', null, "Database di-restore dari: {$filename} (pengaman: {$safetyName})");

            return redirect()->route('be.backup.index')->with('success', "Restore berhasil dari {$filename}. Backup pengaman: {$safetyName}");
        } catch (\Throwable $e) {
            report($e);

            return redirect()->route('be.backup.index')->with('error', "Restore gagal: {$e->getMessage()}");
        } finally {
            $lock->release();
        }
    }

    /**
     * Cek apakah role DB yang dipakai aplikasi adalah superuser Postgres.
     * Return true = superuser (restore harus ditolak). Gagal cek = false
     * agar tidak memblokir lingkungan non-Postgres, tapi dicatat ke log.
     */
    protected function databaseRoleIsSuperuser(): bool
    {
        try {
            $row = DB::selectOne('SELECT usesuper FROM pg_user WHERE usename = current_user');
            if ($row === null) {
                return false;
            }

            $flag = $row->usesuper ?? false;

            return $flag === true || $flag === 1 || $flag === '1' || $flag === 't';
        } catch (\Throwable $e) {
            report($e);

            return false;
        }
    }

    /**
     * Jalankan pg_dump ke path tujuan.
     */
    protected function runDump(string $filepath): void
    {
        $host = config('database.connections.pgsql.host', '127.0.0.1');
        $port = config('database.connections.pgsql.port', '5432');
        $database = config('database.connections.pgsql.database');
        $username = config('database.connections.pgsql.username');
        $password = config('database.connections.pgsql.password');

        $envPassword = "PGPASSWORD={$password}";
        $command = PHP_OS_FAMILY === 'Windows'
            ? "set {$envPassword} && pg_dump -h {$host} -p {$port} -U {$username} -F p -b -v -f \"{$filepath}\" {$database}"
            : "{$envPassword} pg_dump -h {$host} -p {$port} -U {$username} -F p -b -v -f \"{$filepath}\" {$database}";

        Process::timeout(300)->run($command);

        if (! file_exists($filepath) || filesize($filepath) === 0) {
            $this->phpNativeBackup($filepath);
        }
    }

    /**
     * Jalankan psql restore dari file .sql.
     */
    protected function runRestore(string $filepath): void
    {
        $host = config('database.connections.pgsql.host', '127.0.0.1');
        $port = config('database.connections.pgsql.port', '5432');
        $database = config('database.connections.pgsql.database');
        $username = config('database.connections.pgsql.username');
        $password = config('database.connections.pgsql.password');

        $envPassword = "PGPASSWORD={$password}";
        $command = PHP_OS_FAMILY === 'Windows'
            ? "set {$envPassword} && psql -h {$host} -p {$port} -U {$username} -d {$database} -v ON_ERROR_STOP=1 -f \"{$filepath}\""
            : "{$envPassword} psql -h {$host} -p {$port} -U {$username} -d {$database} -v ON_ERROR_STOP=1 -f \"{$filepath}\"";

        $result = Process::timeout(600)->run($command);

        if ($result->failed()) {
            throw new \RuntimeException(trim($result->errorOutput() ?: $result->output() ?: 'psql gagal tanpa pesan error.'));
        }
    }

    /**
     * Hapus backup lama melebihi retensi / kapasitas.
     */
    protected function pruneOldBackups(): void
    {
        try {
            $backups = $this->getBackupList();
            if (empty($backups)) {
                return;
            }

            $cutoff = Carbon::now()->subDays($this->retentionDays);

            // 1. Hapus yang lebih tua dari retensi (kecuali pre-restore 7 hari terakhir).
            foreach ($backups as $b) {
                $created = Carbon::parse($b['created_at']);
                $isSafety = str_starts_with($b['filename'], 'pre-restore_');
                if ($created->lt($cutoff) && ! ($isSafety && $created->gt(Carbon::now()->subDays(7)))) {
                    Storage::disk('local')->delete("{$this->backupDir}/{$b['filename']}");
                    Storage::disk('local')->delete("{$this->backupDir}/{$b['filename']}.json");
                }
            }

            // 2. Jika total masih > batas, hapus yang tertua dulu.
            $backups = $this->getBackupList();
            $total = array_sum(array_column($backups, 'size'));
            foreach ($backups as $b) {
                if ($total <= $this->maxTotalBytes) {
                    break;
                }
                // Jangan hapus backup termuda.
                if ($b['filename'] === ($backups[0]['filename'] ?? null)) {
                    continue;
                }
                Storage::disk('local')->delete("{$this->backupDir}/{$b['filename']}");
                Storage::disk('local')->delete("{$this->backupDir}/{$b['filename']}.json");
                $total -= $b['size'];
            }
        } catch (\Throwable $e) {
            report($e);
        }
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
                'checksum_sha256' => $meta['checksum_sha256'] ?? null,
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
