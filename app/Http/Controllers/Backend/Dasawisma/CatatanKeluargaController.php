<?php

namespace App\Http\Controllers\Backend\Dasawisma;

class CatatanKeluargaController extends DasawismaResourceController
{
    protected function resourceKey(): string
    {
        return 'catatan-keluarga';
    }

    protected function definition(): array
    {
        return DasawismaResourceCatalog::get($this->resourceKey());
    }
}
