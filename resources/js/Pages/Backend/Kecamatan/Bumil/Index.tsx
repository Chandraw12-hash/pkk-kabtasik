import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminKecamatanLayout from '@/Components/Layout/AdminKecamatanLayout';
import Card from '@/Components/UI/Card';
import TextInput from '@/Components/Form/TextInput';
import { Baby, Search, ChevronRight, Building2 } from 'lucide-react';

interface IndexProps {
    kecamatan: string;
    data: any;
    stats: any;
    filters: any;
}

export default function Index({ kecamatan, data, stats, filters }: IndexProps) {
    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/kecamatan/data-pkk/bumil', { ...filters, search }, { preserveState: true });
    };

    return (
        <AdminKecamatanLayout>
            <Head title={`Rekap Bumil - ${kecamatan}`} />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">
                            Rekap Bumil & Bayi
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Rekap per desa — Kecamatan{' '}
                            <span className="font-semibold text-pink-600 dark:text-pink-400">
                                {kecamatan}
                            </span>
                        </p>
                    </div>
                    <a
                        href="/kecamatan/data-pkk/export/bumil"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold transition-colors"
                    >
                        Export Excel
                    </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="Total Desa" value={stats.total_desa || 0} color="pink" />
                    <StatCard label="Ibu Hamil" value={stats.total_ibu_hamil || 0} color="pink" />
                    <StatCard label="Melahirkan" value={stats.total_ibu_melahirkan || 0} color="blue" />
                    <StatCard label="Bayi Lahir" value={stats.total_bayi_lahir || 0} color="purple" />
                </div>

                <Card className="p-4 dark:bg-slate-800 dark:border-slate-700">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <TextInput
                                iconLeft={<Search size={18} />}
                                placeholder="Cari nama desa..."
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                containerClassName="relative w-full"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold transition-colors"
                        >
                            Cari
                        </button>
                    </form>
                </Card>

                <Card className="dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Menampilkan{' '}
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                                {data.data?.length || 0}
                            </span>{' '}
                            dari {data.total || 0} desa
                        </p>
                    </div>

                    {data.data && data.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-700/50">
                                    <tr className="text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        <th className="px-4 py-3">No</th>
                                        <th className="px-4 py-3">Desa</th>
                                        <th className="px-4 py-3 text-right">Hamil</th>
                                        <th className="px-4 py-3 text-right">Melahirkan</th>
                                        <th className="px-4 py-3 text-right">Nifas</th>
                                        <th className="px-4 py-3 text-right">Bayi L</th>
                                        <th className="px-4 py-3 text-right">Bayi P</th>
                                        <th className="px-4 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {data.data.map((item: any, idx: number) => (
                                        <tr key={item.desa} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                            <td className="px-4 py-3 text-slate-500">{idx + 1}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                                                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                                                        {item.nama_desa || item.desa}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right">{Number(item.ibu_hamil || 0).toLocaleString('id-ID')}</td>
                                            <td className="px-4 py-3 text-right">{Number(item.ibu_melahirkan || 0).toLocaleString('id-ID')}</td>
                                            <td className="px-4 py-3 text-right">{Number(item.ibu_nifas || 0).toLocaleString('id-ID')}</td>
                                            <td className="px-4 py-3 text-right">{Number(item.bayi_lahir_l || 0).toLocaleString('id-ID')}</td>
                                            <td className="px-4 py-3 text-right">{Number(item.bayi_lahir_p || 0).toLocaleString('id-ID')}</td>
                                            <td className="px-4 py-3 text-right">
                                                <Link
                                                    href={`/kecamatan/data-pkk/bumil/${item.desa}`}
                                                    className="inline-flex items-center gap-1 text-pink-600 dark:text-pink-400 text-xs font-semibold hover:underline"
                                                >
                                                    Detail
                                                    <ChevronRight className="w-3 h-3" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-16 text-center">
                            <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                                <Baby className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                            </div>
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

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
    const colorClasses: Record<string, string> = {
        pink: 'text-pink-600 dark:text-pink-400',
        blue: 'text-blue-600 dark:text-blue-400',
        purple: 'text-purple-600 dark:text-purple-400',
    };
    return (
        <Card className="p-5 dark:bg-slate-800 dark:border-slate-700">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
            <p className={`text-2xl font-bold mt-1.5 ${colorClasses[color] || 'text-slate-600'}`}>
                {Number(value).toLocaleString('id-ID')}
            </p>
        </Card>
    );
}
