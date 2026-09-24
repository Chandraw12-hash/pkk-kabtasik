import React from 'react';
import { Head } from '@inertiajs/react';
import AdminDesaLayout from '@/Components/Layout/AdminDesaLayout';
import Card from '@/Components/UI/Card';
import { FileSpreadsheet, Download, FileText, Users, Baby } from 'lucide-react';

export default function Index() {
    const exportItems = [
        {
            href: '/desa/export/data-umum',
            icon: FileText,
            title: 'Data Umum PKK',
            subtitle: 'Export data umum PKK ke Excel',
            color: 'teal',
        },
        {
            href: '/desa/export/kegiatan',
            icon: Users,
            title: 'Rekap Kegiatan',
            subtitle: 'Export data kegiatan warga ke Excel',
            color: 'purple',
        },
        {
            href: '/desa/export/bumil',
            icon: Baby,
            title: 'Rekap Bumil',
            subtitle: 'Export data ibu hamil & bayi ke Excel',
            color: 'pink',
        },
    ];

    const colorClasses: Record<string, { bg: string; icon: string }> = {
        teal: { bg: 'bg-teal-50 dark:bg-teal-950', icon: 'text-teal-600 dark:text-teal-400' },
        purple: { bg: 'bg-purple-50 dark:bg-purple-950', icon: 'text-purple-600 dark:text-purple-400' },
        pink: { bg: 'bg-pink-50 dark:bg-pink-950', icon: 'text-pink-600 dark:text-pink-400' },
    };

    return (
        <AdminDesaLayout>
            <Head title="Export Data" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">
                        Export Data
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Download data dalam format Excel
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {exportItems.map((item) => {
                        const Icon = item.icon;
                        const c = colorClasses[item.color];
                        return (
                            <a
                                key={item.href}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 transition-all"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}>
                                        <Icon className={`w-6 h-6 ${c.icon}`} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold text-slate-900 dark:text-slate-100">
                                            {item.title}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            {item.subtitle}
                                        </p>
                                        <div className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400 text-xs font-semibold mt-3 group-hover:underline">
                                            <Download className="w-3 h-3" />
                                            Download Excel
                                        </div>
                                    </div>
                                </div>
                            </a>
                        );
                    })}
                </div>

                <Card className="p-6 dark:bg-slate-800 dark:border-slate-700">
                    <div className="flex items-start gap-3">
                        <FileSpreadsheet className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-semibold text-slate-700 dark:text-slate-300">
                                Catatan Export
                            </p>
                            <ul className="text-slate-500 dark:text-slate-400 mt-2 space-y-1 list-disc list-inside">
                                <li>File akan di-download dalam format <b>.xlsx</b></li>
                                <li>Data yang di-export hanya data desa Anda</li>
                                <li>Filter tahun & level bisa ditambahkan di masa depan</li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>
        </AdminDesaLayout>
    );
}
