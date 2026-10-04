<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\RoleRequest;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function __construct()
    {
        $this->middleware('role:admin');
    }

    /**
     * Display a listing of the roles.
     */
    public function index(Request $request)
    {
        $perPage = $request->per_page ?? 10;

        // Bersihkan dan hapus role 'pkk' secara otomatis
        $pkkRole = Role::where('name', 'pkk')->first();
        if ($pkkRole) {
            $pkkRole->syncPermissions([]);
            $pkkRole->users()->detach();
            $pkkRole->delete();
        }

        // Buat role 'dasawisma' (web) & akun default jika belum ada
        $dasawismaRole = Role::firstOrCreate(['name' => 'dasawisma', 'guard_name' => 'web']);
        $existingDasawisma = \App\Models\User::where('username', 'dasawisma')->first();
        if (!$existingDasawisma) {
            $userDasawisma = \App\Models\User::create([
                'name' => 'Kader Dasawisma',
                'username' => 'dasawisma',
                'email' => 'dasawisma@pkk.test',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                'status' => 'active',
            ]);
            $userDasawisma->syncRoles([$dasawismaRole]);
        }

        $roles = Role::with('permissions')
            ->withCount('users')
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Backend/Roles/Index', [
            'roles' => $roles,
            'filters' => $request->only(['search', 'per_page'])
        ]);
    }

    /**
     * Show the form for creating a new role.
     */
    public function create()
    {
        $permissions = Permission::all();
        return Inertia::render('Backend/Roles/Create', [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store a newly created role in storage.
     */
    public function store(RoleRequest $request): RedirectResponse
    {
        $role = Role::create(['name' => $request->name]);
        if ($request->filled('permissions')) {
            $role->syncPermissions($request->permissions);
        }
        return redirect()->route('be.roles.index')
            ->with('success', 'Role berhasil dibuat');
    }

    /**
     * Show the form for editing the specified role.
     */
    public function edit(Role $role)
    {
        $permissions = Permission::all();
        $role->load('permissions');
        return Inertia::render('Backend/Roles/Edit', [
            'role' => $role,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Update the specified role in storage.
     */
    public function update(RoleRequest $request, Role $role): RedirectResponse
    {
        $role->update(['name' => $request->name]);
        $role->syncPermissions($request->permissions ?? []);
        return redirect()->route('be.roles.index')
            ->with('success', 'Role berhasil diubah');
    }

    /**
     * Remove the specified role from storage.
     */
    public function destroy(Role $role): RedirectResponse
    {
        if ($role->name === 'admin') {
            return redirect()->route('be.roles.index')
                ->with('error', 'Role admin tidak dapat dihapus');
        }

        $role->syncPermissions([]);
        $role->users()->detach();
        $role->delete();

        return redirect()->route('be.roles.index')
            ->with('success', 'Role berhasil dihapus');
    }
}
