import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminKecamatanLayout from '@/Components/Layout/AdminKecamatanLayout';
import Card from '@/Components/UI/Card';
import { ArrowLeft, Baby, Heart, Users, BarChart3, Check, X } from 'lucide-react';

interface ShowProps {
    kecamatan: string;
    desa: string;
    nama_desa: string;
    data: any;
    stats: any;
    filters: any;
    flash?: {
        success?: string | null;
        error?: string | null;
    };
}

const kecStatusStyle: Record<string, string> = {
    pending:
        'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
    approved:
        'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

const kecStatusLabel: Record<string, string> = {
    pending: 'Menunggu',
    approved: 'Disetujui',
    rejected: 'Perlu Diperbaiki',
};

export default function Show({ kecamatan, desa, nama_desa, data, stats, flash }: ShowProps) {
    const approve = (id: number) => {
        if (!window.confirm('Setujui baris rekap ini untuk kecamatan?')) return;
        router.post(`/kecamatan/data-pkk/bumil/${id}/approve`);
    };

    const reject = (id: number) => {
        const reason = window.prompt('Alasan penolakan:');
        if (reason === null || reason.trim() === '') return;
        router.post(`/kecamatan/data-pkk/bumil/${id}/reject`, { reason });
    };
    return (
        <AdminKecamatanLayout>
            <Head title={`Detail Bumil ${nama_desa} - ${kecamatan}`} />

            <div className="space-y-6">
                {/* ─── BACK BUTTON ─── */}
                <Link
                    href="/kecamatan/data-pkk/bumil"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Rekap Bumil
                </Link>

                {/* ─── HEADER ─── */}
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
                        Detail Rekap Bumil
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        Desa{' '}
                        <span className="font-semibold text-teal-600 dark:text-teal-400">
                            {nama_desa}
                        </span>{' '}
                        — Kecamatan {kecamatan}
                    </p>
                </div>

                {/* ─── STAT CARDS ─── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        icon={BarChart3}
                        label="Total Data"
                        value={stats.total_data || 0}
                        color="blue"
                        subtitle="Semua rekaman"
                    />
                    <StatCard
                        icon={Heart}
                        label="Ibu Hamil"
                        value={stats.total_ibu_hamil || 0}
                        color="pink"
                        subtitle="Sedang hamil"
                    />
                    <StatCard
                        icon={Users}
                        label="Melahirkan"
                        value={stats.total_ibu_melahirkan || 0}
                        color="teal"
                        subtitle="Ibu melahirkan"
                    />
                    <StatCard
                        icon={Baby}
                        label="Bayi Lahir"
                        value={stats.total_bayi_lahir || 0}
                        color="purple"
                        subtitle="Total bayi lahir"
                    />
                </div>

                {/* ─── TABLE ─── */}
                <Card className="dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Data per bulan — hanya baris yang sudah disetujui desa
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                            <BarChart3 className="w-3.5 h-3.5" />
                            {data.data?.length || 0} rekaman
                        </p>
                    </div>

                    {flash?.success && (
                        <div
                            role="status"
                            className="mx-4 mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
                        >
                            {flash.success}
                        </div>
                    )}

                    {data.data && data.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-700/50">
                                    <tr className="text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        <th className="px-4 py-3">No</th>
                                        <th className="px-4 py-3">Bulan</th>
                                        <th className="px-4 py-3">Dusun</th>
                                        <th className="px-4 py-3 text-right">Hamil</th>
                                        <th className="px-4 py-3 text-right">Melahirkan</th>
                                        <th className="px-4 py-3 text-right">Nifas</th>
                                        <th className="px-4 py-3 text-right">Bayi L</th>
                                        <th className="px-4 py-3 text-right">Bayi P</th>
                                        <th className="px-4 py-3">Status Kec.</th>
                                        <th className="px-4 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {data.data.map((item: any, idx: number) => (
                                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="px-4 py-3 text-slate-500">{idx + 1}</td>
                                            <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                                                {item.nama_bulan || item.bulan || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{item.nama_dusun || '-'}</td>
                                            <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">{Number(item.ibu_hamil || 0).toLocaleString('id-ID')}</td>
                                            <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">{Number(item.ibu_melahirkan || 0).toLocaleString('id-ID')}</td>
                                            <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">{Number(item.ibu_nifas || 0).toLocaleString('id-ID')}</td>
                                            <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">{Number(item.bayi_lahir_l || 0).toLocaleString('id-ID')}</td>
                                            <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">{Number(item.bayi_lahir_p || 0).toLocaleString('id-ID')}</td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ${
                                                        kecStatusStyle[item.kecamatan_status] ||
                                                        kecStatusStyle.pending
                                                    }`}
                                                >
                                                    {kecStatusLabel[item.kecamatan_status] ||
                                                        item.kecamatan_status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {item.kecamatan_status === 'pending' ? (
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => approve(item.id)}
                                                            title="Setujui"
                                                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => reject(item.id)}
                                                            title="Tolak"
                                                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-16 text-center">
                            <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                                <Baby className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                            </div>
                            <p className="text-base font-semibold text-slate-600 dark:text-slate-400">
                                Belum Ada Data
                            </p>
                            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                                Data muncul setelah Admin Desa menyetujui rekap desa ini
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
