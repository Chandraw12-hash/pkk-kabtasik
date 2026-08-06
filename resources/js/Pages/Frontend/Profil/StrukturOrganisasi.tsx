import React from "react";
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
    Sparkles,
} from "lucide-react";

const pokjaList = [
    {
        nama: "Pokja I",
        label: "POKJA I",
        program: "Penghayatan & Pengamalan Pancasila",
        desc: "Fokus pada pembinaan mental spiritual, penguatan karakter, gotong royong, dan kehidupan bermasyarakat.",
        icon: Heart,
        bg: "bg-blue-500",
        border: "border-blue-100",
        iconBg: "bg-gradient-to-br from-blue-400 to-blue-600",
        iconColor: "text-white",
        badgeBg: "bg-blue-50/80 backdrop-blur",
        badgeText: "text-blue-600",
        shadow: "shadow-blue-500/20",
    },
    {
        nama: "Pokja II",
        label: "POKJA II",
        program: "Pendidikan, Keterampilan & Koperasi",
        desc: "Peningkatan pendidikan keluarga, keterampilan ekonomi, dan pengembangan kehidupan berkoperasi.",
        icon: GraduationCap,
        bg: "bg-emerald-500",
        border: "border-emerald-100",
        iconBg: "bg-gradient-to-br from-emerald-400 to-emerald-600",
        iconColor: "text-white",
        badgeBg: "bg-emerald-50/80 backdrop-blur",
        badgeText: "text-emerald-600",
        shadow: "shadow-emerald-500/20",
    },
    {
        nama: "Pokja III",
        label: "POKJA III",
        program: "Pangan, Sandang & Tata Laksana RT",
        desc: "Pemenuhan kebutuhan pangan bergizi, sandang layak, perumahan sehat, dan tata laksana rumah tangga.",
        icon: Utensils,
        bg: "bg-orange-500",
        border: "border-orange-100",
        iconBg: "bg-gradient-to-br from-orange-400 to-orange-600",
        iconColor: "text-white",
        badgeBg: "bg-orange-50/80 backdrop-blur",
        badgeText: "text-orange-600",
        shadow: "shadow-orange-500/20",
    },
    {
        nama: "Pokja IV",
        label: "POKJA IV",
        program: "Kesehatan, Lingkungan & Perencanaan Sehat",
        desc: "Pembinaan kesehatan keluarga, pelestarian lingkungan hidup dan perencanaan keluarga sehat.",
        icon: Stethoscope,
        bg: "bg-teal-500",
        border: "border-teal-100",
        iconBg: "bg-gradient-to-br from-teal-400 to-teal-600",
        iconColor: "text-white",
        badgeBg: "bg-teal-50/80 backdrop-blur",
        badgeText: "text-teal-600",
        shadow: "shadow-teal-500/20",
    },
];

export default function StrukturOrganisasi() {
    return (
        <div className="min-h-screen flex flex-col bg-[#FAFAFA] font-sans text-slate-900 pt-14 selection:bg-[#1DA599]/30">
            <Head title="Struktur Organisasi - PKK Kabupaten Tasikmalaya" />
            <Navbar />

            {/* ── HERO ── */}
            <section className="relative min-h-[420px] lg:min-h-[480px] flex items-center overflow-hidden" data-aos="fade-up">
                <div className="absolute inset-0 w-full h-full">
                    <img
                        src="/assets/images/hero.jpg"
                        alt="Struktur Organisasi"
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80";
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0B2A3B]/92 via-[#0B2A3B]/75 to-[#0B2A3B]/45"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 text-[#38BDF8] text-xs font-bold tracking-widest uppercase mb-5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]"></span>
                            <span>Tentang Kami</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
                            Struktur Organisasi
                        </h1>
                        <p className="text-gray-200 text-base mb-8 leading-relaxed max-w-md">
                            Mengenal lebih dekat formasi Tim Penggerak PKK yang berdedikasi tinggi 
                            untuk memberdayakan dan meningkatkan kesejahteraan keluarga di Tasikmalaya.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── PIMPINAN UTAMA ── */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-50/40 via-white to-white pointer-events-none"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        
                        {/* Foto Ketua Premium */}
                        <div className="w-full lg:w-1/2 flex justify-center" data-aos="fade-right">
                            <div className="relative group">
                                <div className="absolute -inset-2 bg-gradient-to-br from-[#1DA599] to-[#38BDF8] rounded-[40px] opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500"></div>
                                <div className="absolute -inset-4 bg-[#E5F5F4] rounded-[40px] -z-10 rotate-3 transition-transform duration-500 group-hover:rotate-6"></div>
                                
                                <div className="relative w-80 md:w-96 aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white">
                                    <img
                                        src="/assets/images/ketua-pkk.jpg"
                                        alt="Hj. Ai Diantani Sugianto"
                                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                        onError={(e) => {
                                            e.currentTarget.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80";
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent opacity-60"></div>
                                </div>
                                
                                {/* Badge Float */}
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md text-[#0F172A] border border-gray-100 px-8 py-4 rounded-2xl shadow-xl flex flex-col items-center">
                                    <Crown size={24} className="text-[#1DA599] mb-1" />
                                    <span className="text-xs font-black tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-[#0F172A] to-[#1DA599]">
                                        Ketua TP PKK
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Info Ketua */}
                        <div className="w-full lg:w-1/2" data-aos="fade-left">
                            <div className="inline-flex items-center gap-2 text-[#1DA599] font-bold tracking-widest text-xs uppercase mb-4 bg-teal-50 px-4 py-2 rounded-full border border-teal-100">
                                <span className="w-2 h-2 rounded-full bg-[#1DA599] animate-pulse"></span>
                                Pimpinan Utama
                            </div>
                            
                            <h2 className="text-4xl md:text-5xl font-black text-[#0F172A] mb-6 leading-tight">
                                Hj. Ai Diantani Sugianto
                            </h2>
                            
                            <div className="space-y-6 text-gray-600 text-lg leading-relaxed relative">
                                <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-[#1DA599] to-transparent rounded-full hidden md:block"></div>
                                <p className="md:pl-0 font-medium">
                                    "Pemberdayaan keluarga adalah pondasi utama dalam membangun Tasikmalaya yang lebih baik, sehat, dan berdaya saing tinggi."
                                </p>
                                <p className="md:pl-0 text-base">
                                    Selaku Ketua TP PKK Kabupaten Tasikmalaya, beliau menginisiasi berbagai program strategis yang berfokus pada peningkatan ekonomi keluarga, kesehatan ibu dan anak, serta penguatan karakter dengan mengutamakan nilai-nilai luhur Pancasila. 
                                </p>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 mt-10">
                                <a href="tel:" className="group inline-flex items-center gap-3 bg-[#0F172A] hover:bg-[#1e293b] text-white font-bold px-8 py-3.5 rounded-full transition-all shadow-xl shadow-slate-900/20 hover:-translate-y-1">
                                    <Phone size={18} className="group-hover:rotate-12 transition-transform" />
                                    <span>Hubungi Beliau</span>
                                </a>
                                <Link href="#hierarki" className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 hover:border-[#1DA599] hover:text-[#1DA599] text-gray-700 font-bold px-8 py-3.5 rounded-full transition-all hover:-translate-y-1">
                                    <BookOpen size={18} />
                                    <span>Jelajahi Hierarki</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── HIERARKI ORGANISASI ── */}
            <section id="hierarki" className="py-24 bg-[#0F172A] relative overflow-hidden">
                {/* Dark mode background decorations */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#1DA599]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#38BDF8]/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                        <div data-aos="fade-up">
                            <div className="inline-flex items-center gap-2 text-[#38BDF8] text-xs font-black tracking-widest uppercase mb-4 bg-sky-900/40 px-4 py-2 rounded-full border border-sky-500/30">
                                Bagan Kepengurusan
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white">
                                Hierarki <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1DA599] to-[#38BDF8]">Organisasi</span>
                            </h2>
                        </div>
                        <a href="#" data-aos="fade-up" data-aos-delay="100" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-3 rounded-full transition-all backdrop-blur-md">
                            <Download size={18} />
                            Unduh PDF
                        </a>
                    </div>

                    {/* Org Chart Container */}
                    <div className="relative py-10 flex flex-col items-center">
                        
                        {/* Garis Vertikal Utama */}
                        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-[#1DA599]/50 via-gray-600/30 to-transparent hidden lg:block"></div>

                        {/* Level 1: Ketua */}
                        <div className="relative z-10 mb-16" data-aos="fade-up">
                            <div className="bg-gradient-to-b from-white to-gray-50 rounded-3xl p-1 shadow-[0_0_40px_-10px_rgba(29,165,153,0.3)]">
                                <div className="bg-white rounded-[22px] px-10 py-6 flex flex-col items-center gap-2 text-center border border-gray-100 min-w-[280px]">
                                    <div className="w-16 h-16 bg-gradient-to-br from-[#1DA599] to-[#0d5e56] rounded-full flex items-center justify-center mb-2 shadow-lg shadow-teal-500/30">
                                        <Crown size={28} className="text-white" />
                                    </div>
                                    <p className="text-[11px] font-black text-[#1DA599] tracking-[0.2em] uppercase">KETUA TP PKK</p>
                                    <p className="font-black text-xl text-[#0F172A]">Hj. Ai Diantani Sugianto</p>
                                </div>
                            </div>
                        </div>

                        {/* Garis Cabang */}
                        <div className="relative w-full max-w-4xl h-16 hidden lg:block -mt-16 mb-8">
                            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-600/50 to-transparent"></div>
                            <div className="absolute top-1/2 left-0 w-0.5 h-8 bg-gray-600/50"></div>
                            <div className="absolute top-1/2 right-0 w-0.5 h-8 bg-gray-600/50"></div>
                        </div>

                        {/* Level 2: Wakil, Sekretaris, Bendahara */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-5xl mb-24 relative z-10">
                            {[
                                { jabatan: "WAKIL KETUA", nama: "Dra. Yg. Sri Munawaroh", icon: Users, gradient: "from-[#38BDF8] to-blue-600", delay: "100" },
                                { jabatan: "SEKRETARIS", nama: "Dra. Tl. Ai Rojanah Fajri", icon: Briefcase, gradient: "from-emerald-400 to-emerald-600", delay: "200" },
                                { jabatan: "BENDAHARA", nama: "Hj. Siti Suharni", icon: DollarSign, gradient: "from-violet-400 to-violet-600", delay: "300" },
                            ].map((p, i) => (
                                <div key={i} className="group relative" data-aos="fade-up" data-aos-delay={p.delay}>
                                    <div className="absolute -inset-0.5 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[24px] blur-sm" style={{backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`}}></div>
                                    <div className="relative bg-[#1e293b] border border-gray-700/50 hover:border-gray-600 rounded-[22px] p-8 flex flex-col items-center text-center transition-all duration-300 group-hover:-translate-y-2 h-full">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                                            <p.icon size={26} className="text-white" />
                                        </div>
                                        <p className="text-[10px] font-black tracking-[0.2em] uppercase mb-2 text-gray-400">{p.jabatan}</p>
                                        <p className="text-white font-bold text-lg">{p.nama}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Header Pokja */}
                        <div className="mb-12 relative z-10" data-aos="fade-up">
                            <div className="bg-gray-800/50 backdrop-blur-md border border-gray-700 px-8 py-3 rounded-full text-center">
                                <span className="text-white font-bold tracking-widest text-sm uppercase">Kelompok Kerja (POKJA)</span>
                            </div>
                        </div>

                        {/* Level 3: Pokja I - IV */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full relative z-10">
                            {pokjaList.map((pokja, i) => (
                                <div key={i} className="group h-full" data-aos="fade-up" data-aos-delay={100 * (i + 1)}>
                                    <div className="bg-[#1e293b] border border-gray-700 rounded-[24px] p-8 h-full flex flex-col hover:bg-[#233147] transition-colors duration-300">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`w-14 h-14 rounded-2xl ${pokja.iconBg} flex items-center justify-center ${pokja.shadow} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                                                <pokja.icon size={26} className={pokja.iconColor} />
                                            </div>
                                            <span className={`text-[10px] font-black tracking-widest uppercase text-white bg-gray-700/50 px-3 py-1.5 rounded-full border border-gray-600`}>
                                                {pokja.label}
                                            </span>
                                        </div>
                                        <h3 className="text-white font-bold text-[17px] mb-3 leading-snug group-hover:text-[#38BDF8] transition-colors">
                                            {pokja.program}
                                        </h3>
                                        <p className="text-gray-400 text-sm leading-relaxed flex-grow mb-6">
                                            {pokja.desc}
                                        </p>
                                        <div className="mt-auto w-full h-px bg-gray-700 mb-4"></div>
                                        <Link href="#" className="inline-flex items-center justify-between w-full text-gray-300 group-hover:text-white text-sm font-bold transition-colors">
                                            <span>Lihat Program</span>
                                            <div className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center group-hover:bg-[#38BDF8] group-hover:text-white transition-all">
                                                <ArrowRight size={14} />
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>
                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" data-aos="zoom-in">
                    <div className="w-20 h-20 bg-[#1DA599]/10 rounded-full flex items-center justify-center mx-auto mb-8">
                        <Heart size={36} className="text-[#1DA599]" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-[#0F172A] mb-6 leading-tight">
                        Mari Berkarya Bersama <br className="hidden md:block"/>
                        <span className="text-[#1DA599]">PKK Kabupaten Tasikmalaya</span>
                    </h2>
                    <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-2xl mx-auto font-medium">
                        Jadilah bagian dari perubahan positif. Bersama kita bangun keluarga sejahtera, cerdas, dan mandiri demi masa depan yang lebih cemerlang.
                    </p>
                    <Link href="#" className="inline-flex items-center gap-2 bg-[#1DA599] hover:bg-teal-600 text-white font-bold px-10 py-4 rounded-full transition-all shadow-xl shadow-teal-600/30 text-base hover:-translate-y-1 hover:scale-105">
                        Mulai Kolaborasi <ChevronRight size={18} />
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}
