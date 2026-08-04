import React, { useState, useRef, useEffect, ReactNode } from "react";
import { Search, ChevronDown, Check } from "lucide-react";

interface Option {
    value: string | number;
    label: string;
}

type SelectVariant = "primary" | "success" | "danger" | "warning";

interface SelectSearchProps {
    options: Option[];
    value: string | number;
    onChange: (value: string | number) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    className?: string;
    disabled?: boolean;
    iconLeft?: ReactNode;
    variant?: SelectVariant;
}

export default function SelectSearch({
    options,
    value,
    onChange,
    placeholder = "Pilih opsi...",
    label,
    error,
    className = "",
    disabled = false,
    iconLeft, // Compatibility prop (might not be fully used but kept for consistent API)
    variant = "primary",
}: SelectSearchProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter options
    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const selectedOption = options.find((opt) => opt.value == value);

    const handleSelect = (optionValue: string | number) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchTerm("");
    };

    const hoverVariants: Record<SelectVariant, string> = {
        primary: "hover:border-brand-blue-400",
        success: "hover:border-brand-green-400",
        danger: "hover:border-rose-400",
        warning: "hover:border-yellow-400",
    };

    const ringVariants: Record<SelectVariant, string> = {
        primary: "ring-brand-blue-500/10 border-brand-blue-500",
        success: "ring-brand-green-500/10 border-brand-green-500",
        danger: "ring-rose-500/10 border-rose-500",
        warning: "ring-yellow-500/10 border-yellow-500",
    };

    const selectedVariants: Record<SelectVariant, string> = {
        primary: "bg-brand-blue-50 text-brand-blue-700 dark:bg-brand-blue-900/20 dark:text-brand-blue-400",
        success: "bg-brand-green-50 text-brand-green-700 dark:bg-brand-green-900/20 dark:text-brand-green-400",
        danger: "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400",
        warning: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
    };

    const searchFocusVariants: Record<SelectVariant, string> = {
        primary: "focus:border-brand-blue-500 focus:ring-brand-blue-500/10",
        success: "focus:border-brand-green-500 focus:ring-brand-green-500/10",
        danger: "focus:border-rose-500 focus:ring-rose-500/10",
        warning: "focus:border-yellow-500 focus:ring-yellow-500/10",
    };

    return (
        <div className={`relative w-full ${className}`} ref={wrapperRef}>
            {label && (
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {label}
                </label>
            )}

            <div
                className={`
                    relative w-full cursor-pointer
                    ${disabled ? "opacity-60 cursor-not-allowed" : ""}
                `}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <div
                    className={`
                    flex items-center justify-between
                    py-2 px-3 border rounded-xl
                    transition-all duration-200
                    ${
                        error
                            ? "border-rose-500 bg-white dark:bg-slate-900"
                            : `border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 ${hoverVariants[variant]}`
                    }
                    ${isOpen ? `ring-4 ${ringVariants[variant]}` : ""}
                `}
                >
                    <div className="flex items-center gap-2 overflow-hidden">
                        {/* Selected Value or Placeholder */}
                        <span
                            className={`block truncate ${!selectedOption ? "text-slate-500 dark:text-slate-400" : "text-slate-900 dark:text-slate-200"}`}
                        >
                            {selectedOption
                                ? selectedOption.label
                                : placeholder}
                        </span>
                    </div>
                    <ChevronDown
                        size={16}
                        className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <p className="text-sm text-rose-500 mt-1 ml-1">{error}</p>
            )}

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    {/* Search Input */}
                    <div className="p-2 border-b border-slate-100 dark:border-slate-700">
                        <div className="relative">
                            <Search
                                size={14}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                ref={inputRef}
                                type="text"
                                className={`w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 text-slate-700 dark:text-slate-200 ${searchFocusVariants[variant]}`}
                                placeholder="Cari..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Options List */}
                    <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    className={`
                                        flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors
                                        ${
                                            option.value == value
                                                ? `${selectedVariants[variant]} font-medium`
                                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                        }
                                    `}
                                >
                                    <span className="truncate">
                                        {option.label}
                                    </span>
                                    {option.value == value && (
                                        <Check size={14} />
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-4 text-center text-sm text-slate-400 dark:text-slate-500">
                                Tidak ada data ditemukan
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
