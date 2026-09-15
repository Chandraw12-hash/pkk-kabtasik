import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminKecamatanLayout from '../../../../Components/Layout/AdminKecamatanLayout';
import {
    Newspaper,
    Search,
    Eye,
    Calendar,
    User as UserIcon,
    Filter,
    FileText,
    CheckCircle2,
    Clock,
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
    const [search, setSearch] = React.useState(filters.search || '');
    const [status, setStatus] = React.useState(filters.status || '');

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/kecamatan/berita', { search, status }, { preserveState: true });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 size={12} /> Disetujui
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock size={12} /> Menunggu
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200">
                        <XCircle size={12} /> Ditolak
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-50 text-slate-600 border border-slate-200">
                        <FileText size={12} /> Draft
                    </span>
                );
        }
    };

    return (
        <AdminKecamatanLayout>
            <Head title={`Berita Kecamatan ${kecamatan}`} />

            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                        <Newspaper size={20} className="text-teal-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">
                            Berita Kecamatan {kecamatan}
                        </h1>
                        <p className="text-sm text-slate-500">
                            Monitoring berita dari kader di wilayah kecamatan Anda
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <p className="text-[10px] font-semibold text-amber-500 uppercase tracking-wider">Menunggu</p>
                    <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <p className="text-[10px] font-semibold text-emerald-500 uppercase tracking-wider">Disetujui</p>
                    <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.approved}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <p className="text-[10px] font-semibold text-rose-500 uppercase tracking-wider">Ditolak</p>
                    <p className="text-2xl font-bold text-rose-600 mt-1">{stats.rejected}</p>
                </div>
            </div>

            {/* Filter */}
            <form onSubmit={handleFilter} className="bg-white border border-slate-200 rounded-xl p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari judul berita..."
                            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                        <option value="">Semua Status</option>
                        <option value="pending">Menunggu</option>
                        <option value="approved">Disetujui</option>
                        <option value="rejected">Ditolak</option>
                        <option value="draft">Draft</option>
                    </select>
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                        <Filter size={16} /> Filter
                    </button>
                </div>
            </form>

            {/* List Berita */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                {beritas.data.length === 0 ? (
                    <div className="p-12 text-center">
                        <Newspaper size={40} className="text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 text-sm">Belum ada berita dari kecamatan ini.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {beritas.data.map((item) => (
                            <div key={item.id} className="p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                                {/* Thumbnail */}
                                <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-slate-100">
                                    {item.foto_url ? (
                                        <img src={item.foto_url} alt={item.judul} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Newspaper size={24} className="text-slate-300" />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        {getStatusBadge(item.status)}
                                        <span className="text-[10px] font-semibold text-teal-600 uppercase tracking-wider">
                                            {item.kategori}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-slate-800 text-sm line-clamp-2 mb-1">
                                        {item.judul}
                                    </h3>
                                    <div className="flex items-center gap-4 text-xs text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} /> {item.tanggal_formatted}
                                        </span>
                                        {item.user?.name && (
                                            <span className="flex items-center gap-1">
                                                <UserIcon size={12} /> {item.user.name}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Action */}
                                <Link
                                    href={`/kecamatan/berita/${item.id}`}
                                    className="shrink-0 p-2 rounded-lg hover:bg-teal-50 text-slate-400 hover:text-teal-600 transition-colors"
                                    aria-label="Lihat detail"
                                >
                                    <Eye size={18} />
                                </Link>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {beritas.last_page > 1 && (
                    <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-center gap-1">
                        {beritas.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                                    link.active
                                        ? 'bg-teal-600 text-white font-semibold'
                                        : link.url
                                        ? 'text-slate-600 hover:bg-slate-100'
                                        : 'text-slate-300 pointer-events-none'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminKecamatanLayout>
    );
}
