import { useEffect } from "react";

const WELCOME_KEY = "pkk-welcomed-v2";
const WELCOME_TEXT =
    "Selamat datang di website resmi Tim Penggerak PKK Kabupaten Tasikmalaya. " +
    "Bersama PKK, kita wujudkan keluarga sejahtera, bertaqwa, dan mandiri.";

export default function WelcomeGreeting() {
    useEffect(() => {
        // Sudah pernah diputar di sesi ini → skip
        if (sessionStorage.getItem(WELCOME_KEY)) return;
        if (!("speechSynthesis" in window)) return;

        let hasPlayed = false;

        const speak = () => {
            if (hasPlayed) return;
            hasPlayed = true;

            // Tandai sudah diputar SETELAH berhasil
            window.speechSynthesis.cancel();

            const utter = new SpeechSynthesisUtterance(WELCOME_TEXT);
            utter.lang = "id-ID";
            utter.rate = 0.9;
            utter.pitch = 1.05;
            utter.volume = 1;

            utter.onstart = () => {
                sessionStorage.setItem(WELCOME_KEY, "1");
            };

            // Pilih suara Indonesia jika tersedia
            const doSpeak = () => {
                const voices = window.speechSynthesis.getVoices();
                const idVoice = voices.find(
                    (v) => v.lang === "id-ID" || v.lang.startsWith("id")
                );
                if (idVoice) utter.voice = idVoice;
                window.speechSynthesis.speak(utter);
            };

            if (window.speechSynthesis.getVoices().length > 0) {
                doSpeak();
            } else {
                window.speechSynthesis.addEventListener("voiceschanged", doSpeak, {
                    once: true,
                });
            }
        };

        // Chrome/Edge membutuhkan interaksi user sebelum audio bisa diputar.
        // Pasang listener di berbagai event — mana yang lebih dulu terpicu, itu yang dipakai.
        const events = ["click", "touchstart", "scroll", "keydown", "mousemove"] as const;

        const onInteract = () => {
            speak();
            // Hapus semua listener setelah terpicu
            events.forEach((ev) =>
                window.removeEventListener(ev, onInteract)
            );
        };

        events.forEach((ev) =>
            window.addEventListener(ev, onInteract, { once: true, passive: true })
        );

        return () => {
            events.forEach((ev) =>
                window.removeEventListener(ev, onInteract)
            );
        };
    }, []);

    return null;
}
