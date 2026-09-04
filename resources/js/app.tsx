import "./bootstrap";
import "../css/app.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp, router } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";

import { Toaster } from "sonner";

import WelcomeGreeting from "./Pages/Frontend/Layouts/WelcomeGreeting";
import AccessibilityWidget from "./Pages/Frontend/Layouts/AccessibilityWidget";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

// 🔥 HALAMAN YANG SUARANYA MATI
const SILENT_PAGES = [
    "profil", "program", "berita", "struktur",
    "sekretariat", "pokja-1", "pokja-2",
    "pokja-3", "pokja-4", "galeri", "dokumen", "survey"
];

// 🔥 FUNGSI PAUSE SEMUA AUDIO
function pauseAllAudio() {
    const url = window.location.pathname;
    const isSilent = SILENT_PAGES.some((p) => url.includes(p));

    if (isSilent) {
        // 🔥 PAUSE SEMUA AUDIO ELEMENT
        document.querySelectorAll('audio').forEach((audio) => {
            if (!audio.paused) {
                audio.pause();
                audio.currentTime = 0;
                console.log("⏹️ AUDIO PAUSED:", audio.src);
            }
        });

        // 🔥 PAUSE JUGA LEWAT CUSTOM EVENT
        window.dispatchEvent(new CustomEvent('pause-audio', {
            detail: { isSilent, url }
        }));
    }
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name: string) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob("./Pages/**/*.tsx"),
        ),
    setup({ el, App, props }) {
        // 🔥 PANTAU NAVIGASI
        router.on('navigate', () => {
            setTimeout(pauseAllAudio, 100);
        });

        // 🔥 PANTAU KLIK LINK
        document.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (target.closest('a')) {
                setTimeout(pauseAllAudio, 200);
            }
        });

        const root = createRoot(el);
        root.render(
            <>
                <Toaster
                    richColors
                    position="top-center"
                    closeButton
                    toastOptions={{
                        className: "font-sans",
                        style: { zIndex: 9999 },
                    }}
                />
                <App {...props} />
                <WelcomeGreeting />
                <AccessibilityWidget />
            </>,
        );
    },
    progress: {
        color: "#0022ffff",
    },
});
