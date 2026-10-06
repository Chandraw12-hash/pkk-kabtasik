import React, { useState, ReactNode } from "react";
import Sidebar from "@/Components/Layout/Sidebar";
import Navbar from "@/Components/Layout/Navbar";
import Toast from "@/Components/UI/Toast";
import { usePage, router } from "@inertiajs/react";
import { Eye } from "lucide-react";

declare function route(name: string, params?: unknown): string;

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const { app_settings, auth } = usePage().props as {
        app_settings?: {
            primary_color?: string;
            app_name?: string;
            app_logo?: string;
        };
        auth?: { is_impersonating?: boolean };
    };

    const primaryColor = app_settings?.primary_color || "#10b981";
    const isImpersonating = auth?.is_impersonating || false;

    return (
        <div
            className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-300"
            style={
                {
                    "--primary": primaryColor,
                } as React.CSSProperties
            }
        >
            <Toast />

            {isImpersonating && (
                <div className="sticky top-0 z-50 flex items-center justify-center gap-3 bg-violet-600 px-4 py-2 text-sm font-medium text-white">
                    <Eye size={16} />
                    <span>
                        Mode pinjam-masuk — Anda sedang masuk sebagai user lain.
                    </span>
                    <button
                        onClick={() => router.post(route("be.impersonate.leave"))}
                        className="rounded-lg bg-white/20 px-3 py-1 text-xs font-semibold hover:bg-white/30 transition-colors cursor-pointer"
                    >
                        Keluar & kembali
                    </button>
                </div>
            )}

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
