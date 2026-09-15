import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminKecamatanLayout from '@/Components/Layout/AdminKecamatanLayout';
import {
    FileText,
    Search,
    Filter,
    Eye,
    Calendar,
    MapPin,
    Home,
    ChevronLeft,
    ChevronRight,
    X,
    Download,
} from 'lucide-react';

interface LaporanItem {
    id: number;
    judul: string;
    kategori_pokja: string;
    kecamatan: string;
    desa_kelurahan: string | null;
    nama_dasawisma: string | null;
    status: string;
    status_label: string;
    status_color: string;
    created_at: string;
    user?: {
        id: number;
        name: string;
    };
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface LaporanPaginated {
    data: LaporanItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: PaginationLink[];
}

interface Filters {
    pokja?: string;
    status?: string;
    desa?: string;
    search?: string;
}

interface LaporanIndexProps {
    kecamatan: string;
    laporan: LaporanPaginated;
    daftarDesa: string[];
    filters: Filters;
}

export default function LaporanIndex({
    kecamatan,
    laporan,
    daftarDesa,
    filters,
}: LaporanIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [pokja, setPokja] = useState(filters.pokja || '');
    const [status, setStatus] = useState(filters.status || '');
    const [desa, setDesa] = useState(filters.desa || '');
    const [showFilter, setShowFilter] = useState(false);

    // ============================================================
    // HANDLE FILTER
    // ============================================================
    const handleFilter = () => {
        router.get(
            '/kecamatan/laporan',
            {
                search: search || undefined,
                pokja: pokja || undefined,
                status: status || undefined,
                desa: desa || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleReset = () => {
        setSearch('');
        setPokja('');
        setStatus('');
        setDesa('');
        router.get('/kecamatan/laporan', {}, { preserveState: true });
    };

    // ============================================================
    // STATUS BADGE
    // ============================================================
    const getStatusBadge = (status: string) => {
        const map: Record<string, { label: string; class: string }> = {
            pending: {
                label: 'Menunggu',
                class: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
            },
            approved: {
                label: 'Disetujui',
                class: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
            },
            rejected: {
                label: 'Ditolak',
                class: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
            },
            reviewed: {
                label: 'Direview',
                class: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
            },
        };
        return map[status] || {
            label: status,
            class: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
        };
    };

    // ============================================================
    // POKJA BADGE
    // ============================================================
    const getPokjaBadge = (pokja: string) => {
        const map: Record<string, string> = {
            I: 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400',
            II: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
            III: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400',
            IV: 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-400',
        };
        return map[pokja] || 'bg-slate-100 text-slate-700';
    };

    return (
        <AdminKecamatanLayout>
            <Head title={`Laporan Kecamatan ${kecamatan}`} />

            <div className="space-y-6">
                {/* ============================================================
                    HEADER
                ============================================================ */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">
                            Laporan Kecamatan
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Daftar laporan PKK di Kecamatan{' '}
                            <span className="font-semibold text-teal-600 dark:text-teal-400">
                                {kecamatan}
                            </span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href="/kecamatan/export/excel"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </a>
                    </div>
                </div>

                {/* ============================================================
                    FILTER BAR
                ============================================================ */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                placeholder="Cari judul, desa, atau dasa wisma..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>

                        {/* Toggle Filter */}
                        <button
                            onClick={() => setShowFilter(!showFilter)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            <Filter className="w-4 h-4" />
                            Filter
                        </button>

                        {/* Search Button */}
                        <button
                            onClick={handleFilter}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors"
                        >
                            <Search className="w-4 h-4" />
                            Cari
                        </button>
                    </div>

                    {/* Expanded Filter */}
                    {showFilter && (
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {/* Pokja */}
                            <div>
                                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">
                                    Pokja
                                </label>
                                <select
                                    value={pokja}
                                    onChange={(e) => setPokja(e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                >
                                    <option value="">Semua Pokja</option>
                                    <option value="I">Pokja I</option>
                                    <option value="II">Pokja II</option>
                                    <option value="III">Pokja III</option>
                                    <option value="IV">Pokja IV</option>
                                </select>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">
                                    Status
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="pending">Menunggu</option>
                                    <option value="approved">Disetujui</option>
                                    <option value="rejected">Ditolak</option>
                                    <option value="reviewed">Direview</option>
                                </select>
                            </div>

                            {/* Desa */}
                            <div>
                                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">
                                    Desa/Kelurahan
                                </label>
                                <select
                                    value={desa}
                                    onChange={(e) => setDesa(e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                >
                                    <option value="">Semua Desa</option>
                                    {daftarDesa.map((d) => (
                                        <option key={d} value={d}>
                                            {d}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Reset */}
                            <div className="sm:col-span-3 flex justify-end">
                                <button
                                    onClick={handleReset}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                    Reset Filter
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ============================================================
                    TABLE
                ============================================================ */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    {/* Table Header */}
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Menampilkan{' '}
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                                {laporan.from || 0}-{laporan.to || 0}
                            </span>{' '}
                            dari{' '}
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                                {laporan.total}
                            </span>{' '}
                            laporan
                        </p>
                    </div>

                    {/* Table */}
                    {laporan.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                    <tr>
                                        <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            No
                                        </th>
                                        <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Laporan
                                        </th>
                                        <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Pokja
                                        </th>
                                        <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Wilayah
                                        </th>
                                        <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Tanggal
                                        </th>
                                        <th className="text-right px-4 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {laporan.data.map((item, index) => {
                                        const badge = getStatusBadge(item.status);
                                        const pokjaBadge = getPokjaBadge(item.kategori_pokja);
                                        const rowNumber =
                                            (laporan.current_page - 1) * laporan.per_page + index + 1;

                                        return (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                            >
                                                <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                    {rowNumber}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-start gap-3 min-w-[200px]">
                                                        <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-950 flex items-center justify-center shrink-0">
                                                            <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
                                                                {item.judul}
                                                            </p>
                                                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                                                {item.user?.name || 'Anonim'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span
                                                        className={`inline-flex text-[10px] font-bold px-2.5 py-1 rounded-full ${pokjaBadge}`}
                                                    >
                                                        Pokja {item.kategori_pokja}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                                                        {item.desa_kelurahan && (
                                                            <div className="flex items-center gap-1.5">
                                                                <MapPin className="w-3 h-3 text-slate-400" />
                                                                <span>{item.desa_kelurahan}</span>
                                                            </div>
                                                        )}
                                                        {item.nama_dasawisma && (
                                                            <div className="flex items-center gap-1.5">
                                                                <Home className="w-3 h-3 text-slate-400" />
                                                                <span>{item.nama_dasawisma}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span
                                                        className={`inline-flex text-[10px] font-bold px-2.5 py-1 rounded-full ${badge.class}`}
                                                    >
                                                        {badge.label}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                                                        <Calendar className="w-3 h-3 text-slate-400" />
                                                        <span>
                                                            {new Date(
                                                                item.created_at
                                                            ).toLocaleDateString('id-ID', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric',
                                                            })}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <Link
                                                        href={`/kecamatan/laporan/${item.id}`}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 text-xs font-semibold hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        Detail
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        // Empty State
                        <div className="p-16 text-center">
                            <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                            </div>
                            <p className="text-base font-semibold text-slate-600 dark:text-slate-400">
                                Belum Ada Laporan
                            </p>
                            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                                Belum ada laporan masuk di kecamatan ini
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {laporan.last_page > 1 && (
                        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Halaman {laporan.current_page} dari {laporan.last_page}
                            </p>

                            <div className="flex items-center gap-1">
                                {laporan.links.map((link, idx) => {
                                    if (link.label.includes('Previous')) {
                                        return (
                                            <Link
                                                key={idx}
                                                href={link.url || '#'}
                                                className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                                                    link.url
                                                        ? 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                                        : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                                                }`}
                                                preserveScroll
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </Link>
                                        );
                                    }
                                    if (link.label.includes('Next')) {
                                        return (
                                            <Link
                                                key={idx}
                                                href={link.url || '#'}
                                                className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                                                    link.url
                                                        ? 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                                        : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                                                }`}
                                                preserveScroll
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        );
                                    }
                                    return (
                                        <Link
                                            key={idx}
                                            href={link.url || '#'}
                                            className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                                                link.active
                                                    ? 'bg-teal-600 text-white'
                                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                            }`}
                                            preserveScroll
                                        >
                                            {link.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminKecamatanLayout>
    );
}
