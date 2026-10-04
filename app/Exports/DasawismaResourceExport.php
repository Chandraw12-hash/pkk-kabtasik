<?php

namespace App\Exports;

use Illuminate\Database\Eloquent\Model;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class DasawismaResourceExport implements FromArray, WithHeadings
{
    /**
     * @param array<int, Model> $records
     * @param array<string, string> $columns
     */
    public function __construct(
        private readonly array $records,
        private readonly array $columns,
        private readonly bool $useFieldNames = false,
    ) {
    }

    public function headings(): array
    {
        return $this->useFieldNames ? array_keys($this->columns) : array_values($this->columns);
    }

    public function array(): array
    {
        return array_map(
            fn (Model $record) => array_map(
                fn (string $field) => data_get($record, $field),
                array_keys($this->columns),
            ),
            $this->records,
        );
    }
}
