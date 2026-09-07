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
    period = "",
}: StatCardProps) {
    return (
        <div
            className={`bg-white p-5 rounded-xl border border-slate-200 hover:shadow-md transition-shadow ${className}`}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        {title}
                    </p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">
                        {value}
                    </p>
                    {description && (
                        <p className="text-xs text-slate-400 mt-0.5">{description}</p>
                    )}
                </div>
                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                    <Icon size={18} className="text-white" />
                </div>
            </div>
        </div>
    );
}
