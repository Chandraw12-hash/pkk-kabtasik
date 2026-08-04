import React, { SelectHTMLAttributes, ReactNode } from "react";

type SelectVariant = "primary" | "success" | "danger" | "warning";

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
    iconLeft?: ReactNode;
    error?: string;
    children?: ReactNode;
    options?: { value: string | number; label: string }[];
    variant?: SelectVariant;
    containerClassName?: string;
}

export default function SelectInput({
    className = "",
    iconLeft,
    error,
    children,
    options,
    variant = "primary",
    containerClassName = "relative w-full mt-2",
    ...props
}: SelectInputProps) {
    const focusVariants: Record<SelectVariant, string> = {
        primary: "focus:border-brand-blue-500 focus:ring-brand-blue-500/10",
        success: "focus:border-brand-green-500 focus:ring-brand-green-500/10",
        danger: "focus:border-rose-500 focus:ring-rose-500/10",
        warning: "focus:border-yellow-500 focus:ring-yellow-500/10",
    };

    return (
        <div className={containerClassName}>
            {/* Left Icon */}
            {iconLeft && (
                <div className="absolute left-0 top-0 h-full pl-4 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
                    {iconLeft}
                </div>
            )}

            <select
                {...props}
                className={
                    `appearance-none py-2 border bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl shadow-xs transition-all duration-200 outline-none w-full ` +
                    (error
                        ? "border-rose-500 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 "
                        : `border-slate-200 dark:border-slate-700 focus:ring-4 ${focusVariants[variant]} `) +
                    (iconLeft ? "pl-11 " : "px-4 ") +
                    "disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed " +
                    className
                }
            >
                {options
                    ? options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                              {opt.label}
                          </option>
                      ))
                    : children}
            </select>

            {/* Custom Chevron Icon (Optional, if we want to override default browser arrow) */}
            <div className="absolute right-0 top-0 h-full px-4 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </div>

            {/* Error Message */}
            {error && (
                <p className="text-sm text-rose-500 mt-1 ml-1">{error}</p>
            )}
        </div>
    );
}
