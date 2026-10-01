import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminKecamatanLayout from '@/Components/Layout/AdminKecamatanLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import TextInput from '@/Components/Form/TextInput';
import {
    BarChart3,
    Search,
    ChevronRight,
    Building2,
    Users,
    Home,
    Baby,
    Download,
} from 'lucide-react';

interface IndexProps {
    kecamatan: string;
    data: any;
    stats: any;
    filters: any;
}

export default function Index({ kecamatan, data, stats, filters }: IndexProps) {
    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/kecamatan/data-pkk/kegiatan', { ...filters, search }, { preserveState: true });
    };

    return (
        <AdminKecamatanLayout>
            <Head title={`Rekap Kegiatan - ${kecamatan}`} />

            <div className="space-y-6">
                {/* ─── HEADER ─── */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-400">
                                Sistem Informasi TP PKK
                            </span>
                            <span className="text-slate-300 dark:text-slate-600">•</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                Kecamatan {kecamatan}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                            Rekap Kegiatan Warga
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            Rekap per desa — Kecamatan{' '}
                            <span className="font-semibold text-teal-600 dark:text-teal-400">
                                {kecamatan}
                            </span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="primary"
                            href="/kecamatan/data-pkk/export/kegiatan"
                            target="_blank"
                            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-100 dark:shadow-none"
                        >
                            <Download size={16} />
                            <span>Export Excel</span>
                        </Button>
                    </div>
                </div>

                {/* ─── STAT CARDS ─── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        icon={Building2}
                        label="Total Desa"
                        value={stats.total_desa || 0}
                        color="blue"
                        subtitle="Desa/Kelurahan"
                    />
                    <StatCard
                        icon={Users}
                        label="Total KK"
                        value={stats.total_kk || 0}
                        color="teal"
                        subtitle="Kepala Keluarga"
                    />
                    <StatCard
                        icon={Users}
                        label="Total Jiwa"
                        value={stats.total_jiwa || 0}
                        color="purple"
                        subtitle="Jumlah Jiwa"
                    />
                    <StatCard
                        icon={Home}
                        label="Dasa Wisma"
                        value={stats.total_dasa_wisma || 0}
                        color="pink"
                        subtitle="Kelompok PKK"
                    />
                </div>

                {/* ─── SEARCH ─── */}
                <Card className="p-4 dark:bg-slate-800 dark:border-slate-700">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <TextInput
                                iconLeft={<Search size={18} />}
                                placeholder="Cari nama desa..."
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

                {/* ─── TABLE ─── */}
                <Card className="dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Menampilkan{' '}
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                                {data.data?.length || 0}
                            </span>{' '}
                            dari {data.total || 0} desa
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                            <BarChart3 className="w-3.5 h-3.5" />
                            Data kegiatan warga
                        </p>
                    </div>

                    {data.data && data.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-700/50">
                                    <tr className="text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        <th className="px-4 py-3">No</th>
                                        <th className="px-4 py-3">Desa</th>
                                        <th className="px-4 py-3 text-right">KK</th>
                                        <th className="px-4 py-3 text-right">L</th>
                                        <th className="px-4 py-3 text-right">P</th>
                                        <th className="px-4 py-3 text-right">Ibu Hamil</th>
                                        <th className="px-4 py-3 text-right">Lansia</th>
                                        <th className="px-4 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {data.data.map((item: any, idx: number) => (
                                        <tr key={item.desa} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="px-4 py-3 text-slate-500">{idx + 1}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                                                        {item.nama_desa || item.desa}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">{Number(item.jumlah_kk || 0).toLocaleString('id-ID')}</td>
                                            <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">{Number(item.total_l || 0).toLocaleString('id-ID')}</td>
                                            <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">{Number(item.total_p || 0).toLocaleString('id-ID')}</td>
                                            <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">{Number(item.ibu_hamil || 0).toLocaleString('id-ID')}</td>
                                            <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">{Number(item.lansia || 0).toLocaleString('id-ID')}</td>
                                            <td className="px-4 py-3 text-right">
                                                <Link
                                                    href={`/kecamatan/data-pkk/kegiatan/${item.desa}`}
                                                    className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400 text-xs font-semibold hover:underline"
                                                >
                                                    Detail
                                                    <ChevronRight className="w-3 h-3" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-16 text-center">
                            <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                                <BarChart3 className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                            </div>
                            <p className="text-base font-semibold text-slate-600 dark:text-slate-400">
                                Belum Ada Data
                            </p>
                            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                                Belum ada data kegiatan warga yang tercatat
                            </p>
                        </div>
                    )}
                </Card>
            </div>
        </AdminKecamatanLayout>
    );
}

// ============================================================
// SUB-COMPONENT: StatCard
// ============================================================
function StatCard({
    icon: Icon,
    label,
    value,
    color,
    subtitle,
}: {
    icon: any;
    label: string;
    value: number;
    color: 'teal' | 'blue' | 'purple' | 'pink';
    subtitle?: string;
}) {
    const colorClasses = {
        teal: {
            bg: 'bg-teal-50 dark:bg-teal-950',
            icon: 'text-teal-600 dark:text-teal-400',
            subtitle: 'text-teal-600 dark:text-teal-400',
        },
        blue: {
            bg: 'bg-blue-50 dark:bg-blue-950',
            icon: 'text-blue-600 dark:text-blue-400',
            subtitle: 'text-blue-600 dark:text-blue-400',
        },
        purple: {
            bg: 'bg-purple-50 dark:bg-purple-950',
            icon: 'text-purple-600 dark:text-purple-400',
            subtitle: 'text-purple-600 dark:text-purple-400',
        },
        pink: {
            bg: 'bg-pink-50 dark:bg-pink-950',
            icon: 'text-pink-600 dark:text-pink-400',
            subtitle: 'text-pink-600 dark:text-pink-400',
        },
    };

    const c = colorClasses[color];

    return (
        <Card className="p-5 dark:bg-slate-800 dark:border-slate-700">
            <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                        {label}
                    </p>
                    <p className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1.5">
                        {Number(value).toLocaleString('id-ID')}
                    </p>
                    {subtitle && (
                        <p className={`text-xs font-medium mt-1 ${c.subtitle}`}>
                            {subtitle}
                        </p>
                    )}
                </div>
                <div
                    className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl ${c.bg} flex items-center justify-center shrink-0 ml-2`}
                >
                    <Icon className={`w-5 h-5 lg:w-6 lg:h-6 ${c.icon}`} />
                </div>
            </div>
        </Card>
    );
}
