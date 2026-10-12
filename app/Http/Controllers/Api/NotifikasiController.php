<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotifikasiController extends Controller
{
    /**
     * List notifikasi milik sendiri (terbaru dulu) + jumlah belum dibaca.
     * GET /api/notifikasi
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $notif = $user->notifications()
            ->latest()
            ->paginate(20)
            ->through(function ($n) {
                return $this->format($n);
            });

        return response()->json([
            'success' => true,
            'data' => $notif->items(),
            'unread_count' => $user->unreadNotifications()->count(),
            'meta' => [
                'current_page' => $notif->currentPage(),
                'last_page' => $notif->lastPage(),
                'per_page' => $notif->perPage(),
                'total' => $notif->total(),
            ],
        ]);
    }

    /**
     * Jumlah belum dibaca saja (untuk badge lonceng).
     * GET /api/notifikasi/unread-count
     */
    public function unreadCount(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => ['unread_count' => $request->user()->unreadNotifications()->count()],
        ]);
    }

    /**
     * Tandai satu notifikasi sudah dibaca.
     * POST /api/notifikasi/{id}/baca
     */
    public function tandaiBaca(Request $request, string $id)
    {
        $notif = $request->user()->notifications()->where('id', $id)->firstOrFail();
        $notif->markAsRead();

        return response()->json([
            'success' => true,
            'message' => 'Notifikasi ditandai dibaca.',
            'data' => $this->format($notif->fresh()),
        ]);
    }

    /**
     * Tandai semua sudah dibaca.
     * POST /api/notifikasi/baca-semua
     */
    public function bacaSemua(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();

        return response()->json([
            'success' => true,
            'message' => 'Semua notifikasi ditandai dibaca.',
        ]);
    }

    private function format($n): array
    {
        $d = $n->data ?? [];

        return [
            'id' => $n->id,
            'type' => $d['type'] ?? 'info',
            'message' => $d['message'] ?? 'Ada pembaruan.',
            'judul' => $d['judul'] ?? null,
            'agenda_id' => $d['agenda_id'] ?? $d['record_id'] ?? null,
            'tanggal' => $d['tanggal'] ?? null,
            'lokasi' => $d['lokasi'] ?? null,
            'url' => $d['url'] ?? null,
            'is_read' => $n->read_at !== null,
            // ISO8601 + offset agar selisih "x mnt lalu" di HP benar
            // (server UTC, HP WIB — format polos bikin selisih 7 jam).
            'created_at' => $n->created_at?->toISOString(),
        ];
    }
}
