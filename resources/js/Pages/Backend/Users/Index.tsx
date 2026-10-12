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
    User as UserIcon,
    Mail,
    Phone,
    CheckCircle,
    XCircle,
    MapPin,  // ✅ TAMBAH
    Power,
    KeyRound,
    Eye,
    Clock,
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
    const statusMap: Record<string, { label: string; type: "success" | "default" | "danger" | "warning" | "info"; icon: React.ReactNode }> = {
        active: {
            label: "Aktif",
            type: "success",
            icon: <CheckCircle size={12} />
        },
        inactive: {
            label: "Nonaktif",
            type: "default",
            icon: <XCircle size={12} />
        },
    };
    return statusMap[status] || {
        label: status,
        type: "default" as const,
        icon: null
    };
};

const getRoleBadge = (roleName: string) => {
    const roleMap: Record<string, { label: string; type: "success" | "default" | "danger" | "warning" | "info" }> = {
        'super-admin': { label: "Super Admin", type: "danger" },
        admin: { label: "Admin", type: "warning" },
        kecamatan: { label: "Kecamatan", type: "info" },
        pokja1: { label: "Pokja I", type: "info" },
        pokja2: { label: "Pokja II", type: "success" },
        pokja3: { label: "Pokja III", type: "warning" },
        pokja4: { label: "Pokja IV", type: "default" },
        dasawisma: { label: "Dasawisma", type: "success" },
        'admin desa': { label: "Admin Desa", type: "info" },
    };
    return roleMap[roleName] || { label: roleName, type: "default" as const };
};

export default function Index({ users, filters = {} }: IndexProps) {
    const { permissions, roles } = usePage<any>().props.auth || { permissions: [], roles: [] };
    const isSuperAdmin = (roles || []).includes("super-admin");
    const [search, setSearch] = useState(filters.search || "");
    const [perPage, setPerPage] = useState(Number(filters.per_page) || 10);
    const [roleFilter, setRoleFilter] = useState(filters.role || "");
    const [statusFilter, setStatusFilter] = useState(filters.status || "");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showResetModal, setShowResetModal] = useState<User | null>(null);
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

    const { delete: destroy, processing, patch, post } = useForm({});

    const [localUsers, setLocalUsers] = useState<PaginatedData<User>>(users);
    const [isLoading, setIsLoading] = useState(false);
    const isFirstRender = useRef(true);

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

    const handleToggle = (user: User) => {
        patch(route("be.users.toggle-status", user.id), {
            onSuccess: () => fetchData(route("be.users.index")),
        });
    };

    const handleResetPassword = () => {
        if (!showResetModal) return;
        if (newPassword.length < 10 || newPassword !== newPasswordConfirm) return;
        patch(route("be.users.reset-password", showResetModal.id), {
            data: { password: newPassword, password_confirmation: newPasswordConfirm },
            onSuccess: () => {
                setShowResetModal(null);
                setNewPassword("");
                setNewPasswordConfirm("");
            },
        });
    };

    const handleImpersonate = (user: User) => {
        if (!confirm(`Masuk sebagai ${user.name}? Anda bisa keluar lagi setelahnya.`)) return;
        post(route("be.users.impersonate", user.id));
    };

    const handleReset = () => {
        setSearch("");
        setPerPage(10);
        setRoleFilter("");
        setStatusFilter("");
    };

    const roleOptions = [
        { value: "", label: "Semua Role" },
        { value: "super-admin", label: "Super Admin" },
        { value: "admin", label: "Admin" },
        { value: "kecamatan", label: "Admin Kecamatan" },
        { value: "pokja1", label: "Pokja I" },
        { value: "pokja2", label: "Pokja II" },
        { value: "pokja3", label: "Pokja III" },
        { value: "pokja4", label: "Pokja IV" },
        { value: "dasawisma", label: "Dasawisma" },
        { value: "admin desa", label: "Admin Desa" },
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
                            className: "min-w-[220px]",
                            render: (user: User | any) => (
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xs border border-teal-100 uppercase dark:bg-teal-900/20 dark:border-teal-800 dark:text-teal-400 shrink-0">
                                        {user.name?.substring(0, 2) || "U"}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                                            {user.name}{" "}
                                            <span className="font-mono font-normal text-xs text-slate-400">
                                                @{user.username || "-"}
                                            </span>
                                        </p>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-400 truncate">
                                            <Mail size={12} className="shrink-0" />
                                            <span className="truncate">{user.email}</span>
                                        </div>
                                    </div>
                                </div>
                            ),
                        },
                        {
                            header: "Wilayah & Kontak",
                            className: "min-w-[160px]",
                            render: (user: User | any) => {
                                const isDasawisma = (user.roles || []).some(
                                    (r: any) => r.name === "dasawisma"
                                );
                                return (
                                    <div className="space-y-1">
                                        <span className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
                                            {user.kecamatan ? (
                                                <>
                                                    <MapPin size={12} className="text-cyan-600 shrink-0" />
                                                    <span className="truncate">{user.kecamatan}</span>
                                                </>
                                            ) : (
                                                <span className="text-slate-300 italic">Tanpa wilayah</span>
                                            )}
                                        </span>
                                        {isDasawisma && (
                                            <p className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate">
                                                {user.desa || user.nama_desa || (
                                                    <span className="text-amber-600 dark:text-amber-400">
                                                        Desa belum diisi
                                                    </span>
                                                )}
                                            </p>
                                        )}
                                        <p className="text-xs text-slate-400">
                                            {user.no_hp || "HP -"}
                                        </p>
                                    </div>
                                );
                            },
                        },
                        {
                            header: "Akses",
                            className: "min-w-[150px]",
                            render: (user: User) => {
                                const roles = user.roles || [];
                                const status = getStatusBadge(user.status || "active");
                                return (
                                    <div className="space-y-1.5">
                                        <div className="flex flex-wrap gap-1.5">
                                            {roles.length === 0 ? (
                                                <span className="text-xs text-slate-400 italic">Tidak ada role</span>
                                            ) : (
                                                roles.map((role: any) => {
                                                    const roleBadge = getRoleBadge(role.name);
                                                    return (
                                                        <Badge
                                                            key={role.id}
                                                            type={roleBadge.type}
                                                            className="gap-1"
                                                        >
                                                            <Shield size={11} />
                                                            {roleBadge.label}
                                                        </Badge>
                                                    );
                                                })
                                            )}
                                        </div>
                                        <Badge type={status.type} className="gap-1">
                                            {status.icon}
                                            {status.label}
                                        </Badge>
                                    </div>
                                );
                            },
                        },
                        {
                            header: "Terakhir Masuk",
                            className: "w-40",
                            render: (user: User) => {
                                if (!user.last_login) {
                                    return (
                                        <span className="inline-flex items-center gap-1 text-xs text-slate-400 italic">
                                            <Clock size={12} /> belum pernah
                                        </span>
                                    );
                                }
                                const d = new Date(user.last_login);
                                const old =
                                    Date.now() - d.getTime() >
                                    30 * 24 * 3600 * 1000;
                                return (
                                    <span
                                        className={`inline-flex items-center gap-1 text-xs ${
                                            old
                                                ? "text-rose-600 font-semibold"
                                                : "text-slate-500"
                                        }`}
                                        title={d.toLocaleString("id-ID")}
                                    >
                                        <Clock size={12} />
                                        {d.toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </span>
                                );
                            },
                        },
                        {
                            header: "Aksi",
                            headerClassName: "text-center w-40",
                            className: "text-center w-40",
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
                                        onClick={() => handleToggle(user)}
                                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all cursor-pointer"
                                        title={
                                            (user.status || "active") ===
                                            "active"
                                                ? "Nonaktifkan (kunci)"
                                                : "Aktifkan lagi"
                                        }
                                    >
                                        <Power size={15} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowResetModal(user);
                                            setNewPassword("");
                                            setNewPasswordConfirm("");
                                        }}
                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                                        title="Reset password"
                                    >
                                        <KeyRound size={15} />
                                    </button>
                                    {isSuperAdmin && (
                                        <button
                                            onClick={() =>
                                                handleImpersonate(user)
                                            }
                                            className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all cursor-pointer"
                                            title="Pinjam-masuk sebagai user ini"
                                        >
                                            <Eye size={15} />
                                        </button>
                                    )}
                                    <span className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-0.5" />
                                    <button
                                        onClick={() => openDeleteModal(user)}
                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
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

            {/* Reset Password Modal */}
            {showResetModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setShowResetModal(null)}
                    />
                    <div className="relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-sm p-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
                            Reset Password
                        </h3>
                        <p className="text-sm text-slate-500 mb-4">
                            Untuk {showResetModal.name} (
                            {showResetModal.username}). Minimal 10 karakter.
                        </p>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Password baru"
                            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm mb-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500"
                        />
                        <input
                            type="password"
                            value={newPasswordConfirm}
                            onChange={(e) =>
                                setNewPasswordConfirm(e.target.value)
                            }
                            placeholder="Ulangi password baru"
                            className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm mb-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500"
                        />
                        {newPassword &&
                            (newPassword.length < 10 ||
                                newPassword !== newPasswordConfirm) && (
                                <p className="text-xs text-rose-500 mb-3">
                                    Password minimal 10 karakter dan harus sama
                                    persis.
                                </p>
                            )}
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="secondary"
                                onClick={() => setShowResetModal(null)}
                            >
                                <span>Batal</span>
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleResetPassword}
                                disabled={
                                    processing ||
                                    newPassword.length < 10 ||
                                    newPassword !== newPasswordConfirm
                                }
                                className="bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-100 dark:shadow-none"
                            >
                                <span>Simpan Password</span>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
