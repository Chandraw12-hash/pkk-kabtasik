import React, { useEffect, useRef, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import {
    Quote,
    Users,
    GraduationCap,
    Home,
    Leaf,
    Laptop,
    ChevronRight,
    Mail,
    Sparkles,
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
            { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
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
        desc: "Membentuk keluarga-keluarga yang kokoh dengan peningkatan nilai Pancasila serta kepribadian luhur yang kuat.",
        color: "text-[#38BDF8]",
        bg: "bg-[#38BDF8]/10",
    },
    {
        icon: GraduationCap,
        title: "Pendidikan & Ekonomi",
        desc: "Meningkatkan standar pendidikan dan kemandirian ekonomi keluarga secara berkelanjutan melalui UMKM.",
        color: "text-emerald-500",
        bg: "bg-emerald-50",
    },
    {
        icon: Home,
        title: "Ketahanan Keluarga",
        desc: "Memastikan ketahanan keluarga yang kuat melalui pemenuhan kebutuhan dasar dan sistem perlindungan sosial yang responsif.",
        color: "text-indigo-500",
        bg: "bg-indigo-50",
    },
    {
        icon: Leaf,
        title: "Kesehatan Lingkungan",
        desc: "Meningkatkan derajat kesehatan keluarga serta kelestarian lingkungan hidup sebagaimana lanjut masa depan.",
        color: "text-teal-500",
        bg: "bg-teal-50",
    },
    {
        icon: Laptop,
        title: "Modernisasi Organisasi",
        desc: "Transformasi digital tata kelola organisasi PKK berbasis teknologi informasi sebagai media informasi seluruh daerah dan keterbukaan informasi publik bagi seluruh kader.",
        color: "text-violet-500",
        bg: "bg-violet-50",
    },
];

export default function VisiMisi() {
    const heroAnim = useScrollAnimation();
    const misiAnim = useScrollAnimation();
    const ctaAnim = useScrollAnimation();

    return (
        <div
            className="min-h-screen flex flex-col bg-white font-sans text-slate-900 pt-14"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
            <style>{`::-webkit-scrollbar { display: none; } .anim-fade-up { opacity: 0; transform: translateY(28px); transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); } .anim-fade-up.show { opacity: 1; transform: translateY(0); }`}</style>

            <Head title="Visi & Misi PKK - PKK Kabupaten Tasikmalaya" />
            <Navbar />

            {/* ── HERO ── */}
            <section
                ref={heroAnim.ref}
                className={`relative min-h-[520px] lg:min-h-[580px] flex items-center overflow-hidden anim-fade-up ${heroAnim.isVisible ? "show" : ""}`}
            >
                <div className="absolute inset-0 w-full h-full">
                    <img
                        src="/assets/images/hero.jpg"
                        alt="Visi & Misi PKK Kabupaten Tasikmalaya"
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                            e.currentTarget.src =
                                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80";
                        }}
                    />
                    <div className="absolute inset-0 bg-[#071330]/80"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
                    <div className="flex flex-col items-center text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 text-[#38BDF8] text-xs font-bold tracking-widest uppercase mb-5">
                            <Sparkles size={14} />
                            <span>Arah &amp; Tujuan Strategis</span>
                        </div>

                        {/* Judul */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-10">
                            Visi &amp; Misi PKK
                        </h1>

                        {/* Visi Card */}
                        <div className="w-full max-w-2xl">
                            <p className="text-[#38BDF8] text-xs font-extrabold tracking-widest uppercase mb-3">
                                VISI UTAMA
                            </p>
                            <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl px-8 py-8 shadow-2xl">
                                <Quote
                                    size={48}
                                    className="text-[#38BDF8]/40 absolute -top-3 left-6"
                                />
                                <div className="flex items-start gap-5 pt-2">
                                    <span className="text-7xl font-black text-white/10 leading-none select-none">
                                        99
                                    </span>
                                    <blockquote className="text-left">
                                        <p className="text-white text-xl md:text-2xl font-extrabold leading-snug">
                                            "Keluarga Sehat, Cerdas, Berakhlak &amp; Bertaqwa
                                            Menuju Indonesia Maju"
                                        </p>
                                        <p className="text-gray-400 text-sm mt-3 font-medium">
                                            — Visi TP PKK Kabupaten Tasikmalaya
                                        </p>
                                    </blockquote>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── MISI STRATEGIS ── */}
            <section
                ref={misiAnim.ref}
                className={`py-24 bg-gray-50 anim-fade-up ${misiAnim.isVisible ? "show" : ""}`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 gap-6">
                        <div>
                            <div className="inline-block text-[#1DA599] font-bold tracking-widest text-xs uppercase mb-3 border-l-[3px] border-[#1DA599] pl-3">
                                TARGET STRATEGIS 2026
                            </div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A]">
                                Misi Strategis PKK
                            </h2>
                        </div>
                        <p className="text-gray-500 text-[15px] leading-relaxed max-w-md">
                            Langkah nyata untuk mewujudkan kesejahteraan keluarga melalui
                            pendekatan karakter, ekonomi, dan teknologi secara inklusif.
                        </p>
                    </div>

                    {/* Grid Misi — 3 kolom atas, 2 kolom tengah */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {misiList.map((misi, i) => (
                            <div
                                key={i}
                                className={`bg-white border border-gray-200 rounded-2xl p-7 hover:shadow-xl hover:border-[#1DA599]/30 transition-all duration-300 group ${
                                    i === 3 ? "lg:col-start-1" : ""
                                }`}
                            >
                                <div
                                    className={`w-12 h-12 rounded-xl ${misi.bg} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}
                                >
                                    <misi.icon size={24} className={misi.color} />
                                </div>
                                <h3 className="text-[#0F172A] font-extrabold text-lg mb-2 group-hover:text-[#1DA599] transition-colors">
                                    {misi.title}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    {misi.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA: MEWUJUDKAN TASIKMALAYA MANDIRI ── */}
            <section
                ref={ctaAnim.ref}
                className={`py-24 bg-[#071330] relative overflow-hidden anim-fade-up ${ctaAnim.isVisible ? "show" : ""}`}
            >
                {/* Dekorasi lingkaran */}
                <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-[#1DA599]/10 -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#38BDF8]/10 translate-x-1/2 translate-y-1/2 blur-3xl pointer-events-none"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 text-[#38BDF8] text-xs font-bold tracking-widest uppercase mb-5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]"></span>
                        <span>Bersama Tim Penggerak</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
                        Mewujudkan{" "}
                        <span className="text-[#38BDF8]">Tasikmalaya Mandiri</span>
                    </h2>
                    <p className="text-gray-400 text-[15px] leading-relaxed max-w-xl mx-auto mb-10">
                        Bersama Tim Penggerak PKK, kita bangun keluarga Indonesia yang lebih maju.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="#"
                            className="inline-flex items-center gap-2 bg-[#1DA599] hover:bg-teal-600 text-white font-bold px-8 py-3.5 rounded-full transition-all shadow-lg shadow-teal-600/30 text-sm"
                        >
                            Program Kerja <ChevronRight size={16} />
                        </Link>
                        <Link
                            href="#"
                            className="inline-flex items-center gap-2 bg-transparent border border-white/30 hover:border-white/60 hover:bg-white/10 text-white font-semibold px-8 py-3.5 rounded-full transition-all text-sm"
                        >
                            <Mail size={16} />
                            Kontak Kami
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
