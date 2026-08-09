import React, { useState, useEffect, useRef } from "react";
import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import ConfirmationModal from "@/Components/UI/ConfirmationModal";
import Table from "@/Components/Data/Table";
import Pagination from "@/Components/Data/Pagination";
import Card from "@/Components/UI/Card";
import { Head, Link, useForm, usePage, router } from "@inertiajs/react";
import { Search, Edit2, Trash2, RotateCcw, Plus, Newspaper } from "lucide-react";
import { PaginatedData } from "@/types/model";
import axios from "axios";

interface Berita {
    id: number;
    judul: string;
    slug: string;
    konten: string;
    foto: string | null;
}

interface IndexProps {
    beritas: PaginatedData<Berita>;
    filters?: {
        search?: string;
        per_page?: number | string;
    };
}

const emptyPagination: PaginatedData<Berita> = {
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

export default function Index({ beritas, filters = {} }: IndexProps) {
    const { auth } = usePage<any>().props;
    const permissions: string[] = auth?.permissions || [];

    const canCreate = permissions.includes("berita.create") || true; // sesuaikan permission
    const canEdit = permissions.includes("berita.edit") || true;
    const canDelete = permissions.includes("berita.delete") || true;

    const [search, setSearch] = useState(filters.search || "");
    const [perPage, setPerPage] = useState<number>(
        Number(filters.per_page) || 10
    );
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBerita, setSelectedBerita] = useState<Berita | null>(null);

    const [localBeritas, setLocalBeritas] = useState<PaginatedData<Berita>>(
        beritas?.data ? beritas : emptyPagination
    );
    const [isLoading, setIsLoading] = useState(false);
    const isFirstRender = useRef(true);

    const { delete: destroy, processing } = useForm({});

    // Sync props saat Inertia reload
    useEffect(() => {
        if (beritas?.data) {
            setLocalBeritas(beritas);
        }
    }, [beritas]);

    const fetchData = (url: string, params: Record<string, any> = {}) => {
        setIsLoading(true);

        axios
            .get(url, {
                params,
                headers: { Accept: "application/json" },
            })
            .then((res) => {
                if (res.data && typeof res.data === "object" && "data" in res.data) {
                    setLocalBeritas(res.data);
                } else if (Array.isArray(res.data)) {
                    setLocalBeritas((prev) => ({
                        ...prev,
                        data: res.data,
                        total: res.data.length,
                    }));
                }
            })
            .catch((err) => {
                console.error("Error fetching berita:", err);
            })
            .finally(() => setIsLoading(false));
    };

    // Debounce search & perPage
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            fetchData(route("be.berita.index"), {
                search: search || undefined,
                per_page: perPage,
            });
        }, 350);

        return () => clearTimeout(timeout);
    }, [search, perPage]);

    const openDeleteModal = (berita: Berita) => {
        setSelectedBerita(berita);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (!selectedBerita) return;

        destroy(route("be.berita.destroy", selectedBerita.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedBerita(null);

                // Refresh list
                fetchData(route("be.berita.index"), {
                    search: search || undefined,
                    per_page: perPage,
                });
            },
            onError: () => {
                // optional: toast error
            },
        });
    };

    const handleReset = () => {
        setSearch("");
        setPerPage(10);
    };

    const stripHtml = (html: string) => {
        if (!html) return "";
        return html.replace(/<[^>]*>?/gm, "").trim();
    };

    return (
        <MainLayout>
            <Head title="Manajemen Berita & Informasi" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Manajemen Berita & Informasi
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Kelola artikel, pengumuman, dan berita kegiatan TP PKK
                    </p>
                </div>

                {canCreate && (
                    <Button
                        variant="primary"
                        href={route("be.berita.create")}
                        className="shadow-lg shadow-indigo-100 dark:shadow-none flex items-center gap-2"
                    >
                        <Plus size={16} />
                        <span>Tambah Berita</span>
                    </Button>
                )}
            </div>

            {/* Card */}
            <Card className="dark:bg-slate-800 dark:border-slate-700 dark:shadow-slate-700/50">
                {/* Search */}
                <div className="p-6 border-b border-slate-50 dark:border-slate-700 flex items-center gap-4">
                    <div className="relative w-full max-w-md">
                        <TextInput
                            iconLeft={<Search size={18} />}
                            placeholder="Cari judul berita..."
                            className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            containerClassName="relative w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {(search || perPage !== 10) && (
                        <Button
                            variant="danger"
                            onClick={handleReset}
                            className="flex items-center gap-2"
                        >
                            <RotateCcw size={16} />
                            <span>Reset</span>
                        </Button>
                    )}
                </div>

                {/* Table */}
                <Table
                    isLoading={isLoading}
                    columns={[
                        {
                            header: "#",
                            className:
                                "text-center text-sm font-medium text-slate-400 dark:text-slate-200 w-16",
                            headerClassName: "text-center w-16",
                            render: (_: Berita, index: number) => {
                                const currentPage =
                                    localBeritas.current_page ?? 1;
                                const perPageVal = localBeritas.per_page ?? 10;
                                return (
                                    (currentPage - 1) * perPageVal + index + 1
                                );
                            },
                        },
                        {
                            header: "Foto",
                            className: "w-24 text-center",
                            headerClassName: "text-center w-24",
                            render: (berita: Berita) => (
                                <div className="flex justify-center">
                                    {berita.foto ? (
                                        <img
                                            src={`/storage/${berita.foto}`}
                                            alt={berita.judul}
                                            className="w-12 h-12 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
                                            onError={(e) => {
                                                e.currentTarget.style.display =
                                                    "none";
                                            }}
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                                            <Newspaper size={20} />
                                        </div>
                                    )}
                                </div>
                            ),
                        },
                        {
                            header: "Judul & Konten",
                            className: "w-auto",
                            headerClassName: "w-auto",
                            render: (berita: Berita) => (
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">
                                        {berita.judul}
                                    </p>
                                    <p className="text-xs text-slate-400 dark:text-slate-400 line-clamp-1 mt-0.5">
                                        {stripHtml(berita.konten)}
                                    </p>
                                </div>
                            ),
                        },
                        {
                            header: "Aksi",
                            headerClassName: "text-center w-32",
                            className: "text-center w-32",
                            render: (berita: Berita) => (
                                <div className="flex items-center justify-center gap-2">
                                    {canEdit && (
                                        <Link
                                            href={route(
                                                "be.berita.edit",
                                                berita.id
                                            )}
                                            className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl active:scale-90 transition-all cursor-pointer inline-flex items-center dark:hover:bg-indigo-900/30"
                                        >
                                            <Edit2 size={16} />
                                        </Link>
                                    )}
                                    {canDelete && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openDeleteModal(berita)
                                            }
                                            className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl active:scale-90 transition-all cursor-pointer dark:hover:bg-rose-900/30"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ),
                        },
                    ]}
                    data={localBeritas.data || []}
                />

                {/* Pagination */}
                <div className="p-6 border-t border-slate-50 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/20 dark:bg-slate-700/20">
                    <p className="text-sm text-slate-500 dark:text-slate-200">
                        Menampilkan{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localBeritas.from ?? 0}
                        </span>{" "}
                        sampai{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localBeritas.to ?? 0}
                        </span>{" "}
                        dari{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localBeritas.total ?? 0}
                        </span>{" "}
                        data
                    </p>

                    <div className="flex items-center gap-3 text-sm text-slate-400">
                        <span>Tampilkan</span>
                        <select
                            value={perPage}
                            onChange={(e) =>
                                setPerPage(parseInt(e.target.value, 10))
                            }
                            className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-3 focus:ring-indigo-500/10 focus:border-indigo-500 block py-1.5 px-3 transition-all outline-none cursor-pointer dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>

                    <Pagination
                        links={localBeritas.links || []}
                        onPageChange={(url: string) => {
                            if (url) fetchData(url);
                        }}
                    />
                </div>
            </Card>

            <ConfirmationModal
                show={showDeleteModal}
                processing={processing}
                title="Hapus Berita"
                message="Apakah Anda yakin ingin menghapus berita ini? Data yang dihapus tidak dapat dikembalikan."
                onConfirm={handleDelete}
                onCancel={() => {
                    setShowDeleteModal(false);
                    setSelectedBerita(null);
                }}
            />
        </MainLayout>
    );
}
