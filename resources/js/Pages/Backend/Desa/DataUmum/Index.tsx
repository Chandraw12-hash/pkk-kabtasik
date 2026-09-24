import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminDesaLayout from '@/Components/Layout/AdminDesaLayout';
import Card from '@/Components/UI/Card';
import TextInput from '@/Components/Form/TextInput';
import {
    FileText,
    Upload,
    Download,
    Search,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

interface DataItem {
    id: number;
    tahun: number;
    dusun: string | null;
    nama_dusun: string | null;
    level: string;
    jumlah_kk: number;
    jumlah_krt: number;
    jiwa_l: number;
    jiwa_p: number;
    jumlah_dasa_wisma: number;
}

interface PaginatedData {
    data: DataItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface DataUmumIndexProps {
    data: PaginatedData;
    stats: {
        total_data: number;
        total_kk: number;
        total_jiwa: number;
        total_dasa_wisma: number;
    };
    filters: {
        tahun?: string;
        level?: string;
        dusun?: string;
        search?: string;
    };
}

export default function Index({ data, stats, filters }: DataUmumIndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/desa/data-umum', { ...filters, search }, { preserveState: true });
    };

    return (
        <AdminDesaLayout>
            <Head title="Data Umum PKK" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">
                            Data Umum PKK
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Data Umum PKK Desa
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/desa/data-umum/import"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors"
                        >
                            <Upload size={16} />
                            <span>Import</span>
                        </Link>
                        <a
                            href="/desa/data-umum/template"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            <Download size={16} />
                            <span>Template</span>
                        </a>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Total Data" value={stats.total_data} color="teal" />
                    <StatCard label="Total KK" value={stats.total_kk} color="blue" />
                    <StatCard label="Total Jiwa" value={stats.total_jiwa} color="purple" />
                    <StatCard label="Dasa Wisma" value={stats.total_dasa_wisma} color="pink" />
                </div>

                {/* Search */}
                <Card className="p-4 dark:bg-slate-800 dark:border-slate-700">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <TextInput
                                iconLeft={<Search size={18} />}
                                placeholder="Cari nama dusun..."
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                containerClassName="relative w-full"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors"
                        >
                            Cari
                        </button>
                    </form>
                </Card>

                {/* Table */}
                <Card className="dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Menampilkan{' '}
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                                {data.from || 0}-{data.to || 0}
                            </span>{' '}
                            dari <span className="font-semibold">{data.total}</span> data
                        </p>
                    </div>

                    {data.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-700/50">
                                    <tr className="text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        <th className="px-4 py-3">No</th>
                                        <th className="px-4 py-3">Tahun</th>
                                        <th className="px-4 py-3">Dusun</th>
                                        <th className="px-4 py-3">Level</th>
                                        <th className="px-4 py-3 text-right">KRT</th>
                                        <th className="px-4 py-3 text-right">KK</th>
                                        <th className="px-4 py-3 text-right">L</th>
                                        <th className="px-4 py-3 text-right">P</th>
                                        <th className="px-4 py-3 text-right">Dasa Wisma</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {data.data.map((item, idx) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                        >
                                            <td className="px-4 py-3 text-slate-500">
                                                {(data.from || 0) + idx}
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                                                {item.tahun}
                                            </td>
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                {item.nama_dusun || item.dusun || '-'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-400 uppercase">
                                                    {item.level || '-'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">
                                                {item.jumlah_krt?.toLocaleString('id-ID') || 0}
                                            </td>
                                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">
                                                {item.jumlah_kk?.toLocaleString('id-ID') || 0}
                                            </td>
                                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">
                                                {item.jiwa_l?.toLocaleString('id-ID') || 0}
                                            </td>
                                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">
                                                {item.jiwa_p?.toLocaleString('id-ID') || 0}
                                            </td>
                                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">
                                                {item.jumlah_dasa_wisma?.toLocaleString('id-ID') || 0}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-16 text-center">
                            <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                            </div>
                            <p className="text-base font-semibold text-slate-600 dark:text-slate-400">
                                Belum Ada Data
                            </p>
                            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                                Import data dari file Excel untuk memulai
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {data.last_page > 1 && (
                        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Halaman {data.current_page} dari {data.last_page}
                            </p>
                            <div className="flex items-center gap-1">
                                {data.links?.map((link, idx) => {
                                    if (link.label === '&laquo; Previous') {
                                        return (
                                            <Link
                                                key={idx}
                                                href={link.url || '#'}
                                                className={`p-2 rounded-lg text-xs font-semibold transition-colors ${
                                                    link.url
                                                        ? 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'
                                                        : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                                                }`}
                                                preserveState
                                            >
                                                <ChevronLeft size={16} />
                                            </Link>
                                        );
                                    }
                                    if (link.label === 'Next &raquo;') {
                                        return (
                                            <Link
                                                key={idx}
                                                href={link.url || '#'}
                                                className={`p-2 rounded-lg text-xs font-semibold transition-colors ${
                                                    link.url
                                                        ? 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'
                                                        : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                                                }`}
                                                preserveState
                                            >
                                                <ChevronRight size={16} />
                                            </Link>
                                        );
                                    }
                                    return (
                                        <Link
                                            key={idx}
                                            href={link.url || '#'}
                                            className={`min-w-[32px] h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                                                link.active
                                                    ? 'bg-teal-600 text-white'
                                                    : link.url
                                                    ? 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'
                                                    : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                                            }`}
                                            preserveState
                                        >
                                            {link.label.replace(/&laquo;|&raquo;/g, '').trim()}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </AdminDesaLayout>
    );
}

function StatCard({
    label,
    value,
    color,
}: {
    label: string;
    value: number;
    color: 'teal' | 'blue' | 'purple' | 'pink';
}) {
    const colorClasses = {
        teal: 'text-teal-600 dark:text-teal-400',
        blue: 'text-blue-600 dark:text-blue-400',
        purple: 'text-purple-600 dark:text-purple-400',
        pink: 'text-pink-600 dark:text-pink-400',
    };
    return (
        <Card className="p-5 dark:bg-slate-800 dark:border-slate-700">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
            <p className={`text-2xl font-bold mt-1.5 ${colorClasses[color]}`}>
                {value.toLocaleString('id-ID')}
            </p>
        </Card>
    );
}
