<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class DasawismaRecordNotification extends Notification
{
    use Queueable;

    public function __construct(
        private readonly string $message,
        private readonly string $url,
        private readonly ?int $recordId = null,
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'message' => $this->message,
            'url' => $this->url,
            'record_id' => $this->recordId,
        ];
    }
}
