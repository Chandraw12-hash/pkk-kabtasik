<?php

namespace App\Exports;

use App\Models\Indikator;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class IndikatorExport implements FromCollection, WithHeadings, WithMapping
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return Indikator::all();
    }

    public function headings(): array
    {
        return [
            'No',
            'Nama Indikator',
        ];
    }

    public function map($indikator): array
    {
        return [
            $indikator->id,
            $indikator->nama_indikator,
        ];
    }
}
