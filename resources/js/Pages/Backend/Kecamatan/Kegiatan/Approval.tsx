import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminKecamatanLayout from '@/Components/Layout/AdminKecamatanLayout';
import {
    FileText,
    Check,
    X,
    Clock3,
    CheckSquare,
    Square,
    Search,
    Calendar,
    ChevronDown,
} from 'lucide-react';

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

type RecordRekap = {
    id: number;
    tahun: number;
    kecamatan: string | null;
    nama_kecamatan: string | null;
    desa: string | null;
    nama_desa: string | null;
    dusun: string | null;
    nama_dusun: string | null;
    rw: string | null;
    rt: string | null;
    jumlah_krt: number;
    jumlah_kk: number;
    total_l: number;
    total_p: number;
    balita_l: number;
    balita_p: number;
    pus: number;
    wus: number;
    ibu_hamil: number;
    ibu_menyusui: number;
    lansia: number;
    buta_l: number;
    buta_p: number;
    status: 'pending' | 'approved' | 'rejected';
    kecamatan_status: 'pending' | 'approved' | 'rejected';
    rejected_reason: string | null;
    kecamatan_rejected_reason: string | null;
    created_by_name: string | null;
    approved_by_name: string | null;
    kecamatan_approved_by_name: string | null;
};

type PaginationType = {
    data: RecordRekap[];
    current_page: number;
    last_page: number;
    total: number;
    links: Array<{ label: string; url: string | null; active: boolean }>;
};

type StatsType = {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
};

type FiltersType = {
    tahun: number;
    status: string;
    search: string;
};

interface ApprovalProps {
    kecamatan: string;
    data: PaginationType;
    stats: StatsType;
    filters: FiltersType;
    flash?: {
        success?: string | null;
        error?: string | null;
        warning?: string | null;
    };
}

const statusLabels = {
    pending: 'Menunggu',
    approved: 'Disetujui',
    rejected: 'Perlu Diperbaiki',
};

const currentYear = new Date().getFullYear();
const tahunOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

const formatAngka = (value: unknown): string =>
    Number(value || 0).toLocaleString('id-ID');

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export default function Approval({
    kecamatan,
    data,
    stats,
    filters,
    flash,
}: ApprovalProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [rejecting, setRejecting] = useState<RecordRekap | null>(null);
    const [reason, setReason] = useState('');
    const [busyId, setBusyId] = useState<number | null>(null);
    const [bulkBusy, setBulkBusy] = useState(false);

    const records = data?.data || [];

    const pendingRecords = records.filter((r) => r.kecamatan_status === 'pending');
    const pendingIds = pendingRecords.map((r) => r.id);

    const allSelected =
        pendingIds.length > 0 && pendingIds.every((id) => selectedIds.includes(id));

    const filter = (status: string, tahun: number = filters.tahun) => {
        router.get(
            '/kecamatan/data-pkk/kegiatan/approval',
            { status, tahun, search },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
    };

    const toggleAll = () => {
        if (allSelected) {
            setSelectedIds((prev) => prev.filter((id) => !pendingIds.includes(id)));
        } else {
            setSelectedIds((prev) => Array.from(new Set([...prev, ...pendingIds])));
        }
    };

    const approve = (record: RecordRekap) => {
        setBusyId(record.id);
        router.post(
            `/kecamatan/data-pkk/kegiatan/${record.id}/approve`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setBusyId(null),
            },
        );
    };

    const reject = () => {
        if (!rejecting || !reason.trim()) return;
        setBusyId(rejecting.id);
        router.post(
            `/kecamatan/data-pkk/kegiatan/${rejecting.id}/reject`,
            { reason },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setRejecting(null);
                    setReason('');
                },
                onFinish: () => setBusyId(null),
            },
        );
    };

    const bulkApprove = () => {
        if (selectedIds.length === 0) return;
        setBulkBusy(true);
        router.post(
            '/kecamatan/data-pkk/kegiatan/bulk-approve',
            { ids: selectedIds },
            {
                preserveScroll: true,
                onSuccess: () => setSelectedIds([]),
                onFinish: () => setBulkBusy(false),
            },
        );
    };

    return (
        <AdminKecamatanLayout>
            <Head title="Approval Rekap Kegiatan Warga" />

            <main className="mx-auto w-full max-w-7xl space-y-5 p-4 sm:p-6 lg:p-8">
                {/* ============================================================
                    HEADER
                ============================================================ */}
                <header>
                    <p className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                        Kecamatan {kecamatan}
                    </p>
                    <h1 className="mt-1 text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">
                        Approval Rekap Kegiatan Warga
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Data yang sudah disetujui Admin Desa, menunggu persetujuan Kecamatan.
                    </p>
                </header>

                {/* ============================================================
                    FLASH MESSAGES
                ============================================================ */}
                {flash?.success && (
                    <div
                        role="status"
                        className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
                    >
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div
                        role="alert"
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                    >
                        {flash.error}
                    </div>
                )}
                {flash?.warning && (
                    <div
                        role="alert"
                        className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
                    >
                        {flash.warning}
                    </div>
                )}

                {/* ============================================================
                    STATS CARDS
                ============================================================ */}
                <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <StatCard label="Total" value={stats.total} />
                    <StatCard label="Menunggu" value={stats.pending} accent="amber" />
                    <StatCard label="Disetujui" value={stats.approved} accent="emerald" />
                    <StatCard label="Perlu Diperbaiki" value={stats.rejected} accent="red" />
                </section>

                {/* ============================================================
                    FILTER BAR
                ============================================================ */}
                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        {/* Search */}
                        <div className="relative w-full lg:max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === 'Enter' && filter(filters.status, filters.tahun)
                                }
                                placeholder="Cari desa, dusun, RW, RT..."
                                aria-label="Cari rekap kegiatan"
                                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                            />
                        </div>

                        {/* Filter Tahun + Status */}
                        <div className="flex flex-wrap gap-2">
                            <div className="relative">
                                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <select
                                    value={filters.tahun}
                                    onChange={(e) =>
                                        filter(filters.status, Number(e.target.value))
                                    }
                                    aria-label="Filter tahun"
                                    className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm font-semibold text-slate-700 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                                >
                                    {tahunOptions.map((y) => (
                                        <option key={y} value={y}>
                                            {y}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            </div>

                            {[
                                ['pending', 'Menunggu'],
                                ['approved', 'Disetujui'],
                                ['rejected', 'Perlu Diperbaiki'],
                                ['all', 'Semua'],
                            ].map(([value, label]) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => filter(value, filters.tahun)}
                                    aria-pressed={filters.status === value}
                                    className={`rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
                                        filters.status === value
                                            ? 'bg-teal-700 text-white'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bulk Action Bar */}
                    {selectedIds.length > 0 && (
                        <div className="mt-3 flex items-center justify-between rounded-xl border border-teal-200 bg-teal-50 px-4 py-2.5 dark:border-teal-900 dark:bg-teal-950/40">
                            <p className="text-sm font-medium text-teal-800 dark:text-teal-300">
                                {selectedIds.length} data dipilih
                            </p>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedIds([])}
                                    className="rounded-lg px-3 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-100 dark:text-teal-300 dark:hover:bg-teal-900/40"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    disabled={bulkBusy}
                                    onClick={bulkApprove}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
                                >
                                    <Check className="h-3.5 w-3.5" />
                                    {bulkBusy
                                        ? 'Memproses...'
                                        : `Setujui ${selectedIds.length} Data`}
                                </button>
                            </div>
                        </div>
                    )}
                </section>

                {/* ============================================================
                    TABEL
                ============================================================ */}
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    {records.length === 0 ? (
                        <div className="px-6 py-16 text-center">
                            <FileText className="mx-auto h-10 w-10 text-slate-300" />
                            <h2 className="mt-3 font-semibold text-slate-800 dark:text-slate-100">
                                Belum ada data pada filter ini
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Data akan muncul setelah Admin Desa menyetujui rekap kegiatan.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-950">
                                    <tr className="text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        <th className="px-3 py-3 w-10">
                                            <button
                                                type="button"
                                                onClick={toggleAll}
                                                disabled={pendingIds.length === 0}
                                                aria-label="Pilih semua pending"
                                                className="text-slate-400 hover:text-teal-600 disabled:opacity-40"
                                            >
                                                {allSelected ? (
                                                    <CheckSquare className="h-4 w-4 text-teal-600" />
                                                ) : (
                                                    <Square className="h-4 w-4" />
                                                )}
                                            </button>
                                        </th>
                                        <th className="px-3 py-3">No</th>
                                        <th className="px-3 py-3">Desa</th>
                                        <th className="px-3 py-3">Dusun</th>
                                        <th className="px-3 py-3">RW</th>
                                        <th className="px-3 py-3">RT</th>
                                        <th className="px-3 py-3 text-right">KK</th>
                                        <th className="px-3 py-3 text-right">Jiwa (L/P)</th>
                                        <th className="px-3 py-3 text-right">UP2K</th>
                                        <th className="px-3 py-3 text-right">Pekarangan</th>
                                        <th className="px-3 py-3 text-center">Status</th>
                                        <th className="px-3 py-3 text-center whitespace-nowrap">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {records.map((item, idx) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-950/50"
                                        >
                                            {/* Checkbox */}
                                            <td className="px-3 py-3">
                                                {item.kecamatan_status === 'pending' && (
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleSelect(item.id)}
                                                        aria-label={`Pilih data ${item.id}`}
                                                        className="text-slate-400 hover:text-teal-600"
                                                    >
                                                        {selectedIds.includes(item.id) ? (
                                                            <CheckSquare className="h-4 w-4 text-teal-600" />
                                                        ) : (
                                                            <Square className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                )}
                                            </td>
                                            <td className="px-3 py-3 text-slate-500">
                                                {idx + 1}
                                            </td>
                                            <td className="px-3 py-3 font-semibold text-slate-700 dark:text-slate-300">
                                                {item.nama_desa || item.desa || '-'}
                                            </td>
                                            <td className="px-3 py-3 text-slate-700 dark:text-slate-300">
                                                {item.nama_dusun || item.dusun || '-'}
                                            </td>
                                            <td className="px-3 py-3 text-slate-700 dark:text-slate-300">
                                                {item.rw || '-'}
                                            </td>
                                            <td className="px-3 py-3 text-slate-700 dark:text-slate-300">
                                                {item.rt || '-'}
                                            </td>
                                            <td className="px-3 py-3 text-right text-slate-700 dark:text-slate-300">
                                                {formatAngka(item.jumlah_kk)}
                                            </td>
                                            <td className="px-3 py-3 text-right text-slate-700 dark:text-slate-300">
                                                {formatAngka(item.total_l)} /{' '}
                                                {formatAngka(item.total_p)}
                                            </td>
                                            <td className="px-3 py-3 text-right text-slate-700 dark:text-slate-300">
                                                {formatAngka((item as any).kegiatan_up2k)}
                                            </td>
                                            <td className="px-3 py-3 text-right text-slate-700 dark:text-slate-300">
                                                {formatAngka((item as any).kegiatan_tanah_pekarangan)}
                                            </td>
                                            <td className="px-3 py-3 text-center">
                                                <StatusBadge status={item.kecamatan_status} />
                                                {item.kecamatan_status === 'rejected' &&
                                                    item.kecamatan_rejected_reason && (
                                                        <p
                                                            className="mt-1 text-[10px] text-red-600 dark:text-red-400 max-w-[150px] truncate mx-auto"
                                                            title={item.kecamatan_rejected_reason}
                                                        >
                                                            {item.kecamatan_rejected_reason}
                                                        </p>
                                                    )}
                                            </td>
                                            <td className="px-3 py-3">
                                                {item.kecamatan_status === 'pending' && (
                                                    <div className="flex justify-center gap-1.5">
                                                        <button
                                                            type="button"
                                                            disabled={busyId === item.id}
                                                            onClick={() => approve(item)}
                                                            title="Setujui"
                                                            className="inline-flex items-center gap-1 rounded-lg bg-teal-700 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
                                                        >
                                                            <Check className="h-3.5 w-3.5" />
                                                            <span className="hidden lg:inline">
                                                                Setujui
                                                            </span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            disabled={busyId === item.id}
                                                            onClick={() => {
                                                                setRejecting(item);
                                                                setReason('');
                                                            }}
                                                            title="Tolak"
                                                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
                                                        >
                                                            <X className="h-3.5 w-3.5" />
                                                            <span className="hidden lg:inline">
                                                                Tolak
                                                            </span>
                                                        </button>
                                                    </div>
                                                )}
                                                {item.kecamatan_status === 'approved' &&
                                                    item.kecamatan_approved_by_name && (
                                                        <p className="text-center text-[10px] text-slate-500 dark:text-slate-400">
                                                            ✓ {item.kecamatan_approved_by_name}
                                                        </p>
                                                    )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {data.last_page > 1 && (
                        <nav
                            className="flex flex-wrap justify-center gap-1 border-t border-slate-100 p-4 dark:border-slate-800"
                            aria-label="Navigasi halaman"
                        >
                            {data.links.map((link, index) => (
                                <button
                                    key={`${link.label}-${index}`}
                                    type="button"
                                    disabled={!link.url}
                                    onClick={() =>
                                        link.url &&
                                        router.visit(link.url, { preserveScroll: true })
                                    }
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    aria-current={link.active ? 'page' : undefined}
                                    className={`min-w-9 rounded-lg px-3 py-2 text-sm ${
                                        link.active
                                            ? 'bg-teal-700 text-white'
                                            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                                    } disabled:cursor-not-allowed disabled:opacity-40`}
                                />
                            ))}
                        </nav>
                    )}
                </section>
            </main>

            {/* ============================================================
                MODAL REJECT
            ============================================================ */}
            {rejecting && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="reject-title"
                        className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-900"
                    >
                        <h2
                            id="reject-title"
                            className="text-lg font-bold text-slate-900 dark:text-slate-100"
                        >
                            Minta perbaikan data
                        </h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Tuliskan alasan agar Admin Desa tahu apa yang harus diperbaiki.
                        </p>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={4}
                            maxLength={2000}
                            autoFocus
                            className="mt-4 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                            placeholder="Contoh: Mohon periksa kembali jumlah KK dan anggota keluarga."
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setRejecting(null)}
                                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                disabled={!reason.trim() || busyId === rejecting.id}
                                onClick={reject}
                                className="rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-50"
                            >
                                Kirim Alasan
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </AdminKecamatanLayout>
    );
}

/* ============================================================
 * HELPER COMPONENTS
 * ============================================================ */

function StatCard({
    label,
    value,
    accent,
}: {
    label: string;
    value: number;
    accent?: 'amber' | 'emerald' | 'red';
}) {
    const styles = {
        amber:
            'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40',
        emerald:
            'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40',
        red: 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/40',
    };

    const textStyles = {
        amber: 'text-amber-700 dark:text-amber-300',
        emerald: 'text-emerald-700 dark:text-emerald-300',
        red: 'text-red-700 dark:text-red-300',
    };

    return (
        <div
            className={`rounded-2xl border p-4 ${
                accent
                    ? styles[accent]
                    : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
            }`}
        >
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {label}
            </p>
            <p
                className={`mt-1 text-2xl font-bold ${
                    accent ? textStyles[accent] : 'text-slate-900 dark:text-slate-100'
                }`}
            >
                {value.toLocaleString('id-ID')}
            </p>
        </div>
    );
}

function StatusBadge({ status }: { status: RecordRekap['kecamatan_status'] }) {
    const styles = {
        pending:
            'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
        approved:
            'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
        rejected: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
    };

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap ${styles[status]}`}
        >
            {status === 'pending' ? (
                <Clock3 className="h-3 w-3" />
            ) : status === 'approved' ? (
                <Check className="h-3 w-3" />
            ) : (
                <X className="h-3 w-3" />
            )}
            {statusLabels[status]}
        </span>
    );
}
