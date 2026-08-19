import React, { useEffect, useState } from "react";
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

export default function AccessibilityWidget() {
    const [open, setOpen] = useState(false);
    const [s, setS] = useState<Settings>(defaultSettings);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) setS({ ...defaultSettings, ...JSON.parse(raw) });
        } catch {
            /* ignore */
        }
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle("a11y-text-lg", s.fontScale === 1);
        root.classList.toggle("a11y-text-xl", s.fontScale === 2);
        root.classList.toggle("a11y-contrast", s.highContrast);
        root.classList.toggle("a11y-gray", s.grayscale);
        root.classList.toggle("a11y-underline", s.underlineLinks);
        root.classList.toggle("a11y-space", s.comfortableSpace);
        root.classList.toggle("a11y-font", s.easyFont);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    }, [s]);

    const update = (patch: Partial<Settings>) =>
        setS((prev) => ({ ...prev, ...patch }));

    const reset = () => setS(defaultSettings);

    const speakPage = () => {
        if (!("speechSynthesis" in window)) {
            alert("Browser tidak mendukung pembacaan teks.");
            return;
        }
        window.speechSynthesis.cancel();
        const text = document.body?.innerText?.slice(0, 3000) || "";
        const u = new SpeechSynthesisUtterance(text);
        u.lang = "id-ID";
        window.speechSynthesis.speak(u);
    };

    const stopSpeak = () => {
        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };

    const actionBtn = (active?: boolean) =>
        `flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-lg text-[13px] font-medium border transition-colors text-left ${
            active
                ? "border-teal-600 bg-teal-50 text-teal-800"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300"
        }`;

    return (
        <>
            {/* Tombol mengambang */}
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="fixed bottom-5 right-5 z-[60] w-12 h-12 rounded-full bg-teal-700 hover:bg-teal-800 text-white shadow-md flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2"
                aria-label="Buka pengaturan aksesibilitas"
            >
                <Accessibility size={22} strokeWidth={1.75} />
            </button>

            {open && (
                <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center sm:justify-end p-4 sm:p-6">
                    <button
                        type="button"
                        className="absolute inset-0 bg-slate-900/40"
                        aria-label="Tutup panel"
                        onClick={() => setOpen(false)}
                    />

                    <div
                        className="relative w-full max-w-[340px] bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="a11y-title"
                    >
                        {/* Header selaras tema PKK */}
                        <div className="bg-teal-800 px-5 py-4 flex items-start justify-between gap-3">
                            <div>
                                <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-teal-200/90 mb-0.5">
                                    Fitur disabilitas
                                </p>
                                <h2
                                    id="a11y-title"
                                    className="text-base font-semibold text-white"
                                >
                                    Aksesibilitas Website
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                                aria-label="Tutup"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="p-4 grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                className={actionBtn()}
                                onClick={speakPage}
                            >
                                <Volume2 size={16} className="text-teal-700 shrink-0" />
                                Baca halaman
                            </button>
                            <button
                                type="button"
                                className={actionBtn()}
                                onClick={stopSpeak}
                            >
                                <VolumeX size={16} className="text-slate-500 shrink-0" />
                                Stop suara
                            </button>

                            <button
                                type="button"
                                className={actionBtn(s.fontScale > 0)}
                                onClick={() =>
                                    update({
                                        fontScale: Math.min(2, s.fontScale + 1),
                                    })
                                }
                            >
                                <Plus size={16} className="text-teal-700 shrink-0" />
                                Perbesar teks
                            </button>
                            <button
                                type="button"
                                className={actionBtn()}
                                onClick={() =>
                                    update({
                                        fontScale: Math.max(0, s.fontScale - 1),
                                    })
                                }
                            >
                                <Minus size={16} className="text-slate-500 shrink-0" />
                                Perkecil teks
                            </button>

                            <button
                                type="button"
                                className={actionBtn(s.highContrast)}
                                onClick={() =>
                                    update({ highContrast: !s.highContrast })
                                }
                            >
                                <Contrast size={16} className="text-teal-700 shrink-0" />
                                Kontras tinggi
                            </button>
                            <button
                                type="button"
                                className={actionBtn(s.grayscale)}
                                onClick={() =>
                                    update({ grayscale: !s.grayscale })
                                }
                            >
                                <Circle size={16} className="text-slate-400 shrink-0" />
                                Abu-abu
                            </button>

                            <button
                                type="button"
                                className={actionBtn(s.underlineLinks)}
                                onClick={() =>
                                    update({ underlineLinks: !s.underlineLinks })
                                }
                            >
                                <Underline size={16} className="text-teal-700 shrink-0" />
                                Garis link
                            </button>
                            <button
                                type="button"
                                className={actionBtn(s.comfortableSpace)}
                                onClick={() =>
                                    update({
                                        comfortableSpace: !s.comfortableSpace,
                                    })
                                }
                            >
                                <Type size={16} className="text-teal-700 shrink-0" />
                                Spasi nyaman
                            </button>

                            <button
                                type="button"
                                className={actionBtn(s.easyFont)}
                                onClick={() => update({ easyFont: !s.easyFont })}
                            >
                                <Type size={16} className="text-teal-700 shrink-0" />
                                Font mudah baca
                            </button>
                            <button
                                type="button"
                                className={actionBtn()}
                                onClick={reset}
                            >
                                <RotateCcw size={16} className="text-slate-500 shrink-0" />
                                Reset
                            </button>
                        </div>

                        <p className="px-4 pb-4 text-[11px] text-slate-400 leading-relaxed">
                            Text reader membaca teks halaman. Preferensi disimpan di
                            perangkat ini.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
