<?php

namespace App\Http\Controllers\Backend;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

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
        ]);
    }

    /**
     * STORE — Simpan user baru
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'roles' => 'required|array',
            'kecamatan' => 'nullable|string|max:255',
            'desa' => 'nullable|string|max:255',
            'nama_desa' => 'nullable|string|max:255',
        ]);

        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),  // ✅ pakai Hash
            'kecamatan' => $request->kecamatan,
            'desa' => $request->desa,
            'nama_desa' => $request->nama_desa,
            'status' => 'active',
        ]);

        $user->assignRole($request->roles);

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
        ]);
    }

    /**
     * UPDATE — Perbarui user
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,' . $user->id,
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
            'roles' => 'required|array',
            'kecamatan' => 'nullable|string|max:255',
            'desa' => 'nullable|string|max:255',
            'nama_desa' => 'nullable|string|max:255',
        ]);

        $data = [
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'kecamatan' => $request->kecamatan,
            'desa' => $request->desa,
            'nama_desa' => $request->nama_desa,
        ];

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);  // ✅ pakai Hash
        }

        $user->update($data);
        $user->syncRoles($request->roles);

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
}
