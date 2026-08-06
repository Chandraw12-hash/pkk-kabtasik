import React from "react";
import MainLayout from "@/Layouts/MainLayout";
import Card from "@/Components/UI/Card";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save } from "lucide-react";

export default function CreateGaleri() {
    const { data, setData, post, processing, errors } = useForm({
        judul: "",
        kategori: "",
        deskripsi: "",
        foto: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("be.galeri.store"));
    };

    const selectClass =
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
                        Unggah dokumentasi foto kegiatan baru
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
                                placeholder="Masukkan judul foto/kegiatan"
                                value={data.judul}
                                onChange={(e) => setData("judul", e.target.value)}
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            />
                            {errors.judul && <div className="text-red-500 text-xs mt-1">{errors.judul}</div>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Kategori Album
                            </label>
                            <TextInput
                                placeholder="Contoh: Pelatihan, Penyuluhan, dll"
                                value={data.kategori}
                                onChange={(e) => setData("kategori", e.target.value)}
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            />
                            {errors.kategori && <div className="text-red-500 text-xs mt-1">{errors.kategori}</div>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                File Foto <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData("foto", e.target.files ? e.target.files[0] : null)}
                                className={selectClass}
                            />
                            {errors.foto && <div className="text-red-500 text-xs mt-1">{errors.foto}</div>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Deskripsi Singkat
                            </label>
                            <textarea
                                value={data.deskripsi}
                                onChange={(e) => setData("deskripsi", e.target.value)}
                                rows={3}
                                placeholder="Keterangan opsional tentang foto ini"
                                className={selectClass}
                            />
                            {errors.deskripsi && <div className="text-red-500 text-xs mt-1">{errors.deskripsi}</div>}
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
