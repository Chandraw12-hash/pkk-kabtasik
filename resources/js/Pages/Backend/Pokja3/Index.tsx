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
import { Search, Edit2, Trash2, RotateCcw, Plus } from "lucide-react";
import { usePage } from "@inertiajs/react";
import axios from "axios";

export default function Index({ pokjas, filters = {} }) {
    const [search, setSearch] = useState(filters.search || "");
    const [perPage, setPerPage] = useState(filters.per_page || 10);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [localPokjas, setLocalPokjas] = useState({
        ...pokjas,
        data: pokjas?.data || [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const isFirstRender = React.useRef(true);

    const { delete: destroy, processing } = useForm({});

    const fetchData = (url, params = {}) => {
        setIsLoading(true);
        axios
            .get(url, { params, headers: { Accept: "application/json" } })
            .then((res) => {
                if (res.data && typeof res.data === "object" && "data" in res.data) {
                    setLocalPokjas(res.data);
                } else if (Array.isArray(res.data)) {
                    setLocalPokjas((prev) => ({ ...prev, data: res.data }));
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
            fetchData(route("be.pokja3.index"), { search, per_page: perPage });
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, perPage]);

    const openDeleteModal = (item) => {
        setSelectedItem(item);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (!selectedItem) return;

        destroy(route("be.pokja3.destroy", selectedItem.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedItem(null);
                fetchData(route("be.pokja3.index"), { search, per_page: perPage });
            },
        });
    };

    return (
        <MainLayout>
            <Head title="Manajemen Data Pokja III" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Manajemen Data Pokja III
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Kelola data kegiatan dan program kerja Pokja III TP PKK
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="primary"
                        href={route("be.pokja3.create")}
                        className="shadow-lg shadow-indigo-100 dark:shadow-none flex items-center gap-2"
                    >
                        <Plus size={16} />
                        <span>Tambah Pokja III</span>
                    </Button>
                </div>
            </div>

            <Card className="dark:bg-slate-800 dark:border-slate-700 dark:shadow-slate-700/50">
                <div className="p-6 border-b border-slate-50 dark:border-slate-700 flex items-center gap-4">
                    <div className="relative w-full max-w-md">
                        <TextInput
                            iconLeft={<Search size={18} />}
                            placeholder="Cari judul kegiatan..."
                            className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            containerClassName="relative w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {search && (
                        <Button
                            variant="danger"
                            onClick={() => { setSearch(""); setPerPage(10); }}
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
                            className: "text-center text-sm font-medium text-slate-400 dark:text-slate-200 w-16",
                            headerClassName: "text-center w-16",
                            render: (_, index) => {
                                const currentPage = localPokjas.current_page ?? 1;
                                const perPageVal = localPokjas.per_page ?? 10;
                                return (currentPage - 1) * perPageVal + index + 1;
                            },
                        },
                        {
                            header: "Kategori",
                            className: "text-center w-36",
                            headerClassName: "text-center w-36",
                            render: (item) => (
                                <div className="flex justify-center">
                                    <Badge type="info">{item.kategori}</Badge>
                                </div>
                            ),
                        },
                        {
                            header: "Judul Kegiatan & Deskripsi",
                            className: "w-auto",
                            headerClassName: "w-auto",
                            render: (item) => (
                                <div>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                        {item.judul_kegiatan}
                                    </p>
                                    <p className="text-xs text-slate-400 dark:text-slate-400 line-clamp-1 mt-0.5">
                                        {item.deskripsi || "Tidak ada deskripsi"}
                                    </p>
                                </div>
                            ),
                        },
                        {
                            header: "Aksi",
                            headerClassName: "text-center w-32",
                            className: "text-center w-32",
                            render: (item) => (
                                <div className="flex items-center justify-center gap-2">
                                    <Link
                                        href={route("be.pokja3.edit", item.id)}
                                        className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl active:scale-90 transition-all cursor-pointer inline-flex items-center"
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
                    data={localPokjas.data}
                />

                <div className="p-6 border-t border-slate-50 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/20 dark:bg-slate-700/20">
                    <p className="text-sm text-slate-500 dark:text-slate-200">
                        Menampilkan <span className="font-bold text-slate-800 dark:text-slate-200">{localPokjas.from ?? 0}</span> sampai{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">{localPokjas.to ?? 0}</span> dari{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">{localPokjas.total}</span> data
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

                    <Pagination links={localPokjas.links} onPageChange={(url) => fetchData(url)} />
                </div>
            </Card>

            <ConfirmationModal
                show={showDeleteModal}
                processing={processing}
                title="Hapus Data Pokja III"
                message="Apakah Anda yakin ingin menghapus data kegiatan Pokja III ini? Data yang dihapus tidak dapat dikembalikan."
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </MainLayout>
    );
}
