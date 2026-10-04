import { Check, Eye, Pencil, ThumbsDown, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { DataColumn, DasawismaRecord } from "./types";

interface DataTableProps {
    rows: DasawismaRecord[];
    columns: DataColumn[];
    canManage: boolean;
    canApprove: boolean;
    loading: boolean;
    onView: (record: DasawismaRecord) => void;
    onEdit: (record: DasawismaRecord) => void;
    onDelete: (record: DasawismaRecord) => void;
    onApprove: (record: DasawismaRecord) => void;
    onReject: (record: DasawismaRecord) => void;
}

function valueFor(record: DasawismaRecord, path: string): unknown {
    return path.split(".").reduce<unknown>((value, segment) => {
        if (value && typeof value === "object" && segment in value) {
            return (value as Record<string, unknown>)[segment];
        }
        return null;
    }, record);
}

function displayValue(value: unknown): string {
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value === "boolean") return value ? "Ya" : "Tidak";
    return String(value);
}

export default function DataTable({
    rows,
    columns,
    canManage,
    canApprove,
    loading,
    onView,
    onEdit,
    onDelete,
    onApprove,
    onReject,
}: DataTableProps) {
    if (loading) {
        return (
            <div className="space-y-3 p-5" role="status" aria-label="Memuat data">
                {[0, 1, 2, 3].map((item) => (
                    <div key={item} className="h-12 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                ))}
                <span className="sr-only">Memuat data...</span>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
                    <tr>
                        {columns.map((column) => (
                            <th key={column.key} scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">{column.label}</th>
                        ))}
                        <th scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">Status</th>
                        <th scope="col" className="px-4 py-3 text-right font-semibold">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {rows.map((row) => (
                        <tr key={row.id} className="text-slate-700 hover:bg-slate-50/70 dark:text-slate-300 dark:hover:bg-slate-800/50">
                            {columns.map((column) => (
                                <td key={column.key} className="max-w-64 whitespace-nowrap px-4 py-3">
                                    <span className="block truncate" title={displayValue(valueFor(row, column.key))}>{displayValue(valueFor(row, column.key))}</span>
                                </td>
                            ))}
                            <td className="whitespace-nowrap px-4 py-3"><StatusBadge status={row.status} /></td>
                            <td className="whitespace-nowrap px-4 py-3">
                                <div className="flex justify-end gap-1">
                                    <button type="button" onClick={() => onView(row)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600 dark:hover:bg-slate-800 dark:hover:text-teal-300" aria-label={`Lihat data nomor ${row.id}`}><Eye size={16} /></button>
                                    {canManage && row.status !== "approved" && (
                                        <>
                                            <button type="button" onClick={() => onEdit(row)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600 dark:hover:bg-slate-800 dark:hover:text-teal-300" aria-label={`Ubah data nomor ${row.id}`}><Pencil size={16} /></button>
                                            <button type="button" onClick={() => onDelete(row)} className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-600 dark:hover:bg-rose-950/50 dark:hover:text-rose-300" aria-label={`Hapus data nomor ${row.id}`}><Trash2 size={16} /></button>
                                        </>
                                    )}
                                    {canApprove && row.status === "pending" && (
                                        <>
                                            <button type="button" onClick={() => onApprove(row)} className="rounded-lg p-2 text-emerald-700 hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600 dark:text-emerald-300 dark:hover:bg-emerald-950/50" aria-label={`Setujui data nomor ${row.id}`}><Check size={16} /></button>
                                            <button type="button" onClick={() => onReject(row)} className="rounded-lg p-2 text-rose-700 hover:bg-rose-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-600 dark:text-rose-300 dark:hover:bg-rose-950/50" aria-label={`Tolak data nomor ${row.id}`}><ThumbsDown size={16} /></button>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
