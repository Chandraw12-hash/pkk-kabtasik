<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agenda;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AgendaApiController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->input('limit', 10);
        $month = $request->input('month');
        $year = $request->input('year');

        $query = Agenda::where('status', '!=', 'cancelled');

        // Filter bulan & tahun
        if ($month && $year) {
            $query->whereMonth('tanggal', $month)
                ->whereYear('tanggal', $year);
        } elseif ($month) {
            $query->whereMonth('tanggal', $month);
        } elseif ($year) {
            $query->whereYear('tanggal', $year);
        } else {
            // Default: tampilkan agenda bulan ini dan mendatang
            $query->whereDate('tanggal', '>=', Carbon::today()->subDays(1));
        }

        $agenda = $query->orderBy('tanggal', 'asc')
            ->orderBy('waktu', 'asc')
            ->paginate($limit)
            ->through(function ($item) {
                return [
                    'id' => $item->id,
                    'judul' => $item->judul,
                    'deskripsi' => $item->deskripsi,
                    'tanggal' => $item->tanggal->format('Y-m-d'),
                    'tanggal_formatted' => $item->tanggal->translatedFormat('d F Y'),
                    'waktu' => $item->waktu ? Carbon::parse($item->waktu)->format('H:i') : null,
                    'lokasi' => $item->lokasi,
                    'status' => $item->status,
                    'is_today' => $item->tanggal->isToday(),
                ];
            });

        return response()->json([
            'success' => true,
            'message' => 'Daftar agenda',
            'data' => $agenda,
        ]);
    }

    public function show($id)
    {
        $agenda = Agenda::where('id', $id)
            ->where('status', '!=', 'cancelled')
            ->first();

        if (!$agenda) {
            return response()->json([
                'success' => false,
                'message' => 'Agenda tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detail agenda',
            'data' => [
                'id' => $agenda->id,
                'judul' => $agenda->judul,
                'deskripsi' => $agenda->deskripsi,
                'tanggal' => $agenda->tanggal->format('Y-m-d'),
                'tanggal_formatted' => $agenda->tanggal->translatedFormat('d F Y'),
                'waktu' => $agenda->waktu ? Carbon::parse($agenda->waktu)->format('H:i') : null,
                'lokasi' => $agenda->lokasi,
                'status' => $agenda->status,
                'created_at' => $agenda->created_at?->toIso8601String(),
            ],
        ]);
    }

    // Kalender view (grid bulanan)
    public function calendar(Request $request)
    {
        $month = $request->input('month', Carbon::now()->month);
        $year = $request->input('year', Carbon::now()->year);

        $agendas = Agenda::where('status', '!=', 'cancelled')
            ->whereMonth('tanggal', $month)
            ->whereYear('tanggal', $year)
            ->orderBy('tanggal', 'asc')
            ->get();

        // Group by tanggal
        $calendar = [];
        foreach ($agendas as $agenda) {
            $dateKey = $agenda->tanggal->format('Y-m-d');
            if (!isset($calendar[$dateKey])) {
                $calendar[$dateKey] = [];
            }
            $calendar[$dateKey][] = [
                'id' => $agenda->id,
                'judul' => $agenda->judul,
                'waktu' => $agenda->waktu ? Carbon::parse($agenda->waktu)->format('H:i') : null,
                'lokasi' => $agenda->lokasi,
            ];
        }

        return response()->json([
            'success' => true,
            'message' => 'Kalender agenda',
            'data' => [
                'month' => $month,
                'year' => $year,
                'month_name' => Carbon::create($year, $month)->translatedFormat('F'),
                'total' => $agendas->count(),
                'calendar' => $calendar,
            ],
        ]);
    }
}
