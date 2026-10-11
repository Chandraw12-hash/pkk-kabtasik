<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kader extends Model
{
    use HasFactory;

    protected $table = 'kader'; // Nama tabel sesuai migration

    protected $fillable = [
        'user_id',
        'nama',
        'nik',
        'jabatan',
        'pokja',
        'kecamatan',
        'desa_kelurahan',
        'no_hp',
        'alamat',
        'foto',
        'status_aktif',
        'tanggal_bergabung',
    ];

    protected $casts = [
        'status_aktif' => 'boolean',
        'tanggal_bergabung' => 'date',
    ];

    // Accessor untuk status aktif
    public function getStatusLabelAttribute()
    {
        return $this->status_aktif ? 'Aktif' : 'Nonaktif';
    }

    // Accessor untuk jabatan dengan badge warna
    public function getJabatanBadgeAttribute()
    {
        $badges = [
            'Ketua' => 'bg-purple-100 text-purple-800',
            'Wakil Ketua' => 'bg-indigo-100 text-indigo-800',
            'Sekretaris' => 'bg-blue-100 text-blue-800',
            'Bendahara' => 'bg-green-100 text-green-800',
            'Ketua Pokja I' => 'bg-yellow-100 text-yellow-800',
            'Ketua Pokja II' => 'bg-orange-100 text-orange-800',
            'Ketua Pokja III' => 'bg-red-100 text-red-800',
            'Ketua Pokja IV' => 'bg-pink-100 text-pink-800',
            'Anggota' => 'bg-gray-100 text-gray-800',
        ];

        return $badges[$this->jabatan] ?? 'bg-gray-100 text-gray-800';
    }

    // Scope untuk filter aktif/nonaktif
    public function scopeAktif($query)
    {
        return $query->where('status_aktif', true);
    }

    // Akun user yang tertaut (null = kader manual / belum punya akun).
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeNonaktif($query)
    {
        return $query->where('status_aktif', false);
    }
}
