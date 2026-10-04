import React, { ReactNode, useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Home,
    LogOut,
    Menu,
    ChevronDown,
    X,
    Moon,
    Sun,
    ClipboardList,
} from 'lucide-react';

interface DasawismaLayoutProps {
    children: ReactNode;
}

interface UserType {
    name?: string;
    profile_photo_path?: string;
    [key: string]: unknown;
}

interface AuthType {
    user?: UserType;
    roles?: string[];
    [key: string]: unknown;
}

interface SharedProps {
    auth?: AuthType;
    app_settings?: {
        app_name?: string;
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

export default function DasawismaLayout({ children }: DasawismaLayoutProps) {
    const { auth, app_settings } = usePage<SharedProps>().props;

    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const user = auth?.user;
    const roles = auth?.roles || [];
    const appName = app_settings?.app_name || "PKK TASIKMALAYA";

    const currentUrl = typeof window !== "undefined" ? window.location.pathname : "";
    const isExactActive = (path: string) => currentUrl === path;
    const isActive = (path: string) => currentUrl.startsWith(path);

    // ============================================================
    // DARK MODE
    // ============================================================
    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (
            storedTheme === "dark" ||
            (!storedTheme &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
        ) {
            setIsDarkMode(true);
            document.documentElement.classList.add("dark");
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDarkMode(true);
        }
    };

    // ============================================================
    // CLICK OUTSIDE DROPDOWN
    // ============================================================
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* ============================================================
                SIDEBAR
            ============================================================ */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-800/60
                    transform transition-transform duration-200 ease-in-out md:translate-x-0
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    w-72
                    flex flex-col h-screen
                `}
            >
                {/* Logo Header */}
                <div className="p-6 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                        <img
                            src="/assets/logo/logotasik.png"
                            alt="Logo PKK Kabupaten Tasikmalaya"
                            className="h-10 w-10 object-contain shrink-0"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                        <span className="text-base font-bold text-slate-800 dark:text-slate-200 tracking-wider leading-tight line-clamp-2">
                            {appName}
                        </span>
                    </div>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="md:hidden p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all shrink-0"
                        aria-label="Tutup sidebar"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav id="dasawisma-navigation" className="flex-1 px-3 overflow-y-auto space-y-1 custom-scrollbar pb-6">
                    {/* Info Badge */}
                    <div className="mx-3 mb-4 p-3 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-100 dark:border-teal-900">
                        <div className="flex items-center gap-2">
                            <ClipboardList size={14} className="text-teal-600 dark:text-teal-400" />
                            <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                                Kader Dasawisma
                            </span>
                        </div>
                        <p className="text-sm font-bold text-teal-800 dark:text-teal-300 mt-1 truncate">
                            {user?.name || "Dasawisma"}
                        </p>
                    </div>

                    {/* Main Menu */}
                    <p className="px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Main Menu
                    </p>

                    <Link
                        href="/dasawisma"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-[15px] group ${
                            isExactActive("/dasawisma")
                                ? "bg-teal-50 dark:bg-slate-800 text-teal-600 dark:text-teal-400"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                    >
                        <LayoutDashboard
                            size={20}
                            strokeWidth={2}
                            className={`shrink-0 ${
                                isExactActive("/dasawisma")
                                    ? "text-teal-600 dark:text-teal-400"
                                    : "text-slate-400 dark:text-slate-500 group-hover:text-teal-500"
                            }`}
                        />
                        <span>Dashboard</span>
                    </Link>
                </nav>

                {/* Footer - User Dropdown */}
                <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
                    <div ref={dropdownRef} className="relative">
                        <button
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            aria-expanded={isDropdownOpen}
                            aria-haspopup="true"
                            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                        >
                            <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                                <div className="w-9 h-9 shrink-0 rounded-full bg-teal-100 dark:bg-teal-900/50 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold overflow-hidden shadow-sm">
                                    {user?.profile_photo_path ? (
                                        <img
                                            src={`/storage/${user.profile_photo_path}`}
                                            alt={user?.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : user?.name ? (
                                        user.name
                                            .split(" ")
                                            .map((n: string) => n[0])
                                            .join("")
                                            .substring(0, 2)
                                            .toUpperCase()
                                    ) : (
                                        "D"
                                    )}
                                </div>
                                <div className="text-left flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                                        {user?.name || "User"}
                                    </p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                                        Dasawisma
                                    </p>
                                </div>
                            </div>
                            <ChevronDown
                                size={16}
                                className={`shrink-0 text-slate-400 transition-transform duration-200 ml-2 ${
                                    isDropdownOpen ? "rotate-180" : ""
                                }`}
                            />
                        </button>

                        {/* Dropdown Menu */}
                        <div
                            className={`absolute bottom-full mb-2 left-0 right-0 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-50 transform transition-all duration-200 origin-bottom ${
                                isDropdownOpen
                                    ? "opacity-100 scale-100 translate-y-0"
                                    : "opacity-0 scale-95 translate-y-2 pointer-events-none"
                            }`}
                        >
                            <div className="p-1 space-y-1">
                                <button
                                    type="button"
                                    onClick={toggleTheme}
                                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                                >
                                    <span className="flex items-center gap-2.5">
                                        {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                                        {isDarkMode ? "Light Mode" : "Dark Mode"}
                                    </span>
                                </button>

                                <Link
                                    href="/"
                                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                                >
                                    <Home size={16} />
                                    Halaman Depan
                                </Link>

                                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>

                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                                >
                                    <LogOut size={16} />
                                    Log Out
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Overlay Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* ============================================================
                MAIN CONTENT
            ============================================================ */}
            <div className="md:ml-72">
                {/* HEADER */}
                <header className="sticky top-0 z-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    {/* Desktop Header */}
                    <div className="hidden md:flex items-center justify-between px-6 lg:px-8 py-4">
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                Panel Dasawisma
                            </h1>
                            <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold">
                                Kader Dasawisma — PKK Kab. Tasikmalaya
                            </p>
                        </div>
                    </div>

                    {/* Mobile Header */}
                    <div className="md:hidden px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setIsOpen(true)}
                                aria-label="Buka navigasi"
                                aria-controls="dasawisma-navigation"
                                aria-expanded={isOpen}
                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                            >
                                <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            </button>
                            <div>
                                <h1 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                    Panel Dasawisma
                                </h1>
                                <p className="text-xs text-teal-600 dark:text-teal-400">
                                    Kader Dasawisma
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="p-4 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
