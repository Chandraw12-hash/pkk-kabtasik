import React from "react";
import { Menu } from "lucide-react";

interface NavbarProps {
    onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
    return (
        <header className="h-16 md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sticky top-0 z-10 transition-colors duration-300">
            <div className="flex items-center gap-4">
                {/* Mobile Menu Button - Only visible on detailed screens if logic requires, but structured for mobile */}
                <button
                    onClick={onMenuClick}
                    className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all active:scale-90 cursor-pointer"
                >
                    <Menu size={24} />
                </button>
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                    SPBE Tasikmalaya
                </div>
            </div>
            {/* Right side blank or add other mobile controls if needed */}
        </header>
    );
}
