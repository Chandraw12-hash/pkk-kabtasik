import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import axios from "axios";
import {
    Cloud,
    CloudDrizzle,
    CloudFog,
    CloudLightning,
    CloudRain,
    CloudSnow,
    CloudSun,
    Droplets,
    MapPin,
    RefreshCw,
    Sun,
    Thermometer,
    Wind,
    X,
} from "lucide-react";

interface WeatherData {
    temperature: number;
    feels_like: number;
    humidity: number;
    precipitation: number;
    wind_speed: number;
    weather_code: number;
    weather: {
        label: string;
        icon: string;
    };
    location: string;
    updated_at: string;
}

type WeatherIconComponent = React.ComponentType<{
    size?: number;
    strokeWidth?: string;
    className?: string;
}>;

const WEATHER_ICONS: Record<string, WeatherIconComponent> = {
    sun: Sun,
    "cloud-sun": CloudSun,
    cloud: Cloud,
    "cloud-fog": CloudFog,
    "cloud-drizzle": CloudDrizzle,
    "cloud-rain": CloudRain,
    "cloud-snow": CloudSnow,
    "cloud-lightening": CloudLightning,
};

export default function WeatherWidget() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const panelRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const closeButtonRef = useRef<HTMLButtonElement | null>(null);

    // ============================================================
    // FETCH CUACA
    // ============================================================
    const fetchWeather = useCallback(async (showRefresh = false) => {
        if (showRefresh) {
            setIsRefreshing(true);
        }

        try {
            const response = await axios.get("/api/weather", {
                headers: { Accept: "application/json" },
            });

            if (response.data?.success && response.data?.data) {
                setWeather(response.data.data);
                setError(false);
            } else {
                setError(true);
            }
        } catch (err) {
            console.error("Error fetching weather:", err);
            setError(true);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    // ============================================================
    // AUTO REFRESH 10 MENIT
    // ============================================================
    useEffect(() => {
        void fetchWeather();

        const interval = window.setInterval(() => {
            void fetchWeather();
        }, 600000);

        return () => {
            window.clearInterval(interval);
        };
    }, [fetchWeather]);

    // ============================================================
    // TUTUP PANEL + KEMBALIKAN FOKUS
    // ============================================================
    const closePanel = useCallback(() => {
        setIsOpen(false);
        requestAnimationFrame(() => {
            triggerRef.current?.focus();
        });
    }, []);

    // ============================================================
    // ESC + CLICK DI LUAR + FOCUS TRAP
    // ============================================================
    useEffect(() => {
        if (!isOpen) return;

        const previouslyFocused = document.activeElement as HTMLElement | null;

        requestAnimationFrame(() => {
            closeButtonRef.current?.focus();
        });

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node | null;
            if (panelRef.current && target && !panelRef.current.contains(target)) {
                closePanel();
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                closePanel();
                return;
            }

            if (event.key !== "Tab" || !panelRef.current) return;

            const focusableElements = Array.from(
                panelRef.current.querySelectorAll<HTMLElement>(
                    'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
                )
            ).filter((el) => el.offsetParent !== null);

            if (focusableElements.length === 0) {
                event.preventDefault();
                panelRef.current.focus();
                return;
            }

            const first = focusableElements[0];
            const last = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);

            if (document.body.contains(previouslyFocused)) {
                previouslyFocused?.focus?.();
            }
        };
    }, [closePanel, isOpen]);

    // ============================================================
    // ICON CUACA
    // ============================================================
    const getWeatherIcon = useCallback(
        (iconName?: string, size = 24, className?: string) => {
            const Icon = WEATHER_ICONS[iconName || ""] ?? Cloud;

            return (
                <Icon
                    size={size}
                    strokeWidth={1.9}
                    className={className}
                    aria-hidden="true"
                />
            );
        },
        []
    );

    // ============================================================
    // FORMAT WAKTU UPDATE
    // ============================================================
    const formatUpdated = (iso?: string) => {
        if (!iso) return "—";
        const date = new Date(iso);
        if (Number.isNaN(date.getTime())) return iso;
        return date.toLocaleString("id-ID", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const panelTitle = weather?.location || "Kabupaten Tasikmalaya";
    const hasWeather = Boolean(weather);

    return (
        <>
            {/* =========================================================
                FLOATING WEATHER TRIGGER — WARNA BIRU PKK
            ========================================================= */}
            <button
                ref={triggerRef}
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label={isOpen ? "Tutup informasi cuaca" : "Buka informasi cuaca"}
                aria-expanded={isOpen}
                aria-haspopup="dialog"
                className="
                    fixed left-0 top-1/2 z-[55]
                    -translate-y-1/2
                    flex flex-col items-center justify-center
                    gap-1.5
                    min-h-[112px] w-[40px]
                    rounded-r-xl
                    border border-l-0 border-[#0072BC]/30
                    bg-[#0072BC] text-white
                    px-1.5 py-3.5
                    shadow-[0_10px_26px_-14px_rgba(15,118,110,0.65)]
                    transition-colors duration-150
                    hover:bg-[#FFC72C] hover:text-[#0072BC]
                    focus:outline-none
                    focus-visible:ring-2 focus-visible:ring-[#FFC72C] focus-visible:ring-offset-2
                    sm:min-h-[124px]
                    sm:w-[42px]
                    sm:px-2
                "
            >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white">
                    {isLoading ? (
                        <span className="block h-3.5 w-3.5 animate-pulse rounded-full bg-white/45" aria-hidden="true" />
                    ) : (
                        getWeatherIcon(weather?.weather.icon, 17, "text-white")
                    )}
                </span>

                <span className="text-[10px] font-semibold tracking-wide sm:text-[11px]">
                    {isLoading ? "—" : weather ? `${Math.round(weather.temperature)}°` : "Cuaca"}
                </span>

                <span
                    className="text-[8px] font-medium uppercase tracking-[0.12em] text-white/80 sm:text-[9px] sm:tracking-[0.14em]"
                    style={{ writingMode: "vertical-rl" }}
                >
                    Cuaca
                </span>
            </button>

            {/* =========================================================
                DETAIL PANEL — WARNA BIRU PKK
            ========================================================= */}
            <div
                ref={panelRef}
                tabIndex={-1}
                className={[
                    "fixed z-[60] overflow-hidden bg-white",
                    "border border-slate-200",
                    "shadow-[0_18px_50px_-22px_rgba(15,23,42,0.35)]",
                    "transition-[opacity,transform] duration-200 ease-out",
                    "rounded-xl",
                    // Mobile
                    "left-[52px] right-3 top-1/2 w-auto -translate-y-1/2",
                    // Desktop
                    "sm:left-[56px] sm:right-auto sm:top-1/2 sm:w-[310px]",
                    isOpen
                        ? "pointer-events-auto translate-x-0 scale-100 opacity-100"
                        : "pointer-events-none -translate-x-2 scale-[0.98] opacity-0",
                ].join(" ")}
                role="dialog"
                aria-modal="true"
                aria-labelledby="weather-dialog-title"
                aria-hidden={!isOpen}
            >
                {/* ===== HEADER ===== */}
                <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-4 sm:px-5">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#0072BC]">
                                Informasi Cuaca
                            </p>

                            <div className="mt-1 flex min-w-0 items-center gap-1.5">
                                <MapPin size={13} strokeWidth={2} className="shrink-0 text-slate-400" aria-hidden="true" />
                                <span className="truncate text-[11px] font-medium text-slate-600">
                                    {panelTitle}
                                </span>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-1">
                            <button
                                type="button"
                                onClick={() => void fetchWeather(true)}
                                disabled={isRefreshing}
                                aria-label="Muat ulang data cuaca"
                                className="
                                    flex h-8 w-8 items-center justify-center
                                    rounded-lg
                                    text-slate-500
                                    transition-colors duration-150
                                    hover:bg-[#0072BC] hover:text-white
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                    focus:outline-none
                                    focus-visible:ring-2 focus-visible:ring-[#FFC72C]
                                "
                            >
                                <RefreshCw
                                    size={14}
                                    strokeWidth={2}
                                    className={isRefreshing ? "animate-spin" : ""}
                                    aria-hidden="true"
                                />
                            </button>

                            <button
                                ref={closeButtonRef}
                                type="button"
                                onClick={closePanel}
                                aria-label="Tutup panel cuaca"
                                className="
                                    flex h-8 w-8 items-center justify-center
                                    rounded-lg
                                    text-slate-500
                                    transition-colors duration-150
                                    hover:bg-slate-100 hover:text-slate-800
                                    focus:outline-none
                                    focus-visible:ring-2 focus-visible:ring-[#FFC72C]
                                "
                            >
                                <X size={14} strokeWidth={2} aria-hidden="true" />
                            </button>
                        </div>
                    </div>

                    <div className="mt-5 flex items-center gap-4">
                        <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-white text-[#0072BC] shadow-sm sm:h-[62px] sm:w-[62px]">
                            {hasWeather ? (
                                getWeatherIcon(weather?.weather.icon, 29)
                            ) : (
                                <Cloud size={29} strokeWidth={1.5} />
                            )}
                        </div>

                        <div className="min-w-0">
                            <h2 id="weather-dialog-title" className="sr-only">
                                Informasi cuaca Kabupaten Tasikmalaya
                            </h2>

                            <div className="flex items-end gap-1">
                                <span className="text-[34px] font-semibold leading-none tracking-tight tabular-nums text-slate-900 sm:text-[36px]">
                                    {weather?.temperature ?? "--"}
                                </span>

                                <span className="pb-0.5 text-sm font-medium text-slate-500">°C</span>
                            </div>

                            <p className="mt-1.5 truncate text-xs font-medium text-slate-600">
                                {error && !weather
                                    ? "Data cuaca tidak tersedia"
                                    : weather?.weather.label || "Memuat data cuaca..."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ===== BODY ===== */}
                <div className="px-4 py-4">
                    <div className="grid grid-cols-3 gap-2">
                        <DetailStat
                            icon={<Droplets size={14} />}
                            iconClass="text-sky-600"
                            label="Kelembapan"
                            value={weather?.humidity ?? "--"}
                            suffix="%"
                        />
                        <DetailStat
                            icon={<Wind size={14} />}
                            iconClass="text-cyan-600"
                            label="Angin"
                            value={weather?.wind_speed ?? "--"}
                            suffix="km/j"
                        />
                        <DetailStat
                            icon={<Thermometer size={14} />}
                            iconClass="text-amber-600"
                            label="Terasa"
                            value={weather?.feels_like ?? "--"}
                            suffix="°"
                        />
                    </div>

                    <p className="mt-3 text-center text-[9px] leading-relaxed text-slate-400">
                        Data cuaca diperbarui secara berkala.
                    </p>
                </div>

                {/* ===== FOOTER ===== */}
                <div className="border-t border-slate-100 px-4 py-3.5 sm:px-5">
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-slate-400">
                            Diperbarui
                        </span>

                        <span className="text-[10px] font-medium text-slate-500">
                            {formatUpdated(weather?.updated_at)}
                        </span>
                    </div>
                </div>
            </div>

            <style>{`
                @media (prefers-reduced-motion: reduce) {
                    .weather-widget-panel,
                    .weather-widget-trigger {
                        transition: none !important;
                    }
                }
            `}</style>
        </>
    );
}

function DetailStat({
    icon,
    iconClass,
    label,
    value,
    suffix,
}: {
    icon: React.ReactNode;
    iconClass: string;
    label: string;
    value: string | number;
    suffix?: string;
}) {
    return (
        <div className="rounded-lg border border-slate-200 bg-slate-50/70 px-2 py-3 text-center">
            <div className={`mb-1.5 flex items-center justify-center ${iconClass}`}>
                {icon}
            </div>

            <p className="mb-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                {label}
            </p>

            <p className="text-[12px] font-semibold leading-none tabular-nums text-slate-800 sm:text-[13px]">
                {value}
                {suffix && (
                    <span className="ml-0.5 text-[9px] font-medium text-slate-400">
                        {suffix}
                    </span>
                )}
            </p>
        </div>
    );
}
