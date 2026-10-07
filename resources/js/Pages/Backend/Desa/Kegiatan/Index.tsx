import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminDesaLayout from '@/Components/Layout/AdminDesaLayout';
import Card from '@/Components/UI/Card';
import { Users, Upload, Download, RefreshCw } from 'lucide-react';
import TabRT from './TabRT';
import TabRW from './TabRW';
import TabDusun from './TabDusun';
import TabDesa from './TabDesa';

type StatsType = {
    total_kk: number;
    total_jiwa: number;
    total_dasa_wisma: number;
    per_level: Record<string, number>;
    pending: number;
    approved: number;
    rejected: number;
};

type FiltersType = {
    tahun: number;
    dusun: string | null;
    search: string | null;
    status: string;
};

interface KegiatanIndexProps {
    data: {
        data: unknown[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ label: string; url: string | null; active: boolean }>;
    };
    stats: StatsType;
    activeLevel: string;
    filters: FiltersType;
    flash?: {
        success?: string | null;
        error?: string | null;
        warning?: string | null;
    };
}

export default function Index({
    data,
    stats,
    activeLevel,
    filters,
    flash,
}: KegiatanIndexProps) {
    const levels = [
        { key: 'rt', label: 'RT', component: TabRT },
        { key: 'rw', label: 'RW', component: TabRW },
        { key: 'dusun', label: 'Dusun', component: TabDusun },
        { key: 'desa', label: 'Desa', component: TabDesa },
    ];

    const activeTab = levels.find((l) => l.key === activeLevel) || levels[0];
    const ActiveComponent = activeTab.component;

    const generateOtomatis = () => {
        if (
            !window.confirm(
                `Buat rekap ${filters.tahun} otomatis dari data yang sudah disetujui? Baris yang sudah disetujui tidak akan diubah.`
            )
        ) {
            return;
        }
        router.post('/desa/kegiatan/generate-rekap', {
            tahun: filters.tahun,
        });
    };

    return (
        <AdminDesaLayout>
            <Head title="Rekap Kegiatan Warga" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">
                            Rekap Kegiatan Warga
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Data diinput per RT. Level RW, Dusun, dan Desa dihitung
                            otomatis dari data yang <strong>sudah disetujui</strong>.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={generateOtomatis}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
                        >
                            <RefreshCw size={16} />
                            <span>Generate Otomatis</span>
                        </button>
                        <Link
                            href="/desa/kegiatan/import"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors"
                        >
                            <Upload size={16} />
                            <span>Import</span>
                        </Link>
                        <a
                            href="/desa/kegiatan/template"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            <Download size={16} />
                            <span>Template</span>
                        </a>
                    </div>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div
                        role="status"
                        className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
                    >
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div
                        role="alert"
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                    >
                        {flash.error}
                    </div>
                )}
                {flash?.warning && (
                    <div
                        role="alert"
                        className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
                    >
                        {flash.warning}
                    </div>
                )}

                {/* Tab Level */}
                <Card className="dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
                    <div className="border-b border-slate-100 dark:border-slate-700 px-2 sm:px-6 flex items-center gap-1 overflow-x-auto bg-slate-50/50 dark:bg-slate-800/50">
                        {levels.map((lvl) => (
                            <Link
                                key={lvl.key}
                                href={`/desa/kegiatan?level=${lvl.key}&status=${filters.status}&tahun=${filters.tahun}`}
                                className={`px-4 py-4 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
                                    activeTab.key === lvl.key
                                        ? 'text-teal-600 dark:text-teal-400 border-teal-600 dark:border-teal-400'
                                        : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    Level {lvl.label}
                                    <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-700">
                                        {stats.per_level?.[lvl.key] || 0}
                                    </span>
                                </span>
                            </Link>
                        ))}
                    </div>

                    <div className="p-6">
                        {/* Stat Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
                            <StatCard label="Total KK" value={stats.total_kk || 0} />
                            <StatCard label="Total Jiwa" value={stats.total_jiwa || 0} />
                            <StatCard
                                label="Dasa Wisma"
                                value={stats.total_dasa_wisma || 0}
                            />
                            <StatCard
                                label="Menunggu"
                                value={stats.pending || 0}
                                accent="amber"
                            />
                            <StatCard
                                label="Disetujui"
                                value={stats.approved || 0}
                                accent="emerald"
                            />
                        </div>

                        {/* Filter Status — hanya di level RT */}
                        {activeLevel === 'rt' && (
                            <div className="mb-4 flex flex-wrap gap-2">
                                {[
                                    ['pending', 'Menunggu'],
                                    ['approved', 'Disetujui'],
                                    ['rejected', 'Perlu Diperbaiki'],
                                    ['all', 'Semua'],
                                ].map(([value, label]) => (
                                    <Link
                                        key={value}
                                        href={`/desa/kegiatan?level=rt&status=${value}&tahun=${filters.tahun}`}
                                        preserveScroll
                                        className={`rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
                                            filters.status === value
                                                ? 'bg-teal-700 text-white'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                                        }`}
                                    >
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Tab Content */}
                        <ActiveComponent
                            data={data?.data || []}
                            pagination={data}
                            level={activeLevel}
                        />
                    </div>
                </Card>
            </div>
        </AdminDesaLayout>
    );
}

function StatCard({
    label,
    value,
    accent,
}: {
    label: string;
    value: number;
    accent?: 'amber' | 'emerald' | 'red';
}) {
    const styles = {
        amber:
            'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900',
        emerald:
            'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900',
        red: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900',
    };

    const textStyles = {
        amber: 'text-amber-700 dark:text-amber-300',
        emerald: 'text-emerald-700 dark:text-emerald-300',
        red: 'text-red-700 dark:text-red-300',
    };

    return (
        <div
            className={`p-4 rounded-xl border ${
                accent
                    ? styles[accent]
                    : 'bg-slate-50 dark:bg-slate-700/50 border-transparent'
            }`}
        >
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {label}
            </p>
            <p
                className={`text-xl font-bold mt-1 ${
                    accent
                        ? textStyles[accent]
                        : 'text-slate-900 dark:text-slate-100'
                }`}
            >
                {Number(value).toLocaleString('id-ID')}
            </p>
        </div>
    );
}
