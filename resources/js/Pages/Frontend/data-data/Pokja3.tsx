import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import {
    Search,
    Filter,
    Home,
    Wheat,
    Building2,
    BarChart3,
    Users,
    Leaf,
    Sprout,
    Warehouse,
} from "lucide-react";

import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";

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
    links: any[];
}

interface Props {
    data: PaginationData;
}

const SingleSeriesBarChart = ({
    data,
    maxValue,
}: {
    data: { label: string; val: number }[];
    maxValue: number;
}) => {
    const width = 520;
    const height = 240;
    const paddingLeft = 38;
    const paddingBottom = 26;
    const paddingTop = 16;
    const chartHeight = height - paddingBottom - paddingTop;
    const groupWidth = (width - paddingLeft) / data.length;
    const barWidth = Math.min(56, groupWidth * 0.55);

    const yTicks = [0, 0.25, 0.5, 0.75, 1];
    const safeMax = maxValue > 0 ? maxValue : 1;

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-64"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Grafik distribusi data Pokja III"
        >
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

            <line
                x1={paddingLeft}
                x2={width}
                y1={paddingTop + chartHeight}
                y2={paddingTop + chartHeight}
                stroke="#e2e8f0"
                strokeWidth={1}
            />

            {data.map((item, idx) => {
                const groupX = paddingLeft + idx * groupWidth + (groupWidth - barWidth) / 2;
                const h = (item.val / safeMax) * chartHeight;
                const yBase = paddingTop + chartHeight;
                const barHeight = Math.max(h, item.val > 0 ? 2 : 0);

                return (
                    <g key={item.label}>
                        <rect x={groupX} y={yBase - barHeight} width={barWidth} height={barHeight} fill="#0072BC" rx={4} />
                        {item.val > 0 && (
                            <text x={groupX + barWidth / 2} y={yBase - barHeight - 5} textAnchor="middle" fontSize="10" fontWeight={600} fill="#005A94">
                                {item.val.toLocaleString("id-ID")}
                            </text>
                        )}
                        <text x={groupX + barWidth / 2} y={height - 6} textAnchor="middle" fontSize="10" fontWeight={500} fill="#64748b">
                            {item.label}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
};

export default function Pokja3({ data }: Props) {
    const [search, setSearch] = useState("");
    const items = data?.data || [];

    const filteredData = items.filter((item) =>
        ((item.kecamatan || item.nama_kecamatan || "") as string)
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const totalRumahSehat = filteredData.reduce((a, c) => a + (Number(c.rumah_sehat) || 0), 0);
    const totalRumahTidakSehat = filteredData.reduce((a, c) => a + (Number(c.rumah_tidak_sehat) || 0), 0);
    const totalPekarangan = filteredData.reduce((a, c) => a + (Number(c.pemanfaatan_pekarangan) || 0), 0);
    const totalIndustri = filteredData.reduce((a, c) => a + (Number(c.industri_rumah_tangga) || 0), 0);
    const totalKader = filteredData.reduce((a, c) => a + (Number(c.jumlah_kader) || 0), 0);
    const totalKaderP = filteredData.reduce((a, c) => a + (Number(c.jumlah_kader_p) || 0), 0);
    const totalMakananPokok = filteredData.reduce((a, c) => a + (Number(c.makanan_pokok) || 0), 0);
    const totalHatinyaPkk = filteredData.reduce((a, c) => a + (Number(c.hatinya_pkk) || 0), 0);
    const totalJumlahRumah = filteredData.reduce((a, c) => a + (Number(c.jumlah_rumah) || 0), 0);

    const chartData = [
        { label: "R. Sehat", val: totalRumahSehat },
        { label: "R. Tdk Sehat", val: totalRumahTidakSehat },
        { label: "Pekarangan", val: totalPekarangan },
        { label: "Industri RT", val: totalIndustri },
        { label: "Kader", val: totalKader },
        { label: "Makanan", val: totalMakananPokok },
        { label: "Hatinya PKK", val: totalHatinyaPkk },
        { label: "Jml Rumah", val: totalJumlahRumah },
    ];
    const maxBarVal = Math.max(...chartData.map((c) => c.val));
    const hasChartData = maxBarVal > 0;

    const totalRumah = totalRumahSehat + totalRumahTidakSehat;
    const totalRumahSafe = totalRumah || 1;
    const percentTidakSehat = (totalRumahTidakSehat / totalRumahSafe) * 100;

    // ✅ FOOTER TOTAL — baris JUMLAH di bawah tabel — persis Excel
    const totalRow = [
        totalKader,
        totalKaderP,
        totalMakananPokok,
        totalPekarangan,
        totalHatinyaPkk,
        totalIndustri,
        totalJumlahRumah,
        totalRumahSehat,
        totalRumahTidakSehat,
    ];

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 pt-14 sm:pt-16">
            <Head title="Data Pokja III - TP PKK Kab. Tasikmalaya" />
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full">
                {/* BREADCRUMB */}
                <nav className="flex items-center gap-2 text-sm text-slate-500">
                    <Link href="/" className="hover:text-[#0072BC] transition-colors">Beranda</Link>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-900 font-medium">Pokja III</span>
                </nav>

                {/* JUDUL */}
                <div>
                    <p className="text-[#0072BC] text-xs font-semibold tracking-wide uppercase mb-1">Pokja III</p>
                    <h2 className="text-2xl font-bold text-slate-900">Rekapitulasi Data Pokja III Tingkat Kecamatan</h2>
                    <p className="text-slate-500 text-sm mt-1">Pangan, Sandang, Perumahan, dan Tata Laksana Rumah Tangga.</p>
                </div>

                {/* FILTER */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row flex-wrap gap-3 items-start md:items-center justify-between">
                    <div className="flex flex-wrap gap-3 items-center">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-slate-600">Kecamatan</label>
                            <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0072BC]">
                                <option value="">Semua Kecamatan</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-slate-600">Tahun</label>
                            <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0072BC]">
                                <option value="2026">2026</option>
                                <option value="2025">2025</option>
                            </select>
                        </div>
                    </div>
                    <button type="button" className="inline-flex items-center gap-2 bg-[#0072BC] hover:bg-[#005A94] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                        <Filter size={15} /> Terapkan Filter
                    </button>
                </div>

                {/* METRIC CARDS */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Rumah Sehat</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{totalRumahSehat.toLocaleString("id-ID")}</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Home size={18} className="text-blue-600" />
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Rumah Tidak Sehat</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{totalRumahTidakSehat.toLocaleString("id-ID")}</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center">
                            <Home size={18} className="text-rose-600" />
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Pemanfaatan Pekarangan</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{totalPekarangan.toLocaleString("id-ID")}</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                            <Wheat size={18} className="text-amber-600" />
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Industri Rumah Tangga</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{totalIndustri.toLocaleString("id-ID")}</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-[#0072BC]/10 flex items-center justify-center">
                            <Building2 size={18} className="text-[#0072BC]" />
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Jumlah Kader</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{totalKader.toLocaleString("id-ID")}</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                            <Users size={18} className="text-teal-600" />
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Makanan Pokok</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{totalMakananPokok.toLocaleString("id-ID")}</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                            <Leaf size={18} className="text-green-600" />
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Hatinya PKK</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{totalHatinyaPkk.toLocaleString("id-ID")}</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                            <Sprout size={18} className="text-emerald-600" />
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Jumlah Rumah</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{totalJumlahRumah.toLocaleString("id-ID")}</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                            <Warehouse size={18} className="text-indigo-600" />
                        </div>
                    </div>
                </div>

                {/* GRAFIK */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                        <h3 className="text-base font-bold text-slate-900">Distribusi Data Pokja III</h3>
                        {!hasChartData ? (
                            <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                                <BarChart3 size={32} className="mb-2 text-slate-300" />
                                <p className="text-sm">Belum ada data untuk ditampilkan</p>
                            </div>
                        ) : (
                            <SingleSeriesBarChart data={chartData} maxValue={maxBarVal} />
                        )}
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
                        <h3 className="text-base font-bold text-slate-900 mb-2">Rasio Kondisi Rumah (Sehat / Tidak Sehat)</h3>
                        {totalRumah === 0 ? (
                            <div className="h-40 flex flex-col items-center justify-center text-slate-400">
                                <Home size={32} className="mb-2 text-slate-300" />
                                <p className="text-sm">Belum ada data untuk ditampilkan</p>
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-auto py-4">
                                <div
                                    className="w-40 h-40 rounded-full relative shadow-inner"
                                    style={{ background: `conic-gradient(#0072BC 0% ${100 - percentTidakSehat}%, #f43f5e ${100 - percentTidakSehat}% 100%)` }}
                                >
                                    <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                                        <span className="text-xs text-slate-400 font-medium">Total Rumah</span>
                                        <span className="text-sm font-bold text-slate-800">{totalRumah.toLocaleString("id-ID")}</span>
                                    </div>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="w-4 h-4 bg-[#0072BC] rounded-md"></span>
                                        <span className="text-slate-600 font-medium">Rumah Sehat:</span>
                                        <span className="font-bold text-slate-900">{totalRumahSehat.toLocaleString("id-ID")}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-4 h-4 bg-rose-500 rounded-md"></span>
                                        <span className="text-slate-600 font-medium">Rumah Tidak Sehat:</span>
                                        <span className="font-bold text-slate-900">{totalRumahTidakSehat.toLocaleString("id-ID")}</span>
                                    </div>
                                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                                        <span className="text-xs text-slate-400">Persentase Tidak Sehat</span>
                                        <span className="font-bold text-rose-600">{percentTidakSehat.toFixed(1)}%</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ============================================================
                    TABEL — HEADER BERTINGKAT, PERSIS EXCEL
                    ============================================================ */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span>Tampilkan data wilayah</span>
                        </div>
                        <div className="relative w-full sm:w-64">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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
                        <table className="w-full text-left border-collapse text-xs min-w-[1300px]">
                            <thead>
                                {/* ✅ BARIS 1 — GRUP (merge) */}
                                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                                    <th rowSpan={2} className="p-2 border-r border-slate-200 text-center font-bold sticky left-0 bg-slate-100 z-10">
                                        NO
                                    </th>
                                    <th rowSpan={2} className="p-2 border-r border-slate-200 text-center font-bold sticky left-[50px] bg-slate-100 z-10 min-w-[140px]">
                                        KECAMATAN
                                    </th>
                                    <th colSpan={2} className="p-2 border-r border-slate-200 text-center font-bold bg-teal-50">
                                        JUMLAH KADER
                                    </th>
                                    <th colSpan={3} className="p-2 border-r border-slate-200 text-center font-bold bg-amber-50">
                                        P A N G A N
                                    </th>
                                    <th rowSpan={2} className="p-2 border-r border-slate-200 text-center font-bold bg-indigo-50">
                                        JUMLAH INDUSTRI RUMAH TANGGA
                                    </th>
                                    <th colSpan={3} className="p-2 text-center font-bold bg-blue-50">
                                        JUMLAH RUMAH
                                    </th>
                                </tr>

                                {/* ✅ BARIS 2 — SUB-KOLOM */}
                                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-teal-50/50">L</th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-teal-50/50">P</th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-amber-50/50">MAKANAN POKOK</th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-amber-50/50">PEMANFAATAN PEKARANGAN</th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-amber-50/50">HATINYA PKK</th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-blue-50/50">SEHAT</th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-blue-50/50">TIDAK SEHAT</th>
                                    <th className="p-2 text-center font-semibold bg-blue-50/50">JUMLAH</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={11} className="text-center py-12 text-slate-400">
                                            Belum ada data kecamatan untuk Pokja III.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((item, idx) => (
                                        <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-2 border-r border-slate-100 text-center text-slate-500 sticky left-0 bg-white z-10">{idx + 1}</td>
                                            <td className="p-2 border-r border-slate-100 font-semibold text-slate-900 sticky left-[50px] bg-white z-10">
                                                {item.kecamatan || item.nama_kecamatan || "-"}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">{item.jumlah_kader || 0}</td>
                                            <td className="p-2 border-r border-slate-100 text-center">{item.jumlah_kader_p || 0}</td>
                                            <td className="p-2 border-r border-slate-100 text-center">{item.makanan_pokok || 0}</td>
                                            <td className="p-2 border-r border-slate-100 text-center">{item.pemanfaatan_pekarangan || 0}</td>
                                            <td className="p-2 border-r border-slate-100 text-center">{item.hatinya_pkk || 0}</td>
                                            <td className="p-2 border-r border-slate-100 text-center">{item.industri_rumah_tangga || 0}</td>
                                            <td className="p-2 border-r border-slate-100 text-center">{item.rumah_sehat || 0}</td>
                                            <td className="p-2 border-r border-slate-100 text-center">{item.rumah_tidak_sehat || 0}</td>
                                            <td className="p-2 text-center font-semibold bg-blue-50/30">
                                                {(Number(item.rumah_sehat) || 0) + (Number(item.rumah_tidak_sehat) || 0)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                            {/* ✅ FOOTER — BARIS JUMLAH */}
                            {filteredData.length > 0 && (
                                <tfoot>
                                    <tr className="bg-slate-100 font-bold text-slate-800 border-t-2 border-slate-300">
                                        <td colSpan={2} className="p-2 border-r border-slate-200 text-center sticky left-0 bg-slate-100 z-10">
                                            JUMLAH
                                        </td>
                                        {totalRow.map((val, i) => (
                                            <td key={i} className={`p-2 border-r border-slate-200 text-center ${i === 7 ? "bg-blue-50/50" : ""}`}>
                                                {val.toLocaleString("id-ID")}
                                            </td>
                                        ))}
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>

                    <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
                        <span>Menampilkan {filteredData.length} data wilayah Kabupaten Tasikmalaya</span>
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
                                                ? "border-[#0072BC] bg-[#0072BC] text-white"
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
