import React, { useEffect, useRef, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import {
    Download,
    CheckCircle,
    Sparkles,
    Target,
    BarChart2,
    ShieldCheck,
    ChevronRight,
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

const tugasPokok = [
    "Merencanakan, melaksanakan dan membina pelaksanaan program kerja TP PKK sesuai kebijakan setempat.",
    "Menghimpun, menggerakkan dan membina potensi masyarakat, khususnya keluarga untuk melaksanakan program PKK.",
    "Memberikan bimbingan, motivasi dan membina Tim Penggerak PKK serta para kader secara berjenjang.",
    "Menyampaikan laporan pelaksanaan tugasnya PKK kepada Ketua Pembina dan Tim Penggerak PKK setingkat di atasnya.",
    "Melaksanakan Monitoring, Evaluasi, dan Pelaporan (SMELP) terhadap pelaksanaan program-program PKK.",
];

const fungsiStrategis = [
    {
        title: "Penyuluh & Motivator",
        desc: "Penyuluhan dan motivasi kepada masyarakat dalam melaksanakan 10 Program Pokok PKK.",
        icon: Sparkles,
        color: "text-cyan-300",
        bg: "bg-cyan-500/20",
    },
    {
        title: "Penggerak Program",
        desc: "Menggerakkan dan membina masyarakat untuk berpartisipasi aktif dalam Program PKK.",
        icon: Target,
        color: "text-blue-300",
        bg: "bg-blue-500/20",
    },
    {
        title: "Fasilitator & Perencana",
        desc: "Memfasilitasi kegiatan dan merencanakan berbagai program strategis untuk Kabupaten Tasikmalaya.",
        icon: BarChart2,
        color: "text-teal-300",
        bg: "bg-teal-500/20",
    },
    {
        title: "Pengendali & Pembina",
        desc: "Mengendalikan seluruh kegiatan PKK dan membina bagi kader-kader PKK di seluruh lapisan.",
        icon: ShieldCheck,
        color: "text-indigo-300",
        bg: "bg-indigo-500/20",
    },
];

const rincianOperasional = [
    "Merancang rencana kerja sebagai penjabaran dari Rencana PKK dan daerah sebagai skala prioritas daerah.",
    "Mengkoordinasikan dan mengupayakan ketercapaian kerja kepada pemerintah daerah setempat.",
    "Membantu bimbingan dan pembinaan kepada Tim Penggerak PKK di tingkat Kecamatan.",
    "Melaksanakan monitoring dan evaluasi secara periodik terhadap kegiatan tiap kegiatan.",
    "Melaksanakan tertib administrasi organisasi sesuai dengan ketentuan hasil Rakernas PKK.",
    "Meningkatkan mutu pengelolaan gerakan PKK dan menjadikan Sumber Daya Manusia (SDM) Kader.",
    "Menyusun dan menyajikan laporan tahunan serta laporan khusus sebagai bahan evaluasi kebijakan.",
    "Melaksanakan konsultasi rutin dengan Ketua Pembina PKK terkait seluruh strategi pembangunan.",
    "Menciptakan kerja sama kolaboratif dengan berbagai mitra kerja, baik pemerintah maupun swasta.",
];

export default function TugasFungsi() {
    const heroAnim = useScrollAnimation();
    const mainAnim = useScrollAnimation();
    const rincianAnim = useScrollAnimation();

    return (
        <div
            className="min-h-screen flex flex-col bg-white font-sans text-slate-900 pt-14"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
            <style>{`::-webkit-scrollbar { display: none; } .anim-fade-up { opacity: 0; transform: translateY(28px); transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); } .anim-fade-up.show { opacity: 1; transform: translateY(0); }`}</style>

            <Head title="Tugas Pokok & Fungsi PKK - PKK Kabupaten Tasikmalaya" />
            <Navbar />

            {/* ── HERO ── */}
            <section
                ref={heroAnim.ref}
                className={`relative min-h-[420px] lg:min-h-[480px] flex items-center overflow-hidden anim-fade-up ${heroAnim.isVisible ? "show" : ""}`}
            >
                <div className="absolute inset-0 w-full h-full">
                    <img
                        src="/assets/images/hero.jpg"
                        alt="Tugas Pokok dan Fungsi PKK"
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                            e.currentTarget.src =
                                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80";
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#071330]/90 via-[#071330]/70 to-[#071330]/40"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 text-[#38BDF8] text-xs font-bold tracking-widest uppercase mb-5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]"></span>
                            <span>Mandat & Prioritas</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
                            Tugas Pokok <br />
                            <span className="text-[#38BDF8]">&amp; Fungsi PKK</span>
                        </h1>
                        <p className="text-gray-300 text-base mb-8 leading-relaxed max-w-md">
                            Memahami peran strategis Tim Penggerak PKK sebagai katalisator
                            pemberdayaan keluarga dan mitra utama pembangunan masyarakat di
                            Kabupaten Tasikmalaya.
                        </p>
                        <a
                            href="#"
                            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-7 py-3 rounded-full transition-all text-sm backdrop-blur-sm"
                        >
                            <Download size={16} />
                            Unduh Dokumen
                        </a>
                    </div>
                </div>
            </section>

            {/* ── TUGAS POKOK + FUNGSI STRATEGIS ── */}
            <section
                ref={mainAnim.ref}
                className={`py-20 bg-white anim-fade-up ${mainAnim.isVisible ? "show" : ""}`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Kiri: Tugas Pokok */}
                        <div className="bg-[#0F172A] rounded-3xl p-8 flex flex-col gap-6 shadow-xl shadow-slate-900/20">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/20 flex items-center justify-center">
                                    <CheckCircle size={22} className="text-[#38BDF8]" />
                                </div>
                                <h2 className="text-2xl font-extrabold text-white">
                                    Tugas Pokok
                                </h2>
                            </div>
                            <ul className="space-y-5">
                                {tugasPokok.map((tugas, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle
                                            size={18}
                                            className="text-[#38BDF8] flex-shrink-0 mt-0.5"
                                        />
                                        <p className="text-gray-300 text-[14px] leading-relaxed">
                                            {tugas}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Kanan: Fungsi Strategis */}
                        <div className="bg-[#071C3B] rounded-3xl p-8 shadow-xl shadow-slate-900/20 flex flex-col gap-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-[#1DA599]/20 flex items-center justify-center">
                                    <Sparkles size={22} className="text-[#1DA599]" />
                                </div>
                                <h2 className="text-2xl font-extrabold text-white">
                                    Fungsi Strategis
                                </h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {fungsiStrategis.map((f, i) => (
                                    <div
                                        key={i}
                                        className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 transition-colors"
                                    >
                                        <div
                                            className={`w-9 h-9 rounded-lg ${f.bg} flex items-center justify-center mb-3`}
                                        >
                                            <f.icon size={18} className={f.color} />
                                        </div>
                                        <h3 className="text-white font-bold text-sm mb-1.5">
                                            {f.title}
                                        </h3>
                                        <p className="text-gray-400 text-xs leading-relaxed">
                                            {f.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── RINCIAN OPERASIONAL ── */}
            <section
                ref={rincianAnim.ref}
                className={`py-20 bg-gray-50 border-t border-gray-100 anim-fade-up ${rincianAnim.isVisible ? "show" : ""}`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <div className="inline-block text-[#1DA599] font-bold tracking-widest text-xs uppercase mb-3 border-l-[3px] border-[#1DA599] pl-3 text-left">
                            DETAIL PELAKSANAAN
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-3">
                            Rincian Operasional
                        </h2>
                        <p className="text-gray-500 text-[15px] max-w-lg mx-auto leading-relaxed">
                            Sembilan poin rincian tugas dan fungsi operasional Tim Penggerak
                            PKK sesuai dengan tata kelola kelembagaan yang terstruktur.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rincianOperasional.map((item, i) => (
                            <div
                                key={i}
                                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-[#1DA599]/30 transition-all duration-300 group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#E5F5F4] group-hover:bg-[#1DA599] flex items-center justify-center transition-colors">
                                        <span className="text-[#1DA599] group-hover:text-white font-extrabold text-sm transition-colors">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed pt-1.5">
                                        {item}
                                    </p>
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
