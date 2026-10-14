<?php

namespace App\Http\Controllers\Backend;

use App\Models\User;
use App\Models\WilayahDesa;
use App\Http\Controllers\Controller;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    // ⚠️ HAPUS constructor middleware — pindah ke route
    // (Laravel 11 udah ga support $this->middleware() di constructor)

    /**
     * INDEX — List user + filter
     */
    public function index(Request $request)
    {
        $perPage = $request->per_page ?? 10;

        $users = User::query()
            ->with(['roles'])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('username', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($request->role, function ($query, $role) {
                $query->whereHas('roles', function ($q) use ($role) {
                    $q->where('name', $role);
                });
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->inactive_30d, function ($query) {
                $query->where(function ($q) {
                    $q->whereNull('last_login')->orWhere('last_login', '<', now()->subDays(30));
                });
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        // JSON hanya untuk axios (filter/paginasi tanpa reload) — pola sama KaderController.
        if (
            !$request->header('X-Inertia') &&
            ($request->wantsJson() || $request->ajax())
        ) {
            return response()->json($users);
        }

        return Inertia::render('Backend/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'per_page', 'role', 'status', 'inactive_30d'])
        ]);
    }

    /**
     * CREATE — Form tambah user (bisa prefill dari baris kader).
     */
    public function create(Request $request)
    {
        $roles = \Spatie\Permission\Models\Role::all();
        if (! auth()->user()->hasRole('super-admin')) {
            $roles = $roles->where('name', '!=', 'super-admin')->values();
        }

        $prefill = [];
        if ($request->filled('kader_id')) {
            $kader = \App\Models\Kader::find($request->input('kader_id'));
            if ($kader && empty($kader->user_id)) {
                $roleGuess = match ($kader->pokja) {
                    'I' => 'pokja1',
                    'II' => 'pokja2',
                    'III' => 'pokja3',
                    'IV' => 'pokja4',
                    default => 'dasawisma',
                };
                $prefill = [
                    'kader_id' => $kader->id,
                    'name' => $kader->nama,
                    'kecamatan' => $kader->kecamatan,
                    'desa' => $kader->desa_kelurahan,
                    'roles' => $roles->pluck('name')->contains($roleGuess) ? [$roleGuess] : [],
                ];
            }
        }

        return Inertia::render('Backend/Users/Create', [
            'roles' => $roles,
            'kecamatanList' => WilayahDesa::kecamatanList(),
            'desaByKecamatan' => $this->desaByKecamatan(),
            'prefill' => $prefill,
        ]);
    }

    /**
     * STORE — Simpan user baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', Password::defaults(), 'confirmed'],
            'roles' => 'required|array',
            'roles.*' => ['required', 'string', Rule::exists('roles', 'name')],
            'kecamatan' => ['nullable', 'string', 'max:255', Rule::in(WilayahDesa::kecamatanList())],
            'desa' => ['nullable', 'string', 'max:255'],
            'nama_desa' => 'nullable|string|max:255',
            'kader_id' => 'nullable|integer|exists:kader,id',
        ]);

        $this->validateUserRegion($request, $validated['roles']);
        $this->guardRoleAssignment($validated['roles']);

        $user = User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'kecamatan' => $validated['kecamatan'] ?? null,
            'desa' => $validated['desa'] ?? null,
            'nama_desa' => $validated['desa'] ?? null,
            'status' => 'active',
        ]);

        $user->assignRole($validated['roles']);

        // Tautkan baris kader (prefill) lalu cerminkan akun -> kader.
        if (! empty($validated['kader_id'])) {
            \App\Models\Kader::where('id', $validated['kader_id'])
                ->whereNull('user_id')
                ->update(['user_id' => $user->id]);
        }
        \App\Services\KaderAccountSync::syncFromUser($user->fresh());

        ActivityLogger::log('user.create', $user, "User dibuat: {$user->username} (" . implode(',', $validated['roles']) . ')');

        return redirect()->route('be.users.index')
            ->with('message', 'User berhasil dibuat!');
    }

    /**
     * TEMPLATE IMPORT — Excel contoh + petunjuk kolom (super-admin).
     */
    public function template()
    {
        $roles = \Spatie\Permission\Models\Role::orderBy('name')->pluck('name')->all();

        return \Maatwebsite\Excel\Facades\Excel::download(
            new \App\Exports\UsersTemplateExport($roles, WilayahDesa::kecamatanList()),
            'template-import-pengguna.xlsx'
        );
    }

    /**
     * IMPORT MASSAL — buat banyak akun sekaligus dari Excel.
     * Baris gagal dilewati + dilaporkan (tidak menggagalkan 1 file).
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:5120',
        ], [
            'file.required' => 'Pilih file Excel dulu.',
            'file.mimes' => 'File harus .xlsx / .xls / .csv.',
            'file.max' => 'Ukuran file maksimal 5 MB.',
        ]);

        $import = new \App\Imports\UsersImport(auth()->user());
        \Maatwebsite\Excel\Facades\Excel::import($import, $request->file('file'));
        $hasil = $import->result();

        ActivityLogger::log(
            'user.import',
            null,
            "Import pengguna: {$hasil['created']} dibuat, {$hasil['skipped']} dilewati ({$request->file('file')->getClientOriginalName()})"
        );

        return redirect()->route('be.users.index')
            ->with('success', "Import selesai: {$hasil['created']} akun dibuat, {$hasil['skipped']} baris dilewati.")
            ->with('import_result', $hasil);
    }

    /**
     * EDIT — Form edit user
     */
    public function edit(User $user)
    {
        $roles = \Spatie\Permission\Models\Role::all();
        if (! auth()->user()->hasRole('super-admin')) {
            $roles = $roles->where('name', '!=', 'super-admin')->values();
        }

        return Inertia::render('Backend/Users/Edit', [
            'user' => $user->load(['roles']),
            'roles' => $roles,
            'userRoles' => $user->getRoleNames(),
            'kecamatanList' => WilayahDesa::kecamatanList(),
            'desaByKecamatan' => $this->desaByKecamatan(),
        ]);
    }

    /**
     * UPDATE — Perbarui user
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,' . $user->id,
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => ['nullable', Password::defaults(), 'confirmed'],
            'roles' => 'required|array',
            'roles.*' => ['required', 'string', Rule::exists('roles', 'name')],
            'kecamatan' => ['nullable', 'string', 'max:255', Rule::in(WilayahDesa::kecamatanList())],
            'desa' => ['nullable', 'string', 'max:255'],
            'nama_desa' => 'nullable|string|max:255',
        ]);

        $this->validateUserRegion($request, $validated['roles']);
        $this->guardRoleAssignment($validated['roles']);
        $this->guardSuperAdminTarget($user);

        $data = [
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'kecamatan' => $validated['kecamatan'] ?? null,
            'desa' => $validated['desa'] ?? null,
            'nama_desa' => $validated['desa'] ?? null,
        ];

        if (!empty($validated['password'])) {
            $data['password'] = Hash::make($validated['password']);
        }

        $user->update($data);
        $user->syncRoles($validated['roles']);
        \App\Services\KaderAccountSync::syncFromUser($user->fresh());

        ActivityLogger::log('user.update', $user, "User diubah: {$user->username}");

        return redirect()->route('be.users.index')
            ->with('message', 'User berhasil diperbarui!');
    }

    /**
     * DESTROY — Hapus user
     */
    public function destroy(User $user)
    {
        if (auth()->id() === $user->id) {
            return back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri!');
        }

        $this->guardSuperAdminTarget($user);

        $username = $user->username;
        $user->delete();

        ActivityLogger::log('user.delete', null, "User dihapus: {$username}");

        return redirect()->route('be.users.index')
            ->with('message', 'User berhasil dihapus!');
    }

    /**
     * TOGGLE STATUS — Kunci/buka akun tanpa menghapus.
     */
    public function toggleStatus(User $user)
    {
        if (auth()->id() === $user->id) {
            return back()->with('error', 'Tidak bisa menonaktifkan akun sendiri!');
        }

        $this->guardSuperAdminTarget($user);

        $newStatus = ($user->status ?? 'active') === 'active' ? 'inactive' : 'active';

        // Jangan sampai tidak ada super-admin aktif yang tersisa.
        if ($newStatus === 'inactive' && $user->hasRole('super-admin')) {
            $remaining = User::role('super-admin')->where('status', 'active')->where('id', '!=', $user->id)->count();
            if ($remaining === 0) {
                return back()->with('error', 'Tidak bisa menonaktifkan satu-satunya super-admin aktif!');
            }
        }

        $user->forceFill(['status' => $newStatus])->save();
        ActivityLogger::log('user.toggle-status', $user, "Status {$user->username} → {$newStatus}");

        return back()->with('message', "Status {$user->name} → {$newStatus}");
    }

    /**
     * RESET PASSWORD — paksa ganti password oleh super admin/admin.
     */
    public function resetPassword(Request $request, User $user)
    {
        $this->guardSuperAdminTarget($user);

        $validated = $request->validate([
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $user->forceFill(['password' => Hash::make($validated['password'])])->save();
        ActivityLogger::log('user.reset-password', $user, "Password direset: {$user->username}");

        return back()->with('message', "Password {$user->name} berhasil direset.");
    }

    /**
     * PINJAM MASUK — login sebagai user lain untuk bantu troubleshooting.
     * Hanya super-admin. Dilarang pinjam sesama super-admin.
     */
    public function impersonate(User $user)
    {
        abort_unless(auth()->user()->hasRole('super-admin'), 403, 'Hanya super-admin.');

        if ($user->hasRole('super-admin')) {
            return back()->with('error', 'Tidak bisa pinjam-masuk ke sesama super-admin.');
        }

        if (($user->status ?? 'active') !== 'active') {
            return back()->with('error', 'Akun target sedang nonaktif.');
        }

        session(['impersonator_id' => auth()->id()]);
        ActivityLogger::log('user.impersonate', $user, 'Pinjam-masuk ke: ' . $user->username);
        Auth::login($user);
        request()->session()->regenerate();

        return redirect()->route('be.dashboard')->with('message', 'Anda masuk sebagai ' . $user->name);
    }

    /**
     * Keluar dari mode pinjam-masuk.
     */
    public function leaveImpersonate(Request $request)
    {
        $impersonatorId = $request->session()->get('impersonator_id');
        if (! $impersonatorId) {
            return redirect()->route('be.dashboard');
        }

        $impersonator = User::find($impersonatorId);
        if (! $impersonator) {
            $request->session()->forget('impersonator_id');

            return redirect()->route('be.dashboard');
        }

        ActivityLogger::log('user.impersonate-leave', $impersonator, 'Selesai pinjam-masuk, kembali ke: ' . $impersonator->username);
        Auth::login($impersonator);
        $request->session()->regenerate();
        $request->session()->forget('impersonator_id');

        return redirect()->route('be.dashboard')->with('message', 'Kembali ke akun Anda.');
    }

    /**
     * Hanya super-admin yang boleh memberi/mengelola role super-admin.
     */
    protected function guardRoleAssignment(array $roles): void
    {
        if (in_array('super-admin', $roles, true) && ! auth()->user()->hasRole('super-admin')) {
            abort(403, 'Hanya super-admin yang boleh memberi role super-admin.');
        }
    }

    /**
     * Hanya super-admin yang boleh mengutak-atik akun super-admin lain.
     */
    protected function guardSuperAdminTarget(User $target): void
    {
        if ($target->hasRole('super-admin') && ! auth()->user()->hasRole('super-admin')) {
            abort(403, 'Hanya super-admin yang boleh mengelola akun super-admin.');
        }
    }

    private function desaByKecamatan(): array
    {
        // Master tabel wilayah_desa (UI super-admin), fallback konstanta
        // seeder bila tabel kosong — agar validasi desa dasawisma
        // selalu punya acuan.
        return WilayahDesa::dataDesa();
    }

    private function validateUserRegion(Request $request, array $roles): void
    {
        $needsKecamatan = in_array('kecamatan', $roles, true)
            || in_array('admin desa', $roles, true)
            || in_array('dasawisma', $roles, true);
        $needsDesa = in_array('admin desa', $roles, true)
            || in_array('dasawisma', $roles, true);

        $rules = [];
        if ($needsKecamatan) {
            $rules['kecamatan'] = ['required', Rule::in(WilayahDesa::kecamatanList())];
        }

        if ($needsDesa) {
            $availableDesa = $this->desaByKecamatan()[$request->input('kecamatan')] ?? [];
            $rules['desa'] = ['required', 'string', Rule::in($availableDesa)];
        }

        if ($rules !== []) {
            $request->validate($rules, [
                'kecamatan.required' => 'Pilih kecamatan untuk akun ini.',
                'kecamatan.in' => 'Pilih kecamatan yang tersedia.',
                'desa.required' => 'Pilih desa untuk akun ini.',
                'desa.in' => 'Desa harus sesuai dengan kecamatan yang dipilih.',
            ]);
        }
    }
}
