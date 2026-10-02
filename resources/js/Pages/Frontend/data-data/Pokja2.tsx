import React, { useState, useEffect, useRef } from "react";
import { Head, Link } from "@inertiajs/react";
import {
    Search,
    ChevronLeft,
    ChevronRight,
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

    // Baru
    warga_belajar_paket_a?: number;
    warga_belajar_paket_b?: number;
    warga_belajar_paket_c?: number;
    warga_belajar_kf?: number;
    taman_bacaan?: number;
    kelompok_bkb?: number;
    peserta_bkb?: number;
    ibu_set_bkb?: number;
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
    lp3_pkk?: number;
    tp3_pkk?: number;
    damas_pkk?: number;
    up2k_pemula_kelompok?: number;
    up2k_pemula_peserta?: number;
    up2k_madya_kelompok?: number;
    up2k_madya_peserta?: number;
    up2k_utama_kelompok?: number;
    up2k_utama_peserta?: number;
    up2k_mandiri_kelompok?: number;
    up2k_mandiri_peserta?: number;
    anggota_koperasi?: number;
    keterangan?: string | null;

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
// MAIN COMPONENT
// ============================================================

export default function Pokja2({ data, filters = {} }: Props) {
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

    // ========================================================
    // KALKULASI
    // ========================================================
    const sum = (key: keyof Pokja2Item) =>
        items.reduce((a, c) => a + (Number(c[key]) || 0), 0);

    // PENDIDIKAN
    const totalWargaButa = sum("warga_buta_l") + sum("warga_buta_p");
    const totalPaketA = sum("kelompok_belajar_paket_a");
    const totalWargaBelajarPaketA = sum("warga_belajar_paket_a");
    const totalPaketB = sum("kelompok_belajar_paket_b");
    const totalWargaBelajarPaketB = sum("warga_belajar_paket_b");
    const totalPaketC = sum("kelompok_belajar_paket_c");
    const totalWargaBelajarPaketC = sum("warga_belajar_paket_c");
    const totalKF = sum("kf");
    const totalWargaBelajarKF = sum("warga_belajar_kf");
    const totalPaud = sum("paud");
    const totalTamanBacaan = sum("taman_bacaan");

    // KADER
    const totalKelompokBKB = sum("kelompok_bkb");
    const totalPesertaBKB = sum("peserta_bkb");
    const totalIbuSetBKB = sum("ibu_set_bkb");
    const totalApeBKB = sum("ape_bkb");
    const totalSimulasiBKB = sum("kelompok_simulasi_bkb");
    const totalTutorKF = sum("tutor_kf");
    const totalTutorPAUD = sum("tutor_paud");
    const totalKaderBKB = sum("kader_bkb");
    const totalKaderKoperasi = sum("kelompok_kader_koperasi");
    const totalKaderKeterampilan = sum("kader_keterampilan");
    const totalLp3Pkk = sum("lp3_pkk");
    const totalTp3Pkk = sum("tp3_pkk");
    const totalDamasPkk = sum("damas_pkk");

    // KOPERASI
    const totalUp2kPemulaKelompok = sum("up2k_pemula_kelompok");
    const totalUp2kPemulaPeserta = sum("up2k_pemula_peserta");
    const totalUp2kMadyaKelompok = sum("up2k_madya_kelompok");
    const totalUp2kMadyaPeserta = sum("up2k_madya_peserta");
    const totalUp2kUtamaKelompok = sum("up2k_utama_kelompok");
    const totalUp2kUtamaPeserta = sum("up2k_utama_peserta");
    const totalUp2kMandiriKelompok = sum("up2k_mandiri_kelompok");
    const totalUp2kMandiriPeserta = sum("up2k_mandiri_peserta");
    const totalKoperasi = sum("koperasi_berbadan_hukum");
    const totalAnggotaKoperasi = sum("anggota_koperasi");

    const chartData = [
        { label: "PAUD", value: totalPaud },
        { label: "Kel. Belajar", value: totalPaketA + totalPaketB + totalPaketC },
        { label: "Warga Buta", value: totalWargaButa },
        { label: "Koperasi", value: totalKoperasi },
        { label: "Taman Bacaan", value: totalTamanBacaan },
        { label: "Kel. BKB", value: totalKelompokBKB },
        {
            label: "Kader",
            value:
                totalTutorKF +
                totalTutorPAUD +
                totalKaderBKB +
                totalKaderKoperasi +
                totalKaderKeterampilan +
                totalLp3Pkk +
                totalTp3Pkk +
                totalDamasPkk,
        },
        {
            label: "UP2K",
            value:
                totalUp2kPemulaKelompok +
                totalUp2kMadyaKelompok +
                totalUp2kUtamaKelompok +
                totalUp2kMandiriKelompok,
        },
    ];
    const hasChartData = chartData.some((item) => item.value > 0);
    const up2kParticipantData = [
        { name: "Pemula", value: totalUp2kPemulaPeserta, color: "#0072BC" },
        { name: "Madya", value: totalUp2kMadyaPeserta, color: "#f43f5e" },
        { name: "Utama", value: totalUp2kUtamaPeserta, color: "#64748b" },
        { name: "Mandiri", value: totalUp2kMandiriPeserta, color: "#94a3b8" },
    ];
    const totalUp2kPeserta = up2kParticipantData.reduce((total, item) => total + item.value, 0);
    const up2kMandiriPercentage = totalUp2kPeserta > 0
        ? (totalUp2kMandiriPeserta / totalUp2kPeserta) * 100
        : 0;

    // ========================================================
    // RENDER
    // ========================================================
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 pt-14 sm:pt-16">
            <Head>
                <title>Data Pokja II - TP PKK Kab. Tasikmalaya</title>
                <meta
                    name="description"
                    content="Data rekapitulasi Pokja II PKK Kabupaten Tasikmalaya - Pendidikan, Keterampilan, dan Pengembangan Kehidupan Berkoperasi."
                />
            </Head>

            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full">
                {/* BREADCRUMB */}
                <nav className="flex items-center gap-2 text-sm text-slate-500">
                    <Link href="/" className="hover:text-[#0072BC] transition-colors">
                        Beranda
                    </Link>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-900 font-medium">Pokja II</span>
                </nav>

                {/* JUDUL */}
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

                {!isLoading && (
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                            <div className="mb-4 border-b border-slate-100 pb-4">
                                <h3 className="text-base font-bold text-slate-900">
                                    Distribusi Data Pokja II
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
                                            <CartesianGrid
                                                vertical={false}
                                                stroke="#e2e8f0"
                                            />
                                            <XAxis
                                                dataKey="label"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: "#64748b", fontSize: 10 }}
                                                interval={0}
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

                        <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                            <div className="mb-4 border-b border-slate-100 pb-4">
                                <h3 className="text-base font-bold text-slate-900">
                                    Peserta UP2K per Tingkatan
                                </h3>
                                <p className="mt-1 text-xs text-slate-500">
                                    Komposisi jumlah peserta pada kecamatan yang ditampilkan.
                                </p>
                            </div>
                            {totalUp2kPeserta > 0 ? (
                                <div className="grid min-h-64 grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(0,1.15fr)_minmax(9rem,1fr)]">
                                    <div className="relative h-64 min-w-0">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={up2kParticipantData.filter(
                                                        (item) => item.value > 0,
                                                    )}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius="62%"
                                                    outerRadius="86%"
                                                    paddingAngle={2}
                                                >
                                                    {up2kParticipantData
                                                        .filter((item) => item.value > 0)
                                                        .map((item) => (
                                                            <Cell
                                                                key={item.name}
                                                                fill={item.color}
                                                            />
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
                                            <span className="text-xs text-slate-400">
                                                Total Peserta
                                            </span>
                                            <strong className="text-lg font-bold tabular-nums text-slate-900">
                                                {totalUp2kPeserta.toLocaleString("id-ID")}
                                            </strong>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {up2kParticipantData.map((item) => (
                                            <div
                                                key={item.name}
                                                className="flex items-center justify-between gap-3 text-sm"
                                            >
                                                <span className="flex min-w-0 items-center gap-2 text-slate-600">
                                                    <span
                                                        className="h-3 w-3 shrink-0 rounded-sm"
                                                        style={{ backgroundColor: item.color }}
                                                        aria-hidden="true"
                                                    />
                                                    <span className="truncate">{item.name}</span>
                                                </span>
                                                <strong className="shrink-0 tabular-nums text-slate-900">
                                                    {item.value.toLocaleString("id-ID")}
                                                </strong>
                                            </div>
                                        ))}
                                        <div className="border-t border-slate-100 pt-3 text-xs text-slate-500">
                                            Persentase Mandiri{" "}
                                            <strong className="ml-1 text-rose-600">
                                                {up2kMandiriPercentage.toFixed(1)}%
                                            </strong>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex min-h-72 items-center justify-center text-sm text-slate-400">
                                    Belum ada data peserta UP2K untuk ditampilkan
                                </div>
                            )}
                        </section>
                    </div>
                )}

                {/* ============================================================
                    TABEL
                ============================================================ */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-slate-200">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span>Tampilkan data wilayah</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs min-w-[3000px]">
                            <thead>
                                {/* BARIS 1 — GRUP UTAMA */}
                                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                                    <th
                                        rowSpan={3}
                                        className="p-2 border-r border-slate-200 text-center font-bold sticky left-0 bg-slate-100 z-10 min-w-[50px]"
                                    >
                                        NO
                                    </th>
                                    <th
                                        rowSpan={3}
                                        className="p-2 border-r border-slate-200 text-center font-bold sticky left-[50px] bg-slate-100 z-10 min-w-[140px]"
                                    >
                                        KECAMATAN
                                    </th>

                                    {/* PENDIDIKAN KETERAMPILAN */}
                                    <th
                                        colSpan={11}
                                        className="p-2 border-r border-slate-200 text-center font-bold bg-slate-300"
                                    >
                                        Pendidikan Keterampilan
                                    </th>

                                    {/* JUMLAH KADER KHUSUS */}
                                    <th
                                        colSpan={13}
                                        className="p-2 border-r border-slate-200 text-center font-bold bg-slate-300"
                                    >
                                        Jumlah Kader Khusus
                                    </th>

                                    {/* PENGEMBANGAN KEHIDUPAN BERKOPERASI */}
                                    <th
                                        colSpan={10}
                                        className="p-2 border-r border-slate-200 text-center font-bold bg-slate-300"
                                    >
                                        Pengembangan Kehidupan Berkoperasi
                                    </th>

                                    {/* KETERANGAN */}
                                    <th
                                        rowSpan={3}
                                        className="p-2 border-r border-slate-200 text-center font-bold bg-slate-200 min-w-[100px]"
                                    >
                                        KET.
                                    </th>
                                </tr>

                                {/* BARIS 2 — SUB-GRUP */}
                                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                                    {/* PENDIDIKAN */}
                                    <th
                                        rowSpan={2}
                                        className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-200 min-w-[80px]"
                                    >
                                        Jml. Warga Yang Masih 3 (Tiga) Buta
                                    </th>
                                    <th
                                        colSpan={2}
                                        className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-200"
                                    >
                                        Paket A
                                    </th>
                                    <th
                                        colSpan={2}
                                        className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-200"
                                    >
                                        Paket B
                                    </th>
                                    <th
                                        colSpan={2}
                                        className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-200"
                                    >
                                        Paket C
                                    </th>
                                    <th
                                        colSpan={2}
                                        className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-200"
                                    >
                                        KF
                                    </th>
                                    <th
                                        rowSpan={2}
                                        className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-200 min-w-[70px]"
                                    >
                                        PAUD Sejenis
                                    </th>
                                    <th
                                        rowSpan={2}
                                        className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-200 min-w-[100px]"
                                    >
                                        Jumlah Taman Bacaan/Perpustakaan
                                    </th>

                                    {/* KADER KHUSUS */}
                                    <th
                                        colSpan={5}
                                        className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-200"
                                    >
                                        BKB
                                    </th>
                                    <th
                                        colSpan={2}
                                        className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-200"
                                    >
                                        Tutor
                                    </th>
                                    <th
                                        rowSpan={2}
                                        className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-200 min-w-[60px]"
                                    >
                                        BKB
                                    </th>
                                    <th
                                        rowSpan={2}
                                        className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-200 min-w-[70px]"
                                    >
                                        Koperasi
                                    </th>
                                    <th
                                        rowSpan={2}
                                        className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-200 min-w-[80px]"
                                    >
                                        Keterampilan
                                    </th>
                                    <th
                                        rowSpan={2}
                                        className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-200 min-w-[70px]"
                                    >
                                        LP3 PKK
                                    </th>
                                    <th
                                        rowSpan={2}
                                        className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-200 min-w-[70px]"
                                    >
                                        TP3 PKK
                                    </th>
                                    <th
                                        rowSpan={2}
                                        className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-200 min-w-[70px]"
                                    >
                                        Damas PKK
                                    </th>

                                    {/* KOPERASI */}
                                    <th
                                        colSpan={2}
                                        className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-200"
                                    >
                                        Pemula
                                    </th>
                                    <th
                                        colSpan={2}
                                        className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-200"
                                    >
                                        Madya
                                    </th>
                                    <th
                                        colSpan={2}
                                        className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-200"
                                    >
                                        Utama
                                    </th>
                                    <th
                                        colSpan={2}
                                        className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-200"
                                    >
                                        Mandiri
                                    </th>
                                    <th
                                        colSpan={2}
                                        className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-200"
                                    >
                                        Koperasi Berbadan Hukum
                                    </th>
                                </tr>

                                {/* BARIS 3 — SUB-SUB-KOLOM */}
                                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                                    {/* PAKET A */}
                                    <th className="p-1.5 border-r border-slate-200 text-center font-medium bg-slate-100 min-w-[60px]">
                                        Jml. KLP
                                    </th>
                                    <th className="p-1.5 border-r border-slate-200 text-center font-medium bg-slate-100 min-w-[60px]">
                                        Beberapa Warga
                                    </th>

                                    {/* PAKET B */}
                                    <th className="p-1.5 border-r border-slate-200 text-center font-medium bg-slate-100 min-w-[60px]">
                                        Jml. KLP
                                    </th>
                                    <th className="p-1.5 border-r border-slate-200 text-center font-medium bg-slate-100 min-w-[60px]">
                                        Beberapa Warga
                                    </th>

                                    {/* PAKET C */}
                                    <th className="p-1.5 border-r border-slate-200 text-center font-medium bg-slate-100 min-w-[60px]">
                                        Jml. KLP
                                    </th>
                                    <th className="p-1.5 border-r border-slate-200 text-center font-medium bg-slate-100 min-w-[60px]">
                                        Beberapa Warga
                                    </th>

                                    {/* KF */}
                                    <th className="p-1.5 border-r border-slate-200 text-center font-medium bg-slate-100 min-w-[60px]">
                                        Jml. KLP
                                    </th>
                                    <th className="p-1.5 border-r border-slate-200 text-center font-medium bg-slate-100 min-w-[60px]">
                                        Beberapa Warga
                                    </th>

                                    {/* BKB */}
                                    <th className="p-1.5 border-r border-slate-200 text-center font-medium bg-slate-100 min-w-[60px]">
                                        Jml. KLP
                                    </th>
                                    <th className="p-1.5 border-r border-slate-200 text-center font-medium bg-slate-100 min-w-[60px]">
                                        Peserta
                                    </th>
                                    <th className="p-1.5 border-r border-slate-200 text-center font-medium bg-slate-100 min-w-[60px]">
                                        Jml. Ibu (SET)
                                    </th>
                                    <th className="p-1.5 border-r border-slate-200 text-center font-medium bg-slate-100 min-w-[60px]">
                                        Jml. APE
                                    </th>
                                    <th className="p-1.5 border-r border-slate-200 text-center font-medium bg-slate-100 min-w-[60px]">
                                        Simulasi
                                    </th>

                                    {/* TUTOR */}
                                    <th className="p-1.5 border-r border-slate-200 text-center font-medium bg-slate-100 min-w-[60px]">
                                        KF
                                    </th>
                                    <th className="p-1.5 border-r border-slate-200 text-center font-medium bg-slate-100 min-w-[60px]">
                                        PAUD Sejenis
                                    </th>

                                    {/* KOPERASI */}
                                    <th className="p-1.5 border-r border-slate-200 text-center font-medium bg-slate-100 min-w-[60px]">
                                        Jml. Klp
                                    </th>
                                    <th className="p-1.5 border-r border-slate-200 text-center font-medium bg-slate-100 min-w-[60px]">
                                        Peserta
                                    </th>
                                    <th className="p-1.5 border-r border-slate-200 text-center font-medium bg-slate-100 min-w-[60px]">
                                        Jml. Klp
                                    </th>
                                    <th className="p-1.5 border-r border-slate-200 text-center font-medium bg-slate-100 min-w-[60px]">
                                        Peserta
                                    </th>
                                    <th className="p-1.5 border-r border-slate-200 text-center font-medium bg-slate-100 min-w-[60px]">
                                        Jml. Klp
                                    </th>
                                    <th className="p-1.5 border-r border-slate-200 text-center font-medium bg-slate-100 min-w-[60px]">
                                        Peserta
                                    </th>
                                    <th className="p-1.5 border-r border-slate-200 text-center font-medium bg-slate-100 min-w-[60px]">
                                        Jml. Klp
                                    </th>
                                    <th className="p-1.5 border-r border-slate-200 text-center font-medium bg-slate-100 min-w-[60px]">
                                        Peserta
                                    </th>
                                    <th className="p-1.5 border-r border-slate-200 text-center font-medium bg-slate-100 min-w-[60px]">
                                        Jml. Klp
                                    </th>
                                    <th className="p-1.5 border-r border-slate-200 text-center font-medium bg-slate-100 min-w-[60px]">
                                        Jml. Anggota
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {items.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={37}
                                            className="text-center py-12 text-slate-400"
                                        >
                                            {isLoading
                                                ? "Memuat data..."
                                                : "Belum ada data kecamatan untuk Pokja II."}
                                        </td>
                                    </tr>
                                ) : (
                                    items.map((item, idx) => (
                                        <tr
                                            key={item.id || idx}
                                            className="hover:bg-slate-50 transition-colors"
                                        >
                                            <td className="p-2 border-r border-slate-100 text-center text-slate-500 sticky left-0 bg-white z-10">
                                                {idx + 1}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 font-semibold text-slate-900 sticky left-[50px] bg-white z-10">
                                                {item.nama_kecamatan || item.kecamatan || "-"}
                                            </td>

                                            {/* PENDIDIKAN */}
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {(Number(item.warga_buta_l) || 0) +
                                                    (Number(item.warga_buta_p) || 0)}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.kelompok_belajar_paket_a || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.warga_belajar_paket_a || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.kelompok_belajar_paket_b || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.warga_belajar_paket_b || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.kelompok_belajar_paket_c || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.warga_belajar_paket_c || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.kf || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.warga_belajar_kf || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.paud || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.taman_bacaan || 0}
                                            </td>

                                            {/* KADER */}
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.kelompok_bkb || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.peserta_bkb || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.ibu_set_bkb || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.ape_bkb || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.kelompok_simulasi_bkb || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.tutor_kf || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.tutor_paud || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.kader_bkb || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.kelompok_kader_koperasi || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.kader_keterampilan || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.lp3_pkk || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.tp3_pkk || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.damas_pkk || 0}
                                            </td>

                                            {/* KOPERASI */}
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.up2k_pemula_kelompok || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.up2k_pemula_peserta || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.up2k_madya_kelompok || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.up2k_madya_peserta || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.up2k_utama_kelompok || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.up2k_utama_peserta || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.up2k_mandiri_kelompok || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.up2k_mandiri_peserta || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.koperasi_berbadan_hukum || 0}
                                            </td>
                                            <td className="p-2 border-r border-slate-100 text-center">
                                                {item.anggota_koperasi || 0}
                                            </td>

                                            {/* KETERANGAN */}
                                            <td className="p-2 border-r border-slate-100 text-center text-slate-500">
                                                {item.keterangan || "-"}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>

                            {/* FOOTER — JUMLAH */}
                            {items.length > 0 && (
                                <tfoot>
                                    <tr className="bg-slate-100 font-bold text-slate-800 border-t-2 border-slate-300">
                                        <td
                                            colSpan={2}
                                            className="p-2 border-r border-slate-200 text-center sticky left-0 bg-slate-100 z-10"
                                        >
                                            JUMLAH
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalWargaButa}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalPaketA}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalWargaBelajarPaketA}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalPaketB}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalWargaBelajarPaketB}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalPaketC}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalWargaBelajarPaketC}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalKF}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalWargaBelajarKF}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalPaud}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalTamanBacaan}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalKelompokBKB}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalPesertaBKB}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalIbuSetBKB}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalApeBKB}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalSimulasiBKB}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalTutorKF}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalTutorPAUD}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalKaderBKB}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalKaderKoperasi}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalKaderKeterampilan}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalLp3Pkk}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalTp3Pkk}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalDamasPkk}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalUp2kPemulaKelompok}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalUp2kPemulaPeserta}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalUp2kMadyaKelompok}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalUp2kMadyaPeserta}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalUp2kUtamaKelompok}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalUp2kUtamaPeserta}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalUp2kMandiriKelompok}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalUp2kMandiriPeserta}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalKoperasi}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">
                                            {totalAnggotaKoperasi}
                                        </td>
                                        <td className="p-2 text-center">-</td>
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
