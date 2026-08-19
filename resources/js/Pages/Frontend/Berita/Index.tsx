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
} from "lucide-react";

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
    author?: string;
}

interface BeritaProps {
    berita?: BeritaItem[];
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

export default function Berita({ berita = [] }: BeritaProps) {
    const [activeFilter, setActiveFilter] = useState("Semua");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [newsletterEmail, setNewsletterEmail] = useState("");
    const [newsletterStatus, setNewsletterStatus] = useState<
        "idle" | "loading" | "success" | "error"
    >("idle");

    // Kategori diambil otomatis dari data yang ada, bukan hardcode,
    // jadi kalau ada kategori baru dari admin, filter ikut update sendiri.
    const filterKategori = useMemo(() => {
        const kategoriSet = new Set<string>();
        berita.forEach((item) => kategoriSet.add(item.kategori || DEFAULT_KATEGORI));
        return ["Semua", ...Array.from(kategoriSet).sort()];
    }, [berita]);

    const filteredBerita = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return berita.filter((item) => {
            const itemKategori = item.kategori || DEFAULT_KATEGORI;
            const matchesCategory =
                activeFilter === "Semua" || itemKategori === activeFilter;

            if (!query) return matchesCategory;

            const matchesSearch =
                item.judul.toLowerCase().includes(query) ||
                getDeskripsi(item).toLowerCase().includes(query);

            return matchesCategory && matchesSearch;
        });
    }, [berita, activeFilter, searchQuery]);

    // Reset ke halaman 1 setiap kali filter atau pencarian berubah,
    // biar gak nyangkut di halaman 3 padahal hasil filter cuma 1 halaman.
    useEffect(() => {
        setCurrentPage(1);
    }, [activeFilter, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredBerita.length / ITEMS_PER_PAGE));

    const paginatedBerita = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredBerita.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredBerita, currentPage]);

    const goToPage = (page: number) => {
        const clamped = Math.min(Math.max(page, 1), totalPages);
        setCurrentPage(clamped);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Nomor halaman yang ditampilkan di pagination, dengan "..." kalau halamannya banyak
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

        // TODO: sambungkan ke endpoint backend beneran, misal:
        // router.post('/newsletter/subscribe', { email: newsletterEmail })
        // Sementara ini simulasi biar UI-nya sudah siap dipakai.
        setTimeout(() => {
            setNewsletterStatus("success");
            setNewsletterEmail("");
        }, 800);
    };

    const hasAnyBerita = berita.length > 0;
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

            {/* ==================== HERO ==================== */}
            <section className="relative h-[420px] lg:h-[480px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/assets/images/hero.jpg"
                        alt="Pusat Informasi PKK Kabupaten Tasikmalaya"
                        className="w-full h-full object-cover object-center"
                        loading="eager"
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
            <section className="py-8 bg-white border-b border-slate-100 sticky top-14 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div
                            className="flex flex-wrap gap-2 flex-1 justify-center md:justify-start"
                            role="group"
                            aria-label="Filter kategori berita"
                        >
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
                        <div className="relative w-full md:w-64">
                            <label htmlFor="berita-search" className="sr-only">
                                Cari berita
                            </label>
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                aria-hidden="true"
                            />
                            <input
                                id="berita-search"
                                type="text"
                                placeholder="Cari berita..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white text-slate-800 placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    {/* Info jumlah hasil, biar user tahu lagi lihat berapa dari berapa */}
                    {hasAnyBerita && (
                        <p className="text-xs text-slate-400 mt-3 text-center md:text-left">
                            Menampilkan {filteredBerita.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}
                            {"–"}
                            {Math.min(currentPage * ITEMS_PER_PAGE, filteredBerita.length)} dari{" "}
                            {filteredBerita.length} berita
                            {activeFilter !== "Semua" && ` di kategori "${activeFilter}"`}
                            {searchQuery && ` untuk pencarian "${searchQuery}"`}
                        </p>
                    )}
                </div>
            </section>

            {/* ==================== GRID BERITA ==================== */}
            <section className="py-16 lg:py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {hasFilteredResult ? (
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
                                                <div className="flex items-center gap-3 mb-3 text-xs text-slate-400">
                                                    <span className="text-[10px] font-semibold tracking-wide uppercase text-teal-600 bg-teal-50 px-2.5 py-1 rounded">
                                                        {item.kategori || DEFAULT_KATEGORI}
                                                    </span>
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

                            {/* ==================== PAGINATION (fungsional) ==================== */}
                            {totalPages > 1 && (
                                <nav
                                    className="flex items-center justify-center gap-2"
                                    aria-label="Navigasi halaman berita"
                                >
                                    <button
                                        type="button"
                                        onClick={() => goToPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        aria-label="Halaman sebelumnya"
                                        className="w-9 h-9 rounded-lg flex items-center justify-center border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
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
                                        aria-label="Halaman berikutnya"
                                        className="w-9 h-9 rounded-lg flex items-center justify-center border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </nav>
                            )}
                        </>
                    ) : hasAnyBerita ? (
                        // Ada data berita, tapi hasil filter/pencarian kosong
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
                                onClick={() => {
                                    setActiveFilter("Semua");
                                    setSearchQuery("");
                                }}
                                className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700 border border-teal-200 hover:bg-teal-50 px-4 py-2 rounded-lg transition-colors"
                            >
                                Reset Filter
                            </button>
                        </div>
                    ) : (
                        // Belum ada berita sama sekali di database
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
                                    aria-hidden="true"
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
