<?php

namespace App\Http\Controllers\Backend\Desa;

use App\Http\Controllers\Controller;
use App\Models\DataUmumPkk;
use App\Models\DaftarWarga;
use App\Imports\DataUmumPkkImport;
use App\Exports\DataUmumPkkTemplateExport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class DataUmumDesaController extends Controller
{
    /**
     * List data umum PKK desa
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $tahun = (int) $request->input('tahun', date('Y'));

        // ══════════════════════════════════════════════════════
        // 1. AGREGAT DESA — 1 baris
        // ══════════════════════════════════════════════════════
        $aggregateDesa = $this->getOrCreateAggregateDesa($user, $tahun);

        // ══════════════════════════════════════════════════════
        // 2. PER DUSUN — list dari input kader
        // ══════════════════════════════════════════════════════
        $queryDusun = DataUmumPkk::query()
            ->where('kecamatan', $user->kecamatan)
            ->where('desa', $user->desa)
            ->where('tahun', $tahun)
            ->whereNotNull('dusun');

        if ($request->filled('search')) {
            $search = $request->search;
            $queryDusun->where(function ($q) use ($search) {
                $q->where('nama_dusun', 'ilike', "%{$search}%")
                  ->orWhere('dusun', 'ilike', "%{$search}%");
            });
        }

        $dataDusun = $queryDusun->orderBy('dusun')
            ->paginate(15)
            ->withQueryString();

        // ══════════════════════════════════════════════════════
        // 3. STATISTIK
        // ══════════════════════════════════════════════════════
        $statsQuery = DataUmumPkk::query()
            ->where('kecamatan', $user->kecamatan)
            ->where('desa', $user->desa)
            ->where('tahun', $tahun)
            ->whereNotNull('dusun');

        if ($request->filled('search')) {
            $search = $request->search;
            $statsQuery->where(function ($q) use ($search) {
                $q->where('nama_dusun', 'ilike', "%{$search}%")
                  ->orWhere('dusun', 'ilike', "%{$search}%");
            });
        }

        $stats = [
            'total_dusun' => (clone $statsQuery)->count(),
            'total_kk' => (int) ((clone $statsQuery)->sum('jumlah_kk') ?? 0),
            'total_jiwa' => (int) ((clone $statsQuery)->sum('jiwa_l') ?? 0)
                + (int) ((clone $statsQuery)->sum('jiwa_p') ?? 0)
                + (int) ((clone $statsQuery)->sum('jiwa_tidak_terpilah') ?? 0),
            'total_dasa_wisma' => (int) ((clone $statsQuery)->sum('jumlah_dasa_wisma') ?? 0),
        ];

        return Inertia::render('Backend/Desa/DataUmum/Index', [
            'aggregateDesa' => $aggregateDesa,
            'dataDusun' => $dataDusun,
            'stats' => $stats,
            'filters' => $request->only(['tahun', 'search']),
        ]);
    }

    /**
     * ✅ Form edit agregat desa
     */
    public function editDesa(Request $request)
    {
        $user = auth()->user();
        $tahun = (int) $request->input('tahun', date('Y'));

        // Sync dulu — biar auto-count fresh
        $aggregate = $this->getOrCreateAggregateDesa($user, $tahun);
        $autoFields = $this->recalculateAggregate($user, $tahun);
        $aggregate->update($autoFields);

        return Inertia::render('Backend/Desa/DataUmum/EditDesa', [
            'data' => $aggregate->fresh(),
        ]);
    }

    /**
     * ✅ Update agregat desa
     * ⚠️ Hanya field MANUAL yang bisa diubah
     * ⚠️ Field AUTO di-recalculate otomatis
     * ⚠️ Kecamatan status → RESET jadi 'pending'
     */
    public function updateDesa(Request $request)
    {
        $user = auth()->user();
        $tahun = (int) $request->input('tahun', date('Y'));

        $aggregate = $this->getOrCreateAggregateDesa($user, $tahun);

        // ✅ Cuma field MANUAL yang divalidasi
        $validated = $request->validate([
            'tahun' => ['required', 'integer', 'min:2020', 'max:2099'],
            // Kader & Sekretariat — manual
            'tp_pkk_l' => ['nullable', 'integer', 'min:0'],
            'tp_pkk_p' => ['nullable', 'integer', 'min:0'],
            'kader_umum_l' => ['nullable', 'integer', 'min:0'],
            'kader_umum_p' => ['nullable', 'integer', 'min:0'],
            'kader_khusus_l' => ['nullable', 'integer', 'min:0'],
            'kader_khusus_p' => ['nullable', 'integer', 'min:0'],
            'sekretariat_honorer_l' => ['nullable', 'integer', 'min:0'],
            'sekretariat_honorer_p' => ['nullable', 'integer', 'min:0'],
            'sekretariat_bantuan_l' => ['nullable', 'integer', 'min:0'],
            'sekretariat_bantuan_p' => ['nullable', 'integer', 'min:0'],
            'keterangan' => ['nullable', 'string', 'max:2000'],
        ]);

        // ✅ AUTO FIELDS — override dari input user
        $autoFields = $this->recalculateAggregate($user, $tahun);

        $aggregate->update(array_merge(
            $validated,
            $autoFields,
            [
                'updated_by' => $user->id,
                // ✅ RESET status kecamatan — biar kecamatan review ulang
                'kecamatan_status' => 'pending',
                'kecamatan_rejected_reason' => null,
            ]
        ));

        return redirect()
            ->route('desa.data-umum.index', ['tahun' => $tahun])
            ->with('success', '✅ Data agregat desa berhasil diperbarui. Menunggu review kecamatan.');
    }

    /**
     * ✅ Sync agregat desa
     */
    public function syncAggregate(Request $request)
    {
        $user = auth()->user();
        $tahun = (int) $request->input('tahun', date('Y'));

        $aggregate = $this->getOrCreateAggregateDesa($user, $tahun);
        $autoFields = $this->recalculateAggregate($user, $tahun);

        $aggregate->update(array_merge($autoFields, [
            'updated_by' => $user->id,
            // ✅ RESET status kecamatan
            'kecamatan_status' => 'pending',
            'kecamatan_rejected_reason' => null,
        ]));

        return redirect()
            ->route('desa.data-umum.index', ['tahun' => $tahun])
            ->with('success', '✅ Agregat desa berhasil disinkronkan. Menunggu review kecamatan.');
    }

    /**
     * ══════════════════════════════════════════════════════════
     * HELPER — Get or create agregat desa
     * ══════════════════════════════════════════════════════════
     */
    private function getOrCreateAggregateDesa($user, int $tahun): DataUmumPkk
    {
        $aggregate = DataUmumPkk::where('kecamatan', $user->kecamatan)
            ->where('desa', $user->desa)
            ->where('tahun', $tahun)
            ->where('level', 'desa')
            ->whereNull('dusun')
            ->first();

        if (!$aggregate) {
            $autoFields = $this->recalculateAggregate($user, $tahun);

            $aggregate = DataUmumPkk::create(array_merge($autoFields, [
                'kecamatan' => $user->kecamatan,
                'nama_kecamatan' => $user->kecamatan,
                'desa' => $user->desa,
                'nama_desa' => $user->nama_desa ?? $user->desa,
                'dusun' => null,
                'nama_dusun' => null,
                'level' => 'desa',
                'tahun' => $tahun,
                'created_by' => $user->id,
                'updated_by' => $user->id,
                // ✅ Default status kecamatan: pending
                'kecamatan_status' => 'pending',
            ]));
        }

        return $aggregate;
    }

    /**
     * ══════════════════════════════════════════════════════════
     * HELPER — Auto-count dari KK + SUM dari DataUmumPkk
     * ══════════════════════════════════════════════════════════
     */
    private function recalculateAggregate($user, int $tahun): array
    {
        // ══════════════════════════════════════════════════════
        // A. COUNT DISTINCT dari KK (DaftarWarga)
        // ══════════════════════════════════════════════════════
        $kkQuery = DaftarWarga::where('kecamatan', $user->kecamatan)
            ->where('desa', $user->desa)
            ->where('status', 'approved');

        $jumlahDusun = (clone $kkQuery)
            ->whereNotNull('dusun')
            ->distinct()
            ->count('dusun');

        $jumlahPkkRw = (clone $kkQuery)
            ->whereNotNull('rw')
            ->distinct()
            ->count('rw');

        $jumlahPkkRt = (clone $kkQuery)
            ->whereNotNull('rt')
            ->distinct()
            ->count('rt');

        $jumlahDasaWisma = (clone $kkQuery)
            ->whereNotNull('dasawisma')
            ->distinct()
            ->count('dasawisma');

        // ══════════════════════════════════════════════════════
        // B. SUM dari DataUmumPkk per dusun
        // ══════════════════════════════════════════════════════
        $dusunQuery = DataUmumPkk::where('kecamatan', $user->kecamatan)
            ->where('desa', $user->desa)
            ->where('tahun', $tahun)
            ->whereNotNull('dusun');

        return [
            'jumlah_dusun' => (int) ($jumlahDusun ?? 0),
            'jumlah_pkk_rw' => (int) ($jumlahPkkRw ?? 0),
            'jumlah_pkk_rt' => (int) ($jumlahPkkRt ?? 0),
            'jumlah_dasa_wisma' => (int) ($jumlahDasaWisma ?? 0),

            'jumlah_krt' => (int) ((clone $dusunQuery)->sum('jumlah_krt') ?? 0),
            'jumlah_kk' => (int) ((clone $dusunQuery)->sum('jumlah_kk') ?? 0),
            'jiwa_l' => (int) ((clone $dusunQuery)->sum('jiwa_l') ?? 0),
            'jiwa_p' => (int) ((clone $dusunQuery)->sum('jiwa_p') ?? 0),
            'jiwa_tidak_terpilah' => (int) ((clone $dusunQuery)->sum('jiwa_tidak_terpilah') ?? 0),
        ];
    }

    /**
     * ✅ Form edit Data Umum PKK per dusun
     */
    public function edit(int $id)
    {
        $user = auth()->user();

        $data = DataUmumPkk::where('id', $id)
            ->where('kecamatan', $user->kecamatan)
            ->where('desa', $user->desa)
            ->firstOrFail();

        return Inertia::render('Backend/Desa/DataUmum/Edit', [
            'data' => $data,
        ]);
    }

    /**
     * ✅ Update Data Umum PKK per dusun
     * ⚠️ Setelah update — agregat desa di-recalculate
     * ⚠️ Status kecamatan di-reset jadi 'pending'
     */
    public function update(Request $request, int $id)
    {
        $user = auth()->user();

        $data = DataUmumPkk::where('id', $id)
            ->where('kecamatan', $user->kecamatan)
            ->where('desa', $user->desa)
            ->firstOrFail();

        $validated = $request->validate([
            'tahun' => ['required', 'integer', 'min:2020', 'max:2099'],
            'dusun' => ['nullable', 'string', 'max:255'],
            'nama_dusun' => ['nullable', 'string', 'max:255'],
            'jumlah_krt' => ['nullable', 'integer', 'min:0'],
            'jumlah_kk' => ['nullable', 'integer', 'min:0'],
            'jiwa_l' => ['nullable', 'integer', 'min:0'],
            'jiwa_p' => ['nullable', 'integer', 'min:0'],
            'jiwa_tidak_terpilah' => ['nullable', 'integer', 'min:0'],
            'keterangan' => ['nullable', 'string', 'max:2000'],
        ]);

        $data->update(array_merge($validated, [
            'updated_by' => $user->id,
        ]));

        // Recalculate agregat desa
        $this->recalculateAndUpdateAggregate($user, $data->tahun);

        // ✅ RESET status kecamatan — data berubah
        $this->resetKecamatanStatus($user, $data->tahun);

        return redirect()
            ->route('desa.data-umum.index', ['tahun' => $data->tahun])
            ->with('success', '✅ Data Umum PKK dusun berhasil diperbarui. Menunggu review kecamatan.');
    }

    /**
     * Helper — recalculate & save agregat desa
     */
    private function recalculateAndUpdateAggregate($user, int $tahun): void
    {
        $aggregate = DataUmumPkk::where('kecamatan', $user->kecamatan)
            ->where('desa', $user->desa)
            ->where('tahun', $tahun)
            ->where('level', 'desa')
            ->whereNull('dusun')
            ->first();

        if ($aggregate) {
            $autoFields = $this->recalculateAggregate($user, $tahun);
            $aggregate->update(array_merge($autoFields, [
                'updated_by' => $user->id,
            ]));
        }
    }

    /**
     * ✅ Helper — Reset status kecamatan jadi pending
     * ⚠️ Dipanggil setiap desa edit/update/import — biar kecamatan review ulang
     */
    private function resetKecamatanStatus($user, int $tahun): void
    {
        DataUmumPkk::where('kecamatan', $user->kecamatan)
            ->where('desa', $user->desa)
            ->where('tahun', $tahun)
            ->where('level', 'desa')
            ->whereNull('dusun')
            ->update([
                'kecamatan_status' => 'pending',
                'kecamatan_rejected_reason' => null,
            ]);
    }

    /**
     * Halaman import data umum
     */
    public function import()
    {
        return Inertia::render('Backend/Desa/DataUmum/Import');
    }

    /**
     * Handle import Excel
     * ⚠️ Setelah import — agregat di-recalculate + status kecamatan di-reset
     */
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls|max:10240',
            'tahun' => 'nullable|integer',
            'level' => 'nullable|in:rt,rw,dusun,desa',
            'replace' => ['nullable', 'boolean'],
        ]);

        $user = auth()->user();
        $tahun = (int) $request->input('tahun', date('Y'));
        $level = $request->input('level', 'desa');
        $replace = $request->boolean('replace');

        try {
            DB::beginTransaction();

            if ($replace) {
                DataUmumPkk::where('kecamatan', $user->kecamatan)
                    ->where('desa', $user->desa)
                    ->where('tahun', $tahun)
                    ->where('level', $level)
                    ->whereNotNull('dusun')
                    ->delete();
            }

            $import = new DataUmumPkkImport(
                $user->kecamatan,
                $user->desa,
                $tahun,
                $level
            );

            Excel::import($import, $request->file('file'));

            // Recalculate agregat desa
            $this->recalculateAndUpdateAggregate($user, $tahun);

            // ✅ RESET status kecamatan
            $this->resetKecamatanStatus($user, $tahun);

            DB::commit();

            $success = $import->getSuccessCount();
            $skip = $import->getSkipCount();

            return redirect()
                ->route('desa.data-umum.index', ['tahun' => $tahun])
                ->with('success', "✅ Import berhasil! {$success} data masuk, {$skip} data di-skip. Menunggu review kecamatan.");

        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()
                ->back()
                ->with('error', '❌ Import gagal: ' . $e->getMessage());
        }
    }

    /**
     * Download template Excel
     */
    public function downloadTemplate()
    {
        $filename = 'Template-Data-Umum-PKK-' . date('Y-m-d') . '.xlsx';

        return Excel::download(
            new DataUmumPkkTemplateExport(),
            $filename
        );
    }
}
