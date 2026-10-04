<?php

namespace App\Http\Controllers\Backend\Dasawisma;

class DataDasaWismaController extends DasawismaResourceController
{
    protected function resourceKey(): string
    {
        return 'data-dasa-wisma';
    }

    protected function definition(): array
    {
        return DasawismaResourceCatalog::get($this->resourceKey());
    }
}
