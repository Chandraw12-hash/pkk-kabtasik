<?php

namespace App\Http\Controllers\Backend\Dasawisma;

class KegiatanWargaController extends DasawismaResourceController
{
    protected function resourceKey(): string
    {
        return 'kegiatan-warga';
    }

    protected function definition(): array
    {
        return DasawismaResourceCatalog::get($this->resourceKey());
    }
}
