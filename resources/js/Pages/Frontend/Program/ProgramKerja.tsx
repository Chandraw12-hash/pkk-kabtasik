import React, { useEffect, useRef, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import {
    Sparkles,
    Handshake,
    Utensils,
    Shirt,
    Home,
    GraduationCap,
    Stethoscope,
    Coins,
    Leaf,
    CalendarCheck,
    ChevronRight,
    BookOpen,
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

const programPokok = [
    {
        no: "01",
        nama: "Penghayatan dan Pengamalan Pancasila",
        desc: "Pembinaan mental spiritual dan pengamalan nilai-nilai Pancasila sebagai fondasi karakter keluarga yang kuat.",
        icon: Sparkles,
        color: "text-blue-500",
        bg: "bg-blue-50",
        pokja: "POKJA I",
        pokjaBg: "bg-blue-50",
        pokjaColor: "text-blue-600",
    },
    {
        no: "02",
        nama: "Gotong Royong",
        desc: "Meningkatkan semangat kebersamaan dan gotong royong dalam kehidupan bermasyarakat.",
        icon: Handshake,
        color: "text-indigo-500",
        bg: "bg-indigo-50",
        pokja: "POKJA I",
        pokjaBg: "bg-indigo-50",
        pokjaColor: "text-indigo-600",
    },
    {
        no: "03",
        nama: "Pangan",
        desc: "Pemenuhan pangan bergizi seimbang melalui pemanfaatan lahan dan potensi lokal yang ada di masyarakat.",
        icon: Utensils,
        color: "text-orange-500",
        bg: "bg-orange-50",
        pokja: "POKJA III",
        pokjaBg: "bg-orange-50",
        pokjaColor: "text-orange-600",
    },
    {
        no: "04",
        nama: "Sandang",
        desc: "Pemenuhan kebutuhan sandang yang layak serta bersih, rapih, dan mencerminkan jati diri budaya.",
        icon: Shirt,
        color: "text-pink-500",
        bg: "bg-pink-50",
        pokja: "POKJA III",
        pokjaBg: "bg-pink-50",
        pokjaColor: "text-pink-600",
    },
    {
        no: "05",
        nama: "Perumahan & Tata Laksana RT",
        desc: "Mewujudkan rumah sehat dan lingkungan asri dengan manajemen rumah tangga yang baik dan efektif.",
        icon: Home,
        color: "text-amber-500",
        bg: "bg-amber-50",
        pokja: "POKJA III",
        pokjaBg: "bg-amber-50",
        pokjaColor: "text-amber-600",
    },
    {
        no: "06",
        nama: "Pendidikan & Keterampilan",
        desc: "Peningkatan kemampuan dan keterampilan anggota keluarga guna meningkatkan produktivitas dan kesejahteraan.",
        icon: GraduationCap,
        color: "text-emerald-500",
        bg: "bg-emerald-50",
        pokja: "POKJA II",
        pokjaBg: "bg-emerald-50",
        pokjaColor: "text-emerald-600",
    },
    {
        no: "07",
        nama: "Kesehatan",
        desc: "Pembinaan dan peningkatan kesehatan keluarga menuju pola hidup bersih dan sehat yang berkelanjutan.",
        icon: Stethoscope,
        color: "text-red-500",
        bg: "bg-red-50",
        pokja: "POKJA IV",
        pokjaBg: "bg-red-50",
        pokjaColor: "text-red-600",
    },
    {
        no: "08",
        nama: "Kehidupan Berkoperasi",
        desc: "Mendorong kemandirian ekonomi keluarga melalui pengembangan usaha dan partisipasi aktif di koperasi.",
        icon: Coins,
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        pokja: "POKJA II",
        pokjaBg: "bg-yellow-50",
        pokjaColor: "text-yellow-700",
    },
    {
        no: "09",
        nama: "Kelestarian Lingkungan",
        desc: "Menjaga kelestarian dan kebersihan lingkungan serta pengelolaan sampah secara bijak setiap harinya.",
        icon: Leaf,
        color: "text-teal-500",
        bg: "bg-teal-50",
        pokja: "POKJA IV",
        pokjaBg: "bg-teal-50",
        pokjaColor: "text-teal-600",
    },
    {
        no: "10",
        nama: "Perencanaan Sehat",
        desc: "Mewujudkan perencanaan keluarga yang baik dan terencana dengan layanan dan tujuan yang tepat sasaran.",
        icon: CalendarCheck,
        color: "text-violet-500",
        bg: "bg-violet-50",
        pokja: "POKJA IV",
        pokjaBg: "bg-violet-50",
        pokjaColor: "text-violet-600",
    },
];

export default function ProgramKerja() {
    const heroAnim = useScrollAnimation();
    const programAnim = useScrollAnimation();
    const ctaAnim = useScrollAnimation();

    return (
        <div
            className="min-h-screen flex flex-col bg-white font-sans text-slate-900 pt-14"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
            <style>{`::-webkit-scrollbar { display: none; } .anim-fade-up { opacity: 0; transform: translateY(28px); transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); } .anim-fade-up.show { opacity: 1; transform: translateY(0); }`}</style>

            <Head title="Program Kerja PKK - PKK Kabupaten Tasikmalaya" />
            <Navbar />

            {/* ── HERO ── */}
            <section
                ref={heroAnim.ref}
                className={`relative min-h-[380px] lg:min-h-[420px] flex items-center overflow-hidden anim-fade-up ${heroAnim.isVisible ? "show" : ""}`}
            >
                <div className="absolute inset-0 w-full h-full">
                    <img
                        src="/assets/images/hero.jpg"
                        alt="Program Kerja PKK Kabupaten Tasikmalaya"
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                            e.currentTarget.src =
                                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80";
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#071330]/90 via-[#071330]/70 to-[#071330]/30"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 text-[#38BDF8] text-xs font-bold tracking-widest uppercase mb-5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]"></span>
                            <span>Program Kerja Nasional</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
                            Program Kerja PKK
                        </h1>
                        <p className="text-gray-300 text-base leading-relaxed max-w-lg">
                            Seluruh 10 Program Pokok PKK sebagai pilar utama gerakan pemberdayaan keluarga dalam mewujudkan Kabupaten Tasikmalaya yang mandiri.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── 10 PROGRAM POKOK ── */}
            <section
                ref={programAnim.ref}
                className={`py-24 bg-white anim-fade-up ${programAnim.isVisible ? "show" : ""}`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 text-[#1DA599] text-xs font-bold tracking-widest uppercase mb-4">
                            <span className="w-5 h-px bg-[#1DA599]"></span>
                            <span>10 Program</span>
                            <span className="w-5 h-px bg-[#1DA599]"></span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-4">
                            10 Program Pokok PKK
                        </h2>
                        <p className="text-gray-500 text-[15px] leading-relaxed max-w-xl mx-auto">
                            Landasan strategis dalam menciptakan keluarga mandiri dan berkualitas yang mendukung pemberdayaan masyarakat demi kemajuan Kabupaten Tasikmalaya.
                        </p>
                    </div>

                    {/* Grid 10 Program — 3 kolom, item terakhir centered */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {programPokok.map((program, i) => (
                            <div
                                key={i}
                                className={`bg-white border border-gray-200 rounded-2xl p-7 hover:shadow-xl hover:border-[#1DA599]/30 transition-all duration-300 group flex flex-col ${
                                    i === 9 ? "sm:col-start-1 lg:col-start-2" : ""
                                }`}
                            >
                                <div className="flex items-start justify-between mb-5">
                                    <div
                                        className={`w-12 h-12 rounded-xl ${program.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}
                                    >
                                        <program.icon size={24} className={program.color} />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-black tracking-widest uppercase ${program.pokjaColor} ${program.pokjaBg} px-2 py-1 rounded-full`}>
                                            {program.pokja}
                                        </span>
                                        <span className="text-[11px] font-black text-gray-300">
                                            {program.no}
                                        </span>
                                    </div>
                                </div>
                                <h3 className="text-[#0F172A] font-extrabold text-[16px] mb-2 leading-snug group-hover:text-[#1DA599] transition-colors">
                                    {program.nama}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed flex-grow">
                                    {program.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section
                ref={ctaAnim.ref}
                className={`py-20 bg-[#0F172A] relative overflow-hidden anim-fade-up ${ctaAnim.isVisible ? "show" : ""}`}
            >
                <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-[#1DA599]/10 -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#38BDF8]/10 translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none"></div>

                <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <div className="inline-flex items-center gap-2 text-[#38BDF8] text-xs font-bold tracking-widest uppercase mb-5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]"></span>
                        <span>Bersama PKK Tasikmalaya</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
                        Wujudkan Tasikmalaya{" "}
                        <span className="text-[#38BDF8]">Mandiri Bersama Kami</span>
                    </h2>
                    <p className="text-gray-400 text-[15px] leading-relaxed mb-10 max-w-xl mx-auto">
                        Dukung terlaksananya 10 Program Pokok PKK di lingkungan Anda. Bersama-sama, kita wujudkan masyarakat yang lebih sehat, cerdas, dan sejahtera.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="#"
                            className="inline-flex items-center gap-2 bg-[#1DA599] hover:bg-teal-600 text-white font-bold px-8 py-3.5 rounded-full transition-all shadow-lg shadow-teal-600/30 text-sm"
                        >
                            Lihat Program <ChevronRight size={16} />
                        </Link>
                        <Link
                            href="#"
                            className="inline-flex items-center gap-2 bg-transparent border border-white/30 hover:border-white/60 hover:bg-white/10 text-white font-semibold px-8 py-3.5 rounded-full transition-all text-sm"
                        >
                            <BookOpen size={16} />
                            Pelajari Selengkapnya
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
