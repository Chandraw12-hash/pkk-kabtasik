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
     * Form dibuka (bisa diganti setting nanti).
     * Jangan pakai Survey::where('status','active') — itu bentrok dengan status jawaban.
     */
    public function index()
    {
        return Inertia::render('Frontend/Survey/Index', [
            'isActive' => true,
        ]);
    }

    /**
     * Simpan jawaban masyarakat → masuk admin (pending).
     * Baru tampil di landing kalau admin set status = published.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'saran' => 'nullable|string|max:1000',
        ]);

        Survey::create([
            'nama' => $request->nama ?: 'Anonim',
            'email' => $request->email,
            'rating' => $request->rating,
            'saran' => $request->saran,
            'ip_address' => $request->ip(),
            'status' => 'pending',
        ]);

        return redirect()
            ->back()
            ->with('success', 'Terima kasih atas partisipasi Anda!');
    }
}
