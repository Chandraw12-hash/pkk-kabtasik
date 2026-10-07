import React from 'react';
import { Baby, Check, X } from 'lucide-react';
import { router } from '@inertiajs/react';

interface TabRTProps {
    data: any[];
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

export default function TabRT({ data }: TabRTProps) {
    const approve = (id: number) => {
        if (!window.confirm('Setujui baris rekap ini?')) return;
        router.post(`/desa/bumil/${id}/approve`);
    };

    const reject = (id: number) => {
        const reason = window.prompt('Alasan penolakan:');
        if (reason === null || reason.trim() === '') return;
        router.post(`/desa/bumil/${id}/reject`, { reason });
    };

    if (!data || data.length === 0) {
        return (
            <div className="p-16 text-center">
                <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                    <Baby className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                </div>
                <p className="text-base font-semibold text-slate-600 dark:text-slate-400">
                    Belum Ada Data Level RT
                </p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                    Import data dari file Excel atau Generate Otomatis
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
                        <th className="px-4 py-3">Dusun</th>
                        <th className="px-4 py-3">RW</th>
                        <th className="px-4 py-3">RT</th>
                        <th className="px-4 py-3">Nama Dasawisma</th>
                        <th className="px-4 py-3">Bulan</th>
                        <th className="px-4 py-3 text-right">Ibu Hamil</th>
                        <th className="px-4 py-3 text-right">Melahirkan</th>
                        <th className="px-4 py-3 text-right">Nifas</th>
                        <th className="px-4 py-3 text-right">Ibu Meninggal</th>
                        <th className="px-4 py-3 text-right">Bayi L</th>
                        <th className="px-4 py-3 text-right">Bayi P</th>
                        <th className="px-4 py-3 text-right">Akta Ada</th>
                        <th className="px-4 py-3 text-right">Akta Tidak</th>
                        <th className="px-4 py-3 text-right">Bayi Meninggal L</th>
                        <th className="px-4 py-3 text-right">Bayi Meninggal P</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {data.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                            <td className="px-4 py-3 text-slate-500">{idx + 1}</td>
                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{item.nama_dusun || '-'}</td>
                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{item.rw || '-'}</td>
                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{item.rt || '-'}</td>
                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{item.nama_dasawisma || '-'}</td>
                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{item.nama_bulan || item.bulan || '-'}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.ibu_hamil || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.ibu_melahirkan || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.ibu_nifas || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.ibu_meninggal || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.bayi_lahir_l || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.bayi_lahir_p || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.akte_ada || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.akte_tidak_ada || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.bayi_meninggal_l || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.bayi_meninggal_p || 0}</td>
                            <td className="px-4 py-3">
                                <span
                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ${
                                        statusStyle[item.status] || statusStyle.pending
                                    }`}
                                >
                                    {statusLabel[item.status] || item.status}
                                </span>
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
