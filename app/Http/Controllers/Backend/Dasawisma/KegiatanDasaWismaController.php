<?php

namespace App\Http\Controllers\Backend\Dasawisma;

class KegiatanDasaWismaController extends DasawismaResourceController
{
    protected function resourceKey(): string
    {
        return 'kegiatan-dasa-wisma';
    }

    protected function definition(): array
    {
        return DasawismaResourceCatalog::get($this->resourceKey());
    }
}
