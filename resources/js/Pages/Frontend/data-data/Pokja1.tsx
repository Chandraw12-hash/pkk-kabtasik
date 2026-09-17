import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Head, Link } from "@inertiajs/react";
import {
    Search,
    Users,
    BookOpen,
    HeartHandshake,
    ShieldCheck,
    ChevronLeft,
    ChevronRight,
    BarChart3,
    PieChart,
    Download,
    RefreshCw,
} from "lucide-react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import axios from "axios";

interface Pokja1Item {
    id: number;
    kecamatan?: string;
    nama_kecamatan?: string;
    pkbn_l?: number;
    pkbn_p?: number;
    pkdrt_l?: number;
    pkdrt_p?: number;
    pola_asuh_l?: number;
    pola_asuh_p?: number;
    lansia_l?: number;
    lansia_p?: number;
    kader_pokja1_l?: number;
    kader_pokja1_p?: number;
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
        per_page?: number | string;
    };
}

const MetricCard = ({ title, value, icon: Icon }: any) => (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {title}
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                    {value.toLocaleString("id-ID")}
                </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                <Icon size={20} className="text-slate-600" />
            </div>
        </div>
    </div>
);

/**
 * Grafik batang berbasis SVG.
 * Diperbaiki dari versi lama yang memakai `height: %` pada div — pendekatan itu
 * gampang collapse ke 0px kalau parent tidak punya tinggi pasti, dan label
 * sumbu Y-nya (0% di atas turun ke 100% di bawah) justru berlawanan arah
 * dengan batang yang tumbuh dari bawah (items-end), jadi terlihat kosong.
 * SVG dengan viewBox akan selalu terskala benar, dan label nilai selalu
 * tampil (tidak perlu hover) supaya lebih mudah dibaca / lebih "profesional".
 */
const GenderBarChart = ({
    data,
    maxValue,
}: {
    data: { label: string; l: number; p: number }[];
    maxValue: number;
}) => {
    const width = 560;
    const height = 240;
    const paddingLeft = 34;
    const paddingBottom = 26;
    const paddingTop = 16;
    const chartHeight = height - paddingBottom - paddingTop;
    const groupWidth = (width - paddingLeft) / data.length;
    const barWidth = Math.min(30, groupWidth / 3.2);
    const gap = 6;

    const yTicks = [0, 0.25, 0.5, 0.75, 1];
    const safeMax = maxValue > 0 ? maxValue : 1;

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-56"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Grafik distribusi jenis kelamin per kategori"
        >
            {/* Grid + label sumbu Y (0 di bawah, naik ke atas — arah yang benar) */}
            {yTicks.map((t) => {
                const y = paddingTop + chartHeight - t * chartHeight;
                return (
                    <g key={t}>
                        <line
                            x1={paddingLeft}
                            x2={width}
                            y1={y}
                            y2={y}
                            stroke="#f1f5f9"
                            strokeWidth={1}
                        />
                        <text
                            x={paddingLeft - 8}
                            y={y + 3}
                            textAnchor="end"
                            fontSize="9"
                            fill="#94a3b8"
                        >
                            {Math.round(t * safeMax)}
                        </text>
                    </g>
                );
            })}

            {/* Sumbu X */}
            <line
                x1={paddingLeft}
                x2={width}
                y1={paddingTop + chartHeight}
                y2={paddingTop + chartHeight}
                stroke="#e2e8f0"
                strokeWidth={1}
            />

            {/* Batang */}
            {data.map((item, idx) => {
                const groupX =
                    paddingLeft +
                    idx * groupWidth +
                    (groupWidth - (barWidth * 2 + gap)) / 2;
                const hL = (item.l / safeMax) * chartHeight;
                const hP = (item.p / safeMax) * chartHeight;
                const yBase = paddingTop + chartHeight;

                return (
                    <g key={item.label}>
                        {/* Batang L */}
                        <rect
                            x={groupX}
                            y={yBase - Math.max(hL, item.l > 0 ? 2 : 0)}
                            width={barWidth}
                            height={Math.max(hL, item.l > 0 ? 2 : 0)}
                            fill="#38bdf8"
                            rx={3}
                        />
                        {item.l > 0 && (
                            <text
                                x={groupX + barWidth / 2}
                                y={yBase - Math.max(hL, 2) - 4}
                                textAnchor="middle"
                                fontSize="9"
                                fontWeight={600}
                                fill="#0369a1"
                            >
                                {item.l}
                            </text>
                        )}

                        {/* Batang P */}
                        <rect
                            x={groupX + barWidth + gap}
                            y={yBase - Math.max(hP, item.p > 0 ? 2 : 0)}
                            width={barWidth}
                            height={Math.max(hP, item.p > 0 ? 2 : 0)}
                            fill="#fb7185"
                            rx={3}
                        />
                        {item.p > 0 && (
                            <text
                                x={groupX + barWidth + gap + barWidth / 2}
                                y={yBase - Math.max(hP, 2) - 4}
                                textAnchor="middle"
                                fontSize="9"
                                fontWeight={600}
                                fill="#be123c"
                            >
                                {item.p}
                            </text>
                        )}

                        {/* Label kategori */}
                        <text
                            x={groupX + barWidth + gap / 2}
                            y={height - 6}
                            textAnchor="middle"
                            fontSize="10"
                            fontWeight={500}
                            fill="#64748b"
                        >
                            {item.label}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
};

export default function Pokja1({ data, filters = {} }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [perPage, setPerPage] = useState(Number(filters.per_page) || 10);
    const [localData, setLocalData] = useState(data);
    const [isLoading, setIsLoading] = useState(false);
    const firstRender = useRef(true);

    const items = localData?.data || [];

    const fetchData = useCallback((params: Record<string, any> = {}) => {
        setIsLoading(true);
        axios
            .get("/api/pokja-1", {
                params: {
                    search: search || undefined,
                    per_page: perPage,
                    ...params,
                },
                headers: { Accept: "application/json" },
            })
            .then((res) => {
                if (res.data?.data) {
                    setLocalData(res.data);
                }
            })
            .catch((err) => console.error("Error fetching data:", err))
            .finally(() => setIsLoading(false));
    }, [search, perPage]);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        const timeout = setTimeout(() => fetchData(), 400);
        return () => clearTimeout(timeout);
    }, [search, perPage, fetchData]);

    const handlePageChange = useCallback((url: string) => {
        if (!url) return;
        const params = new URL(url).searchParams;
        const page = params.get("page");
        fetchData({ page });
    }, [fetchData]);

    const stats = useMemo(() => {
        const totalPkbn = items.reduce(
            (acc, curr) => acc + (Number(curr.pkbn_l) || 0) + (Number(curr.pkbn_p) || 0),
            0
        );
        const totalPkdrt = items.reduce(
            (acc, curr) => acc + (Number(curr.pkdrt_l) || 0) + (Number(curr.pkdrt_p) || 0),
            0
        );
        const totalPolaAsuh = items.reduce(
            (acc, curr) => acc + (Number(curr.pola_asuh_l) || 0) + (Number(curr.pola_asuh_p) || 0),
            0
        );
        const totalKader = items.reduce(
            (acc, curr) => acc + (Number(curr.kader_pokja1_l) || 0) + (Number(curr.kader_pokja1_p) || 0),
            0
        );

        const sumPkbnL = items.reduce((acc, curr) => acc + (Number(curr.pkbn_l) || 0), 0);
        const sumPkbnP = items.reduce((acc, curr) => acc + (Number(curr.pkbn_p) || 0), 0);
        const sumPkdrtL = items.reduce((acc, curr) => acc + (Number(curr.pkdrt_l) || 0), 0);
        const sumPkdrtP = items.reduce((acc, curr) => acc + (Number(curr.pkdrt_p) || 0), 0);
        const sumPolaL = items.reduce((acc, curr) => acc + (Number(curr.pola_asuh_l) || 0), 0);
        const sumPolaP = items.reduce((acc, curr) => acc + (Number(curr.pola_asuh_p) || 0), 0);
        const sumLansiaL = items.reduce((acc, curr) => acc + (Number(curr.lansia_l) || 0), 0);
        const sumLansiaP = items.reduce((acc, curr) => acc + (Number(curr.lansia_p) || 0), 0);
        const sumKaderL = items.reduce((acc, curr) => acc + (Number(curr.kader_pokja1_l) || 0), 0);
        const sumKaderP = items.reduce((acc, curr) => acc + (Number(curr.kader_pokja1_p) || 0), 0);

        const totalL = sumPkbnL + sumPkdrtL + sumPolaL + sumLansiaL + sumKaderL;
        const totalP = sumPkbnP + sumPkdrtP + sumPolaP + sumLansiaP + sumKaderP;
        const grandTotal = totalL + totalP;
        const percentP = grandTotal > 0 ? (totalP / grandTotal) * 100 : 0;

        const maxBarVal = Math.max(
            sumPkbnL, sumPkbnP,
            sumPkdrtL, sumPkdrtP,
            sumPolaL, sumPolaP,
            sumLansiaL, sumLansiaP,
            sumKaderL, sumKaderP
        );

        return {
            totalPkbn,
            totalPkdrt,
            totalPolaAsuh,
            totalKader,
            sumPkbnL,
            sumPkbnP,
            sumPkdrtL,
            sumPkdrtP,
            sumPolaL,
            sumPolaP,
            sumLansiaL,
            sumLansiaP,
            sumKaderL,
            sumKaderP,
            totalL,
            totalP,
            grandTotal,
            percentP,
            maxBarVal,
        };
    }, [items]);

    const {
        totalPkbn,
        totalPkdrt,
        totalPolaAsuh,
        totalKader,
        sumPkbnL,
        sumPkbnP,
        sumPkdrtL,
        sumPkdrtP,
        sumPolaL,
        sumPolaP,
        sumLansiaL,
        sumLansiaP,
        sumKaderL,
        sumKaderP,
        totalL,
        totalP,
        grandTotal,
        percentP,
        maxBarVal,
    } = stats;

    const chartData = useMemo(
        () => [
            { label: "PKBN", l: sumPkbnL, p: sumPkbnP },
            { label: "PKDRT", l: sumPkdrtL, p: sumPkdrtP },
            { label: "Pola Asuh", l: sumPolaL, p: sumPolaP },
            { label: "Lansia", l: sumLansiaL, p: sumLansiaP },
            { label: "Kader", l: sumKaderL, p: sumKaderP },
        ],
        [sumPkbnL, sumPkbnP, sumPkdrtL, sumPkdrtP, sumPolaL, sumPolaP, sumLansiaL, sumLansiaP, sumKaderL, sumKaderP]
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pt-14">
            <Head title="Data Pokja I - TP PKK Kab. Tasikmalaya" />
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* ─── HEADER ─── */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-[#0072BC] text-xs font-semibold tracking-wider uppercase">
                            Pokja I
                        </p>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">
                            Rekapitulasi Data Pokja I
                        </h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Penghayatan &amp; Pengamalan Pancasila serta Gotong Royong
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => fetchData()}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
                            Segarkan
                        </button>
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#0072BC] hover:bg-[#0072BC] rounded-lg transition-colors"
                        >
                            <Download size={15} />
                            Ekspor
                        </button>
                    </div>
                </div>

                {/* ─── FILTER ─── */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search
                                size={15}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari kecamatan..."
                                className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0072BC] focus:border-transparent bg-white"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-slate-600 font-medium">Tampilkan</label>
                            <select
                                value={perPage}
                                onChange={(e) => setPerPage(Number(e.target.value))}
                                className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0072BC] focus:border-transparent"
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
                            className="text-sm text-[#0072BC] hover:text-[#0072BC] font-medium"
                        >
                            Reset filter
                        </button>
                    )}
                </div>

                {/* ─── LOADING ─── */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-10 h-10 border-4 border-slate-200 border-t-[#0072BC] rounded-full animate-spin"></div>
                        <p className="text-sm text-slate-500 mt-3">Memuat data...</p>
                    </div>
                )}

                {/* ─── METRIC CARDS ─── */}
                {!isLoading && items.length > 0 && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <MetricCard title="Total PKBN" value={totalPkbn} icon={BookOpen} />
                        <MetricCard title="Total PKDRT" value={totalPkdrt} icon={ShieldCheck} />
                        <MetricCard title="Pola Asuh Anak" value={totalPolaAsuh} icon={HeartHandshake} />
                        <MetricCard title="Total Kader Pokja I" value={totalKader} icon={Users} />
                    </div>
                )}

                {/* ─── GRAFIK ─── */}
                {!isLoading && items.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Bar Chart (SVG) */}
                        <div className="bg-white rounded-xl border border-slate-200 p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-slate-800">
                                    Distribusi Jenis Kelamin
                                </h3>
                                <div className="flex items-center gap-3 text-xs">
                                    <span className="flex items-center gap-1">
                                        <span className="w-3 h-3 rounded-sm bg-sky-400"></span>
                                        <span className="text-slate-500">L</span>
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="w-3 h-3 rounded-sm bg-rose-400"></span>
                                        <span className="text-slate-500">P</span>
                                    </span>
                                </div>
                            </div>

                            {grandTotal === 0 ? (
                                <div className="h-56 flex flex-col items-center justify-center text-slate-400">
                                    <BarChart3 size={32} className="mb-2 text-slate-300" />
                                    <p className="text-sm">Belum ada data untuk ditampilkan</p>
                                </div>
                            ) : (
                                <GenderBarChart data={chartData} maxValue={maxBarVal} />
                            )}
                        </div>

                        {/* Pie Chart */}
                        <div className="bg-white rounded-xl border border-slate-200 p-5">
                            <h3 className="text-sm font-semibold text-slate-800 mb-4">
                                Komposisi Gender
                            </h3>
                            {grandTotal === 0 ? (
                                <div className="h-56 flex flex-col items-center justify-center text-slate-400">
                                    <PieChart size={32} className="mb-2 text-slate-300" />
                                    <p className="text-sm">Belum ada data untuk ditampilkan</p>
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
                                    <div
                                        className="w-36 h-36 rounded-full relative"
                                        style={{
                                            background: `conic-gradient(#38bdf8 0% ${100 - percentP}%, #fb7185 ${100 - percentP}% 100%)`,
                                        }}
                                    >
                                        <div className="absolute inset-3 bg-white rounded-full flex flex-col items-center justify-center">
                                            <span className="text-[9px] text-slate-400 font-medium">Total</span>
                                            <span className="text-base font-bold text-slate-800">
                                                {grandTotal.toLocaleString("id-ID")}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-3">
                                            <span className="w-3 h-3 rounded-sm bg-sky-400"></span>
                                            <span className="text-slate-600">Laki-laki</span>
                                            <span className="font-semibold text-slate-800 ml-auto">
                                                {totalL.toLocaleString("id-ID")}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="w-3 h-3 rounded-sm bg-rose-400"></span>
                                            <span className="text-slate-600">Perempuan</span>
                                            <span className="font-semibold text-slate-800 ml-auto">
                                                {totalP.toLocaleString("id-ID")}
                                            </span>
                                        </div>
                                        <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
                                            <span className="text-xs text-slate-400">Persentase P</span>
                                            <span className="font-semibold text-[#0072BC]">
                                                {percentP.toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ─── TABEL ─── */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    {!isLoading && items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                            <Users size={48} className="mb-4 text-slate-300" />
                            <p className="text-lg font-medium text-slate-600">Belum ada data</p>
                            <p className="text-sm">Data kecamatan untuk Pokja I belum tersedia</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                                            <th className="p-3 border-r border-slate-200 text-center font-semibold text-xs uppercase tracking-wider" rowSpan={2}>
                                                Kecamatan
                                            </th>
                                            <th className="p-2 border-r border-slate-200 text-center font-semibold text-xs uppercase tracking-wider" colSpan={2}>
                                                PKBN
                                            </th>
                                            <th className="p-2 border-r border-slate-200 text-center font-semibold text-xs uppercase tracking-wider" colSpan={2}>
                                                PKDRT
                                            </th>
                                            <th className="p-2 border-r border-slate-200 text-center font-semibold text-xs uppercase tracking-wider" colSpan={2}>
                                                Pola Asuh
                                            </th>
                                            <th className="p-2 border-r border-slate-200 text-center font-semibold text-xs uppercase tracking-wider" colSpan={2}>
                                                Lansia
                                            </th>
                                            <th className="p-2 text-center font-semibold text-xs uppercase tracking-wider" colSpan={2}>
                                                Kader
                                            </th>
                                        </tr>
                                        <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-200 text-xs">
                                            <th className="p-2 border-r border-slate-200 text-center font-medium">L</th>
                                            <th className="p-2 border-r border-slate-200 text-center font-medium">P</th>
                                            <th className="p-2 border-r border-slate-200 text-center font-medium">L</th>
                                            <th className="p-2 border-r border-slate-200 text-center font-medium">P</th>
                                            <th className="p-2 border-r border-slate-200 text-center font-medium">L</th>
                                            <th className="p-2 border-r border-slate-200 text-center font-medium">P</th>
                                            <th className="p-2 border-r border-slate-200 text-center font-medium">L</th>
                                            <th className="p-2 border-r border-slate-200 text-center font-medium">P</th>
                                            <th className="p-2 border-r border-slate-200 text-center font-medium">L</th>
                                            <th className="p-2 text-center font-medium">P</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-slate-700">
                                        {items.map((item, idx) => (
                                            <tr key={item.id || idx} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="p-3 border-r border-slate-100 font-semibold text-slate-800">
                                                    {item.nama_kecamatan || item.kecamatan || "-"}
                                                </td>
                                                <td className="p-3 border-r border-slate-100 text-center">{item.pkbn_l || 0}</td>
                                                <td className="p-3 border-r border-slate-100 text-center">{item.pkbn_p || 0}</td>
                                                <td className="p-3 border-r border-slate-100 text-center">{item.pkdrt_l || 0}</td>
                                                <td className="p-3 border-r border-slate-100 text-center">{item.pkdrt_p || 0}</td>
                                                <td className="p-3 border-r border-slate-100 text-center">{item.pola_asuh_l || 0}</td>
                                                <td className="p-3 border-r border-slate-100 text-center">{item.pola_asuh_p || 0}</td>
                                                <td className="p-3 border-r border-slate-100 text-center">{item.lansia_l || 0}</td>
                                                <td className="p-3 border-r border-slate-100 text-center">{item.lansia_p || 0}</td>
                                                <td className="p-3 border-r border-slate-100 text-center">{item.kader_pokja1_l || 0}</td>
                                                <td className="p-3 text-center">{item.kader_pokja1_p || 0}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {localData?.last_page > 1 && (
                                <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
                                    <span className="text-slate-500">
                                        Menampilkan <strong className="text-slate-700">{items.length}</strong> dari{' '}
                                        <strong className="text-slate-700">{localData.total || 0}</strong> data
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => handlePageChange(`?page=${localData.current_page - 1}`)}
                                            disabled={localData.current_page <= 1}
                                            className={`p-2 border border-slate-200 rounded-lg bg-white transition-colors ${
                                                localData.current_page <= 1
                                                    ? "opacity-40 cursor-not-allowed"
                                                    : "hover:bg-slate-50"
                                            }`}
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                        <span className="px-4 py-2 border border-[#0072BC] rounded-lg bg-[#0072BC] text-white font-semibold text-sm min-w-[40px] text-center">
                                            {localData.current_page || 1}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handlePageChange(`?page=${localData.current_page + 1}`)}
                                            disabled={localData.current_page >= localData.last_page}
                                            className={`p-2 border border-slate-200 rounded-lg bg-white transition-colors ${
                                                localData.current_page >= localData.last_page
                                                    ? "opacity-40 cursor-not-allowed"
                                                    : "hover:bg-slate-50"
                                            }`}
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="text-center text-xs text-slate-400 pt-4 border-t border-slate-200">
                    Data diperbarui secara berkala • {new Date().toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })}
                </div>
            </main>

            <Footer />
        </div>
    );
}
