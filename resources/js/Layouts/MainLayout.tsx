import React, { useState, ReactNode, memo } from "react";
import SidebarComponent from "@/Components/Layout/Sidebar";
import Navbar from "@/Components/Layout/Navbar";
import Toast from "@/Components/UI/Toast";
import { usePage } from "@inertiajs/react";

// Memoisasi Sidebar agar tidak re-render berat saat toggle collapse
const Sidebar = memo(SidebarComponent);

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Mengambil shared props 'app_settings' dari Laravel Middleware
    const { app_settings } = usePage().props as {
        app_settings?: {
            primary_color?: string;
            app_name?: string;
            app_logo?: string;
        };
    };

    // Warna fallback jika pengaturan belum ada
    const primaryColor = app_settings?.primary_color || "#10b981";

    return (
        <div
            className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-300"
            style={{
                "--primary": primaryColor,
            } as React.CSSProperties}
        >
            <Toast />

            {/* Backdrop untuk perangkat mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
            />

            {/* Konten utama dengan optimasi performa GPU (will-change & transform layout) */}
            <div
                className={`flex flex-col min-w-0 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    isCollapsed ? "md:ml-20" : "md:ml-72"
                }`}
                style={{
                    willChange: "margin-left",
                    contain: "layout style",
                }}
            >
                <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="p-4 md:p-8">{children}</main>
            </div>
        </div>
    );
}
