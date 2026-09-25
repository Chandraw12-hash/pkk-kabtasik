import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminKecamatanLayout from '@/Components/Layout/AdminKecamatanLayout';
import Card from '@/Components/UI/Card';
import { ArrowLeft, BarChart3 } from 'lucide-react';

interface ShowProps {
    kecamatan: string;
    desa: string;
    nama_desa: string;
    data: any;
    stats: any;
    filters: any;
}

export default function Show({ kecamatan, desa, nama_desa, data, stats }: ShowProps) {
    return (
        <AdminKecamatanLayout>
            <Head title={`Detail Kegiatan ${nama_desa} - ${kecamatan}`} />

            <div className="space-y-6">
                <Link
                    href="/kecamatan/data-pkk/kegiatan"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Rekap Kegiatan
                </Link>

                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">
                        Detail Rekap Kegiatan
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Desa{' '}
                        <span className="font-semibold text-purple-600 dark:text-purple-400">
                            {nama_desa}
                        </span>{' '}
                        — Kecamatan {kecamatan}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Total Data" value={stats.total_data || 0} />
                    <StatCard label="Total KK" value={stats.total_kk || 0} />
                    <StatCard label="Total Jiwa" value={stats.total_jiwa || 0} />
                    <StatCard label="Dasa Wisma" value={stats.total_dasa_wisma || 0} />
                </div>

                <Card className="dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Data per dusun/RW/RT
                        </p>
                    </div>

                    {data.data && data.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-700/50">
                                    <tr className="text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        <th className="px-4 py-3">No</th>
                                        <th className="px-4 py-3">Dusun</th>
                                        <th className="px-4 py-3">RW</th>
                                        <th className="px-4 py-3">RT</th>
                                        <th className="px-4 py-3 text-right">KK</th>
                                        <th className="px-4 py-3 text-right">L</th>
                                        <th className="px-4 py-3 text-right">P</th>
                                        <th className="px-4 py-3 text-right">Ibu Hamil</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {data.data.map((item: any, idx: number) => (
                                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                            <td className="px-4 py-3 text-slate-500">{idx + 1}</td>
                                            <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                                                {item.nama_dusun || item.dusun || '-'}
                                            </td>
                                            <td className="px-4 py-3">{item.rw || '-'}</td>
                                            <td className="px-4 py-3">{item.rt || '-'}</td>
                                            <td className="px-4 py-3 text-right">{Number(item.jumlah_kk || 0).toLocaleString('id-ID')}</td>
                                            <td className="px-4 py-3 text-right">{Number(item.total_l || 0).toLocaleString('id-ID')}</td>
                                            <td className="px-4 py-3 text-right">{Number(item.total_p || 0).toLocaleString('id-ID')}</td>
                                            <td className="px-4 py-3 text-right">{Number(item.ibu_hamil || 0).toLocaleString('id-ID')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-16 text-center">
                            <BarChart3 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                            <p className="text-base font-semibold text-slate-600 dark:text-slate-400">
                                Belum Ada Data
                            </p>
                        </div>
                    )}
                </Card>
            </div>
        </AdminKecamatanLayout>
    );
}

function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <Card className="p-5 dark:bg-slate-800 dark:border-slate-700">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold mt-1.5 text-purple-600 dark:text-purple-400">
                {Number(value).toLocaleString('id-ID')}
            </p>
        </Card>
    );
}
