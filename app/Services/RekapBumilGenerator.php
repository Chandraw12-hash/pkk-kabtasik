<?php

namespace App\Services;

use App\Models\RekapBumil;
use App\Models\RekapBumilDasaWisma;
use Illuminate\Support\Facades\DB;

// Rollup otomatis: baris rekap bumil level RT per bulan dihitung dari
// catatan per-ibu yang belum ditolak. Verifikasi angka dilakukan saat
// approve REKAP (tidak ada gate ganda).
//
// Aturan (sama profesionalnya dengan RekapKegiatanGenerator):
// - Aturan: semua kecuali rejected masuk angka. Verifikasi dilakukan
//   saat approve rekap (tidak ada gate ganda).
// - Satu ibu satu status per bulan: duplikat (nama+status sama) hanya
//   dihitung sekali (baris terbaru menang).
// - Baris rekap yang sudah disetujui desa / kecamatan TIDAK dioverwrite.
// - Idempoten.
class RekapBumilGenerator
{
    public const BULAN = [
        1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
        5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
        9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember',
    ];

    /**
     * @return array{status: string, id: int|null}
     *   status: created|updated|skipped_locked|skipped_empty
     */
    public function generateRtBulan(
        string $kecamatan,
        string $desa,
        ?string $dusun,
        ?string $rw,
        ?string $rt,
        int $tahun,
        int $bulan,
        ?int $actorId = null,
    ): array {
        $norm = fn (?string $v): string => $this->normWil($v);

        $rows = RekapBumilDasaWisma::query()
            ->whereRaw('LOWER(kecamatan) = ?', [$this->dbNorm($kecamatan)])
            ->whereRaw('LOWER(desa) = ?', [$this->dbNorm($desa)])
            ->where('tahun', $tahun)
            ->where('bulan', $bulan)
            ->where('status', '!=', 'rejected')
            ->get()
            ->filter(fn (RekapBumilDasaWisma $row) => $this->normWil($row->dusun) === $norm($dusun)
                && $this->normWil($row->rw) === $norm($rw)
                && $this->normWil($row->rt) === $norm($rt));

        // Dedupe: baris benar-benar ganda (nama+status+nama bayi sama)
        // dibuang, yang terbaru menang. Kembar (nama bayi beda) tetap
        // dihitung dua — tapi ibu dihitung unik per status.
        $unik = [];
        foreach ($rows->sortBy('id') as $row) {
            $unik[strtolower(trim((string) $row->nama)).'|'.((string) $row->status_ibu).'|'.strtolower(trim((string) ($row->bayi_nama ?? '')))] = $row;
        }
        $rows = collect(array_values($unik));

        if ($rows->isEmpty()) {
            return ['status' => 'skipped_empty', 'id' => null];
        }

        $displayDusun = $this->firstSpelling($rows, 'dusun') ?? ($dusun ?? '');
        $displayRw = $this->firstSpelling($rows, 'rw') ?? ($rw ?? '');
        $displayRt = $this->firstSpelling($rows, 'rt') ?? ($rt ?? '');
        $displayWisma = $this->firstSpelling($rows, 'dasawisma') ?? '';

        $c = [
            'hamil' => 0, 'melahirkan' => 0, 'nifas' => 0, 'meninggal' => 0,
            'bayi_l' => 0, 'bayi_p' => 0, 'akta_ada' => 0, 'akta_tidak' => 0,
            'bayi_mati_l' => 0, 'bayi_mati_p' => 0,
            'balita_mati_l' => 0, 'balita_mati_p' => 0,
        ];
        $ibuUnik = ['hamil' => [], 'melahirkan' => [], 'nifas' => [], 'meninggal' => []];

        foreach ($rows as $row) {
            switch ((string) $row->status_ibu) {
                case 'hamil':
                    if (! isset($ibuUnik['hamil'][strtolower(trim((string) $row->nama))])) {
                        $ibuUnik['hamil'][strtolower(trim((string) $row->nama))] = true;
                        $c['hamil']++;
                    }
                    break;
                case 'melahirkan':
                    if (! isset($ibuUnik['melahirkan'][strtolower(trim((string) $row->nama))])) {
                        $ibuUnik['melahirkan'][strtolower(trim((string) $row->nama))] = true;
                        $c['melahirkan']++;
                    }
                    if ($row->bayi_jenis_kelamin === 'L') {
                        $c['bayi_l']++;
                    } elseif ($row->bayi_jenis_kelamin === 'P') {
                        $c['bayi_p']++;
                    }
                    if ($row->bayi_akta === true) {
                        $c['akta_ada']++;
                    } elseif ($row->bayi_akta === false) {
                        $c['akta_tidak']++;
                    }
                    break;
                case 'nifas':
                    if (! isset($ibuUnik['nifas'][strtolower(trim((string) $row->nama))])) {
                        $ibuUnik['nifas'][strtolower(trim((string) $row->nama))] = true;
                        $c['nifas']++;
                    }
                    break;
            }

            // Kematian: manual menang; bila kosong, kategorisasi otomatis
            // dari umur (asumsi: bayi 0-11 bln, balita 12-59 bln).
            $kat = $row->kematian_kategori;
            if ((empty($kat)) && $row->kematian_umur_bulan !== null) {
                $umurBulan = (int) $row->kematian_umur_bulan;
                if ($umurBulan < 12) {
                    $kat = 'bayi';
                } elseif ($umurBulan <= 59) {
                    $kat = 'balita';
                }
            }

            if ($kat === 'ibu') {
                if (! isset($ibuUnik['meninggal'][strtolower(trim((string) $row->nama))])) {
                    $ibuUnik['meninggal'][strtolower(trim((string) $row->nama))] = true;
                    $c['meninggal']++;
                }
            } elseif ($kat === 'bayi') {
                if ($row->kematian_jenis_kelamin === 'L') {
                    $c['bayi_mati_l']++;
                } elseif ($row->kematian_jenis_kelamin === 'P') {
                    $c['bayi_mati_p']++;
                }
            } elseif ($kat === 'balita') {
                if ($row->kematian_jenis_kelamin === 'L') {
                    $c['balita_mati_l']++;
                } elseif ($row->kematian_jenis_kelamin === 'P') {
                    $c['balita_mati_p']++;
                }
            }
        }

        $angka = [
            'nama_kecamatan' => $kecamatan,
            'nama_desa' => $desa,
            'nama_dusun' => $displayDusun,
            'nama_dasawisma' => $displayWisma,
            'nama_bulan' => self::BULAN[$bulan] ?? "Bulan $bulan",
            'level' => 'rt',
            'jumlah_dusun' => 1,
            'jumlah_rw' => 1,
            'jumlah_rt' => 1,
            'jumlah_dasa_wisma' => $rows->pluck('dasawisma')->filter()->unique()->count(),
            'ibu_hamil' => $c['hamil'],
            'ibu_melahirkan' => $c['melahirkan'],
            'ibu_nifas' => $c['nifas'],
            'ibu_meninggal' => $c['meninggal'],
            'bayi_lahir_l' => $c['bayi_l'],
            'bayi_lahir_p' => $c['bayi_p'],
            'akte_ada' => $c['akta_ada'],
            'akte_tidak_ada' => $c['akta_tidak'],
            'bayi_meninggal_l' => $c['bayi_mati_l'],
            'bayi_meninggal_p' => $c['bayi_mati_p'],
            'balita_meninggal_l' => $c['balita_mati_l'],
            'balita_meninggal_p' => $c['balita_mati_p'],
        ];

        return DB::transaction(function () use (
            $kecamatan, $desa, $norm, $dusun, $rw, $rt,
            $displayDusun, $displayRw, $displayRt,
            $tahun, $bulan, $angka, $actorId
        ): array {
            $existing = RekapBumil::query()
                ->where('tahun', $tahun)
                ->where('bulan', $bulan)
                ->whereRaw('LOWER(kecamatan) = ?', [$this->dbNorm($kecamatan)])
                ->whereRaw('LOWER(desa) = ?', [$this->dbNorm($desa)])
                ->where('level', 'rt')
                ->get()
                ->first(fn (RekapBumil $row) => $this->normWil($row->dusun) === $norm($dusun)
                    && $this->normWil($row->rw) === $norm($rw)
                    && $this->normWil($row->rt) === $norm($rt));

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

            $created = RekapBumil::create($angka + [
                'tahun' => $tahun,
                'bulan' => $bulan,
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
     * @return array{created: int, updated: int, skipped_locked: int, skipped_empty: int}
     */
    public function generateDesa(
        string $kecamatan,
        string $desa,
        int $tahun,
        ?int $bulan,
        ?int $actorId = null,
    ): array {
        $summary = ['created' => 0, 'updated' => 0, 'skipped_locked' => 0, 'skipped_empty' => 0];

        $query = RekapBumilDasaWisma::query()
            ->whereRaw('LOWER(kecamatan) = ?', [$this->dbNorm($kecamatan)])
            ->whereRaw('LOWER(desa) = ?', [$this->dbNorm($desa)])
            ->where('tahun', $tahun)
            ->where('status', '!=', 'rejected')
            ->select(['dusun', 'rw', 'rt', 'bulan'])
            ->distinct();

        if ($bulan !== null) {
            $query->where('bulan', $bulan);
        }

        $seen = [];
        foreach ($query->get() as $scope) {
            $key = $this->normWil($scope->dusun).'|'.$this->normWil($scope->rw)
                .'|'.$this->normWil($scope->rt).'|'.((int) $scope->bulan);
            if (isset($seen[$key])) {
                continue;
            }
            $seen[$key] = true;

            try {
                $result = $this->generateRtBulan(
                    $kecamatan,
                    $desa,
                    $scope->dusun,
                    $scope->rw,
                    $scope->rt,
                    $tahun,
                    (int) $scope->bulan,
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

    private function dbNorm(?string $v): string
    {
        return strtolower(trim((string) $v));
    }

    private function firstSpelling($rows, string $field): ?string
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
