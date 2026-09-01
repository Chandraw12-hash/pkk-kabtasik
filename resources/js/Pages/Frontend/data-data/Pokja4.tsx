import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import {
    Search,
    Filter,
    HeartPulse,
    Activity,
    ShieldPlus,
    Users,
} from "lucide-react";

import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";

// 🔥 PERBAIKI INTERFACE - Tambahkan field yang hilang
interface Pokja4Item {
    id: number;
    kecamatan?: string;
    nama_kecamatan?: string;  // 🔥 TAMBAHKAN
    posyandu?: number;
    akseptor_kb?: number;
    phbs?: number;
    jamban_keluarga?: number;
    kategori?: string;        // 🔥 TAMBAHKAN
    judul_kegiatan?: string;  // 🔥 TAMBAHKAN
    deskripsi?: string;       // 🔥 TAMBAHKAN
    created_at?: string;
    updated_at?: string;
    [key: string]: any;
}

interface PaginationData {
    data: Pokja4Item[];
    links: any[];
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
}

interface Props {
    data: PaginationData;
    filters?: {
        search?: string;
        per_page?: number;
    };
}

export default function Pokja4({ data, filters = {} }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const items = data?.data || [];

    const filteredData = items.filter((item) =>
        (item.kecamatan || item.nama_kecamatan || "")
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    // ==================== KALKULASI ====================
    const totalPosyandu = filteredData.reduce(
        (acc, curr) => acc + (Number(curr.posyandu) || 0),
        0
    );
    const totalKb = filteredData.reduce(
        (acc, curr) => acc + (Number(curr.akseptor_kb) || 0),
        0
    );
    const totalPhbs = filteredData.reduce(
        (acc, curr) => acc + (Number(curr.phbs) || 0),
        0
    );
    const totalJamban = filteredData.reduce(
        (acc, curr) => acc + (Number(curr.jamban_keluarga) || 0),
        0
    );

    const maxBarVal = Math.max(
        totalPosyandu,
        totalKb,
        totalPhbs,
        totalJamban,
        10
    );

    const totalRumahKesehatan = totalPhbs + totalJamban;
    const totalRumahKesehatanSafe = totalRumahKesehatan || 1;
    const percentJamban = (totalJamban / totalRumahKesehatanSafe) * 100;

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 pt-14">
            <Head title="Data Pokja IV - TP PKK Kab. Tasikmalaya" />

            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-slate-500">
                    <Link href="/" className="hover:text-teal-600 transition-colors">
                        Beranda
                    </Link>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-900 font-medium">Pokja IV</span>
                </nav>

                {/* Judul */}
                <div>
                    <p className="text-teal-600 text-xs font-semibold tracking-wide uppercase mb-1">
                        Pokja IV
                    </p>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Rekapitulasi Data Pokja IV Tingkat Kecamatan
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        Kesehatan, Kelestarian Lingkungan Hidup, dan Perencanaan Sehat.
                    </p>
                </div>

                {/* Filter */}
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
                                className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-teal-500 bg-white"
                            />
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

                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                Total Posyandu
                            </p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">
                                {totalPosyandu.toLocaleString("id-ID")}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <HeartPulse size={18} className="text-blue-600" />
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                Akseptor KB
                            </p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">
                                {totalKb.toLocaleString("id-ID")}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                            <Activity size={18} className="text-teal-600" />
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                Rumah PHBS
                            </p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">
                                {totalPhbs.toLocaleString("id-ID")}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                            <ShieldPlus size={18} className="text-amber-600" />
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                Jamban Keluarga
                            </p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">
                                {totalJamban.toLocaleString("id-ID")}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center">
                            <Users size={18} className="text-rose-600" />
                        </div>
                    </div>
                </div>

                {/* Grafik */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Grafik Batang */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-base font-bold text-slate-900">Distribusi Data Pokja IV</h3>
                        </div>

                        <div className="h-64 flex items-end justify-around gap-2 pt-6 border-b border-slate-200 pb-2 px-2">
                            {[
                                { label: "Posyandu", val: totalPosyandu },
                                { label: "Akseptor KB", val: totalKb },
                                { label: "Rumah PHBS", val: totalPhbs },
                                { label: "Jamban", val: totalJamban },
                            ].map((item, idx) => {
                                const heightVal = `${Math.max((item.val / maxBarVal) * 100, 4)}%`;
                                return (
                                    <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end">
                                        <div className="flex items-end justify-center w-full h-full">
                                            <div style={{ height: heightVal }} className="w-3/4 bg-teal-500 rounded-t hover:bg-teal-600 transition-all relative group">
                                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] bg-slate-800 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    {item.val.toLocaleString("id-ID")}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-[11px] text-slate-600 mt-2 font-medium truncate max-w-full">{item.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
                        <h3 className="text-base font-bold text-slate-900 mb-2">Rasio PHBS & Jamban Keluarga</h3>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-auto py-4">
                            <div
                                className="w-40 h-40 rounded-full relative shadow-inner"
                                style={{ background: `conic-gradient(#f59e0b 0% ${100 - percentJamban}%, #f43f5e ${100 - percentJamban}% 100%)` }}
                            >
                                <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                                    <span className="text-xs text-slate-400 font-medium">Total Akumulasi</span>
                                    <span className="text-sm font-bold text-slate-800">{totalRumahKesehatan.toLocaleString("id-ID")}</span>
                                </div>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="w-4 h-4 bg-amber-500 rounded-md"></span>
                                    <span className="text-slate-600 font-medium">Rumah PHBS:</span>
                                    <span className="font-bold text-slate-900">{totalPhbs.toLocaleString("id-ID")}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-4 h-4 bg-rose-500 rounded-md"></span>
                                    <span className="text-slate-600 font-medium">Jamban Keluarga:</span>
                                    <span className="font-bold text-slate-900">{totalJamban.toLocaleString("id-ID")}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabel */}
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
                                    <th className="p-3 border-r border-slate-200 text-center font-semibold">
                                        Nama Kecamatan
                                    </th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold">
                                        Posyandu
                                    </th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold">
                                        Akseptor KB
                                    </th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold">
                                        PHBS
                                    </th>
                                    <th className="p-2 text-center font-semibold">
                                        Jamban
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-12 text-slate-400">
                                            Belum ada data kecamatan untuk Pokja IV.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((item, idx) => (
                                        <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-3 border-r border-slate-100 font-semibold text-slate-900">
                                                {item.nama_kecamatan || item.kecamatan || "-"}
                                            </td>
                                            <td className="p-3 border-r border-slate-100 text-center">
                                                {item.posyandu || 0}
                                            </td>
                                            <td className="p-3 border-r border-slate-100 text-center">
                                                {item.akseptor_kb || 0}
                                            </td>
                                            <td className="p-3 border-r border-slate-100 text-center">
                                                {item.phbs || 0}
                                            </td>
                                            <td className="p-3 text-center">
                                                {item.jamban_keluarga || 0}
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
                            {data?.links && data.links.map((link, index) => {
                                if (!link.url) {
                                    return (
                                        <span
                                            key={index}
                                            className="px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-100 text-slate-400 font-medium cursor-not-allowed"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
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
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
