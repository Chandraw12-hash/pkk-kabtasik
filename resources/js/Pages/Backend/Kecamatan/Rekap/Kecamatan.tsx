import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminKecamatanLayout from '@/Components/Layout/AdminKecamatanLayout';
import {
    BarChart3,
    TrendingUp,
    Building2,
    Home,
    FileText,
    Download,
    Printer,
    ArrowUpRight,
    PieChart,
} from 'lucide-react';

interface RekapKecamatan {
    kecamatan: string;
    jumlah_laporan: number;
    jumlah_desa: number;
    jumlah_dasa_wisma: number;
}

interface RekapPokjaItem {
    kategori_pokja: string;
    jumlah: number;
}

interface RekapKecamatanProps {
    kecamatan: string;
    rekap: RekapKecamatan | null;           // ✅ BOLEH NULL
    rekapPokja: RekapPokjaItem[] | null;    // ✅ BOLEH NULL
}

export default function RekapKecamatan({
    kecamatan,
    rekap,
    rekapPokja,
}: RekapKecamatanProps) {
    const [activeTab, setActiveTab] = useState<'ringkasan' | 'pokja'>('ringkasan');

    // ✅ FALLBACK: kalau rekap null, pakai default object
    const safeRekap: RekapKecamatan = rekap ?? {
        kecamatan: kecamatan || '-',
        jumlah_laporan: 0,
        jumlah_desa: 0,
        jumlah_dasa_wisma: 0,
    };

    // ✅ FALLBACK: kalau rekapPokja null, pakai array kosong
    const safeRekapPokja: RekapPokjaItem[] = rekapPokja ?? [];

    const totalPokja = safeRekapPokja.reduce((sum, item) => sum + item.jumlah, 0);

    const pokjaConfig: Record<string, { label: string; color: string; bg: string }> = {
        I: {
            label: 'Pokja I - Penghayatan & Pengamalan Pancasila',
            color: 'text-teal-700 dark:text-teal-400',
            bg: 'bg-teal-500',
        },
        II: {
            label: 'Pokja II - Pendidikan & Keterampilan',
            color: 'text-blue-700 dark:text-blue-400',
            bg: 'bg-blue-500',
        },
        III: {
            label: 'Pokja III - Pangan, Sandang, Perumahan',
            color: 'text-purple-700 dark:text-purple-400',
            bg: 'bg-purple-500',
        },
        IV: {
            label: 'Pokja IV - Kesehatan & Lingkungan',
            color: 'text-pink-700 dark:text-pink-400',
            bg: 'bg-pink-500',
        },
    };

    return (
        <AdminKecamatanLayout>
            <Head title={`Rekap Kecamatan ${kecamatan}`} />

            <div className="space-y-6">
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">
                            Rekap Kecamatan
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Rekapitulasi data laporan di Kecamatan{' '}
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
                            Export Excel
                        </a>
                        <a
                            href="/kecamatan/print/kecamatan"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            <Printer className="w-4 h-4" />
                            Print
                        </a>
                    </div>
                </div>

                {/* STAT CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard
                        icon={FileText}
                        label="Total Laporan"
                        value={safeRekap.jumlah_laporan}
                        color="teal"
                        subtitle="Laporan terdaftar"
                    />
                    <StatCard
                        icon={Building2}
                        label="Jumlah Desa"
                        value={safeRekap.jumlah_desa}
                        color="blue"
                        subtitle="Desa/Kelurahan"
                    />
                    <StatCard
                        icon={Home}
                        label="Jumlah Dasa Wisma"
                        value={safeRekap.jumlah_dasa_wisma}
                        color="purple"
                        subtitle="Kelompok dasa wisma"
                    />
                </div>

                {/* TABS */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="border-b border-slate-200 dark:border-slate-800 px-2 sm:px-6 flex items-center gap-1 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('ringkasan')}
                            className={`px-4 py-4 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
                                activeTab === 'ringkasan'
                                    ? 'text-teal-600 dark:text-teal-400 border-teal-600 dark:border-teal-400'
                                    : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                        >
                            <span className="flex items-center gap-2">
                                <PieChart className="w-4 h-4" />
                                Ringkasan
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('pokja')}
                            className={`px-4 py-4 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
                                activeTab === 'pokja'
                                    ? 'text-teal-600 dark:text-teal-400 border-teal-600 dark:border-teal-400'
                                    : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                        >
                            <span className="flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" />
                                Per Pokja
                            </span>
                        </button>
                    </div>

                    <div className="p-6">
                        {activeTab === 'ringkasan' && (
                            <div className="space-y-6">
                                <div className="p-5 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/50 dark:to-cyan-950/50 border border-teal-100 dark:border-teal-900">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900 flex items-center justify-center shrink-0">
                                            <TrendingUp className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-slate-100">
                                                Ringkasan Kecamatan {kecamatan}
                                            </h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                Terdapat{' '}
                                                <span className="font-semibold text-teal-600 dark:text-teal-400">
                                                    {safeRekap.jumlah_laporan} laporan
                                                </span>{' '}
                                                dari{' '}
                                                <span className="font-semibold text-blue-600 dark:text-blue-400">
                                                    {safeRekap.jumlah_desa} desa
                                                </span>{' '}
                                                dan{' '}
                                                <span className="font-semibold text-purple-600 dark:text-purple-400">
                                                    {safeRekap.jumlah_dasa_wisma} dasa wisma
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                Total Laporan
                                            </p>
                                        </div>
                                        <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                                            {safeRekap.jumlah_laporan}
                                        </p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                            Laporan terdaftar
                                        </p>
                                    </div>
                                    <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                Total Desa
                                            </p>
                                        </div>
                                        <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                                            {safeRekap.jumlah_desa}
                                        </p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                            Desa/Kelurahan
                                        </p>
                                    </div>
                                    <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Home className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                Total Dasa Wisma
                                            </p>
                                        </div>
                                        <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                                            {safeRekap.jumlah_dasa_wisma}
                                        </p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                            Kelompok dasa wisma
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'pokja' && (
                            <div className="space-y-4">
                                <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            Distribusi Laporan Per Pokja
                                        </p>
                                        <p className="text-sm font-bold text-teal-600 dark:text-teal-400">
                                            {totalPokja} total
                                        </p>
                                    </div>

                                    <div className="flex h-3 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                                        {safeRekapPokja.map((item) => {
                                            const percentage =
                                                totalPokja > 0
                                                    ? (item.jumlah / totalPokja) * 100
                                                    : 0;
                                            const config = pokjaConfig[item.kategori_pokja];
                                            if (!config || percentage === 0) return null;
                                            return (
                                                <div
                                                    key={item.kategori_pokja}
                                                    className={`${config.bg} transition-all`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            );
                                        })}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 mt-4">
                                        {safeRekapPokja.map((item) => {
                                            const config = pokjaConfig[item.kategori_pokja];
                                            if (!config) return null;
                                            return (
                                                <div
                                                    key={item.kategori_pokja}
                                                    className="flex items-center gap-2"
                                                >
                                                    <div
                                                        className={`w-2.5 h-2.5 rounded-full ${config.bg}`}
                                                    />
                                                    <span className="text-xs text-slate-600 dark:text-slate-400">
                                                        Pokja {item.kategori_pokja} ({item.jumlah})
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {safeRekapPokja.map((item) => {
                                        const config = pokjaConfig[item.kategori_pokja];
                                        const percentage =
                                            totalPokja > 0
                                                ? Math.round((item.jumlah / totalPokja) * 100)
                                                : 0;

                                        return (
                                            <div
                                                key={item.kategori_pokja}
                                                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 transition-colors"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <p className={`text-lg font-bold ${config?.color || 'text-slate-700'}`}>
                                                            Pokja {item.kategori_pokja}
                                                        </p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                            {config?.label || '-'}
                                                        </p>
                                                    </div>
                                                    <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
                                                        {percentage}%
                                                    </span>
                                                </div>

                                                <div className="flex items-end justify-between">
                                                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                                                        {item.jumlah}
                                                    </p>
                                                    <p className="text-xs text-slate-400 mb-1">
                                                        laporan
                                                    </p>
                                                </div>

                                                <div className="mt-3 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                                    <div
                                                        className={`h-full ${config?.bg || 'bg-teal-500'} transition-all`}
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* QUICK LINKS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Link
                        href="/kecamatan/rekap/desa"
                        className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 transition-all"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
                        </div>
                        <p className="font-bold text-slate-900 dark:text-slate-100">
                            Rekap Per Desa
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Lihat rekap data per desa/kelurahan
                        </p>
                    </Link>

                    <Link
                        href="/kecamatan/rekap/dasa-wisma"
                        className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 transition-all"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center">
                                <Home className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
                        </div>
                        <p className="font-bold text-slate-900 dark:text-slate-100">
                            Rekap Per Dasa Wisma
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Lihat rekap data per dasa wisma
                        </p>
                    </Link>

                    <Link
                        href="/kecamatan/laporan"
                        className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 transition-all"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
                        </div>
                        <p className="font-bold text-slate-900 dark:text-slate-100">
                            Laporan Kecamatan
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Lihat semua laporan masuk
                        </p>
                    </Link>
                </div>
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
    color: 'teal' | 'blue' | 'purple';
    subtitle?: string;
}) {
    const colorClasses = {
        teal: {
            bg: 'bg-teal-50 dark:bg-teal-950',
            icon: 'text-teal-600 dark:text-teal-400',
        },
        blue: {
            bg: 'bg-blue-50 dark:bg-blue-950',
            icon: 'text-blue-600 dark:text-blue-400',
        },
        purple: {
            bg: 'bg-purple-50 dark:bg-purple-950',
            icon: 'text-purple-600 dark:text-purple-400',
        },
    };

    const c = colorClasses[color];

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                        {label}
                    </p>
                    <p className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 mt-2">
                        {value ?? 0}
                    </p>
                    {subtitle && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            {subtitle}
                        </p>
                    )}
                </div>
                <div
                    className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl ${c.bg} flex items-center justify-center shrink-0 ml-2`}
                >
                    <Icon className={`w-6 h-6 lg:w-7 lg:h-7 ${c.icon}`} />
                </div>
            </div>
        </div>
    );
}
