<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class LandingContentController extends Controller
{
    /**
     * Tampilkan halaman kelola landing page / tampilan website
     */
    public function index()
    {
        $settings = DB::table('settings')->pluck('value', 'key')->all();

        return Inertia::render('Backend/Settings/Landing', [
            'settings' => $settings,
        ]);
    }

    /**
     * Simpan perubahan konten tampilan landing page
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            // Hero Section
            'hero_tagline' => 'nullable|string|max:255',
            'hero_title' => 'nullable|string|max:500',
            'hero_subtitle' => 'nullable|string|max:1000',
            'hero_cta_text_1' => 'nullable|string|max:100',
            'hero_cta_link_1' => 'nullable|string|max:255',
            'hero_cta_text_2' => 'nullable|string|max:100',
            'hero_cta_link_2' => 'nullable|string|max:255',

            // Hero Slides (gambar)
            'hero_slide_1' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'hero_slide_2' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'hero_slide_3' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',

            // Sambutan Ketua Section
            'sambutan_tag' => 'nullable|string|max:100',
            'sambutan_title' => 'nullable|string|max:255',
            'sambutan_nama_ketua' => 'nullable|string|max:255',
            'sambutan_jabatan' => 'nullable|string|max:255',
            'sambutan_isi' => 'nullable|string',
            'sambutan_foto' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',

            // Kontak & Footer
            'kontak_alamat' => 'nullable|string|max:500',
            'kontak_telepon' => 'nullable|string|max:50',
            'kontak_email' => 'nullable|email|max:100',
            'kontak_facebook' => 'nullable|string|max:255',
            'kontak_instagram' => 'nullable|string|max:255',
            'kontak_youtube' => 'nullable|string|max:255',
            'kontak_twitter' => 'nullable|string|max:255',
        ]);

        // Simpan field teks biasa
        $textFields = [
            'hero_tagline', 'hero_title', 'hero_subtitle',
            'hero_cta_text_1', 'hero_cta_link_1',
            'hero_cta_text_2', 'hero_cta_link_2',
            'sambutan_tag', 'sambutan_title', 'sambutan_nama_ketua',
            'sambutan_jabatan', 'sambutan_isi',
            'kontak_alamat', 'kontak_telepon', 'kontak_email',
            'kontak_facebook', 'kontak_instagram', 'kontak_youtube', 'kontak_twitter',
        ];

        foreach ($textFields as $field) {
            if ($request->has($field)) {
                DB::table('settings')->updateOrInsert(
                    ['key' => $field],
                    ['value' => $request->input($field), 'updated_at' => now()]
                );
            }
        }

        // Simpan Hero Slides (gambar)
        $imageFields = [
            'hero_slide_1' => 'landing-hero',
            'hero_slide_2' => 'landing-hero',
            'hero_slide_3' => 'landing-hero',
            'sambutan_foto' => 'landing-sambutan',
        ];

        foreach ($imageFields as $field => $folder) {
            if ($request->hasFile($field)) {
                // Hapus file lama jika ada
                $oldPath = DB::table('settings')->where('key', $field)->value('value');
                if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }

                $path = $request->file($field)->store($folder, 'public');
                DB::table('settings')->updateOrInsert(
                    ['key' => $field],
                    ['value' => $path, 'updated_at' => now()]
                );
            }
        }

        // Hapus cache agar frontend langsung update
        Cache::forget('app_settings');
        Cache::forget('landing_settings');

        return redirect()->back()->with('success', 'Tampilan dan konten landing page berhasil diperbarui!');
    }

    /**
     * Hapus gambar tertentu dan reset ke default
     */
    public function removeImage(Request $request)
    {
        $request->validate([
            'key' => 'required|string|in:hero_slide_1,hero_slide_2,hero_slide_3,sambutan_foto',
        ]);

        $key = $request->input('key');
        $oldPath = DB::table('settings')->where('key', $key)->value('value');
        if ($oldPath && Storage::disk('public')->exists($oldPath)) {
            Storage::disk('public')->delete($oldPath);
        }

        DB::table('settings')->where('key', $key)->delete();
        Cache::forget('landing_settings');

        return redirect()->back()->with('success', 'Foto berhasil dihapus dan dikembalikan ke default.');
    }
}
