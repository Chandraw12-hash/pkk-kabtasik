import React, { useState, useMemo } from "react";
import { Link, router } from "@inertiajs/react";
import {
    Search,
    Filter,
    Baby,
    BarChart3,
} from "lucide-react";
import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

// ============================================================
// INTERFACE
// ============================================================

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
    data: RekapBumilItem[] | { data: RekapBumilItem[] };
    tahun?: string;
    onTahunChange?: (tahun: string) => void;
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function TabRekapBumil({
    data = [],
    tahun = new Date().getFullYear().toString(),
    onTahunChange,
}: Props) {
    const [search, setSearch] = useState("");
    const [selectedKecamatan, setSelectedKecamatan] = useState("");

    const items = Array.isArray(data) ? data : (data?.data || []);

    // ========================================================
    // NORMALISASI WILAYAH — "DURIAN RUNTUH" == "Durian Runtuh",
    // "01" == "1", agar tidak dihitung ganda.
    // ========================================================
    const normWil = (v: unknown): string => {
        const t = String(v ?? "").trim().toLowerCase();
        if (/^\d+$/.test(t)) return String(parseInt(t, 10));
        return t;
    };

    // ========================================================
    // MERGE ITEMS — group by kecamatan + bulan.
    // Aturan: kolom wilayah = DISTINCT (tidak peduli kapital/nol depan),
    // kolom angka lain = SUM. Sama dengan agregat backend kegiatan.
    // ========================================================
    const numericFields: (keyof RekapBumilItem)[] = [
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

    const mergedItems = useMemo(() => {
        const groups = new Map<
            string,
            {
                base: RekapBumilItem;
                dusun: Set<string>;
                rw: Set<string>;
                rt: Set<string>;
                dw: Set<string>;
            }
        >();
        for (const item of items) {
            const name = (
                item.nama_kecamatan ||
                item.kecamatan ||
                "Tidak diketahui"
            ).trim();
            const key = `${name.toLocaleLowerCase()}-${item.bulan ?? 0}`;
            let g = groups.get(key);
            if (!g) {
                g = {
                    base: { ...item, nama_kecamatan: name },
                    dusun: new Set(),
                    rw: new Set(),
                    rt: new Set(),
                    dw: new Set(),
                };
                groups.set(key, g);
            } else {
                numericFields.forEach((field) => {
                    (g!.base[field] as number) =
                        (Number(g!.base[field]) || 0) +
                        (Number(item[field]) || 0);
                });
            }
            const desa = normWil(item.nama_desa || item.desa);
            const dusun = normWil(item.nama_dusun || item.dusun);
            const rw = normWil(item.rw);
            const rt = normWil(item.rt);
            const dw = normWil(item.nama_dasawisma);
            if (desa || dusun) g.dusun.add(`${desa}|${dusun}`);
            if (desa || dusun || rw) g.rw.add(`${desa}|${dusun}|${rw}`);
            if (desa || dusun || rw || rt)
                g.rt.add(`${desa}|${dusun}|${rw}|${rt}`);
            if (dw) g.dw.add(`${desa}|${dusun}|${dw}`);
        }
        return Array.from(groups.values()).map((g) => ({
            ...g.base,
            jumlah_dusun: g.dusun.size,
            jumlah_rw: g.rw.size,
            jumlah_rt: g.rt.size,
            jumlah_dasa_wisma: g.dw.size,
        }));
    }, [items]);

    const uniqueKecamatan = useMemo(
        () =>
            Array.from(
                new Set(
                    mergedItems
                        .map((item) => item.nama_kecamatan || item.kecamatan)
                        .filter(Boolean)
                )
            ),
        [mergedItems]
    );

    const filteredData = useMemo(
        () =>
            mergedItems.filter((item) => {
                const nama = (
                    item.nama_kecamatan ||
                    item.kecamatan ||
                    ""
                ).toLowerCase();
                const matchesSearch = nama.includes(search.toLowerCase());
                const matchesKecamatan = selectedKecamatan
                    ? (item.nama_kecamatan || item.kecamatan) === selectedKecamatan
                    : true;
                return matchesSearch && matchesKecamatan;
            }),
        [mergedItems, search, selectedKecamatan]
    );

    // ========================================================
    // KALKULASI
    // ========================================================
    const sum = (key: keyof RekapBumilItem) =>
        filteredData.reduce((a, c) => a + (Number(c[key]) || 0), 0);

    // Baris JUMLAH: wilayah = DISTINCT lintas bulan (dusun yang sama di
    // 2 bulan dihitung 1) dihitung dari baris mentah, bukan hasil merge.
    const filteredItems = useMemo(
        () =>
            items.filter((item) => {
                const nama = (
                    item.nama_kecamatan ||
                    item.kecamatan ||
                    ""
                ).toLowerCase();
                const matchesSearch = nama.includes(search.toLowerCase());
                const matchesKecamatan = selectedKecamatan
                    ? (item.nama_kecamatan || item.kecamatan) ===
                      selectedKecamatan
                    : true;
                return matchesSearch && matchesKecamatan;
            }),
        [items, search, selectedKecamatan]
    );

    const distinctWil = (tingkat: number): number => {
        const keys = new Set<string>();
        for (const c of filteredItems) {
            const parts = [
                normWil(c.nama_desa || (c as any).desa),
                normWil(c.nama_dusun || (c as any).dusun),
                normWil((c as any).rw),
                normWil((c as any).rt),
                normWil((c as any).nama_dasawisma),
            ].slice(0, tingkat + 1);
            if (parts.some((p) => p !== '')) {
                keys.add(parts.join('|'));
            }
        }
        return keys.size;
    };

    const totalIbuHamil = sum("ibu_hamil");
    const totalIbuMelahirkan = sum("ibu_melahirkan");
    const totalIbuNifas = sum("ibu_nifas");
    const totalIbuMeninggal = sum("ibu_meninggal");
    const sumBayiL = sum("bayi_lahir_l");
    const sumBayiP = sum("bayi_lahir_p");
    const totalBayiLahir = sumBayiL + sumBayiP;
    const totalAkteAda = sum("akte_ada");
    const totalAkteTidakAda = sum("akte_tidak_ada");

    // PIE CHART DATA — KOMPOSISI BAYI
    const genderPieData = [
        { name: "Laki-laki", value: sumBayiL, color: "#38bdf8" },
        { name: "Perempuan", value: sumBayiP, color: "#fb7185" },
    ].filter((item) => item.value > 0);

    // PIE CHART DATA — AKTE
    const aktePieData = [
        { name: "Ada Akte", value: totalAkteAda, color: "#10b981" },
        { name: "Tidak Ada", value: totalAkteTidakAda, color: "#f43f5e" },
    ].filter((item) => item.value > 0);

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
            {/* BREADCRUMB */}
            <nav className="flex items-center gap-2 text-sm text-slate-500">
                <Link href="/" className="hover:text-[#0072BC] transition-colors">
                    Beranda
                </Link>
                <span className="text-slate-300">/</span>
                <Link href="/sekretariat" className="hover:text-[#0072BC] transition-colors">
                    Sekretariat
                </Link>
                <span className="text-slate-300">/</span>
                <span className="text-slate-900 font-medium">Rekap Bumil</span>
            </nav>

            {/* JUDUL */}
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

            {/* FILTER */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row flex-wrap gap-3 items-start md:items-center justify-between">
                <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-slate-600">
                            Kecamatan
                        </label>
                        <select
                            value={selectedKecamatan}
                            onChange={(e) => setSelectedKecamatan(e.target.value)}
                            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0072BC]"
                        >
                            <option value="">Semua Kecamatan</option>
                            {uniqueKecamatan.map((kec, index) => (
                                <option key={index} value={kec}>
                                    {kec}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-slate-600">
                            Tahun
                        </label>
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

            {/* CHART — 2 PIE */}
            {filteredData.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* PIE 1 — Komposisi Bayi */}
                    <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                        <div className="mb-4 border-b border-slate-100 pb-4">
                            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <Baby size={16} className="text-[#0072BC]" />
                                Komposisi Bayi Lahir
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                                Perbandingan bayi laki-laki vs perempuan.
                            </p>
                        </div>
                        {totalBayiLahir > 0 ? (
                            <div className="grid min-h-64 grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(0,1.15fr)_minmax(9rem,1fr)]">
                                <div className="relative h-64 min-w-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={genderPieData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius="62%"
                                                outerRadius="86%"
                                                paddingAngle={2}
                                            >
                                                {genderPieData.map((item) => (
                                                    <Cell key={item.name} fill={item.color} />
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
                                            Total Bayi
                                        </span>
                                        <strong className="text-lg font-bold tabular-nums text-slate-900">
                                            {totalBayiLahir.toLocaleString("id-ID")}
                                        </strong>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between gap-3 text-sm">
                                        <span className="flex min-w-0 items-center gap-2 text-slate-600">
                                            <span
                                                className="h-3 w-3 shrink-0 rounded-sm"
                                                style={{ backgroundColor: "#38bdf8" }}
                                            />
                                            <span className="truncate">Laki-laki</span>
                                        </span>
                                        <strong className="shrink-0 tabular-nums text-slate-900">
                                            {sumBayiL.toLocaleString("id-ID")}
                                        </strong>
                                    </div>
                                    <div className="flex items-center justify-between gap-3 text-sm">
                                        <span className="flex min-w-0 items-center gap-2 text-slate-600">
                                            <span
                                                className="h-3 w-3 shrink-0 rounded-sm"
                                                style={{ backgroundColor: "#fb7185" }}
                                            />
                                            <span className="truncate">Perempuan</span>
                                        </span>
                                        <strong className="shrink-0 tabular-nums text-slate-900">
                                            {sumBayiP.toLocaleString("id-ID")}
                                        </strong>
                                    </div>
                                    <div className="border-t border-slate-100 pt-3 text-xs text-slate-500">
                                        Persentase Perempuan{" "}
                                        <strong className="ml-1 text-[#0072BC]">
                                            {totalBayiLahir > 0
                                                ? ((sumBayiP / totalBayiLahir) * 100).toFixed(1)
                                                : 0}
                                            %
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex min-h-72 items-center justify-center text-sm text-slate-400">
                                Belum ada data bayi untuk ditampilkan
                            </div>
                        )}
                    </section>

                    {/* PIE 2 — Akte Kelahiran */}
                    <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                        <div className="mb-4 border-b border-slate-100 pb-4">
                            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <BarChart3 size={16} className="text-[#0072BC]" />
                                Kelengkapan Akte Kelahiran
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                                Perbandingan bayi dengan akte vs tanpa akte.
                            </p>
                        </div>
                        {totalAkteAda + totalAkteTidakAda > 0 ? (
                            <div className="grid min-h-64 grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(0,1.15fr)_minmax(9rem,1fr)]">
                                <div className="relative h-64 min-w-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={aktePieData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius="62%"
                                                outerRadius="86%"
                                                paddingAngle={2}
                                            >
                                                {aktePieData.map((item) => (
                                                    <Cell key={item.name} fill={item.color} />
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
                                            Total Akte
                                        </span>
                                        <strong className="text-lg font-bold tabular-nums text-slate-900">
                                            {(totalAkteAda + totalAkteTidakAda).toLocaleString("id-ID")}
                                        </strong>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between gap-3 text-sm">
                                        <span className="flex min-w-0 items-center gap-2 text-slate-600">
                                            <span
                                                className="h-3 w-3 shrink-0 rounded-sm"
                                                style={{ backgroundColor: "#10b981" }}
                                            />
                                            <span className="truncate">Ada Akte</span>
                                        </span>
                                        <strong className="shrink-0 tabular-nums text-slate-900">
                                            {totalAkteAda.toLocaleString("id-ID")}
                                        </strong>
                                    </div>
                                    <div className="flex items-center justify-between gap-3 text-sm">
                                        <span className="flex min-w-0 items-center gap-2 text-slate-600">
                                            <span
                                                className="h-3 w-3 shrink-0 rounded-sm"
                                                style={{ backgroundColor: "#f43f5e" }}
                                            />
                                            <span className="truncate">Tidak Ada</span>
                                        </span>
                                        <strong className="shrink-0 tabular-nums text-slate-900">
                                            {totalAkteTidakAda.toLocaleString("id-ID")}
                                        </strong>
                                    </div>
                                    <div className="border-t border-slate-100 pt-3 text-xs text-slate-500">
                                        Persentase Ada Akte{" "}
                                        <strong className="ml-1 text-[#0072BC]">
                                            {totalAkteAda + totalAkteTidakAda > 0
                                                ? (
                                                      (totalAkteAda /
                                                          (totalAkteAda + totalAkteTidakAda)) *
                                                      100
                                                  ).toFixed(1)
                                                : 0}
                                            %
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex min-h-72 items-center justify-center text-sm text-slate-400">
                                Belum ada data akte untuk ditampilkan
                            </div>
                        )}
                    </section>
                </div>
            )}

            {/* TABEL */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Baby size={15} />
                        <span>Rekap Bumil & Bayi — {tahun}</span>
                    </div>
                    <div className="relative w-full sm:w-64">
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
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs min-w-[1500px]">
                        <thead>
                            <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                                <th
                                    rowSpan={2}
                                    className="p-2 border-r border-slate-200 text-center font-bold sticky left-0 bg-slate-100 z-10 min-w-[50px]"
                                >
                                    NO
                                </th>
                                <th
                                    rowSpan={2}
                                    className="p-2 border-r border-slate-200 text-center font-bold sticky left-[50px] bg-slate-100 z-10 min-w-[150px]"
                                >
                                    KECAMATAN
                                </th>
                                <th
                                    colSpan={4}
                                    className="p-2 border-r border-slate-200 text-center font-bold bg-slate-300"
                                >
                                    JUMLAH WILAYAH
                                </th>
                                <th
                                    colSpan={4}
                                    className="p-2 border-r border-slate-200 text-center font-bold bg-slate-300"
                                >
                                    JUMLAH IBU
                                </th>
                                <th
                                    colSpan={2}
                                    className="p-2 border-r border-slate-200 text-center font-bold bg-slate-300"
                                >
                                    BAYI LAHIR
                                </th>
                                <th
                                    colSpan={2}
                                    className="p-2 border-r border-slate-200 text-center font-bold bg-slate-300"
                                >
                                    AKTE KELAHIRAN
                                </th>
                                <th
                                    colSpan={2}
                                    className="p-2 border-r border-slate-200 text-center font-bold bg-slate-300"
                                >
                                    BAYI MENINGGAL
                                </th>
                                <th
                                    colSpan={2}
                                    className="p-2 border-r border-slate-200 text-center font-bold bg-slate-300"
                                >
                                    BALITA MENINGGAL
                                </th>
                                <th
                                    rowSpan={2}
                                    className="p-2 border-r border-slate-200 text-center font-bold bg-slate-200 min-w-[120px]"
                                >
                                    KETERANGAN
                                </th>
                            </tr>

                            <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                                <th className="p-2 border-r border-slate-200 text-center bg-slate-200 min-w-[60px]">Dusun</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-slate-200 min-w-[60px]">RW</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-slate-200 min-w-[60px]">RT</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-slate-200 min-w-[70px]">Dasa Wisma</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-slate-200 min-w-[60px]">Hamil</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-slate-200 min-w-[70px]">Melahirkan</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-slate-200 min-w-[60px]">Nifas</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-slate-200 min-w-[70px]">Meninggal</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-slate-200 min-w-[50px]">L</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-slate-200 min-w-[50px]">P</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-slate-200 min-w-[60px]">Ada</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-slate-200 min-w-[70px]">Tidak Ada</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-slate-200 min-w-[50px]">L</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-slate-200 min-w-[50px]">P</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-slate-200 min-w-[50px]">L</th>
                                <th className="p-2 border-r border-slate-200 text-center bg-slate-200 min-w-[50px]">P</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={19}
                                        className="text-center py-12 text-slate-400"
                                    >
                                        Belum ada data bumil & bayi.
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((item, idx) => (
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
                                        <td className="p-2 border-r border-slate-100 text-center">{item.balita_meninggal_p || 0}</td>
                                        <td className="p-2 border-r border-slate-100 text-center text-slate-500">
                                            {item.keterangan || "-"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>

                        {filteredData.length > 0 && (
                            <tfoot>
                                <tr className="bg-slate-100 font-bold text-slate-800 border-t-2 border-slate-300">
                                    <td
                                        colSpan={2}
                                        className="p-2 border-r border-slate-200 text-center sticky left-0 bg-slate-100 z-10"
                                    >
                                        JUMLAH
                                    </td>
                                    <td className="p-2 border-r border-slate-200 text-center">
                                        {distinctWil(2).toLocaleString("id-ID")}
                                    </td>
                                    <td className="p-2 border-r border-slate-200 text-center">
                                        {distinctWil(3).toLocaleString("id-ID")}
                                    </td>
                                    <td className="p-2 border-r border-slate-200 text-center">
                                        {distinctWil(4).toLocaleString("id-ID")}
                                    </td>
                                    <td className="p-2 border-r border-slate-200 text-center">
                                        {distinctWil(5).toLocaleString("id-ID")}
                                    </td>
                                    <td className="p-2 border-r border-slate-200 text-center">
                                        {totalIbuHamil.toLocaleString("id-ID")}
                                    </td>
                                    <td className="p-2 border-r border-slate-200 text-center">
                                        {totalIbuMelahirkan.toLocaleString("id-ID")}
                                    </td>
                                    <td className="p-2 border-r border-slate-200 text-center">
                                        {totalIbuNifas.toLocaleString("id-ID")}
                                    </td>
                                    <td className="p-2 border-r border-slate-200 text-center">
                                        {totalIbuMeninggal.toLocaleString("id-ID")}
                                    </td>
                                    <td className="p-2 border-r border-slate-200 text-center">
                                        {sumBayiL.toLocaleString("id-ID")}
                                    </td>
                                    <td className="p-2 border-r border-slate-200 text-center">
                                        {sumBayiP.toLocaleString("id-ID")}
                                    </td>
                                    <td className="p-2 border-r border-slate-200 text-center">
                                        {totalAkteAda.toLocaleString("id-ID")}
                                    </td>
                                    <td className="p-2 border-r border-slate-200 text-center">
                                        {totalAkteTidakAda.toLocaleString("id-ID")}
                                    </td>
                                    <td className="p-2 border-r border-slate-200 text-center">
                                        {sum("bayi_meninggal_l").toLocaleString("id-ID")}
                                    </td>
                                    <td className="p-2 border-r border-slate-200 text-center">
                                        {sum("bayi_meninggal_p").toLocaleString("id-ID")}
                                    </td>
                                    <td className="p-2 border-r border-slate-200 text-center">
                                        {sum("balita_meninggal_l").toLocaleString("id-ID")}
                                    </td>
                                    <td className="p-2 border-r border-slate-200 text-center">
                                        {sum("balita_meninggal_p").toLocaleString("id-ID")}
                                    </td>
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
