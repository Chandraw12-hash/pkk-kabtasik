import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import {
    Search,
    Calendar,
    User,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

// ============= INTERFACE =============
interface BeritaItem {
    id: number;
    judul: string;
    slug?: string;
    tanggal?: string;
    deskripsi?: string;
    konten?: string;
    link?: string;
    image?: string;
    foto?: string;
    foto_url?: string;
    created_at?: string;
    deskripsi_singkat?: string;
    tanggal_formatted?: string;
    kategori?: string;
    author?: string;
}

interface BeritaProps {
    berita?: BeritaItem[];
}

const filterKategori = ["Semua", "Kegiatan", "Prestasi", "Pengumuman"];

export default function Berita({ berita = [] }: BeritaProps) {
    const [activeFilter, setActiveFilter] = useState("Semua");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredBerita = berita.filter((item) => {
        const itemKategori = item.kategori || "Kegiatan";
        const matchesCategory =
            activeFilter === "Semua" || itemKategori === activeFilter;

        const matchesSearch =
            item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.deskripsi || item.deskripsi_singkat || "").toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        try {
            return new Date(dateString).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
        } catch {
            return dateString;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-slate-800 pt-14">
            <Head title="Berita Terkini - PKK Kabupaten Tasikmalaya" />
            <Navbar />

            {/* ==================== HERO ==================== */}
            <section className="relative h-[420px] lg:h-[480px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/assets/images/hero.jpg"
                        alt="Pusat Informasi PKK"
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
                        Pusat Informasi
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
                        Berita Terkini
                    </h1>
                    <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
                        Informasi terbaru mengenai kegiatan, program, dan
                        prestasi Tim Penggerak PKK Kabupaten Tasikmalaya.
                    </p>
                </div>
            </section>

            {/* ==================== FILTER & SEARCH ==================== */}
            <section className="py-8 bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="flex flex-wrap gap-2 flex-1 justify-center md:justify-start">
                            {filterKategori.map((kat) => (
                                <button
                                    key={kat}
                                    onClick={() => setActiveFilter(kat)}
                                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                                        activeFilter === kat
                                            ? "bg-teal-600 text-white"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                                >
                                    {kat}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-64">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="text"
                                placeholder="Cari berita..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 bg-white text-slate-800 placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== GRID BERITA ==================== */}
            <section className="py-16 lg:py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {filteredBerita.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {filteredBerita.map((item) => {
                                    const imageSrc =
                                        item.foto_url ||
                                        (item.foto ? `/storage/${item.foto}` : null) ||
                                        item.image ||
                                        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80";

                                    return (
                                        <article
                                            key={item.id}
                                            className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-colors flex flex-col"
                                        >
                                            <div className="h-48 overflow-hidden">
                                                <img
                                                    src={imageSrc}
                                                    alt={item.judul}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="p-5 flex flex-col flex-grow">
                                                <div className="flex items-center gap-3 mb-3 text-xs text-slate-400">
                                                    <span className="text-[10px] font-semibold tracking-wide uppercase text-teal-600 bg-teal-50 px-2.5 py-1 rounded">
                                                        {item.kategori || "Kegiatan"}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={12} />
                                                        {formatDate(item.created_at || item.tanggal)}
                                                    </span>
                                                </div>

                                                {/* ===== SOLUSI TERBAIK: PAKAI JAVASCRIPT BIASA ===== */}
                                                <h3 className="text-base font-semibold text-slate-900 mb-2 leading-snug line-clamp-2">
                                                    <a
                                                        href={`/berita/${item.slug || item.id}`}
                                                        className="hover:text-teal-600 transition-colors"
                                                    >
                                                        {item.judul}
                                                    </a>
                                                </h3>

                                                <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
                                                    {item.deskripsi ||
                                                     item.deskripsi_singkat ||
                                                     item.konten?.replace(/<[^>]*>?/gm, '').substring(0, 150) ||
                                                     "Tidak ada deskripsi"}
                                                </p>
                                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                                                        <User size={12} />
                                                        {item.author || "Admin"}
                                                    </span>

                                                    {/* ===== SOLUSI TERBAIK: PAKAI JAVASCRIPT BIASA ===== */}
                                                    <a
                                                        href={`/berita/${item.slug || item.id}`}
                                                        className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                                                    >
                                                        Selengkapnya
                                                        <ArrowRight size={14} />
                                                    </a>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
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
                            Tidak ada berita yang ditemukan.
                        </div>
                    )}
                </div>
            </section>

            {/* ==================== NEWSLETTER ==================== */}
            <section className="py-20 lg:py-24 bg-white border-t border-slate-100">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-3">
                        Newsletter
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                        Tetap Terhubung dengan PKK
                    </h2>
                    <p className="text-slate-500 text-base leading-relaxed max-w-lg mx-auto mb-8">
                        Dapatkan update kegiatan dan program pemberdayaan
                        keluarga di Kabupaten Tasikmalaya melalui email Anda.
                    </p>
                    <form className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Alamat email Anda"
                            className="w-full px-5 py-2.5 text-sm border border-slate-200 rounded-full focus:outline-none focus:border-teal-500 text-slate-800 placeholder:text-slate-400"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full sm:w-auto whitespace-nowrap bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm px-6 py-2.5 rounded-full transition-colors"
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
