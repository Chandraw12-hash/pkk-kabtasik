<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\Agenda;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Carbon\Carbon;

class AgendaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');
        $bulan = $request->input('bulan');
        $tahun = $request->input('tahun', Carbon::now()->year);
        $perPage = (int) $request->input('per_page', 10);

        $agendas = Agenda::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('judul', 'like', "%{$search}%")
                        ->orWhere('deskripsi', 'like', "%{$search}%")
                        ->orWhere('lokasi', 'like', "%{$search}%");
                });
            })
            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($bulan, function ($query, $bulan) use ($tahun) {
                $query->whereYear('tanggal', $tahun)
                    ->whereMonth('tanggal', $bulan);
            })
            ->orderBy('tanggal', 'desc')
            ->orderBy('waktu', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        // Statistik untuk dashboard
        $statistik = [
            'total' => Agenda::count(),
            'upcoming' => Agenda::where('status', 'upcoming')->count(),
            'ongoing' => Agenda::where('status', 'ongoing')->count(),
            'completed' => Agenda::where('status', 'completed')->count(),
            'cancelled' => Agenda::where('status', 'cancelled')->count(),
            'hari_ini' => Agenda::today()->count(),
        ];

        return Inertia::render('Backend/Agenda/Index', [
            'agendas' => $agendas,
            'statistik' => $statistik,
            'filters' => $request->only(['search', 'status', 'bulan', 'tahun', 'per_page']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Backend/Agenda/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tanggal' => 'required|date|after_or_equal:today',
            'waktu' => 'nullable|date_format:H:i',
            'lokasi' => 'nullable|string|max:255',
            'status' => 'nullable|in:upcoming,ongoing,completed,cancelled',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Upload gambar jika ada
        if ($request->hasFile('gambar')) {
            $path = $request->file('gambar')->store('agendas', 'public');
            $validated['gambar'] = $path;
        }

        // Generate slug otomatis
        $validated['slug'] = Str::slug($validated['judul']) . '-' . uniqid();

        // Set status default jika tidak diisi
        if (!isset($validated['status'])) {
            $validated['status'] = 'upcoming';
        }

        Agenda::create($validated);

        return redirect()
            ->route('be.agenda.index')
            ->with('success', 'Agenda berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Agenda $agenda)
    {
        // Update status otomatis sebelum ditampilkan
        $agenda->updateStatusAutomatically();
        $agenda->refresh();

        return Inertia::render('Backend/Agenda/Show', [
            'agenda' => $agenda,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Agenda $agenda)
    {
        return Inertia::render('Backend/Agenda/Edit', [
            'agenda' => $agenda,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Agenda $agenda)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tanggal' => 'required|date',
            'waktu' => 'nullable|date_format:H:i',
            'lokasi' => 'nullable|string|max:255',
            'status' => 'nullable|in:upcoming,ongoing,completed,cancelled',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Upload gambar baru jika ada
        if ($request->hasFile('gambar')) {
            // Hapus gambar lama
            if ($agenda->gambar && Storage::disk('public')->exists($agenda->gambar)) {
                Storage::disk('public')->delete($agenda->gambar);
            }
            $path = $request->file('gambar')->store('agendas', 'public');
            $validated['gambar'] = $path;
        }

        // Update slug jika judul berubah
        if ($agenda->judul !== $validated['judul']) {
            $validated['slug'] = Str::slug($validated['judul']) . '-' . uniqid();
        }

        // Hapus gambar dari validated jika tidak ada perubahan
        if (!$request->hasFile('gambar') && !isset($validated['gambar'])) {
            unset($validated['gambar']);
        }

        $agenda->update($validated);

        return redirect()
            ->route('be.agenda.index')
            ->with('success', 'Agenda berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Agenda $agenda)
    {
        // Hapus gambar jika ada
        if ($agenda->gambar && Storage::disk('public')->exists($agenda->gambar)) {
            Storage::disk('public')->delete($agenda->gambar);
        }

        $agenda->delete();

        return redirect()
            ->route('be.agenda.index')
            ->with('success', 'Agenda berhasil dihapus.');
    }

    /**
     * Bulk delete multiple agendas
     */
    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:agendas,id',
        ]);

        $agendas = Agenda::whereIn('id', $request->ids)->get();

        // Hapus semua gambar terkait
        foreach ($agendas as $agenda) {
            if ($agenda->gambar && Storage::disk('public')->exists($agenda->gambar)) {
                Storage::disk('public')->delete($agenda->gambar);
            }
        }

        Agenda::whereIn('id', $request->ids)->delete();

        return redirect()
            ->route('be.agenda.index')
            ->with('success', count($request->ids) . ' agenda berhasil dihapus.');
    }

    /**
     * Update status agenda secara massal
     */
    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:agendas,id',
            'status' => 'required|in:upcoming,ongoing,completed,cancelled',
        ]);

        Agenda::whereIn('id', $request->ids)
            ->update(['status' => $request->status]);

        return redirect()
            ->route('be.agenda.index')
            ->with('success', 'Status agenda berhasil diperbarui.');
    }

    /**
     * Export agenda to CSV
     */
    public function export(Request $request)
    {
        $agendas = Agenda::query()
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->orderBy('tanggal', 'desc')
            ->get();

        $filename = 'agenda_' . Carbon::now()->format('Y-m-d') . '.csv';
        $handle = fopen('php://output', 'w');

        // Header CSV
        fputcsv($handle, [
            'ID',
            'Judul',
            'Deskripsi',
            'Tanggal',
            'Waktu',
            'Lokasi',
            'Status',
            'Dibuat',
        ]);

        // Data
        foreach ($agendas as $agenda) {
            fputcsv($handle, [
                $agenda->id,
                $agenda->judul,
                $agenda->deskripsi,
                $agenda->tanggal->format('Y-m-d'),
                $agenda->waktu ? Carbon::parse($agenda->waktu)->format('H:i') : '',
                $agenda->lokasi,
                $agenda->status_label,
                $agenda->created_at->format('Y-m-d H:i'),
            ]);
        }

        fclose($handle);

        return response()
            ->stream(
                function () use ($handle) {
                    // sudah di-handle di atas
                },
                200,
                [
                    'Content-Type' => 'text/csv',
                    'Content-Disposition' => "attachment; filename=\"$filename\"",
                ]
            );
    }

    /**
     * Get agenda for calendar view (API)
     */
    public function calendar(Request $request)
    {
        $start = $request->input('start');
        $end = $request->input('end');

        $agendas = Agenda::query()
            ->when($start && $end, function ($query) use ($start, $end) {
                $query->whereBetween('tanggal', [$start, $end]);
            })
            ->get()
            ->map(function ($agenda) {
                return [
                    'id' => $agenda->id,
                    'title' => $agenda->judul,
                    'start' => $agenda->tanggal->format('Y-m-d'),
                    'end' => $agenda->tanggal->format('Y-m-d'),
                    'time' => $agenda->waktu ? Carbon::parse($agenda->waktu)->format('H:i') : null,
                    'location' => $agenda->lokasi,
                    'status' => $agenda->status,
                    'color' => match ($agenda->status) {
                        'upcoming' => '#0D9488',  // teal
                        'ongoing' => '#22C55E',   // green
                        'completed' => '#6B7280', // gray
                        'cancelled' => '#EF4444', // red
                        default => '#6B7280',
                    },
                ];
            });

        return response()->json($agendas);
    }

    /**
     * Update status otomatis untuk semua agenda (bisa dijalankan via scheduler)
     */
    public function autoUpdateStatus()
    {
        $agendas = Agenda::where('status', '!=', 'cancelled')->get();
        $updated = 0;

        foreach ($agendas as $agenda) {
            $agenda->updateStatusAutomatically();
            $updated++;
        }

        return response()->json([
            'message' => "{$updated} agenda berhasil diupdate statusnya.",
        ]);
    }
}
