import React from "react";
import MainLayout from "@/Layouts/MainLayout";
import Card from "@/Components/UI/Card";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save } from "lucide-react";
import { Pokja3FormBody, POKJA3_NUMERIK_KEYS } from "./formFields";

interface Pokja3Item {
    id: number;
    kategori?: string;
    kecamatan?: string;
    nama_kecamatan?: string;
    judul_kegiatan?: string;
    deskripsi?: string;
    keterangan?: string;
    [key: string]: any;
}

interface EditProps {
    pokja: Pokja3Item;
}

export default function Edit({ pokja }: EditProps) {
    const initial: Record<string, any> = {
        _method: "put" as const,
        kategori: pokja.kategori || "Umum",
        kecamatan: pokja.kecamatan || "",
        nama_kecamatan: pokja.nama_kecamatan || "",
        judul_kegiatan: pokja.judul_kegiatan || "",
        deskripsi: pokja.deskripsi || "",
        keterangan: pokja.keterangan || "",
    };
    for (const key of POKJA3_NUMERIK_KEYS) initial[key] = pokja[key] ?? 0;

    const { data, setData, post, processing, errors } = useForm(initial);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("be.pokja3.update", pokja.id));
    };

    return (
        <MainLayout>
            <Head title="Edit Data Pokja III" />

            <div className="flex items-center gap-3 mb-8">
                <Link
                    href={route("be.pokja3.index")}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all dark:hover:bg-slate-700"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Edit Data Pokja III
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Kader, pangan, industri & rumah — format sama seperti tabel publik (20 kolom)
                    </p>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <Card className="p-6 dark:bg-slate-800 dark:border-slate-700 space-y-5">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                        Identitas
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Kecamatan <span className="text-rose-500">*</span>
                            </label>
                            <TextInput
                                placeholder="Contoh: Singaparna"
                                value={data.kecamatan}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData("kecamatan", e.target.value)}
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            />
                            {errors.kecamatan && <div className="text-red-500 text-xs mt-1">{errors.kecamatan}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Nama Kecamatan <span className="text-rose-500">*</span>
                            </label>
                            <TextInput
                                placeholder="Contoh: Singaparna"
                                value={data.nama_kecamatan}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData("nama_kecamatan", e.target.value)}
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            />
                            {errors.nama_kecamatan && <div className="text-red-500 text-xs mt-1">{errors.nama_kecamatan}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Kategori
                            </label>
                            <TextInput
                                placeholder="Umum"
                                value={data.kategori}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData("kategori", e.target.value)}
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            />
                            {errors.kategori && <div className="text-red-500 text-xs mt-1">{errors.kategori}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Judul Kegiatan
                            </label>
                            <TextInput
                                placeholder="Contoh: Sosialisasi Hatinya PKK"
                                value={data.judul_kegiatan}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData("judul_kegiatan", e.target.value)}
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            />
                            {errors.judul_kegiatan && <div className="text-red-500 text-xs mt-1">{errors.judul_kegiatan}</div>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Deskripsi
                            </label>
                            <textarea
                                value={data.deskripsi}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData("deskripsi", e.target.value)}
                                rows={3}
                                placeholder="Penjelasan singkat..."
                                className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 px-3.5 py-2.5 outline-none transition-all resize-none"
                            />
                            {errors.deskripsi && <div className="text-red-500 text-xs mt-1">{errors.deskripsi}</div>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Keterangan (kolom 20 di tabel publik)
                            </label>
                            <TextInput
                                placeholder="Contoh: -"
                                value={data.keterangan}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData("keterangan", e.target.value)}
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            />
                            {errors.keterangan && <div className="text-red-500 text-xs mt-1">{errors.keterangan}</div>}
                        </div>
                    </div>
                </Card>

                <Card className="p-6 dark:bg-slate-800 dark:border-slate-700 space-y-6">
                    <Pokja3FormBody data={data} setData={setData} errors={errors} />
                </Card>

                <div className="flex items-center justify-end gap-3">
                    <Button type="button" variant="secondary" href={route("be.pokja3.index")}>
                        Batal
                    </Button>
                    <Button type="submit" variant="primary" disabled={processing} className="flex items-center gap-2">
                        <Save size={16} />
                        {processing ? "Menyimpan..." : "Simpan Perubahan"}
                    </Button>
                </div>
            </form>
        </MainLayout>
    );
}
