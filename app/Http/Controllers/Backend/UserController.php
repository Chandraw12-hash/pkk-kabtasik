<?php

namespace App\Http\Controllers\Backend;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * 39 Kecamatan Kabupaten Tasikmalaya
     */
    private const KECAMATAN_LIST = [
        'Bantarkalong', 'Bojongasih', 'Bojonggambir', 'Ciawi', 'Cibalong',
        'Cigalontang', 'Cikalong', 'Cikatomas', 'Cineam', 'Cipatujah',
        'Cisayong', 'Culamega', 'Gunungtanjung', 'Jamanis', 'Jatiwaras',
        'Kadipaten', 'Karangjaya', 'Karangnunggal', 'Leuwisari', 'Mangunreja',
        'Manonjaya', 'Padakembang', 'Pagerageung', 'Pancatengah', 'Parungponteng',
        'Puspahiang', 'Rajapolah', 'Salawu', 'Salopa', 'Sariwangi',
        'Singaparna', 'Sodonghilir', 'Sukahening', 'Sukaraja', 'Sukarame',
        'Sukaratu', 'Sukaresik', 'Tanjungjaya', 'Taraju',
    ];

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
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Backend/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'per_page', 'role', 'status'])
        ]);
    }

    /**
     * CREATE — Form tambah user
     */
    public function create()
    {
        return Inertia::render('Backend/Users/Create', [
            'roles' => \Spatie\Permission\Models\Role::all(),
            'kecamatanList' => self::KECAMATAN_LIST,
            'desaByKecamatan' => $this->desaByKecamatan(),
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
            'password' => 'required|string|min:8|confirmed',
            'roles' => 'required|array',
            'roles.*' => ['required', 'string', Rule::exists('roles', 'name')],
            'kecamatan' => ['nullable', 'string', 'max:255', Rule::in(self::KECAMATAN_LIST)],
            'desa' => ['nullable', 'string', 'max:255'],
            'nama_desa' => 'nullable|string|max:255',
        ]);

        $this->validateUserRegion($request, $validated['roles']);

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

        return redirect()->route('be.users.index')
            ->with('message', 'User berhasil dibuat!');
    }

    /**
     * EDIT — Form edit user
     */
    public function edit(User $user)
    {
        return Inertia::render('Backend/Users/Edit', [
            'user' => $user->load(['roles']),
            'roles' => \Spatie\Permission\Models\Role::all(),
            'userRoles' => $user->getRoleNames(),
            'kecamatanList' => self::KECAMATAN_LIST,
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
            'password' => 'nullable|string|min:8|confirmed',
            'roles' => 'required|array',
            'roles.*' => ['required', 'string', Rule::exists('roles', 'name')],
            'kecamatan' => ['nullable', 'string', 'max:255', Rule::in(self::KECAMATAN_LIST)],
            'desa' => ['nullable', 'string', 'max:255'],
            'nama_desa' => 'nullable|string|max:255',
        ]);

        $this->validateUserRegion($request, $validated['roles']);

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

        $user->delete();

        return redirect()->route('be.users.index')
            ->with('message', 'User berhasil dihapus!');
    }

    private function desaByKecamatan(): array
    {
        return User::role('admin desa')
            ->whereNotNull('kecamatan')
            ->whereNotNull('desa')
            ->get(['kecamatan', 'desa'])
            ->groupBy('kecamatan')
            ->map(fn ($users) => $users->pluck('desa')->unique()->sort()->values()->all())
            ->all();
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
            $rules['kecamatan'] = ['required', Rule::in(self::KECAMATAN_LIST)];
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
