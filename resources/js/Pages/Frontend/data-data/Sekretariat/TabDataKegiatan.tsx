import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { Search, Filter, Users, Home, Baby, Activity, Droplet } from "lucide-react";

interface RekapKegiatanItem {
    id: number;
    kecamatan?: string;
    nama_kecamatan?: string;
    jumlah_dusun?: number;
    jumlah_rw?: number;
    jumlah_rt?: number;
    jumlah_dasa_wisma?: number;
    jumlah_krt?: number;
    jumlah_kk?: number;
    total_l?: number;
    total_p?: number;
    balita_l?: number;
    balita_p?: number;
    pus?: number;
    wus?: number;
    ibu_hamil?: number;
    ibu_menyusui?: number;
    lansia?: number;
    buta_l?: number;
    buta_p?: number;
    rumah_sehat?: number;
    rumah_kurang_sehat?: number;
    memiliki_tempat_sampah?: number;
    memiliki_spal?: number;
    memiliki_stiker_p4k?: number;
    air_pdam?: number;
    air_sumur?: number;
    air_sungai?: number;
    air_dll?: number;
    jumlah_jamban_keluarga?: number;
    makanan_pokok_beras?: number;
    makanan_pokok_non_beras?: number;
    kegiatan_up2k?: number;
    kegiatan_tanah_pekarangan?: number;
    kegiatan_industri_rumah_tangga?: number;
    kegiatan_kesehatan_lingkungan?: number;
    keterangan?: string;
    [key: string]: any;
}

interface Props {
    data: RekapKegiatanItem[];
    tahun?: string;
    onTahunChange?: (tahun: string) => void;
}

export default function TabDataKegiatan({
    data = [],
    tahun = new Date().getFullYear().toString(),
    onTahunChange,
}: Props) {
    const [search, setSearch] = useState("");
    const [selectedKecamatan, setSelectedKecamatan] = useState("");

    const items = Array.isArray(data) ? data : (data?.data || []);

    const numericFields: (keyof RekapKegiatanItem)[] = [
        "jumlah_dusun", "jumlah_rw", "jumlah_rt", "jumlah_dasa_wisma",
        "jumlah_krt", "jumlah_kk", "total_l", "total_p",
        "balita_l", "balita_p", "pus", "wus", "ibu_hamil", "ibu_menyusui",
        "lansia", "buta_l", "buta_p", "rumah_sehat", "rumah_kurang_sehat",
        "memiliki_tempat_sampah", "memiliki_spal", "memiliki_stiker_p4k",
        "air_pdam", "air_sumur", "air_sungai", "air_dll",
        "jumlah_jamban_keluarga", "makanan_pokok_beras", "makanan_pokok_non_beras",
        "kegiatan_up2k", "kegiatan_tanah_pekarangan",
        "kegiatan_industri_rumah_tangga", "kegiatan_kesehatan_lingkungan",
    ];

    const mergedItems = Array.from(
        items.reduce((groups, item) => {
            const name = (item.nama_kecamatan || item.kecamatan || "Tidak diketahui").trim();
            const key = name.toLocaleLowerCase();
            const current = groups.get(key);
            if (!current) {
                groups.set(key, { ...item, nama_kecamatan: name });
                return groups;
            }
            numericFields.forEach((field) => {
                current[field] = (Number(current[field]) || 0) + (Number(item[field]) || 0);
            });
            groups.set(key, current);
            return groups;
        }, new Map<string, RekapKegiatanItem>()).values()
    );

    const uniqueKecamatan = Array.from(
        new Set(mergedItems.map((item) => item.nama_kecamatan || item.kecamatan).filter(Boolean))
    );

    const filteredData = mergedItems.filter((item) => {
        const nama = (item.nama_kecamatan || item.kecamatan || "").toLowerCase();
        const matchesSearch = nama.includes(search.toLowerCase());
        const matchesKecamatan = selectedKecamatan
            ? (item.nama_kecamatan || item.kecamatan) === selectedKecamatan
            : true;
        return matchesSearch && matchesKecamatan;
    });

    const sum = (key: keyof RekapKegiatanItem) =>
        filteredData.reduce((a, c) => a + (Number(c[key]) || 0), 0);

    const totalKK = sum("jumlah_kk");
    const totalJiwa = sum("total_l") + sum("total_p");
    const totalBalita = sum("balita_l") + sum("balita_p");
    const totalIbu = sum("ibu_hamil") + sum("ibu_menyusui");

    const handleApplyFilter = () => {
        router.get(
            "/sekretariat",
            {
                kecamatan: selectedKecamatan || undefined,
                year: tahun,
                activeTab: "data-kegiatan",
            },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <nav className="flex items-center gap-2 text-sm text-slate-500">
                <Link href="/" className="hover:text-[#0072BC] transition-colors">Beranda</Link>
                <span className="text-slate-300">/</span>
                <span className="text-slate-900 font-medium">Sekretariat</span>
            </nav>

            <div>
                <p className="text-[#0072BC] text-xs font-semibold tracking-wide uppercase mb-1">
                    Sekretariat
                </p>
                <h2 className="text-2xl font-bold text-slate-900">
                    Rekapitulasi Data Kegiatan Warga
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                    Data kegiatan warga per kecamatan — {tahun}.
                </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row flex-wrap gap-3 items-start md:items-center justify-between">
                <div className="flex flex-wrap gap-3 items-center">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-slate-600">Kecamatan</label>
                        <select
                            value={selectedKecamatan}
                            onChange={(e) => setSelectedKecamatan(e.target.value)}
                            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0072BC]"
                        >
                            <option value="">Semua Kecamatan</option>
                            {uniqueKecamatan.map((kec, index) => (
                                <option key={index} value={kec}>{kec}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-slate-600">Tahun</label>
                        <select
                            value={tahun}
                            onChange={(e) => onTahunChange?.(e.target.value)}
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
                    className="inline-flex items-center gap-2 bg-[#0072BC] hover:bg-[#005A94] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                    <Filter size={15} /> Terapkan Filter
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total KK</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{totalKK.toLocaleString("id-ID")}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Home size={18} className="text-blue-600" />
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Jiwa</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{totalJiwa.toLocaleString("id-ID")}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-[#0072BC]/10 flex items-center justify-center">
                        <Users size={18} className="text-[#0072BC]" />
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Balita</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{totalBalita.toLocaleString("id-ID")}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                        <Baby size={18} className="text-amber-600" />
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Ibu Hamil & Menyusui</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{totalIbu.toLocaleString("id-ID")}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center">
                        <Activity size={18} className="text-rose-600" />
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Droplet size={15} />
                        <span>Data Kegiatan Warga — {tahun}</span>
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
                    <table className="w-full text-left border-collapse text-xs min-w-[2600px]">
                        {/*
                          HEADER 2 BARIS — 36 kolom, urutan sama dengan <tbody>.
                          (Sebelumnya 3 baris dengan colSpan salah sehingga header
                          bergeser dari "Sehat" ke kanan.)
                        */}
                        <thead>
                            {/* BARIS 1 — kolom tunggal (rowSpan 2) + judul grup */}
                            <tr className="bg-slate-200 text-slate-800 border-b border-slate-300">
                                <th rowSpan={2} className="p-2 border-r border-slate-300 text-center font-bold sticky left-0 bg-slate-200 z-10 min-w-[40px]">No.</th>
                                <th rowSpan={2} className="p-2 border-r border-slate-300 text-center font-bold sticky left-[40px] bg-slate-200 z-10 min-w-[150px]">Nama Kecamatan</th>
                                <th rowSpan={2} className="p-2 border-r border-slate-300 text-center font-bold bg-slate-200 min-w-[70px]">Jumlah Dusun</th>
                                <th rowSpan={2} className="p-2 border-r border-slate-300 text-center font-bold bg-slate-200 min-w-[60px]">Jumlah RW</th>
                                <th rowSpan={2} className="p-2 border-r border-slate-300 text-center font-bold bg-slate-200 min-w-[60px]">Jumlah RT</th>
                                <th rowSpan={2} className="p-2 border-r border-slate-300 text-center font-bold bg-slate-200 min-w-[90px]">Jumlah Dasa Wisma</th>
                                <th rowSpan={2} className="p-2 border-r border-slate-300 text-center font-bold bg-slate-200 min-w-[60px]">Jumlah KRT</th>
                                <th rowSpan={2} className="p-2 border-r border-slate-300 text-center font-bold bg-slate-200 min-w-[60px]">Jumlah KK</th>

                                <th colSpan={2} className="p-2 border-r border-slate-300 text-center font-bold bg-slate-200">Jumlah Anggota Keluarga</th>
                                <th colSpan={2} className="p-2 border-r border-slate-300 text-center font-bold bg-slate-200">Balita</th>

                                <th rowSpan={2} className="p-2 border-r border-slate-300 text-center font-bold bg-slate-200 min-w-[50px]">PUS</th>
                                <th rowSpan={2} className="p-2 border-r border-slate-300 text-center font-bold bg-slate-200 min-w-[50px]">WUS</th>
                                <th rowSpan={2} className="p-2 border-r border-slate-300 text-center font-bold bg-slate-200 min-w-[70px]">Ibu Hamil</th>
                                <th rowSpan={2} className="p-2 border-r border-slate-300 text-center font-bold bg-slate-200 min-w-[80px]">Ibu Menyusui</th>
                                <th rowSpan={2} className="p-2 border-r border-slate-300 text-center font-bold bg-slate-200 min-w-[60px]">Lansia</th>

                                <th colSpan={2} className="p-2 border-r border-slate-300 text-center font-bold bg-slate-200">3 Buta</th>
                                <th colSpan={5} className="p-2 border-r border-slate-300 text-center font-bold bg-slate-200">Kriteria Rumah</th>
                                <th colSpan={4} className="p-2 border-r border-slate-300 text-center font-bold bg-slate-200">Sumber Air Keluarga</th>

                                <th rowSpan={2} className="p-2 border-r border-slate-300 text-center font-bold bg-slate-200 min-w-[90px]">Jumlah Jamban Keluarga</th>

                                <th colSpan={2} className="p-2 border-r border-slate-300 text-center font-bold bg-slate-200">Makanan</th>
                                <th colSpan={4} className="p-2 border-r border-slate-300 text-center font-bold bg-slate-200">Warga Mengikuti Kegiatan</th>

                                <th rowSpan={2} className="p-2 text-center font-bold bg-slate-200 min-w-[80px]">Ket</th>
                            </tr>

                            {/* BARIS 2 — sub-header (21 kolom) */}
                            <tr className="bg-slate-100 text-slate-700 border-b border-slate-300">
                                <th className="p-1.5 border-r border-slate-300 text-center font-medium">Total L</th>
                                <th className="p-1.5 border-r border-slate-300 text-center font-medium">Total P</th>
                                <th className="p-1.5 border-r border-slate-300 text-center font-medium">Balita L</th>
                                <th className="p-1.5 border-r border-slate-300 text-center font-medium">Balita P</th>
                                <th className="p-1.5 border-r border-slate-300 text-center font-medium">L</th>
                                <th className="p-1.5 border-r border-slate-300 text-center font-medium">P</th>
                                <th className="p-1.5 border-r border-slate-300 text-center font-medium">Sehat</th>
                                <th className="p-1.5 border-r border-slate-300 text-center font-medium">Kurang Sehat</th>
                                <th className="p-1.5 border-r border-slate-300 text-center font-medium">Sampah</th>
                                <th className="p-1.5 border-r border-slate-300 text-center font-medium">SPAL</th>
                                <th className="p-1.5 border-r border-slate-300 text-center font-medium">Stiker P4K</th>
                                <th className="p-1.5 border-r border-slate-300 text-center font-medium">PDAM</th>
                                <th className="p-1.5 border-r border-slate-300 text-center font-medium">Sumur</th>
                                <th className="p-1.5 border-r border-slate-300 text-center font-medium">Sungai</th>
                                <th className="p-1.5 border-r border-slate-300 text-center font-medium">DLL</th>
                                <th className="p-1.5 border-r border-slate-300 text-center font-medium">Pokok Beras</th>
                                <th className="p-1.5 border-r border-slate-300 text-center font-medium">Non Beras</th>
                                <th className="p-1.5 border-r border-slate-300 text-center font-medium">UP2K</th>
                                <th className="p-1.5 border-r border-slate-300 text-center font-medium">Tanah Pekarangan</th>
                                <th className="p-1.5 border-r border-slate-300 text-center font-medium">Industri RT</th>
                                <th className="p-1.5 border-r border-slate-300 text-center font-medium">Kesling</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-slate-700">
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={36} className="text-center py-12 text-slate-400">
                                        Belum ada data kegiatan warga.
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((item, idx) => (
                                    <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-2 border-r border-slate-200 text-center text-slate-500 sticky left-0 bg-white z-10">{idx + 1}</td>
                                        <td className="p-2 border-r border-slate-200 font-semibold text-slate-900 sticky left-[40px] bg-white z-10">
                                            {item.nama_kecamatan || item.kecamatan || "-"}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.jumlah_dusun || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.jumlah_rw || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.jumlah_rt || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.jumlah_dasa_wisma || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.jumlah_krt || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.jumlah_kk || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.total_l || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.total_p || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.balita_l || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.balita_p || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.pus || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.wus || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.ibu_hamil || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.ibu_menyusui || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.lansia || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.buta_l || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.buta_p || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.rumah_sehat || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.rumah_kurang_sehat || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.memiliki_tempat_sampah || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.memiliki_spal || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.memiliki_stiker_p4k || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.air_pdam || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.air_sumur || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.air_sungai || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.air_dll || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.jumlah_jamban_keluarga || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.makanan_pokok_beras || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.makanan_pokok_non_beras || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.kegiatan_up2k || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.kegiatan_tanah_pekarangan || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.kegiatan_industri_rumah_tangga || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.kegiatan_kesehatan_lingkungan || 0}</td>
                                        <td className="p-2 text-center">{item.keterangan || "-"}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        {filteredData.length > 0 && (
                            <tfoot>
                                <tr className="bg-slate-200 font-bold text-slate-900 border-t-2 border-slate-400">
                                    <td colSpan={2} className="p-2 border-r border-slate-300 text-center sticky left-0 bg-slate-200 z-10">JUMLAH</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{sum("jumlah_dusun").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{sum("jumlah_rw").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{sum("jumlah_rt").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{sum("jumlah_dasa_wisma").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{sum("jumlah_krt").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{sum("jumlah_kk").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{sum("total_l").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{sum("total_p").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{sum("balita_l").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{sum("balita_p").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{sum("pus").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{sum("wus").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{sum("ibu_hamil").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{sum("ibu_menyusui").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{sum("lansia").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{sum("buta_l").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{sum("buta_p").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{sum("rumah_sehat").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{sum("rumah_kurang_sehat").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{sum("memiliki_tempat_sampah").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{sum("memiliki_spal").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{sum("memiliki_stiker_p4k").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{sum("air_pdam").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{sum("air_sumur").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{sum("air_sungai").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{sum("air_dll").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{sum("jumlah_jamban_keluarga").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{sum("makanan_pokok_beras").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{sum("makanan_pokok_non_beras").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{sum("kegiatan_up2k").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{sum("kegiatan_tanah_pekarangan").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{sum("kegiatan_industri_rumah_tangga").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{sum("kegiatan_kesehatan_lingkungan").toLocaleString("id-ID")}</td>
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
