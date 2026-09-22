import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import {
    Search,
    Filter,
    Users,
    Home,
    Baby,
    Activity,
    Droplet,
} from "lucide-react";

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

    const uniqueKecamatan = Array.from(
        new Set(items.map((item) => item.nama_kecamatan || item.kecamatan).filter(Boolean))
    );

    const filteredData = items.filter((item) => {
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
                    <table className="w-full text-left border-collapse text-xs min-w-[2400px]">
                        <thead>
                            <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                                <th rowSpan={2} className="p-2 border-r border-slate-200 text-center font-bold sticky left-0 bg-slate-100 z-10 min-w-[40px]">NO</th>
                                <th rowSpan={2} className="p-2 border-r border-slate-200 text-center font-bold sticky left-[40px] bg-slate-100 z-10 min-w-[150px]">KECAMATAN</th>
                                <th colSpan={6} className="p-2 border-r border-slate-200 text-center font-bold bg-blue-50">JUMLAH WILAYAH</th>
                                <th colSpan={2} className="p-2 border-r border-slate-200 text-center font-bold bg-green-50">KK</th>
                                <th colSpan={2} className="p-2 border-r border-slate-200 text-center font-bold bg-amber-50">ANGGOTA KELUARGA</th>
                                <th colSpan={2} className="p-2 border-r border-slate-200 text-center font-bold bg-rose-50">BALITA</th>
                                <th colSpan={5} className="p-2 border-r border-slate-200 text-center font-bold bg-indigo-50">KATEGORI WARGA</th>
                                <th colSpan={2} className="p-2 border-r border-slate-200 text-center font-bold bg-purple-50">3 BUTA</th>
                                <th colSpan={2} className="p-2 border-r border-slate-200 text-center font-bold bg-teal-50">RUMAH</th>
                                <th colSpan={3} className="p-2 border-r border-slate-200 text-center font-bold bg-cyan-50">SANITASI</th>
                                <th colSpan={4} className="p-2 border-r border-slate-200 text-center font-bold bg-sky-50">SUMBER AIR</th>
                                <th rowSpan={2} className="p-2 border-r border-slate-200 text-center font-bold bg-blue-100">JAMBAN</th>
                                <th colSpan={2} className="p-2 border-r border-slate-200 text-center font-bold bg-lime-50">MAKANAN POKOK</th>
                                <th colSpan={4} className="p-2 text-center font-bold bg-emerald-50">KEGIATAN</th>
                            </tr>
                            <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                                <th className="p-2 border-r border-slate-200 text-center bg-blue-50/50">Dusun</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-blue-50/50">RW</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-blue-50/50">RT</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-blue-50/50">Dasa Wisma</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-blue-50/50">KRT</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-blue-50/50">KK</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-green-50/50">L</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-green-50/50">P</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-amber-50/50">L</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-amber-50/50">P</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-rose-50/50">L</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-rose-50/50">P</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-indigo-50/50">PUS</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-indigo-50/50">WUS</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-indigo-50/50">Hamil</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-indigo-50/50">Menyusui</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-indigo-50/50">Lansia</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-purple-50/50">L</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-purple-50/50">P</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-teal-50/50">Sehat</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-teal-50/50">Kurang</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-cyan-50/50">Sampah</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-cyan-50/50">SPAL</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-cyan-50/50">P4K</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-sky-50/50">PDAM</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-sky-50/50">Sumur</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-sky-50/50">Sungai</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-sky-50/50">DLL</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-lime-50/50">Beras</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-lime-50/50">Non</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-emerald-50/50">UP2K</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-emerald-50/50">Pekarangan</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-emerald-50/50">Industri</th>
                                <th className="p-2 text-center bg-emerald-50/50">Kesling</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={35} className="text-center py-12 text-slate-400">
                                        Belum ada data kegiatan warga.
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((item, idx) => (
                                    <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-2 border-r border-slate-100 text-center text-slate-500 sticky left-0 bg-white z-10">{idx + 1}</td>
                                        <td className="p-2 border-r border-slate-100 font-semibold text-slate-900 sticky left-[40px] bg-white z-10">
                                            {item.nama_kecamatan || item.kecamatan || "-"}
                                        </td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.jumlah_dusun || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.jumlah_rw || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.jumlah_rt || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.jumlah_dasa_wisma || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.jumlah_krt || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.jumlah_kk || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.total_l || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.total_p || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.balita_l || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.balita_p || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.pus || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.wus || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.ibu_hamil || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.ibu_menyusui || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.lansia || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.buta_l || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.buta_p || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.rumah_sehat || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.rumah_kurang_sehat || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.memiliki_tempat_sampah || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.memiliki_spal || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.memiliki_stiker_p4k || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.air_pdam || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.air_sumur || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.air_sungai || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.air_dll || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.jumlah_jamban_keluarga || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.makanan_pokok_beras || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.makanan_pokok_non_beras || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.kegiatan_up2k || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.kegiatan_tanah_pekarangan || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.kegiatan_industri_rumah_tangga || 0}</td>
                                        <td className="p-2 text-center">{item.kegiatan_kesehatan_lingkungan || 0}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        {filteredData.length > 0 && (
                            <tfoot>
                                <tr className="bg-slate-100 font-bold text-slate-800 border-t-2 border-slate-300">
                                    <td colSpan={2} className="p-2 border-r border-slate-200 text-center sticky left-0 bg-slate-100 z-10">JUMLAH</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("jumlah_dusun").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("jumlah_rw").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("jumlah_rt").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("jumlah_dasa_wisma").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("jumlah_krt").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("jumlah_kk").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("total_l").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("total_p").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("balita_l").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("balita_p").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("pus").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("wus").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("ibu_hamil").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("ibu_menyusui").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("lansia").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("buta_l").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("buta_p").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("rumah_sehat").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("rumah_kurang_sehat").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("memiliki_tempat_sampah").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("memiliki_spal").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("memiliki_stiker_p4k").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("air_pdam").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("air_sumur").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("air_sungai").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("air_dll").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("jumlah_jamban_keluarga").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("makanan_pokok_beras").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("makanan_pokok_non_beras").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("kegiatan_up2k").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("kegiatan_tanah_pekarangan").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("kegiatan_industri_rumah_tangga").toLocaleString("id-ID")}</td>
                                    <td className="p-2 text-center">{sum("kegiatan_kesehatan_lingkungan").toLocaleString("id-ID")}</td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>
        </div>
    );
}
