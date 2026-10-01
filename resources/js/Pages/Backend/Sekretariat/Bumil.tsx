import React, { useState, useEffect, useRef } from "react";
import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import Table from "@/Components/Data/Table";
import Pagination from "@/Components/Data/Pagination";
import Card from "@/Components/UI/Card";
import SekretariatTabs from "@/Components/UI/SekretariatTabs";
import { Head } from "@inertiajs/react";
import {
    Search,
    RotateCcw,
    Download,
    FileText,
    MapPin,
} from "lucide-react";
import axios from "axios";

// ============================================================
// INTERFACE
// ============================================================

interface PageProps {
    data: {
        data: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
        links: any[];
    };
    filters?: {
        search?: string;
        per_page?: number;
        tahun?: number;
    };
    tahunList?: number[];
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function Bumil({
    data,
    filters = {},
    tahunList = [],
}: PageProps) {
    const [search, setSearch] = useState(filters.search || "");
    const [perPage, setPerPage] = useState(filters.per_page || 10);
    const [tahun, setTahun] = useState<number>(
        filters.tahun || new Date().getFullYear()
    );

    const [localData, setLocalData] = useState({
        ...data,
        data: data?.data || [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const isFirstRender = useRef(true);

    // ========================================================
    // FETCH DATA
    // ========================================================
    const fetchData = (url: string, params: any = {}) => {
        setIsLoading(true);
        axios
            .get(url, {
                params,
                headers: { Accept: "application/json" },
            })
            .then((res) => {
                if (
                    res.data &&
                    typeof res.data === "object" &&
                    "data" in res.data
                ) {
                    setLocalData(res.data);
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
            fetchData(route("be.sekretariat.bumil"), {
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
        if (data) {
            setLocalData({
                ...data,
                data: data?.data || [],
            });
        }
    }, [data]);

    // ========================================================
    // RESET FILTER
    // ========================================================
    const handleReset = () => {
        setSearch("");
        setPerPage(10);
        setTahun(new Date().getFullYear());
    };

    const hasActiveFilter = Boolean(search) || perPage !== 10;

    // ========================================================
    // RENDER
    // ========================================================
    return (
        <MainLayout>
            <Head title="Rekap Bumil — Sekretariat" />

            {/* ─── HEADER ─── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Data PKK — Sekretariat
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        Rekap ibu hamil &amp; bayi per kecamatan —{" "}
                        <span className="font-semibold text-teal-600">
                            diinput oleh Admin Desa
                        </span>
                    </p>
                </div>
                <Button
                    variant="secondary"
                    href={`/dashboard/sekretariat/export?tahun=${tahun}`}
                    target="_blank"
                    className="flex items-center gap-2"
                >
                    <Download size={16} />
                    <span>Export Excel</span>
                </Button>
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
                        Data ini diinput oleh Admin Desa melalui panel desa.
                    </p>
                </div>
            </div>

            {/* ─── TABS + CARD ─── */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <SekretariatTabs activeTab="bumil" tahun={tahun} />

                <Card className="rounded-t-none border-0 dark:bg-slate-800 dark:border-0">
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
                            onChange={(e) => setTahun(parseInt(e.target.value))}
                            className="text-sm rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all"
                        >
                            {tahunList.length > 0 ? (
                                tahunList.map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))
                            ) : (
                                <option value={new Date().getFullYear()}>
                                    {new Date().getFullYear()}
                                </option>
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

                    {/* Table */}
                    <Table
                        isLoading={isLoading}
                        columns={[
                            {
                                header: "#",
                                className: "text-center w-14",
                                headerClassName: "text-center w-14",
                                render: (_: any, index: number) => {
                                    const currentPage = localData.current_page ?? 1;
                                    const perPageVal = localData.per_page ?? 10;
                                    return (currentPage - 1) * perPageVal + index + 1;
                                },
                            },
                            {
                                header: "Kecamatan",
                                render: (item: any) => (
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-pink-50 dark:bg-pink-900/50 flex items-center justify-center shrink-0">
                                            <MapPin
                                                size={14}
                                                className="text-pink-600 dark:text-pink-400"
                                            />
                                        </div>
                                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                            {item.kecamatan || "-"}
                                        </span>
                                    </div>
                                ),
                            },
                            {
                                header: "Ibu Hamil",
                                className: "text-center",
                                headerClassName: "text-center",
                                render: (item: any) => (
                                    <span className="text-sm font-semibold text-pink-600 dark:text-pink-400">
                                        {item.ibu_hamil ?? 0}
                                    </span>
                                ),
                            },
                            {
                                header: "Ibu Melahirkan",
                                className: "text-center",
                                headerClassName: "text-center",
                                render: (item: any) => item.ibu_melahirkan ?? 0,
                            },
                            {
                                header: "Ibu Nifas",
                                className: "text-center",
                                headerClassName: "text-center",
                                render: (item: any) => item.ibu_nifas ?? 0,
                            },
                            {
                                header: "Bayi Lahir L/P",
                                className: "text-center",
                                headerClassName: "text-center",
                                render: (item: any) =>
                                    `${item.bayi_lahir_l ?? 0} / ${item.bayi_lahir_p ?? 0}`,
                            },
                            {
                                header: "Akte Ada/Tidak",
                                className: "text-center",
                                headerClassName: "text-center",
                                render: (item: any) => (
                                    <span className="text-xs">
                                        <span className="text-teal-600 font-semibold">
                                            {item.akte_ada ?? 0}
                                        </span>
                                        {" / "}
                                        <span className="text-rose-600 font-semibold">
                                            {item.akte_tidak_ada ?? 0}
                                        </span>
                                    </span>
                                ),
                            },
                            {
                                header: "Bayi Meninggal L/P",
                                className: "text-center",
                                headerClassName: "text-center",
                                render: (item: any) => (
                                    <span className="text-xs">
                                        <span className="text-rose-600 font-semibold">
                                            {item.bayi_meninggal_l ?? 0}
                                        </span>
                                        {" / "}
                                        <span className="text-rose-600 font-semibold">
                                            {item.bayi_meninggal_p ?? 0}
                                        </span>
                                    </span>
                                ),
                            },
                        ]}
                        data={localData.data}
                        emptyMessage="Belum ada data bumil dari Admin Desa"
                    />

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
            </div>
        </MainLayout>
    );
}
