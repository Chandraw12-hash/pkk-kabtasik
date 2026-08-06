import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import { Search, Calendar, User, ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const filterKategori = ["Semua", "Kegiatan", "Prestasi", "Pengumuman"];

const beritaData = [
    {
        id: 1,
        title: "Bunda Bedas Emma Dety Bicara Tentang Hari Kartini",
        date: "2024-05-25",
        author: "Master Admin",
        kategori: "Kegiatan",
        desc: "Bunda Bedas Hj. Emma Dety Dadang Supriatna mengungkapkan tentang pelaksanaan peringatan Hari Kartini ke-145 tingkat Kabupaten...",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 2,
        title: "TP PKK Kab Tasikmalaya Bentuk TPK di Tiap Tingkatan",
        date: "2024-05-23",
        author: "Master Admin",
        kategori: "Pengumuman",
        desc: "Dalam rangka penguatan peran TP PKK untuk berpartisipasi pada program Pembangunan Keluarga, Kependudukan dan penurunan stunting...",
        image: "https://images.unsplash.com/photo-1592424005742-8820c744f9ea?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 3,
        title: "Bunda Literasi Emma Dety: Berlian Fest 2024 Wahana...",
        date: "2024-05-20",
        author: "Master Admin",
        kategori: "Kegiatan",
        desc: "Kabupaten Tasikmalaya - Bunda Literasi Hj. Emma Dety mengatakan kegiatan Bedas Literasi Ramadan (Berlian Fest) merupakan wahana...",
        image: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 4,
        title: "Persiapan Lomba Pekarangan Mandiri",
        date: "2023-09-07",
        author: "Master Admin",
        kategori: "Kegiatan",
        desc: "Koordinasi teknis persiapan pelaksanaan lomba pekarangan di tingkat desa untuk mendorong ketahanan pangan keluarga...",
        image: "https://images.unsplash.com/photo-1576091160550-2173ff9e5c52?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 5,
        title: "Persiapan Pelaksanaan Rakorda TP-PKK Kabupaten",
        date: "2023-08-17",
        author: "Master Admin",
        kategori: "Kegiatan",
        desc: "Persiapan Pelaksanaan Rakorda TP-PKK & Persiapan Pelaksanaan Gerakan Keluarga Sehat Tanggap dan Tangguh Bencana...",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 6,
        title: "Pengurus TP-PKK Menghadiri Kegiatan World Cancer Day...",
        date: "2023-08-07",
        author: "Master Admin",
        kategori: "Kegiatan",
        desc: "Peringatan Hari Kanker Sedunia bertujuan untuk meningkatkan kesadaran masyarakat akan bahaya deteksi dini kanker...",
        image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=600&q=80",
    },
];

export default function Berita() {
    const [activeFilter, setActiveFilter] = useState("Semua");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredBerita = beritaData.filter((item) => {
        const matchesCategory = activeFilter === "Semua" || item.kategori === activeFilter;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              item.desc.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen flex flex-col bg-[#FAFAFA] font-sans text-slate-900 pt-14 selection:bg-[#1DA599]/30">
            <Head title="Berita Terkini - PKK Kabupaten Tasikmalaya" />
            <Navbar />

            {/* ── HERO MATCHED ── */}
            <section className="relative min-h-[420px] lg:min-h-[480px] flex items-center overflow-hidden" data-aos="fade-up">
                <div className="absolute inset-0 w-full h-full">
                    <img
                        src="/assets/images/hero.jpg"
                        alt="Pusat Informasi PKK"
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
                            <span>Pusat Informasi</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
                            Berita <br className="hidden md:block"/>
                            <span className="text-[#38BDF8]">Terkini</span>
                        </h1>
                        <p className="text-gray-200 text-base mb-8 leading-relaxed max-w-md">
                            Dapatkan informasi terbaru mengenai kegiatan, program, dan prestasi Tim Penggerak PKK Kabupaten Tasikmalaya.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── MAIN CONTENT (Filter & Grid) ── */}
            <section className="relative z-20 -mt-10 pb-20" data-aos="fade-up" data-aos-delay="100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Filter & Search Bar (Floating) */}
                    <div className="bg-white rounded-[28px] p-4 md:p-5 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-4 border border-gray-100 mb-12">
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar flex-1 w-full md:w-auto">
                            {filterKategori.map((kat) => (
                                <button
                                    key={kat}
                                    onClick={() => setActiveFilter(kat)}
                                    className={`whitespace-nowrap px-6 py-3 text-xs font-bold rounded-full transition-all duration-300 ${
                                        activeFilter === kat
                                            ? "bg-gradient-to-r from-[#1DA599] to-[#128277] text-white shadow-lg shadow-teal-500/30"
                                            : "bg-slate-50 text-gray-500 hover:bg-slate-100"
                                    }`}
                                >
                                    {kat}
                                </button>
                            ))}
                        </div>
                        <div className="w-px h-8 bg-gray-200 hidden md:block"></div>
                        <div className="relative min-w-[250px] w-full md:w-auto">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari berita..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 text-sm border-none focus:ring-0 focus:outline-none rounded-xl bg-slate-50 text-[#0F172A] placeholder:text-gray-400 font-medium"
                            />
                        </div>
                    </div>

                    {/* Grid Berita */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        {filteredBerita.map((item, i) => (
                            <div
                                key={item.id}
                                data-aos="fade-up"
                                data-aos-delay={(i % 3) * 100}
                                className="bg-white rounded-[28px] overflow-hidden border border-gray-100 shadow-lg shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-2 hover:border-[#1DA599]/30 transition-all duration-500 group flex flex-col"
                            >
                                <div className="relative h-56 overflow-hidden bg-gray-100">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[#1DA599] text-xs font-bold shadow-sm">
                                        <Sparkles size={14} />
                                        {item.kategori}
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center gap-4 mb-4 text-[11px] text-gray-500 font-medium uppercase tracking-wider">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} className="text-[#38BDF8]" />
                                            {item.date}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <User size={14} className="text-[#38BDF8]" />
                                            {item.author}
                                        </div>
                                    </div>
                                    <h3 className="text-[#0F172A] font-extrabold text-[17px] leading-snug mb-3 group-hover:text-[#1DA599] transition-colors line-clamp-2">
                                        <Link href="#">{item.title}</Link>
                                    </h3>
                                    <p className="text-gray-500 text-[13px] leading-relaxed mb-6 flex-grow line-clamp-3 font-medium">
                                        {item.desc}
                                    </p>
                                    <Link href="#" className="inline-flex items-center gap-1.5 text-[#1DA599] text-[13px] font-bold hover:text-teal-700 transition-colors mt-auto group/btn">
                                        Selengkapnya <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {filteredBerita.length > 0 && (
                        <div className="flex items-center justify-center gap-2">
                            <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
                                <ChevronLeft size={16} />
                            </button>
                            <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r from-[#1DA599] to-[#128277] text-white font-bold text-sm shadow-lg shadow-teal-500/30">
                                1
                            </button>
                            <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition-all shadow-sm">
                                2
                            </button>
                            <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition-all shadow-sm">
                                3
                            </button>
                            <span className="text-gray-400 px-1 font-bold">...</span>
                            <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition-all shadow-sm">
                                12
                            </button>
                            <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}

                    {filteredBerita.length === 0 && (
                        <div className="text-center py-16 text-gray-500 text-base font-medium">
                            Tidak ada berita yang ditemukan.
                        </div>
                    )}
                </div>
            </section>

            {/* ── NEWSLETTER CTA ── */}
            <section className="bg-gradient-to-br from-[#0F172A] to-[#1e293b] py-20 relative overflow-hidden" data-aos="fade-up">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#1DA599]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#38BDF8]/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3"></div>
                
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-5">
                        Tetap Terhubung dengan <span className="text-[#38BDF8]">PKK</span>
                    </h2>
                    <p className="text-gray-300 text-base leading-relaxed mb-10 max-w-xl mx-auto">
                        Dapatkan update langsung kegiatan dan program pemberdayaan keluarga di 
                        Kabupaten Tasikmalaya melalui email Anda.
                    </p>
                    
                    <form className="flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto">
                        <input 
                            type="email" 
                            placeholder="Alamat email Anda"
                            className="w-full px-6 py-4 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-[#1DA599] text-sm shadow-inner bg-white/10 text-white placeholder:text-gray-400 backdrop-blur-md"
                            required
                        />
                        <button 
                            type="submit"
                            className="w-full sm:w-auto whitespace-nowrap bg-[#1DA599] hover:bg-teal-600 text-white font-bold px-8 py-4 rounded-full transition-all text-sm shadow-lg shadow-teal-500/30"
                        >
                            Berlangganan
                        </button>
                    </form>
                </div>
            </section>

            <Footer />
        </div>
    );
}
