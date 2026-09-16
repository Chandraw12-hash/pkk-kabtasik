import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminKecamatanLayout from '@/Components/Layout/AdminKecamatanLayout';
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import Badge from "@/Components/UI/Badge";
import Table from "@/Components/Data/Table";
import Pagination from "@/Components/Data/Pagination";
import Card from "@/Components/UI/Card";
import {
    FileText,
    Search,
    Filter,
    Eye,
    Calendar,
    MapPin,
    Home,
    RotateCcw,
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
    const [isLoading, setIsLoading] = useState(false);

    // ============================================================
    // HANDLE FILTER
    // ============================================================
    const handleFilter = () => {
        setIsLoading(true);
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
                onFinish: () => setIsLoading(false),
            }
        );
    };

    const handleReset = () => {
        setSearch('');
        setPokja('');
        setStatus('');
        setDesa('');
        setIsLoading(true);
        router.get('/kecamatan/laporan', {}, { 
            preserveState: true,
            onFinish: () => setIsLoading(false),
        });
    };

    const hasActiveFilter = Boolean(search || pokja || status || desa);

    // ============================================================
    // STATUS BADGE
    // ============================================================
    const getStatusBadgeType = (status: string): any => {
        const map: Record<string, string> = {
            pending: 'warning',
            approved: 'success',
            rejected: 'danger',
            reviewed: 'info',
        };
        return map[status] || 'default';
    };
    
    const getStatusBadgeLabel = (status: string) => {
        const map: Record<string, string> = {
            pending: 'Menunggu',
            approved: 'Disetujui',
            rejected: 'Ditolak',
            reviewed: 'Direview',
        };
        return map[status] || status;
    };

    return (
        <AdminKecamatanLayout>
            <Head title={`Laporan Kecamatan ${kecamatan}`} />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Laporan Kecamatan
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        Daftar laporan PKK di Kecamatan{' '}
                        <span className="font-semibold text-teal-600 dark:text-teal-400">
                            {kecamatan}
                        </span>
                    </p>
                </div>
                
                <Button
                    variant="primary"
                    href="/kecamatan/export/excel"
                    className="shadow-lg shadow-teal-100 dark:shadow-none flex items-center gap-2 bg-teal-600 hover:bg-teal-700"
                >
                    <Download size={16} />
                    <span>Export</span>
                </Button>
            </div>

            <Card className="dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
                {/* ============================================================
                    FILTER BAR
                ============================================================ */}
                <div className="p-6 border-b border-slate-50 dark:border-slate-700">
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[200px]">
                            <TextInput
                                iconLeft={<Search size={18} />}
                                placeholder="Cari judul, desa, atau dasa wisma..."
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                containerClassName="relative w-full"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                            />
                        </div>

                        {/* Toggle Filter */}
                        <Button
                            variant="secondary"
                            onClick={() => setShowFilter(!showFilter)}
                            className="flex items-center gap-2"
                        >
                            <Filter size={16} />
                            <span>Filter</span>
                        </Button>

                        {/* Search Button */}
                        <Button
                            variant="primary"
                            onClick={handleFilter}
                            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700"
                        >
                            <Search size={16} />
                            <span>Cari</span>
                        </Button>

                        {hasActiveFilter && (
                            <Button
                                variant="secondary"
                                onClick={handleReset}
                                className="flex items-center gap-2"
                            >
                                <RotateCcw size={16} />
                                <span>Reset</span>
                            </Button>
                        )}
                    </div>

                    {/* Expanded Filter */}
                    {showFilter && (
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <select
                                value={pokja}
                                onChange={(e) => setPokja(e.target.value)}
                                className="text-sm rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all"
                            >
                                <option value="">Semua Pokja</option>
                                <option value="I">Pokja I</option>
                                <option value="II">Pokja II</option>
                                <option value="III">Pokja III</option>
                                <option value="IV">Pokja IV</option>
                            </select>

                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="text-sm rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all"
                            >
                                <option value="">Semua Status</option>
                                <option value="pending">Menunggu</option>
                                <option value="approved">Disetujui</option>
                                <option value="rejected">Ditolak</option>
                                <option value="reviewed">Direview</option>
                            </select>

                            <select
                                value={desa}
                                onChange={(e) => setDesa(e.target.value)}
                                className="text-sm rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all"
                            >
                                <option value="">Semua Desa</option>
                                {daftarDesa.map((d) => (
                                    <option key={d} value={d}>
                                        {d}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* ============================================================
                    TABLE
                ============================================================ */}
                <div className="overflow-x-hidden">
                    <Table
                        isLoading={isLoading}
                        columns={[
                            {
                                header: "No",
                                className: "text-center text-sm font-medium text-slate-400 dark:text-slate-200 w-14",
                                headerClassName: "text-center w-14",
                                render: (_: LaporanItem, index: number) => {
                                    return (laporan.current_page - 1) * laporan.per_page + index + 1;
                                },
                            },
                            {
                                header: "Laporan",
                                className: "w-auto",
                                headerClassName: "w-auto",
                                render: (item: LaporanItem) => (
                                    <div className="flex items-start gap-3 min-w-[200px]">
                                        <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-900/50 flex items-center justify-center shrink-0">
                                            <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 line-clamp-2">
                                                {item.judul}
                                            </p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                                {item.user?.name || 'Anonim'}
                                            </p>
                                        </div>
                                    </div>
                                ),
                            },
                            {
                                header: "Pokja",
                                className: "w-24",
                                headerClassName: "w-24",
                                render: (item: LaporanItem) => (
                                    <Badge type="info" className="text-[10px]">
                                        Pokja {item.kategori_pokja}
                                    </Badge>
                                ),
                            },
                            {
                                header: "Wilayah",
                                className: "w-auto",
                                headerClassName: "w-auto",
                                render: (item: LaporanItem) => (
                                    <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                                        {item.desa_kelurahan && (
                                            <div className="flex items-center gap-1.5">
                                                <MapPin size={12} className="text-slate-400" />
                                                <span>{item.desa_kelurahan}</span>
                                            </div>
                                        )}
                                        {item.nama_dasawisma && (
                                            <div className="flex items-center gap-1.5">
                                                <Home size={12} className="text-slate-400" />
                                                <span>{item.nama_dasawisma}</span>
                                            </div>
                                        )}
                                    </div>
                                ),
                            },
                            {
                                header: "Status",
                                className: "text-center w-28",
                                headerClassName: "text-center w-28",
                                render: (item: LaporanItem) => (
                                    <Badge type={getStatusBadgeType(item.status)}>
                                        {getStatusBadgeLabel(item.status)}
                                    </Badge>
                                ),
                            },
                            {
                                header: "Tanggal",
                                className: "w-32",
                                headerClassName: "w-32",
                                render: (item: LaporanItem) => (
                                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                                        <Calendar size={12} className="text-slate-400" />
                                        <span>
                                            {new Date(item.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                ),
                            },
                            {
                                header: "Aksi",
                                headerClassName: "text-center w-28",
                                className: "text-center w-28",
                                render: (item: LaporanItem) => (
                                    <div className="flex items-center justify-center">
                                        <Link
                                            href={`/kecamatan/laporan/${item.id}`}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 text-xs font-semibold hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors"
                                        >
                                            <Eye size={14} />
                                            Detail
                                        </Link>
                                    </div>
                                ),
                            },
                        ]}
                        data={laporan.data || []}
                        emptyMessage="Belum Ada Laporan masuk di kecamatan ini"
                    />
                </div>

                {/* Pagination */}
                <div className="p-6 border-t border-slate-50 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/20 dark:bg-slate-700/20">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Menampilkan{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {laporan.from ?? 0}
                        </span>{" "}
                        sampai{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {laporan.to ?? 0}
                        </span>{" "}
                        dari{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {laporan.total ?? 0}
                        </span>{" "}
                        laporan
                    </p>

                    <Pagination
                        links={laporan.links || []}
                    />
                </div>
            </Card>
        </AdminKecamatanLayout>
    );
}
