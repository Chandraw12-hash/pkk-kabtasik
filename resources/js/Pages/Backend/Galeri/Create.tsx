import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import Card from "@/Components/UI/Card";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save, UploadCloud, X, Calendar } from "lucide-react";

export default function CreateGaleri() {
    const { data, setData, post, processing, errors } = useForm({
        judul: "",
        tanggal: "",
        foto: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(null);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("be.galeri.store"));
    };

    // Handle pemilihan file
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData("foto", file);
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
        } else {
            setPreview(null);
        }
    };

    // Hapus file yang sudah dipilih
    const removeFile = () => {
        setData("foto", null);
        setPreview(null);
        // Reset input file agar bisa pilih file yang sama lagi
        const fileInput = document.getElementById("file-upload") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
    };

    const inputClass =
        "w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 block py-3 px-4 transition-all outline-none dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600";

    return (
        <MainLayout>
            <Head title="Tambah Galeri Foto" />

            <div className="flex items-center gap-3 mb-8">
                <Link
                    href={route("be.galeri.index")}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all dark:hover:bg-slate-700"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Tambah Galeri Foto
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Unggah dokumentasi foto kegiatan terbaru
                    </p>
                </div>
            </div>

            <Card className="dark:bg-slate-800 dark:border-slate-700">
                <form onSubmit={submit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Judul / Nama Kegiatan <span className="text-rose-500">*</span>
                            </label>
                            <TextInput
                                placeholder="Contoh: Pelatihan Kader PKK"
                                value={data.judul}
                                onChange={(e) => setData("judul", e.target.value)}
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            />
                            {errors.judul && <div className="text-red-500 text-xs mt-1">{errors.judul}</div>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Tanggal Kegiatan <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Calendar size={18} />
                                </div>
                                <input
                                    type="date"
                                    value={data.tanggal}
                                    onChange={(e) => setData("tanggal", e.target.value)}
                                    className={`${inputClass} pl-11`}
                                />
                            </div>
                            {errors.tanggal && <div className="text-red-500 text-xs mt-1">{errors.tanggal}</div>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Upload Foto <span className="text-rose-500">*</span>
                            </label>

                            {/* Input file asli disembunyikan */}
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />

                            {!preview ? (
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer w-full h-48 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-rose-500 hover:bg-rose-50/30 transition-all dark:border-slate-600 dark:hover:border-rose-400 dark:hover:bg-slate-700/50"
                                >
                                    <UploadCloud size={40} className="text-slate-400" />
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Klik untuk unggah foto
                                        </p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500">
                                            PNG, JPG, JPEG (Maks. 2MB)
                                        </p>
                                    </div>
                                </label>
                            ) : (
                                <div className="relative w-full h-64 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
                                    <img
                                        src={preview}
                                        alt="Preview Foto"
                                        className="w-full h-full object-contain bg-slate-50 dark:bg-slate-800"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeFile}
                                        className="absolute top-3 right-3 p-1.5 bg-slate-900/70 hover:bg-red-500 text-white rounded-full transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                            {errors.foto && <div className="text-red-500 text-xs mt-1">{errors.foto}</div>}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <Link
                            href={route("be.galeri.index")}
                            className="px-5 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            Batal
                        </Link>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={processing}
                            className="flex items-center gap-2"
                        >
                            <Save size={16} />
                            <span>Simpan Foto</span>
                        </Button>
                    </div>
                </form>
            </Card>
        </MainLayout>
    );
}
