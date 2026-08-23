<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class LaporanKegiatan extends Model
{
    protected $table = 'laporan_kegiatans';

    protected $fillable = [
        'user_id',
        'judul',
        'deskripsi',
        'kategori_pokja',
        'data_angka',
        'foto',
        'kecamatan',
        'desa_kelurahan',
        'nama_dasawisma',
        'status',
        'reviewed_at',
        'reviewed_by',
    ];

    protected $casts = [
        'data_angka'  => 'array',
        'reviewed_at' => 'datetime',
    ];

    protected $appends = ['foto_url'];

    public function getFotoUrlAttribute(): ?string
    {
        if (!$this->foto) {
            return null;
        }
        if (str_starts_with($this->foto, 'http')) {
            return $this->foto;
        }
        return Storage::disk('public')->url($this->foto);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
