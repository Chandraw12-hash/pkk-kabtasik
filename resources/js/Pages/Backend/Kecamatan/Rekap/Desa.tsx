import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminKecamatanLayout from '@/Components/Layout/AdminKecamatanLayout';
import {
    Building2,
    FileText,
    Home,
    Download,
    Printer,
    ArrowLeft,
    Search,
    ArrowUpRight,
    BarChart3,
} from 'lucide-react';

interface RekapDesaItem {
    desa: string;
    jumlah_laporan: number;
    jumlah_dasa_wisma: number;
}

interface RekapDesaProps {
    kecamatan: string;
    rekap: RekapDesaItem[];
}

export default function RekapDesa({ kecamatan, rekap }: RekapDesaProps) {
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<'nama' | 'laporan' | 'dasa_wisma'>('laporan');

    // ============================================================
    // FILTER & SORT
    // ============================================================
    const filteredRekap = rekap
        .filter((item) =>
            (item.desa || '').toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'nama') {
                return (a.desa || '').localeCompare(b.desa || '');
            }
            if (sortBy === 'laporan') {
                return b.jumlah_laporan - a.jumlah_laporan;
            }
            return b.jumlah_dasa_wisma - a.jumlah_dasa_wisma;
        });

    // ============================================================
    // TOTAL
    // ============================================================
    const totalLaporan = rekap.reduce((sum, item) => sum + item.jumlah_laporan, 0);
    const totalDasaWisma = rekap.reduce((sum, item) => sum + item.jumlah_dasa_wisma, 0);
    const totalDesa = rekap.length;

    // Max untuk progress bar
    const maxLaporan = Math.max(...rekap.map((item) => item.jumlah_laporan), 1);

    return (
        <AdminKecamatanLayout>
            <Head title={`Rekap Desa - Kecamatan ${kecamatan}`} />

            <div className="space-y-6">
                {/* ============================================================
                    BACK BUTTON
                ============================================================ */}
                <Link
                    href="/kecamatan/rekap/kecamatan"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Rekap Kecamatan
                </Link>

                {/* ============================================================
                    HEADER
                ============================================================ */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">
                            Rekap Per Desa
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Rekapitulasi data per desa di Kecamatan{' '}
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
                            Export
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

                {/* ============================================================
                    STAT CARDS (3)
                ============================================================ */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard
                        icon={Building2}
                        label="Total Desa"
                        value={totalDesa}
                        color="blue"
                        subtitle="Desa/Kelurahan"
                    />
                    <StatCard
                        icon={FileText}
                        label="Total Laporan"
                        value={totalLaporan}
                        color="teal"
                        subtitle="Semua laporan"
                    />
                    <StatCard
                        icon={Home}
                        label="Total Dasa Wisma"
                        value={totalDasaWisma}
                        color="purple"
                        subtitle="Kelompok dasa wisma"
                    />
                </div>

                {/* ============================================================
                    SEARCH & SORT
                ============================================================ */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama desa..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) =>
                                setSortBy(e.target.value as 'nama' | 'laporan' | 'dasa_wisma')
                            }
                            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            <option value="laporan">Urut: Laporan Terbanyak</option>
                            <option value="dasa_wisma">Urut: Dasa Wisma Terbanyak</option>
                            <option value="nama">Urut: Nama Desa</option>
                        </select>
                    </div>
                </div>

                {/* ============================================================
                    TABLE / LIST
                ============================================================ */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Menampilkan{' '}
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                                {filteredRekap.length}
                            </span>{' '}
                            desa
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                            <BarChart3 className="w-3.5 h-3.5" />
                            Diurutkan berdasarkan{' '}
                            {sortBy === 'laporan'
                                ? 'laporan terbanyak'
                                : sortBy === 'dasa_wisma'
                                ? 'dasa wisma terbanyak'
                                : 'nama desa'}
                        </p>
                    </div>

                    {filteredRekap.length > 0 ? (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredRekap.map((item, index) => {
                                const percentage =
                                    maxLaporan > 0
                                        ? (item.jumlah_laporan / maxLaporan) * 100
                                        : 0;

                                return (
                                    <div
                                        key={item.desa}
                                        className="p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Rank Badge */}
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shrink-0 text-white font-bold shadow-sm">
                                                {index + 1}
                                            </div>

                                            {/* Info */}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start justify-between gap-3 flex-wrap">
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                                                            <h3 className="font-bold text-slate-900 dark:text-slate-100 truncate">
                                                                {item.desa || 'Tidak Ada Desa'}
                                                            </h3>
                                                        </div>
                                                    </div>

                                                    {/* Stats */}
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-right">
                                                            <p className="text-xl font-bold text-teal-600 dark:text-teal-400">
                                                                {item.jumlah_laporan}
                                                            </p>
                                                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                                                                Laporan
                                                            </p>
                                                        </div>
                                                        <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
                                                        <div className="text-right">
                                                            <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                                                                {item.jumlah_dasa_wisma}
                                                            </p>
                                                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                                                                Dasa Wisma
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="mt-3">
                                                    <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-500"
                                                            style={{
                                                                width: `${percentage}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-16 text-center">
                            <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                                <Building2 className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                            </div>
                            <p className="text-base font-semibold text-slate-600 dark:text-slate-400">
                                {search ? 'Desa Tidak Ditemukan' : 'Belum Ada Data Desa'}
                            </p>
                            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                                {search
                                    ? 'Coba kata kunci lain'
                                    : 'Belum ada data desa dengan laporan'}
                            </p>
                        </div>
                    )}
                </div>

                {/* ============================================================
                    QUICK LINK
                ============================================================ */}
                <Link
                    href="/kecamatan/rekap/dasa-wisma"
                    className="group block p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border border-purple-100 dark:border-purple-900 hover:border-purple-300 dark:hover:border-purple-700 transition-all"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                                <Home className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 dark:text-slate-100">
                                    Rekap Per Dasa Wisma
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Lihat rekap data per dasa wisma
                                </p>
                            </div>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                </Link>
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
                        {value}
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
