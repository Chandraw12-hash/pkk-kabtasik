import React, { useState, useRef, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    BarChart3,
    PieChart as PieChartIcon,
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
    kader_tata_laksana?: number;
    makanan_non_beras?: number;
    peternakan?: number;
    perikanan?: number;
    warung_hidup?: number;
    lumbung_hidup?: number;
    toga?: number;
    tanaman_keras?: number;
    tanaman_lainnya?: number;
    industri_pangan?: number;
    industri_sandang?: number;
    industri_jasa?: number;
    keterangan?: string;
    deskripsi?: string;
    judul_kegiatan?: string;
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
    // KALKULASI TOTAL
    // ========================================================
    const sumField = (key: string) =>
        items.reduce((a, c) => a + (Number(c[key]) || 0), 0);

    const totalKaderPangan = sumField("jumlah_kader");
    const totalKaderSandang = sumField("jumlah_kader_p");
    const totalKaderTataLaksana = sumField("kader_tata_laksana");

    const totalMakananBeras = sumField("makanan_pokok");
    const totalMakananNonBeras = sumField("makanan_non_beras");

    const totalPeternakan = sumField("peternakan");
    const totalPerikanan = sumField("perikanan");
    const totalWarungHidup = sumField("warung_hidup");
    const totalLumbungHidup = sumField("lumbung_hidup");
    const totalToga = items.reduce((a, c) => a + (Number(c.toga) || (Number(c.hatinya_pkk) || 0)), 0);
    const totalTanamanKeras = sumField("tanaman_keras");
    const totalTanamanLainnya = items.reduce((a, c) => a + (Number(c.tanaman_lainnya) || (Number(c.pemanfaatan_pekarangan) || 0)), 0);

    const totalIndustriPangan = items.reduce((a, c) => a + (Number(c.industri_pangan) || (Number(c.industri_rumah_tangga) || 0)), 0);
    const totalIndustriSandang = sumField("industri_sandang");
    const totalIndustriJasa = sumField("industri_jasa");

    const totalRumahSehat = sumField("rumah_sehat");
    const totalRumahTidakSehat = sumField("rumah_tidak_sehat");

    const currentPage = localData?.current_page ?? 1;
    const perPageVal = localData?.per_page ?? 10;

    // ========================================================
    // RENDER
    // ========================================================
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pt-14 sm:pt-16">
            <Head title="Data Pokja III - TP PKK Kab. Tasikmalaya" />
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
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
                        Pangan, Sandang dan Tata Laksana Rumah Tangga.
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

                {/* CHART + INSIGHT */}
                {!isLoading && items.length > 0 && (() => {
                    const chartData = [
                        { label: "Kdr Pangan", value: totalKaderPangan },
                        { label: "Kdr Sandang", value: totalKaderSandang },
                        { label: "Kdr Tata Laksana", value: totalKaderTataLaksana },
                        { label: "Mkn Beras", value: totalMakananBeras },
                        { label: "Mkn Non Beras", value: totalMakananNonBeras },
                        { label: "Peternakan", value: totalPeternakan },
                        { label: "Perikanan", value: totalPerikanan },
                        { label: "Warung Hidup", value: totalWarungHidup },
                        { label: "Lumbung Hidup", value: totalLumbungHidup },
                        { label: "TOGA", value: totalToga },
                        { label: "Tnm Keras", value: totalTanamanKeras },
                        { label: "Tnm Lainnya", value: totalTanamanLainnya },
                    ];
                    const hasChartData = chartData.some((item) => item.value > 0);

                    const rumahPieData = [
                        { name: "Rumah Sehat", value: totalRumahSehat, color: "#0072BC" },
                        { name: "Rumah Tidak Sehat", value: totalRumahTidakSehat, color: "#f43f5e" },
                    ].filter((item) => item.value > 0);
                    const totalRumah = totalRumahSehat + totalRumahTidakSehat;
                    const sehatPercentage = totalRumah > 0 ? ((totalRumahSehat / totalRumah) * 100).toFixed(1) : "0";

                    return (
                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                            {/* Bar Chart — Distribusi Data */}
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
                                                    tick={{ fill: "#64748b", fontSize: 9 }}
                                                    interval={0}
                                                    angle={-35}
                                                    textAnchor="end"
                                                    height={50}
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

                            {/* Pie Chart — Rasio Kondisi Rumah */}
                            <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                                <div className="mb-4 border-b border-slate-100 pb-4">
                                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                        <PieChartIcon size={16} className="text-[#0072BC]" />
                                        Rasio Kondisi Rumah
                                    </h3>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Perbandingan rumah sehat dan tidak sehat pada kecamatan yang ditampilkan.
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
                                                <span className="text-2xl font-bold text-slate-800">{sehatPercentage}%</span>
                                                <span className="text-[10px] font-medium text-slate-500">Rumah Sehat</span>
                                            </div>
                                        </div>
                                        <ul className="space-y-2 text-sm">
                                            {rumahPieData.map((item) => (
                                                <li key={item.name} className="flex items-center gap-2">
                                                    <span
                                                        className="inline-block h-3 w-3 rounded-full shrink-0"
                                                        style={{ backgroundColor: item.color }}
                                                    />
                                                    <span className="text-slate-600 truncate">{item.name}</span>
                                                    <span className="ml-auto font-semibold text-slate-800 tabular-nums">
                                                        {item.value.toLocaleString("id-ID")}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <div className="flex min-h-64 items-center justify-center text-sm text-slate-400">
                                        Belum ada data untuk ditampilkan
                                    </div>
                                )}
                            </section>
                        </div>
                    );
                })()}

                {/* ============================================================
                    TABEL FORMAT RESMI POKJA III — 20 KOLOM
                ============================================================ */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-center border-collapse text-xs min-w-[1400px] border border-slate-300">
                            <thead>
                                {/* Baris 1: Main Header Categories */}
                                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300 uppercase tracking-tight">
                                    <th rowSpan={3} className="p-2 border border-slate-300 w-12 min-w-[48px] max-w-[48px] sticky left-0 bg-slate-100 z-10">
                                        NO
                                    </th>
                                    <th rowSpan={3} className="p-2 border border-slate-300 min-w-[160px] sticky left-12 bg-slate-100 z-10">
                                        KECAMATAN
                                    </th>
                                    <th colSpan={3} className="p-2 border border-slate-300">
                                        JUMLAH KADER
                                    </th>
                                    <th colSpan={9} className="p-2 border border-slate-300 bg-slate-200/70">
                                        P A N G A N
                                    </th>
                                    <th colSpan={3} className="p-2 border border-slate-300">
                                        JUMLAH INDUSTRI RUMAH TANGGA
                                    </th>
                                    <th colSpan={2} className="p-2 border border-slate-300 bg-slate-200/70">
                                        JUMLAH RUMAH
                                    </th>
                                    <th rowSpan={3} className="p-2 border border-slate-300 min-w-[120px]">
                                        KETERANGAN
                                    </th>
                                </tr>

                                {/* Baris 2: Sub-categories */}
                                <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-300 uppercase text-[11px]">
                                    <th rowSpan={2} className="p-2 border border-slate-300 min-w-[65px]">
                                        PANGAN
                                    </th>
                                    <th rowSpan={2} className="p-2 border border-slate-300 min-w-[65px]">
                                        SANDANG
                                    </th>
                                    <th rowSpan={2} className="p-2 border border-slate-300 min-w-[85px]">
                                        TATA LAKSANA RUMAH TANGGA
                                    </th>
                                    <th colSpan={2} className="p-2 border border-slate-300 bg-slate-100/70">
                                        MAKANAN POKOK
                                    </th>
                                    <th colSpan={7} className="p-2 border border-slate-300 bg-slate-100/70">
                                        PEMANFAATAN PEKARANGAN / HATINYA PKK
                                    </th>
                                    <th rowSpan={2} className="p-2 border border-slate-300 min-w-[65px]">
                                        PANGAN
                                    </th>
                                    <th rowSpan={2} className="p-2 border border-slate-300 min-w-[65px]">
                                        SANDANG
                                    </th>
                                    <th rowSpan={2} className="p-2 border border-slate-300 min-w-[65px]">
                                        JASA
                                    </th>
                                    <th rowSpan={2} className="p-2 border border-slate-300 min-w-[75px] bg-slate-100/70">
                                        SEHAT DAN LAYAK HUNI
                                    </th>
                                    <th rowSpan={2} className="p-2 border border-slate-300 min-w-[80px] bg-slate-100/70">
                                        TIDAK SEHAT DAN TIDAK LAYAK HUNI
                                    </th>
                                </tr>

                                {/* Baris 3: Specific Columns */}
                                <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-300 uppercase text-[10px]">
                                    <th className="p-1.5 border border-slate-300 min-w-[60px]">BERAS</th>
                                    <th className="p-1.5 border border-slate-300 min-w-[65px]">NON BERAS</th>
                                    <th className="p-1.5 border border-slate-300 min-w-[75px]">PETERNAKAN</th>
                                    <th className="p-1.5 border border-slate-300 min-w-[70px]">PERIKANAN</th>
                                    <th className="p-1.5 border border-slate-300 min-w-[70px]">WARUNG HIDUP</th>
                                    <th className="p-1.5 border border-slate-300 min-w-[70px]">LUMBUNG HIDUP</th>
                                    <th className="p-1.5 border border-slate-300 min-w-[55px]">T O G A</th>
                                    <th className="p-1.5 border border-slate-300 min-w-[75px]">TANAMAN KERAS</th>
                                    <th className="p-1.5 border border-slate-300 min-w-[75px]">TANAMAN LAINNYA</th>
                                </tr>

                                {/* Baris 4: Nomor Kolom (1 sampai 20) */}
                                <tr className="bg-slate-200/80 text-slate-600 font-semibold border-b border-slate-300 italic text-[11px]">
                                    <th className="py-1 px-2 border border-slate-300 min-w-[48px] max-w-[48px] sticky left-0 bg-slate-200/90 z-10">1</th>
                                    <th className="py-1 px-2 border border-slate-300 sticky left-12 bg-slate-200/90 z-10">2</th>
                                    <th className="py-1 px-2 border border-slate-300">3</th>
                                    <th className="py-1 px-2 border border-slate-300">4</th>
                                    <th className="py-1 px-2 border border-slate-300">5</th>
                                    <th className="py-1 px-2 border border-slate-300">6</th>
                                    <th className="py-1 px-2 border border-slate-300">7</th>
                                    <th className="py-1 px-2 border border-slate-300">8</th>
                                    <th className="py-1 px-2 border border-slate-300">9</th>
                                    <th className="py-1 px-2 border border-slate-300">10</th>
                                    <th className="py-1 px-2 border border-slate-300">11</th>
                                    <th className="py-1 px-2 border border-slate-300">12</th>
                                    <th className="py-1 px-2 border border-slate-300">13</th>
                                    <th className="py-1 px-2 border border-slate-300">14</th>
                                    <th className="py-1 px-2 border border-slate-300">15</th>
                                    <th className="py-1 px-2 border border-slate-300">16</th>
                                    <th className="py-1 px-2 border border-slate-300">17</th>
                                    <th className="py-1 px-2 border border-slate-300">18</th>
                                    <th className="py-1 px-2 border border-slate-300">19</th>
                                    <th className="py-1 px-2 border border-slate-300">20</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-200 text-slate-700 bg-white">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={20} className="py-12 text-center text-slate-400">
                                            Memuat data Pokja III...
                                        </td>
                                    </tr>
                                ) : items.length > 0 ? (
                                    items.map((item, index) => {
                                        const rowNum = (currentPage - 1) * perPageVal + index + 1;
                                        const namaKecamatan = item.nama_kecamatan || item.kecamatan || "-";
                                        const keterangan = item.deskripsi || item.judul_kegiatan || item.keterangan || "-";

                                        return (
                                            <tr
                                                key={item.id || index}
                                                className="hover:bg-blue-50/40 transition-colors group"
                                            >
                                                {/* 1: NO */}
                                                <td className="p-2 border border-slate-200 font-medium min-w-[48px] max-w-[48px] sticky left-0 bg-white group-hover:bg-blue-50/40 z-10">
                                                    {rowNum}
                                                </td>
                                                {/* 2: KECAMATAN */}
                                                <td className="p-2 border border-slate-200 font-semibold text-left sticky left-12 bg-white group-hover:bg-blue-50/40 z-10">
                                                    {namaKecamatan}
                                                </td>

                                                {/* JUMLAH KADER: 3, 4, 5 */}
                                                <td className="p-2 border border-slate-200 tabular-nums">
                                                    {item.jumlah_kader ?? 0}
                                                </td>
                                                <td className="p-2 border border-slate-200 tabular-nums">
                                                    {item.jumlah_kader_p ?? 0}
                                                </td>
                                                <td className="p-2 border border-slate-200 tabular-nums">
                                                    {item.kader_tata_laksana ?? 0}
                                                </td>

                                                {/* MAKANAN POKOK: 6, 7 */}
                                                <td className="p-2 border border-slate-200 tabular-nums">
                                                    {item.makanan_pokok ?? 0}
                                                </td>
                                                <td className="p-2 border border-slate-200 tabular-nums">
                                                    {item.makanan_non_beras ?? 0}
                                                </td>

                                                {/* HATINYA PKK: 8, 9, 10, 11, 12, 13, 14 */}
                                                <td className="p-2 border border-slate-200 tabular-nums">
                                                    {item.peternakan ?? 0}
                                                </td>
                                                <td className="p-2 border border-slate-200 tabular-nums">
                                                    {item.perikanan ?? 0}
                                                </td>
                                                <td className="p-2 border border-slate-200 tabular-nums">
                                                    {item.warung_hidup ?? 0}
                                                </td>
                                                <td className="p-2 border border-slate-200 tabular-nums">
                                                    {item.lumbung_hidup ?? 0}
                                                </td>
                                                <td className="p-2 border border-slate-200 tabular-nums">
                                                    {item.toga ?? (item.hatinya_pkk ?? 0)}
                                                </td>
                                                <td className="p-2 border border-slate-200 tabular-nums">
                                                    {item.tanaman_keras ?? 0}
                                                </td>
                                                <td className="p-2 border border-slate-200 tabular-nums">
                                                    {item.tanaman_lainnya ?? (item.pemanfaatan_pekarangan ?? 0)}
                                                </td>

                                                {/* INDUSTRI RUMAH TANGGA: 15, 16, 17 */}
                                                <td className="p-2 border border-slate-200 tabular-nums">
                                                    {item.industri_pangan ?? (item.industri_rumah_tangga ?? 0)}
                                                </td>
                                                <td className="p-2 border border-slate-200 tabular-nums">
                                                    {item.industri_sandang ?? 0}
                                                </td>
                                                <td className="p-2 border border-slate-200 tabular-nums">
                                                    {item.industri_jasa ?? 0}
                                                </td>

                                                {/* JUMLAH RUMAH: 18, 19 */}
                                                <td className="p-2 border border-slate-200 tabular-nums font-medium text-emerald-700 bg-emerald-50/30">
                                                    {item.rumah_sehat ?? 0}
                                                </td>
                                                <td className="p-2 border border-slate-200 tabular-nums font-medium text-rose-700 bg-rose-50/30">
                                                    {item.rumah_tidak_sehat ?? 0}
                                                </td>

                                                {/* 20: KETERANGAN */}
                                                <td className="p-2 border border-slate-200 text-left max-w-[200px] truncate" title={keterangan}>
                                                    {keterangan}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={20} className="py-12 text-center text-slate-400">
                                            Belum ada data kegiatan Pokja III.
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                            {/* FOOTER TOTAL */}
                            {items.length > 0 && (
                                <tfoot className="bg-slate-100 font-bold text-slate-800 border-t-2 border-slate-300 text-xs">
                                    <tr>
                                        <td colSpan={2} className="p-2.5 border border-slate-300 text-center sticky left-0 bg-slate-100 z-10 uppercase tracking-wider">
                                            JUMLAH
                                        </td>
                                        {/* 3, 4, 5 */}
                                        <td className="p-2 border border-slate-300 tabular-nums">{totalKaderPangan}</td>
                                        <td className="p-2 border border-slate-300 tabular-nums">{totalKaderSandang}</td>
                                        <td className="p-2 border border-slate-300 tabular-nums">{totalKaderTataLaksana}</td>

                                        {/* 6, 7 */}
                                        <td className="p-2 border border-slate-300 tabular-nums">{totalMakananBeras}</td>
                                        <td className="p-2 border border-slate-300 tabular-nums">{totalMakananNonBeras}</td>

                                        {/* 8 to 14 */}
                                        <td className="p-2 border border-slate-300 tabular-nums">{totalPeternakan}</td>
                                        <td className="p-2 border border-slate-300 tabular-nums">{totalPerikanan}</td>
                                        <td className="p-2 border border-slate-300 tabular-nums">{totalWarungHidup}</td>
                                        <td className="p-2 border border-slate-300 tabular-nums">{totalLumbungHidup}</td>
                                        <td className="p-2 border border-slate-300 tabular-nums">{totalToga}</td>
                                        <td className="p-2 border border-slate-300 tabular-nums">{totalTanamanKeras}</td>
                                        <td className="p-2 border border-slate-300 tabular-nums">{totalTanamanLainnya}</td>

                                        {/* 15, 16, 17 */}
                                        <td className="p-2 border border-slate-300 tabular-nums">{totalIndustriPangan}</td>
                                        <td className="p-2 border border-slate-300 tabular-nums">{totalIndustriSandang}</td>
                                        <td className="p-2 border border-slate-300 tabular-nums">{totalIndustriJasa}</td>

                                        {/* 18, 19 */}
                                        <td className="p-2 border border-slate-300 tabular-nums text-emerald-700 bg-emerald-100/40">{totalRumahSehat}</td>
                                        <td className="p-2 border border-slate-300 tabular-nums text-rose-700 bg-rose-100/40">{totalRumahTidakSehat}</td>

                                        {/* 20 */}
                                        <td className="p-2 border border-slate-300">-</td>
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
