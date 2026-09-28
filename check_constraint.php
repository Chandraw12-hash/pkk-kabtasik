<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$conn = Illuminate\Support\Facades\DB::connection('pgsql')->getPdo();
$stmt = $conn->query("SELECT conname FROM pg_constraint WHERE conrelid = 'rekap_kegiatan_warga'::regclass AND contype = 'u'");
foreach ($stmt->fetchAll() as $row) {
    echo $row['conname'] . PHP_EOL;
}
