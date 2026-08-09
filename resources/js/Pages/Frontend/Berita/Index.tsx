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
        const matchesCategory =
            activeFilter === "Semua" || item.kategori === activeFilter;
        const matchesSearch =
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.desc.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

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
                                {filteredBerita.map((item) => (
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
                                            <div className="flex items-center gap-3 mb-3 text-xs text-slate-400">
                                                <span className="text-[10px] font-semibold tracking-wide uppercase text-teal-600 bg-teal-50 px-2.5 py-1 rounded">
                                                    {item.kategori}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {item.date}
                                                </span>
                                            </div>
                                            <h3 className="text-base font-semibold text-slate-900 mb-2 leading-snug line-clamp-2">
                                                <Link href="#">
                                                    {item.title}
                                                </Link>
                                            </h3>
                                            <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
                                                {item.desc}
                                            </p>
                                            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                                                    <User size={12} />
                                                    {item.author}
                                                </span>
                                                <Link
                                                    href="#"
                                                    className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                                                >
                                                    Selengkapnya
                                                    <ArrowRight size={14} />
                                                </Link>
                                            </div>
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
