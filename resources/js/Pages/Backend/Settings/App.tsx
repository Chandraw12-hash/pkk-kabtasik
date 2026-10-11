import React, { FormEventHandler, useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import Card from "@/Components/UI/Card";
import { Head, useForm, router } from "@inertiajs/react";
import { AppWindow, Save, Key, ShieldCheck, Smartphone, History, LogOut, Eye, EyeOff, Trash2, ImagePlus } from "lucide-react";
import { AppSettings } from "@/types/model";

interface DeviceToken {
    id: number;
    name: string;
    last_used: string;
    created: string;
}

interface DeviceSession {
    id: string;
    ip: string;
    device: string;
    last_used: string;
}

interface AppProps {
    settings: AppSettings;
    tokens?: DeviceToken[];
    sessions?: DeviceSession[];
}

export default function App({ settings, tokens = [], sessions = [] }: AppProps) {
    // ===== FORM NAMA + LOGO + WARNA APLIKASI =====
    const { data, setData, post, processing, errors } = useForm<{
        app_name: string;
        app_logo: File | null;
        primary_color: string;
    }>({
        app_name: (settings.app_name as string) || "SIM PKK Kabupaten Tasikmalaya",
        app_logo: null,
        primary_color: (settings.primary_color as string) || "#10b981",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("be.settings.app.update"), {
            preserveScroll: true,
        });
    };

    // ===== FITUR GANTI PASSWORD =====
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const { data: passwordData, setData: setPasswordData, post: postPassword, reset: resetPasswordForm } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleChangePassword: FormEventHandler = (e) => {
        e.preventDefault();
        setIsChangingPassword(true);
        setPasswordMessage(null);

        postPassword(route('be.settings.password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setPasswordMessage({ type: 'success', text: '✅ Password berhasil diubah!' });
                resetPasswordForm();
                setIsChangingPassword(false);
            },
            onError: (errors: any) => {
                const errorMsg = errors.current_password || errors.password || 'Terjadi kesalahan';
                setPasswordMessage({ type: 'error', text: `❌ ${errorMsg}` });
                setIsChangingPassword(false);
            },
        });
    };

    // ===== LOGOUT SEMUA PERANGKAT =====
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [logoutMessage, setLogoutMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleLogoutAllDevices = () => {
        if (!confirm('Yakin ingin logout dari semua perangkat?')) return;

        setIsLoggingOut(true);
        setLogoutMessage(null);

        post(route('be.settings.logout-all'), {
            preserveScroll: true,
            onSuccess: () => {
                setLogoutMessage({ type: 'success', text: '✅ Berhasil logout dari semua perangkat!' });
                setIsLoggingOut(false);
            },
            onError: () => {
                setLogoutMessage({ type: 'error', text: '❌ Gagal logout dari semua perangkat' });
                setIsLoggingOut(false);
            },
        });
    };

    return (
        <MainLayout>
            <Head title="Pengaturan Aplikasi" />

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 tracking-tight">
                    Pengaturan Aplikasi
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Konfigurasi global untuk identitas dan keamanan sistem PKK
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* ============================================================
                    KOLOM KIRI - IDENTITAS APLIKASI
                ============================================================ */}
                <div className="space-y-6">
                    {/* Identitas Aplikasi */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <AppWindow
                                className="text-emerald-600 dark:text-emerald-400"
                                size={20}
                            />
                            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">
                                Identitas Aplikasi
                            </h2>
                        </div>
                        <Card className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                        Nama Aplikasi
                                    </label>
                                    <TextInput
                                        type="text"
                                        value={data.app_name}
                                        onChange={(e) =>
                                            setData("app_name", e.target.value)
                                        }
                                        className="w-full py-2"
                                        placeholder="Contoh: SIM PKK Kabupaten Tasikmalaya"
                                    />
                                    {errors.app_name && (
                                        <p className="text-xs text-rose-500 mt-1">
                                            {errors.app_name}
                                        </p>
                                    )}
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                        Nama ini akan muncul di tab browser dan sidebar.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                        Logo Aplikasi
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                                            {settings.app_logo ? (
                                                <img
                                                    src={`/storage/${settings.app_logo}`}
                                                    alt="Logo aplikasi"
                                                    className="h-full w-full object-contain"
                                                />
                                            ) : (
                                                <ImagePlus size={20} className="text-slate-400" />
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setData("app_logo", e.target.files?.[0] ?? null)
                                            }
                                            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                        JPG/PNG maks 2 MB. Kosongkan bila tidak diganti.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                        Warna Primer
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={data.primary_color}
                                            onChange={(e) =>
                                                setData("primary_color", e.target.value)
                                            }
                                            className="h-10 w-14 cursor-pointer rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1"
                                        />
                                        <span className="text-sm font-mono text-slate-500 dark:text-slate-400">
                                            {data.primary_color}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                        Dipakai sebagai warna aksen (contoh: navigasi).
                                    </p>
                                </div>

                                <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={processing}
                                        className="shadow-lg shadow-emerald-100 dark:shadow-none flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                                    >
                                        <Save size={18} />
                                        <span>Simpan Konfigurasi</span>
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>

                    {/* ============================================================
                        🔒 GANTI PASSWORD
                    ============================================================ */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Key
                                className="text-emerald-600 dark:text-emerald-400"
                                size={20}
                            />
                            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">
                                Keamanan Akun
                            </h2>
                        </div>
                        <Card className="p-6">
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                {passwordMessage && (
                                    <div className={`p-3 rounded-lg text-sm ${
                                        passwordMessage.type === 'success'
                                            ? 'bg-green-50 text-green-700 border border-green-200'
                                            : 'bg-red-50 text-red-700 border border-red-200'
                                    }`}>
                                        {passwordMessage.text}
                                    </div>
                                )}

                                {/* Password Lama */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Password Lama
                                    </label>
                                    <div className="relative">
                                        <TextInput
                                            type={showOldPassword ? "text" : "password"}
                                            value={passwordData.current_password}
                                            onChange={(e) =>
                                                setPasswordData("current_password", e.target.value)
                                            }
                                            className="w-full py-2 pr-10"
                                            placeholder="Masukkan password lama"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowOldPassword(!showOldPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {passwordData.errors?.current_password && (
                                        <p className="text-xs text-rose-500 mt-1">
                                            {passwordData.errors.current_password}
                                        </p>
                                    )}
                                </div>

                                {/* Password Baru */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Password Baru
                                    </label>
                                    <div className="relative">
                                        <TextInput
                                            type={showNewPassword ? "text" : "password"}
                                            value={passwordData.password}
                                            onChange={(e) =>
                                                setPasswordData("password", e.target.value)
                                            }
                                            className="w-full py-2 pr-10"
                                            placeholder="Minimal 8 karakter"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {passwordData.errors?.password && (
                                        <p className="text-xs text-rose-500 mt-1">
                                            {passwordData.errors.password}
                                        </p>
                                    )}
                                    <p className="text-xs text-slate-400 mt-1">
                                        Minimal 8 karakter, kombinasi huruf dan angka
                                    </p>
                                </div>

                                {/* Konfirmasi Password */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Konfirmasi Password Baru
                                    </label>
                                    <div className="relative">
                                        <TextInput
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={passwordData.password_confirmation}
                                            onChange={(e) =>
                                                setPasswordData("password_confirmation", e.target.value)
                                            }
                                            className="w-full py-2 pr-10"
                                            placeholder="Konfirmasi password baru"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={isChangingPassword}
                                        className="shadow-lg shadow-emerald-100 dark:shadow-none flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                                    >
                                        <ShieldCheck size={18} />
                                        <span>{isChangingPassword ? 'Memproses...' : 'Ganti Password'}</span>
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                </div>

                {/* ============================================================
                    KOLOM KANAN - PREVIEW + FITUR TAMBAHAN
                ============================================================ */}
                <div className="space-y-6">
                    {/* Preview Tampilan */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <AppWindow
                                className="text-emerald-600 dark:text-emerald-400"
                                size={20}
                            />
                            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">
                                Preview Tampilan
                            </h2>
                        </div>
                        <Card className="p-0 overflow-hidden opacity-90 pointer-events-none select-none">
                            <div className="flex h-64">
                                <div className="w-1/3 border-r border-slate-100 dark:border-slate-800 p-4 bg-white dark:bg-slate-900 flex flex-col">
                                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-6 truncate">
                                        {data.app_name || "SIM PKK"}
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-8 rounded-lg px-3 flex items-center font-bold text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30">
                                            Dashboard
                                        </div>
                                        <div className="h-8 rounded-lg px-3 flex items-center text-slate-400 dark:text-slate-500 text-xs">
                                            Pokja & Eviden
                                        </div>
                                        <div className="h-8 rounded-lg px-3 flex items-center text-slate-400 dark:text-slate-500 text-xs">
                                            Pengaturan
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-6">
                                    <div className="h-8 mb-4 flex justify-between">
                                        <div className="w-32 h-6 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                        <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="h-24 bg-white dark:bg-slate-900 rounded-xl shadow-sm p-4 border-t-4 border-emerald-500"></div>
                                        <div className="h-24 bg-white dark:bg-slate-900 rounded-xl shadow-sm p-4"></div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-3">
                            Preview ilustrasi sidebar dengan identitas PKK terpilih
                        </p>
                    </div>

                    {/* ============================================================
                        🚪 LOGOUT SEMUA PERANGKAT
                    ============================================================ */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Smartphone
                                className="text-rose-600 dark:text-rose-400"
                                size={20}
                            />
                            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">
                                Manajemen Perangkat
                            </h2>
                        </div>
                        <Card className="p-6">
                            {logoutMessage && (
                                <div className={`p-3 rounded-lg text-sm mb-4 ${
                                    logoutMessage.type === 'success'
                                        ? 'bg-green-50 text-green-700 border border-green-200'
                                        : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                    {logoutMessage.text}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                    <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center flex-shrink-0">
                                        <LogOut size={16} className="text-rose-600 dark:text-rose-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Logout dari Semua Perangkat
                                        </p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500">
                                            Akan logout dari semua perangkat yang sedang login, termasuk mobile
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        variant="danger"
                                        onClick={handleLogoutAllDevices}
                                        disabled={isLoggingOut}
                                        className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white"
                                    >
                                        <LogOut size={18} />
                                        <span>{isLoggingOut ? 'Memproses...' : 'Logout Semua Perangkat'}</span>
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* ============================================================
                        📱 PERANGKAT TERDAFTAR
                    ============================================================ */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <History
                                className="text-slate-600 dark:text-slate-400"
                                size={20}
                            />
                            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">
                                Perangkat Terdaftar
                            </h2>
                        </div>
                        <Card className="p-6">
                            {tokens.length === 0 && sessions.length === 0 ? (
                                <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-4">
                                    Tidak ada perangkat lain yang terdaftar selain sesi ini.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {sessions.map((s) => (
                                        <div
                                            key={`s-${s.id}`}
                                            className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-2 h-2 rounded-full bg-green-500 shrink-0"></div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                                                        {s.device}
                                                    </p>
                                                    <p className="text-xs text-slate-400 dark:text-slate-500">
                                                        Web • {s.ip} • {s.last_used}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (confirm("Cabut sesi perangkat ini?")) {
                                                        router.delete(route("be.settings.sessions.destroy", s.id), {
                                                            preserveScroll: true,
                                                        });
                                                    }
                                                }}
                                                className="text-xs text-rose-500 hover:text-rose-700 font-medium shrink-0 inline-flex items-center gap-1"
                                            >
                                                <Trash2 size={14} />
                                                Cabut Akses
                                            </button>
                                        </div>
                                    ))}
                                    {tokens.map((t) => (
                                        <div
                                            key={`t-${t.id}`}
                                            className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-2 h-2 rounded-full bg-green-500 shrink-0"></div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                                                        {t.name}
                                                    </p>
                                                    <p className="text-xs text-slate-400 dark:text-slate-500">
                                                        Mobile/API • dipakai {t.last_used} • dibuat {t.created}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (confirm("Cabut akses perangkat ini? Aplikasi di perangkat itu akan logout.")) {
                                                        router.delete(route("be.settings.tokens.destroy", t.id), {
                                                            preserveScroll: true,
                                                        });
                                                    }
                                                }}
                                                className="text-xs text-rose-500 hover:text-rose-700 font-medium shrink-0 inline-flex items-center gap-1"
                                            >
                                                <Trash2 size={14} />
                                                Cabut Akses
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
