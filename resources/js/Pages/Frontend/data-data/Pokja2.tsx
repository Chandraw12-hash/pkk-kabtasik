import React, { useState, useEffect, useRef } from "react";
import { Head, Link } from "@inertiajs/react";
import {
    Search,
    Filter,
    GraduationCap,
    BookOpenCheck,
    Store,
    Users,
    ChevronLeft,
    ChevronRight,
    BarChart3,
    Home,
    Wheat,
    Sprout,
    Warehouse,
} from "lucide-react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import axios from "axios";

interface Pokja2Item {
    id: number;
    kecamatan?: string;
    nama_kecamatan?: string;
    // Lama
    warga_buta_l?: number;
    warga_buta_p?: number;
    kelompok_belajar_paket_a?: number;
    kelompok_belajar_paket_b?: number;
    kelompok_belajar_paket_c?: number;
    kf?: number;
    paud?: number;
    koperasi_berbadan_hukum?: number;
    // ✅ Baru — dari PDF
    warga_belajar_paket_a?: number;
    warga_belajar_paket_b?: number;
    warga_belajar_paket_c?: number;
    warga_belajar_kf?: number;
    taman_bacaan?: number;
    kelompok_bkb?: number;
    peserta_bkb?: number;
    ape_bkb?: number;
    kelompok_simulasi_bkb?: number;
    tutor_kf?: number;
    tutor_paud?: number;
    kader_bkb?: number;
    kelompok_kader_koperasi?: number;
    kader_keterampilan?: number;
    kader_dilatih_pengelolaan?: number;
    kader_dilatih_tp_pkk?: number;
    kader_dilatih_damas?: number;
    up2k_pemula_kelompok?: number;
    up2k_pemula_peserta?: number;
    up2k_madya_kelompok?: number;
    up2k_madya_peserta?: number;
    up2k_utama_kelompok?: number;
    up2k_utama_peserta?: number;
    up2k_mandiri_kelompok?: number;
    up2k_mandiri_peserta?: number;
    anggota_koperasi?: number;
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

    // ==================== KALKULASI ====================
    const sum = (key: keyof Pokja2Item) =>
        items.reduce((a, c) => a + (Number(c[key]) || 0), 0);

    // Lama
    const totalPaud = sum("paud");
    const totalPaketA = sum("kelompok_belajar_paket_a");
    const totalPaketB = sum("kelompok_belajar_paket_b");
    const totalPaketC = sum("kelompok_belajar_paket_c");
    const totalPaket = totalPaketA + totalPaketB + totalPaketC;
    const totalKoperasi = sum("koperasi_berbadan_hukum");
    const totalKF = sum("kf");
    const sumButaL = sum("warga_buta_l");
    const sumButaP = sum("warga_buta_p");
    const totalWargaButa = sumButaL + sumButaP;

    // ✅ Baru
    const totalWargaBelajarPaketA = sum("warga_belajar_paket_a");
    const totalWargaBelajarPaketB = sum("warga_belajar_paket_b");
    const totalWargaBelajarPaketC = sum("warga_belajar_paket_c");
    const totalWargaBelajarKF = sum("warga_belajar_kf");
    const totalTamanBacaan = sum("taman_bacaan");
    const totalKelompokBKB = sum("kelompok_bkb");
    const totalPesertaBKB = sum("peserta_bkb");
    const totalApeBKB = sum("ape_bkb");
    const totalSimulasiBKB = sum("kelompok_simulasi_bkb");
    const totalTutorKF = sum("tutor_kf");
    const totalTutorPAUD = sum("tutor_paud");
    const totalKaderBKB = sum("kader_bkb");
    const totalKaderKoperasi = sum("kelompok_kader_koperasi");
    const totalKaderKeterampilan = sum("kader_keterampilan");
    const totalKaderDilatihPengelolaan = sum("kader_dilatih_pengelolaan");
    const totalKaderDilatihTPPKK = sum("kader_dilatih_tp_pkk");
    const totalKaderDilatihDamas = sum("kader_dilatih_damas");
    const totalUp2kPemulaKelompok = sum("up2k_pemula_kelompok");
    const totalUp2kPemulaPeserta = sum("up2k_pemula_peserta");
    const totalUp2kMadyaKelompok = sum("up2k_madya_kelompok");
    const totalUp2kMadyaPeserta = sum("up2k_madya_peserta");
    const totalUp2kUtamaKelompok = sum("up2k_utama_kelompok");
    const totalUp2kUtamaPeserta = sum("up2k_utama_peserta");
    const totalUp2kMandiriKelompok = sum("up2k_mandiri_kelompok");
    const totalUp2kMandiriPeserta = sum("up2k_mandiri_peserta");
    const totalAnggotaKoperasi = sum("anggota_koperasi");

    const totalGender = totalWargaButa || 1;
    const percentP = (sumButaP / totalGender) * 100;

    // Chart — 8 kategori ringkasan
    const chartData = [
        { label: "PAUD", val: totalPaud },
        { label: "Kel. Belajar", val: totalPaket },
        { label: "Warga Belajar", val: totalWargaBelajarPaketA + totalWargaBelajarPaketB + totalWargaBelajarPaketC + totalWargaBelajarKF },
        { label: "KF", val: totalKF },
        { label: "Buta Aksara", val: totalWargaButa },
        { label: "BKB", val: totalKelompokBKB },
        { label: "Kader", val: totalTutorKF + totalTutorPAUD + totalKaderBKB + totalKaderKoperasi + totalKaderKeterampilan + totalKaderDilatihPengelolaan + totalKaderDilatihTPPKK + totalKaderDilatihDamas },
        { label: "UP2K", val: totalUp2kPemulaKelompok + totalUp2kMadyaKelompok + totalUp2kUtamaKelompok + totalUp2kMandiriKelompok },
        { label: "Koperasi", val: totalKoperasi },
    ];
    const maxBarVal = Math.max(...chartData.map((c) => c.val));
    const hasChartData = maxBarVal > 0;

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 pt-14 sm:pt-16">
            <Head>
                <title>Data Pokja II - TP PKK Kab. Tasikmalaya</title>
                <meta name="description" content="Data rekapitulasi Pokja II PKK Kabupaten Tasikmalaya - Pendidikan, Keterampilan, dan Pengembangan Kehidupan Berkoperasi." />
            </Head>

            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full">
                {/* BREADCRUMB */}
                <nav className="flex items-center gap-2 text-sm text-slate-500">
                    <Link href="/" className="hover:text-[#0072BC] transition-colors">Beranda</Link>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-900 font-medium">Pokja II</span>
                </nav>

                {/* JUDUL */}
                <div>
                    <p className="text-[#0072BC] text-xs font-semibold tracking-wide uppercase mb-1">Pokja II</p>
                    <h2 className="text-2xl font-bold text-slate-900">Rekapitulasi Data Pokja II Tingkat Kecamatan</h2>
                    <p className="text-slate-500 text-sm mt-1">Pendidikan, Keterampilan, dan Pengembangan Kehidupan Berkoperasi.</p>
                </div>

                {/* FILTER */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row flex-wrap gap-3 items-start md:items-center justify-between">
                    <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
                        <div className="relative flex-1 min-w-[180px]">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari kecamatan..."
                                className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#0072BC] bg-white"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-slate-600">Tampilkan</label>
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

                {/* METRIC CARDS — 8 */}
                {!isLoading && (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total PAUD</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{totalPaud.toLocaleString("id-ID")}</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                <GraduationCap size={18} className="text-blue-600" />
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Kelompok Belajar</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{totalPaket.toLocaleString("id-ID")}</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                                <BookOpenCheck size={18} className="text-amber-600" />
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Warga Buta</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{totalWargaButa.toLocaleString("id-ID")}</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center">
                                <Users size={18} className="text-rose-600" />
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Koperasi</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{totalKoperasi.toLocaleString("id-ID")}</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-[#0072BC]/10 flex items-center justify-center">
                                <Store size={18} className="text-[#0072BC]" />
                            </div>
                        </div>

                        {/* ✅ BARU */}
                        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Taman Bacaan</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{totalTamanBacaan.toLocaleString("id-ID")}</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                                <BookOpenCheck size={18} className="text-teal-600" />
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Kelompok BKB</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{totalKelompokBKB.toLocaleString("id-ID")}</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                                <Home size={18} className="text-green-600" />
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Kader Terlatih</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">
                                    {(totalTutorKF + totalTutorPAUD + totalKaderBKB + totalKaderKoperasi + totalKaderKeterampilan + totalKaderDilatihPengelolaan + totalKaderDilatihTPPKK + totalKaderDilatihDamas).toLocaleString("id-ID")}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                                <Sprout size={18} className="text-emerald-600" />
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">UP2K</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">
                                    {(totalUp2kPemulaKelompok + totalUp2kMadyaKelompok + totalUp2kUtamaKelompok + totalUp2kMandiriKelompok).toLocaleString("id-ID")}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                                <Warehouse size={18} className="text-indigo-600" />
                            </div>
                        </div>
                    </div>
                )}

                {/* GRAFIK */}
                {!isLoading && items.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                            <h3 className="text-base font-bold text-slate-900">Distribusi Data Pokja II</h3>
                            {!hasChartData ? (
                                <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                                    <BarChart3 size={32} className="mb-2 text-slate-300" />
                                    <p className="text-sm">Belum ada data untuk ditampilkan</p>
                                </div>
                            ) : (
                                <SingleSeriesBarChart data={chartData} maxValue={maxBarVal} />
                            )}
                        </div>

                        {/* Pie Chart */}
                        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
                            <h3 className="text-base font-bold text-slate-900 mb-2">Komposisi Warga Buta Aksara (L / P)</h3>
                            {totalWargaButa === 0 ? (
                                <div className="h-40 flex flex-col items-center justify-center text-slate-400">
                                    <Users size={32} className="mb-2 text-slate-300" />
                                    <p className="text-sm">Belum ada data untuk ditampilkan</p>
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-auto py-4">
                                    <div
                                        className="w-40 h-40 rounded-full relative shadow-inner"
                                        style={{ background: `conic-gradient(#0072BC 0% ${100 - percentP}%, #f43f5e ${100 - percentP}% 100%)` }}
                                    >
                                        <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                                            <span className="text-xs text-slate-400 font-medium">Total</span>
                                            <span className="text-sm font-bold text-slate-800">{totalWargaButa.toLocaleString("id-ID")}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="w-4 h-4 bg-[#0072BC] rounded-md"></span>
                                            <span className="text-slate-600 font-medium">Laki-laki:</span>
                                            <span className="font-bold text-slate-900">{sumButaL.toLocaleString("id-ID")}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-4 h-4 bg-rose-500 rounded-md"></span>
                                            <span className="text-slate-600 font-medium">Perempuan:</span>
                                            <span className="font-bold text-slate-900">{sumButaP.toLocaleString("id-ID")}</span>
                                        </div>
                                        <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                                            <span className="text-xs text-slate-400">Persentase P</span>
                                            <span className="font-bold text-[#0072BC]">{percentP.toFixed(1)}%</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ============================================================
                    TABEL — HEADER BERTINGKAT, PERSIS PDF
                    ============================================================ */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-slate-200">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span>Tampilkan data wilayah</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs min-w-[2400px]">
                            <thead>
                                {/* BARIS 1 — GRUP */}
                                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                                    <th rowSpan={2} className="p-2 border-r border-slate-200 text-center font-bold sticky left-0 bg-slate-100 z-10 min-w-[50px]">NO</th>
                                    <th rowSpan={2} className="p-2 border-r border-slate-200 text-center font-bold sticky left-[50px] bg-slate-100 z-10 min-w-[140px]">KECAMATAN</th>

                                    {/* PendidikAN */}
                                    <th colSpan={2} className="p-2 border-r border-slate-200 text-center font-bold bg-blue-50">WARGA BUTA</th>
                                    <th colSpan={2} className="p-2 border-r border-slate-200 text-center font-bold bg-blue-50">PAKET A</th>
                                    <th colSpan={2} className="p-2 border-r border-slate-200 text-center font-bold bg-blue-50">PAKET B</th>
                                    <th colSpan={2} className="p-2 border-r border-slate-200 text-center font-bold bg-blue-50">PAKET C</th>
                                    <th colSpan={2} className="p-2 border-r border-slate-200 text-center font-bold bg-blue-50">KF</th>
                                    <th rowSpan={2} className="p-2 border-r border-slate-200 text-center font-bold bg-blue-50">PAUD</th>
                                    <th rowSpan={2} className="p-2 border-r border-slate-200 text-center font-bold bg-blue-50">TAMAN BACAAN</th>

                                    {/* Kesehatan */}
                                    <th colSpan={4} className="p-2 border-r border-slate-200 text-center font-bold bg-green-50">BKB</th>

                                    {/* Kader */}
                                    <th colSpan={8} className="p-2 border-r border-slate-200 text-center font-bold bg-amber-50">KADER</th>

                                    {/* UP2K */}
                                    <th colSpan={8} className="p-2 border-r border-slate-200 text-center font-bold bg-indigo-50">UP2K-PKK</th>

                                    {/* Koperasi */}
                                    <th colSpan={2} className="p-2 text-center font-bold bg-teal-50">KOPERASI</th>
                                </tr>

                                {/* BARIS 2 — SUB-KOLOM */}
                                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-blue-50/50">L</th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-blue-50/50">P</th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-blue-50/50">KLP</th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-blue-50/50">WARGA</th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-blue-50/50">KLP</th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-blue-50/50">WARGA</th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-blue-50/50">KLP</th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-blue-50/50">WARGA</th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-blue-50/50">KLP</th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-blue-50/50">WARGA</th>

                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-green-50/50">KLP</th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-green-50/50">PESERTA</th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-green-50/50">APE</th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-green-50/50">SIMULASI</th>

                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-amber-50/50">TUTOR KF</th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-amber-50/50">TUTOR PAUD</th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-amber-50/50">KADER BKB</th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-amber-50/50">KOPERASI</th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-amber-50/50">KETRAMPILAN</th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-amber-50/50">DILATIH PENGELOLAAN</th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-amber-50/50">DILATIH TP PKK</th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-amber-50/50">DILATIH DAMAS</th>

                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-indigo-50/50">PEMULA KLP</th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-indigo-50/50">PEMULA PESERTA</th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-indigo-50/50">MADYA KLP</th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-indigo-50/50">MADYA PESERTA</th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-indigo-50/50">UTAMA KLP</th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-indigo-50/50">UTAMA PESERTA</th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-indigo-50/50">MANDIRI KLP</th>
                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-indigo-50/50">MANDIRI PESERTA</th>

                                    <th className="p-2 border-r border-slate-200 text-center font-semibold bg-teal-50/50">BERBADAN HUKUM</th>
                                    <th className="p-2 text-center font-semibold bg-teal-50/50">ANGGOTA</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {items.length === 0 ? (
                                    <tr>
                                        <td colSpan={33} className="text-center py-12 text-slate-400">
                                            {isLoading ? "Memuat data..." : "Belum ada data kecamatan untuk Pokja II."}
                                        </td>
                                    </tr>
                                ) : (
                                    items.map((item, idx) => (
                                        <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-2 border-r border-slate-100 text-center text-slate-500 sticky left-0 bg-white z-10">{idx + 1}</td>
                                            <td className="p-2 border-r border-slate-100 font-semibold text-slate-900 sticky left-[50px] bg-white z-10">
                                                {item.nama_kecamatan || item.kecamatan || "-"}
                                            </td>

                                            <td className="p-2 border-r border-slate-100 text-center">{item.warga_buta_l || 0}</td>
                                            <td className="p-2 border-r border-slate-100 text-center">{item.warga_buta_p || 0}</td>

                                            <td className="p-2 border-r border-slate-100 text-center">{item.kelompok_belajar_paket_a || 0}</td>
                                            <td className="p-2 border-r border-slate-100 text-center">{item.warga_belajar_paket_a || 0}</td>

                                            <td className="p-2 border-r border-slate-100 text-center">{item.kelompok_belajar_paket_b || 0}</td>
                                            <td className="p-2 border-r border-slate-100 text-center">{item.warga_belajar_paket_b || 0}</td>

                                            <td className="p-2 border-r border-slate-100 text-center">{item.kelompok_belajar_paket_c || 0}</td>
                                            <td className="p-2 border-r border-slate-100 text-center">{item.warga_belajar_paket_c || 0}</td>

                                            <td className="p-2 border-r border-slate-100 text-center">{item.kf || 0}</td>
                                            <td className="p-2 border-r border-slate-100 text-center">{item.warga_belajar_kf || 0}</td>

                                            <td className="p-2 border-r border-slate-100 text-center">{item.paud || 0}</td>
                                            <td className="p-2 border-r border-slate-100 text-center">{item.taman_bacaan || 0}</td>

                                            <td className="p-2 border-r border-slate-100 text-center">{item.kelompok_bkb || 0}</td>
                                            <td className="p-2 border-r border-slate-100 text-center">{item.peserta_bkb || 0}</td>
                                            <td className="p-2 border-r border-slate-100 text-center">{item.ape_bkb || 0}</td>
                                            <td className="p-2 border-r border-slate-100 text-center">{item.kelompok_simulasi_bkb || 0}</td>

                                            <td className="p-2 border-r border-slate-100 text-center">{item.tutor_kf || 0}</td>
                                            <td className="p-2 border-r border-slate-100 text-center">{item.tutor_paud || 0}</td>
                                            <td className="p-2 border-r border-slate-100 text-center">{item.kader_bkb || 0}</td>
                                            <td className="p-2 border-r border-slate-100 text-center">{item.kelompok_kader_koperasi || 0}</td>
                                            <td className="p-2 border-r border-slate-100 text-center">{item.kader_keterampilan || 0}</td>
                                            <td className="p-2 border-r border-slate-100 text-center">{item.kader_dilatih_pengelolaan || 0}</td>
                                            <td className="p-2 border-r border-slate-100 text-center">{item.kader_dilatih_tp_pkk || 0}</td>
                                            <td className="p-2 border-r border-slate-100 text-center">{item.kader_dilatih_damas || 0}</td>

                                            <td className="p-2 border-r border-slate-100 text-center">{item.up2k_pemula_kelompok || 0}</td>
                                            <td className="p-2 border-r border-slate-100 text-center">{item.up2k_pemula_peserta || 0}</td>
                                            <td className="p-2 border-r border-slate-100 text-center">{item.up2k_madya_kelompok || 0}</td>
                                            <td className="p-2 border-r border-slate-100 text-center">{item.up2k_madya_peserta || 0}</td>
                                            <td className="p-2 border-r border-slate-100 text-center">{item.up2k_utama_kelompok || 0}</td>
                                            <td className="p-2 border-r border-slate-100 text-center">{item.up2k_utama_peserta || 0}</td>
                                            <td className="p-2 border-r border-slate-100 text-center">{item.up2k_mandiri_kelompok || 0}</td>
                                            <td className="p-2 border-r border-slate-100 text-center">{item.up2k_mandiri_peserta || 0}</td>

                                            <td className="p-2 border-r border-slate-100 text-center">{item.koperasi_berbadan_hukum || 0}</td>
                                            <td className="p-2 text-center">{item.anggota_koperasi || 0}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>

                            {/* FOOTER — JUMLAH */}
                            {items.length > 0 && (
                                <tfoot>
                                    <tr className="bg-slate-100 font-bold text-slate-800 border-t-2 border-slate-300">
                                        <td colSpan={2} className="p-2 border-r border-slate-200 text-center sticky left-0 bg-slate-100 z-10">JUMLAH</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{sumButaL}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{sumButaP}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{totalPaketA}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{totalWargaBelajarPaketA}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{totalPaketB}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{totalWargaBelajarPaketB}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{totalPaketC}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{totalWargaBelajarPaketC}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{totalKF}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{totalWargaBelajarKF}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{totalPaud}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{totalTamanBacaan}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{totalKelompokBKB}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{totalPesertaBKB}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{totalApeBKB}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{totalSimulasiBKB}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{totalTutorKF}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{totalTutorPAUD}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{totalKaderBKB}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{totalKaderKoperasi}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{totalKaderKeterampilan}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{totalKaderDilatihPengelolaan}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{totalKaderDilatihTPPKK}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{totalKaderDilatihDamas}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{totalUp2kPemulaKelompok}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{totalUp2kPemulaPeserta}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{totalUp2kMadyaKelompok}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{totalUp2kMadyaPeserta}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{totalUp2kUtamaKelompok}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{totalUp2kUtamaPeserta}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{totalUp2kMandiriKelompok}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{totalUp2kMandiriPeserta}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{totalKoperasi}</td>
                                        <td className="p-2 text-center">{totalAnggotaKoperasi}</td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>

                    {/* Pagination */}
                    {localData?.last_page > 1 && (
                        <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
                            <span>Menampilkan {items.length} dari {localData.total || 0} data</span>
                            <div className="flex gap-1">
                                <button
                                    type="button"
                                    onClick={() => { if (localData.current_page > 1) handlePageChange(`?page=${localData.current_page - 1}`); }}
                                    disabled={localData.current_page <= 1}
                                    className={`px-3 py-1.5 border border-slate-200 rounded-lg bg-white font-medium ${localData.current_page <= 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50"}`}
                                >
                                    <ChevronLeft size={14} />
                                </button>
                                <span className="px-3 py-1.5 border border-[#0072BC] rounded-lg bg-[#0072BC] text-white font-medium">
                                    {localData.current_page || 1}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => { if (localData.current_page < localData.last_page) handlePageChange(`?page=${localData.current_page + 1}`); }}
                                    disabled={localData.current_page >= localData.last_page}
                                    className={`px-3 py-1.5 border border-slate-200 rounded-lg bg-white font-medium ${localData.current_page >= localData.last_page ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50"}`}
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
