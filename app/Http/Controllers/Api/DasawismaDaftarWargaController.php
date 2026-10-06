<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DaftarWarga;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;

class DasawismaDaftarWargaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        abort_unless($user->hasAnyRole(['dasawisma', 'admin desa']), 403);
        $this->ensureUserRegion($user);

        $query = DaftarWarga::query()
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
                $builder->where('nama_kepala_keluarga', 'like', "%{$search}%")
                    ->orWhere('nik', 'like', "%{$search}%")
                    ->orWhere('no_kk', 'like', "%{$search}%")
                    ->orWhere('alamat', 'like', "%{$search}%");
            });
        }

        return response()->json([
            'success' => true,
            'data' => $query->paginate(min(max($request->integer('per_page', 50), 1), 100)),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        abort_unless($user->hasRole('dasawisma'), 403);
        $this->ensureUserRegion($user);

        $validated = $request->validate([
            'nama_kepala_keluarga' => ['required', 'string', 'max:255'],
            'nik' => ['nullable', 'string', 'max:32'],
            'no_kk' => ['nullable', 'string', 'max:32'],
            'dusun' => ['nullable', 'string', 'max:255'],
            'rt' => ['nullable', 'string', 'max:20'],
            'rw' => ['nullable', 'string', 'max:20'],
            'dasawisma' => ['nullable', 'string', 'max:255'],
            'alamat' => ['nullable', 'string', 'max:2000'],
            'jumlah_anggota' => ['required', 'integer', 'min:1'],
            'jumlah_kk' => ['sometimes', 'integer', 'min:1'],
            'jumlah_laki_laki' => ['nullable', 'integer', 'min:0'],
            'jumlah_perempuan' => ['nullable', 'integer', 'min:0'],
            'kategori' => ['required', Rule::in(['warga', 'kader', 'pengurus'])],
        ]);
        $this->validateGenderCounts($validated);

        $record = DaftarWarga::create($validated + [
            'kecamatan' => $user->kecamatan,
            'desa' => $user->desa,
            'status' => 'pending',
            'created_by' => $user->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data warga berhasil dikirim untuk persetujuan.',
            'data' => $record,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        abort_unless($user->hasRole('dasawisma'), 403);
        $this->ensureUserRegion($user);

        $record = $this->ownedPendingRecord($user, $id);
        $validated = $request->validate([
            'nama_kepala_keluarga' => ['required', 'string', 'max:255'],
            'nik' => ['nullable', 'string', 'max:32'],
            'no_kk' => ['nullable', 'string', 'max:32'],
            'dusun' => ['nullable', 'string', 'max:255'],
            'rt' => ['nullable', 'string', 'max:20'],
            'rw' => ['nullable', 'string', 'max:20'],
            'dasawisma' => ['nullable', 'string', 'max:255'],
            'alamat' => ['nullable', 'string', 'max:2000'],
            'jumlah_anggota' => ['required', 'integer', 'min:1'],
            'jumlah_kk' => ['sometimes', 'integer', 'min:1'],
            'jumlah_laki_laki' => ['nullable', 'integer', 'min:0'],
            'jumlah_perempuan' => ['nullable', 'integer', 'min:0'],
            'kategori' => ['required', Rule::in(['warga', 'kader', 'pengurus'])],
        ]);
        $this->validateGenderCounts($validated);

        $record->update($validated + [
            'status' => 'pending',
            'rejected_reason' => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data warga berhasil diperbarui.',
            'data' => $record->refresh(),
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        abort_unless($user->hasRole('dasawisma'), 403);
        $this->ensureUserRegion($user);

        $this->ownedPendingRecord($user, $id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data warga berhasil dihapus.',
        ]);
    }

    private function ensureUserRegion(User $user): void
    {
        abort_if(
            empty($user->kecamatan) || empty($user->desa),
            403,
            'Akun Dasawisma belum memiliki kecamatan dan desa. Hubungi Admin Desa.',
        );
    }

    private function validateGenderCounts(array $validated): void
    {
        $genderCount = (int) ($validated['jumlah_laki_laki'] ?? 0)
            + (int) ($validated['jumlah_perempuan'] ?? 0);

        if ($genderCount > (int) $validated['jumlah_anggota']) {
            throw ValidationException::withMessages([
                'jumlah_anggota' => 'Jumlah Laki-laki dan Perempuan tidak boleh melebihi jumlah anggota.',
            ]);
        }
    }

    private function ownedPendingRecord(User $user, int $id): DaftarWarga
    {
        $record = DaftarWarga::query()
            ->where('kecamatan', $user->kecamatan)
            ->where('desa', $user->desa)
            ->where('created_by', $user->id)
            ->findOrFail($id);

        abort_if($record->status === 'approved', 403, 'Data yang sudah disetujui tidak dapat diubah.');

        return $record;
    }
}
