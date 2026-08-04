<?php

namespace App\Imports;

use App\Models\Indikator;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class IndikatorImport implements ToModel, WithHeadingRow, WithValidation
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        return new Indikator([
            'nama_indikator' => $row['nama_indikator'],
        ]);
    }

    public function rules(): array
    {
        return [
            'nama_indikator' => 'required|string|unique:indikator,nama_indikator',
        ];
    }
}
