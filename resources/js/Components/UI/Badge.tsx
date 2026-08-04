import React, { ReactNode } from "react";

type BadgeType = "default" | "success" | "danger" | "warning" | "info";

interface BadgeProps {
    children: ReactNode;
    type?: BadgeType;
    className?: string;
}

export default function Badge({
    children,
    type = "default",
    className = "",
}: BadgeProps) {
    const variants: Record<BadgeType, string> = {
        default:
            "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600",
        success:
            "bg-brand-green-50 text-brand-green-600 border-brand-green-100 dark:bg-brand-green-700 dark:text-brand-green-200 dark:border-brand-green-600",
        danger: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-700 dark:text-rose-200 dark:border-rose-600",
        warning:
            "bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-700 dark:text-yellow-200 dark:border-yellow-600",
        info: "bg-brand-blue-50 text-brand-blue-600 border-brand-blue-100 dark:bg-brand-blue-700 dark:text-brand-blue-200 dark:border-brand-blue-600",
    };

    return (
        <span
            className={`
            inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border
            ${variants[type] || variants.default}
            ${className}
        `}
        >
            {children}
        </span>
    );
}
