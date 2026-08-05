import React, { useEffect, useRef, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import { Search, Calendar, User, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

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
    const heroAnim = useScrollAnimation();
    const contentAnim = useScrollAnimation();
    const ctaAnim = useScrollAnimation();

    const [activeFilter, setActiveFilter] = useState("Semua");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredBerita = beritaData.filter((item) => {
        const matchesCategory = activeFilter === "Semua" || item.kategori === activeFilter;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              item.desc.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div
            className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans text-slate-900 pt-14"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
            <style>{`::-webkit-scrollbar { display: none; } .anim-fade-up { opacity: 0; transform: translateY(28px); transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); } .anim-fade-up.show { opacity: 1; transform: translateY(0); }`}</style>

            <Head title="Berita Terkini - PKK Kabupaten Tasikmalaya" />
            <Navbar />

            {/* ── HERO ── */}
            <section
                ref={heroAnim.ref}
                className={`relative bg-[#0F172A] pt-20 pb-32 lg:pt-28 lg:pb-36 anim-fade-up ${heroAnim.isVisible ? "show" : ""}`}
            >
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1DA599]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 border border-[#1DA599]/30 text-[#1DA599] text-[10px] font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-full mb-5 bg-[#1DA599]/10">
                            PUSAT INFORMASI
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
                            Berita Terkini
                        </h1>
                        <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-lg">
                            Dapatkan informasi terbaru mengenai kegiatan, program, dan prestasi Tim Penggerak PKK Kabupaten Tasikmalaya.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── MAIN CONTENT (Filter & Grid) ── */}
            <section
                ref={contentAnim.ref}
                className={`relative z-20 -mt-16 pb-20 anim-fade-up ${contentAnim.isVisible ? "show" : ""}`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Filter & Search Bar */}
                    <div className="bg-white rounded-2xl p-4 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-4 mb-10 border border-gray-100">
                        <div className="flex gap-2 w-full md:w-auto overflow-x-auto hide-scrollbar">
                            {filterKategori.map((kat) => (
                                <button
                                    key={kat}
                                    onClick={() => setActiveFilter(kat)}
                                    className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-bold transition-colors border ${
                                        activeFilter === kat
                                            ? "bg-[#0F172A] text-white border-[#0F172A]"
                                            : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                                    }`}
                                >
                                    {kat}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-80">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari berita..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1DA599]/20 focus:border-[#1DA599] transition-all bg-white"
                            />
                        </div>
                    </div>

                    {/* Grid Berita */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {filteredBerita.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#1DA599]/30 transition-all duration-300 group flex flex-col"
                            >
                                <div className="relative h-52 overflow-hidden bg-gray-100">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center gap-4 mb-4 text-[11px] text-gray-500 font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} className="text-[#1DA599]" />
                                            {item.date}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <User size={14} className="text-[#1DA599]" />
                                            {item.author}
                                        </div>
                                    </div>
                                    <h3 className="text-[#0F172A] font-extrabold text-[17px] leading-snug mb-3 group-hover:text-[#1DA599] transition-colors line-clamp-2">
                                        <Link href="#">{item.title}</Link>
                                    </h3>
                                    <p className="text-gray-500 text-[13px] leading-relaxed mb-6 flex-grow line-clamp-3">
                                        {item.desc}
                                    </p>
                                    <Link href="#" className="inline-flex items-center gap-1.5 text-[#1DA599] text-[13px] font-bold hover:text-teal-700 transition-colors mt-auto">
                                        Selengkapnya <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {filteredBerita.length > 0 && (
                        <div className="flex items-center justify-center gap-2">
                            <button className="w-9 h-9 rounded-lg flex items-center justify-center bg-white border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
                                <ChevronLeft size={16} />
                            </button>
                            <button className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#0F172A] text-white font-bold text-sm shadow-md">
                                1
                            </button>
                            <button className="w-9 h-9 rounded-lg flex items-center justify-center bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition-colors">
                                2
                            </button>
                            <button className="w-9 h-9 rounded-lg flex items-center justify-center bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition-colors">
                                3
                            </button>
                            <span className="text-gray-400 px-1">...</span>
                            <button className="w-9 h-9 rounded-lg flex items-center justify-center bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition-colors">
                                12
                            </button>
                            <button className="w-9 h-9 rounded-lg flex items-center justify-center bg-white border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}

                    {filteredBerita.length === 0 && (
                        <div className="text-center py-12 text-gray-500 text-sm">
                            Tidak ada berita yang ditemukan.
                        </div>
                    )}
                </div>
            </section>

            {/* ── NEWSLETTER CTA ── */}
            <section
                ref={ctaAnim.ref}
                className={`bg-[#EAEFF8] py-16 lg:py-20 anim-fade-up ${ctaAnim.isVisible ? "show" : ""}`}
            >
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] mb-4">
                        Tetap Terhubung dengan PKK
                    </h2>
                    <p className="text-gray-600 text-[15px] leading-relaxed mb-8 max-w-xl mx-auto">
                        Dapatkan update langsung kegiatan dan program pemberdayaan keluarga di 
                        Kabupaten Tasikmalaya melalui email Anda.
                    </p>
                    
                    <form className="flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto">
                        <input 
                            type="email" 
                            placeholder="Alamat email Anda"
                            className="w-full px-5 py-3.5 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F172A] focus:border-transparent text-sm shadow-sm"
                            required
                        />
                        <button 
                            type="submit"
                            className="w-full sm:w-auto whitespace-nowrap bg-[#0F172A] hover:bg-slate-800 text-white font-bold px-8 py-3.5 rounded-full transition-all text-sm shadow-lg shadow-slate-900/10"
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
