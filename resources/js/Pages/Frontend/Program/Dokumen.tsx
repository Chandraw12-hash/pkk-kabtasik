import React, { useState } from "react";
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
    Sparkles,
    ArrowRight,
} from "lucide-react";

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
    const [activeFilter, setActiveFilter] = useState("Semua Kategori");
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="min-h-screen flex flex-col bg-[#FAFAFA] font-sans text-slate-900 pt-14 selection:bg-[#1DA599]/30">
            <Head title="Dokumen Publik - PKK Kabupaten Tasikmalaya" />
            <Navbar />

            {/* ── HERO MATCHED ── */}
            <section className="relative min-h-[420px] lg:min-h-[480px] flex items-center overflow-hidden" data-aos="fade-up">
                <div className="absolute inset-0 w-full h-full">
                    <img
                        src="/assets/images/hero.jpg"
                        alt="Dokumen Publik PKK"
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
                            <span>Repositori Dokumen</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
                            Dokumen <br className="hidden md:block"/>
                            <span className="text-[#38BDF8]">Publik</span>
                        </h1>
                        <p className="text-gray-200 text-base mb-8 leading-relaxed max-w-md">
                            Akses dan unduh berbagai dokumen resmi, panduan operasional, serta laporan kegiatan TP PKK Kabupaten Tasikmalaya.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl px-5 py-3 backdrop-blur-sm">
                                <div className="w-9 h-9 rounded-xl bg-[#1DA599]/20 flex items-center justify-center">
                                    <Clock size={16} className="text-[#1DA599]" />
                                </div>
                                <div>
                                    <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Update Terakhir</p>
                                    <p className="text-white text-sm font-semibold">12 Oktober 2024</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl px-5 py-3 backdrop-blur-sm">
                                <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center">
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
            <section className="relative z-20 -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-aos="fade-up" data-aos-delay="100">
                <div className="bg-white rounded-[28px] p-4 md:p-5 shadow-xl shadow-slate-200/50 flex flex-col lg:flex-row items-center gap-4 border border-gray-100">
                    <div className="relative w-full lg:flex-1">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari nama dokumen atau kata kunci..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 text-sm border-none focus:ring-0 text-[#0F172A] placeholder:text-gray-400 font-medium rounded-xl"
                        />
                    </div>
                    <div className="w-px h-8 bg-gray-200 hidden lg:block"></div>
                    <div className="flex gap-2 w-full lg:w-auto overflow-x-auto hide-scrollbar pb-2 lg:pb-0">
                        {filterKategori.map((kat) => (
                            <button
                                key={kat}
                                onClick={() => setActiveFilter(kat)}
                                className={`whitespace-nowrap px-6 py-3 rounded-full text-xs font-bold transition-all duration-300 ${
                                    activeFilter === kat
                                        ? "bg-gradient-to-r from-[#1DA599] to-[#128277] text-white shadow-lg shadow-teal-500/30"
                                        : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                                }`}
                            >
                                {kat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── KONTEN DOKUMEN ── */}
            <div className="py-16 flex flex-col gap-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                
                {/* 1. Panduan Resmi */}
                <section data-aos="fade-up">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center">
                                <Sparkles size={18} className="text-[#1DA599]" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-[#0F172A]">
                                Panduan Resmi
                            </h2>
                        </div>
                        <a href="#" className="text-sm font-bold text-[#1DA599] hover:text-teal-700 flex items-center gap-1">
                            Lihat Semua <ArrowRight size={16} />
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {panduanData.map((item, i) => (
                            <div key={item.id} data-aos="fade-up" data-aos-delay={i * 100} className="group relative bg-white rounded-[28px] p-7 border border-gray-100 shadow-lg shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                                <div className="flex items-start justify-between mb-5 relative z-10">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:scale-110 group-hover:bg-[#1DA599] transition-all duration-300">
                                        <item.icon size={22} className="text-slate-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <span className={`text-[9px] font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-full border ${item.badgeBg} ${item.badgeText}`}>
                                        {item.kategori}
                                    </span>
                                </div>
                                <h3 className="text-base font-black text-[#0F172A] mb-2 leading-snug group-hover:text-[#1DA599] transition-colors relative z-10">
                                    {item.title}
                                </h3>
                                <p className="text-[13px] text-gray-500 leading-relaxed mb-6 flex-grow relative z-10 font-medium">
                                    {item.desc}
                                </p>
                                <div className="flex items-center justify-between pt-5 border-t border-gray-100 relative z-10">
                                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400">
                                        <Clock size={13} />
                                        {item.date}
                                    </div>
                                    <button className="inline-flex items-center gap-2 text-sm font-bold text-[#1DA599] hover:text-teal-700 transition-colors">
                                        <FileDown size={16} />
                                        Download
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 2. Laporan & Evaluasi */}
                <section data-aos="fade-up">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                                <FileCheck size={18} className="text-slate-600" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-[#0F172A]">
                                Laporan & Evaluasi
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {laporanData.map((item, i) => (
                            <div key={item.id} data-aos="fade-up" data-aos-delay={i * 100} className="group bg-white rounded-[28px] p-7 border border-gray-100 shadow-lg shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex items-start gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-[#0F172A] transition-all duration-300">
                                    <item.icon size={24} className="text-slate-500 group-hover:text-white transition-colors" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[9px] font-extrabold tracking-widest text-[#1DA599] uppercase">
                                            {item.kategori}
                                        </span>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-[10px] font-medium text-gray-400">
                                            {item.size}
                                        </span>
                                    </div>
                                    <h3 className="text-base font-black text-[#0F172A] mb-2 group-hover:text-[#1DA599] transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-[13px] text-gray-500 leading-relaxed mb-5 font-medium">
                                        {item.desc}
                                    </p>
                                    <button className="inline-flex items-center gap-2 bg-slate-50 hover:bg-[#1DA599] hover:text-white text-slate-700 text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-300 border border-slate-100 hover:border-transparent">
                                        <FileDown size={15} />
                                        Unduh Laporan
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. Info Tambahan */}
                <section data-aos="fade-up">
                    <div className="bg-white border-2 border-dashed border-gray-200 rounded-[32px] p-12 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl shadow-sm flex items-center justify-center mb-5 border border-slate-100">
                            <FolderOpen size={24} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-black text-[#0F172A] mb-3">Dokumentasi Lainnya</h3>
                        <p className="text-sm text-gray-500 max-w-md mb-8 font-medium leading-relaxed">
                            Beberapa kategori seperti "Kegiatan Desa" atau "Arsip Lama" sedang 
                            dalam proses digitalisasi oleh tim Diskominfo.
                        </p>
                        <button className="bg-white border-2 border-gray-200 hover:border-[#1DA599] hover:text-[#1DA599] text-slate-700 font-bold text-sm px-7 py-3 rounded-full transition-all inline-flex items-center gap-2">
                            <Search size={15} />
                            Request Dokumen Spesifik
                        </button>
                    </div>
                </section>
            </div>

            {/* ── CTA HELP ADMIN ── */}
            <section className="pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full" data-aos="fade-up">
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
