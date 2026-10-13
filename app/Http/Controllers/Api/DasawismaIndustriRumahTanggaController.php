<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\IndustriRumahTangga;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

// Alur sama seperti DasawismaDaftarWargaController:
// kader (dasawisma) input via Flutter -> status pending ->
// approve/reject lewat web Admin Desa -> terus ke kecamatan -> kabupaten.
class DasawismaIndustriRumahTanggaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        abort_unless($user->hasAnyRole(['dasawisma', 'admin desa']), 403);
        $this->ensureUserRegion($user);

        $query = IndustriRumahTangga::query()
            ->where('kecamatan', $user->kecamatan)
            ->where('desa', $user->desa)
            ->with('approvedBy:id,name')
            ->latest();

        if ($user->hasRole('dasawisma')) {
            $query->where('created_by', $user->id);
        }

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where(function ($builder) use ($search): void {
                $builder->where('jenis_industri', 'like', "%{$search}%")
                    ->orWhere('pemilik', 'like', "%{$search}%")
                    ->orWhere('dusun', 'like', "%{$search}%")
                    ->orWhere('dasawisma', 'like', "%{$search}%");
            });
        }

        if ($request->filled('desa')) {
            $query->where('desa', $request->string('desa')->toString());
        }

        return response()->json([
            'success' => true,
            'data' => $query->paginate(min(max($request->integer('per_page', 50), 1), 100)),
        ]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        abort_unless($user->hasAnyRole(['dasawisma', 'admin desa']), 403);
        $this->ensureUserRegion($user);

        $query = IndustriRumahTangga::query()
            ->where('kecamatan', $user->kecamatan)
            ->where('desa', $user->desa)
            ->with('approvedBy:id,name');

        if ($user->hasRole('dasawisma')) {
            $query->where('created_by', $user->id);
        }

        $record = $query->find($id);
        abort_if($record === null, 404, 'Data tidak ditemukan.');

        return response()->json([
            'success' => true,
            'data' => $record,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        abort_unless($user->hasRole('dasawisma'), 403);
        $this->ensureUserRegion($user);

        $validated = $request->validate($this->rules());

        $record = IndustriRumahTangga::create($validated + [
            'kecamatan' => $user->kecamatan,
            'desa' => $user->desa,
            'status' => 'pending',
            'created_by' => $user->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Industri rumah tangga berhasil dikirim untuk persetujuan.',
            'data' => $record,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        abort_unless($user->hasRole('dasawisma'), 403);
        $this->ensureUserRegion($user);

        $record = $this->ownedEditableRecord($user, $id);
        $validated = $request->validate($this->rules());

        $record->update($validated + [
            'status' => 'pending',
            'rejected_reason' => null,
            'approved_by' => null,
            'approved_at' => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Industri rumah tangga berhasil diperbarui.',
            'data' => $record->refresh(),
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        abort_unless($user->hasRole('dasawisma'), 403);
        $this->ensureUserRegion($user);

        $this->ownedEditableRecord($user, $id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Industri rumah tangga berhasil dihapus.',
        ]);
    }

    /**
     * Validasi mengikuti DasawismaResourceCatalog 'industri-rumah-tangga'.
     */
    private function rules(): array
    {
        return [
            'dusun' => ['nullable', 'string', 'max:255'],
            'rw' => ['nullable', 'string', 'max:20'],
            'rt' => ['nullable', 'string', 'max:20'],
            'dasawisma' => ['nullable', 'string', 'max:255'],
            'kategori' => ['nullable', Rule::in(\App\Models\IndustriRumahTangga::KATEGORI)],
            'jenis_industri' => ['required', 'string', 'max:255'],
            'pemilik' => ['required', 'string', 'max:255'],
            'jumlah_tenaga_kerja' => ['required', 'integer', 'min:0'],
            'omzet' => ['nullable', 'numeric', 'min:0'],
        ];
    }

    private function ensureUserRegion(User $user): void
    {
        abort_if(
            empty($user->kecamatan) || empty($user->desa),
            403,
            'Akun Dasawisma belum memiliki kecamatan dan desa. Hubungi Admin Desa.',
        );
    }

    private function ownedEditableRecord(User $user, int $id): IndustriRumahTangga
    {
        $record = IndustriRumahTangga::query()
            ->where('kecamatan', $user->kecamatan)
            ->where('desa', $user->desa)
            ->where('created_by', $user->id)
            ->findOrFail($id);

        abort_if($record->status === 'approved', 403, 'Data yang sudah disetujui tidak dapat diubah.');

        return $record;
    }
}
