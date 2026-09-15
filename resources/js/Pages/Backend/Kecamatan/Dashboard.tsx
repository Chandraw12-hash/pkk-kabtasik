import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminKecamatanLayout from "@/Components/Layout/AdminKecamatanLayout";
import {
    FileText,
    CheckCircle2,
    Clock,
    XCircle,
    Building2,
    Home,
    ArrowRight,
    BarChart3,
    MapPin,
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

    const persentasePending =
        totalLaporan > 0
            ? Math.round((statistik.totalPending / totalLaporan) * 100)
            : 0;

    return (
        <AdminKecamatanLayout>
            <Head title={`Dashboard Admin Kecamatan ${kecamatan}`} />

            <div className="space-y-6">
                {/* ============================================================
                    HEADER
                ============================================================ */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100 text-[11px] font-semibold">
                                <MapPin className="w-3.5 h-3.5" />
                                Admin Kecamatan
                            </span>

                            <span className="text-slate-300">•</span>

                            <span className="text-xs text-slate-400 font-medium">
                                TP PKK Kabupaten Tasikmalaya
                            </span>
                        </div>

                        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                            Dashboard Kecamatan
                        </h1>

                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Monitoring dan pengelolaan data PKK Kecamatan{" "}
                            <span className="font-semibold text-teal-600 dark:text-teal-400">
                                {kecamatan}
                            </span>
                        </p>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                        <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-950 flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        </div>

                        <div>
                            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                                Wilayah
                            </p>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                {kecamatan}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ============================================================
                    STATISTIK LAPORAN
                ============================================================ */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        icon={FileText}
                        label="Total Laporan"
                        value={statistik.totalLaporan}
                        color="teal"
                    />

                    <StatCard
                        icon={CheckCircle2}
                        label="Disetujui"
                        value={statistik.totalApproved}
                        color="green"
                    />

                    <StatCard
                        icon={Clock}
                        label="Menunggu"
                        value={statistik.totalPending}
                        color="amber"
                    />

                    <StatCard
                        icon={XCircle}
                        label="Ditolak"
                        value={statistik.totalRejected}
                        color="red"
                    />
                </div>

                {/* ============================================================
                    STATUS LAPORAN
                ============================================================ */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 lg:p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                        <div>
                            <div className="flex items-center gap-2">
                                <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950 flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                                </div>

                                <div>
                                    <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                        Status Laporan Kecamatan
                                    </h2>

                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Ringkasan proses verifikasi laporan kegiatan
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <StatusSummary
                                label="Disetujui"
                                value={statistik.totalApproved}
                                color="text-green-600 dark:text-green-400"
                            />

                            <StatusSummary
                                label="Menunggu"
                                value={statistik.totalPending}
                                color="text-amber-500"
                            />

                            <StatusSummary
                                label="Ditolak"
                                value={statistik.totalRejected}
                                color="text-red-500"
                            />
                        </div>
                    </div>

                    <div className="mt-5">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-slate-500">
                                Tingkat persetujuan
                            </span>

                            <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                                {persentaseApproved}%
                            </span>
                        </div>

                        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-teal-500 rounded-full transition-all duration-500"
                                style={{
                                    width: `${persentaseApproved}%`,
                                }}
                            />
                        </div>

                        <div className="flex items-center justify-between mt-2">
                            <span className="text-[10px] text-slate-400">
                                {statistik.totalApproved} laporan disetujui
                            </span>

                            <span className="text-[10px] text-slate-400">
                                {persentasePending}% masih menunggu
                            </span>
                        </div>
                    </div>
                </div>

                {/* ============================================================
                    DATA WILAYAH
                ============================================================ */}
                <div>
                    <div className="mb-4">
                        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                            Data Wilayah
                        </h2>

                        <p className="text-xs text-slate-400 mt-0.5">
                            Ringkasan wilayah administrasi dan kelompok PKK
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoCard
                            icon={Building2}
                            title="Desa / Kelurahan"
                            value={statistik.totalDesa}
                            description="Wilayah yang berada dalam kecamatan"
                            color="blue"
                        />

                        <InfoCard
                            icon={Home}
                            title="Dasa Wisma"
                            value={statistik.totalDasaWisma}
                            description="Data kelompok Dasa Wisma"
                            color="purple"
                        />
                    </div>
                </div>

                {/* ============================================================
                    REKAP PER POKJA
                ============================================================ */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-5 lg:p-6 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 flex items-center justify-center shrink-0">
                                    <BarChart3 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                                </div>

                                <div>
                                    <h2 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                                        Rekap Laporan Per Pokja
                                    </h2>

                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Distribusi laporan kegiatan di Kecamatan{" "}
                                        {kecamatan}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 lg:p-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <PokjaCard
                                label="Pokja I"
                                value={rekapPokja.I}
                            />

                            <PokjaCard
                                label="Pokja II"
                                value={rekapPokja.II}
                            />

                            <PokjaCard
                                label="Pokja III"
                                value={rekapPokja.III}
                            />

                            <PokjaCard
                                label="Pokja IV"
                                value={rekapPokja.IV}
                            />
                        </div>
                    </div>
                </div>

                {/* ============================================================
                    LAPORAN TERBARU
                ============================================================ */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-5 lg:p-6 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <h2 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                                    Laporan Terbaru
                                </h2>

                                <p className="text-xs text-slate-400 mt-0.5">
                                    Aktivitas laporan terbaru dari Kecamatan{" "}
                                    {kecamatan}
                                </p>
                            </div>

                            <Link
                                href="/kecamatan/laporan"
                                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors"
                            >
                                Lihat Semua
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>

                    {laporanTerbaru.length > 0 ? (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {laporanTerbaru.map((item) => {
                                const badge = getStatusBadge(item.status);

                                return (
                                    <div
                                        key={item.id}
                                        className="p-4 lg:px-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                                <FileText className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                                                    {item.judul}
                                                </p>

                                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                                        Pokja {item.kategori_pokja}
                                                    </span>

                                                    <span
                                                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge.class}`}
                                                    >
                                                        {badge.label}
                                                    </span>

                                                    <span className="text-[10px] text-slate-400">
                                                        {formatDate(
                                                            item.created_at
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                            </div>

                            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                                Belum Ada Laporan
                            </p>

                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                Belum ada laporan masuk di Kecamatan{" "}
                                {kecamatan}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AdminKecamatanLayout>
    );
}

// ============================================================
// HELPER: STATUS BADGE
// ============================================================

function getStatusBadge(status: string) {
    const map: Record<
        string,
        {
            label: string;
            class: string;
        }
    > = {
        pending: {
            label: "Menunggu",
            class: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
        },
        approved: {
            label: "Disetujui",
            class: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
        },
        rejected: {
            label: "Ditolak",
            class: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
        },
        reviewed: {
            label: "Direview",
            class: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
        },
    };

    return (
        map[status] || {
            label: status,
            class: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
        }
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
// SUB-COMPONENT: STAT CARD
// ============================================================

function StatCard({
    icon: Icon,
    label,
    value,
    color,
}: {
    icon: React.ElementType;
    label: string;
    value: number;
    color: "teal" | "green" | "amber" | "red";
}) {
    const colorClasses = {
        teal: {
            bg: "bg-teal-50 dark:bg-teal-950",
            icon: "text-teal-600 dark:text-teal-400",
        },
        green: {
            bg: "bg-green-50 dark:bg-green-950",
            icon: "text-green-600 dark:text-green-400",
        },
        amber: {
            bg: "bg-amber-50 dark:bg-amber-950",
            icon: "text-amber-600 dark:text-amber-400",
        },
        red: {
            bg: "bg-red-50 dark:bg-red-950",
            icon: "text-red-600 dark:text-red-400",
        },
    };

    const c = colorClasses[color];

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 lg:p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[10px] lg:text-xs font-semibold text-slate-400 uppercase tracking-wider truncate">
                        {label}
                    </p>

                    <p className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                        {value.toLocaleString("id-ID")}
                    </p>
                </div>

                <div
                    className={`w-10 h-10 lg:w-11 lg:h-11 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}
                >
                    <Icon
                        className={`w-5 h-5 lg:w-5.5 lg:h-5.5 ${c.icon}`}
                    />
                </div>
            </div>
        </div>
    );
}

// ============================================================
// SUB-COMPONENT: STATUS SUMMARY
// ============================================================

function StatusSummary({
    label,
    value,
    color,
}: {
    label: string;
    value: number;
    color: string;
}) {
    return (
        <div className="text-center">
            <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                {label}
            </p>

            <p className={`text-lg font-bold mt-0.5 ${color}`}>
                {value.toLocaleString("id-ID")}
            </p>
        </div>
    );
}

// ============================================================
// SUB-COMPONENT: INFO CARD
// ============================================================

function InfoCard({
    icon: Icon,
    title,
    value,
    description,
    color,
}: {
    icon: React.ElementType;
    title: string;
    value: number;
    description: string;
    color: "blue" | "purple";
}) {
    const colorClasses = {
        blue: {
            bg: "bg-blue-50 dark:bg-blue-950",
            icon: "text-blue-600 dark:text-blue-400",
        },
        purple: {
            bg: "bg-purple-50 dark:bg-purple-950",
            icon: "text-purple-600 dark:text-purple-400",
        },
    };

    const c = colorClasses[color];

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 lg:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {title}
                    </p>

                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                        {value.toLocaleString("id-ID")}
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                        {description}
                    </p>
                </div>

                <div
                    className={`w-12 h-12 lg:w-14 lg:h-14 rounded-2xl ${c.bg} flex items-center justify-center shrink-0`}
                >
                    <Icon className={`w-6 h-6 lg:w-7 lg:h-7 ${c.icon}`} />
                </div>
            </div>
        </div>
    );
}

// ============================================================
// SUB-COMPONENT: POKJA CARD
// ============================================================

function PokjaCard({
    label,
    value,
}: {
    label: string;
    value: number;
}) {
    return (
        <div className="p-4 lg:p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    {label}
                </p>

                <div className="w-2 h-2 rounded-full bg-teal-500" />
            </div>

            <p className="text-2xl lg:text-3xl font-bold text-teal-600 dark:text-teal-400 mt-3">
                {value.toLocaleString("id-ID")}
            </p>

            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                total laporan
            </p>
        </div>
    );
}
