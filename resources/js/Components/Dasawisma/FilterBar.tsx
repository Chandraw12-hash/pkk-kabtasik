import { Download, Plus, Search, Upload } from "lucide-react";

interface FilterBarProps {
    search: string;
    status: string;
    canManage: boolean;
    onSearchChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onSubmit: () => void;
    onCreate: () => void;
    onImport: () => void;
    exportUrl: string;
    templateUrl: string;
}

const controlClass =
    "min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100";

export default function FilterBar({
    search,
    status,
    canManage,
    onSearchChange,
    onStatusChange,
    onSubmit,
    onCreate,
    onImport,
    exportUrl,
    templateUrl,
}: FilterBarProps) {
    return (
        <form
            className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:flex-row lg:items-center"
            onSubmit={(event) => {
                event.preventDefault();
                onSubmit();
            }}
            role="search"
            aria-label="Filter data Dasawisma"
        >
            <label className="relative min-w-0 flex-1">
                <span className="sr-only">Cari data</span>
                <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    className={`${controlClass} w-full pl-9`}
                    placeholder="Cari data..."
                    type="search"
                    aria-label="Cari data"
                />
            </label>
            <label>
                <span className="sr-only">Filter status</span>
                <select
                    value={status}
                    onChange={(event) => onStatusChange(event.target.value)}
                    className={`${controlClass} w-full lg:w-48`}
                    aria-label="Filter berdasarkan status"
                >
                    <option value="">Semua status</option>
                    <option value="pending">Menunggu</option>
                    <option value="approved">Disetujui</option>
                    <option value="rejected">Perlu diperbaiki</option>
                </select>
            </label>
            <button type="submit" className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                Terapkan
            </button>
            <div className="flex flex-wrap gap-2">
                <a href={templateUrl} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700" aria-label="Unduh template Excel">
                    <Download size={16} aria-hidden="true" /> Template
                </a>
                <a href={exportUrl} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700" aria-label="Ekspor Excel">
                    <Download size={16} aria-hidden="true" /> Ekspor
                </a>
                {canManage && (
                    <>
                        <button type="button" onClick={onImport} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                            <Upload size={16} aria-hidden="true" /> Import Excel
                        </button>
                        <button type="button" onClick={onCreate} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">
                            <Plus size={17} aria-hidden="true" /> Tambah
                        </button>
                    </>
                )}
            </div>
        </form>
    );
}
