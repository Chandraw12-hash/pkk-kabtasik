<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CatatanKeluarga;
use App\Models\DaftarWarga;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

// Alur sama seperti DasawismaDaftarWargaController:
// kader (dasawisma) input via Flutter -> status pending ->
// approve/reject lewat web Admin Desa -> terus ke kecamatan -> kabupaten.
//
// CatatanKeluarga tidak punya kolom wilayah sendiri — scoping lewat
// relasi daftarWarga (kecamatan + desa).
class DasawismaCatatanKeluargaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        abort_unless($user->hasAnyRole(['dasawisma', 'admin desa']), 403);
        $this->ensureUserRegion($user);

        $query = CatatanKeluarga::query()
            ->whereHas('daftarWarga', function (Builder $parent) use ($user): void {
                $parent->where('kecamatan', $user->kecamatan)
                    ->where('desa', $user->desa);
            })
            ->with([
                'daftarWarga:id,nama_kepala_keluarga,desa,dusun,rt,rw,dasawisma,kecamatan',
                'approvedBy:id,name',
            ])
            ->latest();

        if ($user->hasRole('dasawisma')) {
            $query->where('created_by', $user->id);
        }

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where(function ($builder) use ($search): void {
                $builder->where('nama_anggota', 'like', "%{$search}%")
                    ->orWhere('nik', 'like', "%{$search}%")
                    ->orWhere('pendidikan', 'like', "%{$search}%")
                    ->orWhere('pekerjaan', 'like', "%{$search}%");
            });
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

        $record = $this->scopedQuery($user)
            ->with([
                'daftarWarga:id,nama_kepala_keluarga,desa,dusun,rt,rw,dasawisma,kecamatan',
                'approvedBy:id,name',
            ])
            ->find($id);
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
        $this->ensureOwnRegionKK($user, (int) $validated['daftar_warga_id']);

        $record = CatatanKeluarga::create($validated + [
            'status' => 'pending',
            'created_by' => $user->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Anggota keluarga berhasil dikirim untuk persetujuan.',
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
        $this->ensureOwnRegionKK($user, (int) $validated['daftar_warga_id']);

        $record->update($validated + [
            'status' => 'pending',
            'rejected_reason' => null,
            'approved_by' => null,
            'approved_at' => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Anggota keluarga berhasil diperbarui.',
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
            'message' => 'Anggota keluarga berhasil dihapus.',
        ]);
    }

    /**
     * Validasi mengikuti DasawismaResourceCatalog 'catatan-keluarga'.
     */
    private function rules(): array
    {
        return [
            'daftar_warga_id' => ['required', 'integer', 'exists:daftar_wargas,id'],
            'nama_anggota' => ['required', 'string', 'max:255'],
            'nik' => ['nullable', 'string', 'max:32'],
            'jenis_kelamin' => ['nullable', Rule::in(['L', 'P'])],
            'tanggal_lahir' => ['nullable', 'date'],
            'umur' => ['nullable', 'integer', 'min:0', 'max:120'],
            'hubungan_keluarga' => ['required', Rule::in(['kepala', 'istri', 'anak'])],
            'pendidikan' => ['nullable', 'string', 'max:255'],
            'pekerjaan' => ['nullable', 'string', 'max:255'],
            'status_perkawinan' => ['nullable', 'string', 'max:255'],
        ];
    }

    private function scopedQuery(User $user)
    {
        $query = CatatanKeluarga::query()
            ->whereHas('daftarWarga', function (Builder $parent) use ($user): void {
                $parent->where('kecamatan', $user->kecamatan)
                    ->where('desa', $user->desa);
            });

        if ($user->hasRole('dasawisma')) {
            $query->where('created_by', $user->id);
        }

        return $query;
    }

    private function ensureUserRegion(User $user): void
    {
        abort_if(
            empty($user->kecamatan) || empty($user->desa),
            403,
            'Akun Dasawisma belum memiliki kecamatan dan desa. Hubungi Admin Desa.',
        );
    }

    private function ensureOwnRegionKK(User $user, int $daftarWargaId): void
    {
        $exists = DaftarWarga::query()
            ->where('kecamatan', $user->kecamatan)
            ->where('desa', $user->desa)
            ->whereKey($daftarWargaId)
            ->exists();

        abort_if(! $exists, 422, 'Kepala keluarga tidak ditemukan di desa Anda.');
    }

    private function ownedEditableRecord(User $user, int $id): CatatanKeluarga
    {
        $record = $this->scopedQuery($user)->findOrFail($id);

        abort_if($record->status === 'approved', 403, 'Data yang sudah disetujui tidak dapat diubah.');

        return $record;
    }
}
