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
    Users,
    Mail,
    Info,
    ChevronDown,
    FileText,
    User,
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
    const [isProgramDropdownOpen, setIsProgramDropdownOpen] = useState(false);
    const [isProfilDropdownOpen, setIsProfilDropdownOpen] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsProgramDropdownOpen(false);
        setIsProfilDropdownOpen(false);
    }, [usePage().url]);

    const navLinks = [
        { name: "Beranda", href: route("fe.beranda"), icon: Home },
        {
            name: "Profil",
            href: "#",
            icon: User,
            submenu: [
                { name: "Sejarah", href: "#", icon: FileText },
                { name: "Tugas Pokok dan Fungsi", href: "#", icon: Award },
                { name: "Visi & Misi", href: "#", icon: BookOpen },
                { name: "Struktur Organisasi", href: "#", icon: Building2 },
                { name: "Ketentuan Seragam", href: "#", icon: Shirt },
            ]
        },
        {
            name: "Program",
            href: "#",
            icon: BookOpen,
            submenu: [
                { name: "Program Kerja", href: "#", icon: Briefcase },
                { name: "Galeri Kegiatan", href: "#", icon: Image },
                { name: "Mars PKK", href: "#", icon: Music },
                { name: "Dokumen", href: "#", icon: FolderOpen },
            ]
        },
        { name: "Berita", href: "#", icon: Calendar },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? "bg-white/95 backdrop-blur-md shadow-sm shadow-teal-900/5 border-b border-teal-100/50"
                    : "bg-white/80 backdrop-blur-sm border-b border-slate-100"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14">
                    <Link href={route("fe.beranda")} className="flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <img
                                src="/assets/logo/logotasik.png"
                                alt="Logo Kab. Tasikmalaya"
                                className="h-9 w-auto drop-shadow-sm transition-all duration-300 hover:scale-105"
                            />
                            <div className="flex flex-col leading-tight">
                                <span className="text-lg font-extrabold text-teal-700 tracking-tight">PKK</span>
                                <span className="text-[9px] font-medium text-slate-500 tracking-wider uppercase">Kab. Tasikmalaya</span>
                            </div>
                        </div>
                    </Link>

                    <div className="hidden lg:flex items-center gap-1 ml-auto">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const hasSubmenu = link.submenu && link.submenu.length > 0;

                            return (
                                <div key={link.name} className="relative group">
                                    <Link
                                        href={link.href}
                                        className={`flex items-center gap-1.5 px-3 py-2 text-[14px] font-medium text-slate-600 hover:text-teal-600 transition-all duration-200 rounded-full hover:bg-teal-50 ${
                                            hasSubmenu ? "cursor-pointer" : ""
                                        }`}
                                    >
                                        <Icon size={18} className="text-slate-400 group-hover:text-teal-500 transition-colors" />
                                        <span>{link.name}</span>
                                        {hasSubmenu && (
                                            <ChevronDown size={14} className="text-slate-400 group-hover:text-teal-500 transition-transform group-hover:rotate-180" />
                                        )}
                                    </Link>

                                    {hasSubmenu && (
                                        <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg shadow-teal-900/10 border border-teal-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-left scale-95 group-hover:scale-100">
                                            <div className="py-1.5">
                                                {link.submenu.map((sub) => {
                                                    const SubIcon = sub.icon;
                                                    return (
                                                        <Link
                                                            key={sub.name}
                                                            href={sub.href}
                                                            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:text-teal-600 hover:bg-teal-50 transition-colors"
                                                        >
                                                            <SubIcon size={15} className="text-slate-400" />
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

                    <div className="flex items-center gap-2 ml-4">
                        <div className="hidden sm:block">
                            {auth.user ? (
                                <Link href={route("be.dashboard")} className="inline-flex items-center justify-center gap-1.5 px-5 py-2 text-sm font-semibold text-white transition-all duration-200 bg-teal-600 rounded-full hover:bg-teal-700 shadow-md shadow-teal-600/30 hover:shadow-teal-600/40 hover:-translate-y-0.5">
                                    <LayoutDashboard size={16} /> Dashboard
                                </Link>
                            ) : (
                                <Link href={route("login")} className="inline-flex items-center justify-center gap-1.5 px-5 py-2 text-sm font-semibold text-white transition-all duration-200 bg-[#008080] rounded-full hover:bg-[#006666] shadow-md shadow-teal-600/30 hover:shadow-teal-600/40 hover:-translate-y-0.5">
                                    <LogIn size={16} /> Login
                                </Link>
                            )}
                        </div>
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-1.5 rounded-full text-slate-600 hover:text-teal-600 hover:bg-teal-50 transition-all duration-200">
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="py-3 border-t border-slate-100 space-y-0.5">
                        {navLinks.map((link) => (
                            <div key={link.name}>
                                <Link href={link.href} className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all duration-200">
                                    <div className="flex items-center gap-3">
                                        <link.icon size={18} className="text-slate-400" />
                                        <span>{link.name}</span>
                                    </div>
                                </Link>
                            </div>
                        ))}
                        <div className="pt-2 border-t border-slate-100 mt-2">
                            {auth.user ? (
                                <Link href={route("be.dashboard")} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all duration-200">
                                    <LayoutDashboard size={18} /> Dashboard
                                </Link>
                            ) : (
                                <Link href={route("login")} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-white bg-[#008080] hover:bg-[#006666] rounded-xl transition-all duration-200">
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
