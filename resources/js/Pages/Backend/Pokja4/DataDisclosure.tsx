import React, { ReactNode } from "react";
import { ChevronDown, MapPin } from "lucide-react";

export interface DisclosureField {
    label: string;
    value: ReactNode;
}

export interface DisclosureGroup {
    title: string;
    fields: DisclosureField[];
}

interface Props {
    title: string;
    number?: number;
    description?: string;
    metrics: DisclosureField[];
    groups: DisclosureGroup[];
}

export default function DataDisclosure({
    title,
    number,
    description,
    metrics,
    groups,
}: Props) {
    return (
        <details className="group border-b border-slate-100 last:border-b-0 dark:border-slate-700">
            <summary className="list-none cursor-pointer px-5 py-4 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-500 dark:hover:bg-slate-700/40 sm:px-6 [&::-webkit-details-marker]:hidden">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                        {typeof number === "number" ? (
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold tabular-nums text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                                {number}
                            </span>
                        ) : (
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
                                <MapPin
                                    size={15}
                                    className="text-slate-500 dark:text-slate-300"
                                    aria-hidden="true"
                                />
                            </span>
                        )}
                        <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                                {title}
                            </h3>
                            {description && (
                                <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>

                    <dl className="grid min-w-0 flex-1 grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-4 lg:max-w-3xl">
                        {metrics.map((metric) => (
                            <div key={metric.label} className="min-w-0">
                                <dt className="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                    {metric.label}
                                </dt>
                                <dd className="mt-0.5 truncate text-sm font-semibold tabular-nums text-slate-700 dark:text-slate-200">
                                    {metric.value}
                                </dd>
                            </div>
                        ))}
                    </dl>

                    <span className="hidden shrink-0 items-center gap-1 text-xs font-medium text-slate-600 group-open:flex dark:text-slate-300">
                        Tutup rincian
                        <ChevronDown
                            size={15}
                            className="rotate-180"
                            aria-hidden="true"
                        />
                    </span>
                    <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-slate-600 group-open:hidden dark:text-slate-300">
                        Lihat rincian
                        <ChevronDown size={15} aria-hidden="true" />
                    </span>
                </div>
            </summary>

            <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-5 dark:border-slate-700 dark:bg-slate-900/40 sm:px-6">
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {groups.map((group) => (
                        <section key={group.title} className="min-w-0">
                            <h4 className="mb-3 border-b border-slate-200 pb-2 text-xs font-bold uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
                                {group.title}
                            </h4>
                            <dl className="space-y-2">
                                {group.fields.map((field) => (
                                    <div
                                        key={field.label}
                                        className="flex items-start justify-between gap-3 text-sm"
                                    >
                                        <dt className="text-slate-500 dark:text-slate-400">
                                            {field.label}
                                        </dt>
                                        <dd className="text-right font-medium tabular-nums text-slate-700 dark:text-slate-200">
                                            {field.value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </section>
                    ))}
                </div>
            </div>
        </details>
    );
}
