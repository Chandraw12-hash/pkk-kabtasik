import { Link, InertiaLinkProps } from "@inertiajs/react";
import React, { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant =
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "warning"
    | "outline"
    | "ghost"
    | "light";
type ButtonSize = "sm" | "md" | "lg";

interface BaseProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
    children?: ReactNode;
}

type ButtonProps = BaseProps &
    (
        | ({ href: string } & Omit<
              InertiaLinkProps,
              "className" | "children" | "size"
          >)
        | ({ href?: undefined } & Omit<
              ButtonHTMLAttributes<HTMLButtonElement>,
              "className" | "children" | "size"
          >)
    );

export default function Button({
    variant = "primary",
    size = "md",
    className = "",
    children,
    ...props
}: ButtonProps) {
    // Base classes for consistent look
    const baseClasses =
        "inline-flex items-center justify-center font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-xl cursor-pointer";

    // Variant mapping
    const variants: Record<ButtonVariant, string> = {
        primary:
            "bg-brand-blue-600 text-white hover:bg-brand-blue-700 hover:shadow-lg hover:shadow-brand-blue-200 dark:hover:shadow-brand-blue-900/30 ring-brand-blue-100 dark:ring-brand-blue-900 focus:ring-4",
        secondary:
            "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 ring-slate-100 dark:ring-slate-800 focus:ring-4",
        danger: "bg-rose-500 text-white hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-200 dark:hover:shadow-rose-900/30 ring-rose-100 dark:ring-rose-900 focus:ring-4",
        success:
            "bg-brand-green-500 text-white hover:bg-brand-green-600 hover:shadow-lg hover:shadow-brand-green-200 dark:hover:shadow-brand-green-900/30 ring-brand-green-100 dark:ring-brand-green-900 focus:ring-4",
        warning:
            "bg-yellow-500 text-white hover:bg-yellow-600 hover:shadow-lg hover:shadow-yellow-200 dark:hover:shadow-yellow-900/30 ring-yellow-100 dark:ring-yellow-900 focus:ring-4",
        outline:
            "bg-transparent border-2 border-brand-blue-600 text-brand-blue-600 dark:text-brand-blue-400 hover:bg-brand-blue-50 dark:hover:bg-slate-800",
        ghost: "bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200",
        light: "bg-brand-blue-50 dark:bg-slate-800 text-brand-blue-700 dark:text-brand-blue-400 hover:bg-brand-blue-100 dark:hover:bg-slate-700",
    };

    // Size mapping
    const sizes: Record<ButtonSize, string> = {
        sm: "px-3 py-1.5 text-xs gap-1.5",
        md: "px-5 py-2.5 text-sm gap-2",
        lg: "px-8 py-4 text-base gap-3",
    };

    const combinedClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

    if (props.href) {
        // Safe cast because we know href exists
        const { href, ...linkProps } = props as {
            href: string;
        } & InertiaLinkProps;
        return (
            <Link href={href} className={combinedClasses} {...linkProps}>
                {children}
            </Link>
        );
    }

    return (
        <button
            className={combinedClasses}
            {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
        >
            {children}
        </button>
    );
}
