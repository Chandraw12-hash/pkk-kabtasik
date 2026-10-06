import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import { Head, useForm } from "@inertiajs/react";
import {
    HeartPulse,
    Database,
    HardDrive,
    Layers,
    Archive,
    Power,
    RefreshCw,
    AlertTriangle,
    GitBranch,
} from "lucide-react";

declare function route(name: string, params?: unknown): string;

interface Health {
    php: string;
    laravel: string;
    db_size: number;
    db_size_human: string;
    disk_free: number;
    disk_free_human: string;
    disk_total: number;
    disk_total_human: string;
    queue_pending: number;
    backup_count: number;
    maintenance: boolean;
    commit: string;
}

export default function SystemIndex({ health }: { health: Health }) {
    const [confirmDown, setConfirmDown] = useState(false);
    const cacheForm = useForm({});
    const maintForm = useForm({ down: false });

    const cards = [
        { icon: Database, label: "Ukuran Database", value: health.db_size_human, sub: "PostgreSQL" },
        { icon: HardDrive, label: "Sisa Penyimpanan", value: health.disk_free_human, sub: `dari ${health.disk_total_human}` },
        { icon: Layers, label: "Antrean", value: String(health.queue_pending), sub: "pekerjaan tertunda" },
        { icon: Archive, label: "File Backup", value: String(health.backup_count), sub: "tersimpan lokal" },
        { icon: GitBranch, label: "Versi Kode", value: health.commit, sub: `PHP ${health.php} · Laravel ${health.laravel}` },
    ];

    return (
        <MainLayout>
            <Head title="Kesehatan Sistem" />
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl text-white shadow-lg shadow-emerald-500/25">
                        <HeartPulse size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                            Kesehatan Sistem
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Pantau kondisi server — khusus Super Admin
                        </p>
                    </div>
                </div>
            </div>

            {health.maintenance && (
                <div className="mb-4 flex items-center gap-2 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/40 text-rose-700 dark:text-rose-300 text-sm font-medium px-4 py-3 rounded-xl">
                    <AlertTriangle size={16} />
                    Maintenance mode AKTIF — pengunjung tidak bisa akses situs.
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                {cards.map((c) => (
                    <div
                        key={c.label}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-5 shadow-sm"
                    >
                        <c.icon size={18} className="text-emerald-600 dark:text-emerald-400 mb-3" />
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            {c.label}
                        </p>
                        <p className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate">
                            {c.value}
                        </p>
                        <p className="text-xs text-slate-400 mt-1 truncate">{c.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6 shadow-sm">
                    <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-1">
                        Bersihkan Cache
                    </h2>
                    <p className="text-sm text-slate-500 mb-4">
                        Pakai kalau tampilan/setting baru tidak muncul.
                    </p>
                    <button
                        onClick={() => cacheForm.post(route("be.system.cache-clear"))}
                        disabled={cacheForm.processing}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl cursor-pointer disabled:opacity-50"
                    >
                        <RefreshCw size={16} className={cacheForm.processing ? "animate-spin" : ""} />
                        Bersihkan Sekarang
                    </button>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6 shadow-sm">
                    <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-1">
                        Mode Maintenance
                    </h2>
                    <p className="text-sm text-slate-500 mb-4">
                        Tutup situs sementara saat perbaikan besar.
                    </p>
                    {!confirmDown ? (
                        health.maintenance ? (
                            <button
                                onClick={() => maintForm.post(route("be.system.maintenance"), { data: { down: false } } as never)}
                                disabled={maintForm.processing}
                                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl cursor-pointer disabled:opacity-50"
                            >
                                <Power size={16} />
                                Matikan Maintenance
                            </button>
                        ) : (
                            <button
                                onClick={() => setConfirmDown(true)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-red-500 rounded-xl cursor-pointer"
                            >
                                <Power size={16} />
                                Nyalakan Maintenance
                            </button>
                        )
                    ) : (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    maintForm.setData("down", true);
                                    maintForm.post(route("be.system.maintenance"));
                                    setConfirmDown(false);
                                }}
                                disabled={maintForm.processing}
                                className="px-5 py-2.5 text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-xl cursor-pointer disabled:opacity-50"
                            >
                                Ya, Tutup Situs
                            </button>
                            <button
                                onClick={() => setConfirmDown(false)}
                                className="px-5 py-2.5 text-sm text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                            >
                                Batal
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
