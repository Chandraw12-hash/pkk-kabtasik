import { ClipboardList } from "lucide-react";

interface EmptyStateProps {
    title?: string;
    description?: string;
    canAdd?: boolean;
    onAdd?: () => void;
}

export default function EmptyState({
    title = "Belum ada data",
    description = "Data yang sesuai belum tersedia. Mulai dengan menambahkan data baru.",
    canAdd = false,
    onAdd,
}: EmptyStateProps) {
    return (
        <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
            <span className="rounded-2xl bg-teal-50 p-4 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300"><ClipboardList size={26} aria-hidden="true" /></span>
            <h2 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
            {canAdd && onAdd && <button type="button" onClick={onAdd} className="mt-5 min-h-11 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">Tambah data</button>}
        </div>
    );
}
