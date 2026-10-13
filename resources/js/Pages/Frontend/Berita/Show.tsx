import React, { useState, useMemo, useRef } from "react";
import { Head, Link, router } from "@inertiajs/react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import {
    Calendar,
    ChevronRight,
    ChevronLeft,
    ArrowLeft,
    Newspaper,
    User,
    Share2,
    Search,
    MapPin,
    Clock,
} from "lucide-react";

interface BeritaFoto {
    id: number;
    foto_url?: string | null;
    foto?: string | null;
}

interface BeritaItem {
    id: number;
    judul: string;
    slug?: string;
    konten?: string;
    deskripsi?: string;
    kategori?: string;
    kecamatan?: string | null;
    foto?: string | null;
    foto_url?: string | null;
    fotos?: BeritaFoto[];
    created_at?: string;
    created_at_formatted?: string;
    user?: { name: string };
}

interface Props {
    berita: BeritaItem;
    beritaLainnya?: BeritaItem[];
}

const getImageSrc = (item: BeritaItem): string | null => {
    if (item.foto_url) return item.foto_url;
    if (item.foto) return `/storage/${item.foto}`;
    return null;
};

const formatTanggal = (date?: string, withTime = false): string => {
    if (!date) return "-";
    try {
        const opts: Intl.DateTimeFormatOptions = {
            day: "numeric",
            month: "long",
            year: "numeric",
        };
        if (withTime) {
            opts.hour = "2-digit";
            opts.minute = "2-digit";
        }
        return new Date(date).toLocaleDateString("id-ID", opts);
    } catch {
        return "-";
    }
};

const getHref = (item: BeritaItem) =>
    item.slug ? `/berita/${item.slug}` : `/berita/${item.id}`;

export default function Show({ berita, beritaLainnya = [] }: Props) {
    const [search, setSearch] = useState("");

    const filteredLainnya = useMemo(() => {
        if (!search.trim()) return beritaLainnya;
        const q = search.toLowerCase();
        return beritaLainnya.filter((item) =>
            item.judul?.toLowerCase().includes(q)
        );
    }, [beritaLainnya, search]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim()) {
            router.get(
                "/berita",
                { search: search.trim() },
                { preserveState: false }
            );
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: berita.judul,
                    url: window.location.href,
                })
                .catch(() => {});
        } else {
            navigator.clipboard?.writeText(window.location.href);
        }
    };

    const imageSrc = berita ? getImageSrc(berita) : null;

    // Galeri geser: cover + foto tambahan (maks 5), tanpa duplikat.
    // (Di atas early-return agar urutan hooks stabil.)
    const galeri = useMemo(() => {
        const list: string[] = [];
        if (imageSrc) list.push(imageSrc);
        for (const f of berita?.fotos || []) {
            const u =
                f.foto_url || (f.foto ? `/storage/${f.foto}` : null);
            if (u && !list.includes(u)) list.push(u);
        }
        return list;
    }, [berita]);

    const [fotoIdx, setFotoIdx] = useState(0);
    const sentuhX = useRef<number | null>(null);
    const idxAktif = galeri.length > 0 ? fotoIdx % galeri.length : 0;
    const geser = (arah: number) =>
        setFotoIdx(
            (i) => (i + arah + galeri.length) % Math.max(galeri.length, 1)
        );

    if (!berita) {
        return (
            <div className="min-h-screen flex flex-col bg-white pt-14">
                <Navbar />
                <div className="flex-grow flex items-center justify-center px-4">
                    <div className="text-center">
                        <Newspaper
                            size={40}
                            className="text-slate-300 mx-auto mb-3"
                        />
                        <p className="text-slate-800 font-semibold mb-2">
                            Berita tidak ditemukan
                        </p>
                        <Link
                            href="/berita"
                            className="text-sm text-[#0072BC] font-medium hover:text-[#0072BC]"
                        >
                            ← Kembali ke daftar berita
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 overflow-x-hidden">
            <Head title={`${berita.judul} — PKK Kabupaten Tasikmalaya`} />
            <Navbar />

            {/* ===== HERO (FIXED: navbar transparan friendly) ===== */}
            <header className="relative w-full min-h-[340px] sm:min-h-[380px] lg:min-h-[440px] flex items-end overflow-hidden">
                {/* Hero ikut foto aktif galeri (crossfade, sama kayak geser bawah) */}
                {galeri.length > 0 ? (
                    galeri.map((src, i) => (
                        <img
                            key={i}
                            src={src}
                            alt=""
                            aria-hidden={i !== idxAktif}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                                i === idxAktif
                                    ? "opacity-100"
                                    : "opacity-0"
                            }`}
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />
                    ))
                ) : imageSrc ? (
                    <img
                        src={imageSrc}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                        }}
                    />
                ) : (
                    <div className="absolute inset-0 bg-slate-700" />
                )}
                {/* ✅ Overlay lebih gelap di atas — biar teks navbar kelihatan */}
                <div
                    className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-slate-900/60"
                    aria-hidden="true"
                />

                {/* ✅ pt-24 / pt-28 — biar konten turun, ga ketutup navbar */}
                <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-8 sm:pb-10">
                    <nav
                        className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-white/80 mb-4"
                        aria-label="Breadcrumb"
                    >
                        <Link
                            href="/"
                            className="hover:text-white transition-colors"
                        >
                            Beranda
                        </Link>
                        <span className="text-white/40">|</span>
                        <Link
                            href="/berita"
                            className="hover:text-white transition-colors"
                        >
                            Berita
                        </Link>
                        <span className="text-white/40">|</span>
                        <span className="text-white font-medium">Detail</span>
                    </nav>

                    {berita.kategori && (
                        <span className="inline-block text-[11px] font-semibold tracking-wide uppercase text-[#0072BC]/50 mb-2">
                            {berita.kategori}
                        </span>
                    )}

                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white leading-snug max-w-3xl mb-4">
                        {berita.judul}
                    </h1>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-white/85">
                        <span className="inline-flex items-center gap-1.5">
                            <Calendar size={14} className="opacity-80" />
                            {formatTanggal(berita.created_at)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Clock size={14} className="opacity-80" />
                            {(() => {
                                const full = formatTanggal(
                                    berita.created_at,
                                    true
                                );
                                const parts = full.split(" ");
                                return parts[parts.length - 1] || full;
                            })()}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <User size={14} className="opacity-80" />
                            {berita.user?.name || "Admin PKK"}
                        </span>
                        {berita.kecamatan && (
                            <span className="inline-flex items-center gap-1.5">
                                <MapPin size={14} className="opacity-80" />
                                {berita.kecamatan}
                            </span>
                        )}
                    </div>
                </div>
            </header>

            {/* ===== BODY ===== */}
            <main className="flex-grow py-8 lg:py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                        {/* Artikel */}
                        <article className="lg:col-span-8 min-w-0">
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                {/* Galeri geser — cover + maks 4 tambahan */}
                                {galeri.length > 0 && (
                                    <div>
                                        <div
                                            className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-slate-100 overflow-hidden select-none"
                                            onTouchStart={(e) => {
                                                sentuhX.current =
                                                    e.touches[0].clientX;
                                            }}
                                            onTouchEnd={(e) => {
                                                if (sentuhX.current === null)
                                                    return;
                                                const delta =
                                                    e.changedTouches[0]
                                                        .clientX -
                                                    sentuhX.current;
                                                sentuhX.current = null;
                                                if (delta > 40) geser(-1);
                                                else if (delta < -40)
                                                    geser(1);
                                            }}
                                        >
                                            {galeri.map((src, i) => (
                                                <img
                                                    key={i}
                                                    src={src}
                                                    alt={
                                                        i === 0
                                                            ? berita.judul
                                                            : `${berita.judul} — foto ${i + 1}`
                                                    }
                                                    draggable={false}
                                                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                                                        i === idxAktif
                                                            ? "opacity-100"
                                                            : "opacity-0 pointer-events-none"
                                                    }`}
                                                    onError={(e) => {
                                                        e.currentTarget.style.display =
                                                            "none";
                                                    }}
                                                />
                                            ))}

                                            {galeri.length > 1 && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => geser(-1)}
                                                        aria-label="Foto sebelumnya"
                                                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/50 text-white hover:bg-slate-900/70 transition-colors"
                                                    >
                                                        <ChevronLeft size={18} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => geser(1)}
                                                        aria-label="Foto berikutnya"
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/50 text-white hover:bg-slate-900/70 transition-colors"
                                                    >
                                                        <ChevronRight size={18} />
                                                    </button>
                                                    <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-slate-900/60 text-white text-[11px] font-bold">
                                                        {idxAktif + 1}/{galeri.length}
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        {galeri.length > 1 && (
                                            <div className="flex gap-2 p-3 overflow-x-auto">
                                                {galeri.map((src, i) => (
                                                    <button
                                                        key={i}
                                                        type="button"
                                                        onClick={() =>
                                                            setFotoIdx(i)
                                                        }
                                                        aria-label={`Lihat foto ${i + 1}`}
                                                        className={`shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 transition-all ${
                                                            i === idxAktif
                                                                ? "border-[#0072BC]"
                                                                : "border-transparent opacity-60 hover:opacity-100"
                                                        }`}
                                                    >
                                                        <img
                                                            src={src}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                            loading="lazy"
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="p-5 sm:p-7 lg:p-8">
                                    {berita.konten ? (
                                        <div
                                            className="prose prose-slate max-w-none
                                                prose-p:text-slate-600 prose-p:text-[15px] prose-p:leading-[1.75]
                                                prose-headings:text-slate-900 prose-headings:font-semibold
                                                prose-a:text-[#0072BC] prose-img:rounded-lg prose-img:max-w-full
                                                prose-strong:text-slate-900 prose-ul:text-slate-600
                                                prose-ol:text-slate-600 prose-li:marker:text-[#0072BC]
                                                [&_*]:max-w-full [&_*]:break-words"
                                            style={{
                                                overflowWrap: "anywhere",
                                                wordBreak: "break-word",
                                            }}
                                            dangerouslySetInnerHTML={{
                                                __html: berita.konten,
                                            }}
                                        />
                                    ) : (
                                        <p className="text-slate-600 text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                                            {berita.deskripsi ||
                                                "Konten berita belum tersedia."}
                                        </p>
                                    )}

                                    <div className="mt-8 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                                        <Link
                                            href="/berita"
                                            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-[#0072BC]"
                                        >
                                            <ArrowLeft size={15} />
                                            Semua berita
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={handleShare}
                                            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#0072BC]"
                                        >
                                            <Share2 size={14} />
                                            Bagikan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </article>

                        {/* Sidebar */}
                        <aside className="lg:col-span-4 min-w-0">
                            <div className="lg:sticky lg:top-20 space-y-4">
                                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                    <form
                                        onSubmit={handleSearchSubmit}
                                        className="flex gap-2"
                                    >
                                        <div className="relative flex-1 min-w-0">
                                            <Search
                                                size={14}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                            />
                                            <input
                                                type="search"
                                                value={search}
                                                onChange={(e) =>
                                                    setSearch(e.target.value)
                                                }
                                                placeholder="Cari berita..."
                                                className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#0072BC] focus:ring-1 focus:ring-[#0072BC]/20"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="shrink-0 px-4 py-2.5 bg-[#0072BC] hover:bg-[#0072BC] text-white text-sm font-medium rounded-lg transition-colors"
                                        >
                                            Cari
                                        </button>
                                    </form>
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                    <div className="px-4 py-3 border-b border-slate-100">
                                        <h2 className="text-sm font-semibold text-slate-900">
                                            Berita Lainnya
                                        </h2>
                                    </div>
                                    <ul className="divide-y divide-slate-100">
                                        {filteredLainnya.length === 0 ? (
                                            <li className="px-4 py-4 text-sm text-slate-400">
                                                {search.trim()
                                                    ? "Tidak ada hasil."
                                                    : "Belum ada berita lain."}
                                            </li>
                                        ) : (
                                            filteredLainnya
                                                .slice(0, 5)
                                                .map((item) => {
                                                    const thumb =
                                                        getImageSrc(item);
                                                    return (
                                                        <li key={item.id}>
                                                            <Link
                                                                href={getHref(
                                                                    item
                                                                )}
                                                                className="flex gap-3 px-4 py-3 hover:bg-slate-50 transition-colors group"
                                                            >
                                                                <div className="w-16 h-12 rounded-md overflow-hidden bg-slate-100 shrink-0">
                                                                    {thumb ? (
                                                                        <img
                                                                            src={
                                                                                thumb
                                                                            }
                                                                            alt=""
                                                                            className="w-full h-full object-cover"
                                                                            loading="lazy"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center">
                                                                            <Newspaper
                                                                                size={
                                                                                    14
                                                                                }
                                                                                className="text-slate-300"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <p className="text-xs sm:text-sm font-medium text-slate-800 group-hover:text-[#0072BC] line-clamp-2 leading-snug">
                                                                        {
                                                                            item.judul
                                                                        }
                                                                    </p>
                                                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                                                        {formatTanggal(
                                                                            item.created_at
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </Link>
                                                        </li>
                                                    );
                                                })
                                        )}
                                    </ul>
                                    <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/60">
                                        <Link
                                            href="/berita"
                                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#0072BC] hover:text-[#0072BC]"
                                        >
                                            Lihat semua
                                            <ChevronRight size={12} />
                                        </Link>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                    <p className="text-[10px] font-semibold tracking-wider uppercase text-[#0072BC] mb-1">
                                        TP PKK
                                    </p>
                                    <p className="text-sm text-slate-600 leading-relaxed mb-3">
                                        Kabupaten Tasikmalaya — media informasi
                                        pemberdayaan keluarga.
                                    </p>
                                    <Link
                                        href="/"
                                        className="inline-flex items-center gap-1 text-sm font-medium text-[#0072BC] hover:text-[#0072BC]"
                                    >
                                        Ke beranda
                                        <ChevronRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
