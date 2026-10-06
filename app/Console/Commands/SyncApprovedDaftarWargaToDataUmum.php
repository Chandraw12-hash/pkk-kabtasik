<?php

namespace App\Console\Commands;

use App\Models\DaftarWarga;
use App\Services\DaftarWargaDataUmumSyncService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SyncApprovedDaftarWargaToDataUmum extends Command
{
    protected $signature = 'dasawisma:sync-approved-to-data-umum {--dry-run : Only report the number of approved records that need syncing}';

    protected $description = 'Sync approved Dasawisma household records into the Data Umum PKK recap';

    public function handle(DaftarWargaDataUmumSyncService $syncService): int
    {
        $pendingCount = DaftarWarga::query()
            ->where('status', 'approved')
            ->whereNull('data_umum_synced_at')
            ->count();

        if ($this->option('dry-run')) {
            $this->info("{$pendingCount} approved records need syncing.");

            return self::SUCCESS;
        }

        $syncedCount = 0;
        DaftarWarga::query()
            ->where('status', 'approved')
            ->whereNull('data_umum_synced_at')
            ->select('id')
            ->chunkById(100, function ($records) use ($syncService, &$syncedCount): void {
                foreach ($records as $record) {
                    $synced = DB::transaction(function () use ($record, $syncService): bool {
                        $lockedRecord = DaftarWarga::query()
                            ->whereKey($record->id)
                            ->lockForUpdate()
                            ->first();

                        if (!$lockedRecord || $lockedRecord->status !== 'approved') {
                            return false;
                        }

                        return $syncService->syncApprovedRecord($lockedRecord);
                    });

                    if ($synced) {
                        $syncedCount++;
                    }
                }
            });

        $this->info("Synced {$syncedCount} approved records into Data Umum PKK.");

        return self::SUCCESS;
    }
}
