import React, { useState, useEffect, useRef } from "react";
import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import ConfirmationModal from "@/Components/UI/ConfirmationModal";
import Badge from "@/Components/UI/Badge";
import Table from "@/Components/Data/Table";
import Pagination from "@/Components/Data/Pagination";
import Card from "@/Components/UI/Card";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    Search,
    Edit2,
    Trash2,
    RotateCcw,
    UserPlus,
    Shield,
    User as UserIcon,  // ← rename jadi UserIcon
    Mail,
    Phone,
    CheckCircle,
    XCircle
} from "lucide-react";
import { PaginatedData, User } from "@/types/model";
import { usePage } from "@inertiajs/react";
import axios from "axios";

interface IndexProps {
    users: PaginatedData<User>;
    filters: {
        search?: string;
        per_page?: number | string;
        role?: string;
        status?: string;
    };
}

const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
        active: {
            label: "Aktif",
            color: "bg-green-100 text-green-700 border-green-200",
            icon: <CheckCircle size={12} className="text-green-600" />
        },
        inactive: {
            label: "Nonaktif",
            color: "bg-gray-100 text-gray-700 border-gray-200",
            icon: <XCircle size={12} className="text-gray-500" />
        },
    };
    return statusMap[status] || {
        label: status,
        color: "bg-gray-100 text-gray-700 border-gray-200",
        icon: null
    };
};

const getRoleBadge = (roleName: string) => {
    const roleMap: Record<string, { label: string; color: string }> = {
        admin: { label: "Admin", color: "bg-red-100 text-red-700 border-red-200" },
        operator: { label: "Operator", color: "bg-blue-100 text-blue-700 border-blue-200" },
        kader_dasawisma: { label: "Kader", color: "bg-teal-100 text-teal-700 border-teal-200" },
        'admin-pkk': { label: "Admin PKK", color: "bg-purple-100 text-purple-700 border-purple-200" },
    };
    return roleMap[roleName] || { label: roleName, color: "bg-gray-100 text-gray-700 border-gray-200" };
};

export default function Index({ users, filters = {} }: IndexProps) {
    const { permissions } = usePage<any>().props.auth || { permissions: [] };
    const [search, setSearch] = useState(filters.search || "");
    const [perPage, setPerPage] = useState(Number(filters.per_page) || 10);
    const [roleFilter, setRoleFilter] = useState(filters.role || "");
    const [statusFilter, setStatusFilter] = useState(filters.status || "");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const [localUsers, setLocalUsers] = useState<PaginatedData<User>>(users);
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
                    role: roleFilter || undefined,
                    status: statusFilter || undefined,
                },
                headers: { Accept: "application/json" }
            })
            .then((res) => {
                if (res.data && typeof res.data === "object" && "data" in res.data) {
                    setLocalUsers(res.data);
                } else if (Array.isArray(res.data)) {
                    setLocalUsers((prev) => ({
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
            fetchData(route("be.users.index"));
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, perPage, roleFilter, statusFilter]);

    const openDeleteModal = (user: User) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (!selectedUser) return;

        destroy(route("be.users.destroy", selectedUser.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedUser(null);
                fetchData(route("be.users.index"));
            },
        });
    };

    const handleReset = () => {
        setSearch("");
        setPerPage(10);
        setRoleFilter("");
        setStatusFilter("");
    };

    const roleOptions = [
        { value: "", label: "Semua Role" },
        { value: "admin", label: "Admin" },
        { value: "operator", label: "Operator" },
        { value: "kader_dasawisma", label: "Kader" },
        { value: "admin-pkk", label: "Admin PKK" },
    ];

    const statusOptions = [
        { value: "", label: "Semua Status" },
        { value: "active", label: "Aktif" },
        { value: "inactive", label: "Nonaktif" },
    ];

    return (
        <MainLayout>
            <Head title="Manajemen Pengguna" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Manajemen Pengguna
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Kelola akses dan akun pengguna sistem PKK
                    </p>
                </div>
                <Button
                    variant="primary"
                    href={route("be.users.create")}
                    className="shadow-lg shadow-teal-100 dark:shadow-none bg-teal-600 hover:bg-teal-700 flex items-center gap-2"
                >
                    <UserPlus size={16} />
                    <span>Tambah Pengguna</span>
                </Button>
            </div>

            {/* Card */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
                {/* Filter */}
                <div className="p-5 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[180px] max-w-sm">
                            <TextInput
                                iconLeft={<Search size={17} />}
                                placeholder="Cari nama atau email..."
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                containerClassName="relative w-full"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="text-sm rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 px-3 py-2 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                        >
                            {roleOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="text-sm rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 px-3 py-2 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        {(search || roleFilter || statusFilter || perPage !== 10) && (
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
                            render: (_: User, index: number) => {
                                const currentPage = localUsers.current_page ?? 1;
                                const perPageVal = localUsers.per_page ?? 10;
                                return (currentPage - 1) * perPageVal + index + 1;
                            },
                        },
                        {
                            header: "Pengguna",
                            className: "min-w-[200px]",
                            render: (user: User | any) => (
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xs border border-teal-100 uppercase dark:bg-teal-900/20 dark:border-teal-800 dark:text-teal-400">
                                        {user.name?.substring(0, 2) || "U"}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                            {user.name}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <Mail size={12} />
                                            <span>{user.email}</span>
                                        </div>
                                    </div>
                                </div>
                            ),
                        },
                        {
                            header: "Username",
                            className: "w-32",
                            render: (user: User) => (
                                <span className="text-sm text-slate-600 dark:text-slate-300 font-mono">
                                    {user.username || "-"}
                                </span>
                            ),
                        },
                        {
                            header: "No. HP",
                            className: "w-32",
                            render: (user: User) => (
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                    {user.no_hp || "-"}
                                </span>
                            ),
                        },
                        {
                            header: "Role",
                            className: "w-36",
                            headerClassName: "text-center",
                            render: (user: User) => {
                                const roles = user.roles || [];
                                if (roles.length === 0) {
                                    return (
                                        <span className="text-xs text-slate-400 italic">Tidak ada role</span>
                                    );
                                }
                                return (
                                    <div className="flex flex-wrap gap-1.5 justify-center">
                                        {roles.map((role: any) => {
                                            const roleBadge = getRoleBadge(role.name);
                                            return (
                                                <span
                                                    key={role.id}
                                                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleBadge.color}`}
                                                >
                                                    <Shield size={11} />
                                                    {roleBadge.label}
                                                </span>
                                            );
                                        })}
                                    </div>
                                );
                            },
                        },
                        {
                            header: "Status",
                            className: "w-28",
                            headerClassName: "text-center",
                            render: (user: User) => {
                                const status = getStatusBadge(user.status || "active");
                                return (
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                                        {status.icon}
                                        {status.label}
                                    </span>
                                );
                            },
                        },
                        {
                            header: "Aksi",
                            headerClassName: "text-center w-28",
                            className: "text-center w-28",
                            render: (user: User) => (
                                <div className="flex items-center justify-center gap-1">
                                    <Link
                                        href={route("be.users.edit", user.id)}
                                        className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                                        title="Edit"
                                    >
                                        <Edit2 size={15} />
                                    </Link>
                                    <button
                                        onClick={() => openDeleteModal(user)}
                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                        title="Hapus"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            ),
                        },
                    ]}
                    data={localUsers.data || []}
                />

                {/* Empty State */}
                {!isLoading && (localUsers.data || []).length === 0 && (
                    <div className="py-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
                            <UserIcon size={32} className="text-slate-300" />
                        </div>
                        <p className="text-sm font-medium text-slate-600">Belum ada pengguna</p>
                        <p className="text-xs text-slate-400 mt-0.5">Tambahkan pengguna baru untuk mulai</p>
                    </div>
                )}

                {/* Pagination */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/30 dark:bg-slate-800/30">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Menampilkan{" "}
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {localUsers.from ?? 0}
                        </span>{" "}
                        sampai{" "}
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {localUsers.to ?? 0}
                        </span>{" "}
                        dari{" "}
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {localUsers.total ?? 0}
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
                            links={localUsers.links || []}
                            onPageChange={(url) => fetchData(url)}
                        />
                    </div>
                </div>
            </Card>

            {/* Delete Modal */}
            <ConfirmationModal
                show={showDeleteModal}
                processing={processing}
                title="Hapus Pengguna"
                message={
                    selectedUser
                        ? `Apakah Anda yakin ingin menghapus pengguna "${selectedUser.name}"? Semua data terkait akan dihapus secara permanen.`
                        : "Apakah Anda yakin ingin menghapus pengguna ini?"
                }
                onConfirm={handleDelete}
                onCancel={() => {
                    setShowDeleteModal(false);
                    setSelectedUser(null);
                }}
            />
        </MainLayout>
    );
}
