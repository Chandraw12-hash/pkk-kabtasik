<?php

namespace App\Http\Controllers\Backend\Dasawisma;

use App\Exports\DasawismaResourceExport;
use App\Exports\DasawismaKegiatanExcelExport;
use App\Http\Controllers\Controller;
use App\Imports\DasawismaRowsImport;
use App\Imports\DasawismaActivityRowsImport;
use App\Models\CatatanKeluarga;
use App\Models\DaftarWarga;
use App\Models\User;
use App\Notifications\DasawismaRecordNotification;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

abstract class DasawismaResourceController extends Controller
{
    abstract protected function resourceKey(): string;

    abstract protected function definition(): array;

    protected function modelClass(): string
    {
        return $this->definition()['model'];
    }

    protected function query(): Builder
    {
        $model = $this->modelClass();

        return $this->scopeQuery($model::query());
    }

    protected function scopeQuery(Builder $query): Builder
    {
        $user = request()->user();

        // Super Admin — lihat semua tanpa filter wilayah/status.
        if ($user->hasRole('super-admin')) {
            return $query;
        }

        if ($user->hasRole('admin')) {
            return $query->where('status', 'approved');
        }

        if ($this->resourceKey() === 'catatan-keluarga') {
            return $query->whereHas('daftarWarga', function (Builder $parent) use ($user) {
                if ($user->hasRole('kecamatan')) {
                    $parent->where('kecamatan', $user->kecamatan);
                } else {
                    $parent->where('kecamatan', $user->kecamatan)
                        ->where('desa', $user->desa);
                }
            })->when(
                $user->hasRole('dasawisma'),
                fn (Builder $builder) => $builder->where('created_by', $user->id),
            )->when(
                $user->hasRole('admin'),
                fn (Builder $builder) => $builder->where('status', 'approved'),
            );
        }

        if ($user->hasRole('kecamatan')) {
            return $query->where('kecamatan', $user->kecamatan);
        }

        if ($user->hasRole('admin desa')) {
            return $query->where('kecamatan', $user->kecamatan)->where('desa', $user->desa);
        }

        abort_unless($user->hasRole('dasawisma'), 403);

        return $query->where('created_by', $user->id);
    }

    protected function authorizeWrite(): void
    {
        abort_unless(request()->user()->hasAnyRole(['dasawisma', 'admin desa']), 403);
    }

    protected function authorizeApproval(): void
    {
        abort_unless(request()->user()->hasRole('kecamatan'), 403);
    }

    protected function findRecord(int $id): Model
    {
        return $this->query()->findOrFail($id);
    }

    protected function authorizeEditable(Model $record): void
    {
        $this->authorizeWrite();
        abort_if($record->status === 'approved', 403, 'Data yang sudah disetujui tidak dapat diubah.');

        if (request()->user()->hasRole('dasawisma')) {
            abort_unless((int) $record->created_by === (int) request()->user()->id, 403);
        }
    }

    public function index(Request $request)
    {
        $definition = $this->definition();
        $baseQuery = $this->query();
        $statsQuery = clone $baseQuery;
        $stats = [
            'total' => (clone $statsQuery)->count(),
            'pending' => (clone $statsQuery)->where('status', 'pending')->count(),
            'approved' => (clone $statsQuery)->where('status', 'approved')->count(),
            'rejected' => (clone $statsQuery)->where('status', 'rejected')->count(),
        ];

        $search = trim((string) $request->query('search', ''));
        $status = (string) $request->query('status', '');
        $query = clone $baseQuery;

        if ($search !== '') {
            $query->where(function (Builder $builder) use ($search, $definition) {
                foreach ($definition['search'] as $column) {
                    $builder->orWhere($column, 'like', '%'.$search.'%');
                }
            });
        }

        if (in_array($status, ['pending', 'approved', 'rejected'], true)) {
            $query->where('status', $status);
        }

        $records = $query->with($definition['with'] ?? [])
            ->latest('id')
            ->paginate(15)
            ->withQueryString();

        $options = [];
        if ($this->resourceKey() === 'catatan-keluarga') {
            $options['daftar_warga_id'] = $this->scopedDaftarWargaQuery()
                ->orderBy('nama_kepala_keluarga')
                ->get(['id', 'nama_kepala_keluarga'])
                ->map(fn (DaftarWarga $warga) => [
                    'value' => $warga->id,
                    'label' => $warga->nama_kepala_keluarga,
                ])
                ->all();
        }

        return Inertia::render($definition['page'], [
            'records' => $records,
            'stats' => $stats,
            'fields' => $definition['fields'],
            'columns' => $definition['columns'],
            'filters' => ['search' => $search, 'status' => $status],
            'options' => $options,
            'title' => $definition['title'],
            'description' => $definition['description'],
            'baseUrl' => '/dasawisma/'.$this->resourceKey(),
            'canManage' => $request->user()->hasAnyRole(['dasawisma', 'admin desa']),
            'canApprove' => $request->user()->hasRole('kecamatan'),
            'notifications' => $this->recentNotifications($request),
        ]);
    }

    public function create(): JsonResponse
    {
        $this->authorizeWrite();

        return response()->json([
            'fields' => $this->definition()['fields'],
            'options' => $this->formOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorizeWrite();
        $data = $this->validateData($request);
        $user = $request->user();
        abort_if(
            !$user->hasRole('kecamatan') && (empty($user->kecamatan) || empty($user->desa)),
            403,
            'Lengkapi data kecamatan dan desa pada profil sebelum menginput data.',
        );

        $data = array_merge($data, [
            'kecamatan' => $user->kecamatan,
            'desa' => $user->desa,
            'status' => 'pending',
            'approved_by' => null,
            'approved_at' => null,
            'rejected_reason' => null,
            'created_by' => $user->id,
        ]);

        if ($this->resourceKey() === 'catatan-keluarga') {
            $parent = $this->scopedDaftarWargaQuery()->findOrFail($data['daftar_warga_id']);
            $data['kecamatan'] = $parent->kecamatan;
            $data['desa'] = $parent->desa;
        }

        $model = $this->modelClass();
        $record = $model::create($data);
        $this->notifyKecamatan(
            $user->kecamatan,
            'Ada data Dasa Wisma baru yang menunggu persetujuan.',
            $record->id,
        );

        return $this->redirectWithSuccess('Data berhasil disimpan dan menunggu persetujuan kecamatan.');
    }

    public function show(int $id): JsonResponse
    {
        $record = $this->findRecord($id)->load($this->definition()['with'] ?? []);

        return response()->json($record);
    }

    public function edit(int $id): JsonResponse
    {
        $record = $this->findRecord($id);
        $this->authorizeEditable($record);

        return response()->json([
            'record' => $record,
            'fields' => $this->definition()['fields'],
            'options' => $this->formOptions(),
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $record = $this->findRecord($id);
        $this->authorizeEditable($record);
        $data = $this->validateData($request, $id);

        if ($record->status === 'rejected') {
            $data['status'] = 'pending';
            $data['rejected_reason'] = null;
            $data['approved_by'] = null;
            $data['approved_at'] = null;
        }

        if ($this->resourceKey() === 'catatan-keluarga') {
            $parent = $this->scopedDaftarWargaQuery()->findOrFail($data['daftar_warga_id']);
            $data['kecamatan'] = $parent->kecamatan;
            $data['desa'] = $parent->desa;
        }

        $record->fill($data)->save();

        return $this->redirectWithSuccess('Data berhasil diperbarui.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $record = $this->findRecord($id);
        $this->authorizeEditable($record);
        $record->delete();

        return $this->redirectWithSuccess('Data berhasil dihapus.');
    }

    public function approve(int $id): RedirectResponse
    {
        $this->authorizeApproval();
        $record = $this->findRecord($id);
        abort_unless($record->status === 'pending', 422, 'Hanya data pending yang dapat disetujui.');
        $record->forceFill([
            'status' => 'approved',
            'approved_by' => request()->user()->id,
            'approved_at' => now(),
            'rejected_reason' => null,
        ])->save();
        $this->notifyOwner($record, 'Data Dasa Wisma Anda telah disetujui.');

        return $this->redirectWithSuccess('Data disetujui.');
    }

    public function reject(Request $request, int $id): RedirectResponse
    {
        $this->authorizeApproval();
        $request->validate(['reason' => ['required', 'string', 'max:2000']]);
        $record = $this->findRecord($id);
        abort_unless($record->status === 'pending', 422, 'Hanya data pending yang dapat ditolak.');
        $record->forceFill([
            'status' => 'rejected',
            'approved_by' => null,
            'approved_at' => null,
            'rejected_reason' => $request->string('reason')->toString(),
        ])->save();
        $this->notifyOwner($record, 'Data Dasa Wisma Anda perlu diperbaiki: '.$request->string('reason')->toString());

        return $this->redirectWithSuccess('Data ditolak dan dapat diperbaiki oleh desa.');
    }

    public function bulkApprove(Request $request): RedirectResponse
    {
        $this->authorizeApproval();
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer'],
        ]);

        $records = $this->query()->whereIn('id', $validated['ids'])
            ->where('status', 'pending')
            ->get();
        $records->each(function (Model $record) use ($request): void {
            $record->forceFill([
                'status' => 'approved',
                'approved_by' => $request->user()->id,
                'approved_at' => now(),
                'rejected_reason' => null,
            ])->save();
            $this->notifyOwner($record, 'Data Dasa Wisma Anda telah disetujui.');
        });

        return $this->redirectWithSuccess($records->count().' data disetujui.');
    }

    public function exportExcel(): BinaryFileResponse
    {
        $definition = $this->definition();
        $rows = $this->query()->with($definition['with'] ?? [])->latest('id')->get();

        if ($this->resourceKey() === 'kegiatan-dasa-wisma') {
            return Excel::download(
                new DasawismaKegiatanExcelExport($rows->all()),
                'kegiatan-dasa-wisma-'.now()->format('Ymd-His').'.xlsx',
            );
        }

        return Excel::download(
            new DasawismaResourceExport($rows->all(), $definition['columns']),
            $this->resourceKey().'-'.now()->format('Ymd-His').'.xlsx',
        );
    }

    public function templateExcel(): BinaryFileResponse
    {
        if ($this->resourceKey() === 'kegiatan-dasa-wisma') {
            return Excel::download(
                new DasawismaKegiatanExcelExport([]),
                'kegiatan-dasa-wisma-template.xlsx',
            );
        }

        $columns = collect($this->definition()['fields'])
            ->mapWithKeys(fn (array $field) => [$field['name'] => $field['label']])
            ->all();

        return Excel::download(
            new DasawismaResourceExport([], $columns, true),
            $this->resourceKey().'-template.xlsx',
        );
    }

    public function importExcel(Request $request): RedirectResponse
    {
        $this->authorizeWrite();
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls,csv', 'max:10240'],
        ]);

        if ($this->resourceKey() === 'kegiatan-dasa-wisma') {
            return $this->importActivityExcel($request);
        }

        $rows = Excel::toCollection(new DasawismaRowsImport(), $request->file('file'))->first();
        $fields = $this->definition()['fields'];
        $rules = $this->validationRules();
        $allowed = array_fill_keys(array_column($fields, 'name'), true);
        $user = $request->user();
        abort_if(
            empty($user->kecamatan) || empty($user->desa),
            403,
            'Lengkapi data kecamatan dan desa pada profil sebelum mengimpor data.',
        );
        $errors = [];
        $inserted = 0;

        foreach ($rows ?? [] as $offset => $row) {
            $values = $row->toArray();
            $values = array_intersect_key($values, $allowed);
            if (!array_filter($values, fn ($value) => $value !== null && $value !== '')) {
                continue;
            }

            $validator = Validator::make($values, $rules);
            if ($validator->fails()) {
                $errors[] = 'Baris '.($offset + 2).': '.implode(' ', $validator->errors()->all());
                continue;
            }

            $data = array_merge($validator->validated(), [
                'kecamatan' => $user->kecamatan,
                'desa' => $user->desa,
                'status' => 'pending',
                'created_by' => $user->id,
            ]);

            if ($this->resourceKey() === 'catatan-keluarga') {
                $parent = $this->scopedDaftarWargaQuery()->find($data['daftar_warga_id'] ?? null);
                if (!$parent) {
                    $errors[] = 'Baris '.($offset + 2).': daftar_warga_id tidak ditemukan di wilayah Anda.';
                    continue;
                }
                $data['kecamatan'] = $parent->kecamatan;
                $data['desa'] = $parent->desa;
            }

            $model = $this->modelClass();
            $record = $model::create($data);
            if ($inserted === 0) {
                $this->notifyKecamatan(
                    $user->kecamatan,
                    'Ada data Dasa Wisma hasil impor yang menunggu persetujuan.',
                    $record->id,
                );
            }
            $inserted++;
        }

        if ($errors !== []) {
            return back()->with('warning', $inserted.' baris diimpor; '.count($errors).' baris gagal.')
                ->withErrors(['import' => $errors]);
        }

        return $this->redirectWithSuccess($inserted.' baris berhasil diimpor dengan status pending.');
    }

    protected function formOptions(): array
    {
        if ($this->resourceKey() !== 'catatan-keluarga') {
            return [];
        }

        return [
            'daftar_warga_id' => $this->scopedDaftarWargaQuery()
                ->orderBy('nama_kepala_keluarga')
                ->get(['id', 'nama_kepala_keluarga'])
                ->map(fn (DaftarWarga $warga) => [
                    'value' => $warga->id,
                    'label' => $warga->nama_kepala_keluarga,
                ])
                ->all(),
        ];
    }

    protected function validateData(Request $request, ?int $id = null): array
    {
        $rules = $this->validationRules();
        if ($this->resourceKey() === 'catatan-keluarga') {
            $rules['daftar_warga_id'] = [
                'required',
                'integer',
                Rule::exists('daftar_wargas', 'id'),
            ];
        }

        return $request->validate($rules);
    }

    protected function validationRules(): array
    {
        $rules = [];
        foreach ($this->definition()['fields'] as $field) {
            $rules[$field['name']] = $field['rules'];
        }
        return $rules;
    }

    protected function scopedDaftarWargaQuery(): Builder
    {
        $user = request()->user();
        $query = DaftarWarga::query();

        // Super Admin — lihat semua tanpa filter.
        if ($user->hasRole('super-admin')) {
            return $query;
        }

        if ($user->hasRole('admin')) {
            return $query->where('status', 'approved');
        }
        if ($user->hasRole('kecamatan')) {
            return $query->where('kecamatan', $user->kecamatan);
        }
        if ($user->hasRole('admin desa')) {
            return $query->where('kecamatan', $user->kecamatan)->where('desa', $user->desa);
        }

        return $query->where('created_by', $user->id);
    }

    protected function importActivityExcel(Request $request): RedirectResponse
    {
        $user = $request->user();
        abort_if(
            empty($user->kecamatan) || empty($user->desa),
            403,
            'Lengkapi data kecamatan dan desa pada profil sebelum mengimpor data.',
        );

        $rows = Excel::toCollection(
            new DasawismaActivityRowsImport(),
            $request->file('file'),
        )->first();
        $rules = $this->validationRules();
        $errors = [];
        $inserted = 0;
        $columnMap = [
            'dusun' => 1, 'rw' => 2, 'rt' => 3,
            'jumlah_dusun' => 4, 'jumlah_rw' => 5, 'jumlah_rt' => 6,
            'jumlah_dasa_wisma' => 7, 'jumlah_krt' => 8, 'jumlah_kk' => 9,
            'total_l' => 10, 'total_p' => 11, 'balita_l' => 12, 'balita_p' => 13,
            'pus' => 14, 'wus' => 15, 'ibu_hamil' => 16, 'ibu_menyusui' => 17,
            'lansia' => 18, 'buta_l' => 19, 'buta_p' => 20, 'rumah_sehat' => 21,
            'rumah_kurang_sehat' => 22, 'memiliki_tempat_sampah' => 23,
            'memiliki_spal' => 24, 'memiliki_stiker_p4k' => 25, 'air_pdam' => 26,
            'air_sumur' => 27, 'air_sungai' => 28, 'air_dll' => 29,
            'jumlah_jamban_keluarga' => 30, 'makanan_pokok_beras' => 31,
            'makanan_pokok_non_beras' => 32, 'kegiatan_up2k' => 33,
            'kegiatan_tanah_pekarangan' => 34, 'kegiatan_industri_rumah_tangga' => 35,
            'kegiatan_kesehatan_lingkungan' => 36,
        ];

        foreach ($rows ?? [] as $offset => $row) {
            if ($offset < 2) {
                continue;
            }
            $values = [];
            foreach ($columnMap as $field => $column) {
                $values[$field] = $row[$column] ?? null;
            }
            $values['tahun'] = now()->year;
            if (!array_filter($values, fn ($value) => $value !== null && $value !== '')) {
                continue;
            }

            $validator = Validator::make($values, $rules);
            if ($validator->fails()) {
                $errors[] = 'Baris '.($offset + 1).': '.implode(' ', $validator->errors()->all());
                continue;
            }

            $model = $this->modelClass();
            $record = $model::create(array_merge($validator->validated(), [
                'kecamatan' => $user->kecamatan,
                'desa' => $user->desa,
                'dasawisma' => null,
                'status' => 'pending',
                'created_by' => $user->id,
            ]));
            if ($inserted === 0) {
                $this->notifyKecamatan(
                    $user->kecamatan,
                    'Ada rekap kegiatan Dasa Wisma hasil impor yang menunggu persetujuan.',
                    $record->id,
                );
            }
            $inserted++;
        }

        if ($errors !== []) {
            return back()->with('warning', $inserted.' baris diimpor; '.count($errors).' baris gagal.')
                ->withErrors(['import' => $errors]);
        }

        return $this->redirectWithSuccess($inserted.' baris berhasil diimpor dengan status pending.');
    }

    protected function notifyKecamatan(string $kecamatan, string $message, int $recordId): void
    {
        User::role('kecamatan')
            ->where('kecamatan', $kecamatan)
            ->get()
            ->each(fn (User $user) => $user->notify(new DasawismaRecordNotification(
                $message,
                '/dasawisma/'.$this->resourceKey(),
                $recordId,
            )));
    }

    protected function notifyOwner(Model $record, string $message): void
    {
        $owner = User::query()->find($record->created_by);
        $owner?->notify(new DasawismaRecordNotification(
            $message,
            '/dasawisma/'.$this->resourceKey(),
            $record->id,
        ));
    }

    protected function recentNotifications(Request $request): array
    {
        return $request->user()->unreadNotifications()
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn ($notification) => [
                'id' => $notification->id,
                'message' => $notification->data['message'] ?? 'Ada pembaruan data Dasa Wisma.',
                'url' => $notification->data['url'] ?? '/dasawisma',
                'created_at' => $notification->created_at?->diffForHumans(),
            ])
            ->all();
    }

    protected function redirectWithSuccess(string $message): RedirectResponse
    {
        return redirect('/dasawisma/'.$this->resourceKey())->with('success', $message);
    }
}
