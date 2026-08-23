<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Illuminate\Support\Str;

class Agenda extends Model
{
    use HasFactory;

    protected $table = 'agendas';

    protected $fillable = [
        'judul',
        'deskripsi',
        'tanggal',
        'waktu',
        'lokasi',
        'status',      // tambahin
        'slug',        // tambahin
        'gambar',      // tambahin
    ];

    protected $casts = [
        'tanggal' => 'date',
        'waktu' => 'datetime:H:i',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $attributes = [
        'status' => 'upcoming',
    ];

    /**
     * Boot method untuk auto-generate slug
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($agenda) {
            if (empty($agenda->slug)) {
                $agenda->slug = Str::slug($agenda->judul) . '-' . uniqid();
            }
        });

        static::updating(function ($agenda) {
            if ($agenda->isDirty('judul') && empty($agenda->slug)) {
                $agenda->slug = Str::slug($agenda->judul) . '-' . uniqid();
            }
        });
    }

    /**
     * Accessor: Format tanggal Indonesia
     */
    public function getTanggalFormattedAttribute(): string
    {
        return Carbon::parse($this->tanggal)->translatedFormat('l, d F Y');
    }

    /**
     * Accessor: Format waktu
     */
    public function getWaktuFormattedAttribute(): string
    {
        return $this->waktu ? Carbon::parse($this->waktu)->format('H:i') : '-';
    }

    /**
     * Accessor: Status badge color
     */
    public function getStatusBadgeAttribute(): string
    {
        return match ($this->status) {
            'upcoming' => 'bg-blue-100 text-blue-700',
            'ongoing' => 'bg-green-100 text-green-700',
            'completed' => 'bg-gray-100 text-gray-700',
            'cancelled' => 'bg-red-100 text-red-700',
            default => 'bg-gray-100 text-gray-700',
        };
    }

    /**
     * Accessor: Status label
     */
    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'upcoming' => 'Akan Datang',
            'ongoing' => 'Sedang Berlangsung',
            'completed' => 'Selesai',
            'cancelled' => 'Dibatalkan',
            default => 'Unknown',
        };
    }

    // ============================================================
    // SCOPES
    // ============================================================

    /**
     * Scope: Agenda dengan tanggal hari ini
     */
    public function scopeToday($query)
    {
        return $query->whereDate('tanggal', Carbon::today());
    }

    /**
     * Scope: Agenda hari ini dan ke depan (upcoming)
     */
    public function scopeUpcoming($query)
    {
        return $query->whereDate('tanggal', '>=', Carbon::today())
            ->where('status', '!=', 'cancelled')
            ->where('status', '!=', 'completed')
            ->orderBy('tanggal', 'asc')
            ->orderBy('waktu', 'asc');
    }

    /**
     * Scope: Agenda yang sudah selesai
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed')
            ->orderBy('tanggal', 'desc');
    }

    /**
     * Scope: Agenda berdasarkan bulan tertentu
     */
    public function scopeBulan($query, $bulan, $tahun = null)
    {
        $tahun = $tahun ?? Carbon::now()->year;
        return $query->whereYear('tanggal', $tahun)
            ->whereMonth('tanggal', $bulan);
    }

    /**
     * Scope: Agenda berdasarkan rentang tanggal
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('tanggal', [$startDate, $endDate]);
    }

    /**
     * Scope: Pencarian berdasarkan judul
     */
    public function scopeSearch($query, $keyword)
    {
        return $query->where('judul', 'LIKE', "%{$keyword}%")
            ->orWhere('deskripsi', 'LIKE', "%{$keyword}%");
    }

    // ============================================================
    // HELPER METHODS
    // ============================================================

    /**
     * Cek apakah agenda masih upcoming
     */
    public function isUpcoming(): bool
    {
        return $this->status === 'upcoming' && $this->tanggal->isFuture();
    }

    /**
     * Cek apakah agenda hari ini
     */
    public function isToday(): bool
    {
        return $this->tanggal->isToday();
    }

    /**
     * Cek apakah agenda sudah lewat
     */
    public function isPast(): bool
    {
        return $this->tanggal->isPast() && $this->status !== 'upcoming';
    }

    /**
     * Cek apakah agenda sedang berlangsung
     */
    public function isOngoing(): bool
    {
        return $this->status === 'ongoing';
    }

    /**
     * Update status secara otomatis berdasarkan tanggal
     */
    public function updateStatusAutomatically(): void
    {
        if ($this->status === 'cancelled') {
            return;
        }

        if ($this->tanggal->isPast()) {
            $this->status = 'completed';
        } elseif ($this->tanggal->isToday()) {
            $this->status = 'ongoing';
        } else {
            $this->status = 'upcoming';
        }

        $this->save();
    }

    /**
     * Get URL untuk detail agenda
     */
    public function getUrlAttribute(): string
    {
        return $this->slug
            ? route('agenda.show', $this->slug)
            : route('agenda.show', $this->id);
    }

    /**
     * Get thumbnail URL
     */
    public function getThumbnailUrlAttribute(): string
    {
        if ($this->gambar) {
            return asset('storage/' . $this->gambar);
        }
        return asset('assets/images/default-agenda.jpg');
    }
}
