import React from 'react';
import { Link } from '@inertiajs/react';
import { FileText, BarChart3, Baby } from 'lucide-react';

interface Props {
    activeTab: 'umum' | 'kegiatan' | 'bumil';
    tahun: number;
}

export default function SekretariatTabs({ activeTab, tahun }: Props) {
    // ============================================================
    // Pakai absolute URL — biar ga tergantung route name
    // ============================================================
    const tabs = [
        {
            id: 'umum',
            label: 'Data Umum PKK',
            icon: FileText,
            href: '/dashboard/sekretariat',
        },
        {
            id: 'kegiatan',
            label: 'Data Kegiatan',
            icon: BarChart3,
            href: '/dashboard/sekretariat/kegiatan',
        },
        {
            id: 'bumil',
            label: 'Rekap Bumil',
            icon: Baby,
            href: '/dashboard/sekretariat/bumil',
        },
    ];

    return (
        <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-t-2xl">
            <div className="flex items-center gap-1 overflow-x-auto px-2 sm:px-6">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <Link
                            key={tab.id}
                            href={`${tab.href}?tahun=${tahun}`}
                            className={`flex items-center gap-2 px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                                isActive
                                    ? 'border-teal-600 text-teal-600 dark:text-teal-400 dark:border-teal-400'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                            }`}
                        >
                            <Icon size={16} />
                            <span>{tab.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
