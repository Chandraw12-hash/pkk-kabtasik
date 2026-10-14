import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import {
    Search,
    Filter,
    ArrowLeft,
    Users,
    Home,
    UserCheck,
    Award,
    BarChart3,
} from "lucide-react";

// ============================================================
// IMPORT NAVBAR & FOOTER - Sekretariat.tsx ada di folder yang sama
// dengan Pokja1.tsx (Frontend/data-data/), jadi cukup naik 1 level
// ============================================================
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";

// ============================================================
// INTERFACE
// ============================================================
interface SekretariatItem {
    id: number;
    kecamatan?: string;
    jumlah_pkk_rw?: number;
    jumlah_pkk_rt?: number;
    jumlah_dasa_wisma?: number;
    jumlah_krt?: number;
    jumlah_kk?: number;
    jiwa_l?: number;
    jiwa_p?: number;
    jiwa_tidak_terpilah?: number;
    tp_pkk_l?: number;
    tp_pkk_p?: number;
    kader_umum_l?: number;
    kader_umum_p?: number;
    kader_khusus_l?: number;
    kader_khusus_p?: number;
    [key: string]: any;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationData {
    data: SekretariatItem[];
    links: PaginationLink[];
    from?: number;
    to?: number;
    total?: number;
}

interface Props {
    data: PaginationData;
    filters?: { kecamatan?: string; year?: string };
}

// ============================================================
// GRAFIK BATANG (SVG)
// ------------------------------------------------------------
// Diperbaiki dari versi lama yang pakai `height: %` pada div (bisa
// collapse ke 0px kalau parent tanpa tinggi pasti) dan yang memaksa
// kategori "KK" masuk ke grafik gender padahal KK (Kepala Keluarga)
// tidak punya pecahan L/P. Sekarang grafik hanya berisi kategori yang
// benar-benar punya data L/P: Jiwa, Kader Umum, Kader Khusus.
// ============================================================
const GenderBarChart = ({
    data,
    maxValue,
}: {
    data: { label: string; l: number; p: number }[];
    maxValue: number;
}) => {
    const width = 520;
    const height = 240;
    const paddingLeft = 34;
    const paddingBottom = 26;
    const paddingTop = 16;
    const chartHeight = height - paddingBottom - paddingTop;
    const groupWidth = (width - paddingLeft) / data.length;
    const barWidth = Math.min(34, groupWidth / 3);
    const gap = 8;

    const yTicks = [0, 0.25, 0.5, 0.75, 1];
    const safeMax = maxValue > 0 ? maxValue : 1;

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-64"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Grafik distribusi jenis kelamin per kategori"
        >
            {/* Grid + label sumbu Y (0 di bawah, naik ke atas — arah yang benar) */}
            {yTicks.map((t) => {
                const y = paddingTop + chartHeight - t * chartHeight;
                return (
                    <g key={t}>
                        <line x1={paddingLeft} x2={width} y1={y} y2={y} stroke="#f1f5f9" strokeWidth={1} />
                        <text x={paddingLeft - 8} y={y + 3} textAnchor="end" fontSize="9" fill="#94a3b8">
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
                    paddingLeft + idx * groupWidth + (groupWidth - (barWidth * 2 + gap)) / 2;
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

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function Sekretariat({ data, filters }: Props) {
    const [search, setSearch] = useState("");
    const [selectedKecamatan, setSelectedKecamatan] = useState(filters?.kecamatan || "");
    const [selectedYear, setSelectedYear] = useState(filters?.year || "2026");

    const items = data?.data || [];

    const uniqueKecamatan = Array.from(
        new Set(items.map((item) => item.kecamatan).filter(Boolean))
    );

    const filteredData = items.filter((item) => {
        const matchesSearch = (item.kecamatan || "").toLowerCase().includes(search.toLowerCase());
        const matchesKecamatan = selectedKecamatan ? item.kecamatan === selectedKecamatan : true;
        return matchesSearch && matchesKecamatan;
    });

    // ==================== METRIC CARDS ====================
    const totalKK = filteredData.reduce((acc, curr) => acc + (Number(curr.jumlah_kk) || 0), 0);
    const totalJiwa = filteredData.reduce(
        (acc, curr) =>
            acc +
            (Number(curr.jiwa_l) || 0) +
            (Number(curr.jiwa_p) || 0) +
            (Number(curr.jiwa_tidak_terpilah) || 0),
        0
    );
    const totalKaderUmum = filteredData.reduce(
        (acc, curr) => acc + (Number(curr.kader_umum_l) || 0) + (Number(curr.kader_umum_p) || 0),
        0
    );
    const totalKaderKhusus = filteredData.reduce(
        (acc, curr) => acc + (Number(curr.kader_khusus_l) || 0) + (Number(curr.kader_khusus_p) || 0),
        0
    );

    // ==================== GRAFIK ====================
    // Sebelumnya nilai P selalu di-hardcode 0. Sekarang dihitung dari data asli,
    // dan "KK" dikeluarkan dari grafik gender karena memang tidak punya pecahan L/P.
    const sumJiwaL = items.reduce((acc, curr) => acc + (Number(curr.jiwa_l) || 0), 0);
    const sumJiwaP = items.reduce((acc, curr) => acc + (Number(curr.jiwa_p) || 0), 0);
    const sumJiwaTidakTerpilah = items.reduce(
        (acc, curr) => acc + (Number(curr.jiwa_tidak_terpilah) || 0),
        0
    );
    const sumKaderUmumL = items.reduce((acc, curr) => acc + (Number(curr.kader_umum_l) || 0), 0);
    const sumKaderUmumP = items.reduce((acc, curr) => acc + (Number(curr.kader_umum_p) || 0), 0);
    const sumKaderKhususL = items.reduce((acc, curr) => acc + (Number(curr.kader_khusus_l) || 0), 0);
    const sumKaderKhususP = items.reduce((acc, curr) => acc + (Number(curr.kader_khusus_p) || 0), 0);

    const totalGender = sumJiwaL + sumJiwaP || 1;
    const percentP = (sumJiwaP / totalGender) * 100;

    const chartData = [
        { label: "Jiwa", l: sumJiwaL, p: sumJiwaP },
        { label: "Kader Umum", l: sumKaderUmumL, p: sumKaderUmumP },
        { label: "Kader Khusus", l: sumKaderKhususL, p: sumKaderKhususP },
    ];
    const maxBarVal = Math.max(
        sumJiwaL, sumJiwaP,
        sumKaderUmumL, sumKaderUmumP,
        sumKaderKhususL, sumKaderKhususP
    );
    const hasGenderData = maxBarVal > 0;

    const handleApplyFilter = () => {
        router.get(route("sekretariat.index"), {
            kecamatan: selectedKecamatan,
            year: selectedYear,
        }, { preserveState: true, preserveScroll: true, replace: true });
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 pt-14">
            {/* ==========================================================
                HEAD - SEO & META TAGS
                ========================================================== */}
            <Head>
                <title>Data Umum & Statistik Sekretariat - TP PKK Kab. Tasikmalaya</title>
                <meta
                    name="description"
                    content="Data rekapitulasi data umum dan statistik Sekretariat PKK Kabupaten Tasikmalaya - Data kependudukan dan kader PKK."
                />
                <meta name="robots" content="index, follow" />
                <meta property="og:title" content="Data Umum & Statistik Sekretariat - TP PKK Kab. Tasikmalaya" />
                <meta
                    property="og:description"
                    content="Data rekapitulasi data umum dan statistik Sekretariat PKK Kabupaten Tasikmalaya."
                />
                <meta property="og:type" content="website" />
                <meta property="og:locale" content="id_ID" />
            </Head>

            {/* ==========================================================
                NAVBAR
                ========================================================== */}
            <Navbar />

            {/* ==========================================================
                MAIN CONTENT
                ========================================================== */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full">
                {/* ===== BREADCRUMB ===== */}
                <nav className="flex items-center gap-2 text-sm text-slate-500">
                    <Link href="/" className="hover:text-[#0072BC] transition-colors">
                        Beranda
                    </Link>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-900 font-medium">Sekretariat</span>
                </nav>

                {/* ===== JUDUL ===== */}
                <div>
                    <p className="text-[#0072BC] text-xs font-semibold tracking-wide uppercase mb-1">
                        Sekretariat
                    </p>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Rekapitulasi Data Umum Tingkat Kecamatan
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        Data dikalkulasikan secara real-time berdasarkan input dari masing-masing wilayah.
                    </p>
                </div>

                {/* ===== FILTER ===== */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row flex-wrap gap-3 items-start md:items-center justify-between">
                    <div className="flex flex-wrap gap-3 items-center">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-slate-600">
                                Kecamatan
                            </label>
                            <select
                                value={selectedKecamatan}
                                onChange={(e) => setSelectedKecamatan(e.target.value)}
                                className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0072BC]"
                            >
                                <option value="">Semua Kecamatan</option>
                                {uniqueKecamatan.map((kec, index) => (
                                    <option key={index} value={kec}>
                                        {kec}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-slate-600">
                                Tahun
                            </label>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0072BC]"
                            >
                                <option value="2026">2026</option>
                                <option value="2025">2025</option>
                            </select>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleApplyFilter}
                        className="inline-flex items-center gap-2 bg-[#0072BC] hover:bg-[#0072BC] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                        <Filter size={15} />
                        Terapkan Filter
                    </button>
                </div>

                {/* ===== METRIC CARDS ===== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                Total Kepala Keluarga
                            </p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">
                                {totalKK.toLocaleString("id-ID")}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Home size={18} className="text-blue-600" />
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                Total Jiwa Penduduk
                            </p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">
                                {totalJiwa.toLocaleString("id-ID")}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-[#0072BC]/10 flex items-center justify-center">
                            <Users size={18} className="text-[#0072BC]" />
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                Total Kader Umum
                            </p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">
                                {totalKaderUmum.toLocaleString("id-ID")}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                            <UserCheck size={18} className="text-amber-600" />
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                Total Kader Khusus
                            </p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">
                                {totalKaderKhusus.toLocaleString("id-ID")}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center">
                            <Award size={18} className="text-rose-600" />
                        </div>
                    </div>
                </div>

                {/* ===== GRAFIK ===== */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Grafik Batang */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-base font-bold text-slate-900">
                                Distribusi Jenis Kelamin per Kategori
                            </h3>
                            <div className="flex items-center gap-3 text-xs">
                                <span className="flex items-center gap-1">
                                    <span className="w-3 h-3 bg-sky-400 rounded-sm inline-block"></span> L (Laki-laki)
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="w-3 h-3 bg-rose-400 rounded-sm inline-block"></span> P (Perempuan)
                                </span>
                            </div>
                        </div>

                        {!hasGenderData ? (
                            <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                                <BarChart3 size={32} className="mb-2 text-slate-300" />
                                <p className="text-sm">Belum ada data untuk ditampilkan</p>
                            </div>
                        ) : (
                            <GenderBarChart data={chartData} maxValue={maxBarVal} />
                        )}
                    </div>

                    {/* Pie Chart Gender */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
                        <h3 className="text-base font-bold text-slate-900 mb-2">
                            Komposisi Penduduk Berdasarkan Gender
                        </h3>
                        {sumJiwaL + sumJiwaP === 0 ? (
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
                                            {totalJiwa.toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="w-4 h-4 bg-sky-400 rounded-md"></span>
                                        <span className="text-slate-600 font-medium">Laki-laki (L):</span>
                                        <span className="font-bold text-slate-900">
                                            {sumJiwaL.toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-4 h-4 bg-rose-400 rounded-md"></span>
                                        <span className="text-slate-600 font-medium">Perempuan (P):</span>
                                        <span className="font-bold text-slate-900">
                                            {sumJiwaP.toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-4 h-4 bg-slate-300 rounded-md"></span>
                                        <span className="text-slate-600 font-medium">Belum terpilah:</span>
                                        <span className="font-bold text-slate-900">
                                            {sumJiwaTidakTerpilah.toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                                        <span className="text-xs text-slate-400">Persentase P (data terpilah)</span>
                                        <span className="font-bold text-[#0072BC]">
                                            {percentP.toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ===== TABEL ===== */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span>Menampilkan data wilayah</span>
                        </div>
                        <div className="relative w-full sm:w-64">
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
                                        colSpan={3}
                                    >
                                        Jumlah Kelompok
                                    </th>
                                    <th
                                        className="p-2 border-r border-slate-200 text-center font-semibold"
                                        colSpan={2}
                                    >
                                        Jumlah KK
                                    </th>
                                    <th
                                        className="p-2 border-r border-slate-200 text-center font-semibold"
                                        colSpan={2}
                                    >
                                        Jumlah Jiwa
                                    </th>
                                    <th
                                        className="p-2 border-r border-slate-200 text-center font-semibold"
                                        colSpan={2}
                                    >
                                        Anggota TP PKK
                                    </th>
                                    <th
                                        className="p-2 border-r border-slate-200 text-center font-semibold"
                                        colSpan={2}
                                    >
                                        Kader Umum
                                    </th>
                                    <th
                                        className="p-2 text-center font-semibold"
                                        colSpan={2}
                                    >
                                        Kader Khusus
                                    </th>
                                </tr>
                                <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-200 font-medium">
                                    <th className="p-2 border-r border-slate-200 text-center">PKK RW</th>
                                    <th className="p-2 border-r border-slate-200 text-center">PKK RT</th>
                                    <th className="p-2 border-r border-slate-200 text-center">Dasawisma</th>
                                    <th className="p-2 border-r border-slate-200 text-center">KRT</th>
                                    <th className="p-2 border-r border-slate-200 text-center">KK</th>
                                    <th className="p-2 border-r border-slate-200 text-center">L</th>
                                    <th className="p-2 border-r border-slate-200 text-center">P</th>
                                    <th className="p-2 border-r border-slate-200 text-center">L</th>
                                    <th className="p-2 border-r border-slate-200 text-center">P</th>
                                    <th className="p-2 border-r border-slate-200 text-center">L</th>
                                    <th className="p-2 border-r border-slate-200 text-center">P</th>
                                    <th className="p-2 border-r border-slate-200 text-center">L</th>
                                    <th className="p-2 text-center">P</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={14}
                                            className="text-center py-12 text-slate-400"
                                        >
                                            Belum ada data kecamatan yang tersimpan di database.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((item, idx) => (
                                        <tr
                                            key={item.id || idx}
                                            className="hover:bg-slate-50 transition-colors"
                                        >
                                            <td className="p-3 border-r border-slate-100 font-semibold text-slate-900">
                                                {item.kecamatan || "-"}
                                            </td>
                                            <td className="p-3 border-r border-slate-100 text-center">
                                                {item.jumlah_pkk_rw || 0}
                                            </td>
                                            <td className="p-3 border-r border-slate-100 text-center">
                                                {item.jumlah_pkk_rt || 0}
                                            </td>
                                            <td className="p-3 border-r border-slate-100 text-center">
                                                {item.jumlah_dasa_wisma || 0}
                                            </td>
                                            <td className="p-3 border-r border-slate-100 text-center">
                                                {item.jumlah_krt || 0}
                                            </td>
                                            <td className="p-3 border-r border-slate-100 text-center">
                                                {item.jumlah_kk || 0}
                                            </td>
                                            <td className="p-3 border-r border-slate-100 text-center">
                                                {item.jiwa_l || 0}
                                            </td>
                                            <td className="p-3 border-r border-slate-100 text-center">
                                                {item.jiwa_p || 0}
                                            </td>
                                            <td className="p-3 border-r border-slate-100 text-center">
                                                {item.tp_pkk_l || 0}
                                            </td>
                                            <td className="p-3 border-r border-slate-100 text-center">
                                                {item.tp_pkk_p || 0}
                                            </td>
                                            <td className="p-3 border-r border-slate-100 text-center">
                                                {item.kader_umum_l || 0}
                                            </td>
                                            <td className="p-3 border-r border-slate-100 text-center">
                                                {item.kader_umum_p || 0}
                                            </td>
                                            <td className="p-3 border-r border-slate-100 text-center">
                                                {item.kader_khusus_l || 0}
                                            </td>
                                            <td className="p-3 text-center">
                                                {item.kader_khusus_p || 0}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ===== PAGINATION ===== */}
                    <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
                        <span>
                            Menampilkan {filteredData.length} data wilayah Kabupaten Tasikmalaya
                        </span>
                        <div className="flex gap-1 flex-wrap">
                            {data?.links &&
                                data.links.map((link, index) => {
                                    if (!link.url) {
                                        return (
                                            <span
                                                key={index}
                                                className="px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-100 text-slate-400 font-medium cursor-not-allowed"
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        );
                                    }
                                    return (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            className={`px-3 py-1.5 border rounded-lg font-medium transition-colors ${
                                                link.active
                                                    ? "border-[#0072BC] bg-[#0072BC] text-white"
                                                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </main>

            {/* ==========================================================
                FOOTER
                ========================================================== */}
            <Footer />
        </div>
    );
}
