import React, { FormEventHandler } from "react";
import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import SelectInput from "@/Components/Form/SelectInput";
import Button from "@/Components/UI/Button";
import Card from "@/Components/UI/Card";
import { Head, Link, useForm } from "@inertiajs/react";
import { ChevronLeft } from "lucide-react";
import { Role, User } from "@/types/model";

interface EditProps {
    user: User & { username?: string };
    roles: Role[];
    userRoles: string[];
}

export default function Edit({ user, roles, userRoles }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        password: "",
        password_confirmation: "",
        roles: userRoles || ([] as string[]),
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route("be.users.update", user.id));
    };

    const handleRoleChange = (roleName: string) => {
        const currentRoles = [...data.roles];
        if (currentRoles.includes(roleName)) {
            setData(
                "roles",
                currentRoles.filter((r) => r !== roleName),
            );
        } else {
            setData("roles", [...currentRoles, roleName]);
        }
    };

    return (
        <MainLayout>
            <Head title={`Edit User - ${user.name}`} />

            {/* Header Section */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href={route("be.users.index")}
                    className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm dark:bg-slate-700 dark:border-slate-600"
                >
                    <ChevronLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Edit User
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-200">
                        Anda sedang memperbarui data akun <b>{user.name}</b>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Essential Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card as="form" onSubmit={handleSubmit}>
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                        Nama Lengkap
                                    </label>
                                    <TextInput
                                        placeholder="Masukkan nama lengkap..."
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="w-full py-2.5"
                                        error={errors.name}
                                    />
                                </div>

                                {/* Username */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                        Username
                                    </label>
                                    <TextInput
                                        placeholder="Masukkan username..."
                                        value={data.username}
                                        onChange={(e) =>
                                            setData("username", e.target.value)
                                        }
                                        className="w-full py-2.5"
                                        error={errors.username}
                                    />
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                        Email
                                    </label>
                                    <TextInput
                                        type="email"
                                        placeholder="user@example.com"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className="w-full py-2.5"
                                        error={errors.email}
                                    />
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                        Password (Opsional)
                                    </label>
                                    <TextInput
                                        type="password"
                                        placeholder="Kosongkan jika tidak ingin diubah"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        className="w-full py-2.5"
                                        error={errors.password}
                                    />
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                        Konfirmasi Password
                                    </label>
                                    <TextInput
                                        type="password"
                                        placeholder="Ulangi password"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full py-2.5"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Footer */}
                        <div className="p-8 bg-slate-50/30 border-t border-slate-100 flex justify-end gap-3 dark:bg-slate-700/20 dark:border-slate-600">
                            <Button
                                variant="secondary"
                                href={route("be.users.index")}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={processing}
                                className="shadow-lg shadow-indigo-100 dark:shadow-none"
                            >
                                <span>
                                    {processing ? "Menyimpan" : "Perbarui"}
                                </span>
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Roles Assignment */}
                <div className="space-y-6">
                    <Card>
                        <div className="p-6 border-b border-slate-100 bg-slate-50/30 dark:bg-slate-700/20 dark:border-slate-600">
                            <h3 className="font-bold text-slate-800 dark:text-slate-200">
                                Assign Role
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-200">
                                Sesuaikan hak akses untuk user ini
                            </p>
                        </div>
                        <div className="p-6 space-y-4 dark:bg-slate-700/20 dark:border-slate-600">
                            {roles.map((role) => (
                                <label
                                    key={role.id}
                                    className={`
                                        flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all dark:bg-slate-700/20 dark:border-slate-600
                                        ${
                                            data.roles.includes(role.name)
                                                ? "border-indigo-500 bg-indigo-50/50 ring-4 ring-indigo-500/5 dark:border-indigo-600 dark:bg-indigo-50/5 dark:ring-indigo-500/5"
                                                : "border-slate-100 hover:border-slate-200"
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                            checked={data.roles.includes(
                                                role.name,
                                            )}
                                            onChange={() =>
                                                handleRoleChange(role.name)
                                            }
                                        />
                                        <div>
                                            <p
                                                className={`text-sm font-bold ${
                                                    data.roles.includes(
                                                        role.name,
                                                    )
                                                        ? "text-indigo-700"
                                                        : "text-slate-700"
                                                }`}
                                            >
                                                {role.name.toUpperCase()}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Izin akses standar {role.name}
                                            </p>
                                        </div>
                                    </div>
                                </label>
                            ))}
                            {errors.roles && (
                                <p className="text-xs text-rose-500 mt-2">
                                    {errors.roles}
                                </p>
                            )}
                        </div>
                    </Card>

                    {/* Information Box */}
                    <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 dark:bg-indigo-700/20 dark:border-indigo-600">
                        <h4 className="text-sm font-bold text-indigo-800 mb-2 dark:text-indigo-200">
                            Informasi
                        </h4>
                        <p className="text-xs text-indigo-700/80 leading-relaxed dark:text-indigo-200">
                            Password hanya perlu diisi jika Anda ingin mengganti
                            password user. Jika dibiarkan kosong, password lama
                            tetap akan digunakan.
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
