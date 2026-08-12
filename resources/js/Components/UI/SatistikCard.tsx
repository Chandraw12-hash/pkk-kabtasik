// resources/js/Components/UI/SatistikCard.tsx
import React, { ElementType } from "react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: ElementType;
    color: string;
    textColor?: string;
    description?: string;
    className?: string;
    period?: string;
}

export default function StatCard({
    title,
    value,
    icon: Icon,
    color,
    description,
    className = "",
    period = "Tahun 2026",
}: StatCardProps) {
    return (
        <div
            className={`bg-white p-6 rounded-2xl shadow-sm shadow-slate-200/50 hover:shadow-md transition-shadow dark:bg-slate-800 dark:shadow-slate-700/50 flex flex-col justify-between ${className}`}
        >
            <div className="flex items-center justify-between mb-4">
                {/* Background kotak menggunakan warna solid, icon menggunakan text-white */}
                <div
                    className={`p-3 rounded-xl ${color} shadow-lg transition-transform`}
                >
                    <Icon size={22} strokeWidth={2} className="text-white" />
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider dark:text-slate-500 bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded-md">
                    {period}
                </span>
            </div>
            <div>
                <h3 className="text-slate-500 text-sm font-medium dark:text-slate-400 mb-1">
                    {title}
                </h3>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                        {value}
                    </span>
                    {description && (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                            {description}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
