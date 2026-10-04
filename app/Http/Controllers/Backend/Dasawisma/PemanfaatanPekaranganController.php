<?php

namespace App\Http\Controllers\Backend\Dasawisma;

class PemanfaatanPekaranganController extends DasawismaResourceController
{
    protected function resourceKey(): string
    {
        return 'pemanfaatan-pekarangan';
    }

    protected function definition(): array
    {
        return DasawismaResourceCatalog::get($this->resourceKey());
    }
}
