import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import Card from "@/Components/UI/Card";
import { Head, useForm, Link } from "@inertiajs/react";
import { ArrowLeft, Save, ImagePlus, X } from "lucide-react";
import { Pokja1FormBody, POKJA1_PROGRAMS } from "./formFields";

interface Pokja1Item {
    id: number;
    kecamatan?: string;
    nama_kecamatan?: string;
    nama_wilayah?: string;
    tahun?: number;
    kader_umum?: number;
    kader_khusus?: number;
    keterangan?: string;
    judul_kegiatan?: string;
    deskripsi?: string;
    kategori?: string;
    foto?: string | null;
    [key: string]: any;
}

interface EditProps {
    pokja: Pokja1Item;
}

export default function Edit({ pokja }: EditProps) {
    const initial: Record<string, any> = {
        _method: "put" as const,
        kecamatan: pokja.kecamatan || "",
        nama_kecamatan: pokja.nama_kecamatan || "",
        nama_wilayah: (pokja as any).nama_wilayah || "",
        tahun: pokja.tahun ?? new Date().getFullYear(),
        kader_umum: pokja.kader_umum ?? 0,
        kader_khusus: pokja.kader_khusus ?? 0,
        keterangan: pokja.keterangan || "",
        judul_kegiatan: pokja.judul_kegiatan || "",
        deskripsi: pokja.deskripsi || "",
        kategori: pokja.kategori || "",
        foto: null as File | null,
    };
    for (const p of POKJA1_PROGRAMS) {
        initial[`${p.key}_kegiatan`] = (pokja as any)[`${p.key}_kegiatan`] || "";
        initial[`${p.key}_volume`] = (pokja as any)[`${p.key}_volume`] ?? 0;
        initial[`${p.key}_metode`] = (pokja as any)[`${p.key}_metode`] || "";
        initial[`${p.key}_sasaran`] = (pokja as any)[`${p.key}_sasaran`] ?? 0;
    }

    const { data, setData, post, processing, errors } = useForm(initial);

    const [preview, setPreview] = useState<string | null>(
        pokja.foto ? `/storage/${pokja.foto}` : null
    );

    const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (!file) return;
        setData("foto", file);
        setPreview(URL.createObjectURL(file));
    };

    const removeFoto = () => {
        setData("foto", null);
        setPreview(pokja.foto ? `/storage/${pokja.foto}` : null);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route("be.pokja1.update", pokja.id));
    };

    return (
        <MainLayout>
            <Head title="Edit Data Pokja I" />

            <div className="flex items-center gap-3 mb-8">
                <Link
                    href={route("be.pokja1.index")}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Edit Data Pokja I
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Kader & 6 program — format sama seperti tabel publik
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="p-6 dark:bg-slate-800 dark:border-slate-700 space-y-5">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                        Identitas & Kader
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
                                Tahun
                            </label>
                            <TextInput
                                type="number"
                                min="2000"
                                max="2100"
                                value={data.tahun}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData("tahun", Number(e.target.value))}
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            />
                            {errors.tahun && <div className="text-red-500 text-xs mt-1">{errors.tahun}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Kader Umum
                            </label>
                            <TextInput
                                type="number"
                                min="0"
                                value={data.kader_umum}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData("kader_umum", e.target.value === "" ? 0 : Number(e.target.value))}
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            />
                            {errors.kader_umum && <div className="text-red-500 text-xs mt-1">{errors.kader_umum}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Kader Khusus
                            </label>
                            <TextInput
                                type="number"
                                min="0"
                                value={data.kader_khusus}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData("kader_khusus", e.target.value === "" ? 0 : Number(e.target.value))}
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            />
                            {errors.kader_khusus && <div className="text-red-500 text-xs mt-1">{errors.kader_khusus}</div>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Keterangan (kolom Keterangan di tabel publik)
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

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Foto Kegiatan
                        </label>

                        {preview ? (
                            <div className="relative w-fit">
                                <img
                                    src={preview}
                                    alt="Preview foto kegiatan"
                                    className="w-40 h-40 object-cover rounded-xl border border-slate-200 dark:border-slate-600"
                                />
                                <button
                                    type="button"
                                    onClick={removeFoto}
                                    className="absolute -top-2 -right-2 bg-white dark:bg-slate-800 text-slate-500 hover:text-rose-500 border border-slate-200 dark:border-slate-600 rounded-full p-1 shadow-sm transition-colors"
                                >
                                    <X size={14} />
                                </button>
                                <label
                                    htmlFor="foto-input"
                                    className="mt-2 block text-xs text-indigo-600 hover:underline cursor-pointer"
                                >
                                    Ganti foto
                                </label>
                            </div>
                        ) : (
                            <label
                                htmlFor="foto-input"
                                className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl py-8 px-4 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40 dark:hover:bg-slate-700/40 transition-colors w-fit min-w-[12rem]"
                            >
                                <ImagePlus size={22} className="text-slate-400" />
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    Klik untuk unggah foto
                                </span>
                            </label>
                        )}

                        <input
                            id="foto-input"
                            type="file"
                            accept="image/jpeg,image/png,image/jpg"
                            onChange={handleFotoChange}
                            className="hidden"
                        />
                        {errors.foto && (
                            <p className="text-xs text-rose-500 mt-1.5">{errors.foto}</p>
                        )}
                    </div>
                </Card>

                <Card className="p-6 dark:bg-slate-800 dark:border-slate-700 space-y-5">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                        6 Program Kerja
                    </h2>
                    <Pokja1FormBody data={data} setData={setData} errors={errors} />
                </Card>

                <div className="flex items-center justify-end gap-3">
                    <Button
                        type="button"
                        variant="secondary"
                        href={route("be.pokja1.index")}
                        className="dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={processing}
                        className="flex items-center gap-2"
                    >
                        <Save size={16} />
                        {processing ? "Menyimpan..." : "Simpan Perubahan"}
                    </Button>
                </div>
            </form>
        </MainLayout>
    );
}
