import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    FileText,
    Check,
    X,
    Clock3,
    CheckSquare,
    Square,
} from 'lucide-react';

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

type RecordRT = {
    id: number;
    tahun: number;
    kecamatan: string | null;
    desa: string | null;
    dusun: string | null;
    nama_dusun: string | null;
    rw: string | null;
    rt: string | null;
    nama_dasawisma?: string | null;
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
    rumah_sehat: number;
    rumah_kurang_sehat: number;
    memiliki_tempat_sampah: number;
    memiliki_spal: number;
    memiliki_stiker_p4k: number;
    air_pdam: number;
    air_sumur: number;
    air_sungai: number;
    air_dll: number;
    jumlah_jamban_keluarga: number;
    makanan_pokok_beras: number;
    makanan_pokok_non_beras: number;
    kegiatan_up2k: number;
    kegiatan_tanah_pekarangan: number;
    kegiatan_industri_rumah_tangga: number;
    kegiatan_kesehatan_lingkungan: number;
    keterangan: string | null;
    status: 'pending' | 'approved' | 'rejected';
    rejected_reason: string | null;
    created_by_name: string | null;
    approved_by_name: string | null;
};

type PaginationType = {
    data: RecordRT[];
    current_page: number;
    last_page: number;
    total: number;
    links: Array<{ label: string; url: string | null; active: boolean }>;
};

interface TabRTProps {
    data: RecordRT[];
    pagination?: PaginationType;
    level?: string;
}

// ══════════════════════════════════════════════════════════════
// KONFIGURASI KOLOM
// ══════════════════════════════════════════════════════════════

const NUMERIC_COLUMNS: { label: string; key: keyof RecordRT }[] = [
    { label: 'Jml KRT', key: 'jumlah_krt' },
    { label: 'Jumlah KK', key: 'jumlah_kk' },
    { label: 'Total L', key: 'total_l' },
    { label: 'Total P', key: 'total_p' },
    { label: 'Balita L', key: 'balita_l' },
    { label: 'Balita P', key: 'balita_p' },
    { label: 'PUS', key: 'pus' },
    { label: 'WUS', key: 'wus' },
    { label: 'Ibu Hamil', key: 'ibu_hamil' },
    { label: 'Ibu Menyusui', key: 'ibu_menyusui' },
    { label: 'Lansia', key: 'lansia' },
    { label: '3 Buta L', key: 'buta_l' },
    { label: '3 Buta P', key: 'buta_p' },
    { label: 'Sehat/Layak Huni', key: 'rumah_sehat' },
    { label: 'Tidak Sehat', key: 'rumah_kurang_sehat' },
    { label: 'Tempat Sampah', key: 'memiliki_tempat_sampah' },
    { label: 'SPAL', key: 'memiliki_spal' },
    { label: 'Stiker P4K', key: 'memiliki_stiker_p4k' },
    { label: 'PDAM', key: 'air_pdam' },
    { label: 'Sumur', key: 'air_sumur' },
    { label: 'Sungai', key: 'air_sungai' },
    { label: 'DLL', key: 'air_dll' },
    { label: 'Jamban', key: 'jumlah_jamban_keluarga' },
    { label: 'Beras', key: 'makanan_pokok_beras' },
    { label: 'Non Beras', key: 'makanan_pokok_non_beras' },
    { label: 'UP2K', key: 'kegiatan_up2k' },
    { label: 'Tanah Pekarangan', key: 'kegiatan_tanah_pekarangan' },
    { label: 'Industri RT', key: 'kegiatan_industri_rumah_tangga' },
    { label: 'Kesling', key: 'kegiatan_kesehatan_lingkungan' },
];

const statusLabels = {
    pending: 'Menunggu',
    approved: 'Disetujui',
    rejected: 'Perlu Diperbaiki',
};

const formatAngka = (value: unknown): string =>
    Number(value || 0).toLocaleString('id-ID');

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export default function TabRT({ data }: TabRTProps) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [rejecting, setRejecting] = useState<RecordRT | null>(null);
    const [reason, setReason] = useState('');
    const [busyId, setBusyId] = useState<number | null>(null);
    const [bulkBusy, setBulkBusy] = useState(false);

    if (!data || data.length === 0) {
        return (
            <div className="p-16 text-center">
                <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                </div>
                <p className="text-base font-semibold text-slate-600 dark:text-slate-400">
                    Belum Ada Data Level RT
                </p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                    Import data dari file Excel
                </p>
            </div>
        );
    }

    const pendingIds = data
        .filter((r) => r.status === 'pending')
        .map((r) => r.id);

    const allSelected =
        pendingIds.length > 0 && pendingIds.every((id) => selectedIds.includes(id));

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

    const approve = (record: RecordRT) => {
        setBusyId(record.id);
        router.post(
            `/desa/kegiatan/${record.id}/approve`,
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
            `/desa/kegiatan/${rejecting.id}/reject`,
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
            '/desa/kegiatan/bulk-approve',
            { ids: selectedIds },
            {
                preserveScroll: true,
                onSuccess: () => setSelectedIds([]),
                onFinish: () => setBulkBusy(false),
            },
        );
    };

    return (
        <div className="space-y-3">
            {/* ══════════════════════════════════════════════
                BULK ACTION BAR
            ══════════════════════════════════════════════ */}
            {selectedIds.length > 0 && (
                <div className="flex items-center justify-between rounded-xl border border-teal-200 bg-teal-50 px-4 py-2.5 dark:border-teal-900 dark:bg-teal-950/40">
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
                            {bulkBusy ? 'Memproses...' : `Setujui ${selectedIds.length} Data`}
                        </button>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════
                TABEL
            ══════════════════════════════════════════════ */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
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
                            <th className="px-3 py-3">Dusun</th>
                            <th className="px-3 py-3">RW</th>
                            <th className="px-3 py-3">RT</th>
                            {NUMERIC_COLUMNS.map((col) => (
                                <th key={col.key as string} className="px-3 py-3 text-right whitespace-nowrap">
                                    {col.label}
                                </th>
                            ))}
                            <th className="px-3 py-3">Ket</th>
                            <th className="px-3 py-3 text-center whitespace-nowrap">Status</th>
                            <th className="px-3 py-3 text-center whitespace-nowrap">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {data.map((item, idx) => (
                            <tr
                                key={item.id ?? idx}
                                className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                            >
                                {/* Checkbox */}
                                <td className="px-3 py-3">
                                    {item.status === 'pending' && (
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
                                <td className="px-3 py-3 text-slate-500">{idx + 1}</td>
                                <td className="px-3 py-3 text-slate-700 dark:text-slate-300">
                                    {item.nama_dasawisma || item.nama_dusun || item.dusun || '-'}
                                </td>
                                <td className="px-3 py-3 text-slate-700 dark:text-slate-300">
                                    {item.rw || '-'}
                                </td>
                                <td className="px-3 py-3 text-slate-700 dark:text-slate-300">
                                    {item.rt || '-'}
                                </td>
                                {NUMERIC_COLUMNS.map((col) => (
                                    <td
                                        key={col.key as string}
                                        className="px-3 py-3 text-right text-slate-700 dark:text-slate-300"
                                    >
                                        {formatAngka(item[col.key])}
                                    </td>
                                ))}
                                <td className="px-3 py-3 text-slate-700 dark:text-slate-300 text-xs">
                                    {item.keterangan || '-'}
                                </td>
                                <td className="px-3 py-3 text-center">
                                    <StatusBadge status={item.status} />
                                    {item.status === 'rejected' && item.rejected_reason && (
                                        <p
                                            className="mt-1 text-[10px] text-red-600 dark:text-red-400 max-w-[150px] truncate mx-auto"
                                            title={item.rejected_reason}
                                        >
                                            {item.rejected_reason}
                                        </p>
                                    )}
                                </td>
                                <td className="px-3 py-3">
                                    {item.status === 'pending' && (
                                        <div className="flex justify-center gap-1.5">
                                            <button
                                                type="button"
                                                disabled={busyId === item.id}
                                                onClick={() => approve(item)}
                                                title="Setujui"
                                                className="inline-flex items-center gap-1 rounded-lg bg-teal-700 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
                                            >
                                                <Check className="h-3.5 w-3.5" />
                                                <span className="hidden lg:inline">Setujui</span>
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
                                                <span className="hidden lg:inline">Tolak</span>
                                            </button>
                                        </div>
                                    )}
                                    {item.status === 'approved' && item.approved_by_name && (
                                        <p className="text-center text-[10px] text-slate-500 dark:text-slate-400">
                                            ✓ {item.approved_by_name}
                                        </p>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ══════════════════════════════════════════════
                MODAL REJECT
            ══════════════════════════════════════════════ */}
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
                            Tuliskan alasan agar petugas Dasawisma tahu apa yang harus diperbaiki.
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
        </div>
    );
}

// ══════════════════════════════════════════════════════════════
// HELPER COMPONENT
// ══════════════════════════════════════════════════════════════

function StatusBadge({ status }: { status: RecordRT['status'] }) {
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
