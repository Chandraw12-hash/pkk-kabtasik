import React, { useRef, ChangeEvent, FormEventHandler } from "react";
import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import Card from "@/Components/UI/Card";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Camera, Save, Lock, User as UserIcon } from "lucide-react";
import { User, SharedProps } from "@/types/model";

interface ProfileProps {
    status?: string;
    auth: {
        user: User;
    };
}

export default function Profile({ status, auth }: ProfileProps) {
    const { user } = usePage<SharedProps>().props.auth;
    // Get App Settings and Auth from Inertia Shared Props
    const { roles, permissions } = user;

    const { data, setData, post, processing, errors, progress } = useForm<{
        _method: string;
        name: string;
        email: string;
        photo: File | null;
    }>({
        _method: "PATCH",
        name: user.name,
        email: user.email,
        photo: null,
    });

    const {
        data: passwordData,
        setData: setPasswordData,
        put: putPassword,
        processing: passwordProcessing,
        errors: passwordErrors,
        reset: resetPassword,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const photoInput = useRef<HTMLInputElement>(null);

    const submitProfile: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("be.settings.profile.update"), {
            preserveScroll: true,
        });
    };

    const submitPassword: FormEventHandler = (e) => {
        e.preventDefault();
        putPassword(route("be.settings.password.update"), {
            preserveScroll: true,
            onSuccess: () => resetPassword(),
        });
    };

    const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData("photo", file);
            // Optional: Preview logic could be added here
        }
    };

    return (
        <MainLayout>
            <Head title="Profil Saya" />

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 tracking-tight">
                    Pengaturan Profil
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Kelola informasi profil dan keamanan akun Anda
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Profile Information */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <UserIcon
                            className="text-indigo-600 dark:text-indigo-400"
                            size={20}
                        />
                        <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">
                            Informasi Dasar
                        </h2>
                    </div>
                    <Card className="p-6">
                        <form onSubmit={submitProfile} className="space-y-6">
                            {/* Avatar Section */}
                            <div className="flex items-center gap-6">
                                <div
                                    className="relative group cursor-pointer"
                                    onClick={() => photoInput.current?.click()}
                                >
                                    <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-md overflow-hidden flex items-center justify-center">
                                        {data.photo ? (
                                            <img
                                                src={URL.createObjectURL(
                                                    data.photo
                                                )}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (user as any).profile_photo_path ? (
                                            <img
                                                src={`/storage/${
                                                    (user as any)
                                                        .profile_photo_path
                                                }`}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-2xl font-bold text-slate-400 dark:text-slate-500 uppercase">
                                                {user.name.charAt(0)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera
                                            className="text-white"
                                            size={20}
                                        />
                                    </div>
                                    <input
                                        type="file"
                                        ref={photoInput}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-800 dark:text-slate-200">
                                        Foto Profil
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                                        JPG, GIF atau PNG. Maksimal 1MB.
                                    </p>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        onClick={() =>
                                            photoInput.current?.click()
                                        }
                                    >
                                        Pilih Foto
                                    </Button>
                                    {errors.photo && (
                                        <p className="text-rose-500 text-xs mt-1">
                                            {errors.photo}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <hr className="border-slate-100 dark:border-slate-800" />

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                    Nama Lengkap
                                </label>
                                <TextInput
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="w-full py-2"
                                />
                                {errors.name && (
                                    <p className="text-xs text-rose-500 mt-1">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                    Email Address
                                </label>
                                <TextInput
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    className="w-full py-2"
                                />
                                {errors.email && (
                                    <p className="text-xs text-rose-500 mt-1">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end pt-2">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={processing}
                                    className="shadow-lg shadow-indigo-100 dark:shadow-none"
                                >
                                    <span>Simpan Profil</span>
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>

                {/* Password Update */}

                {permissions?.includes("edit-profile") && (
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Lock
                                className="text-indigo-600 dark:text-indigo-400"
                                size={20}
                            />
                            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">
                                Keamanan
                            </h2>
                        </div>
                        <Card className="p-6">
                            <form
                                onSubmit={submitPassword}
                                className="space-y-5"
                            >
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                        Password Saat Ini
                                    </label>
                                    <TextInput
                                        type="password"
                                        value={passwordData.current_password}
                                        onChange={(e) =>
                                            setPasswordData(
                                                "current_password",
                                                e.target.value
                                            )
                                        }
                                        className="w-full"
                                        autoComplete="current-password"
                                    />
                                    {passwordErrors.current_password && (
                                        <p className="text-xs text-rose-500 mt-1">
                                            {passwordErrors.current_password}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                        Password Baru
                                    </label>
                                    <TextInput
                                        type="password"
                                        value={passwordData.password}
                                        onChange={(e) =>
                                            setPasswordData(
                                                "password",
                                                e.target.value
                                            )
                                        }
                                        className="w-full"
                                        autoComplete="new-password"
                                    />
                                    {passwordErrors.password && (
                                        <p className="text-xs text-rose-500 mt-1">
                                            {passwordErrors.password}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                        Konfirmasi Password
                                    </label>
                                    <TextInput
                                        type="password"
                                        value={
                                            passwordData.password_confirmation
                                        }
                                        onChange={(e) =>
                                            setPasswordData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        className="w-full"
                                        autoComplete="new-password"
                                    />
                                    {passwordErrors.password_confirmation && (
                                        <p className="text-xs text-rose-500 mt-1">
                                            {
                                                passwordErrors.password_confirmation
                                            }
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button
                                        type="submit"
                                        variant="secondary"
                                        disabled={passwordProcessing}
                                    >
                                        <span>Update Password</span>
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
