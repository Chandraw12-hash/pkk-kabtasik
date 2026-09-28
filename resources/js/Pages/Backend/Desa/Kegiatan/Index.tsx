import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminDesaLayout from '@/Components/Layout/AdminDesaLayout';
import Card from '@/Components/UI/Card';
import { Users, Upload, Download } from 'lucide-react';
import TabRW from './TabRW';
import TabDusun from './TabDusun';
import TabDesa from './TabDesa';

interface KegiatanIndexProps {
    data: any;
    stats: any;
    activeLevel: string;
    filters: any;
}

export default function Index({ data, stats, activeLevel, filters }: KegiatanIndexProps) {
    // Input per RW. Level Dusun dan Desa dihitung otomatis oleh sistem.
    const levels = [
        { key: 'rw', label: 'RW', component: TabRW },
        { key: 'dusun', label: 'Dusun', component: TabDusun },
        { key: 'desa', label: 'Desa', component: TabDesa },
    ];

    const activeTab = levels.find((l) => l.key === activeLevel) || levels[0];
    const ActiveComponent = activeTab.component;

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
                            Data diinput per RW, Dusun dan Desa dihitung otomatis
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
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

                {/* Tab Level */}
                <Card className="dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
                    <div className="border-b border-slate-100 dark:border-slate-700 px-2 sm:px-6 flex items-center gap-1 overflow-x-auto bg-slate-50/50 dark:bg-slate-800/50">
                        {levels.map((lvl) => (
                            <Link
                                key={lvl.key}
                                href={`/desa/kegiatan?level=${lvl.key}`}
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
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                            <StatCard label="Total KK" value={stats.total_kk || 0} />
                            <StatCard label="Total Jiwa" value={stats.total_jiwa || 0} />
                            <StatCard label="Dasa Wisma" value={stats.total_dasa_wisma || 0} />
                        </div>

                        {/* Tab Content */}
                        <ActiveComponent data={data?.data || []} />
                    </div>
                </Card>
            </div>
        </AdminDesaLayout>
    );
}

function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                {Number(value).toLocaleString('id-ID')}
            </p>
        </div>
    );
}
