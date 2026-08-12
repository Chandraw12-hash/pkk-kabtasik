import React, { useState, useEffect, useRef } from "react";
import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import ConfirmationModal from "@/Components/UI/ConfirmationModal";
import Table from "@/Components/Data/Table";
import Pagination from "@/Components/Data/Pagination";
import Card from "@/Components/UI/Card";
import { Head, Link, useForm, router } from "@inertiajs/react";
import {
    Search,
    Edit2,
    Trash2,
    RotateCcw,
    Plus,
    Upload,
    FileSpreadsheet,
    X,
} from "lucide-react";
import axios from "axios";

export default function Index({ sekretariats, filters = {} }: any) {
    const [search, setSearch] = useState(filters.search || "");
    const [perPage, setPerPage] = useState(filters.per_page || 10);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const [showImportModal, setShowImportModal] = useState(false);
    const [importFile, setImportFile] = useState<File | null>(null);
    const [importing, setImporting] = useState(false);

    const [localData, setLocalData] = useState({
        ...sekretariats,
        data: sekretariats?.data || [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const isFirstRender = useRef(true);

    const { delete: destroy, processing } = useForm({});

    const fetchData = (url: string, params: any = {}) => {
        setIsLoading(true);
        axios
            .get(url, { params, headers: { Accept: "application/json" } })
            .then((res) => {
                if (res.data && typeof res.data === "object" && "data" in res.data) {
                    setLocalData(res.data);
                }
            })
            .catch((err) => console.error(err))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const timeout = setTimeout(() => {
            fetchData(route("be.sekretariat.index"), {
                search,
                per_page: perPage,
            });
        }, 300);
        return () => clearTimeout(timeout);
    }, [search, perPage]);

    useEffect(() => {
        if (sekretariats) {
            setLocalData({
                ...sekretariats,
                data: sekretariats?.data || [],
            });
        }
    }, [sekretariats]);

    const openDeleteModal = (item: any) => {
        setSelectedItem(item);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (!selectedItem) return;
        destroy(route("be.sekretariat.destroy", selectedItem.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedItem(null);
                fetchData(route("be.sekretariat.index"), {
                    search,
                    per_page: perPage,
                });
            },
        });
    };

    const handleImport = (e: React.FormEvent) => {
        e.preventDefault();
        if (!importFile) return;

        const formData = new FormData();
        formData.append("file", importFile);
        setImporting(true);

        router.post(route("be.sekretariat.import"), formData, {
            forceFormData: true,
            onSuccess: () => {
                setShowImportModal(false);
                setImportFile(null);
                fetchData(route("be.sekretariat.index"), {
                    search,
                    per_page: perPage,
                });
            },
            onFinish: () => setImporting(false),
        });
    };

    return (
        <MainLayout>
            <Head title="Manajemen Data Sekretariat" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Manajemen Data Sekretariat
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Kelola data statistik Sekretariat per kecamatan
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        onClick={() => setShowImportModal(true)}
                        className="flex items-center gap-2"
                    >
                        <Upload size={16} />
                        <span>Import Excel</span>
                    </Button>
                    <Button
                        variant="primary"
                        href={route("be.sekretariat.create")}
                        className="flex items-center gap-2"
                    >
                        <Plus size={16} />
                        <span>Tambah Data</span>
                    </Button>
                </div>
            </div>

            <Card className="dark:bg-slate-800 dark:border-slate-700">
                <div className="p-6 border-b border-slate-50 dark:border-slate-700 flex items-center gap-4">
                    <div className="relative w-full max-w-md">
                        <TextInput
                            iconLeft={<Search size={18} />}
                            placeholder="Cari kecamatan..."
                            className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            containerClassName="relative w-full"
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

                <Table
                    isLoading={isLoading}
                    columns={[
                        {
                            header: "#",
                            className: "text-center w-14",
                            headerClassName: "text-center w-14",
                            render: (_: any, index: number) => {
                                const currentPage = localData.current_page ?? 1;
                                const perPageVal = localData.per_page ?? 10;
                                return (currentPage - 1) * perPageVal + index + 1;
                            },
                        },
                        {
                            header: "Kecamatan",
                            render: (item: any) => (
                                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                    {item.kecamatan || "-"}
                                </span>
                            ),
                        },
                        {
                            header: "PKK RW",
                            className: "text-center",
                            headerClassName: "text-center",
                            render: (item: any) => item.jumlah_pkk_rw ?? 0,
                        },
                        {
                            header: "PKK RT",
                            className: "text-center",
                            headerClassName: "text-center",
                            render: (item: any) => item.jumlah_pkk_rt ?? 0,
                        },
                        {
                            header: "Dasawisma",
                            className: "text-center",
                            headerClassName: "text-center",
                            render: (item: any) => item.jumlah_dasa_wisma ?? 0,
                        },
                        {
                            header: "KK",
                            className: "text-center",
                            headerClassName: "text-center",
                            render: (item: any) => item.jumlah_kk ?? 0,
                        },
                        {
                            header: "Jiwa (L/P)",
                            className: "text-center",
                            headerClassName: "text-center",
                            render: (item: any) =>
                                `${item.jiwa_l ?? 0} / ${item.jiwa_p ?? 0}`,
                        },
                        {
                            header: "Kader Umum",
                            className: "text-center",
                            headerClassName: "text-center",
                            render: (item: any) =>
                                (item.kader_umum_l ?? 0) + (item.kader_umum_p ?? 0),
                        },
                        {
                            header: "Aksi",
                            headerClassName: "text-center w-28",
                            className: "text-center w-28",
                            render: (item: any) => (
                                <div className="flex items-center justify-center gap-2">
                                    <Link
                                        href={route("be.sekretariat.edit", item.id)}
                                        className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                                    >
                                        <Edit2 size={16} />
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => openDeleteModal(item)}
                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ),
                        },
                    ]}
                    data={localData.data}
                />

                <div className="p-6 border-t border-slate-50 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-500">
                        Menampilkan{" "}
                        <span className="font-bold text-slate-800">
                            {localData.from ?? 0}
                        </span>{" "}
                        sampai{" "}
                        <span className="font-bold text-slate-800">
                            {localData.to ?? 0}
                        </span>{" "}
                        dari{" "}
                        <span className="font-bold text-slate-800">
                            {localData.total ?? 0}
                        </span>{" "}
                        data
                    </p>

                    <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span>Tampilkan</span>
                        <select
                            value={perPage}
                            onChange={(e) => setPerPage(parseInt(e.target.value))}
                            className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl py-1.5 px-3 outline-none cursor-pointer"
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                    </div>

                    <Pagination
                        links={localData.links}
                        onPageChange={(url: string) => fetchData(url)}
                    />
                </div>
            </Card>

            {/* Modal Import Excel */}
            {showImportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                                Import Data Excel
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowImportModal(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <p className="text-sm text-slate-500 mb-4">
                            Upload file <strong>.xlsx</strong> / <strong>.csv</strong>.
                            Baris pertama harus berisi header kolom.
                        </p>

                        <form onSubmit={handleImport} className="space-y-4">
                            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-6 cursor-pointer hover:border-teal-400 transition-colors">
                                <FileSpreadsheet
                                    size={28}
                                    className="text-teal-600 mb-2"
                                />
                                <span className="text-sm text-slate-600 text-center">
                                    {importFile
                                        ? importFile.name
                                        : "Pilih file Excel"}
                                </span>
                                <input
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    className="hidden"
                                    onChange={(e) =>
                                        setImportFile(e.target.files?.[0] || null)
                                    }
                                />
                            </label>

                            <div className="flex gap-3 justify-end">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setShowImportModal(false)}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={!importFile || importing}
                                    className="flex items-center gap-2"
                                >
                                    <Upload size={16} />
                                    {importing ? "Mengimpor..." : "Import Sekarang"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmationModal
                show={showDeleteModal}
                processing={processing}
                title="Hapus Data Sekretariat"
                message="Apakah Anda yakin ingin menghapus data ini? Data yang dihapus tidak dapat dikembalikan."
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </MainLayout>
    );
}
