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
    TrendingUp,
    X,
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

interface KecamatanTeraktifItem {
    kecamatan: string;
    total: number;
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
            month: "short",
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
        item.konten?.replace(/<[^>]*>?/gm, "").substring(0, 120) ||
        "Tidak ada deskripsi."
    );
};

// ============================================================
// SIDEBAR: KECAMATAN TERAKTIF - DENGAN DROPDOWN RANGE
// ============================================================
function KecamatanTeraktifWidget({
    data,
    isLoading,
    onRangeChange,
    range,
}: {
    data: KecamatanTeraktifItem[];
    isLoading: boolean;
    onRangeChange: (range: string) => void;
    range: string;
}) {
    const maxTotal = useMemo(
        () => Math.max(1, ...data.map((d) => d.total)),
        [data]
    );

    const rangeOptions = [
        { value: "week", label: "7 Hari" },
        { value: "month", label: "Bulan Ini" },
        { value: "3months", label: "3 Bulan" },
        { value: "year", label: "Tahun Ini" },
        { value: "all", label: "Semua" },
    ];

    const getRangeLabel = (val: string) => {
        const found = rangeOptions.find((r) => r.value === val);
        return found ? found.label : "Bulan Ini";
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 lg:sticky lg:top-28">
            <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                    <TrendingUp size={14} className="text-teal-600 shrink-0" />
                    Kecamatan Teraktif
                </h3>
                <select
                    value={range}
                    onChange={(e) => onRangeChange(e.target.value)}
                    className="text-[10px] border border-slate-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-teal-500"
                >
                    {rangeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
            <p className="text-xs text-slate-500 mb-3">
                Berdasarkan {data.length} kecamatan · {getRangeLabel(range)}
            </p>

            {isLoading ? (
                <div className="space-y-2.5">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                            <div className="w-5 h-5 rounded-full bg-slate-100 animate-pulse shrink-0" />
                            <div className="flex-1 space-y-1">
                                <div className="h-2 w-2/3 bg-slate-100 rounded animate-pulse" />
                                <div className="h-1.5 w-full bg-slate-100 rounded-full animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : data.length > 0 ? (
                <div className="space-y-2.5">
                    {data.slice(0, 5).map((item, i) => {
                        const isTop = i === 0;
                        const pct = Math.round((item.total / maxTotal) * 100);
                        const medals = ["🥇", "🥈", "🥉", "4.", "5."];
                        return (
                            <div key={item.kecamatan} className="flex items-center gap-2.5">
                                <span className="text-sm font-semibold text-slate-400 w-5 text-right shrink-0">
                                    {medals[i] || `${i + 1}.`}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between text-xs mb-0.5 gap-2">
                                        <span
                                            className={`truncate ${
                                                isTop
                                                    ? "font-semibold text-slate-900"
                                                    : "text-slate-700"
                                            }`}
                                        >
                                            {item.kecamatan}
                                        </span>
                                        <span className="text-slate-400 shrink-0 text-[11px]">
                                            {item.total}
                                        </span>
                                    </div>
                                    <div className="h-1 rounded-full bg-slate-100 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${
                                                isTop ? "bg-teal-600" : "bg-teal-400"
                                            }`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-4">
                    <p className="text-xs text-slate-400">Belum ada data</p>
                    <button
                        onClick={() => onRangeChange("all")}
                        className="text-xs text-teal-600 hover:text-teal-700 mt-1"
                    >
                        Lihat semua data
                    </button>
                </div>
            )}
        </div>
    );
}

// ============================================================
// MAIN
// ============================================================
export default function Berita({
    berita = [],
    pagination: initialPagination,
    filters: initialFilters = {},
    kecamatanList: initialKecamatanList = [],
}: BeritaProps) {
    const [activeFilter, setActiveFilter] = useState(
        initialFilters.kategori || "Semua"
    );
    const [selectedKecamatan, setSelectedKecamatan] = useState(
        initialFilters.kecamatan || ""
    );
    const [searchQuery, setSearchQuery] = useState(initialFilters.search || "");
    const [currentPage, setCurrentPage] = useState(
        initialPagination?.current_page || 1
    );

    const [beritaData, setBeritaData] = useState<BeritaItem[]>(berita);
    const [kecamatanList, setKecamatanList] = useState<string[]>(
        initialKecamatanList
    );
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState(initialPagination || null);

    const [newsletterEmail, setNewsletterEmail] = useState("");
    const [newsletterStatus, setNewsletterStatus] = useState<
        "idle" | "loading" | "success" | "error"
    >("idle");

    // ⭐ STATE UNTUK KECAMATAN TERAKTIF
    const [kecamatanTeraktif, setKecamatanTeraktif] = useState<
        KecamatanTeraktifItem[]
    >([]);
    const [isLoadingTeraktif, setIsLoadingTeraktif] = useState(true);
    const [rangeTeraktif, setRangeTeraktif] = useState("month");

    const filterKategori = useMemo(() => {
        const kategoriSet = new Set<string>();
        beritaData.forEach((item) =>
            kategoriSet.add(item.kategori || DEFAULT_KATEGORI)
        );
        return ["Semua", ...Array.from(kategoriSet).sort()];
    }, [beritaData]);

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

    // ⭐ FETCH KECAMATAN TERAKTIF dengan range
    const fetchKecamatanTeraktif = (range: string = "month") => {
        setIsLoadingTeraktif(true);
        axios
            .get("/api/berita/kecamatan-teraktif", {
                params: { range: range },
                headers: { Accept: "application/json" },
            })
            .then((res) => {
                setKecamatanTeraktif(res.data?.data || []);
            })
            .catch((err) =>
                console.error("Error fetching kecamatan teraktif:", err)
            )
            .finally(() => setIsLoadingTeraktif(false));
    };

    // ⭐ Handler perubahan range
    const handleRangeChange = (newRange: string) => {
        setRangeTeraktif(newRange);
        fetchKecamatanTeraktif(newRange);
    };

    useEffect(() => {
        fetchBerita();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, activeFilter, selectedKecamatan, currentPage]);

    // ⭐ Fetch kecamatan teraktif saat mount
    useEffect(() => {
        fetchKecamatanTeraktif("month");
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeFilter, searchQuery, selectedKecamatan]);

    const filteredBerita = beritaData;
    const totalPages =
        pagination?.last_page ||
        Math.max(1, Math.ceil(filteredBerita.length / ITEMS_PER_PAGE));

    const paginatedBerita = useMemo(() => {
        if (pagination) return filteredBerita;
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
    const hasActiveFilter =
        !!searchQuery || !!selectedKecamatan || activeFilter !== "Semua";

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 pt-14">
            <Head title="Berita Terkini - PKK Kabupaten Tasikmalaya">
                <meta
                    name="description"
                    content="Kumpulan berita dan informasi kegiatan Tim Penggerak PKK Kabupaten Tasikmalaya."
                />
            </Head>
            <Navbar />

            {/* Header halaman */}
            <div className="bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    <p className="text-teal-700 text-xs font-semibold tracking-wider uppercase mb-1">
                        Informasi
                    </p>
                    <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
                        Berita Terkini
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 max-w-xl">
                        Kegiatan dan informasi TP PKK Kabupaten Tasikmalaya
                    </p>
                </div>
            </div>

            {/* Filter bar */}
            <section className="bg-white border-b border-slate-100 sticky top-14 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0 sm:flex-wrap -mx-1 px-1">
                        {filterKategori.map((kat) => (
                            <button
                                key={kat}
                                type="button"
                                onClick={() => setActiveFilter(kat)}
                                aria-pressed={activeFilter === kat}
                                className={`shrink-0 px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-colors ${
                                    activeFilter === kat
                                        ? "bg-teal-600 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                            >
                                {kat}
                            </button>
                        ))}
                    </div>

                    <div className="mt-2.5 flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="flex flex-1 gap-2 min-w-0">
                            {kecamatanList.length > 0 && (
                                <select
                                    value={selectedKecamatan}
                                    onChange={(e) =>
                                        setSelectedKecamatan(e.target.value)
                                    }
                                    className="text-xs sm:text-sm border border-slate-200 rounded-lg px-2.5 py-2 bg-white focus:outline-none focus:border-teal-500 max-w-[45%] sm:max-w-none"
                                >
                                    <option value="">Semua Kecamatan</option>
                                    {kecamatanList.map((k) => (
                                        <option key={k} value={k}>
                                            {k}
                                        </option>
                                    ))}
                                </select>
                            )}
                            <div className="relative flex-1 min-w-0">
                                <Search
                                    size={14}
                                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    type="search"
                                    placeholder="Cari berita..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 bg-white text-slate-800 placeholder:text-slate-400"
                                />
                            </div>
                        </div>
                        {hasActiveFilter && (
                            <button
                                type="button"
                                onClick={handleReset}
                                className="inline-flex items-center gap-1 text-xs sm:text-sm text-teal-700 hover:text-teal-800 font-medium shrink-0 self-start sm:self-auto"
                            >
                                <X size={14} />
                                Reset
                            </button>
                        )}
                    </div>

                    {hasAnyBerita && (
                        <p className="text-[11px] text-slate-400 mt-2">
                            {pagination?.total ?? filteredBerita.length} berita
                            {activeFilter !== "Semua" &&
                                ` · ${activeFilter}`}
                            {selectedKecamatan && ` · ${selectedKecamatan}`}
                            {searchQuery && ` · “${searchQuery}”`}
                        </p>
                    )}
                </div>
            </section>

            {/* Konten */}
            <section className="py-8 sm:py-10 lg:py-12 flex-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                        {/* Grid berita */}
                        <div className="flex-1 min-w-0 order-2 lg:order-1">
                            {isLoading ? (
                                <div className="text-center py-16">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-teal-600 border-t-transparent" />
                                    <p className="text-slate-500 text-sm mt-3">
                                        Memuat berita...
                                    </p>
                                </div>
                            ) : hasFilteredResult ? (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-8">
                                        {paginatedBerita.map((item) => {
                                            const imageSrc =
                                                getBeritaImageSrc(item);
                                            const href = getBeritaHref(item);
                                            return (
                                                <article
                                                    key={item.id}
                                                    className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col"
                                                >
                                                    <Link
                                                        href={href}
                                                        className="block aspect-[16/10] overflow-hidden bg-slate-100 group"
                                                    >
                                                        <img
                                                            src={imageSrc}
                                                            alt={item.judul}
                                                            loading="lazy"
                                                            className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-[1.03]"
                                                            onError={(e) => {
                                                                e.currentTarget.src =
                                                                    FALLBACK_IMAGE;
                                                            }}
                                                        />
                                                    </Link>
                                                    <div className="p-4 flex flex-col flex-grow">
                                                        <div className="flex flex-wrap items-center gap-1.5 mb-2 text-[11px] text-slate-400">
                                                            <span className="font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                                                                {item.kategori ||
                                                                    DEFAULT_KATEGORI}
                                                            </span>
                                                            {item.kecamatan && (
                                                                <span className="inline-flex items-center gap-0.5 text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                                                                    <MapPin
                                                                        size={10}
                                                                    />
                                                                    {
                                                                        item.kecamatan
                                                                    }
                                                                </span>
                                                            )}
                                                            <span className="inline-flex items-center gap-0.5">
                                                                <Calendar
                                                                    size={11}
                                                                />
                                                                {formatDate(
                                                                    item.created_at ||
                                                                        item.tanggal
                                                                )}
                                                            </span>
                                                        </div>

                                                        <h2 className="text-sm sm:text-[15px] font-semibold text-slate-900 mb-1.5 leading-snug line-clamp-2">
                                                            <Link
                                                                href={href}
                                                                className="hover:text-teal-700 transition-colors"
                                                            >
                                                                {item.judul}
                                                            </Link>
                                                        </h2>

                                                        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-3 line-clamp-2 flex-grow">
                                                            {getDeskripsi(item)}
                                                        </p>

                                                        <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 mt-auto">
                                                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                                                                <User size={11} />
                                                                {item.author ||
                                                                    "Admin"}
                                                            </span>
                                                            <Link
                                                                href={href}
                                                                className="inline-flex items-center gap-0.5 text-xs font-medium text-teal-700 hover:text-teal-800"
                                                            >
                                                                Baca
                                                                <ArrowRight
                                                                    size={12}
                                                                />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </article>
                                            );
                                        })}
                                    </div>

                                    {totalPages > 1 && (
                                        <nav
                                            className="flex items-center justify-center gap-1.5"
                                            aria-label="Navigasi halaman berita"
                                        >
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    goToPage(currentPage - 1)
                                                }
                                                disabled={currentPage === 1}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                                <ChevronLeft size={15} />
                                            </button>
                                            {paginationNumbers.map(
                                                (page, idx) =>
                                                    page === "ellipsis" ? (
                                                        <span
                                                            key={`e-${idx}`}
                                                            className="text-slate-400 px-0.5 text-sm"
                                                        >
                                                            …
                                                        </span>
                                                    ) : (
                                                        <button
                                                            key={page}
                                                            type="button"
                                                            onClick={() =>
                                                                goToPage(page)
                                                            }
                                                            aria-current={
                                                                currentPage ===
                                                                page
                                                                    ? "page"
                                                                    : undefined
                                                            }
                                                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold ${
                                                                currentPage ===
                                                                page
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
                                                onClick={() =>
                                                    goToPage(currentPage + 1)
                                                }
                                                disabled={
                                                    currentPage === totalPages
                                                }
                                                className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                                <ChevronRight size={15} />
                                            </button>
                                        </nav>
                                    )}
                                </>
                            ) : hasAnyBerita ? (
                                <div className="text-center py-14">
                                    <Search
                                        size={32}
                                        className="text-slate-300 mx-auto mb-3"
                                    />
                                    <p className="text-slate-700 font-medium mb-1">
                                        Tidak ada berita yang cocok
                                    </p>
                                    <p className="text-slate-400 text-sm mb-4">
                                        Ubah kata kunci atau filter.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="text-sm font-medium text-teal-700 border border-teal-200 hover:bg-teal-50 px-4 py-2 rounded-lg"
                                    >
                                        Reset filter
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-14">
                                    <Newspaper
                                        size={32}
                                        className="text-slate-300 mx-auto mb-3"
                                    />
                                    <p className="text-slate-700 font-medium mb-1">
                                        Belum ada berita
                                    </p>
                                    <p className="text-slate-400 text-sm">
                                        Silakan cek lagi nanti.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* ⭐ Sidebar - Kecamatan Teraktif dengan dropdown range */}
                        <aside className="w-full lg:w-72 xl:w-80 shrink-0 order-1 lg:order-2">
                            <KecamatanTeraktifWidget
                                data={kecamatanTeraktif}
                                isLoading={isLoadingTeraktif}
                                onRangeChange={handleRangeChange}
                                range={rangeTeraktif}
                            />
                        </aside>
                    </div>
                </div>
            </section>

            {/* Newsletter ringkas */}
            <section className="py-10 sm:py-12 bg-white border-t border-slate-100">
                <div className="max-w-lg mx-auto px-4 text-center">
                    <h2 className="text-lg font-semibold text-slate-900 mb-1">
                        Newsletter PKK
                    </h2>
                    <p className="text-sm text-slate-500 mb-5">
                        Update kegiatan TP PKK ke email Anda.
                    </p>
                    {newsletterStatus === "success" ? (
                        <div className="inline-flex items-center gap-2 text-teal-700 bg-teal-50 border border-teal-100 rounded-lg px-4 py-2.5 text-sm">
                            <CheckCircle2 size={16} />
                            Email berhasil didaftarkan.
                        </div>
                    ) : (
                        <form
                            onSubmit={handleNewsletterSubmit}
                            className="flex flex-col sm:flex-row gap-2"
                        >
                            <div className="relative flex-1">
                                <Mail
                                    size={14}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    type="email"
                                    placeholder="email@contoh.com"
                                    value={newsletterEmail}
                                    onChange={(e) =>
                                        setNewsletterEmail(e.target.value)
                                    }
                                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={newsletterStatus === "loading"}
                                className="sm:w-auto px-5 py-2.5 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg disabled:opacity-60"
                            >
                                {newsletterStatus === "loading"
                                    ? "..."
                                    : "Daftar"}
                            </button>
                        </form>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
