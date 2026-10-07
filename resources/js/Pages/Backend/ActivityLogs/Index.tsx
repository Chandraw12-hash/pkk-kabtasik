import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import Badge from "@/Components/UI/Badge";
import Card from "@/Components/UI/Card";
import Table from "@/Components/Data/Table";
import Pagination from "@/Components/Data/Pagination";
import { Head, router } from "@inertiajs/react";
import { ShieldCheck, Search, RotateCcw } from "lucide-react";

declare function route(name: string, params?: unknown): string;

interface LogItem {
    id: number;
    action: string;
    description: string;
    ip?: string | null;
    created_at: string;
    user?: { name?: string; username?: string } | null;
}

interface Props {
    logs: {
        data: LogItem[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from?: number;
        to?: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search?: string;
        action?: string;
        date_from?: string;
        date_to?: string;
        per_page?: number | string;
    };
    actions: string[];
}

export default function ActivityIndex({ logs, filters, actions }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [action, setAction] = useState(filters.action || "");
    const [dateFrom, setDateFrom] = useState(filters.date_from || "");
    const [dateTo, setDateTo] = useState(filters.date_to || "");
    const [perPage, setPerPage] = useState(Number(filters.per_page) || 15);

    const apply = () => {
        router.get(
            route("be.activity-logs.index"),
            {
                search: search || undefined,
                action: action || undefined,
                date_from: dateFrom || undefined,
                date_to: dateTo || undefined,
                per_page: perPage,
            },
            { preserveState: true }
        );
    };

    const handleReset = () => {
        setSearch("");
        setAction("");
        setDateFrom("");
        setDateTo("");
        setPerPage(15);
        router.get(route("be.activity-logs.index"));
    };

    const hasActiveFilter =
        search || action || dateFrom || dateTo || perPage !== 15;

    const handlePageChange = (url: string | null) => {
        if (!url) return;
        router.visit(url, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <MainLayout>
            <Head title="Log Aktivitas" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-xl">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                            Catatan Kegiatan (Log Aktivitas)
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Siapa melakukan apa — khusus Super Admin
                        </p>
                    </div>
                </div>
            </div>

            <Card className="dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-50 dark:border-slate-700">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative flex-1 min-w-[180px] max-w-md">
                            <TextInput
                                iconLeft={<Search size={18} />}
                                placeholder="Cari user / aksi / keterangan..."
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                containerClassName="relative w-full"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === "Enter" && apply()
                                }
                            />
                        </div>

                        <select
                            value={action}
                            onChange={(e) => setAction(e.target.value)}
                            className="text-sm rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all"
                        >
                            <option value="">Semua aksi</option>
                            {actions.map((a) => (
                                <option key={a} value={a}>
                                    {a}
                                </option>
                            ))}
                        </select>

                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            title="Dari tanggal"
                            className="text-sm rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all"
                        />

                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            title="Sampai tanggal"
                            className="text-sm rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all"
                        />

                        <Button
                            variant="primary"
                            onClick={apply}
                            className="shadow-lg shadow-teal-100 dark:shadow-none bg-teal-600 hover:bg-teal-700"
                        >
                            Cari
                        </Button>

                        {hasActiveFilter && (
                            <Button
                                variant="secondary"
                                onClick={handleReset}
                                className="flex items-center gap-2"
                            >
                                <RotateCcw size={16} />
                                <span>Reset</span>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="overflow-x-hidden">
                    <Table
                        columns={[
                            {
                                header: "Waktu",
                                className: "whitespace-nowrap",
                                render: (l: LogItem) => (
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                        {new Date(
                                            l.created_at
                                        ).toLocaleString("id-ID")}
                                    </span>
                                ),
                            },
                            {
                                header: "User",
                                className: "min-w-[160px]",
                                render: (l: LogItem) => (
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                            {l.user?.name || "-"}
                                        </p>
                                        <span className="block text-xs text-slate-400">
                                            {l.user?.username || "sistem"}
                                        </span>
                                    </div>
                                ),
                            },
                            {
                                header: "Aksi",
                                className: "text-center",
                                headerClassName: "text-center",
                                render: (l: LogItem) => (
                                    <div className="flex justify-center">
                                        <Badge type="info">{l.action}</Badge>
                                    </div>
                                ),
                            },
                            {
                                header: "Keterangan",
                                className: "max-w-[320px]",
                                render: (l: LogItem) => (
                                    <p className="text-sm text-slate-600 dark:text-slate-300 truncate">
                                        {l.description}
                                    </p>
                                ),
                            },
                            {
                                header: "IP",
                                className: "text-center",
                                headerClassName: "text-center",
                                render: (l: LogItem) => (
                                    <span className="text-xs text-slate-400">
                                        {l.ip || "-"}
                                    </span>
                                ),
                            },
                        ]}
                        data={logs.data || []}
                        emptyMessage="Belum ada catatan."
                    />
                </div>

                <div className="p-6 border-t border-slate-50 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/20 dark:bg-slate-700/20">
                    <p className="text-sm text-slate-500 dark:text-slate-200">
                        Menampilkan{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {logs.from ?? 0}
                        </span>{" "}
                        sampai{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {logs.to ?? 0}
                        </span>{" "}
                        dari{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {logs.total ?? 0}
                        </span>{" "}
                        data
                    </p>

                    <div className="flex items-center gap-3 text-sm text-slate-400">
                        <span>Tampilkan</span>
                        <select
                            value={perPage}
                            onChange={(e) => {
                                const v = parseInt(e.target.value, 10);
                                setPerPage(v);
                                router.get(
                                    route("be.activity-logs.index"),
                                    {
                                        search: search || undefined,
                                        action: action || undefined,
                                        date_from: dateFrom || undefined,
                                        date_to: dateTo || undefined,
                                        per_page: v,
                                    },
                                    { preserveState: true }
                                );
                            }}
                            className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 block py-1.5 px-3 transition-all outline-none cursor-pointer dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                        >
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>

                    <Pagination
                        links={logs.links || []}
                        onPageChange={handlePageChange}
                    />
                </div>
            </Card>
        </MainLayout>
    );
}
