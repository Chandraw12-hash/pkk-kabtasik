import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import { Calendar, Search, ChevronLeft, ChevronRight } from "lucide-react";

const galeriData = [
    {
        id: 1,
        title: "Sosialisasi Pola Asuh Anak & Remaja",
        date: "12 Mei 2024",
        category: "POKJA I",
        desc: "Kegiatan pembekalan bagi kader PKK di tingkat kecamatan mengenai pola asuh.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 2,
        title: "Pemanfaatan Tanah Pekarangan",
        date: "10 Mei 2024",
        category: "POKJA III",
        desc: "Implementasi program Hatinya PKK melalui penanaman sayuran produktif.",
        image: "https://images.unsplash.com/photo-1592424005742-8820c744f9ea?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 3,
        title: "Pemeriksaan Kesehatan Gratis",
        date: "08 Mei 2024",
        category: "POKJA IV",
        desc: "Layanan kesehatan gratis bagi lansia dan balita di wilayah Posyandu binaan.",
        image: "https://images.unsplash.com/photo-1576091160550-2173ff9e5c52?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 4,
        title: "Rapat Koordinasi Bulanan",
        date: "05 Mei 2024",
        category: "UMUM",
        desc: "Evaluasi rutin program kerja semester pertama tahun 2024 bersama seluruh kader.",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 5,
        title: "Pelatihan Kewirausahaan Ibu",
        date: "01 Mei 2024",
        category: "POKJA II",
        desc: "Mendorong kemandirian ekonomi keluarga melalui pelatihan UMKM lokal.",
        image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: 6,
        title: "Pameran UP2K Tingkat Kab.",
        date: "25 Apr 2024",
        category: "POKJA II",
        desc: "Ajang promosi produk unggulan kelompok Usaha Peningkatan Pendapatan Keluarga.",
        image: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=600&q=80",
    },
];

const categories = ["Semua", "Pokja I", "Pokja II", "Pokja III", "Pokja IV", "Umum"];

export default function GaleriKegiatan() {
    const [activeCategory, setActiveCategory] = useState("Semua");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredGaleri = galeriData.filter((item) => {
        const matchesCategory =
            activeCategory === "Semua" ||
            item.category === activeCategory.toUpperCase();
        const matchesSearch =
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.desc.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-slate-800 pt-14">
            <Head title="Galeri Kegiatan - PKK Kabupaten Tasikmalaya" />
            <Navbar />

            {/* ==================== HERO ==================== */}
            <section className="relative h-[420px] lg:h-[480px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/assets/images/hero.jpg"
                        alt="Galeri Kegiatan PKK"
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                            e.currentTarget.src =
                                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80";
                        }}
                    />
                    <div className="absolute inset-0 bg-black/55" />
                </div>

                <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <span className="inline-block text-teal-300 text-xs font-semibold tracking-[0.2em] uppercase mb-5">
                        Dokumentasi Visual
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
                        Galeri Kegiatan
                    </h1>
                    <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
                        Mendokumentasikan setiap langkah pemberdayaan dan
                        kesejahteraan keluarga di Kabupaten Tasikmalaya.
                    </p>
                </div>
            </section>

            {/* ==================== FILTER & SEARCH ==================== */}
            <section className="py-8 bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        {/* Kategori */}
                        <div className="flex flex-wrap gap-2 flex-1 justify-center md:justify-start">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                                        activeCategory === cat
                                            ? "bg-teal-600 text-white"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative w-full md:w-64">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="text"
                                placeholder="Cari kegiatan..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 bg-white text-slate-800 placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== GRID GALERI ==================== */}
            <section className="py-16 lg:py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {filteredGaleri.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {filteredGaleri.map((item) => (
                                    <article
                                        key={item.id}
                                        className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-colors flex flex-col"
                                    >
                                        <div className="h-48 overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="p-5 flex flex-col flex-grow">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-[10px] font-semibold tracking-wide uppercase text-teal-600 bg-teal-50 px-2.5 py-1 rounded">
                                                    {item.category}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-slate-400 text-xs">
                                                    <Calendar size={12} />
                                                    {item.date}
                                                </span>
                                            </div>
                                            <h3 className="text-base font-semibold text-slate-900 mb-2 leading-snug line-clamp-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-center gap-2">
                                <button className="w-9 h-9 rounded-lg flex items-center justify-center border border-slate-200 text-slate-400 hover:bg-slate-100 transition-colors">
                                    <ChevronLeft size={16} />
                                </button>
                                <button className="w-9 h-9 rounded-lg flex items-center justify-center bg-teal-600 text-white text-sm font-semibold">
                                    1
                                </button>
                                <button className="w-9 h-9 rounded-lg flex items-center justify-center border border-slate-200 text-slate-600 text-sm hover:bg-slate-100 transition-colors">
                                    2
                                </button>
                                <button className="w-9 h-9 rounded-lg flex items-center justify-center border border-slate-200 text-slate-600 text-sm hover:bg-slate-100 transition-colors">
                                    3
                                </button>
                                <span className="text-slate-400 px-1">...</span>
                                <button className="w-9 h-9 rounded-lg flex items-center justify-center border border-slate-200 text-slate-600 text-sm hover:bg-slate-100 transition-colors">
                                    12
                                </button>
                                <button className="w-9 h-9 rounded-lg flex items-center justify-center border border-slate-200 text-slate-400 hover:bg-slate-100 transition-colors">
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-16 text-slate-500">
                            Tidak ada kegiatan yang ditemukan.
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
