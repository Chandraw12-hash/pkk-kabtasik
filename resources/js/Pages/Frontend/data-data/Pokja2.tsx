import React, { useState, useEffect, useRef } from "react";
import { Head, Link, router } from "@inertiajs/react";
import {
    Search,
    Filter,
    ArrowLeft,
    GraduationCap,
    BookOpenCheck,
    Store,
    Users,
    ChevronLeft,
    ChevronRight,
    BarChart3,
} from "lucide-react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import axios from "axios";

interface Pokja2Item {
    id: number;
    kecamatan?: string;
    nama_kecamatan?: string;
    warga_buta_l?: number;
    warga_buta_p?: number;
    kelompok_belajar_paket_a?: number;
    kelompok_belajar_paket_b?: number;
    kelompok_belajar_paket_c?: number;
    kf?: number;
    paud?: number;
    koperasi_berbadan_hukum?: number;
    [key: string]: any;
}

interface Props {
    data: {
        data: Pokja2Item[];
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

// ============================================================
// GRAFIK BATANG (SVG) — satu nilai per kategori
// ------------------------------------------------------------
// Diganti ke SVG (dari versi lama yang pakai `height: %` di dalam
// div) supaya skala selalu presisi dan tidak bergantung pada tinggi
// parent secara bertingkat. Label nilai sekarang selalu tampil di
// atas tiap batang (tidak perlu hover) dan ada sumbu Y dengan angka
// asli, bukan sekadar batang tanpa acuan.
// ============================================================
const SingleSeriesBarChart = ({
    data,
    maxValue,
}: {
    data: { label: string; val: number }[];
    maxValue: number;
}) => {
    const width = 560;
    const height = 240;
    const paddingLeft = 38;
    const paddingBottom = 26;
    const paddingTop = 16;
    const chartHeight = height - paddingBottom - paddingTop;
    const groupWidth = (width - paddingLeft) / data.length;
    const barWidth = Math.min(48, groupWidth * 0.55);

    const yTicks = [0, 0.25, 0.5, 0.75, 1];
    const safeMax = maxValue > 0 ? maxValue : 1;

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-64"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Grafik distribusi data Pokja II"
        >
            {/* Grid + label sumbu Y */}
            {yTicks.map((t) => {
                const y = paddingTop + chartHeight - t * chartHeight;
                return (
                    <g key={t}>
                        <line x1={paddingLeft} x2={width} y1={y} y2={y} stroke="#f1f5f9" strokeWidth={1} />
                        <text x={paddingLeft - 8} y={y + 3} textAnchor="end" fontSize="9" fill="#94a3b8">
                            {Math.round(t * safeMax).toLocaleString("id-ID")}
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
                const groupX = paddingLeft + idx * groupWidth + (groupWidth - barWidth) / 2;
                const h = (item.val / safeMax) * chartHeight;
                const yBase = paddingTop + chartHeight;
                const barHeight = Math.max(h, item.val > 0 ? 2 : 0);

                return (
                    <g key={item.label}>
                        <rect
                            x={groupX}
                            y={yBase - barHeight}
                            width={barWidth}
                            height={barHeight}
                            fill="#14b8a6"
                            rx={4}
                        />
                        {item.val > 0 && (
                            <text
                                x={groupX + barWidth / 2}
                                y={yBase - barHeight - 5}
                                textAnchor="middle"
                                fontSize="10"
                                fontWeight={600}
                                fill="#0f766e"
                            >
                                {item.val.toLocaleString("id-ID")}
                            </text>
                        )}
                        <text
                            x={groupX + barWidth / 2}
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

export default function Pokja2({ data, filters = {} }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [perPage, setPerPage] = useState(Number(filters.per_page) || 10);
    const [localData, setLocalData] = useState(data);
    const [isLoading, setIsLoading] = useState(false);
    const firstRender = useRef(true);

    const items = localData?.data || [];

    const fetchData = (params: Record<string, any> = {}) => {
        setIsLoading(true);
        axios
            .get("/api/pokja-2", {
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
    };

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        const timeout = setTimeout(() => {
            fetchData();
        }, 300);
        return () => clearTimeout(timeout);
    }, [search, perPage]);

    const handlePageChange = (url: string) => {
        if (!url) return;
        const params = new URL(url).searchParams;
        const page = params.get("page");
        fetchData({ page });
    };

    // ==================== KALKULASI REAL-TIME ====================
    const totalPaud = items.reduce((acc, curr) => acc + (Number(curr.paud) || 0), 0);
    const totalPaketA = items.reduce((acc, curr) => acc + (Number(curr.kelompok_belajar_paket_a) || 0), 0);
    const totalPaketB = items.reduce((acc, curr) => acc + (Number(curr.kelompok_belajar_paket_b) || 0), 0);
    const totalPaketC = items.reduce((acc, curr) => acc + (Number(curr.kelompok_belajar_paket_c) || 0), 0);
    const totalPaket = totalPaketA + totalPaketB + totalPaketC;
    const totalKoperasi = items.reduce((acc, curr) => acc + (Number(curr.koperasi_berbadan_hukum) || 0), 0);
    const totalKF = items.reduce((acc, curr) => acc + (Number(curr.kf) || 0), 0);

    const sumButaL = items.reduce((acc, curr) => acc + (Number(curr.warga_buta_l) || 0), 0);
    const sumButaP = items.reduce((acc, curr) => acc + (Number(curr.warga_buta_p) || 0), 0);
    const totalWargaButa = sumButaL + sumButaP;

    const totalGender = totalWargaButa || 1;
    const percentP = (sumButaP / totalGender) * 100;

    const chartData = [
        { label: "PAUD", val: totalPaud },
        { label: "Paket Belajar", val: totalPaket },
        { label: "Koperasi", val: totalKoperasi },
        { label: "KF", val: totalKF },
        { label: "Buta Aksara", val: totalWargaButa },
    ];
    const maxBarVal = Math.max(totalPaud, totalPaket, totalKoperasi, totalKF, totalWargaButa);
    const hasChartData = maxBarVal > 0;

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 pt-14">
            <Head>
                <title>Data Pokja II - TP PKK Kab. Tasikmalaya</title>
                <meta
                    name="description"
                    content="Data rekapitulasi Pokja II PKK Kabupaten Tasikmalaya - Pendidikan, Keterampilan, dan Pengembangan Kehidupan Berkoperasi."
                />
                <meta name="robots" content="index, follow" />
                <meta property="og:title" content="Data Pokja II - TP PKK Kab. Tasikmalaya" />
                <meta
                    property="og:description"
                    content="Data rekapitulasi Pokja II PKK Kabupaten Tasikmalaya - Pendidikan, Keterampilan, dan Pengembangan Kehidupan Berkoperasi."
                />
                <meta property="og:type" content="website" />
                <meta property="og:locale" content="id_ID" />
            </Head>

            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full">
                {/* ===== BREADCRUMB ===== */}
                <nav className="flex items-center gap-2 text-sm text-slate-500">
                    <Link href="/" className="hover:text-[#0072BC] transition-colors">
                        Beranda
                    </Link>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-900 font-medium">Pokja II</span>
                </nav>

                {/* ===== JUDUL ===== */}
                <div>
                    <p className="text-[#0072BC] text-xs font-semibold tracking-wide uppercase mb-1">
                        Pokja II
                    </p>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Rekapitulasi Data Pokja II Tingkat Kecamatan
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        Pendidikan, Keterampilan, dan Pengembangan Kehidupan Berkoperasi.
                    </p>
                </div>

                {/* ===== FILTER ===== */}
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

                {/* ===== LOADING ===== */}
                {isLoading && (
                    <div className="text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0072BC]"></div>
                        <p className="text-sm text-slate-500 mt-2">Memuat data...</p>
                    </div>
                )}

                {/* ===== METRIC CARDS ===== */}
                {!isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                    Total PAUD / Sejenis
                                </p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">
                                    {totalPaud.toLocaleString("id-ID")}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                <GraduationCap size={18} className="text-blue-600" />
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                    Kelompok Belajar
                                </p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">
                                    {totalPaket.toLocaleString("id-ID")}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                                <BookOpenCheck size={18} className="text-amber-600" />
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                    Koperasi Berbadan Hukum
                                </p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">
                                    {totalKoperasi.toLocaleString("id-ID")}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-[#0072BC]/10 flex items-center justify-center">
                                <Store size={18} className="text-[#0072BC]" />
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                    Warga Buta Aksara
                                </p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">
                                    {totalWargaButa.toLocaleString("id-ID")}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center">
                                <Users size={18} className="text-rose-600" />
                            </div>
                        </div>
                    </div>
                )}

                {/* ===== GRAFIK ===== */}
                {!isLoading && items.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Grafik Batang */}
                        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-base font-bold text-slate-900">
                                    Distribusi Data Pokja II
                                </h3>
                            </div>

                            {!hasChartData ? (
                                <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                                    <BarChart3 size={32} className="mb-2 text-slate-300" />
                                    <p className="text-sm">Belum ada data untuk ditampilkan</p>
                                </div>
                            ) : (
                                <SingleSeriesBarChart data={chartData} maxValue={maxBarVal} />
                            )}
                        </div>

                        {/* Pie Chart Gender Warga Buta Aksara */}
                        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
                            <h3 className="text-base font-bold text-slate-900 mb-2">
                                Komposisi Warga Buta Aksara (L / P)
                            </h3>
                            {totalWargaButa === 0 ? (
                                <div className="h-40 flex flex-col items-center justify-center text-slate-400">
                                    <Users size={32} className="mb-2 text-slate-300" />
                                    <p className="text-sm">Belum ada data untuk ditampilkan</p>
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-auto py-4">
                                    <div
                                        className="w-40 h-40 rounded-full relative shadow-inner"
                                        style={{
                                            background: `conic-gradient(#38bdf8 0% ${100 - percentP}%, #fb7185 ${100 - percentP}% 100%)`,
                                        }}
                                    >
                                        <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                                            <span className="text-xs text-slate-400 font-medium">Total</span>
                                            <span className="text-sm font-bold text-slate-800">
                                                {totalWargaButa.toLocaleString("id-ID")}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="w-4 h-4 bg-sky-400 rounded-md"></span>
                                            <span className="text-slate-600 font-medium">Laki-laki (L):</span>
                                            <span className="font-bold text-slate-900">
                                                {sumButaL.toLocaleString("id-ID")}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-4 h-4 bg-rose-400 rounded-md"></span>
                                            <span className="text-slate-600 font-medium">Perempuan (P):</span>
                                            <span className="font-bold text-slate-900">
                                                {sumButaP.toLocaleString("id-ID")}
                                            </span>
                                        </div>
                                        <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                                            <span className="text-xs text-slate-400">Persentase P</span>
                                            <span className="font-bold text-[#0072BC]">
                                                {percentP.toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ===== TABEL ===== */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span>Tampilkan data wilayah</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                                    <th
                                        className="p-3 border-r border-slate-200 text-center font-semibold"
                                        rowSpan={2}
                                    >
                                        Nama Kecamatan
                                    </th>
                                    <th
                                        className="p-2 border-r border-slate-200 text-center font-semibold"
                                        colSpan={2}
                                    >
                                        Warga Buta Aksara
                                    </th>
                                    <th
                                        className="p-2 border-r border-slate-200 text-center font-semibold"
                                        colSpan={3}
                                    >
                                        Kelompok Belajar
                                    </th>
                                    <th
                                        className="p-2 border-r border-slate-200 text-center font-semibold"
                                        rowSpan={2}
                                    >
                                        KF
                                    </th>
                                    <th
                                        className="p-2 border-r border-slate-200 text-center font-semibold"
                                        rowSpan={2}
                                    >
                                        PAUD
                                    </th>
                                    <th
                                        className="p-2 text-center font-semibold"
                                        rowSpan={2}
                                    >
                                        Koperasi
                                    </th>
                                </tr>
                                <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-200 font-medium">
                                    <th className="p-2 border-r border-slate-200 text-center">L</th>
                                    <th className="p-2 border-r border-slate-200 text-center">P</th>
                                    <th className="p-2 border-r border-slate-200 text-center">Paket A</th>
                                    <th className="p-2 border-r border-slate-200 text-center">Paket B</th>
                                    <th className="p-2 border-r border-slate-200 text-center">Paket C</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {items.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="text-center py-12 text-slate-400"
                                        >
                                            {isLoading ? "Memuat data..." : "Belum ada data kecamatan untuk Pokja II."}
                                        </td>
                                    </tr>
                                ) : (
                                    items.map((item, idx) => (
                                        <tr
                                            key={item.id || idx}
                                            className="hover:bg-slate-50 transition-colors"
                                        >
                                            <td className="p-3 border-r border-slate-100 font-semibold text-slate-900">
                                                {item.nama_kecamatan || item.kecamatan || "-"}
                                            </td>
                                            <td className="p-3 border-r border-slate-100 text-center">
                                                {item.warga_buta_l || 0}
                                            </td>
                                            <td className="p-3 border-r border-slate-100 text-center">
                                                {item.warga_buta_p || 0}
                                            </td>
                                            <td className="p-3 border-r border-slate-100 text-center">
                                                {item.kelompok_belajar_paket_a || 0}
                                            </td>
                                            <td className="p-3 border-r border-slate-100 text-center">
                                                {item.kelompok_belajar_paket_b || 0}
                                            </td>
                                            <td className="p-3 border-r border-slate-100 text-center">
                                                {item.kelompok_belajar_paket_c || 0}
                                            </td>
                                            <td className="p-3 border-r border-slate-100 text-center">
                                                {item.kf || 0}
                                            </td>
                                            <td className="p-3 border-r border-slate-100 text-center">
                                                {item.paud || 0}
                                            </td>
                                            <td className="p-3 text-center">
                                                {item.koperasi_berbadan_hukum || 0}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
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
                                        if (localData.current_page > 1) {
                                            const prev = localData.current_page - 1;
                                            handlePageChange(`?page=${prev}`);
                                        }
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
                                        if (localData.current_page < localData.last_page) {
                                            const next = localData.current_page + 1;
                                            handlePageChange(`?page=${next}`);
                                        }
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
