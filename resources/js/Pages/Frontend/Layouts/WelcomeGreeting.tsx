import { useEffect, useRef } from "react";

const MARS_PKK_SRC = "/sound/mars-pkk.mp3";
const WELCOME_AUDIO_SRC = "/sound/welcome-pkk.mp3";
const WELCOME_SHOWN_KEY = "pkk-welcome-shown";

// 🔥 FIX: tambahkan "login" dan "dashboard" ke daftar halaman senyap.
// Sebelumnya kedua halaman ini TIDAK ada di list, jadi waktu user
// pindah ke Login/Dashboard, sistem menganggapnya "bukan halaman
// senyap" dan malah me-resume lagu yang sedang jalan di sana.
const SILENT_PAGES = [
    "profil", "program", "berita", "struktur",
    "sekretariat", "pokja-1", "pokja-2",
    "pokja-3", "pokja-4", "galeri", "dokumen", "survey",
    "login", "dashboard",
];

// 🔥 FIX: helper buat cek apakah sedang di Beranda ("/"). Dipakai
// supaya lagu HANYA bisa mulai diputar kalau interaksi pertama user
// terjadi di Beranda — bukan di halaman manapun secara global.
const isBerandaPage = () => window.location.pathname === "/";

export default function WelcomeGreeting() {
    const marsAudioRef = useRef<HTMLAudioElement | null>(null);
    const welcomeAudioRef = useRef<HTMLAudioElement | null>(null);
    const hasPlayedRef = useRef(false);
    const isMarsPausedRef = useRef(false);
    const isSessionActiveRef = useRef(false);

    // ─── ⭐ CEK SESSIONSTORAGE (BUKAN HAPUS) ────────────────────────────────
    useEffect(() => {
        try {
            const alreadyShown =
                sessionStorage.getItem(WELCOME_SHOWN_KEY) === "true";

            console.log(
                "🔍 CEK sessionStorage saat mount:",
                sessionStorage.getItem(WELCOME_SHOWN_KEY)
            );

            if (alreadyShown) {
                hasPlayedRef.current = true;
                console.log("🔇 Welcome sudah pernah diputar di sesi tab ini — dilewati");
            }
        } catch (err) {
            console.warn("⚠️ sessionStorage tidak bisa diakses:", err);
        }
    }, []);

    // ─── INISIALISASI AUDIO ──────────────────────────────────────────────────
    useEffect(() => {
        const mars = new Audio(MARS_PKK_SRC);
        mars.loop = false;
        mars.volume = 0.5;
        marsAudioRef.current = mars;

        mars.addEventListener('ended', () => {
            isMarsPausedRef.current = false;
            console.log("⏹️ MARS ENDED");
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

    // ─── PANTAU URL (pause di halaman "silent", resume di beranda) ─────────────
    useEffect(() => {
        let prevUrl = window.location.pathname;

        const checkUrl = () => {
            const currentUrl = window.location.pathname;
            if (currentUrl === prevUrl) return;

            prevUrl = currentUrl;
            const isSilent = SILENT_PAGES.some((p) => currentUrl.includes(p));
            const mars = marsAudioRef.current;

            if (!mars) return;

            if (isSilent) {
                // 🔥 MATI (PAUSE) - SIMPAN POSISI
                // Sekarang ini juga otomatis berlaku untuk /login dan
                // /dashboard karena sudah ditambahkan ke SILENT_PAGES.
                if (!mars.paused) {
                    mars.pause();
                    isMarsPausedRef.current = true;
                    console.log("⏹️ MARS PAUSED (posisi:", mars.currentTime, ")", currentUrl);
                }
            } else {
                // 🔥 LANJUTKAN DARI POSISI TERAKHIR (JANGAN RESET)
                if (hasPlayedRef.current && isSessionActiveRef.current) {
                    if (isMarsPausedRef.current || mars.paused) {
                        mars.play()
                            .then(() => {
                                isMarsPausedRef.current = false;
                                console.log("▶️ MARS RESUME (dari posisi", mars.currentTime, ")", currentUrl);
                            })
                            .catch(() => {
                                console.log("⚠️ GAGAL RESUME");
                            });
                    }
                }
            }
        };

        const interval = setInterval(checkUrl, 300);

        return () => {
            clearInterval(interval);
        };
    }, []);

    // ─── WELCOME + MARS (cuma jalan sekali per sesi tab, KHUSUS BERANDA) ────
    useEffect(() => {
        if (hasPlayedRef.current) return;

        const handleFirstInteraction = () => {
            if (hasPlayedRef.current) return;

            // 🔥 FIX UTAMA: kalau interaksi pertama user terjadi BUKAN di
            // Beranda (misal user langsung buka /login atau /dashboard
            // dan klik di situ duluan), JANGAN mainkan apa-apa dan JANGAN
            // tandai hasPlayedRef — supaya listener ini tetap "menunggu"
            // sampai user benar-benar berada di Beranda saat berinteraksi.
            if (!isBerandaPage()) {
                console.log("🔇 Interaksi terjadi di luar Beranda — lagu tidak diputar");
                return;
            }

            hasPlayedRef.current = true;
            isSessionActiveRef.current = true;

            try {
                sessionStorage.setItem(WELCOME_SHOWN_KEY, "true");
                console.log(
                    "✅ sessionStorage SET:",
                    sessionStorage.getItem(WELCOME_SHOWN_KEY)
                );
            } catch (err) {
                console.warn("⚠️ Gagal menyimpan sessionStorage:", err);
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
                console.log("▶️ MARS PLAY (1x)");
            };

            welcomeAudio.addEventListener("ended", handleEnded);

            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('touchstart', handleFirstInteraction);
            document.removeEventListener('keydown', handleFirstInteraction);
        };

        document.addEventListener('click', handleFirstInteraction);
        document.addEventListener('touchstart', handleFirstInteraction);
        document.addEventListener('keydown', handleFirstInteraction);

        return () => {
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('touchstart', handleFirstInteraction);
            document.removeEventListener('keydown', handleFirstInteraction);
        };
    }, []);

    return null;
}
