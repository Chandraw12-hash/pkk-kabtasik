import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Users,
    UserCog,
    Search,
    ChevronDown,
    ChevronUp,
    User,
    Crown,
    Heart,
    BookOpen,
    Home as HomeIcon,
    Activity,
    Upload,
    X,
    FileSpreadsheet,
    CheckCircle2,
    Loader2,
    Info,
} from "lucide-react";

// ============================================================
// INTERFACE
// ============================================================

interface PengurusItem {
    id: number;
    nama: string;
    jabatan: string;
    kategori: string;
    pokja?: string | null;
    foto?: string | null;
    urutan: number;
    is_active: boolean;
    deskripsi?: string | null;
    created_at: string;
    updated_at: string;
}

interface IndexProps {
    pengurus: {
        ketua: PengurusItem[];
        pimpinan_inti: PengurusItem[];
        pokja_i: PengurusItem[];
        pokja_ii: PengurusItem[];
        pokja_iii: PengurusItem[];
        pokja_iv: PengurusItem[];
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

// ============================================================
// KONFIGURASI KATEGORI
// ============================================================

const KATEGORI_LABEL: Record<string, string> = {
    ketua: "Ketua TP PKK",
    pimpinan_inti: "Pimpinan Inti",
    pokja_i: "Pokja I",
    pokja_ii: "Pokja II",
    pokja_iii: "Pokja III",
    pokja_iv: "Pokja IV",
};

const KATEGORI_ICON: Record<string, React.ReactNode> = {
    ketua: <Crown size={16} className="text-yellow-600" />,
    pimpinan_inti: <UserCog size={16} className="text-blue-600" />,
    pokja_i: <Heart size={16} className="text-rose-500" />,
    pokja_ii: <BookOpen size={16} className="text-green-600" />,
    pokja_iii: <HomeIcon size={16} className="text-orange-500" />,
    pokja_iv: <Activity size={16} className="text-teal-600" />,
};

const KATEGORI_COLOR: Record<string, string> = {
    ketua: "bg-yellow-50 border-yellow-200",
    pimpinan_inti: "bg-blue-50 border-blue-200",
    pokja_i: "bg-rose-50 border-rose-200",
    pokja_ii: "bg-green-50 border-green-200",
    pokja_iii: "bg-orange-50 border-orange-200",
    pokja_iv: "bg-teal-50 border-teal-200",
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function Index({ pengurus, flash }: IndexProps) {
    const [expandedKategori, setExpandedKategori] = useState<Record<string, boolean>>({
        ketua: true,
        pimpinan_inti: true,
        pokja_i: true,
        pokja_ii: true,
        pokja_iii: true,
        pokja_iv: true,
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [showImportModal, setShowImportModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // ========================================================
    // HANDLERS
    // ========================================================
    const toggleKategori = (key: string) => {
        setExpandedKategori((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleDelete = (id: number, nama: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus pengurus "${nama}"?`)) {
            router.delete(`/dashboard/struktur-organisasi/${id}`);
        }
    };

    const handleToggleStatus = (id: number) => {
        router.patch(`/dashboard/struktur-organisasi/${id}/toggle-status`);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleImport = () => {
        if (!selectedFile) {
            alert("Pilih file Excel terlebih dahulu!");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", selectedFile);

        router.post("/dashboard/struktur-organisasi/import", formData, {
            onSuccess: () => {
                setIsUploading(false);
                setShowImportModal(false);
                setSelectedFile(null);
            },
            onError: () => {
                setIsUploading(false);
            },
        });
    };

    const closeImportModal = () => {
        if (!isUploading) {
            setShowImportModal(false);
            setSelectedFile(null);
        }
    };

    // ========================================================
    // HELPERS
    // ========================================================
    const totalPengurus = Object.values(pengurus).reduce(
        (acc, items) => acc + items.length,
        0
    );

    const filteredPengurus = (items: PengurusItem[]) => {
        if (!searchTerm) return items;
        return items.filter(
            (item) =>
                item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.jabatan.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    // ========================================================
    // RENDER
    // ========================================================
    return (
        <MainLayout>
            <Head title="Struktur Organisasi - Manajemen Pengurus" />

            <div className="py-6">
                {/* Flash Message */}
                {flash?.success && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
                        <CheckCircle2 size={16} />
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                        <X size={16} />
                        {flash.error}
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Struktur Organisasi
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Kelola data pengurus TP PKK Kabupaten Tasikmalaya
                        </p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-sm text-slate-600">
                            <Users size={16} />
                            <span className="font-semibold">{totalPengurus}</span>
                            <span className="text-slate-400">Pengurus</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowImportModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            <Upload size={18} />
                            Import Excel
                        </button>
                        <Link
                            href="/dashboard/struktur-organisasi/create"
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            <Plus size={18} />
                            Tambah Pengurus
                        </Link>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative max-w-sm">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cari pengurus..."
                            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                        />
                    </div>
                </div>

                {/* Pengurus List by Kategori */}
                <div className="space-y-4">
                    {Object.entries(pengurus).map(([key, items]) => {
                        const filtered = filteredPengurus(items);
                        const isExpanded = expandedKategori[key];
                        const hasItems = filtered.length > 0;

                        if (!hasItems && key !== "ketua") return null;

                        return (
                            <div
                                key={key}
                                className={`border rounded-xl overflow-hidden ${
                                    KATEGORI_COLOR[key] || "bg-white border-slate-200"
                                }`}
                            >
                                {/* Header Kategori */}
                                <button
                                    type="button"
                                    onClick={() => toggleKategori(key)}
                                    className="w-full flex items-center justify-between px-5 py-3 hover:bg-black/5 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        {KATEGORI_ICON[key]}
                                        <span className="font-semibold text-slate-800">
                                            {KATEGORI_LABEL[key] || key}
                                        </span>
                                        <span className="text-xs text-slate-400 bg-white/60 px-2 py-0.5 rounded-full">
                                            {filtered.length}
                                        </span>
                                    </div>
                                    {isExpanded ? (
                                        <ChevronUp size={18} className="text-slate-400" />
                                    ) : (
                                        <ChevronDown size={18} className="text-slate-400" />
                                    )}
                                </button>

                                {/* Konten Kategori */}
                                {isExpanded && (
                                    <div className="p-4 pt-0 border-t border-slate-200/50">
                                        {filtered.length === 0 ? (
                                            <p className="text-sm text-slate-400 text-center py-6">
                                                {searchTerm
                                                    ? "Tidak ada pengurus yang cocok dengan pencarian"
                                                    : "Belum ada pengurus di kategori ini"}
                                            </p>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {filtered.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="bg-white rounded-lg border border-slate-200 p-4 flex items-start gap-4 hover:shadow-sm transition-shadow"
                                                    >
                                                        {/* Foto */}
                                                        <div className="w-14 h-14 rounded-full bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200">
                                                            {item.foto ? (
                                                                <img
                                                                    src={`/storage/${item.foto}`}
                                                                    alt={item.nama}
                                                                    className="w-full h-full object-cover object-top"
                                                                    onError={(e) => {
                                                                        (
                                                                            e.target as HTMLImageElement
                                                                        ).style.display = "none";
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                                    <User size={22} />
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold text-sm text-slate-900 truncate">
                                                                {item.nama}
                                                            </p>
                                                            <p className="text-xs text-slate-500 truncate">
                                                                {item.jabatan}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                                                <span
                                                                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                                                                        item.is_active
                                                                            ? "bg-green-100 text-green-700"
                                                                            : "bg-red-100 text-red-700"
                                                                    }`}
                                                                >
                                                                    {item.is_active
                                                                        ? "Aktif"
                                                                        : "Nonaktif"}
                                                                </span>
                                                                {item.pokja && (
                                                                    <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                                                                        Pokja {item.pokja}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex flex-col gap-1 flex-shrink-0">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleToggleStatus(item.id)
                                                                }
                                                                className={`p-1.5 rounded-lg transition-colors ${
                                                                    item.is_active
                                                                        ? "text-green-600 hover:bg-green-50"
                                                                        : "text-red-600 hover:bg-red-50"
                                                                }`}
                                                                title={
                                                                    item.is_active
                                                                        ? "Nonaktifkan"
                                                                        : "Aktifkan"
                                                                }
                                                            >
                                                                {item.is_active ? (
                                                                    <Eye size={14} />
                                                                ) : (
                                                                    <EyeOff size={14} />
                                                                )}
                                                            </button>
                                                            <Link
                                                                href={`/dashboard/struktur-organisasi/${item.id}/edit`}
                                                                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                                                                title="Edit"
                                                            >
                                                                <Edit size={14} />
                                                            </Link>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDelete(item.id, item.nama)
                                                                }
                                                                className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                                                title="Hapus"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {totalPengurus === 0 && (
                    <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                        <Users size={48} className="text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-700">
                            Belum Ada Data Pengurus
                        </h3>
                        <p className="text-sm text-slate-400 mt-1">
                            Tambahkan pengurus pertama untuk mulai mengisi struktur organisasi.
                        </p>
                        <div className="flex items-center justify-center gap-3 mt-4">
                            <Link
                                href="/dashboard/struktur-organisasi/create"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                <Plus size={16} />
                                Tambah Pengurus
                            </Link>
                            <button
                                type="button"
                                onClick={() => setShowImportModal(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                <Upload size={16} />
                                Import Excel
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ============================================================
                MODAL IMPORT EXCEL
            ============================================================ */}
            {showImportModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) closeImportModal();
                    }}
                >
                    <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <FileSpreadsheet size={18} className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        Import Data Excel
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Upload file struktur organisasi
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={closeImportModal}
                                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                                disabled={isUploading}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-4">
                            {/* Panduan */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Info size={14} className="text-blue-600" />
                                    <p className="font-semibold text-sm text-blue-700">
                                        Panduan Format
                                    </p>
                                </div>
                                <ul className="space-y-1 text-xs text-blue-700">
                                    <li>• Format file: .xlsx, .xls, .csv</li>
                                    <li>
                                        • Kolom: nama, jabatan, kategori, pokja, urutan,
                                        is_active, deskripsi
                                    </li>
                                    <li>
                                        • Kategori: ketua, pimpinan_inti, pokja_i, pokja_ii,
                                        pokja_iii, pokja_iv
                                    </li>
                                    <li>• Pokja: I, II, III, IV (khusus kategori pokja)</li>
                                    <li>• is_active: 1 = Aktif, 0 = Nonaktif</li>
                                </ul>
                            </div>

                            {/* File Input */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Pilih File Excel
                                </label>
                                <input
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 transition-colors"
                                    disabled={isUploading}
                                />
                                {selectedFile && (
                                    <div className="flex items-center gap-2 text-xs text-green-600 mt-2">
                                        <CheckCircle2 size={14} />
                                        <span>
                                            {selectedFile.name} (
                                            {(selectedFile.size / 1024).toFixed(1)} KB)
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
                            <button
                                type="button"
                                onClick={closeImportModal}
                                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                                disabled={isUploading}
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleImport}
                                disabled={!selectedFile || isUploading}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Mengimport...
                                    </>
                                ) : (
                                    <>
                                        <Upload size={16} />
                                        Import
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
