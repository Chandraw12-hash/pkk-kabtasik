import "./bootstrap";
import "../css/app.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp, router } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";

import { Toaster } from "sonner";

import WelcomeGreeting from "./Pages/Frontend/Layouts/WelcomeGreeting";
import AccessibilityWidget from "./Pages/Frontend/Layouts/AccessibilityWidget";
import ErrorBoundary from "./Components/ErrorBoundary";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

// Halaman yang suaranya dimatikan
const SILENT_PAGES = [
    "profil", "program", "berita", "struktur",
    "sekretariat", "pokja-1", "pokja-2",
    "pokja-3", "pokja-4", "galeri", "dokumen", "survey"
];

// Fungsi pause semua audio
function pauseAllAudio() {
    const url = window.location.pathname;
    const isSilent = SILENT_PAGES.some((p) => url.includes(p));

    if (isSilent) {
        document.querySelectorAll("audio").forEach((audio) => {
            if (!audio.paused) {
                audio.pause();
                audio.currentTime = 0;
                console.log("Audio paused:", audio.src);
            }
        });

        window.dispatchEvent(new CustomEvent("pause-audio", {
            detail: { isSilent, url }
        }));
    }
}

// ✅ FIX: Cek apakah halaman admin
const isAdminPage = (pathname: string) => pathname.startsWith("/dashboard");

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name: string) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob("./Pages/**/*.tsx"),
        ),
    setup({ el, App, props }) {
        // Pantau navigasi
        router.on("navigate", () => {
            setTimeout(pauseAllAudio, 100);
        });

        // Pantau klik link
        document.addEventListener("click", (e) => {
            const target = e.target as HTMLElement;
            if (target.closest("a")) {
                setTimeout(pauseAllAudio, 200);
            }
        });

        const root = createRoot(el);

        // ✅ FIX: Render component dengan conditional
        const renderApp = () => {
            const currentPath = window.location.pathname;
            const isAdmin = isAdminPage(currentPath);

            root.render(
                <ErrorBoundary>
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
                    {/* ✅ Hanya muncul di halaman frontend (bukan /dashboard) */}
                    {!isAdmin && <WelcomeGreeting />}
                    {!isAdmin && <AccessibilityWidget />}
                </ErrorBoundary>
            );
        };

        renderApp();

        // ✅ Update saat navigasi berubah (SPA)
        router.on("navigate", () => {
            setTimeout(renderApp, 50);
        });
    },
    progress: {
        color: "#0D9488",
    },
});
