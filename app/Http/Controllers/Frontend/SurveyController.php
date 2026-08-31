<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Survey;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SurveyController extends Controller
{
    /**
     * Form survey publik.
     */
    public function index()
    {
        return Inertia::render('Frontend/Survey/Index', [
            'isActive' => true,
        ]);
    }

    /**
     * Simpan jawaban masyarakat → pending (admin publish dulu).
     * Anti-bot: honeypot + max 3x per IP per hari (+ throttle di route).
     */
    public function store(Request $request)
    {
        // Honeypot: bot biasanya isi field tersembunyi "website"
        if ($request->filled('website')) {
            return redirect()
                ->back()
                ->with('success', 'Terima kasih atas partisipasi Anda!');
        }

        $request->validate([
            'nama'    => 'nullable|string|max:100',
            'email'   => 'nullable|email|max:255',
            'rating'  => 'required|integer|min:1|max:5',
            'saran'   => 'nullable|string|max:500',
            'website' => 'nullable|max:0', // harus kosong
        ]);

        // Max 3 submit / IP / hari
        $countToday = Survey::where('ip_address', $request->ip())
            ->whereDate('created_at', today())
            ->count();

        if ($countToday >= 3) {
            return redirect()
                ->back()
                ->with('error', 'Batas pengiriman survey hari ini sudah tercapai. Coba lagi besok.');
        }

        Survey::create([
            'nama'       => $request->nama ?: 'Anonim',
            'email'      => $request->email,
            'rating'     => $request->rating,
            'saran'      => $request->saran,
            'ip_address' => $request->ip(),
            'status'     => 'pending',
        ]);

        return redirect()
            ->back()
            ->with('success', 'Terima kasih atas partisipasi Anda!');
    }
}
