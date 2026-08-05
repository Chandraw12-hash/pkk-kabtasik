import React, { useEffect, useRef, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import {
    ChevronRight,
    BookOpen,
    Globe,
    Award,
    Users,
    Leaf,
    Heart,
    ArrowRight,
    Quote,
    MapPin,
    Calendar,
    Shield,
    Sprout,
    TrendingUp,
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
            { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
        );
        if (ref.current) observer.observe(ref.current);
        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, []);
    return { ref, isVisible };
}

export default function Sejarah() {
    const heroAnim = useScrollAnimation();
    const contentAnim = useScrollAnimation();
    const statsAnim = useScrollAnimation();
    const inovasiAnim = useScrollAnimation();

    return (
        <div
            className="min-h-screen flex flex-col bg-white font-sans text-slate-900 pt-14"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
            <style>{`::-webkit-scrollbar { display: none; } .anim-fade-up { opacity: 0; transform: translateY(30px); transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); } .anim-fade-up.show { opacity: 1; transform: translateY(0); }`}</style>

            <Head title="Sejarah PKK - PKK Kabupaten Tasikmalaya" />
            <Navbar />

            {/* ── HERO ── */}
            <section
                ref={heroAnim.ref}
                className={`relative h-[420px] lg:h-[500px] flex items-center overflow-hidden anim-fade-up ${heroAnim.isVisible ? "show" : ""}`}
            >
                <div className="absolute inset-0 w-full h-full">
                    <img
                        src="/assets/images/hero.jpg"
                        alt="Sejarah PKK Kabupaten Tasikmalaya"
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                            e.currentTarget.src =
                                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80";
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#071330]/85 via-[#071330]/60 to-[#071330]/30"></div>
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 text-[#38BDF8] text-xs font-bold tracking-widest uppercase mb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]"></span>
                            <span>Jelajahi Sejarah PKK</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                            Sejarah PKK
                        </h1>
                        <p className="text-gray-300 text-base mb-8 leading-relaxed max-w-md">
                            Menelusuri perjalanan panjang gerakan Pemberdayaan
                            Kesejahteraan Keluarga dalam membangun dan memperkuat
                            sendi-sendi kehidupan bangsa.
                        </p>
                        <Link
                            href="#sejarah-konten"
                            className="inline-flex items-center gap-2 bg-[#38BDF8] hover:bg-cyan-500 text-[#071330] font-bold px-7 py-3 rounded-full transition-all shadow-lg shadow-cyan-500/30 text-sm"
                        >
                            Explore History <ChevronRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── KONTEN SEJARAH ── */}
            <section
                id="sejarah-konten"
                ref={contentAnim.ref}
                className={`py-20 bg-white anim-fade-up ${contentAnim.isVisible ? "show" : ""}`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-14 items-start">
                        {/* Kiri: Gambar / Mockup Browser */}
                        <div className="w-full lg:w-5/12">
                            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
                                {/* Browser Bar */}
                                <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-red-400"></span>
                                    <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                                    <span className="w-3 h-3 rounded-full bg-green-400"></span>
                                    <div className="ml-3 flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-400 border border-gray-200">
                                        PKK Kab. Tasikmalaya
                                    </div>
                                </div>
                                {/* Gambar Konten */}
                                <div className="relative h-72 bg-gray-50">
                                    <img
                                        src="/assets/images/hero.jpg"
                                        alt="Kegiatan PKK Tasikmalaya"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=800&q=80";
                                        }}
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1DA599]/80 to-transparent p-4">
                                        <span className="text-white text-xs font-bold tracking-widest uppercase">
                                            GERAKAN UNTUK PEMBERDAYAAN
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                                    <p className="text-xs text-gray-500 font-medium">
                                        PKK Kabupaten Tasikmalaya – Pemberdayaan & Kesejahteraan Keluarga
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Kanan: Teks Sejarah */}
                        <div className="w-full lg:w-7/12">
                            <div className="inline-block text-[#1DA599] font-bold tracking-widest text-xs uppercase mb-3 border-l-[3px] border-[#1DA599] pl-3">
                                JEJAK LANGKAH SEJARAH NASIONAL
                            </div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-6">
                                Sejarah Singkat PKK
                            </h2>
                            <div className="space-y-4 text-gray-600 text-[15px] leading-relaxed">
                                <p>
                                    Gerakan Pemberdayaan dan Kesejahteraan Keluarga (PKK)
                                    merupakan gerakan nasional yang tumbuh dan berkembang
                                    dari bawah, dikelola oleh masyarakat dengan perempuan
                                    sebagai penggerak untuk membangun keluarga yang
                                    berakhlak mulia, sehat, sejahtera, maju, dan mandiri.
                                </p>
                                <p>
                                    Sejarah PKK dimulai ketika pada tahun 1960 an sebagai
                                    inisiatif pemberdayaan masyarakat dalam meningkatkan
                                    kualitas hidup keluarga di bidang pendidikan, kesehatan,
                                    ekonomi, dan sosial budaya.
                                </p>
                            </div>

                            {/* Blockquote */}
                            <div className="my-8 bg-[#E5F5F4] rounded-2xl p-6 relative">
                                <Quote
                                    size={36}
                                    className="text-[#1DA599]/30 absolute top-4 left-4"
                                />
                                <blockquote className="pl-8 pt-2">
                                    <p className="text-[#0F172A] font-bold text-lg leading-relaxed italic">
                                        "Keluarga adalah unit terkecil yang menentukan masa
                                        depan bangsa."
                                    </p>
                                </blockquote>
                            </div>

                            <div className="space-y-4 text-gray-600 text-[15px] leading-relaxed">
                                <p>
                                    Seiring perkembangan zaman, PKK terus menjadi mitra
                                    strategis pemerintah dalam implementasi 10 Program Pokok
                                    PKK yang bertujuan meningkatkan kesejahteraan masyarakat
                                    dan memperkuat ketahanan keluarga secara menyeluruh.
                                </p>
                                <p>
                                    Di Kabupaten Tasikmalaya, PKK hadir sebagai bagian dari
                                    sistem pemberdayaan masyarakat, serta menjangkau seluruh
                                    lapisan masyarakat dari tingkat kabupaten hingga desa,
                                    untuk mewujudkan Kabupaten Tasikmalaya yang sejahtera,
                                    maju, dan berkeadilan bagi seluruh masyarakatnya.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── STATISTIK ── */}
            <section
                ref={statsAnim.ref}
                className={`py-16 bg-gray-50 border-y border-gray-100 anim-fade-up ${statsAnim.isVisible ? "show" : ""}`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                        {[
                            {
                                value: "1960+",
                                label: "PKK MULAI BERDIRI",
                                desc: "Sebagai gerakan pemberdayaan masyarakat yang lahir di Indonesia untuk mendukung kemajuan keluarga.",
                                icon: Calendar,
                                color: "text-[#38BDF8]",
                                bg: "bg-[#38BDF8]/10",
                            },
                            {
                                value: "10",
                                label: "PROGRAM POKOK PKK",
                                desc: "Program unggulan yang mencakup berbagai bidang kehidupan masyarakat secara menyeluruh.",
                                icon: BookOpen,
                                color: "text-[#1DA599]",
                                bg: "bg-[#1DA599]/10",
                            },
                            {
                                value: "Nasional",
                                label: "GERAKAN NASIONAL",
                                desc: "Diakui sebagai gerakan nasional yang berperan strategis dalam pembangunan masyarakat.",
                                icon: Globe,
                                color: "text-indigo-500",
                                bg: "bg-indigo-50",
                            },
                        ].map((s, i) => (
                            <div
                                key={i}
                                className="flex flex-col items-center gap-3"
                            >
                                <div
                                    className={`w-14 h-14 rounded-full ${s.bg} flex items-center justify-center`}
                                >
                                    <s.icon size={28} className={s.color} />
                                </div>
                                <h3
                                    className={`text-5xl font-black ${s.color}`}
                                >
                                    {s.value}
                                </h3>
                                <p className="text-[11px] font-black text-[#0F172A] tracking-widest uppercase">
                                    {s.label}
                                </p>
                                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                                    {s.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── INOVASI KABUPATEN TASIKMALAYA ── */}
            <section
                ref={inovasiAnim.ref}
                className={`py-24 bg-white anim-fade-up ${inovasiAnim.isVisible ? "show" : ""}`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                        <div>
                            <div className="inline-block text-[#1DA599] font-bold tracking-widest text-xs uppercase mb-3 border-l-[3px] border-[#1DA599] pl-3">
                                PROGRAM UNGGULAN
                            </div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A]">
                                Inovasi Kabupaten{" "}
                                <span className="text-[#1DA599]">Tasikmalaya</span>
                            </h2>
                            <p className="text-gray-500 text-sm mt-2 max-w-lg leading-relaxed">
                                Berbagai inovasi yang menjadi bagian dari sejarah dan
                                langkah nyata untuk kemajuan Tasikmalaya.
                            </p>
                        </div>
                        <Link
                            href="#"
                            className="inline-flex items-center gap-2 border-2 border-[#1DA599] text-[#1DA599] hover:bg-[#1DA599] hover:text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all whitespace-nowrap"
                        >
                            Lihat Program PKK <ChevronRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
                        {[
                            {
                                title: "Penanganan Stunting",
                                desc: "Program prioritas intervensi gizi keluarga untuk menurunkan angka stunting di Kabupaten Tasikmalaya.",
                                icon: Shield,
                                img: "/assets/images/hero.jpg",
                                badge: "POKJA IV",
                                badgeColor: "bg-teal-500",
                            },
                            {
                                title: "Pemberdayaan Ekonomi",
                                desc: "Pelatihan usaha, koperasi, dan pemberdayaan ekonomi keluarga melalui berbagai program PKK.",
                                icon: TrendingUp,
                                img: "https://images.unsplash.com/photo-1556910103-1c02745a872e?auto=format&fit=crop&w=600&q=80",
                                badge: "POKJA II",
                                badgeColor: "bg-emerald-500",
                            },
                            {
                                title: "Ketahanan Pangan",
                                desc: "Inovasi lahan pangan keluarga dan program ketahanan pangan rumah tangga untuk Tasikmalaya.",
                                icon: Sprout,
                                img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80",
                                badge: "POKJA III",
                                badgeColor: "bg-orange-500",
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="group rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-xl transition-shadow duration-300 flex flex-col bg-white"
                            >
                                <div className="relative h-52 overflow-hidden">
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=600&q=80";
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                    <span
                                        className={`absolute top-4 left-4 ${item.badgeColor} text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full`}
                                    >
                                        {item.badge}
                                    </span>
                                    <div className="absolute bottom-4 left-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow">
                                        <item.icon size={20} className="text-[#1DA599]" />
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-lg font-extrabold text-[#0F172A] mb-2 group-hover:text-[#1DA599] transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm leading-relaxed flex-grow">
                                        {item.desc}
                                    </p>
                                    <Link
                                        href="#"
                                        className="mt-5 inline-flex items-center text-[#1DA599] text-xs font-bold hover:underline gap-1"
                                    >
                                        Selengkapnya <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
