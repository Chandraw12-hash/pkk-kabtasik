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
    Eye,
    CheckCircle,
    XCircle,
    Image
} from "lucide-react";
import { PaginatedData } from "@/types/model";
import axios from "axios";

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

export default function Index({ infografis, kategoriList = [], filters = {} }: IndexProps) {
    const [search, setSearch] = useState(filters.search || "");
    const [kategoriFilter, setKategoriFilter] = useState(filters.kategori || "");
    const [perPage, setPerPage] = useState<number>(Number(filters.per_page) || 10);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Infografis | null>(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

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

        const url = route("be.infografis.index");
        const params = {
            search: search || undefined,
            kategori: kategoriFilter || undefined,
            per_page: perPage,
        };

        axios
            .get(url, {
                params,
                headers: { Accept: "application/json" },
            })
            .then((res) => {
                if (res.data && typeof res.data === "object" && "data" in res.data) {
                    setLocalData(res.data);
                }
            })
            .catch((err) => {
                console.error("Error fetching data:", err);
            })
            .finally(() => setIsLoading(false));
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

    // 🔥 FIX: PAKE ROUTER.DELETE
    const handleDelete = () => {
        if (!selectedItem) return;

        setIsDeleting(true);

        router.delete(route("be.infografis.destroy", selectedItem.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedItem(null);
                setIsDeleting(false);
                fetchData();
            },
            onError: (errors) => {
                console.error("Delete error:", errors);
                alert("Gagal menghapus infografis!");
                setIsDeleting(false);
            },
        });
    };

    const toggleStatus = (item: Infografis) => {
        axios.patch(route("be.infografis.toggle-status", item.id))
            .then(() => {
                fetchData();
            })
            .catch((err) => {
                console.error("Error toggling status:", err);
            });
    };

    const handleReset = () => {
        setSearch("");
        setKategoriFilter("");
        setPerPage(10);
    };

    const handlePageChange = (url: string | null) => {
        if (!url) return;

        setIsLoading(true);
        axios
            .get(url, {
                headers: { Accept: "application/json" },
            })
            .then((res) => {
                if (res.data && typeof res.data === "object" && "data" in res.data) {
                    setLocalData(res.data);
                }
            })
            .catch((err) => {
                console.error("Error fetching page:", err);
            })
            .finally(() => setIsLoading(false));
    };

    const openImageModal = (url: string) => {
        setSelectedImage(url);
        setShowImageModal(true);
    };

    return (
        <MainLayout>
            <Head title="Manajemen Infografis" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Manajemen Infografis
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Kelola gambar infografis yang tampil di halaman publik
                    </p>
                </div>

                <Button
                    variant="primary"
                    href={route("be.infografis.create")}
                    className="shadow-lg shadow-teal-100 dark:shadow-none flex items-center gap-2 bg-teal-600 hover:bg-teal-700"
                >
                    <Plus size={16} />
                    <span>Tambah Infografis</span>
                </Button>
            </div>

            <Card className="dark:bg-slate-800 dark:border-slate-700 dark:shadow-slate-700/50 overflow-hidden">
                {/* Filter Section */}
                <div className="p-6 border-b border-slate-50 dark:border-slate-700">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative flex-1 min-w-[180px] max-w-md">
                            <TextInput
                                iconLeft={<Search size={18} />}
                                placeholder="Cari judul infografis..."
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                containerClassName="relative w-full"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <select
                            value={kategoriFilter}
                            onChange={(e) => setKategoriFilter(e.target.value)}
                            className="text-sm rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all"
                        >
                            <option value="">Semua Kategori</option>
                            {kategoriList.map((k) => (
                                <option key={k} value={k}>{k}</option>
                            ))}
                        </select>

                        {(search || kategoriFilter || perPage !== 10) && (
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
                <div className="overflow-x-hidden">
                    <Table
                        isLoading={isLoading}
                        columns={[
                            {
                                header: "#",
                                className: "text-center text-sm font-medium text-slate-400 dark:text-slate-200 w-14",
                                headerClassName: "text-center w-14",
                                render: (_: Infografis, index: number) => {
                                    const currentPage = localData.current_page ?? 1;
                                    const perPageVal = localData.per_page ?? 10;
                                    return (currentPage - 1) * perPageVal + index + 1;
                                },
                            },
                            {
                                header: "Gambar",
                                className: "text-center w-20",
                                headerClassName: "text-center w-20",
                                render: (item: Infografis) => (
                                    <div className="flex justify-center">
                                        {item.gambar_url ? (
                                            <button
                                                onClick={() => openImageModal(item.gambar_url!)}
                                                className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 hover:shadow-md transition-shadow relative"
                                            >
                                                <img
                                                    src={item.gambar_url}
                                                    alt={item.judul}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = "none";
                                                        const parent = e.currentTarget.parentElement;
                                                        if (parent) {
                                                            const fallback = parent.querySelector('.fallback-icon');
                                                            if (fallback) fallback.classList.remove('hidden');
                                                        }
                                                    }}
                                                />
                                                <Image size={20} className="fallback-icon hidden text-slate-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                            </button>
                                        ) : (
                                            <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                                                <Image size={20} />
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
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">
                                            {item.judul}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            {item.kategori && (
                                                <Badge type="info" className="text-[10px]">
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
                                className: "text-center w-28",
                                headerClassName: "text-center w-28",
                                render: (item: Infografis) => (
                                    <Badge type={item.status === 'active' ? 'success' : 'default'}>
                                        {item.status === 'active' ? 'Aktif' : 'Nonaktif'}
                                    </Badge>
                                ),
                            },
                            {
                                header: "Aksi",
                                headerClassName: "text-center w-36",
                                className: "text-center w-36",
                                render: (item: Infografis) => (
                                    <div className="flex items-center justify-center gap-1">
                                        <button
                                            onClick={() => toggleStatus(item)}
                                            className={`p-2 rounded-lg transition-all ${
                                                item.status === 'active'
                                                    ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                                                    : 'text-slate-400 hover:text-green-600 hover:bg-green-50'
                                            }`}
                                            title={item.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                                        >
                                            {item.status === 'active' ? <XCircle size={15} /> : <CheckCircle size={15} />}
                                        </button>
                                        <Link
                                            href={route("be.infografis.edit", item.id)}
                                            className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                                            title="Edit"
                                        >
                                            <Edit2 size={15} />
                                        </Link>
                                        <button
                                            onClick={() => openDeleteModal(item)}
                                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
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
                <div className="p-6 border-t border-slate-50 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/20 dark:bg-slate-700/20">
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
                            onChange={(e) => setPerPage(parseInt(e.target.value, 10))}
                            className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 block py-1.5 px-3 transition-all outline-none cursor-pointer dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
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
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    onClick={() => setShowImageModal(false)}
                >
                    <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-xl overflow-hidden shadow-2xl">
                        <img
                            src={selectedImage}
                            alt="Preview"
                            className="max-w-full max-h-[80vh] object-contain"
                            onError={(e) => {
                                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%2394a3b8' font-size='16' font-family='sans-serif'%3EGambar tidak ditemukan%3C/text%3E%3C/svg%3E";
                            }}
                        />
                        <button
                            onClick={() => setShowImageModal(false)}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors flex items-center justify-center"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

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
                    setShowDeleteModal(false);
                    setSelectedItem(null);
                }}
            />
        </MainLayout>
    );
}
