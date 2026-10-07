import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminDesaLayout from '@/Components/Layout/AdminDesaLayout';
import Card from '@/Components/UI/Card';
import { Baby, Upload, Download, RefreshCw } from 'lucide-react';
import TabRT from './TabRT';
import TabRW from './TabRW';
import TabDusun from './TabDusun';
import TabDesa from './TabDesa';
import TabIbu from './TabIbu';

interface BumilIndexProps {
    data: any;
    stats: any;
    activeLevel: string;
    filters: any;
    flash?: {
        success?: string | null;
        error?: string | null;
    };
}

export default function Index({ data, stats, activeLevel, filters, flash }: BumilIndexProps) {
    const levels = [
        { key: 'rt', label: 'RT', component: TabRT },
        { key: 'rw', label: 'RW', component: TabRW },
        { key: 'dusun', label: 'Dusun', component: TabDusun },
        { key: 'desa', label: 'Desa', component: TabDesa },
        { key: 'ibu', label: 'Data Ibu', component: TabIbu },
    ];

    const activeTab = levels.find((l) => l.key === activeLevel) || levels[0];
    const ActiveComponent = activeTab.component;

    const tahunAktif = filters.tahun || new Date().getFullYear();

    const generateOtomatis = () => {
        if (
            !window.confirm(
                `Buat rekap bumil ${tahunAktif} otomatis dari catatan ibu yang sudah disetujui? Baris yang sudah disetujui tidak akan diubah.`
            )
        ) {
            return;
        }
        router.post('/desa/bumil/generate-rekap', {
            tahun: tahunAktif,
            bulan: filters.bulan || undefined,
        });
    };

    const statusHref = (status: string) =>
        `/desa/bumil?level=${activeLevel}&status=${status}&tahun=${tahunAktif}` +
        (filters.bulan ? `&bulan=${filters.bulan}` : '');

    return (
        <AdminDesaLayout>
            <Head title="Rekap Bumil" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">
                            Rekap Ibu Hamil & Bayi
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Data bumil, melahirkan, nifas, dan kelahiran bayi
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
                            href="/desa/bumil/import"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold transition-colors"
                        >
                            <Upload size={16} />
                            <span>Import</span>
                        </Link>
                        <a
                            href="/desa/bumil/template"
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

                {/* Tab Level */}
                <Card className="dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
                    <div className="border-b border-slate-100 dark:border-slate-700 px-2 sm:px-6 flex items-center gap-1 overflow-x-auto bg-slate-50/50 dark:bg-slate-800/50">
                        {levels.map((lvl) => (
                            <Link
                                key={lvl.key}
                                href={`/desa/bumil?level=${lvl.key}`}
                                className={`px-4 py-4 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
                                    activeLevel === lvl.key
                                        ? 'text-pink-600 dark:text-pink-400 border-pink-600 dark:border-pink-400'
                                        : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <Baby className="w-4 h-4" />
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
                        <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 mb-6">
                            <StatCard label="Ibu Hamil" value={stats.total_ibu_hamil || 0} color="pink" />
                            <StatCard label="Melahirkan" value={stats.total_ibu_melahirkan || 0} color="blue" />
                            <StatCard label="Bayi Lahir" value={stats.total_bayi_lahir || 0} color="purple" />
                            <StatCard label="Ibu Meninggal" value={stats.total_ibu_meninggal || 0} color="red" />
                            <StatCard label="Menunggu" value={stats.pending || 0} color="amber" />
                            <StatCard label="Disetujui" value={stats.approved || 0} color="emerald" />
                        </div>

                        {/* Filter Status — level RT & Data Ibu */}
                        {(activeLevel === 'rt' || activeLevel === 'ibu') && (
                            <div className="mb-4 flex flex-wrap gap-2">
                                {[
                                    ['pending', 'Menunggu'],
                                    ['approved', 'Disetujui'],
                                    ['rejected', 'Perlu Diperbaiki'],
                                    ['all', 'Semua'],
                                ].map(([value, label]) => (
                                    <Link
                                        key={value}
                                        href={statusHref(value)}
                                        preserveScroll
                                        className={`rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
                                            filters.status === value
                                                ? 'bg-pink-700 text-white'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                                        }`}
                                    >
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Tab Content — komponen per level */}
                        <ActiveComponent data={data?.data || []} />
                    </div>
                </Card>
            </div>
        </AdminDesaLayout>
    );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
    const colorClasses: Record<string, string> = {
        pink: 'text-pink-600 dark:text-pink-400',
        blue: 'text-blue-600 dark:text-blue-400',
        purple: 'text-purple-600 dark:text-purple-400',
        red: 'text-red-600 dark:text-red-400',
        amber: 'text-amber-600 dark:text-amber-400',
        emerald: 'text-emerald-600 dark:text-emerald-400',
    };
    return (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
            <p className={`text-xl font-bold mt-1 ${colorClasses[color]}`}>{value.toLocaleString('id-ID')}</p>
        </div>
    );
}
