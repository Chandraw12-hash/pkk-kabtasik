import React, { useEffect, useRef, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import {
    Users,
    GraduationCap,
    Home,
    Leaf,
    Laptop,
    ChevronRight,
    Mail,
    Download,
    Eye,
} from "lucide-react";

function useScrollAnimation() {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
        );
        if (ref.current) observer.observe(ref.current);
        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, []);

    return { ref, isVisible };
}

const misiList = [
    {
        icon: Users,
        title: "Pancasila & HAM",
        desc: "Memperkokoh nilai Pancasila, gotong royong dan demokrasi dalam kehidupan keluarga serta meningkatkan kesadaran akan hak asasi manusia.",
    },
    {
        icon: GraduationCap,
        title: "Pendidikan & Ekonomi",
        desc: "Meningkatkan kualitas pendidikan dan keterampilan serta penguatan ekonomi keluarga.",
    },
    {
        icon: Home,
        title: "Ketahanan & Kemandirian Keluarga",
        desc: "Memantapkan ketahanan dan kemandirian keluarga melalui penguatan pangan lokal, pelestarian sandang berbasis budaya lokal yang beretika, serta peningkatan kualitas hunian dan tata laksana rumah tangga yang sehat, tertib, dan berkelanjutan.",
    },
    {
        icon: Leaf,
        title: "PHBS & Lingkungan Hidup",
        desc: "Menggerakkan keluarga dalam perilaku hidup bersih dan sehat, melestarikan lingkungan hidup dan meningkatkan pembinaan keluarga berencana menuju keluarga berkualitas.",
    },
    {
        icon: Laptop,
        title: "Kelembagaan & Teknologi Informasi",
        desc: "Memperkuat kelembagaan PKK yang lebih sistematis dan terencana, serta mendorong pemanfaatan teknologi informasi.",
    },
];

export default function VisiMisi() {
    const heroAnim = useScrollAnimation();
    const visiAnim = useScrollAnimation();
    const misiAnim = useScrollAnimation();
    const posterAnim = useScrollAnimation();
    const ctaAnim = useScrollAnimation();

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-slate-800">
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

            <Head title="Visi & Misi Gerakan PKK - TP PKK Kabupaten Tasikmalaya" />
            <Navbar />

            {/* ==================== HERO ==================== */}
            <section
                ref={heroAnim.ref}
                className={`relative min-h-[380px] lg:min-h-[420px] flex items-center justify-center overflow-hidden pt-20 pb-12 anim-fade-up ${
                    heroAnim.isVisible ? "show" : ""
                }`}
            >
                <div className="absolute inset-0">
                    <img
                        src="/assets/images/hero.jpg"
                        alt="Visi Misi Gerakan PKK"
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                            e.currentTarget.src =
                                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80";
                        }}
                    />
                    <div className="absolute inset-0 bg-black/60" />
                </div>

                <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <div className="flex justify-center mb-3">
                        <img
                            src="/assets/logo/logotasik.png"
                            alt="Logo PKK"
                            className="h-14 w-auto drop-shadow-md"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    </div>
                    <span className="inline-block text-teal-300 text-xs font-semibold tracking-[0.2em] uppercase mb-2">
                        TP PKK Kabupaten Tasikmalaya
                    </span>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
                        VISI DAN MISI GERAKAN PKK
                    </h1>
                </div>
            </section>

            {/* ==================== VISI ==================== */}
            <section
                ref={visiAnim.ref}
                className={`py-12 lg:py-16 bg-white anim-fade-up ${
                    visiAnim.isVisible ? "show" : ""
                }`}
            >
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-teal-600 text-lg md:text-xl font-bold tracking-wider uppercase mb-3">
                        VISI
                    </h2>
                    <div className="bg-teal-50/70 border border-teal-100 rounded-2xl p-6 sm:p-8 shadow-sm">
                        <p className="text-slate-900 text-base sm:text-lg font-medium leading-relaxed">
                            &ldquo;Terwujudnya keluarga berdaya dan sejahtera untuk mendukung asta cita menuju Indonesia emas 2045&rdquo;
                        </p>
                    </div>
                </div>
            </section>

            {/* ==================== MISI (KARTU) ==================== */}
            <section
                ref={misiAnim.ref}
                className={`py-12 lg:py-16 bg-slate-50 border-t border-slate-100 anim-fade-up ${
                    misiAnim.isVisible ? "show" : ""
                }`}
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 text-center max-w-3xl mx-auto">
                        <h2 className="text-teal-600 text-lg md:text-xl font-bold tracking-wider uppercase mb-2">
                            MISI
                        </h2>
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                            Untuk mewujudkan visi tersebut, Gerakan PKK menetapkan sejumlah misi yang menjadi landasan gerak dan strategi implementatif:
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {misiList.map((misi, i) => (
                            <div
                                key={i}
                                className={`bg-white border border-slate-200 rounded-xl p-6 hover:border-teal-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between ${
                                    i === 4 ? "md:col-span-2 lg:col-span-1" : ""
                                }`}
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                                            <misi.icon size={18} className="text-teal-600" />
                                        </div>
                                        <span className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
                                            {i + 1}
                                        </span>
                                    </div>
                                    <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                                        {misi.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ==================== BAGIAN POSTER / INFOGRAFIS RESMI ==================== */}
            <section
                ref={posterAnim.ref}
                className={`py-12 lg:py-16 bg-white border-t border-slate-100 anim-fade-up ${
                    posterAnim.isVisible ? "show" : ""
                }`}
            >
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-teal-600 text-xs font-semibold tracking-[0.2em] uppercase mb-2 block">
                        Dokumentasi Resmi
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">
                        Infografis Visi &amp; Misi PKK
                    </h2>
                    <p className="text-slate-500 text-sm sm:text-base mb-6 max-w-xl mx-auto">
                        Anda juga dapat melihat atau mengunduh infografis poster resmi Visi dan Misi Gerakan PKK di bawah ini.
                    </p>

                    {/* Kotak Preview Gambar Poster */}
                    <div className="relative group rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900 max-w-sm mx-auto mb-6">
                        <img
                            src="/assets/images/Visi%20Misi%20PKK.jpg"
                            alt="Poster Visi Misi Gerakan PKK"
                            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                                e.currentTarget.src = "/assets/images/Visi Misi PKK.png";
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-6">
                            <span className="text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                                Infografis Resmi PKK
                            </span>
                        </div>
                    </div>

                    {/* Tombol Aksi untuk Poster */}
                    <div className="flex flex-wrap justify-center gap-3">
                        <a
                            href="/assets/images/Visi%20Misi%20PKK.jpg"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm px-4 py-2 rounded-full transition-colors"
                        >
                            <Eye size={15} /> Lihat Ukuran Penuh
                        </a>
                        <a
                            href="/assets/images/Visi%20Misi%20PKK.jpg"
                            download
                            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-full transition-colors shadow-sm"
                        >
                            <Download size={15} /> Unduh Poster
                        </a>
                    </div>
                </div>
            </section>

            {/* ==================== CTA ==================== */}
            <section
                ref={ctaAnim.ref}
                className={`py-12 lg:py-16 bg-slate-50 border-t border-slate-100 anim-fade-up ${
                    ctaAnim.isVisible ? "show" : ""
                }`}
            >
                <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">
                        Mewujudkan Tasikmalaya Mandiri &amp; Sejahtera
                    </h2>
                    <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-lg mx-auto mb-6">
                        Mari bersama-sama membangun keluarga Indonesia yang lebih maju, berdaya, dan berkualitas.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Link
                            href="#"
                            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-colors shadow-sm"
                        >
                            Program Kerja
                            <ChevronRight size={15} />
                        </Link>
                        <Link
                            href="#"
                            className="inline-flex items-center gap-2 border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-colors bg-white"
                        >
                            <Mail size={15} />
                            Kontak Kami
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
