import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import { Head, useForm, router } from "@inertiajs/react";
import {
    Database,
    Download,
    Trash2,
    Plus,
    HardDrive,
    Table2,
    Rows3,
    Clock,
    Shield,
    AlertTriangle,
    FileText,
    RefreshCw,
    Server,
    CheckCircle,
    Upload,
    RotateCcw,
} from "lucide-react";

declare function route(name: string, params?: unknown): string;

interface Backup {
    filename: string;
    size: number;
    size_human: string;
    created_at: string;
    created_by: string;
    description: string;
    db_name: string;
    tables_count: number;
    checksum_sha256?: string | null;
}

interface TopTable {
    name: string;
    rows: number;
}

interface DbStats {
    tables_count: number;
    total_rows: number;
    db_size: number;
    db_size_human: string;
    top_tables: TopTable[];
}

interface DbInfo {
    connection: string;
    database: string;
    host: string;
}

interface BackupIndexProps {
    backups: Backup[];
    dbInfo: DbInfo;
    dbStats: DbStats;
}

export default function BackupIndex({
    backups,
    dbInfo,
    dbStats,
}: BackupIndexProps) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
    const [showTablesModal, setShowTablesModal] = useState(false);
    const [showRestoreModal, setShowRestoreModal] = useState<string | null>(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [restoreConfirm, setRestoreConfirm] = useState("");
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadDesc, setUploadDesc] = useState("");

    const createForm = useForm({
        description: "",
    });

    const restoreForm = useForm({
        filename: "",
        confirmation: "",
    });

    const uploadForm = useForm<{ file: File | null; description: string }>({
        file: null as unknown as File,
        description: "",
    });

    const deleteForm = useForm({});

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route("be.backup.store"), {
            onSuccess: () => {
                setShowCreateModal(false);
                createForm.reset();
            },
        });
    };

    const handleDelete = (filename: string) => {
        deleteForm.delete(route("be.backup.destroy", { filename }), {
            onSuccess: () => setShowDeleteModal(null),
        });
    };

    const openRestore = (filename: string) => {
        setRestoreConfirm("");
        restoreForm.setData({ filename, confirmation: "" });
        setShowRestoreModal(filename);
    };

    const handleRestore = (e: React.FormEvent) => {
        e.preventDefault();
        restoreForm.post(route("be.backup.restore"), {
            onSuccess: () => {
                setShowRestoreModal(null);
                setRestoreConfirm("");
            },
        });
    };

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadFile) return;
        uploadForm.setData("file", uploadFile);
        uploadForm.setData("description", uploadDesc);
        uploadForm.post(route("be.backup.upload"), {
            forceFormData: true,
            onSuccess: () => {
                setShowUploadModal(false);
                setUploadFile(null);
                setUploadDesc("");
            },
        });
    };

    const formatDate = (dateStr: string) => {
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <MainLayout>
            <Head title="Backup Database" />

            {/* ═══════════════════════════════════════════════ */}
            {/* HEADER */}
            {/* ═══════════════════════════════════════════════ */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl text-white shadow-lg shadow-violet-500/25">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                            Backup & Restore
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Kelola backup database — Khusus Super Admin
                        </p>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════ */}
            {/* STAT CARDS */}
            {/* ═══════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* DB Connection */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
                            <Server
                                size={18}
                                className="text-emerald-600 dark:text-emerald-400"
                            />
                        </div>
                        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            Database
                        </span>
                    </div>
                    <p className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate">
                        {dbInfo.database}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                        {dbInfo.connection.toUpperCase()} · {dbInfo.host}
                    </p>
                </div>

                {/* DB Size */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                            <HardDrive
                                size={18}
                                className="text-blue-600 dark:text-blue-400"
                            />
                        </div>
                        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            Ukuran DB
                        </span>
                    </div>
                    <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                        {dbStats.db_size_human}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                        Total ukuran database
                    </p>
                </div>

                {/* Tables */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                            <Table2
                                size={18}
                                className="text-amber-600 dark:text-amber-400"
                            />
                        </div>
                        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            Tabel
                        </span>
                    </div>
                    <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                        {dbStats.tables_count}
                    </p>
                    <button
                        onClick={() => setShowTablesModal(true)}
                        className="text-xs text-teal-600 dark:text-teal-400 hover:underline mt-1 cursor-pointer"
                    >
                        Lihat detail tabel →
                    </button>
                </div>

                {/* Total Rows */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-violet-50 dark:bg-violet-900/30 rounded-lg">
                            <Rows3
                                size={18}
                                className="text-violet-600 dark:text-violet-400"
                            />
                        </div>
                        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            Total Data
                        </span>
                    </div>
                    <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                        {dbStats.total_rows.toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                        Baris di semua tabel
                    </p>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════ */}
            {/* BACKUP LIST */}
            {/* ═══════════════════════════════════════════════ */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Database
                            size={20}
                            className="text-teal-600 dark:text-teal-400"
                        />
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                Daftar Backup
                            </h2>
                            <p className="text-xs text-slate-400">
                                {backups.length} backup tersedia
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() =>
                                router.reload({ only: ["backups", "dbStats"] })
                            }
                            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors cursor-pointer"
                        >
                            <RefreshCw size={16} />
                            Refresh
                        </button>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors cursor-pointer"
                        >
                            <Upload size={16} />
                            Upload
                        </button>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 rounded-xl shadow-md shadow-teal-500/25 transition-all cursor-pointer"
                        >
                            <Plus size={16} />
                            Buat Backup
                        </button>
                    </div>
                </div>

                {/* Table */}
                {backups.length === 0 ? (
                    <div className="px-6 py-16 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4">
                            <Database
                                size={28}
                                className="text-slate-400"
                            />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">
                            Belum ada backup
                        </p>
                        <p className="text-sm text-slate-400 mt-1">
                            Klik "Buat Backup" untuk membuat backup pertama
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50/80 dark:bg-slate-800/50">
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        File
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Ukuran
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Dibuat
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Oleh
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {backups.map((backup) => (
                                    <tr
                                        key={backup.filename}
                                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-teal-50 dark:bg-teal-900/30 rounded-lg shrink-0">
                                                    <FileText
                                                        size={16}
                                                        className="text-teal-600 dark:text-teal-400"
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[260px]">
                                                        {backup.filename}
                                                    </p>
                                                    {backup.description && (
                                                        <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[260px]">
                                                            {
                                                                backup.description
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                                                <HardDrive size={12} />
                                                {backup.size_human}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
                                                <Clock
                                                    size={14}
                                                    className="text-slate-400"
                                                />
                                                <span>
                                                    {formatDate(
                                                        backup.created_at
                                                    )}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-600 dark:text-slate-300">
                                                {backup.created_by}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() =>
                                                        openRestore(
                                                            backup.filename
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-lg transition-colors cursor-pointer"
                                                    title="Restore database dari file ini"
                                                >
                                                    <RotateCcw size={14} />
                                                    <span className="hidden sm:inline">
                                                        Restore
                                                    </span>
                                                </button>
                                                <a
                                                    href={route(
                                                        "be.backup.download",
                                                        {
                                                            filename:
                                                                backup.filename,
                                                        }
                                                    )}
                                                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/30 hover:bg-teal-100 dark:hover:bg-teal-900/50 rounded-lg transition-colors"
                                                    title="Download"
                                                >
                                                    <Download size={14} />
                                                    <span className="hidden sm:inline">
                                                        Download
                                                    </span>
                                                </a>
                                                <button
                                                    onClick={() =>
                                                        setShowDeleteModal(
                                                            backup.filename
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-lg transition-colors cursor-pointer"
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={14} />
                                                    <span className="hidden sm:inline">
                                                        Hapus
                                                    </span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ═══════════════════════════════════════════════ */}
            {/* MODAL: BUAT BACKUP */}
            {/* ═══════════════════════════════════════════════ */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setShowCreateModal(false)}
                    />
                    <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-2xl w-full max-w-md p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2.5 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl text-white">
                                <Database size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                    Buat Backup Baru
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Export seluruh database PostgreSQL
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleCreate}>
                            <div className="mb-5">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Keterangan{" "}
                                    <span className="text-slate-400">
                                        (opsional)
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    value={createForm.data.description}
                                    onChange={(e) =>
                                        createForm.setData(
                                            "description",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Contoh: Backup sebelum update fitur..."
                                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all placeholder:text-slate-400"
                                />
                            </div>

                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4 mb-5">
                                <div className="flex gap-2.5">
                                    <AlertTriangle
                                        size={16}
                                        className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
                                    />
                                    <div className="text-xs text-amber-700 dark:text-amber-300">
                                        <p className="font-semibold mb-1">
                                            Perhatian
                                        </p>
                                        <p>
                                            Proses backup mungkin memerlukan
                                            waktu beberapa saat tergantung
                                            ukuran database. Jangan tutup
                                            halaman selama proses berlangsung.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={createForm.processing}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 rounded-xl shadow-md shadow-teal-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {createForm.processing ? (
                                        <>
                                            <RefreshCw
                                                size={16}
                                                className="animate-spin"
                                            />
                                            Memproses...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle size={16} />
                                            Buat Backup Sekarang
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════ */}
            {/* MODAL: HAPUS BACKUP */}
            {/* ═══════════════════════════════════════════════ */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setShowDeleteModal(null)}
                    />
                    <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-2xl w-full max-w-sm p-6 text-center">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-rose-50 dark:bg-rose-900/30 rounded-2xl mb-4">
                            <Trash2
                                size={24}
                                className="text-rose-500 dark:text-rose-400"
                            />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
                            Hapus Backup?
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                            File backup ini akan dihapus permanen:
                        </p>
                        <p className="text-xs font-mono text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg mb-6 break-all">
                            {showDeleteModal}
                        </p>

                        <div className="flex items-center gap-3 justify-center">
                            <button
                                onClick={() => setShowDeleteModal(null)}
                                className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => handleDelete(showDeleteModal)}
                                disabled={deleteForm.processing}
                                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 rounded-xl shadow-md shadow-rose-500/25 transition-all disabled:opacity-50 cursor-pointer"
                            >
                                {deleteForm.processing ? (
                                    <>
                                        <RefreshCw
                                            size={16}
                                            className="animate-spin"
                                        />
                                        Menghapus...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={16} />
                                        Ya, Hapus
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════ */}
            {/* MODAL: RESTORE BACKUP */}
            {/* ═══════════════════════════════════════════════ */}
            {showRestoreModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setShowRestoreModal(null)}
                    />
                    <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-2xl w-full max-w-md p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl text-white">
                                <RotateCcw size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                    Restore Database
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Data sekarang akan diganti total
                                </p>
                            </div>
                        </div>

                        <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/40 rounded-xl p-4 mb-5">
                            <div className="flex gap-2.5">
                                <AlertTriangle
                                    size={16}
                                    className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5"
                                />
                                <div className="text-xs text-rose-700 dark:text-rose-300">
                                    <p className="font-semibold mb-1">
                                        Bahaya — baca dulu
                                    </p>
                                    <p>
                                        Restore menimpa seluruh database.
                                        Sistem otomatis menyimpan backup
                                        pengaman dulu. Ketik nama file persis
                                        untuk konfirmasi.
                                    </p>
                                    <p className="font-mono mt-2 break-all bg-white/60 dark:bg-slate-900/60 px-2 py-1 rounded">
                                        {showRestoreModal}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleRestore}>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Ketik ulang nama file
                            </label>
                            <input
                                type="text"
                                value={restoreConfirm}
                                onChange={(e) => {
                                    setRestoreConfirm(e.target.value);
                                    restoreForm.setData(
                                        "confirmation",
                                        e.target.value
                                    );
                                }}
                                placeholder={showRestoreModal}
                                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all placeholder:text-slate-400 mb-5"
                            />
                            <div className="flex items-center gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowRestoreModal(null)}
                                    className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={
                                        restoreForm.processing ||
                                        restoreConfirm !== showRestoreModal
                                    }
                                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl shadow-md shadow-amber-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {restoreForm.processing ? (
                                        <>
                                            <RefreshCw
                                                size={16}
                                                className="animate-spin"
                                            />
                                            Merestore...
                                        </>
                                    ) : (
                                        <>
                                            <RotateCcw size={16} />
                                            Ya, Restore Sekarang
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════ */}
            {/* MODAL: UPLOAD BACKUP */}
            {/* ═══════════════════════════════════════════════ */}
            {showUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setShowUploadModal(false)}
                    />
                    <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-2xl w-full max-w-md p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl text-white">
                                <Upload size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                    Upload Backup
                                </h3>
                                <p className="text-xs text-slate-400">
                                    File .sql maksimal 512 MB
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleUpload}>
                            <input
                                type="file"
                                accept=".sql,.txt"
                                onChange={(e) =>
                                    setUploadFile(
                                        e.target.files?.[0] ?? null
                                    )
                                }
                                className="w-full text-sm text-slate-600 dark:text-slate-300 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-300 mb-4"
                            />
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Keterangan (opsional)
                            </label>
                            <input
                                type="text"
                                value={uploadDesc}
                                onChange={(e) => setUploadDesc(e.target.value)}
                                placeholder="Contoh: backup dari server lama..."
                                className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-slate-400 mb-5"
                            />
                            <div className="flex items-center gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowUploadModal(false)}
                                    className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={
                                        uploadForm.processing || !uploadFile
                                    }
                                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 rounded-xl shadow-md shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {uploadForm.processing ? (
                                        <>
                                            <RefreshCw
                                                size={16}
                                                className="animate-spin"
                                            />
                                            Mengupload...
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={16} />
                                            Upload Sekarang
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════ */}
            {/* MODAL: DETAIL TABEL */}
            {/* ═══════════════════════════════════════════════ */}
            {showTablesModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setShowTablesModal(false)}
                    />
                    <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
                        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                                    <Table2
                                        size={18}
                                        className="text-amber-600 dark:text-amber-400"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                        Top 10 Tabel
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                        Diurutkan berdasarkan jumlah baris
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowTablesModal(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="overflow-y-auto p-4 space-y-2">
                            {dbStats.top_tables.map((table, idx) => (
                                <div
                                    key={table.name}
                                    className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="text-xs font-bold text-slate-400 w-6 text-right shrink-0">
                                            {idx + 1}.
                                        </span>
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                                            {table.name}
                                        </span>
                                    </div>
                                    <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 px-2.5 py-1 rounded-full shrink-0">
                                        {table.rows.toLocaleString("id-ID")}{" "}
                                        rows
                                    </span>
                                </div>
                            ))}
                            {dbStats.top_tables.length === 0 && (
                                <p className="text-center text-sm text-slate-400 py-8">
                                    Tidak ada data tabel.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
