import React, { useState, useEffect, useRef } from "react";
import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import ConfirmationModal from "@/Components/UI/ConfirmationModal";
import Badge from "@/Components/UI/Badge";
import Table from "@/Components/Data/Table";
import Pagination from "@/Components/Data/Pagination";
import Card from "@/Components/UI/Card";
import { Head, Link, router } from "@inertiajs/react";
import {
    Search,
    Edit2,
    Trash2,
    RotateCcw,
    Plus,
    Image as ImageIcon,
    CheckCircle,
    XCircle,
    Image as ImageIconFallback,
} from "lucide-react";
import { PaginatedData } from "@/types/model";
import axios from "axios";
import { toast } from "sonner";

interface Infografis {
    id: number;
    judul: string;
    deskripsi: string | null;
    gambar: string | null;
    gambar_url: string | null;
    kategori: string | null;
    status: string;
    urutan: number;
    created_at: string;
}

interface IndexProps {
    infografis: PaginatedData<Infografis>;
    kategoriList?: string[];
    filters?: {
        search?: string;
        kategori?: string;
        per_page?: number | string;
    };
}

const emptyPagination: PaginatedData<Infografis> = {
    data: [],
    current_page: 1,
    per_page: 10,
    from: 0,
    to: 0,
    total: 0,
    links: [],
    first_page_url: "",
    last_page_url: "",
    next_page_url: null,
    prev_page_url: null,
    path: "",
    last_page: 1,
};

export default function Index({
    infografis,
    kategoriList = [],
    filters = {},
}: IndexProps) {
    const [search, setSearch] = useState(filters.search || "");
    const [kategoriFilter, setKategoriFilter] = useState(
        filters.kategori || ""
    );
    const [perPage, setPerPage] = useState<number>(
        Number(filters.per_page) || 10
    );

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Infografis | null>(null);

    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const [isDeleting, setIsDeleting] = useState(false);

    const [showToggleModal, setShowToggleModal] = useState(false);
    const [toggleTarget, setToggleTarget] = useState<Infografis | null>(null);
    const [isToggling, setIsToggling] = useState(false);

    const [localData, setLocalData] = useState<PaginatedData<Infografis>>(
        infografis?.data ? infografis : emptyPagination
    );

    const [isLoading, setIsLoading] = useState(false);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (infografis?.data) {
            setLocalData(infografis);
        }
    }, [infografis]);

    const fetchData = () => {
        setIsLoading(true);

        axios
            .get(route("be.infografis.index"), {
                params: {
                    search: search || undefined,
                    kategori: kategoriFilter || undefined,
                    per_page: perPage,
                },
                headers: {
                    Accept: "application/json",
                },
            })
            .then((res) => {
                if (
                    res.data &&
                    typeof res.data === "object" &&
                    "data" in res.data
                ) {
                    setLocalData(res.data);
                }
            })
            .catch((err) => {
                console.error("Error fetching infografis:", err);
                toast.error("Gagal memuat data infografis.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            fetchData();
        }, 350);

        return () => clearTimeout(timeout);
    }, [search, kategoriFilter, perPage]);

    const openDeleteModal = (item: Infografis) => {
        setSelectedItem(item);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (!selectedItem || isDeleting) return;

        setIsDeleting(true);

        router.delete(
            route("be.infografis.destroy", selectedItem.id),
            {
                preserveScroll: true,

                onSuccess: () => {
                    setShowDeleteModal(false);
                    setSelectedItem(null);

                    toast.success("Infografis berhasil dihapus.");

                    fetchData();
                },

                onError: (errors) => {
                    console.error("Delete error:", errors);

                    toast.error("Gagal menghapus infografis.", {
                        description:
                            "Periksa kembali data atau koneksi server.",
                    });
                },

                onFinish: () => {
                    setIsDeleting(false);
                },
            }
        );
    };

    const openToggleModal = (item: Infografis) => {
        setToggleTarget(item);
        setShowToggleModal(true);
    };

    const handleToggleConfirm = () => {
        if (!toggleTarget || isToggling) return;

        const akanAktif = toggleTarget.status !== "active";
        const nama = toggleTarget.judul;

        setIsToggling(true);

        router.patch(
            route("be.infografis.toggle-status", toggleTarget.id),
            {},
            {
                preserveScroll: true,

                onSuccess: () => {
                    toast.success(
                        akanAktif
                            ? "Infografis berhasil diaktifkan."
                            : "Infografis berhasil dinonaktifkan.",
                        {
                            description: akanAktif
                                ? `Infografis "${nama}" sekarang dapat tampil di halaman publik.`
                                : `Infografis "${nama}" tidak lagi tampil di halaman publik.`,
                        }
                    );

                    setShowToggleModal(false);
                    setToggleTarget(null);

                    fetchData();
                },

                onError: (errors) => {
                    console.error("Toggle status error:", errors);

                    toast.error("Gagal mengubah status infografis.", {
                        description:
                            "Silakan coba kembali beberapa saat lagi.",
                    });
                },

                onFinish: () => {
                    setIsToggling(false);
                },
            }
        );
    };

    const handleReset = () => {
        setSearch("");
        setKategoriFilter("");
        setPerPage(10);
    };

    const handlePageChange = (url: string | null) => {
        if (!url || isLoading) return;

        setIsLoading(true);

        axios
            .get(url, {
                headers: {
                    Accept: "application/json",
                },
            })
            .then((res) => {
                if (
                    res.data &&
                    typeof res.data === "object" &&
                    "data" in res.data
                ) {
                    setLocalData(res.data);
                }
            })
            .catch((err) => {
                console.error("Error fetching page:", err);
                toast.error("Gagal memuat halaman infografis.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const openImageModal = (url: string) => {
        setSelectedImage(url);
        setShowImageModal(true);
    };

    return (
        <MainLayout>
            <Head title="Manajemen Infografis" />

            {/* Header */}
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-200">
                        Manajemen Infografis
                    </h1>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Kelola gambar infografis yang tampil di halaman publik.
                    </p>
                </div>

                <Button
                    variant="primary"
                    href={route("be.infografis.create")}
                    className="flex items-center gap-2 bg-teal-600 shadow-lg shadow-teal-100 hover:bg-teal-700 dark:shadow-none"
                >
                    <Plus size={16} />
                    <span>Tambah Infografis</span>
                </Button>
            </div>

            <Card className="overflow-hidden dark:border-slate-700 dark:bg-slate-800 dark:shadow-slate-700/50">
                {/* Filter */}
                <div className="border-b border-slate-50 p-6 dark:border-slate-700">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative min-w-[180px] max-w-md flex-1">
                            <TextInput
                                iconLeft={<Search size={18} />}
                                placeholder="Cari judul infografis..."
                                className="w-full dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                                containerClassName="relative w-full"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <select
                            value={kategoriFilter}
                            onChange={(e) =>
                                setKategoriFilter(e.target.value)
                            }
                            className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                        >
                            <option value="">Semua Kategori</option>

                            {kategoriList.map((kategori) => (
                                <option key={kategori} value={kategori}>
                                    {kategori}
                                </option>
                            ))}
                        </select>

                        {(search ||
                            kategoriFilter ||
                            perPage !== 10) && (
                            <Button
                                variant="secondary"
                                onClick={handleReset}
                                className="flex items-center gap-2"
                            >
                                <RotateCcw size={16} />
                                <span>Reset</span>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <Table
                        isLoading={isLoading}
                        columns={[
                            {
                                header: "#",
                                className:
                                    "w-14 text-center text-sm font-medium text-slate-400 dark:text-slate-200",
                                headerClassName: "w-14 text-center",
                                render: (
                                    _item: Infografis,
                                    index: number
                                ) => {
                                    const currentPage =
                                        localData.current_page ?? 1;
                                    const perPageValue =
                                        localData.per_page ?? 10;

                                    return (
                                        (currentPage - 1) *
                                            perPageValue +
                                        index +
                                        1
                                    );
                                },
                            },
                            {
                                header: "Gambar",
                                className: "w-20 text-center",
                                headerClassName: "w-20 text-center",
                                render: (item: Infografis) => (
                                    <div className="flex justify-center">
                                        {item.gambar_url ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openImageModal(
                                                        item.gambar_url!
                                                    )
                                                }
                                                className="relative h-14 w-14 overflow-hidden rounded-lg border border-slate-200 transition-shadow hover:shadow-md"
                                                title="Lihat gambar"
                                            >
                                                <img
                                                    src={item.gambar_url}
                                                    alt={item.judul}
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display =
                                                            "none";

                                                        const fallback =
                                                            e.currentTarget
                                                                .parentElement
                                                                ?.querySelector(
                                                                    ".fallback-icon"
                                                                );

                                                        fallback?.classList.remove(
                                                            "hidden"
                                                        );
                                                    }}
                                                />

                                                <ImageIconFallback
                                                    size={20}
                                                    className="fallback-icon absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 text-slate-400"
                                                />
                                            </button>
                                        ) : (
                                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-slate-700">
                                                <ImageIcon size={20} />
                                            </div>
                                        )}
                                    </div>
                                ),
                            },
                            {
                                header: "Judul & Kategori",
                                className: "w-auto",
                                headerClassName: "w-auto",
                                render: (item: Infografis) => (
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-bold text-slate-700 dark:text-slate-200">
                                            {item.judul}
                                        </p>

                                        <div className="mt-1 flex items-center gap-2">
                                            {item.kategori && (
                                                <Badge
                                                    type="info"
                                                    className="text-[10px]"
                                                >
                                                    {item.kategori}
                                                </Badge>
                                            )}

                                            <span className="text-[10px] text-slate-400">
                                                Urutan: {item.urutan || 0}
                                            </span>
                                        </div>
                                    </div>
                                ),
                            },
                            {
                                header: "Status",
                                className: "w-28 text-center",
                                headerClassName: "w-28 text-center",
                                render: (item: Infografis) => (
                                    <Badge
                                        type={
                                            item.status === "active"
                                                ? "success"
                                                : "default"
                                        }
                                    >
                                        {item.status === "active"
                                            ? "Aktif"
                                            : "Nonaktif"}
                                    </Badge>
                                ),
                            },
                            {
                                header: "Aksi",
                                headerClassName: "w-36 text-center",
                                className: "w-36 text-center",
                                render: (item: Infografis) => (
                                    <div className="flex items-center justify-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openToggleModal(item)
                                            }
                                            className={`rounded-lg p-2 transition-all ${
                                                item.status === "active"
                                                    ? "text-slate-400 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/20"
                                                    : "text-slate-400 hover:bg-teal-50 hover:text-teal-600 dark:hover:bg-teal-900/20"
                                            }`}
                                            title={
                                                item.status === "active"
                                                    ? "Nonaktifkan"
                                                    : "Aktifkan"
                                            }
                                        >
                                            {item.status === "active" ? (
                                                <XCircle size={15} />
                                            ) : (
                                                <CheckCircle size={15} />
                                            )}
                                        </button>

                                        <Link
                                            href={route(
                                                "be.infografis.edit",
                                                item.id
                                            )}
                                            className="rounded-lg p-2 text-slate-400 transition-all hover:bg-teal-50 hover:text-teal-600 dark:hover:bg-teal-900/20"
                                            title="Edit"
                                        >
                                            <Edit2 size={15} />
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                openDeleteModal(item)
                                            }
                                            className="rounded-lg p-2 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20"
                                            title="Hapus"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                ),
                            },
                        ]}
                        data={localData.data || []}
                    />
                </div>

                {/* Pagination */}
                <div className="flex flex-col items-center justify-between gap-6 border-t border-slate-50 bg-slate-50/20 p-6 dark:border-slate-700 dark:bg-slate-700/20 md:flex-row">
                    <p className="text-sm text-slate-500 dark:text-slate-200">
                        Menampilkan{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localData.from ?? 0}
                        </span>{" "}
                        sampai{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localData.to ?? 0}
                        </span>{" "}
                        dari{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localData.total ?? 0}
                        </span>{" "}
                        data
                    </p>

                    <div className="flex items-center gap-3 text-sm text-slate-400">
                        <span>Tampilkan</span>

                        <select
                            value={perPage}
                            onChange={(e) =>
                                setPerPage(
                                    parseInt(e.target.value, 10)
                                )
                            }
                            className="block cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>

                    <Pagination
                        links={localData.links || []}
                        onPageChange={handlePageChange}
                    />
                </div>
            </Card>

            {/* Image Preview Modal */}
            {showImageModal && selectedImage && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
                    onClick={() => setShowImageModal(false)}
                >
                    <div
                        className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedImage}
                            alt="Preview infografis"
                            className="max-h-[80vh] max-w-full object-contain"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.alt =
                                    "Gambar tidak ditemukan";
                            }}
                        />

                        <button
                            type="button"
                            onClick={() => setShowImageModal(false)}
                            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
                            title="Tutup preview"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Toggle Status Modal */}
            <ConfirmationModal
                show={showToggleModal}
                processing={isToggling}
                title={
                    toggleTarget?.status === "active"
                        ? "Nonaktifkan Infografis"
                        : "Aktifkan Infografis"
                }
                message={
                    toggleTarget
                        ? toggleTarget.status === "active"
                            ? `Infografis "${toggleTarget.judul}" tidak akan tampil di publik. Lanjutkan nonaktifkan?`
                            : `Infografis "${toggleTarget.judul}" akan tampil di publik. Lanjutkan aktifkan?`
                        : "Ubah status infografis ini?"
                }
                confirmText={
                    toggleTarget?.status === "active"
                        ? "Ya, Nonaktifkan"
                        : "Ya, Aktifkan"
                }
                confirmVariant={
                    toggleTarget?.status === "active"
                        ? "warning"
                        : "success"
                }
                onConfirm={handleToggleConfirm}
                onCancel={() => {
                    if (isToggling) return;

                    setShowToggleModal(false);
                    setToggleTarget(null);
                }}
            />

            {/* Delete Modal */}
            <ConfirmationModal
                show={showDeleteModal}
                processing={isDeleting}
                title="Hapus Infografis"
                message={
                    selectedItem
                        ? `Apakah Anda yakin ingin menghapus infografis "${selectedItem.judul}"? Data yang dihapus tidak dapat dikembalikan.`
                        : "Apakah Anda yakin ingin menghapus infografis ini?"
                }
                onConfirm={handleDelete}
                onCancel={() => {
                    if (isDeleting) return;

                    setShowDeleteModal(false);
                    setSelectedItem(null);
                }}
            />
        </MainLayout>
    );
}
