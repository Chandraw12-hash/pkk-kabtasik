<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\Survey;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SurveyController extends Controller
{
    public function index(Request $request)
    {
        $search  = $request->get('search');
        $status  = $request->get('status');
        $rating  = $request->get('rating');
        $perPage = (int) $request->get('per_page', 10);

        $surveys = Survey::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('saran', 'like', "%{$search}%");
                });
            })
            ->when($status, fn ($q) => $q->where('status', $status))
            ->when($rating, fn ($q) => $q->where('rating', $rating))
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        $statistik = [
            'total'     => Survey::count(),
            'pending'   => Survey::where('status', 'pending')->count(),
            'published' => Survey::where('status', 'published')->count(),
            'hidden'    => Survey::where('status', 'hidden')->count(),
            // kompatibilitas UI lama (opsional)
            'active'    => Survey::where('status', 'published')->count(),
            'inactive'  => Survey::whereIn('status', ['pending', 'hidden', 'inactive'])->count(),
            'rata_rata' => round((float) (Survey::avg('rating') ?? 0), 1),
            'rating_5'  => Survey::where('rating', 5)->count(),
            'rating_4'  => Survey::where('rating', 4)->count(),
            'rating_3'  => Survey::where('rating', 3)->count(),
            'rating_2'  => Survey::where('rating', 2)->count(),
            'rating_1'  => Survey::where('rating', 1)->count(),
        ];

        // Response JSON untuk axios (filter/search) — jangan untuk Inertia
        if (
            !$request->header('X-Inertia') &&
            ($request->wantsJson() || $request->ajax())
        ) {
            $payload = $surveys->toArray();
            $payload['statistik'] = $statistik;

            return response()->json($payload);
        }

        return Inertia::render('Backend/Survey/Index', [
            'surveys'     => $surveys,
            'statistik'   => $statistik,
            'filters'     => $request->only(['search', 'status', 'rating', 'per_page']),
            'statusList'  => ['pending', 'published', 'hidden'],
            'ratingList'  => [1, 2, 3, 4, 5],
        ]);
    }

    public function show(Survey $survey)
    {
        return Inertia::render('Backend/Survey/Show', [
            'survey' => $survey,
        ]);
    }

    /**
     * Publish / unpublish survey (tampil di beranda jika published).
     */
    public function toggleStatus(Request $request, Survey $survey)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,published,hidden',
        ]);

        $survey->update([
            'status' => $validated['status'],
        ]);

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'status'  => $survey->status,
            ]);
        }

        $msg = match ($validated['status']) {
            'published' => 'Survey ditampilkan di beranda.',
            'hidden'    => 'Survey ditarik dari beranda.',
            default     => 'Status survey diperbarui.',
        };

        return redirect()
            ->back()
            ->with('success', $msg);
    }

    public function destroy(Survey $survey)
    {
        $survey->delete();

        return redirect()
            ->route('be.survey.index')
            ->with('success', 'Data survey berhasil dihapus.');
    }

    public function export(Request $request)
    {
        $status = $request->get('status');
        $rating = $request->get('rating');

        $surveys = Survey::query()
            ->when($status, fn ($q) => $q->where('status', $status))
            ->when($rating, fn ($q) => $q->where('rating', $rating))
            ->latest()
            ->get();

        $filename = 'survey_kepuasan_' . date('Y-m-d') . '.csv';
        $handle = fopen('php://temp', 'w+');

        fputcsv($handle, [
            'ID',
            'Nama',
            'Email',
            'Rating',
            'Saran',
            'Status',
            'IP Address',
            'Tanggal',
        ]);

        $statusLabel = [
            'pending'   => 'Menunggu',
            'published' => 'Dipublish',
            'hidden'    => 'Disembunyikan',
            'active'    => 'Aktif (lama)',
            'inactive'  => 'Nonaktif (lama)',
        ];

        foreach ($surveys as $survey) {
            fputcsv($handle, [
                $survey->id,
                $survey->nama ?? '-',
                $survey->email ?? '-',
                $survey->rating,
                $survey->saran ?? '-',
                $statusLabel[$survey->status] ?? $survey->status,
                $survey->ip_address ?? '-',
                optional($survey->created_at)->format('d/m/Y H:i'),
            ]);
        }

        rewind($handle);
        $csvContent = stream_get_contents($handle);
        fclose($handle);

        return response($csvContent, 200, [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }
}
