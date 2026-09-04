import { useEffect, useRef } from "react";

const MARS_PKK_SRC = "/sound/mars-pkk.mp3";
const WELCOME_AUDIO_SRC = "/sound/welcome-pkk.mp3";
const WELCOME_SHOWN_KEY = "pkk-welcome-shown";

const SILENT_PAGES = [
    "profil", "program", "berita", "struktur",
    "sekretariat", "pokja-1", "pokja-2",
    "pokja-3", "pokja-4", "galeri", "dokumen", "survey"
];

export default function WelcomeGreeting() {
    const marsAudioRef = useRef<HTMLAudioElement | null>(null);
    const welcomeAudioRef = useRef<HTMLAudioElement | null>(null);
    const hasPlayedRef = useRef(false);
    const isMarsPausedRef = useRef(false);
    const isSessionActiveRef = useRef(false);

    // ─── ⭐ CEK SESSIONSTORAGE (BUKAN HAPUS) ────────────────────────────────
    // sessionStorage otomatis hilang kalau TAB DITUTUP — itu persis behavior
    // yang kamu mau: "1x per sesi tab". Sebelumnya kode ini malah MENGHAPUS
    // key ini setiap mount, jadi tiap refresh dianggap sesi baru & lagu
    // muter ulang dari awal. Sekarang kita CEK isinya, lalu tandai
    // hasPlayedRef supaya effect di bawah tahu harus skip atau tidak.
    //
    // Dibungkus try/catch: di beberapa browser (mis. Safari mode private),
    // akses sessionStorage bisa throw error diam-diam, yang bikin flag ini
    // GAK PERNAH kesimpen padahal kodenya kelihatan benar.
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
                if (!mars.paused) {
                    mars.pause();
                    isMarsPausedRef.current = true;
                    console.log("⏹️ MARS PAUSED (posisi:", mars.currentTime, ")", currentUrl);
                }
            } else {
                // 🔥 LANJUTKAN DARI POSISI TERAKHIR (JANGAN RESET)
                // Ini cuma jalan kalau lagu memang lagi aktif diputar di sesi
                // SEKARANG (isSessionActiveRef true). Kalau user baru refresh
                // dan belum interaksi lagi, ini sengaja TIDAK auto-resume,
                // supaya lagu beneran cuma "1x jalan" per sesi tab.
                if (hasPlayedRef.current && isSessionActiveRef.current) {
                    if (isMarsPausedRef.current || mars.paused) {
                        // 🔥 JANGAN RESET! LANJUT DARI POSISI TERAKHIR
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

    // ─── WELCOME + MARS (cuma jalan sekali per sesi tab) ────────────────────
    useEffect(() => {
        // ⭐ Kalau sesi tab ini sudah pernah muter (termasuk sebelum refresh),
        // jangan pasang listener klik/tap/keydown sama sekali. Ini yang bikin
        // lagu beneran "diam" kalau di-refresh, bukan cuma nunggu re-trigger.
        if (hasPlayedRef.current) return;

        const handleFirstInteraction = () => {
            if (hasPlayedRef.current) return;
            hasPlayedRef.current = true;
            isSessionActiveRef.current = true;

            // ⭐ Set flag SEBELUM audio selesai diputar — begitu user interaksi
            // pertama kali, sesi ini dianggap "sudah dapat welcome", jadi kalau
            // di tengah lagu user refresh, tetap tidak akan diulang.
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
