<?php

namespace App\Imports;

use App\Models\User;
use App\Models\WilayahDesa;
use App\Services\KaderAccountSync;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Spatie\Permission\Models\Role;

class UsersImport implements ToCollection, WithHeadingRow
{
    private ?User $actor;

    private int $created = 0;

    /** @var array<int, array{baris: int, username: string, alasan: string}> */
    private array $errors = [];

    public function __construct(?User $actor = null)
    {
        $this->actor = $actor;
    }

    /**
     * @return array{created: int, skipped: int, errors: array}
     */
    public function result(): array
    {
        return [
            'created' => $this->created,
            'skipped' => count($this->errors),
            'errors' => array_slice($this->errors, 0, 50),
        ];
    }

    public function collection(Collection $rows)
    {
        $validRoles = Role::pluck('name')->all();
        $kecamatanList = WilayahDesa::kecamatanList();
        $mapDesa = WilayahDesa::dataDesa();
        $seenUsername = [];
        $seenEmail = [];

        foreach ($rows as $i => $row) {
            // Baris Excel ke- (heading di baris 1)
            $baris = $i + 2;
            $username = trim((string) ($row['username'] ?? ''));

            // Baris kosong / petunjuk template: lewati diam-diam.
            if ($username === '') {
                continue;
            }

            $alasan = $this->validateRow($row, $username, $validRoles, $kecamatanList, $mapDesa, $seenUsername, $seenEmail);
            if ($alasan !== null) {
                $this->errors[] = ['baris' => $baris, 'username' => $username, 'alasan' => $alasan];
                continue;
            }

            try {
                $this->createRow($row, $username);
                $seenUsername[] = mb_strtolower($username);
                $seenEmail[] = mb_strtolower(trim((string) ($row['email'] ?? '')));
                $this->created++;
            } catch (\Throwable $e) {
                $this->errors[] = ['baris' => $baris, 'username' => $username, 'alasan' => 'Gagal simpan: '.$e->getMessage()];
            }
        }
    }

    /**
     * @return string|null alasan dilewati, null = valid
     */
    private function validateRow($row, string $username, array $validRoles, array $kecamatanList, array $mapDesa, array $seenUsername, array $seenEmail): ?string
    {
        $nama = trim((string) ($row['nama'] ?? ''));
        $email = trim((string) ($row['email'] ?? ''));
        $password = (string) ($row['password'] ?? '');
        $peran = $this->parseRoles((string) ($row['peran'] ?? ''));
        $kecamatan = trim((string) ($row['kecamatan'] ?? ''));
        $desa = trim((string) ($row['desa'] ?? ''));

        if ($nama === '') {
            return 'Nama kosong.';
        }
        if (mb_strlen($username) > 255) {
            return 'Username kepanjangan (maks 255).';
        }
        if (in_array(mb_strtolower($username), $seenUsername, true)
            || User::where('username', $username)->exists()) {
            return "Username {$username} sudah dipakai.";
        }
        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return 'Email kosong/tidak valid.';
        }
        if (in_array(mb_strtolower($email), $seenEmail, true)
            || User::where('email', $email)->exists()) {
            return "Email {$email} sudah dipakai.";
        }
        if (mb_strlen($password) < 8) {
            return 'Password minimal 8 karakter.';
        }
        if ($peran === []) {
            return 'Peran kosong/tidak dikenal.';
        }
        foreach ($peran as $r) {
            if (!in_array($r, $validRoles, true)) {
                return "Peran {$r} tidak terdaftar.";
            }
        }
        // Aturan wilayah — cermin validateUserRegion di UserController.
        $needsKecamatan = (bool) array_intersect($peran, ['kecamatan', 'admin desa', 'dasawisma']);
        $needsDesa = (bool) array_intersect($peran, ['admin desa', 'dasawisma']);
        if ($needsKecamatan && $kecamatan === '') {
            return 'Peran '.implode(',', $peran).' wajib isi kecamatan.';
        }
        if ($kecamatan !== '' && !in_array($kecamatan, $kecamatanList, true)) {
            // Terima beda kapital bila cocok persis satu (samakan ejaan master).
            $cocok = null;
            foreach ($kecamatanList as $k) {
                if (strcasecmp($k, $kecamatan) === 0) {
                    $cocok = $k;
                    break;
                }
            }
            if ($cocok === null) {
                return "Kecamatan {$kecamatan} tidak terdaftar di master wilayah.";
            }
        }
        if ($needsDesa) {
            if ($desa === '') {
                return 'Peran '.implode(',', $peran).' wajib isi desa.';
            }
            $available = $mapDesa[$kecamatan] ?? [];
            if (!in_array($desa, $available, true)) {
                return "Desa {$desa} tidak ada di {$kecamatan}.";
            }
        }

        return null;
    }

    /** @return string[] */
    private function parseRoles(string $raw): array
    {
        $out = [];
        foreach (explode(',', $raw) as $part) {
            $part = trim($part);
            if ($part !== '' && !in_array($part, $out, true)) {
                $out[] = $part;
            }
        }

        return $out;
    }

    private function createRow($row, string $username): void
    {
        $peran = $this->parseRoles((string) ($row['peran'] ?? ''));
        $kecamatan = trim((string) ($row['kecamatan'] ?? ''));
        $desa = trim((string) ($row['desa'] ?? ''));

        // Samakan ejaan kecamatan ke master (bila beda kapital).
        if ($kecamatan !== '') {
            foreach (WilayahDesa::kecamatanList() as $k) {
                if (strcasecmp($k, $kecamatan) === 0) {
                    $kecamatan = $k;
                    break;
                }
            }
        }

        // Proteksi super-admin — cermin guardRoleAssignment.
        if (in_array('super-admin', $peran, true)
            && $this->actor !== null
            && !$this->actor->hasRole('super-admin')) {
            throw new \RuntimeException('Hanya super-admin yang boleh memberi role super-admin.');
        }

        $user = User::create([
            'name' => trim((string) ($row['nama'] ?? '')),
            'username' => $username,
            'email' => trim((string) ($row['email'] ?? '')),
            'password' => Hash::make((string) ($row['password'] ?? '')),
            'no_hp' => trim((string) ($row['no_hp'] ?? '')) !== '' ? trim((string) $row['no_hp']) : null,
            'kecamatan' => $kecamatan !== '' ? $kecamatan : null,
            'desa' => $desa !== '' ? $desa : null,
            'nama_desa' => $desa !== '' ? $desa : null,
            'status' => 'active',
        ]);
        $user->assignRole($peran);
        KaderAccountSync::syncFromUser($user->fresh());
    }
}
