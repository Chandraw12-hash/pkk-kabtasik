import React, { useState, useEffect } from "react";
import MainLayout from "@/Layouts/MainLayout";
import Card from "@/Components/UI/Card";
import Table from "@/Components/Data/Table";
import Button from "@/Components/UI/Button";
import TextInput from "@/Components/Form/TextInput";
import SelectInput from "@/Components/Form/SelectInput";
import SelectSearch from "@/Components/Form/SelectSearch";
import Pagination from "@/Components/Data/Pagination";
import ConfirmationModal from "@/Components/UI/ConfirmationModal";
import Modal from "@/Components/UI/Modal";
import { Head, useForm, router, usePage, Link } from "@inertiajs/react";
import { Edit2, Trash2, Search, RotateCcw } from "lucide-react";
import { PaginatedData } from "@/types/model";
import axios from "axios";

interface Indikator {
    id: number;
    nama_indikator: string;
}

interface Skpd {
    id: number;
    nama_skpd: string;
}

interface FileEviden {
    id: number;
    file_path: string;
    original_name: string;
}

interface Eviden {
    id: number;
    uuid: string;
    tahun: string;
    indikator: Indikator;
    skpd: Skpd;
    status: string;
    files: FileEviden[];
}

interface IndexProps {
    evidens: PaginatedData<Eviden>;
    indikators: Indikator[];
    skpds: Skpd[];
    filters: {
        search?: string;
        per_page?: number | string;
        status?: string;
        skpd_id?: string;
        tahun?: string;
    };
}

export default function Index({
    evidens,
    indikators,
    skpds,
    filters,
}: IndexProps) {
    const { roles, permissions } = usePage<any>().props.auth;

    const [search, setSearch] = useState(filters.search || "");
    const [perPage, setPerPage] = useState(filters.per_page || 10);
    const [status, setStatus] = useState(filters.status || "");
    const [skpdId, setSkpdId] = useState(filters.skpd_id || "");
    const [tahun, setTahun] = useState(filters.tahun || "");

    const [localEvidens, setLocalEvidens] =
        useState<PaginatedData<Eviden>>(evidens);
    const [isLoading, setIsLoading] = useState(false);
    const isFirstRender = React.useRef(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedEviden, setSelectedEviden] = useState<Eviden | null>(null);

    // Confirmation Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Eviden | null>(null);

    // Form Hook
    const {
        data,
        setData,
        post,
        put: update,
        delete: destroy,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        indikator_id: "",
        skpd_id: "",
        tahun: new Date().getFullYear().toString(),
        files: [] as File[],
    });

    const fetchData = (url: string, params: any = {}) => {
        setIsLoading(true);
        axios
            .get(url, { params, headers: { Accept: "application/json" } })
            .then((res) => {
                if (
                    res.data &&
                    typeof res.data === "object" &&
                    "data" in res.data
                ) {
                    setLocalEvidens(res.data);
                } else if (Array.isArray(res.data)) {
                    setLocalEvidens((prev) => ({
                        ...prev,
                        data: res.data,
                    }));
                } else {
                    console.error("Format data tidak dikenal:", res.data);
                }
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
            fetchData(route("be.eviden.index"), {
                search,
                per_page: perPage,
                status,
                skpd_id: skpdId,
                tahun,
            });
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, perPage, status, skpdId, tahun]);

    // Handlers
    const openCreateModal = () => {
        setIsEditMode(false);
        setSelectedEviden(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (item: Eviden) => {
        setIsEditMode(true);
        setSelectedEviden(item);
        setData({
            indikator_id: item.indikator.id.toString(),
            skpd_id: item.skpd.id.toString(),
            tahun: item.tahun,
            files: [], // Files cannot be prefilled in input type=file, handle display separately
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditMode && selectedEviden) {
            router.post(
                route("be.eviden.update", selectedEviden.id),
                {
                    _method: "put",
                    ...data,
                } as any,
                {
                    onSuccess: () => closeModal(),
                },
            );
        } else {
            post(route("be.eviden.store"), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const openDeleteModal = (item: Eviden) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (!itemToDelete) return;

        destroy(route("be.eviden.destroy", itemToDelete.uuid), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setItemToDelete(null);
                fetchData(route("be.eviden.index"), {
                    search,
                    per_page: perPage,
                    status,
                    skpd_id: skpdId,
                    tahun,
                });
            },
        });
    };

    return (
        <>
            <Head title="Manajemen Eviden" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Manajemen Data Eviden
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Kelola data bukti dukung / eviden SPBEe
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href={route("be.eviden.create")}>
                        <Button
                            variant="primary"
                            className="shadow-lg shadow-indigo-100 dark:shadow-none"
                        >
                            <span>Tambah Eviden</span>
                        </Button>
                    </Link>
                </div>
            </div>

            <Card className="dark:bg-slate-800 dark:border-slate-700 dark:shadow-slate-700/50">
                {/* Filter & Search Bar */}
                <div className="p-6 border-b border-slate-50 dark:border-slate-700 space-y-4">
                    {/* Filters Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        <TextInput
                            iconLeft={<Search size={18} />}
                            className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            containerClassName="relative w-full"
                            placeholder="Cari eviden..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        {roles.includes("admin") && (
                            <SelectSearch
                                options={[
                                    { value: "", label: "Semua SKPD" },
                                    ...skpds.map((s) => ({
                                        value: s.id,
                                        label: s.nama_skpd,
                                    })),
                                ]}
                                value={skpdId}
                                onChange={(val) => setSkpdId(val.toString())}
                                placeholder="Pilih SKPD"
                            />
                        )}

                        <SelectInput
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            options={[
                                { value: "", label: "Semua Status" },
                                { value: "pending", label: "Pending" },
                                {
                                    value: "terverifikasi",
                                    label: "Terverifikasi",
                                },
                                { value: "ditolak", label: "Ditolak" },
                            ]}
                            containerClassName="relative w-full"
                        />

                        <SelectInput
                            value={tahun}
                            onChange={(e) => setTahun(e.target.value)}
                            containerClassName="relative w-full"
                        >
                            <option value="">Semua Tahun</option>
                            {Array.from({ length: 5 }, (_, i) => {
                                const year = new Date().getFullYear() - i;
                                return (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                );
                            })}
                        </SelectInput>

                        {(status || skpdId || tahun || search) && (
                            <div className="flex w-full">
                                <Button
                                    variant="danger"
                                    onClick={() => {
                                        setStatus("");
                                        setSkpdId("");
                                        setTahun("");
                                        setSearch("");
                                        setPerPage(10);
                                    }}
                                    className="flex items-center gap-2"
                                >
                                    <RotateCcw size={16} />
                                    <span>Reset Filter</span>
                                </Button>
                            </div>
                        )}
                    </div>
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
                            render: (_: Eviden, index: number) => {
                                const currentPage =
                                    localEvidens.current_page ?? 1;
                                const perPageVal = localEvidens.per_page ?? 10;
                                return (
                                    (currentPage - 1) * perPageVal + index + 1
                                );
                            },
                        },
                        {
                            header: "Nama Indikator",
                            className:
                                "text-slate-600 font-medium dark:text-slate-200 min-w-[300px]",
                            headerClassName: "min-w-[300px]",
                            render: (item: Eviden) => (
                                <div>
                                    <div className="line-clamp-2">
                                        {item.indikator?.nama_indikator}
                                    </div>
                                    <div className="text-xs text-slate-400 mt-1">
                                        {item.skpd?.nama_skpd}
                                    </div>
                                </div>
                            ),
                        },
                        {
                            header: "Tahun",
                            className:
                                "text-slate-600 font-medium dark:text-slate-200 w-24",
                            headerClassName: "w-24",
                            render: (item: Eviden) => item.tahun,
                        },
                        {
                            header: "Status",
                            className:
                                "text-slate-600 font-medium dark:text-slate-200 w-32",
                            headerClassName: "w-32",
                            render: (item: Eviden) => (
                                <span
                                    className={`text-xs px-2 py-1 rounded font-medium ${
                                        item.status === "terverifikasi"
                                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                            : item.status === "ditolak"
                                              ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                                              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                    }`}
                                >
                                    {item.status === "terverifikasi"
                                        ? "Terverifikasi"
                                        : item.status === "ditolak"
                                          ? "Ditolak"
                                          : "Pending"}
                                </span>
                            ),
                        },
                        {
                            header: "Files",
                            className:
                                "text-slate-600 font-medium dark:text-slate-200 w-24",
                            headerClassName: "w-24",
                            render: (item: Eviden) => (
                                <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                                    {item.files?.length || 0} File
                                </span>
                            ),
                        },
                        {
                            header: "Aksi",
                            headerClassName: "text-center w-32",
                            className: "text-center w-32",
                            render: (item: Eviden) => (
                                <div className="flex items-center justify-center gap-2">
                                    <Link
                                        href={route(
                                            "be.eviden.edit",
                                            item.uuid,
                                        )}
                                        className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl active:scale-90 transition-all cursor-pointer"
                                    >
                                        <Edit2 size={16} />
                                    </Link>
                                    <button
                                        onClick={() => openDeleteModal(item)}
                                        className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl active:scale-90 transition-all cursor-pointer"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ),
                        },
                    ]}
                    data={localEvidens.data}
                />

                {/* Pagination Section */}
                <div className="p-6 border-t border-slate-50 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/20 dark:bg-slate-700/20">
                    <p className="text-sm text-slate-500 dark:text-slate-200">
                        Menampilkan{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localEvidens.from ?? 0}
                        </span>{" "}
                        sampai{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localEvidens.to ?? 0}
                        </span>{" "}
                        dari{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localEvidens.total}
                        </span>{" "}
                        data
                    </p>

                    <div className="flex items-center gap-3 text-sm text-slate-400">
                        <span>Tampilkan</span>
                        <select
                            value={perPage}
                            onChange={(e) =>
                                setPerPage(parseInt(e.target.value))
                            }
                            className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-3 focus:ring-indigo-500/10 focus:border-indigo-500 block py-1.5 px-3 transition-all outline-none cursor-pointer dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                    </div>

                    <Pagination
                        links={localEvidens.links}
                        onPageChange={(url) => fetchData(url)}
                    />
                </div>
            </Card>

            {/* Modal Form */}
            <Modal
                show={isModalOpen}
                onClose={closeModal}
                title={isEditMode ? "Edit Eviden" : "Tambah Eviden"}
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
                            {processing ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">
                            Pilih Indikator
                        </label>
                        <select
                            value={data.indikator_id}
                            onChange={(e) =>
                                setData("indikator_id", e.target.value)
                            }
                            className="w-full py-2 px-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                        >
                            <option value="">-- Pilih Indikator --</option>
                            {indikators.map((ind) => (
                                <option key={ind.id} value={ind.id}>
                                    {ind.nama_indikator}
                                </option>
                            ))}
                        </select>
                        {errors.indikator_id && (
                            <div className="text-red-500 text-sm mt-1">
                                {errors.indikator_id}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">
                            Pilih SKPD
                        </label>
                        <SelectSearch
                            options={[
                                { value: "", label: "-- Pilih SKPD --" },
                                ...skpds.map((s) => ({
                                    value: s.id,
                                    label: s.nama_skpd,
                                })),
                            ]}
                            value={data.skpd_id}
                            onChange={(val) =>
                                setData("skpd_id", val.toString())
                            }
                            error={errors.skpd_id}
                            placeholder="Cari SKPD..."
                        />
                        {errors.skpd_id && (
                            <div className="text-red-500 text-sm mt-1">
                                {errors.skpd_id}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">
                            Tahun
                        </label>
                        <TextInput
                            type="number"
                            value={data.tahun}
                            onChange={(e) => setData("tahun", e.target.value)}
                            placeholder="Contoh: 2025"
                            className="w-full"
                            error={errors.tahun}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">
                            Upload Bukti Dukung (PDF/Gambar/Doc)
                        </label>
                        <input
                            type="file"
                            multiple
                            onChange={(e) =>
                                setData(
                                    "files",
                                    Array.from(e.target.files || []),
                                )
                            }
                            className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-xl file:border-0
                                file:text-sm file:font-semibold
                                file:bg-indigo-50 file:text-indigo-700
                                hover:file:bg-indigo-100
                                dark:file:bg-slate-700 dark:file:text-slate-200
                            "
                        />
                        {errors.files && (
                            <div className="text-red-500 text-sm mt-1">
                                {errors.files}
                            </div>
                        )}
                        <p className="text-xs text-slate-400 mt-1">
                            Bisa upload lebih dari satu file.
                        </p>
                    </div>
                </form>
            </Modal>

            {/* Modal Konfirmasi Hapus */}
            <ConfirmationModal
                show={showDeleteModal}
                processing={processing}
                title="Hapus Eviden"
                message={
                    <>
                        Apakah Anda yakin ingin menghapus eviden data{" "}
                        <strong className="font-bold text-slate-800 dark:text-slate-200">
                            "{itemToDelete?.indikator?.nama_indikator}"
                        </strong>
                        ? Tindakan ini tidak dapat dibatalkan.
                    </>
                }
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </>
    );
}

Index.layout = (page: React.ReactNode) => <MainLayout>{page}</MainLayout>;
