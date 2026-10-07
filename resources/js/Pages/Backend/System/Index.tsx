import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import Button from "@/Components/UI/Button";
import Card from "@/Components/UI/Card";
import StatCard from "@/Components/UI/SatistikCard";
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

    return (
        <MainLayout>
            <Head title="Kesehatan Sistem" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-xl">
                        <HeartPulse size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                            Kesehatan Sistem
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Pantau kondisi server — khusus Super Admin
                        </p>
                    </div>
                </div>
            </div>

            {health.maintenance && (
                <div className="mb-6 flex items-center gap-2 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/40 text-rose-700 dark:text-rose-300 text-sm font-medium px-4 py-3 rounded-xl">
                    <AlertTriangle size={16} />
                    Maintenance mode AKTIF — pengunjung tidak bisa akses situs.
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <StatCard
                    title="Ukuran Database"
                    value={health.db_size_human}
                    icon={Database}
                    color="bg-teal-600"
                    className="border-l-4 border-teal-600"
                    description="PostgreSQL"
                />
                <StatCard
                    title="Sisa Penyimpanan"
                    value={health.disk_free_human}
                    icon={HardDrive}
                    color="bg-blue-600"
                    className="border-l-4 border-blue-600"
                    description={`dari ${health.disk_total_human}`}
                />
                <StatCard
                    title="Antrean"
                    value={String(health.queue_pending)}
                    icon={Layers}
                    color="bg-amber-500"
                    className="border-l-4 border-amber-500"
                    description="pekerjaan tertunda"
                />
                <StatCard
                    title="File Backup"
                    value={String(health.backup_count)}
                    icon={Archive}
                    color="bg-emerald-600"
                    className="border-l-4 border-emerald-600"
                    description="tersimpan lokal"
                />
                <StatCard
                    title="Versi Kode"
                    value={health.commit}
                    icon={GitBranch}
                    color="bg-indigo-600"
                    className="border-l-4 border-indigo-600"
                    description={`PHP ${health.php} · Laravel ${health.laravel}`}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="dark:bg-slate-800 dark:border-slate-700 p-6">
                    <h2 className="font-bold text-slate-800 dark:text-slate-200 mb-1">
                        Bersihkan Cache
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Pakai kalau tampilan/setting baru tidak muncul.
                    </p>
                    <Button
                        variant="primary"
                        onClick={() =>
                            cacheForm.post(route("be.system.cache-clear"))
                        }
                        disabled={cacheForm.processing}
                        className="bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-100 dark:shadow-none"
                    >
                        <RefreshCw
                            size={16}
                            className={cacheForm.processing ? "animate-spin" : ""}
                        />
                        <span>Bersihkan Sekarang</span>
                    </Button>
                </Card>

                <Card className="dark:bg-slate-800 dark:border-slate-700 p-6">
                    <h2 className="font-bold text-slate-800 dark:text-slate-200 mb-1">
                        Mode Maintenance
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Tutup situs sementara saat perbaikan besar.
                    </p>
                    {!confirmDown ? (
                        health.maintenance ? (
                            <Button
                                variant="primary"
                                onClick={() =>
                                    maintForm.post(
                                        route("be.system.maintenance"),
                                        { data: { down: false } } as never
                                    )
                                }
                                disabled={maintForm.processing}
                                className="bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-100 dark:shadow-none"
                            >
                                <Power size={16} />
                                <span>Matikan Maintenance</span>
                            </Button>
                        ) : (
                            <Button
                                variant="danger"
                                onClick={() => setConfirmDown(true)}
                            >
                                <Power size={16} />
                                <span>Nyalakan Maintenance</span>
                            </Button>
                        )
                    ) : (
                        <div className="flex items-center gap-3">
                            <Button
                                variant="danger"
                                onClick={() => {
                                    maintForm.setData("down", true);
                                    maintForm.post(
                                        route("be.system.maintenance")
                                    );
                                    setConfirmDown(false);
                                }}
                                disabled={maintForm.processing}
                            >
                                <span>Ya, Tutup Situs</span>
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => setConfirmDown(false)}
                            >
                                <span>Batal</span>
                            </Button>
                        </div>
                    )}
                </Card>
            </div>
        </MainLayout>
    );
}
