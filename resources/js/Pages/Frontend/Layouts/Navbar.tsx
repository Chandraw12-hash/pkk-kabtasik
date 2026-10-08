import React, { useEffect, useState } from "react";
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
    icon: React.ComponentType<{
        size?: number;
        className?: string;
    }>;
};

type NavLink = {
    name: string;
    href: string;
    icon: React.ComponentType<{
        size?: number;
        className?: string;
    }>;
    submenu?: SubLink[];
};

const bentukItems = [
    "Bintang",
    "17 butir kapas, 8 simpul pengikat dan 45 butir padi",
    "Akolade melingkar",
    "Rangkaian mata rantai",
    "Lingkaran putih dengan tulisan Pemberdayaan dan Kesejahteraan Keluarga, berwarna hitam",
    "10 buah ujung tombak yang tersusun merupakan bunga",
];

const warnaKuningItems = [
    "Gambar Bintang",
    "Gambar Padi",
    "Gambar Rantai",
    "Gambar Kelopak Bunga Kapas",
    "Gambar Tangkai Padi dan Tangkai Kapas",
    "Gambar Akolade Segilima",
];

const putihPerakItems = [
    "Gambar 10 ujung tombak dalam lingkaran paling dalam",
    "Gambar akolade melingkar",
    "Gambar bunga kapas",
    "Delapan simpul pengikat tangkai padi dan kapas",
];

const putihKapasItems = [
    "Lingkaran sebagai dasar tulisan “Pemberdayaan dan Kesejahteraan Keluarga”",
    "Bunga kapas khusus yang dicetak pada logam",
];

const artiWarna = [
    {
        title: "1) Biru",
        text: "Melambangkan suasana damai, aman, tenteram dan sejahtera.",
        dot: "bg-[#0072BC]",
    },
    {
        title: "2) Putih",
        text: "Melambangkan kesucian dan ketulusan untuk suatu tujuan dan itikad.",
        dot: "bg-white border border-slate-300",
    },
    {
        title: "3) Kuning",
        text: "Melambangkan keagungan cita-cita.",
        dot: "bg-[#D4A017]",
    },
    {
        title: "4) Hitam",
        text: "Melambangkan kekekalan/keabadian.",
        dot: "bg-slate-900",
    },
];

const artiKomponen = [
    {
        title: "1) Segi lima",
        text: "Melambangkan Pancasila sebagai dasar/asas Gerakan PKK.",
    },
    {
        title: "2) Bintang",
        text: "Melambangkan Ketuhanan Yang Maha Esa.",
    },
    {
        title: "3) 17 butir kapas, 8 buah simpul pengikat, 45 butir padi",
        text: "Melambangkan kemerdekaan RI dan kemakmuran.",
    },
    {
        title: "4) Akolade melingkar",
        text: "Melambangkan wahana partisipasi masyarakat dalam pembangunan yang memadukan pelaksanaan segala kegiatan dan prakarsa serta swadaya gotong royong masyarakat dalam segala aspek kehidupan dan penghidupan untuk mewujudkan Negara Kesatuan Republik Indonesia.",
    },
    {
        title: "5) Rangkaian Mata Rantai",
        text: "Melambangkan masyarakat yang terdiri dari keluarga-keluarga sebagai unit terkecil yang merupakan sasaran Gerakan PKK.",
    },
    {
        title: "6) Lingkaran Putih",
        text: "Melambangkan Pembinaan Kesejahteraan Keluarga dilaksanakan secara terus menerus dan berkesinambungan.",
    },
    {
        title: "7) 10 buah ujung tombak yang tersusun merupakan bunga",
        text: "Melambangkan gerakan masyarakat dalam pembangunan dengan melaksanakan 10 Program Pokok PKK dan sasarannya keluarga sebagai unit terkecil dalam masyarakat.",
    },
];

export default function Navbar() {
    const { auth } = usePage().props as any;
    const currentUrl = usePage().url;

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [openMobileSubmenu, setOpenMobileSubmenu] =
        useState<string | null>(null);
    const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

    const isHomePage =
        currentUrl === "/" || currentUrl === route("fe.beranda");

    const isBeritaPage = /^\/berita\/.+/.test(currentUrl);

    const isTransparent =
        (isHomePage || isBeritaPage) && !isScrolled;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setOpenMobileSubmenu(null);
    }, [currentUrl]);

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen
            ? "hidden"
            : "";

        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsLogoModalOpen(false);
            }
        };

        if (isLogoModalOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);

            if (isLogoModalOpen) {
                document.body.style.overflow = "";
            }
        };
    }, [isLogoModalOpen]);

    const navLinks: NavLink[] = [
        {
            name: "Beranda",
            href: route("fe.beranda"),
            icon: Home,
        },
        {
            name: "Profil",
            href: "#",
            icon: User,
            submenu: [
                {
                    name: "Sejarah",
                    href: route("fe.profil.sejarah"),
                    icon: FileText,
                },
                {
                    name: "Tugas Pokok dan Fungsi",
                    href: route("fe.profil.tugasFungsi"),
                    icon: Award,
                },
                {
                    name: "Visi & Misi",
                    href: route("fe.profil.visiMisi"),
                    icon: BookOpen,
                },
                {
                    name: "Struktur Organisasi",
                    href: route("fe.profil.strukturOrganisasi"),
                    icon: Building2,
                },
                {
                    name: "Ketentuan Seragam",
                    href: route("fe.profil.ketentuanSeragam"),
                    icon: Shirt,
                },
            ],
        },
        {
            name: "Program",
            href: "#",
            icon: BookOpen,
            submenu: [
                {
                    name: "Program Kerja",
                    href: route("fe.program.programKerja"),
                    icon: Briefcase,
                },
                {
                    name: "Galeri Kegiatan",
                    href: route("fe.program.galeriKegiatan"),
                    icon: Image,
                },
                {
                    name: "Mars PKK",
                    href: route("fe.program.marsPkk"),
                    icon: Music,
                },
                {
                    name: "Dokumen",
                    href: route("fe.program.dokumen"),
                    icon: FolderOpen,
                },
            ],
        },
        {
            name: "Berita",
            href: route("fe.berita"),
            icon: Calendar,
        },
    ];

    const toggleMobileSubmenu = (name: string) => {
        setOpenMobileSubmenu((prev) =>
            prev === name ? null : name
        );
    };

    return (
        <>
            {/* =====================================================
                NAVBAR
            ====================================================== */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    !isTransparent
                        ? "bg-[#0072BC]/98 backdrop-blur-md shadow-md border-b border-[#005A94]"
                        : "bg-transparent"
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative flex justify-between items-center h-14 sm:h-16">

                        {/* LOGO */}
                        <button
                            type="button"
                            onClick={() => setIsLogoModalOpen(true)}
                            aria-label="Lihat informasi lambang TP PKK"
                            className="flex-shrink-0 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC72C]"
                        >
                            <div className="flex items-center gap-2.5 sm:gap-3">
                                <img
                                    src="/assets/logo/logotasik.png"
                                    alt="Logo TP PKK Kabupaten Tasikmalaya"
                                    className="h-8 sm:h-9 w-auto"
                                />

                                <div className="flex flex-col leading-tight text-left">
                                    <span className="text-sm sm:text-base font-bold tracking-tight text-white">
                                        TP PKK
                                    </span>

                                    <span className="text-[9px] sm:text-[10px] font-medium tracking-[0.1em] uppercase text-[#FFC72C]">
                                        Kab. Tasikmalaya
                                    </span>
                                </div>
                            </div>
                        </button>

                        {/* DESKTOP NAVIGATION */}
                        <div className="hidden lg:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
                            {navLinks.map((link) => {
                                const hasSubmenu =
                                    link.submenu &&
                                    link.submenu.length > 0;

                                return (
                                    <div
                                        key={link.name}
                                        className="relative group"
                                    >
                                        {hasSubmenu ? (
                                            <button
                                                type="button"
                                                className="flex items-center gap-1 px-4 py-2 text-[14px] font-medium text-white/90 hover:text-white transition-colors duration-300"
                                            >
                                                <span>{link.name}</span>

                                                <ChevronDown
                                                    size={14}
                                                    className="text-white/60 group-hover:text-[#FFC72C] transition-transform duration-200 group-hover:rotate-180"
                                                />
                                            </button>
                                        ) : (
                                            <Link
                                                href={link.href}
                                                className="flex items-center gap-1 px-4 py-2 text-[14px] font-medium text-white/90 hover:text-white transition-colors duration-300"
                                            >
                                                <span>{link.name}</span>
                                            </Link>
                                        )}

                                        <span className="absolute left-4 right-4 -bottom-px h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center bg-[#FFC72C]" />

                                        {hasSubmenu && (
                                            <div className="absolute left-0 mt-1 w-64 bg-white rounded-lg shadow-lg shadow-slate-900/10 border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                                                <div className="py-2">
                                                    {link.submenu!.map(
                                                        (sub) => {
                                                            const SubIcon =
                                                                sub.icon;

                                                            return (
                                                                <Link
                                                                    key={sub.name}
                                                                    href={sub.href}
                                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:text-[#0072BC] hover:bg-[#EAF3FA] transition-colors"
                                                                >
                                                                    <SubIcon
                                                                        size={15}
                                                                        className="text-slate-400 flex-shrink-0"
                                                                    />

                                                                    <span>
                                                                        {sub.name}
                                                                    </span>
                                                                </Link>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* LOGIN + MOBILE */}
                        <div className="flex items-center gap-2 sm:gap-3 ml-2 sm:ml-6">
                            <div className="hidden sm:block">
                                {auth?.user ? (
                                    <Link
                                        href={route("be.dashboard")}
                                        className="inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-300 text-[#0072BC] bg-white hover:bg-slate-50"
                                    >
                                        <LayoutDashboard size={16} />
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href={route("login")}
                                        className="inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-300 text-[#0072BC] bg-white hover:bg-slate-50"
                                    >
                                        <LogIn size={16} />
                                        Login
                                    </Link>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setIsMobileMenuOpen(
                                        !isMobileMenuOpen
                                    )
                                }
                                aria-label={
                                    isMobileMenuOpen
                                        ? "Tutup menu"
                                        : "Buka menu"
                                }
                                className="lg:hidden p-2.5 rounded-lg transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC72C] text-white/90 hover:text-white"
                            >
                                {isMobileMenuOpen ? (
                                    <X size={22} />
                                ) : (
                                    <Menu size={22} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* MOBILE OVERLAY */}
                {isMobileMenuOpen && (
                    <div
                        className="lg:hidden fixed inset-0 top-14 sm:top-16 bg-slate-900/40 z-40"
                        onClick={() =>
                            setIsMobileMenuOpen(false)
                        }
                    />
                )}

                {/* MOBILE PANEL */}
                <div
                    className={`lg:hidden fixed top-14 sm:top-16 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-lg transition-all duration-300 ease-out ${
                        isMobileMenuOpen
                            ? "opacity-100 translate-y-0 visible"
                            : "opacity-0 -translate-y-2 invisible pointer-events-none"
                    }`}
                >
                    <div className="max-h-[calc(100vh-3.5rem)] sm:max-h-[calc(100vh-4rem)] overflow-y-auto px-4 py-3 space-y-1">
                        {navLinks.map((link) => {
                            const hasSubmenu =
                                link.submenu &&
                                link.submenu.length > 0;

                            const isOpen =
                                openMobileSubmenu === link.name;

                            const Icon = link.icon;

                            if (!hasSubmenu) {
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="flex items-center gap-3 min-h-[48px] px-3 py-2.5 text-[15px] font-medium text-slate-700 hover:text-[#0072BC] hover:bg-[#EAF3FA] rounded-xl transition-colors"
                                    >
                                        <Icon
                                            size={18}
                                            className="text-slate-400 flex-shrink-0"
                                        />

                                        <span>{link.name}</span>
                                    </Link>
                                );
                            }

                            return (
                                <div
                                    key={link.name}
                                    className="rounded-xl"
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            toggleMobileSubmenu(
                                                link.name
                                            )
                                        }
                                        aria-expanded={isOpen}
                                        className="w-full flex items-center justify-between min-h-[48px] px-3 py-2.5 text-[15px] font-medium text-slate-700 hover:text-[#0072BC] hover:bg-[#EAF3FA] rounded-xl transition-colors"
                                    >
                                        <span className="flex items-center gap-3">
                                            <Icon
                                                size={18}
                                                className="text-slate-400 flex-shrink-0"
                                            />

                                            {link.name}
                                        </span>

                                        <ChevronDown
                                            size={16}
                                            className={`text-slate-400 transition-transform duration-200 ${
                                                isOpen
                                                    ? "rotate-180"
                                                    : ""
                                            }`}
                                        />
                                    </button>

                                    <div
                                        className={`overflow-hidden transition-all duration-200 ${
                                            isOpen
                                                ? "max-h-96 opacity-100"
                                                : "max-h-0 opacity-0"
                                        }`}
                                    >
                                        <div className="ml-3 pl-3 border-l border-slate-200 space-y-0.5 py-1 mb-1">
                                            {link.submenu!.map(
                                                (sub) => {
                                                    const SubIcon =
                                                        sub.icon;

                                                    return (
                                                        <Link
                                                            key={sub.name}
                                                            href={sub.href}
                                                            className="flex items-center gap-3 min-h-[44px] px-3 py-2 text-sm text-slate-600 hover:text-[#0072BC] hover:bg-[#EAF3FA] rounded-lg transition-colors"
                                                        >
                                                            <SubIcon
                                                                size={15}
                                                                className="text-slate-400 flex-shrink-0"
                                                            />

                                                            <span>
                                                                {sub.name}
                                                            </span>
                                                        </Link>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <div className="pt-3 mt-2 border-t border-slate-100">
                            {auth?.user ? (
                                <Link
                                    href={route("be.dashboard")}
                                    className="flex items-center justify-center gap-2 min-h-[48px] px-4 py-3 text-[15px] font-semibold text-white bg-[#0072BC] hover:bg-[#005A94] rounded-xl transition-colors"
                                >
                                    <LayoutDashboard size={18} />
                                    Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={route("login")}
                                    className="flex items-center justify-center gap-2 min-h-[48px] px-4 py-3 text-[15px] font-semibold text-white bg-[#0072BC] hover:bg-[#005A94] rounded-xl transition-colors"
                                >
                                    <LogIn size={18} />
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* =====================================================
                MODAL LAMBANG TP PKK
                UKURAN COMPACT / KOTAK
            ====================================================== */}
            {isLogoModalOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 px-3 py-4 sm:py-6"
                    onClick={() => setIsLogoModalOpen(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-lambang-title"
                >
                    <div
                        className="relative w-full max-w-xl max-h-[85vh] flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* CLOSE */}
                        <button
                            type="button"
                            onClick={() =>
                                setIsLogoModalOpen(false)
                            }
                            aria-label="Tutup informasi lambang TP PKK"
                            className="absolute top-2.5 right-2.5 z-20 flex items-center justify-center w-8 h-8 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0072BC]"
                        >
                            <X size={16} strokeWidth={2} />
                        </button>

                        {/* HEADER */}
                        <div className="flex-shrink-0 px-4 sm:px-6 pt-5 pb-3 border-b border-slate-100 text-center">
                            <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0072BC]">
                                Tim Penggerak Pemberdayaan dan Kesejahteraan Keluarga
                            </p>

                            <h2
                                id="modal-lambang-title"
                                className="mt-1 text-lg sm:text-xl font-bold tracking-tight text-slate-900"
                            >
                                Lambang TP PKK
                            </h2>

                            <div className="mt-2 mx-auto w-10 h-0.5 bg-[#0072BC] rounded-full" />

                            <p className="mt-2 max-w-md mx-auto text-[11px] sm:text-xs leading-relaxed text-slate-500">
                                Lambang Tim Penggerak Pemberdayaan dan
                                Kesejahteraan Keluarga beserta bentuk, warna,
                                dan makna setiap komponennya.
                            </p>
                        </div>

                        {/* BODY SCROLL */}
                        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">

                            {/* LOGO */}
                            <div className="flex justify-center mb-4">
                                <img
                                    src="/assets/logo/logotasik.png"
                                    alt="Lambang TP PKK Kabupaten Tasikmalaya"
                                    className="w-20 sm:w-24 h-auto object-contain"
                                />
                            </div>

                            {/* DASAR HUKUM */}
                            <section className="mb-5">
                                <p className="text-[11px] sm:text-xs leading-relaxed text-slate-600">
                                    Lambang TP PKK adalah lambang sebagaimana
                                    ditetapkan dalam{" "}
                                    <strong className="font-semibold text-slate-800">
                                        Surat Keputusan Menteri Dalam Negeri
                                        Nomor 48 Tahun 1983
                                    </strong>
                                    , terdiri atas beberapa elemen dan artinya:
                                </p>
                            </section>

                            {/* 01 BENTUK */}
                            <section className="mb-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-[#0072BC]/10 text-[10px] font-bold text-[#0072BC]">
                                        01
                                    </span>

                                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                                        Bentuk
                                    </h3>
                                </div>

                                <p className="text-[11px] sm:text-xs leading-relaxed text-slate-600 mb-2.5">
                                    Akolade melingkar segi lima memiliki arti
                                    Pancasila sebagai asas Gerakan PKK. Bentuk
                                    ini terdiri dari gambar-gambar:
                                </p>

                                <ol className="space-y-1.5">
                                    {bentukItems.map((item, index) => (
                                        <li
                                            key={item}
                                            className="flex gap-2.5"
                                        >
                                            <span className="flex-shrink-0 w-4 text-[11px] font-semibold text-[#0072BC] pt-0.5">
                                                {String.fromCharCode(
                                                    97 + index
                                                )}
                                                .
                                            </span>

                                            <p className="text-[11px] sm:text-xs leading-relaxed text-slate-700">
                                                {item}
                                            </p>
                                        </li>
                                    ))}
                                </ol>
                            </section>

                            {/* 02 WARNA */}
                            <section className="mb-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-[#0072BC]/10 text-[10px] font-bold text-[#0072BC]">
                                        02
                                    </span>

                                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                                        Warna
                                    </h3>
                                </div>

                                <p className="text-[11px] sm:text-xs leading-relaxed text-slate-600 mb-3">
                                    Warna lambang terdiri dari:
                                </p>

                                <div className="space-y-4">

                                    {/* DASAR */}
                                    <div className="flex gap-2.5">
                                        <span className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-[#0072BC]" />

                                        <div>
                                            <h4 className="text-[11px] sm:text-xs font-semibold text-slate-800">
                                                a. Warna dasar lambang
                                            </h4>

                                            <p className="mt-0.5 text-[11px] sm:text-xs leading-relaxed text-slate-600">
                                                Warna dasar lambang adalah
                                                biru benhur.
                                            </p>
                                        </div>
                                    </div>

                                    {/* KUNING */}
                                    <div className="flex gap-2.5">
                                        <span className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-[#D4A017]" />

                                        <div className="min-w-0">
                                            <h4 className="text-[11px] sm:text-xs font-semibold text-slate-800">
                                                b. Warna kuning
                                            </h4>

                                            <p className="mt-0.5 text-[11px] sm:text-xs leading-relaxed text-slate-600">
                                                Warna kuning yang dimaksud
                                                adalah warna kuning emas,
                                                untuk:
                                            </p>

                                            <ol className="mt-1.5 pl-3.5 list-decimal space-y-0.5 text-[11px] sm:text-xs leading-relaxed text-slate-600">
                                                {warnaKuningItems.map(
                                                    (item) => (
                                                        <li key={item}>
                                                            {item}
                                                        </li>
                                                    )
                                                )}
                                            </ol>
                                        </div>
                                    </div>

                                    {/* PUTIH */}
                                    <div className="flex gap-2.5">
                                        <span className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-white border border-slate-300" />

                                        <div className="min-w-0">
                                            <h4 className="text-[11px] sm:text-xs font-semibold text-slate-800">
                                                c. Warna putih
                                            </h4>

                                            <p className="mt-0.5 text-[11px] sm:text-xs leading-relaxed text-slate-600">
                                                Warna putih yang dimaksud
                                                adalah:
                                            </p>

                                            <div className="mt-2.5 space-y-3">

                                                {/* PUTIH PERAK */}
                                                <div>
                                                    <p className="text-[11px] sm:text-xs font-medium text-slate-700">
                                                        1) Putih Perak untuk:
                                                    </p>

                                                    <ol className="mt-1 pl-3.5 list-decimal space-y-0.5 text-[11px] sm:text-xs leading-relaxed text-slate-600">
                                                        {putihPerakItems.map(
                                                            (item) => (
                                                                <li key={item}>
                                                                    {item}
                                                                </li>
                                                            )
                                                        )}
                                                    </ol>
                                                </div>

                                                {/* PUTIH KAPAS */}
                                                <div>
                                                    <p className="text-[11px] sm:text-xs font-medium text-slate-700">
                                                        2) Putih Kapas untuk:
                                                    </p>

                                                    <ol className="mt-1 pl-3.5 list-decimal space-y-0.5 text-[11px] sm:text-xs leading-relaxed text-slate-600">
                                                        {putihKapasItems.map(
                                                            (item) => (
                                                                <li key={item}>
                                                                    {item}
                                                                </li>
                                                            )
                                                        )}
                                                    </ol>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* 03 ARTI */}
                            <section>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-[#0072BC]/10 text-[10px] font-bold text-[#0072BC]">
                                        03
                                    </span>

                                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                                        Arti
                                    </h3>
                                </div>

                                {/* WARNA */}
                                <div className="mb-4">
                                    <h4 className="text-xs sm:text-sm font-semibold text-slate-900 mb-2">
                                        a. Warna
                                    </h4>

                                    <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden">
                                        {artiWarna.map((item) => (
                                            <div
                                                key={item.title}
                                                className="px-3 py-2.5 flex gap-2.5 bg-white"
                                            >
                                                <span
                                                    className={`mt-0.5 flex-shrink-0 w-2 h-2 rounded-full ${item.dot}`}
                                                />

                                                <div>
                                                    <h5 className="text-[11px] sm:text-xs font-semibold text-slate-800">
                                                        {item.title}
                                                    </h5>

                                                    <p className="mt-0.5 text-[11px] sm:text-xs leading-relaxed text-slate-600">
                                                        {item.text}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* KOMPONEN */}
                                <div>
                                    <h4 className="text-xs sm:text-sm font-semibold text-slate-900 mb-2">
                                        b. Komponen
                                    </h4>

                                    <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden">
                                        {artiKomponen.map((item) => (
                                            <div
                                                key={item.title}
                                                className="px-3 py-2.5 bg-white"
                                            >
                                                <h5 className="text-[11px] sm:text-xs font-semibold text-slate-800">
                                                    {item.title}
                                                </h5>

                                                <p className="mt-0.5 text-[11px] sm:text-xs leading-relaxed text-slate-600">
                                                    {item.text}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* FOOTER */}
                        <div className="flex-shrink-0 border-t border-slate-100 px-4 sm:px-6 py-3 bg-slate-50 flex justify-end">
                            <button
                                type="button"
                                onClick={() =>
                                    setIsLogoModalOpen(false)
                                }
                                className="inline-flex items-center justify-center min-h-[36px] px-4 rounded-lg bg-[#0072BC] text-white text-xs sm:text-sm font-semibold hover:bg-[#005A94] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0072BC] focus-visible:ring-offset-2"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
