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
    Building,
    Users,
    CircleGauge,
} from "lucide-react";

interface Stats {
    total_skpd: number;
    total_eviden: number;
    total_indikator: number;
    total_users: number;
    verifikasi_pending: number;
    verifikasi_valid: number;
    verifikasi_ditolak: number;
}

interface AdminDashboardProps {
    stats: Stats;
    lineData: any[]; // Type properly if possible
    barData: any[];
    pieData: any[];
    activities: any[];
}

export default function AdminDashboard({
    stats,
    lineData,
    barData,
    pieData,
    activities,
}: AdminDashboardProps) {
    // Stat Items mapping from backend stats object to UI format
    const statItems = [
        {
            title: "Total SKPD",
            value: stats.total_skpd.toString(),
            icon: Building,
            color: "bg-indigo-500",
            className: "border-l-4 border-indigo-500",
            textColor: "white",
            description: "Terdaftar dalam sistem",
            period: "Total",
        },
        {
            title: "Total Eviden",
            value: stats.total_eviden.toString(),
            icon: FileText,
            color: "bg-emerald-500",
            className: "border-l-4 border-emerald-500",
            textColor: "white",
            description: "Dokumen diunggah",
            period: "Total",
        },
        {
            title: "Menunggu Verifikasi",
            value: stats.verifikasi_pending.toString(),
            icon: Clock,
            color: "bg-amber-500",
            className: "border-l-4 border-amber-500",
            textColor: "white",
            description: "Perlu dicek",
            period: "Saat ini",
        },
        {
            title: "Eviden Ditolak",
            value: stats.verifikasi_ditolak.toString(),
            icon: AlertCircle,
            color: "bg-rose-500",
            className: "border-l-4 border-rose-500",
            textColor: "white",
            description: "Butuh revisi",
            period: "Total",
        },
    ];

    return (
        <MainLayout>
            <Head title="Dashboard Admin" />

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    Dashboard Admin
                </h1>
                <p className="text-slate-500 text-sm dark:text-slate-400">
                    Monitoring Statistik SPBE
                </p>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statItems.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Charts Section */}
            <div className="space-y-6">
                {/* Row 1: Line Chart + Activities */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Line Chart (Tren Bulanan) */}
                    <Card className="lg:col-span-2 w-full">
                        <div className="p-6">
                            <h3 className="font-bold text-slate-800 dark:text-slate-200">
                                Tren Pengunggahan Dokumen
                            </h3>
                        </div>
                        <ChartLine
                            data={lineData}
                            xKey="name"
                            series={[
                                {
                                    key: "uploaded",
                                    color: "#6366f1",
                                    name: "Diunggah",
                                },
                                {
                                    key: "verified",
                                    color: "#10b981",
                                    name: "Terverifikasi",
                                },
                            ]}
                            height={350}
                        />
                    </Card>

                    {/* Pie Chart (Status Verifikasi) */}
                    <Card>
                        <div className="p-6">
                            <h3 className="font-bold text-slate-800 dark:text-slate-200">
                                Status Verifikasi
                            </h3>
                        </div>
                        <ChartPie data={pieData} height={350} />
                    </Card>
                </div>

                {/* Row 2: Bar & Pie Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Bar Chart (Statistik OPD) */}
                    <Card className="lg:col-span-2">
                        <div className="p-6">
                            <h3 className="font-bold text-slate-800 dark:text-slate-200">
                                Top 5 SKPD Teraktif
                            </h3>
                        </div>
                        <ChartBar
                            data={barData}
                            xKey="name"
                            series={[
                                {
                                    key: "doc",
                                    color: "#3b82f6",
                                    name: "Total Dokumen",
                                },
                            ]}
                            height={350}
                        />
                    </Card>

                    {/* Recent Activity */}
                    <Card className="h-full">
                        <div className="p-6 pb-0">
                            <h3 className="font-bold text-slate-800 dark:text-slate-200">
                                Aktivitas Terakhir
                            </h3>
                        </div>
                        <div className="p-6 space-y-8">
                            {activities.map((act, i) => (
                                <div key={i} className="flex gap-4 relative">
                                    {/* Timeline Line */}
                                    {i !== activities.length - 1 && (
                                        <div className="absolute left-[9px] top-6 bottom-[-34px] w-[2px] bg-slate-100 dark:bg-slate-700/50"></div>
                                    )}

                                    <div className="relative shrink-0 z-10">
                                        <div className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center dark:bg-indigo-900/20 dark:border-indigo-500/30">
                                            <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/50"></div>
                                        </div>
                                    </div>

                                    <div className="-mt-1">
                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                            {act.opd}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                            {act.action}
                                        </p>
                                        <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                                            <Clock size={10} />
                                            <span>{act.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}
