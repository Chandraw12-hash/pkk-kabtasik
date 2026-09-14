<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class WeatherService
{
    // ✅ Koordinat Singaparna (pusat Kab. Tasikmalaya)
    private const LATITUDE = -7.35;
    private const LONGITUDE = 108.10;
    private const TIMEZONE = 'Asia/Jakarta';
    private const CACHE_KEY = 'weather_tasikmalaya';
    private const CACHE_TTL = 1800; // 30 menit

    /**
     * Get cuaca terkini untuk Kabupaten Tasikmalaya
     */
    public function getCurrentWeather(): ?array
    {
        return Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
            try {
                $response = Http::timeout(10)
                    ->get('https://api.open-meteo.com/v1/forecast', [
                        'latitude' => self::LATITUDE,
                        'longitude' => self::LONGITUDE,
                        'current' => 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m',
                        'timezone' => self::TIMEZONE,
                    ]);

                if ($response->failed()) {
                    Log::error('Weather API failed', [
                        'status' => $response->status(),
                        'body' => $response->body(),
                    ]);
                    return null;
                }

                $data = $response->json();
                $current = $data['current'] ?? null;

                if (!$current) {
                    return null;
                }

                return [
                    'temperature' => round($current['temperature_2m']),
                    'feels_like' => round($current['apparent_temperature']),
                    'humidity' => $current['relative_humidity_2m'],
                    'precipitation' => $current['precipitation'],
                    'wind_speed' => round($current['wind_speed_10m']),
                    'weather_code' => $current['weather_code'],
                    'weather' => $this->getWeatherInfo($current['weather_code']),
                    'location' => 'Kabupaten Tasikmalaya',
                    'updated_at' => $current['time'],
                ];
            } catch (\Exception $e) {
                Log::error('Weather service error: ' . $e->getMessage());
                return null;
            }
        });
    }

    /**
     * Mapping weather code WMO → info cuaca
     * @see https://open-meteo.com/en/docs
     */
    private function getWeatherInfo(int $code): array
    {
        $map = [
            0 => ['label' => 'Cerah', 'icon' => 'sun'],
            1 => ['label' => 'Cerah Berawan', 'icon' => 'cloud-sun'],
            2 => ['label' => 'Berawan', 'icon' => 'cloud-sun'],
            3 => ['label' => 'Mendung', 'icon' => 'cloud'],
            45 => ['label' => 'Berkabut', 'icon' => 'cloud-fog'],
            48 => ['label' => 'Berkabut', 'icon' => 'cloud-fog'],
            51 => ['label' => 'Gerimis Ringan', 'icon' => 'cloud-drizzle'],
            53 => ['label' => 'Gerimis', 'icon' => 'cloud-drizzle'],
            55 => ['label' => 'Gerimis Lebat', 'icon' => 'cloud-drizzle'],
            56 => ['label' => 'Gerimis Beku', 'icon' => 'cloud-drizzle'],
            57 => ['label' => 'Gerimis Beku Lebat', 'icon' => 'cloud-drizzle'],
            61 => ['label' => 'Hujan Ringan', 'icon' => 'cloud-rain'],
            63 => ['label' => 'Hujan', 'icon' => 'cloud-rain'],
            65 => ['label' => 'Hujan Lebat', 'icon' => 'cloud-rain'],
            66 => ['label' => 'Hujan Beku', 'icon' => 'cloud-rain'],
            67 => ['label' => 'Hujan Beku Lebat', 'icon' => 'cloud-rain'],
            71 => ['label' => 'Salju Ringan', 'icon' => 'cloud-snow'],
            73 => ['label' => 'Salju', 'icon' => 'cloud-snow'],
            75 => ['label' => 'Salju Lebat', 'icon' => 'cloud-snow'],
            77 => ['label' => 'Butiran Salju', 'icon' => 'cloud-snow'],
            80 => ['label' => 'Hujan Lokal', 'icon' => 'cloud-rain'],
            81 => ['label' => 'Hujan Lokal Lebat', 'icon' => 'cloud-rain'],
            82 => ['label' => 'Hujan Sangat Lebat', 'icon' => 'cloud-rain'],
            85 => ['label' => 'Salju Lokal', 'icon' => 'cloud-snow'],
            86 => ['label' => 'Salju Lokal Lebat', 'icon' => 'cloud-snow'],
            95 => ['label' => 'Badai Petir', 'icon' => 'cloud-lightning'],
            96 => ['label' => 'Badai Petir + Hujan Es', 'icon' => 'cloud-lightning'],
            99 => ['label' => 'Badai Petir Hebat', 'icon' => 'cloud-lightning'],
        ];

        return $map[$code] ?? ['label' => 'Tidak Diketahui', 'icon' => 'cloud'];
    }

    /**
     * Clear cache cuaca (untuk testing)
     */
    public function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }
}
