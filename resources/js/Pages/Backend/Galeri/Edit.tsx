import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import Card from "@/Components/UI/Card";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save, UploadCloud, X, Calendar, Images } from "lucide-react";

interface GaleriFoto {
    id: number;
    foto: string;
    foto_url?: string;
    urutan: number;
}

interface GaleriItem {
    id: number;
    judul?: string;
    tanggal?: string;
    foto?: string | null;
    fotos?: GaleriFoto[];
}

interface EditProps {
    galeri: GaleriItem;
}

export default function EditGaleri({ galeri }: EditProps) {
    const { data, setData, post, processing, errors } = useForm({
        _method: "put" as const,
        judul: galeri.judul || "",
        tanggal: galeri.tanggal ? String(galeri.tanggal).slice(0, 10) : "",
        foto: null as File | null,
        galeri: [] as File[],
        hapus_galeri: [] as number[],
    });

    const galeriLama = (galeri.fotos || []).filter(
        (f) => !data.hapus_galeri.includes(f.id)
    );
    const maksGaleri = 4;
    const sisaSlot = Math.max(0, maksGaleri - galeriLama.length);
    const [galeriBaruPreview, setGaleriBaruPreview] = useState<string[]>([]);

    const [preview, setPreview] = useState<string | null>(
        galeri.foto ? `/storage/${galeri.foto}` : null
    );

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("be.galeri.update", galeri.id));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData("foto", file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(galeri.foto ? `/storage/${galeri.foto}` : null);
        }
    };

    const removeFile = () => {
        setData("foto", null);
        setPreview(galeri.foto ? `/storage/${galeri.foto}` : null);
        const fileInput = document.getElementById("file-upload") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
    };

    const handleGaleriBaru = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        const gabung = [...data.galeri, ...files].slice(0, sisaSlot);
        setData("galeri", gabung);
        setGaleriBaruPreview(gabung.map((f) => URL.createObjectURL(f)));
    };

    const hapusGaleriBaru = (idx: number) => {
        const gabung = data.galeri.filter((_, i) => i !== idx);
        setData("galeri", gabung);
        setGaleriBaruPreview(gabung.map((f) => URL.createObjectURL(f)));
    };

    const tandaiHapusGaleriLama = (id: number) => {
        setData("hapus_galeri", [...data.hapus_galeri, id]);
    };

    const inputClass =
        "w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 block py-3 px-4 transition-all outline-none dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600";

    return (
        <MainLayout>
            <Head title="Edit Galeri Foto" />

            <div className="flex items-center gap-3 mb-8">
                <Link
                    href={route("be.galeri.index")}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all dark:hover:bg-slate-700"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Edit Galeri Foto
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Perbarui dokumentasi foto kegiatan
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
                                Foto {data.foto || !galeri.foto ? "" : "(kosongkan bila tidak diganti)"}
                            </label>

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
                                    {data.foto && (
                                        <button
                                            type="button"
                                            onClick={removeFile}
                                            className="absolute top-3 right-3 p-1.5 bg-slate-900/70 hover:bg-red-500 text-white rounded-full transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            )}
                            {data.foto && (
                                <p className="text-xs text-slate-400 mt-2">
                                    Foto baru dipilih — foto lama diganti saat disimpan.
                                </p>
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
                                        {galeriLama.length + data.galeri.length}/{maksGaleri} terisi
                                        {sisaSlot > 0
                                            ? ` — masih bisa tambah ${sisaSlot}`
                                            : " — penuh"}
                                    </span>
                                </div>
                                {(galeriLama.length > 0 || galeriBaruPreview.length > 0) && (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
                                        {galeriLama.map((f) => (
                                            <div key={`lama-${f.id}`} className="relative group">
                                                <img
                                                    src={f.foto_url || `/storage/${f.foto}`}
                                                    alt="Galeri tersimpan"
                                                    className="w-full h-24 object-cover rounded-lg border border-slate-200"
                                                />
                                                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 text-[10px] font-bold bg-slate-900/70 text-white rounded">
                                                    Tersimpan
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => tandaiHapusGaleriLama(f.id)}
                                                    className="absolute -top-2 -right-2 p-1 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
                                                    title="Hapus foto ini"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                        {galeriBaruPreview.map((src, i) => (
                                            <div key={`baru-${i}`} className="relative group">
                                                <img
                                                    src={src}
                                                    alt={`Galeri baru ${i + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg border border-teal-300"
                                                />
                                                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 text-[10px] font-bold bg-teal-600 text-white rounded">
                                                    Baru
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => hapusGaleriBaru(i)}
                                                    className="absolute -top-2 -right-2 p-1 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
                                                    title="Batalkan foto ini"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {sisaSlot > 0 ? (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleGaleriBaru}
                                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 transition-all cursor-pointer"
                                    />
                                ) : (
                                    <p className="text-xs text-slate-400">
                                        Slot penuh — hapus salah satu foto tersimpan untuk menambah.
                                    </p>
                                )}
                            </div>
                            <p className="text-xs text-slate-400 mt-2">
                                Foto yang dihapus ikut terhapus dari server saat disimpan.
                            </p>
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
                            <span>{processing ? "Menyimpan..." : "Simpan Perubahan"}</span>
                        </Button>
                    </div>
                </form>
            </Card>
        </MainLayout>
    );
}
