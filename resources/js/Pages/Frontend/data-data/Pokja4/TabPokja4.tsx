import React, { useState } from "react";
import {
    Search, HeartPulse, Activity, ShieldPlus, Users, Home,
    Droplets, Leaf, PiggyBank, Download,
} from "lucide-react";

interface Pokja4Item {
    id: number;
    kecamatan?: string;
    nama_kecamatan?: string;
    kader_kesehatan?: number;
    kader_gizi?: number;
    kader_kesling?: number;
    kader_phbs?: number;
    kader_kb?: number;
    posyandu?: number;
    imunisasi?: number;
    pkg?: number;
    tbc?: number;
    jamban_keluarga?: number;
    spal?: number;
    tps?: number;
    mck?: number;
    air_pdam?: number;
    air_sumur?: number;
    air_lainnya?: number;
    jumlah_pus?: number;
    jumlah_wus?: number;
    akseptor_kb_l?: number;
    akseptor_kb_p?: number;
    tabungan_keluarga?: number;
    asuransi_kesehatan?: number;
    phbs?: number;
    program_kesehatan?: string | null;
    program_lingkungan?: string | null;
    program_perencanaan?: string | null;
    [key: string]: any;
}

interface Props {
    data: {
        data: Pokja4Item[];
        links: any[];
    };
    tahun?: string;
    onTahunChange?: (tahun: string) => void;
}

export default function TabPokja4({
    data,
    tahun = new Date().getFullYear().toString(),
    onTahunChange,
}: Props) {
    const [search, setSearch] = useState("");

    const items: Pokja4Item[] = data?.data || [];

    const filteredData: Pokja4Item[] = items.filter((item) =>
        (item.kecamatan || item.nama_kecamatan || "")
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const sum = (key: keyof Pokja4Item): number =>
        filteredData.reduce((a, c) => a + (Number(c[key]) || 0), 0);

    const totalKaderKesehatan = sum("kader_kesehatan");
    const totalKaderGizi = sum("kader_gizi");
    const totalKaderKesling = sum("kader_kesling");
    const totalKaderPhbs = sum("kader_phbs");
    const totalKaderKb = sum("kader_kb");
    const totalPosyandu = sum("posyandu");
    const totalImunisasi = sum("imunisasi");
    const totalPkg = sum("pkg");
    const totalTbc = sum("tbc");
    const totalJamban = sum("jamban_keluarga");
    const totalSpal = sum("spal");
    const totalTps = sum("tps");
    const totalMck = sum("mck");
    const totalAirPdam = sum("air_pdam");
    const totalAirSumur = sum("air_sumur");
    const totalAirLainnya = sum("air_lainnya");
    const totalPus = sum("jumlah_pus");
    const totalWus = sum("jumlah_wus");
    const totalKbL = sum("akseptor_kb_l");
    const totalKbP = sum("akseptor_kb_p");
    const totalTabungan = sum("tabungan_keluarga");
    const totalAsuransi = sum("asuransi_kesehatan");
    const totalPhbs = sum("phbs");

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Judul */}
            <div>
                <p className="text-[#0072BC] text-xs font-semibold tracking-wide uppercase mb-1">
                    POKJA IV
                </p>
                <h2 className="text-2xl font-bold text-slate-900">
                    Rekapitulasi Data Pokja IV Tingkat Kecamatan
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                    Kesehatan, Kelestarian Lingkungan Hidup, dan Perencanaan Sehat.
                </p>
            </div>

            {/* Filter + Export */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
                <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
                    <div className="relative flex-1 min-w-[180px]">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari kecamatan..."
                            className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#0072BC]"
                        />
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
                            <option value="2024">2024</option>
                        </select>
                    </div>
                </div>

                <a
                    href={`/pokja-4/export?tahun=${tahun}`}
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                    <Download size={15} />
                    Export Excel
                </a>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Posyandu</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{totalPosyandu.toLocaleString("id-ID")}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <HeartPulse size={18} className="text-slate-600" />
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Akseptor KB</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{(totalKbL + totalKbP).toLocaleString("id-ID")}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Activity size={18} className="text-slate-600" />
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Rumah PHBS</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{totalPhbs.toLocaleString("id-ID")}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <ShieldPlus size={18} className="text-slate-600" />
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Jamban</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{totalJamban.toLocaleString("id-ID")}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Home size={18} className="text-slate-600" />
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Kader</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">
                            {(totalKaderKesehatan + totalKaderGizi + totalKaderKesling + totalKaderPhbs + totalKaderKb).toLocaleString("id-ID")}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Users size={18} className="text-slate-600" />
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Imunisasi</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{totalImunisasi.toLocaleString("id-ID")}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Leaf size={18} className="text-slate-600" />
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Air Bersih</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">
                            {(totalAirPdam + totalAirSumur + totalAirLainnya).toLocaleString("id-ID")}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Droplets size={18} className="text-slate-600" />
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tabungan Keluarga</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{totalTabungan.toLocaleString("id-ID")}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                        <PiggyBank size={18} className="text-slate-600" />
                    </div>
                </div>
            </div>

            {/* Tabel */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex items-center gap-2 text-sm text-slate-600">
                    <span>Tampilkan data wilayah</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs min-w-[2000px]">
                        <thead>
                            {/* BARIS 1 — GROUP UTAMA */}
                            <tr className="bg-slate-200 text-slate-800 border-b border-slate-300">
                                <th rowSpan={3} className="p-2 border-r border-slate-300 text-center font-bold sticky left-0 bg-slate-200 z-10 min-w-[40px]">No.</th>
                                <th rowSpan={3} className="p-2 border-r border-slate-300 text-center font-bold sticky left-[40px] bg-slate-200 z-10 min-w-[150px]">Nama Kecamatan</th>
                                <th colSpan={9} className="p-2 border-r border-slate-300 text-center font-bold bg-slate-200">KESEHATAN</th>
                                <th colSpan={7} className="p-2 border-r border-slate-300 text-center font-bold bg-slate-200">KELESTARIAN LINGKUNGAN</th>
                                <th colSpan={6} className="p-2 border-r border-slate-300 text-center font-bold bg-slate-200">PERENCANAAN SEHAT</th>
                                <th colSpan={3} className="p-2 border-r border-slate-300 text-center font-bold bg-slate-200">PROGRAM UNGGULAN</th>
                            </tr>

                            {/* BARIS 2 — SUB-GROUP */}
                            <tr className="bg-slate-100 text-slate-700 border-b border-slate-300">
                                <th colSpan={5} className="p-1 border-r border-slate-300 text-center font-semibold">JUMLAH KADER</th>
                                <th rowSpan={2} className="p-1 border-r border-slate-300 text-center font-semibold">POSYANDU</th>
                                <th rowSpan={2} className="p-1 border-r border-slate-300 text-center font-semibold">IMUNISASI</th>
                                <th rowSpan={2} className="p-1 border-r border-slate-300 text-center font-semibold">PKG</th>
                                <th rowSpan={2} className="p-1 border-r border-slate-300 text-center font-semibold">TBC</th>

                                <th colSpan={3} className="p-1 border-r border-slate-300 text-center font-semibold">JUMLAH RUMAH</th>
                                <th rowSpan={2} className="p-1 border-r border-slate-300 text-center font-semibold">MCK</th>
                                <th colSpan={3} className="p-1 border-r border-slate-300 text-center font-semibold">KRT MENGGUNAKAN AIR</th>

                                <th rowSpan={2} className="p-1 border-r border-slate-300 text-center font-semibold">PUS</th>
                                <th rowSpan={2} className="p-1 border-r border-slate-300 text-center font-semibold">WUS</th>
                                <th colSpan={2} className="p-1 border-r border-slate-300 text-center font-semibold">AKSEPTOR KB</th>
                                <th rowSpan={2} className="p-1 border-r border-slate-300 text-center font-semibold">TABUNGAN</th>
                                <th rowSpan={2} className="p-1 border-r border-slate-300 text-center font-semibold">ASURANSI</th>

                                <th rowSpan={2} className="p-1 border-r border-slate-300 text-center font-semibold">KESEHATAN</th>
                                <th rowSpan={2} className="p-1 border-r border-slate-300 text-center font-semibold">LINGKUNGAN</th>
                                <th rowSpan={2} className="p-1 border-r border-slate-300 text-center font-semibold">PERENCANAAN</th>
                            </tr>

                            {/* BARIS 3 — SUB-SUB-KOLOM */}
                            <tr className="bg-slate-50 text-slate-600 border-b border-slate-300">
                                <th className="p-1.5 border-r border-slate-300 text-center font-medium">KES.</th>
                                <th className="p-1.5 border-r border-slate-300 text-center font-medium">GIZI</th>
                                <th className="p-1.5 border-r border-slate-300 text-center font-medium">KESLING</th>
                                <th className="p-1.5 border-r border-slate-300 text-center font-medium">PHBS</th>
                                <th className="p-1.5 border-r border-slate-300 text-center font-medium">KB</th>

                                <th className="p-1.5 border-r border-slate-300 text-center font-medium">JAMBAN</th>
                                <th className="p-1.5 border-r border-slate-300 text-center font-medium">SPAL</th>
                                <th className="p-1.5 border-r border-slate-300 text-center font-medium">TPS</th>

                                <th className="p-1.5 border-r border-slate-300 text-center font-medium">PDAM</th>
                                <th className="p-1.5 border-r border-slate-300 text-center font-medium">SUMUR</th>
                                <th className="p-1.5 border-r border-slate-300 text-center font-medium">LAIN</th>

                                <th className="p-1.5 border-r border-slate-300 text-center font-medium">L</th>
                                <th className="p-1.5 border-r border-slate-300 text-center font-medium">P</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-slate-700">
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={27} className="text-center py-12 text-slate-400">
                                        Belum ada data kecamatan untuk Pokja IV.
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((item, idx) => (
                                    <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-2 border-r border-slate-200 text-center text-slate-500 sticky left-0 bg-white z-10">{idx + 1}</td>
                                        <td className="p-2 border-r border-slate-200 font-semibold text-slate-900 sticky left-[40px] bg-white z-10">
                                            {item.nama_kecamatan || item.kecamatan || "-"}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.kader_kesehatan || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.kader_gizi || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.kader_kesling || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.kader_phbs || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.kader_kb || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.posyandu || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.imunisasi || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.pkg || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.tbc || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.jamban_keluarga || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.spal || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.tps || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.mck || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.air_pdam || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.air_sumur || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.air_lainnya || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.jumlah_pus || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.jumlah_wus || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.akseptor_kb_l || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.akseptor_kb_p || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.tabungan_keluarga || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.asuransi_kesehatan || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center font-bold text-[#0072BC]">{item.program_kesehatan || "V"}</td>
                                        <td className="p-2 border-r border-slate-200 text-center font-bold text-[#0072BC]">{item.program_lingkungan || "V"}</td>
                                        <td className="p-2 text-center font-bold text-[#0072BC]">{item.program_perencanaan || "V"}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        {filteredData.length > 0 && (
                            <tfoot>
                                <tr className="bg-slate-200 font-bold text-slate-900 border-t-2 border-slate-400">
                                    <td colSpan={2} className="p-2 border-r border-slate-300 text-center sticky left-0 bg-slate-200 z-10">JUMLAH</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{totalKaderKesehatan.toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{totalKaderGizi.toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{totalKaderKesling.toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{totalKaderPhbs.toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{totalKaderKb.toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{totalPosyandu.toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{totalImunisasi.toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{totalPkg.toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{totalTbc.toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{totalJamban.toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{totalSpal.toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{totalTps.toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{totalMck.toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{totalAirPdam.toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{totalAirSumur.toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{totalAirLainnya.toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{totalPus.toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{totalWus.toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{totalKbL.toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{totalKbP.toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{totalTabungan.toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">{totalAsuransi.toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-300 text-center">-</td>
                                    <td className="p-2 border-r border-slate-300 text-center">-</td>
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
