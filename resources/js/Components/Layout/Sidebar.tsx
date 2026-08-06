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
    [key: string]: unknown;
}

declare function route(name?: string, params?: unknown): any;

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
    const isCurrentRoute = (name: string) => {
        try {
            return typeof route === "function" && route().current(name);
        } catch {
            return false;
        }
    };

    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
        pokjaManagement:
            isCurrentRoute("be.sekretariat.*") ||
            isCurrentRoute("be.pokja1.*") ||
            isCurrentRoute("be.pokja2.*") ||
            isCurrentRoute("be.pokja3.*") ||
            isCurrentRoute("be.pokja4.*"),
        userManagement:
            isCurrentRoute("be.users.*") || isCurrentRoute("be.roles.*"),
        settingManagement: isCurrentRoute("be.settings.*"),
    });

    const toggleMenu = (menuName: string) => {
        setOpenMenus((prev) => ({ ...prev, [menuName]: !prev[menuName] }));
    };

    const { app_settings, auth } = usePage<SharedProps>().props;
    const user = auth?.user;
    const roles = auth?.roles || [];
    const permissions = auth?.permissions || [];
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
            {/* Logo & Close Button (Mobile Only) */}
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

            {/* Menu Navigasi */}
            <nav className="flex-1 px-3 overflow-y-auto space-y-1 custom-scrollbar pb-6">
                <p className="px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Main Menu
                </p>

                {/* Dashboard */}
                <Link
                    href={route("be.dashboard")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-[15px] group
                        ${
                            isCurrentRoute("be.dashboard")
                                ? "bg-brand-green-50 dark:bg-slate-800 text-brand-green-600 dark:text-brand-green-400"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                >
                    <LayoutDashboard
                        size={20}
                        strokeWidth={2}
                        className={`shrink-0 ${
                            isCurrentRoute("be.dashboard")
                                ? "text-brand-green-600 dark:text-brand-green-400"
                                : "text-slate-400 dark:text-slate-500 group-hover:text-brand-green-500"
                        }`}
                    />
                    <span>Dashboard</span>
                </Link>

                <p className="px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-4">
                    Master Data
                </p>

                {/* Data Kader */}
                {permissions.includes("view-kader") && (
                    <Link
                        href={route("be.kader.index")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-[15px] group
                        ${
                            isCurrentRoute("be.kader.*")
                                ? "bg-brand-green-50 dark:bg-slate-800 text-brand-green-600 dark:text-brand-green-400"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                    >
                        <Users
                            size={20}
                            strokeWidth={2}
                            className={`shrink-0 ${
                                isCurrentRoute("be.kader.*")
                                    ? "text-brand-green-600 dark:text-brand-green-400"
                                    : "text-slate-400 dark:text-slate-500 group-hover:text-brand-green-500"
                            }`}
                        />
                        <span>Data Kader</span>
                    </Link>
                )}

                {/* Manajemen Data Pokja & Sekretariat (Dropdown Terpadu) */}
                <div className="mt-2">
                    <button
                        onClick={() => toggleMenu("pokjaManagement")}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-[15px] transition-all group
                        ${
                            isCurrentRoute("be.sekretariat.*") ||
                            isCurrentRoute("be.pokja1.*") ||
                            isCurrentRoute("be.pokja2.*") ||
                            isCurrentRoute("be.pokja3.*") ||
                            isCurrentRoute("be.pokja4.*")
                                ? "text-brand-green-600 dark:text-brand-green-400"
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
                                        ? "text-brand-green-600 dark:text-brand-green-400"
                                        : "text-slate-400 dark:text-slate-500 group-hover:text-brand-green-500"
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
                            openMenus.pokjaManagement
                                ? "max-h-96"
                                : "max-h-0"
                        }`}
                    >
                        <div className="ml-9 border-l border-slate-100 dark:border-slate-800 mt-1 pl-2 space-y-1">
                            {/* Sekretariat */}
                            <Link
                                href={route("be.sekretariat.index")}
                                className={`flex items-center gap-2.5 py-2 px-3 text-sm rounded-lg transition-colors ${
                                    isCurrentRoute("be.sekretariat.*")
                                        ? "text-brand-green-600 dark:text-brand-green-400 font-semibold bg-brand-green-50/50 dark:bg-slate-800/50"
                                        : "text-slate-500 dark:text-slate-400 hover:text-brand-green-600 dark:hover:text-brand-green-400"
                                }`}
                            >
                                <FileText size={16} />
                                <span>Sekretariat</span>
                            </Link>

                            {/* Pokja I */}
                            <Link
                                href={route("be.pokja1.index")}
                                className={`flex items-center gap-2.5 py-2 px-3 text-sm rounded-lg transition-colors ${
                                    isCurrentRoute("be.pokja1.*")
                                        ? "text-brand-green-600 dark:text-brand-green-400 font-semibold bg-brand-green-50/50 dark:bg-slate-800/50"
                                        : "text-slate-500 dark:text-slate-400 hover:text-brand-green-600 dark:hover:text-brand-green-400"
                                }`}
                            >
                                <HeartHandshake size={16} />
                                <span>Pokja I</span>
                            </Link>

                            {/* Pokja II */}
                            <Link
                                href={route("be.pokja2.index")}
                                className={`flex items-center gap-2.5 py-2 px-3 text-sm rounded-lg transition-colors ${
                                    isCurrentRoute("be.pokja2.*")
                                        ? "text-brand-green-600 dark:text-brand-green-400 font-semibold bg-brand-green-50/50 dark:bg-slate-800/50"
                                        : "text-slate-500 dark:text-slate-400 hover:text-brand-green-600 dark:hover:text-brand-green-400"
                                }`}
                            >
                                <BookOpen size={16} />
                                <span>Pokja II</span>
                            </Link>

                            {/* Pokja III */}
                            <Link
                                href={route("be.pokja3.index")}
                                className={`flex items-center gap-2.5 py-2 px-3 text-sm rounded-lg transition-colors ${
                                    isCurrentRoute("be.pokja3.*")
                                        ? "text-brand-green-600 dark:text-brand-green-400 font-semibold bg-brand-green-50/50 dark:bg-slate-800/50"
                                        : "text-slate-500 dark:text-slate-400 hover:text-brand-green-600 dark:hover:text-brand-green-400"
                                }`}
                            >
                                <HomeIcon size={16} />
                                <span>Pokja III</span>
                            </Link>

                            {/* Pokja IV */}
                            <Link
                                href={route("be.pokja4.index")}
                                className={`flex items-center gap-2.5 py-2 px-3 text-sm rounded-lg transition-colors ${
                                    isCurrentRoute("be.pokja4.*")
                                        ? "text-brand-green-600 dark:text-brand-green-400 font-semibold bg-brand-green-50/50 dark:bg-slate-800/50"
                                        : "text-slate-500 dark:text-slate-400 hover:text-brand-green-600 dark:hover:text-brand-green-400"
                                }`}
                            >
                                <Activity size={16} />
                                <span>Pokja IV</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Manajemen Konten (Galeri & Berita) */}
                <p className="px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-4">
                    Manajemen Konten
                </p>

                {/* Galeri Kegiatan */}
                <Link
                    href={route("be.galeri.index")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-[15px] group
                    ${
                        isCurrentRoute("be.galeri.*")
                            ? "bg-brand-green-50 dark:bg-slate-800 text-brand-green-600 dark:text-brand-green-400"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                >
                    <ImageLucide
                        size={20}
                        strokeWidth={2}
                        className={`shrink-0 ${
                            isCurrentRoute("be.galeri.*")
                                ? "text-brand-green-600 dark:text-brand-green-400"
                                : "text-slate-400 dark:text-slate-500 group-hover:text-brand-green-500"
                        }`}
                    />
                    <span>Galeri Kegiatan</span>
                </Link>

                {/* Berita & Informasi */}
                <Link
                    href={route("be.berita.index")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-[15px] group
                    ${
                        isCurrentRoute("be.berita.*")
                            ? "bg-brand-green-50 dark:bg-slate-800 text-brand-green-600 dark:text-brand-green-400"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                >
                    <Newspaper
                        size={20}
                        strokeWidth={2}
                        className={`shrink-0 ${
                            isCurrentRoute("be.berita.*")
                                ? "text-brand-green-600 dark:text-brand-green-400"
                                : "text-slate-400 dark:text-slate-500 group-hover:text-brand-green-500"
                        }`}
                    />
                    <span>Berita & Informasi</span>
                </Link>

                {/* User Management */}
                {permissions.includes("view-users") && (
                    <div className="mt-4">
                        <button
                            onClick={() => toggleMenu("userManagement")}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-[15px] transition-all group
                            ${
                                isCurrentRoute("be.users.*")
                                    ? "text-brand-green-600 dark:text-brand-green-400"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Users
                                    size={20}
                                    strokeWidth={2}
                                    className={`shrink-0 ${
                                        isCurrentRoute("be.users.*")
                                            ? "text-brand-green-600 dark:text-brand-green-400"
                                            : "text-slate-400 dark:text-slate-500 group-hover:text-brand-green-500"
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
                                openMenus.userManagement
                                    ? "max-h-40"
                                    : "max-h-0"
                            }`}
                        >
                            <div className="ml-9 border-slate-100 dark:border-slate-800 mt-1 space-y-1">
                                <Link
                                    href={route("be.users.index")}
                                    className={`block py-2 px-4 text-sm rounded-lg transition-colors ${
                                        isCurrentRoute("be.users.*")
                                            ? "text-brand-green-600 dark:text-brand-green-400 font-semibold bg-brand-green-50/50 dark:bg-slate-800/50"
                                            : "text-slate-500 dark:text-slate-400 hover:text-brand-green-600 dark:hover:text-brand-green-400"
                                    }`}
                                >
                                    User
                                </Link>
                                {permissions.includes("manage-roles") && (
                                    <Link
                                        href={route("be.roles.index")}
                                        className={`block py-2 px-4 text-sm rounded-lg transition-colors ${
                                            isCurrentRoute("be.roles.*")
                                                ? "text-brand-green-600 dark:text-brand-green-400 font-semibold bg-brand-green-50/50 dark:bg-slate-800/50"
                                                : "text-slate-500 dark:text-slate-400 hover:text-brand-green-600 dark:hover:text-brand-green-400"
                                        }`}
                                    >
                                        Role
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {roles.includes("admin") && (
                    <>
                        <p className="px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-4">
                            Sistem
                        </p>

                        <div>
                            <button
                                onClick={() => toggleMenu("settingManagement")}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-[15px] transition-all group
                                ${
                                    isCurrentRoute("be.settings.*")
                                        ? "text-brand-green-600 dark:text-brand-green-400"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Settings
                                        size={20}
                                        strokeWidth={2}
                                        className={`shrink-0 ${
                                            isCurrentRoute("be.settings.*")
                                                ? "text-brand-green-600 dark:text-brand-green-400"
                                                : "text-slate-400 dark:text-slate-500 group-hover:text-brand-green-500"
                                        }`}
                                    />
                                    <span>Pengaturan</span>
                                </div>
                                <ChevronDown
                                    size={16}
                                    className={`transition-transform duration-300 ${
                                        openMenus.settingManagement
                                            ? "rotate-180"
                                            : ""
                                    }`}
                                />
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ${
                                    openMenus.settingManagement
                                        ? "max-h-40"
                                        : "max-h-0"
                                }`}
                            >
                                <div className="ml-9 border-slate-100 dark:border-slate-800 mt-1 space-y-1">
                                    <Link
                                        href={route("be.settings.profile")}
                                        className={`block py-2 px-4 text-sm rounded-lg transition-colors ${
                                            isCurrentRoute(
                                                "be.settings.profile"
                                            )
                                                ? "text-brand-green-600 dark:text-brand-green-400 font-semibold bg-brand-green-50/50 dark:bg-slate-800/50"
                                                : "text-slate-500 dark:text-slate-400 hover:text-brand-green-600 dark:hover:text-brand-green-400"
                                        }`}
                                    >
                                        Profil Saya
                                    </Link>
                                    <Link
                                        href={route("be.settings.app")}
                                        className={`block py-2 px-4 text-sm rounded-lg transition-colors ${
                                            isCurrentRoute("be.settings.app")
                                                ? "text-brand-green-600 dark:text-brand-green-400 font-semibold bg-brand-green-50/50 dark:bg-slate-800/50"
                                                : "text-slate-500 dark:text-slate-400 hover:text-brand-green-600 dark:hover:text-brand-green-400"
                                        }`}
                                    >
                                        Aplikasi
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </nav>

            {/* User Profile Footer */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
                <div ref={dropdownRef} className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group cursor-pointer"
                    >
                        <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                            <div className="w-9 h-9 shrink-0 rounded-full bg-brand-green-100 dark:bg-brand-green-900/50 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-brand-green-600 dark:text-brand-green-400 font-bold overflow-hidden shadow-sm">
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
                                onClick={toggleTheme}
                                className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            >
                                <span className="flex items-center gap-2.5">
                                    {isDarkMode ? (
                                        <Sun size={16} />
                                    ) : (
                                        <Moon size={16} />
                                    )}
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
