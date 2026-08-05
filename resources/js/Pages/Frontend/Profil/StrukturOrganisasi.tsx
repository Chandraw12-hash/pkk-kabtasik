import React, { useEffect, useRef, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import {
    Download,
    Phone,
    BookOpen,
    ChevronRight,
    Users,
    Crown,
    Briefcase,
    DollarSign,
    Heart,
    GraduationCap,
    Utensils,
    Stethoscope,
    ArrowRight,
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

const pokjaList = [
    {
        nama: "Pokja I",
        label: "POKJA I",
        program: "Penghayatan & Pengamalan Pancasila",
        desc: "Fokus pada pembinaan mental spiritual, penguatan karakter, gotong royong, dan kehidupan bermasyarakat.",
        icon: Heart,
        bg: "bg-blue-500",
        border: "border-blue-100",
        iconBg: "bg-blue-50",
        iconColor: "text-blue-500",
        badgeBg: "bg-blue-50",
        badgeText: "text-blue-600",
    },
    {
        nama: "Pokja II",
        label: "POKJA II",
        program: "Pendidikan, Keterampilan & Koperasi",
        desc: "Peningkatan pendidikan keluarga, keterampilan ekonomi, dan pengembangan kehidupan berkoperasi.",
        icon: GraduationCap,
        bg: "bg-emerald-500",
        border: "border-emerald-100",
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-500",
        badgeBg: "bg-emerald-50",
        badgeText: "text-emerald-600",
    },
    {
        nama: "Pokja III",
        label: "POKJA III",
        program: "Pangan, Sandang & Tata Laksana RT",
        desc: "Pemenuhan kebutuhan pangan bergizi, sandang layak, perumahan sehat, dan tata laksana rumah tangga.",
        icon: Utensils,
        bg: "bg-orange-500",
        border: "border-orange-100",
        iconBg: "bg-orange-50",
        iconColor: "text-orange-500",
        badgeBg: "bg-orange-50",
        badgeText: "text-orange-600",
    },
    {
        nama: "Pokja IV",
        label: "POKJA IV",
        program: "Kesehatan, Lingkungan & Perencanaan Sehat",
        desc: "Pembinaan kesehatan keluarga, pelestarian lingkungan hidup dan perencanaan keluarga sehat.",
        icon: Stethoscope,
        bg: "bg-teal-500",
        border: "border-teal-100",
        iconBg: "bg-teal-50",
        iconColor: "text-teal-500",
        badgeBg: "bg-teal-50",
        badgeText: "text-teal-600",
    },
];

export default function StrukturOrganisasi() {
    const heroAnim = useScrollAnimation();
    const ketuaAnim = useScrollAnimation();
    const hierarkiAnim = useScrollAnimation();
    const ctaAnim = useScrollAnimation();

    return (
        <div
            className="min-h-screen flex flex-col bg-white font-sans text-slate-900 pt-14"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
            <style>{`::-webkit-scrollbar { display: none; } .anim-fade-up { opacity: 0; transform: translateY(28px); transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); } .anim-fade-up.show { opacity: 1; transform: translateY(0); }`}</style>

            <Head title="Struktur Organisasi - PKK Kabupaten Tasikmalaya" />
            <Navbar />

            {/* ── HERO ── */}
            <section
                ref={heroAnim.ref}
                className={`relative min-h-[380px] lg:min-h-[420px] flex items-center overflow-hidden anim-fade-up ${heroAnim.isVisible ? "show" : ""}`}
            >
                <div className="absolute inset-0 w-full h-full">
                    <img
                        src="/assets/images/hero.jpg"
                        alt="Struktur Organisasi PKK Kabupaten Tasikmalaya"
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
                            <span>Tentang Kami</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
                            Struktur Organisasi
                        </h1>
                        <p className="text-gray-300 text-base leading-relaxed max-w-md">
                            Mengenal lebih dekat Tim Penggerak PKK yang berdedikasi untuk
                            memberdayakan dan meningkatkan kesejahteraan masyarakat di
                            Kabupaten Tasikmalaya menuju keluarga yang sejahtera.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── PIMPINAN UTAMA / KETUA ── */}
            <section
                ref={ketuaAnim.ref}
                className={`py-20 bg-white anim-fade-up ${ketuaAnim.isVisible ? "show" : ""}`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        {/* Foto Ketua */}
                        <div className="w-full lg:w-5/12 flex justify-center">
                            <div className="relative">
                                {/* Dekorasi latar */}
                                <div className="absolute -inset-4 bg-[#E5F5F4] rounded-3xl -z-10 rotate-2"></div>
                                <div className="relative w-72 h-80 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                                    <img
                                        src="/assets/images/ketua-pkk.jpg"
                                        alt="Hj. Ai Diantani Sugianto"
                                        className="w-full h-full object-cover object-top"
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80";
                                        }}
                                    />
                                </div>
                                {/* Badge jabatan */}
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#1DA599] text-white text-xs font-extrabold tracking-widest uppercase px-5 py-2 rounded-full shadow-lg whitespace-nowrap">
                                    KETUA TP PKK
                                </div>
                            </div>
                        </div>

                        {/* Info Ketua */}
                        <div className="w-full lg:w-7/12 pt-8 lg:pt-0">
                            <div className="inline-block text-[#1DA599] font-bold tracking-widest text-xs uppercase mb-3 border-l-[3px] border-[#1DA599] pl-3">
                                PIMPINAN UTAMA
                            </div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-4">
                                Hj. Ai Diantani Sugianto
                            </h2>
                            <div className="w-12 h-1 bg-[#1DA599] rounded-full mb-6"></div>
                            <p className="text-gray-600 text-[15px] leading-relaxed mb-4">
                                Pemberdayaan keluarga adalah pondasi utama dalam membangun
                                fondasi kumpulan/jati Tasikmalaya yang lebih baik, sehat, dan
                                berdaya saing.
                            </p>
                            <p className="text-gray-600 text-[15px] leading-relaxed mb-8">
                                Selaku Ketua TP PKK Kabupaten Tasik malaya, beliau menginisiasi
                                berbagai program strategis yang berfokus pada peningkatan ekonomi keluarga, kesehatan ibu dan anak, serta penguatan karakter dengan mengutamakan nilai-nilai Pancasila. Visi beliau adalah untuk mendorong setiap keluarga agar menjadi garda terdepan dalam membangun kepribadian PKK yang berkualitas, mandiri, serta aktif dalam kehidupan bermasyarakat.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <a
                                    href="tel:"
                                    className="inline-flex items-center gap-2 bg-[#1DA599] hover:bg-teal-600 text-white font-bold px-6 py-2.5 rounded-full transition-all text-sm shadow-lg shadow-teal-500/30"
                                >
                                    <Phone size={15} />
                                    Hubungi
                                </a>
                                <Link
                                    href="#hierarki"
                                    className="inline-flex items-center gap-2 border border-gray-300 hover:border-[#1DA599] hover:text-[#1DA599] text-gray-600 font-semibold px-6 py-2.5 rounded-full transition-all text-sm"
                                >
                                    <BookOpen size={15} />
                                    Baca Selengkapnya
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── HIERARKI ORGANISASI ── */}
            <section
                id="hierarki"
                ref={hierarkiAnim.ref}
                className={`py-20 bg-gray-50 border-t border-gray-100 anim-fade-up ${hierarkiAnim.isVisible ? "show" : ""}`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
                        <div>
                            <div className="inline-block text-[#1DA599] font-bold tracking-widest text-xs uppercase mb-3 border-l-[3px] border-[#1DA599] pl-3">
                                BAGAN KEPENGURUSAN
                            </div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A]">
                                Hierarki Organisasi
                            </h2>
                            <p className="text-gray-500 text-sm mt-2 leading-relaxed max-w-md">
                                Susunan jabatan dan kepengurusan TP PKK di Kabupaten Tasikmalaya.
                            </p>
                        </div>
                        <a
                            href="#"
                            className="inline-flex items-center gap-2 border border-[#1DA599] text-[#1DA599] hover:bg-[#1DA599] hover:text-white font-bold px-5 py-2.5 rounded-full transition-all text-sm whitespace-nowrap self-start sm:self-auto"
                        >
                            <Download size={15} />
                            Unduh Struktur Lengkap PDF
                        </a>
                    </div>

                    {/* Org Chart */}
                    <div className="flex flex-col items-center gap-0">

                        {/* Ketua */}
                        <div className="bg-[#0F172A] text-white rounded-2xl px-8 py-4 flex items-center gap-3 shadow-xl shadow-slate-900/20 min-w-[220px] text-center justify-center z-10">
                            <Crown size={18} className="text-[#38BDF8]" />
                            <div>
                                <p className="text-[10px] font-bold text-[#38BDF8] tracking-widest uppercase">KETUA</p>
                                <p className="font-extrabold text-sm">Hj. Ai Diantani Sugianto</p>
                            </div>
                        </div>

                        {/* Garis vertikal */}
                        <div className="w-px h-8 bg-gray-300"></div>

                        {/* Garis horizontal penghubung */}
                        <div className="relative w-full max-w-3xl">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gray-300"></div>
                        </div>

                        {/* Wakil Ketua, Sekretaris, Bendahara */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-3xl mt-8">
                            {[
                                { jabatan: "WAKIL KETUA", nama: "Dra. Yg. Sri Munawaroh", icon: Users, color: "text-[#38BDF8]", bg: "bg-[#38BDF8]/10" },
                                { jabatan: "SEKRETARIS", nama: "Dra. Tl. Ai Rojanah Fajri", icon: Briefcase, color: "text-emerald-500", bg: "bg-emerald-50" },
                                { jabatan: "BENDAHARA", nama: "Hj. Siti Suharni", icon: DollarSign, color: "text-violet-500", bg: "bg-violet-50" },
                            ].map((p, i) => (
                                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
                                    <div className={`w-10 h-10 rounded-xl ${p.bg} flex items-center justify-center mb-3`}>
                                        <p.icon size={20} className={p.color} />
                                    </div>
                                    <p className={`text-[10px] font-black tracking-widest uppercase mb-1 ${p.color}`}>{p.jabatan}</p>
                                    <p className="text-[#0F172A] font-bold text-sm">{p.nama}</p>
                                </div>
                            ))}
                        </div>

                        {/* Garis vertikal ke Pokja */}
                        <div className="w-px h-8 bg-gray-300 mt-2"></div>

                        {/* Pokja I - IV */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full mt-0">
                            {pokjaList.map((pokja, i) => (
                                <div
                                    key={i}
                                    className={`bg-white border ${pokja.border} rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group flex flex-col`}
                                >
                                    <div className={`w-11 h-11 rounded-xl ${pokja.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <pokja.icon size={22} className={pokja.iconColor} />
                                    </div>
                                    <span className={`text-[10px] font-black tracking-widest uppercase ${pokja.badgeText} ${pokja.badgeBg} self-start px-2 py-1 rounded-full mb-3`}>
                                        {pokja.label}
                                    </span>
                                    <h3 className="text-[#0F172A] font-extrabold text-base mb-2 group-hover:text-[#1DA599] transition-colors leading-snug">
                                        {pokja.program}
                                    </h3>
                                    <p className="text-gray-500 text-xs leading-relaxed flex-grow mb-5">
                                        {pokja.desc}
                                    </p>
                                    <Link
                                        href="#"
                                        className="inline-flex items-center gap-1 text-[#1DA599] text-xs font-bold hover:underline mt-auto"
                                    >
                                        Eksplorasi <ArrowRight size={12} />
                                    </Link>
                                </div>
                            ))}
                        </div>
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

                <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 text-[#38BDF8] text-xs font-bold tracking-widest uppercase mb-5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]"></span>
                        <span>Bergabung Sekarang</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
                        Ingin Bergabung dalam{" "}
                        <span className="text-[#38BDF8]">Pergerakan?</span>
                    </h2>
                    <p className="text-gray-400 text-[15px] leading-relaxed mb-10 max-w-xl mx-auto">
                        Jadilah bagian dari Tim Penggerak PKK dan bersama membangun
                        Tasikmalaya yang lebih baik dan bangsa yang berdaya saingnya.
                    </p>
                    <Link
                        href="#"
                        className="inline-flex items-center gap-2 bg-[#1DA599] hover:bg-teal-600 text-white font-bold px-10 py-4 rounded-full transition-all shadow-lg shadow-teal-600/30 text-sm"
                    >
                        Daftar Sekarang <ChevronRight size={16} />
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}
