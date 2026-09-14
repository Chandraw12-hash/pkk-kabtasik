<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\WeatherService;

class WeatherController extends Controller
{
    protected WeatherService $weatherService;

    public function __construct(WeatherService $weatherService)
    {
        $this->weatherService = $weatherService;
    }

    /**
     * Get current weather
     * GET /api/weather
     */
    public function current()
    {
        $weather = $this->weatherService->getCurrentWeather();

        if (!$weather) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data cuaca',
            ], 500);
        }

        return response()->json([
            'success' => true,
            'data' => $weather,
        ]);
    }
}
