import React from "react";
import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import Card from "@/Components/UI/Card";
import { Head, useForm, Link } from "@inertiajs/react";
import { ArrowLeft, Save, Calendar, Clock, MapPin, FileText, Image } from "lucide-react";

interface AgendaFormData {
    judul: string;
    deskripsi: string;
    tanggal: string;
    waktu: string;
    lokasi: string;
    status: string;
    gambar: File | null;
    [key: string]: string | File | null;
}

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm<AgendaFormData>({
        judul: "",
        deskripsi: "",
        tanggal: "",
        waktu: "",
        lokasi: "",
        status: "upcoming",
        gambar: null,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Kirim sebagai FormData untuk support upload file
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            const value = data[key as keyof AgendaFormData];
            if (value !== null && value !== undefined) {
                if (value instanceof File) {
                    formData.append(key, value);
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        post(route("be.agenda.store"), {
            data: formData,
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData("gambar", file);
        }
    };

    return (
        <MainLayout>
            <Head title="Tambah Agenda" />

            <div className="flex items-center gap-3 mb-8">
                <Link
                    href={route("be.agenda.index")}
                    className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Tambah Agenda
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Jadwalkan kegiatan baru untuk ditampilkan ke publik
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                <Card className="p-6 dark:bg-slate-800 dark:border-slate-700 space-y-5">
                    {/* Judul */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            <span className="flex items-center gap-1.5">
                                <FileText size={16} className="text-slate-400" />
                                Judul Agenda <span className="text-rose-500">*</span>
                            </span>
                        </label>
                        <TextInput
                            value={data.judul}
                            onChange={(e) => setData("judul", e.target.value)}
                            placeholder="Contoh: Rapat Koordinasi Bulanan PKK"
                            className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            required
                        />
                        {errors.judul && (
                            <p className="text-xs text-rose-500 mt-1.5">{errors.judul}</p>
                        )}
                    </div>

                    {/* Deskripsi */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            <span className="flex items-center gap-1.5">
                                <FileText size={16} className="text-slate-400" />
                                Deskripsi
                            </span>
                        </label>
                        <textarea
                            value={data.deskripsi}
                            onChange={(e) => setData("deskripsi", e.target.value)}
                            rows={4}
                            placeholder="Detail agenda, opsional..."
                            className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 px-3.5 py-2.5 focus:ring-3 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all resize-none"
                        />
                        {errors.deskripsi && (
                            <p className="text-xs text-rose-500 mt-1.5">{errors.deskripsi}</p>
                        )}
                    </div>

                    {/* Tanggal & Waktu */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                <span className="flex items-center gap-1.5">
                                    <Calendar size={16} className="text-slate-400" />
                                    Tanggal <span className="text-rose-500">*</span>
                                </span>
                            </label>
                            <TextInput
                                type="date"
                                value={data.tanggal}
                                onChange={(e) => setData("tanggal", e.target.value)}
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                required
                                min={new Date().toISOString().split('T')[0]}
                            />
                            {errors.tanggal && (
                                <p className="text-xs text-rose-500 mt-1.5">{errors.tanggal}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                <span className="flex items-center gap-1.5">
                                    <Clock size={16} className="text-slate-400" />
                                    Waktu <span className="text-slate-400 font-normal">(opsional)</span>
                                </span>
                            </label>
                            <TextInput
                                type="time"
                                value={data.waktu}
                                onChange={(e) => setData("waktu", e.target.value)}
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            />
                            {errors.waktu && (
                                <p className="text-xs text-rose-500 mt-1.5">{errors.waktu}</p>
                            )}
                        </div>
                    </div>

                    {/* Lokasi */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            <span className="flex items-center gap-1.5">
                                <MapPin size={16} className="text-slate-400" />
                                Lokasi <span className="text-slate-400 font-normal">(opsional)</span>
                            </span>
                        </label>
                        <TextInput
                            value={data.lokasi}
                            onChange={(e) => setData("lokasi", e.target.value)}
                            placeholder="Contoh: Aula Kecamatan Singaparna"
                            className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                        />
                        {errors.lokasi && (
                            <p className="text-xs text-rose-500 mt-1.5">{errors.lokasi}</p>
                        )}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Status
                        </label>
                        <select
                            value={data.status}
                            onChange={(e) => setData("status", e.target.value)}
                            className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 px-3.5 py-2.5 focus:ring-3 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all"
                        >
                            <option value="upcoming">Akan Datang</option>
                            <option value="ongoing">Sedang Berlangsung</option>
                            <option value="completed">Selesai</option>
                            <option value="cancelled">Dibatalkan</option>
                        </select>
                        {errors.status && (
                            <p className="text-xs text-rose-500 mt-1.5">{errors.status}</p>
                        )}
                    </div>

                    {/* Upload Gambar */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            <span className="flex items-center gap-1.5">
                                <Image size={16} className="text-slate-400" />
                                Gambar <span className="text-slate-400 font-normal">(opsional, max 2MB)</span>
                            </span>
                        </label>
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/jpg,image/gif"
                            onChange={handleFileChange}
                            className="w-full text-sm file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 transition-all cursor-pointer dark:file:bg-slate-700 dark:file:text-slate-200"
                        />
                        {data.gambar && (
                            <p className="text-xs text-teal-600 mt-1.5">
                                File terpilih: {data.gambar.name}
                            </p>
                        )}
                        {errors.gambar && (
                            <p className="text-xs text-rose-500 mt-1.5">{errors.gambar}</p>
                        )}
                    </div>

                    {/* Preview Gambar */}
                    {data.gambar && (
                        <div className="mt-2">
                            <p className="text-xs text-slate-500 mb-2">Preview:</p>
                            <img
                                src={URL.createObjectURL(data.gambar)}
                                alt="Preview"
                                className="w-40 h-32 object-cover rounded-xl border border-slate-200"
                            />
                        </div>
                    )}
                </Card>

                {/* Tombol Aksi */}
                <div className="flex items-center justify-end gap-3">
                    <Button
                        type="button"
                        variant="secondary"
                        href={route("be.agenda.index")}
                        className="dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={processing}
                        className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700"
                    >
                        <Save size={16} />
                        {processing ? "Menyimpan..." : "Simpan Agenda"}
                    </Button>
                </div>
            </form>
        </MainLayout>
    );
}
