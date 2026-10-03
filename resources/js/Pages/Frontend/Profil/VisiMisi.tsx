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

// ============================================================
// HOOK SCROLL ANIMATION
// ============================================================

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
            { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
        );
        if (ref.current) observer.observe(ref.current);
        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, []);

    return { ref, isVisible };
}

// ============================================================
// DATA MISI
// ============================================================

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

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function VisiMisi() {
    const mainAnim = useScrollAnimation();
    const posterAnim = useScrollAnimation();
    const ctaAnim = useScrollAnimation();

    return (
        <div className="min-h-screen flex flex-col bg-white font-['Poppins',_sans-serif] text-slate-800">
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
                <title>Visi &amp; Misi — TP PKK Kabupaten Tasikmalaya</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <Navbar />

            {/* ====================================================
                SECTION 1 — VISI & MISI
            ==================================================== */}
            <section
                ref={mainAnim.ref}
                className={`py-16 sm:py-20 bg-white anim-fade-up ${
                    mainAnim.isVisible ? "show" : ""
                }`}
            >
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* ---------- VISI ---------- */}
                    <div className="text-center mb-16">
                        <p className="text-[#0072BC] text-xs font-semibold tracking-wider uppercase mb-3">
                            Visi
                        </p>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-8">
                            Visi Gerakan TP PKK
                        </h2>

                        <div className="max-w-2xl mx-auto">
                            <p className="text-slate-800 text-base sm:text-lg leading-relaxed italic">
                                &ldquo;Terwujudnya keluarga berdaya dan
                                sejahtera untuk mendukung asta cita menuju
                                Indonesia emas 2045&rdquo;
                            </p>
                        </div>
                    </div>

                    {/* ---------- MISI ---------- */}
                    <div className="text-center mb-10">
                        <p className="text-[#0072BC] text-xs font-semibold tracking-wider uppercase mb-3">
                            Misi
                        </p>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
                            Misi Gerakan PKK
                        </h2>
                        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto">
                            Untuk mewujudkan visi tersebut, Gerakan PKK
                            menetapkan sejumlah misi sebagai landasan gerak dan
                            strategi implementatif.
                        </p>
                    </div>

                    {/* Grid Misi */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {misiList.map((misi, i) => {
                            const Icon = misi.icon;
                            const isLastRow = i >= 3 && misiList.length === 5;

                            return (
                                <div
                                    key={i}
                                    className={`bg-white border border-slate-200 rounded-xl p-5 sm:p-6 hover:border-slate-300 transition-colors flex flex-col ${
                                        isLastRow && i === 3
                                            ? "sm:col-span-2 lg:col-span-1 lg:col-start-1"
                                            : ""
                                    } ${
                                        isLastRow && i === 4
                                            ? "sm:col-span-2 lg:col-span-1 lg:col-start-2"
                                            : ""
                                    }`}
                                >
                                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center mb-4">
                                        <Icon
                                            size={18}
                                            className="text-[#0072BC]"
                                        />
                                    </div>
                                    <h3 className="text-slate-900 font-semibold text-[15px] mb-2 leading-snug">
                                        {misi.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm leading-relaxed flex-1">
                                        {misi.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ====================================================
                SECTION 2 — POSTER INFOGRAFIS (KECIL)
            ==================================================== */}
            <section
                ref={posterAnim.ref}
                className={`py-14 bg-slate-50 border-t border-slate-100 anim-fade-up ${
                    posterAnim.isVisible ? "show" : ""
                }`}
            >
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-12">
                        {/* Poster — KECIL */}
                        <div className="shrink-0">
                            <div className="w-48 sm:w-56 rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-white">
                                <img
                                    src="/assets/images/Visi%20Misi%20PKK.jpg"
                                    alt="Poster Visi Misi Gerakan PKK"
                                    className="w-full h-auto block"
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            "/assets/images/Visi Misi PKK.png";
                                    }}
                                />
                            </div>
                        </div>

                        {/* Teks + Tombol */}
                        <div className="flex-1 text-center sm:text-left">
                            <p className="text-[#0072BC] text-xs font-semibold tracking-wider uppercase mb-2">
                                Dokumentasi Resmi
                            </p>
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-3">
                                Infografis Visi &amp; Misi
                            </h2>
                            <p className="text-slate-500 text-sm leading-relaxed mb-5 max-w-md">
                                Lihat atau unduh poster resmi Visi dan Misi
                                Gerakan PKK Kabupaten Tasikmalaya.
                            </p>

                            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                                <a
                                    href="/assets/images/Visi%20Misi%20PKK.jpg"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs px-4 py-2 rounded-md transition-colors"
                                >
                                    <Eye size={14} />
                                    Lihat Penuh
                                </a>
                                <a
                                    href="/assets/images/Visi%20Misi%20PKK.jpg"
                                    download
                                    className="inline-flex items-center gap-2 bg-[#0072BC] hover:bg-[#005A94] text-white font-medium text-xs px-4 py-2 rounded-md transition-colors"
                                >
                                    <Download size={14} />
                                    Unduh
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ====================================================
                SECTION 3 — CTA
            ==================================================== */}
            <section
                ref={ctaAnim.ref}
                className={`py-16 bg-white border-t border-slate-100 anim-fade-up ${
                    ctaAnim.isVisible ? "show" : ""
                }`}
            >
                <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-3">
                        Mewujudkan Tasikmalaya Mandiri &amp; Sejahtera
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                        Mari bersama-sama membangun keluarga Indonesia yang
                        lebih maju, berdaya, dan berkualitas.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <Link
                            href="/program/program-kerja"
                            className="inline-flex items-center gap-2 bg-[#0072BC] hover:bg-[#005A94] text-white font-medium text-xs px-4 py-2 rounded-md transition-colors"
                        >
                            Program Kerja
                            <ChevronRight size={14} />
                        </Link>
                        <Link
                            href="/#kontak"
                            className="inline-flex items-center gap-2 border border-slate-200 hover:border-slate-300 text-slate-700 font-medium text-xs px-4 py-2 rounded-md transition-colors bg-white"
                        >
                            <Mail size={14} />
                            Kontak Kami
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
