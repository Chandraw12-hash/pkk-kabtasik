import React, { TextareaHTMLAttributes, useState } from "react";

type InputVariant = "primary" | "success" | "danger" | "warning";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    containerClassName?: string;
    variant?: InputVariant;
}

export default function TextArea({
    label,
    className = "",
    error,
    containerClassName = "relative w-full mt-2",
    variant = "success",
    ...props
}: TextAreaProps) {
    const focusVariants: Record<InputVariant, string> = {
        primary: "focus:border-brand-blue-500 focus:ring-brand-blue-500/10",
        success: "focus:border-brand-green-500 focus:ring-brand-green-500/10",
        danger: "focus:border-rose-500 focus:ring-rose-500/10",
        warning: "focus:border-yellow-500 focus:ring-yellow-500/10",
    };

    return (
        <div className={containerClassName}>
            {label && (
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                    {label}
                </label>
            )}
            <textarea
                {...props}
                className={
                    `py-2 border bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm rounded-xl shadow-xs transition-all duration-200 outline-none w-full ` +
                    (error
                        ? "border-rose-500 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 "
                        : `border-slate-200 dark:border-slate-700 focus:ring-4 ${focusVariants[variant]} `) +
                    "px-4 " +
                    className
                }
            />

            {/* Error Message */}
            {error && (
                <p className="text-sm text-rose-500 mt-1 ml-1">{error}</p>
            )}
        </div>
    );
}
