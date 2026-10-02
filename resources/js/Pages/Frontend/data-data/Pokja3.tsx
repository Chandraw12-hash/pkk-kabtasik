import React, { useState, useRef, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    BarChart3,
    TrendingUp,
    Home,
    Wheat,
    Building2,
    Users,
    Leaf,
    Sprout,
    Warehouse,
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

interface Pokja3Item {
    id: number;
    kecamatan?: string;
    nama_kecamatan?: string;
    rumah_sehat?: number;
    rumah_tidak_sehat?: number;
    pemanfaatan_pekarangan?: number;
    industri_rumah_tangga?: number;
    jumlah_kader?: number;
    jumlah_kader_p?: number;
    makanan_pokok?: number;
    hatinya_pkk?: number;
    jumlah_rumah?: number;
    [key: string]: any;
}

interface PaginationData {
    data: Pokja3Item[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: any[];
}

interface Props {
    data: PaginationData;
    filters?: {
        search?: string;
        per_page?: number | string;
    };
}

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

export default function Pokja3({ data, filters = {} }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [perPage, setPerPage] = useState(Number(filters.per_page) || 10);
    const [localData, setLocalData] = useState(data);
    const [isLoading, setIsLoading] = useState(false);
    const firstRender = useRef(true);

    const items = localData?.data || [];

    // ========================================================
    // FETCH DATA
    // ========================================================
    const fetchData = (params: Record<string, any> = {}) => {
        setIsLoading(true);
        axios
            .get("/api/pokja-3", {
                params: { search: search || undefined, per_page: perPage, ...params },
                headers: { Accept: "application/json" },
            })
            .then((res) => {
                if (res.data?.data) setLocalData(res.data);
            })
            .catch((err) => console.error("Error fetching data:", err))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        const timeout = setTimeout(() => fetchData(), 300);
        return () => clearTimeout(timeout);
    }, [search, perPage]);

    const handlePageChange = (url: string) => {
        if (!url) return;
        const params = new URL(url).searchParams;
        fetchData({ page: params.get("page") });
    };

    // ========================================================
    // KALKULASI
    // ========================================================
    const sum = (key: keyof Pokja3Item) =>
        items.reduce((a, c) => a + (Number(c[key]) || 0), 0);

    const totalRumahSehat = sum("rumah_sehat");
    const totalRumahTidakSehat = sum("rumah_tidak_sehat");
    const totalPekarangan = sum("pemanfaatan_pekarangan");
    const totalIndustri = sum("industri_rumah_tangga");
    const totalKader = sum("jumlah_kader");
    const totalKaderP = sum("jumlah_kader_p");
    const totalMakananPokok = sum("makanan_pokok");
    const totalHatinyaPkk = sum("hatinya_pkk");
    const totalJumlahRumah = sum("jumlah_rumah");

    const totalRumah = totalRumahSehat + totalRumahTidakSehat;
    const percentSehat = totalRumah > 0 ? (totalRumahSehat / totalRumah) * 100 : 0;
    const percentTidakSehat = totalRumah > 0 ? (totalRumahTidakSehat / totalRumah) * 100 : 0;

    // CHART DATA
    const chartData = [
        { label: "R. Sehat", value: totalRumahSehat },
        { label: "R. Tdk Sehat", value: totalRumahTidakSehat },
        { label: "Pekarangan", value: totalPekarangan },
        { label: "Industri RT", value: totalIndustri },
        { label: "Kader", value: totalKader },
        { label: "Makanan", value: totalMakananPokok },
        { label: "Hatinya PKK", value: totalHatinyaPkk },
    ];
    const hasChartData = chartData.some((item) => item.value > 0);

    // PIE DATA — KONDISI RUMAH
    const rumahPieData = [
        { name: "Sehat", value: totalRumahSehat, color: "#0072BC" },
        { name: "Tidak Sehat", value: totalRumahTidakSehat, color: "#f43f5e" },
    ].filter((item) => item.value > 0);

    // ========================================================
    // RENDER
    // ========================================================
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 pt-14 sm:pt-16">
            <Head title="Data Pokja III - TP PKK Kab. Tasikmalaya" />
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full">
                {/* BREADCRUMB */}
                <nav className="flex items-center gap-2 text-sm text-slate-500">
                    <Link href="/" className="hover:text-[#0072BC] transition-colors">
                        Beranda
                    </Link>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-900 font-medium">Pokja III</span>
                </nav>

                {/* JUDUL */}
                <div>
                    <p className="text-[#0072BC] text-xs font-semibold tracking-wide uppercase mb-1">
                        Pokja III
                    </p>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Rekapitulasi Data Pokja III Tingkat Kecamatan
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        Pangan, Sandang, Perumahan, dan Tata Laksana Rumah Tangga.
                    </p>
                </div>

                {/* FILTER */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row flex-wrap gap-3 items-start md:items-center justify-between">
                    <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
                        <div className="relative flex-1 min-w-[180px]">
                            <Search
                                size={15}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari kecamatan..."
                                className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#0072BC] bg-white"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-slate-600">
                                Tampilkan
                            </label>
                            <select
                                value={perPage}
                                onChange={(e) => setPerPage(Number(e.target.value))}
                                className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0072BC]"
                            >
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
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
                            label="Rumah Sehat"
                            value={totalRumahSehat}
                            icon={Home}
                            color="blue"
                            subtitle="Layak Huni"
                        />
                        <StatCard
                            label="Rumah Tidak Sehat"
                            value={totalRumahTidakSehat}
                            icon={Home}
                            color="rose"
                            subtitle="Perlu Perbaikan"
                        />
                        <StatCard
                            label="Pemanfaatan Pekarangan"
                            value={totalPekarangan}
                            icon={Wheat}
                            color="amber"
                            subtitle="Hatinya PKK"
                        />
                        <StatCard
                            label="Industri Rumah Tangga"
                            value={totalIndustri}
                            icon={Building2}
                            color="indigo"
                            subtitle="UP2K"
                        />
                    </div>
                )} */}

                {/* CHART + INSIGHT */}
                {!isLoading && items.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {/* Chart Bar */}
                        <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                            <div className="mb-4 border-b border-slate-100 pb-4">
                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <BarChart3 size={16} className="text-[#0072BC]" />
                                    Distribusi Data Pokja III
                                </h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    Akumulasi indikator pada kecamatan yang ditampilkan.
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
                                                    "Jumlah",
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

                        {/* Pie Chart — Kondisi Rumah */}
                        <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                            <div className="mb-4 border-b border-slate-100 pb-4">
                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <Home size={16} className="text-[#0072BC]" />
                                    Rasio Kondisi Rumah
                                </h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    Perbandingan rumah sehat vs tidak sehat.
                                </p>
                            </div>
                            {totalRumah > 0 ? (
                                <div className="grid min-h-64 grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(0,1.15fr)_minmax(9rem,1fr)]">
                                    <div className="relative h-64 min-w-0">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={rumahPieData}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius="62%"
                                                    outerRadius="86%"
                                                    paddingAngle={2}
                                                >
                                                    {rumahPieData.map((item) => (
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
                                                Total Rumah
                                            </span>
                                            <strong className="text-lg font-bold tabular-nums text-slate-900">
                                                {totalRumah.toLocaleString("id-ID")}
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
                                                <span className="truncate">Rumah Sehat</span>
                                            </span>
                                            <strong className="shrink-0 tabular-nums text-slate-900">
                                                {totalRumahSehat.toLocaleString("id-ID")}
                                            </strong>
                                        </div>
                                        <div className="flex items-center justify-between gap-3 text-sm">
                                            <span className="flex min-w-0 items-center gap-2 text-slate-600">
                                                <span
                                                    className="h-3 w-3 shrink-0 rounded-sm"
                                                    style={{ backgroundColor: "#f43f5e" }}
                                                />
                                                <span className="truncate">
                                                    Rumah Tidak Sehat
                                                </span>
                                            </span>
                                            <strong className="shrink-0 tabular-nums text-slate-900">
                                                {totalRumahTidakSehat.toLocaleString("id-ID")}
                                            </strong>
                                        </div>
                                        <div className="border-t border-slate-100 pt-3 text-xs text-slate-500">
                                            Persentase Sehat{" "}
                                            <strong className="ml-1 text-[#0072BC]">
                                                {percentSehat.toFixed(1)}%
                                            </strong>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex min-h-72 items-center justify-center text-sm text-slate-400">
                                    Belum ada data rumah untuk ditampilkan
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

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs min-w-[1300px]">
                            <thead>
                                {/* BARIS 1 — GRUP */}
                                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                                    <th
                                        rowSpan={2}
                                        className="p-2 border-r border-slate-200 text-center font-bold sticky left-0 bg-slate-100 z-10 min-w-[50px]"
                                    >
                                        NO
                                    </th>
                                    <th
                                        rowSpan={2}
                                        className="p-2 border-r border-slate-200 text-center font-bold sticky left-[50px] bg-slate-100 z-10 min-w-[140px]"
                                    >
                                        KECAMATAN
                                    </th>
                                    <th
                                        colSpan={2}
                                        className="p-2 border-r border-slate-200 text-center font-bold bg-slate-300"
                                    >
                                        JUMLAH KADER
                                    </th>
                                    <th
                                        colSpan={3}
                                        className="p-2 border-r border-slate-200 text-center font-bold bg-slate-300"
                                    >
                                        P A N G A N
                                    </th>
                                    <th
                                        rowSpan={2}
                                        className="p-2 border-r border-slate-200 text-center font-bold bg-slate-300 min-w-[100px]"
                                    >
                                        JUMLAH INDUSTRI RUMAH TANGGA
                                    </th>
                                    <th
                                        colSpan={3}
                                        className="p-2 text-center font-bold bg-slate-300"
                                    >
                                        JUMLAH RUMAH
                                    </th>
                                </tr>

                                {/* BARIS 2 — SUB-KOLOM */}
                                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-200 min-w-[60px]">
                                        L
                                    </th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-200 min-w-[60px]">
                                        P
                                    </th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-200 min-w-[80px]">
                                        MAKANAN POKOK
                                    </th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-200 min-w-[100px]">
                                        PEMANFAATAN PEKARANGAN
                                    </th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-200 min-w-[80px]">
                                        HATINYA PKK
                                    </th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-200 min-w-[70px]">
                                        SEHAT
                                    </th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-200 min-w-[70px]">
                                        TIDAK SEHAT
                                    </th>
                                    <th className="p-2 text-center font-semibold bg-slate-200 min-w-[70px]">
                                        JUMLAH
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {items.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={11}
                                            className="text-center py-12 text-slate-400"
                                        >
                                            {isLoading
                                                ? "Memuat data..."
                                                : "Belum ada data kecamatan untuk Pokja III."}
                                        </td>
                                    </tr>
                                ) : (
                                    items.map((item, idx) => (
                                        <tr
                                            key={item.id || idx}
                                            className="hover:bg-slate-50 transition-colors"
                                        >
                                            <td className="p-2 border-r border-slate-100 text-center text-slate-500 sticky left-0 bg-white z-10">
                                                {idx + 1}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 font-semibold text-slate-900 sticky left-[50px] bg-white z-10">
                                                {item.kecamatan || item.nama_kecamatan || "-"}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.jumlah_kader || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.jumlah_kader_p || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.makanan_pokok || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.pemanfaatan_pekarangan || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.hatinya_pkk || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.industri_rumah_tangga || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.rumah_sehat || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.rumah_tidak_sehat || 0}
                                            </td>
                                            <td className="p-2 text-center font-semibold bg-blue-50/30">
                                                {(Number(item.rumah_sehat) || 0) +
                                                    (Number(item.rumah_tidak_sehat) || 0)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>

                            {/* FOOTER — JUMLAH */}
                            {items.length > 0 && (
                                <tfoot>
                                    <tr className="bg-slate-100 font-bold text-slate-800 border-t-2 border-slate-300">
                                        <td
                                            colSpan={2}
                                            className="p-2 border-r border-slate-200 text-center sticky left-0 bg-slate-100 z-10"
                                        >
                                            JUMLAH
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalKader}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalKaderP}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalMakananPokok}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalPekarangan}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalHatinyaPkk}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalIndustri}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalRumahSehat}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalRumahTidakSehat}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalRumah}
                                        </td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>

                    {/* Pagination */}
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
                                            handlePageChange(
                                                `?page=${localData.current_page - 1}`
                                            );
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
                                            handlePageChange(
                                                `?page=${localData.current_page + 1}`
                                            );
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
                </div>
            </main>

            <Footer />
        </div>
    );
}
