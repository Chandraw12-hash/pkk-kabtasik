import React from "react";
import MainLayout from "@/Layouts/MainLayout";
import StatCard from "@/Components/UI/SatistikCard";
import Card from "@/Components/UI/Card";
import ChartLine from "@/Components/Data/Charts/ChartLine";
import ChartBar from "@/Components/Data/Charts/ChartBar";
import ChartPie from "@/Components/Data/Charts/ChartPie";
import { Head } from "@inertiajs/react";
import {
    FileText,
    Clock,
    AlertCircle,
    LucideIcon,
    Calendar,
    Download,
    ShieldCheck,
    Users,
    Activity,
} from "lucide-react";

interface StatItem {
    title: string;
    value: string;
    icon: LucideIcon;
    color: string;
    className?: string;
    textColor: string;
    description: string;
    period?: string;
}

interface ActivityItem {
    pokja: string;
    action: string;
    time: string;
}

interface StatsProps {
    total_kader?: number;
    total_kegiatan?: number;
    total_program?: number;
    total_users?: number;
    verifikasi_pending: number;
    verifikasi_valid: number;
    verifikasi_ditolak: number;
}

interface AdminDashboardProps {
    stats: StatsProps;
    lineData: Array<{ name: string; uploaded: number; verified: number }>;
    barData: Array<{ name: string; doc: number }>;
    pieData: Array<{ name: string; value: number; color: string }>;
    activities: ActivityItem[];
}

export default function AdminDashboard({
    stats,
    lineData = [],
    barData = [],
    pieData = [],
    activities = [],
}: AdminDashboardProps) {
    // Menghitung total dokumen untuk persentase verifikasi
    const totalVerifikasi =
        (stats.verifikasi_valid ?? 0) +
        (stats.verifikasi_pending ?? 0) +
        (stats.verifikasi_ditolak ?? 0);

    const validPercentage =
        totalVerifikasi > 0
            ? Math.round(((stats.verifikasi_valid ?? 0) / totalVerifikasi) * 100)
            : 0;

    const statItems: StatItem[] = [
        {
            title: "Total Kader PKK Aktif",
            value: (stats.total_kader ?? 320).toLocaleString(),
            icon: Users,
            color: "bg-indigo-600",
            className: "border-l-4 border-indigo-600 shadow-sm",
            textColor: "white",
            description: "Kader Terdaftar",
            period: "Tahun 2026",
        },
        {
            title: "Kegiatan Dilaporkan",
            value: (stats.total_kegiatan ?? 0).toLocaleString(),
            icon: FileText,
            color: "bg-emerald-600",
            className: "border-l-4 border-emerald-600 shadow-sm",
            textColor: "white",
            description: "Total Eviden Masuk",
            period: "Keseluruhan",
        },
        {
            title: "Menunggu Validasi",
            value: (stats.verifikasi_pending ?? 0).toLocaleString(),
            icon: Clock,
            color: "bg-amber-500",
            className: "border-l-4 border-amber-500 shadow-sm",
            textColor: "white",
            description: "Perlu Pengecekan",
            period: "Status Pending",
        },
        {
            title: "Laporan Perlu Revisi",
            value: (stats.verifikasi_ditolak ?? 0).toLocaleString(),
            icon: AlertCircle,
            color: "bg-rose-600",
            className: "border-l-4 border-rose-600 shadow-sm",
            textColor: "white",
            description: "Butuh Perbaikan",
            period: "Ditolak/Revisi",
        },
    ];

    return (
        <MainLayout>
            <Head title="Dashboard Utama - TP PKK Kabupaten Tasikmalaya" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                            Sistem Informasi TP PKK
                        </span>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            Kabupaten Tasikmalaya
                        </span>
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Dashboard Administrator & Sekretariat
                    </h1>
                    <p className="text-slate-500 text-sm dark:text-slate-400 mt-1">
                        Monitoring program kerja Dasawisma, verifikasi eviden kegiatan Pokja I - IV, dan rekapitulasi data PKK.
                    </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <Calendar size={15} className="text-emerald-600" />
                        <span>Tahun 2026</span>
                    </div>
                    <button
                        onClick={() => alert("Mengunduh laporan rekapitulasi data TP PKK...")}
                        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all cursor-pointer active:scale-98"
                    >
                        <Download size={16} />
                        <span>Unduh Rekap PKK</span>
                    </button>
                </div>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statItems.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Info Banner untuk TP PKK */}
            <div className="mb-8 bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs">
                        <ShieldCheck size={28} className="text-emerald-300" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">Verifikasi Eviden Kegiatan PKK</h2>
                        <p className="text-emerald-100/80 text-xs sm:text-sm mt-0.5">
                            Sebanyak <span className="font-bold text-white">{validPercentage}%</span> dari total laporan kegiatan Sekretariat dan Pokja telah divalidasi. Sisa dokumen menunggu pemeriksaan Anda.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <div className="text-right hidden sm:block">
                        <span className="block text-xs text-emerald-200">Total Akun Pengguna</span>
                        <span className="text-lg font-extrabold">{stats.total_users ?? 25} Operator / Pokja</span>
                    </div>
                </div>
            </div>

            {/* Charts & Activity Section */}
            <div className="space-y-6">
                {/* Row 1: Line Chart & Activity Log */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 w-full">
                        <div className="p-6 pb-2 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                                    Tren Pelaporan & Verifikasi Kegiatan PKK
                                </h3>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                    Grafik perbandingan laporan kegiatan yang diunggah vs yang terverifikasi tahun ini
                                </p>
                            </div>
                            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg">
                                <Activity size={14} /> Real-time
                            </span>
                        </div>
                        <div className="p-2 pt-0">
                            <ChartLine
                                data={lineData}
                                xKey="name"
                                series={[
                                    { key: "uploaded", color: "#6366f1", name: "Dilaporkan" },
                                    { key: "verified", color: "#10b981", name: "Terverifikasi" },
                                ]}
                                height={330}
                            />
                        </div>
                    </Card>

                    {/* Activity Log (PKK Focus) */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 dark:bg-slate-800 dark:border-slate-700 shadow-xs flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                                    Aktivitas Pokja & Sekretariat
                                </h3>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/50">
                                    Live Log
                                </span>
                            </div>
                            <div className="space-y-5">
                                {activities.length > 0 ? (
                                    activities.map((act, i) => (
                                        <div key={i} className="flex gap-3.5 relative">
                                            {i !== activities.length - 1 && (
                                                <div className="absolute left-[9px] top-7 bottom-[-22px] w-0.5 bg-slate-100 dark:bg-slate-700/80"></div>
                                            )}
                                            <div className="w-5 h-5 mt-0.5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 z-10 dark:bg-indigo-950 dark:border-indigo-800">
                                                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                                                    {act.pokja}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                                                    {act.action}
                                                </p>
                                                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                                                    {act.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-400 text-center py-6">
                                        Belum ada aktivitas terbaru hari ini.
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 mt-4">
                            <p className="text-[11px] text-center text-slate-400">
                                Pencatatan aktivitas terintegrasi untuk seluruh jajaran PKK Tasikmalaya.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Row 2: Bar Chart (Pokja) & Pie Chart (Status) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                        <div className="p-6 pb-2">
                            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                                Statistik Laporan Berdasarkan Sekretariat & Pokja I - IV
                            </h3>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                Akumulasi dokumen dan eviden kegiatan dari tiap bidang TP PKK Kabupaten Tasikmalaya
                            </p>
                        </div>
                        <div className="p-2 pt-0">
                            <ChartBar
                                data={barData}
                                xKey="name"
                                series={[{ key: "doc", color: "#059669", name: "Total Laporan" }]}
                                height={330}
                            />
                        </div>
                    </Card>

                    <Card>
                        <div className="p-6 pb-2">
                            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                                Proporsi Status Verifikasi
                            </h3>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                Perbandingan status valid, pending, dan revisi eviden
                            </p>
                        </div>
                        <div className="p-2 pt-0">
                            <ChartPie data={pieData} height={330} />
                        </div>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}
