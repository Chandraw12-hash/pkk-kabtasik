<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Imports\SekretariatImport;
use App\Models\DataUmumSekretariat;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class DataUmumSekretariatController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);

        $sekretariatData = DataUmumSekretariat::query()
            ->when($search, function ($query, $search) {
                $query->where('kecamatan', 'like', "%{$search}%");
            })
            ->orderBy('kecamatan')
            ->paginate($perPage)
            ->withQueryString();

        // 💡 PERBAIKAN: Selalu kembalikan Inertia render agar tidak terjadi error "plain JSON response was received"
        return Inertia::render('Backend/Sekretariat/Index', [
            'sekretariats' => $sekretariatData,
            'filters' => $request->only(['search', 'per_page']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Backend/Sekretariat/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kecamatan'         => 'required|string|max:255',
            'jumlah_pkk_rw'     => 'nullable|integer|min:0',
            'jumlah_pkk_rt'     => 'nullable|integer|min:0',
            'jumlah_dasa_wisma' => 'nullable|integer|min:0',
            'jumlah_krt'        => 'nullable|integer|min:0',
            'jumlah_kk'         => 'nullable|integer|min:0',
            'jiwa_l'            => 'nullable|integer|min:0',
            'jiwa_p'            => 'nullable|integer|min:0',
            'tp_pkk_l'          => 'nullable|integer|min:0',
            'tp_pkk_p'          => 'nullable|integer|min:0',
            'kader_umum_l'      => 'nullable|integer|min:0',
            'kader_umum_p'      => 'nullable|integer|min:0',
            'kader_khusus_l'    => 'nullable|integer|min:0',
            'kader_khusus_p'    => 'nullable|integer|min:0',
        ]);

        DataUmumSekretariat::create($validated);

        return redirect()
            ->route('be.sekretariat.index')
            ->with('success', 'Data Sekretariat berhasil ditambahkan.');
    }

    public function edit(DataUmumSekretariat $sekretariat)
    {
        return Inertia::render('Backend/Sekretariat/Edit', [
            'sekretariat' => $sekretariat,
        ]);
    }

    public function update(Request $request, DataUmumSekretariat $sekretariat)
    {
        $validated = $request->validate([
            'kecamatan'         => 'required|string|max:255',
            'jumlah_pkk_rw'     => 'nullable|integer|min:0',
            'jumlah_pkk_rt'     => 'nullable|integer|min:0',
            'jumlah_dasa_wisma' => 'nullable|integer|min:0',
            'jumlah_krt'        => 'nullable|integer|min:0',
            'jumlah_kk'         => 'nullable|integer|min:0',
            'jiwa_l'            => 'nullable|integer|min:0',
            'jiwa_p'            => 'nullable|integer|min:0',
            'tp_pkk_l'          => 'nullable|integer|min:0',
            'tp_pkk_p'          => 'nullable|integer|min:0',
            'kader_umum_l'      => 'nullable|integer|min:0',
            'kader_umum_p'      => 'nullable|integer|min:0',
            'kader_khusus_l'    => 'nullable|integer|min:0',
            'kader_khusus_p'    => 'nullable|integer|min:0',
        ]);

        $sekretariat->update($validated);

        return redirect()
            ->route('be.sekretariat.index')
            ->with('success', 'Data Sekretariat berhasil diperbarui.');
    }

    public function destroy(DataUmumSekretariat $sekretariat)
    {
        $sekretariat->delete();

        return redirect()
            ->route('be.sekretariat.index')
            ->with('success', 'Data Sekretariat berhasil dihapus.');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv|max:10240',
        ]);

        try {
            Excel::import(new SekretariatImport, $request->file('file'));

            return redirect()
                ->route('be.sekretariat.index')
                ->with('success', 'Data Sekretariat berhasil diimpor dari Excel.');
        } catch (\Throwable $e) {
            return redirect()
                ->route('be.sekretariat.index')
                ->with('error', 'Gagal impor: ' . $e->getMessage());
        }
    }
}
