import React, { useEffect, useRef, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import { Calendar, Search, ChevronLeft, ChevronRight } from "lucide-react";

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

const galeriData = [
    {
        id: 1,
        title: "Sosialisasi Pola Asuh Anak & Remaja",
        date: "12 Mei 2024",
        category: "POKJA I",
        desc: "Kegiatan pembekalan bagi kader PKK di tingkat kecamatan mengenai pola asuh.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
        badgeBg: "bg-blue-50",
        badgeText: "text-blue-600",
    },
    {
        id: 2,
        title: "Pemanfaatan Tanah Pekarangan",
        date: "10 Mei 2024",
        category: "POKJA III",
        desc: "Implementasi program Hatinya PKK melalui penanaman sayuran produktif.",
        image: "https://images.unsplash.com/photo-1592424005742-8820c744f9ea?auto=format&fit=crop&w=600&q=80",
        badgeBg: "bg-orange-50",
        badgeText: "text-orange-600",
    },
    {
        id: 3,
        title: "Pemeriksaan Kesehatan Gratis",
        date: "08 Mei 2024",
        category: "POKJA IV",
        desc: "Layanan kesehatan gratis bagi lansia dan balita di wilayah Posyandu binaan.",
        image: "https://images.unsplash.com/photo-1576091160550-2173ff9e5c52?auto=format&fit=crop&w=600&q=80",
        badgeBg: "bg-teal-50",
        badgeText: "text-teal-600",
    },
    {
        id: 4,
        title: "Rapat Koordinasi Bulanan",
        date: "05 Mei 2024",
        category: "UMUM",
        desc: "Evaluasi rutin program kerja semester pertama tahun 2024 bersama seluruh kader.",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
        badgeBg: "bg-slate-100",
        badgeText: "text-slate-600",
    },
    {
        id: 5,
        title: "Pelatihan Kewirausahaan Ibu",
        date: "01 Mei 2024",
        category: "POKJA II",
        desc: "Mendorong kemandirian ekonomi keluarga melalui pelatihan UMKM lokal.",
        image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=600&q=80",
        badgeBg: "bg-emerald-50",
        badgeText: "text-emerald-600",
    },
    {
        id: 6,
        title: "Pameran UP2K Tingkat Kab.",
        date: "25 Apr 2024",
        category: "POKJA II",
        desc: "Ajang promosi produk unggulan kelompok Usaha Peningkatan Pendapatan Keluarga.",
        image: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=600&q=80",
        badgeBg: "bg-emerald-50",
        badgeText: "text-emerald-600",
    },
];

const categories = ["Semua", "Pokja I", "Pokja II", "Pokja III", "Pokja IV", "Umum"];

export default function GaleriKegiatan() {
    const heroAnim = useScrollAnimation();
    const contentAnim = useScrollAnimation();
    const [activeCategory, setActiveCategory] = useState("Semua");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredGaleri = galeriData.filter((item) => {
        const matchesCategory = activeCategory === "Semua" || item.category === activeCategory.toUpperCase();
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              item.desc.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div
            className="min-h-screen flex flex-col bg-white font-sans text-slate-900 pt-14"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
            <style>{`::-webkit-scrollbar { display: none; } .anim-fade-up { opacity: 0; transform: translateY(28px); transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); } .anim-fade-up.show { opacity: 1; transform: translateY(0); }`}</style>

            <Head title="Galeri Kegiatan - PKK Kabupaten Tasikmalaya" />
            <Navbar />

            {/* ── HERO ── */}
            <section
                ref={heroAnim.ref}
                className={`relative bg-[#0F172A] pt-20 pb-16 lg:pt-28 lg:pb-24 anim-fade-up ${heroAnim.isVisible ? "show" : ""}`}
            >
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1DA599]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#38BDF8]/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-2xl">
                        <div className="inline-block bg-[#1DA599]/20 text-[#1DA599] text-[10px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full mb-4">
                            DOKUMENTASI VISUAL
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
                            Galeri Kegiatan PKK Tasikmalaya
                        </h1>
                        <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-lg">
                            Mendokumentasikan setiap langkah pemberdayaan dan kesejahteraan
                            keluarga di Kabupaten Tasikmalaya. Dari pelatihan kader hingga aksi sosial di
                            pelosok desa.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── KONTEN GALERI ── */}
            <section
                ref={contentAnim.ref}
                className={`py-12 bg-gray-50 anim-fade-up ${contentAnim.isVisible ? "show" : ""}`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Filter & Search Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`whitespace-nowrap px-5 py-2 text-xs font-bold rounded-full transition-all duration-200 ${
                                        activeCategory === cat
                                            ? "bg-[#0F172A] text-white"
                                            : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className="relative min-w-[250px]">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari kegiatan..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1DA599]/20 focus:border-[#1DA599] transition-all bg-white"
                            />
                        </div>
                    </div>

                    {/* Grid Galeri */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {filteredGaleri.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
                            >
                                <div className="relative h-48 overflow-hidden bg-gray-100">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="p-5 flex flex-col flex-grow">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={`text-[9px] font-extrabold tracking-widest uppercase ${item.badgeText} ${item.badgeBg} px-2 py-1 rounded-sm`}>
                                            {item.category}
                                        </span>
                                        <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-medium">
                                            <Calendar size={12} />
                                            {item.date}
                                        </div>
                                    </div>
                                    <h3 className="text-[#0F172A] font-bold text-sm mb-2 group-hover:text-[#1DA599] transition-colors line-clamp-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {filteredGaleri.length > 0 && (
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

                    {filteredGaleri.length === 0 && (
                        <div className="text-center py-12 text-gray-500 text-sm">
                            Tidak ada kegiatan yang ditemukan.
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
