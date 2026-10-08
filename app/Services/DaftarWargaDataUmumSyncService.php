<?php

namespace App\Services;

use App\Models\DaftarWarga;
use App\Models\DataUmumPkk;
use Illuminate\Database\Eloquent\Builder;
use LogicException;

class DaftarWargaDataUmumSyncService
{
    public function syncApprovedRecord(DaftarWarga $record): bool
    {
        if ($record->status !== 'approved') {
            throw new LogicException('Only approved household records can be synced.');
        }

        if ($record->data_umum_synced_at !== null) {
            return false;
        }

        $year = (int) ($record->approved_at?->year ?? now()->year);
        // Normalisasi: samakan ejaan yang beda kapital/spasi ("DURIAN RUNTUH"
        // vs "Durian Runtuh") agar tidak pecah jadi 2 baris dusun.
        $dusun = preg_replace('/\s+/', ' ', trim((string) $record->dusun));
        $query = DataUmumPkk::query()
            ->where('kecamatan', $record->kecamatan)
            ->where('desa', $record->desa)
            ->where('tahun', $year)
            ->where('level', 'desa');

        if ($dusun === '') {
            $query->where(function (Builder $builder): void {
                $builder->whereNull('dusun')->orWhere('dusun', 'Tanpa dusun');
            });
            $dusun = 'Tanpa dusun';
        } else {
            // Pencocokan tak peduli kapital (konsisten di MySQL & Postgres).
            $query->whereRaw('LOWER(dusun) = ?', [mb_strtolower($dusun)]);
        }

        $summary = $query->lockForUpdate()->first();
        if (!$summary) {
            $summary = new DataUmumPkk([
                'tahun' => $year,
                'kecamatan' => $record->kecamatan,
                'nama_kecamatan' => $record->kecamatan,
                'desa' => $record->desa,
                'nama_desa' => $record->desa,
                'dusun' => $dusun,
                'nama_dusun' => $dusun,
                'level' => 'desa',
                'created_by' => $record->approved_by ?? $record->created_by,
            ]);
        }

        $summary->jumlah_krt = (int) $summary->jumlah_krt + 1;
        $summary->jumlah_kk = (int) $summary->jumlah_kk + (int) $record->jumlah_kk;
        $summary->jiwa_l = (int) $summary->jiwa_l + (int) $record->jumlah_laki_laki;
        $summary->jiwa_p = (int) $summary->jiwa_p + (int) $record->jumlah_perempuan;
        $summary->jiwa_tidak_terpilah = (int) $summary->jiwa_tidak_terpilah
            + max(
                0,
                (int) $record->jumlah_anggota
                    - (int) $record->jumlah_laki_laki
                    - (int) $record->jumlah_perempuan,
            );
        $summary->updated_by = $record->approved_by ?? $record->created_by;
        $summary->save();

        $record->forceFill(['data_umum_synced_at' => now()])->save();

        return true;
    }
}
