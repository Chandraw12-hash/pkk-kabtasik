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
        title: "Penguatan Karakter",
        desc: "Membentuk keluarga yang kokoh dengan peningkatan nilai Pancasila serta kepribadian luhur yang kuat.",
    },
    {
        icon: GraduationCap,
        title: "Pendidikan & Ekonomi",
        desc: "Meningkatkan standar pendidikan dan kemandirian ekonomi keluarga secara berkelanjutan melalui UMKM.",
    },
    {
        icon: Home,
        title: "Ketahanan Keluarga",
        desc: "Memastikan ketahanan keluarga yang kuat melalui pemenuhan kebutuhan dasar dan sistem perlindungan sosial yang responsif.",
    },
    {
        icon: Leaf,
        title: "Kesehatan Lingkungan",
        desc: "Meningkatkan derajat kesehatan keluarga serta kelestarian lingkungan hidup untuk masa depan yang berkelanjutan.",
    },
    {
        icon: Laptop,
        title: "Modernisasi Organisasi",
        desc: "Transformasi digital tata kelola organisasi PKK berbasis teknologi informasi untuk keterbukaan informasi publik bagi seluruh kader.",
    },
];

export default function VisiMisi() {
    const heroAnim = useScrollAnimation();
    const misiAnim = useScrollAnimation();
    const ctaAnim = useScrollAnimation();

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

            <Head title="Visi & Misi PKK - PKK Kabupaten Tasikmalaya" />
            <Navbar />

            {/* ==================== HERO ==================== */}
            <section
                ref={heroAnim.ref}
                className={`relative h-[420px] lg:h-[480px] flex items-center justify-center overflow-hidden anim-fade-up ${
                    heroAnim.isVisible ? "show" : ""
                }`}
            >
                <div className="absolute inset-0">
                    <img
                        src="/assets/images/hero.jpg"
                        alt="Visi & Misi PKK Kabupaten Tasikmalaya"
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                            e.currentTarget.src =
                                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80";
                        }}
                    />
                    <div className="absolute inset-0 bg-black/55" />
                </div>

                <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <span className="inline-block text-teal-300 text-xs font-semibold tracking-[0.2em] uppercase mb-5">
                        Arah &amp; Tujuan Strategis
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
                        Visi &amp; Misi PKK
                    </h1>
                    <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
                        Landasan arah dan tujuan Tim Penggerak PKK Kabupaten
                        Tasikmalaya dalam mewujudkan keluarga yang sejahtera dan
                        mandiri.
                    </p>
                </div>
            </section>

            {/* ==================== VISI ==================== */}
            <section className="py-20 lg:py-24 bg-white border-t border-slate-100">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-3">
                        Visi
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-snug">
                        &ldquo;Keluarga Sehat, Cerdas, Berakhlak &amp; Bertaqwa
                        Menuju Indonesia Maju&rdquo;
                    </h2>
                    <p className="text-slate-500 text-sm mt-4">
                        — Visi TP PKK Kabupaten Tasikmalaya
                    </p>
                </div>
            </section>

            {/* ==================== MISI ==================== */}
            <section
                ref={misiAnim.ref}
                className={`py-20 lg:py-24 bg-slate-50 border-t border-slate-100 anim-fade-up ${
                    misiAnim.isVisible ? "show" : ""
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-2">
                            Target Strategis
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                            Misi Strategis PKK
                        </h2>
                        <p className="text-slate-500 text-base max-w-2xl leading-relaxed">
                            Langkah nyata untuk mewujudkan kesejahteraan keluarga
                            melalui pendekatan karakter, ekonomi, dan teknologi
                            secara inklusif.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {misiList.map((misi, i) => (
                            <div
                                key={i}
                                className="bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center mb-4">
                                    <misi.icon
                                        size={18}
                                        className="text-teal-600"
                                    />
                                </div>
                                <h3 className="text-base font-semibold text-slate-900 mb-2">
                                    {misi.title}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    {misi.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ==================== CTA ==================== */}
            <section
                ref={ctaAnim.ref}
                className={`py-20 lg:py-24 bg-white border-t border-slate-100 anim-fade-up ${
                    ctaAnim.isVisible ? "show" : ""
                }`}
            >
                <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-3">
                        Bersama Tim Penggerak
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                        Mewujudkan Tasikmalaya Mandiri
                    </h2>
                    <p className="text-slate-500 text-base leading-relaxed max-w-lg mx-auto mb-8">
                        Bersama Tim Penggerak PKK, kita bangun keluarga Indonesia
                        yang lebih maju, sehat, dan berdaya.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Link
                            href="#"
                            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm px-6 py-2.5 rounded-full transition-colors"
                        >
                            Program Kerja
                            <ChevronRight size={15} />
                        </Link>
                        <Link
                            href="#"
                            className="inline-flex items-center gap-2 border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold text-sm px-6 py-2.5 rounded-full transition-colors"
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
