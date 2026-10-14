<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class UsersTemplateExport implements WithMultipleSheets
{
    /** @var string[] */
    private array $roles;

    /** @var string[] */
    private array $kecamatan;

    public function __construct(array $roles = [], array $kecamatan = [])
    {
        $this->roles = $roles;
        $this->kecamatan = $kecamatan;
    }

    public function sheets(): array
    {
        return [
            new UsersTemplateDataSheet(),
            new UsersTemplatePetunjukSheet($this->roles, $this->kecamatan),
        ];
    }
}

class UsersTemplateDataSheet implements FromArray, WithHeadings, WithStyles, ShouldAutoSize, WithTitle
{
    public function title(): string
    {
        return 'pengguna';
    }

    public function array(): array
    {
        // Sengaja kosong: operator isi dari baris 2. Contoh format
        // ada di sheet petunjuk — tanpa contoh, tak ada risiko
        // baris contoh ikut ke-upload jadi akun sampah.
        return [];
    }

    public function headings(): array
    {
        return ['nama', 'username', 'email', 'password', 'peran', 'kecamatan', 'desa', 'no_hp'];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => '0D9488']],
                'alignment' => ['horizontal' => 'center', 'vertical' => 'center'],
            ],
        ];
    }
}

class UsersTemplatePetunjukSheet implements FromArray, WithHeadings, WithStyles, ShouldAutoSize, WithTitle
{
    /** @var string[] */
    private array $roles;

    /** @var string[] */
    private array $kecamatan;

    public function __construct(array $roles = [], array $kecamatan = [])
    {
        $this->roles = $roles;
        $this->kecamatan = $kecamatan;
    }

    public function title(): string
    {
        return 'petunjuk';
    }

    public function array(): array
    {
        $rows = [
            ['Isi hanya sheet pengguna — sheet ini cuma panduan, tidak dibaca saat import.'],
            ['Baris kosong otomatis dilewati.'],
            ['nama wajib diisi.'],
            ['username wajib unik, maks 255 karakter.'],
            ['email wajib valid & unik.'],
            ['password minimal 8 karakter.'],
            ['peran wajib — boleh lebih dari satu dipisah koma.'],
            ['Peran kecamatan, admin desa, dasawisma WAJIB isi kecamatan.'],
            ['Peran admin desa & dasawisma WAJIB isi desa yang sesuai kecamatannya.'],
            ['no_hp opsional.'],
            ['Akun baru langsung aktif. Baris gagal dilewati + dilaporkan, tidak menggagalkan sefile.'],
            ['Contoh 1 baris: Siti Aminah | siti.sukaresik | siti.sukaresik@pkk.test | Pkk12345 | dasawisma | Sukaresik | Sukaresik | 081234567890'],
            ['Contoh multi-peran: pokja1,kader (dipisah koma).'],
            ['Peran yang valid: '.implode(', ', $this->roles)],
        ];
        foreach (array_chunk($this->kecamatan, 6) as $chunk) {
            $rows[] = ['Kecamatan: '.implode(', ', $chunk)];
        }

        return $rows;
    }

    public function headings(): array
    {
        return ['PETUNJUK IMPORT PENGGUNA'];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => '0D9488']],
                'alignment' => ['horizontal' => 'center', 'vertical' => 'center'],
            ],
        ];
    }
}
