import React from "react";
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
    ArrowRight
} from "lucide-react";

const programPokok = [
    {
        no: "01",
        nama: "Penghayatan dan Pengamalan Pancasila",
        desc: "Pembinaan mental spiritual dan pengamalan nilai-nilai Pancasila sebagai fondasi karakter keluarga yang kuat.",
        icon: Sparkles,
        gradient: "from-blue-400 to-blue-600",
        shadow: "shadow-blue-500/20",
        pokja: "POKJA I",
        pokjaColor: "text-blue-600",
        pokjaBg: "bg-blue-50 border-blue-100",
    },
    {
        no: "02",
        nama: "Gotong Royong",
        desc: "Meningkatkan semangat kebersamaan dan gotong royong dalam kehidupan bermasyarakat.",
        icon: Handshake,
        gradient: "from-indigo-400 to-indigo-600",
        shadow: "shadow-indigo-500/20",
        pokja: "POKJA I",
        pokjaColor: "text-indigo-600",
        pokjaBg: "bg-indigo-50 border-indigo-100",
    },
    {
        no: "03",
        nama: "Pangan",
        desc: "Pemenuhan pangan bergizi seimbang melalui pemanfaatan lahan dan potensi lokal yang ada di masyarakat.",
        icon: Utensils,
        gradient: "from-orange-400 to-orange-600",
        shadow: "shadow-orange-500/20",
        pokja: "POKJA III",
        pokjaColor: "text-orange-600",
        pokjaBg: "bg-orange-50 border-orange-100",
    },
    {
        no: "04",
        nama: "Sandang",
        desc: "Pemenuhan kebutuhan sandang yang layak serta bersih, rapih, dan mencerminkan jati diri budaya.",
        icon: Shirt,
        gradient: "from-pink-400 to-pink-600",
        shadow: "shadow-pink-500/20",
        pokja: "POKJA III",
        pokjaColor: "text-pink-600",
        pokjaBg: "bg-pink-50 border-pink-100",
    },
    {
        no: "05",
        nama: "Perumahan & Tata Laksana RT",
        desc: "Mewujudkan rumah sehat dan lingkungan asri dengan manajemen rumah tangga yang baik dan efektif.",
        icon: Home,
        gradient: "from-amber-400 to-amber-600",
        shadow: "shadow-amber-500/20",
        pokja: "POKJA III",
        pokjaColor: "text-amber-600",
        pokjaBg: "bg-amber-50 border-amber-100",
    },
    {
        no: "06",
        nama: "Pendidikan & Keterampilan",
        desc: "Peningkatan kemampuan dan keterampilan anggota keluarga guna meningkatkan produktivitas dan kesejahteraan.",
        icon: GraduationCap,
        gradient: "from-emerald-400 to-emerald-600",
        shadow: "shadow-emerald-500/20",
        pokja: "POKJA II",
        pokjaColor: "text-emerald-600",
        pokjaBg: "bg-emerald-50 border-emerald-100",
    },
    {
        no: "07",
        nama: "Kesehatan",
        desc: "Pembinaan dan peningkatan kesehatan keluarga menuju pola hidup bersih dan sehat yang berkelanjutan.",
        icon: Stethoscope,
        gradient: "from-red-400 to-red-600",
        shadow: "shadow-red-500/20",
        pokja: "POKJA IV",
        pokjaColor: "text-red-600",
        pokjaBg: "bg-red-50 border-red-100",
    },
    {
        no: "08",
        nama: "Kehidupan Berkoperasi",
        desc: "Mendorong kemandirian ekonomi keluarga melalui pengembangan usaha dan partisipasi aktif di koperasi.",
        icon: Coins,
        gradient: "from-yellow-400 to-yellow-600",
        shadow: "shadow-yellow-500/20",
        pokja: "POKJA II",
        pokjaColor: "text-yellow-700",
        pokjaBg: "bg-yellow-50 border-yellow-100",
    },
    {
        no: "09",
        nama: "Kelestarian Lingkungan",
        desc: "Menjaga kelestarian dan kebersihan lingkungan serta pengelolaan sampah secara bijak setiap harinya.",
        icon: Leaf,
        gradient: "from-teal-400 to-teal-600",
        shadow: "shadow-teal-500/20",
        pokja: "POKJA IV",
        pokjaColor: "text-teal-600",
        pokjaBg: "bg-teal-50 border-teal-100",
    },
    {
        no: "10",
        nama: "Perencanaan Sehat",
        desc: "Mewujudkan perencanaan keluarga yang baik dan terencana dengan layanan dan tujuan yang tepat sasaran.",
        icon: CalendarCheck,
        gradient: "from-violet-400 to-violet-600",
        shadow: "shadow-violet-500/20",
        pokja: "POKJA IV",
        pokjaColor: "text-violet-600",
        pokjaBg: "bg-violet-50 border-violet-100",
    },
];

export default function ProgramKerja() {
    return (
        <div className="min-h-screen flex flex-col bg-[#FAFAFA] font-sans text-slate-900 pt-14 selection:bg-[#1DA599]/30">
            <Head title="Program Kerja PKK - PKK Kabupaten Tasikmalaya" />
            <Navbar />

            {/* ── HERO MATCHED ── */}
            <section className="relative min-h-[420px] lg:min-h-[480px] flex items-center overflow-hidden" data-aos="fade-up">
                <div className="absolute inset-0 w-full h-full">
                    <img
                        src="/assets/images/hero.jpg"
                        alt="Program Kerja PKK"
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
                            <span>Program Kerja Nasional</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
                            Program Kerja <br className="hidden md:block"/>
                            <span className="text-[#38BDF8]">PKK</span>
                        </h1>
                        <p className="text-gray-200 text-base mb-8 leading-relaxed max-w-md">
                            Seluruh 10 Program Pokok PKK sebagai pilar utama gerakan pemberdayaan keluarga dalam mewujudkan Kabupaten Tasikmalaya yang mandiri, cerdas, dan sejahtera.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── 10 PROGRAM POKOK (PREMIUM BENTO GRID) ── */}
            <section className="py-24 relative overflow-hidden bg-white">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:30px_30px] opacity-40 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#1DA599]/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Header */}
                    <div className="text-center mb-16" data-aos="fade-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100 text-[#1DA599] text-[11px] font-black tracking-widest uppercase mb-6">
                            <Sparkles size={14} />
                            Inisiatif Strategis
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-[#0F172A] mb-6">
                            10 Program <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1DA599] to-[#38BDF8]">Pokok PKK</span>
                        </h2>
                        <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto font-medium">
                            Landasan kokoh untuk menciptakan keluarga mandiri dan berkualitas. Temukan setiap pilar yang membangun ekosistem masyarakat Kabupaten Tasikmalaya yang lebih baik.
                        </p>
                    </div>

                    {/* Premium Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {programPokok.map((program, i) => (
                            <div
                                key={i}
                                data-aos="fade-up"
                                data-aos-delay={(i % 3) * 100}
                                className={`group relative bg-white border border-gray-100 rounded-[32px] p-8 shadow-lg shadow-slate-200/40 hover:shadow-2xl hover:shadow-slate-300/60 transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col h-full ${
                                    i === 0 ? "md:col-span-2 lg:col-span-2 bg-gradient-to-br from-[#0F172A] to-[#1e293b] border-slate-700 text-white shadow-slate-900/20 hover:shadow-slate-900/40" : ""
                                }`}
                            >
                                {/* Decorative Hover Gradient for white cards */}
                                {i !== 0 && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-100 transition-opacity duration-500 group-hover:opacity-0"></div>
                                )}
                                {i !== 0 && (
                                    <div className={`absolute inset-0 bg-gradient-to-br ${program.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-[0.03]`}></div>
                                )}
                                
                                {/* Top Badges */}
                                <div className="flex items-start justify-between mb-8 relative z-10">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${program.gradient} flex items-center justify-center shadow-lg ${program.shadow} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                                        <program.icon size={26} className="text-white" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-black tracking-widest uppercase ${i === 0 ? "text-slate-300 bg-slate-800 border border-slate-700" : program.pokjaColor + " " + program.pokjaBg} px-3 py-1.5 rounded-full border`}>
                                            {program.pokja}
                                        </span>
                                        <span className={`text-4xl font-black opacity-10 ${i === 0 ? "text-white" : "text-gray-900"} -mt-1 group-hover:opacity-20 transition-opacity`}>
                                            {program.no}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Content */}
                                <div className="relative z-10 flex-grow flex flex-col">
                                    <h3 className={`font-black text-xl mb-3 leading-snug transition-colors ${i === 0 ? "text-white text-2xl lg:text-3xl" : "text-[#0F172A] group-hover:text-[#1DA599]"}`}>
                                        {program.nama}
                                    </h3>
                                    <p className={`text-[15px] leading-relaxed mb-6 flex-grow font-medium ${i === 0 ? "text-slate-300 max-w-md" : "text-gray-500"}`}>
                                        {program.desc}
                                    </p>
                                    
                                    {/* Action Button */}
                                    <Link href="#" className={`inline-flex items-center gap-2 font-bold text-sm mt-auto self-start ${i === 0 ? "text-sky-400 hover:text-white" : "text-[#1DA599] hover:text-[#128277]"}`}>
                                        Pelajari detail <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA PREMIUM ── */}
            <section className="py-24 bg-[#0F172A] relative overflow-hidden" data-aos="fade-up">
                <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-[#1DA599]/20 -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#38BDF8]/20 translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none"></div>
                <div className="absolute inset-0 bg-[url('/assets/images/pattern.svg')] opacity-5"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-[#38BDF8] text-[11px] font-black tracking-widest uppercase mb-8 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse"></span>
                        Bersama PKK Tasikmalaya
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                        Wujudkan Tasikmalaya <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1DA599] to-[#38BDF8]">Mandiri Bersama Kami</span>
                    </h2>
                    <p className="text-gray-300 text-lg leading-relaxed mb-12 max-w-2xl mx-auto font-medium">
                        Dukung terlaksananya 10 Program Pokok PKK di lingkungan Anda. Bersama-sama, kita wujudkan masyarakat yang lebih sehat, cerdas, dan sejahtera.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                        <Link
                            href="#"
                            className="inline-flex items-center justify-center gap-2 bg-[#1DA599] hover:bg-teal-600 text-white font-bold px-10 py-4 rounded-full transition-all shadow-xl shadow-teal-600/30 text-base hover:-translate-y-1 hover:scale-105 w-full sm:w-auto"
                        >
                            Mulai Berkontribusi <ChevronRight size={18} />
                        </Link>
                        <Link
                            href="#"
                            className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white/20 hover:border-white/50 hover:bg-white/5 text-white font-bold px-10 py-4 rounded-full transition-all text-base w-full sm:w-auto"
                        >
                            <BookOpen size={18} />
                            Pelajari Organisasi
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
