import React, { ReactNode, useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    FileText,
    BarChart3,
    Building2,
    Home,
    LogOut,
    Menu,
    ChevronDown,
    MapPin,
    X,
    Moon,
    Sun,
    User,
    Newspaper,
    Package,
    CheckCircle2,
    ClipboardCheck,
} from 'lucide-react';

// 🔥 IMPORT NOTIFIKASI BELL
import NotificationBellKecamatan from './NotificationBellKecamatan';

interface AdminKecamatanLayoutProps {
    children: ReactNode;
}

interface UserType {
    name?: string;
    profile_photo_path?: string;
    kecamatan?: string;
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

export default function AdminKecamatanLayout({ children }: AdminKecamatanLayoutProps) {
    const { auth, app_settings } = usePage<SharedProps>().props;

    const [isOpen, setIsOpen] = useState(false);
    const [rekapOpen, setRekapOpen] = useState(true);
    const [dataPkkOpen, setDataPkkOpen] = useState(true);
    const [approvalOpen, setApprovalOpen] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const user = auth?.user;
    const roles = auth?.roles || [];
    const appName = app_settings?.app_name || "PKK TASIKMALAYA";
    const kecamatan = user?.kecamatan || "Kecamatan";

    const currentUrl = typeof window !== "undefined" ? window.location.pathname : "";
    const isActive = (path: string) => currentUrl.startsWith(path);
    const isExactActive = (path: string) => currentUrl === path;

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
    // AUTO-EXPAND SUBMENU
    // ============================================================
    useEffect(() => {
        if (isActive("/kecamatan/data-pkk")) setDataPkkOpen(true);
        if (isActive("/kecamatan/rekap")) setRekapOpen(true);
        if (isActive("/kecamatan/approval")) setApprovalOpen(true);
    }, [currentUrl]);

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
                <nav className="flex-1 px-3 overflow-y-auto space-y-1 custom-scrollbar pb-6">
                    {/* Info Kecamatan */}
                    <div className="mx-3 mb-4 p-3 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-100 dark:border-teal-900">
                        <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-teal-600 dark:text-teal-400" />
                            <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                                Admin Kecamatan
                            </span>
                        </div>
                        <p className="text-sm font-bold text-teal-800 dark:text-teal-300 mt-1 truncate">
                            {kecamatan}
                        </p>
                    </div>

                    {/* Main Menu */}
                    <p className="px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Main Menu
                    </p>

                    <Link
                        href="/kecamatan"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-[15px] group ${
                            isExactActive("/kecamatan")
                                ? "bg-teal-50 dark:bg-slate-800 text-teal-600 dark:text-teal-400"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                    >
                        <LayoutDashboard
                            size={20}
                            strokeWidth={2}
                            className={`shrink-0 ${
                                isExactActive("/kecamatan")
                                    ? "text-teal-600 dark:text-teal-400"
                                    : "text-slate-400 dark:text-slate-500 group-hover:text-teal-500"
                            }`}
                        />
                        <span>Dashboard</span>
                    </Link>

                    {/* ✅ APPROVAL — DROPDOWN BARU */}
                    <div className="mt-1">
                        <button
                            type="button"
                            onClick={() => setApprovalOpen(!approvalOpen)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-[15px] transition-all group ${
                                isActive("/kecamatan/data-pkk/umum/approval") ||
                                isActive("/kecamatan/data-pkk/kegiatan/approval")
                                    ? "text-teal-600 dark:text-teal-400"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <ClipboardCheck
                                    size={20}
                                    strokeWidth={2}
                                    className={`shrink-0 ${
                                        isActive("/kecamatan/data-pkk/umum/approval") ||
                                        isActive("/kecamatan/data-pkk/kegiatan/approval")
                                            ? "text-teal-600 dark:text-teal-400"
                                            : "text-slate-400 dark:text-slate-500 group-hover:text-teal-500"
                                    }`}
                                />
                                <span>Approval</span>
                            </div>
                            <ChevronDown
                                size={16}
                                className={`transition-transform duration-300 ${
                                    approvalOpen ? "rotate-180" : ""
                                }`}
                            />
                        </button>

                        <div
                            className={`overflow-hidden transition-all duration-300 ${
                                approvalOpen ? "max-h-96" : "max-h-0"
                            }`}
                        >
                            <div className="ml-9 border-l border-slate-100 dark:border-slate-800 mt-1 pl-2 space-y-1">
                                <Link
                                    href="/kecamatan/data-pkk/umum/approval"
                                    className={`flex items-center gap-2.5 py-2 px-3 text-sm rounded-lg transition-colors ${
                                        isActive("/kecamatan/data-pkk/umum/approval")
                                            ? "text-teal-600 dark:text-teal-400 font-semibold bg-teal-50/50 dark:bg-slate-800/50"
                                            : "text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
                                    }`}
                                >
                                    <FileText size={16} />
                                    <span className="flex-1">Approval Data Umum</span>
                                    <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400 text-[10px] font-bold">
                                        !
                                    </span>
                                </Link>

                                <Link
                                    href="/kecamatan/data-pkk/kegiatan/approval"
                                    className={`flex items-center gap-2.5 py-2 px-3 text-sm rounded-lg transition-colors ${
                                        isActive("/kecamatan/data-pkk/kegiatan/approval")
                                            ? "text-teal-600 dark:text-teal-400 font-semibold bg-teal-50/50 dark:bg-slate-800/50"
                                            : "text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
                                    }`}
                                >
                                    <CheckCircle2 size={16} />
                                    <span className="flex-1">Approval Rekap Kegiatan</span>
                                    <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400 text-[10px] font-bold">
                                        !
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <Link
                        href="/kecamatan/laporan"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-[15px] group ${
                            isActive("/kecamatan/laporan")
                                ? "bg-teal-50 dark:bg-slate-800 text-teal-600 dark:text-teal-400"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                    >
                        <FileText
                            size={20}
                            strokeWidth={2}
                            className={`shrink-0 ${
                                isActive("/kecamatan/laporan")
                                    ? "text-teal-600 dark:text-teal-400"
                                    : "text-slate-400 dark:text-slate-500 group-hover:text-teal-500"
                            }`}
                        />
                        <span>Laporan Kecamatan</span>
                    </Link>

                    <Link
                        href="/kecamatan/berita"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-[15px] group ${
                            isActive("/kecamatan/berita")
                                ? "bg-teal-50 dark:bg-slate-800 text-teal-600 dark:text-teal-400"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                    >
                        <Newspaper
                            size={20}
                            strokeWidth={2}
                            className={`shrink-0 ${
                                isActive("/kecamatan/berita")
                                    ? "text-teal-600 dark:text-teal-400"
                                    : "text-slate-400 dark:text-slate-500 group-hover:text-teal-500"
                            }`}
                        />
                        <span>Berita Kecamatan</span>
                    </Link>

                    {/* ✅ DATA PKK DROPDOWN */}
                    <div className="mt-1">
                        <button
                            type="button"
                            onClick={() => setDataPkkOpen(!dataPkkOpen)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-[15px] transition-all group ${
                                isActive("/kecamatan/data-pkk")
                                    ? "text-teal-600 dark:text-teal-400"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Package
                                    size={20}
                                    strokeWidth={2}
                                    className={`shrink-0 ${
                                        isActive("/kecamatan/data-pkk")
                                            ? "text-teal-600 dark:text-teal-400"
                                            : "text-slate-400 dark:text-slate-500 group-hover:text-teal-500"
                                    }`}
                                />
                                <span>Data PKK</span>
                            </div>
                            <ChevronDown
                                size={16}
                                className={`transition-transform duration-300 ${
                                    dataPkkOpen ? "rotate-180" : ""
                                }`}
                            />
                        </button>

                        <div
                            className={`overflow-hidden transition-all duration-300 ${
                                dataPkkOpen ? "max-h-96" : "max-h-0"
                            }`}
                        >
                            <div className="ml-9 border-l border-slate-100 dark:border-slate-800 mt-1 pl-2 space-y-1">
                                <Link
                                    href="/kecamatan/data-pkk/umum"
                                    className={`flex items-center gap-2.5 py-2 px-3 text-sm rounded-lg transition-colors ${
                                        isActive("/kecamatan/data-pkk/umum")
                                            ? "text-teal-600 dark:text-teal-400 font-semibold bg-teal-50/50 dark:bg-slate-800/50"
                                            : "text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
                                    }`}
                                >
                                    <FileText size={16} />
                                    <span>Data Umum PKK</span>
                                </Link>

                                <Link
                                    href="/kecamatan/data-pkk/kegiatan"
                                    className={`flex items-center gap-2.5 py-2 px-3 text-sm rounded-lg transition-colors ${
                                        isActive("/kecamatan/data-pkk/kegiatan")
                                            ? "text-teal-600 dark:text-teal-400 font-semibold bg-teal-50/50 dark:bg-slate-800/50"
                                            : "text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
                                    }`}
                                >
                                    <BarChart3 size={16} />
                                    <span>Rekap Kegiatan</span>
                                </Link>

                                <Link
                                    href="/kecamatan/data-pkk/bumil"
                                    className={`flex items-center gap-2.5 py-2 px-3 text-sm rounded-lg transition-colors ${
                                        isActive("/kecamatan/data-pkk/bumil")
                                            ? "text-teal-600 dark:text-teal-400 font-semibold bg-teal-50/50 dark:bg-slate-800/50"
                                            : "text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
                                    }`}
                                >
                                    <User size={16} />
                                    <span>Rekap Bumil</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Rekap Dropdown */}
                    <div className="mt-1">
                        <button
                            type="button"
                            onClick={() => setRekapOpen(!rekapOpen)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-[15px] transition-all group ${
                                isActive("/kecamatan/rekap")
                                    ? "text-teal-600 dark:text-teal-400"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <BarChart3
                                    size={20}
                                    strokeWidth={2}
                                    className={`shrink-0 ${
                                        isActive("/kecamatan/rekap")
                                            ? "text-teal-600 dark:text-teal-400"
                                            : "text-slate-400 dark:text-slate-500 group-hover:text-teal-500"
                                    }`}
                                />
                                <span>Rekap</span>
                            </div>
                            <ChevronDown
                                size={16}
                                className={`transition-transform duration-300 ${
                                    rekapOpen ? "rotate-180" : ""
                                }`}
                            />
                        </button>

                        <div
                            className={`overflow-hidden transition-all duration-300 ${
                                rekapOpen ? "max-h-96" : "max-h-0"
                            }`}
                        >
                            <div className="ml-9 border-l border-slate-100 dark:border-slate-800 mt-1 pl-2 space-y-1">
                                <Link
                                    href="/kecamatan/rekap/kecamatan"
                                    className={`flex items-center gap-2.5 py-2 px-3 text-sm rounded-lg transition-colors ${
                                        isActive("/kecamatan/rekap/kecamatan")
                                            ? "text-teal-600 dark:text-teal-400 font-semibold bg-teal-50/50 dark:bg-slate-800/50"
                                            : "text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
                                    }`}
                                >
                                    <BarChart3 size={16} />
                                    <span>Rekap Kecamatan</span>
                                </Link>

                                <Link
                                    href="/kecamatan/rekap/desa"
                                    className={`flex items-center gap-2.5 py-2 px-3 text-sm rounded-lg transition-colors ${
                                        isActive("/kecamatan/rekap/desa")
                                            ? "text-teal-600 dark:text-teal-400 font-semibold bg-teal-50/50 dark:bg-slate-800/50"
                                            : "text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
                                    }`}
                                >
                                    <Building2 size={16} />
                                    <span>Rekap Desa</span>
                                </Link>

                                <Link
                                    href="/kecamatan/rekap/dasa-wisma"
                                    className={`flex items-center gap-2.5 py-2 px-3 text-sm rounded-lg transition-colors ${
                                        isActive("/kecamatan/rekap/dasa-wisma")
                                            ? "text-teal-600 dark:text-teal-400 font-semibold bg-teal-50/50 dark:bg-slate-800/50"
                                            : "text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
                                    }`}
                                >
                                    <Home size={16} />
                                    <span>Rekap Dasa Wisma</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                </nav>

                {/* Footer - User Dropdown */}
                <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
                    <div ref={dropdownRef} className="relative">
                        <button
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group cursor-pointer"
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
                                        "U"
                                    )}
                                </div>
                                <div className="text-left flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                                        {user?.name || "User"}
                                    </p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                                        {roles[0] || "User"}
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
                                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                >
                                    <span className="flex items-center gap-2.5">
                                        {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                                        {isDarkMode ? "Light Mode" : "Dark Mode"}
                                    </span>
                                </button>

                                <Link
                                    href="/"
                                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                >
                                    <Home size={16} />
                                    Halaman Depan
                                </Link>

                                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>

                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors cursor-pointer"
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
                                Admin Kecamatan
                            </h1>
                            <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold">
                                {kecamatan}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <NotificationBellKecamatan />
                        </div>
                    </div>

                    {/* Mobile Header */}
                    <div className="md:hidden px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsOpen(true)}
                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            </button>
                            <div>
                                <h1 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                    Admin Kecamatan
                                </h1>
                                <p className="text-xs text-teal-600 dark:text-teal-400">
                                    {kecamatan}
                                </p>
                            </div>
                        </div>

                        <NotificationBellKecamatan />
                    </div>
                </header>

                {/* Content */}
                <main className="p-4 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
