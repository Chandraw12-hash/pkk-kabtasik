<?php

namespace App\Http\Controllers\Backend\Dasawisma;

class DaftarWargaController extends DasawismaResourceController
{
    protected function resourceKey(): string
    {
        return 'daftar-warga';
    }

    protected function definition(): array
    {
        return DasawismaResourceCatalog::get($this->resourceKey());
    }
}
