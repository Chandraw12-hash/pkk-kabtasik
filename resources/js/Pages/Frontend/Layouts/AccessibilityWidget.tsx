import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import {
    Accessibility,
    X,
    Plus,
    Minus,
    Contrast,
    Underline,
    Type,
    RotateCcw,
    Volume2,
    VolumeX,
    Circle,
} from "lucide-react";

const STORAGE_KEY = "pkk-a11y";

type Settings = {
    fontScale: number;
    highContrast: boolean;
    grayscale: boolean;
    underlineLinks: boolean;
    comfortableSpace: boolean;
    easyFont: boolean;
};

const defaultSettings: Settings = {
    fontScale: 0,
    highContrast: false,
    grayscale: false,
    underlineLinks: false,
    comfortableSpace: false,
    easyFont: false,
};

// ============================================================
// MAIN COMPONENT — AKSESIBILITAS
// ============================================================
export default function AccessibilityWidget() {
    const [open, setOpen] = useState(false);
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const dialogRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const closeButtonRef = useRef<HTMLButtonElement | null>(null);

    // ─────────────────────────────────────────────────────────
    // LOAD PREFERENSI TERSIMPAN
    // ─────────────────────────────────────────────────────────
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);

            if (!raw) return;

            const parsed = JSON.parse(raw) as Partial<Settings>;

            setSettings({
                ...defaultSettings,
                ...parsed,
                fontScale: Math.min(
                    2,
                    Math.max(0, Number(parsed.fontScale) || 0)
                ),
            });
        } catch {
            // Abaikan data localStorage yang tidak valid.
        }
    }, []);

    // ─────────────────────────────────────────────────────────
    // TERAPKAN PREFERENSI KE HTML ROOT
    // ─────────────────────────────────────────────────────────
    useEffect(() => {
        const root = document.documentElement;

        root.classList.remove(
            "a11y-text-lg",
            "a11y-text-xl",
            "a11y-contrast",
            "a11y-gray",
            "a11y-underline",
            "a11y-space",
            "a11y-font"
        );

        if (settings.fontScale === 1) {
            root.classList.add("a11y-text-lg");
        }

        if (settings.fontScale === 2) {
            root.classList.add("a11y-text-xl");
        }

        if (settings.highContrast) {
            root.classList.add("a11y-contrast");
        }

        if (settings.grayscale) {
            root.classList.add("a11y-gray");
        }

        if (settings.underlineLinks) {
            root.classList.add("a11y-underline");
        }

        if (settings.comfortableSpace) {
            root.classList.add("a11y-space");
        }

        if (settings.easyFont) {
            root.classList.add("a11y-font");
        }

        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(settings)
            );
        } catch {
            // Abaikan jika storage tidak tersedia.
        }
    }, [settings]);

    // ─────────────────────────────────────────────────────────
    // BACA HALAMAN
    // ─────────────────────────────────────────────────────────
    const speakPage = useCallback(() => {
        if (!("speechSynthesis" in window)) {
            return;
        }

        window.speechSynthesis.cancel();

        const pageText =
            document.body?.innerText?.replace(/\s+/g, " ").trim() || "";

        const text = pageText.slice(0, 3000);

        if (!text) {
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);

        utterance.lang = "id-ID";
        utterance.rate = 0.95;
        utterance.pitch = 1;

        utterance.onstart = () => {
            setIsSpeaking(true);
        };

        utterance.onend = () => {
            setIsSpeaking(false);
        };

        utterance.onerror = () => {
            setIsSpeaking(false);
        };

        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
    }, []);

    // ─────────────────────────────────────────────────────────
    // HENTIKAN PEMBACAAN
    // ─────────────────────────────────────────────────────────
    const stopSpeak = useCallback(() => {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }

        setIsSpeaking(false);
    }, []);

    // Pastikan suara berhenti ketika komponen dilepas.
    useEffect(() => {
        return () => {
            if ("speechSynthesis" in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    // ─────────────────────────────────────────────────────────
    // UPDATE SETTING
    // ─────────────────────────────────────────────────────────
    const update = useCallback(
        (patch: Partial<Settings>) => {
            setSettings((previous) => ({
                ...previous,
                ...patch,
            }));
        },
        []
    );

    // ─────────────────────────────────────────────────────────
    // RESET
    // ─────────────────────────────────────────────────────────
    const reset = useCallback(() => {
        setSettings(defaultSettings);

        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch {
            // Abaikan jika storage tidak tersedia.
        }

        setIsSpeaking(false);
        stopSpeak();
    }, [stopSpeak]);

    // ─────────────────────────────────────────────────────────
    // BUKA PANEL
    // ─────────────────────────────────────────────────────────
    const openPanel = useCallback(() => {
        setOpen(true);
    }, []);

    // ─────────────────────────────────────────────────────────
    // TUTUP PANEL
    // ─────────────────────────────────────────────────────────
    const closePanel = useCallback(() => {
        setOpen(false);
        stopSpeak();

        requestAnimationFrame(() => {
            triggerRef.current?.focus();
        });
    }, [stopSpeak]);

    // ─────────────────────────────────────────────────────────
    // ESC + FOCUS TRAP
    // ─────────────────────────────────────────────────────────
    useEffect(() => {
        if (!open) return;

        const previouslyFocused =
            document.activeElement as HTMLElement | null;

        requestAnimationFrame(() => {
            closeButtonRef.current?.focus();
        });

        const handleKeyDown = (event: KeyboardEvent) => {
            if (!dialogRef.current) return;

            if (event.key === "Escape") {
                event.preventDefault();
                closePanel();
                return;
            }

            if (event.key !== "Tab") return;

            const focusableElements = Array.from(
                dialogRef.current.querySelectorAll<HTMLElement>(
                    'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
                )
            ).filter(
                (element) => element.offsetParent !== null
            );

            if (focusableElements.length === 0) {
                event.preventDefault();
                dialogRef.current.focus();
                return;
            }

            const first = focusableElements[0];
            const last =
                focusableElements[focusableElements.length - 1];

            if (
                event.shiftKey &&
                document.activeElement === first
            ) {
                event.preventDefault();
                last.focus();
            } else if (
                !event.shiftKey &&
                document.activeElement === last
            ) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );

            if (document.body.contains(previouslyFocused)) {
                previouslyFocused?.focus?.();
            }
        };
    }, [closePanel, open]);

    // ─────────────────────────────────────────────────────────
    // STYLE TOMBOL AKSI
    // ─────────────────────────────────────────────────────────
    const actionButtonClass = useCallback(
        (active = false, disabled = false) =>
            [
                "group flex items-center gap-3 w-full min-h-[52px]",
                "px-3.5 py-3 rounded-xl text-left",
                "border transition-colors duration-150",
                "focus:outline-none focus-visible:ring-2",
                "focus-visible:ring-teal-500 focus-visible:ring-offset-1",
                active
                    ? "border-teal-200 bg-teal-50 text-teal-800"
                    : "border-slate-200 bg-white text-slate-700",
                disabled
                    ? "opacity-45 cursor-not-allowed"
                    : "hover:border-teal-200 hover:bg-slate-50",
            ].join(" "),
        []
    );

    // ─────────────────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────────────────
    return (
        <>
            {/* ====================================================
                FLOATING ACCESSIBILITY BUTTON
                Saat halaman dibuka, hanya tombol kecil ini yang
                tampil. Panel tidak dibuka otomatis.
            ==================================================== */}
            <button
                ref={triggerRef}
                type="button"
                onClick={openPanel}
                aria-label="Buka pengaturan aksesibilitas"
                aria-haspopup="dialog"
                aria-expanded={open}
                className="
                    fixed right-5 bottom-5 z-[60]
                    flex h-12 w-12 items-center justify-center
                    rounded-full
                    bg-teal-700 text-white
                    shadow-[0_8px_24px_rgba(15,118,110,0.22)]
                    transition-colors duration-150
                    hover:bg-teal-800
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-teal-500
                    focus-visible:ring-offset-2
                "
            >
                <Accessibility
                    size={21}
                    strokeWidth={1.9}
                    aria-hidden="true"
                />
            </button>

            {/* ====================================================
                ACCESSIBILITY DIALOG
                Tidak tampil otomatis saat website dibuka.
                X / Escape / klik overlay = kembali ke halaman.
            ==================================================== */}
            {open && (
                <div
                    className="
                        fixed inset-0 z-[70]
                        flex items-center justify-center
                        bg-slate-950/45
                        p-4
                        backdrop-blur-[2px]
                    "
                    role="presentation"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closePanel();
                        }
                    }}
                >
                    <div
                        ref={dialogRef}
                        tabIndex={-1}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="a11y-title"
                        aria-describedby="a11y-description"
                        className="
                            relative w-full max-w-lg
                            overflow-hidden
                            rounded-2xl
                            border border-slate-200
                            bg-white
                            shadow-[0_24px_70px_rgba(15,23,42,0.22)]
                        "
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >
                        {/* ====================================================
                            HEADER
                        ==================================================== */}
                        <div className="border-b border-teal-700/20 bg-teal-700 px-5 py-5 sm:px-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <div className="mb-1.5 flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-teal-200" />

                                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-100">
                                            Fitur Aksesibilitas
                                        </p>
                                    </div>

                                    <h2
                                        id="a11y-title"
                                        className="text-lg font-semibold tracking-tight text-white sm:text-xl"
                                    >
                                        Pengaturan Aksesibilitas
                                    </h2>

                                    <p
                                        id="a11y-description"
                                        className="mt-1.5 max-w-md text-sm leading-relaxed text-teal-50/85"
                                    >
                                        Sesuaikan tampilan website
                                        agar lebih nyaman digunakan.
                                    </p>
                                </div>

                                <button
                                    ref={closeButtonRef}
                                    type="button"
                                    onClick={closePanel}
                                    aria-label="Tutup pengaturan aksesibilitas"
                                    className="
                                        flex h-9 w-9 shrink-0
                                        items-center justify-center
                                        rounded-lg
                                        bg-white/10
                                        text-white
                                        transition-colors
                                        hover:bg-white/15
                                        focus:outline-none
                                        focus-visible:ring-2
                                        focus-visible:ring-white/70
                                    "
                                >
                                    <X
                                        size={18}
                                        strokeWidth={1.9}
                                        aria-hidden="true"
                                    />
                                </button>
                            </div>
                        </div>

                        {/* ====================================================
                            CONTENT
                        ==================================================== */}
                        <div className="max-h-[70vh] overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
                            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                {/* BACA HALAMAN */}
                                <button
                                    type="button"
                                    className={actionButtonClass(
                                        isSpeaking
                                    )}
                                    onClick={speakPage}
                                    disabled={isSpeaking}
                                    aria-pressed={isSpeaking}
                                >
                                    <span
                                        className={`
                                            flex h-9 w-9 shrink-0
                                            items-center justify-center
                                            rounded-lg
                                            ${
                                                isSpeaking
                                                    ? "bg-teal-100 text-teal-700"
                                                    : "bg-slate-50 text-teal-700"
                                            }
                                        `}
                                    >
                                        <Volume2
                                            size={17}
                                            strokeWidth={1.9}
                                            aria-hidden="true"
                                        />
                                    </span>

                                    <span className="min-w-0 flex-1">
                                        <span className="block text-[13px] font-semibold text-slate-800">
                                            {isSpeaking
                                                ? "Sedang membaca"
                                                : "Baca halaman"}
                                        </span>

                                        <span className="mt-0.5 block text-[10px] text-slate-400">
                                            Baca teks halaman
                                        </span>
                                    </span>
                                </button>

                                {/* STOP SUARA */}
                                <button
                                    type="button"
                                    className={actionButtonClass(
                                        false,
                                        !isSpeaking
                                    )}
                                    onClick={stopSpeak}
                                    disabled={!isSpeaking}
                                >
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                                        <VolumeX
                                            size={17}
                                            strokeWidth={1.9}
                                            aria-hidden="true"
                                        />
                                    </span>

                                    <span className="min-w-0 flex-1">
                                        <span className="block text-[13px] font-semibold text-slate-800">
                                            Stop suara
                                        </span>

                                        <span className="mt-0.5 block text-[10px] text-slate-400">
                                            Hentikan pembacaan
                                        </span>
                                    </span>
                                </button>

                                {/* PERBESAR TEKS */}
                                <button
                                    type="button"
                                    className={actionButtonClass(
                                        settings.fontScale > 0
                                    )}
                                    onClick={() =>
                                        update({
                                            fontScale: Math.min(
                                                2,
                                                settings.fontScale + 1
                                            ),
                                        })
                                    }
                                    aria-label="Perbesar ukuran teks"
                                >
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-teal-700">
                                        <Plus
                                            size={18}
                                            strokeWidth={1.9}
                                            aria-hidden="true"
                                        />
                                    </span>

                                    <span className="text-[13px] font-semibold text-slate-800">
                                        Perbesar teks
                                    </span>
                                </button>

                                {/* PERKECIL TEKS */}
                                <button
                                    type="button"
                                    className={actionButtonClass(
                                        false,
                                        settings.fontScale === 0
                                    )}
                                    onClick={() =>
                                        update({
                                            fontScale: Math.max(
                                                0,
                                                settings.fontScale - 1
                                            ),
                                        })
                                    }
                                    disabled={settings.fontScale === 0}
                                    aria-label="Perkecil ukuran teks"
                                >
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                                        <Minus
                                            size={18}
                                            strokeWidth={1.9}
                                            aria-hidden="true"
                                        />
                                    </span>

                                    <span className="text-[13px] font-semibold text-slate-800">
                                        Perkecil teks
                                    </span>
                                </button>

                                {/* KONTRAS TINGGI */}
                                <button
                                    type="button"
                                    className={actionButtonClass(
                                        settings.highContrast
                                    )}
                                    onClick={() =>
                                        update({
                                            highContrast:
                                                !settings.highContrast,
                                        })
                                    }
                                    aria-pressed={
                                        settings.highContrast
                                    }
                                >
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-teal-700">
                                        <Contrast
                                            size={17}
                                            strokeWidth={1.9}
                                            aria-hidden="true"
                                        />
                                    </span>

                                    <span className="text-[13px] font-semibold text-slate-800">
                                        Kontras tinggi
                                    </span>
                                </button>

                                {/* ABU-ABU */}
                                <button
                                    type="button"
                                    className={actionButtonClass(
                                        settings.grayscale
                                    )}
                                    onClick={() =>
                                        update({
                                            grayscale:
                                                !settings.grayscale,
                                        })
                                    }
                                    aria-pressed={
                                        settings.grayscale
                                    }
                                >
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                                        <Circle
                                            size={17}
                                            strokeWidth={1.9}
                                            aria-hidden="true"
                                        />
                                    </span>

                                    <span className="text-[13px] font-semibold text-slate-800">
                                        Abu-abu
                                    </span>
                                </button>

                                {/* GARIS LINK */}
                                <button
                                    type="button"
                                    className={actionButtonClass(
                                        settings.underlineLinks
                                    )}
                                    onClick={() =>
                                        update({
                                            underlineLinks:
                                                !settings.underlineLinks,
                                        })
                                    }
                                    aria-pressed={
                                        settings.underlineLinks
                                    }
                                >
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-teal-700">
                                        <Underline
                                            size={17}
                                            strokeWidth={1.9}
                                            aria-hidden="true"
                                        />
                                    </span>

                                    <span className="text-[13px] font-semibold text-slate-800">
                                        Garis link
                                    </span>
                                </button>

                                {/* SPASI NYAMAN */}
                                <button
                                    type="button"
                                    className={actionButtonClass(
                                        settings.comfortableSpace
                                    )}
                                    onClick={() =>
                                        update({
                                            comfortableSpace:
                                                !settings.comfortableSpace,
                                        })
                                    }
                                    aria-pressed={
                                        settings.comfortableSpace
                                    }
                                >
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-teal-700">
                                        <Type
                                            size={17}
                                            strokeWidth={1.9}
                                            aria-hidden="true"
                                        />
                                    </span>

                                    <span className="text-[13px] font-semibold text-slate-800">
                                        Spasi nyaman
                                    </span>
                                </button>

                                {/* FONT MUDAH BACA */}
                                <button
                                    type="button"
                                    className={actionButtonClass(
                                        settings.easyFont
                                    )}
                                    onClick={() =>
                                        update({
                                            easyFont:
                                                !settings.easyFont,
                                        })
                                    }
                                    aria-pressed={
                                        settings.easyFont
                                    }
                                >
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-teal-700">
                                        <Type
                                            size={17}
                                            strokeWidth={1.9}
                                            aria-hidden="true"
                                        />
                                    </span>

                                    <span className="text-[13px] font-semibold text-slate-800">
                                        Font mudah baca
                                    </span>
                                </button>
                            </div>

                            {/* RESET */}
                            <div className="mt-5 border-t border-slate-100 pt-4">
                                <button
                                    type="button"
                                    onClick={reset}
                                    className="
                                        flex w-full items-center
                                        justify-center gap-2
                                        rounded-lg
                                        border border-slate-200
                                        bg-white
                                        px-4 py-2.5
                                        text-xs font-semibold
                                        text-slate-600
                                        transition-colors
                                        hover:border-slate-300
                                        hover:bg-slate-50
                                        hover:text-slate-800
                                        focus:outline-none
                                        focus-visible:ring-2
                                        focus-visible:ring-teal-500
                                        focus-visible:ring-offset-1
                                    "
                                >
                                    <RotateCcw
                                        size={15}
                                        strokeWidth={1.9}
                                        aria-hidden="true"
                                    />
                                    Reset semua pengaturan
                                </button>

                                <p className="mt-3 text-center text-[10px] leading-relaxed text-slate-400">
                                    Preferensi disimpan di perangkat Anda.
                                    <br />
                                    Pengaturan dapat dikembalikan kapan saja.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
