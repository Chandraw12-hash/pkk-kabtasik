<?php

namespace App\Imports;

use App\Models\StrukturOrganisasi;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;

class StrukturOrganisasiImport implements ToModel, WithHeadingRow, WithValidation, WithBatchInserts, WithChunkReading
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        // 🔥 Bersihkan data dari whitespace
        $nama = trim($row['nama'] ?? '');
        $jabatan = trim($row['jabatan'] ?? '');
        $kategori = trim($row['kategori'] ?? '');
        $pokja = isset($row['pokja']) ? trim($row['pokja']) : null;
        $deskripsi = isset($row['deskripsi']) ? trim($row['deskripsi']) : null;

        // 🔥 Pastikan pokja null jika kosong
        if (empty($pokja) || $pokja === 'null' || $pokja === 'NULL') {
            $pokja = null;
        }

        return new StrukturOrganisasi([
            'nama' => $nama,
            'jabatan' => $jabatan,
            'kategori' => $kategori,
            'pokja' => $pokja,
            'urutan' => (int) ($row['urutan'] ?? 0),
            'is_active' => (bool) ($row['is_active'] ?? 1),
            'deskripsi' => $deskripsi,
        ]);
    }

    /**
     * 🔥 Validasi data
     */
    public function rules(): array
    {
        return [
            'nama' => 'required|string|max:255',
            'jabatan' => 'required|string|max:255',
            'kategori' => 'required|in:ketua,pimpinan_inti,pokja_i,pokja_ii,pokja_iii,pokja_iv',
            'pokja' => 'nullable|in:I,II,III,IV',
            'urutan' => 'nullable|integer|min:0',
            'is_active' => 'nullable|in:0,1',
            'deskripsi' => 'nullable|string',
        ];
    }

    /**
     * 🔥 Pesan error custom
     */
    public function customValidationMessages()
    {
        return [
            'nama.required' => 'Kolom nama wajib diisi',
            'jabatan.required' => 'Kolom jabatan wajib diisi',
            'kategori.required' => 'Kolom kategori wajib diisi',
            'kategori.in' => 'Kategori tidak valid. Gunakan: ketua, pimpinan_inti, pokja_i, pokja_ii, pokja_iii, pokja_iv',
            'pokja.in' => 'Pokja tidak valid. Gunakan: I, II, III, IV',
            'is_active.in' => 'Status aktif harus 0 atau 1',
        ];
    }

    /**
     * 🔥 Batch insert untuk performa lebih baik
     */
    public function batchSize(): int
    {
        return 100;
    }

    /**
     * 🔥 Chunk reading untuk file besar
     */
    public function chunkSize(): int
    {
        return 100;
    }
}
