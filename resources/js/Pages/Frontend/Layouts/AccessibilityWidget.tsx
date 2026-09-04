import React, { useEffect, useRef, useState, useCallback } from "react";
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
// MAIN COMPONENT - FOKUS AKSESIBILITAS
// ============================================================
export default function AccessibilityWidget() {
    const [open, setOpen] = useState(false);
    const [s, setS] = useState<Settings>(defaultSettings);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // ─── LOAD PREFERENSI ──────────────────────────────────────────────────────
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                setS({ ...defaultSettings, ...parsed });
            }
        } catch {
            // ignore
        }
    }, []);

    // ─── TERAPKAN AKSESIBILITAS ──────────────────────────────────────────────
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
        if (s.fontScale === 1) root.classList.add("a11y-text-lg");
        if (s.fontScale === 2) root.classList.add("a11y-text-xl");
        if (s.highContrast) root.classList.add("a11y-contrast");
        if (s.grayscale) root.classList.add("a11y-gray");
        if (s.underlineLinks) root.classList.add("a11y-underline");
        if (s.comfortableSpace) root.classList.add("a11y-space");
        if (s.easyFont) root.classList.add("a11y-font");
        localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    }, [s]);

    // ─── TEXT-TO-SPEECH ──────────────────────────────────────────────────────
    const speakPage = useCallback(() => {
        if (!("speechSynthesis" in window)) {
            alert("Browser tidak mendukung pembacaan teks.");
            return;
        }

        window.speechSynthesis.cancel();

        const text = document.body?.innerText?.slice(0, 3000) || "";
        if (!text) {
            alert("Tidak ada teks untuk dibaca.");
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "id-ID";
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    }, []);

    const stopSpeak = useCallback(() => {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    }, []);

    // ─── HANDLER UPDATE ──────────────────────────────────────────────────────
    const update = useCallback((patch: Partial<Settings>) => {
        setS((prev) => ({ ...prev, ...patch }));
    }, []);

    const reset = useCallback(() => {
        setS({ ...defaultSettings });
        localStorage.removeItem(STORAGE_KEY);
        window.location.reload();
    }, []);

    const actionBtn = useCallback((active?: boolean) => {
        return `flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-lg text-[13px] font-medium border transition-colors text-left ${
            active
                ? "border-teal-600 bg-teal-50 text-teal-800 ring-1 ring-teal-200"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300"
        }`;
    }, []);

    // ─── RENDER ──────────────────────────────────────────────────────────────
    return (
        <>
            {/* Tombol Floating */}
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="fixed bottom-5 right-5 z-[60] w-12 h-12 rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
                aria-label="Buka pengaturan aksesibilitas"
            >
                <Accessibility size={22} strokeWidth={1.75} />
            </button>

            {/* Modal Widget */}
            {open && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                        aria-label="Tutup panel"
                        onClick={() => setOpen(false)}
                    />

                    <div
                        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="a11y-title"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase text-teal-100/80">
                                        <span className="w-1.5 h-1.5 rounded-full bg-teal-300"></span>
                                        Fitur Aksesibilitas
                                    </span>
                                    <h2 id="a11y-title" className="text-lg font-bold text-white mt-1">
                                        Pengaturan Aksesibilitas
                                    </h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                                    aria-label="Tutup"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <p className="text-sm text-teal-100/70 mt-1.5">
                                Sesuaikan tampilan website sesuai kebutuhan Anda
                            </p>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            <div className="grid grid-cols-2 gap-2.5">
                                {/* Baca Halaman */}
                                <button
                                    type="button"
                                    className={actionBtn(isSpeaking)}
                                    onClick={speakPage}
                                    disabled={isSpeaking}
                                >
                                    <Volume2 size={16} className="text-teal-600 shrink-0" />
                                    {isSpeaking ? "Membaca..." : "Baca halaman"}
                                </button>

                                {/* Stop Suara */}
                                <button
                                    type="button"
                                    className={actionBtn()}
                                    onClick={stopSpeak}
                                    disabled={!isSpeaking}
                                >
                                    <VolumeX size={16} className="text-slate-500 shrink-0" />
                                    Stop suara
                                </button>

                                {/* Perbesar Teks */}
                                <button
                                    type="button"
                                    className={actionBtn(s.fontScale > 0)}
                                    onClick={() => update({ fontScale: Math.min(2, s.fontScale + 1) })}
                                >
                                    <Plus size={16} className="text-teal-600 shrink-0" />
                                    Perbesar teks
                                </button>

                                {/* Perkecil Teks */}
                                <button
                                    type="button"
                                    className={actionBtn()}
                                    onClick={() => update({ fontScale: Math.max(0, s.fontScale - 1) })}
                                    disabled={s.fontScale === 0}
                                >
                                    <Minus size={16} className="text-slate-500 shrink-0" />
                                    Perkecil teks
                                </button>

                                {/* Kontras Tinggi */}
                                <button
                                    type="button"
                                    className={actionBtn(s.highContrast)}
                                    onClick={() => update({ highContrast: !s.highContrast })}
                                >
                                    <Contrast size={16} className="text-teal-600 shrink-0" />
                                    Kontras tinggi
                                </button>

                                {/* Abu-abu */}
                                <button
                                    type="button"
                                    className={actionBtn(s.grayscale)}
                                    onClick={() => update({ grayscale: !s.grayscale })}
                                >
                                    <Circle size={16} className="text-slate-400 shrink-0" />
                                    Abu-abu
                                </button>

                                {/* Garis Link */}
                                <button
                                    type="button"
                                    className={actionBtn(s.underlineLinks)}
                                    onClick={() => update({ underlineLinks: !s.underlineLinks })}
                                >
                                    <Underline size={16} className="text-teal-600 shrink-0" />
                                    Garis link
                                </button>

                                {/* Spasi Nyaman */}
                                <button
                                    type="button"
                                    className={actionBtn(s.comfortableSpace)}
                                    onClick={() => update({ comfortableSpace: !s.comfortableSpace })}
                                >
                                    <Type size={16} className="text-teal-600 shrink-0" />
                                    Spasi nyaman
                                </button>

                                {/* Font Mudah Baca */}
                                <button
                                    type="button"
                                    className={actionBtn(s.easyFont)}
                                    onClick={() => update({ easyFont: !s.easyFont })}
                                >
                                    <Type size={16} className="text-teal-600 shrink-0" />
                                    Font mudah baca
                                </button>

                                {/* Reset */}
                                <button
                                    type="button"
                                    className={actionBtn()}
                                    onClick={reset}
                                >
                                    <RotateCcw size={16} className="text-slate-500 shrink-0" />
                                    Reset semua
                                </button>
                            </div>

                            <p className="mt-4 text-[11px] text-slate-400 leading-relaxed text-center">
                                Preferensi disimpan di perangkat Anda. <br />
                                Tekan Reset untuk mengembalikan ke default.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .animate-in { animation-duration: 200ms; }
                .fade-in { animation-name: fadeIn; }
                .zoom-in { animation-name: zoomIn; }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes zoomIn {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </>
    );
}

