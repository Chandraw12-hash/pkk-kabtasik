import React, { useState, useEffect } from "react";
import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import ConfirmationModal from "@/Components/UI/ConfirmationModal";
import Badge from "@/Components/UI/Badge";
import Table from "@/Components/Data/Table";
import Pagination from "@/Components/Data/Pagination";
import Card from "@/Components/UI/Card";
import { Head, Link, useForm } from "@inertiajs/react";
import { Search, Edit2, Trash2, RotateCcw } from "lucide-react";
import { PaginatedData } from "@/types/model";
import { usePage } from "@inertiajs/react";
import axios from "axios";

interface Kader {
    id: number;
    nama: string;
    nik: string | null;
    jabatan: string;
    pokja: string | null;
    kecamatan: string | null;
    desa_kelurahan: string | null;
    no_hp: string | null;
    status_aktif: boolean;
}

interface IndexProps {
    kaders: PaginatedData<Kader>;
    filters: {
        search?: string;
        pokja?: string;
        per_page?: number | string;
    };
}

export default function Index({ kaders, filters = {} }: IndexProps) {
    const { auth } = usePage<any>().props;
    const permissions = auth?.permissions || [];

    const [search, setSearch] = useState(filters.search || "");
    const [perPage, setPerPage] = useState(filters.per_page || 10);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedKader, setSelectedKader] = useState<Kader | null>(null);

    const [localKaders, setLocalKaders] = useState<PaginatedData<Kader>>({
    ...kaders,
    data: kaders?.data || [],
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
                    setLocalKaders(res.data);
                } else if (Array.isArray(res.data)) {
                    setLocalKaders((prev) => ({ ...prev, data: res.data }));
                } else {
                    console.error("Format data tidak dikenal:", res.data);
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
            fetchData(route("be.kader.index"), {
                search,
                per_page: perPage,
            });
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, perPage]);

    const openDeleteModal = (kader: Kader) => {
        setSelectedKader(kader);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (!selectedKader) return;

        destroy(route("be.kader.destroy", selectedKader.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedKader(null);
                fetchData(route("be.kader.index"), {
                    search,
                    per_page: perPage,
                });
            },
        });
    };

    return (
        <MainLayout>
            <Head title="Data Kader PKK" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Data Kader PKK
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Kelola data kader dan anggota TP PKK Kabupaten Tasikmalaya
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {permissions.includes("create-kader") && (
                        <Button
                            variant="primary"
                            href={route("be.kader.create")}
                            className="shadow-lg shadow-indigo-100 dark:shadow-none"
                        >
                            <span>Tambah Kader</span>
                        </Button>
                    )}
                </div>
            </div>

            {/* Main Content Card */}
            <Card className="dark:bg-slate-800 dark:border-slate-700 dark:shadow-slate-700/50">
                {/* Filter & Search Bar */}
                <div className="p-6 border-b border-slate-50 dark:border-slate-700 flex items-center gap-4">
                    <div className="relative w-full max-w-md">
                        <TextInput
                            iconLeft={<Search size={18} />}
                            placeholder="Cari nama atau kecamatan..."
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
                            render: (_: Kader, index: number) => {
                                const currentPage = localKaders.current_page ?? 1;
                                const perPageVal = localKaders.per_page ?? 10;
                                return (currentPage - 1) * perPageVal + index + 1;
                            },
                        },
                        {
                            header: "Kader",
                            className: "w-64",
                            headerClassName: "w-64",
                            render: (kader: Kader) => (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs border border-rose-100 uppercase">
                                        {kader.nama.substring(0, 2)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                            {kader.nama}
                                        </p>
                                        <p className="text-xs text-slate-400 dark:text-slate-400">
                                            {kader.jabatan}
                                        </p>
                                    </div>
                                </div>
                            ),
                        },
                        {
                            header: "Pokja",
                            className: "text-center w-32",
                            headerClassName: "text-center w-32",
                            render: (kader: Kader) => (
                                <div className="flex justify-center">
                                    {kader.pokja ? (
                                        <Badge type="info">{`Pokja ${kader.pokja}`}</Badge>
                                    ) : (
                                        <span className="text-xs text-slate-400 italic">-</span>
                                    )}
                                </div>
                            ),
                        },
                        {
                            header: "Wilayah",
                            className: "w-48",
                            headerClassName: "w-48",
                            render: (kader: Kader) => (
                                <div>
                                    <p className="text-sm text-slate-700 dark:text-slate-200">
                                        {kader.kecamatan || "-"}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {kader.desa_kelurahan || ""}
                                    </p>
                                </div>
                            ),
                        },
                        {
                            header: "Status",
                            className: "text-center w-32",
                            headerClassName: "text-center w-32",
                            render: (kader: Kader) => (
                                <div className="flex justify-center">
                                    <Badge type={kader.status_aktif ? "success" : "default"}>
                                        {kader.status_aktif ? "Aktif" : "Non-aktif"}
                                    </Badge>
                                </div>
                            ),
                        },
                        {
                            header: "Aksi",
                            headerClassName: "text-center w-32",
                            className: "text-center w-32",
                            render: (kader: Kader) => (
                                <div className="flex items-center justify-center gap-2">
                                    {permissions.includes("edit-kader") && (
                                        <Link
                                            href={route("be.kader.edit", kader.id)}
                                            className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl active:scale-90 transition-all cursor-pointer inline-flex items-center"
                                        >
                                            <Edit2 size={16} />
                                        </Link>
                                    )}
                                    {permissions.includes("delete-kader") && (
                                        <button
                                            onClick={() => openDeleteModal(kader)}
                                            className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl active:scale-90 transition-all cursor-pointer"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ),
                        },
                    ]}
                    data={localKaders.data}
                />

                {/* Pagination Section */}
                <div className="p-6 border-t border-slate-50 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/20 dark:bg-slate-700/20">
                    <p className="text-sm text-slate-500 dark:text-slate-200">
                        Menampilkan{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localKaders.from ?? 0}
                        </span>{" "}
                        sampai{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localKaders.to ?? 0}
                        </span>{" "}
                        dari{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localKaders.total}
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
                            <option value="100">100</option>
                        </select>
                    </div>

                    <Pagination
                        links={localKaders.links}
                        onPageChange={(url) => fetchData(url)}
                    />
                </div>
            </Card>

            <ConfirmationModal
                show={showDeleteModal}
                processing={processing}
                title="Hapus Kader"
                message="Apakah Anda yakin ingin menghapus data kader ini? Data yang dihapus tidak dapat dikembalikan."
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </MainLayout>
    );
}
