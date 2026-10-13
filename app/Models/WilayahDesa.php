<?php

namespace App\Models;

use Database\Seeders\AdminDesaSeeder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;

class WilayahDesa extends Model
{
    protected $table = 'wilayah_desa';

    protected $fillable = ['kecamatan', 'desa', 'is_active'];

    protected function casts(): array
    {
        return ['is_active' => 'boolean'];
    }

    public const CACHE_KEY = 'wilayah_desa_map';

    public static function flushCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    /**
     * Peta kecamatan => [desa...] (hanya yang aktif), bentuk sama persis
     * dengan AdminDesaSeeder::DATA_DESA agar semua pemakai lama bisa diganti
     * 1-baris tanpa ubah logika. Fallback ke konstanta seeder bila tabel
     * belum ada/belum di-seed (fresh install) — tidak ada yang crash.
     */
    public static function dataDesa(): array
    {
        if (!Schema::hasTable('wilayah_desa')) {
            return AdminDesaSeeder::DATA_DESA;
        }

        $map = Cache::remember(self::CACHE_KEY, 3600, function () {
            $rows = self::query()
                ->where('is_active', true)
                ->orderBy('kecamatan')
                ->orderBy('desa')
                ->get(['kecamatan', 'desa']);

            if ($rows->isEmpty()) {
                return null;
            }

            $map = [];
            foreach ($rows as $row) {
                $map[$row->kecamatan][] = $row->desa;
            }

            return $map;
        });

        return $map ?? AdminDesaSeeder::DATA_DESA;
    }

    public static function kecamatanList(): array
    {
        return array_keys(self::dataDesa());
    }

    /**
     * Daftar desa pada satu kecamatan (case-insensitive, tak ketemu → []).
     * Mirip logika Api\WilayahController::desa.
     */
    public static function desaOf(string $kecamatan): array
    {
        foreach (self::dataDesa() as $nama => $desa) {
            if (strcasecmp($nama, trim($kecamatan)) === 0) {
                return array_values($desa);
            }
        }

        return [];
    }

    /**
     * Upsert dari konstanta seeder (dipakai WilayahDesaSeeder).
     * Hanya tambah yang belum ada — tak pernah menonaktifkan/menghapus,
     * agar keputusan operator via UI tak tertimpa seed ulang.
     *
     * @return array{added: int, total: int}
     */
    public static function syncFromSeeder(array $map): array
    {
        $added = 0;
        foreach ($map as $kecamatan => $desaList) {
            $kecamatan = trim((string) $kecamatan);
            if ($kecamatan === '') {
                continue;
            }
            foreach ((array) $desaList as $desa) {
                $desa = trim((string) $desa);
                if ($desa === '') {
                    continue;
                }
                $row = self::firstOrCreate(
                    ['kecamatan' => $kecamatan, 'desa' => $desa],
                    ['is_active' => true],
                );
                if ($row->wasRecentlyCreated) {
                    $added++;
                }
            }
        }
        self::flushCache();

        return ['added' => $added, 'total' => self::count()];
    }
}
