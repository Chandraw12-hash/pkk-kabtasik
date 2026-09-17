import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    LogIn,
    LayoutDashboard,
    Menu,
    X,
    Home,
    BookOpen,
    Calendar,
    User,
    ChevronDown,
    FileText,
    Award,
    Building2,
    Shirt,
    Image,
    Music,
    FolderOpen,
    Briefcase,
} from "lucide-react";

type SubLink = {
    name: string;
    href: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
};

type NavLink = {
    name: string;
    href: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    submenu?: SubLink[];
};

export default function Navbar() {
    const { auth } = usePage().props as any;
    const currentUrl = usePage().url;

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);

    // ⭐ Cek apakah lagi di halaman Beranda
    const isHomePage = currentUrl === "/" || currentUrl === route("fe.beranda");

    // Navbar transparan HANYA di homepage + belum discroll
    const isTransparent = isHomePage && !isScrolled;

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setOpenMobileSubmenu(null);
    }, [currentUrl]);

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isMobileMenuOpen]);

    const navLinks: NavLink[] = [
        { name: "Beranda", href: route("fe.beranda"), icon: Home },
        {
            name: "Profil",
            href: "#",
            icon: User,
            submenu: [
                { name: "Sejarah", href: route("fe.profil.sejarah"), icon: FileText },
                { name: "Tugas Pokok dan Fungsi", href: route("fe.profil.tugasFungsi"), icon: Award },
                { name: "Visi & Misi", href: route("fe.profil.visiMisi"), icon: BookOpen },
                { name: "Struktur Organisasi", href: route("fe.profil.strukturOrganisasi"), icon: Building2 },
                { name: "Ketentuan Seragam", href: route("fe.profil.ketentuanSeragam"), icon: Shirt },
            ],
        },
        {
            name: "Program",
            href: "#",
            icon: BookOpen,
            submenu: [
                { name: "Program Kerja", href: route("fe.program.programKerja"), icon: Briefcase },
                { name: "Galeri Kegiatan", href: route("fe.program.galeriKegiatan"), icon: Image },
                { name: "Mars PKK", href: route("fe.program.marsPkk"), icon: Music },
                { name: "Dokumen", href: route("fe.program.dokumen"), icon: FolderOpen },
            ],
        },
        { name: "Berita", href: route("fe.berita"), icon: Calendar },
    ];

    const toggleMobileSubmenu = (name: string) => {
        setOpenMobileSubmenu((prev) => (prev === name ? null : name));
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                !isTransparent
                    ? "bg-white/98 backdrop-blur-md shadow-sm border-b border-slate-200"
                    : "bg-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative flex justify-between items-center h-14 sm:h-16">
                    {/* Logo */}
                    <Link
                        href={route("fe.beranda")}
                        className="flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC72C] rounded-lg"
                    >
                        <div className="flex items-center gap-2.5 sm:gap-3">
                            <img
                                src="/assets/logo/logotasik.png"
                                alt="Logo PKK Kab. Tasikmalaya"
                                className="h-8 sm:h-9 w-auto"
                            />
                            <div className="flex flex-col leading-tight">
                                <span
                                    className={`text-sm sm:text-base font-bold tracking-tight transition-colors duration-300 ${
                                        !isTransparent ? "text-slate-900" : "text-white"
                                    }`}
                                >
                                    TP PKK
                                </span>
                                <span
                                    className={`text-[9px] sm:text-[10px] font-medium tracking-[0.1em] uppercase transition-colors duration-300 ${
                                        !isTransparent ? "text-[#0072BC]" : "text-[#FFC72C]"
                                    }`}
                                >
                                    Kab. Tasikmalaya
                                </span>
                            </div>
                        </div>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden lg:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
                        {navLinks.map((link) => {
                            const hasSubmenu = link.submenu && link.submenu.length > 0;

                            return (
                                <div key={link.name} className="relative group">
                                    {hasSubmenu ? (
                                        <button
                                            type="button"
                                            className={`flex items-center gap-1 px-4 py-2 text-[14px] font-medium transition-colors duration-300 ${
                                                !isTransparent
                                                    ? "text-slate-600 hover:text-[#0072BC]"
                                                    : "text-white/90 hover:text-white"
                                            }`}
                                        >
                                            <span>{link.name}</span>
                                            <ChevronDown
                                                size={14}
                                                className={`transition-transform duration-200 group-hover:rotate-180 ${
                                                    !isTransparent
                                                        ? "text-slate-400 group-hover:text-[#FFC72C]"
                                                        : "text-white/60 group-hover:text-white"
                                                }`}
                                            />
                                        </button>
                                    ) : (
                                        <Link
                                            href={link.href}
                                            className={`flex items-center gap-1 px-4 py-2 text-[14px] font-medium transition-colors duration-300 ${
                                                !isTransparent
                                                    ? "text-slate-600 hover:text-[#0072BC]"
                                                    : "text-white/90 hover:text-white"
                                            }`}
                                        >
                                            <span>{link.name}</span>
                                        </Link>
                                    )}

                                    <span
                                        className={`absolute left-4 right-4 -bottom-px h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center ${
                                            !isTransparent ? "bg-[#0072BC]" : "bg-white"
                                        }`}
                                    />

                                    {hasSubmenu && (
                                        <div className="absolute left-0 mt-1 w-64 bg-white rounded-lg shadow-lg shadow-slate-900/10 border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                                            <div className="py-2">
                                                {link.submenu!.map((sub) => {
                                                    const SubIcon = sub.icon;
                                                    return (
                                                        <Link
                                                            key={sub.name}
                                                            href={sub.href}
                                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:text-[#0072BC] hover:bg-slate-50 transition-colors"
                                                        >
                                                            <SubIcon
                                                                size={15}
                                                                className="text-slate-400 flex-shrink-0"
                                                            />
                                                            <span>{sub.name}</span>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Desktop login + mobile toggle */}
                    <div className="flex items-center gap-2 sm:gap-3 ml-2 sm:ml-6">
                        <div className="hidden sm:block">
                            {auth?.user ? (
                                <Link
                                    href={route("be.dashboard")}
                                    className={`inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-300 ${
                                        !isTransparent
                                            ? "text-white bg-[#0072BC] hover:bg-[#FFC72C]"
                                            : "text-[#0072BC] bg-white hover:bg-slate-50"
                                    }`}
                                >
                                    <LayoutDashboard size={16} />
                                    Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={route("login")}
                                    className={`inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-300 ${
                                        !isTransparent
                                            ? "text-white bg-[#0072BC] hover:bg-[#FFC72C]"
                                            : "text-[#0072BC] bg-white hover:bg-slate-50"
                                    }`}
                                >
                                    <LogIn size={16} />
                                    Login
                                </Link>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label={isMobileMenuOpen ? "Tutup menu" : "Buka menu"}
                            className={`lg:hidden p-2.5 rounded-lg transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC72C] ${
                                !isTransparent
                                    ? "text-slate-600 hover:text-[#0072BC]"
                                    : "text-white/80 hover:text-white"
                            }`}
                        >
                            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 top-14 sm:top-16 bg-slate-900/40 z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile panel */}
            <div
                className={`lg:hidden fixed top-14 sm:top-16 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-lg transition-all duration-300 ease-out ${
                    isMobileMenuOpen
                        ? "opacity-100 translate-y-0 visible"
                        : "opacity-0 -translate-y-2 invisible pointer-events-none"
                }`}
            >
                <div className="max-h-[calc(100vh-3.5rem)] sm:max-h-[calc(100vh-4rem)] overflow-y-auto px-4 py-3 space-y-1">
                    {navLinks.map((link) => {
                        const hasSubmenu = link.submenu && link.submenu.length > 0;
                        const isOpen = openMobileSubmenu === link.name;
                        const Icon = link.icon;

                        if (!hasSubmenu) {
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="flex items-center gap-3 min-h-[48px] px-3 py-2.5 text-[15px] font-medium text-slate-700 hover:text-[#0072BC] hover:bg-slate-50 rounded-xl transition-colors"
                                >
                                    <Icon size={18} className="text-slate-400 flex-shrink-0" />
                                    <span>{link.name}</span>
                                </Link>
                            );
                        }

                        return (
                            <div key={link.name} className="rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => toggleMobileSubmenu(link.name)}
                                    aria-expanded={isOpen}
                                    className="w-full flex items-center justify-between min-h-[48px] px-3 py-2.5 text-[15px] font-medium text-slate-700 hover:text-[#0072BC] hover:bg-slate-50 rounded-xl transition-colors"
                                >
                                    <span className="flex items-center gap-3">
                                        <Icon size={18} className="text-slate-400 flex-shrink-0" />
                                        {link.name}
                                    </span>
                                    <ChevronDown
                                        size={16}
                                        className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                    />
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-200 ${
                                        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                                    }`}
                                >
                                    <div className="ml-3 pl-3 border-l border-slate-200 space-y-0.5 py-1 mb-1">
                                        {link.submenu!.map((sub) => {
                                            const SubIcon = sub.icon;
                                            return (
                                                <Link
                                                    key={sub.name}
                                                    href={sub.href}
                                                    className="flex items-center gap-3 min-h-[44px] px-3 py-2 text-sm text-slate-600 hover:text-[#0072BC] hover:bg-slate-50 rounded-lg transition-colors"
                                                >
                                                    <SubIcon size={15} className="text-slate-400 flex-shrink-0" />
                                                    <span>{sub.name}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Login di mobile */}
                    <div className="pt-3 mt-2 border-t border-slate-100">
                        {auth?.user ? (
                            <Link
                                href={route("be.dashboard")}
                                className="flex items-center justify-center gap-2 min-h-[48px] px-4 py-3 text-[15px] font-semibold text-white bg-[#0072BC] hover:bg-[#FFC72C] rounded-xl transition-colors"
                            >
                                <LayoutDashboard size={18} />
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={route("login")}
                                className="flex items-center justify-center gap-2 min-h-[48px] px-4 py-3 text-[15px] font-semibold text-white bg-[#0072BC] hover:bg-[#FFC72C] rounded-xl transition-colors"
                            >
                                <LogIn size={18} />
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
