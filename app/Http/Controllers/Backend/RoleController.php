<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\RoleRequest;
use App\Services\ActivityLogger;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    // Proteksi via routes/web.php (role:super-admin). Constructor
    // $this->middleware() dihapus karena tidak didukung Laravel 12.

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

        // Pastikan role esensial ada (tanpa membuat akun default berpassword
        // lemah — akun dibuat hanya via seeder).
        Role::firstOrCreate(['name' => 'dasawisma', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'super-admin', 'guard_name' => 'web']);

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
        ActivityLogger::log('role.create', null, "Role dibuat: {$role->name}");

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
        if (in_array($role->name, ['super-admin', 'admin'], true) && $request->name !== $role->name) {
            return redirect()->route('be.roles.index')
                ->with('error', 'Role sistem tidak boleh diganti namanya.');
        }

        $role->update(['name' => $request->name]);
        $role->syncPermissions($request->permissions ?? []);
        ActivityLogger::log('role.update', null, "Role diubah: {$role->name}");

        return redirect()->route('be.roles.index')
            ->with('success', 'Role berhasil diubah');
    }

    /**
     * Remove the specified role from storage.
     */
    public function destroy(Role $role): RedirectResponse
    {
        if (in_array($role->name, ['admin', 'super-admin'], true)) {
            return redirect()->route('be.roles.index')
                ->with('error', 'Role ' . $role->name . ' tidak dapat dihapus');
        }

        $role->syncPermissions([]);
        $role->users()->detach();
        $role->delete();
        ActivityLogger::log('role.delete', null, "Role dihapus: {$role->name}");

        return redirect()->route('be.roles.index')
            ->with('success', 'Role berhasil dihapus');
    }
}
