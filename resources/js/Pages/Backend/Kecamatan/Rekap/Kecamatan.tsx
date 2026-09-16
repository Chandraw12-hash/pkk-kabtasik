import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminKecamatanLayout from '@/Components/Layout/AdminKecamatanLayout';
import Card from "@/Components/UI/Card";
import Button from "@/Components/UI/Button";
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
import StatCard from "@/Components/UI/SatistikCard"; // Using the standard StatCard

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
    rekap: RekapKecamatan | null;
    rekapPokja: RekapPokjaItem[] | null;
}

export default function RekapKecamatan({
    kecamatan,
    rekap,
    rekapPokja,
}: RekapKecamatanProps) {
    const [activeTab, setActiveTab] = useState<'ringkasan' | 'pokja'>('ringkasan');

    const safeRekap: RekapKecamatan = rekap ?? {
        kecamatan: kecamatan || '-',
        jumlah_laporan: 0,
        jumlah_desa: 0,
        jumlah_dasa_wisma: 0,
    };

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
                {/* ─── HEADER ─── */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
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
                            Rekap Kecamatan
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            Rekapitulasi data laporan di Kecamatan {kecamatan}
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
                            <span>Export Excel</span>
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

                {/* STAT CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard
                        title="Total Laporan"
                        value={safeRekap.jumlah_laporan}
                        icon={FileText}
                        color="bg-teal-600"
                        className="border-l-4 border-teal-600 dark:bg-slate-800"
                        textColor="white"
                        description="Laporan terdaftar"
                    />
                    <StatCard
                        title="Jumlah Desa"
                        value={safeRekap.jumlah_desa}
                        icon={Building2}
                        color="bg-blue-600"
                        className="border-l-4 border-blue-600 dark:bg-slate-800"
                        textColor="white"
                        description="Desa/Kelurahan"
                    />
                    <StatCard
                        title="Jumlah Dasa Wisma"
                        value={safeRekap.jumlah_dasa_wisma}
                        icon={Home}
                        color="bg-purple-600"
                        className="border-l-4 border-purple-600 dark:bg-slate-800"
                        textColor="white"
                        description="Kelompok dasa wisma"
                    />
                </div>

                {/* TABS */}
                <Card className="dark:bg-slate-800 dark:border-slate-700 overflow-hidden mt-6">
                    <div className="border-b border-slate-100 dark:border-slate-700 px-2 sm:px-6 flex items-center gap-1 overflow-x-auto bg-slate-50/50 dark:bg-slate-800/50">
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

                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                                        <BarChart3 className="w-4 h-4 text-slate-400" />
                                        Distribusi Laporan per Pokja
                                    </h4>
                                    <div className="space-y-4">
                                        {['I', 'II', 'III', 'IV'].map((pokjaStr) => {
                                            const item = safeRekapPokja.find((p) => p.kategori_pokja === pokjaStr);
                                            const config = pokjaConfig[pokjaStr];
                                            const count = item ? item.jumlah : 0;
                                            const percentage = totalPokja > 0 ? (count / totalPokja) * 100 : 0;

                                            return (
                                                <div key={pokjaStr}>
                                                    <div className="flex justify-between text-sm mb-1.5">
                                                        <span className="font-medium text-slate-700 dark:text-slate-300">
                                                            {config.label}
                                                        </span>
                                                        <span className={`font-bold ${config.color}`}>
                                                            {count} <span className="text-xs text-slate-400 font-normal ml-1">({percentage.toFixed(1)}%)</span>
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                                                        <div
                                                            className={`${config.bg} h-2.5 rounded-full transition-all duration-500`}
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'pokja' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {['I', 'II', 'III', 'IV'].map((pokjaStr) => {
                                    const item = safeRekapPokja.find((p) => p.kategori_pokja === pokjaStr);
                                    const config = pokjaConfig[pokjaStr];
                                    const count = item ? item.jumlah : 0;

                                    return (
                                        <div
                                            key={pokjaStr}
                                            className="p-5 border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-between group hover:border-teal-200 dark:hover:border-teal-800 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white shadow-md ${config.bg}`}>
                                                    <span className="font-bold text-lg">{pokjaStr}</span>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                                        Pokja {pokjaStr}
                                                    </p>
                                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                        {config.label.split(' - ')[1]}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-2xl font-bold ${config.color}`}>
                                                    {count}
                                                </p>
                                                <p className="text-[10px] text-slate-400 mt-0.5">Laporan</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </AdminKecamatanLayout>
    );
}
