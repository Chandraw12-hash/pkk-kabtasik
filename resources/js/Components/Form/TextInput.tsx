import React, { InputHTMLAttributes, ReactNode, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type InputVariant = "primary" | "success" | "danger" | "warning";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
    error?: string;
    containerClassName?: string;
    variant?: InputVariant;
}

export default function TextInput({
    type = "text",
    className = "",
    iconLeft,
    iconRight,
    error,
    containerClassName = "relative w-full mt-2",
    variant = "primary",
    ...props
}: TextInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    // Tentukan tipe input akhir (kalau password, bisa berubah jadi text)
    const inputType = type === "password" && showPassword ? "text" : type;

    const focusVariants: Record<InputVariant, string> = {
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

            <input
                {...props}
                type={inputType}
                className={
                    `py-2 border bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl shadow-xs transition-all duration-200 outline-none w-full ` +
                    (error
                        ? "border-rose-500 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 "
                        : `border-slate-200 dark:border-slate-700 focus:ring-4 ${focusVariants[variant]} `) +
                    (iconLeft ? "pl-11 " : "px-4 ") +
                    (type === "password" || iconRight ? "pr-11 " : "") +
                    className
                }
            />

            {/* Right Icon (Prioritize Password Toggle if Type is Password) */}
            {type === "password" ? (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-indigo-600 transition-colors flex items-center cursor-pointer"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            ) : iconRight ? (
                <div className="absolute right-0 top-0 h-full pr-4 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
                    {iconRight}
                </div>
            ) : null}

            {/* Error Message */}
            {error && (
                <p className="text-sm text-rose-500 mt-1 ml-1">{error}</p>
            )}
        </div>
    );
}
