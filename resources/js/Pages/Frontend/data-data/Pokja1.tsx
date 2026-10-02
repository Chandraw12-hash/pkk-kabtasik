import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Head, Link } from "@inertiajs/react";
import {
    Search,
    Users,
    BookOpen,
    RefreshCw,
    Download,
    ChevronLeft,
    ChevronRight,
    BarChart3,
    TrendingUp,
    Award,
    Target,
    Crown,
    Heart,
} from "lucide-react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import axios from "axios";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    LabelList,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

// ============================================================
// INTERFACE
// ============================================================

interface Pokja1Item {
    id: number;
    kecamatan?: string;
    nama_kecamatan?: string;
    nama_wilayah?: string;
    tahun?: number;
    kader_umum?: number;
    kader_khusus?: number;

    // KISAH
    kisah_kegiatan?: string;
    kisah_volume?: number;
    kisah_metode?: string;
    kisah_sasaran?: number;
    // KILAS
    kilas_kegiatan?: string;
    kilas_volume?: number;
    kilas_metode?: string;
    kilas_sasaran?: number;
    // KRISAN
    krisan_kegiatan?: string;
    krisan_volume?: number;
    krisan_metode?: string;
    krisan_sasaran?: number;
    // KIAT
    kiat_kegiatan?: string;
    kiat_volume?: number;
    kiat_metode?: string;
    kiat_sasaran?: number;
    // KISAK
    kisak_kegiatan?: string;
    kisak_volume?: number;
    kisak_metode?: string;
    kisak_sasaran?: number;
    // PKBN
    pkbn_kegiatan?: string;
    pkbn_volume?: number;
    pkbn_metode?: string;
    pkbn_sasaran?: number;

    keterangan?: string;
    [key: string]: any;
}

interface Props {
    data: {
        data: Pokja1Item[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: any[];
    };
    filters?: {
        search?: string;
        tahun?: string;
        per_page?: number | string;
    };
}

const num = (v: unknown) => Number(v) || 0;

// ============================================================
// STAT CARD — PROFESIONAL
// ============================================================

const StatCard = ({
    label,
    value,
    icon: Icon,
    color = "blue",
    subtitle,
}: {
    label: string;
    value: number;
    icon: any;
    color?: "blue" | "green" | "amber" | "teal" | "purple" | "rose" | "indigo";
    subtitle?: string;
}) => {
    const colorMap = {
        blue: { bg: "bg-blue-50", icon: "text-blue-600", text: "text-blue-700", border: "border-blue-100" },
        green: { bg: "bg-green-50", icon: "text-green-600", text: "text-green-700", border: "border-green-100" },
        amber: { bg: "bg-amber-50", icon: "text-amber-600", text: "text-amber-700", border: "border-amber-100" },
        teal: { bg: "bg-teal-50", icon: "text-teal-600", text: "text-teal-700", border: "border-teal-100" },
        purple: { bg: "bg-purple-50", icon: "text-purple-600", text: "text-purple-700", border: "border-purple-100" },
        rose: { bg: "bg-rose-50", icon: "text-rose-600", text: "text-rose-700", border: "border-rose-100" },
        indigo: { bg: "bg-indigo-50", icon: "text-indigo-600", text: "text-indigo-700", border: "border-indigo-100" },
    };

    const c = colorMap[color];

    return (
        <div className={`bg-white border ${c.border} rounded-xl p-4 hover:shadow-sm transition-shadow`}>
            <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center`}>
                    <Icon size={18} className={c.icon} />
                </div>
                <TrendingUp size={14} className="text-slate-300" />
            </div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</p>
            <p className={`text-xl font-bold ${c.text}`}>{value.toLocaleString("id-ID")}</p>
            {subtitle && <p className="text-[11px] text-slate-400 mt-1">{subtitle}</p>}
        </div>
    );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function Pokja1({ data, filters = {} }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [tahun, setTahun] = useState(filters.tahun || new Date().getFullYear().toString());
    const [perPage, setPerPage] = useState(Number(filters.per_page) || 10);
    const [localData, setLocalData] = useState(data);
    const [isLoading, setIsLoading] = useState(false);
    const firstRender = useRef(true);

    const items: Pokja1Item[] = localData?.data || [];

    const fetchData = useCallback((params: Record<string, any> = {}) => {
        setIsLoading(true);
        axios
            .get("/api/pokja-1", {
                params: { search: search || undefined, tahun, per_page: perPage, ...params },
                headers: { Accept: "application/json" },
            })
            .then((res) => {
                if (res.data?.data) setLocalData(res.data);
            })
            .catch((err) => console.error("Error fetching data:", err))
            .finally(() => setIsLoading(false));
    }, [search, tahun, perPage]);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        const timeout = setTimeout(() => fetchData(), 400);
        return () => clearTimeout(timeout);
    }, [search, tahun, perPage, fetchData]);

    const handlePageChange = useCallback((url: string) => {
        if (!url) return;
        const params = new URL(url).searchParams;
        fetchData({ page: params.get("page") });
    }, [fetchData]);

    // ========================================================
    // SUMMARY
    // ========================================================
    const stats = useMemo(() => {
        const sum = (key: keyof Pokja1Item) =>
            items.reduce((a, c) => a + num(c[key]), 0);

        const totalKaderUmum = sum("kader_umum");
        const totalKaderKhusus = sum("kader_khusus");
        const totalKader = totalKaderUmum + totalKaderKhusus;

        const totalKisahSasaran = sum("kisah_sasaran");
        const totalKilasSasaran = sum("kilas_sasaran");
        const totalKrisanSasaran = sum("krisan_sasaran");
        const totalKiatSasaran = sum("kiat_sasaran");
        const totalKisakSasaran = sum("kisak_sasaran");
        const totalPkbnSasaran = sum("pkbn_sasaran");
        const totalSasaran = totalKisahSasaran + totalKilasSasaran + totalKrisanSasaran +
            totalKiatSasaran + totalKisakSasaran + totalPkbnSasaran;

        return {
            totalKaderUmum,
            totalKaderKhusus,
            totalKader,
            totalKisahSasaran,
            totalKilasSasaran,
            totalKrisanSasaran,
            totalKiatSasaran,
            totalKisakSasaran,
            totalPkbnSasaran,
            totalSasaran,
        };
    }, [items]);

    // ========================================================
    // CHART DATA — DISTRIBUSI SASARAN PER PROGRAM
    // ========================================================
    const chartData = [
        { label: "KISAH", value: stats.totalKisahSasaran },
        { label: "KILAS", value: stats.totalKilasSasaran },
        { label: "KRISAN", value: stats.totalKrisanSasaran },
        { label: "KIAT", value: stats.totalKiatSasaran },
        { label: "KISAK", value: stats.totalKisakSasaran },
        { label: "PKBN", value: stats.totalPkbnSasaran },
    ];
    const hasChartData = chartData.some((item) => item.value > 0);

    // PIE DATA — KADER
    const kaderPieData = [
        { name: "Kader Umum", value: stats.totalKaderUmum, color: "#0072BC" },
        { name: "Kader Khusus", value: stats.totalKaderKhusus, color: "#f59e0b" },
    ].filter((item) => item.value > 0);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pt-14 sm:pt-16">
            <Head title="Data Pokja I - TP PKK Kab. Tasikmalaya" />
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* BREADCRUMB */}
                <nav className="flex items-center gap-2 text-sm text-slate-500">
                    <Link href="/" className="hover:text-[#0072BC] transition-colors">Beranda</Link>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-900 font-medium">Pokja I</span>
                </nav>

                {/* JUDUL */}
                <div>
                    <p className="text-[#0072BC] text-xs font-semibold tracking-wide uppercase mb-1">Pokja I</p>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Rekapitulasi Data Pokja I Tingkat Kecamatan
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        Penghayatan & Pengamalan Pancasila serta Gotong Royong
                    </p>
                </div>

                {/* FILTER */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row flex-wrap gap-3 items-start md:items-center justify-between">
                    <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
                        <div className="relative flex-1 min-w-[180px]">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari kecamatan..."
                                className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#0072BC] bg-white"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-slate-600">Tahun</label>
                            <select
                                value={tahun}
                                onChange={(e) => setTahun(e.target.value)}
                                className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0072BC]"
                            >
                                <option value="2026">2026</option>
                                <option value="2025">2025</option>
                                <option value="2024">2024</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-slate-600">Tampilkan</label>
                            <select
                                value={perPage}
                                onChange={(e) => setPerPage(Number(e.target.value))}
                                className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0072BC]"
                            >
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>
                    </div>
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            className="inline-flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                        >
                            Reset
                        </button>
                    )}
                </div>

                {/* STAT CARDS — 4 UTAMA */}
                {/* {!isLoading && items.length > 0 && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            label="Total Kader Umum"
                            value={stats.totalKaderUmum}
                            icon={Users}
                            color="blue"
                            subtitle="Kader Umum"
                        />
                        <StatCard
                            label="Total Kader Khusus"
                            value={stats.totalKaderKhusus}
                            icon={Award}
                            color="amber"
                            subtitle="Kader Khusus"
                        />
                        <StatCard
                            label="Total Kader"
                            value={stats.totalKader}
                            icon={Crown}
                            color="teal"
                            subtitle="Umum + Khusus"
                        />
                        <StatCard
                            label="Total Sasaran"
                            value={stats.totalSasaran}
                            icon={Target}
                            color="indigo"
                            subtitle="Semua Program"
                        />
                    </div>
                )} */}

                {/* CHART + INSIGHT */}
                {!isLoading && items.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {/* Chart Bar — Distribusi Sasaran */}
                        <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                            <div className="mb-4 border-b border-slate-100 pb-4">
                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <BarChart3 size={16} className="text-[#0072BC]" />
                                    Distribusi Sasaran per Program
                                </h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    Akumulasi jumlah sasaran pada 6 program Pokja I.
                                </p>
                            </div>
                            {hasChartData ? (
                                <div className="h-72 w-full min-w-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={chartData}
                                            margin={{ top: 18, right: 8, left: 0, bottom: 8 }}
                                        >
                                            <CartesianGrid vertical={false} stroke="#e2e8f0" />
                                            <XAxis
                                                dataKey="label"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: "#64748b", fontSize: 10 }}
                                                interval={0}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: "#94a3b8", fontSize: 10 }}
                                                width={42}
                                                tickFormatter={(value) =>
                                                    Number(value).toLocaleString("id-ID")
                                                }
                                            />
                                            <Tooltip
                                                formatter={(value) => [
                                                    Number(value).toLocaleString("id-ID"),
                                                    "Sasaran",
                                                ]}
                                                contentStyle={{
                                                    border: "1px solid #e2e8f0",
                                                    borderRadius: 8,
                                                    fontSize: 12,
                                                }}
                                            />
                                            <Bar
                                                dataKey="value"
                                                fill="#0072BC"
                                                radius={[5, 5, 0, 0]}
                                                maxBarSize={48}
                                            >
                                                <LabelList
                                                    dataKey="value"
                                                    position="top"
                                                    formatter={(value) =>
                                                        Number(value).toLocaleString("id-ID")
                                                    }
                                                    fill="#005A94"
                                                    fontSize={10}
                                                />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="flex min-h-72 items-center justify-center text-sm text-slate-400">
                                    Belum ada data untuk ditampilkan
                                </div>
                            )}
                        </section>

                        {/* Pie Chart — Kader */}
                        <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                            <div className="mb-4 border-b border-slate-100 pb-4">
                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <Users size={16} className="text-[#0072BC]" />
                                    Komposisi Kader
                                </h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    Perbandingan kader umum vs kader khusus.
                                </p>
                            </div>
                            {stats.totalKader > 0 ? (
                                <div className="grid min-h-64 grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(0,1.15fr)_minmax(9rem,1fr)]">
                                    <div className="relative h-64 min-w-0">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={kaderPieData}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius="62%"
                                                    outerRadius="86%"
                                                    paddingAngle={2}
                                                >
                                                    {kaderPieData.map((item) => (
                                                        <Cell key={item.name} fill={item.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(value, name) => [
                                                        Number(value).toLocaleString("id-ID"),
                                                        name,
                                                    ]}
                                                    contentStyle={{
                                                        border: "1px solid #e2e8f0",
                                                        borderRadius: 8,
                                                        fontSize: 12,
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-xs text-slate-400">
                                                Total Kader
                                            </span>
                                            <strong className="text-lg font-bold tabular-nums text-slate-900">
                                                {stats.totalKader.toLocaleString("id-ID")}
                                            </strong>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between gap-3 text-sm">
                                            <span className="flex min-w-0 items-center gap-2 text-slate-600">
                                                <span
                                                    className="h-3 w-3 shrink-0 rounded-sm"
                                                    style={{ backgroundColor: "#0072BC" }}
                                                />
                                                <span className="truncate">Kader Umum</span>
                                            </span>
                                            <strong className="shrink-0 tabular-nums text-slate-900">
                                                {stats.totalKaderUmum.toLocaleString("id-ID")}
                                            </strong>
                                        </div>
                                        <div className="flex items-center justify-between gap-3 text-sm">
                                            <span className="flex min-w-0 items-center gap-2 text-slate-600">
                                                <span
                                                    className="h-3 w-3 shrink-0 rounded-sm"
                                                    style={{ backgroundColor: "#f59e0b" }}
                                                />
                                                <span className="truncate">Kader Khusus</span>
                                            </span>
                                            <strong className="shrink-0 tabular-nums text-slate-900">
                                                {stats.totalKaderKhusus.toLocaleString("id-ID")}
                                            </strong>
                                        </div>
                                        <div className="border-t border-slate-100 pt-3 text-xs text-slate-500">
                                            Persentase Umum{" "}
                                            <strong className="ml-1 text-[#0072BC]">
                                                {stats.totalKader > 0
                                                    ? ((stats.totalKaderUmum / stats.totalKader) * 100).toFixed(1)
                                                    : 0}
                                                %
                                            </strong>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex min-h-72 items-center justify-center text-sm text-slate-400">
                                    Belum ada data kader untuk ditampilkan
                                </div>
                            )}
                        </section>
                    </div>
                )}

                {/* ============================================================
                    TABEL
                ============================================================ */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-slate-200">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span>Tampilkan data wilayah</span>
                        </div>
                    </div>

                    {!isLoading && items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                            <Users size={48} className="mb-4 text-slate-300" />
                            <p className="text-lg font-medium text-slate-600">Belum ada data</p>
                            <p className="text-sm">Data kecamatan untuk Pokja I belum tersedia</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs border-collapse min-w-[2600px]">
                                    <thead>
                                        {/* BARIS 1 — GROUP UTAMA */}
                                        <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                                            <th rowSpan={3} className="p-2 border-r border-slate-200 text-center font-bold sticky left-0 bg-slate-100 z-10 min-w-[50px]">No.</th>
                                            <th rowSpan={3} className="p-2 border-r border-slate-200 text-center font-bold sticky left-[50px] bg-slate-100 z-10 min-w-[140px]">KECAMATAN</th>
                                            <th colSpan={2} className="p-2 border-r border-slate-200 text-center font-bold bg-slate-300">JML KADER</th>
                                            <th colSpan={24} className="p-2 border-r border-slate-200 text-center font-bold bg-slate-300">PENGHAYATAN DAN PENGAMALAN PANCASILA DAN GOTONG ROYONG</th>
                                            <th rowSpan={3} className="p-2 border-r border-slate-200 text-center font-bold bg-slate-200 min-w-[120px]">Keterangan</th>
                                        </tr>

                                        {/* BARIS 2 — SUB-GROUP */}
                                        <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                                            <th rowSpan={2} className="p-1 border-r border-slate-200 text-center font-semibold bg-slate-200">Kader<br/>Umum</th>
                                            <th rowSpan={2} className="p-1 border-r border-slate-200 text-center font-semibold bg-slate-200">Kader<br/>Khusus</th>
                                            <th colSpan={4} className="p-1 border-r border-slate-200 text-center font-semibold bg-slate-200">KISAH</th>
                                            <th colSpan={4} className="p-1 border-r border-slate-200 text-center font-semibold bg-slate-200">KILAS</th>
                                            <th colSpan={4} className="p-1 border-r border-slate-200 text-center font-semibold bg-slate-200">KRISAN</th>
                                            <th colSpan={4} className="p-1 border-r border-slate-200 text-center font-semibold bg-slate-200">KIAT</th>
                                            <th colSpan={4} className="p-1 border-r border-slate-200 text-center font-semibold bg-slate-200">KISAK</th>
                                            <th colSpan={4} className="p-1 border-r border-slate-200 text-center font-semibold bg-slate-200">PKBN</th>
                                        </tr>

                                        {/* BARIS 3 — SUB-SUB-KOLOM */}
                                        <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                                            {["Kegiatan", "Vol", "Metode", "Sasaran",
                                              "Kegiatan", "Vol", "Metode", "Sasaran",
                                              "Kegiatan", "Vol", "Metode", "Sasaran",
                                              "Kegiatan", "Vol", "Metode", "Sasaran",
                                              "Kegiatan", "Vol", "Metode", "Sasaran",
                                              "Kegiatan", "Vol", "Metode", "Sasaran"].map((label, i) => (
                                                <th key={i} className="p-1.5 border-r border-slate-200 text-center font-medium bg-slate-100 min-w-[80px]">{label}</th>
                                              ))}
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100 text-slate-700">
                                        {items.map((item, idx) => (
                                            <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors">
                                                <td className="p-2 border-r border-slate-100 text-center sticky left-0 bg-white z-10">{idx + 1}</td>
                                                <td className="p-2 border-r border-slate-100 font-semibold sticky left-[50px] bg-white z-10">
                                                    {item.nama_wilayah || item.kecamatan || item.nama_kecamatan || "-"}
                                                </td>
                                                <td className="p-2 border-r border-slate-100 text-center">{num(item.kader_umum)}</td>
                                                <td className="p-2 border-r border-slate-100 text-center">{num(item.kader_khusus)}</td>

                                                <td className="p-2 border-r border-slate-100 min-w-[150px]">{item.kisah_kegiatan || "-"}</td>
                                                <td className="p-2 border-r border-slate-100 text-center">{num(item.kisah_volume)}</td>
                                                <td className="p-2 border-r border-slate-100">{item.kisah_metode || "-"}</td>
                                                <td className="p-2 border-r border-slate-100 text-center">{num(item.kisah_sasaran)}</td>

                                                <td className="p-2 border-r border-slate-100 min-w-[150px]">{item.kilas_kegiatan || "-"}</td>
                                                <td className="p-2 border-r border-slate-100 text-center">{num(item.kilas_volume)}</td>
                                                <td className="p-2 border-r border-slate-100">{item.kilas_metode || "-"}</td>
                                                <td className="p-2 border-r border-slate-100 text-center">{num(item.kilas_sasaran)}</td>

                                                <td className="p-2 border-r border-slate-100 min-w-[150px]">{item.krisan_kegiatan || "-"}</td>
                                                <td className="p-2 border-r border-slate-100 text-center">{num(item.krisan_volume)}</td>
                                                <td className="p-2 border-r border-slate-100">{item.krisan_metode || "-"}</td>
                                                <td className="p-2 border-r border-slate-100 text-center">{num(item.krisan_sasaran)}</td>

                                                <td className="p-2 border-r border-slate-100 min-w-[150px]">{item.kiat_kegiatan || "-"}</td>
                                                <td className="p-2 border-r border-slate-100 text-center">{num(item.kiat_volume)}</td>
                                                <td className="p-2 border-r border-slate-100">{item.kiat_metode || "-"}</td>
                                                <td className="p-2 border-r border-slate-100 text-center">{num(item.kiat_sasaran)}</td>

                                                <td className="p-2 border-r border-slate-100 min-w-[150px]">{item.kisak_kegiatan || "-"}</td>
                                                <td className="p-2 border-r border-slate-100 text-center">{num(item.kisak_volume)}</td>
                                                <td className="p-2 border-r border-slate-100">{item.kisak_metode || "-"}</td>
                                                <td className="p-2 border-r border-slate-100 text-center">{num(item.kisak_sasaran)}</td>

                                                <td className="p-2 border-r border-slate-100 min-w-[150px]">{item.pkbn_kegiatan || "-"}</td>
                                                <td className="p-2 border-r border-slate-100 text-center">{num(item.pkbn_volume)}</td>
                                                <td className="p-2 border-r border-slate-100">{item.pkbn_metode || "-"}</td>
                                                <td className="p-2 border-r border-slate-100 text-center">{num(item.pkbn_sasaran)}</td>

                                                <td className="p-2 border-r border-slate-100">{item.keterangan || "-"}</td>
                                            </tr>
                                        ))}
                                    </tbody>

                                    {items.length > 0 && (
                                        <tfoot>
                                            <tr className="bg-slate-100 font-bold text-slate-800 border-t-2 border-slate-300">
                                                <td colSpan={2} className="p-2 border-r border-slate-200 text-center sticky left-0 bg-slate-100 z-10">JUMLAH</td>
                                                <td className="p-2 border-r border-slate-200 text-center">{stats.totalKaderUmum.toLocaleString("id-ID")}</td>
                                                <td className="p-2 border-r border-slate-200 text-center">{stats.totalKaderKhusus.toLocaleString("id-ID")}</td>

                                                <td className="p-2 border-r border-slate-200 text-center">-</td>
                                                <td className="p-2 border-r border-slate-200 text-center">-</td>
                                                <td className="p-2 border-r border-slate-200 text-center">-</td>
                                                <td className="p-2 border-r border-slate-200 text-center">{stats.totalKisahSasaran.toLocaleString("id-ID")}</td>

                                                <td className="p-2 border-r border-slate-200 text-center">-</td>
                                                <td className="p-2 border-r border-slate-200 text-center">-</td>
                                                <td className="p-2 border-r border-slate-200 text-center">-</td>
                                                <td className="p-2 border-r border-slate-200 text-center">{stats.totalKilasSasaran.toLocaleString("id-ID")}</td>

                                                <td className="p-2 border-r border-slate-200 text-center">-</td>
                                                <td className="p-2 border-r border-slate-200 text-center">-</td>
                                                <td className="p-2 border-r border-slate-200 text-center">-</td>
                                                <td className="p-2 border-r border-slate-200 text-center">{stats.totalKrisanSasaran.toLocaleString("id-ID")}</td>

                                                <td className="p-2 border-r border-slate-200 text-center">-</td>
                                                <td className="p-2 border-r border-slate-200 text-center">-</td>
                                                <td className="p-2 border-r border-slate-200 text-center">-</td>
                                                <td className="p-2 border-r border-slate-200 text-center">{stats.totalKiatSasaran.toLocaleString("id-ID")}</td>

                                                <td className="p-2 border-r border-slate-200 text-center">-</td>
                                                <td className="p-2 border-r border-slate-200 text-center">-</td>
                                                <td className="p-2 border-r border-slate-200 text-center">-</td>
                                                <td className="p-2 border-r border-slate-200 text-center">{stats.totalKisakSasaran.toLocaleString("id-ID")}</td>

                                                <td className="p-2 border-r border-slate-200 text-center">-</td>
                                                <td className="p-2 border-r border-slate-200 text-center">-</td>
                                                <td className="p-2 border-r border-slate-200 text-center">-</td>
                                                <td className="p-2 border-r border-slate-200 text-center">{stats.totalPkbnSasaran.toLocaleString("id-ID")}</td>

                                                <td className="p-2 text-center">-</td>
                                            </tr>
                                        </tfoot>
                                    )}
                                </table>
                            </div>

                            {/* PAGINATION */}
                            {localData?.last_page > 1 && (
                                <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
                                    <span>
                                        Menampilkan {items.length} dari {localData.total || 0} data
                                    </span>
                                    <div className="flex gap-1">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (localData.current_page > 1)
                                                    handlePageChange(`?page=${localData.current_page - 1}`);
                                            }}
                                            disabled={localData.current_page <= 1}
                                            className={`px-3 py-1.5 border border-slate-200 rounded-lg bg-white font-medium ${
                                                localData.current_page <= 1
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : "hover:bg-slate-50"
                                            }`}
                                        >
                                            <ChevronLeft size={14} />
                                        </button>
                                        <span className="px-3 py-1.5 border border-[#0072BC] rounded-lg bg-[#0072BC] text-white font-medium">
                                            {localData.current_page || 1}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (localData.current_page < localData.last_page)
                                                    handlePageChange(`?page=${localData.current_page + 1}`);
                                            }}
                                            disabled={localData.current_page >= localData.last_page}
                                            className={`px-3 py-1.5 border border-slate-200 rounded-lg bg-white font-medium ${
                                                localData.current_page >= localData.last_page
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : "hover:bg-slate-50"
                                            }`}
                                        >
                                            <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
