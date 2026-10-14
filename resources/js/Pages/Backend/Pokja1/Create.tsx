import React from "react";
import MainLayout from "@/Layouts/MainLayout";
import Card from "@/Components/UI/Card";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save } from "lucide-react";
import { Pokja1FormBody, POKJA1_PROGRAMS } from "./formFields";

export default function CreatePokja1() {
    const initial: Record<string, any> = {
        kecamatan: "",
        nama_kecamatan: "",
        nama_wilayah: "",
        tahun: new Date().getFullYear(),
        kader_umum: 0,
        kader_khusus: 0,
        keterangan: "",
        judul_kegiatan: "",
        deskripsi: "",
        kategori: "",
    };
    for (const p of POKJA1_PROGRAMS) {
        initial[`${p.key}_kegiatan`] = "";
        initial[`${p.key}_volume`] = 0;
        initial[`${p.key}_metode`] = "";
        initial[`${p.key}_sasaran`] = 0;
    }

    const { data, setData, post, processing, errors } = useForm(initial);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("be.pokja1.store"));
    };

    return (
        <MainLayout>
            <Head title="Tambah Data Pokja I" />

            <div className="flex items-center gap-3 mb-8">
                <Link
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
                        Kader & 6 program — format sama seperti tabel publik
                    </p>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-6">
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
                </Card>

                <Card className="p-6 dark:bg-slate-800 dark:border-slate-700 space-y-5">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                        6 Program Kerja
                    </h2>
                    <Pokja1FormBody data={data} setData={setData} errors={errors} />
                </Card>

                <div className="flex items-center justify-end gap-3">
                    <Button type="button" variant="secondary" href={route("be.pokja1.index")}>
                        Batal
                    </Button>
                    <Button type="submit" variant="primary" disabled={processing} className="flex items-center gap-2">
                        <Save size={16} />
                        {processing ? "Menyimpan..." : "Simpan Data"}
                    </Button>
                </div>
            </form>
        </MainLayout>
    );
}
