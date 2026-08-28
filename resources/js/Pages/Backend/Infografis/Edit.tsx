import React from "react";
import MainLayout from "@/Layouts/MainLayout";
import Card from "@/Components/UI/Card";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save, Upload, X } from "lucide-react";

interface Infografis {
    id: number;
    judul: string;
    deskripsi: string | null;
    gambar: string | null;
    gambar_url: string | null;
    kategori: string | null;
    urutan: number;
    status: string;
}

interface Props {
    infografis: Infografis;
}

export default function Edit({ infografis }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        judul: infografis.judul || "",
        deskripsi: infografis.deskripsi || "",
        kategori: infografis.kategori || "",
        urutan: infografis.urutan || 0,
        gambar: null as File | null,
        _method: "put",
    });

    const [previewImage, setPreviewImage] = React.useState<string | null>(
        infografis.gambar_url || null
    );
    const [removeImage, setRemoveImage] = React.useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("_method", "put");
        formData.append("judul", data.judul);
        formData.append("deskripsi", data.deskripsi || "");
        formData.append("kategori", data.kategori || "");
        formData.append("urutan", String(data.urutan));

        if (data.gambar) {
            formData.append("gambar", data.gambar);
        }

        if (removeImage) {
            formData.append("remove_image", "true");
        }

        put(route("be.infografis.update", infografis.id), {
            data: formData,
            preserveScroll: true,
            onSuccess: () => {
                setPreviewImage(null);
                setRemoveImage(false);
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData("gambar", file);
            setPreviewImage(URL.createObjectURL(file));
            setRemoveImage(false);
        }
    };

    const handleRemoveImage = () => {
        setPreviewImage(null);
        setRemoveImage(true);
        setData("gambar", null);
    };

    const selectClass =
        "w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 block py-3 px-4 transition-all outline-none dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600";

    return (
        <MainLayout>
            <Head title="Edit Infografis" />

            <div className="flex items-center gap-3 mb-8">
                <Link
                    href={route("be.infografis.index")}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all dark:hover:bg-slate-700"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Edit Infografis
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Perbarui data infografis
                    </p>
                </div>
            </div>

            <Card className="dark:bg-slate-800 dark:border-slate-700">
                <form onSubmit={submit} className="p-6 space-y-6" encType="multipart/form-data">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Judul Infografis <span className="text-rose-500">*</span>
                            </label>
                            <TextInput
                                placeholder="Masukkan judul infografis"
                                value={data.judul}
                                onChange={(e) => setData("judul", e.target.value)}
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            />
                            {errors.judul && <div className="text-rose-500 text-xs mt-1">{errors.judul}</div>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Deskripsi
                            </label>
                            <textarea
                                value={data.deskripsi}
                                onChange={(e) => setData("deskripsi", e.target.value)}
                                rows={3}
                                placeholder="Deskripsi singkat infografis (opsional)"
                                className={selectClass}
                            />
                            {errors.deskripsi && <div className="text-rose-500 text-xs mt-1">{errors.deskripsi}</div>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Kategori
                            </label>
                            <TextInput
                                placeholder="Contoh: Visi Misi, Program, dll"
                                value={data.kategori}
                                onChange={(e) => setData("kategori", e.target.value)}
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            />
                            {errors.kategori && <div className="text-rose-500 text-xs mt-1">{errors.kategori}</div>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Urutan Tampil
                            </label>
                            <TextInput
                                type="number"
                                placeholder="0"
                                value={data.urutan}
                                onChange={(e) => setData("urutan", parseInt(e.target.value) || 0)}
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                min={0}
                            />
                            {errors.urutan && <div className="text-rose-500 text-xs mt-1">{errors.urutan}</div>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Gambar Infografis
                            </label>

                            {previewImage && !removeImage && (
                                <div className="relative inline-block mb-3">
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="max-w-xs max-h-48 object-contain rounded-xl border border-slate-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute -top-2 -right-2 p-1 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            )}

                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-teal-400 hover:bg-teal-50/40 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload size={28} className="text-slate-400 mb-2" />
                                        <p className="text-sm text-slate-500">
                                            <span className="font-semibold">Klik untuk upload</span> atau drag & drop
                                        </p>
                                        <p className="text-xs text-slate-400">PNG, JPG, WEBP (max 2MB)</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            {errors.gambar && <div className="text-rose-500 text-xs mt-1">{errors.gambar}</div>}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <Link
                            href={route("be.infografis.index")}
                            className="px-5 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                        >
                            Batal
                        </Link>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={processing}
                            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700"
                        >
                            <Save size={16} />
                            <span>{processing ? "Menyimpan..." : "Simpan Perubahan"}</span>
                        </Button>
                    </div>
                </form>
            </Card>
        </MainLayout>
    );
}
