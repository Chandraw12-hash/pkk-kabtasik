<?php

namespace App\Http\Controllers\Concerns;

use App\Models\CatatanKeluarga;
use App\Models\DaftarWarga;
use App\Models\IndustriRumahTangga;
use App\Models\KegiatanWarga;
use App\Models\PemanfaatanPekarangan;
use App\Models\RekapBumilDasaWisma;
use App\Services\RekapBumilGenerator;
use App\Services\RekapKegiatanGenerator;
use Illuminate\Database\Eloquent\Model;

// Rollup otomatis ke baris rekap RT setelah approve/reject data detail.
// Dipakai DasawismaResourceController (web dasawisma) dan controller
// approval desa. Dibungkus aman: rekap tidak boleh menggagalkan approval.
trait RefreshesRekap
{
    protected function refreshRekapUntuk(Model $record): void
    {
        try {
            if ($record instanceof RekapBumilDasaWisma) {
                app(RekapBumilGenerator::class)->generateRtBulan(
                    (string) $record->kecamatan,
                    (string) $record->desa,
                    $record->dusun,
                    $record->rw,
                    $record->rt,
                    (int) ($record->tahun ?? date('Y')),
                    (int) ($record->bulan ?? date('n')),
                    request()->user()?->id,
                );

                return;
            }

            if (! $record instanceof DaftarWarga
                && ! $record instanceof CatatanKeluarga
                && ! $record instanceof KegiatanWarga
                && ! $record instanceof PemanfaatanPekarangan
                && ! $record instanceof IndustriRumahTangga
            ) {
                return;
            }

            $scope = $this->rekapScopeUntuk($record);
            if ($scope === null) {
                return;
            }

            app(RekapKegiatanGenerator::class)->generateRt(
                $scope['kecamatan'],
                $scope['desa'],
                $scope['dusun'] ?? null,
                $scope['rw'] ?? null,
                $scope['rt'] ?? null,
                (int) date('Y'),
                request()->user()?->id,
            );
        } catch (\Throwable $e) {
            report($e);
        }
    }

    private function rekapScopeUntuk(Model $record): ?array
    {
        // Catatan Keluarga tidak punya kolom wilayah — ikut KK-nya.
        if ($record instanceof CatatanKeluarga) {
            $kk = $record->daftarWarga;
            if (! $kk) {
                return null;
            }

            return [
                'kecamatan' => (string) $kk->kecamatan,
                'desa' => (string) $kk->desa,
                'dusun' => (string) ($kk->dusun ?? ''),
                'rw' => (string) ($kk->rw ?? ''),
                'rt' => (string) ($kk->rt ?? ''),
            ];
        }

        if (isset($record->kecamatan, $record->desa)) {
            return [
                'kecamatan' => (string) $record->kecamatan,
                'desa' => (string) $record->desa,
                'dusun' => (string) ($record->dusun ?? ''),
                'rw' => (string) ($record->rw ?? ''),
                'rt' => (string) ($record->rt ?? ''),
            ];
        }

        return null;
    }
}
