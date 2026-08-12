import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import {
    Search,
    Filter,
    ArrowLeft,
    GraduationCap,
    BookOpenCheck,
    Store,
    Users,
} from "lucide-react";

// ============================================================
// IMPORT NAVBAR & FOOTER - PATH SAMA DENGAN POKJA1
// (Pokja2.tsx sejajar dengan Pokja1.tsx di Frontend/data-data/,
// jadi cukup naik 1 level ke ../Layouts)
// ============================================================
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";

// ============================================================
// INTERFACE
// ============================================================
interface Pokja2Item {
    id: number;
    kecamatan?: string;
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

interface PaginationData {
    data: Pokja2Item[];
    links: any[];
}

interface Props {
    data: PaginationData;
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function Pokja2({ data }: Props) {
    const [search, setSearch] = useState("");
    const items = data?.data || [];

    const filteredData = items.filter((item) =>
        (item.kecamatan || "").toLowerCase().includes(search.toLowerCase())
    );

    // ==================== KALKULASI REAL-TIME ====================
    const totalPaud = filteredData.reduce((acc, curr) => acc + (Number(curr.paud) || 0), 0);
    const totalPaketA = filteredData.reduce((acc, curr) => acc + (Number(curr.kelompok_belajar_paket_a) || 0), 0);
    const totalPaketB = filteredData.reduce((acc, curr) => acc + (Number(curr.kelompok_belajar_paket_b) || 0), 0);
    const totalPaketC = filteredData.reduce((acc, curr) => acc + (Number(curr.kelompok_belajar_paket_c) || 0), 0);
    const totalPaket = totalPaketA + totalPaketB + totalPaketC;
    const totalKoperasi = filteredData.reduce((acc, curr) => acc + (Number(curr.koperasi_berbadan_hukum) || 0), 0);
    const totalKF = filteredData.reduce((acc, curr) => acc + (Number(curr.kf) || 0), 0);

    const sumButaL = filteredData.reduce((acc, curr) => acc + (Number(curr.warga_buta_l) || 0), 0);
    const sumButaP = filteredData.reduce((acc, curr) => acc + (Number(curr.warga_buta_p) || 0), 0);
    const totalWargaButa = sumButaL + sumButaP;

    const totalGender = totalWargaButa || 1;
    const percentP = (sumButaP / totalGender) * 100;

    const maxBarVal = Math.max(
        totalPaud,
        totalPaket,
        totalKoperasi,
        totalKF,
        totalWargaButa,
        10
    );

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 pt-14">
            {/* ==========================================================
                HEAD - SEO & META TAGS
                ========================================================== */}
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
                    <Link href="/" className="hover:text-teal-600 transition-colors">
                        Beranda
                    </Link>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-900 font-medium">Pokja II</span>
                </nav>

                {/* ===== JUDUL ===== */}
                <div>
                    <p className="text-teal-600 text-xs font-semibold tracking-wide uppercase mb-1">
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
                    <div className="flex flex-wrap gap-3 items-center">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-slate-600">
                                Kecamatan
                            </label>
                            <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-teal-500">
                                <option value="">Semua Kecamatan</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-slate-600">
                                Tahun
                            </label>
                            <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-teal-500">
                                <option value="2026">2026</option>
                                <option value="2025">2025</option>
                            </select>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
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
                        <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                            <Store size={18} className="text-teal-600" />
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

                {/* ===== GRAFIK ===== */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Grafik Batang */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-base font-bold text-slate-900">
                                Distribusi Data Pokja II
                            </h3>
                        </div>

                        <div className="h-64 flex items-end justify-around gap-2 pt-6 border-b border-slate-200 pb-2 px-2">
                            {[
                                { label: "PAUD", val: totalPaud },
                                { label: "Paket Belajar", val: totalPaket },
                                { label: "Koperasi", val: totalKoperasi },
                                { label: "KF", val: totalKF },
                                { label: "Buta Aksara", val: totalWargaButa },
                            ].map((item, idx) => {
                                const heightVal = `${Math.max((item.val / maxBarVal) * 100, 4)}%`;
                                return (
                                    <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end">
                                        <div className="flex items-end justify-center w-full h-full">
                                            <div
                                                style={{ height: heightVal }}
                                                className="w-3/4 bg-teal-500 rounded-t hover:bg-teal-600 transition-all relative group"
                                            >
                                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] bg-slate-800 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {item.val.toLocaleString("id-ID")}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-[11px] text-slate-600 mt-2 font-medium truncate max-w-full">
                                            {item.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Pie Chart Gender Warga Buta Aksara */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
                        <h3 className="text-base font-bold text-slate-900 mb-2">
                            Komposisi Warga Buta Aksara (L / P)
                        </h3>
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
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== TABEL ===== */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span>Tampilkan data wilayah</span>
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
                                className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-teal-500 bg-white"
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
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="text-center py-12 text-slate-400"
                                        >
                                            Belum ada data kecamatan untuk Pokja II.
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

                    <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
                        <span>
                            Menampilkan {filteredData.length} data wilayah Kabupaten Tasikmalaya
                        </span>
                        <div className="flex gap-1">
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
                                                    ? "border-teal-600 bg-teal-600 text-white"
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
