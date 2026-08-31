import React, { useState, useEffect, useMemo } from "react";
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
    Newspaper,
    Mail,
    CheckCircle2,
    MapPin,
} from "lucide-react";
import axios from "axios";

// ============================================================
// INTERFACE
// ============================================================
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
    kecamatan?: string;
    author?: string;
}

interface BeritaProps {
    berita?: BeritaItem[];
    pagination?: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters?: {
        search?: string;
        kategori?: string;
        kecamatan?: string;
        per_page?: number;
    };
    kecamatanList?: string[];
}

const DEFAULT_KATEGORI = "Kegiatan";
const ITEMS_PER_PAGE = 9;
const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80";

// ============================================================
// UTILITY
// ============================================================
const getBeritaImageSrc = (item: BeritaItem): string => {
    return (
        item.foto_url ||
        (item.foto ? `/storage/${item.foto}` : null) ||
        item.image ||
        FALLBACK_IMAGE
    );
};

const getBeritaHref = (item: BeritaItem): string => {
    return `/berita/${item.slug || item.id}`;
};

const formatDate = (dateString?: string): string => {
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

const getDeskripsi = (item: BeritaItem): string => {
    return (
        item.deskripsi ||
        item.deskripsi_singkat ||
        item.konten?.replace(/<[^>]*>?/gm, "").substring(0, 150) ||
        "Tidak ada deskripsi."
    );
};

export default function Berita({
    berita = [],
    pagination: initialPagination,
    filters: initialFilters = {},
    kecamatanList: initialKecamatanList = [],
}: BeritaProps) {
    // State untuk filter
    const [activeFilter, setActiveFilter] = useState(initialFilters.kategori || "Semua");
    const [selectedKecamatan, setSelectedKecamatan] = useState(initialFilters.kecamatan || "");
    const [searchQuery, setSearchQuery] = useState(initialFilters.search || "");
    const [currentPage, setCurrentPage] = useState(initialPagination?.current_page || 1);

    // State untuk data (bisa diisi dari API atau props)
    const [beritaData, setBeritaData] = useState<BeritaItem[]>(berita);
    const [kecamatanList, setKecamatanList] = useState<string[]>(initialKecamatanList);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState(initialPagination || null);

    const [newsletterEmail, setNewsletterEmail] = useState("");
    const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    // Kategori diambil otomatis dari data yang ada
    const filterKategori = useMemo(() => {
        const kategoriSet = new Set<string>();
        beritaData.forEach((item) => kategoriSet.add(item.kategori || DEFAULT_KATEGORI));
        return ["Semua", ...Array.from(kategoriSet).sort()];
    }, [beritaData]);

    // Fetch data dari API dengan filter
    const fetchBerita = () => {
        setIsLoading(true);
        axios
            .get("/api/berita", {
                params: {
                    search: searchQuery || undefined,
                    kategori: activeFilter !== "Semua" ? activeFilter : undefined,
                    kecamatan: selectedKecamatan || undefined,
                    page: currentPage,
                    limit: ITEMS_PER_PAGE,
                },
                headers: { Accept: "application/json" },
            })
            .then((res) => {
                if (res.data?.data) {
                    setBeritaData(res.data.data.data || []);
                    setPagination({
                        current_page: res.data.data.current_page,
                        last_page: res.data.data.last_page,
                        per_page: res.data.data.per_page,
                        total: res.data.data.total,
                    });
                    if (res.data.filters?.kecamatan) {
                        setKecamatanList(res.data.filters.kecamatan);
                    }
                }
            })
            .catch((err) => console.error("Error fetching berita:", err))
            .finally(() => setIsLoading(false));
    };

    // Fetch saat filter atau page berubah
    useEffect(() => {
        fetchBerita();
    }, [searchQuery, activeFilter, selectedKecamatan, currentPage]);

    // Reset ke halaman 1 setiap kali filter berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [activeFilter, searchQuery, selectedKecamatan]);

    const filteredBerita = beritaData;

    const totalPages = pagination?.last_page || Math.max(1, Math.ceil(filteredBerita.length / ITEMS_PER_PAGE));

    const paginatedBerita = useMemo(() => {
        if (pagination) {
            return filteredBerita;
        }
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredBerita.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredBerita, currentPage, pagination]);

    const goToPage = (page: number) => {
        const clamped = Math.min(Math.max(page, 1), totalPages);
        setCurrentPage(clamped);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const paginationNumbers = useMemo(() => {
        const pages: (number | "ellipsis")[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible + 2) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }

        pages.push(1);
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        if (start > 2) pages.push("ellipsis");
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < totalPages - 1) pages.push("ellipsis");

        pages.push(totalPages);
        return pages;
    }, [currentPage, totalPages]);

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newsletterEmail.trim()) return;

        setNewsletterStatus("loading");

        // TODO: sambungkan ke endpoint backend
        setTimeout(() => {
            setNewsletterStatus("success");
            setNewsletterEmail("");
        }, 800);
    };

    const handleReset = () => {
        setActiveFilter("Semua");
        setSelectedKecamatan("");
        setSearchQuery("");
        setCurrentPage(1);
    };

    const hasAnyBerita = beritaData.length > 0;
    const hasFilteredResult = filteredBerita.length > 0;

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-slate-800 pt-14">
            <Head title="Berita Terkini - PKK Kabupaten Tasikmalaya">
                <meta
                    name="description"
                    content="Kumpulan berita dan informasi kegiatan Tim Penggerak PKK Kabupaten Tasikmalaya."
                />
            </Head>
            <Navbar />

            {/* ==================== FILTER & SEARCH ==================== */}
            <section className="py-6 bg-white border-b border-slate-100 sticky top-14 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="flex flex-wrap gap-2 flex-1 justify-center md:justify-start">
                            {filterKategori.map((kat) => (
                                <button
                                    key={kat}
                                    type="button"
                                    onClick={() => setActiveFilter(kat)}
                                    aria-pressed={activeFilter === kat}
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

                        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                            {/* Filter Kecamatan */}
                            {kecamatanList.length > 0 && (
                                <select
                                    value={selectedKecamatan}
                                    onChange={(e) => setSelectedKecamatan(e.target.value)}
                                    className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-teal-500"
                                >
                                    <option value="">Semua Kecamatan</option>
                                    {kecamatanList.map((k) => (
                                        <option key={k} value={k}>{k}</option>
                                    ))}
                                </select>
                            )}

                            <div className="relative w-full md:w-48">
                                <Search
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Cari berita..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white text-slate-800 placeholder:text-slate-400"
                                />
                            </div>

                            {(searchQuery || selectedKecamatan || activeFilter !== "Semua") && (
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="text-sm text-teal-600 hover:text-teal-700 font-medium whitespace-nowrap"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>

                    {hasAnyBerita && (
                        <p className="text-xs text-slate-400 mt-3 text-center md:text-left">
                            Menampilkan {filteredBerita.length} berita
                            {activeFilter !== "Semua" && ` di kategori "${activeFilter}"`}
                            {selectedKecamatan && ` di kecamatan "${selectedKecamatan}"`}
                            {searchQuery && ` untuk pencarian "${searchQuery}"`}
                        </p>
                    )}
                </div>
            </section>

            {/* ==================== GRID BERITA ==================== */}
            <section className="py-16 lg:py-20 bg-white flex-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {isLoading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600" />
                            <p className="text-slate-500 mt-3">Memuat berita...</p>
                        </div>
                    ) : hasFilteredResult ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {paginatedBerita.map((item) => {
                                    const imageSrc = getBeritaImageSrc(item);
                                    const href = getBeritaHref(item);

                                    return (
                                        <article
                                            key={item.id}
                                            className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all flex flex-col"
                                        >
                                            <Link href={href} className="block h-48 overflow-hidden bg-slate-100 group">
                                                <img
                                                    src={imageSrc}
                                                    alt={item.judul}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    onError={(e) => {
                                                        e.currentTarget.src = FALLBACK_IMAGE;
                                                    }}
                                                />
                                            </Link>
                                            <div className="p-5 flex flex-col flex-grow">
                                                <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-slate-400">
                                                    <span className="text-[10px] font-semibold tracking-wide uppercase text-teal-600 bg-teal-50 px-2.5 py-1 rounded">
                                                        {item.kategori || DEFAULT_KATEGORI}
                                                    </span>
                                                    {item.kecamatan && (
                                                        <span className="text-[10px] font-semibold tracking-wide uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded flex items-center gap-1">
                                                            <MapPin size={10} />
                                                            {item.kecamatan}
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={12} />
                                                        {formatDate(item.created_at || item.tanggal)}
                                                    </span>
                                                </div>

                                                <h3 className="text-base font-semibold text-slate-900 mb-2 leading-snug line-clamp-2">
                                                    <Link
                                                        href={href}
                                                        className="hover:text-teal-600 transition-colors"
                                                    >
                                                        {item.judul}
                                                    </Link>
                                                </h3>

                                                <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
                                                    {getDeskripsi(item)}
                                                </p>
                                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                                                        <User size={12} />
                                                        {item.author || "Admin"}
                                                    </span>

                                                    <Link
                                                        href={href}
                                                        className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                                                    >
                                                        Selengkapnya
                                                        <ArrowRight size={14} />
                                                    </Link>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>

                            {/* ==================== PAGINATION ==================== */}
                            {totalPages > 1 && (
                                <nav
                                    className="flex items-center justify-center gap-2"
                                    aria-label="Navigasi halaman berita"
                                >
                                    <button
                                        type="button"
                                        onClick={() => goToPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="w-9 h-9 rounded-lg flex items-center justify-center border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>

                                    {paginationNumbers.map((page, idx) =>
                                        page === "ellipsis" ? (
                                            <span
                                                key={`ellipsis-${idx}`}
                                                className="text-slate-400 px-1 select-none"
                                            >
                                                ...
                                            </span>
                                        ) : (
                                            <button
                                                key={page}
                                                type="button"
                                                onClick={() => goToPage(page)}
                                                aria-current={currentPage === page ? "page" : undefined}
                                                className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold transition-colors ${
                                                    currentPage === page
                                                        ? "bg-teal-600 text-white"
                                                        : "border border-slate-200 text-slate-600 hover:bg-slate-100"
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        )
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => goToPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="w-9 h-9 rounded-lg flex items-center justify-center border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </nav>
                            )}
                        </>
                    ) : hasAnyBerita ? (
                        <div className="text-center py-20">
                            <Search size={40} className="text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-600 font-medium text-lg mb-1">
                                Tidak ada berita yang cocok.
                            </p>
                            <p className="text-slate-400 text-sm mb-6">
                                Coba ubah kata kunci pencarian atau pilih kategori lain.
                            </p>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700 border border-teal-200 hover:bg-teal-50 px-4 py-2 rounded-lg transition-colors"
                            >
                                Reset Filter
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <Newspaper size={40} className="text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-600 font-medium text-lg mb-1">
                                Belum ada berita yang dipublikasikan.
                            </p>
                            <p className="text-slate-400 text-sm">
                                Silakan cek kembali beberapa saat lagi.
                            </p>
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

                    {newsletterStatus === "success" ? (
                        <div className="flex items-center justify-center gap-2 text-teal-700 bg-teal-50 border border-teal-200 rounded-full px-5 py-3 max-w-md mx-auto">
                            <CheckCircle2 size={18} />
                            <span className="text-sm font-medium">
                                Terima kasih! Email kamu sudah terdaftar.
                            </span>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleNewsletterSubmit}
                            className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
                        >
                            <label htmlFor="newsletter-email" className="sr-only">
                                Alamat email
                            </label>
                            <div className="relative w-full">
                                <Mail
                                    size={16}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    id="newsletter-email"
                                    type="email"
                                    placeholder="Alamat email Anda"
                                    value={newsletterEmail}
                                    onChange={(e) => setNewsletterEmail(e.target.value)}
                                    className="w-full pl-10 pr-5 py-2.5 text-sm border border-slate-200 rounded-full focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-800 placeholder:text-slate-400"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={newsletterStatus === "loading"}
                                className="w-full sm:w-auto whitespace-nowrap bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm px-6 py-2.5 rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {newsletterStatus === "loading" ? "Memproses..." : "Berlangganan"}
                            </button>
                        </form>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
