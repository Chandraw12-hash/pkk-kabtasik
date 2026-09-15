<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class KecamatanScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        if (!auth()->check()) {
            return;
        }

        $user = auth()->user();

        if ($user->hasRole('kecamatan') && !empty($user->kecamatan)) {
            $builder->whereRaw(
                'UPPER(TRIM(kecamatan)) = ?',
                [strtoupper(trim($user->kecamatan))]
            );
        }
    }
}
