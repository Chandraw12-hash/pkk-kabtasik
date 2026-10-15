import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import Card from "@/Components/UI/Card";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save, UploadCloud, X, Calendar, Images } from "lucide-react";

export default function CreateGaleri() {
    const { data, setData, post, processing, errors } = useForm({
        judul: "",
        tanggal: "",
        foto: null as File | null,
        galeri: [] as File[],
    });

    const [preview, setPreview] = useState<string | null>(null);
    const [galeriPreview, setGaleriPreview] = useState<string[]>([]);

    // Galeri: maks 4 tambahan (total 5 sama cover). Kalau tak ada cover,
    // foto galeri pertama otomatis jadi cover di server.
    const maksGaleri = 4;

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

    const handleGaleriChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        const gabung = [...data.galeri, ...files].slice(0, maksGaleri);
        setData("galeri", gabung);
        setGaleriPreview(gabung.map((f) => URL.createObjectURL(f)));
    };

    const hapusGaleri = (idx: number) => {
        const gabung = data.galeri.filter((_, i) => i !== idx);
        setData("galeri", gabung);
        setGaleriPreview(gabung.map((f) => URL.createObjectURL(f)));
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
                                Foto Sampul <span className="font-normal text-slate-400">(opsional bila sudah pilih galeri)</span>
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
                                            PNG, JPG, JPEG (Maks. 30MB)
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

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Foto Tambahan (maks {maksGaleri} — total 5 sama sampul)
                            </label>
                            <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-700/30 p-4">
                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-3">
                                    <Images size={16} />
                                    <span>
                                        {data.galeri.length}/{maksGaleri} foto dipilih
                                        {data.foto
                                            ? " (+ 1 sampul)"
                                            : " (foto pertama jadi sampul otomatis)"}
                                    </span>
                                </div>
                                {galeriPreview.length > 0 && (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
                                        {galeriPreview.map((src, i) => (
                                            <div key={i} className="relative group">
                                                <img
                                                    src={src}
                                                    alt={`Galeri ${i + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg border border-slate-200"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => hapusGaleri(i)}
                                                    className="absolute -top-2 -right-2 p-1 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
                                                    title="Hapus foto ini"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {data.galeri.length < maksGaleri && (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleGaleriChange}
                                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 transition-all cursor-pointer"
                                    />
                                )}
                            </div>
                            {errors.galeri && <div className="text-red-500 text-xs mt-1">{errors.galeri}</div>}
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
