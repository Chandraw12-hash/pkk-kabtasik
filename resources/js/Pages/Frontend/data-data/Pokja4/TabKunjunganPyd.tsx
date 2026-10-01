import React from "react";
import { Download, Users, Baby, Heart, Calendar } from "lucide-react";

interface KunjunganItem {
    id: number;
    kecamatan?: string;
    bulan: number;
    nama_bulan: string;
    tahun: number;
    bayi_0_12_l?: number;
    bayi_0_12_p?: number;
    bayi_0_12_laki_l?: number;
    bayi_0_12_laki_p?: number;
    balita_1_5_l?: number;
    balita_1_5_p?: number;
    balita_1_5_laki_l?: number;
    balita_1_5_laki_p?: number;
    wus?: number;
    pus?: number;
    ibu_hamil?: number;
    ibu_menyusui?: number;
    bayi_lahir?: number;
    bayi_meninggal?: number;
    kematian_ibu?: number;
    petugas_kader?: number;
    petugas_plkb?: number;
    petugas_medis?: number;
    [key: string]: any;
}

interface Props {
    data: KunjunganItem[];
    tahun?: string;
    onTahunChange?: (tahun: string) => void;
}

export default function TabKunjunganPyd({
    data,
    tahun = new Date().getFullYear().toString(),
    onTahunChange,
}: Props) {
    const items = data || [];

    // ✅ FIX: Group per bulan + jumlahkan semua kecamatan
    const groupedByBulan = items.reduce((acc, item) => {
        const key = `${item.bulan}-${item.nama_bulan}`;
        if (!acc[key]) {
            acc[key] = {
                bulan: item.bulan,
                nama_bulan: item.nama_bulan,
                // Field angka — jumlahkan
                bayi_0_12_l: 0, bayi_0_12_p: 0,
                balita_1_5_l: 0, balita_1_5_p: 0,
                wus: 0, pus: 0,
                ibu_hamil: 0, ibu_menyusui: 0,
                bayi_lahir: 0, bayi_meninggal: 0,
                kematian_ibu: 0,
                petugas_kader: 0, petugas_plkb: 0, petugas_medis: 0,
            };
        }
        // Jumlahkan — semua field — dari setiap kecamatan
        acc[key].bayi_0_12_l += Number(item.bayi_0_12_l) || 0;
        acc[key].bayi_0_12_p += Number(item.bayi_0_12_p) || 0;
        acc[key].balita_1_5_l += Number(item.balita_1_5_l) || 0;
        acc[key].balita_1_5_p += Number(item.balita_1_5_p) || 0;
        acc[key].wus += Number(item.wus) || 0;
        acc[key].pus += Number(item.pus) || 0;
        acc[key].ibu_hamil += Number(item.ibu_hamil) || 0;
        acc[key].ibu_menyusui += Number(item.ibu_menyusui) || 0;
        acc[key].bayi_lahir += Number(item.bayi_lahir) || 0;
        acc[key].bayi_meninggal += Number(item.bayi_meninggal) || 0;
        acc[key].kematian_ibu += Number(item.kematian_ibu) || 0;
        acc[key].petugas_kader += Number(item.petugas_kader) || 0;
        acc[key].petugas_plkb += Number(item.petugas_plkb) || 0;
        acc[key].petugas_medis += Number(item.petugas_medis) || 0;
        return acc;
    }, {} as Record<string, KunjunganItem & { pus: number }>);

    // Urutkan berdasarkan bulan (1-12)
    const groupedItems = Object.values(groupedByBulan).sort(
        (a, b) => a.bulan - b.bulan
    );

    // Hitung total dari grouped — bukan dari raw items
    const totalBayi = groupedItems.reduce(
        (a, c) => a + (Number(c.bayi_0_12_l) || 0) + (Number(c.bayi_0_12_p) || 0),
        0
    );
    const totalBalita = groupedItems.reduce(
        (a, c) => a + (Number(c.balita_1_5_l) || 0) + (Number(c.balita_1_5_p) || 0),
        0
    );
    const totalWus = groupedItems.reduce((a, c) => a + (Number(c.wus) || 0), 0);
    const totalIbuHamil = groupedItems.reduce(
        (a, c) => a + (Number(c.ibu_hamil) || 0),
        0
    );

    // Hitung total per kolom untuk footer
    const sumField = (key: keyof KunjunganItem) =>
        groupedItems.reduce((a, c) => a + (Number(c[key]) || 0), 0);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div>
                <p className="text-[#0072BC] text-xs font-semibold tracking-wide uppercase mb-1">POKJA IV</p>
                <h2 className="text-2xl font-bold text-slate-900">Data Kunjungan PYD</h2>
                <p className="text-slate-500 text-sm mt-1">
                    Jumlah pengunjung, petugas posyandu, bayi lahir & meninggal —{" "}
                    <span className="font-semibold text-slate-700">rekap per bulan</span>{" "}
                    (semua kecamatan).
                </p>
            </div>

            {/* Filter + Export */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap gap-3 items-center justify-between">
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

                <a
                    href={`/pokja-4/export-pyd?tahun=${tahun}`}
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                    <Download size={15} />
                    Export Excel
                </a>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                    <div className="flex items-center gap-2">
                        <Baby size={16} className="text-blue-600" />
                        <p className="text-xs font-medium text-slate-500 uppercase">Total Bayi</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{totalBayi.toLocaleString("id-ID")}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                    <div className="flex items-center gap-2">
                        <Users size={16} className="text-teal-600" />
                        <p className="text-xs font-medium text-slate-500 uppercase">Total Balita</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{totalBalita.toLocaleString("id-ID")}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                    <div className="flex items-center gap-2">
                        <Heart size={16} className="text-rose-600" />
                        <p className="text-xs font-medium text-slate-500 uppercase">Total WUS</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{totalWus.toLocaleString("id-ID")}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                    <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-amber-600" />
                        <p className="text-xs font-medium text-slate-500 uppercase">Ibu Hamil</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{totalIbuHamil.toLocaleString("id-ID")}</p>
                </div>
            </div>

            {/* Tabel — Group per Bulan */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-200">
                    <h3 className="font-bold text-slate-800">Rekap Kunjungan PYD per Bulan</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Data dari semua kecamatan — dijumlahkan per bulan
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs min-w-[1000px]">
                        <thead>
                            <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                                <th className="p-2 border-r border-slate-200 text-center font-bold">NO</th>
                                <th className="p-2 border-r border-slate-200 text-center font-bold min-w-[120px]">BULAN</th>
                                <th className="p-2 border-r border-slate-200 text-center font-bold bg-slate-50">BAYI 0-12 L</th>
                                <th className="p-2 border-r border-slate-200 text-center font-bold bg-slate-50">BAYI 0-12 P</th>
                                <th className="p-2 border-r border-slate-200 text-center font-bold bg-slate-50">BALITA 1-5 L</th>
                                <th className="p-2 border-r border-slate-200 text-center font-bold bg-slate-50">BALITA 1-5 P</th>
                                <th className="p-2 border-r border-slate-200 text-center font-bold bg-slate-50">WUS</th>
                                <th className="p-2 border-r border-slate-200 text-center font-bold bg-slate-50">IBU HAMIL</th>
                                <th className="p-2 border-r border-slate-200 text-center font-bold bg-slate-50">MENYUSUI</th>
                                <th className="p-2 text-center font-bold bg-slate-50">BAYI LAHIR</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {groupedItems.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="text-center py-12 text-slate-400">
                                        Belum ada data kunjungan PYD untuk tahun ini.
                                    </td>
                                </tr>
                            ) : (
                                groupedItems.map((item, idx) => (
                                    <tr key={`${item.bulan}-${idx}`} className="hover:bg-slate-50">
                                        <td className="p-2 border-r border-slate-200 text-center text-slate-500">{idx + 1}</td>
                                        <td className="p-2 border-r border-slate-200 text-center font-semibold text-slate-900">
                                            {item.nama_bulan}
                                        </td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.bayi_0_12_l || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.bayi_0_12_p || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.balita_1_5_l || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.balita_1_5_p || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.wus || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.ibu_hamil || 0}</td>
                                        <td className="p-2 border-r border-slate-200 text-center">{item.ibu_menyusui || 0}</td>
                                        <td className="p-2 text-center">{item.bayi_lahir || 0}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        {groupedItems.length > 0 && (
                            <tfoot>
                                <tr className="bg-slate-100 font-bold text-slate-800 border-t-2 border-slate-300">
                                    <td colSpan={2} className="p-2 border-r border-slate-200 border-slate-200 text-center">
                                        JUMLAH
                                    </td>
                                    <td className="p-2 border-r border-slate-200 border-slate-200 text-center">{sumField("bayi_0_12_l")}</td>
                                    <td className="p-2 border-r border-slate-200 border-slate-200 text-center">{sumField("bayi_0_12_p")}</td>
                                    <td className="p-2 border-r border-slate-200 border-slate-200 text-center">{sumField("balita_1_5_l")}</td>
                                    <td className="p-2 border-r border-slate-200 border-slate-200 text-center">{sumField("balita_1_5_p")}</td>
                                    <td className="p-2 border-r border-slate-200 border-slate-200 text-center">{sumField("wus")}</td>
                                    <td className="p-2 border-r border-slate-200 border-slate-200 text-center">{sumField("ibu_hamil")}</td>
                                    <td className="p-2 border-r border-slate-200 border-slate-200 text-center">{sumField("ibu_menyusui")}</td>
                                    <td className="p-2 text-center">{sumField("bayi_lahir")}</td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>
        </div>
    );
}
