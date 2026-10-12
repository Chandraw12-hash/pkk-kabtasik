import React, {
    useState,
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
} from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    X,
    ChevronDown,
    Moon,
    Sun,
    User,
    Home,
    FolderKanban,
    Image as ImageLucide,
    Newspaper,
    FileText,
    BookOpen,
    HeartHandshake,
    Home as HomeIcon,
    Activity,
    CalendarDays,
    ClipboardList,
    Map as MapIcon,
    Image,
    Star,
    Clock,
    Database,
    ScrollText,
} from "lucide-react";

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

interface AppSettings {
    app_name?: string;
    app_logo?: string;
    [key: string]: unknown;
}

interface UserType {
    name?: string;
    profile_photo_path?: string;
    [key: string]: unknown;
}

interface AuthType {
    user?: UserType;
    roles?: string[];
    permissions?: string[];
    [key: string]: unknown;
}

interface SharedProps {
    app_settings?: AppSettings;
    auth?: AuthType;
    beritaPendingCount?: number;
    [key: string]: unknown;
}

declare function route(name?: string, params?: unknown): any;

/** Aman: kalau route belum ada di Ziggy, jangan crash */
const safeRoute = (name: string, params?: unknown): string => {
    try {
        return route(name, params as any);
    } catch {
        return "#";
    }
};

const routeExists = (name: string): boolean => {
    try {
        route(name);
        return true;
    } catch {
        return false;
    }
};

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
    const isCurrentRoute = (name: string) => {
        try {
            return typeof route === "function" && route().current(name);
        } catch {
            return false;
        }
    };

    const { app_settings, auth, beritaPendingCount = 0 } = usePage<SharedProps>().props;

    const hasAgenda = routeExists("be.agenda.index");
    const hasLaporan = routeExists("be.laporan-kegiatan.index");
    const hasInfografis = routeExists("be.infografis.index");
    const hasSurvey = routeExists("be.survey.index");
    const hasBeritaPending = routeExists("be.berita.pending");
    const hasStrukturOrganisasi = routeExists("be.struktur-organisasi.index");
    const hasBackup = routeExists("be.backup.index");
    const hasActivityLogs = routeExists("be.activity-logs.index");
    const hasSystem = routeExists("be.system.index");

    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
        pokjaManagement:
            isCurrentRoute("be.sekretariat.*") ||
            isCurrentRoute("be.pokja1.*") ||
            isCurrentRoute("be.pokja2.*") ||
            isCurrentRoute("be.pokja3.*") ||
            isCurrentRoute("be.pokja4.*"),
        userManagement:
            isCurrentRoute("be.users.*") || isCurrentRoute("be.roles.*"),
        settingManagement:
            isCurrentRoute("be.settings.*") || isCurrentRoute("be.struktur-organisasi.*"),
        beritaManagement:
            isCurrentRoute("be.berita.*"),
    });

    const toggleMenu = (menuName: string) => {
        setOpenMenus((prev) => ({ ...prev, [menuName]: !prev[menuName] }));
    };

    const user = auth?.user;
    const roles = auth?.roles || [];
    const permissions = auth?.permissions || [];
    const isSuperAdmin = roles.includes("super-admin");
    const isAdminLike = roles.includes("admin") || isSuperAdmin;
    const appName = app_settings?.app_name || "PKK TASIKMALAYA";

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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
        <aside
            className={`
            fixed inset-y-0 left-0 z-50 bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-800/60
            transform transition-transform duration-200 ease-in-out md:translate-x-0
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            w-72
            flex flex-col h-screen
        `}
        >
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

            <nav className="flex-1 px-3 overflow-y-auto space-y-1 custom-scrollbar pb-6">
                <p className="px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Main Menu
                </p>

                <Link
                    href={route("be.dashboard")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-[15px] group ${
                        isCurrentRoute("be.dashboard")
                            ? "bg-teal-50 dark:bg-slate-800 text-teal-600 dark:text-teal-400"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                >
                    <LayoutDashboard
                        size={20}
                        strokeWidth={2}
                        className={`shrink-0 ${
                            isCurrentRoute("be.dashboard")
                                ? "text-teal-600 dark:text-teal-400"
                                : "text-slate-400 dark:text-slate-500 group-hover:text-teal-500"
                        }`}
                    />
                    <span>Dashboard</span>
                </Link>

                <p className="px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-4">
                    Master Data
                </p>

                {permissions.includes("view-kader") && (
                    <Link
                        href={route("be.kader.index")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-[15px] group ${
                            isCurrentRoute("be.kader.*")
                                ? "bg-teal-50 dark:bg-slate-800 text-teal-600 dark:text-teal-400"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                    >
                        <Users
                            size={20}
                            strokeWidth={2}
                            className={`shrink-0 ${
                                isCurrentRoute("be.kader.*")
                                    ? "text-teal-600 dark:text-teal-400"
                                    : "text-slate-400 dark:text-slate-500 group-hover:text-teal-500"
                            }`}
                        />
                        <span>Data Kader</span>
                    </Link>
                )}

                <div className="mt-2">
                    <button
                        type="button"
                        onClick={() => toggleMenu("pokjaManagement")}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-[15px] transition-all group ${
                            isCurrentRoute("be.sekretariat.*") ||
                            isCurrentRoute("be.pokja1.*") ||
                            isCurrentRoute("be.pokja2.*") ||
                            isCurrentRoute("be.pokja3.*") ||
                            isCurrentRoute("be.pokja4.*")
                                ? "text-teal-600 dark:text-teal-400"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <FolderKanban
                                size={20}
                                strokeWidth={2}
                                className={`shrink-0 ${
                                    isCurrentRoute("be.sekretariat.*") ||
                                    isCurrentRoute("be.pokja1.*") ||
                                    isCurrentRoute("be.pokja2.*") ||
                                    isCurrentRoute("be.pokja3.*") ||
                                    isCurrentRoute("be.pokja4.*")
                                        ? "text-teal-600 dark:text-teal-400"
                                        : "text-slate-400 dark:text-slate-500 group-hover:text-teal-500"
                                }`}
                            />
                            <span>Data Pokja & Sekretariat</span>
                        </div>
                        <ChevronDown
                            size={16}
                            className={`transition-transform duration-300 ${
                                openMenus.pokjaManagement ? "rotate-180" : ""
                            }`}
                        />
                    </button>

                    <div
                        className={`overflow-hidden transition-all duration-300 ${
                            openMenus.pokjaManagement ? "max-h-96" : "max-h-0"
                        }`}
                    >
                        <div className="ml-9 border-l border-slate-100 dark:border-slate-800 mt-1 pl-2 space-y-1">
                            <Link
                                href={route("be.sekretariat.index")}
                                className={`flex items-center gap-2.5 py-2 px-3 text-sm rounded-lg transition-colors ${
                                    isCurrentRoute("be.sekretariat.*")
                                        ? "text-teal-600 dark:text-teal-400 font-semibold bg-teal-50/50 dark:bg-slate-800/50"
                                        : "text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
                                }`}
                            >
                                <FileText size={16} />
                                <span>Sekretariat</span>
                            </Link>
                            <Link
                                href={route("be.pokja1.index")}
                                className={`flex items-center gap-2.5 py-2 px-3 text-sm rounded-lg transition-colors ${
                                    isCurrentRoute("be.pokja1.*")
                                        ? "text-teal-600 dark:text-teal-400 font-semibold bg-teal-50/50 dark:bg-slate-800/50"
                                        : "text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
                                }`}
                            >
                                <HeartHandshake size={16} />
                                <span>Pokja I</span>
                            </Link>
                            <Link
                                href={route("be.pokja2.index")}
                                className={`flex items-center gap-2.5 py-2 px-3 text-sm rounded-lg transition-colors ${
                                    isCurrentRoute("be.pokja2.*")
                                        ? "text-teal-600 dark:text-teal-400 font-semibold bg-teal-50/50 dark:bg-slate-800/50"
                                        : "text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
                                }`}
                            >
                                <BookOpen size={16} />
                                <span>Pokja II</span>
                            </Link>
                            <Link
                                href={route("be.pokja3.index")}
                                className={`flex items-center gap-2.5 py-2 px-3 text-sm rounded-lg transition-colors ${
                                    isCurrentRoute("be.pokja3.*")
                                        ? "text-teal-600 dark:text-teal-400 font-semibold bg-teal-50/50 dark:bg-slate-800/50"
                                        : "text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
                                }`}
                            >
                                <HomeIcon size={16} />
                                <span>Pokja III</span>
                            </Link>
                            <Link
                                href={route("be.pokja4.index")}
                                className={`flex items-center gap-2.5 py-2 px-3 text-sm rounded-lg transition-colors ${
                                    isCurrentRoute("be.pokja4.*")
                                        ? "text-teal-600 dark:text-teal-400 font-semibold bg-teal-50/50 dark:bg-slate-800/50"
                                        : "text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
                                }`}
                            >
                                <Activity size={16} />
                                <span>Pokja IV</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ============================================
                    MANAJEMEN KONTEN - BERITA BISA DILIPAT
                ============================================ */}
                <p className="px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-4">
                    Manajemen Konten
                </p>

                <Link
                    href={route("be.galeri.index")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-[15px] group ${
                        isCurrentRoute("be.galeri.*")
                            ? "bg-teal-50 dark:bg-slate-800 text-teal-600 dark:text-teal-400"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                >
                    <ImageLucide
                        size={20}
                        strokeWidth={2}
                        className={`shrink-0 ${
                            isCurrentRoute("be.galeri.*")
                                ? "text-teal-600 dark:text-teal-400"
                                : "text-slate-400 dark:text-slate-500 group-hover:text-teal-500"
                        }`}
                    />
                    <span>Galeri Kegiatan</span>
                </Link>

                {/* ============================================
                    🔥🔥🔥 BERITA & INFORMASI DENGAN SUB MENU PENDING
                ============================================ */}
                <div className="mt-1">
                    <button
                        type="button"
                        onClick={() => toggleMenu("beritaManagement")}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-[15px] transition-all group ${
                            isCurrentRoute("be.berita.*")
                                ? "text-teal-600 dark:text-teal-400"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <Newspaper
                                size={20}
                                strokeWidth={2}
                                className={`shrink-0 ${
                                    isCurrentRoute("be.berita.*")
                                        ? "text-teal-600 dark:text-teal-400"
                                        : "text-slate-400 dark:text-slate-500 group-hover:text-teal-500"
                                }`}
                            />
                            <span>Berita & Informasi</span>
                            {/* Badge jumlah pending */}
                            {beritaPendingCount > 0 && (
                                <span className="ml-auto text-[10px] font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                    {beritaPendingCount}
                                </span>
                            )}
                        </div>
                        <ChevronDown
                            size={16}
                            className={`transition-transform duration-300 ${
                                openMenus.beritaManagement ? "rotate-180" : ""
                            }`}
                        />
                    </button>

                    <div
                        className={`overflow-hidden transition-all duration-300 ${
                            openMenus.beritaManagement ? "max-h-96" : "max-h-0"
                        }`}
                    >
                        <div className="ml-9 border-l border-slate-100 dark:border-slate-800 mt-1 pl-2 space-y-1">
                            {/* Semua Berita */}
                            <Link
                                href={route("be.berita.index")}
                                className={`flex items-center gap-2.5 py-2 px-3 text-sm rounded-lg transition-colors ${
                                    isCurrentRoute("be.berita.index") && !isCurrentRoute("be.berita.pending")
                                        ? "text-teal-600 dark:text-teal-400 font-semibold bg-teal-50/50 dark:bg-slate-800/50"
                                        : "text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
                                }`}
                            >
                                <FileText size={16} />
                                <span>Semua Berita</span>
                            </Link>

                            {/* 🔥 BERITA PENDING - SUB MENU */}
                            {hasBeritaPending && (
                                <Link
                                    href={safeRoute("be.berita.pending")}
                                    className={`flex items-center gap-2.5 py-2 px-3 text-sm rounded-lg transition-colors ${
                                        isCurrentRoute("be.berita.pending")
                                            ? "text-teal-600 dark:text-teal-400 font-semibold bg-teal-50/50 dark:bg-slate-800/50"
                                            : "text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
                                    }`}
                                >
                                    <Clock size={16} />
                                    <span>Berita Pending</span>
                                    {beritaPendingCount > 0 && (
                                        <span className="ml-auto text-[10px] font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                            {beritaPendingCount}
                                        </span>
                                    )}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Agenda */}
                {hasAgenda && (
                    <Link
                        href={safeRoute("be.agenda.index")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-[15px] group ${
                            isCurrentRoute("be.agenda.*")
                                ? "bg-teal-50 dark:bg-slate-800 text-teal-600 dark:text-teal-400"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                    >
                        <CalendarDays
                            size={20}
                            strokeWidth={2}
                            className={`shrink-0 ${
                                isCurrentRoute("be.agenda.*")
                                    ? "text-teal-600 dark:text-teal-400"
                                    : "text-slate-400 dark:text-slate-500 group-hover:text-teal-500"
                            }`}
                        />
                        <span>Agenda</span>
                    </Link>
                )}

                {/* Infografis */}
                {hasInfografis && (
                    <Link
                        href={safeRoute("be.infografis.index")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-[15px] group ${
                            isCurrentRoute("be.infografis.*")
                                ? "bg-teal-50 dark:bg-slate-800 text-teal-600 dark:text-teal-400"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                    >
                        <Image
                            size={20}
                            strokeWidth={2}
                            className={`shrink-0 ${
                                isCurrentRoute("be.infografis.*")
                                    ? "text-teal-600 dark:text-teal-400"
                                    : "text-slate-400 dark:text-slate-500 group-hover:text-teal-500"
                            }`}
                        />
                        <span>Infografis</span>
                    </Link>
                )}

                {/* Laporan Kegiatan */}
                {hasLaporan && (
                    <>
                        <p className="px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-4">
                            Mobile & Lapangan
                        </p>
                        <Link
                            href={safeRoute("be.laporan-kegiatan.index")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-[15px] group ${
                                isCurrentRoute("be.laporan-kegiatan.*")
                                    ? "bg-teal-50 dark:bg-slate-800 text-teal-600 dark:text-teal-400"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                        >
                            <ClipboardList
                                size={20}
                                strokeWidth={2}
                                className={`shrink-0 ${
                                    isCurrentRoute("be.laporan-kegiatan.*")
                                        ? "text-teal-600 dark:text-teal-400"
                                        : "text-slate-400 dark:text-slate-500 group-hover:text-teal-500"
                                }`}
                            />
                            <span>Laporan Kegiatan</span>
                        </Link>
                    </>
                )}

                {/* Survey Kepuasan */}
                {hasSurvey && (
                    <Link
                        href={safeRoute("be.survey.index")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-[15px] group ${
                            isCurrentRoute("be.survey.*")
                                ? "bg-teal-50 dark:bg-slate-800 text-teal-600 dark:text-teal-400"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                    >
                        <Star
                            size={20}
                            strokeWidth={2}
                            className={`shrink-0 ${
                                isCurrentRoute("be.survey.*")
                                    ? "text-teal-600 dark:text-teal-400"
                                    : "text-slate-400 dark:text-slate-500 group-hover:text-teal-500"
                            }`}
                        />
                        <span>Survey Kepuasan</span>
                    </Link>
                )}

                {isSuperAdmin && (
                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={() => toggleMenu("userManagement")}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-[15px] transition-all group ${
                                isCurrentRoute("be.users.*")
                                    ? "text-teal-600 dark:text-teal-400"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Users
                                    size={20}
                                    strokeWidth={2}
                                    className={`shrink-0 ${
                                        isCurrentRoute("be.users.*")
                                            ? "text-teal-600 dark:text-teal-400"
                                            : "text-slate-400 dark:text-slate-500 group-hover:text-teal-500"
                                    }`}
                                />
                                <span>User Management</span>
                            </div>
                            <ChevronDown
                                size={16}
                                className={`transition-transform duration-300 ${
                                    openMenus.userManagement ? "rotate-180" : ""
                                }`}
                            />
                        </button>

                        <div
                            className={`overflow-hidden transition-all duration-300 ${
                                openMenus.userManagement ? "max-h-40" : "max-h-0"
                            }`}
                        >
                            <div className="ml-9 border-slate-100 dark:border-slate-800 mt-1 space-y-1">
                                <Link
                                    href={route("be.users.index")}
                                    className={`block py-2 px-4 text-sm rounded-lg transition-colors ${
                                        isCurrentRoute("be.users.*")
                                            ? "text-teal-600 dark:text-teal-400 font-semibold bg-teal-50/50 dark:bg-slate-800/50"
                                            : "text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
                                    }`}
                                >
                                    User
                                </Link>
                {isSuperAdmin ? (
                    <Link
                        href={route("be.roles.index")}
                        className={`block py-2 px-4 text-sm rounded-lg transition-colors ${
                            isCurrentRoute("be.roles.*")
                                ? "text-teal-600 dark:text-teal-400 font-semibold bg-teal-50/50 dark:bg-slate-800/50"
                                : "text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
                        }`}
                    >
                        Role
                    </Link>
                ) : null}
                            </div>
                        </div>
                    </div>
                )}

                {isAdminLike && (
                    <>
                        <p className="px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-4">
                            Sistem
                        </p>

                        {/* Struktur Organisasi — menu sendiri untuk kabupaten */}
                        {hasStrukturOrganisasi && (
                            <Link
                                href={safeRoute("be.struktur-organisasi.index")}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-[15px] group ${
                                    isCurrentRoute("be.struktur-organisasi.*")
                                        ? "bg-teal-50 dark:bg-slate-800 text-teal-600 dark:text-teal-400"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                }`}
                            >
                                <FileText
                                    size={20}
                                    strokeWidth={2}
                                    className={`shrink-0 ${
                                        isCurrentRoute("be.struktur-organisasi.*")
                                            ? "text-teal-600 dark:text-teal-400"
                                            : "text-slate-400 dark:text-slate-500 group-hover:text-teal-500"
                                    }`}
                                />
                                <span>Struktur Organisasi</span>
                            </Link>
                        )}

                        {/* Peta Sebaran Rumah — kabupaten/super-admin */}
                        <Link
                            href={safeRoute("be.peta-sebaran.index")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-[15px] group ${
                                isCurrentRoute("be.peta-sebaran.*")
                                    ? "bg-teal-50 dark:bg-slate-800 text-teal-600 dark:text-teal-400"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                        >
                            <MapIcon
                                size={20}
                                strokeWidth={2}
                                className={`shrink-0 ${
                                    isCurrentRoute("be.peta-sebaran.*")
                                        ? "text-teal-600 dark:text-teal-400"
                                        : "text-slate-400 dark:text-slate-500 group-hover:text-teal-500"
                                }`}
                            />
                            <span>Peta Sebaran</span>
                        </Link>

                        {/* Pengaturan — khusus super-admin (kabupaten tidak punya isi lagi) */}
                        {isSuperAdmin && (
                        <div>
                            <button
                                type="button"
                                onClick={() => toggleMenu("settingManagement")}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-[15px] transition-all group ${
                                    isCurrentRoute("be.settings.*") || isCurrentRoute("be.struktur-organisasi.*")
                                        ? "text-teal-600 dark:text-teal-400"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Settings
                                        size={20}
                                        strokeWidth={2}
                                        className={`shrink-0 ${
                                            isCurrentRoute("be.settings.*") || isCurrentRoute("be.struktur-organisasi.*")
                                                ? "text-teal-600 dark:text-teal-400"
                                                : "text-slate-400 dark:text-slate-500 group-hover:text-teal-500"
                                        }`}
                                    />
                                    <span>Pengaturan</span>
                                </div>
                                <ChevronDown
                                    size={16}
                                    className={`transition-transform duration-300 ${
                                        openMenus.settingManagement ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ${
                                    openMenus.settingManagement ? "max-h-96" : "max-h-0"
                                }`}
                            >
                                <div className="ml-9 border-l border-slate-100 dark:border-slate-800 mt-1 pl-2 space-y-1">
                                    {/* Profil & Aplikasi khusus super-admin. */}
                                    {isSuperAdmin && (
                                        <Link
                                            href={route("be.settings.profile")}
                                            className={`block py-2 px-4 text-sm rounded-lg transition-colors ${
                                                isCurrentRoute("be.settings.profile")
                                                    ? "text-teal-600 dark:text-teal-400 font-semibold bg-teal-50/50 dark:bg-slate-800/50"
                                                    : "text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
                                            }`}
                                        >
                                            Profil Saya
                                        </Link>
                                    )}
                                    {isSuperAdmin && (
                                        <Link
                                            href={route("be.settings.app")}
                                            className={`block py-2 px-4 text-sm rounded-lg transition-colors ${
                                                isCurrentRoute("be.settings.app")
                                                    ? "text-teal-600 dark:text-teal-400 font-semibold bg-teal-50/50 dark:bg-slate-800/50"
                                                    : "text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
                                            }`}
                                        >
                                            Aplikasi
                                        </Link>
                                    )}
                                    {isSuperAdmin && routeExists("be.settings.landing") && (
                                        <Link
                                            href={route("be.settings.landing")}
                                            className={`block py-2 px-4 text-sm rounded-lg transition-colors ${
                                                isCurrentRoute("be.settings.landing")
                                                    ? "text-teal-600 dark:text-teal-400 font-semibold bg-teal-50/50 dark:bg-slate-800/50"
                                                    : "text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400"
                                            }`}
                                        >
                                            Landing Page
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                        )}
                    </>
                )}

                {isSuperAdmin && (
                    <>
                        <p className="px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-4">
                            Super Admin
                        </p>
                        <div className="space-y-1">
                            {hasBackup && (
                                <Link
                                    href={route("be.backup.index")}
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                        isCurrentRoute("be.backup.*")
                                            ? "bg-teal-50 dark:bg-slate-800 text-teal-600 dark:text-teal-400"
                                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    }`}
                                >
                                    <Database size={18} />
                                    <span>Backup Database</span>
                                </Link>
                            )}
                            {hasActivityLogs && (
                                <Link
                                    href={route("be.activity-logs.index")}
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                        isCurrentRoute("be.activity-logs.*")
                                            ? "bg-teal-50 dark:bg-slate-800 text-teal-600 dark:text-teal-400"
                                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    }`}
                                >
                                    <ScrollText size={18} />
                                    <span>Log Aktivitas</span>
                                </Link>
                            )}
                            {hasSystem && (
                                <Link
                                    href={route("be.system.index")}
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                        isCurrentRoute("be.system.*")
                                            ? "bg-teal-50 dark:bg-slate-800 text-teal-600 dark:text-teal-400"
                                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                    }`}
                                >
                                    <Activity size={18} />
                                    <span>Kesehatan Sistem</span>
                                </Link>
                            )}
                        </div>
                    </>
                )}
            </nav>

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
                                href={route("fe.beranda")}
                                className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            >
                                <Home size={16} />
                                Halaman Depan
                            </Link>

                            {permissions.includes("settings.profile") && (
                                <Link
                                    href={route("be.settings.profile")}
                                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                >
                                    <User size={16} />
                                    Profil Saya
                                </Link>
                            )}
                            <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>

                            <Link
                                href={route("logout")}
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
    );
}
