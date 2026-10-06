import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
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
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { search?: string; action?: string; date_from?: string; date_to?: string };
    actions: string[];
}

export default function ActivityIndex({ logs, filters, actions }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [action, setAction] = useState(filters.action || "");

    const apply = () => {
        router.get(
            route("be.activity-logs.index"),
            { search: search || undefined, action: action || undefined },
            { preserveState: true }
        );
    };

    return (
        <MainLayout>
            <Head title="Catatan Kegiatan" />
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl text-white shadow-lg shadow-violet-500/25">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                            Catatan Kegiatan (CCTV)
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Siapa melakukan apa — khusus Super Admin
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && apply()}
                            placeholder="Cari user / aksi / keterangan..."
                            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 outline-none"
                        />
                    </div>
                    <select
                        value={action}
                        onChange={(e) => setAction(e.target.value)}
                        className="text-sm rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 px-3 py-2.5 outline-none"
                    >
                        <option value="">Semua aksi</option>
                        {actions.map((a) => (
                            <option key={a} value={a}>
                                {a}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={apply}
                        className="px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl cursor-pointer"
                    >
                        Cari
                    </button>
                    <button
                        onClick={() => {
                            setSearch("");
                            setAction("");
                            router.get(route("be.activity-logs.index"));
                        }}
                        className="px-4 py-2.5 text-sm text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl cursor-pointer inline-flex items-center gap-1"
                    >
                        <RotateCcw size={14} /> Reset
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50/80 dark:bg-slate-800/50">
                                {["Waktu", "User", "Aksi", "Keterangan", "IP"].map(
                                    (h) => (
                                        <th
                                            key={h}
                                            className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                                        >
                                            {h}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {logs.data.map((l) => (
                                <tr key={l.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                    <td className="px-6 py-3 text-xs text-slate-500 whitespace-nowrap">
                                        {new Date(l.created_at).toLocaleString("id-ID")}
                                    </td>
                                    <td className="px-6 py-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                                        {l.user?.name || "-"}
                                        <span className="block text-xs text-slate-400 font-mono">
                                            {l.user?.username || "sistem"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className="inline-block px-2.5 py-1 text-xs font-mono font-semibold bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full">
                                            {l.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-sm text-slate-600 dark:text-slate-300 max-w-[320px] truncate">
                                        {l.description}
                                    </td>
                                    <td className="px-6 py-3 text-xs font-mono text-slate-400">
                                        {l.ip || "-"}
                                    </td>
                                </tr>
                            ))}
                            {logs.data.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-400">
                                        Belum ada catatan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {logs.last_page > 1 && (
                    <div className="px-6 py-4 flex gap-2 flex-wrap">
                        {logs.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url)}
                                className={`px-3 py-1.5 text-xs rounded-lg border cursor-pointer disabled:opacity-40 ${
                                    link.active
                                        ? "bg-violet-500 text-white border-violet-500"
                                        : "border-slate-200 dark:border-slate-700 text-slate-500"
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
