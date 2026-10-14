import { useEffect, useRef } from "react";

const MARS_PKK_SRC = "/sound/mars-pkk.mp3";
const WELCOME_AUDIO_SRC = "/sound/welcome-pkk.mp3";
const WELCOME_SHOWN_KEY = "pkk-welcome-shown";

// 🔥 FIX: tambah semua route backend — desa, kecamatan, dashboard, dll
// biar lagu TIDAK nyala di halaman admin/desa/kecamatan.
const SILENT_PAGES = [
    // === FRONTEND PUBLIC ===
    "profil",
    "program",
    "berita",
    "struktur",
    "sekretariat",
    "pokja-1",
    "pokja-2",
    "pokja-3",
    "pokja-4",
    "galeri",
    "dokumen",
    "survey",
    "login",

    // === BACKEND ===
    "dashboard",
    "users",
    "roles",
    "settings",
    "kader",
    "indikator",
    "eviden",
    "infografis",
    "agenda",
    "laporan-kegiatan",
    "struktur-organisasi",

    // === DESA ===
    "desa",

    // === KECAMATAN ===
    "kecamatan",
];

// 🔥 Helper: cek apakah di Beranda
const isBerandaPage = () => window.location.pathname === "/";

// 🔥 Helper: cek apakah di halaman silent
const isSilentPage = (url: string) =>
    SILENT_PAGES.some((p) => url.includes(p));

export default function WelcomeGreeting() {
    const marsAudioRef = useRef<HTMLAudioElement | null>(null);
    const welcomeAudioRef = useRef<HTMLAudioElement | null>(null);
    const hasPlayedRef = useRef(false);
    const isMarsPausedRef = useRef(false);
    const isSessionActiveRef = useRef(false);

    // ─── CEK SESSIONSTORAGE ────────────────────────────────────────────────
    useEffect(() => {
        try {
            const alreadyShown =
                sessionStorage.getItem(WELCOME_SHOWN_KEY) === "true";

            if (alreadyShown) {
                hasPlayedRef.current = true;
            }
        } catch {
            // sessionStorage tidak tersedia (mode privat) — abaikan.
        }
    }, []);

    // ─── INISIALISASI AUDIO ──────────────────────────────────────────────────
    useEffect(() => {
        const mars = new Audio(MARS_PKK_SRC);
        mars.loop = false;
        mars.volume = 0.5;
        marsAudioRef.current = mars;

        mars.addEventListener("ended", () => {
            isMarsPausedRef.current = false;
        });

        const welcome = new Audio(WELCOME_AUDIO_SRC);
        welcome.loop = false;
        welcome.volume = 1;
        welcomeAudioRef.current = welcome;

        return () => {
            mars.pause();
            mars.src = "";
            marsAudioRef.current = null;

            welcome.pause();
            welcome.src = "";
            welcomeAudioRef.current = null;
        };
    }, []);

    // ─── PANTAU URL — PAUSE DI SILENT, RESUME DI BERANDA ───────────────────
    useEffect(() => {
        let prevUrl = window.location.pathname;

        const checkUrl = () => {
            const currentUrl = window.location.pathname;
            if (currentUrl === prevUrl) return;

            prevUrl = currentUrl;
            const silent = isSilentPage(currentUrl);
            const mars = marsAudioRef.current;
            const welcome = welcomeAudioRef.current;

            // === SILENT — PAUSE SEMUA AUDIO ===
            if (silent) {
                if (mars && !mars.paused) {
                    mars.pause();
                    isMarsPausedRef.current = true;
                }
                if (welcome && !welcome.paused) {
                    welcome.pause();
                }
                return;
            }

            // === BUKAN SILENT — RESUME DI BERANDA SAJA ===
            // Kalau user pindah ke halaman non-silent (bukan beranda),
            // jangan resume — biar aman.
            if (!isBerandaPage()) return;

            // Resume MARS kalau udah pernah main & lagi paused
            if (hasPlayedRef.current && isSessionActiveRef.current) {
                if (mars && (isMarsPausedRef.current || mars.paused)) {
                    mars.play()
                        .then(() => {
                            isMarsPausedRef.current = false;
                        })
                        .catch(() => {});
                }
            }
        };

        const interval = setInterval(checkUrl, 300);

        return () => {
            clearInterval(interval);
        };
    }, []);

    // ─── WELCOME + MARS — CUMA DI BERANDA ─────────────────────────────────
    useEffect(() => {
        if (hasPlayedRef.current) return;

        const handleFirstInteraction = () => {
            if (hasPlayedRef.current) return;

            // 🔥 Kalau interaksi BUKAN di Beranda → jangan mainkan lagu
            if (!isBerandaPage()) {
                return;
            }

            hasPlayedRef.current = true;
            isSessionActiveRef.current = true;

            try {
                sessionStorage.setItem(WELCOME_SHOWN_KEY, "true");
            } catch {
                // sessionStorage tidak tersedia — abaikan.
            }

            const welcomeAudio = welcomeAudioRef.current;
            if (!welcomeAudio) {
                if (marsAudioRef.current) {
                    marsAudioRef.current.play().catch(() => {});
                }
                return;
            }

            welcomeAudio.play().catch(() => {
                if (marsAudioRef.current) {
                    marsAudioRef.current.play().catch(() => {});
                }
            });

            const handleEnded = () => {
                welcomeAudio.removeEventListener("ended", handleEnded);
                if (marsAudioRef.current) {
                    marsAudioRef.current.currentTime = 0;
                    marsAudioRef.current.play().catch(() => {});
                }
            };

            welcomeAudio.addEventListener("ended", handleEnded);

            document.removeEventListener("click", handleFirstInteraction);
            document.removeEventListener("touchstart", handleFirstInteraction);
            document.removeEventListener("keydown", handleFirstInteraction);
        };

        document.addEventListener("click", handleFirstInteraction);
        document.addEventListener("touchstart", handleFirstInteraction);
        document.addEventListener("keydown", handleFirstInteraction);

        return () => {
            document.removeEventListener("click", handleFirstInteraction);
            document.removeEventListener("touchstart", handleFirstInteraction);
            document.removeEventListener("keydown", handleFirstInteraction);
        };
    }, []);

    return null;
}
