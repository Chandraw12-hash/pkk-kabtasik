import React, { FormEventHandler } from "react";
import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import Card from "@/Components/UI/Card";
import { Head, useForm, Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import { Permission, Role } from "@/types/model";

interface EditProps {
    role: Role;
    permissions: Permission[];
}

export default function Edit({ role, permissions }: EditProps) {
    // role.permissions is Permission[], we map to names for form data
    const initialPermissions = role.permissions
        ? role.permissions.map((p) => p.name)
        : [];

    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        permissions: initialPermissions as string[],
    });

    const handlePermissionChange = (permissionName: string) => {
        const currentPermissions = [...data.permissions];
        if (currentPermissions.includes(permissionName)) {
            setData(
                "permissions",
                currentPermissions.filter((p) => p !== permissionName),
            );
        } else {
            setData("permissions", [...currentPermissions, permissionName]);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route("be.roles.update", role.id));
    };

    return (
        <MainLayout>
            <Head title={`Edit Role: ${role.name}`} />

            <div className="flex items-center gap-4 mb-8">
                <Link
                    href={route("be.roles.index")}
                    className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-brand-blue-600 hover:border-brand-blue-200 transition-all shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:text-brand-blue-400 dark:hover:border-slate-600"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Edit Role
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Ubah detail role dan hak akses
                    </p>
                </div>
            </div>

            <Card className="dark:bg-slate-800 dark:border-slate-700 dark:shadow-slate-700/50">
                <form onSubmit={submit} className="p-6">
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-slate-700 mb-2 dark:text-slate-300">
                            Nama Role
                        </label>
                        <TextInput
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            placeholder="Contoh: staff, manager, editor"
                            className="w-full max-w-lg py-2 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                        />
                        {errors.name && (
                            <p className="text-xs text-rose-500 mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                                Hak Akses (Permissions)
                            </label>
                            <div className="text-xs text-slate-500 font-medium italic">
                                * Klik pada kartu modul untuk memilih akses
                            </div>
                        </div>

                        {errors.permissions && (
                            <div className="mb-6 text-sm text-rose-500 font-medium bg-rose-50 border border-rose-100 px-4 py-2 rounded-xl inline-block dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400">
                                {errors.permissions}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Object.entries(
                                permissions.reduce(
                                    (acc, permission) => {
                                        // Grouping logic
                                        let group = "Lainnya";
                                        const name = permission.name;

                                        if (
                                            name.includes("user") ||
                                            name.includes("role")
                                        )
                                            group = "User & Role Management";
                                        else if (name.includes("skpd"))
                                            group = "Data SKPD";
                                        else if (name.includes("indikator"))
                                            group = "Manajemen Indikator";
                                        else if (name.includes("aspek"))
                                            group = "Manajemen Aspek";
                                        else if (name.includes("periode"))
                                            group = "Pengaturan Periode";
                                        else if (name.includes("kebijakan"))
                                            group = "Kebijakan SPBE";
                                        else if (name.includes("indeks-spbe"))
                                            group = "Nilai Indeks SPBE";
                                        else if (name.includes("eviden"))
                                            group = "Data Eviden";
                                        else if (name.includes("profile"))
                                            group = "Profil User";

                                        if (!acc[group]) acc[group] = [];
                                        acc[group].push(permission);
                                        return acc;
                                    },
                                    {} as Record<string, Permission[]>,
                                ),
                            ).map(([groupName, groupPermissions]) => {
                                const groupPermissionNames =
                                    groupPermissions.map((p) => p.name);
                                const isAllSelected =
                                    groupPermissionNames.every((name) =>
                                        data.permissions.includes(name),
                                    );

                                const toggleGroup = () => {
                                    if (isAllSelected) {
                                        setData(
                                            "permissions",
                                            data.permissions.filter(
                                                (p) =>
                                                    !groupPermissionNames.includes(
                                                        p,
                                                    ),
                                            ),
                                        );
                                    } else {
                                        const newPermissions = Array.from(
                                            new Set([
                                                ...data.permissions,
                                                ...groupPermissionNames,
                                            ]),
                                        );
                                        setData("permissions", newPermissions);
                                    }
                                };

                                return (
                                    <div
                                        key={groupName}
                                        className="bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden"
                                    >
                                        <div className="px-5 py-3 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-200">
                                                {groupName}
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={toggleGroup}
                                                className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-all ${
                                                    isAllSelected
                                                        ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                                                        : "bg-brand-blue-50 text-brand-blue-600 dark:bg-brand-blue-500/10 dark:text-brand-blue-400"
                                                }`}
                                            >
                                                {isAllSelected
                                                    ? "Hapus Semua"
                                                    : "Pilih Semua"}
                                            </button>
                                        </div>
                                        <div className="p-4 grid grid-cols-1 gap-2">
                                            {groupPermissions.map(
                                                (permission) => (
                                                    <label
                                                        key={permission.id}
                                                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer group"
                                                    >
                                                        <div className="relative flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={data.permissions.includes(
                                                                    permission.name,
                                                                )}
                                                                onChange={() =>
                                                                    handlePermissionChange(
                                                                        permission.name,
                                                                    )
                                                                }
                                                                className="w-4 h-4 text-brand-blue-600 border-slate-300 rounded focus:ring-brand-blue-500 dark:bg-slate-700 dark:border-slate-600"
                                                            />
                                                        </div>
                                                        <span
                                                            className={`text-sm transition-colors ${
                                                                data.permissions.includes(
                                                                    permission.name,
                                                                )
                                                                    ? "text-slate-900 font-semibold dark:text-white"
                                                                    : "text-slate-500 dark:text-slate-400 group-hover:text-slate-700"
                                                            }`}
                                                        >
                                                            {permission.name
                                                                .split("-")
                                                                .map(
                                                                    (word) =>
                                                                        word
                                                                            .charAt(
                                                                                0,
                                                                            )
                                                                            .toUpperCase() +
                                                                        word.slice(
                                                                            1,
                                                                        ),
                                                                )
                                                                .join(" ")}
                                                        </span>
                                                    </label>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {permissions.length === 0 && (
                            <p className="text-slate-500 text-sm italic dark:text-slate-400">
                                Belum ada permission yang tersedia di sistem.
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-3 pt-6 border-t border-slate-100 dark:border-slate-700">
                        <Link
                            href={route("be.roles.index")}
                            className="px-4 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-700 transition-colors dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                        >
                            Batal
                        </Link>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={processing}
                            className="shadow-lg shadow-brand-blue-100 dark:shadow-none"
                        >
                            {/* <Save size={18} /> */}
                            <span>Simpan Perubahan</span>
                        </Button>
                    </div>
                </form>
            </Card>
        </MainLayout>
    );
}
