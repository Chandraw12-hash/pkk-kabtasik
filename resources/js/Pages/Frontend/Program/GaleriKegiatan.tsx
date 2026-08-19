import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import { Calendar, Search, Images, X, ChevronLeft, ChevronRight } from "lucide-react";

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

const getImageSrc = (item: GaleriItem): string => {
    if (item.foto_url) return item.foto_url;
    if (item.foto) return `/storage/${item.foto}`;
    return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80";
};

export default function GaleriKegiatan({
    galeri,
    filters = {},
}: GaleriKegiatanProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || "");
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const dataItems = galeri?.data || [];
    const hasData = dataItems.length > 0;
    const isLightboxOpen = lightboxIndex !== null;
    const activeItem =
        isLightboxOpen && dataItems[lightboxIndex]
            ? dataItems[lightboxIndex]
            : null;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery) {
            window.location.href = `/program/galeri-kegiatan?search=${encodeURIComponent(
                searchQuery
            )}`;
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

    const openLightbox = (index: number) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);

    const showPrev = () => {
        if (lightboxIndex === null || dataItems.length === 0) return;
        setLightboxIndex(
            (lightboxIndex - 1 + dataItems.length) % dataItems.length
        );
    };

    const showNext = () => {
        if (lightboxIndex === null || dataItems.length === 0) return;
        setLightboxIndex((lightboxIndex + 1) % dataItems.length);
    };

    // ESC + panah + kunci scroll body
    useEffect(() => {
        if (!isLightboxOpen) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowLeft") showPrev();
            if (e.key === "ArrowRight") showNext();
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onKey);
        };
    }, [isLightboxOpen, lightboxIndex, dataItems.length]);

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
                    <form
                        onSubmit={handleSearch}
                        className="flex flex-col md:flex-row items-center gap-3 md:justify-end"
                    >
                        <div className="relative w-full md:w-72">
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
                        <button
                            type="submit"
                            className="w-full md:w-auto bg-teal-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-teal-700 transition-colors"
                        >
                            Cari
                        </button>
                    </form>
                </div>
            </section>

            {/* ==================== GRID GALERI ==================== */}
            <section className="py-16 lg:py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {hasData ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {dataItems.map((item, index) => {
                                    const imageSrc = getImageSrc(item);

                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => openLightbox(index)}
                                            className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
                                        >
                                            <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                                                <img
                                                    src={imageSrc}
                                                    alt={item.judul}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                                    <h3 className="text-sm md:text-base font-semibold text-white line-clamp-2">
                                                        {item.judul}
                                                    </h3>
                                                    <p className="text-xs text-white/85 flex items-center gap-1.5 mt-1">
                                                        <Calendar size={13} />
                                                        {formatDate(
                                                            item.tanggal ||
                                                                item.created_at
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
                                {galeri?.links?.map((link, index) => {
                                    if (
                                        link.label === "pagination.previous" ||
                                        link.label === "pagination.next" ||
                                        link.label === "&laquo; Previous" ||
                                        link.label === "Next &raquo;"
                                    ) {
                                        return null;
                                    }

                                    return (
                                        <button
                                            key={index}
                                            type="button"
                                            disabled={!link.url}
                                            onClick={() => {
                                                if (link.url)
                                                    window.location.href =
                                                        link.url;
                                            }}
                                            className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                                                link.active
                                                    ? "bg-teal-600 text-white border-teal-600"
                                                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-teal-400 disabled:opacity-40"
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-16 text-slate-500">
                            <Images
                                size={48}
                                className="text-slate-300 mx-auto mb-4"
                            />
                            <p className="text-lg">
                                Tidak ada foto kegiatan yang ditemukan.
                            </p>
                            <p className="text-sm mt-1">
                                Silakan tambahkan galeri melalui dashboard admin.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* ==================== LIGHTBOX / POPUP ==================== */}
            {isLightboxOpen && activeItem && (
                <div
                    className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-8"
                    role="dialog"
                    aria-modal="true"
                    aria-label={activeItem.judul}
                >
                    {/* Backdrop */}
                    <button
                        type="button"
                        className="absolute inset-0 bg-slate-900/85 backdrop-blur-[2px]"
                        aria-label="Tutup"
                        onClick={closeLightbox}
                    />

                    {/* Konten */}
                    <div className="relative z-10 w-full max-w-4xl">
                        <button
                            type="button"
                            onClick={closeLightbox}
                            className="absolute -top-12 right-0 sm:top-0 sm:-right-12 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                            aria-label="Tutup"
                        >
                            <X size={20} />
                        </button>

                        {dataItems.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={showPrev}
                                    className="absolute left-0 sm:-left-14 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-20"
                                    aria-label="Sebelumnya"
                                >
                                    <ChevronLeft size={22} />
                                </button>
                                <button
                                    type="button"
                                    onClick={showNext}
                                    className="absolute right-0 sm:-right-14 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-20"
                                    aria-label="Berikutnya"
                                >
                                    <ChevronRight size={22} />
                                </button>
                            </>
                        )}

                        <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
                            <div className="relative bg-slate-100 max-h-[70vh] flex items-center justify-center">
                                <img
                                    src={getImageSrc(activeItem)}
                                    alt={activeItem.judul}
                                    className="w-full h-auto max-h-[70vh] object-contain"
                                />
                            </div>
                            <div className="px-5 py-4 border-t border-slate-100">
                                <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                                    {activeItem.judul}
                                </h3>
                                <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                                    <Calendar size={14} />
                                    {formatDate(
                                        activeItem.tanggal ||
                                            activeItem.created_at
                                    )}
                                    {isLightboxOpen && (
                                        <span className="text-slate-400 ml-2">
                                            · {lightboxIndex! + 1} /{" "}
                                            {dataItems.length}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
