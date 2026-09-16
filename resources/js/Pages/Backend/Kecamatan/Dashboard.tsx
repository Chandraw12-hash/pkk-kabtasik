import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminKecamatanLayout from "@/Components/Layout/AdminKecamatanLayout";
import StatCard from "@/Components/UI/SatistikCard";
import Card from "@/Components/UI/Card";
import Badge from "@/Components/UI/Badge";
import {
    FileText,
    CheckCircle2,
    Clock,
    XCircle,
    Building2,
    Home,
    ArrowRight,
    Calendar,
    ShieldCheck,
} from "lucide-react";

interface StatistikProps {
    totalLaporan: number;
    totalApproved: number;
    totalPending: number;
    totalRejected: number;
    totalDesa: number;
    totalDasaWisma: number;
}

interface LaporanTerbaru {
    id: number;
    judul: string;
    kategori_pokja: string;
    status: string;
    created_at: string;
}

interface DashboardProps {
    kecamatan: string;
    statistik: StatistikProps;
    rekapPokja: {
        I: number;
        II: number;
        III: number;
        IV: number;
    };
    laporanTerbaru: LaporanTerbaru[];
}

export default function Dashboard({
    kecamatan,
    statistik,
    rekapPokja,
    laporanTerbaru,
}: DashboardProps) {
    const totalLaporan = statistik.totalLaporan;

    const persentaseApproved =
        totalLaporan > 0
            ? Math.round((statistik.totalApproved / totalLaporan) * 100)
            : 0;

    return (
        <AdminKecamatanLayout>
            <Head title={`Dashboard Admin Kecamatan ${kecamatan}`} />

            <div className="space-y-6">
                {/* ─── HEADER ─── */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-400">
                                Sistem Informasi TP PKK
                            </span>
                            <span className="text-slate-300 dark:text-slate-600">•</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                Kecamatan {kecamatan}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                            Dashboard Kecamatan
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            Monitoring dan pengelolaan data PKK Kecamatan {kecamatan}.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300">
                            <Calendar size={15} className="text-slate-400 dark:text-slate-500" />
                            <span>Tahun {new Date().getFullYear()}</span>
                        </div>
                    </div>
                </div>

                {/* ─── STATISTIK LAPORAN ─── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Laporan"
                        value={statistik.totalLaporan.toLocaleString()}
                        icon={FileText}
                        color="bg-teal-600"
                        className="border-l-4 border-teal-600 dark:bg-slate-800"
                        textColor="white"
                        description="Seluruh Laporan"
                    />
                    <StatCard
                        title="Disetujui"
                        value={statistik.totalApproved.toLocaleString()}
                        icon={CheckCircle2}
                        color="bg-emerald-600"
                        className="border-l-4 border-emerald-600 dark:bg-slate-800"
                        textColor="white"
                        description="Telah diverifikasi"
                    />
                    <StatCard
                        title="Menunggu Validasi"
                        value={statistik.totalPending.toLocaleString()}
                        icon={Clock}
                        color="bg-amber-500"
                        className="border-l-4 border-amber-500 dark:bg-slate-800"
                        textColor="white"
                        description="Perlu Pengecekan"
                    />
                    <StatCard
                        title="Ditolak/Revisi"
                        value={statistik.totalRejected.toLocaleString()}
                        icon={XCircle}
                        color="bg-rose-500"
                        className="border-l-4 border-rose-500 dark:bg-slate-800"
                        textColor="white"
                        description="Butuh Perbaikan"
                    />
                </div>

                {/* ─── VERIFIKASI ─── */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2.5 bg-teal-50 dark:bg-teal-900/50 rounded-xl">
                                <ShieldCheck size={20} className="text-teal-600 dark:text-teal-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                    Status Laporan Kecamatan
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Sebanyak <strong className="text-teal-600 dark:text-teal-400">{persentaseApproved}%</strong> dari total laporan kegiatan telah disetujui.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <p className="text-xs text-slate-400">Disetujui</p>
                                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                    {statistik.totalApproved}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-slate-400">Menunggu</p>
                                <p className="text-lg font-bold text-amber-500 dark:text-amber-400">
                                    {statistik.totalPending}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-slate-400">Ditolak</p>
                                <p className="text-lg font-bold text-rose-500 dark:text-rose-400">
                                    {statistik.totalRejected}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${persentaseApproved}%` }}
                        />
                    </div>
                </div>

                {/* ─── DATA WILAYAH & REKAP PER POKJA ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* DATA WILAYAH */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                        <StatCard
                            title="Desa / Kelurahan"
                            value={statistik.totalDesa.toLocaleString()}
                            icon={Building2}
                            color="bg-blue-600"
                            className="border-l-4 border-blue-600 dark:bg-slate-800"
                            textColor="white"
                            description="Wilayah Administrasi"
                        />
                        <StatCard
                            title="Dasa Wisma"
                            value={statistik.totalDasaWisma.toLocaleString()}
                            icon={Home}
                            color="bg-purple-600"
                            className="border-l-4 border-purple-600 dark:bg-slate-800"
                            textColor="white"
                            description="Kelompok PKK"
                        />
                    </div>

                    {/* REKAP PER POKJA */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base mb-1">
                            Rekap Laporan Per Pokja
                        </h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
                            Distribusi laporan kegiatan di Kecamatan {kecamatan}
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <PokjaCard label="Pokja I" value={rekapPokja.I} color="teal" />
                            <PokjaCard label="Pokja II" value={rekapPokja.II} color="blue" />
                            <PokjaCard label="Pokja III" value={rekapPokja.III} color="purple" />
                            <PokjaCard label="Pokja IV" value={rekapPokja.IV} color="pink" />
                        </div>
                    </div>
                </div>

                {/* ─── LAPORAN TERBARU ─── */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                                Laporan Terbaru
                            </h3>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                Aktivitas laporan terbaru dari Kecamatan {kecamatan}
                            </p>
                        </div>
                        <Link
                            href="/kecamatan/laporan"
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/50 hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors"
                        >
                            Lihat Semua
                            <ArrowRight size={14} />
                        </Link>
                    </div>

                    {laporanTerbaru.length > 0 ? (
                        <div className="space-y-4">
                            {laporanTerbaru.map((item, i) => {
                                const statusMap: Record<string, { label: string; type: any }> = {
                                    pending: { label: "Menunggu", type: "warning" },
                                    approved: { label: "Disetujui", type: "success" },
                                    rejected: { label: "Ditolak", type: "danger" },
                                    reviewed: { label: "Direview", type: "info" },
                                };
                                const badgeInfo = statusMap[item.status] || { label: item.status, type: "default" };

                                return (
                                    <div key={item.id} className="flex gap-3.5 relative">
                                        {i !== laporanTerbaru.length - 1 && (
                                            <div className="absolute left-[9px] top-7 bottom-[-16px] w-0.5 bg-slate-100 dark:bg-slate-700"></div>
                                        )}
                                        <div className="w-5 h-5 mt-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/50 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center shrink-0 z-10">
                                            <div className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400"></div>
                                        </div>
                                        <div className="min-w-0 flex-1 pb-1">
                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">
                                                {item.judul}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge type="info" className="text-[10px]">
                                                    Pokja {item.kategori_pokja}
                                                </Badge>
                                                <Badge type={badgeInfo.type} className="text-[10px]">
                                                    {badgeInfo.label}
                                                </Badge>
                                                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                                    {formatDate(item.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-6">
                            Belum ada laporan masuk di Kecamatan {kecamatan}.
                        </p>
                    )}
                </div>
            </div>
        </AdminKecamatanLayout>
    );
}

// ============================================================
// HELPER: FORMAT DATE
// ============================================================

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

// ============================================================
// SUB-COMPONENT: POKJA CARD
// ============================================================

function PokjaCard({
    label,
    value,
    color,
}: {
    label: string;
    value: number;
    color: 'teal' | 'blue' | 'purple' | 'pink';
}) {
    const colorMap = {
        teal: { dot: 'bg-teal-500', text: 'text-teal-600 dark:text-teal-400' },
        blue: { dot: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400' },
        purple: { dot: 'bg-purple-500', text: 'text-purple-600 dark:text-purple-400' },
        pink: { dot: 'bg-pink-500', text: 'text-pink-600 dark:text-pink-400' },
    };
    const c = colorMap[color];

    return (
        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    {label}
                </p>
                <div className={`w-2 h-2 rounded-full ${c.dot}`} />
            </div>
            <p className={`text-2xl font-bold ${c.text} mt-3`}>
                {value.toLocaleString("id-ID")}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                total laporan
            </p>
        </div>
    );
}
