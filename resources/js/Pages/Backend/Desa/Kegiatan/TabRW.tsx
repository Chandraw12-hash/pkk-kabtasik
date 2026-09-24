import React from 'react';
import { FileText } from 'lucide-react';

interface TabRWProps {
    data: any[];
}

export default function TabRW({ data }: TabRWProps) {
    if (!data || data.length === 0) {
        return (
            <div className="p-16 text-center">
                <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                </div>
                <p className="text-base font-semibold text-slate-600 dark:text-slate-400">
                    Belum Ada Data Level RW
                </p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                    Import data dari file Excel
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
                        <th className="px-4 py-3 text-right">Jml RT</th>
                        <th className="px-4 py-3 text-right">Dasa Wisma</th>
                        <th className="px-4 py-3 text-right">KK</th>
                        <th className="px-4 py-3 text-right">KRT</th>
                        <th className="px-4 py-3 text-right">L</th>
                        <th className="px-4 py-3 text-right">P</th>
                        <th className="px-4 py-3 text-right">Balita L</th>
                        <th className="px-4 py-3 text-right">Balita P</th>
                        <th className="px-4 py-3 text-right">PUS</th>
                        <th className="px-4 py-3 text-right">WUS</th>
                        <th className="px-4 py-3 text-right">Lansia</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {data.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                            <td className="px-4 py-3 text-slate-500">{idx + 1}</td>
                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{item.nama_dusun || '-'}</td>
                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{item.rw || '-'}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.jumlah_rt || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.jumlah_dasa_wisma || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.jumlah_kk?.toLocaleString('id-ID') || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.jumlah_krt?.toLocaleString('id-ID') || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.total_l?.toLocaleString('id-ID') || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.total_p?.toLocaleString('id-ID') || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.balita_l || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.balita_p || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.pus || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.wus || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.lansia || 0}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
