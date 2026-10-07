<?php

namespace App\Services;

use App\Models\DaftarWarga;
use App\Models\IndustriRumahTangga;
use App\Models\KegiatanWarga;
use App\Models\PemanfaatanPekarangan;
use App\Models\RekapKegiatanWarga;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

// Rollup otomatis: baris rekap level RT dihitung dari data kader
// (KK yang sudah disetujui + detail yang belum ditolak). Baris
// RW/Dusun/Desa dihitung otomatis oleh KegiatanDesaController.
//
// Aturan kunci:
// - Detail (kegiatan/catatan/pekarangan/industri): semua kecuali rejected.
//   Verifikasi angka dilakukan saat approve REKAP (tidak ada gate ganda).
// - KK: hanya yang approved (gate Persetujuan Data KK tetap ada).
// - Pencocokan dusun/RW/RT tidak peduli huruf besar-kecil ("DURIAN
//   RUNTUH" == "Durian Runtuh", "01" == "1") agar tidak pecah baris.
// - Baris rekap yang sudah disetujui desa / kecamatan TIDAK dioverwrite
//   (terkunci) — dilaporkan sebagai skipped.
// - Baris rejected yang datanya berubah -> kembali pending.
// - Idempoten: boleh dijalankan berkali-kali.
class RekapKegiatanGenerator
{
    /**
     * Generate untuk 1 RT.
     *
     * @return array{status: string, id: int|null}
     *   status: created|updated|skipped_locked|skipped_empty
     */
    public function generateRt(
        string $kecamatan,
        string $desa,
        ?string $dusun,
        ?string $rw,
        ?string $rt,
        int $tahun,
        ?int $actorId = null,
    ): array {
        $norm = fn (?string $v): string => $this->normWil($v);
        // Untuk lookup DB: lower-case saja TANPA buang nol depan
        // ('02' di DB harus cocok '02', bukan '2').
        $dbNorm = fn (?string $v): string => strtolower(trim((string) $v));

        $kk = DaftarWarga::query()
            ->whereRaw('LOWER(kecamatan) = ?', [$dbNorm($kecamatan)])
            ->whereRaw('LOWER(desa) = ?', [$dbNorm($desa)])
            ->where('status', 'approved')
            ->get()
            ->filter(fn (DaftarWarga $row) => $this->normWil($row->dusun) === $norm($dusun)
                && $this->normWil($row->rw) === $norm($rw)
                && $this->normWil($row->rt) === $norm($rt));

        if ($kk->isEmpty()) {
            return ['status' => 'skipped_empty', 'id' => null];
        }

        $inScope = function (Collection $rows) use ($norm, $dusun, $rw, $rt): Collection {
            return $rows->filter(fn ($row) => $this->normWil($row->dusun ?? '') === $norm($dusun)
                && $this->normWil($row->rw ?? '') === $norm($rw)
                && $this->normWil($row->rt ?? '') === $norm($rt));
        };

        $baseDetail = fn (string $model) => $model::query()
            ->whereRaw('LOWER(kecamatan) = ?', [$dbNorm($kecamatan)])
            ->whereRaw('LOWER(desa) = ?', [$dbNorm($desa)])
            ->where('status', '!=', 'rejected')
            ->get();

        $kegiatan = $inScope($baseDetail(KegiatanWarga::class));
        $tanahCount = $inScope($baseDetail(PemanfaatanPekarangan::class))->count();
        $industriCount = $inScope($baseDetail(IndustriRumahTangga::class))->count();

        $byJenis = ['up2k' => 0, 'pekarangan' => 0, 'industri' => 0, 'kesehatan' => 0];
        foreach ($kegiatan as $row) {
            if (array_key_exists($row->kegiatan, $byJenis)) {
                $byJenis[$row->kegiatan]++;
            }
        }

        // Tampilkan ejaan pertama yang ditemukan (rapi, konsisten).
        $displayDusun = $this->firstSpelling($kk, 'dusun') ?? $this->firstSpelling($kegiatan, 'dusun') ?? ($dusun ?? '');
        $displayRw = $this->firstSpelling($kk, 'rw') ?? ($rw ?? '');
        $displayRt = $this->firstSpelling($kk, 'rt') ?? ($rt ?? '');

        $sehat = $kk->where('kriteria_rumah', 'Sehat')->count();
        $kurang = $kk->where('kriteria_rumah', 'Kurang Sehat')->count();

        $air = ['PDAM' => 0, 'Sumur' => 0, 'Sungai' => 0, 'Lainnya' => 0];
        foreach ($kk as $row) {
            if (array_key_exists($row->sumber_air, $air)) {
                $air[$row->sumber_air]++;
            }
        }

        $makanan = ['Beras' => 0, 'Non Beras' => 0];
        foreach ($kk as $row) {
            if (array_key_exists($row->makanan_pokok, $makanan)) {
                $makanan[$row->makanan_pokok]++;
            }
        }

        $angka = [
            'nama_kecamatan' => $kecamatan,
            'nama_desa' => $desa,
            'nama_dusun' => $displayDusun,
            'level' => 'rt',
            'jumlah_dusun' => 1,
            'jumlah_rw' => 1,
            'jumlah_rt' => 1,
            'jumlah_dasa_wisma' => $kk->pluck('dasawisma')->filter()->unique()->count(),
            'jumlah_krt' => $kk->count(),
            'jumlah_kk' => (int) $kk->sum('jumlah_kk'),
            'total_l' => (int) $kk->sum('jumlah_laki_laki'),
            'total_p' => (int) $kk->sum('jumlah_perempuan'),
            'balita_l' => (int) $kk->sum('jumlah_balita_l'),
            'balita_p' => (int) $kk->sum('jumlah_balita_p'),
            'pus' => (int) $kk->sum('jumlah_pus'),
            'wus' => (int) $kk->sum('jumlah_wus'),
            'ibu_hamil' => (int) $kk->sum('jumlah_ibu_hamil'),
            'ibu_menyusui' => (int) $kk->sum('jumlah_ibu_menyusui'),
            'lansia' => (int) $kk->sum('jumlah_lansia'),
            'buta_l' => (int) $kk->sum('jumlah_buta_l'),
            'buta_p' => (int) $kk->sum('jumlah_buta_p'),
            'rumah_sehat' => $sehat,
            'rumah_kurang_sehat' => $kurang,
            'memiliki_tempat_sampah' => (int) $kk->where('memiliki_tempat_sampah', true)->count(),
            'memiliki_spal' => (int) $kk->where('memiliki_spal', true)->count(),
            'memiliki_stiker_p4k' => (int) $kk->where('memiliki_stiker_p4k', true)->count(),
            'air_pdam' => $air['PDAM'],
            'air_sumur' => $air['Sumur'],
            'air_sungai' => $air['Sungai'],
            'air_dll' => $air['Lainnya'],
            'jumlah_jamban_keluarga' => (int) $kk->sum('jumlah_mck'),
            'makanan_pokok_beras' => $makanan['Beras'],
            'makanan_pokok_non_beras' => $makanan['Non Beras'],
            'kegiatan_up2k' => $byJenis['up2k'],
            'kegiatan_tanah_pekarangan' => $tanahCount,
            'kegiatan_industri_rumah_tangga' => $industriCount,
            'kegiatan_kesehatan_lingkungan' => $byJenis['kesehatan'],
        ];

        return DB::transaction(function () use (
            $kecamatan, $desa, $norm, $dbNorm, $dusun, $rw, $rt,
            $displayDusun, $displayRw, $displayRt,
            $tahun, $angka, $actorId
        ): array {
            // Cari kandidat se-desa lalu cocokkan ternormalisasi di PHP,
            // agar varian ejaan lama ('1' vs '01', beda kapital) tidak
            // jadi baris dobel.
            $existing = RekapKegiatanWarga::query()
                ->where('tahun', $tahun)
                ->whereRaw('LOWER(kecamatan) = ?', [$dbNorm($kecamatan)])
                ->whereRaw('LOWER(desa) = ?', [$dbNorm($desa)])
                ->where('level', 'rt')
                ->get()
                ->first(fn (RekapKegiatanWarga $row) => $this->normWil($row->dusun) === $norm($dusun)
                    && $this->normWil($row->rw) === $norm($rw)
                    && $this->normWil($row->rt) === $norm($rt));

            // Terkunci: sudah disetujui desa/kecamatan -> jangan overwrite.
            if ($existing
                && ($existing->status === 'approved'
                    || $existing->kecamatan_status === 'approved')
            ) {
                return ['status' => 'skipped_locked', 'id' => $existing->id];
            }

            if ($existing) {
                $existing->fill($angka + [
                    'dusun' => $displayDusun,
                    'rw' => $displayRw,
                    'rt' => $displayRt,
                    'status' => 'pending',
                    'kecamatan_status' => 'pending',
                    'rejected_reason' => null,
                    'kecamatan_rejected_reason' => null,
                    'approved_by' => null,
                    'approved_at' => null,
                    'kecamatan_approved_by' => null,
                    'kecamatan_approved_at' => null,
                    'updated_by' => $actorId,
                ])->save();

                return ['status' => 'updated', 'id' => $existing->id];
            }

            $created = RekapKegiatanWarga::create($angka + [
                'tahun' => $tahun,
                'kecamatan' => $kecamatan,
                'desa' => $desa,
                'dusun' => $displayDusun,
                'rw' => $displayRw,
                'rt' => $displayRt,
                'status' => 'pending',
                'kecamatan_status' => 'pending',
                'created_by' => $actorId,
            ]);

            return ['status' => 'created', 'id' => $created->id];
        });
    }

    /**
     * Generate untuk seluruh desa (semua RT yang punya KK approved).
     *
     * @return array{created: int, updated: int, skipped_locked: int, skipped_empty: int}
     */
    public function generateDesa(
        string $kecamatan,
        string $desa,
        int $tahun,
        ?int $actorId = null,
    ): array {
        $summary = ['created' => 0, 'updated' => 0, 'skipped_locked' => 0, 'skipped_empty' => 0];

        $scopes = DaftarWarga::query()
            ->whereRaw('LOWER(kecamatan) = ?', [$this->normWil($kecamatan)])
            ->whereRaw('LOWER(desa) = ?', [$this->normWil($desa)])
            ->where('status', 'approved')
            ->select(['dusun', 'rw', 'rt'])
            ->distinct()
            ->get();

        $seen = [];
        foreach ($scopes as $scope) {
            $key = $this->normWil($scope->dusun).'|'.$this->normWil($scope->rw).'|'.$this->normWil($scope->rt);
            if (isset($seen[$key])) {
                continue;
            }
            $seen[$key] = true;

            // Satu RT gagal tidak boleh menggagalkan desa lain.
            try {
                $result = $this->generateRt(
                    $kecamatan,
                    $desa,
                    $scope->dusun,
                    $scope->rw,
                    $scope->rt,
                    $tahun,
                    $actorId,
                );
                $summary[$result['status']]++;
            } catch (\Throwable $e) {
                report($e);
            }
        }

        return $summary;
    }

    private function normWil(?string $v): string
    {
        $t = strtolower(trim((string) $v));
        if ($t !== '' && ctype_digit($t)) {
            return (string) ((int) $t);
        }

        return $t;
    }

    private function firstSpelling(Collection $rows, string $field): ?string
    {
        foreach ($rows as $row) {
            $v = trim((string) ($row->{$field} ?? ''));
            if ($v !== '') {
                return $v;
            }
        }

        return null;
    }
}
