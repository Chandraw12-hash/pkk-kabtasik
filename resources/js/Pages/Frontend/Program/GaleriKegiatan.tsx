import React, { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import {
    Calendar,
    Search,
    Images,
    X,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

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

const FALLBACK =
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80";

const getImageSrc = (item: GaleriItem): string => {
    if (item.foto_url) return item.foto_url;
    if (item.foto) return `/storage/${item.foto}`;
    return FALLBACK;
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
        if (searchQuery.trim()) {
            window.location.href = `/program/galeri-kegiatan?search=${encodeURIComponent(
                searchQuery.trim()
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
                month: "short",
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLightboxOpen, lightboxIndex, dataItems.length]);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 pt-14">
            <Head title="Galeri Kegiatan - PKK Kabupaten Tasikmalaya" />
            <Navbar />

            {/* Header */}
            <div className="bg-white border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                        <div>
                            <p className="text-[#0072BC] text-[11px] font-semibold tracking-wider uppercase mb-1">
                                Program
                            </p>
                            <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
                                Galeri Kegiatan
                            </h1>
                            <p className="text-sm text-slate-500 mt-0.5">
                                Dokumentasi kegiatan TP PKK Kabupaten
                                Tasikmalaya
                            </p>
                        </div>
                        <form
                            onSubmit={handleSearch}
                            className="flex gap-2 w-full sm:w-auto"
                        >
                            <div className="relative flex-1 sm:w-56">
                                <Search
                                    size={14}
                                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    type="search"
                                    placeholder="Cari kegiatan..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#0072BC] bg-white"
                                />
                            </div>
                            <button
                                type="submit"
                                className="shrink-0 px-3.5 py-2 text-xs font-semibold text-white bg-[#0072BC] hover:bg-[#0072BC] rounded-lg transition-colors"
                            >
                                Cari
                            </button>
                        </form>
                    </div>
                    {hasData && galeri?.total != null && (
                        <p className="text-[11px] text-slate-400 mt-2">
                            {galeri.total} foto
                            {filters.search
                                ? ` · pencarian “${filters.search}”`
                                : ""}
                        </p>
                    )}
                </div>
            </div>

            {/* Grid */}
            <section className="py-8 sm:py-10 flex-1">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {hasData ? (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
                                {dataItems.map((item, index) => {
                                    const imageSrc = getImageSrc(item);
                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => openLightbox(index)}
                                            className="group relative aspect-square overflow-hidden rounded-lg bg-slate-100 border border-slate-200 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0072BC] focus-visible:ring-offset-2"
                                        >
                                            <img
                                                src={imageSrc}
                                                alt={item.judul}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.currentTarget.src =
                                                        FALLBACK;
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                                                <p className="text-[11px] sm:text-xs font-medium text-white line-clamp-2 leading-snug">
                                                    {item.judul}
                                                </p>
                                                <p className="text-[10px] text-white/80 flex items-center gap-1 mt-0.5">
                                                    <Calendar size={10} />
                                                    {formatDate(
                                                        item.tanggal ||
                                                            item.created_at
                                                    )}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Pagination */}
                            {galeri?.links && galeri.links.length > 3 && (
                                <nav
                                    className="flex items-center justify-center gap-1 mt-8 flex-wrap"
                                    aria-label="Navigasi halaman"
                                >
                                    {galeri.links.map((link, index) => {
                                        const label = String(link.label || "");
                                        if (
                                            label.includes("Previous") ||
                                            label.includes("Next") ||
                                            label.includes("pagination.")
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
                                                className={`min-w-[32px] h-8 px-1.5 flex items-center justify-center rounded-md border text-xs font-medium transition-colors ${
                                                    link.active
                                                        ? "bg-[#0072BC] text-white border-[#0072BC]"
                                                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 disabled:opacity-40"
                                                }`}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        );
                                    })}
                                </nav>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-16">
                            <Images
                                size={36}
                                className="text-slate-300 mx-auto mb-3"
                            />
                            <p className="text-sm font-medium text-slate-600">
                                Tidak ada foto kegiatan
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                                Galeri akan tampil setelah admin mengunggah foto.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Lightbox */}
            {isLightboxOpen && activeItem && (
                <div
                    className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6"
                    role="dialog"
                    aria-modal="true"
                    aria-label={activeItem.judul}
                >
                    <button
                        type="button"
                        className="absolute inset-0 bg-slate-900/90"
                        aria-label="Tutup"
                        onClick={closeLightbox}
                    />

                    <div className="relative z-10 w-full max-w-3xl">
                        <button
                            type="button"
                            onClick={closeLightbox}
                            className="absolute -top-10 right-0 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                            aria-label="Tutup"
                        >
                            <X size={18} />
                        </button>

                        {dataItems.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={showPrev}
                                    className="absolute left-1 sm:-left-12 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-20"
                                    aria-label="Sebelumnya"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    type="button"
                                    onClick={showNext}
                                    className="absolute right-1 sm:-right-12 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-20"
                                    aria-label="Berikutnya"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </>
                        )}

                        <div className="bg-white rounded-xl overflow-hidden shadow-xl">
                            <div className="bg-slate-100 max-h-[72vh] flex items-center justify-center">
                                <img
                                    src={getImageSrc(activeItem)}
                                    alt={activeItem.judul}
                                    className="w-full h-auto max-h-[72vh] object-contain"
                                />
                            </div>
                            <div className="px-4 py-3 border-t border-slate-100 flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">
                                        {activeItem.judul}
                                    </h3>
                                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                        <Calendar size={12} />
                                        {formatDate(
                                            activeItem.tanggal ||
                                                activeItem.created_at
                                        )}
                                    </p>
                                </div>
                                <span className="text-[11px] text-slate-400 shrink-0 tabular-nums pt-0.5">
                                    {lightboxIndex! + 1} / {dataItems.length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
