import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminKecamatanLayout from '@/Components/Layout/AdminKecamatanLayout';
import {
    Home,
    FileText,
    Building2,
    BarChart3,      // ← TAMBAH INI
    Download,
    Printer,
    ArrowLeft,
    Search,
    ArrowUpRight,
    MapPin,
    Hash,
} from 'lucide-react';

interface RekapDasaWismaItem {
    dasa_wisma: string;
    desa: string;
    jumlah_laporan: number;
}

interface RekapDasaWismaProps {
    kecamatan: string;
    rekap: RekapDasaWismaItem[];
}

export default function RekapDasaWisma({
    kecamatan,
    rekap,
}: RekapDasaWismaProps) {
    const [search, setSearch] = useState('');
    const [filterDesa, setFilterDesa] = useState('');
    const [sortBy, setSortBy] = useState<'nama' | 'laporan' | 'desa'>('laporan');

    // ============================================================
    // DAFTAR DESA UNIK (untuk filter)
    // ============================================================
    const daftarDesa = Array.from(
        new Set(rekap.map((item) => item.desa).filter(Boolean))
    ).sort();

    // ============================================================
    // FILTER & SORT
    // ============================================================
    const filteredRekap = rekap
        .filter((item) => {
            const matchSearch = (item.dasa_wisma || '')
                .toLowerCase()
                .includes(search.toLowerCase());
            const matchDesa = !filterDesa || item.desa === filterDesa;
            return matchSearch && matchDesa;
        })
        .sort((a, b) => {
            if (sortBy === 'nama') {
                return (a.dasa_wisma || '').localeCompare(b.dasa_wisma || '');
            }
            if (sortBy === 'desa') {
                return (a.desa || '').localeCompare(b.desa || '');
            }
            return b.jumlah_laporan - a.jumlah_laporan;
        });

    // ============================================================
    // TOTAL
    // ============================================================
    const totalLaporan = rekap.reduce((sum, item) => sum + item.jumlah_laporan, 0);
    const totalDasaWisma = rekap.length;
    const totalDesa = daftarDesa.length;

    // Max untuk progress bar
    const maxLaporan = Math.max(...rekap.map((item) => item.jumlah_laporan), 1);

    return (
        <AdminKecamatanLayout>
            <Head title={`Rekap Dasa Wisma - Kecamatan ${kecamatan}`} />

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
                            Rekap Per Dasa Wisma
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Rekapitulasi data per dasa wisma di Kecamatan{' '}
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
                        icon={Home}
                        label="Total Dasa Wisma"
                        value={totalDasaWisma}
                        color="purple"
                        subtitle="Kelompok dasa wisma"
                    />
                    <StatCard
                        icon={FileText}
                        label="Total Laporan"
                        value={totalLaporan}
                        color="teal"
                        subtitle="Semua laporan"
                    />
                    <StatCard
                        icon={Building2}
                        label="Total Desa"
                        value={totalDesa}
                        color="blue"
                        subtitle="Desa dengan dasa wisma"
                    />
                </div>

                {/* ============================================================
                    SEARCH & FILTER
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
                                placeholder="Cari nama dasa wisma..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filter Desa */}
                        <select
                            value={filterDesa}
                            onChange={(e) => setFilterDesa(e.target.value)}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            <option value="">Semua Desa</option>
                            {daftarDesa.map((desa) => (
                                <option key={desa} value={desa}>
                                    {desa}
                                </option>
                            ))}
                        </select>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) =>
                                setSortBy(e.target.value as 'nama' | 'laporan' | 'desa')
                            }
                            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            <option value="laporan">Urut: Laporan Terbanyak</option>
                            <option value="nama">Urut: Nama Dasa Wisma</option>
                            <option value="desa">Urut: Nama Desa</option>
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
                            dasa wisma
                        </p>
                        {(search || filterDesa) && (
                            <button
                                onClick={() => {
                                    setSearch('');
                                    setFilterDesa('');
                                }}
                                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                            >
                                Reset Filter
                            </button>
                        )}
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
                                        key={`${item.dasa_wisma}-${item.desa}-${index}`}
                                        className="p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Rank Badge */}
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 text-white font-bold shadow-sm">
                                                {index + 1}
                                            </div>

                                            {/* Info */}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-start justify-between gap-3 flex-wrap">
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <Home className="w-4 h-4 text-slate-400 shrink-0" />
                                                            <h3 className="font-bold text-slate-900 dark:text-slate-100 truncate">
                                                                {item.dasa_wisma || 'Tidak Ada Nama'}
                                                            </h3>
                                                        </div>
                                                        {item.desa && (
                                                            <div className="flex items-center gap-1.5 mt-1">
                                                                <MapPin className="w-3 h-3 text-slate-400" />
                                                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                                                    Desa {item.desa}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Jumlah Laporan */}
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                                            {item.jumlah_laporan}
                                                        </p>
                                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                                                            Laporan
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="mt-3">
                                                    <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
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
                                <Home className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                            </div>
                            <p className="text-base font-semibold text-slate-600 dark:text-slate-400">
                                {search || filterDesa
                                    ? 'Dasa Wisma Tidak Ditemukan'
                                    : 'Belum Ada Data Dasa Wisma'}
                            </p>
                            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                                {search || filterDesa
                                    ? 'Coba ubah filter atau kata kunci'
                                    : 'Belum ada data dasa wisma dengan laporan'}
                            </p>
                        </div>
                    )}
                </div>

                {/* ============================================================
                    QUICK LINK
                ============================================================ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                        href="/kecamatan/rekap/kecamatan"
                        className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 transition-all"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950 flex items-center justify-center">
                                    <BarChart3 className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-slate-100">
                                        Rekap Kecamatan
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Lihat ringkasan kecamatan
                                    </p>
                                </div>
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-teal-600 dark:text-teal-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </div>
                    </Link>

                    <Link
                        href="/kecamatan/rekap/desa"
                        className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-slate-100">
                                        Rekap Desa
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Lihat rekap per desa
                                    </p>
                                </div>
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </div>
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
