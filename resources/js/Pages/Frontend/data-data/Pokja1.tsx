import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Head, Link } from "@inertiajs/react";
import {
    Search,
    Users,
    BookOpen,
    RefreshCw,
    Download,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import axios from "axios";

interface Pokja1Item {
    id: number;
    kecamatan?: string;
    nama_kecamatan?: string;
    nama_wilayah?: string;
    tahun?: number;
    kader_umum?: number;
    kader_khusus?: number;

    // KISAH
    kisah_kegiatan?: string;
    kisah_volume?: number;
    kisah_metode?: string;
    kisah_sasaran?: number;

    // KILAS
    kilas_kegiatan?: string;
    kilas_volume?: number;
    kilas_metode?: string;
    kilas_sasaran?: number;

    // KRISAN
    krisan_kegiatan?: string;
    krisan_volume?: number;
    krisan_metode?: string;
    krisan_sasaran?: number;

    // KIAT
    kiat_kegiatan?: string;
    kiat_volume?: number;
    kiat_metode?: string;
    kiat_sasaran?: number;

    // KISAK
    kisak_kegiatan?: string;
    kisak_volume?: number;
    kisak_metode?: string;
    kisak_sasaran?: number;

    // PKBN
    pkbn_kegiatan?: string;
    pkbn_volume?: number;
    pkbn_metode?: string;
    pkbn_sasaran?: number;

    keterangan?: string;
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
        tahun?: string;
        per_page?: number | string;
    };
}

const num = (v: unknown) => Number(v) || 0;

export default function Pokja1({ data, filters = {} }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [tahun, setTahun] = useState(filters.tahun || new Date().getFullYear().toString());
    const [perPage, setPerPage] = useState(Number(filters.per_page) || 10);
    const [localData, setLocalData] = useState(data);
    const [isLoading, setIsLoading] = useState(false);
    const firstRender = useRef(true);

    const items: Pokja1Item[] = localData?.data || [];

    const fetchData = useCallback((params: Record<string, any> = {}) => {
        setIsLoading(true);
        axios
            .get("/api/pokja-1", {
                params: {
                    search: search || undefined,
                    tahun: tahun,
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
    }, [search, tahun, perPage]);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        const timeout = setTimeout(() => fetchData(), 400);
        return () => clearTimeout(timeout);
    }, [search, tahun, perPage, fetchData]);

    const handlePageChange = useCallback((url: string) => {
        if (!url) return;
        const params = new URL(url).searchParams;
        fetchData({ page: params.get("page") });
    }, [fetchData]);

    // ==================== SUMMARY ====================
    const stats = useMemo(() => {
        const sum = (key: keyof Pokja1Item) =>
            items.reduce((a, c) => a + num(c[key]), 0);

        const totalKaderUmum = sum("kader_umum");
        const totalKaderKhusus = sum("kader_khusus");
        const totalKader = totalKaderUmum + totalKaderKhusus;

        const totalKisahSasaran = sum("kisah_sasaran");
        const totalKilasSasaran = sum("kilas_sasaran");
        const totalKrisanSasaran = sum("krisan_sasaran");
        const totalKiatSasaran = sum("kiat_sasaran");
        const totalKisakSasaran = sum("kisak_sasaran");
        const totalPkbnSasaran = sum("pkbn_sasaran");
        const totalSasaran = totalKisahSasaran + totalKilasSasaran + totalKrisanSasaran +
            totalKiatSasaran + totalKisakSasaran + totalPkbnSasaran;

        return {
            totalKaderUmum,
            totalKaderKhusus,
            totalKader,
            totalKisahSasaran,
            totalKilasSasaran,
            totalKrisanSasaran,
            totalKiatSasaran,
            totalKisakSasaran,
            totalPkbnSasaran,
            totalSasaran,
        };
    }, [items]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pt-14">
            <Head title="Data Pokja I - TP PKK Kab. Tasikmalaya" />
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-[#0072BC] text-xs font-semibold tracking-wider uppercase">Pokja I</p>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">
                            Data Kegiatan Pokja 1
                        </h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Penghayatan & Pengamalan Pancasila serta Gotong Royong
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={() => fetchData()}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
                            <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} /> Segarkan
                        </button>
                        <a href={`/pokja-1/export?tahun=${tahun}`}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg">
                            <Download size={15} /> Ekspor
                        </a>
                    </div>
                </div>

                {/* FILTER */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari kecamatan..."
                                className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0072BC] bg-white" />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-slate-600 font-medium">Tahun</label>
                            <select value={tahun} onChange={(e) => setTahun(e.target.value)}
                                className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white">
                                <option value="2026">2026</option>
                                <option value="2025">2025</option>
                                <option value="2024">2024</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-slate-600 font-medium">Tampilkan</label>
                            <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))}
                                className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white">
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>
                    </div>
                    {search && (
                        <button type="button" onClick={() => setSearch("")}
                            className="text-sm text-[#0072BC] font-medium">Reset filter</button>
                    )}
                </div>

                {/* LOADING */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-10 h-10 border-4 border-slate-200 border-t-[#0072BC] rounded-full animate-spin"></div>
                        <p className="text-sm text-slate-500 mt-3">Memuat data...</p>
                    </div>
                )}

                {/* METRIC CARDS */}
                {!isLoading && items.length > 0 && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl border border-slate-200 p-5">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Kader Umum</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalKaderUmum.toLocaleString("id-ID")}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 p-5">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Kader Khusus</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalKaderKhusus.toLocaleString("id-ID")}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 p-5">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Kader</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalKader.toLocaleString("id-ID")}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 p-5">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Sasaran</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalSasaran.toLocaleString("id-ID")}</p>
                        </div>
                    </div>
                )}

                {/* TABEL — HEADER 3 BARIS PERSIS EXCEL */}
                <div className="bg-white rounded-xl border border-slate-300 overflow-hidden">
                    {!isLoading && items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                            <Users size={48} className="mb-4 text-slate-300" />
                            <p className="text-lg font-medium text-slate-600">Belum ada data</p>
                            <p className="text-sm">Data kecamatan untuk Pokja I belum tersedia</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs border-collapse min-w-[2600px]">
                                    <thead>
                                        {/* BARIS 1 — GROUP UTAMA */}
                                        <tr className="bg-slate-300 text-slate-900 border-b border-slate-400">
                                            <th rowSpan={3} className="p-2 border-r border-slate-400 text-center font-bold sticky left-0 bg-slate-300 z-10 min-w-[40px]">No.</th>
                                            <th rowSpan={3} className="p-2 border-r border-slate-400 text-center font-bold sticky left-[40px] bg-slate-300 z-10 min-w-[140px]">Nama Wilayah</th>
                                            <th colSpan={2} className="p-2 border-r border-slate-400 text-center font-bold bg-slate-300">JML KADER</th>
                                            <th colSpan={24} className="p-2 border-r border-slate-400 text-center font-bold bg-slate-300">PENGHAYATAN DAN PENGAMALAN PANCASILA DAN GOTONG ROYONG</th>
                                            <th rowSpan={3} className="p-2 border-r border-slate-400 text-center font-bold bg-slate-300 min-w-[120px]">Keterangan</th>
                                        </tr>

                                        {/* BARIS 2 — SUB-GROUP */}
                                        <tr className="bg-slate-200 text-slate-800 border-b border-slate-400">
                                            <th rowSpan={2} className="p-1 border-r border-slate-400 text-center font-semibold">Kader<br />Umum</th>
                                            <th rowSpan={2} className="p-1 border-r border-slate-400 text-center font-semibold">Kader<br />Khusus</th>
                                            <th colSpan={4} className="p-1 border-r border-slate-400 text-center font-semibold">KISAH</th>
                                            <th colSpan={4} className="p-1 border-r border-slate-400 text-center font-semibold">KILAS</th>
                                            <th colSpan={4} className="p-1 border-r border-slate-400 text-center font-semibold">KRISAN</th>
                                            <th colSpan={4} className="p-1 border-r border-slate-400 text-center font-semibold">KIAT</th>
                                            <th colSpan={4} className="p-1 border-r border-slate-400 text-center font-semibold">KISAK</th>
                                            <th colSpan={4} className="p-1 border-r border-slate-400 text-center font-semibold">PKBN</th>
                                        </tr>

                                        {/* BARIS 3 — SUB-SUB-KOLOM */}
                                        <tr className="bg-slate-100 text-slate-700 border-b border-slate-400">
                                            {["Kegiatan", "Vol", "Metode", "Sasaran",
                                              "Kegiatan", "Vol", "Metode", "Sasaran",
                                              "Kegiatan", "Vol", "Metode", "Sasaran",
                                              "Kegiatan", "Vol", "Metode", "Sasaran",
                                              "Kegiatan", "Vol", "Metode", "Sasaran",
                                              "Kegiatan", "Vol", "Metode", "Sasaran"].map((label, i) => (
                                                <th key={i} className="p-1.5 border-r border-slate-400 text-center font-medium min-w-[80px]">{label}</th>
                                              ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 text-slate-700">
                                        {items.map((item, idx) => (
                                            <tr key={item.id || idx} className="hover:bg-slate-50">
                                                <td className="p-2 border-r border-slate-300 text-center sticky left-0 bg-white z-10">{idx + 1}</td>
                                                <td className="p-2 border-r border-slate-300 font-semibold sticky left-[40px] bg-white z-10">
                                                    {item.nama_wilayah || item.kecamatan || item.nama_kecamatan || "-"}
                                                </td>
                                                <td className="p-2 border-r border-slate-300 text-center">{num(item.kader_umum)}</td>
                                                <td className="p-2 border-r border-slate-300 text-center">{num(item.kader_khusus)}</td>

                                                <td className="p-2 border-r border-slate-300 min-w-[150px]">{item.kisah_kegiatan || "-"}</td>
                                                <td className="p-2 border-r border-slate-300 text-center">{num(item.kisah_volume)}</td>
                                                <td className="p-2 border-r border-slate-300">{item.kisah_metode || "-"}</td>
                                                <td className="p-2 border-r border-slate-300 text-center">{num(item.kisah_sasaran)}</td>

                                                <td className="p-2 border-r border-slate-300 min-w-[150px]">{item.kilas_kegiatan || "-"}</td>
                                                <td className="p-2 border-r border-slate-300 text-center">{num(item.kilas_volume)}</td>
                                                <td className="p-2 border-r border-slate-300">{item.kilas_metode || "-"}</td>
                                                <td className="p-2 border-r border-slate-300 text-center">{num(item.kilas_sasaran)}</td>

                                                <td className="p-2 border-r border-slate-300 min-w-[150px]">{item.krisan_kegiatan || "-"}</td>
                                                <td className="p-2 border-r border-slate-300 text-center">{num(item.krisan_volume)}</td>
                                                <td className="p-2 border-r border-slate-300">{item.krisan_metode || "-"}</td>
                                                <td className="p-2 border-r border-slate-300 text-center">{num(item.krisan_sasaran)}</td>

                                                <td className="p-2 border-r border-slate-300 min-w-[150px]">{item.kiat_kegiatan || "-"}</td>
                                                <td className="p-2 border-r border-slate-300 text-center">{num(item.kiat_volume)}</td>
                                                <td className="p-2 border-r border-slate-300">{item.kiat_metode || "-"}</td>
                                                <td className="p-2 border-r border-slate-300 text-center">{num(item.kiat_sasaran)}</td>

                                                <td className="p-2 border-r border-slate-300 min-w-[150px]">{item.kisak_kegiatan || "-"}</td>
                                                <td className="p-2 border-r border-slate-300 text-center">{num(item.kisak_volume)}</td>
                                                <td className="p-2 border-r border-slate-300">{item.kisak_metode || "-"}</td>
                                                <td className="p-2 border-r border-slate-300 text-center">{num(item.kisak_sasaran)}</td>

                                                <td className="p-2 border-r border-slate-300 min-w-[150px]">{item.pkbn_kegiatan || "-"}</td>
                                                <td className="p-2 border-r border-slate-300 text-center">{num(item.pkbn_volume)}</td>
                                                <td className="p-2 border-r border-slate-300">{item.pkbn_metode || "-"}</td>
                                                <td className="p-2 border-r border-slate-300 text-center">{num(item.pkbn_sasaran)}</td>

                                                <td className="p-2">{item.keterangan || "-"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    {items.length > 0 && (
                                        <tfoot>
                                            <tr className="bg-slate-300 font-bold text-slate-900 border-t-2 border-slate-500">
                                                <td colSpan={2} className="p-2 border-r border-slate-400 text-center sticky left-0 bg-slate-300 z-10">JUMLAH</td>
                                                <td className="p-2 border-r border-slate-400 text-center">{stats.totalKaderUmum.toLocaleString("id-ID")}</td>
                                                <td className="p-2 border-r border-slate-400 text-center">{stats.totalKaderKhusus.toLocaleString("id-ID")}</td>

                                                <td className="p-2 border-r border-slate-400 text-center">-</td>
                                                <td className="p-2 border-r border-slate-400 text-center">-</td>
                                                <td className="p-2 border-r border-slate-400 text-center">-</td>
                                                <td className="p-2 border-r border-slate-400 text-center">{stats.totalKisahSasaran.toLocaleString("id-ID")}</td>

                                                <td className="p-2 border-r border-slate-400 text-center">-</td>
                                                <td className="p-2 border-r border-slate-400 text-center">-</td>
                                                <td className="p-2 border-r border-slate-400 text-center">-</td>
                                                <td className="p-2 border-r border-slate-400 text-center">{stats.totalKilasSasaran.toLocaleString("id-ID")}</td>

                                                <td className="p-2 border-r border-slate-400 text-center">-</td>
                                                <td className="p-2 border-r border-slate-400 text-center">-</td>
                                                <td className="p-2 border-r border-slate-400 text-center">-</td>
                                                <td className="p-2 border-r border-slate-400 text-center">{stats.totalKrisanSasaran.toLocaleString("id-ID")}</td>

                                                <td className="p-2 border-r border-slate-400 text-center">-</td>
                                                <td className="p-2 border-r border-slate-400 text-center">-</td>
                                                <td className="p-2 border-r border-slate-400 text-center">-</td>
                                                <td className="p-2 border-r border-slate-400 text-center">{stats.totalKiatSasaran.toLocaleString("id-ID")}</td>

                                                <td className="p-2 border-r border-slate-400 text-center">-</td>
                                                <td className="p-2 border-r border-slate-400 text-center">-</td>
                                                <td className="p-2 border-r border-slate-400 text-center">-</td>
                                                <td className="p-2 border-r border-slate-400 text-center">{stats.totalKisakSasaran.toLocaleString("id-ID")}</td>

                                                <td className="p-2 border-r border-slate-400 text-center">-</td>
                                                <td className="p-2 border-r border-slate-400 text-center">-</td>
                                                <td className="p-2 border-r border-slate-400 text-center">-</td>
                                                <td className="p-2 border-r border-slate-400 text-center">{stats.totalPkbnSasaran.toLocaleString("id-ID")}</td>

                                                <td className="p-2 text-center">-</td>
                                            </tr>
                                        </tfoot>
                                    )}
                                </table>
                            </div>

                            {/* PAGINATION */}
                            {localData?.last_page > 1 && (
                                <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
                                    <span className="text-slate-500">
                                        Menampilkan <strong className="text-slate-700">{items.length}</strong> dari{' '}
                                        <strong className="text-slate-700">{localData.total || 0}</strong> data
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <button type="button"
                                            onClick={() => handlePageChange(`?page=${localData.current_page - 1}`)}
                                            disabled={localData.current_page <= 1}
                                            className={`p-2 border border-slate-200 rounded-lg bg-white transition-colors ${
                                                localData.current_page <= 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-slate-50"
                                            }`}>
                                            <ChevronLeft size={16} />
                                        </button>
                                        <span className="px-4 py-2 border border-[#0072BC] rounded-lg bg-[#0072BC] text-white font-semibold text-sm min-w-[40px] text-center">
                                            {localData.current_page || 1}
                                        </span>
                                        <button type="button"
                                            onClick={() => handlePageChange(`?page=${localData.current_page + 1}`)}
                                            disabled={localData.current_page >= localData.last_page}
                                            className={`p-2 border border-slate-200 rounded-lg bg-white transition-colors ${
                                                localData.current_page >= localData.last_page ? "opacity-40 cursor-not-allowed" : "hover:bg-slate-50"
                                            }`}>
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
