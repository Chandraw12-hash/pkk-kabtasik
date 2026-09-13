import React, { useState, useEffect, useRef } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { Bell, Newspaper, ClipboardList, X } from "lucide-react";

interface PendingCounts {
    berita: number;
    laporan: number;
    total: number;
}

export default function NotificationBell() {
    const { pending_counts } = usePage<{ pending_counts: PendingCounts }>().props;
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const counts = pending_counts || { berita: 0, laporan: 0, total: 0 };

    // ✅ Auto-refresh setiap 30 detik
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: ["pending_counts"],
                preserveScroll: true,
                preserveState: true,
            });
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    // ✅ Tutup dropdown kalau klik di luar
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // ✅ Tutup dropdown kalau tekan ESC
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsOpen(false);
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* 🔔 Tombol Lonceng */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:text-teal-700 hover:border-teal-300 hover:bg-teal-50 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                aria-label="Notifikasi"
                aria-expanded={isOpen}
            >
                <Bell size={18} />

                {/* 🔴 Badge jumlah */}
                {counts.total > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-slate-800">
                        {counts.total > 99 ? "99+" : counts.total}
                    </span>
                )}
            </button>

            {/* 📋 Dropdown Notifikasi */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                Notifikasi
                            </h3>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                                {counts.total} menunggu tindakan
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
                            aria-label="Tutup"
                        >
                            <X size={14} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="max-h-80 overflow-y-auto">
                        {counts.total === 0 ? (
                            <div className="p-6 text-center">
                                <Bell
                                    size={32}
                                    className="text-slate-200 mx-auto mb-2"
                                />
                                <p className="text-xs text-slate-400">
                                    Tidak ada notifikasi baru
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* 📰 Berita Pending */}
                                {counts.berita > 0 && (
                                    <Link
                                        href="/dashboard/berita/pending"
                                        onClick={() => setIsOpen(false)}
                                        className="block px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-50 dark:border-slate-700/50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center shrink-0">
                                                <Newspaper
                                                    size={18}
                                                    className="text-teal-600 dark:text-teal-400"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                                    {counts.berita} Berita Pending
                                                </p>
                                                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                                    Menunggu persetujuan Anda
                                                </p>
                                            </div>
                                            <span className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400 text-[11px] font-bold flex items-center justify-center shrink-0">
                                                {counts.berita}
                                            </span>
                                        </div>
                                    </Link>
                                )}

                                {/* 📊 Laporan Pending */}
                                {counts.laporan > 0 && (
                                    <Link
                                        href="/dashboard/laporan-kegiatan"
                                        onClick={() => setIsOpen(false)}
                                        className="block px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-50 dark:border-slate-700/50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
                                                <ClipboardList
                                                    size={18}
                                                    className="text-amber-600 dark:text-amber-400"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                                    {counts.laporan} Laporan Pending
                                                </p>
                                                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                                    Menunggu persetujuan Anda
                                                </p>
                                            </div>
                                            <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[11px] font-bold flex items-center justify-center shrink-0">
                                                {counts.laporan}
                                            </span>
                                        </div>
                                    </Link>
                                )}
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    {counts.total > 0 && (
                        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-100 dark:border-slate-700">
                            <p className="text-[10px] text-slate-400 text-center">
                                Klik untuk lihat detail
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
