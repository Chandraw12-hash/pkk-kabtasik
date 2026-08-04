import React, { useEffect, useState, Fragment } from "react";
import { X } from "lucide-react";

interface ModalProps {
    show?: boolean;
    onClose: () => void;
    title?: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
}

export default function Modal({
    show = false,
    onClose,
    title,
    children,
    footer,
    maxWidth = "md",
}: ModalProps) {
    const [animate, setAnimate] = useState(false);
    const [isVisible, setIsVisible] = useState(show);

    useEffect(() => {
        if (show) {
            setIsVisible(true);
            const timer = setTimeout(() => setAnimate(true), 10);
            return () => clearTimeout(timer);
        } else {
            setAnimate(false);
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [show]);

    const maxWidthClass = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
    }[maxWidth];

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-6">
                {/* Backdrop */}
                <div
                    className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
                        animate ? "opacity-100" : "opacity-0"
                    }`}
                    onClick={onClose}
                />

                <div
                    className={`
                    relative bg-white dark:bg-slate-800 w-full ${maxWidthClass} rounded-2xl shadow-xl text-left
                    transform transition-all duration-300 ease-in-out mb-6 flex flex-col max-h-[85vh]
                    ${
                        animate
                            ? "opacity-100 scale-100 translate-y-0"
                            : "opacity-0 scale-95 translate-y-4"
                    }
                `}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700 rounded-t-2xl shrink-0">
                        <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
                            {title}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-6 text-slate-700 dark:text-slate-300 overflow-y-auto custom-scrollbar">
                        {children}
                    </div>

                    {/* Footer */}
                    {footer && (
                        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3 rounded-b-2xl shrink-0">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
