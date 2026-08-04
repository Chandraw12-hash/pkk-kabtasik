import React, { ReactNode } from "react";

export interface Column<T> {
    header: string;
    accessor?: keyof T;
    render?: (item: T, index: number) => ReactNode;
    className?: string;
    headerClassName?: string;
}

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyExtractor?: (item: T) => string | number;
    emptyMessage?: string;
    isLoading?: boolean;
}

export default function Table<T>({
    columns,
    data,
    keyExtractor = (item: any) => item.id,
    emptyMessage = "Tidak ada data yang tersedia.",
    isLoading = false,
}: TableProps<T>) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                className={`px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest ${
                                    col.headerClassName || ""
                                }`}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-800">
                    {isLoading ? (
                        Array.from({ length: data.length > 0 ? data.length : 5 }).map((_, rowIndex) => (
                            <tr
                                key={`skeleton-${rowIndex}`}
                                className="animate-pulse border-b border-slate-100 dark:border-slate-700/50 last:border-0 h-[68px]" // Fixed height estimate
                            >
                                {columns.map((col, colIndex) => {
                                    // Make action and small columns centered and smaller
                                    const isCenter = col.className?.includes("text-center");
                                    
                                    return (
                                        <td
                                            key={`skeleton-col-${colIndex}`}
                                            className={`px-6 py-4 ${col.className || ""}`}
                                        >
                                            <div className={`h-4 bg-slate-200 dark:bg-slate-700 rounded-md opacity-70 ${isCenter ? 'w-1/2 mx-auto' : 'w-full'}`}></div>
                                            {/* Optional 2nd line for descriptions */}
                                            {col.header === "Deskripsi" && (
                                                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-md w-2/3 mt-2 opacity-50"></div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))
                    ) : data.length > 0 ? (
                        data.map((item, rowIndex) => (
                            <tr
                                key={keyExtractor(item)}
                                className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors"
                            >
                                {columns.map((col, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className={`px-6 py-4 text-sm text-slate-600 dark:text-slate-300 ${
                                            col.className || ""
                                        }`}
                                    >
                                        {col.render
                                            ? col.render(item, rowIndex)
                                            : col.accessor
                                            ? (item[col.accessor] as ReactNode)
                                            : null}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-6 py-8 text-center text-slate-500 dark:text-slate-400 italic"
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
