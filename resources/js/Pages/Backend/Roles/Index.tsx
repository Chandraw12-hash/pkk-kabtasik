import React, { useState, useEffect } from "react";
import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import ConfirmationModal from "@/Components/UI/ConfirmationModal";
import Badge from "@/Components/UI/Badge";
import Pagination from "@/Components/Data/Pagination";
import Card from "@/Components/UI/Card";
import Table from "@/Components/Data/Table";
import { Head, Link, useForm, router, usePage } from "@inertiajs/react";
import { ShieldCheck, Edit2, Trash2, Search, RotateCcw } from "lucide-react";
import { PaginatedData, Role } from "@/types/model";
import axios from "axios";

interface IndexProps {
    roles: PaginatedData<Role>;
    filters: {
        search?: string;
        per_page?: number | string;
    };
}

export default function Index({ roles, filters }: IndexProps) {
    const { permissions } = usePage<any>().props.auth;
    const [search, setSearch] = useState(filters.search || "");
    const [perPage, setPerPage] = useState(filters.per_page || 10);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    const [localRoles, setLocalRoles] = useState<PaginatedData<Role>>(roles);
    const [isLoading, setIsLoading] = useState(false);
    const isFirstRender = React.useRef(true);

    const { delete: destroy, processing } = useForm({});

    const fetchData = (url: string, params: any = {}) => {
        setIsLoading(true);
        axios
            .get(url, { params, headers: { Accept: "application/json" } })
            .then((res) => {
                // Pastikan response berupa data paginasi
                if (
                    res.data &&
                    typeof res.data === "object" &&
                    "data" in res.data
                ) {
                    setLocalRoles(res.data);
                } else if (Array.isArray(res.data)) {
                    // Jika hanya array, bungkus dalam struktur paginasi tiruan
                    setLocalRoles((prev) => ({
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
            fetchData(route("be.roles.index"), {
                search,
                per_page: perPage,
            });
        }, 300);
        return () => clearTimeout(timeout);
    }, [search, perPage]);

    const openDeleteModal = (role: Role) => {
        setSelectedRole(role);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (!selectedRole) return;

        destroy(route("be.roles.destroy", selectedRole.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedRole(null);
                // Refresh data
                fetchData(route("be.roles.index"), {
                    search,
                    per_page: perPage,
                });
            },
        });
    };

    return (
        <MainLayout>
            <Head title="Manajemen Role" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Manajemen Role
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Kelola role dan hak akses (permissions) user
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="primary"
                        href={route("be.roles.create")}
                        className="shadow-lg shadow-indigo-100 dark:shadow-none"
                    >
                        <span>Tambah Role</span>
                    </Button>
                </div>
            </div>

            <Card className="dark:bg-slate-800 dark:border-slate-700 dark:shadow-slate-700/50">
                {/* Filter & Search Bar */}
                <div className="p-6 border-b border-slate-50 dark:border-slate-700 flex items-center gap-4">
                    <div className="relative w-full max-w-md">
                        <TextInput
                            iconLeft={<Search size={18} />}
                            placeholder="Cari role..."
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
                            className:
                                "text-center text-sm font-medium text-slate-400 dark:text-slate-200 w-16",
                            headerClassName: "text-center w-16",
                            render: (_: Role, index: number) => {
                                const currentPage =
                                    localRoles.current_page ?? 1;
                                const perPageVal = localRoles.per_page ?? 10;
                                return (
                                    (currentPage - 1) * perPageVal + index + 1
                                );
                            },
                        },
                        {
                            header: "Role Name",
                            className: "w-64",
                            headerClassName: "w-64",
                            render: (role: Role) => (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-100 uppercase">
                                        <ShieldCheck size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700 capitalize dark:text-slate-200">
                                            {role.name}
                                        </p>
                                    </div>
                                </div>
                            ),
                        },
                        {
                            header: "Permissions",
                            className: "w-48",
                            headerClassName: "w-48",
                            render: (role: Role) => (
                                <>
                                    {role.permissions &&
                                    role.permissions.length > 0 ? (
                                        <Badge type="success">
                                            {role.permissions.length} Akses
                                        </Badge>
                                    ) : (
                                        <span className="text-xs text-slate-400 italic">
                                            Tidak Ada Akses
                                        </span>
                                    )}
                                </>
                            ),
                        },
                        {
                            header: "Aksi",
                            headerClassName: "text-center w-32",
                            className: "text-center w-32",
                            render: (role: Role) => (
                                <div className="flex items-center justify-center gap-2">
                                    <Link
                                        href={route("be.roles.edit", role.id)}
                                        className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl active:scale-90 transition-all cursor-pointer inline-flex items-center"
                                    >
                                        <Edit2 size={16} />
                                    </Link>
                                    <button
                                        onClick={() => openDeleteModal(role)}
                                        className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl active:scale-90 transition-all cursor-pointer"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ),
                        },
                    ]}
                    data={localRoles.data}
                />

                {/* Pagination Section */}
                <div className="p-6 border-t border-slate-50 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/20 dark:bg-slate-700/20">
                    <p className="text-sm text-slate-500 dark:text-slate-200">
                        Menampilkan{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localRoles.from ?? 0}
                        </span>{" "}
                        sampai{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localRoles.to ?? 0}
                        </span>{" "}
                        dari{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localRoles.total}
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
                            <option value="100">100</option>
                        </select>
                    </div>

                    <Pagination
                        links={localRoles.links}
                        onPageChange={(url) => fetchData(url)}
                    />
                </div>
            </Card>

            <ConfirmationModal
                show={showDeleteModal}
                processing={processing}
                title="Hapus Role"
                message={`Apakah Anda yakin ingin menghapus role "${selectedRole?.name}"? User yang memiliki role ini akan kehilangan akses terkait.`}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
        </MainLayout>
    );
}
