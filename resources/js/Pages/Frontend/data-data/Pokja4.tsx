// import React, { useState, useEffect } from "react";
// import { Head, Link, router } from "@inertiajs/react";
// import {
//     Search,
//     HeartPulse,
//     Activity,
//     ShieldPlus,
//     Users,
//     BarChart3,
//     Home,
//     Droplets,
//     Leaf,
//     PiggyBank,
//     Download,
// } from "lucide-react";

// import Navbar from "../Layouts/Navbar";
// import Footer from "../Layouts/Footer";

// interface Pokja4Item {
//     id: number;
//     kecamatan?: string;
//     nama_kecamatan?: string;
//     posyandu?: number;
//     akseptor_kb?: number;
//     phbs?: number;
//     jamban_keluarga?: number;
//     kader_kesehatan?: number;
//     kader_gizi?: number;
//     kader_kesling?: number;
//     kader_phbs?: number;
//     kader_kb?: number;
//     imunisasi?: number;
//     pkg?: number;
//     tbc?: number;
//     spal?: number;
//     tps?: number;
//     mck?: number;
//     air_pdam?: number;
//     air_sumur?: number;
//     air_lainnya?: number;
//     jumlah_pus?: number;
//     jumlah_wus?: number;
//     akseptor_kb_l?: number;
//     akseptor_kb_p?: number;
//     tabungan_keluarga?: number;
//     asuransi_kesehatan?: number;
//     program_kesehatan?: string | null;
//     program_lingkungan?: string | null;
//     program_perencanaan?: string | null;
//     [key: string]: any;
// }

// interface PaginationData {
//     data: Pokja4Item[];
//     links: any[];
//     current_page?: number;
//     last_page?: number;
//     per_page?: number;
//     total?: number;
// }

// interface Props {
//     data: PaginationData;
//     filters?: {
//         search?: string;
//         per_page?: number;
//         tahun?: string;
//     };
// }

// const SingleSeriesBarChart = ({
//     data,
//     maxValue,
// }: {
//     data: { label: string; val: number }[];
//     maxValue: number;
// }) => {
//     const width = 520;
//     const height = 240;
//     const paddingLeft = 38;
//     const paddingBottom = 26;
//     const paddingTop = 16;
//     const chartHeight = height - paddingBottom - paddingTop;
//     const groupWidth = (width - paddingLeft) / data.length;
//     const barWidth = Math.min(56, groupWidth * 0.55);

//     const yTicks = [0, 0.25, 0.5, 0.75, 1];
//     const safeMax = maxValue > 0 ? maxValue : 1;

//     return (
//         <svg
//             viewBox={`0 0 ${width} ${height}`}
//             className="w-full h-64"
//             preserveAspectRatio="xMidYMid meet"
//             role="img"
//             aria-label="Grafik distribusi data Pokja IV"
//         >
//             {yTicks.map((t) => {
//                 const y = paddingTop + chartHeight - t * chartHeight;
//                 return (
//                     <g key={t}>
//                         <line x1={paddingLeft} x2={width} y1={y} y2={y} stroke="#f1f5f9" strokeWidth={1} />
//                         <text x={paddingLeft - 8} y={y + 3} textAnchor="end" fontSize="9" fill="#94a3b8">
//                             {Math.round(t * safeMax).toLocaleString("id-ID")}
//                         </text>
//                     </g>
//                 );
//             })}

//             <line
//                 x1={paddingLeft}
//                 x2={width}
//                 y1={paddingTop + chartHeight}
//                 y2={paddingTop + chartHeight}
//                 stroke="#e2e8f0"
//                 strokeWidth={1}
//             />

//             {data.map((item, idx) => {
//                 const groupX = paddingLeft + idx * groupWidth + (groupWidth - barWidth) / 2;
//                 const h = (item.val / safeMax) * chartHeight;
//                 const yBase = paddingTop + chartHeight;
//                 const barHeight = Math.max(h, item.val > 0 ? 2 : 0);

//                 return (
//                     <g key={item.label}>
//                         <rect x={groupX} y={yBase - barHeight} width={barWidth} height={barHeight} fill="#0072BC" rx={4} />
//                         {item.val > 0 && (
//                             <text x={groupX + barWidth / 2} y={yBase - barHeight - 5} textAnchor="middle" fontSize="10" fontWeight={600} fill="#005A94">
//                                 {item.val.toLocaleString("id-ID")}
//                             </text>
//                         )}
//                         <text x={groupX + barWidth / 2} y={height - 6} textAnchor="middle" fontSize="10" fontWeight={500} fill="#64748b">
//                             {item.label}
//                         </text>
//                     </g>
//                 );
//             })}
//         </svg>
//     );
// };

// export default function Pokja4({ data, filters = {} }: Props) {
//     const [search, setSearch] = useState(filters.search || "");
//     const [tahun, setTahun] = useState(filters.tahun || "2025");
//     const items = data?.data || [];

//     // ✅ FIX: Kirim search & tahun ke backend — biar filter jalan
//     useEffect(() => {
//         const timeout = setTimeout(() => {
//             router.get('/pokja-4', { search, tahun }, {
//                 preserveState: true,
//                 preserveScroll: true,
//             });
//         }, 300);
//         return () => clearTimeout(timeout);
//     }, [search, tahun]);

//     const filteredData = items.filter((item) =>
//         (item.kecamatan || item.nama_kecamatan || "")
//             .toLowerCase()
//             .includes(search.toLowerCase())
//     );

//     const sum = (key: keyof Pokja4Item) =>
//         filteredData.reduce((a, c) => a + (Number(c[key]) || 0), 0);

//     const totalPhbs = sum("phbs");

//     // === KESEHATAN ===
//     const totalKaderKesehatan = sum("kader_kesehatan");
//     const totalKaderGizi = sum("kader_gizi");
//     const totalKaderKesling = sum("kader_kesling");
//     const totalKaderPhbs = sum("kader_phbs");
//     const totalKaderKb = sum("kader_kb");
//     const totalPosyandu = sum("posyandu");
//     const totalImunisasi = sum("imunisasi");
//     const totalPkg = sum("pkg");
//     const totalTbc = sum("tbc");

//     // === LINGKUNGAN ===
//     const totalJamban = sum("jamban_keluarga");
//     const totalSpal = sum("spal");
//     const totalTps = sum("tps");
//     const totalMck = sum("mck");
//     const totalAirPdam = sum("air_pdam");
//     const totalAirSumur = sum("air_sumur");
//     const totalAirLainnya = sum("air_lainnya");

//     // === PERENCANAAN ===
//     const totalPus = sum("jumlah_pus");
//     const totalWus = sum("jumlah_wus");
//     const totalKbL = sum("akseptor_kb_l");
//     const totalKbP = sum("akseptor_kb_p");
//     const totalTabungan = sum("tabungan_keluarga");
//     const totalAsuransi = sum("asuransi_kesehatan");

//     const chartData = [
//         { label: "Kader", val: totalKaderKesehatan + totalKaderGizi + totalKaderKesling + totalKaderPhbs + totalKaderKb },
//         { label: "Posyandu", val: totalPosyandu },
//         { label: "Imunisasi", val: totalImunisasi },
//         { label: "PKG", val: totalPkg },
//         { label: "TBC", val: totalTbc },
//         { label: "Jamban", val: totalJamban },
//         { label: "Air", val: totalAirPdam + totalAirSumur + totalAirLainnya },
//         { label: "PUS", val: totalPus },
//         { label: "WUS", val: totalWus },
//         { label: "KB", val: totalKbL + totalKbP },
//     ];
//     const maxBarVal = Math.max(...chartData.map((c) => c.val));
//     const hasChartData = maxBarVal > 0;

//     const totalRumahKesehatan = totalPhbs + totalJamban;
//     const totalRumahKesehatanSafe = totalRumahKesehatan || 1;
//     const percentJamban = (totalJamban / totalRumahKesehatanSafe) * 100;

//     return (
//         <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 pt-14 sm:pt-16">
//             <Head title="Data Pokja IV - TP PKK Kab. Tasikmalaya" />
//             <Navbar />

//             <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full">
//                 {/* Breadcrumb */}
//                 <nav className="flex items-center gap-2 text-sm text-slate-500">
//                     <Link href="/" className="hover:text-[#0072BC] transition-colors">Beranda</Link>
//                     <span className="text-slate-300">/</span>
//                     <span className="text-slate-900 font-medium">Pokja IV</span>
//                 </nav>

//                 {/* Judul */}
//                 <div>
//                     <p className="text-[#0072BC] text-xs font-semibold tracking-wide uppercase mb-1">Pokja IV</p>
//                     <h2 className="text-2xl font-bold text-slate-900">Rekapitulasi Data Pokja IV Tingkat Kecamatan</h2>
//                     <p className="text-slate-500 text-sm mt-1">Kesehatan, Kelestarian Lingkungan Hidup, dan Perencanaan Sehat.</p>
//                 </div>

//                 {/* FILTER + EXPORT */}
//                 <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row flex-wrap gap-3 items-start md:items-center justify-between">
//                     <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
//                         <div className="relative flex-1 min-w-[180px]">
//                             <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//                             <input
//                                 type="text"
//                                 value={search}
//                                 onChange={(e) => setSearch(e.target.value)}
//                                 placeholder="Cari kecamatan..."
//                                 className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#0072BC] bg-white"
//                             />
//                         </div>

//                         {/* Filter Tahun */}
//                         <div className="flex items-center gap-2">
//                             <label className="text-sm font-medium text-slate-600">Tahun</label>
//                             <select
//                                 value={tahun}
//                                 onChange={(e) => {
//                                     const newTahun = e.target.value;
//                                     setTahun(newTahun);
//                                     // ✅ Kirim ke backend — biar data refresh
//                                     router.get('/pokja-4', { tahun: newTahun, search }, {
//                                         preserveState: true,
//                                         preserveScroll: true,
//                                     });
//                                 }}
//                                 className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0072BC]"
//                             >
//                                 <option value="2026">2026</option>
//                                 <option value="2025">2025</option>
//                                 <option value="2024">2024</option>
//                             </select>
//                         </div>
//                     </div>

//                     <div className="flex flex-wrap gap-2">
//                         {search && (
//                             <button
//                                 type="button"
//                                 onClick={() => setSearch("")}
//                                 className="inline-flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
//                             >
//                                 Reset
//                             </button>
//                         )}

//                         {/* ✅ Tombol Export Excel — DOWNLOAD FILE .XLSX ASLI */}
//                         <a
//                             href={`/pokja-4/export?tahun=${tahun}`}
//                             className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
//                         >
//                             <Download size={15} />
//                             Export Excel
//                         </a>
//                     </div>
//                 </div>

//                 {/* METRIC CARDS */}
//                 <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                     <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
//                         <div>
//                             <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Posyandu</p>
//                             <p className="text-2xl font-bold text-slate-900 mt-1">{totalPosyandu.toLocaleString("id-ID")}</p>
//                         </div>
//                         <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
//                             <HeartPulse size={18} className="text-blue-600" />
//                         </div>
//                     </div>

//                     <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
//                         <div>
//                             <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Akseptor KB</p>
//                             <p className="text-2xl font-bold text-slate-900 mt-1">{(totalKbL + totalKbP).toLocaleString("id-ID")}</p>
//                         </div>
//                         <div className="w-10 h-10 rounded-lg bg-[#0072BC]/10 flex items-center justify-center">
//                             <Activity size={18} className="text-[#0072BC]" />
//                         </div>
//                     </div>

//                     <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
//                         <div>
//                             <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Rumah PHBS</p>
//                             <p className="text-2xl font-bold text-slate-900 mt-1">{totalPhbs.toLocaleString("id-ID")}</p>
//                         </div>
//                         <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
//                             <ShieldPlus size={18} className="text-amber-600" />
//                         </div>
//                     </div>

//                     <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
//                         <div>
//                             <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Jamban</p>
//                             <p className="text-2xl font-bold text-slate-900 mt-1">{totalJamban.toLocaleString("id-ID")}</p>
//                         </div>
//                         <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center">
//                             <Home size={18} className="text-rose-600" />
//                         </div>
//                     </div>

//                     <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
//                         <div>
//                             <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Kader</p>
//                             <p className="text-2xl font-bold text-slate-900 mt-1">
//                                 {(totalKaderKesehatan + totalKaderGizi + totalKaderKesling + totalKaderPhbs + totalKaderKb).toLocaleString("id-ID")}
//                             </p>
//                         </div>
//                         <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
//                             <Users size={18} className="text-teal-600" />
//                         </div>
//                     </div>

//                     <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
//                         <div>
//                             <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Imunisasi</p>
//                             <p className="text-2xl font-bold text-slate-900 mt-1">{totalImunisasi.toLocaleString("id-ID")}</p>
//                         </div>
//                         <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
//                             <Leaf size={18} className="text-green-600" />
//                         </div>
//                     </div>

//                     <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
//                         <div>
//                             <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Air Bersih</p>
//                             <p className="text-2xl font-bold text-slate-900 mt-1">
//                                 {(totalAirPdam + totalAirSumur + totalAirLainnya).toLocaleString("id-ID")}
//                             </p>
//                         </div>
//                         <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center">
//                             <Droplets size={18} className="text-cyan-600" />
//                         </div>
//                     </div>

//                     <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
//                         <div>
//                             <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tabungan Keluarga</p>
//                             <p className="text-2xl font-bold text-slate-900 mt-1">{totalTabungan.toLocaleString("id-ID")}</p>
//                         </div>
//                         <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
//                             <PiggyBank size={18} className="text-indigo-600" />
//                         </div>
//                     </div>
//                 </div>

//                 {/* GRAFIK */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                     <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
//                         <h3 className="text-base font-bold text-slate-900">Distribusi Data Pokja IV</h3>
//                         {!hasChartData ? (
//                             <div className="h-64 flex flex-col items-center justify-center text-slate-400">
//                                 <BarChart3 size={32} className="mb-2 text-slate-300" />
//                                 <p className="text-sm">Belum ada data untuk ditampilkan</p>
//                             </div>
//                         ) : (
//                             <SingleSeriesBarChart data={chartData} maxValue={maxBarVal} />
//                         )}
//                     </div>

//                     <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
//                         <h3 className="text-base font-bold text-slate-900 mb-2">Rasio PHBS & Jamban Keluarga</h3>
//                         {totalRumahKesehatan === 0 ? (
//                             <div className="h-40 flex flex-col items-center justify-center text-slate-400">
//                                 <ShieldPlus size={32} className="mb-2 text-slate-300" />
//                                 <p className="text-sm">Belum ada data untuk ditampilkan</p>
//                             </div>
//                         ) : (
//                             <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-auto py-4">
//                                 <div
//                                     className="w-40 h-40 rounded-full relative shadow-inner"
//                                     style={{ background: `conic-gradient(#0072BC 0% ${100 - percentJamban}%, #f43f5e ${100 - percentJamban}% 100%)` }}
//                                 >
//                                     <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
//                                         <span className="text-xs text-slate-400 font-medium">Total Akumulasi</span>
//                                         <span className="text-sm font-bold text-slate-800">{totalRumahKesehatan.toLocaleString("id-ID")}</span>
//                                     </div>
//                                 </div>
//                                 <div className="space-y-3 text-sm">
//                                     <div className="flex items-center gap-2">
//                                         <span className="w-4 h-4 bg-[#0072BC] rounded-md"></span>
//                                         <span className="text-slate-600 font-medium">Rumah PHBS:</span>
//                                         <span className="font-bold text-slate-900">{totalPhbs.toLocaleString("id-ID")}</span>
//                                     </div>
//                                     <div className="flex items-center gap-2">
//                                         <span className="w-4 h-4 bg-rose-500 rounded-md"></span>
//                                         <span className="text-slate-600 font-medium">Jamban Keluarga:</span>
//                                         <span className="font-bold text-slate-900">{totalJamban.toLocaleString("id-ID")}</span>
//                                     </div>
//                                     <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
//                                         <span className="text-xs text-slate-400">Persentase Jamban</span>
//                                         <span className="font-bold text-rose-600">{percentJamban.toFixed(1)}%</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* TABEL */}
//                 <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
//                     <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
//                         <div className="flex items-center gap-2 text-sm text-slate-600">
//                             <span>Tampilkan data wilayah</span>
//                         </div>
//                         <div className="relative w-full sm:w-64">
//                             <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//                             <input
//                                 type="text"
//                                 value={search}
//                                 onChange={(e) => setSearch(e.target.value)}
//                                 placeholder="Cari kecamatan..."
//                                 className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#0072BC] bg-white"
//                             />
//                         </div>
//                     </div>

//                     <div className="overflow-x-auto">
//                         <table className="w-full text-left border-collapse text-xs min-w-[1800px]">
//                             <thead>
//                                 <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
//                                     <th rowSpan={2} className="p-2 border-r border-slate-200 text-center font-bold sticky left-0 bg-slate-100 z-10 min-w-[50px]">NO</th>
//                                     <th rowSpan={2} className="p-2 border-r border-slate-200 text-center font-bold sticky left-[50px] bg-slate-100 z-10 min-w-[140px]">KECAMATAN</th>
//                                     <th colSpan={9} className="p-2 border-r border-slate-200 text-center font-bold bg-blue-50">KESEHATAN</th>
//                                     <th colSpan={7} className="p-2 border-r border-slate-200 text-center font-bold bg-green-50">KELESTARIAN LINGKUNGAN</th>
//                                     <th colSpan={6} className="p-2 border-r border-slate-200 text-center font-bold bg-amber-50">PERENCANAAN SEHAT</th>
//                                     <th colSpan={3} className="p-2 text-center font-bold bg-indigo-50">PROGRAM UNGGULAN</th>
//                                 </tr>
//                                 <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
//                                     <th className="p-2 border-r border-slate-200 text-center font-semibold bg-blue-50/50">KADER KES.</th>
//                                     <th className="p-2 border-r border-slate-200 text-center font-semibold bg-blue-50/50">GIZI</th>
//                                     <th className="p-2 border-r border-slate-200 text-center font-semibold bg-blue-50/50">KESLING</th>
//                                     <th className="p-2 border-r border-slate-200 text-center font-semibold bg-blue-50/50">PHBS</th>
//                                     <th className="p-2 border-r border-slate-200 text-center font-semibold bg-blue-50/50">KB</th>
//                                     <th className="p-2 border-r border-slate-200 text-center font-semibold bg-blue-50/50">POSYANDU</th>
//                                     <th className="p-2 border-r border-slate-200 text-center font-semibold bg-blue-50/50">IMUNISASI</th>
//                                     <th className="p-2 border-r border-slate-200 text-center font-semibold bg-blue-50/50">PKG</th>
//                                     <th className="p-2 border-r border-slate-200 text-center font-semibold bg-blue-50/50">TBC</th>
//                                     <th className="p-2 border-r border-slate-200 text-center font-semibold bg-green-50/50">JAMBAN</th>
//                                     <th className="p-2 border-r border-slate-200 text-center font-semibold bg-green-50/50">SPAL</th>
//                                     <th className="p-2 border-r border-slate-200 text-center font-semibold bg-green-50/50">TPS</th>
//                                     <th className="p-2 border-r border-slate-200 text-center font-semibold bg-green-50/50">MCK</th>
//                                     <th className="p-2 border-r border-slate-200 text-center font-semibold bg-green-50/50">AIR PDAM</th>
//                                     <th className="p-2 border-r border-slate-200 text-center font-semibold bg-green-50/50">AIR SUMUR</th>
//                                     <th className="p-2 border-r border-slate-200 text-center font-semibold bg-green-50/50">AIR LAIN</th>
//                                     <th className="p-2 border-r border-slate-200 text-center font-semibold bg-amber-50/50">PUS</th>
//                                     <th className="p-2 border-r border-slate-200 text-center font-semibold bg-amber-50/50">WUS</th>
//                                     <th className="p-2 border-r border-slate-200 text-center font-semibold bg-amber-50/50">KB L</th>
//                                     <th className="p-2 border-r border-slate-200 text-center font-semibold bg-amber-50/50">KB P</th>
//                                     <th className="p-2 border-r border-slate-200 text-center font-semibold bg-amber-50/50">TABUNGAN</th>
//                                     <th className="p-2 border-r border-slate-200 text-center font-semibold bg-amber-50/50">ASURANSI</th>
//                                     <th className="p-2 border-r border-slate-200 text-center font-semibold bg-indigo-50/50">KESEHATAN</th>
//                                     <th className="p-2 border-r border-slate-200 text-center font-semibold bg-indigo-50/50">LINGKUNGAN</th>
//                                     <th className="p-2 text-center font-semibold bg-indigo-50/50">PERENCANAAN</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-slate-100 text-slate-700">
//                                 {filteredData.length === 0 ? (
//                                     <tr>
//                                         <td colSpan={27} className="text-center py-12 text-slate-400">
//                                             Belum ada data kecamatan untuk Pokja IV.
//                                         </td>
//                                     </tr>
//                                 ) : (
//                                     filteredData.map((item, idx) => (
//                                         <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors">
//                                             <td className="p-2 border-r border-slate-100 text-center text-slate-500 sticky left-0 bg-white z-10">{idx + 1}</td>
//                                             <td className="p-2 border-r border-slate-100 font-semibold text-slate-900 sticky left-[50px] bg-white z-10">
//                                                 {item.nama_kecamatan || item.kecamatan || "-"}
//                                             </td>
//                                             <td className="p-2 border-r border-slate-100 text-center">{item.kader_kesehatan || 0}</td>
//                                             <td className="p-2 border-r border-slate-100 text-center">{item.kader_gizi || 0}</td>
//                                             <td className="p-2 border-r border-slate-100 text-center">{item.kader_kesling || 0}</td>
//                                             <td className="p-2 border-r border-slate-100 text-center">{item.kader_phbs || 0}</td>
//                                             <td className="p-2 border-r border-slate-100 text-center">{item.kader_kb || 0}</td>
//                                             <td className="p-2 border-r border-slate-100 text-center">{item.posyandu || 0}</td>
//                                             <td className="p-2 border-r border-slate-100 text-center">{item.imunisasi || 0}</td>
//                                             <td className="p-2 border-r border-slate-100 text-center">{item.pkg || 0}</td>
//                                             <td className="p-2 border-r border-slate-100 text-center">{item.tbc || 0}</td>
//                                             <td className="p-2 border-r border-slate-100 text-center">{item.jamban_keluarga || 0}</td>
//                                             <td className="p-2 border-r border-slate-100 text-center">{item.spal || 0}</td>
//                                             <td className="p-2 border-r border-slate-100 text-center">{item.tps || 0}</td>
//                                             <td className="p-2 border-r border-slate-100 text-center">{item.mck || 0}</td>
//                                             <td className="p-2 border-r border-slate-100 text-center">{item.air_pdam || 0}</td>
//                                             <td className="p-2 border-r border-slate-100 text-center">{item.air_sumur || 0}</td>
//                                             <td className="p-2 border-r border-slate-100 text-center">{item.air_lainnya || 0}</td>
//                                             <td className="p-2 border-r border-slate-100 text-center">{item.jumlah_pus || 0}</td>
//                                             <td className="p-2 border-r border-slate-100 text-center">{item.jumlah_wus || 0}</td>
//                                             <td className="p-2 border-r border-slate-100 text-center">{item.akseptor_kb_l || 0}</td>
//                                             <td className="p-2 border-r border-slate-100 text-center">{item.akseptor_kb_p || 0}</td>
//                                             <td className="p-2 border-r border-slate-100 text-center">{item.tabungan_keluarga || 0}</td>
//                                             <td className="p-2 border-r border-slate-100 text-center">{item.asuransi_kesehatan || 0}</td>
//                                             <td className="p-2 border-r border-slate-100 text-center font-bold text-[#0072BC]">{item.program_kesehatan || "V"}</td>
//                                             <td className="p-2 border-r border-slate-100 text-center font-bold text-[#0072BC]">{item.program_lingkungan || "V"}</td>
//                                             <td className="p-2 text-center font-bold text-[#0072BC]">{item.program_perencanaan || "V"}</td>
//                                         </tr>
//                                     ))
//                                 )}
//                             </tbody>
//                             {filteredData.length > 0 && (
//                                 <tfoot>
//                                     <tr className="bg-slate-100 font-bold text-slate-800 border-t-2 border-slate-300">
//                                         <td colSpan={2} className="p-2 border-r border-slate-200 text-center sticky left-0 bg-slate-100 z-10">JUMLAH</td>
//                                         <td className="p-2 border-r border-slate-200 text-center">{totalKaderKesehatan}</td>
//                                         <td className="p-2 border-r border-slate-200 text-center">{totalKaderGizi}</td>
//                                         <td className="p-2 border-r border-slate-200 text-center">{totalKaderKesling}</td>
//                                         <td className="p-2 border-r border-slate-200 text-center">{totalKaderPhbs}</td>
//                                         <td className="p-2 border-r border-slate-200 text-center">{totalKaderKb}</td>
//                                         <td className="p-2 border-r border-slate-200 text-center">{totalPosyandu}</td>
//                                         <td className="p-2 border-r border-slate-200 text-center">{totalImunisasi}</td>
//                                         <td className="p-2 border-r border-slate-200 text-center">{totalPkg}</td>
//                                         <td className="p-2 border-r border-slate-200 text-center">{totalTbc}</td>
//                                         <td className="p-2 border-r border-slate-200 text-center">{totalJamban}</td>
//                                         <td className="p-2 border-r border-slate-200 text-center">{totalSpal}</td>
//                                         <td className="p-2 border-r border-slate-200 text-center">{totalTps}</td>
//                                         <td className="p-2 border-r border-slate-200 text-center">{totalMck}</td>
//                                         <td className="p-2 border-r border-slate-200 text-center">{totalAirPdam}</td>
//                                         <td className="p-2 border-r border-slate-200 text-center">{totalAirSumur}</td>
//                                         <td className="p-2 border-r border-slate-200 text-center">{totalAirLainnya}</td>
//                                         <td className="p-2 border-r border-slate-200 text-center">{totalPus}</td>
//                                         <td className="p-2 border-r border-slate-200 text-center">{totalWus}</td>
//                                         <td className="p-2 border-r border-slate-200 text-center">{totalKbL}</td>
//                                         <td className="p-2 border-r border-slate-200 text-center">{totalKbP}</td>
//                                         <td className="p-2 border-r border-slate-200 text-center">{totalTabungan}</td>
//                                         <td className="p-2 border-r border-slate-200 text-center">{totalAsuransi}</td>
//                                         <td className="p-2 border-r border-slate-200 text-center">-</td>
//                                         <td className="p-2 border-r border-slate-200 text-center">-</td>
//                                         <td className="p-2 text-center">-</td>
//                                     </tr>
//                                 </tfoot>
//                             )}
//                         </table>
//                     </div>

//                     <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
//                         <span>Menampilkan {filteredData.length} data wilayah Kabupaten Tasikmalaya</span>
//                         <div className="flex gap-1">
//                             {data?.links && data.links.map((link, index) => {
//                                 if (!link.url) {
//                                     return (
//                                         <span
//                                             key={index}
//                                             className="px-3 py-1.5 border border-slate-200 rounded-lg bg-slate-100 text-slate-400 font-medium cursor-not-allowed"
//                                             dangerouslySetInnerHTML={{ __html: link.label }}
//                                         />
//                                     );
//                                 }
//                                 return (
//                                     <Link
//                                         key={index}
//                                         href={link.url}
//                                         className={`px-3 py-1.5 border rounded-lg font-medium transition-colors ${
//                                             link.active
//                                                 ? "border-[#0072BC] bg-[#0072BC] text-white"
//                                                 : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
//                                         }`}
//                                         dangerouslySetInnerHTML={{ __html: link.label }}
//                                     />
//                                 );
//                             })}
//                         </div>
//                     </div>
//                 </div>
//             </main>

//             <Footer />
//         </div>
//     );
// }
