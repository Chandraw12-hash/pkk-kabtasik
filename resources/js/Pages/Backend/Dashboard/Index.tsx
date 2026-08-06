// resources/js/Pages/Dashboard/Index.tsx
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
    CheckCircle,
    Clock,
    AlertCircle,
    LucideIcon,
    Calendar,
    Download,
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
    opd: string;
    action: string;
    time: string;
}

export default function Dashboard() {
    // Data statistik utama
    const stats: StatItem[] = [
        {
            title: "Total Kader Aktif",
            value: "320",
            icon: FileText,
            color: "bg-indigo-500",
            className: "border-l-4 border-indigo-500",
            textColor: "white",
            description: "Terdaftar",
            period: "Tahun 2026",
        },
        {
            title: "Kegiatan Dilaporkan",
            value: "145",
            icon: CheckCircle,
            color: "bg-emerald-500",
            className: "border-l-4 border-emerald-500",
            textColor: "white",
            description: "+8 minggu ini",
            period: "Bulan Ini",
        },
        {
            title: "Menunggu Verifikasi",
            value: "8",
            icon: Clock,
            color: "bg-amber-500",
            className: "border-l-4 border-amber-500",
            textColor: "white",
            description: "Perlu dicek",
            period: "Minggu Ini",
        },
        {
            title: "Laporan Ditolak",
            value: "3",
            icon: AlertCircle,
            color: "bg-rose-500",
            className: "border-l-4 border-rose-500",
            textColor: "white",
            description: "Butuh revisi",
            period: "Hari Ini",
        },
    ];

    // Data Grafik Tren Bulanan
    const lineData = [
        { name: "Jan", uploaded: 10, verified: 7 },
        { name: "Feb", uploaded: 15, verified: 12 },
        { name: "Mar", uploaded: 22, verified: 18 },
        { name: "Apr", uploaded: 18, verified: 15 },
        { name: "May", uploaded: 28, verified: 24 },
        { name: "Jun", uploaded: 24, verified: 21 },
    ];

    // Data Grafik Statistik Pokja
    const barData = [
        { name: "Pokja I", doc: 42 },
        { name: "Pokja II", doc: 38 },
        { name: "Pokja III", doc: 35 },
        { name: "Pokja IV", doc: 30 },
        { name: "Sekretariat", doc: 20 },
    ];

    // Data Grafik Status Verifikasi
    const pieData = [
        { name: "Terverifikasi", value: 120, color: "#10b981" },
        { name: "Pending", value: 8, color: "#f59e0b" },
        { name: "Ditolak", value: 17, color: "#f43f5e" },
    ];

    // Daftar Aktivitas Terbaru
    const activities: ActivityItem[] = [
        {
            opd: "Pokja I",
            action: "Melaporkan Kegiatan Gotong Royong Desa Sukamaju",
            time: "2 menit yang lalu",
        },
        {
            opd: "Pokja II",
            action: "Melaporkan Pelatihan Keterampilan Membatik",
            time: "1 jam yang lalu",
        },
        {
            opd: "Pokja III",
            action: "Revisi Laporan Kegiatan Pangan Bergizi",
            time: "3 jam yang lalu",
        },
        {
            opd: "Pokja IV",
            action: "Melaporkan Kegiatan Posyandu Balita",
            time: "5 jam yang lalu",
        },
        {
            opd: "Sekretariat",
            action: "Menambahkan Data Kader Baru",
            time: "Hari ini, 08:30",
        },
    ];

    return (
        <MainLayout>
            <Head title="Dashboard PKK Kabupaten Tasikmalaya" />

            {/* Header Dashboard dengan Action Button */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                        Dashboard PKK Kabupaten Tasikmalaya
                    </h1>
                    <p className="text-slate-500 text-sm dark:text-slate-400 mt-0.5">
                        Monitoring program dan rekapitulasi kegiatan Tim Penggerak PKK secara real-time.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 shadow-sm">
                        <Calendar size={15} className="text-slate-400" />
                        <span>Tahun Anggaran 2026</span>
                    </div>
                    <button
                        onClick={() => alert("Fitur unduh rekapitulasi akan segera hadir.")}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors cursor-pointer"
                    >
                        <Download size={16} />
                        <span>Unduh Rekap</span>
                    </button>
                </div>
            </div>

            {/* Grid 4 Cards Statistik */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Charts Section */}
            <div className="space-y-6">
                {/* Row 1: Line Chart + Activities */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Line Chart (Tren Bulanan) */}
                    <Card className="lg:col-span-2 w-full">
                        <div className="p-6 pb-2">
                            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                                Tren Pelaporan Kegiatan
                            </h3>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                Perbandingan jumlah laporan masuk dan yang terverifikasi tahun ini
                            </p>
                        </div>
                        <div className="p-2 pt-0">
                            <ChartLine
                                data={lineData}
                                xKey="name"
                                series={[
                                    {
                                        key: "uploaded",
                                        color: "#6366f1",
                                        name: "Dilaporkan",
                                    },
                                    {
                                        key: "verified",
                                        color: "#10b981",
                                        name: "Terverifikasi",
                                    },
                                ]}
                                height={330}
                            />
                        </div>
                    </Card>

                    {/* Recent Activity */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 dark:bg-slate-800 dark:border-slate-700 shadow-xs flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                                    Aktivitas Terakhir
                                </h3>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                                    Live Log
                                </span>
                            </div>
                            <div className="space-y-5">
                                {activities.map((act, i) => (
                                    <div key={i} className="flex gap-3.5 relative">
                                        {i !== activities.length - 1 && (
                                            <div className="absolute left-[9px] top-7 bottom-[-22px] w-0.5 bg-slate-100 dark:bg-slate-700/80"></div>
                                        )}
                                        <div className="w-5 h-5 mt-0.5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 z-10 dark:bg-indigo-950 dark:border-indigo-800">
                                            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                                                {act.opd}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                                                {act.action}
                                            </p>
                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                                                {act.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 2: Bar & Pie Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Bar Chart (Statistik Pokja) */}
                    <Card className="lg:col-span-2">
                        <div className="p-6 pb-2">
                            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                                Statistik Laporan per Pokja
                            </h3>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                Total dokumen kegiatan yang terkumpul berdasarkan Pokja dan Sekretariat
                            </p>
                        </div>
                        <div className="p-2 pt-0">
                            <ChartBar
                                data={barData}
                                xKey="name"
                                series={[
                                    {
                                        key: "doc",
                                        color: "#3b82f6",
                                        name: "Total Laporan",
                                    },
                                ]}
                                height={330}
                            />
                        </div>
                    </Card>

                    {/* Pie Chart (Status Verifikasi) */}
                    <Card>
                        <div className="p-6 pb-2">
                            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                                Status Verifikasi
                            </h3>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                Proporsi status dokumen laporan
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
