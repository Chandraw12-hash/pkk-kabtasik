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
            className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}
            {...props}
        >
            {children}
        </Component>
    );
}
