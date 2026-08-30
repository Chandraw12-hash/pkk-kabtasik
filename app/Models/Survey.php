<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Survey extends Model
{
    protected $fillable = [
        'nama',
        'email',
        'rating',
        'saran',
        'status',
        'ip_address',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ============================================================
    // SCOPES
    // ============================================================

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeInactive($query)
    {
        return $query->where('status', 'inactive');
    }

    public function scopeRating($query, $rating)
    {
        return $query->where('rating', $rating);
    }

    // ============================================================
    // ACCESSORS
    // ============================================================

    public function getRatingLabelAttribute()
    {
        return match ($this->rating) {
            1 => 'Sangat Tidak Puas',
            2 => 'Tidak Puas',
            3 => 'Cukup',
            4 => 'Puas',
            5 => 'Sangat Puas',
            default => 'Tidak Diketahui',
        };
    }

    public function getRatingColorAttribute()
    {
        return match ($this->rating) {
            1 => 'bg-red-500',
            2 => 'bg-orange-500',
            3 => 'bg-yellow-500',
            4 => 'bg-teal-500',
            5 => 'bg-green-500',
            default => 'bg-gray-500',
        };
    }
}
