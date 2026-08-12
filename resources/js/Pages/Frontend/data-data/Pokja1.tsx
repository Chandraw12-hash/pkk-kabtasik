import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import {
    Search,
    Filter,
    Users,
    BookOpen,
    HeartHandshake,
    ShieldCheck,
} from "lucide-react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";

interface Pokja1Item {
    id: number;
    kecamatan?: string;
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

interface PaginationData {
    data: Pokja1Item[];
    links: any[];
}

interface Props {
    data: PaginationData;
}

export default function Pokja1({ data }: Props) {
    const [search, setSearch] = useState("");

    const items = data?.data || [];

    const filteredData = items.filter((item) =>
        (item.kecamatan || "").toLowerCase().includes(search.toLowerCase())
    );

    const totalPkbn = items.reduce(
        (acc, curr) =>
            acc + (Number(curr.pkbn_l) || 0) + (Number(curr.pkbn_p) || 0),
        0
    );
    const totalPkdrt = items.reduce(
        (acc, curr) =>
            acc + (Number(curr.pkdrt_l) || 0) + (Number(curr.pkdrt_p) || 0),
        0
    );
    const totalPolaAsuh = items.reduce(
        (acc, curr) =>
            acc +
            (Number(curr.pola_asuh_l) || 0) +
            (Number(curr.pola_asuh_p) || 0),
        0
    );
    const totalKader = items.reduce(
        (acc, curr) =>
            acc +
            (Number(curr.kader_pokja1_l) || 0) +
            (Number(curr.kader_pokja1_p) || 0),
        0
    );

    // Hitung total untuk Grafik Gender & Kategori
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
    const grandTotalGender = totalL + totalP || 1;
    const percentP = (totalP / grandTotalGender) * 100;

    const maxBarVal = Math.max(
        sumPkbnL, sumPkbnP,
        sumPkdrtL, sumPkdrtP,
        sumPolaL, sumPolaP,
        sumLansiaL, sumLansiaP,
        sumKaderL, sumKaderP,
        10
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pt-14">
            <Head title="Data Pokja I - TP PKK Kab. Tasikmalaya" />

            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Judul */}
                <div>
                    <p className="text-teal-600 text-xs font-semibold tracking-wide uppercase mb-1">
                        Pokja I
                    </p>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Rekapitulasi Data Pokja I Tingkat Kecamatan
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        Penghayatan &amp; Pengamalan Pancasila serta Gotong
                        Royong.
                    </p>
                </div>

                {/* Filter */}
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

                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                Total PKBN
                            </p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">
                                {totalPkbn.toLocaleString("id-ID")}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <BookOpen size={18} className="text-blue-600" />
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                Total PKDRT
                            </p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">
                                {totalPkdrt.toLocaleString("id-ID")}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                            <ShieldCheck size={18} className="text-teal-600" />
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                Pola Asuh Anak
                            </p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">
                                {totalPolaAsuh.toLocaleString("id-ID")}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                            <HeartHandshake
                                size={18}
                                className="text-amber-600"
                            />
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                Total Kader Pokja I
                            </p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">
                                {totalKader.toLocaleString("id-ID")}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center">
                            <Users size={18} className="text-rose-600" />
                        </div>
                    </div>
                </div>

                {/* Section Grafik */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Grafik Batang: Distribusi per Kategori & Gender */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-base font-bold text-slate-900">
                                Distribusi Jenis Kelamin per Kategori Pokja I
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

                        <div className="h-64 flex items-end justify-around gap-2 pt-6 border-b border-slate-200 pb-2 px-2">
                            {[
                                { label: "PKBN", l: sumPkbnL, p: sumPkbnP },
                                { label: "PKDRT", l: sumPkdrtL, p: sumPkdrtP },
                                { label: "Pola Asuh", l: sumPolaL, p: sumPolaP },
                                { label: "Lansia", l: sumLansiaL, p: sumLansiaP },
                                { label: "Kader", l: sumKaderL, p: sumKaderP },
                            ].map((item, idx) => {
                                const heightL = `${Math.max((item.l / maxBarVal) * 100, 4)}%`;
                                const heightP = `${Math.max((item.p / maxBarVal) * 100, 4)}%`;
                                return (
                                    <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end">
                                        <div className="flex items-end justify-center gap-1 w-full h-full">
                                            <div
                                                style={{ height: heightL }}
                                                className="w-1/2 bg-sky-400 rounded-t hover:bg-sky-50 transition-all relative group"
                                            >
                                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] bg-slate-800 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {item.l}
                                                </span>
                                            </div>
                                            <div
                                                style={{ height: heightP }}
                                                className="w-1/2 bg-rose-400 rounded-t hover:bg-rose-50 transition-all relative group"
                                            >
                                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] bg-slate-800 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {item.p}
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

                    {/* Diagram Lingkaran / Pie Chart Komposisi Gender */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
                        <h3 className="text-base font-bold text-slate-900 mb-2">
                            Komposisi Penduduk Berdasarkan Gender
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
                                        {(totalL + totalP).toLocaleString("id-ID")}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="w-4 h-4 bg-sky-400 rounded-md"></span>
                                    <span className="text-slate-600 font-medium">Laki-laki (L):</span>
                                    <span className="font-bold text-slate-900">{totalL.toLocaleString("id-ID")}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-4 h-4 bg-rose-400 rounded-md"></span>
                                    <span className="text-slate-600 font-medium">Perempuan (P):</span>
                                    <span className="font-bold text-slate-900">{totalP.toLocaleString("id-ID")}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabel */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span>Tampilkan</span>
                            <select className="border border-slate-200 rounded-lg px-2 py-1.5 text-sm bg-white outline-none focus:border-teal-500">
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                            </select>
                            <span>data</span>
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
                                        PKBN
                                    </th>
                                    <th
                                        className="p-2 border-r border-slate-200 text-center font-semibold"
                                        colSpan={2}
                                    >
                                        PKDRT
                                    </th>
                                    <th
                                        className="p-2 border-r border-slate-200 text-center font-semibold"
                                        colSpan={2}
                                    >
                                        Pola Asuh
                                    </th>
                                    <th
                                        className="p-2 border-r border-slate-200 text-center font-semibold"
                                        colSpan={2}
                                    >
                                        Lansia
                                    </th>
                                    <th
                                        className="p-2 text-center font-semibold"
                                        colSpan={2}
                                    >
                                        Kader Pokja I
                                    </th>
                                </tr>
                                <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-200 font-medium">
                                    <th className="p-2 border-r border-slate-200 text-center">
                                        L
                                    </th>
                                    <th className="p-2 border-r border-slate-200 text-center">
                                        P
                                    </th>
                                    <th className="p-2 border-r border-slate-200 text-center">
                                        L
                                    </th>
                                    <th className="p-2 border-r border-slate-200 text-center">
                                        P
                                    </th>
                                    <th className="p-2 border-r border-slate-200 text-center">
                                        L
                                    </th>
                                    <th className="p-2 border-r border-slate-200 text-center">
                                        P
                                    </th>
                                    <th className="p-2 border-r border-slate-200 text-center">
                                        L
                                    </th>
                                    <th className="p-2 border-r border-slate-200 text-center">
                                        P
                                    </th>
                                    <th className="p-2 border-r border-slate-200 text-center">
                                        L
                                    </th>
                                    <th className="p-2 text-center">P</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={11}
                                            className="text-center py-12 text-slate-400"
                                        >
                                            Belum ada data kecamatan untuk
                                            Pokja I.
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
                                                {item.pkbn_l || 0}
                                            </td>
                                            <td className="p-3 border-r border-slate-100 text-center">
                                                {item.pkbn_p || 0}
                                            </td>
                                            <td className="p-3 border-r border-slate-100 text-center">
                                                {item.pkdrt_l || 0}
                                            </td>
                                            <td className="p-3 border-r border-slate-100 text-center">
                                                {item.pkdrt_p || 0}
                                            </td>
                                            <td className="p-3 border-r border-slate-100 text-center">
                                                {item.pola_asuh_l || 0}
                                            </td>
                                            <td className="p-3 border-r border-slate-100 text-center">
                                                {item.pola_asuh_p || 0}
                                            </td>
                                            <td className="p-3 border-r border-slate-100 text-center">
                                                {item.lansia_l || 0}
                                            </td>
                                            <td className="p-3 border-r border-slate-100 text-center">
                                                {item.lansia_p || 0}
                                            </td>
                                            <td className="p-3 border-r border-slate-100 text-center">
                                                {item.kader_pokja1_l || 0}
                                            </td>
                                            <td className="p-3 text-center">
                                                {item.kader_pokja1_p || 0}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
                        <span>
                            Menampilkan {filteredData.length} data wilayah
                            Kabupaten Tasikmalaya
                        </span>
                        <div className="flex gap-1">
                            <button
                                type="button"
                                className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 font-medium"
                            >
                                &laquo;
                            </button>
                            <button
                                type="button"
                                className="px-3 py-1.5 border border-teal-600 rounded-lg bg-teal-600 text-white font-medium"
                            >
                                1
                            </button>
                            <button
                                type="button"
                                className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 font-medium"
                            >
                                &raquo;
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
