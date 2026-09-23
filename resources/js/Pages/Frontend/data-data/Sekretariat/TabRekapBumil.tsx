import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { Search, Filter, Heart, Baby, Activity, Users } from "lucide-react";

interface RekapBumilItem {
    id: number;
    kecamatan?: string;
    nama_kecamatan?: string;
    bulan?: number;
    nama_bulan?: string;
    jumlah_dusun?: number;
    jumlah_rw?: number;
    jumlah_rt?: number;
    jumlah_dasa_wisma?: number;
    ibu_hamil?: number;
    ibu_melahirkan?: number;
    ibu_nifas?: number;
    ibu_meninggal?: number;
    bayi_lahir_l?: number;
    bayi_lahir_p?: number;
    akte_ada?: number;
    akte_tidak_ada?: number;
    bayi_meninggal_l?: number;
    bayi_meninggal_p?: number;
    balita_meninggal_l?: number;
    balita_meninggal_p?: number;
    keterangan?: string;
    [key: string]: any;
}

interface Props {
    data: RekapBumilItem[];
    tahun?: string;
    onTahunChange?: (tahun: string) => void;
}

export default function TabRekapBumil({
    data = [],
    tahun = new Date().getFullYear().toString(),
    onTahunChange,
}: Props) {
    const [search, setSearch] = useState("");
    const [selectedKecamatan, setSelectedKecamatan] = useState("");

    const items = Array.isArray(data) ? data : (data?.data || []);

    const numericFields: (keyof RekapBumilItem)[] = [
        "jumlah_dusun",
        "jumlah_rw",
        "jumlah_rt",
        "jumlah_dasa_wisma",
        "ibu_hamil",
        "ibu_melahirkan",
        "ibu_nifas",
        "ibu_meninggal",
        "bayi_lahir_l",
        "bayi_lahir_p",
        "akte_ada",
        "akte_tidak_ada",
        "bayi_meninggal_l",
        "bayi_meninggal_p",
        "balita_meninggal_l",
        "balita_meninggal_p",
    ];

    // Satu kecamatan boleh memiliki beberapa bulan. Gabungkan hanya record
    // dengan kecamatan dan bulan yang sama agar data antarbulan tidak tercampur.
    const mergedItems = Array.from(
        items.reduce((groups, item) => {
            const name = (
                item.nama_kecamatan ||
                item.kecamatan ||
                "Tidak diketahui"
            ).trim();
            const key = `${name.toLocaleLowerCase()}-${item.bulan ?? 0}`;
            const current = groups.get(key);

            if (!current) {
                groups.set(key, { ...item, nama_kecamatan: name });
                return groups;
            }

            numericFields.forEach((field) => {
                current[field] =
                    (Number(current[field]) || 0) + (Number(item[field]) || 0);
            });
            groups.set(key, current);
            return groups;
        }, new Map<string, RekapBumilItem>()).values()
    );

    const uniqueKecamatan = Array.from(
        new Set(
            mergedItems
                .map((item) => item.nama_kecamatan || item.kecamatan)
                .filter(Boolean)
        )
    );

    const filteredData = mergedItems.filter((item) => {
        const nama = (item.nama_kecamatan || item.kecamatan || "").toLowerCase();
        const matchesSearch = nama.includes(search.toLowerCase());
        const matchesKecamatan = selectedKecamatan
            ? (item.nama_kecamatan || item.kecamatan) === selectedKecamatan
            : true;
        return matchesSearch && matchesKecamatan;
    });

    const sum = (key: keyof RekapBumilItem) =>
        filteredData.reduce((a, c) => a + (Number(c[key]) || 0), 0);

    const totalIbuHamil = sum("ibu_hamil");
    const totalIbuMelahirkan = sum("ibu_melahirkan");
    const totalIbuNifas = sum("ibu_nifas");
    const totalBayiLahir = sum("bayi_lahir_l") + sum("bayi_lahir_p");

    const sumBayiL = sum("bayi_lahir_l");
    const sumBayiP = sum("bayi_lahir_p");
    const totalGender = sumBayiL + sumBayiP || 1;
    const percentP = (sumBayiP / totalGender) * 100;

    const handleApplyFilter = () => {
        router.get(
            "/sekretariat",
            {
                kecamatan: selectedKecamatan || undefined,
                year: tahun,
                activeTab: "rekap-bumil",
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
                    Rekapitulasi Data Bumil & Bayi
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                    Rekap ibu hamil, melahirkan, nifas, dan data bayi — {tahun}.
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
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Ibu Hamil</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{totalIbuHamil.toLocaleString("id-ID")}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center">
                        <Heart size={18} className="text-rose-600" />
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Ibu Melahirkan</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{totalIbuMelahirkan.toLocaleString("id-ID")}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Activity size={18} className="text-blue-600" />
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Ibu Nifas</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{totalIbuNifas.toLocaleString("id-ID")}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                        <Users size={18} className="text-amber-600" />
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Bayi Lahir</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{totalBayiLahir.toLocaleString("id-ID")}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                        <Baby size={18} className="text-teal-600" />
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
                <h3 className="text-base font-bold text-slate-900 mb-2">
                    Komposisi Bayi Lahir Berdasarkan Gender
                </h3>
                {totalBayiLahir === 0 ? (
                    <div className="h-40 flex flex-col items-center justify-center text-slate-400">
                        <Baby size={32} className="mb-2 text-slate-300" />
                        <p className="text-sm">Belum ada data untuk ditampilkan</p>
                    </div>
                ) : (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4">
                        <div
                            className="w-40 h-40 rounded-full relative shadow-inner"
                            style={{
                                background: `conic-gradient(#38bdf8 0% ${100 - percentP}%, #fb7185 ${100 - percentP}% 100%)`,
                            }}
                        >
                            <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                                <span className="text-xs text-slate-400 font-medium">Total</span>
                                <span className="text-sm font-bold text-slate-800">{totalBayiLahir.toLocaleString("id-ID")}</span>
                            </div>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-4 h-4 bg-sky-400 rounded-md"></span>
                                <span className="text-slate-600 font-medium">Bayi Laki-laki:</span>
                                <span className="font-bold text-slate-900">{sumBayiL.toLocaleString("id-ID")}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-4 h-4 bg-rose-400 rounded-md"></span>
                                <span className="text-slate-600 font-medium">Bayi Perempuan:</span>
                                <span className="font-bold text-slate-900">{sumBayiP.toLocaleString("id-ID")}</span>
                            </div>
                            <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                                <span className="text-xs text-slate-400">Persentase P</span>
                                <span className="font-bold text-[#0072BC]">{percentP.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Baby size={15} />
                        <span>Rekap Bumil & Bayi — {tahun}</span>
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
                    <table className="w-full text-left border-collapse text-xs min-w-[1400px]">
                        <thead>
                            <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                                <th rowSpan={2} className="p-2 border-r border-slate-200 text-center font-bold sticky left-0 bg-slate-100 z-10 min-w-[40px]">NO</th>
                                <th rowSpan={2} className="p-2 border-r border-slate-200 text-center font-bold sticky left-[40px] bg-slate-100 z-10 min-w-[150px]">KECAMATAN</th>
                                <th colSpan={4} className="p-2 border-r border-slate-200 text-center font-bold bg-blue-50">JUMLAH WILAYAH</th>
                                <th colSpan={4} className="p-2 border-r border-slate-200 text-center font-bold bg-rose-50">JUMLAH IBU</th>
                                <th colSpan={2} className="p-2 border-r border-slate-200 text-center font-bold bg-green-50">BAYI LAHIR</th>
                                <th colSpan={2} className="p-2 border-r border-slate-200 text-center font-bold bg-amber-50">AKTE KELAHIRAN</th>
                                <th colSpan={2} className="p-2 border-r border-slate-200 text-center font-bold bg-indigo-50">BAYI MENINGGAL</th>
                                <th colSpan={2} className="p-2 text-center font-bold bg-purple-50">BALITA MENINGGAL</th>
                            </tr>
                            <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                                <th className="p-2 border-r border-slate-200 text-center bg-blue-50/50">Dusun</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-blue-50/50">RW</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-blue-50/50">RT</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-blue-50/50">Dasa Wisma</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-rose-50/50">Hamil</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-rose-50/50">Melahirkan</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-rose-50/50">Nifas</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-rose-50/50">Meninggal</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-green-50/50">L</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-green-50/50">P</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-amber-50/50">Ada</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-amber-50/50">Tidak Ada</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-indigo-50/50">L</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-indigo-50/50">P</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-purple-50/50">L</th>
                                <th className="p-2 text-center bg-purple-50/50">P</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={18} className="text-center py-12 text-slate-400">
                                        Belum ada data bumil & bayi.
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
                                        <td className="p-2 border-r border-slate-100 text-center">{item.ibu_hamil || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.ibu_melahirkan || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.ibu_nifas || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.ibu_meninggal || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.bayi_lahir_l || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.bayi_lahir_p || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.akte_ada || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.akte_tidak_ada || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.bayi_meninggal_l || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.bayi_meninggal_p || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center">{item.balita_meninggal_l || 0}</td>
                                        <td className="p-2 text-center">{item.balita_meninggal_p || 0}</td>
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
                                    <td className="p-2 border-r border-slate-200 text-center">{totalIbuHamil.toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{totalIbuMelahirkan.toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{totalIbuNifas.toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("ibu_meninggal").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sumBayiL.toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sumBayiP.toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("akte_ada").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("akte_tidak_ada").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("bayi_meninggal_l").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("bayi_meninggal_p").toLocaleString("id-ID")}</td>
                                    <td className="p-2 border-r border-slate-200 text-center">{sum("balita_meninggal_l").toLocaleString("id-ID")}</td>
                                    <td className="p-2 text-center">{sum("balita_meninggal_p").toLocaleString("id-ID")}</td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>
        </div>
    );
}
