<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RekapBumilDasaWisma;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

// Alur sama seperti DasawismaDaftarWargaController:
// kader (dasawisma) input via Flutter -> status pending ->
// approve/reject lewat web (desa/kecamatan) -> rekap otomatis -> kabupaten.
//
// 1 baris = 1 ibu + 1 status per bulan (hamil/melahirkan/nifas/meninggal).
class DasawismaBumilController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        abort_unless($user->hasAnyRole(['dasawisma', 'admin desa']), 403);
        $this->ensureUserRegion($user);

        $query = RekapBumilDasaWisma::query()
            ->where('kecamatan', $user->kecamatan)
            ->where('desa', $user->desa)
            ->with('approvedBy:id,name')
            ->latest();

        if ($user->hasRole('dasawisma')) {
            $query->where('created_by', $user->id);
        }

        if ($request->filled('tahun')) {
            $query->where('tahun', $request->integer('tahun'));
        }

        if ($request->filled('bulan')) {
            $query->where('bulan', $request->integer('bulan'));
        }

        if ($request->filled('status_ibu')) {
            $query->where('status_ibu', $request->string('status_ibu')->toString());
        }

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where(function ($builder) use ($search): void {
                $builder->where('nama', 'like', "%{$search}%")
                    ->orWhere('bayi_nama', 'like', "%{$search}%")
                    ->orWhere('dusun', 'like', "%{$search}%");
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

        $query = RekapBumilDasaWisma::query()
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
        $this->ensureNoDuplicate($user, $validated);

        $record = RekapBumilDasaWisma::create($validated + [
            'kecamatan' => $user->kecamatan,
            'desa' => $user->desa,
            'status' => 'pending',
            'created_by' => $user->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data ibu berhasil dikirim untuk persetujuan.',
            'warnings' => $this->peringatan($user, $validated),
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
        $this->ensureNoDuplicate($user, $validated, $record->id);

        $record->update($validated + [
            'status' => 'pending',
            'rejected_reason' => null,
            'approved_by' => null,
            'approved_at' => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data ibu berhasil diperbarui.',
            'warnings' => $this->peringatan($user, $validated),
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
            'message' => 'Data ibu berhasil dihapus.',
        ]);
    }

    private function rules(): array
    {
        return [
            'tahun' => ['required', 'integer', 'min:2020', 'max:2100'],
            'bulan' => ['required', 'integer', 'min:1', 'max:12'],
            'dusun' => ['nullable', 'string', 'max:255'],
            'rw' => ['nullable', 'string', 'max:20'],
            'rt' => ['nullable', 'string', 'max:20'],
            'dasawisma' => ['nullable', 'string', 'max:255'],
            'nama' => ['required', 'string', 'max:255'],
            'suami_nama' => ['nullable', 'string', 'max:255'],
            'umur' => ['nullable', 'integer', 'min:10', 'max:60'],
            'status_ibu' => ['required', Rule::in(['hamil', 'melahirkan', 'nifas'])],
            // Kelahiran (kembar = 2 baris: ibu sama, bayi beda — diizinkan)
            'bayi_nama' => ['nullable', 'string', 'max:255'],
            'bayi_jenis_kelamin' => ['nullable', Rule::in(['L', 'P'])],
            'bayi_tanggal_lahir' => ['nullable', 'date', 'before_or_equal:today'],
            'bayi_akta' => ['nullable', 'boolean'],
            // Kematian (kategori terisi otomatis dari umur bila kosong)
            'kematian_kategori' => ['nullable', Rule::in(['ibu', 'bayi', 'balita'])],
            'kematian_umur_bulan' => ['nullable', 'integer', 'min:0', 'max:1200'],
            'kematian_nama' => ['nullable', 'string', 'max:255'],
            'kematian_jenis_kelamin' => ['nullable', Rule::in(['L', 'P'])],
            'kematian_tanggal' => ['nullable', 'date', 'before_or_equal:today'],
            'kematian_sebab' => ['nullable', 'string', 'max:2000'],
            'keterangan' => ['nullable', 'string', 'max:2000'],
            // Klinis lama (opsional, tetap didukung)
            'hamile' => ['nullable', 'integer', 'min:0'],
            'anak_ke' => ['nullable', 'integer', 'min:1'],
        ];
    }

    /**
     * Satu ibu satu status per bulan (aturan anti hitung ganda).
     * Pengecualian: melahirkan kembar = boleh >1 baris selama nama
     * bayi berbeda (satu baris per bayi).
     */
    private function ensureNoDuplicate(User $user, array $validated, ?int $exceptId = null): void
    {
        $query = RekapBumilDasaWisma::query()
            ->where('kecamatan', $user->kecamatan)
            ->where('desa', $user->desa)
            ->where('tahun', $validated['tahun'])
            ->where('bulan', $validated['bulan'])
            ->whereRaw('LOWER(nama) = ?', [strtolower(trim($validated['nama']))])
            ->where('status_ibu', $validated['status_ibu'])
            ->where('created_by', $user->id)
            ->when($exceptId !== null, fn ($q) => $q->where('id', '!=', $exceptId));

        // Kembar: beda nama bayi = baris sah yang berbeda.
        if (($validated['status_ibu'] ?? '') === 'melahirkan') {
            $bayi = strtolower(trim((string) ($validated['bayi_nama'] ?? '')));
            $query->whereRaw('LOWER(COALESCE(bayi_nama, \'\')) = ?', [$bayi]);
        }

        abort_if($query->exists(), 409, 'Ibu ini sudah tercatat dengan status yang sama di bulan tersebut.');
    }

    /**
     * Peringatan non-blokir (aturan nifas 42 hari): nifas dicatat tanpa
     * ada riwayat melahirkan 2 bulan terakhir oleh ibu yang sama.
     *
     * @return string[]
     */
    private function peringatan(User $user, array $validated): array
    {
        if (($validated['status_ibu'] ?? '') !== 'nifas') {
            return [];
        }

        $tahun = (int) $validated['tahun'];
        $bulan = (int) $validated['bulan'];
        $prevBulan = $bulan === 1 ? 12 : $bulan - 1;
        $prevTahun = $bulan === 1 ? $tahun - 1 : $tahun;

        $ada = RekapBumilDasaWisma::query()
            ->where('kecamatan', $user->kecamatan)
            ->where('desa', $user->desa)
            ->where('created_by', $user->id)
            ->whereRaw('LOWER(nama) = ?', [strtolower(trim($validated['nama']))])
            ->where('status_ibu', 'melahirkan')
            ->where(function ($q) use ($tahun, $bulan, $prevTahun, $prevBulan): void {
                $q->where(fn ($qq) => $qq->where('tahun', $tahun)->where('bulan', $bulan))
                    ->orWhere(fn ($qq) => $qq->where('tahun', $prevTahun)->where('bulan', $prevBulan));
            })
            ->exists();

        if (! $ada) {
            return ['Tidak ada catatan melahirkan ibu ini di bulan berjalan/sebelumnya. Periksa kembali status nifas (maksimal 42 hari pasca lahir).'];
        }

        return [];
    }

    private function ensureUserRegion(User $user): void
    {
        abort_if(
            empty($user->kecamatan) || empty($user->desa),
            403,
            'Akun Dasawisma belum memiliki kecamatan dan desa. Hubungi Admin Desa.',
        );
    }

    private function ownedEditableRecord(User $user, int $id): RekapBumilDasaWisma
    {
        $record = RekapBumilDasaWisma::query()
            ->where('kecamatan', $user->kecamatan)
            ->where('desa', $user->desa)
            ->where('created_by', $user->id)
            ->findOrFail($id);

        abort_if($record->status === 'approved', 403, 'Data yang sudah disetujui tidak dapat diubah.');

        return $record;
    }
}
