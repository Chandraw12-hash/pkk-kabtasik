import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import { Calendar, Search, ChevronLeft, ChevronRight, Sparkles, Eye } from "lucide-react";

const galeriData = [
    {
        id: 1,
        title: "Sosialisasi Pola Asuh Anak & Remaja",
        date: "12 Mei 2024",
        category: "POKJA I",
        desc: "Kegiatan pembekalan bagi kader PKK di tingkat kecamatan mengenai pola asuh.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
        badgeText: "text-blue-600",
        badgeBg: "bg-blue-50 border-blue-100",
    },
    {
        id: 2,
        title: "Pemanfaatan Tanah Pekarangan",
        date: "10 Mei 2024",
        category: "POKJA III",
        desc: "Implementasi program Hatinya PKK melalui penanaman sayuran produktif.",
        image: "https://images.unsplash.com/photo-1592424005742-8820c744f9ea?auto=format&fit=crop&w=600&q=80",
        badgeText: "text-orange-600",
        badgeBg: "bg-orange-50 border-orange-100",
    },
    {
        id: 3,
        title: "Pemeriksaan Kesehatan Gratis",
        date: "08 Mei 2024",
        category: "POKJA IV",
        desc: "Layanan kesehatan gratis bagi lansia dan balita di wilayah Posyandu binaan.",
        image: "https://images.unsplash.com/photo-1576091160550-2173ff9e5c52?auto=format&fit=crop&w=600&q=80",
        badgeText: "text-teal-600",
        badgeBg: "bg-teal-50 border-teal-100",
    },
    {
        id: 4,
        title: "Rapat Koordinasi Bulanan",
        date: "05 Mei 2024",
        category: "UMUM",
        desc: "Evaluasi rutin program kerja semester pertama tahun 2024 bersama seluruh kader.",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
        badgeText: "text-slate-600",
        badgeBg: "bg-slate-50 border-slate-100",
    },
    {
        id: 5,
        title: "Pelatihan Kewirausahaan Ibu",
        date: "01 Mei 2024",
        category: "POKJA II",
        desc: "Mendorong kemandirian ekonomi keluarga melalui pelatihan UMKM lokal.",
        image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=600&q=80",
        badgeText: "text-emerald-600",
        badgeBg: "bg-emerald-50 border-emerald-100",
    },
    {
        id: 6,
        title: "Pameran UP2K Tingkat Kab.",
        date: "25 Apr 2024",
        category: "POKJA II",
        desc: "Ajang promosi produk unggulan kelompok Usaha Peningkatan Pendapatan Keluarga.",
        image: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=600&q=80",
        badgeText: "text-emerald-600",
        badgeBg: "bg-emerald-50 border-emerald-100",
    },
];

const categories = ["Semua", "Pokja I", "Pokja II", "Pokja III", "Pokja IV", "Umum"];

export default function GaleriKegiatan() {
    const [activeCategory, setActiveCategory] = useState("Semua");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredGaleri = galeriData.filter((item) => {
        const matchesCategory = activeCategory === "Semua" || item.category === activeCategory.toUpperCase();
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              item.desc.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen flex flex-col bg-[#FAFAFA] font-sans text-slate-900 pt-14 selection:bg-[#1DA599]/30">
            <Head title="Galeri Kegiatan - PKK Kabupaten Tasikmalaya" />
            <Navbar />

            {/* ── HERO MATCHED ── */}
            <section className="relative min-h-[420px] lg:min-h-[480px] flex items-center overflow-hidden" data-aos="fade-up">
                <div className="absolute inset-0 w-full h-full">
                    <img
                        src="/assets/images/hero.jpg"
                        alt="Galeri Kegiatan PKK"
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
                            <span>Dokumentasi Visual</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
                            Galeri <br className="hidden md:block"/>
                            <span className="text-[#38BDF8]">Kegiatan</span>
                        </h1>
                        <p className="text-gray-200 text-base mb-8 leading-relaxed max-w-md">
                            Mendokumentasikan setiap langkah pemberdayaan dan kesejahteraan keluarga di Kabupaten Tasikmalaya.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── FILTER & SEARCH (FLOATING) ── */}
            <section className="relative z-20 -mt-10" data-aos="fade-up" data-aos-delay="100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-[28px] p-4 md:p-5 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center gap-4 border border-gray-100">
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar flex-1">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`whitespace-nowrap px-6 py-3 text-xs font-bold rounded-full transition-all duration-300 ${
                                        activeCategory === cat
                                            ? "bg-gradient-to-r from-[#1DA599] to-[#128277] text-white shadow-lg shadow-teal-500/30"
                                            : "bg-slate-50 text-gray-500 hover:bg-slate-100"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className="w-px h-8 bg-gray-200 hidden md:block"></div>
                        <div className="relative min-w-[250px]">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari kegiatan..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 text-sm border-none focus:ring-0 focus:outline-none rounded-xl bg-slate-50 text-[#0F172A] placeholder:text-gray-400 font-medium"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── KONTEN GALERI ── */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Grid Galeri */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        {filteredGaleri.map((item, i) => (
                            <div
                                key={item.id}
                                data-aos="fade-up"
                                data-aos-delay={(i % 3) * 100}
                                className="group bg-white rounded-[28px] overflow-hidden border border-gray-100 shadow-lg shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col"
                            >
                                <div className="relative h-56 overflow-hidden bg-gray-100">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-[#0F172A]/0 group-hover:bg-[#0F172A]/30 transition-colors duration-500 flex items-center justify-center">
                                        <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 shadow-lg">
                                            <Eye size={20} className="text-[#0F172A]" />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`text-[9px] font-extrabold tracking-widest uppercase ${item.badgeText} ${item.badgeBg} px-3 py-1.5 rounded-full border`}>
                                            {item.category}
                                        </span>
                                        <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-medium">
                                            <Calendar size={13} />
                                            {item.date}
                                        </div>
                                    </div>
                                    <h3 className="text-[#0F172A] font-black text-base mb-2 group-hover:text-[#1DA599] transition-colors line-clamp-2 leading-snug">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-500 text-[13px] leading-relaxed line-clamp-3 font-medium">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {filteredGaleri.length > 0 && (
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

                    {filteredGaleri.length === 0 && (
                        <div className="text-center py-16 text-gray-500 text-base font-medium">
                            Tidak ada kegiatan yang ditemukan.
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}

