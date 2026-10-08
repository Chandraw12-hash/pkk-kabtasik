import React, { useState, useEffect, useRef } from "react";
import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import Pagination from "@/Components/Data/Pagination";
import Card from "@/Components/UI/Card";
import { Head } from "@inertiajs/react";
import Tabs, { Pokja4TabId } from "./Tabs";
import KunjunganPyd from "./KunjunganPyd";
import KegiatanPosyandu from "./KegiatanPosyandu";
import Rekapitulasi from "./Rekapitulasi";
import { Pokja4DataRow } from "./Pokja4TabUtils";
import DataDisclosure from "./DataDisclosure";
import {
    Search,
    RotateCcw,
    Download,
    FileText,
    Plus,
} from "lucide-react";
import axios from "axios";

interface PageProps {
    pokjas: {
        data: Pokja4Item[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters?: {
        search?: string;
        per_page?: number;
        tahun?: number;
        active_tab?: Pokja4TabId;
    };
    tahunList?: number[];
    kunjungan_pyd?: Pokja4DataRow[];
    kegiatan_posyandu?: Pokja4DataRow[];
    rekapitulasi?: Pokja4DataRow[];
}

interface Pokja4Item {
    id: number;
    kecamatan?: string | null;
    nama_kecamatan?: string | null;
    tahun?: number | null;
    kader_kesehatan?: number | null;
    kader_gizi?: number | null;
    kader_kesling?: number | null;
    kader_phbs?: number | null;
    kader_kb?: number | null;
    posyandu?: number | null;
    imunisasi?: number | null;
    pkg?: number | null;
    tbc?: number | null;
    jamban_keluarga?: number | null;
    spal?: number | null;
    tps?: number | null;
    mck?: number | null;
    air_pdam?: number | null;
    air_sumur?: number | null;
    air_lainnya?: number | null;
    jumlah_pus?: number | null;
    jumlah_wus?: number | null;
    akseptor_kb_l?: number | null;
    akseptor_kb_p?: number | null;
    tabungan_keluarga?: number | null;
    asuransi_kesehatan?: number | null;
    phbs?: number | null;
    program_kesehatan?: string | null;
    program_lingkungan?: string | null;
    program_perencanaan?: string | null;
}

const kaderFields: Array<{ key: keyof Pokja4Item; label: string }> = [
    { key: "kader_kesehatan", label: "KES." },
    { key: "kader_gizi", label: "GIZI" },
    { key: "kader_kesling", label: "KESLING" },
    { key: "kader_phbs", label: "PHBS" },
    { key: "kader_kb", label: "KB" },
];

const valueFields: Array<{ key: keyof Pokja4Item; label: string }> = [
    ...kaderFields,
    { key: "posyandu", label: "POSYANDU" },
    { key: "imunisasi", label: "IMUNISASI" },
    { key: "pkg", label: "PKG" },
    { key: "tbc", label: "TBC" },
    { key: "jamban_keluarga", label: "JAMBAN" },
    { key: "spal", label: "SPAL" },
    { key: "tps", label: "TPS" },
    { key: "mck", label: "MCK" },
    { key: "air_pdam", label: "PDAM" },
    { key: "air_sumur", label: "SUMUR" },
    { key: "air_lainnya", label: "LAIN" },
    { key: "jumlah_pus", label: "PUS" },
    { key: "jumlah_wus", label: "WUS" },
    { key: "akseptor_kb_l", label: "L" },
    { key: "akseptor_kb_p", label: "P" },
    { key: "tabungan_keluarga", label: "TABUNGAN" },
    { key: "asuransi_kesehatan", label: "ASURANSI" },
];

const programFields: Array<{ key: keyof Pokja4Item; label: string }> = [
    { key: "program_kesehatan", label: "KESEHATAN" },
    { key: "program_lingkungan", label: "LINGKUNGAN" },
    { key: "program_perencanaan", label: "PERENCANAAN" },
];

const numberValue = (item: Pokja4Item, key: keyof Pokja4Item) =>
    Number(item[key]) || 0;
const formattedNumber = (value: number) => value.toLocaleString("id-ID");

export default function Index({
    pokjas,
    filters = {},
    tahunList = [],
    kunjungan_pyd = [],
    kegiatan_posyandu = [],
    rekapitulasi = [],
}: PageProps) {
    const [search, setSearch] = useState(filters.search || "");
    const [perPage, setPerPage] = useState(filters.per_page || 10);
    const currentYear = new Date().getFullYear();
    const [tahun, setTahun] = useState(filters.tahun || currentYear);
    const [activeTab, setActiveTab] = useState<Pokja4TabId>(
        filters.active_tab || "pokja4"
    );
    const [kunjunganData, setKunjunganData] = useState(kunjungan_pyd);
    const [posyanduData, setPosyanduData] = useState(kegiatan_posyandu);
    const [rekapitulasiData, setRekapitulasiData] = useState(rekapitulasi);
    const [availableYears, setAvailableYears] = useState(tahunList);

    const [localData, setLocalData] = useState({
        ...pokjas,
        data: pokjas?.data || [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const isFirstRender = useRef(true);

    // ========================================================
    // FETCH DATA
    // ========================================================
    const fetchData = (url: string, params: Record<string, unknown> = {}) => {
        setIsLoading(true);
        axios
            .get(url, {
                params,
                headers: { Accept: "application/json" },
            })
            .then((res) => {
                if (res.data?.pokjas) {
                    setLocalData(res.data.pokjas);
                    setKunjunganData(res.data.kunjungan_pyd || []);
                    setPosyanduData(res.data.kegiatan_posyandu || []);
                    setRekapitulasiData(res.data.rekapitulasi || []);
                    setAvailableYears(res.data.tahunList || []);
                }
            })
            .catch((err) => console.error(err))
            .finally(() => setIsLoading(false));
    };

    // ========================================================
    // EFFECT — SEARCH & FILTER
    // ========================================================
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const timeout = setTimeout(() => {
            fetchData(route("be.pokja4.index"), {
                search,
                per_page: perPage,
                tahun,
            });
        }, 300);
        return () => clearTimeout(timeout);
    }, [search, perPage, tahun]);

    // ========================================================
    // SYNC PROP
    // ========================================================
    useEffect(() => {
        if (pokjas) {
            setLocalData({
                ...pokjas,
                data: pokjas?.data || [],
            });
        }
        setKunjunganData(kunjungan_pyd);
        setPosyanduData(kegiatan_posyandu);
        setRekapitulasiData(rekapitulasi);
        setAvailableYears(tahunList);
    }, [pokjas, kunjungan_pyd, kegiatan_posyandu, rekapitulasi, tahunList]);

    // ========================================================
    // RESET FILTER
    // ========================================================
    const handleReset = () => {
        setSearch("");
        setPerPage(10);
        setTahun(currentYear);
    };

    const hasActiveFilter =
        Boolean(search) || perPage !== 10 || tahun !== currentYear;
    const exportUrls: Record<Pokja4TabId, string> = {
        pokja4: `/pokja-4/export?tahun=${tahun}`,
        kunjungan: `/pokja-4/export-pyd?tahun=${tahun}`,
        posyandu: `/pokja-4/export-posyandu?tahun=${tahun}`,
        rekapitulasi: `/pokja-4/export-rekap?tahun=${tahun}`,
    };
    // ========================================================
    // RENDER
    // ========================================================
    return (
        <MainLayout>
            <Head title="Data Pokja IV" />

            {/* ─── HEADER ─── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Data Pokja IV
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        Data rekapitulasi Pokja IV —{" "}
                        <span className="font-semibold text-teal-600">
                            diinput oleh Pokja Mobile
                        </span>
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        href={exportUrls[activeTab]}
                        target="_blank"
                        className="flex items-center gap-2"
                    >
                        <Download size={16} />
                        <span>Export Excel</span>
                    </Button>
                    <Button
                        variant="primary"
                        href={route("be.pokja4.create")}
                        className="shadow-lg shadow-indigo-100 dark:shadow-none flex items-center gap-2"
                    >
                        <Plus size={16} />
                        <span>Tambah Data</span>
                    </Button>
                </div>
            </div>

            {/* ─── INFO BANNER ─── */}
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 rounded-xl flex items-start gap-3">
                <FileText
                    size={18}
                    className="text-blue-600 dark:text-blue-400 mt-0.5 shrink-0"
                />
                <div className="text-sm">
                    <p className="font-semibold text-blue-800 dark:text-blue-300">
                        Data read-only
                    </p>
                    <p className="text-blue-700 dark:text-blue-400 mt-0.5">
                        Data ini diinput oleh Pokja melalui aplikasi mobile
                        dan otomatis disinkronkan setelah approve.
                    </p>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
                <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* ─── CARD ─── */}
            {activeTab === "pokja4" && (
            <Card
                id="pokja4-panel-pokja4"
                role="tabpanel"
                aria-labelledby="pokja4-tab-pokja4"
                className="rounded-t-none border-0 shadow-none dark:bg-slate-800 dark:border-0"
            >
                {/* Filter Bar */}
                <div className="p-6 border-b border-slate-50 dark:border-slate-700 flex flex-col md:flex-row md:items-center gap-3">
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                        <TextInput
                            iconLeft={<Search size={18} />}
                            placeholder="Cari kecamatan..."
                            className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            containerClassName="relative w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <select
                        value={tahun}
                        onChange={(e) => setTahun(parseInt(e.target.value, 10))}
                        className="text-sm rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all"
                        aria-label="Pilih tahun data"
                    >
                        {availableYears.length > 0 ? (
                            availableYears.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))
                        ) : (
                            <option value={tahun}>{tahun}</option>
                        )}
                    </select>

                    {hasActiveFilter && (
                        <Button
                            variant="danger"
                            onClick={handleReset}
                            className="flex items-center gap-2"
                        >
                            <RotateCcw size={16} />
                            <span>Reset</span>
                        </Button>
                    )}
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {isLoading ? (
                        <p className="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                            Memuat data Pokja IV...
                        </p>
                    ) : localData.data.length > 0 ? (
                        localData.data.map((item, index) => {
                            const detailGroups = [
                                {
                                    title: "Kesehatan",
                                    keys: valueFields.slice(0, 9),
                                },
                                {
                                    title: "Kelestarian lingkungan",
                                    keys: valueFields.slice(9, 16),
                                },
                                {
                                    title: "Perencanaan sehat",
                                    keys: valueFields.slice(16),
                                },
                            ];

                            return (
                                <DataDisclosure
                                    key={item.id}
                                    number={
                                        (localData.current_page - 1) *
                                            localData.per_page +
                                        index +
                                        1
                                    }
                                    title={
                                        item.nama_kecamatan ||
                                        item.kecamatan ||
                                        "Kecamatan belum ditentukan"
                                    }
                                    description={`Data Pokja IV · ${item.tahun || tahun}`}
                                    metrics={[
                                        {
                                            label: "Jumlah kader",
                                            value: formattedNumber(
                                                kaderFields.reduce(
                                                    (sum, field) =>
                                                        sum +
                                                        numberValue(
                                                            item,
                                                            field.key
                                                        ),
                                                    0
                                                )
                                            ),
                                        },
                                        {
                                            label: "Posyandu",
                                            value: formattedNumber(
                                                numberValue(item, "posyandu")
                                            ),
                                        },
                                        {
                                            label: "PUS",
                                            value: formattedNumber(
                                                numberValue(item, "jumlah_pus")
                                            ),
                                        },
                                        {
                                            label: "WUS",
                                            value: formattedNumber(
                                                numberValue(item, "jumlah_wus")
                                            ),
                                        },
                                    ]}
                                    groups={[
                                        ...detailGroups.map((group) => ({
                                            title: group.title,
                                            fields: group.keys.map((field) => ({
                                                label: field.label,
                                                value: formattedNumber(
                                                    numberValue(item, field.key)
                                                ),
                                            })),
                                        })),
                                        {
                                            title: "Program unggulan",
                                            fields: programFields.map(
                                                (field) => ({
                                                    label: field.label,
                                                    value: item[field.key] || "—",
                                                })
                                            ),
                                        },
                                    ]}
                                />
                            );
                        })
                    ) : (
                        <p className="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                            Belum ada data Pokja IV untuk tahun {tahun}.
                        </p>
                    )}
                </div>

                {/* Pagination */}
                <div className="p-6 border-t border-slate-50 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-500">
                        Menampilkan{" "}
                        <span className="font-bold text-slate-800">
                            {localData.from ?? 0}
                        </span>{" "}
                        sampai{" "}
                        <span className="font-bold text-slate-800">
                            {localData.to ?? 0}
                        </span>{" "}
                        dari{" "}
                        <span className="font-bold text-slate-800">
                            {localData.total ?? 0}
                        </span>{" "}
                        data
                    </p>

                    <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span>Tampilkan</span>
                        <select
                            value={perPage}
                            onChange={(e) =>
                                setPerPage(parseInt(e.target.value))
                            }
                            className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl py-1.5 px-3 outline-none cursor-pointer dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                    </div>

                    <Pagination
                        links={localData.links}
                        onPageChange={(url: string) => fetchData(url)}
                    />
                </div>
            </Card>
            )}

            {activeTab === "kunjungan" && (
                <section
                    id="pokja4-panel-kunjungan"
                    role="tabpanel"
                    aria-labelledby="pokja4-tab-kunjungan"
                    className="bg-white dark:bg-slate-800"
                >
                    <KunjunganPyd
                        data={kunjunganData}
                        year={tahun}
                        years={availableYears}
                        onYearChange={setTahun}
                    />
                </section>
            )}

            {activeTab === "posyandu" && (
                <section
                    id="pokja4-panel-posyandu"
                    role="tabpanel"
                    aria-labelledby="pokja4-tab-posyandu"
                    className="bg-white dark:bg-slate-800"
                >
                    <KegiatanPosyandu
                        data={posyanduData}
                        year={tahun}
                        years={availableYears}
                        onYearChange={setTahun}
                    />
                </section>
            )}

            {activeTab === "rekapitulasi" && (
                <section
                    id="pokja4-panel-rekapitulasi"
                    role="tabpanel"
                    aria-labelledby="pokja4-tab-rekapitulasi"
                    className="bg-white dark:bg-slate-800"
                >
                    <Rekapitulasi
                        data={rekapitulasiData}
                        year={tahun}
                        years={availableYears}
                        onYearChange={setTahun}
                    />
                </section>
            )}
            </div>
        </MainLayout>
    );
}
