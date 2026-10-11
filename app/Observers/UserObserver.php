<?php

namespace App\Observers;

use App\Models\User;
use App\Services\KaderAccountSync;

class UserObserver
{
    public function updated(User $user): void
    {
        KaderAccountSync::syncFromUser($user);
    }

    /**
     * Pakai deleting (bukan deleted): FK nullOnDelete mengosongkan user_id
     * di statement DELETE yang sama, sehingga deleted tak bisa menemukan baris.
     */
    public function deleting(User $user): void
    {
        KaderAccountSync::unlinkUser($user);
    }
}
