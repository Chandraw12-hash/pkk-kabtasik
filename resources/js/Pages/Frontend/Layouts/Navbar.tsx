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

export default function Navbar() {
    const { auth } = usePage().props as any;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [usePage().url]);

    const navLinks = [
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
            ]
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
            ]
        },
        { name: "Berita", href: route("fe.berita"), icon: Calendar },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? "bg-white/98 backdrop-blur-md shadow-sm border-b border-slate-200"
                    : "bg-white border-b border-slate-100"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href={route("fe.beranda")} className="flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <img
                                src="/assets/logo/logotasik.png"
                                alt="Logo Kab. Tasikmalaya"
                                className="h-9 w-auto"
                            />
                            <div className="flex flex-col leading-tight">
                                <span className="text-base font-bold text-slate-900 tracking-tight">
                                    TP PKK
                                </span>
                                <span className="text-[10px] font-medium text-teal-700 tracking-[0.12em] uppercase">
                                    Kab. Tasikmalaya
                                </span>
                            </div>
                        </div>
                    </Link>

                    <div className="hidden lg:flex items-center gap-0.5 ml-auto">
                        {navLinks.map((link) => {
                            const hasSubmenu = link.submenu && link.submenu.length > 0;

                            return (
                                <div key={link.name} className="relative group">
                                    <Link
                                        href={link.href}
                                        className={`flex items-center gap-1 px-4 py-2 text-[14px] font-medium text-slate-600 hover:text-teal-700 transition-colors duration-200 ${
                                            hasSubmenu ? "cursor-pointer" : ""
                                        }`}
                                    >
                                        <span>{link.name}</span>
                                        {hasSubmenu && (
                                            <ChevronDown size={14} className="text-slate-400 group-hover:text-teal-600 transition-transform duration-200 group-hover:rotate-180" />
                                        )}
                                    </Link>

                                    {/* Garis bawah halus saat hover, tanpa background block */}
                                    <span className="absolute left-4 right-4 -bottom-px h-px bg-teal-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center" />

                                    {hasSubmenu && (
                                        <div className="absolute left-0 mt-1 w-60 bg-white rounded-lg shadow-lg shadow-slate-900/10 border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-left translate-y-1 group-hover:translate-y-0">
                                            <div className="py-2">
                                                {link.submenu.map((sub) => {
                                                    const SubIcon = sub.icon;
                                                    return (
                                                        <Link
                                                            key={sub.name}
                                                            href={sub.href}
                                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:text-teal-700 hover:bg-slate-50 transition-colors"
                                                        >
                                                            <SubIcon size={15} className="text-slate-400 flex-shrink-0" />
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

                    <div className="flex items-center gap-3 ml-6">
                        <div className="hidden sm:block">
                            {auth.user ? (
                                <Link
                                    href={route("be.dashboard")}
                                    className="inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-md transition-colors duration-200"
                                >
                                    <LayoutDashboard size={16} /> Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={route("login")}
                                    className="inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-md transition-colors duration-200"
                                >
                                    <LogIn size={16} /> Login
                                </Link>
                            )}
                        </div>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Buka menu navigasi"
                            className="lg:hidden p-2 rounded-md text-slate-600 hover:text-teal-700 hover:bg-slate-50 transition-colors duration-200"
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="py-3 border-t border-slate-100 space-y-0.5">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-teal-700 hover:bg-slate-50 rounded-md transition-colors duration-200"
                            >
                                <link.icon size={18} className="text-slate-400" />
                                <span>{link.name}</span>
                            </Link>
                        ))}
                        <div className="pt-2 mt-2 border-t border-slate-100">
                            {auth.user ? (
                                <Link
                                    href={route("be.dashboard")}
                                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-md transition-colors duration-200"
                                >
                                    <LayoutDashboard size={18} /> Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={route("login")}
                                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-md transition-colors duration-200"
                                >
                                    <LogIn size={18} /> Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
