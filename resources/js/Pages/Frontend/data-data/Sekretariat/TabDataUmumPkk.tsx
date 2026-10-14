import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { Filter, Search, Users, Home, UserRound, BriefcaseBusiness } from "lucide-react";

interface DataUmumItem {
    id: number;
    kecamatan?: string;
    nama_kecamatan?: string;
    jumlah_dusun?: number;
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
    sekretariat_honorer_l?: number;
    sekretariat_honorer_p?: number;
    sekretariat_bantuan_l?: number;
    sekretariat_bantuan_p?: number;
    [key: string]: any;
}

interface Props {
    data: DataUmumItem[];
    tahun?: string;
    onTahunChange?: (tahun: string) => void;
}

const number = (value: unknown) => Number(value) || 0;

export default function TabDataUmumPkk({
    data = [],
    tahun = new Date().getFullYear().toString(),
    onTahunChange,
}: Props) {
    const [search, setSearch] = useState("");
    const [selectedKecamatan, setSelectedKecamatan] = useState("");
    const items = Array.isArray(data) ? data : ((data as any)?.data || []);
    const desaItems = items.filter((item) => item.level === "desa");
    const displayItems = desaItems.length > 0 ? desaItems : items;

    const numericFields: (keyof DataUmumItem)[] = [
        "jumlah_dusun", "jumlah_pkk_rw", "jumlah_pkk_rt", "jumlah_dasa_wisma",
        "jumlah_krt", "jumlah_kk", "jiwa_l", "jiwa_p",
        "tp_pkk_l", "tp_pkk_p",
        "kader_umum_l", "kader_umum_p", "kader_khusus_l", "kader_khusus_p",
        "sekretariat_honorer_l", "sekretariat_honorer_p",
        "sekretariat_bantuan_l", "sekretariat_bantuan_p",
    ];

    const mergedItems = Array.from(displayItems.reduce((groups, item) => {
        const name = (item.nama_kecamatan || item.kecamatan || "Tidak diketahui").trim();
        const key = name.toLocaleLowerCase();
        const current = groups.get(key);
        if (!current) {
            groups.set(key, { ...item, nama_kecamatan: name });
            return groups;
        }
        numericFields.forEach((field) => {
            current[field] = number(current[field]) + number(item[field]);
        });
        groups.set(key, current);
        return groups;
    }, new Map<string, DataUmumItem>()).values());

    const uniqueKecamatan = Array.from(new Set(
        mergedItems.map((item) => item.nama_kecamatan || item.kecamatan).filter(Boolean)
    ));
    const filteredData = mergedItems.filter((item) => {
        const name = (item.nama_kecamatan || item.kecamatan || "").toLowerCase();
        return name.includes(search.toLowerCase()) &&
            (!selectedKecamatan || (item.nama_kecamatan || item.kecamatan) === selectedKecamatan);
    });
    const sum = (field: keyof DataUmumItem) =>
        filteredData.reduce((total, item) => total + number(item[field]), 0);

    const handleApplyFilter = () => router.get("/sekretariat", {
        kecamatan: selectedKecamatan || undefined,
        year: tahun,
        activeTab: "data-umum",
    }, { preserveState: true, preserveScroll: true, replace: true });

    // Cell helper — border abu-abu persis Excel
    const cell = (value: unknown) => (
        <td className="p-2 border-r border-slate-300 text-center">{number(value)}</td>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <nav className="flex items-center gap-2 text-sm text-slate-500">
                <Link href="/" className="hover:text-[#0072BC] transition-colors">Beranda</Link>
                <span className="text-slate-300">/</span>
                <span className="text-slate-900 font-medium">Sekretariat</span>
            </nav>

            <div>
                <p className="text-[#0072BC] text-xs font-semibold tracking-wide uppercase mb-1">Sekretariat</p>
                <h2 className="text-2xl font-bold text-slate-900">Data Umum PKK</h2>
                <p className="text-slate-500 text-sm mt-1">Data wilayah, KK, jiwa, kader, dan sekretariat per kecamatan — {tahun}.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
                <div className="flex flex-wrap gap-3 items-center">
                    <label className="text-sm font-medium text-slate-600">Kecamatan
                        <select value={selectedKecamatan} onChange={(e) => setSelectedKecamatan(e.target.value)}
                            className="ml-2 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white">
                            <option value="">Semua Kecamatan</option>
                            {uniqueKecamatan.map((name) => <option key={name} value={name}>{name}</option>)}
                        </select>
                    </label>
                    <label className="text-sm font-medium text-slate-600">Tahun
                        <select value={tahun} onChange={(e) => onTahunChange?.(e.target.value)}
                            className="ml-2 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white">
                            <option value="2026">2026</option>
                            <option value="2025">2025</option>
                        </select>
                    </label>
                </div>
                <button type="button" onClick={handleApplyFilter}
                    className="inline-flex items-center gap-2 bg-[#0072BC] hover:bg-[#005A94] text-white text-sm font-semibold px-4 py-2 rounded-lg">
                    <Filter size={15} /> Terapkan Filter
                </button>
            </div>

            {/* Metric Cards — TIDAK DIUBAH */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    ["Total KK", sum("jumlah_kk"), Home],
                    ["Total Jiwa", sum("jiwa_l") + sum("jiwa_p"), Users],
                    ["Total Kader", sum("tp_pkk_l") + sum("tp_pkk_p") + sum("kader_umum_l") + sum("kader_umum_p") + sum("kader_khusus_l") + sum("kader_khusus_p"), UserRound],
                    ["Total Sekretariat", sum("sekretariat_honorer_l") + sum("sekretariat_honorer_p") + sum("sekretariat_bantuan_l") + sum("sekretariat_bantuan_p"), BriefcaseBusiness],
                ].map(([label, value, Icon]) => (
                    <div key={String(label)} className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                        <div><p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">{Number(value).toLocaleString("id-ID")}</p></div>
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center"><Icon size={18} className="text-[#0072BC]" /></div>
                    </div>
                ))}
            </div>

            {/* Tabel — HEADER 3 BARIS PERSIS EXCEL */}
            <div className="bg-white border border-slate-300 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-300 flex justify-between items-center gap-3">
                    <span className="text-sm text-slate-600">Data Umum PKK — {tahun}</span>
                    <div className="relative w-full sm:w-64">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari kecamatan..."
                            className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#0072BC]" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs min-w-[1500px]">
                        <thead>
                            {/* BARIS 1 — GROUP UTAMA */}
                            <tr className="bg-slate-300 text-slate-900 border-b border-slate-400">
                                <th rowSpan={3} className="p-2 border-r border-slate-400 text-center font-bold sticky left-0 bg-slate-300 z-10 min-w-[40px]">No.</th>
                                <th rowSpan={3} className="p-2 border-r border-slate-400 text-center font-bold sticky left-[40px] bg-slate-300 z-10 min-w-[150px]">Nama Kecamatan</th>
                                <th colSpan={4} className="p-2 border-r border-slate-400 text-center font-bold bg-slate-300">Jumlah Kelompok</th>
                                <th colSpan={2} className="p-2 border-r border-slate-400 text-center font-bold bg-slate-300">Jumlah</th>
                                <th colSpan={2} className="p-2 border-r border-slate-400 text-center font-bold bg-slate-300">Jumlah Jiwa</th>
                                <th colSpan={6} className="p-2 border-r border-slate-400 text-center font-bold bg-slate-300">Jumlah Kader</th>
                                <th colSpan={4} className="p-2 border-r border-slate-400 text-center font-bold bg-slate-300">Jumlah Tenaga Sekretariat</th>
                                <th rowSpan={3} className="p-2 border-r border-slate-400 text-center font-bold bg-slate-300 min-w-[80px]">Ket</th>
                            </tr>

                            {/* BARIS 2 — SUB-GROUP */}
                            <tr className="bg-slate-200 text-slate-800 border-b border-slate-400">
                                <th rowSpan={2} className="p-1 border-r border-slate-400 text-center font-semibold">Dusun</th>
                                <th rowSpan={2} className="p-1 border-r border-slate-400 text-center font-semibold">PKK RW</th>
                                <th rowSpan={2} className="p-1 border-r border-slate-400 text-center font-semibold">PKK RT</th>
                                <th rowSpan={2} className="p-1 border-r border-slate-400 text-center font-semibold">Dasa Wisma</th>
                                <th rowSpan={2} className="p-1 border-r border-slate-400 text-center font-semibold">KRT</th>
                                <th rowSpan={2} className="p-1 border-r border-slate-400 text-center font-semibold">KK</th>
                                <th rowSpan={2} className="p-1 border-r border-slate-400 text-center font-semibold">L</th>
                                <th rowSpan={2} className="p-1 border-r border-slate-400 text-center font-semibold">P</th>
                                <th colSpan={2} className="p-1 border-r border-slate-400 text-center font-semibold">Anggota TP PKK</th>
                                <th colSpan={2} className="p-1 border-r border-slate-400 text-center font-semibold">Umum</th>
                                <th colSpan={2} className="p-1 border-r border-slate-400 text-center font-semibold">Khusus</th>
                                <th colSpan={2} className="p-1 border-r border-slate-400 text-center font-semibold">Honorer</th>
                                <th colSpan={2} className="p-1 border-r border-slate-400 text-center font-semibold">Bantuan</th>
                            </tr>

                            {/* BARIS 3 — SUB-SUB-KOLOM */}
                            <tr className="bg-slate-100 text-slate-700 border-b border-slate-400">
                                <th className="p-1.5 border-r border-slate-400 text-center font-medium">L</th>
                                <th className="p-1.5 border-r border-slate-400 text-center font-medium">P</th>
                                <th className="p-1.5 border-r border-slate-400 text-center font-medium">L</th>
                                <th className="p-1.5 border-r border-slate-400 text-center font-medium">P</th>
                                <th className="p-1.5 border-r border-slate-400 text-center font-medium">L</th>
                                <th className="p-1.5 border-r border-slate-400 text-center font-medium">P</th>
                                <th className="p-1.5 border-r border-slate-400 text-center font-medium">L</th>
                                <th className="p-1.5 border-r border-slate-400 text-center font-medium">P</th>
                                <th className="p-1.5 border-r border-slate-400 text-center font-medium">L</th>
                                <th className="p-1.5 border-r border-slate-400 text-center font-medium">P</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-200 text-slate-700">
                            {filteredData.length === 0 ? (
                                <tr><td colSpan={21} className="text-center py-12 text-slate-400">Belum ada data umum PKK.</td></tr>
                            ) : (
                                filteredData.map((item, index) => (
                                    <tr key={`${item.nama_kecamatan}-${index}`} className="hover:bg-slate-50">
                                        <td className="p-2 border-r border-slate-300 text-center sticky left-0 bg-white z-10">{index + 1}</td>
                                        <td className="p-2 border-r border-slate-300 font-semibold sticky left-[40px] bg-white z-10">
                                            {item.nama_kecamatan || item.kecamatan || "-"}
                                        </td>
                                        {cell(item.jumlah_dusun)}
                                        {cell(item.jumlah_pkk_rw)}
                                        {cell(item.jumlah_pkk_rt)}
                                        {cell(item.jumlah_dasa_wisma)}
                                        {cell(item.jumlah_krt)}
                                        {cell(item.jumlah_kk)}
                                        {cell(item.jiwa_l)}
                                        {cell(item.jiwa_p)}
                                        {cell(item.tp_pkk_l)}
                                        {cell(item.tp_pkk_p)}
                                        {cell(item.kader_umum_l)}
                                        {cell(item.kader_umum_p)}
                                        {cell(item.kader_khusus_l)}
                                        {cell(item.kader_khusus_p)}
                                        {cell(item.sekretariat_honorer_l)}
                                        {cell(item.sekretariat_honorer_p)}
                                        {cell(item.sekretariat_bantuan_l)}
                                        {cell(item.sekretariat_bantuan_p)}
                                        <td className="p-2 text-center">-</td>
                                    </tr>
                                ))
                            )}
                        </tbody>

                        {filteredData.length > 0 && (
                            <tfoot>
                                <tr className="bg-slate-300 font-bold text-slate-900 border-t-2 border-slate-500">
                                    <td colSpan={2} className="p-2 border-r border-slate-400 text-center sticky left-0 bg-slate-300 z-10">JUMLAH</td>
                                    {numericFields.map((field) => (
                                        <td key={field} className="p-2 border-r border-slate-400 text-center">
                                            {sum(field).toLocaleString("id-ID")}
                                        </td>
                                    ))}
                                    <td className="p-2 text-center">-</td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>
        </div>
    );
}
