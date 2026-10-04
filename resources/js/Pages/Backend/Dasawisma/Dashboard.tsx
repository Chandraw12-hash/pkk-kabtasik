import React from "react";
import { Head } from "@inertiajs/react";
import {
    AlertCircle,
    CheckCircle2,
    ClipboardList,
    Clock,
    FileText,
} from "lucide-react";
import DasawismaLayout from "@/Components/Layout/DasawismaLayout";
import StatCard from "@/Components/UI/SatistikCard";
import Card from "@/Components/UI/Card";
import ChartBar from "@/Components/Data/Charts/ChartBar";

interface LaporanItem {
    id: number;
    judul: string;
    status: string;
    created_at: string;
    diff: string;
}

interface ChartItem {
    bulan: string;
    total: number;
}

interface DashboardProps {
    user: {
        name: string;
        username: string;
    };
    stats: {
        totalLaporan: number;
        laporanPending: number;
        laporanApproved: number;
        laporanRejected: number;
    };
    laporanTerbaru: LaporanItem[];
    chartData: ChartItem[];
}

const statusConfig: Record<string, { label: string; color: string }> = {
    pending: {
        label: "Menunggu validasi",
        color: "border-amber-200 bg-amber-50 text-amber-700",
    },
    reviewed: {
        label: "Sedang ditinjau",
        color: "border-blue-200 bg-blue-50 text-blue-700",
    },
    approved: {
        label: "Disetujui",
        color: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    rejected: {
        label: "Perlu diperbaiki",
        color: "border-rose-200 bg-rose-50 text-rose-700",
    },
};

export default function Dashboard({
    user,
    stats,
    laporanTerbaru,
    chartData,
}: DashboardProps) {
    const hasChartData = chartData.some((item) => item.total > 0);

    return (
        <DasawismaLayout>
            <Head title="Dashboard Dasawisma" />

            <div className="space-y-6">
                <header>
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-teal-100 bg-teal-50 px-2.5 py-1 text-[11px] font-semibold text-teal-800">
                            Sistem Informasi TP PKK
                        </span>
                        <span className="text-slate-300" aria-hidden="true">
                            /
                        </span>
                        <span className="text-xs font-medium text-slate-500">
                            Dasawisma
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Dashboard Dasawisma
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Selamat datang,{" "}
                        <span className="font-semibold text-slate-700">
                            {user.name}
                        </span>
                        . Berikut ringkasan laporan kegiatan Anda.
                    </p>
                </header>

                <section
                    aria-label="Ringkasan laporan"
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
                >
                    <StatCard
                        title="Total laporan"
                        value={stats.totalLaporan.toLocaleString("id-ID")}
                        icon={ClipboardList}
                        color="bg-teal-600"
                        className="border-l-4 border-teal-600"
                        description="Seluruh laporan Anda"
                    />
                    <StatCard
                        title="Menunggu validasi"
                        value={stats.laporanPending.toLocaleString("id-ID")}
                        icon={Clock}
                        color="bg-amber-500"
                        className="border-l-4 border-amber-500"
                        description="Belum selesai diperiksa"
                    />
                    <StatCard
                        title="Disetujui"
                        value={stats.laporanApproved.toLocaleString("id-ID")}
                        icon={CheckCircle2}
                        color="bg-emerald-600"
                        className="border-l-4 border-emerald-600"
                        description="Laporan tervalidasi"
                    />
                    <StatCard
                        title="Perlu diperbaiki"
                        value={stats.laporanRejected.toLocaleString("id-ID")}
                        icon={AlertCircle}
                        color="bg-rose-500"
                        className="border-l-4 border-rose-500"
                        description="Periksa catatan peninjauan"
                    />
                </section>

                <section
                    aria-label="Aktivitas dan tren laporan"
                    className="grid grid-cols-1 gap-6 lg:grid-cols-3"
                >
                    <Card className="p-5 dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
                        <div className="mb-5">
                            <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">
                                Tren laporan kegiatan
                            </h2>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                Jumlah laporan yang dikirim dalam enam bulan terakhir
                            </p>
                        </div>

                        {hasChartData ? (
                            <ChartBar
                                data={chartData}
                                xKey="bulan"
                                series={[
                                    {
                                        key: "total",
                                        color: "#0d9488",
                                        name: "Laporan",
                                    },
                                ]}
                                height={280}
                            />
                        ) : (
                            <div className="flex min-h-64 flex-col items-center justify-center text-center">
                                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400">
                                    <ClipboardList size={21} aria-hidden="true" />
                                </div>
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    Belum ada laporan pada periode ini
                                </p>
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Tren akan terlihat setelah laporan kegiatan dikirim.
                                </p>
                            </div>
                        )}
                    </Card>

                    <Card className="p-5 dark:border-slate-800 dark:bg-slate-900">
                        <div className="mb-5 flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400">
                                <FileText size={18} aria-hidden="true" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">
                                    Laporan terbaru
                                </h2>
                                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                    Lima laporan terakhir yang Anda kirim
                                </p>
                            </div>
                        </div>

                        {laporanTerbaru.length === 0 ? (
                            <div className="flex min-h-56 flex-col items-center justify-center text-center">
                                <FileText
                                    size={32}
                                    className="mb-3 text-slate-300 dark:text-slate-600"
                                    aria-hidden="true"
                                />
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    Belum ada laporan
                                </p>
                                <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                    Laporan kegiatan yang dikirim dengan akun ini akan
                                    muncul di sini.
                                </p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                                {laporanTerbaru.map((item) => {
                                    const status =
                                        statusConfig[item.status] ??
                                        statusConfig.pending;

                                    return (
                                        <li
                                            key={item.id}
                                            className="flex min-w-0 flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
                                                    {item.judul}
                                                </p>
                                                <p
                                                    className="mt-0.5 text-xs text-slate-500 dark:text-slate-400"
                                                    title={item.created_at}
                                                >
                                                    {item.diff}
                                                </p>
                                            </div>
                                            <span
                                                className={`inline-flex w-fit shrink-0 items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${status.color}`}
                                            >
                                                {status.label}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </Card>
                </section>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                    Ringkasan ini hanya menampilkan laporan yang dikirim melalui
                    akun Anda.
                </p>
            </div>
        </DasawismaLayout>
    );
}
