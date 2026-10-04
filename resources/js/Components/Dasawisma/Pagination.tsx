import { router } from "@inertiajs/react";
import type { PaginationLink } from "./types";

interface PaginationProps {
    links: PaginationLink[];
    currentPage: number;
    lastPage: number;
}

export default function Pagination({ links, currentPage, lastPage }: PaginationProps) {
    if (lastPage <= 1) return null;

    return (
        <nav className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between" aria-label="Navigasi halaman">
            <p className="text-sm text-slate-500 dark:text-slate-400">Halaman {currentPage} dari {lastPage}</p>
            <div className="flex flex-wrap gap-1.5">
                {links.map((link, index) => (
                    <button
                        key={`${link.label}-${index}`}
                        type="button"
                        disabled={!link.url}
                        onClick={() => link.url && router.visit(link.url, { preserveScroll: true, preserveState: true })}
                        className={`min-h-10 min-w-10 rounded-xl border px-3 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600 disabled:cursor-not-allowed disabled:opacity-40 ${link.active ? "border-teal-600 bg-teal-600 text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"}`}
                        aria-label={`Halaman ${link.label.replace(/&laquo;|&raquo;/g, "").trim()}`}
                        aria-current={link.active ? "page" : undefined}
                    >
                        {link.label.replace(/&laquo;/g, "«").replace(/&raquo;/g, "»")}
                    </button>
                ))}
            </div>
        </nav>
    );
}
