import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Head, Link } from "@inertiajs/react";

import Navbar from "./Layouts/Navbar";
import Footer from "./Layouts/Footer";

import {
    Users,
    Heart,
    GraduationCap,
    Utensils,
    Stethoscope,
    Globe,
    ChevronRight,
    ArrowRight,
    Eye,
    Newspaper,
    X,
    Sparkles,
    Handshake,
    Shirt,
    Home,
    HeartPulse,
    Building2,
    Trees,
    ClipboardList,
    CalendarDays,
    Images,
} from "lucide-react";

// ============================================================
// INTERFACE
// ============================================================
interface BeritaItem {
    id: number;
    judul: string;
    slug?: string;
    tanggal?: string;
    deskripsi?: string;
    konten?: string;
    link?: string;
    image?: string;
    foto?: string;
    foto_url?: string;
    created_at?: string;
    deskripsi_singkat?: string;
    tanggal_formatted?: string;
}

interface GaleriItem {
    id: number;
    foto?: string;
    foto_url?: string;
    created_at?: string;
    caption?: string;
    judul?: string;
}

interface VideoItem {
    id: number;
    judul: string;
    url: string;
    thumbnail?: string;
    deskripsi?: string;
}

interface AgendaItem {
    id: number;
    judul: string;
    tanggal: string;
    waktu?: string;
    lokasi?: string;
    kategori?: string;
    deskripsi?: string;
}

interface PengumumanItem {
    id: number;
    judul: string;
    isi?: string;
    tanggal?: string;
}

interface InfografisItem {
    id: number;
    judul: string;
    deskripsi?: string | null;
    gambar_url?: string | null;
    kategori?: string | null;
}

interface TestimoniSurveyItem {
    id: number;
    nama: string;
    rating: number;
    saran?: string | null;
    created_at?: string;
}

interface WelcomeProps {
    year?: number;
    berita?: BeritaItem[];
    galeri?: GaleriItem[];
    videos?: VideoItem[];
    agenda?: AgendaItem[];
    pengumuman?: PengumumanItem[];
    infografis?: InfografisItem[];
    isSurveyActive?: boolean;
    testimoniSurvey?: TestimoniSurveyItem[];
}

// ============================================================
// DATA STATIS
// ============================================================
const DATA_MENU = [
    {
        title: "Data Umum",
        desc: "Administrasi Tim Penggerak PKK & rekapitulasi profil kependudukan.",
        icon: Users,
        accent: "#0D9488",
        link: "/sekretariat",
    },
    {
        title: "Pokja I",
        desc: "Penghayatan Pengamalan Pancasila & pembinaan gotong royong.",
        icon: Heart,
        accent: "#0D9488",
        link: "/pokja-1",
    },
    {
        title: "Pokja II",
        desc: "Pendidikan, keterampilan, dan pengembangan kehidupan berkoperasi.",
        icon: GraduationCap,
        accent: "#0D9488",
        link: "/pokja-2",
    },
    {
        title: "Pokja III",
        desc: "Pangan, sandang, perumahan, dan tata laksana rumah tangga.",
        icon: Utensils,
        accent: "#0D9488",
        link: "/pokja-3",
    },
    {
        title: "Pokja IV",
        desc: "Kesehatan, kelestarian lingkungan, dan perencanaan sehat.",
        icon: Stethoscope,
        accent: "#0D9488",
        link: "/pokja-4",
    },
    {
        title: "Website Utama",
        desc: "Kembali ke Portal Publik Pemerintah Kabupaten Tasikmalaya.",
        icon: Globe,
        accent: "#475569",
        link: "https://tasikmalayakab.go.id/",
    },
];

const PROGRAM_POKOK = [
    {
        id: 1,
        nama: "Penghayatan dan Pengamalan Pancasila",
        icon: Sparkles,
        poin: [
            "Meningkatkan pemahaman nilai Pancasila dalam keluarga.",
            "Membina karakter dan budi pekerti.",
            "Mendorong kehidupan beragama yang harmonis.",
            "Menumbuhkan cinta tanah air.",
        ],
    },
    {
        id: 2,
        nama: "Gotong Royong",
        icon: Handshake,
        poin: [
            "Meningkatkan kebersamaan di lingkungan.",
            "Melaksanakan kegiatan sosial.",
            "Membantu sesama.",
            "Menjaga kerukunan warga.",
        ],
    },
    {
        id: 3,
        nama: "Pangan",
        icon: Utensils,
        poin: [
            "Pemenuhan pangan lewat halaman asri.",
            "Keanekaragaman konsumsi pangan.",
            "Makanan bergizi, seimbang, aman.",
            "Penyediaan makanan tambahan.",
        ],
    },
    {
        id: 4,
        nama: "Sandang",
        icon: Shirt,
        poin: [
            "Sandang layak dan sehat.",
            "Produk lokal.",
            "Keterampilan menjahit.",
            "Usaha kecil sandang.",
        ],
    },
    {
        id: 5,
        nama: "Perumahan dan Tata Laksana Rumah Tangga",
        icon: Home,
        poin: [
            "Rumah sehat dan layak.",
            "Tata laksana rumah tangga.",
            "Hidup bersih dan hemat energi.",
            "Pemanfaatan ruang optimal.",
        ],
    },
    {
        id: 6,
        nama: "Pendidikan dan Keterampilan",
        icon: GraduationCap,
        poin: [
            "Pendidikan anak dan keluarga.",
            "Keterampilan anggota keluarga.",
            "Literasi dan minat baca.",
            "PAUD dan pendidikan nonformal.",
        ],
    },
    {
        id: 7,
        nama: "Kesehatan",
        icon: HeartPulse,
        poin: [
            "Kesehatan ibu dan anak.",
            "PHBS.",
            "Posyandu dan imunisasi.",
            "Cegah stunting.",
        ],
    },
    {
        id: 8,
        nama: "Pengembangan Kehidupan Berkoperasi",
        icon: Building2,
        poin: [
            "Partisipasi koperasi.",
            "Usaha ekonomi keluarga.",
            "UMKM perempuan.",
            "Literasi keuangan.",
        ],
    },
    {
        id: 9,
        nama: "Kelestarian Lingkungan Hidup",
        icon: Trees,
        poin: [
            "Kebersihan lingkungan.",
            "Penghijauan dan sampah.",
            "Hemat air dan energi.",
            "Cegah pencemaran.",
        ],
    },
    {
        id: 10,
        nama: "Perencanaan Sehat",
        icon: ClipboardList,
        poin: [
            "Perencanaan keluarga.",
            "KB bertanggung jawab.",
            "Kesehatan reproduksi.",
            "Generasi sehat.",
        ],
    },
];

const FALLBACK_IMAGES = {
    hero: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    ketua: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    berita: "/assets/images/default-berita.jpg",
    galeri: "/assets/images/default-galeri.jpg",
};

const HERO_LOGOS = [
    { id: "diskominfo", src: "/assets/logo/diskominfo.jpeg", alt: "Dishubkominfo" },
    { id: "pkk", src: "/assets/logo/logotasik.png", alt: "PKK Kab. Tasikmalaya" },
    { id: "pemkab", src: "/assets/logo/pemkab.png", alt: "Pemerintah Kab. Tasikmalaya" },
];

// ⭐ HERO SLIDE IMAGES
const HERO_SLIDES = [
    { id: 1, src: "/assets/images/hero.jpg", alt: "Kegiatan PKK Kabupaten Tasikmalaya" },
    { id: 2, src: "/assets/images/hero2.jpg", alt: "Kegiatan PKK Kabupaten Tasikmalaya" },
    { id: 3, src: "/assets/images/hero3.jpg", alt: "Kegiatan PKK Kabupaten Tasikmalaya" },
];

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
const getImageFallback = (type: "hero" | "ketua" | "berita" | "galeri"): string => {
    return FALLBACK_IMAGES[type];
};

// ============================================================
// CUSTOM HOOKS
// ============================================================
const useScrollAnimation = () => {
    const ref = useRef<HTMLElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        );

        observer.observe(node);
        return () => observer.unobserve(node);
    }, []);

    return { ref, isVisible };
};

// ⭐ HERO CAROUSEL HOOK (AUTO SLIDE)
const useHeroCarousel = (items: any[], interval: number = 5000) => {
    const [index, setIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const next = useCallback(() => {
        if (items.length > 0) {
            setIndex((prev) => (prev + 1) % items.length);
        }
    }, [items.length]);

    const goTo = useCallback((idx: number) => {
        if (idx >= 0 && idx < items.length) {
            setIndex(idx);
        }
    }, [items.length]);

    useEffect(() => {
        if (items.length === 0 || isPaused) return;

        timerRef.current = setInterval(next, interval);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [items.length, interval, next, isPaused]);

    const handleMouseEnter = useCallback(() => setIsPaused(true), []);
    const handleMouseLeave = useCallback(() => setIsPaused(false), []);

    return {
        index,
        goTo,
        next,
        isPaused,
        handleMouseEnter,
        handleMouseLeave,
    };
};

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function Welcome({
    year,
    berita = [],
    galeri = [],
    videos = [],
    agenda = [],
    pengumuman = [],
    infografis = [],
    isSurveyActive = false,
    testimoniSurvey = [],
}: WelcomeProps) {
    const [selectedInfografis, setSelectedInfografis] = useState<InfografisItem | null>(null);

    const beritaTerbaru = useMemo(() => berita.slice(0, 6), [berita]);

    const [now, setNow] = useState<Date>(() => new Date());
    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const [selectedProgram, setSelectedProgram] = useState<
        (typeof PROGRAM_POKOK)[number] | null
    >(null);

    const [selectedAgenda, setSelectedAgenda] = useState<AgendaItem | null>(null);

    // ⭐ HERO CAROUSEL
    const heroCarousel = useHeroCarousel(HERO_SLIDES, 5000);

    const heroAnim = useScrollAnimation();
    const sambutanAnim = useScrollAnimation();
    const dataAnim = useScrollAnimation();
    const kabarAnim = useScrollAnimation();
    const beritaListAnim = useScrollAnimation();
    const agendaAnim = useScrollAnimation();

    // ============================================================
    // RENDER
    // ============================================================
    return (
        <div className="min-h-screen flex flex-col bg-white text-slate-800 font-['Poppins',_sans-serif]">
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
                <title>PKK Kabupaten Tasikmalaya - Sejahtera &amp; Mandiri</title>
                <meta
                    name="description"
                    content="Situs resmi Tim Penggerak PKK Kabupaten Tasikmalaya: informasi program kerja, data, kebijakan, dan berita seputar pemberdayaan dan kesejahteraan keluarga."
                />
                <meta name="robots" content="index, follow" />
                <meta name="language" content="id" />
                <meta property="og:title" content="PKK Kabupaten Tasikmalaya - Sejahtera &amp; Mandiri" />
                <meta property="og:description" content="Situs resmi Tim Penggerak PKK Kabupaten Tasikmalaya." />
                <meta property="og:type" content="website" />
                <meta property="og:locale" content="id_ID" />
                <meta property="og:url" content="https://pkk.tasikmalayakab.go.id" />
            </Head>

            <style>{`
                .anim-fade-up {
                    opacity: 0;
                    transform: translateY(24px);
                    transition: opacity 0.7s ease, transform 0.7s ease;
                }
                .anim-fade-up.show {
                    opacity: 1;
                    transform: translateY(0);
                }
                @media (prefers-reduced-motion: reduce) {
                    .anim-fade-up {
                        opacity: 1 !important;
                        transform: none !important;
                        transition: none !important;
                    }
                }
                .berita-list-item {
                    transition: all 0.2s ease;
                }
                .berita-list-item:hover {
                    background-color: #f8fafc;
                    transform: translateX(4px);
                }

                @keyframes logo-marquee {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }

                .logo-marquee-container {
                    width: 100%;
                    max-width: 400px;
                    margin: 1.5rem auto 0.5rem;
                    overflow: hidden;
                }

                .logo-marquee-track {
                    display: flex;
                    align-items: center;
                    gap: 2.5rem;
                    animation: logo-marquee 20s linear infinite;
                    width: max-content;
                }

                .logo-marquee-track:hover {
                    animation-play-state: paused;
                }

                .logo-marquee-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.25rem;
                    flex-shrink: 0;
                    padding: 0 0.25rem;
                }

                .logo-marquee-item img {
                    height: 55px;
                    width: auto;
                    max-width: 100px;
                    object-fit: contain;
                    filter: none !important;
                    opacity: 1 !important;
                    border-radius: 0 !important;
                    background: transparent !important;
                    transition: transform 0.3s ease;
                }

                .logo-marquee-item img:hover {
                    transform: scale(1.08);
                }

                .logo-marquee-item .label {
                    font-size: 9px;
                    color: rgba(255, 255, 255, 0.8);
                    font-weight: 500;
                    letter-spacing: 0.05em;
                    text-align: center;
                    text-shadow: 0 1px 4px rgba(0,0,0,0.3);
                }

                @media (max-width: 640px) {
                    .logo-marquee-container {
                        max-width: 260px;
                    }
                    .logo-marquee-item img {
                        height: 38px;
                        max-width: 70px;
                    }
                    .logo-marquee-item .label {
                        font-size: 7px;
                    }
                }

                @media (min-width: 768px) {
                    .logo-marquee-item img {
                        height: 65px;
                        max-width: 120px;
                    }
                }

                /* ⭐ HERO SLIDE ANIMATION */
                .hero-slide {
                    transition: opacity 1.2s ease-in-out, transform 1.2s ease-in-out;
                }
                .hero-slide-enter {
                    opacity: 0;
                    transform: scale(1.05);
                }
                .hero-slide-active {
                    opacity: 1;
                    transform: scale(1);
                }
                .hero-slide-exit {
                    opacity: 0;
                    transform: scale(1.05);
                }
            `}</style>

            <Navbar />

            {/* ==========================================================
                HERO SECTION - AUTO SLIDE DENGAN 3 GAMBAR + OVERLAY
            ========================================================== */}
            <section
                ref={heroAnim.ref}
                className={`relative h-[560px] lg:h-[620px] flex items-center justify-center overflow-hidden anim-fade-up ${
                    heroAnim.isVisible ? "show" : ""
                }`}
                aria-label="Hero section"
                onMouseEnter={heroCarousel.handleMouseEnter}
                onMouseLeave={heroCarousel.handleMouseLeave}
            >
                {/* Background Slides */}
                <div className="absolute inset-0">
                    {HERO_SLIDES.map((slide, idx) => (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                                idx === heroCarousel.index ? "opacity-100" : "opacity-0"
                            }`}
                        >
                            <img
                                src={slide.src}
                                alt={slide.alt}
                                className="w-full h-full object-cover object-center"
                                loading={idx === 0 ? "eager" : "lazy"}
                                onError={(e) => {
                                    e.currentTarget.src = getImageFallback("hero");
                                }}
                            />
                            {/* 🔥 OVERLAY GRADASI GELAP BIAR TEKS TERBACA */}
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-slate-900/40 to-slate-900/60" aria-hidden="true" />
                        </div>
                    ))}
                </div>

                {/* Hero Content */}
                <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <span className="inline-block text-teal-200 text-xs font-medium tracking-[0.2em] uppercase mb-5">
                        Tim Penggerak PKK Kabupaten Tasikmalaya
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white leading-tight mb-5 tracking-tight">
                        Membangun Keluarga
                        <br />
                        Sejahtera &amp; Mandiri
                        <br />
                        bersama TP PKK
                    </h1>
                    <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-lg mx-auto mb-8">
                        Media informasi resmi Tim Penggerak PKK Kabupaten
                        Tasikmalaya dalam mewujudkan pemberdayaan dan
                        kesejahteraan keluarga.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Link
                            href="#tentang"
                            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-medium text-sm px-6 py-2.5 rounded-md transition-colors focus:ring-2 focus:ring-teal-400 focus:outline-none"
                        >
                            Jelajahi Program
                            <ArrowRight size={15} />
                        </Link>
                        <Link
                            href="#data"
                            className="inline-flex items-center gap-2 border border-white/50 hover:bg-white/10 text-white font-medium text-sm px-6 py-2.5 rounded-md transition-colors focus:ring-2 focus:ring-white/50 focus:outline-none"
                        >
                            Lihat Data PKK
                        </Link>
                    </div>

                    {/* ⭐ LOGO MARQUEE */}
                    <div className="logo-marquee-container">
                        <div className="logo-marquee-track">
                            {[...HERO_LOGOS, ...HERO_LOGOS, ...HERO_LOGOS].map((logo, idx) => (
                                <div key={`${logo.id}-${idx}`} className="logo-marquee-item">
                                    <img
                                        src={logo.src}
                                        alt={logo.alt}
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                        }}
                                    />
                                    <span className="label">{logo.alt}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ⭐ Hero Slide Dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {HERO_SLIDES.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => heroCarousel.goTo(idx)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                idx === heroCarousel.index
                                    ? "w-8 bg-white"
                                    : "bg-white/50 hover:bg-white/80"
                            }`}
                            aria-label={`Slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </section>

            {/* ==========================================================
            SAMBUTAN KETUA
            ========================================================== */}
            <section
                ref={sambutanAnim.ref}
                id="tentang"
                className={`py-20 lg:py-24 bg-white border-t border-slate-100 anim-fade-up scroll-mt-20 ${
                    sambutanAnim.isVisible ? "show" : ""
                }`}
                aria-labelledby="sambutan-title"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
                        <div className="w-full lg:w-5/12">
                            <div className="rounded-3xl overflow-hidden shadow-xl">
                                <img
                                    src="/assets/images/ketuapkk.png"
                                    alt="Hj. Retno Widyastuti, S.E, Ketua TP PKK Kabupaten Tasikmalaya"
                                    loading="lazy"
                                    className="w-full h-[420px] md:h-[480px] object-cover object-top"
                                    onError={(e) => {
                                        e.currentTarget.src = getImageFallback("ketua");
                                    }}
                                />
                            </div>
                            <div className="mt-4 text-center lg:text-left">
                                <h3 className="text-lg font-semibold text-slate-900">
                                    Hj. Retno Widyastuti, S.E
                                </h3>
                                <p className="text-sm text-slate-500 mt-0.5">
                                    Ketua TP PKK Kabupaten Tasikmalaya
                                </p>
                            </div>
                        </div>

                        <div className="w-full lg:w-7/12">
                            <p className="text-teal-700 text-sm font-medium tracking-wide uppercase mb-2">
                                Sambutan
                            </p>
                            <h2
                                id="sambutan-title"
                                className="text-2xl md:text-3xl font-semibold text-slate-900 mb-6"
                            >
                                Sambutan Ketua TP PKK Kabupaten Tasikmalaya
                            </h2>
                            <div className="space-y-4 text-slate-600 text-[15px] leading-relaxed">
                                <p className="italic text-slate-700">
                                    Assalaamu'alaikum wa rahmatullah wa barakaatuh,
                                    <br />
                                    Sampurasun,
                                </p>
                                <p>
                                    Puji dan Syukur Kami Panjatkan Kepada Allah SWT karena atas rahmat dan karunia-Nya, kita dapat hadir dan meluncurkan website resmi Tim Penggerak PKK Kabupaten Tasikmalaya.
                                </p>
                                <p>
                                    Kami menyambut baik kehadiran website ini sebagai sarana komunikasi, informasi, dan transparansi kegiatan PKK kepada masyarakat luas. Melalui media digital ini, kami berharap 10 program kerja Pokok PKK dapat diakses dengan mudah serta memberikan manfaat nyata bagi pembinaan kesejahteraan keluarga di wilayah Kabupaten Tasikmalaya.
                                </p>
                                <p>
                                    Gerakan PKK berfokus pada pemberdayaan keluarga demi mewujudkan masyarakat yang maju, mandiri, dan sejahtera. Oleh karena itu, dukungan serta kerja sama dari seluruh pengurus, kader, dan instansi pemerintah sangat kami harapkan untuk menyukseskan setiap program yang kami laksanakan.
                                </p>
                                <p>
                                    Tujuan utama pembuatan website PKK Kabupaten adalah untuk mengoptimalkan pengelolaan data, mempercepat pelaporan 10 program pokok PKK, serta meningkatkan transparansi dan penyebaran informasi kegiatan pemberdayaan keluarga kepada masyarakat khususnya Kabupaten Tasikmalaya secara digital.
                                </p>
                                <p>
                                    Akhir kata, semoga website ini dapat bermanfaat dan berguna bagi banyak pihak terutama untuk meningkatkan kualitas informasi publik di Kabupaten Tasikmalaya. Terima kasih.
                                </p>
                                <p className="italic text-slate-700 pt-2">
                                    Wassalamu'alaikum warahmatullahi wa barakatuh.
                                </p>
                            </div>
                            <div className="mt-8 pt-6 border-t border-slate-200">
                                <p className="font-semibold text-slate-900">
                                    Hj. Retno Widyastuti, S.E
                                </p>
                                <p className="text-sm text-slate-500 mt-0.5">
                                    Ketua Tim Penggerak PKK Kabupaten Tasikmalaya
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==========================================================
                DATA POKJA
            ========================================================== */}
            <section
                ref={dataAnim.ref}
                id="data"
                className={`py-16 lg:py-20 bg-slate-50 border-t border-slate-100 anim-fade-up scroll-mt-20 ${
                    dataAnim.isVisible ? "show" : ""
                }`}
                aria-labelledby="data-title"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-11">
                        <p className="text-teal-700 text-xs font-semibold tracking-wider uppercase mb-2">
                            Sistem Informasi
                        </p>
                        <h2
                            id="data-title"
                            className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2"
                        >
                            Data PKK Kabupaten Tasikmalaya
                        </h2>
                        <div className="w-10 h-0.5 bg-teal-600 mx-auto mb-3" />
                        <p className="text-slate-500 text-sm md:text-base max-w-lg mx-auto">
                            Pusat informasi dan statistik program pokok PKK secara terpadu
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {DATA_MENU.map((item, i) => {
                            const isExternal = item.link.startsWith("http");

                            const CardInner = (
                                <div className="flex flex-col items-center text-center h-full">
                                    <div className="w-12 h-12 rounded-lg bg-teal-50 group-hover:bg-white/20 flex items-center justify-center mb-5 transition-colors">
                                        <item.icon
                                            size={22}
                                            className="text-teal-600 group-hover:text-white transition-colors"
                                            strokeWidth={1.75}
                                        />
                                    </div>

                                    <h3 className="text-slate-900 group-hover:text-white font-semibold text-base mb-2 transition-colors">
                                        {item.title}
                                    </h3>

                                    <p className="text-slate-500 group-hover:text-white/85 text-sm leading-relaxed mb-6 flex-grow transition-colors">
                                        {item.desc}
                                    </p>

                                    <span className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium
                                        bg-teal-600 text-white group-hover:bg-white group-hover:text-teal-700 transition-colors">
                                        Selengkapnya
                                    </span>
                                </div>
                            );

                            const cardClass =
                                "group block h-full bg-white rounded-xl border border-slate-200 px-6 py-8 shadow-sm " +
                                "transition-all duration-200 " +
                                "hover:bg-teal-600 hover:border-teal-600 hover:shadow-md " +
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2";

                            return isExternal ? (
                                <a
                                    key={i}
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cardClass}
                                >
                                    {CardInner}
                                </a>
                            ) : (
                                <Link key={i} href={item.link} className={cardClass}>
                                    {CardInner}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ==========================================================
            10 PROGRAM POKOK PKK
            ========================================================== */}
            <section
                ref={beritaListAnim.ref}
                className={`py-16 lg:py-20 bg-white border-t border-slate-100 anim-fade-up ${
                    beritaListAnim.isVisible ? "show" : ""
                }`}
                aria-labelledby="program-pokok-title"
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-2xl border border-teal-100 bg-teal-50/80 p-6 sm:p-8 lg:p-10">
                        <h2
                            id="program-pokok-title"
                            className="text-center text-xl md:text-2xl font-bold text-slate-800 mb-8"
                        >
                            10 Program Pokok PKK
                        </h2>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                            {PROGRAM_POKOK.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setSelectedProgram(item)}
                                    className="flex flex-col items-center text-center rounded-xl p-4 sm:p-5 bg-white/70 hover:bg-white hover:shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                                >
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-[3px] border-yellow-400 bg-white flex items-center justify-center mb-3">
                                        <item.icon
                                            size={26}
                                            className="text-teal-700"
                                            strokeWidth={1.6}
                                        />
                                    </div>
                                    <span className="text-xs sm:text-[13px] font-medium text-teal-800 leading-snug">
                                        {item.nama}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {selectedProgram && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        role="dialog"
                        aria-modal="true"
                    >
                        <button
                            type="button"
                            className="absolute inset-0 bg-slate-900/40"
                            aria-label="Tutup"
                            onClick={() => setSelectedProgram(null)}
                        />
                        <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
                            <button
                                type="button"
                                onClick={() => setSelectedProgram(null)}
                                className="absolute top-4 right-4 w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700"
                                aria-label="Tutup"
                            >
                                <X size={16} />
                            </button>
                            <div className="flex flex-col items-center text-center mb-5">
                                <div className="w-16 h-16 rounded-full border-[3px] border-yellow-400 flex items-center justify-center mb-3">
                                    <selectedProgram.icon
                                        size={30}
                                        className="text-teal-700"
                                        strokeWidth={1.6}
                                    />
                                </div>
                                <h3 className="text-lg font-semibold text-teal-700">
                                    {selectedProgram.nama}
                                </h3>
                            </div>
                            <p className="text-sm text-slate-500 mb-3">
                                Dilaksanakan paling sedikit dengan cara:
                            </p>
                            <ol className="space-y-2.5 text-sm text-slate-600">
                                {selectedProgram.poin.map((p, i) => (
                                    <li key={i} className="flex gap-2">
                                        <span className="text-teal-700 font-medium shrink-0">
                                            {String.fromCharCode(97 + i)}.
                                        </span>
                                        <span>{p}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                )}
            </section>

            {/* ==========================================================
                KABAR BERITA
            ========================================================== */}
            <section
                ref={kabarAnim.ref}
                className={`py-16 lg:py-20 bg-white border-t border-slate-100 anim-fade-up ${
                    kabarAnim.isVisible ? "show" : ""
                }`}
                aria-labelledby="kabar-berita-title"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2
                            id="kabar-berita-title"
                            className="text-2xl md:text-3xl font-bold text-slate-800 tracking-wide uppercase"
                        >
                            Kabar Berita
                        </h2>
                        <div className="w-10 h-1 bg-teal-600 rounded-full mx-auto mt-3" />
                    </div>

                    {beritaTerbaru.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
                            {beritaTerbaru.slice(0, 6).map((item) => {
                                const imageSrc =
                                    item.foto_url ||
                                    (item.foto ? `/storage/${item.foto}` : null) ||
                                    item.image ||
                                    null;
                                const href = item.slug
                                    ? `/berita/${item.slug}`
                                    : `/berita/${item.id}`;
                                const tanggal = item.created_at
                                    ? new Date(item.created_at).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })
                                    : item.tanggal || "-";

                                return (
                                    <article
                                        key={item.id}
                                        className="group bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-md transition-shadow duration-200 flex flex-col"
                                    >
                                        <Link
                                            href={href}
                                            className="relative block aspect-[16/10] bg-slate-100 overflow-hidden"
                                        >
                                            {imageSrc ? (
                                                <img
                                                    src={imageSrc}
                                                    alt=""
                                                    loading="lazy"
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = "none";
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <Newspaper size={36} />
                                                </div>
                                            )}
                                        </Link>

                                        <div className="p-5 flex flex-col flex-grow text-center">
                                            <h3 className="text-[15px] sm:text-base font-semibold text-slate-900 leading-snug mb-2 line-clamp-2">
                                                <Link
                                                    href={href}
                                                    className="hover:text-teal-700 transition-colors"
                                                >
                                                    {item.judul}
                                                </Link>
                                            </h3>
                                            <p className="text-xs text-slate-400 mt-auto">
                                                {tanggal}
                                            </p>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-14 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            <Newspaper size={36} className="text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 text-sm">Belum ada berita.</p>
                        </div>
                    )}

                    {beritaTerbaru.length > 0 && (
                        <div className="text-center mt-10">
                            <Link
                                href="/berita"
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800 transition-colors"
                            >
                                Lihat semua berita
                                <ChevronRight size={16} />
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* ==========================================================
                INFO GRAFIS - 3 DATA TERBARU
            ========================================================== */}
            {infografis && infografis.length > 0 && (
                <section className="py-16 lg:py-20 bg-white border-t border-slate-100 anim-fade-up show">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-10">
                            <p className="text-teal-700 text-xs font-semibold tracking-wider uppercase mb-2">
                                Publikasi
                            </p>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-wide uppercase">
                                Info Grafis
                            </h2>
                            <div className="w-10 h-1 bg-teal-600 rounded-full mx-auto mt-3" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-3xl mx-auto">
                            {infografis.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col cursor-pointer"
                                    onClick={() => setSelectedInfografis(item)}
                                >
                                    <div className="aspect-[3/4] bg-slate-200 relative overflow-hidden flex items-center justify-center">
                                        {item.gambar_url ? (
                                            <>
                                                <img
                                                    src={item.gambar_url}
                                                    alt={item.judul}
                                                    className="w-full h-full object-cover relative z-10 transition-transform duration-500 group-hover:scale-105"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                        const parent = e.currentTarget.parentElement;
                                                        if (parent) {
                                                            const icon = parent.querySelector('.fallback-icon');
                                                            if (icon) icon.classList.remove('hidden');
                                                        }
                                                    }}
                                                />
                                                <Images size={32} className="fallback-icon hidden text-slate-400 absolute" />
                                            </>
                                        ) : (
                                            <Images size={32} className="text-slate-400 absolute" />
                                        )}

                                        {item.kategori && (
                                            <span className="absolute top-2 left-2 z-20 bg-teal-600/90 text-white text-[8px] font-semibold px-2 py-0.5 rounded-full">
                                                {item.kategori}
                                            </span>
                                        )}

                                        {/* OVERLAY ZOOM */}
                                        <div className="absolute z-20 inset-0 bg-gradient-to-t from-slate-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="bg-white/90 text-teal-700 font-semibold text-xs py-2 px-4 rounded-lg flex items-center gap-2 shadow-lg">
                                                <Eye size={16} />
                                                Klik untuk lihat
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-3 border-t border-slate-100 bg-white flex-1 flex items-center justify-center">
                                        <h3 className="text-slate-800 font-semibold text-xs sm:text-[13px] leading-snug line-clamp-2 text-center group-hover:text-teal-700 transition-colors">
                                            {item.judul}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ⭐ MODAL FULLSCREEN GAMBAR INFOGRAFIS */}
            {selectedInfografis && (
                <div
                    className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={() => setSelectedInfografis(null)}
                >
                    <div className="relative max-w-5xl max-h-[90vh]">
                        <img
                            src={selectedInfografis.gambar_url || undefined}
                            alt={selectedInfografis.judul}
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                            onError={(e) => {
                                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%2394a3b8' font-size='20' font-family='sans-serif'%3EGambar tidak ditemukan%3C/text%3E%3C/svg%3E";
                            }}
                        />
                        <button
                            onClick={() => setSelectedInfografis(null)}
                            className="absolute -top-12 right-0 text-white hover:text-teal-300 transition-colors text-2xl font-medium"
                        >
                            ✕ Tutup
                        </button>
                        <p className="absolute -bottom-10 left-0 right-0 text-center text-white/70 text-sm font-medium">
                            {selectedInfografis.judul}
                        </p>
                    </div>
                </div>
            )}

            {/* ==========================================================
                AGENDA KEGIATAN + SURVEY
            ========================================================== */}
            <section
                ref={agendaAnim.ref}
                className={`py-16 lg:py-20 bg-slate-50 border-t border-slate-100 anim-fade-up ${
                    agendaAnim.isVisible ? "show" : ""
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="text-center mb-10">
                        <p className="text-teal-700 text-xs font-semibold tracking-wider uppercase mb-2">
                            Informasi Kegiatan
                        </p>
                        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
                            Agenda Kegiatan
                        </h2>
                        <div className="w-10 h-0.5 bg-teal-600 mx-auto mt-3 mb-3" />
                        <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                            Informasi agenda dan kegiatan TP PKK Kabupaten Tasikmalaya
                            pada bulan berjalan.
                        </p>
                    </div>

                    {agenda.length > 0 ? (
                        <div className="grid lg:grid-cols-[320px_1fr] bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">

                            {/* Kolom Kiri - Kalender */}
                            <div className="border-b lg:border-b-0 lg:border-r border-slate-200">

                                <div className="px-5 py-4 border-b border-slate-100 bg-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-0.5">
                                                Kalender
                                            </p>
                                            <h3 className="text-base font-bold text-slate-800 capitalize">
                                                {now.toLocaleDateString("id-ID", {
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </h3>
                                        </div>
                                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-50 border border-teal-100">
                                            <CalendarDays size={18} className="text-teal-700" />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="grid grid-cols-7 mb-2">
                                        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
                                            <div key={day} className="text-center text-[9px] font-bold uppercase tracking-wide text-slate-400 py-1">
                                                {day}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-7 gap-y-1">
                                        {(() => {
                                            const today = new Date(now);
                                            const year = today.getFullYear();
                                            const month = today.getMonth();
                                            const firstDay = new Date(year, month, 1);
                                            const lastDay = new Date(year, month + 1, 0);
                                            const startDayOfWeek = firstDay.getDay();
                                            const daysInMonth = lastDay.getDate();

                                            const agendaMap = new Map<number, any[]>();
                                            agenda.forEach((item) => {
                                                try {
                                                    const d = new Date(item.tanggal);
                                                    if (d.getMonth() === month && d.getFullYear() === year) {
                                                        const dayNum = d.getDate();
                                                        if (!agendaMap.has(dayNum)) {
                                                            agendaMap.set(dayNum, []);
                                                        }
                                                        agendaMap.get(dayNum)!.push(item);
                                                    }
                                                } catch {}
                                            });

                                            const cells = [];
                                            for (let i = 0; i < startDayOfWeek; i++) {
                                                cells.push(<div key={`empty-${i}`} className="h-9" />);
                                            }
                                            for (let day = 1; day <= daysInMonth; day++) {
                                                const dateObj = new Date(year, month, day);
                                                const isToday = dateObj.toDateString() === today.toDateString();
                                                const hasAgenda = agendaMap.has(day);

                                                cells.push(
                                                    <button
                                                        key={day}
                                                        type="button"
                                                        onClick={() => {
                                                            const agendaHari = agendaMap.get(day);
                                                            if (agendaHari?.length) {
                                                                setSelectedAgenda(agendaHari[0]);
                                                            }
                                                        }}
                                                        disabled={!hasAgenda}
                                                        className={`h-9 w-full flex flex-col items-center justify-center rounded-md transition-colors ${
                                                            hasAgenda ? "cursor-pointer hover:bg-teal-50" : "cursor-default"
                                                        }`}
                                                    >
                                                        <div className={`relative w-7 h-7 flex items-center justify-center rounded-full text-[10px] font-medium transition-colors ${
                                                            isToday
                                                                ? "bg-teal-700 text-white font-bold"
                                                                : hasAgenda
                                                                ? "text-teal-700 font-bold"
                                                                : "text-slate-600"
                                                        }`}>
                                                            {day}
                                                            {hasAgenda && !isToday && (
                                                                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-teal-600" />
                                                            )}
                                                        </div>
                                                    </button>
                                                );
                                            }
                                            const totalCells = startDayOfWeek + daysInMonth;
                                            const remainingCells = (7 - (totalCells % 7)) % 7;
                                            for (let i = 0; i < remainingCells; i++) {
                                                cells.push(<div key={`empty-end-${i}`} className="h-9" />);
                                            }
                                            return cells;
                                        })()}
                                    </div>

                                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-4">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-teal-700" />
                                            <span className="text-[9px] text-slate-500">Ada kegiatan</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-slate-300" />
                                            <span className="text-[9px] text-slate-500">Hari berjalan</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Kolom Kanan - Daftar Agenda */}
                            <div className="flex flex-col">
                                <div className="px-5 sm:px-6 py-4 border-b border-slate-200 bg-slate-50/70">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-[10px] font-semibold text-teal-700 uppercase tracking-[0.15em] mb-1">
                                                Jadwal Kegiatan
                                            </p>
                                            <h3 className="text-base font-bold text-slate-800">Agenda Bulan Ini</h3>
                                        </div>
                                        <div className="flex-shrink-0 px-2.5 py-1 rounded-md bg-white border border-slate-200">
                                            <span className="text-[10px] font-semibold text-slate-600">
                                                {agenda.length} Kegiatan
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 sm:p-5 flex-1">
                                    <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                                        {agenda.slice(0, 8).map((item) => {
                                            let formattedDate = "";
                                            let formattedDay = "";
                                            try {
                                                const d = new Date(item.tanggal);
                                                formattedDate = d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
                                                formattedDay = d.toLocaleDateString("id-ID", { weekday: "short" });
                                            } catch {}

                                            return (
                                                <button
                                                    type="button"
                                                    key={item.id}
                                                    onClick={() => setSelectedAgenda(item)}
                                                    className="group w-full text-left flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-white hover:border-teal-100 hover:bg-teal-50/30 transition-all cursor-pointer"
                                                >
                                                    <div className="flex-shrink-0 w-11 text-center">
                                                        <div className="text-sm font-bold text-teal-700 leading-none">
                                                            {formattedDate.split(" ")[0]}
                                                        </div>
                                                        <div className="text-[8px] uppercase font-semibold text-slate-400 mt-1">
                                                            {formattedDate.split(" ").slice(1).join(" ")}
                                                        </div>
                                                    </div>
                                                    <div className="w-px h-8 bg-slate-200" />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-[11px] sm:text-xs font-semibold text-slate-700 leading-snug line-clamp-2">
                                                            {item.judul}
                                                        </p>
                                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                                            <span className="text-[8px] text-slate-400">{formattedDay}</span>
                                                            {item.waktu && (
                                                                <>
                                                                    <span className="w-0.5 h-0.5 rounded-full bg-slate-300" />
                                                                    <span className="text-[8px] text-slate-400">{item.waktu}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        <span className="block w-1.5 h-1.5 rounded-full bg-teal-600 opacity-70 group-hover:opacity-100" />
                                                    </div>
                                                </button>
                                            );
                                        })}
                                        {agenda.length > 8 && (
                                            <div className="pt-1 text-center">
                                                <span className="text-[9px] font-medium text-slate-400">
                                                    +{agenda.length - 8} agenda lainnya
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="px-5 py-3 border-t border-slate-200 bg-white flex items-center justify-between">
                                    <span className="text-[9px] text-slate-400">Informasi agenda kegiatan</span>
                                    <Link href="/agenda" className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-700 hover:text-teal-800 transition-colors">
                                        Lihat seluruh agenda
                                        <ChevronRight size={12} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-xl py-12 px-5 text-center shadow-sm">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                                <CalendarDays size={22} className="text-slate-300" />
                            </div>
                            <h3 className="text-sm font-semibold text-slate-600">Belum Ada Agenda Kegiatan</h3>
                            <p className="mt-1 text-[10px] sm:text-xs text-slate-400">
                                Belum terdapat agenda kegiatan yang dijadwalkan pada bulan ini.
                            </p>
                        </div>
                    )}

                    {/* ==========================================================
                        TESTIMONI SURVEY + CTA SURVEY (strip bersih)
                    ========================================================== */}
                    {testimoniSurvey.length > 0 && (
                        <div className="mt-14">
                            <div className="text-center mb-8">
                                <p className="text-teal-700 text-xs font-semibold tracking-wider uppercase mb-2">
                                    Suara Masyarakat
                                </p>
                                <h3 className="text-xl md:text-2xl font-semibold text-slate-900">
                                    Apa Kata Mereka
                                </h3>
                                <div className="w-10 h-0.5 bg-teal-600 mx-auto mt-3" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                                {testimoniSurvey.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-white border border-slate-200 rounded-xl p-5"
                                    >
                                        <p className="text-amber-400 text-sm tracking-wide mb-3">
                                            {"★".repeat(Math.min(5, Math.max(0, item.rating)))}
                                            {"☆".repeat(5 - Math.min(5, Math.max(0, item.rating)))}
                                        </p>
                                        <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                            "
                                            {item.saran?.trim() ||
                                                "Terima kasih atas layanan TP PKK Kabupaten Tasikmalaya."}
                                            "
                                        </p>
                                        <p className="text-sm font-semibold text-slate-800">
                                            {item.nama || "Anonim"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {isSurveyActive && (
                        <div className="mt-10 rounded-xl border border-slate-200 bg-white px-5 py-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-900">
                                    Survey kepuasan masyarakat
                                </p>
                                <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">
                                    Bantu penilaian singkat untuk peningkatan layanan informasi TP PKK.
                                </p>
                            </div>
                            <Link
                                href="/survey-kepuasan"
                                className="inline-flex items-center justify-center shrink-0 gap-2 bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
                            >
                                Isi survey
                                <ArrowRight size={16} aria-hidden="true" />
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* ==========================================================
                MODAL DETAIL AGENDA
            ========================================================== */}
            {selectedAgenda && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="agenda-modal-title"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            setSelectedAgenda(null);
                        }
                    }}
                >
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]" />
                    <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-100">
                        <div className="px-6 sm:px-8 pt-6 sm:pt-7">
                            <div className="flex items-start justify-between gap-4">
                                <span className="inline-flex items-center rounded-full bg-teal-50 border border-teal-100 px-3 py-1 text-[10px] sm:text-xs font-semibold text-teal-700">
                                    {selectedAgenda.kategori || "Kegiatan"}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setSelectedAgenda(null)}
                                    aria-label="Tutup detail agenda"
                                    className="flex-shrink-0 w-9 h-9 rounded-full border border-slate-300 bg-white flex items-center justify-center text-slate-500 hover:text-slate-800 hover:border-slate-400 hover:bg-slate-50 transition-colors"
                                >
                                    <X size={17} strokeWidth={1.8} />
                                </button>
                            </div>
                            <h3 id="agenda-modal-title" className="mt-5 text-xl sm:text-2xl lg:text-[28px] font-bold leading-tight text-slate-900 tracking-tight">
                                {selectedAgenda.judul}
                            </h3>
                        </div>

                        <div className="px-6 sm:px-8 py-6 space-y-3">
                            <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3.5">
                                <p className="text-[10px] sm:text-xs font-bold text-slate-800 mb-1">Tanggal</p>
                                <p className="text-xs sm:text-sm text-slate-500">
                                    {(() => {
                                        try {
                                            return new Date(selectedAgenda.tanggal).toLocaleDateString("id-ID", {
                                                weekday: "long",
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            });
                                        } catch {
                                            return selectedAgenda.tanggal;
                                        }
                                    })()}
                                </p>
                            </div>
                            {selectedAgenda.waktu && (
                                <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3.5">
                                    <p className="text-[10px] sm:text-xs font-bold text-slate-800 mb-1">Waktu</p>
                                    <p className="text-xs sm:text-sm text-slate-500">{selectedAgenda.waktu}</p>
                                </div>
                            )}
                            {selectedAgenda.lokasi && (
                                <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3.5">
                                    <p className="text-[10px] sm:text-xs font-bold text-slate-800 mb-1">Lokasi</p>
                                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{selectedAgenda.lokasi}</p>
                                </div>
                            )}
                            {selectedAgenda.deskripsi && (
                                <div className="pt-2">
                                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed whitespace-pre-line">
                                        {selectedAgenda.deskripsi}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="px-6 sm:px-8 py-4 border-t border-slate-100 bg-slate-50/60 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setSelectedAgenda(null)}
                                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}
