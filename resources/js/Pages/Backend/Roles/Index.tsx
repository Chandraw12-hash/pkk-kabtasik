import React, { useState, useEffect, useRef } from "react";
import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import ConfirmationModal from "@/Components/UI/ConfirmationModal";
import Badge from "@/Components/UI/Badge";
import Pagination from "@/Components/Data/Pagination";
import Card from "@/Components/UI/Card";
import Table from "@/Components/Data/Table";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import {
    ShieldCheck,
    Edit2,
    Trash2,
    Search,
    RotateCcw,
    Shield,
    Users,
    Key,
    Lock,
    UserCog,
    MapPin, // ✅ TAMBAH
} from "lucide-react";
import { PaginatedData, Role } from "@/types/model";
import axios from "axios";

interface IndexProps {
    roles: PaginatedData<Role>;
    filters: {
        search?: string;
        per_page?: number | string;
    };
}

const getRoleIcon = (roleName: string) => {
    const iconMap: Record<string, any> = {
        admin: Shield,
        operator: UserCog,
        'admin-pkk': ShieldCheck,
        kader_dasawisma: Users,
        kecamatan: MapPin, // ✅ TAMBAH
    };
    return iconMap[roleName] || Shield;
};

const getRoleColor = (roleName: string) => {
    const colorMap: Record<string, string> = {
        admin: "bg-red-50 text-red-600 border-red-100",
        operator: "bg-blue-50 text-blue-600 border-blue-100",
        'admin-pkk': "bg-purple-50 text-purple-600 border-purple-100",
        kader_dasawisma: "bg-teal-50 text-teal-600 border-teal-100",
        kecamatan: "bg-cyan-50 text-cyan-600 border-cyan-100", // ✅ TAMBAH
    };
    return colorMap[roleName] || "bg-slate-50 text-slate-600 border-slate-100";
};

export default function Index({ roles, filters = {} }: IndexProps) {
    const { permissions } = usePage<any>().props.auth || { permissions: [] };
    const [search, setSearch] = useState(filters.search || "");
    const [perPage, setPerPage] = useState(Number(filters.per_page) || 10);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    const [localRoles, setLocalRoles] = useState<PaginatedData<Role>>(roles);
    const [isLoading, setIsLoading] = useState(false);
    const isFirstRender = useRef(true);

    const { delete: destroy, processing } = useForm({});

    const fetchData = (url: string, params: any = {}) => {
        setIsLoading(true);
        axios
            .get(url, {
                params: {
                    ...params,
                    search: search || undefined,
                    per_page: perPage,
                },
                headers: { Accept: "application/json" }
            })
            .then((res) => {
                if (res.data && typeof res.data === "object" && "data" in res.data) {
                    setLocalRoles(res.data);
                } else if (Array.isArray(res.data)) {
                    setLocalRoles((prev) => ({
                        ...prev,
                        data: res.data,
                    }));
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
            fetchData(route("be.roles.index"));
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
                fetchData(route("be.roles.index"));
            },
        });
    };

    const handleReset = () => {
        setSearch("");
        setPerPage(10);
    };

    return (
        <MainLayout>
            <Head title="Manajemen Role" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Manajemen Role & Hak Akses
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Kelola level akses pengguna sistem PKK
                    </p>
                </div>
                {permissions.includes("create-role") && (
                    <Button
                        variant="primary"
                        href={route("be.roles.create")}
                        className="shadow-lg shadow-teal-100 dark:shadow-none bg-teal-600 hover:bg-teal-700 flex items-center gap-2"
                    >
                        <Shield size={16} />
                        <span>Tambah Role</span>
                    </Button>
                )}
            </div>

            {/* Card */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
                {/* Filter */}
                <div className="p-5 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[180px] max-w-sm">
                            <TextInput
                                iconLeft={<Search size={17} />}
                                placeholder="Cari nama role..."
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                containerClassName="relative w-full"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        {search && (
                            <Button
                                variant="secondary"
                                onClick={handleReset}
                                className="flex items-center gap-1.5 text-sm"
                            >
                                <RotateCcw size={14} />
                                <span>Reset</span>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Table */}
                <Table
                    isLoading={isLoading}
                    columns={[
                        {
                            header: "#",
                            className: "text-center text-sm font-medium text-slate-400 dark:text-slate-200 w-14",
                            headerClassName: "text-center w-14",
                            render: (_: Role, index: number) => {
                                const currentPage = localRoles.current_page ?? 1;
                                const perPageVal = localRoles.per_page ?? 10;
                                return (currentPage - 1) * perPageVal + index + 1;
                            },
                        },
                        {
                            header: "Nama Role",
                            className: "min-w-[180px]",
                            render: (role: Role) => {
                                const Icon = getRoleIcon(role.name);
                                const color = getRoleColor(role.name);
                                return (
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center border ${color}`}>
                                            <Icon size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 capitalize">
                                                {role.name?.replace(/-/g, ' ')}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {role.guard_name || 'web'}
                                            </p>
                                        </div>
                                    </div>
                                );
                            },
                        },
                        {
                            header: "Hak Akses",
                            className: "w-40",
                            headerClassName: "text-center",
                            render: (role: Role) => {
                                const permissions = role.permissions || [];
                                if (permissions.length === 0) {
                                    return (
                                        <span className="text-xs text-slate-400 italic">Tidak ada akses</span>
                                    );
                                }
                                return (
                                    <div className="flex flex-wrap gap-1.5 justify-center">
                                        {permissions.slice(0, 3).map((perm: any) => (
                                            <span
                                                key={perm.id}
                                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-100"
                                            >
                                                <Lock size={10} className="mr-0.5" />
                                                {perm.name}
                                            </span>
                                        ))}
                                        {permissions.length > 3 && (
                                            <span className="text-xs text-teal-600 font-medium">
                                                +{permissions.length - 3} lagi
                                            </span>
                                        )}
                                    </div>
                                );
                            },
                        },
                        {
                            header: "Total Pengguna",
                            className: "w-32",
                            headerClassName: "text-center",
                            render: (role: Role) => (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                    <Users size={12} />
                                    {role.users_count || 0}
                                </span>
                            ),
                        },
                        {
                            header: "Aksi",
                            headerClassName: "text-center w-28",
                            className: "text-center w-28",
                            render: (role: Role) => (
                                <div className="flex items-center justify-center gap-1">
                                    {permissions.includes("edit-role") && (
                                        <Link
                                            href={route("be.roles.edit", role.id)}
                                            className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                                            title="Edit Role"
                                        >
                                            <Edit2 size={15} />
                                        </Link>
                                    )}
                                    {permissions.includes("delete-role") && role.name !== 'admin' && (
                                        <button
                                            onClick={() => openDeleteModal(role)}
                                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                            title="Hapus Role"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    )}
                                    {role.name === 'admin' && (
                                        <span className="text-xs text-slate-400 italic">Tidak bisa dihapus</span>
                                    )}
                                </div>
                            ),
                        },
                    ]}
                    data={localRoles.data || []}
                />

                {/* Empty State */}
                {!isLoading && (localRoles.data || []).length === 0 && (
                    <div className="py-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
                            <Shield size={32} className="text-slate-300" />
                        </div>
                        <p className="text-sm font-medium text-slate-600">Belum ada role</p>
                        <p className="text-xs text-slate-400 mt-0.5">Tambahkan role baru untuk mengatur hak akses</p>
                    </div>
                )}

                {/* Pagination */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/30 dark:bg-slate-800/30">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Menampilkan{" "}
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {localRoles.from ?? 0}
                        </span>{" "}
                        sampai{" "}
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {localRoles.to ?? 0}
                        </span>{" "}
                        dari{" "}
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {localRoles.total ?? 0}
                        </span>{" "}
                        data
                    </p>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <span>Tampilkan</span>
                            <select
                                value={perPage}
                                onChange={(e) => setPerPage(parseInt(e.target.value))}
                                className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 py-1.5 px-2.5 transition-all outline-none cursor-pointer dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>

                        <Pagination
                            links={localRoles.links || []}
                            onPageChange={(url) => fetchData(url)}
                        />
                    </div>
                </div>
            </Card>

            {/* Delete Modal */}
            <ConfirmationModal
                show={showDeleteModal}
                processing={processing}
                title="Hapus Role"
                message={
                    selectedRole
                        ? `Apakah Anda yakin ingin menghapus role "${selectedRole.name}"? Pengguna dengan role ini akan kehilangan hak akses.`
                        : "Apakah Anda yakin ingin menghapus role ini?"
                }
                onConfirm={handleDelete}
                onCancel={() => {
                    setShowDeleteModal(false);
                    setSelectedRole(null);
                }}
            />
        </MainLayout>
    );
}
