<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'profile_photo_path',
        'no_hp',
        'status',
        'kecamatan',
        'desa',
        'nama_desa',
        'last_login',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public const MOBILE_ROLES = [
        'admin',
        'pkk',
        'kader_dasawisma',
        'pokja1',
        'pokja2',
        'pokja3',
        'pokja4',
    ];

    public const POKJA_KATEGORI = [
        'pokja1' => ['I'],
        'pokja2' => ['II'],
        'pokja3' => ['III'],
        'pokja4' => ['IV', 'IV-PYD', 'IV-POSYANDU', 'IV-REKAP'],
    ];

    public const ALL_POKJA_KATEGORI = ['I', 'II', 'III', 'IV', 'IV-PYD', 'IV-POSYANDU', 'IV-REKAP'];

    public function canAccessMobile(): bool
    {
        return $this->hasAnyRole(self::MOBILE_ROLES);
    }

    public function mobilePrimaryRole(): string
    {
        $priority = self::MOBILE_ROLES;
        $userRoles = $this->roles->pluck('name')->toArray();

        foreach ($priority as $role) {
            if (in_array($role, $userRoles, true)) {
                return $role;
            }
        }

        return $userRoles[0] ?? 'unknown';
    }

    public function pokjaCode(): ?string
    {
        return match ($this->mobilePrimaryRole()) {
            'pokja1' => 'I',
            'pokja2' => 'II',
            'pokja3' => 'III',
            'pokja4' => 'IV',
            default => null,
        };
    }

    /**
     * null = semua kategori (admin / kader).
     */
    public function allowedPokjaKategori(): ?array
    {
        if ($this->hasAnyRole(['admin', 'pkk', 'kader_dasawisma'])) {
            return null;
        }

        foreach (self::POKJA_KATEGORI as $role => $kategori) {
            if ($this->hasRole($role)) {
                return $kategori;
            }
        }

        return [];
    }

    public function canSubmitPokjaKategori(string $kategori): bool
    {
        $allowed = $this->allowedPokjaKategori();

        return $allowed === null || in_array($kategori, $allowed, true);
    }

    public function toMobileAuthArray(): array
    {
        $role = $this->mobilePrimaryRole();
        $allowed = $this->allowedPokjaKategori() ?? self::ALL_POKJA_KATEGORI;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'username' => $this->username,
            'email' => $this->email,
            'status' => $this->status,
            'roles' => $this->roles->pluck('name'),
            'role' => $role,
            'pokja' => $this->pokjaCode(),
            'allowed_kategori' => $allowed,
        ];
    }
}
