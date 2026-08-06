import "./bootstrap";
import "../css/app.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp, router } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";

import AOS from 'aos';
import 'aos/dist/aos.css';

import { Toaster } from "sonner";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name: string) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob("./Pages/**/*.tsx"),
        ),
    setup({ el, App, props }) {
        AOS.init({
            duration: 800,
            once: true,
        });

        router.on('navigate', () => {
            AOS.refresh();
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
            </>,
        );
    },
    progress: {
        color: "#0022ffff", // Warna loading bar saat pindah halaman
    },
});
