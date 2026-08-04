<?php

namespace App\Http\Controllers\Backend;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:view-users')->only('index');
        $this->middleware('permission:create-user')->only(['create', 'store']);
        $this->middleware('permission:edit-user')->only(['edit', 'update']);
        $this->middleware('permission:delete-user')->only('destroy');
    }
    public function index(Request $request)
    {
        $perPage = $request->per_page ?? 10;
        
        $users = User::query()
            ->with(['roles']) // Removed skpd
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('username', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
        
        return Inertia::render('Backend/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'per_page'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Backend/Users/Create', [
            'roles' => \Spatie\Permission\Models\Role::all(),
            // Removed skpds
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'roles' => 'required|array',
            // Removed skpd_id
        ]);

        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            // Removed skpd_id
        ]);

        $user->assignRole($request->roles);

        return redirect()->route('be.users.index')
            ->with('message', 'User berhasil dibuat!');
    }

    public function edit(User $user)
    {
        return Inertia::render('Backend/Users/Edit', [
            'user' => $user->load(['roles']), // Removed skpd
            'roles' => \Spatie\Permission\Models\Role::all(),
            'userRoles' => $user->getRoleNames(),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,' . $user->id,
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
            'roles' => 'required|array',
        ]);

        $data = [
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
        ];

        if ($request->filled('password')) {
            $data['password'] = bcrypt($request->password);
        }

        $user->update($data);
        $user->syncRoles($request->roles);

        return redirect()->route('be.users.index')
            ->with('message', 'User berhasil diperbarui!');
    }

    public function destroy(User $user)
    {
        // Proteksi: Jangan biarkan user menghapus dirinya sendiri
        if (auth()->id() === $user->id) {
            return back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri!');
        }

        $user->delete();

        return redirect()->route('be.users.index')
            ->with('message', 'User berhasil dihapus!');
    }
}
