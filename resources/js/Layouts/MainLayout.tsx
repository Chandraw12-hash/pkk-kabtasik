import React, { useState, ReactNode } from "react";
import Sidebar from "@/Components/Layout/Sidebar";
import Navbar from "@/Components/Layout/Navbar";
import { Toaster } from "sonner";
import Toast from "@/Components/UI/Toast";

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 flex items-start transition-colors duration-300">
            <Toast />

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Komponen */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Navbar Komponen */}
                <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

                {/* Main Content */}
                <main className="p-4 md:p-8">{children}</main>
            </div>
        </div>
    );
}
