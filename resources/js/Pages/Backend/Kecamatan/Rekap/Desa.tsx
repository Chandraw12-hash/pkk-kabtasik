import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminKecamatanLayout from '@/Components/Layout/AdminKecamatanLayout';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import TextInput from '@/Components/Form/TextInput';
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
            if (sortBy === 'nama') return (a.desa || '').localeCompare(b.desa || '');
            if (sortBy === 'laporan') return b.jumlah_laporan - a.jumlah_laporan;
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
                            Rekap Per Desa
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            Rekapitulasi data per desa di Kecamatan{' '}
                            <span className="font-semibold text-teal-600 dark:text-teal-400">
                                {kecamatan}
                            </span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="primary"
                            href="/kecamatan/export/excel"
                            target="_blank"
                            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-100 dark:shadow-none"
                        >
                            <Download size={16} />
                            <span>Export</span>
                        </Button>
                        <Button
                            variant="secondary"
                            href="/kecamatan/print/kecamatan"
                            target="_blank"
                            className="flex items-center gap-2"
                        >
                            <Printer size={16} />
                            <span>Print</span>
                        </Button>
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
                        subtitle="Desa / kelurahan"
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
                <Card className="dark:bg-slate-800 dark:border-slate-700 dark:shadow-slate-700/50 p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[200px]">
                            <TextInput
                                iconLeft={<Search size={18} />}
                                placeholder="Cari nama desa..."
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                containerClassName="relative w-full"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) =>
                                setSortBy(e.target.value as 'nama' | 'laporan' | 'dasa_wisma')
                            }
                            className="text-sm rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all"
                        >
                            <option value="laporan">Urut: Laporan Terbanyak</option>
                            <option value="dasa_wisma">Urut: Dasa Wisma Terbanyak</option>
                            <option value="nama">Urut: Nama Desa</option>
                        </select>
                    </div>
                </Card>

                {/* ============================================================
                    TABLE / LIST
                ============================================================ */}
                <Card className="dark:bg-slate-800 dark:border-slate-700 dark:shadow-slate-700/50 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Menampilkan{' '}
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                                {filteredRekap.length}
                            </span>{' '}
                            desa
                        </p>
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                            >
                                Reset Filter
                            </button>
                        )}
                    </div>

                    {filteredRekap.length > 0 ? (
                        <div className="divide-y divide-slate-100 dark:divide-slate-700">
                            {filteredRekap.map((item, index) => {
                                const percentage =
                                    maxLaporan > 0
                                        ? (item.jumlah_laporan / maxLaporan) * 100
                                        : 0;

                                return (
                                    <div
                                        key={`${item.desa}-${index}`}
                                        className="p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
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
                                                                {item.desa || 'Tidak Ada Nama'}
                                                            </h3>
                                                        </div>
                                                    </div>

                                                    {/* Stats */}
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-right">
                                                            <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                                                                {item.jumlah_laporan}
                                                            </p>
                                                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                                                                Laporan
                                                            </p>
                                                        </div>
                                                        <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
                                                        <div className="text-right">
                                                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
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
                                                    <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
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
                                    ? 'Coba ubah filter atau kata kunci'
                                    : 'Belum ada data desa dengan laporan'}
                            </p>
                        </div>
                    )}
                </Card>

                {/* ============================================================
                    QUICK LINK
                ============================================================ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                        href="/kecamatan/rekap/kecamatan"
                        className="group p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 transition-all"
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
                        href="/kecamatan/rekap/dasa-wisma"
                        className="group p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center">
                                    <Home className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-slate-100">
                                        Rekap Dasa Wisma
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Lihat rekap per dasa wisma
                                    </p>
                                </div>
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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
        <Card className="p-5 dark:bg-slate-800 dark:border-slate-700">
            <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                        {label}
                    </p>
                    <p className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1.5">
                        {value}
                    </p>
                    {subtitle && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
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
