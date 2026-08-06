import React, { useState, useEffect } from "react";
import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import ConfirmationModal from "@/Components/UI/ConfirmationModal";
import Table from "@/Components/Data/Table";
import Pagination from "@/Components/Data/Pagination";
import Card from "@/Components/UI/Card";
import { Head, Link, useForm } from "@inertiajs/react";
import { Search, Edit2, Trash2, RotateCcw, Plus, Image as ImageIcon } from "lucide-react";
import { PaginatedData } from "@/types/model";
import { usePage } from "@inertiajs/react";
import axios from "axios";

interface Galeri {
    id: number;
    judul: string;
    deskripsi: string | null;
    foto: string;
}

interface IndexProps {
    galeris: PaginatedData<Galeri>;
    filters: {
        search?: string;
        per_page?: number | string;
    };
}

export default function Index({ galeris, filters = {} }: IndexProps) {
    const { auth } = usePage<any>().props;
    const permissions = auth?.permissions || [];

    const [search, setSearch] = useState(filters.search || "");
    const [perPage, setPerPage] = useState(filters.per_page || 10);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedGaleri, setSelectedGaleri] = useState<Galeri | null>(null);

    const [localGaleris, setLocalGaleris] = useState<PaginatedData<Galeri>>({
        ...galeris,
        data: galeris?.data || [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const isFirstRender = React.useRef(true);

    const { delete: destroy, processing } = useForm({});

    const fetchData = (url: string, params: any = {}) => {
        setIsLoading(true);
        axios
            .get(url, { params, headers: { Accept: "application/json" } })
            .then((res) => {
                if (res.data && typeof res.data === "object" && "data" in res.data) {
                    setLocalGaleris(res.data);
                } else if (Array.isArray(res.data)) {
                    setLocalGaleris((prev) => ({ ...prev, data: res.data }));
                }
            })
            .catch((err) => console.error("Error fetching data:", err))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            fetchData(route("be.galeri.index"), {
                search,
                per_page: perPage,
            });
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, perPage]);

    const openDeleteModal = (galeri: Galeri) => {
        setSelectedGaleri(galeri);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (!selectedGaleri) return;

        destroy(route("be.galeri.destroy", selectedGaleri.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedGaleri(null);
                fetchData(route("be.galeri.index"), {
                    search,
                    per_page: perPage,
                });
            },
        });
    };

    return (
        <MainLayout>
            <Head title="Manajemen Galeri Kegiatan" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Manajemen Galeri Kegiatan
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Kelola dokumentasi foto dan kegiatan TP PKK
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="primary"
                        href={route("be.galeri.create")}
                        className="shadow-lg shadow-indigo-100 dark:shadow-none flex items-center gap-2"
                    >
                        <Plus size={16} />
                        <span>Tambah Galeri</span>
                    </Button>
                </div>
            </div>

            {/* Main Content Card */}
            <Card className="dark:bg-slate-800 dark:border-slate-700 dark:shadow-slate-700/50">
                {/* Filter & Search Bar */}
                <div className="p-6 border-b border-slate-50 dark:border-slate-700 flex items-center gap-4">
                    <div className="relative w-full max-w-md">
                        <TextInput
                            iconLeft={<Search size={18} />}
                            placeholder="Cari judul galeri..."
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

                {/* Table Section */}
                <Table
                    isLoading={isLoading}
                    columns={[
                        {
                            header: "#",
                            className: "text-center text-sm font-medium text-slate-400 dark:text-slate-200 w-16",
                            headerClassName: "text-center w-16",
                            render: (_: Galeri, index: number) => {
                                const currentPage = localGaleris.current_page ?? 1;
                                const perPageVal = localGaleris.per_page ?? 10;
                                return (currentPage - 1) * perPageVal + index + 1;
                            },
                        },
                        {
                            header: "Foto",
                            className: "w-24 text-center",
                            headerClassName: "text-center w-24",
                            render: (galeri: Galeri) => (
                                <div className="flex justify-center">
                                    {galeri.foto ? (
                                        <img
                                            src={`/storage/${galeri.foto}`}
                                            alt={galeri.judul}
                                            className="w-12 h-12 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                                            <ImageIcon size={20} />
                                        </div>
                                    )}
                                </div>
                            ),
                        },
                        {
                            header: "Judul & Deskripsi",
                            className: "w-auto",
                            headerClassName: "w-auto",
                            render: (galeri: Galeri) => (
                                <div>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                        {galeri.judul}
                                    </p>
                                    <p className="text-xs text-slate-400 dark:text-slate-400 line-clamp-1 mt-0.5">
                                        {galeri.deskripsi || "Tidak ada deskripsi"}
                                    </p>
                                </div>
                            ),
                        },
                        {
                            header: "Aksi",
                            headerClassName: "text-center w-32",
                            className: "text-center w-32",
                            render: (galeri: Galeri) => (
                                <div className="flex items-center justify-center gap-2">
                                    <Link
                                        href={route("be.galeri.edit", galeri.id)}
                                        className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl active:scale-90 transition-all cursor-pointer inline-flex items-center"
                                    >
                                        <Edit2 size={16} />
                                    </Link>
                                    <button
                                        onClick={() => openDeleteModal(galeri)}
                                        className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl active:scale-90 transition-all cursor-pointer"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ),
                        },
                    ]}
                    data={localGaleris.data}
                />

                {/* Pagination Section */}
                <div className="p-6 border-t border-slate-50 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/20 dark:bg-slate-700/20">
                    <p className="text-sm text-slate-500 dark:text-slate-200">
                        Menampilkan{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localGaleris.from ?? 0}
                        </span>{" "}
                        sampai{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localGaleris.to ?? 0}
                        </span>{" "}
                        dari{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localGaleris.total}
                        </span>{" "}
                        data
                    </p>

                    <div className="flex items-center gap-3 text-sm text-slate-400">
                        <span>Tampilkan</span>
                        <select
                            value={perPage}
                            onChange={(e) => setPerPage(parseInt(e.target.value))}
                            className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-3 focus:ring-indigo-500/10 focus:border-indigo-500 block py-1.5 px-3 transition-all outline-none cursor-pointer dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                    </div>

                    <Pagination
                        links={localGaleris.links}
                        onPageChange={(url) => fetchData(url)}
                    />
                </div>
            </Card>

            <ConfirmationModal
                show={showDeleteModal}
                processing={processing}
                title="Hapus Galeri"
                message="Apakah Anda yakin ingin menghapus dokumentasi galeri ini? Data yang dihapus tidak dapat dikembalikan."
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </MainLayout>
    );
}
