import React, { useState, useMemo } from "react";
import { Head, Link, router } from "@inertiajs/react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import {
    Calendar,
    ChevronRight,
    ArrowLeft,
    Newspaper,
    User,
    Share2,
    Search,
    FolderOpen,
} from "lucide-react";

interface BeritaItem {
    id: number;
    judul: string;
    slug?: string;
    konten?: string;
    deskripsi?: string;
    foto?: string | null;
    foto_url?: string | null;
    created_at?: string;
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

    if (!berita) {
        return (
            <div className="min-h-screen flex flex-col bg-white pt-14">
                <Navbar />
                <div className="flex-grow flex items-center justify-center px-4">
                    <div className="text-center">
                        <p className="text-slate-800 font-semibold mb-2">
                            Berita tidak ditemukan
                        </p>
                        <Link
                            href="/berita"
                            className="text-sm text-teal-700 font-medium"
                        >
                            ← Kembali ke daftar berita
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const imageSrc = getImageSrc(berita);

    return (
        <div className="min-h-screen flex flex-col bg-[#f7f8fa] text-slate-800 pt-14 overflow-x-hidden">
            <Head title={`${berita.judul} — PKK Kabupaten Tasikmalaya`} />
            <Navbar />

            <main className="flex-grow py-8 lg:py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                        {/* ========== ARTIKEL ========== */}
                        <article className="lg:col-span-8 min-w-0">
                            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                                {/* Foto utama — di atas, seperti PKK Jatim */}
                                {imageSrc ? (
                                    <div className="relative w-full aspect-[16/10] bg-slate-100">
                                        <img
                                            src={imageSrc}
                                            alt={berita.judul}
                                            className="absolute inset-0 w-full h-full object-cover"
                                            onError={(e) => {
                                                (
                                                    e.currentTarget
                                                        .parentElement as HTMLElement
                                                ).style.display = "none";
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full aspect-[16/10] bg-slate-100 flex items-center justify-center">
                                        <Newspaper
                                            size={48}
                                            className="text-slate-300"
                                        />
                                    </div>
                                )}

                                <div className="p-5 sm:p-7 lg:p-8">
                                    <h1 className="text-xl sm:text-2xl lg:text-[1.85rem] font-bold text-slate-900 leading-snug mb-4 break-words">
                                        {berita.judul}
                                    </h1>

                                    {/* Meta */}
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-slate-500 mb-6 pb-5 border-b border-slate-100">
                                        <span className="inline-flex items-center gap-1.5">
                                            <User
                                                size={14}
                                                className="text-slate-400"
                                            />
                                            Admin PKK
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <FolderOpen
                                                size={14}
                                                className="text-slate-400"
                                            />
                                            Berita
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <Calendar
                                                size={14}
                                                className="text-slate-400"
                                            />
                                            {formatTanggal(
                                                berita.created_at,
                                                true
                                            )}
                                        </span>
                                    </div>

                                    {/* Konten */}
                                    {berita.konten ? (
                                        <div
                                            className="prose prose-slate max-w-none
                                                prose-p:text-slate-600 prose-p:text-[15px] prose-p:leading-[1.75]
                                                prose-headings:text-slate-900 prose-headings:font-semibold
                                                prose-a:text-teal-700 prose-img:rounded-xl prose-img:max-w-full
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
                                        <p
                                            className="text-slate-600 text-[15px] leading-relaxed break-words"
                                            style={{
                                                overflowWrap: "anywhere",
                                                wordBreak: "break-word",
                                            }}
                                        >
                                            {berita.deskripsi ||
                                                "Konten berita belum tersedia."}
                                        </p>
                                    )}

                                    {/* Aksi bawah */}
                                    <div className="mt-8 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                                        <Link
                                            href="/berita"
                                            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-teal-700 transition-colors"
                                        >
                                            <ArrowLeft size={15} />
                                            Semua berita
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (navigator.share) {
                                                    navigator.share({
                                                        title: berita.judul,
                                                        url: window.location
                                                            .href,
                                                    });
                                                } else {
                                                    navigator.clipboard.writeText(
                                                        window.location.href
                                                    );
                                                }
                                            }}
                                            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-teal-700 transition-colors"
                                        >
                                            <Share2 size={14} />
                                            Bagikan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </article>

                        {/* ========== SIDEBAR ========== */}
                        <aside className="lg:col-span-4 min-w-0">
                            <div className="lg:sticky lg:top-20 space-y-5">
                                {/* Search */}
                                <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                                    <h2 className="text-base font-semibold text-slate-900 mb-3">
                                        Search
                                    </h2>
                                    <form
                                        onSubmit={handleSearchSubmit}
                                        className="flex"
                                    >
                                        <input
                                            type="search"
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                            placeholder="kata kunci ..."
                                            className="flex-1 min-w-0 px-3.5 py-2.5 text-sm border border-slate-200 border-r-0 rounded-l-lg
                                                focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500
                                                placeholder:text-slate-400"
                                        />
                                        <button
                                            type="submit"
                                            className="shrink-0 px-3.5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-r-lg transition-colors"
                                            aria-label="Cari"
                                        >
                                            <Search size={18} />
                                        </button>
                                    </form>
                                </div>

                                {/* Berita Terbaru */}
                                <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
                                    <div className="px-5 py-4 border-b border-slate-100">
                                        <h2 className="text-base font-semibold text-slate-900">
                                            Berita Terbaru
                                        </h2>
                                    </div>

                                    <ul className="divide-y divide-slate-100">
                                        {filteredLainnya.length === 0 ? (
                                            <li className="px-5 py-5 text-sm text-slate-400">
                                                {search.trim()
                                                    ? "Tidak ada hasil."
                                                    : "Belum ada berita lain."}
                                            </li>
                                        ) : (
                                            filteredLainnya.map((item) => {
                                                const thumb = getImageSrc(item);
                                                return (
                                                    <li key={item.id}>
                                                        <Link
                                                            href={getHref(item)}
                                                            className="flex gap-3.5 px-5 py-3.5 hover:bg-slate-50/80 transition-colors group"
                                                        >
                                                            <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0">
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
                                                                                16
                                                                            }
                                                                            className="text-slate-300"
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="min-w-0 flex-1 pt-0.5">
                                                                <p className="text-sm font-medium text-slate-800 group-hover:text-teal-700 line-clamp-2 leading-snug break-words">
                                                                    {
                                                                        item.judul
                                                                    }
                                                                </p>
                                                                <p className="text-[11px] text-slate-400 mt-1">
                                                                    {formatTanggal(
                                                                        item.created_at,
                                                                        true
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                );
                                            })
                                        )}
                                    </ul>

                                    <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
                                        <Link
                                            href="/berita"
                                            className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800"
                                        >
                                            Lihat semua
                                            <ChevronRight size={13} />
                                        </Link>
                                    </div>
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
