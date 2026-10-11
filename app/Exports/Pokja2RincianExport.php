<?php

namespace App\Exports;

use App\Models\LaporanKegiatan;
use App\Models\Pokja2;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

/**
 * Export rincian Pokja II per kecamatan untuk Kominfo.
 * Tampilan dibuat semirip tabel output website: grup header, nomor kolom,
 * baris JUMLAH. Kolom agregat (rekap, tanpa gender) + kolom rincian L/P
 * terpisah yang dijumlah dari laporan approved. Halaman public tidak berubah.
 */
class Pokja2RincianExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize, WithEvents
{
    protected ?string $search;

    /** Pasangan L/P yang dirinci (suffix _l/_p ada di data_angka laporan). */
    public const PASANGAN = [
        'Warga Belajar Paket A' => ['warga_belajar_paket_a_l', 'warga_belajar_paket_a_p'],
        'Warga Belajar Paket B' => ['warga_belajar_paket_b_l', 'warga_belajar_paket_b_p'],
        'Warga Belajar Paket C' => ['warga_belajar_paket_c_l', 'warga_belajar_paket_c_p'],
        'Warga Belajar KF' => ['warga_belajar_kf_l', 'warga_belajar_kf_p'],
        'PAUD Sejenis' => ['paud_l', 'paud_p'],
        'Taman Bacaan' => ['taman_bacaan_l', 'taman_bacaan_p'],
        'Peserta BKB' => ['peserta_bkb_l', 'peserta_bkb_p'],
        'Simulasi BKB' => ['kelompok_simulasi_bkb_l', 'kelompok_simulasi_bkb_p'],
        'Tutor KF' => ['tutor_kf_l', 'tutor_kf_p'],
        'Tutor PAUD' => ['tutor_paud_l', 'tutor_paud_p'],
        'Kader BKB' => ['kader_bkb_l', 'kader_bkb_p'],
        'Kader Koperasi' => ['kader_koperasi_l', 'kader_koperasi_p'],
        'Kader Keterampilan' => ['kader_keterampilan_l', 'kader_keterampilan_p'],
        'LP3 PKK' => ['lp3_pkk_l', 'lp3_pkk_p'],
        'TP3 PKK' => ['tp3_pkk_l', 'tp3_pkk_p'],
        'Damas PKK' => ['damas_pkk_l', 'damas_pkk_p'],
        'Peserta UP2K Pemula' => ['up2k_pemula_peserta_l', 'up2k_pemula_peserta_p'],
        'Peserta UP2K Madya' => ['up2k_madya_peserta_l', 'up2k_madya_peserta_p'],
        'Peserta UP2K Utama' => ['up2k_utama_peserta_l', 'up2k_utama_peserta_p'],
        'Peserta UP2K Mandiri' => ['up2k_mandiri_peserta_l', 'up2k_mandiri_peserta_p'],
        'Anggota Koperasi' => ['anggota_koperasi_l', 'anggota_koperasi_p'],
    ];

    /** Kolom agregat/Jml dari baris rekap (sama dengan tabel website). */
    public const AGREGAT = [
        'Warga Buta (L)' => 'warga_buta_l',
        'Warga Buta (P)' => 'warga_buta_p',
        'Kelompok Belajar Paket A' => 'kelompok_belajar_paket_a',
        'Warga Belajar Paket A' => 'warga_belajar_paket_a',
        'Kelompok Belajar Paket B' => 'kelompok_belajar_paket_b',
        'Warga Belajar Paket B' => 'warga_belajar_paket_b',
        'Kelompok Belajar Paket C' => 'kelompok_belajar_paket_c',
        'Warga Belajar Paket C' => 'warga_belajar_paket_c',
        'KF (Jml KLP)' => 'kf',
        'Warga Belajar KF' => 'warga_belajar_kf',
        'PAUD Sejenis' => 'paud',
        'Taman Bacaan' => 'taman_bacaan',
        'BKB (Jml KLP)' => 'kelompok_bkb',
        'Peserta BKB' => 'peserta_bkb',
        'BKB Ibu SET' => 'ibu_set_bkb',
        'BKB APE' => 'ape_bkb',
        'Simulasi BKB' => 'kelompok_simulasi_bkb',
        'Tutor KF' => 'tutor_kf',
        'Tutor PAUD' => 'tutor_paud',
        'Kader BKB' => 'kader_bkb',
        'Kelompok Kader Koperasi' => 'kelompok_kader_koperasi',
        'Kader Keterampilan' => 'kader_keterampilan',
        'LP3 PKK' => 'lp3_pkk',
        'TP3 PKK' => 'tp3_pkk',
        'Damas PKK' => 'damas_pkk',
        'UP2K Pemula (Klp)' => 'up2k_pemula_kelompok',
        'UP2K Pemula (Peserta)' => 'up2k_pemula_peserta',
        'UP2K Madya (Klp)' => 'up2k_madya_kelompok',
        'UP2K Madya (Peserta)' => 'up2k_madya_peserta',
        'UP2K Utama (Klp)' => 'up2k_utama_kelompok',
        'UP2K Utama (Peserta)' => 'up2k_utama_peserta',
        'UP2K Mandiri (Klp)' => 'up2k_mandiri_kelompok',
        'UP2K Mandiri (Peserta)' => 'up2k_mandiri_peserta',
        'Koperasi Berbadan Hukum' => 'koperasi_berbadan_hukum',
        'Anggota Koperasi' => 'anggota_koperasi',
        'Keterangan' => 'keterangan',
    ];

    /** Sub-sub label baris 3 untuk 35 kolom agregat (tanpa Keterangan). */
    protected const AGREGAT_SUB = [
        'L', 'P',
        'Jml. KLP', 'Belajar', 'Jml. KLP', 'Belajar', 'Jml. KLP', 'Belajar',
        'Jml. KLP', 'Belajar',
        '', '',
        'Jml. KLP', 'Peserta', 'Jml. Ibu (SET)', 'Jml. APE', 'Simulasi',
        'KF', 'PAUD Sejenis',
        '', '', '', '', '', '',
        'Jml. Klp', 'Peserta', 'Jml. Klp', 'Peserta',
        'Jml. Klp', 'Peserta', 'Jml. Klp', 'Peserta',
        'Jml. Klp', 'Jml. Anggota',
    ];

    /** Rincian L/P per kecamatan (dihitung sekali). */
    protected array $rincian = [];

    /** Baris rekap (untuk hitung baris footer). */
    protected array $rows = [];

    /** Total kolom numerik (diakumulasi di map()). */
    protected array $totals = [];

    public function __construct(?string $search = null)
    {
        $this->search = $search;
    }

    /** Kunci agregat tanpa Keterangan (Keterangan selalu paling akhir). */
    protected function agregatKeys(): array
    {
        $keys = array_values(self::AGREGAT);
        array_pop($keys);

        return $keys;
    }

    public function collection()
    {
        $this->rows = Pokja2::query()
            ->when($this->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('kecamatan', 'like', "%{$search}%")
                        ->orWhere('nama_kecamatan', 'like', "%{$search}%");
                });
            })
            ->orderBy('kecamatan', 'asc')
            ->get()
            ->all();

        // Jumlahkan rincian L/P dari laporan approved per kecamatan.
        $keys = [];
        foreach (self::PASANGAN as $pair) {
            foreach ($pair as $k) {
                $keys[] = $k;
            }
        }
        $laporans = LaporanKegiatan::where('kategori_pokja', 'II')
            ->where('status', 'approved')
            ->get(['kecamatan', 'data_angka']);
        foreach ($laporans as $l) {
            $data = $l->data_angka;
            if (is_string($data)) {
                $data = json_decode($data, true);
            }
            if (! is_array($data)) {
                continue;
            }
            $kec = $l->kecamatan ?? '-';
            if (! isset($this->rincian[$kec])) {
                $this->rincian[$kec] = array_fill_keys($keys, 0);
            }
            foreach ($keys as $k) {
                $this->rincian[$kec][$k] += (int) ($data[$k] ?? 0);
            }
        }

        return collect($this->rows);
    }

    public function headings(): array
    {
        // Baris 1 — grup utama (80 kolom).
        $r1 = array_merge(
            ['NO', 'KECAMATAN', 'PENDIDIKAN KETERAMPILAN'],
            array_fill(0, 11, ''),
            ['JUMLAH KADER KHUSUS'],
            array_fill(0, 12, ''),
            ['PENGEMBANGAN KEHIDUPAN BERKOPERASI'],
            array_fill(0, 9, ''),
            ['RINCIAN GENDER (L/P)'],
            array_fill(0, 41, ''),
            ['KET.']
        );
        // Baris 2 — sub-grup.
        $r2 = [
            '', '',
            'Warga Buta', '', 'Paket A', '', 'Paket B', '', 'Paket C', '',
            'KF', '', 'PAUD Sejenis', 'Taman Bacaan',
            'BKB', '', '', '', '', 'Tutor', '',
            'BKB', 'Koperasi', 'Keterampilan', 'LP3 PKK', 'TP3 PKK', 'Damas PKK',
            'Pemula', '', 'Madya', '', 'Utama', '', 'Mandiri', '',
            'Koperasi Berbadan Hukum', '',
        ];
        foreach (self::PASANGAN as $label => $pair) {
            $r2[] = $label;
            $r2[] = '';
        }
        $r2[] = '';
        // Baris 3 — sub-sub kolom.
        $r3 = array_merge(['', ''], self::AGREGAT_SUB);
        foreach (self::PASANGAN as $label => $pair) {
            $r3[] = 'L';
            $r3[] = 'P';
        }
        $r3[] = '';
        // Baris 4 — nomor kolom 1..80.
        $r4 = [];
        for ($i = 1; $i <= 80; $i++) {
            $r4[] = $i;
        }

        return [$r1, $r2, $r3, $r4];
    }

    public function map($row): array
    {
        static $no = 0;
        $no++;

        $out = [$no, $row->kecamatan ?? $row->nama_kecamatan ?? '-'];
        foreach ($this->agregatKeys() as $kolom) {
            $out[] = (int) ($row->{$kolom} ?? 0);
        }
        $kec = $row->kecamatan ?? '-';
        foreach (self::PASANGAN as $pair) {
            foreach ($pair as $k) {
                $out[] = (int) ($this->rincian[$kec][$k] ?? 0);
            }
        }
        $out[] = $row->keterangan ?? '-';

        foreach ($out as $i => $v) {
            if ($i >= 2 && $i < count($out) - 1 && is_numeric($v)) {
                $this->totals[$i] = ($this->totals[$i] ?? 0) + $v;
            }
        }

        return $out;
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => [
                    'bold' => true,
                    'color' => ['rgb' => 'FFFFFF'],
                ],
                'fill' => [
                    'fillType' => 'solid',
                    'startColor' => ['rgb' => '0D9488'],
                ],
                'alignment' => [
                    'horizontal' => 'center',
                    'vertical' => 'center',
                    'wrapText' => true,
                ],
            ],
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $n = count($this->rows);
                $fr = 5 + $n; // baris footer JUMLAH
                $last = self::col(80);

                // Merge grup baris 1.
                foreach ([['C', 'N'], ['O', 'AA'], ['AB', 'AK'], ['AL', 'CA']] as [$a, $b]) {
                    $sheet->mergeCells("{$a}1:{$b}1");
                }
                $sheet->mergeCells('A1:A3');
                $sheet->mergeCells('B1:B3');
                $sheet->mergeCells('CB1:CB4');
                // Merge sub-grup baris 2 (termasuk 21 pasangan rincian).
                $merges2 = [
                    ['C', 'D'], ['E', 'F'], ['G', 'H'], ['I', 'J'], ['K', 'L'],
                    ['O', 'S'], ['T', 'U'],
                    ['AB', 'AC'], ['AD', 'AE'], ['AF', 'AG'], ['AH', 'AI'], ['AJ', 'AK'],
                ];
                for ($i = 0; $i < 21; $i++) {
                    $merges2[] = [self::col(38 + $i * 2), self::col(39 + $i * 2)];
                }
                foreach ($merges2 as [$a, $b]) {
                    $sheet->mergeCells("{$a}2:{$b}2");
                }
                // Singles baris 2 -> span baris 2-4. (AL adalah awal
                // pasangan rincian, bukan single.)
                foreach (['M', 'N', 'V', 'W', 'X', 'Y', 'Z', 'AA'] as $c) {
                    $sheet->mergeCells("{$c}2:{$c}4");
                }

                // Baris footer JUMLAH.
                $sheet->setCellValue("A{$fr}", 'JUMLAH');
                $sheet->mergeCells("A{$fr}:B{$fr}");
                for ($i = 2; $i < 79; $i++) {
                    $sheet->setCellValue(self::col($i + 1).$fr, $this->totals[$i] ?? 0);
                }
                $sheet->setCellValue("CB{$fr}", '-');

                // Gaya: header tebal + tengah, footer tebal, border semua.
                $sheet->getStyle("A1:CB4")->applyFromArray([
                    'font' => ['bold' => true],
                    'alignment' => ['horizontal' => 'center', 'vertical' => 'center', 'wrapText' => true],
                ]);
                $sheet->getStyle('A1:CB1')->applyFromArray([
                    'font' => ['color' => ['rgb' => 'FFFFFF']],
                    'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => '0D9488']],
                ]);
                $sheet->getStyle("A{$fr}:CB{$fr}")->applyFromArray([
                    'font' => ['bold' => true],
                    'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => 'F1F5F9']],
                ]);
                $sheet->getStyle("A1:CB{$fr}")->applyFromArray([
                    'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'CBD5E1']]],
                ]);
                $sheet->freezePane('C5');
                $sheet->getRowDimension(1)->setRowHeight(30);
                $sheet->getRowDimension(4)->setRowHeight(18);
            },
        ];
    }

    /** Nama kolom Excel 1-indexed (1=A ... 80=CB). */
    protected static function col(int $i): string
    {
        $s = '';
        while ($i > 0) {
            $m = ($i - 1) % 26;
            $s = chr(65 + $m).$s;
            $i = intdiv($i - 1, 26);
        }

        return $s;
    }
}
