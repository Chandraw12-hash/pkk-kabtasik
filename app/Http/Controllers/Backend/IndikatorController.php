<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\Indikator;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Exports\IndikatorExport;
use App\Imports\IndikatorImport;
use Maatwebsite\Excel\Facades\Excel;

class IndikatorController extends Controller
{
    public function __construct()
    {
        $this->middleware('role:admin');
    }

    public function index()
    {
        $query = Indikator::query();

        if (request('search')) {
            $query->where('nama_indikator', 'like', '%' . request('search') . '%');
        }

        $indikators = $query
            ->paginate(request('per_page', 10))
            ->withQueryString();

        if (request()->wantsJson()) {
            return response()->json($indikators);
        }

        return Inertia::render('Backend/Indikator/Index', [
            'indikators' => $indikators,
            'filters' => request()->only(['search', 'per_page']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_indikator' => 'required|string|max:255|unique:indikator,nama_indikator',
        ]);

        Indikator::create($validated);

        return redirect()->back()
            ->with('success', 'Indikator berhasil ditambahkan.');
    }

    public function update(Request $request, Indikator $indikator)
    {
        $validated = $request->validate([
            'nama_indikator' => 'required|string|max:255|unique:indikator,nama_indikator,' . $indikator->id,
        ]);

        $indikator->update($validated);

        return redirect()->back()
            ->with('success', 'Indikator berhasil diperbarui.');
    }

    public function destroy(Indikator $indikator)
    {
        $indikator->delete();

        return redirect()->back()
            ->with('success', 'Indikator berhasil dihapus.');
    }

    public function export()
    {
        return Excel::download(new IndikatorExport, 'indikator.xlsx');
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv,txt',
        ]);

        try {
            Excel::import(new IndikatorImport, $request->file('file'));
        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            $failures = $e->failures();
             
             // Construct a friendly error message
             $messages = [];
             foreach ($failures as $failure) {
                 $messages[] = 'Baris ' . $failure->row() . ': ' . implode(', ', $failure->errors());
             }
             
            return redirect()->back()->with('error', 'Gagal import data: ' . implode(' | ', array_slice($messages, 0, 5)));
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan saat import: ' . $e->getMessage());
        }

        return redirect()->back()->with('success', 'Data indikator berhasil diimport.');
    }
}
