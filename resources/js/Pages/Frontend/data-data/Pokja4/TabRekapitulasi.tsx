import React from "react";
import { Download, ClipboardList, Users, Baby, Heart, FileText } from "lucide-react";

interface RekapitulasiItem {
    id: number;
    kecamatan: string;
    tahun: number;
    dusun?: string;
    rw?: string;
    rt?: string;
    dasa_wisma?: string;
    ibu_hamil?: number;
    ibu_melahirkan?: number;
    ibu_nifas?: number;
    ibu_meninggal?: number;
    bayi_lahir_l?: number;
    bayi_lahir_p?: number;
    akte_ada?: number;
    akte_tidak?: number;
    bayi_meninggal_l?: number;
    bayi_meninggal_p?: number;
    balita_meninggal_l?: number;
    balita_meninggal_p?: number;
    keterangan?: string;
    [key: string]: any;
}

interface Props {
    data?: RekapitulasiItem[];
    tahun?: string;
    onTahunChange?: (tahun: string) => void;
}

export default function TabRekapitulasi({
    data = [],
    tahun = new Date().getFullYear().toString(),
    onTahunChange,
}: Props) {
    const items = data || [];

    const sum = (key: keyof RekapitulasiItem) =>
        items.reduce((a, c) => a + (Number(c[key]) || 0), 0);

    // Total per kolom
    const totalIbuHamil = sum("ibu_hamil");
    const totalIbuMelahirkan = sum("ibu_melahirkan");
    const totalIbuNifas = sum("ibu_nifas");
    const totalIbuMeninggal = sum("ibu_meninggal");
    const totalBayiLahirL = sum("bayi_lahir_l");
    const totalBayiLahirP = sum("bayi_lahir_p");
    const totalBayiLahir = totalBayiLahirL + totalBayiLahirP;
    const totalAkteAda = sum("akte_ada");
    const totalAkteTidak = sum("akte_tidak");
    const totalBayiMeninggalL = sum("bayi_meninggal_l");
    const totalBayiMeninggalP = sum("bayi_meninggal_p");
    const totalBayiMeninggal = totalBayiMeninggalL + totalBayiMeninggalP;
    const totalBalitaMeninggalL = sum("balita_meninggal_l");
    const totalBalitaMeninggalP = sum("balita_meninggal_p");
    const totalBalitaMeninggal = totalBalitaMeninggalL + totalBalitaMeninggalP;

    return (
        <div className="p-5 space-y-6">
            {/* FILTER + EXPORT */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
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
                    href={`/pokja-4/export?tahun=${tahun}`}
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                    <Download size={15} />
                    Export Excel
                </a>
            </div>

            {/* METRIC CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Heart size={14} className="text-slate-600" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ibu Hamil</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{totalIbuHamil.toLocaleString("id-ID")}</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Baby size={14} className="text-slate-600" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bayi Lahir</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{totalBayiLahir.toLocaleString("id-ID")}</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <FileText size={14} className="text-slate-600" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Akte Ada</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{totalAkteAda.toLocaleString("id-ID")}</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Users size={14} className="text-slate-600" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ibu Meninggal</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{totalIbuMeninggal.toLocaleString("id-ID")}</p>
                </div>
            </div>

            {/* TABEL */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-200">
                    <h3 className="font-bold text-slate-800">Rekapitulasi Data Ibu Hamil, Melahirkan, Nifas</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Rekap per kecamatan — tingkat TP-PKK Kabupaten</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs min-w-[1200px]">
                        <thead>
                            <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                                <th rowSpan={2} className="p-2 border-r border-slate-200 text-center font-bold sticky left-0 bg-slate-100 z-10">NO</th>
                                <th rowSpan={2} className="p-2 border-r border-slate-200 text-center font-bold sticky left-[50px] bg-slate-100 z-10 min-w-[140px]">KECAMATAN</th>
                                <th colSpan={4} className="p-2 border-r border-slate-200 text-center font-bold bg-slate-200">IBU</th>
                                <th colSpan={4} className="p-2 border-r border-slate-200 text-center font-bold bg-slate-200">BAYI LAHIR</th>
                                <th colSpan={2} className="p-2 border-r border-slate-200 text-center font-bold bg-slate-200">BAYI MENINGGAL</th>
                                <th colSpan={2} className="p-2 text-center font-bold bg-slate-200">BALITA MENINGGAL</th>
                            </tr>
                            <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">Hamil</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">Melahirkan</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">Nifas</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">Meninggal</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">L</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">P</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">Akte Ada</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">Akte Tidak</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">L</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">P</th>
                                <th className="p-2 border-r border-slate-200 text-center font-semibold bg-slate-50">L</th>
                                <th className="p-2 text-center font-semibold bg-slate-50">P</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={14} className="text-center py-12 text-slate-400">
                                        Belum ada data rekapitulasi untuk tahun ini.
                                    </td>
                                </tr>
                            ) : (
                                items.map((item, idx) => (
                                    <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-2 border-r border-slate-100 text-center text-slate-500 sticky left-0 bg-white z-10">{idx + 1}</td>
                                        <td className="p-2 border-r border-slate-100 font-semibold text-slate-900 sticky left-[50px] bg-white z-10">
                                            {item.kecamatan || "-"}
                                        </td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.ibu_hamil || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.ibu_melahirkan || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.ibu_nifas || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.ibu_meninggal || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.bayi_lahir_l || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.bayi_lahir_p || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.akte_ada || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.akte_tidak || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.bayi_meninggal_l || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.bayi_meninggal_p || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.balita_meninggal_l || 0}</td>
                                        <td className="p-2 text-center">{item.balita_meninggal_p || 0}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        {items.length > 0 && (
                            <tfoot>
                                <tr className="bg-slate-100 font-bold text-slate-800 border-t-2 border-slate-300">
                                    <td colSpan={2} className="p-2 border-r border-slate-200 text-center sticky left-0 bg-slate-100 z-10">JUMLAH</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{totalIbuHamil}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{totalIbuMelahirkan}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{totalIbuNifas}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{totalIbuMeninggal}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{totalBayiLahirL}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{totalBayiLahirP}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{totalAkteAda}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{totalAkteTidak}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{totalBayiMeninggalL}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{totalBayiMeninggalP}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{totalBalitaMeninggalL}</td>
                                    <td className="p-2 text-center">{totalBalitaMeninggalP}</td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>
        </div>
    );
}
