import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import { Calendar, Search, Images } from "lucide-react";

// ============= INTERFACE =============
interface GaleriItem {
    id: number;
    judul: string;
    foto: string | null;
    foto_url?: string | null;
    created_at?: string;
    tanggal?: string;
}

interface GaleriKegiatanProps {
    galeri?: {
        data: GaleriItem[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
        links: any[];
    };
    filters?: {
        search?: string;
    };
}

export default function GaleriKegiatan({ galeri, filters = {} }: GaleriKegiatanProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || "");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery) {
            window.location.href = `/program/galeri-kegiatan?search=${searchQuery}`;
        } else {
            window.location.href = `/program/galeri-kegiatan`;
        }
    };

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

    const dataItems = galeri?.data || [];
    const hasData = dataItems.length > 0;

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
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-4">
                        <div className="relative w-full md:w-64 ml-auto">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="text"
                                placeholder="Cari judul kegiatan..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 bg-white text-slate-800 placeholder:text-slate-400"
                            />
                        </div>
                        <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-teal-700 transition-colors">
                            Cari
                        </button>
                    </form>
                </div>
            </section>

            {/* ==================== GRID GALERI (UKURAN PAS 4:3) ==================== */}
            <section className="py-16 lg:py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {hasData ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {dataItems.map((item) => {
                                    const imageSrc = item.foto_url || (item.foto ? `/storage/${item.foto}` : null) || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80";

                                    return (
                                        <div
                                            key={item.id}
                                            className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300"
                                        >
                                            {/* Menggunakan aspect-[4/3] agar ukuran pas dan tidak terlalu besar */}
                                            <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                                                <img
                                                    src={imageSrc}
                                                    alt={item.judul}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />

                                                {/* Overlay transparan untuk Judul dan Tanggal di atas gambar */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                    <h3 className="text-sm md:text-base font-semibold text-white line-clamp-1">
                                                        {item.judul}
                                                    </h3>
                                                    <p className="text-xs text-white/80 flex items-center gap-1.5 mt-0.5">
                                                        <Calendar size={14} />
                                                        {formatDate(item.tanggal || item.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* ==================== PAGINATION (Tombol Geser) ==================== */}
                            <div className="flex items-center justify-center gap-2 mt-8">
                                {galeri?.links && galeri.links.map((link, index) => {
                                    if (link.label === 'pagination.previous' || link.label === 'pagination.next') return null;

                                    return (
                                        <button
                                            key={index}
                                            disabled={!link.url}
                                            onClick={() => {
                                                if (link.url) {
                                                    window.location.href = link.url;
                                                }
                                            }}
                                            className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                                                link.active
                                                    ? "bg-teal-600 text-white border-teal-600"
                                                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-teal-400"
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-16 text-slate-500">
                            <Images size={48} className="text-slate-300 mx-auto mb-4" />
                            <p className="text-lg">Tidak ada foto kegiatan yang ditemukan.</p>
                            <p className="text-sm mt-1">Silakan tambahkan galeri melalui dashboard admin.</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
