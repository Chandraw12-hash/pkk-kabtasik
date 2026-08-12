import React from "react";
import MainLayout from "@/Layouts/MainLayout";
import Card from "@/Components/UI/Card";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save } from "lucide-react";

export default function CreatePokja1() {
    const { data, setData, post, processing, errors } = useForm({
        kategori: "Pokja I", // Bisa disesuaikan atau dikosongkan jika dinamis
        judul_kegiatan: "",
        deskripsi: "",
    });

    const submit = (e) => {
        e.preventDefault();
        // Sesuaikan nama rute store dengan modul pokja yang aktif (contoh: be.pokja1.store)
        post(route("be.pokja1.store"));
    };

    const selectClass =
        "w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 block py-3 px-4 transition-all outline-none dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600";

    return (
        <MainLayout>
            <Head title="Tambah Data Pokja I" />

            <div className="flex items-center gap-3 mb-8">
                <Link
                    // Sesuaikan rute kembali ke index pokja 1
                    href={route("be.pokja1.index")}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all dark:hover:bg-slate-700"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Tambah Data Pokja I
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Tambah kegiatan dan program kerja baru untuk Pokja I TP PKK
                    </p>
                </div>
            </div>

            <Card className="dark:bg-slate-800 dark:border-slate-700 dark:shadow-slate-700/50">
                <form onSubmit={submit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Kategori / Nama Pokja */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Kategori <span className="text-rose-500">*</span>
                            </label>
                            <TextInput
                                placeholder="Pokja I"
                                value={data.kategori}
                                onChange={(e) => setData("kategori", e.target.value)}
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            />
                            {errors.kategori && <div className="text-red-500 text-xs mt-1">{errors.kategori}</div>}
                        </div>

                        {/* Judul Kegiatan */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Judul Kegiatan <span className="text-rose-500">*</span>
                            </label>
                            <TextInput
                                placeholder="Contoh: Penyuluhan Pola Asuh Anak dan Remaja"
                                value={data.judul_kegiatan}
                                onChange={(e) => setData("judul_kegiatan", e.target.value)}
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            />
                            {errors.judul_kegiatan && <div className="text-red-500 text-xs mt-1">{errors.judul_kegiatan}</div>}
                        </div>

                        {/* Deskripsi */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Deskripsi / Keterangan
                            </label>
                            <textarea
                                value={data.deskripsi}
                                onChange={(e) => setData("deskripsi", e.target.value)}
                                rows={4}
                                placeholder="Penjelasan singkat mengenai pelaksanaan kegiatan..."
                                className={selectClass}
                            />
                            {errors.deskripsi && <div className="text-red-500 text-xs mt-1">{errors.deskripsi}</div>}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <Link
                            href={route("be.pokja1.index")}
                            className="px-5 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors dark:text-slate-400 dark:hover:text-slate-200"
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
                            <span>Simpan Data</span>
                        </Button>
                    </div>
                </form>
            </Card>
        </MainLayout>
    );
}
