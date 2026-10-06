import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminKecamatanLayout from '@/Components/Layout/AdminKecamatanLayout';
import Card from '@/Components/UI/Card';
import {
    Check,
    X,
    Users,
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    Clock,
    Eye,
    Loader2,
} from 'lucide-react';

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

interface DataItem {
    id: number;
    tahun: number;
    kecamatan: string;
    nama_kecamatan: string | null;
    desa: string;
    nama_desa: string | null;
    jumlah_dusun: number;
    jumlah_pkk_rw: number;
    jumlah_pkk_rt: number;
    jumlah_dasa_wisma: number;
    jumlah_krt: number;
    jumlah_kk: number;
    jiwa_l: number;
    jiwa_p: number;
    jiwa_tidak_terpilah: number;
    tp_pkk_l: number;
    tp_pkk_p: number;
    kader_umum_l: number;
    kader_umum_p: number;
    kader_khusus_l: number;
    kader_khusus_p: number;
    kecamatan_status: 'pending' | 'approved' | 'rejected';
    kecamatan_approved_at: string | null;
    kecamatan_rejected_reason: string | null;
}

interface PaginatedData {
    data: DataItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface ApprovalProps {
    kecamatan: string;
    data: PaginatedData;
    stats: {
        pending: number;
        approved: number;
        rejected: number;
        total: number;
    };
    filters: {
        tahun?: string;
        status?: string;
        search?: string;
    };
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export default function Approval({ kecamatan, data, stats, filters }: ApprovalProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'pending');
    const [tahun, setTahun] = useState(filters.tahun || '2026');
    const [processing, setProcessing] = useState<number | null>(null);
    const [bulkProcessing, setBulkProcessing] = useState(false);
    const [selectedDesa, setSelectedDesa] = useState<DataItem | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);

    // ══════════════════════════════════════════════════════════
    // HANDLE SEARCH
    // ══════════════════════════════════════════════════════════
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            '/kecamatan/data-pkk/umum/approval',
            { search, status, tahun },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleFilterStatus = (newStatus: string) => {
        setStatus(newStatus);
        router.get(
            '/kecamatan/data-pkk/umum/approval',
            { search, status: newStatus, tahun },
            { preserveState: true, preserveScroll: true }
        );
    };

    // ══════════════════════════════════════════════════════════
    // APPROVE
    // ══════════════════════════════════════════════════════════
    const handleApprove = (item: DataItem) => {
        if (!confirm(`Setujui data desa "${item.nama_desa || item.desa}"?`)) return;

        setProcessing(item.id);
        router.post(
            `/kecamatan/data-pkk/umum/${item.id}/approve`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setProcessing(null),
            }
        );
    };

    // ══════════════════════════════════════════════════════════
    // REJECT — Buka Modal
    // ══════════════════════════════════════════════════════════
    const handleOpenReject = (item: DataItem) => {
        setSelectedDesa(item);
        setRejectReason('');
        setShowRejectModal(true);
    };

    const handleRejectSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDesa || !rejectReason.trim()) return;

        setProcessing(selectedDesa.id);
        router.post(
            `/kecamatan/data-pkk/umum/${selectedDesa.id}/reject`,
            { reason: rejectReason },
            {
                preserveScroll: true,
                onFinish: () => {
                    setProcessing(null);
                    setShowRejectModal(false);
                    setSelectedDesa(null);
                    setRejectReason('');
                },
            }
        );
    };

    // ══════════════════════════════════════════════════════════
    // BULK APPROVE
    // ══════════════════════════════════════════════════════════
    const handleBulkApprove = () => {
        if (stats.pending === 0) {
            alert('Tidak ada data pending.');
            return;
        }
        if (!confirm(`Setujui SEMUA ${stats.pending} desa pending?`)) return;

        setBulkProcessing(true);
        router.post(
            '/kecamatan/data-pkk/umum/bulk-approve',
            { tahun },
            {
                preserveScroll: true,
                onFinish: () => setBulkProcessing(false),
            }
        );
    };

    // ══════════════════════════════════════════════════════════
    // STATUS BADGE
    // ══════════════════════════════════════════════════════════
    const StatusBadge = ({ status }: { status: string }) => {
        if (status === 'approved') {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-400">
                    <CheckCircle2 size={10} />
                    Disetujui
                </span>
            );
        }
        if (status === 'rejected') {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400">
                    <XCircle size={10} />
                    Ditolak
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400">
                <Clock size={10} />
                Menunggu
            </span>
        );
    };

    // ══════════════════════════════════════════════════════════
    // RENDER
    // ══════════════════════════════════════════════════════════
    return (
        <AdminKecamatanLayout>
            <Head title="Approval Data Umum PKK" />

            <div className="space-y-6 max-w-6xl">
                {/* ══════════════════════════════════════════════════
                    HEADER
                ══════════════════════════════════════════════════ */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">
                            Approval Data Umum
                        </p>
                        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">
                            Kec. {kecamatan}
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Review data dari desa sebelum naik ke kabupaten
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleBulkApprove}
                        disabled={bulkProcessing || stats.pending === 0}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {bulkProcessing ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Check size={16} />
                        )}
                        <span>Setujui Semua ({stats.pending})</span>
                    </button>
                </div>

                {/* ══════════════════════════════════════════════════
                    STATS
                ══════════════════════════════════════════════════ */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <StatCard
                        label="Menunggu"
                        value={stats.pending}
                        icon={Clock}
                        color="amber"
                        active={status === 'pending'}
                        onClick={() => handleFilterStatus('pending')}
                    />
                    <StatCard
                        label="Disetujui"
                        value={stats.approved}
                        icon={CheckCircle2}
                        color="teal"
                        active={status === 'approved'}
                        onClick={() => handleFilterStatus('approved')}
                    />
                    <StatCard
                        label="Ditolak"
                        value={stats.rejected}
                        icon={XCircle}
                        color="rose"
                        active={status === 'rejected'}
                        onClick={() => handleFilterStatus('rejected')}
                    />
                    <StatCard
                        label="Total"
                        value={stats.total}
                        icon={Users}
                        color="slate"
                        active={status === 'all'}
                        onClick={() => handleFilterStatus('all')}
                    />
                </div>

                {/* ══════════════════════════════════════════════════
                    SEARCH & FILTER
                ══════════════════════════════════════════════════ */}
                <Card className="p-4 dark:bg-slate-800 dark:border-slate-700">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama desa..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                        <select
                            value={tahun}
                            onChange={(e) => setTahun(e.target.value)}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold focus:ring-2 focus:ring-teal-500"
                        >
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                        </select>
                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors"
                        >
                            Cari
                        </button>
                    </form>
                </Card>

                {/* ══════════════════════════════════════════════════
                    TABLE
                ══════════════════════════════════════════════════ */}
                <Card className="dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Menampilkan{' '}
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                                {data.from || 0}-{data.to || 0}
                            </span>{' '}
                            dari <span className="font-semibold">{data.total}</span> data
                        </p>
                    </div>

                    {data.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-700/50">
                                    <tr className="text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        <th className="px-4 py-3">No</th>
                                        <th className="px-4 py-3">Nama Desa</th>
                                        <th className="px-4 py-3 text-right">Dusun</th>
                                        <th className="px-4 py-3 text-right">KK</th>
                                        <th className="px-4 py-3 text-right">Jiwa</th>
                                        <th className="px-4 py-3 text-center">Status</th>
                                        <th className="px-4 py-3 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {data.data.map((item, idx) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                        >
                                            <td className="px-4 py-3 text-slate-500">
                                                {(data.from || 0) + idx}
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                                                {item.nama_desa || item.desa}
                                            </td>
                                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">
                                                {item.jumlah_dusun}
                                            </td>
                                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">
                                                {item.jumlah_kk}
                                            </td>
                                            <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">
                                                {item.jiwa_l + item.jiwa_p + item.jiwa_tidak_terpilah}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <StatusBadge status={item.kecamatan_status} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center gap-1">
                                                    {item.kecamatan_status === 'pending' && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleApprove(item)}
                                                                disabled={processing === item.id}
                                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                                                            >
                                                                {processing === item.id ? (
                                                                    <Loader2 size={12} className="animate-spin" />
                                                                ) : (
                                                                    <Check size={12} />
                                                                )}
                                                                Approve
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleOpenReject(item)}
                                                                disabled={processing === item.id}
                                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                                                            >
                                                                <X size={12} />
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}

                                                    {item.kecamatan_status === 'approved' && (
                                                        <span className="text-xs text-slate-400 italic">
                                                            Disetujui
                                                        </span>
                                                    )}

                                                    {item.kecamatan_status === 'rejected' && (
                                                        <span className="text-xs text-rose-500 italic max-w-[200px] truncate" title={item.kecamatan_rejected_reason || ''}>
                                                            {item.kecamatan_rejected_reason || 'Ditolak'}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-16 text-center">
                            <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                                <Users size={32} className="text-slate-300 dark:text-slate-600" />
                            </div>
                            <p className="text-base font-semibold text-slate-600 dark:text-slate-400">
                                Tidak ada data
                            </p>
                            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                                {status === 'pending'
                                    ? 'Semua data desa sudah direview ✅'
                                    : 'Belum ada data di kategori ini'}
                            </p>
                        </div>
                    )}

                    {/* PAGINATION */}
                    {data.last_page > 1 && (
                        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between flex-wrap gap-3">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Halaman {data.current_page} dari {data.last_page}
                            </p>
                            <div className="flex items-center gap-1">
                                {data.links?.map((link, idx) => {
                                    if (link.label === '&laquo; Previous' || link.label === 'Next &raquo;') {
                                        return null;
                                    }
                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => link.url && router.get(link.url)}
                                            className={`min-w-[32px] h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                                                link.active
                                                    ? 'bg-teal-600 text-white'
                                                    : link.url
                                                    ? 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'
                                                    : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                                            }`}
                                        >
                                            {link.label.replace(/&laquo;|&raquo;/g, '').trim()}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </Card>
            </div>

            {/* ══════════════════════════════════════════════════
                MODAL REJECT
            ══════════════════════════════════════════════════ */}
            {showRejectModal && selectedDesa && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setShowRejectModal(false);
                    }}
                >
                    <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                        <div className="p-5 border-b border-slate-200 dark:border-slate-700 bg-rose-50 dark:bg-rose-950/30">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400">
                                    <XCircle size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                        Tolak Data Desa
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {selectedDesa.nama_desa || selectedDesa.desa}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleRejectSubmit} className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                                    Alasan Penolakan *
                                </label>
                                <textarea
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    rows={4}
                                    required
                                    placeholder="Contoh: Jumlah KK tidak sesuai dengan data desa..."
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm focus:ring-2 focus:ring-rose-500"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowRejectModal(false)}
                                    className="px-4 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing === selectedDesa.id || !rejectReason.trim()}
                                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-colors disabled:opacity-50"
                                >
                                    {processing === selectedDesa.id ? (
                                        <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                        <X size={14} />
                                    )}
                                    Tolak Data
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminKecamatanLayout>
    );
}

// ══════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ══════════════════════════════════════════════════════════════

function StatCard({
    label,
    value,
    icon: Icon,
    color,
    active,
    onClick,
}: {
    label: string;
    value: number;
    icon: any;
    color: 'amber' | 'teal' | 'rose' | 'slate';
    active: boolean;
    onClick: () => void;
}) {
    const colorMap = {
        amber: 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
        teal: 'border-teal-200 dark:border-teal-900 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400',
        rose: 'border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
        slate: 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400',
    };

    return (
        <button
            type="button"
            onClick={onClick}
            className={`text-left p-4 rounded-xl border-2 transition-all ${
                active
                    ? colorMap[color] + ' ring-2 ring-offset-2 ring-current'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
            }`}
        >
            <div className="flex items-center justify-between mb-2">
                <Icon size={18} className={active ? '' : 'text-slate-400'} />
                <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                    {label}
                </span>
            </div>
            <p className="text-3xl font-bold">
                {value.toLocaleString('id-ID')}
            </p>
        </button>
    );
}
