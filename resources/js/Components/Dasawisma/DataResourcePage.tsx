import { useState } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import { CheckCircle2, Clock3, FileText, XCircle } from "lucide-react";
import { toast } from "sonner";
import DasawismaLayout from "@/Components/Layout/DasawismaLayout";
import Toast from "@/Components/UI/Toast";
import ConfirmDelete from "./ConfirmDelete";
import DataTable from "./DataTable";
import EmptyState from "./EmptyState";
import FilterBar from "./FilterBar";
import ModalForm from "./ModalForm";
import Pagination from "./Pagination";
import StatsCard from "./StatsCard";
import type {
    DataColumn,
    DasawismaRecord,
    FieldOption,
    FormField,
    FormValues,
    PaginatedRecords,
    ResourceStats,
} from "./types";

export interface DataResourcePageProps {
    title: string;
    description: string;
    baseUrl: string;
    records: PaginatedRecords<DasawismaRecord>;
    stats: ResourceStats;
    fields: FormField[];
    columns: Record<string, string>;
    options: Record<string, FieldOption[]>;
    filters: { search: string; status: string };
    canManage: boolean;
    canApprove: boolean;
    notifications: Array<{ id: string; message: string; url: string; created_at: string | null }>;
}

function emptyValues(fields: FormField[]): FormValues {
    return fields.reduce<FormValues>((values, field) => {
        values[field.name] = field.name === "tahun" ? new Date().getFullYear() : field.type === "number" ? 0 : "";
        return values;
    }, {});
}

function normalizeRecord(record: DasawismaRecord, fields: FormField[]): FormValues {
    return fields.reduce<FormValues>((values, field) => {
        const value = record[field.name];
        values[field.name] = value === null || value === undefined ? "" : String(value).slice(0, field.type === "date" ? 10 : undefined);
        return values;
    }, {});
}

function labelFor(record: DasawismaRecord, columns: DataColumn[]): string {
    for (const column of columns) {
        const value = column.key.split(".").reduce<unknown>((current, key) => {
            if (current && typeof current === "object" && key in current) {
                return (current as Record<string, unknown>)[key];
            }
            return null;
        }, record);
        if (typeof value === "string" && value.trim()) return value;
    }
    return `data nomor ${record.id}`;
}

export default function DataResourcePage({
    title,
    description,
    baseUrl,
    records,
    stats,
    fields,
    columns,
    options,
    filters,
    canManage,
    canApprove,
    notifications,
}: DataResourcePageProps) {
    const [search, setSearch] = useState(filters.search);
    const [status, setStatus] = useState(filters.status);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [modal, setModal] = useState<"create" | "edit" | null>(null);
    const [importOpen, setImportOpen] = useState(false);
    const [detail, setDetail] = useState<DasawismaRecord | null>(null);
    const [deleteRecord, setDeleteRecord] = useState<DasawismaRecord | null>(null);
    const [rejectRecord, setRejectRecord] = useState<DasawismaRecord | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const dataForm = useForm<FormValues>(emptyValues(fields));
    const importForm = useForm<{ file: File | null; import: string }>({ file: null, import: "" });
    const dataColumns = Object.entries(columns).map(([key, label]) => ({ key, label })) as DataColumn[];

    const applyFilters = () => {
        setLoading(true);
        router.get(baseUrl, { search, status }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onFinish: () => setLoading(false),
        });
    };

    const openCreate = () => {
        dataForm.clearErrors();
        dataForm.setData(emptyValues(fields));
        setModal("create");
    };

    const openEdit = (record: DasawismaRecord) => {
        dataForm.clearErrors();
        dataForm.setData(normalizeRecord(record, fields));
        setModal("edit");
    };

    const saveRecord = () => {
        setSaving(true);
        dataForm.clearErrors();
        const options = {
            preserveScroll: true,
            onError: (errors: Record<string, string>) => dataForm.setError(errors),
            onSuccess: () => {
                setModal(null);
                setDetail(null);
                dataForm.reset();
            },
            onFinish: () => setSaving(false),
        };

        if (modal === "edit" && detail) {
            router.put(`${baseUrl}/${detail.id}`, dataForm.data, options);
        } else {
            router.post(baseUrl, dataForm.data, options);
        }
    };

    const deleteSelected = () => {
        if (!deleteRecord) return;
        setSaving(true);
        router.delete(`${baseUrl}/${deleteRecord.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteRecord(null),
            onFinish: () => setSaving(false),
        });
    };

    const approveRecord = (record: DasawismaRecord) => {
        router.post(`${baseUrl}/${record.id}/approve`, {}, { preserveScroll: true });
    };

    const rejectSelected = () => {
        if (!rejectRecord || !rejectReason.trim()) {
            toast.error("Alasan penolakan wajib diisi.");
            return;
        }
        setSaving(true);
        router.post(`${baseUrl}/${rejectRecord.id}/reject`, { reason: rejectReason }, {
            preserveScroll: true,
            onSuccess: () => {
                setRejectRecord(null);
                setRejectReason("");
            },
            onFinish: () => setSaving(false),
        });
    };

    const importRows = () => {
        if (!importForm.data.file) {
            importForm.setError("file", "Pilih file Excel terlebih dahulu.");
            return;
        }
        setSaving(true);
        importForm.clearErrors();
        router.post(`${baseUrl}/import`, importForm.data, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setImportOpen(false);
                importForm.reset();
            },
            onError: (errors: Record<string, string>) => importForm.setError(errors),
            onFinish: () => setSaving(false),
        });
    };

    const exportColumns = dataColumns.filter((column) => !column.key.startsWith("daftarWarga."));
    const recordLabel = deleteRecord ? labelFor(deleteRecord, dataColumns) : "";

    return (
        <DasawismaLayout>
            <Head title={title} />
            <Toast />
            <main className="mx-auto w-full max-w-[1600px] space-y-6 p-4 font-['Poppins',_sans-serif] sm:p-6 lg:p-8">
                <header className="flex flex-col gap-3">
                    <nav className="text-xs font-medium text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
                        <span>Dasawisma</span><span className="mx-2" aria-hidden="true">/</span><span className="text-teal-700 dark:text-teal-300">{title}</span>
                    </nav>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">{title}</h1>
                        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
                    </div>
                </header>

                {notifications.length > 0 && (
                    <section className="rounded-2xl border border-teal-200 bg-teal-50/70 p-4 dark:border-teal-900 dark:bg-teal-950/30" aria-label="Notifikasi belum dibaca">
                        <h2 className="text-sm font-semibold text-teal-950 dark:text-teal-100">Pembaruan terbaru</h2>
                        <ul className="mt-2 divide-y divide-teal-200/70 dark:divide-teal-900">
                            {notifications.map((notification) => (
                                <li key={notification.id} className="flex flex-col gap-1 py-2 text-sm sm:flex-row sm:items-center sm:justify-between">
                                    <span className="text-teal-950 dark:text-teal-100">{notification.message}</span>
                                    <span className="text-xs text-teal-800/70 dark:text-teal-300">{notification.created_at ?? "Baru saja"}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Ringkasan status data">
                    <StatsCard label="Total data" value={stats.total} icon={FileText} />
                    <StatsCard label="Menunggu persetujuan" value={stats.pending} icon={Clock3} tone="amber" />
                    <StatsCard label="Disetujui" value={stats.approved} icon={CheckCircle2} tone="green" />
                    <StatsCard label="Perlu diperbaiki" value={stats.rejected} icon={XCircle} tone="rose" />
                </section>

                <FilterBar
                    search={search}
                    status={status}
                    canManage={canManage}
                    onSearchChange={setSearch}
                    onStatusChange={setStatus}
                    onSubmit={applyFilters}
                    onCreate={openCreate}
                    onImport={() => {
                        importForm.clearErrors();
                        setImportOpen(true);
                    }}
                    exportUrl={`${baseUrl}/export`}
                    templateUrl={`${baseUrl}/template`}
                />

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900" aria-label={`Tabel ${title}`}>
                    {records.data.length === 0 && !loading ? (
                        <EmptyState canAdd={canManage} onAdd={openCreate} />
                    ) : (
                        <>
                            <DataTable
                                rows={records.data}
                                columns={exportColumns}
                                canManage={canManage}
                                canApprove={canApprove}
                                loading={loading}
                                onView={setDetail}
                                onEdit={(record) => {
                                    setDetail(record);
                                    openEdit(record);
                                }}
                                onDelete={setDeleteRecord}
                                onApprove={approveRecord}
                                onReject={(record) => {
                                    setRejectRecord(record);
                                    setRejectReason("");
                                }}
                            />
                            <Pagination links={records.links} currentPage={records.current_page} lastPage={records.last_page} />
                        </>
                    )}
                </section>
            </main>

            {modal && (
                <ModalForm
                    title={modal === "create" ? `Tambah ${title}` : `Ubah ${title}`}
                    fields={fields}
                    options={options}
                    values={dataForm.data}
                    errors={dataForm.errors}
                    processing={saving}
                    onChange={(name, value) => dataForm.setData(name, value)}
                    onClose={() => setModal(null)}
                    onSubmit={saveRecord}
                />
            )}

            {detail && !modal && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDetail(null); }}>
                    <section className="max-h-[90vh] w-full overflow-y-auto rounded-t-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:max-w-2xl sm:rounded-2xl" role="dialog" aria-modal="true" aria-labelledby="detail-title">
                        <div className="flex items-start justify-between gap-4">
                            <div><p className="text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">Detail data</p><h2 id="detail-title" className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">{labelFor(detail, dataColumns)}</h2></div>
                            <button type="button" onClick={() => setDetail(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600 dark:hover:bg-slate-800" aria-label="Tutup detail">×</button>
                        </div>
                        {detail.rejected_reason && <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-800 dark:bg-rose-950/40 dark:text-rose-300">Catatan kecamatan: {detail.rejected_reason}</p>}
                        <dl className="mt-5 grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
                            {dataColumns.map((column) => {
                                const value = column.key.split(".").reduce<unknown>((current, key) => current && typeof current === "object" && key in current ? (current as Record<string, unknown>)[key] : null, detail);
                                return <div key={column.key} className="border-b border-slate-100 pb-3 dark:border-slate-800"><dt className="text-xs font-medium text-slate-500 dark:text-slate-400">{column.label}</dt><dd className="mt-1 break-words text-sm text-slate-900 dark:text-slate-100">{value === null || value === undefined || value === "" ? "—" : String(value)}</dd></div>;
                            })}
                        </dl>
                    </section>
                </div>
            )}

            <ConfirmDelete
                open={Boolean(deleteRecord)}
                label={recordLabel}
                processing={saving}
                onCancel={() => setDeleteRecord(null)}
                onConfirm={deleteSelected}
            />

            {importOpen && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-4" role="presentation">
                    <section className="w-full rounded-t-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:max-w-lg sm:rounded-2xl" role="dialog" aria-modal="true" aria-labelledby="import-title">
                        <h2 id="import-title" className="text-lg font-semibold text-slate-900 dark:text-slate-100">Import Excel — {title}</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Gunakan template halaman ini. Kolom header harus mengikuti nama yang ada pada file template.</p>
                        <label className="mt-5 block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="import-file">File Excel (.xlsx, .xls, .csv)
                            <input id="import-file" type="file" accept=".xlsx,.xls,.csv" onChange={(event) => importForm.setData("file", event.target.files?.[0] ?? null)} className="mt-2 block w-full rounded-xl border border-slate-200 bg-white p-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-teal-50 file:px-3 file:py-2 file:font-semibold file:text-teal-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200" aria-describedby="import-error" />
                        </label>
                        {importForm.errors.file && <p id="import-error" className="mt-2 text-sm text-rose-600" role="alert">{importForm.errors.file}</p>}
                        {importForm.errors.import && <div className="mt-3 max-h-32 overflow-y-auto rounded-xl bg-rose-50 p-3 text-sm text-rose-800 dark:bg-rose-950/40 dark:text-rose-300" role="alert">{importForm.errors.import}</div>}
                        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <button type="button" onClick={() => setImportOpen(false)} className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">Batal</button>
                            <button type="button" disabled={saving} onClick={importRows} className="min-h-11 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">{saving ? "Mengimpor..." : "Impor data"}</button>
                        </div>
                    </section>
                </div>
            )}

            {rejectRecord && (
                <div className="fixed inset-0 z-[105] flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-4" role="presentation">
                    <section className="w-full rounded-t-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:max-w-lg sm:rounded-2xl" role="dialog" aria-modal="true" aria-labelledby="reject-title">
                        <h2 id="reject-title" className="text-lg font-semibold text-slate-900 dark:text-slate-100">Minta perbaikan</h2>
                        <label htmlFor="reject-reason" className="mt-4 block text-sm font-medium text-slate-700 dark:text-slate-300">Alasan penolakan
                            <textarea id="reject-reason" value={rejectReason} onChange={(event) => setRejectReason(event.target.value)} rows={4} maxLength={2000} required className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100" />
                        </label>
                        <div className="mt-5 flex justify-end gap-2">
                            <button type="button" onClick={() => setRejectRecord(null)} className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">Batal</button>
                            <button type="button" disabled={saving} onClick={rejectSelected} className="min-h-11 rounded-xl bg-rose-600 px-4 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60">{saving ? "Mengirim..." : "Kirim alasan"}</button>
                        </div>
                    </section>
                </div>
            )}
        </DasawismaLayout>
    );
}
