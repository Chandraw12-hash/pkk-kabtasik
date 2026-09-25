import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminKecamatanLayout from '@/Components/Layout/AdminKecamatanLayout';
import Card from '@/Components/UI/Card';
import { ArrowLeft, FileText } from 'lucide-react';

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
            <Head title={`Detail ${nama_desa} - ${kecamatan}`} />

            <div className="space-y-6">
                <Link
                    href="/kecamatan/data-pkk/umum"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Data Umum PKK
                </Link>

                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">
                        Detail Data Umum PKK
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Desa{' '}
                        <span className="font-semibold text-teal-600 dark:text-teal-400">
                            {nama_desa}
                        </span>{' '}
                        — Kecamatan {kecamatan}
                    </p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Total Data" value={stats.total_data || 0} />
                    <StatCard label="Total KK" value={stats.total_kk || 0} />
                    <StatCard label="Total Jiwa" value={stats.total_jiwa || 0} />
                    <StatCard label="Dasa Wisma" value={stats.total_dasa_wisma || 0} />
                </div>

                {/* Table */}
                <Card className="dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Data per dusun
                        </p>
                    </div>

                    {data.data && data.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-700/50">
                                    <tr className="text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        <th className="px-4 py-3">No</th>
                                        <th className="px-4 py-3">Dusun</th>
                                        <th className="px-4 py-3">Level</th>
                                        <th className="px-4 py-3 text-right">KRT</th>
                                        <th className="px-4 py-3 text-right">KK</th>
                                        <th className="px-4 py-3 text-right">L</th>
                                        <th className="px-4 py-3 text-right">P</th>
                                        <th className="px-4 py-3 text-right">Dasa Wisma</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {data.data.map((item: any, idx: number) => (
                                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                            <td className="px-4 py-3 text-slate-500">{idx + 1}</td>
                                            <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                                                {item.nama_dusun || item.dusun || '-'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-400 uppercase">
                                                    {item.level || '-'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">{Number(item.jumlah_krt || 0).toLocaleString('id-ID')}</td>
                                            <td className="px-4 py-3 text-right">{Number(item.jumlah_kk || 0).toLocaleString('id-ID')}</td>
                                            <td className="px-4 py-3 text-right">{Number(item.jiwa_l || 0).toLocaleString('id-ID')}</td>
                                            <td className="px-4 py-3 text-right">{Number(item.jiwa_p || 0).toLocaleString('id-ID')}</td>
                                            <td className="px-4 py-3 text-right">{Number(item.jumlah_dasa_wisma || 0).toLocaleString('id-ID')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-16 text-center">
                            <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
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
            <p className="text-2xl font-bold mt-1.5 text-teal-600 dark:text-teal-400">
                {Number(value).toLocaleString('id-ID')}
            </p>
        </Card>
    );
}
