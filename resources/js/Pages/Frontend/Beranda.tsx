import React, { useEffect, useRef, useState } from "react";
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
    Calendar,
    ArrowRight,
    Target,
    Eye,
    Newspaper,
    Images,
    X,
} from "lucide-react";

// ============= INTERFACE =============
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
}

interface WelcomeProps {
    year?: number;
    berita?: BeritaItem[];
    galeri?: GaleriItem[];
}

const dataMenu = [
    {
        title: "Data Umum",
        desc: "Administrasi Tim Penggerak PKK & rekapitulasi profil kependudukan.",
        icon: Users,
        accent: "#0EA5E9",
        overlay: "#0F172A",
        link: "#",
    },
    {
        title: "Pokja I",
        desc: "Penghayatan Pengamalan Pancasila & pembinaan gotong royong.",
        icon: Heart,
        accent: "#3B82F6",
        overlay: "#0F172A",
        link: "#",
    },
    {
        title: "Pokja II",
        desc: "Pendidikan, keterampilan, dan pengembangan kehidupan berkoperasi.",
        icon: GraduationCap,
        accent: "#10B981",
        overlay: "#0F172A",
        link: "#",
    },
    {
        title: "Pokja III",
        desc: "Pangan, sandang, perumahan, dan tata laksana rumah tangga.",
        icon: Utensils,
        accent: "#EF4444",
        overlay: "#0F172A",
        link: "#",
    },
    {
        title: "Pokja IV",
        desc: "Kesehatan, kelestarian lingkungan, dan perencanaan sehat.",
        icon: Stethoscope,
        accent: "#14B8A6",
        overlay: "#0F172A",
        link: "#",
    },
    {
        title: "Website Utama",
        desc: "Kembali ke Portal Publik Pemerintah Kabupaten Tasikmalaya.",
        icon: Globe,
        accent: "#2563EB",
        overlay: "#0F172A",
        link: "https://tasikmalayakab.go.id/",
    },
];

const faqList = [
    {
        q: "Apa itu PKK dan apa tujuannya?",
        a: "PKK (Pemberdayaan dan Kesejahteraan Keluarga) adalah gerakan nasional yang tumbuh dari, oleh, dan untuk masyarakat, dengan tujuan mewujudkan keluarga yang beriman dan bertaqwa kepada Tuhan Yang Maha Esa, berakhlak mulia, sehat sejahtera, maju, dan mandiri.",
    },
    {
        q: "Apa saja 10 Program Pokok PKK?",
        a: "10 Program Pokok PKK meliputi Penghayatan dan Pengamalan Pancasila, Gotong Royong, Pangan, Sandang, Perumahan dan Tata Laksana Rumah Tangga, Pendidikan dan Keterampilan, Kesehatan, Pengembangan Kehidupan Berkoperasi, Kelestarian Lingkungan Hidup, serta Perencanaan Sehat.",
    },
    {
        q: "Bagaimana cara mengakses data dan laporan PKK?",
        a: "Masyarakat dan kader dapat mengakses rekapitulasi data umum serta laporan program kerja melalui menu Data PKK pada situs ini secara transparan dan akuntabel, sesuai tingkat wilayah masing-masing.",
    },
    {
        q: "Apa peran Tim Penggerak PKK Kabupaten Tasikmalaya?",
        a: "TP PKK Kabupaten Tasikmalaya berperan sebagai fasilitator, perencana, pelaksana, pengendali, dan penggerak pada setiap jenjang kepengurusan, dari kecamatan hingga desa/kelurahan, untuk mendukung pemberdayaan keluarga dan penanganan isu sosial seperti stunting serta kesehatan ibu dan anak.",
    },
    {
        q: "Bagaimana cara berpartisipasi dalam kegiatan PKK?",
        a: "Anda dapat berpartisipasi melalui kelompok Dasawisma terdekat di lingkungan tempat tinggal, atau berkoordinasi langsung dengan pengurus TP PKK tingkat Desa/Kelurahan dan Kecamatan setempat.",
    },
];

const misiList = [
    "Meningkatkan kualitas sumber daya manusia melalui pendidikan, keterampilan, dan pembinaan karakter keluarga.",
    "Mewujudkan keluarga yang sehat, sejahtera, dan mandiri melalui 10 Program Pokok PKK.",
    "Memperkuat gotong royong dan kepedulian sosial di seluruh jenjang masyarakat.",
    "Mendorong partisipasi aktif perempuan dalam pembangunan keluarga dan masyarakat.",
    "Menjaga kelestarian lingkungan hidup serta meningkatkan kualitas kehidupan keluarga yang berkelanjutan.",
];

function getBeritaImageSrc(item: BeritaItem): string | null {
    return item.foto_url || (item.foto ? `/storage/${item.foto}` : null) || item.image || null;
}

function formatBeritaTanggal(item: BeritaItem): string {
    if (item.created_at) {
        return new Date(item.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    }
    return item.tanggal || "Tanggal tidak tersedia";
}

function useScrollAnimation() {
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

        return () => {
            observer.unobserve(node);
        };
    }, []);

    return { ref, isVisible };
}

export default function Welcome({ year, berita = [], galeri = [] }: WelcomeProps) {
    const currentYear = year ?? new Date().getFullYear();

    // ============= DEBUG =============
    useEffect(() => {
        console.log("=== DATA BERITA DARI SERVER ===");
        console.log("Jumlah:", berita.length);
        console.log("Data:", berita);

        if (berita.length === 0) {
            console.warn("⚠️ TIDAK ADA DATA BERITA! Periksa database dan controller.");
        } else {
            console.log("✅ Data berita ditemukan!");
            berita.forEach((item, i) => {
                console.log(`[${i+1}] ${item.judul} | foto_url: ${item.foto_url}`);
            });
        }
    }, [berita]);

    // ============= DEBUG GALERI =============
    useEffect(() => {
        console.log("=== DATA GALERI DARI SERVER ===");
        console.log("Jumlah:", galeri.length);
        console.log("Data:", galeri);
    }, [galeri]);

    const beritaTerbaru = berita;
    const galeriData = galeri;

    const heroAnim = useScrollAnimation();
    const sambutanAnim = useScrollAnimation();
    const visiMisiAnim = useScrollAnimation();
    const dataAnim = useScrollAnimation();
    const faqAnim = useScrollAnimation();
    const beritaAnim = useScrollAnimation();
    const galeriAnim = useScrollAnimation();

    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const toggleFaq = (index: number) =>
        setOpenFaq(openFaq === index ? null : index);

    const [selectedBerita, setSelectedBerita] = useState<BeritaItem | null>(null);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSelectedBerita(null);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-slate-800 pt-14">
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
            `}</style>

            <Head>
                <title>
                    PKK Kabupaten Tasikmalaya - Sejahtera &amp; Mandiri
                </title>
                <meta
                    name="description"
                    content="Situs resmi Tim Penggerak PKK Kabupaten Tasikmalaya: informasi program kerja, data, kebijakan, dan berita seputar pemberdayaan dan kesejahteraan keluarga."
                />
            </Head>

            <Navbar />

            {/* ==================== HERO ==================== */}
            <section
                ref={heroAnim.ref}
                className={`relative h-[580px] lg:h-[640px] flex items-center justify-center overflow-hidden anim-fade-up ${
                    heroAnim.isVisible ? "show" : ""
                }`}
            >
                <div className="absolute inset-0">
                    <img
                        src="/assets/images/hero.jpg"
                        alt="Kegiatan Tim Penggerak PKK Kabupaten Tasikmalaya"
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                            e.currentTarget.src =
                                "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80";
                        }}
                    />
                    <div className="absolute inset-0 bg-black/55" />
                </div>

                <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <span className="inline-block text-teal-300 text-xs font-semibold tracking-[0.2em] uppercase mb-5">
                        Tim Penggerak PKK Kabupaten Tasikmalaya
                    </span>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
                        Membangun Keluarga
                        <br />
                        Sejahtera &amp; Mandiri
                        <br />
                        bersama PKK
                    </h1>

                    <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-8">
                        Media informasi resmi Tim Penggerak PKK Kabupaten
                        Tasikmalaya dalam mewujudkan pemberdayaan dan
                        kesejahteraan keluarga.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Link
                            href="#tentang"
                            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm px-6 py-2.5 rounded-full transition-colors"
                        >
                            Jelajahi Program
                            <ArrowRight size={15} />
                        </Link>
                        <Link
                            href="#data"
                            className="inline-flex items-center gap-2 border border-white/50 hover:bg-white/10 text-white font-semibold text-sm px-6 py-2.5 rounded-full transition-colors"
                        >
                            Lihat Data PKK
                        </Link>
                    </div>
                </div>
            </section>

            {/* ==================== SAMBUTAN KETUA ==================== */}
            <section
                ref={sambutanAnim.ref}
                id="tentang"
                className={`py-20 lg:py-24 bg-white border-t border-slate-100 anim-fade-up ${
                    sambutanAnim.isVisible ? "show" : ""
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
                        <div className="w-full lg:w-5/12">
                            <div className="rounded-xl overflow-hidden border border-slate-200">
                                <img
                                    src="/assets/images/ketuapkk.png"
                                    alt=" Hj. Retno Widyastuti, S.E, Ketua TP PKK Kabupaten Tasikmalaya"
                                    loading="lazy"
                                    className="w-full h-[420px] md:h-[480px] object-cover object-top"
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80";
                                    }}
                                />
                            </div>
                            <div className="mt-4">
                                <h3 className="text-lg font-bold text-slate-900">
                                    Hj. Retno Widyastuti, S.E
                                </h3>
                                <p className="text-sm text-slate-500 mt-0.5">
                                    Ketua TP PKK Kabupaten Tasikmalaya
                                </p>
                            </div>
                        </div>

                        <div className="w-full lg:w-7/12">
                            <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-2">
                                Sambutan
                            </p>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                                Sambutan Ketua PKK
                            </h2>

                            <div className="space-y-4 text-slate-600 text-[15px] leading-relaxed">
                                <p className="italic text-slate-700">
                                    Assalamu&apos;alaikum Warahmatullahi
                                    Wabarakatuh,
                                </p>
                                <p>
                                    Dalam rangka turut menyukseskan program
                                    Pembangunan Daerah Kabupaten Tasikmalaya,
                                    selamat datang di Website Resmi TP PKK
                                    Kabupaten Tasikmalaya. Puji dan syukur kami
                                    panjatkan kepada Allah SWT atas segala
                                    nikmat yang diberikan.
                                </p>
                                <p>
                                    Website ini hadir sebagai media informasi
                                    dan publikasi untuk memenuhi kebutuhan
                                    informasi masyarakat mengenai berbagai
                                    kegiatan dan 10 Program Pokok PKK di
                                    Kabupaten Tasikmalaya secara transparan dan
                                    akuntabel.
                                </p>
                                <p>
                                    Saya mengajak seluruh pengurus, kader, dan
                                    masyarakat untuk bersama-sama memajukan PKK
                                    dalam rangka mewujudkan kesejahteraan
                                    keluarga, khususnya di wilayah Kabupaten
                                    Tasikmalaya yang kita cintai ini.
                                </p>
                                <p>
                                    Semoga website ini bermanfaat dalam
                                    meningkatkan kualitas layanan informasi
                                    publik. Terima kasih.
                                </p>
                                <p className="italic text-slate-700 pt-2">
                                    Wassalamu&apos;alaikum Warahmatullahi
                                    Wabarakatuh.
                                </p>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-200">
                                <p className="font-semibold text-slate-900">
                                    Hj. Retno Widyastuti, S.E
                                </p>
                                <p className="text-sm text-slate-500 mt-0.5">
                                    Ketua TP PKK Kabupaten Tasikmalaya
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== VISI & MISI ==================== */}
            <section
                ref={visiMisiAnim.ref}
                className={`py-20 lg:py-24 bg-white border-t border-slate-100 anim-fade-up ${
                    visiMisiAnim.isVisible ? "show" : ""
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-2">
                            Arah Gerakan
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                            Visi &amp; Misi PKK
                        </h2>
                        <p className="text-slate-500 text-base max-w-2xl leading-relaxed">
                            Landasan arah dan tujuan Tim Penggerak PKK Kabupaten
                            Tasikmalaya dalam mewujudkan keluarga yang sejahtera
                            dan mandiri.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center">
                                    <Eye className="text-teal-600" size={18} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">
                                    Visi
                                </h3>
                            </div>
                            <p className="text-slate-600 text-[15px] leading-relaxed pl-12">
                                Terwujudnya keluarga yang beriman dan bertaqwa
                                kepada Tuhan Yang Maha Esa, berakhlak mulia,
                                sehat sejahtera, maju dan mandiri di Kabupaten
                                Tasikmalaya.
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center">
                                    <Target
                                        className="text-teal-600"
                                        size={18}
                                    />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">
                                    Misi
                                </h3>
                            </div>
                            <ol className="space-y-3 pl-12">
                                {misiList.map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex gap-3 text-slate-600 text-[15px] leading-relaxed"
                                    >
                                        <span className="font-semibold text-teal-600 min-w-[20px]">
                                            {index + 1}.
                                        </span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== DATA / POKJA ==================== */}
            <section
                ref={dataAnim.ref}
                id="data"
                className={`py-20 lg:py-24 bg-white border-t border-slate-100 anim-fade-up ${
                    dataAnim.isVisible ? "show" : ""
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                            Data PKK Kabupaten Tasikmalaya
                        </h2>
                        <div className="w-12 h-0.5 bg-teal-600 mx-auto mb-4" />
                        <p className="text-slate-500 text-base max-w-xl mx-auto">
                            Pusat Informasi dan Statistik Program Pokok PKK
                            secara Terpadu
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dataMenu.map((item, i) => (
                            <div
                                key={i}
                                className="group relative h-[280px] rounded-2xl overflow-hidden"
                            >
                                <div
                                    className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                                    style={{ backgroundColor: item.overlay }}
                                />
                                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/45 transition-colors duration-300" />

                                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 shadow-md"
                                        style={{
                                            backgroundColor: item.accent,
                                        }}
                                    >
                                        <item.icon size={22} />
                                    </div>

                                    <h3 className="text-white font-bold text-lg tracking-wide uppercase mb-2">
                                        {item.title}
                                    </h3>

                                    <p className="text-slate-200 text-sm leading-relaxed mb-5 max-w-[240px]">
                                        {item.desc}
                                    </p>

                                    {item.link.startsWith("http") ? (
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block bg-white/15 hover:bg-white text-white hover:text-slate-900 border border-white/40 px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200"
                                        >
                                            Eksplorasi
                                        </a>
                                    ) : (
                                        <Link
                                            href={item.link}
                                            className="inline-block bg-white/15 hover:bg-white text-white hover:text-slate-900 border border-white/40 px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200"
                                        >
                                            Eksplorasi
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ==================== FAQ ==================== */}
            <section
                ref={faqAnim.ref}
                className={`py-20 lg:py-24 bg-white border-t border-slate-100 anim-fade-up ${
                    faqAnim.isVisible ? "show" : ""
                }`}
            >
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-2">
                            Pertanyaan Umum
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                            Pertanyaan yang Sering Diajukan
                        </h2>
                        <p className="text-slate-500 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
                            Temukan informasi seputar gerakan, program kerja,
                            dan layanan Tim Penggerak PKK Kabupaten Tasikmalaya.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {faqList.map((faq, index) => {
                            const isOpen = openFaq === index;
                            const panelId = `faq-panel-${index}`;
                            const buttonId = `faq-button-${index}`;

                            return (
                                <div
                                    key={index}
                                    className={`border rounded-xl transition-all duration-200 overflow-hidden ${
                                        isOpen
                                            ? "border-teal-400 shadow-sm bg-white"
                                            : "border-slate-200 hover:border-slate-300 bg-white"
                                    }`}
                                >
                                    <h3>
                                        <button
                                            id={buttonId}
                                            type="button"
                                            onClick={() => toggleFaq(index)}
                                            aria-expanded={isOpen}
                                            aria-controls={panelId}
                                            className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-xl"
                                        >
                                            <span className="font-semibold text-slate-900 text-sm md:text-base">
                                                {faq.q}
                                            </span>
                                            <span
                                                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                                                    isOpen
                                                        ? "bg-teal-600 text-white rotate-90"
                                                        : "bg-slate-100 text-slate-500"
                                                }`}
                                            >
                                                <ChevronRight size={16} />
                                            </span>
                                        </button>
                                    </h3>

                                    <div
                                        id={panelId}
                                        role="region"
                                        aria-labelledby={buttonId}
                                        className={`transition-all duration-200 ease-in-out overflow-hidden px-5 ${
                                            isOpen
                                                ? "max-h-80 pb-5 opacity-100"
                                                : "max-h-0 pb-0 opacity-0"
                                        }`}
                                    >
                                        <div className="pt-2 border-t border-slate-100 text-slate-600 text-sm leading-relaxed">
                                            {faq.a}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ==================== BERITA ==================== */}
            <section
                ref={beritaAnim.ref}
                className={`py-20 lg:py-24 bg-slate-50 border-t border-slate-100 anim-fade-up ${
                    beritaAnim.isVisible ? "show" : ""
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
                        <div>
                            <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-2">
                                Update Informasi
                            </p>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                                Berita PKK Terkini
                            </h2>
                        </div>
                        <Link
                            href={route("fe.berita")}
                            className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                        >
                            Lihat semua berita
                            <ChevronRight size={15} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {beritaTerbaru.length > 0 ? (
                            beritaTerbaru.map((item) => (
                                <article
                                    key={item.id}
                                    className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-colors flex flex-col h-full"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setSelectedBerita(item)}
                                        className="h-48 overflow-hidden bg-slate-100 flex items-center justify-center w-full text-left"
                                    >
                                        {(() => {
                                            const imageSrc = getBeritaImageSrc(item);

                                            if (imageSrc) {
                                                return (
                                                    <img
                                                        src={imageSrc}
                                                        alt={item.judul}
                                                        loading="lazy"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            const target = e.currentTarget;
                                                            const currentSrc = target.src;

                                                            if (currentSrc.includes('/storage/')) {
                                                                const newSrc = currentSrc.replace('/storage/', '/');
                                                                if (newSrc !== currentSrc) {
                                                                    target.src = newSrc;
                                                                    return;
                                                                }
                                                            }

                                                            target.style.display = 'none';
                                                            const parent = target.parentElement;
                                                            if (parent) {
                                                                const fallback = document.createElement('div');
                                                                fallback.className = 'flex items-center justify-center w-full h-full';
                                                                fallback.innerHTML = `
                                                                    <svg class="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                                                    </svg>
                                                                `;
                                                                parent.appendChild(fallback);
                                                            }
                                                        }}
                                                    />
                                                );
                                            }

                                            return <Newspaper size={40} className="text-slate-400" />;
                                        })()}
                                    </button>

                                    <div className="p-5 flex flex-col flex-grow">
                                        <p className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
                                            <Calendar size={12} />
                                            {item.created_at
                                                ? new Date(item.created_at).toLocaleDateString("id-ID", {
                                                      day: "numeric",
                                                      month: "long",
                                                      year: "numeric",
                                                  })
                                                : item.tanggal || "Tanggal tidak tersedia"}
                                        </p>

                                        <h3 className="font-bold text-slate-900 text-base mb-2 line-clamp-2">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedBerita(item)}
                                                className="hover:text-teal-600 transition-colors text-left"
                                            >
                                                {item.judul}
                                            </button>
                                        </h3>

                                        <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-grow">
                                            {item.deskripsi ||
                                             item.deskripsi_singkat ||
                                             item.konten?.replace(/<[^>]*>?/gm, '').substring(0, 150) ||
                                             "Tidak ada deskripsi"}
                                        </p>

                                        <button
                                            type="button"
                                            onClick={() => setSelectedBerita(item)}
                                            className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700 mt-auto"
                                        >
                                            Baca selengkapnya
                                            <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <Newspaper size={48} className="text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500 text-lg">
                                    Belum ada berita terbaru.
                                </p>
                                <p className="text-slate-400 text-sm mt-1">
                                    Silakan tambahkan berita melalui dashboard admin.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ==================== GALERI (PURE FOTO TANPA DESKRIPSI) ==================== */}
            <section
                ref={galeriAnim.ref}
                className={`py-20 lg:py-24 bg-white border-t border-slate-100 anim-fade-up ${
                    galeriAnim.isVisible ? "show" : ""
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
                        <div>
                            <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-2">
                                Dokumentasi
                            </p>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                                Galeri Foto Kegiatan
                            </h2>
                        </div>
                        <Link
                            href={route("fe.program.galeriKegiatan")}
                            className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                        >
                            Lihat semua foto
                            <ChevronRight size={15} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {galeriData.length > 0 ? (
                            galeriData.map((item) => {
                                const imageSrc = item.foto_url || (item.foto ? `/storage/${item.foto}` : null);

                                return (
                                    <div
                                        key={item.id}
                                        className="group relative aspect-square bg-slate-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                                    >
                                        {imageSrc ? (
                                            <img
                                                src={imageSrc}
                                                alt="Kegiatan PKK"
                                                loading="lazy"
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                onError={(e) => {
                                                    const target = e.currentTarget;
                                                    target.style.display = 'none';
                                                    const parent = target.parentElement;
                                                    if (parent) {
                                                        const fallback = document.createElement('div');
                                                        fallback.className = 'flex items-center justify-center w-full h-full bg-slate-100';
                                                        fallback.innerHTML = `
                                                            <svg class="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        `;
                                                        parent.appendChild(fallback);
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full bg-slate-100">
                                                <Images size={32} className="text-slate-400" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <Images size={48} className="text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500 text-lg">
                                    Belum ada foto kegiatan.
                                </p>
                                <p className="text-slate-400 text-sm mt-1">
                                    Silakan tambahkan galeri foto melalui dashboard admin.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ==================== MODAL DETAIL BERITA ==================== */}
            {selectedBerita && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="berita-modal-title"
                >
                    <div
                        className="absolute inset-0 bg-slate-900/60"
                        onClick={() => setSelectedBerita(null)}
                    />
                    <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
                        <button
                            type="button"
                            onClick={() => setSelectedBerita(null)}
                            aria-label="Tutup"
                            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-500 hover:text-slate-900 flex items-center justify-center shadow-md transition-colors"
                        >
                            <X size={18} />
                        </button>

                        {(() => {
                            const imageSrc = getBeritaImageSrc(selectedBerita);
                            return imageSrc ? (
                                <div className="h-56 sm:h-72 overflow-hidden bg-slate-100">
                                    <img
                                        src={imageSrc}
                                        alt={selectedBerita.judul}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                        }}
                                    />
                                </div>
                            ) : null;
                        })()}

                        <div className="p-6 sm:p-8">
                            <p className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
                                <Calendar size={12} />
                                {formatBeritaTanggal(selectedBerita)}
                            </p>

                            <h2
                                id="berita-modal-title"
                                className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 leading-snug"
                            >
                                {selectedBerita.judul}
                            </h2>

                            {selectedBerita.konten ? (
                                <div
                                    className="text-slate-600 text-[15px] leading-relaxed space-y-4"
                                    dangerouslySetInnerHTML={{ __html: selectedBerita.konten }}
                                />
                            ) : (
                                <p className="text-slate-600 text-[15px] leading-relaxed">
                                    {selectedBerita.deskripsi ||
                                        selectedBerita.deskripsi_singkat ||
                                        "Tidak ada deskripsi."}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}