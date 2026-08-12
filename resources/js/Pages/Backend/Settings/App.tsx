import React, { FormEventHandler } from "react";
import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import Card from "@/Components/UI/Card";
import { Head, useForm } from "@inertiajs/react";
import { AppWindow, Palette, Save } from "lucide-react";
import { AppSettings } from "@/types/model";

interface AppProps {
    settings: AppSettings;
}

export default function App({ settings }: AppProps) {
    const { data, setData, post, processing, errors } = useForm<{
        app_name: string;
        primary_color: string;
    }>({
        app_name: settings.app_name || "SIM PKK Kabupaten Tasikmalaya",
        primary_color: settings.primary_color || "#10b981",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("be.settings.app.update"), {
            preserveScroll: true,
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
                    Konfigurasi global untuk identitas dan tema tampilan sistem PKK
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                            {/* Nama Aplikasi */}
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

                            {/* Warna Utama */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                    Warna Utama (Primary Color)
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={data.primary_color}
                                        onChange={(e) =>
                                            setData(
                                                "primary_color",
                                                e.target.value
                                            )
                                        }
                                        className="w-12 h-12 rounded-lg cursor-pointer border-0 p-1 bg-white shadow-sm dark:bg-slate-800"
                                    />
                                    <TextInput
                                        type="text"
                                        value={data.primary_color}
                                        onChange={(e) =>
                                            setData(
                                                "primary_color",
                                                e.target.value
                                            )
                                        }
                                        className="w-32 py-2"
                                        placeholder="#10b981"
                                    />
                                    {errors.primary_color && (
                                        <p className="text-xs text-rose-500 mt-1">
                                            {errors.primary_color}
                                        </p>
                                    )}
                                </div>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                    Warna dominan untuk tombol, link, dan aksen tema PKK.
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

                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Palette
                            className="text-emerald-600 dark:text-emerald-400"
                            size={20}
                        />
                        <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">
                            Preview Tampilan
                        </h2>
                    </div>
                    {/* Fake Sidebar Preview */}
                    <Card
                        className="p-0 overflow-hidden opacity-90 pointer-events-none select-none"
                        style={
                            {
                                "--primary": data.primary_color,
                            } as React.CSSProperties
                        }
                    >
                        <div className="flex h-64">
                            <div className="w-1/3 border-r border-slate-100 dark:border-slate-800 p-4 bg-white dark:bg-slate-900 flex flex-col">
                                <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-6 truncate">
                                    {data.app_name || "SIM PKK"}
                                </div>
                                <div className="space-y-2">
                                    <div
                                        className="h-8 rounded-lg px-3 flex items-center font-bold text-xs"
                                        style={{
                                            color: data.primary_color,
                                            backgroundColor: `${data.primary_color}1a`,
                                        }}
                                    >
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
                                    <div
                                        className="h-24 bg-white dark:bg-slate-900 rounded-xl shadow-sm p-4 border-t-4"
                                        style={{
                                            borderColor: data.primary_color,
                                        }}
                                    ></div>
                                    <div className="h-24 bg-white dark:bg-slate-900 rounded-xl shadow-sm p-4"></div>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-3">
                        Preview ilustrasi sidebar dengan warna dan identitas PKK terpilih
                    </p>
                </div>
            </div>
        </MainLayout>
    );
}
