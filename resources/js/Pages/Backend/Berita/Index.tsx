import React, { useState, useEffect, useRef } from "react";
import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import Badge from "@/Components/UI/Badge";
import ConfirmationModal from "@/Components/UI/ConfirmationModal";
import Table from "@/Components/Data/Table";
import Pagination from "@/Components/Data/Pagination";
import Card from "@/Components/UI/Card";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import {
    Search,
    Edit2,
    Trash2,
    RotateCcw,
    Plus,
    Newspaper,
    Eye,
    MapPin,
    CheckCircle,
    XCircle,
    Filter
} from "lucide-react";
import { PaginatedData } from "@/types/model";
import axios from "axios";

interface Berita {
    id: number;
    judul: string;
    slug: string;
    konten: string;
    kategori: string;
    kecamatan: string | null;
    foto: string | null;
    status_publikasi: boolean;
    created_at: string;
    user?: { id: number; name: string };
}

interface IndexProps {
    beritas: PaginatedData<Berita>;
    kecamatanList?: string[];
    filters?: {
        search?: string;
        kategori?: string;
        kecamatan?: string;
        status?: string;
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

const KATEGORI_OPTIONS = [
    "Kegiatan",
    "Pengumuman",
    "Artikel",
    "Pemberitaan Desa",
];

export default function Index({ beritas, kecamatanList = [], filters = {} }: IndexProps) {
    const { auth } = usePage<any>().props;
    const permissions: string[] = auth?.permissions || [];

    const canCreate = permissions.includes("berita.create") || true;
    const canEdit = permissions.includes("berita.edit") || true;
    const canDelete = permissions.includes("berita.delete") || true;

    const [search, setSearch] = useState(filters.search || "");
    const [kategoriFilter, setKategoriFilter] = useState(filters.kategori || "");
    const [kecamatanFilter, setKecamatanFilter] = useState(filters.kecamatan || "");
    const [statusFilter, setStatusFilter] = useState(filters.status || "");
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

    useEffect(() => {
        if (beritas?.data) {
            setLocalBeritas(beritas);
        }
    }, [beritas]);

    const fetchData = () => {
        setIsLoading(true);

        const url = route("be.berita.index");
        const params = {
            search: search || undefined,
            kategori: kategoriFilter || undefined,
            kecamatan: kecamatanFilter || undefined,
            status: statusFilter || undefined,
            per_page: perPage,
        };

        axios
            .get(url, {
                params,
                headers: { Accept: "application/json" },
            })
            .then((res) => {
                if (res.data && typeof res.data === "object" && "data" in res.data) {
                    setLocalBeritas(res.data);
                }
            })
            .catch((err) => {
                console.error("Error fetching berita:", err);
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
    }, [search, kategoriFilter, kecamatanFilter, statusFilter, perPage]);

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
                fetchData();
            },
        });
    };

    const handleReset = () => {
        setSearch("");
        setKategoriFilter("");
        setKecamatanFilter("");
        setStatusFilter("");
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
                    setLocalBeritas(res.data);
                }
            })
            .catch((err) => {
                console.error("Error fetching page:", err);
            })
            .finally(() => setIsLoading(false));
    };

    const getStatusBadge = (status: boolean) => {
        if (status) {
            return <Badge type="success">Published</Badge>;
        }
        return <Badge type="default">Draft</Badge>;
    };

    return (
        <MainLayout>
            <Head title="Manajemen Berita & Informasi" />

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
                        className="shadow-lg shadow-teal-100 dark:shadow-none flex items-center gap-2 bg-teal-600 hover:bg-teal-700"
                    >
                        <Plus size={16} />
                        <span>Tambah Berita</span>
                    </Button>
                )}
            </div>

            <Card className="dark:bg-slate-800 dark:border-slate-700 dark:shadow-slate-700/50 overflow-hidden">
                {/* Filter Section */}
                <div className="p-6 border-b border-slate-50 dark:border-slate-700">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative flex-1 min-w-[180px] max-w-md">
                            <TextInput
                                iconLeft={<Search size={18} />}
                                placeholder="Cari judul berita..."
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
                            {KATEGORI_OPTIONS.map((k) => (
                                <option key={k} value={k}>{k}</option>
                            ))}
                        </select>

                        <select
                            value={kecamatanFilter}
                            onChange={(e) => setKecamatanFilter(e.target.value)}
                            className="text-sm rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all"
                        >
                            <option value="">Semua Kecamatan</option>
                            {kecamatanList.map((k) => (
                                <option key={k} value={k}>{k}</option>
                            ))}
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="text-sm rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all"
                        >
                            <option value="">Semua Status</option>
                            <option value="true">Published</option>
                            <option value="false">Draft</option>
                        </select>

                        {(search || kategoriFilter || kecamatanFilter || statusFilter || perPage !== 10) && (
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
                                className:
                                    "text-center text-sm font-medium text-slate-400 dark:text-slate-200 w-14",
                                headerClassName: "text-center w-14",
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
                                className: "w-20 text-center",
                                headerClassName: "text-center w-20",
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
                                header: "Judul & Kategori",
                                className: "w-auto",
                                headerClassName: "w-auto",
                                render: (berita: Berita) => (
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">
                                            {berita.judul}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge type="info" className="text-[10px]">
                                                {berita.kategori || "Umum"}
                                            </Badge>
                                            {berita.kecamatan && (
                                                <span className="flex items-center gap-1 text-[10px] text-slate-400">
                                                    <MapPin size={10} />
                                                    {berita.kecamatan}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ),
                            },
                            {
                                header: "Status",
                                className: "text-center w-28",
                                headerClassName: "text-center w-28",
                                render: (berita: Berita) => (
                                    <div className="flex justify-center">
                                        {getStatusBadge(berita.status_publikasi)}
                                    </div>
                                ),
                            },
                            {
                                header: "Aksi",
                                headerClassName: "text-center w-28",
                                className: "text-center w-28",
                                render: (berita: Berita) => (
                                    <div className="flex items-center justify-center gap-1">
                                        <Link
                                            href={`/berita/${berita.slug}`}
                                            target="_blank"
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                            title="Lihat"
                                        >
                                            <Eye size={15} />
                                        </Link>
                                        {canEdit && (
                                            <Link
                                                href={route(
                                                    "be.berita.edit",
                                                    berita.id
                                                )}
                                                className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                                                title="Edit"
                                            >
                                                <Edit2 size={15} />
                                            </Link>
                                        )}
                                        {canDelete && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openDeleteModal(berita)
                                                }
                                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                title="Hapus"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        )}
                                    </div>
                                ),
                            },
                        ]}
                        data={localBeritas.data || []}
                    />
                </div>

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
                            className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 block py-1.5 px-3 transition-all outline-none cursor-pointer dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>

                    <Pagination
                        links={localBeritas.links || []}
                        onPageChange={handlePageChange}
                    />
                </div>
            </Card>

            <ConfirmationModal
                show={showDeleteModal}
                processing={processing}
                title="Hapus Berita"
                message={
                    selectedBerita
                        ? `Apakah Anda yakin ingin menghapus berita "${selectedBerita.judul}"? Data yang dihapus tidak dapat dikembalikan.`
                        : "Apakah Anda yakin ingin menghapus berita ini?"
                }
                onConfirm={handleDelete}
                onCancel={() => {
                    setShowDeleteModal(false);
                    setSelectedBerita(null);
                }}
            />
        </MainLayout>
    );
}
