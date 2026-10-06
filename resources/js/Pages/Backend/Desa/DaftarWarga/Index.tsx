import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { Check, Clock3, FileText, Search, X } from "lucide-react";
import AdminDesaLayout from "@/Components/Layout/AdminDesaLayout";

type DaftarWarga = {
    id: number;
    nama_kepala_keluarga: string;
    nik: string | null;
    no_kk: string | null;
    dusun: string | null;
    rt: string | null;
    rw: string | null;
    dasawisma: string | null;
    alamat: string | null;
    jumlah_anggota: number;
    jumlah_kk: number;
    jumlah_laki_laki: number;
    jumlah_perempuan: number;
    status: "pending" | "approved" | "rejected";
    rejected_reason: string | null;
    created_by_name: string | null;
    approved_by_name: string | null;
};

type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    links: Array<{ label: string; url: string | null; active: boolean }>;
};

type Props = {
    records: Paginated<DaftarWarga>;
    stats: { total: number; pending: number; approved: number; rejected: number };
    filters: { search: string; status: string };
    flash?: { success?: string | null; error?: string | null };
};

const statusLabels = {
    pending: "Menunggu",
    approved: "Disetujui",
    rejected: "Perlu diperbaiki",
};

export default function Index({ records, stats, filters, flash }: Props) {
    const [search, setSearch] = useState(filters.search);
    const [rejecting, setRejecting] = useState<DaftarWarga | null>(null);
    const [reason, setReason] = useState("");
    const [busyId, setBusyId] = useState<number | null>(null);

    const filter = (status: string, nextSearch = search) => {
        router.get("/desa/daftar-warga", { status, search: nextSearch }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const approve = (record: DaftarWarga) => {
        setBusyId(record.id);
        router.post(`/desa/daftar-warga/${record.id}/approve`, {}, {
            preserveScroll: true,
            onFinish: () => setBusyId(null),
        });
    };

    const reject = () => {
        if (!rejecting || !reason.trim()) return;
        setBusyId(rejecting.id);
        router.post(`/desa/daftar-warga/${rejecting.id}/reject`, { reason }, {
            preserveScroll: true,
            onSuccess: () => {
                setRejecting(null);
                setReason("");
            },
            onFinish: () => setBusyId(null),
        });
    };

    return (
        <AdminDesaLayout>
            <Head title="Persetujuan Data KK" />
            <main className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
                <header>
                    <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">Data Dasawisma</p>
                    <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
                        Persetujuan Data KK
                    </h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Tinjau data yang dikirim petugas Dasawisma untuk wilayah desa ini.
                    </p>
                </header>

                {flash?.success && (
                    <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                        {flash.error}
                    </div>
                )}

                <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Ringkasan status">
                    <Stat label="Semua data" value={stats.total} />
                    <Stat label="Menunggu" value={stats.pending} accent />
                    <Stat label="Disetujui" value={stats.approved} />
                    <Stat label="Perlu diperbaiki" value={stats.rejected} />
                </section>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex flex-col gap-3 border-b border-slate-100 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full sm:max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                onKeyDown={(event) => event.key === "Enter" && filter(filters.status)}
                                placeholder="Cari nama, NIK, No. KK..."
                                aria-label="Cari data warga"
                                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2" aria-label="Filter status">
                            {[
                                ["pending", "Menunggu"],
                                ["approved", "Disetujui"],
                                ["rejected", "Perlu diperbaiki"],
                                ["all", "Semua"],
                            ].map(([value, label]) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => filter(value)}
                                    aria-pressed={filters.status === value}
                                    className={`rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
                                        filters.status === value
                                            ? "bg-teal-700 text-white"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {records.data.length === 0 ? (
                        <div className="px-6 py-16 text-center">
                            <FileText className="mx-auto h-10 w-10 text-slate-300" />
                            <h2 className="mt-3 font-semibold text-slate-800 dark:text-slate-100">Belum ada data pada filter ini</h2>
                            <p className="mt-1 text-sm text-slate-500">Data KK dari petugas Dasawisma akan muncul di sini.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {records.data.map((record) => (
                                <article key={record.id} className="p-4 sm:p-5">
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                                    {record.nama_kepala_keluarga}
                                                </h2>
                                                <StatusBadge status={record.status} />
                                            </div>
                                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                {record.dusun || "Dusun —"} · RT {record.rt || "—"}/RW {record.rw || "—"}
                                                {record.dasawisma ? ` · Dasa Wisma ${record.dasawisma}` : ""}
                                            </p>
                                            <div className="mt-3 grid gap-x-6 gap-y-1 text-sm text-slate-700 dark:text-slate-300 sm:grid-cols-2">
                                                <p>No. KK: <span className="font-medium">{record.no_kk || "—"}</span></p>
                                                <p>NIK: <span className="font-medium">{record.nik || "—"}</span></p>
                                                <p>Jumlah anggota: <span className="font-medium">{record.jumlah_anggota} (L {record.jumlah_laki_laki}, P {record.jumlah_perempuan}, belum terpilah {Math.max(0, record.jumlah_anggota - record.jumlah_laki_laki - record.jumlah_perempuan)})</span></p>
                                                <p>Pengirim: <span className="font-medium">{record.created_by_name || "Petugas Dasawisma"}</span></p>
                                                <p className="sm:col-span-2">Alamat: <span className="font-medium">{record.alamat || "—"}</span></p>
                                            </div>
                                            {record.rejected_reason && (
                                                <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                                                    Alasan perbaikan sebelumnya: {record.rejected_reason}
                                                </p>
                                            )}
                                        </div>
                                        {record.status === "pending" && (
                                            <div className="flex shrink-0 gap-2">
                                                <button
                                                    type="button"
                                                    disabled={busyId === record.id}
                                                    onClick={() => approve(record)}
                                                    className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-3 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
                                                >
                                                    <Check className="h-4 w-4" /> Setujui
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={busyId === record.id}
                                                    onClick={() => { setRejecting(record); setReason(""); }}
                                                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                                                >
                                                    <X className="h-4 w-4" /> Tolak
                                                </button>
                                            </div>
                                        )}
                                        {record.status === "approved" && record.approved_by_name && (
                                            <p className="text-xs text-slate-500">Disetujui oleh {record.approved_by_name}</p>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    {records.last_page > 1 && (
                        <nav className="flex flex-wrap justify-center gap-1 border-t border-slate-100 p-4 dark:border-slate-800" aria-label="Navigasi halaman">
                            {records.links.map((link, index) => (
                                <button
                                    key={`${link.label}-${index}`}
                                    type="button"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.visit(link.url, { preserveScroll: true })}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    aria-current={link.active ? "page" : undefined}
                                    className={`min-w-9 rounded-lg px-3 py-2 text-sm ${
                                        link.active ? "bg-teal-700 text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                    } disabled:cursor-not-allowed disabled:opacity-40`}
                                />
                            ))}
                        </nav>
                    )}
                </section>
            </main>

            {rejecting && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="reject-title"
                        className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-900"
                    >
                        <h2 id="reject-title" className="text-lg font-bold text-slate-900 dark:text-slate-100">Minta perbaikan data</h2>
                        <p className="mt-1 text-sm text-slate-500">Tuliskan alasan agar petugas Dasawisma tahu apa yang harus diperbaiki.</p>
                        <textarea
                            value={reason}
                            onChange={(event) => setReason(event.target.value)}
                            rows={4}
                            maxLength={2000}
                            autoFocus
                            className="mt-4 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                            placeholder="Contoh: Mohon periksa kembali nomor KK."
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <button type="button" onClick={() => setRejecting(null)} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                                Batal
                            </button>
                            <button type="button" disabled={!reason.trim() || busyId === rejecting.id} onClick={reject} className="rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-50">
                                Kirim alasan
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </AdminDesaLayout>
    );
}

function Stat({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
    return (
        <div className={`rounded-2xl border p-4 ${accent ? "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40" : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"}`}>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p>
            <p className={`mt-1 text-2xl font-bold ${accent ? "text-amber-700 dark:text-amber-300" : "text-slate-900 dark:text-slate-100"}`}>{value.toLocaleString("id-ID")}</p>
        </div>
    );
}

function StatusBadge({ status }: { status: DaftarWarga["status"] }) {
    const styles = {
        pending: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
        approved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
        rejected: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
    };
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
            {status === "pending" ? <Clock3 className="h-3.5 w-3.5" /> : status === "approved" ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
            {statusLabels[status]}
        </span>
    );
}
