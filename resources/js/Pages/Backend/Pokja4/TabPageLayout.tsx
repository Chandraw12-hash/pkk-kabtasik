import React, { ReactNode } from "react";

interface Props {
    title: string;
    description: string;
    year: number;
    years: number[];
    onYearChange: (year: number) => void;
    children: ReactNode;
}

export default function TabPageLayout({
    title,
    description,
    year,
    years,
    onYearChange,
    children,
}: Props) {
    return (
        <section className="bg-white dark:bg-slate-800">
            <div className="border-b border-slate-100 p-6 dark:border-slate-700">
                <div className="min-w-0">
                    <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                        {title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {description}
                    </p>
                </div>
            </div>
            <div className="flex flex-col gap-3 border-b border-slate-50 p-6 dark:border-slate-700 md:flex-row md:items-center">
                <label
                    htmlFor="pokja4-year-filter"
                    className="text-sm font-medium text-slate-600 dark:text-slate-300"
                >
                    Tahun data
                </label>
                <select
                    id="pokja4-year-filter"
                    value={year}
                    onChange={(event) =>
                        onYearChange(Number(event.target.value))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 md:w-auto"
                >
                    {years.length > 0 ? (
                        years.map((itemYear) => (
                            <option key={itemYear} value={itemYear}>
                                {itemYear}
                            </option>
                        ))
                    ) : (
                        <option value={year}>{year}</option>
                    )}
                </select>
                <div className="min-w-0 flex-1" aria-live="polite">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                        Menampilkan data tahun {year}
                    </span>
                </div>
            </div>
            {children}
        </section>
    );
}
