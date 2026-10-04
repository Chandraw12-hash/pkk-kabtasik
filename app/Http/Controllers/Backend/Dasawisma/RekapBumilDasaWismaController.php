<?php

namespace App\Http\Controllers\Backend\Dasawisma;

class RekapBumilDasaWismaController extends DasawismaResourceController
{
    protected function resourceKey(): string
    {
        return 'rekap-bumil';
    }

    protected function definition(): array
    {
        return DasawismaResourceCatalog::get($this->resourceKey());
    }
}
