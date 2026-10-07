import React from 'react';
import { Baby, Check, X } from 'lucide-react';
import { router } from '@inertiajs/react';

interface IbuRow {
    id: number;
    nama: string;
    suami_nama: string | null;
    status_ibu: string;
    bulan: number | null;
    nama_bulan: string | null;
    tahun: number | null;
    dusun: string | null;
    rw: string | null;
    rt: string | null;
    bayi_nama: string | null;
    status: 'pending' | 'approved' | 'rejected';
    rejected_reason: string | null;
    approved_by_name: string | null;
}

interface TabIbuProps {
    data: IbuRow[];
}

const statusStyle: Record<string, string> = {
    pending:
        'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
    approved:
        'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

const statusLabel: Record<string, string> = {
    pending: 'Menunggu',
    approved: 'Disetujui',
    rejected: 'Perlu Diperbaiki',
};

const statusIbuLabel: Record<string, string> = {
    hamil: 'Hamil',
    melahirkan: 'Melahirkan',
    nifas: 'Nifas',
};

export default function TabIbu({ data }: TabIbuProps) {
    const approve = (id: number) => {
        if (!window.confirm('Setujui data ibu ini? Rekap bulan terkait ikut terhitung.')) return;
        router.post(`/desa/bumil/ibu/${id}/approve`);
    };

    const reject = (id: number) => {
        const reason = window.prompt('Alasan penolakan:');
        if (reason === null || reason.trim() === '') return;
        router.post(`/desa/bumil/ibu/${id}/reject`, { reason });
    };

    if (!data || data.length === 0) {
        return (
            <div className="p-16 text-center">
                <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                    <Baby className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                </div>
                <p className="text-base font-semibold text-slate-600 dark:text-slate-400">
                    Belum Ada Data Ibu
                </p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                    Data muncul setelah kader mengirim dari aplikasi
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                    <tr className="text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        <th className="px-4 py-3">No</th>
                        <th className="px-4 py-3">Nama Ibu</th>
                        <th className="px-4 py-3">Suami</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Bulan</th>
                        <th className="px-4 py-3">Dusun / RT</th>
                        <th className="px-4 py-3">Bayi</th>
                        <th className="px-4 py-3">Persetujuan</th>
                        <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {data.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                            <td className="px-4 py-3 text-slate-500">{idx + 1}</td>
                            <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                                {item.nama}
                            </td>
                            <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                {item.suami_nama || '-'}
                            </td>
                            <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                {statusIbuLabel[item.status_ibu] || item.status_ibu}
                            </td>
                            <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                {item.nama_bulan || item.bulan || '-'}
                            </td>
                            <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                {[item.dusun, item.rt ? `RT ${item.rt}` : null]
                                    .filter(Boolean)
                                    .join(' · ') || '-'}
                            </td>
                            <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                {item.bayi_nama || '-'}
                            </td>
                            <td className="px-4 py-3">
                                <span
                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ${
                                        statusStyle[item.status] || statusStyle.pending
                                    }`}
                                >
                                    {statusLabel[item.status] || item.status}
                                </span>
                                {item.status === 'rejected' && item.rejected_reason && (
                                    <p className="mt-1 text-[11px] text-red-600 dark:text-red-400 max-w-[180px]">
                                        {item.rejected_reason}
                                    </p>
                                )}
                            </td>
                            <td className="px-4 py-3">
                                {item.status === 'pending' ? (
                                    <div className="flex items-center justify-end gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => approve(item.id)}
                                            title="Setujui"
                                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => reject(item.id)}
                                            title="Tolak"
                                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <span className="text-xs text-slate-400">-</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
