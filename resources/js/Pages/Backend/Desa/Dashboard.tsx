import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminDesaLayout from '@/Components/Layout/AdminDesaLayout';
import Card from '@/Components/UI/Card';
import { FileText, Users, Baby, Home, TrendingUp, ArrowUpRight } from 'lucide-react';

interface DashboardProps {
    user: {
        name: string;
        kecamatan: string;
        desa: string;
        nama_desa: string;
    };
    tahun: number;
    stats: {
        data_umum: {
            jumlah_kk: number;
            jumlah_krt: number;
            jiwa_l: number;
            jiwa_p: number;
            jumlah_dasa_wisma: number;
        } | null;
        kegiatan_count: number;
        bumil_count: number;
    };
}

export default function Dashboard({ user, tahun, stats }: DashboardProps) {
    const totalJiwa = stats.data_umum ? stats.data_umum.jiwa_l + stats.data_umum.jiwa_p : 0;

    return (
        <AdminDesaLayout>
            <Head title="Dashboard Desa" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">
                        Dashboard Desa
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Selamat datang, <span className="font-semibold text-teal-600 dark:text-teal-400">{user.name}</span> — Desa {user.desa}, Kec. {user.kecamatan}
                    </p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        icon={Home}
                        label="Total KK"
                        value={stats.data_umum?.jumlah_kk || 0}
                        subtitle={`Tahun ${tahun}`}
                        color="teal"
                    />
                    <StatCard
                        icon={Users}
                        label="Total Jiwa"
                        value={totalJiwa}
                        subtitle={`L: ${stats.data_umum?.jiwa_l || 0} — P: ${stats.data_umum?.jiwa_p || 0}`}
                        color="blue"
                    />
                    <StatCard
                        icon={FileText}
                        label="Data Kegiatan"
                        value={stats.kegiatan_count}
                        subtitle="Record kegiatan"
                        color="purple"
                    />
                    <StatCard
                        icon={Baby}
                        label="Data Bumil"
                        value={stats.bumil_count}
                        subtitle="Record bumil"
                        color="pink"
                    />
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <QuickLink
                        href="/desa/data-umum"
                        icon={FileText}
                        title="Data Umum PKK"
                        subtitle="Lihat & import data umum"
                        color="teal"
                    />
                    <QuickLink
                        href="/desa/kegiatan"
                        icon={Users}
                        title="Rekap Kegiatan"
                        subtitle="Lihat & import kegiatan"
                        color="purple"
                    />
                    <QuickLink
                        href="/desa/bumil"
                        icon={Baby}
                        title="Rekap Bumil"
                        subtitle="Lihat & import bumil"
                        color="pink"
                    />
                </div>

                {/* Info Data Umum */}
                {stats.data_umum ? (
                    <Card className="p-6 dark:bg-slate-800 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100">
                                    Ringkasan Data Umum PKK {tahun}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Data terakhir di-import
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <MiniStat label="KRT" value={stats.data_umum.jumlah_krt} />
                            <MiniStat label="KK" value={stats.data_umum.jumlah_kk} />
                            <MiniStat label="Dasa Wisma" value={stats.data_umum.jumlah_dasa_wisma} />
                            <MiniStat label="Jiwa" value={totalJiwa} />
                        </div>
                    </Card>
                ) : (
                    <Card className="p-12 text-center dark:bg-slate-800 dark:border-slate-700">
                        <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                        </div>
                        <p className="text-base font-semibold text-slate-600 dark:text-slate-400">
                            Belum Ada Data Umum PKK
                        </p>
                        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 mb-4">
                            Import data dari file Excel untuk memulai
                        </p>
                        <Link
                            href="/desa/data-umum/import"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors"
                        >
                            Import Data Umum
                        </Link>
                    </Card>
                )}
            </div>
        </AdminDesaLayout>
    );
}

// ============================================================
// SUB-COMPONENT: StatCard
// ============================================================
function StatCard({
    icon: Icon,
    label,
    value,
    subtitle,
    color,
}: {
    icon: any;
    label: string;
    value: number;
    subtitle?: string;
    color: 'teal' | 'blue' | 'purple' | 'pink';
}) {
    const colorClasses = {
        teal: { bg: 'bg-teal-50 dark:bg-teal-950', icon: 'text-teal-600 dark:text-teal-400' },
        blue: { bg: 'bg-blue-50 dark:bg-blue-950', icon: 'text-blue-600 dark:text-blue-400' },
        purple: { bg: 'bg-purple-50 dark:bg-purple-950', icon: 'text-purple-600 dark:text-purple-400' },
        pink: { bg: 'bg-pink-50 dark:bg-pink-950', icon: 'text-pink-600 dark:text-pink-400' },
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
                        {value.toLocaleString('id-ID')}
                    </p>
                    {subtitle && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 truncate">
                            {subtitle}
                        </p>
                    )}
                </div>
                <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl ${c.bg} flex items-center justify-center shrink-0 ml-2`}>
                    <Icon className={`w-5 h-5 lg:w-6 lg:h-6 ${c.icon}`} />
                </div>
            </div>
        </Card>
    );
}

// ============================================================
// SUB-COMPONENT: MiniStat
// ============================================================
function MiniStat({ label, value }: { label: string; value: number }) {
    return (
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {label}
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {value.toLocaleString('id-ID')}
            </p>
        </div>
    );
}

// ============================================================
// SUB-COMPONENT: QuickLink
// ============================================================
function QuickLink({
    href,
    icon: Icon,
    title,
    subtitle,
    color,
}: {
    href: string;
    icon: any;
    title: string;
    subtitle: string;
    color: 'teal' | 'purple' | 'pink';
}) {
    const colorClasses = {
        teal: { bg: 'bg-teal-50 dark:bg-teal-950', icon: 'text-teal-600 dark:text-teal-400' },
        purple: { bg: 'bg-purple-50 dark:bg-purple-950', icon: 'text-purple-600 dark:text-purple-400' },
        pink: { bg: 'bg-pink-50 dark:bg-pink-950', icon: 'text-pink-600 dark:text-pink-400' },
    };
    const c = colorClasses[color];

    return (
        <Link
            href={href}
            className="group p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 transition-all"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${c.icon}`} />
                    </div>
                    <div>
                        <p className="font-bold text-slate-900 dark:text-slate-100">{title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
                    </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
        </Link>
    );
}
