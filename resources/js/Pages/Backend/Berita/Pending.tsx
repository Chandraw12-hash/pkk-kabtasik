import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import { Head, Link, usePage, router } from "@inertiajs/react";
import {
    CheckCircle,
    XCircle,
    Eye,
    Edit,
    Clock,
    Calendar,
    MapPin,
    Tag,
    User,
    Search,
    Filter,
    X
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
    };
    kecamatanList?: string[];
    filters?: {
        kecamatan?: string;
        search?: string;
    };
}

export default function BeritaPending() {
    const { beritaPending, kecamatanList = [], filters = {} } = usePage<{
        beritaPending: PendingProps['beritaPending'];
        kecamatanList?: string[];
        filters?: { kecamatan?: string; search?: string };
    }>().props;

    const items = beritaPending?.data || [];

    const [searchQuery, setSearchQuery] = useState(filters.search || "");
    const [selectedKecamatan, setSelectedKecamatan] = useState(filters.kecamatan || "");

    const handleApprove = (id: number) => {
        const judulInput = document.getElementById(`judul-${id}`) as HTMLInputElement;
        const deskripsiInput = document.getElementById(`deskripsi-${id}`) as HTMLTextAreaElement;

        if (!judulInput || !deskripsiInput) return;

        router.put(`/dashboard/berita/${id}/approve`, {
            judul: judulInput.value,
            deskripsi: deskripsiInput.value,
        });
    };

    const handleReject = (id: number) => {
        const reason = prompt("Alasan penolakan:");
        if (reason !== null) {
            router.put(`/dashboard/berita/${id}/reject`, {
                reason: reason || "Tidak memenuhi kriteria publikasi.",
            });
        }
    };

    const handleFilter = () => {
        router.get("/dashboard/berita/pending", {
            search: searchQuery || undefined,
            kecamatan: selectedKecamatan || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setSearchQuery("");
        setSelectedKecamatan("");
        router.get("/dashboard/berita/pending", {}, {
            preserveState: true,
            preserveScroll: true,
        });
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

    const hasActiveFilter = searchQuery || selectedKecamatan;

    return (
        <MainLayout>
            <Head title="Berita Pending - Persetujuan Admin" />

            <div className="py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Berita Perlu Persetujuan
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Tinjau dan kelola berita yang dikirim oleh kader
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                            <Clock size={16} className="text-amber-600" />
                            <span className="text-sm font-semibold text-amber-700">
                                {beritaPending?.total || 0} Menunggu
                            </span>
                        </div>
                        <Link
                            href="/dashboard/berita"
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            Lihat Semua Berita
                        </Link>
                    </div>
                </div>

                {/* 🔥 Filter Bar */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari judul berita..."
                                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                            />
                        </div>

                        {/* Filter Kecamatan */}
                        <div className="w-full sm:w-56 relative">
                            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <select
                                value={selectedKecamatan}
                                onChange={(e) => setSelectedKecamatan(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white appearance-none"
                            >
                                <option value="">Semua Kecamatan</option>
                                {kecamatanList.map((kec) => (
                                    <option key={kec} value={kec}>{kec}</option>
                                ))}
                            </select>
                        </div>

                        {/* Tombol Aksi */}
                        <div className="flex gap-2">
                            <button
                                onClick={handleFilter}
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                <Filter size={16} />
                                Filter
                            </button>
                            {hasActiveFilter && (
                                <button
                                    onClick={handleReset}
                                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
                                >
                                    <X size={16} />
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Active Filters */}
                    {hasActiveFilter && (
                        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                            <span className="text-xs text-slate-500">Filter aktif:</span>
                            {searchQuery && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                                    Pencarian: "{searchQuery}"
                                    <button
                                        onClick={() => {
                                            setSearchQuery("");
                                            handleFilter();
                                        }}
                                        className="hover:text-slate-800"
                                    >
                                        <X size={12} />
                                    </button>
                                </span>
                            )}
                            {selectedKecamatan && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                                    Kec: {selectedKecamatan}
                                    <button
                                        onClick={() => {
                                            setSelectedKecamatan("");
                                            handleFilter();
                                        }}
                                        className="hover:text-slate-800"
                                    >
                                        <X size={12} />
                                    </button>
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Empty State */}
                {items.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                            <Clock size={32} className="text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-700">
                            {hasActiveFilter ? "Tidak Ada Hasil" : "Tidak Ada Berita Pending"}
                        </h3>
                        <p className="text-sm text-slate-400 mt-1">
                            {hasActiveFilter
                                ? "Coba ubah kata kunci atau filter kecamatan."
                                : "Semua berita sudah disetujui atau ditolak."}
                        </p>
                        {hasActiveFilter && (
                            <button
                                onClick={handleReset}
                                className="mt-4 text-sm text-teal-600 hover:text-teal-700 font-medium"
                            >
                                Reset Filter
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-5">
                        {items.map((berita) => (
                            <div
                                key={berita.id}
                                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                        {/* Thumbnail */}
                                        <div className="lg:col-span-1">
                                            <div className="relative w-full aspect-video lg:aspect-square rounded-xl overflow-hidden bg-slate-100">
                                                {berita.foto_url ? (
                                                    <img
                                                        src={berita.foto_url}
                                                        alt={berita.judul}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).style.display = "none";
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-50">
                                                        <Eye size={32} className="mb-2" />
                                                        <span className="text-xs">Tidak ada gambar</span>
                                                    </div>
                                                )}
                                                <div className="absolute top-3 left-3">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full shadow-sm">
                                                        <Clock size={12} />
                                                        Pending
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="lg:col-span-2 space-y-4">
                                            {/* Meta Info */}
                                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar size={14} className="text-slate-400" />
                                                    {formatDate(berita.created_at)}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <User size={14} className="text-slate-400" />
                                                    {berita.created_by_name || "Kader"}
                                                </span>
                                                {berita.kategori && (
                                                    <span className="flex items-center gap-1.5">
                                                        <Tag size={14} className="text-slate-400" />
                                                        {berita.kategori}
                                                    </span>
                                                )}
                                                {berita.kecamatan && (
                                                    <span className="flex items-center gap-1.5">
                                                        <MapPin size={14} className="text-slate-400" />
                                                        {berita.kecamatan}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Edit Fields */}
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-500 mb-1">
                                                        Judul Berita
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id={`judul-${berita.id}`}
                                                        defaultValue={berita.judul}
                                                        className="w-full text-base font-semibold text-slate-900 border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow"
                                                        placeholder="Masukkan judul berita..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-500 mb-1">
                                                        Deskripsi / Konten
                                                    </label>
                                                    <textarea
                                                        id={`deskripsi-${berita.id}`}
                                                        defaultValue={berita.deskripsi || berita.konten || ""}
                                                        className="w-full text-sm text-slate-600 border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow"
                                                        rows={3}
                                                        placeholder="Tulis deskripsi berita..."
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="lg:col-span-1 flex flex-row lg:flex-col gap-2 lg:justify-center">
                                            <button
                                                onClick={() => handleApprove(berita.id)}
                                                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition-colors w-full"
                                            >
                                                <CheckCircle size={18} />
                                                Setujui
                                            </button>
                                            <button
                                                onClick={() => handleReject(berita.id)}
                                                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-red-50 text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 text-sm font-semibold rounded-lg transition-colors w-full"
                                            >
                                                <XCircle size={18} />
                                                Tolak
                                            </button>
                                            <Link
                                                href={`/dashboard/berita/${berita.id}/edit`}
                                                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-700 text-sm font-medium rounded-lg transition-colors w-full border border-slate-200"
                                            >
                                                <Edit size={16} />
                                                Edit Lengkap
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {beritaPending?.last_page > 1 && (
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
                        <p className="text-sm text-slate-500">
                            Menampilkan {beritaPending?.from || 0} - {beritaPending?.to || 0} dari {beritaPending?.total || 0}
                        </p>
                        <div className="flex gap-2">
                            {Array.from({ length: Math.min(beritaPending?.last_page || 1, 5) }, (_, i) => i + 1).map((page) => (
                                <Link
                                    key={page}
                                    href={`?page=${page}`}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                        page === (beritaPending?.current_page || 1)
                                            ? "bg-teal-600 text-white"
                                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                                    }`}
                                >
                                    {page}
                                </Link>
                            ))}
                            {beritaPending?.last_page > 5 && (
                                <span className="px-4 py-2 text-sm text-slate-400">...</span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
