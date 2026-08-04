import React, { useState, useEffect } from "react";
import MainLayout from "@/Layouts/MainLayout";
import Card from "@/Components/UI/Card";
import Table from "@/Components/Data/Table";
import Button from "@/Components/UI/Button";
import TextInput from "@/Components/Form/TextInput";
import Pagination from "@/Components/Data/Pagination";
import ConfirmationModal from "@/Components/UI/ConfirmationModal";
import Modal from "@/Components/UI/Modal";
import { Head, useForm, router, usePage } from "@inertiajs/react";
import {
    Edit2,
    Trash2,
    Search,
    Plus,
    Save,
    FileUp,
    FileDown,
    Download,
    Upload,
    RotateCcw,
} from "lucide-react";
import { PaginatedData } from "@/types/model";
import axios from "axios";

interface Indikator {
    id: number;
    nama_indikator: string;
}

interface IndexProps {
    indikators: PaginatedData<Indikator>;
    filters: {
        search?: string;
        per_page?: number | string;
    };
}

export default function Index({ indikators, filters }: IndexProps) {
    const { permissions } = usePage<any>().props.auth || { permissions: [] }; // Fallback permissions
    const [search, setSearch] = useState(filters.search || "");
    const [perPage, setPerPage] = useState(filters.per_page || 10);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedIndikator, setSelectedIndikator] =
        useState<Indikator | null>(null);

    // Import Modal State
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importFile, setImportFile] = useState<File | null>(null);

    // Confirmation Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Indikator | null>(null);

    // File Import Ref
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Form Hook
    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        nama_indikator: "",
    });
    const [localIndikators, setLocalIndikators] =
        useState<PaginatedData<Indikator>>(indikators);
    const [isLoading, setIsLoading] = useState(false);
    const isFirstRender = React.useRef(true);

    const fetchData = (url: string, params: any = {}) => {
        setIsLoading(true);
        axios
            .get(url, { params, headers: { Accept: "application/json" } })
            .then((res) => {
                setLocalIndikators(res.data);
            })
            .catch((err) => console.error("Error fetching data:", err))
            .finally(() => setIsLoading(false));
    };

    // Search Debounce
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            fetchData(route("be.indikator.index"), {
                search,
                per_page: perPage,
            });
        }, 300);
        return () => clearTimeout(timeout);
    }, [search, perPage]);

    // Handlers
    const openCreateModal = () => {
        setIsEditMode(false);
        setSelectedIndikator(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (item: Indikator) => {
        setIsEditMode(true);
        setSelectedIndikator(item);
        setData("nama_indikator", item.nama_indikator);
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditMode && selectedIndikator) {
            put(route("be.indikator.update", selectedIndikator.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route("be.indikator.store"), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const openDeleteModal = (item: Indikator) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (!itemToDelete) return;

        destroy(route("be.indikator.destroy", itemToDelete.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setItemToDelete(null);
            },
        });
    };

    const handleExport = () => {
        window.location.href = route("be.indikator.export");
    };

    const handleImportClick = () => {
        setIsImportModalOpen(true);
        setImportFile(null);
    };

    const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImportFile(e.target.files[0]);
        }
    };

    const handleImportSubmit = () => {
        if (!importFile) return;

        const formData = new FormData();
        formData.append("file", importFile);

        router.post(route("be.indikator.import"), formData, {
            forceFormData: true,
            onSuccess: () => {
                setIsImportModalOpen(false);
                setImportFile(null);
                // Optional: Show success notification
            },
            onError: (errors) => {
                // Handle errors if needed
            },
        });
    };

    const closeImportModal = () => {
        setIsImportModalOpen(false);
        setImportFile(null);
    };

    return (
        <>
            <Head title="Manajemen Indikator" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Manajemen Indikator
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Kelola data indikator SPBE
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="warning"
                        onClick={handleExport}
                        className="shadow-lg shadow-indigo-100"
                    >
                        <span>Export Excel</span>
                    </Button>
                    <Button
                        variant="success"
                        onClick={handleImportClick}
                        className="shadow-lg shadow-green-100"
                    >
                        <span>Import</span>
                    </Button>
                    <Button
                        variant="primary"
                        onClick={openCreateModal}
                        className="shadow-lg shadow-indigo-100 dark:shadow-none"
                    >
                        <span>Tambah Indikator</span>
                    </Button>
                </div>
            </div>

            <Card className="dark:bg-slate-800 dark:border-slate-700 dark:shadow-slate-700/50">
                <div className="p-6 border-b border-slate-50 dark:border-slate-700 flex items-center gap-4">
                    <div className="relative w-full max-w-md">
                        <TextInput
                            iconLeft={<Search size={18} />}
                            className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            containerClassName="relative w-full"
                            placeholder="Cari indikator..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {search && (
                        <Button
                            variant="danger"
                            onClick={() => {
                                setSearch("");
                                setPerPage(10);
                            }}
                            className="flex items-center gap-2"
                        >
                            <RotateCcw size={16} />
                            <span>Reset</span>
                        </Button>
                    )}
                </div>

                {/* Tabel */}
                <Table
                    isLoading={isLoading}
                    columns={[
                        {
                            header: "#",
                            className:
                                "text-center text-sm font-medium text-slate-400 dark:text-slate-200 w-16",
                            headerClassName: "text-center w-16",
                            render: (_: Indikator, index: number) =>
                                (localIndikators.current_page - 1) *
                                    localIndikators.per_page +
                                index +
                                1,
                        },
                        {
                            header: "Nama Indikator",
                            className:
                                "text-slate-600 font-medium dark:text-slate-200",
                            render: (item: Indikator) => item.nama_indikator,
                        },
                        {
                            header: "Aksi",
                            headerClassName: "text-center w-32",
                            className: "text-center",
                            render: (item: Indikator) => (
                                <div className="flex items-center justify-center gap-2">
                                    {permissions.includes("edit-indikator") && (
                                        <button
                                            onClick={() => openEditModal(item)}
                                            className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl active:scale-90 transition-all cursor-pointer"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                    )}
                                    {permissions.includes(
                                        "delete-indikator",
                                    ) && (
                                        <button
                                            onClick={() =>
                                                openDeleteModal(item)
                                            }
                                            className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl active:scale-90 transition-all cursor-pointer"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ),
                        },
                    ]}
                    data={localIndikators.data}
                />

                {/* Pagination Section */}
                <div className="p-6 border-t border-slate-50 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/20 dark:bg-slate-700/20">
                    {/* Kiri: Info Data */}
                    <p className="text-sm text-slate-500 dark:text-slate-200">
                        Menampilkan{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localIndikators.from ?? 0}
                        </span>{" "}
                        sampai{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localIndikators.to ?? 0}
                        </span>{" "}
                        dari{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localIndikators.total}
                        </span>{" "}
                        data
                    </p>

                    {/* Tengah: Per Page Selector */}
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                        <span>Tampilkan</span>
                        <select
                            value={perPage}
                            onChange={(e) =>
                                setPerPage(parseInt(e.target.value))
                            }
                            className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-3 focus:ring-brand-green-500/10 focus:border-brand-green-500 block py-1.5 px-3 transition-all outline-none cursor-pointer dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>

                    {/* Kanan: Pagination */}
                    <Pagination
                        links={localIndikators.links}
                        onPageChange={(url) => fetchData(url)}
                    />
                </div>
            </Card>

            {/* Modal Form */}
            <Modal
                show={isModalOpen}
                onClose={closeModal}
                title={isEditMode ? "Edit Indikator" : "Tambah Indikator"}
                maxWidth="xl"
                footer={
                    <>
                        <Button
                            variant="secondary"
                            onClick={closeModal}
                            disabled={processing}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSubmit}
                            disabled={processing}
                        >
                            {processing ? "Menyimpan" : "Simpan"}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">
                            Nama Indikator
                        </label>
                        <TextInput
                            type="text"
                            value={data.nama_indikator}
                            onChange={(e) =>
                                setData("nama_indikator", e.target.value)
                            }
                            className="w-full text-sm"
                            error={errors.nama_indikator}
                        />
                    </div>
                </form>
            </Modal>

            {/* Modal Import */}
            <Modal
                show={isImportModalOpen}
                onClose={closeImportModal}
                title="Import Data Indikator"
                maxWidth="lg"
                footer={
                    <>
                        <Button
                            variant="secondary"
                            onClick={closeImportModal}
                            disabled={false}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleImportSubmit}
                            disabled={!importFile}
                            className="flex items-center gap-2"
                        >
                            <Upload size={16} />
                            Import Data
                        </Button>
                    </>
                }
            >
                <div className="space-y-6">
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800/50 text-amber-800 dark:text-amber-200 text-sm">
                        <p className="font-semibold mb-1">Perhatian!</p>
                        <ul className="list-disc list-inside space-y-1 opacity-90">
                            <li>
                                Pastikan format file sesuai dengan template.
                            </li>
                            <li>Gunakan file Excel (.xlsx, .xls) atau CSV.</li>
                        </ul>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            1. Unduh Template
                        </label>
                        <a
                            href="/sample_indikator_import.csv"
                            download
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors w-full justify-center"
                        >
                            <Download size={16} className="text-indigo-500" />
                            Download Template Import
                        </a>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            2. Upload File
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                id="import-file"
                                className="hidden"
                                accept=".xlsx,.xls,.csv"
                                onChange={handleImportFileChange}
                            />
                            <label
                                htmlFor="import-file"
                                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                                    importFile
                                        ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-500/50"
                                        : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700/50 dark:hover:border-slate-500"
                                }`}
                            >
                                {importFile ? (
                                    <div className="text-center">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mx-auto mb-2 text-indigo-600 dark:text-indigo-400">
                                            <FileUp size={20} />
                                        </div>
                                        <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300 truncate max-w-[200px]">
                                            {importFile.name}
                                        </p>
                                        <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-1">
                                            {(importFile.size / 1024).toFixed(
                                                2,
                                            )}{" "}
                                            KB
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-center text-slate-500 dark:text-slate-400">
                                        <Upload
                                            size={24}
                                            className="mx-auto mb-2 opacity-50"
                                        />
                                        <p className="text-sm">
                                            Klik untuk upload file
                                        </p>
                                        <p className="text-xs opacity-70 mt-1">
                                            XLSX, XLS, CSV
                                        </p>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Modal Konfirmasi Hapus */}
            <ConfirmationModal
                show={showDeleteModal}
                processing={processing}
                title="Hapus Indikator"
                message={`Apakah Anda yakin ingin menghapus indikator "${itemToDelete?.nama_indikator}"? Tindakan ini tidak dapat dibatalkan.`}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </>
    );
}

Index.layout = (page: React.ReactNode) => <MainLayout>{page}</MainLayout>;
