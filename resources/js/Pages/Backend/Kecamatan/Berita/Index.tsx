import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminKecamatanLayout from '../../../../Components/Layout/AdminKecamatanLayout';
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import Badge from "@/Components/UI/Badge";
import Table from "@/Components/Data/Table";
import Pagination from "@/Components/Data/Pagination";
import Card from "@/Components/UI/Card";
import StatCard from "@/Components/UI/SatistikCard";
import {
    Newspaper,
    Search,
    Eye,
    Calendar,
    User as UserIcon,
    Filter,
    RotateCcw,
    FileText,
    Clock,
    CheckCircle2,
    XCircle,
} from 'lucide-react';

interface BeritaItem {
    id: number;
    judul: string;
    slug: string;
    kategori: string;
    kecamatan: string | null;
    status: 'pending' | 'approved' | 'rejected' | 'draft';
    foto_url: string | null;
    tanggal_formatted: string;
    user?: {
        name: string;
    };
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface BeritasPaginated {
    data: BeritaItem[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
    per_page: number;
}

interface Stats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
}

interface Filters {
    search?: string;
    kategori?: string;
    status?: string;
    per_page?: number;
}

interface Props {
    beritas: BeritasPaginated;
    stats: Stats;
    kecamatan: string;
    filters: Filters;
}

export default function Index({ beritas, stats, kecamatan, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [isLoading, setIsLoading] = useState(false);

    const handleFilter = () => {
        setIsLoading(true);
        router.get('/kecamatan/berita', 
            { search, status }, 
            { 
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsLoading(false)
            }
        );
    };
    
    const handleReset = () => {
        setSearch('');
        setStatus('');
        setIsLoading(true);
        router.get('/kecamatan/berita', {}, { 
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoading(false)
        });
    };

    const hasActiveFilter = Boolean(search || status);

    const getStatusBadgeType = (status: string): any => {
        const map: Record<string, string> = {
            pending: 'warning',
            approved: 'success',
            rejected: 'danger',
            draft: 'default',
        };
        return map[status] || 'default';
    };
    
    const getStatusBadgeLabel = (status: string) => {
        const map: Record<string, string> = {
            pending: 'Menunggu',
            approved: 'Disetujui',
            rejected: 'Ditolak',
            draft: 'Draft',
        };
        return map[status] || status;
    };

    return (
        <AdminKecamatanLayout>
            <Head title={`Berita Kecamatan ${kecamatan}`} />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Berita Kecamatan {kecamatan}
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        Monitoring berita dari kader di wilayah kecamatan Anda
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    title="Total Berita"
                    value={stats.total.toLocaleString()}
                    icon={FileText}
                    color="bg-teal-600"
                    className="border-l-4 border-teal-600 dark:bg-slate-800"
                    textColor="white"
                />
                <StatCard
                    title="Disetujui"
                    value={stats.approved.toLocaleString()}
                    icon={CheckCircle2}
                    color="bg-emerald-600"
                    className="border-l-4 border-emerald-600 dark:bg-slate-800"
                    textColor="white"
                />
                <StatCard
                    title="Menunggu"
                    value={stats.pending.toLocaleString()}
                    icon={Clock}
                    color="bg-amber-500"
                    className="border-l-4 border-amber-500 dark:bg-slate-800"
                    textColor="white"
                />
                <StatCard
                    title="Ditolak"
                    value={stats.rejected.toLocaleString()}
                    icon={XCircle}
                    color="bg-rose-500"
                    className="border-l-4 border-rose-500 dark:bg-slate-800"
                    textColor="white"
                />
            </div>

            {/* Main Content */}
            <Card className="dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
                {/* Filter Section */}
                <div className="p-6 border-b border-slate-50 dark:border-slate-700">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[200px]">
                            <TextInput
                                iconLeft={<Search size={18} />}
                                placeholder="Cari judul berita..."
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                containerClassName="relative w-full"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                            />
                        </div>

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="text-sm rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all"
                        >
                            <option value="">Semua Status</option>
                            <option value="pending">Menunggu</option>
                            <option value="approved">Disetujui</option>
                            <option value="rejected">Ditolak</option>
                            <option value="draft">Draft</option>
                        </select>

                        <Button
                            variant="primary"
                            onClick={handleFilter}
                            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700"
                        >
                            <Filter size={16} />
                            <span>Filter</span>
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
                </div>

                {/* Table */}
                <div className="overflow-x-hidden">
                    <Table
                        isLoading={isLoading}
                        columns={[
                            {
                                header: "Berita",
                                className: "w-auto",
                                headerClassName: "w-auto",
                                render: (item: BeritaItem) => (
                                    <div className="flex items-start gap-4 min-w-[250px]">
                                        <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
                                            {item.foto_url ? (
                                                <img src={item.foto_url} alt={item.judul} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Newspaper size={20} className="text-slate-300 dark:text-slate-500" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm line-clamp-2 mb-1.5">
                                                {item.judul}
                                            </h3>
                                            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar size={14} className="text-slate-400 dark:text-slate-500" /> 
                                                    {item.tanggal_formatted}
                                                </span>
                                                {item.user?.name && (
                                                    <span className="flex items-center gap-1.5">
                                                        <UserIcon size={14} className="text-slate-400 dark:text-slate-500" /> 
                                                        {item.user.name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ),
                            },
                            {
                                header: "Kategori",
                                className: "w-32",
                                headerClassName: "w-32",
                                render: (item: BeritaItem) => (
                                    <Badge type="info" className="text-[10px]">
                                        {item.kategori}
                                    </Badge>
                                ),
                            },
                            {
                                header: "Status",
                                className: "w-32",
                                headerClassName: "w-32",
                                render: (item: BeritaItem) => (
                                    <Badge type={getStatusBadgeType(item.status)}>
                                        {getStatusBadgeLabel(item.status)}
                                    </Badge>
                                ),
                            },
                            {
                                header: "Aksi",
                                headerClassName: "text-center w-28",
                                className: "text-center w-28",
                                render: (item: BeritaItem) => (
                                    <div className="flex items-center justify-center">
                                        <Link
                                            href={`/kecamatan/berita/${item.id}`}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 text-xs font-semibold hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors"
                                        >
                                            <Eye size={14} />
                                            Detail
                                        </Link>
                                    </div>
                                ),
                            },
                        ]}
                        data={beritas.data || []}
                        emptyMessage="Belum ada berita dari kecamatan ini."
                    />
                </div>

                {/* Pagination */}
                <div className="p-6 border-t border-slate-50 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/20 dark:bg-slate-700/20">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Menampilkan{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {beritas.from ?? 0}
                        </span>{" "}
                        sampai{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {beritas.to ?? 0}
                        </span>{" "}
                        dari{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {beritas.total ?? 0}
                        </span>{" "}
                        berita
                    </p>

                    <Pagination
                        links={beritas.links || []}
                    />
                </div>
            </Card>
        </AdminKecamatanLayout>
    );
}
