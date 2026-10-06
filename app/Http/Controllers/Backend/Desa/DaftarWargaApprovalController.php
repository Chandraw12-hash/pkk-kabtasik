<?php

namespace App\Http\Controllers\Backend\Desa;

use App\Http\Controllers\Controller;
use App\Models\DaftarWarga;
use App\Models\User;
use App\Notifications\DasawismaRecordNotification;
use App\Services\DaftarWargaDataUmumSyncService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DaftarWargaApprovalController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $baseQuery = $this->scopedQuery($user);
        $stats = [
            'total' => (clone $baseQuery)->count(),
            'pending' => (clone $baseQuery)->where('status', 'pending')->count(),
            'approved' => (clone $baseQuery)->where('status', 'approved')->count(),
            'rejected' => (clone $baseQuery)->where('status', 'rejected')->count(),
        ];

        $search = trim((string) $request->query('search', ''));
        $status = (string) $request->query('status', 'pending');
        $query = clone $baseQuery;

        if ($search !== '') {
            $query->where(function (Builder $builder) use ($search): void {
                $builder->where('nama_kepala_keluarga', 'like', '%'.$search.'%')
                    ->orWhere('nik', 'like', '%'.$search.'%')
                    ->orWhere('no_kk', 'like', '%'.$search.'%')
                    ->orWhere('alamat', 'like', '%'.$search.'%')
                    ->orWhere('dasawisma', 'like', '%'.$search.'%');
            });
        }

        if (in_array($status, ['pending', 'approved', 'rejected'], true)) {
            $query->where('status', $status);
        } else {
            $status = 'all';
        }

        $records = $query->with(['createdBy:id,name', 'approvedBy:id,name'])
                ->latest('id')
                ->paginate(15)
                ->withQueryString()
                ->through(fn (DaftarWarga $record): array => [
                    'id' => $record->id,
                    'nama_kepala_keluarga' => $record->nama_kepala_keluarga,
                    'nik' => $record->nik,
                    'no_kk' => $record->no_kk,
                    'dusun' => $record->dusun,
                    'rt' => $record->rt,
                    'rw' => $record->rw,
                    'dasawisma' => $record->dasawisma,
                    'alamat' => $record->alamat,
                    'jumlah_anggota' => $record->jumlah_anggota,
                    'jumlah_kk' => $record->jumlah_kk,
                    'jumlah_laki_laki' => $record->jumlah_laki_laki,
                    'jumlah_perempuan' => $record->jumlah_perempuan,
                    'status' => $record->status,
                    'rejected_reason' => $record->rejected_reason,
                    'created_by_name' => $record->createdBy?->name,
                    'approved_by_name' => $record->approvedBy?->name,
                ]);

        return Inertia::render('Backend/Desa/DaftarWarga/Index', [
            'records' => $records,
            'stats' => $stats,
            'filters' => ['search' => $search, 'status' => $status],
            'flash' => ['success' => session('success'), 'error' => session('error')],
        ]);
    }

    public function approve(
        Request $request,
        int $id,
        DaftarWargaDataUmumSyncService $syncService,
    ): RedirectResponse
    {
        $record = DB::transaction(function () use ($request, $id, $syncService): DaftarWarga {
            $record = $this->pendingRecord($request, $id, lock: true);
            $record->forceFill([
                'status' => 'approved',
                'approved_by' => $request->user()->id,
                'approved_at' => now(),
                'rejected_reason' => null,
            ])->save();

            $syncService->syncApprovedRecord($record);

            return $record;
        });

        $this->notifyOwner($record, 'Data KK Anda telah disetujui Admin Desa.');

        return back()->with('success', 'Data KK berhasil disetujui.');
    }

    public function reject(Request $request, int $id): RedirectResponse
    {
        $validated = $request->validate([
            'reason' => ['required', 'string', 'max:2000'],
        ]);
        $record = $this->pendingRecord($request, $id);
        $record->forceFill([
            'status' => 'rejected',
            'approved_by' => null,
            'approved_at' => null,
            'rejected_reason' => $validated['reason'],
        ])->save();

        $this->notifyOwner(
            $record,
            'Data KK perlu diperbaiki: '.$validated['reason'],
        );

        return back()->with('success', 'Data KK ditolak dan alasan dikirim ke petugas Dasawisma.');
    }

    private function scopedQuery(User $user): Builder
    {
        return DaftarWarga::query()
            ->where('kecamatan', $user->kecamatan)
            ->where('desa', $user->desa);
    }

    private function pendingRecord(
        Request $request,
        int $id,
        bool $lock = false,
    ): DaftarWarga
    {
        $query = $this->scopedQuery($request->user())
            ->where('status', 'pending')
            ->whereKey($id);

        return ($lock ? $query->lockForUpdate() : $query)->firstOrFail();
    }

    private function notifyOwner(DaftarWarga $record, string $message): void
    {
        User::query()->find($record->created_by)?->notify(
            new DasawismaRecordNotification(
                $message,
                '/dasawisma/daftar-warga',
                $record->id,
            ),
        );
    }
}
