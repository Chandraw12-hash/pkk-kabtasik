import React, { useEffect, useRef, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import {
    Search,
    Clock,
    FileText,
    FileDown,
    Book,
    FileCheck,
    FolderOpen,
    HelpCircle,
    PhoneCall,
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

const filterKategori = ["Semua Kategori", "Kegiatan", "Panduan Resmi", "Laporan"];

const panduanData = [
    {
        id: 1,
        kategori: "PANDUAN",
        title: "Panduan Operasional Rakernas IX PKK",
        desc: "Buku saku panduan teknis pelaksanaan program kerja sesuai hasil Rapat Kerja Nasional IX.",
        date: "12 Sep 2024",
        icon: FileText,
        badgeBg: "bg-[#1DA599]/10",
        badgeText: "text-[#1DA599]",
    },
    {
        id: 2,
        kategori: "MODUL",
        title: "Modul Pelatihan Dasar Kader PKK",
        desc: "Materi dasar pemberdayaan masyarakat untuk kader baru di tingkat Desa/Kelurahan.",
        date: "05 Okt 2024",
        icon: Book,
        badgeBg: "bg-emerald-100",
        badgeText: "text-emerald-600",
    },
    {
        id: 3,
        kategori: "REGULASI",
        title: "Permendagri No. 36 Tahun 2020",
        desc: "Peraturan Menteri tentang Peraturan Pelaksanaan Peraturan Presiden Nomor 99 Tahun 2017.",
        date: "15 Jan 2024",
        icon: Book,
        badgeBg: "bg-teal-100",
        badgeText: "text-teal-600",
    },
];

const laporanData = [
    {
        id: 1,
        kategori: "DOKUMEN",
        size: "PDF | 4.5 MB",
        title: "Laporan Akhir Tahun 2023",
        desc: "Kompilasi pencapaian 10 Program Pokok PKK di Kabupaten Tasikmalaya sepanjang tahun 2023.",
        icon: FileText,
    },
    {
        id: 2,
        kategori: "EVALUASI",
        size: "DOCX | 2.1 MB",
        title: "Evaluasi Program Pokja III",
        desc: "Hasil audit internal dan evaluasi program ketahanan pangan keluarga triwulan III.",
        icon: FileCheck,
    },
];

export default function Dokumen() {
    const heroAnim = useScrollAnimation();
    const searchAnim = useScrollAnimation();
    const panduanAnim = useScrollAnimation();
    const laporanAnim = useScrollAnimation();
    const infoAnim = useScrollAnimation();
    const ctaAnim = useScrollAnimation();

    const [activeFilter, setActiveFilter] = useState("Semua Kategori");
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div
            className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans text-slate-900 pt-14"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
            <style>{`::-webkit-scrollbar { display: none; } .anim-fade-up { opacity: 0; transform: translateY(28px); transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); } .anim-fade-up.show { opacity: 1; transform: translateY(0); }`}</style>

            <Head title="Dokumen Publik - PKK Kabupaten Tasikmalaya" />
            <Navbar />

            {/* ── HERO ── */}
            <section
                ref={heroAnim.ref}
                className={`relative bg-[#0F172A] pt-20 pb-32 lg:pt-28 lg:pb-40 overflow-hidden anim-fade-up ${heroAnim.isVisible ? "show" : ""}`}
            >
                {/* Decoration Blobs */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#1a345e] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none opacity-50"></div>
                <div className="absolute bottom-0 right-10 w-[300px] h-[300px] bg-[#38BDF8] rounded-full blur-[120px] translate-y-1/3 pointer-events-none opacity-20"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 border border-[#1DA599]/30 text-[#1DA599] text-[10px] font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-full mb-5 bg-[#1DA599]/10">
                            <FolderOpen size={12} />
                            REPOSITORI
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
                            Dokumen Publik
                        </h1>
                        <p className="text-gray-400 text-[15px] leading-relaxed mb-8 max-w-lg">
                            Akses dan unduh berbagai dokumen resmi, panduan operasional, bahan tayang, 
                            serta laporan kegiatan TP PKK Kabupaten Tasikmalaya untuk mendukung 
                            kemandirian keluarga.
                        </p>
                        
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
                                <div className="w-8 h-8 rounded-full bg-[#1DA599]/20 flex items-center justify-center">
                                    <Clock size={16} className="text-[#1DA599]" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Update Terakhir</p>
                                    <p className="text-white text-sm font-semibold">12 Oktober 2024</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <FileText size={16} className="text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Total Dokumen</p>
                                    <p className="text-white text-sm font-semibold">129 Berkas</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SEARCH & FILTER (FLOATING) ── */}
            <section
                ref={searchAnim.ref}
                className={`relative z-20 -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 anim-fade-up ${searchAnim.isVisible ? "show" : ""}`}
            >
                <div className="bg-white rounded-2xl p-4 md:p-5 shadow-xl shadow-slate-200/50 flex flex-col lg:flex-row items-center gap-4 border border-gray-100">
                    <div className="relative w-full lg:flex-1">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari nama dokumen atau kata kunci..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 text-sm border-none focus:ring-0 text-[#0F172A] placeholder:text-gray-400 font-medium"
                        />
                    </div>
                    <div className="w-px h-8 bg-gray-200 hidden lg:block"></div>
                    <div className="flex gap-2 w-full lg:w-auto overflow-x-auto hide-scrollbar pb-2 lg:pb-0">
                        {filterKategori.map((kat) => (
                            <button
                                key={kat}
                                onClick={() => setActiveFilter(kat)}
                                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-bold transition-colors ${
                                    activeFilter === kat
                                        ? "bg-[#1DA599] text-white"
                                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                }`}
                            >
                                {kat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── KONTEN DOKUMEN ── */}
            <div className="py-12 flex flex-col gap-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                
                {/* 1. Panduan Resmi */}
                <section ref={panduanAnim.ref} className={`anim-fade-up ${panduanAnim.isVisible ? "show" : ""}`}>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-extrabold text-[#0F172A] flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-[#1DA599] rounded-full"></span>
                            Panduan Resmi
                        </h2>
                        <a href="#" className="text-xs font-bold text-[#1DA599] hover:text-teal-700 flex items-center gap-1">
                            Lihat Semua <ChevronRight size={14} />
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {panduanData.map((item) => (
                            <div key={item.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow group flex flex-col h-full">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform">
                                        <item.icon size={20} className="text-slate-600" />
                                    </div>
                                    <span className={`text-[9px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-full ${item.badgeBg} ${item.badgeText}`}>
                                        {item.kategori}
                                    </span>
                                </div>
                                <h3 className="text-[15px] font-bold text-[#0F172A] mb-2 leading-snug group-hover:text-[#1DA599] transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-xs text-gray-500 leading-relaxed mb-6 flex-grow">
                                    {item.desc}
                                </p>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-400">
                                        <Clock size={12} />
                                        {item.date}
                                    </div>
                                    <button className="flex items-center gap-1.5 text-xs font-bold text-[#1DA599] hover:text-teal-700 transition-colors">
                                        <FileDown size={14} />
                                        Download
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 2. Laporan & Evaluasi */}
                <section ref={laporanAnim.ref} className={`anim-fade-up ${laporanAnim.isVisible ? "show" : ""}`}>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-extrabold text-[#0F172A] flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-[#0F172A] rounded-full"></span>
                            Laporan & Evaluasi
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {laporanData.map((item) => (
                            <div key={item.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-start gap-5">
                                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                                    <item.icon size={22} className="text-slate-500" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="text-[9px] font-extrabold tracking-widest text-[#1DA599] uppercase">
                                            {item.kategori}
                                        </span>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-[9px] font-medium text-gray-400">
                                            {item.size}
                                        </span>
                                    </div>
                                    <h3 className="text-[15px] font-bold text-[#0F172A] mb-1.5">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 leading-relaxed mb-4">
                                        {item.desc}
                                    </p>
                                    <button className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                                        <FileDown size={14} />
                                        Unduh Laporan
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. Empty State / Info Tambahan */}
                <section ref={infoAnim.ref} className={`anim-fade-up ${infoAnim.isVisible ? "show" : ""}`}>
                    <div className="bg-[#F1F5F9] border border-gray-200 border-dashed rounded-[32px] p-10 flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                            <FolderOpen size={20} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-[#0F172A] mb-2">Dokumentasi Lainnya</h3>
                        <p className="text-sm text-gray-500 max-w-md mb-6">
                            Beberapa kategori seperti "Kegiatan Desa" atau "Arsip Lama" sedang 
                            dalam proses digitalisasi oleh tim Diskominfo.
                        </p>
                        <button className="bg-white border border-gray-200 hover:border-gray-300 text-slate-700 font-semibold text-xs px-5 py-2.5 rounded-full transition-colors inline-flex items-center gap-2">
                            <Search size={14} />
                            Request Dokumen Spesifik
                        </button>
                    </div>
                </section>
            </div>

            {/* ── CTA HELP ADMIN ── */}
            <section ref={ctaAnim.ref} className={`pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full anim-fade-up ${ctaAnim.isVisible ? "show" : ""}`}>
                <div className="bg-[#071330] rounded-[32px] overflow-hidden flex flex-col lg:flex-row items-center border border-slate-800 shadow-2xl relative">
                    <div className="p-10 md:p-14 lg:w-3/5 relative z-10">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
                            Butuh Bantuan Navigasi?
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-md">
                            Tim admin kami siap membantu Anda menemukan dokumen atau panduan 
                            yang Anda butuhkan untuk operasional PKK di wilayah Anda.
                        </p>
                        <div className="flex flex-wrap items-center gap-4">
                            <Link href="#" className="inline-flex items-center gap-2 bg-[#1DA599] hover:bg-teal-600 text-white font-bold px-6 py-3 rounded-full transition-all text-sm shadow-lg shadow-teal-500/20">
                                <PhoneCall size={16} />
                                Hubungi Admin
                            </Link>
                            <Link href="#" className="inline-flex items-center gap-2 bg-transparent border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-semibold px-6 py-3 rounded-full transition-all text-sm">
                                <HelpCircle size={16} />
                                FAQ Dokumen
                            </Link>
                        </div>
                    </div>
                    <div className="lg:w-2/5 w-full h-64 lg:h-auto relative">
                        <img 
                            src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80" 
                            alt="Admin Support" 
                            className="w-full h-full object-cover object-center lg:rounded-l-[32px]"
                            onError={(e) => {
                                e.currentTarget.src = "/assets/images/hero.jpg";
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#071330] via-[#071330]/50 to-transparent lg:block hidden"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#071330] via-[#071330]/50 to-transparent lg:hidden block"></div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
