<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\IndeksSpbe;
use Illuminate\Http\Request;

class IndeksSpbeApiController extends Controller
{
    /**
     * Get Dashboard Data for SPBE (Public)
     * Returns Trend Data and Domain Values
     */
    public function getDashboardData(Request $request)
    {
        // 1. Fetch Root Indeks (SPBE)
        $rootIndeks = IndeksSpbe::where('jenis', 'indeks')->first();
        
        $chartData = collect([]);
        $domainData = [];
        $currentYear = date('Y');
        $latestYear = $currentYear;
        
        if ($rootIndeks) {
            // Trend Data
            $nilaiHistory = $rootIndeks->nilaiIndeks()->orderBy('tahun', 'asc')->get();
            $chartData = $nilaiHistory->map(function ($item) {
                return [
                    'year' => (string)$item->tahun,
                    'value' => (float)$item->nilai,
                ];
            });

            // Get latest year from history or default to current
            $latestYear = $nilaiHistory->last() ? $nilaiHistory->last()->tahun : $currentYear;

            // Domain Data (Fetch by name fallback logic)
            $domains = IndeksSpbe::where('nama_indeks', 'like', 'Domain %')
                ->with(['nilaiIndeks' => function ($query) use ($latestYear) {
                    $query->where('tahun', $latestYear);
                }])
                ->orderBy('urutan', 'asc')
                ->get();

            $domainData = $domains->map(function ($domain) {
                $nilai = 0;
                if ($domain->nilaiIndeks->first()) {
                     $nilai = $domain->nilaiIndeks->first()->nilai;
                } 

                return [
                    'id' => $domain->id,
                    'title' => $domain->nama_indeks,
                    'nilai' => (float)$nilai,
                ];
            });
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'year' => $latestYear,
                'total_score' => $chartData->isNotEmpty() ? $chartData->last()['value'] : 0,
                'predikat' => 'Sangat Baik', // Logic predikat bisa ditambahkan dinamis nanti
                'domain_data' => $domainData,
                'chart_data' => $chartData,
            ]
        ]);
    }

    /**
     * Get Full Tree Data (Optional/For future use)
     */
    public function getTreeData()
    {
        $data = IndeksSpbe::with('children', 'nilaiIndeks')->whereNull('parent_id')->get();
        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }
}
