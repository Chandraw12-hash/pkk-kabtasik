<?php

namespace App\Http\Controllers\Backend\Dasawisma;

class IndustriRumahTanggaController extends DasawismaResourceController
{
    protected function resourceKey(): string
    {
        return 'industri-rumah-tangga';
    }

    protected function definition(): array
    {
        return DasawismaResourceCatalog::get($this->resourceKey());
    }
}
