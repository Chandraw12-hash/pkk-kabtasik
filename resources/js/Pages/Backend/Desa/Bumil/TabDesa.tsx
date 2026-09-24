import React from 'react';
import { Baby } from 'lucide-react';

interface TabDesaProps {
    data: any[];
}

export default function TabDesa({ data }: TabDesaProps) {
    if (!data || data.length === 0) {
        return (
            <div className="p-16 text-center">
                <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                    <Baby className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                </div>
                <p className="text-base font-semibold text-slate-600 dark:text-slate-400">
                    Belum Ada Data Level Desa
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
                        <th className="px-4 py-3">Desa</th>
                        <th className="px-4 py-3 text-right">Jml Dusun</th>
                        <th className="px-4 py-3 text-right">Jml RW</th>
                        <th className="px-4 py-3 text-right">Jml RT</th>
                        <th className="px-4 py-3 text-right">Dasa Wisma</th>
                        <th className="px-4 py-3">Bulan</th>
                        <th className="px-4 py-3 text-right">Ibu Hamil</th>
                        <th className="px-4 py-3 text-right">Melahirkan</th>
                        <th className="px-4 py-3 text-right">Nifas</th>
                        <th className="px-4 py-3 text-right">Ibu Meninggal</th>
                        <th className="px-4 py-3 text-right">Bayi L</th>
                        <th className="px-4 py-3 text-right">Bayi P</th>
                        <th className="px-4 py-3 text-right">Akta Ada</th>
                        <th className="px-4 py-3 text-right">Akta Tidak</th>
                        <th className="px-4 py-3 text-right">Balita Meninggal L</th>
                        <th className="px-4 py-3 text-right">Balita Meninggal P</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {data.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                            <td className="px-4 py-3 text-slate-500">{idx + 1}</td>
                            <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">{item.nama_desa || item.desa || '-'}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.jumlah_dusun || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.jumlah_rw || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.jumlah_rt || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.jumlah_dasa_wisma || 0}</td>
                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{item.nama_bulan || item.bulan || '-'}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.ibu_hamil || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.ibu_melahirkan || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.ibu_nifas || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.ibu_meninggal || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.bayi_lahir_l || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.bayi_lahir_p || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.akte_ada || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.akte_tidak_ada || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.balita_meninggal_l || 0}</td>
                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{item.balita_meninggal_p || 0}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}