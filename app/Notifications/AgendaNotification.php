<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class AgendaNotification extends Notification
{
    use Queueable;

    public function __construct(
        private readonly string $message,
        private readonly int $agendaId,
        private readonly string $judul,
        private readonly ?string $tanggal = null,
        private readonly ?string $lokasi = null,
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type' => 'agenda',
            'message' => $this->message,
            'agenda_id' => $this->agendaId,
            'judul' => $this->judul,
            'tanggal' => $this->tanggal,
            'lokasi' => $this->lokasi,
        ];
    }
}
