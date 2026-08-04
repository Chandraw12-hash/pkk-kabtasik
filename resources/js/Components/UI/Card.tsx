import React, { ElementType, HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    as?: ElementType;
    className?: string;
}

export default function Card({
    children,
    className = "",
    as: Component = "div",
    ...props
}: CardProps) {
    return (
        <Component
            className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden ${className}`}
            {...props}
        >
            {children}
        </Component>
    );
}
