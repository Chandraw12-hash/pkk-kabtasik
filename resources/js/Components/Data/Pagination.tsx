// resources/js/Components/Pagination.tsx
import React from "react";
import { Link } from "@inertiajs/react";

interface LinkItem {
    url: string | null;
    label: string;
    active: boolean;
}

type PaginationVariant = "primary" | "success" | "danger" | "warning";

interface PaginationProps {
    links?: LinkItem[];
    onPageChange?: (url: string) => void;
    variant?: PaginationVariant;
}

export default function Pagination({ links = [], onPageChange, variant = "primary" }: PaginationProps) {
    // Jangan tampilkan jika cuma ada 1 halaman
    if (links.length <= 3) return null;

    const activeVariants: Record<PaginationVariant, string> = {
        primary: "bg-brand-blue-600 text-white border-brand-blue-600 shadow-md shadow-brand-blue-100 dark:bg-brand-blue-700 dark:border-brand-blue-600 dark:shadow-none",
        success: "bg-brand-green-500 text-white border-brand-green-500 shadow-md shadow-brand-green-100 dark:bg-brand-green-600 dark:border-brand-green-500 dark:shadow-none",
        danger: "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-100 dark:bg-rose-600 dark:border-rose-500 dark:shadow-none",
        warning: "bg-yellow-500 text-white border-yellow-500 shadow-md shadow-yellow-100 dark:bg-yellow-600 dark:border-yellow-500 dark:shadow-none",
    };

    const hoverVariants: Record<PaginationVariant, string> = {
        primary: "hover:border-brand-blue-500 hover:text-brand-blue-600",
        success: "hover:border-brand-green-500 hover:text-brand-green-600",
        danger: "hover:border-rose-500 hover:text-rose-600",
        warning: "hover:border-yellow-500 hover:text-yellow-600",
    };

    return (
        <div className="flex flex-wrap gap-1 dark:bg-slate-900/40 dark:border-slate-700 dark:shadow-slate-700/50">
            {links.map((link, key) =>
                link.url === null ? (
                    <div
                        key={key}
                        className="px-4 py-2 text-sm text-slate-400 border border-slate-100 rounded-xl bg-slate-50/50 cursor-not-allowed dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : onPageChange ? (
                    <button
                        key={key}
                        type="button"
                        className={`
                            px-4 py-2 text-sm border rounded-xl transition-all active:scale-95 cursor-pointer
                            ${
                                link.active
                                    ? `font-bold ${activeVariants[variant]}`
                                    : `bg-white text-slate-600 border-slate-200 ${hoverVariants[variant]} dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600`
                            }
                        `}
                        onClick={() => link.url && onPageChange(link.url)}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <Link
                        key={key}
                        className={`
                            px-4 py-2 text-sm border rounded-xl transition-all active:scale-95 cursor-pointer
                            ${
                                link.active
                                    ? `font-bold ${activeVariants[variant]}`
                                    : `bg-white text-slate-600 border-slate-200 ${hoverVariants[variant]} dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600`
                            }
                        `}
                        href={link.url}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                )
            )}
        </div>
    );
}
