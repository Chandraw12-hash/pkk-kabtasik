import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import Badge from "@/Components/UI/Badge";
import Table from "@/Components/Data/Table";
import Pagination from "@/Components/Data/Pagination";
import Card from "@/Components/UI/Card";
import { Head, Link, usePage, router } from "@inertiajs/react";
import {
    CheckCircle,
    XCircle,
    Eye,
    Edit2,
    Clock,
    Calendar,
    MapPin,
    Tag,
    User,
    Search,
    Filter,
    X,
    RotateCcw,
    Loader2,
    Newspaper,
    AlertTriangle,
} from "lucide-react";

interface BeritaPendingItem {
    id: number;
    judul: string;
    slug?: string;
    konten?: string;
    deskripsi?: string;
    kategori?: string;
    kecamatan?: string;
    foto?: string;
    foto_url?: string;
    status: string;
    created_at?: string;
    created_by?: number;
    created_by_name?: string;
    user?: {
        id: number;
        name: string;
        username: string;
        kecamatan: string;
    };
}

interface PendingProps {
    beritaPending: {
        data: BeritaPendingItem[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from?: number;
        to?: number;
        links?: any[];
    };
    kecamatanList?: string[];
    filters?: {
        kecamatan?: string;
        search?: string;
    };
    totalPending?: number;
}

export default function BeritaPending() {
    const {
        beritaPending,
        kecamatanList = [],
        filters = {},
        totalPending = 0,
    } = usePage<{
        beritaPending: PendingProps["beritaPending"];
        kecamatanList?: string[];
        filters?: { kecamatan?: string; search?: string };
        totalPending?: number;
    }>().props;

    const items = beritaPending?.data || [];

    const [searchQuery, setSearchQuery] = useState(filters.search || "");
    const [selectedKecamatan, setSelectedKecamatan] = useState(
        filters.kecamatan || ""
    );
    const [loadingApprove, setLoadingApprove] = useState<number | null>(null);
    const [loadingReject, setLoadingReject] = useState<number | null>(null);

    // State untuk Modal Profesional
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [rejectReason, setRejectReason] = useState("");

    // Handle buka modal approve
    const openApproveModal = (id: number) => {
        setSelectedId(id);
        setShowApproveModal(true);
    };

    // Handle buka modal reject
    const openRejectModal = (id: number) => {
        setSelectedId(id);
        setRejectReason("");
        setShowRejectModal(true);
    };

    // Konfirmasi approve dari modal
    const confirmApprove = () => {
        if (!selectedId) return;
        const id = selectedId;
        const judulInput = document.getElementById(
            `judul-${id}`
        ) as HTMLInputElement;
        const deskripsiInput = document.getElementById(
            `deskripsi-${id}`
        ) as HTMLTextAreaElement;

        if (!judulInput || !deskripsiInput) return;

        setLoadingApprove(id);
        setShowApproveModal(false);

        // ✅ FIX: Ganti 'put' jadi 'post'
        router.post(
            route("be.berita.approve", id),
            {
                judul: judulInput.value,
                deskripsi: deskripsiInput.value,
            },
            {
                onSuccess: () => {
                    setLoadingApprove(null);
                },
                onError: () => {
                    setLoadingApprove(null);
                },
            }
        );
    };

    // Konfirmasi reject dari modal
    const confirmReject = () => {
        if (!selectedId) return;
        const id = selectedId;
        const reason = rejectReason || "Tidak memenuhi kriteria publikasi.";

        setLoadingReject(id);
        setShowRejectModal(false);

        // ✅ FIX: Ganti 'put' jadi 'post'
        router.post(
            route("be.berita.reject", id),
            { reason: reason },
            {
                onSuccess: () => {
                    setLoadingReject(null);
                },
                onError: () => {
                    setLoadingReject(null);
                },
            }
        );
    };

    const handleFilter = () => {
        router.get(
            route("be.berita.pending"),
            {
                search: searchQuery || undefined,
                kecamatan: selectedKecamatan || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleReset = () => {
        setSearchQuery("");
        setSelectedKecamatan("");

        router.get(
            route("be.berita.pending"),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handlePageChange = (url: string | null) => {
        if (!url) return;

        router.get(
            url,
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";

        try {
            return new Date(dateString).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return dateString;
        }
    };

    const hasActiveFilter = Boolean(searchQuery || selectedKecamatan);
    const pendingCount = totalPending || beritaPending?.total || 0;

    return (
        <MainLayout>
            <Head title="Berita Pending - Persetujuan Admin" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400 flex items-center justify-center border border-teal-100 dark:border-teal-500/20">
                                <Newspaper size={22} />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 tracking-tight">
                                    Berita Perlu Persetujuan
                                </h1>

                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                    Tinjau berita yang dikirim kader sebelum
                                    dipublikasikan.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400">
                            <Clock size={16} />
                            <span className="text-sm font-semibold">
                                {pendingCount} Menunggu
                            </span>
                        </div>

                        <Link
                            href={route("be.berita.index")}
                            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                            Lihat Semua
                        </Link>
                    </div>
                </div>

                {/* Filter Card */}
                <Card className="overflow-visible dark:bg-slate-800 dark:border-slate-700">
                    <div className="p-5 sm:p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                            <div className="flex-1 min-w-0">
                                <TextInput
                                    iconLeft={<Search size={18} />}
                                    placeholder="Cari judul berita..."
                                    className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                    containerClassName="relative w-full"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleFilter();
                                    }}
                                />
                            </div>

                            <div className="w-full lg:w-64">
                                <div className="relative">
                                    <MapPin
                                        size={17}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                    />
                                    <select
                                        value={selectedKecamatan}
                                        onChange={(e) =>
                                            setSelectedKecamatan(
                                                e.target.value
                                            )
                                        }
                                        className="w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-9 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                    >
                                        <option value="">
                                            Semua Kecamatan
                                        </option>

                                        {kecamatanList.map((kec) => (
                                            <option key={kec} value={kec}>
                                                {kec}
                                            </option>
                                        ))}
                                    </select>

                                    <svg
                                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="primary"
                                    onClick={handleFilter}
                                    className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700"
                                >
                                    <Filter size={16} />
                                    <span>Filter</span>
                                </Button>

                                {hasActiveFilter && (
                                    <Button
                                        variant="secondary"
                                        onClick={handleReset}
                                        className="flex items-center justify-center gap-2"
                                    >
                                        <RotateCcw size={16} />
                                        <span>Reset</span>
                                    </Button>
                                )}
                            </div>
                        </div>

                        {hasActiveFilter && (
                            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                                <span className="text-xs font-medium text-slate-400">
                                    Filter aktif:
                                </span>

                                {searchQuery && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                        Pencarian: "{searchQuery}"
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSearchQuery("");
                                                setTimeout(handleFilter, 0);
                                            }}
                                            className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                )}

                                {selectedKecamatan && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                        Kecamatan: {selectedKecamatan}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedKecamatan("");
                                                setTimeout(handleFilter, 0);
                                            }}
                                            className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </Card>

                {/* Data Table */}
                <Card className="overflow-hidden dark:bg-slate-800 dark:border-slate-700">
                    <div className="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                Daftar Pengajuan
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Berita yang sedang menunggu pemeriksaan admin
                            </p>
                        </div>

                        <div className="text-xs text-slate-400">
                            {beritaPending?.total || 0} data
                        </div>
                    </div>

                    {items.length === 0 ? (
                        <div className="px-6 py-16 text-center">
                            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                                <Clock size={26} />
                            </div>

                            <h3 className="mt-4 text-sm font-bold text-slate-700 dark:text-slate-200">
                                {hasActiveFilter
                                    ? "Tidak Ada Hasil"
                                    : "Tidak Ada Berita Pending"}
                            </h3>

                            <p className="mt-1 text-sm text-slate-400 max-w-md mx-auto">
                                {hasActiveFilter
                                    ? "Coba ubah kata kunci atau filter kecamatan."
                                    : "Semua berita sudah disetujui atau ditolak."}
                            </p>

                            {hasActiveFilter && (
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="mt-4 text-sm font-semibold text-teal-600 hover:text-teal-700"
                                >
                                    Reset Filter
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table
                                columns={[
                                    {
                                        header: "#",
                                        className:
                                            "text-center text-sm font-medium text-slate-400 dark:text-slate-300 w-14",
                                        headerClassName:
                                            "text-center w-14",
                                        render: (
                                            _item: BeritaPendingItem,
                                            index: number
                                        ) => {
                                            const currentPage =
                                                beritaPending?.current_page ??
                                                1;
                                            const perPage =
                                                beritaPending?.per_page ?? 10;

                                            return (
                                                (currentPage - 1) * perPage +
                                                index +
                                                1
                                            );
                                        },
                                    },
                                    {
                                        header: "Berita",
                                        className: "min-w-[360px]",
                                        headerClassName: "min-w-[360px]",
                                        render: (
                                            berita: BeritaPendingItem
                                        ) => {
                                            const isApproving =
                                                loadingApprove === berita.id;
                                            const isRejecting =
                                                loadingReject === berita.id;
                                            const isProcessing =
                                                isApproving || isRejecting;

                                            return (
                                                <div className="flex items-start gap-4 min-w-[320px]">
                                                    <div className="relative shrink-0">
                                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                                                            {berita.foto_url ? (
                                                                <img
                                                                    src={
                                                                        berita.foto_url
                                                                    }
                                                                    alt={
                                                                        berita.judul
                                                                    }
                                                                    className="w-full h-full object-cover"
                                                                    onError={(
                                                                        e
                                                                    ) => {
                                                                        e.currentTarget.style.display =
                                                                            "none";
                                                                    }}
                                                                />
                                                            ) : berita.foto ? (
                                                                <img
                                                                    src={`/storage/${berita.foto}`}
                                                                    alt={
                                                                        berita.judul
                                                                    }
                                                                    className="w-full h-full object-cover"
                                                                    onError={(
                                                                        e
                                                                    ) => {
                                                                        e.currentTarget.style.display =
                                                                            "none";
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                                    <Newspaper
                                                                        size={
                                                                            22
                                                                        }
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <span className="absolute -top-2 -right-2">
                                                            <Badge
                                                                type="warning"
                                                                className="text-[10px] shadow-sm"
                                                            >
                                                                Pending
                                                            </Badge>
                                                        </span>
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-5 line-clamp-2">
                                                            {berita.judul}
                                                        </p>

                                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                                                            {berita.kategori && (
                                                                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                                                                    <Tag
                                                                        size={
                                                                            11
                                                                        }
                                                                    />
                                                                    {
                                                                        berita.kategori
                                                                    }
                                                                </span>
                                                            )}

                                                            {berita.kecamatan && (
                                                                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                                                                    <MapPin
                                                                        size={
                                                                            11
                                                                        }
                                                                    />
                                                                    {
                                                                        berita.kecamatan
                                                                    }
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[11px] text-slate-400">
                                                            <span className="inline-flex items-center gap-1">
                                                                <Calendar
                                                                    size={11}
                                                                />
                                                                {formatDate(
                                                                    berita.created_at
                                                                )}
                                                            </span>

                                                            <span className="inline-flex items-center gap-1">
                                                                <User
                                                                    size={11}
                                                                />
                                                                {berita.user
                                                                    ?.name ||
                                                                    berita.created_by_name ||
                                                                    "Kader"}
                                                            </span>
                                                        </div>

                                                        <div className="mt-3 space-y-2">
                                                            <input
                                                                type="text"
                                                                id={`judul-${berita.id}`}
                                                                defaultValue={
                                                                    berita.judul
                                                                }
                                                                disabled={
                                                                    isProcessing
                                                                }
                                                                aria-label="Judul berita"
                                                                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                                            />

                                                            <textarea
                                                                id={`deskripsi-${berita.id}`}
                                                                defaultValue={
                                                                    berita.deskripsi ||
                                                                    berita.konten ||
                                                                    ""
                                                                }
                                                                rows={3}
                                                                disabled={
                                                                    isProcessing
                                                                }
                                                                aria-label="Deskripsi berita"
                                                                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-600 outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        },
                                    },
                                    {
                                        header: "Aksi",
                                        className:
                                            "text-center w-44 align-top",
                                        headerClassName:
                                            "text-center w-44",
                                        render: (
                                            berita: BeritaPendingItem
                                        ) => {
                                            const isApproving =
                                                loadingApprove === berita.id;
                                            const isRejecting =
                                                loadingReject === berita.id;
                                            const isProcessing =
                                                isApproving || isRejecting;

                                            return (
                                                <div className="flex flex-col gap-2 min-w-[145px]">
                                                    <Button
                                                        variant="primary"
                                                        onClick={() =>
                                                            openApproveModal(
                                                                berita.id
                                                            )
                                                        }
                                                        disabled={
                                                            isProcessing
                                                        }
                                                        className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-60"
                                                    >
                                                        {isApproving ? (
                                                            <Loader2
                                                                size={16}
                                                                className="animate-spin"
                                                            />
                                                        ) : (
                                                            <CheckCircle
                                                                size={16}
                                                            />
                                                        )}

                                                        <span>
                                                            {isApproving
                                                                ? "Memproses..."
                                                                : "Setujui"}
                                                        </span>
                                                    </Button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openRejectModal(
                                                                berita.id
                                                            )
                                                        }
                                                        disabled={
                                                            isProcessing
                                                        }
                                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-rose-600 transition-all hover:bg-rose-50 hover:border-rose-300 disabled:opacity-60 dark:bg-slate-800 dark:border-rose-500/20 dark:text-rose-400 dark:hover:bg-rose-500/10"
                                                    >
                                                        {isRejecting ? (
                                                            <Loader2
                                                                size={16}
                                                                className="animate-spin"
                                                            />
                                                        ) : (
                                                            <XCircle size={16} />
                                                        )}

                                                        <span>
                                                            {isRejecting
                                                                ? "Memproses..."
                                                                : "Tolak"}
                                                        </span>
                                                    </button>

                                                    <Link
                                                        href={route(
                                                            "be.berita.edit",
                                                            berita.id
                                                        )}
                                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-800 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-600"
                                                    >
                                                        <Edit2 size={16} />
                                                        <span>
                                                            Edit Lengkap
                                                        </span>
                                                    </Link>

                                                    <Link
                                                        href={
                                                            berita.slug
                                                                ? `/berita/${berita.slug}`
                                                                : "#"
                                                        }
                                                        target="_blank"
                                                        className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-400 transition-all hover:bg-slate-50 hover:text-blue-600 dark:hover:bg-slate-700"
                                                    >
                                                        <Eye size={14} />
                                                        Lihat Preview
                                                    </Link>
                                                </div>
                                            );
                                        },
                                    },
                                ]}
                                data={items}
                            />
                        </div>
                    )}

                    {beritaPending?.last_page > 1 &&
                        beritaPending?.links && (
                            <div className="border-t border-slate-100 dark:border-slate-700 px-5 sm:px-6 py-4 bg-slate-50/40 dark:bg-slate-700/20">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Menampilkan{" "}
                                        <span className="font-bold text-slate-700 dark:text-slate-200">
                                            {beritaPending?.from || 0}
                                        </span>{" "}
                                        sampai{" "}
                                        <span className="font-bold text-slate-700 dark:text-slate-200">
                                            {beritaPending?.to || 0}
                                        </span>{" "}
                                        dari{" "}
                                        <span className="font-bold text-slate-700 dark:text-slate-200">
                                            {beritaPending?.total || 0}
                                        </span>{" "}
                                        data
                                    </p>

                                    <Pagination
                                        links={beritaPending.links || []}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            </div>
                        )}
                </Card>
            </div>

            {/* ====== MODAL KONFIRMASI APPROVE ====== */}
            {showApproveModal && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                        onClick={() => setShowApproveModal(false)}
                    />

                    <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 shrink-0 rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400 flex items-center justify-center">
                                <CheckCircle size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                                    Setujui Berita Ini?
                                </h3>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Berita akan langsung dipublikasikan setelah Anda menyetujui.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowApproveModal(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mt-6 flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={() => setShowApproveModal(false)}
                                className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={confirmApprove}
                                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors shadow-sm"
                            >
                                Ya, Setujui
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ====== MODAL KONFIRMASI REJECT ====== */}
            {showRejectModal && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                        onClick={() => setShowRejectModal(false)}
                    />

                    <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 shrink-0 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 flex items-center justify-center">
                                <AlertTriangle size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                                    Tolak Berita Ini?
                                </h3>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Berita akan ditolak dan tidak akan dipublikasikan.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowRejectModal(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mt-5">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Alasan Penolakan (Opsional)
                            </label>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                rows={3}
                                placeholder="Tuliskan alasan penolakan..."
                                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            />
                        </div>

                        <div className="mt-6 flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={() => setShowRejectModal(false)}
                                className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={confirmReject}
                                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-colors shadow-sm"
                            >
                                Ya, Tolak
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </MainLayout>
    );
}
