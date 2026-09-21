<?php

namespace App\Imports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class Pokja4Import implements WithMultipleSheets
{
    public Pokja4SheetImport $sheetImport;

    public function __construct()
    {
        $this->sheetImport = new Pokja4SheetImport();
    }

    public function sheets(): array
    {
        return [
            0 => $this->sheetImport,
        ];
    }

    public function failures()
    {
        return $this->sheetImport->failures();
    }

    public function getImportedCount(): int
    {
        return $this->sheetImport->importedCount;
    }
}
