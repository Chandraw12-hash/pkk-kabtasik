import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import Card from "@/Components/UI/Card";
import { Head, useForm, Link } from "@inertiajs/react";
import { ArrowLeft, Save, ImagePlus, X } from "lucide-react";
import type { Pokja1Type } from "@/types/pokja1";

interface EditProps {
    pokja: Pokja1Type;
}

interface Pokja1FormData {
    _method: "put";
    judul_kegiatan: string;
    deskripsi: string;
    kategori: string;
    kecamatan: string;
    pkbn_l: number;
    pkbn_p: number;
    pkdrt_l: number;
    pkdrt_p: number;
    pola_asuh_l: number;
    pola_asuh_p: number;
    lansia_l: number;
    lansia_p: number;
    kader_pokja1_l: number;
    kader_pokja1_p: number;
    foto: File | null;
    [key: string]: string | number | File | null;
}

interface NumericGroup {
    label: string;
    keyL: keyof Pokja1FormData;
    keyP: keyof Pokja1FormData;
}

export default function Edit({ pokja }: EditProps) {
    const { data, setData, post, processing, errors } = useForm<Pokja1FormData>({
        _method: "put",
        judul_kegiatan: pokja.judul_kegiatan || "",
        deskripsi: pokja.deskripsi || "",
        kategori: pokja.kategori || "",
        kecamatan: pokja.kecamatan || "",
        pkbn_l: pokja.pkbn_l ?? 0,
        pkbn_p: pokja.pkbn_p ?? 0,
        pkdrt_l: pokja.pkdrt_l ?? 0,
        pkdrt_p: pokja.pkdrt_p ?? 0,
        pola_asuh_l: pokja.pola_asuh_l ?? 0,
        pola_asuh_p: pokja.pola_asuh_p ?? 0,
        lansia_l: pokja.lansia_l ?? 0,
        lansia_p: pokja.lansia_p ?? 0,
        kader_pokja1_l: pokja.kader_pokja1_l ?? 0,
        kader_pokja1_p: pokja.kader_pokja1_p ?? 0,
        foto: null,
    });

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

    // Grup field angka L/P supaya form tidak terasa seperti daftar input datar
    const numericGroups: NumericGroup[] = [
        { label: "PKBN", keyL: "pkbn_l", keyP: "pkbn_p" },
        { label: "PKDRT", keyL: "pkdrt_l", keyP: "pkdrt_p" },
        { label: "Pola Asuh Anak", keyL: "pola_asuh_l", keyP: "pola_asuh_p" },
        { label: "Lansia", keyL: "lansia_l", keyP: "lansia_p" },
        { label: "Kader Pokja I", keyL: "kader_pokja1_l", keyP: "kader_pokja1_p" },
    ];

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
                        Perbarui data kegiatan dan rekapitulasi Pokja I
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="p-6 dark:bg-slate-800 dark:border-slate-700 space-y-5">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                        Informasi Kegiatan
                    </h2>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Judul Kegiatan
                        </label>
                        <TextInput
                            value={data.judul_kegiatan}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData("judul_kegiatan", e.target.value)}
                            placeholder="Contoh: Sosialisasi PKBN Kecamatan Cihideung"
                            className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                        />
                        {errors.judul_kegiatan && (
                            <p className="text-xs text-rose-500 mt-1.5">{errors.judul_kegiatan}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Deskripsi
                        </label>
                        <textarea
                            value={data.deskripsi}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData("deskripsi", e.target.value)}
                            rows={4}
                            placeholder="Jelaskan detail kegiatan atau catatan tambahan..."
                            className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 px-3.5 py-2.5 focus:ring-3 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none"
                        />
                        {errors.deskripsi && (
                            <p className="text-xs text-rose-500 mt-1.5">{errors.deskripsi}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Kategori
                            </label>
                            <TextInput
                                value={data.kategori}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData("kategori", e.target.value)}
                                placeholder="Contoh: Kesehatan"
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            />
                            {errors.kategori && (
                                <p className="text-xs text-rose-500 mt-1.5">{errors.kategori}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Kecamatan
                            </label>
                            <TextInput
                                value={data.kecamatan}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData("kecamatan", e.target.value)}
                                placeholder="Contoh: Bandung Kulon"
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            />
                            {errors.kecamatan && (
                                <p className="text-xs text-rose-500 mt-1.5">{errors.kecamatan}</p>
                            )}
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
                        Data Rekapitulasi
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {numericGroups.map((group) => (
                            <div key={group.label} className="border border-slate-100 dark:border-slate-700 rounded-xl p-4">
                                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3">
                                    {group.label}
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs text-slate-400 mb-1">Laki-laki</label>
                                        <TextInput
                                            type="number"
                                            min="0"
                                            value={data[group.keyL] as number}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                setData(group.keyL, Number(e.target.value))
                                            }
                                            className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                        />
                                        {errors[group.keyL] && (
                                            <p className="text-xs text-rose-500 mt-1">{errors[group.keyL]}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-400 mb-1">Perempuan</label>
                                        <TextInput
                                            type="number"
                                            min="0"
                                            value={data[group.keyP] as number}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                setData(group.keyP, Number(e.target.value))
                                            }
                                            className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                        />
                                        {errors[group.keyP] && (
                                            <p className="text-xs text-rose-500 mt-1">{errors[group.keyP]}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
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
