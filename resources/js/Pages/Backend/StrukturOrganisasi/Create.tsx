import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    ArrowLeft,
    Save,
    User,
    Image as ImageIcon,
    X,
    Crown,
    UserCog,
    Heart,
    BookOpen,
    Home as HomeIcon,
    Activity,
} from "lucide-react";

interface CreateProps {
    kategoriOptions: Record<string, string>;
}

const KATEGORI_ICON: Record<string, React.ReactNode> = {
    ketua: <Crown size={18} className="text-yellow-600" />,
    pimpinan_inti: <UserCog size={18} className="text-blue-600" />,
    pokja_i: <Heart size={18} className="text-rose-500" />,
    pokja_ii: <BookOpen size={18} className="text-green-600" />,
    pokja_iii: <HomeIcon size={18} className="text-orange-500" />,
    pokja_iv: <Activity size={18} className="text-teal-600" />,
};

export default function Create({ kategoriOptions }: CreateProps) {
    const [previewFoto, setPreviewFoto] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        nama: "",
        jabatan: "",
        kategori: "pimpinan_inti",
        pokja: "",
        foto: null as File | null,
        urutan: 0,
        is_active: true,
        deskripsi: "",
    });

    const isPokja = data.kategori.startsWith("pokja_");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/dashboard/struktur-organisasi");
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData("foto", file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewFoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeFoto = () => {
        setData("foto", null);
        setPreviewFoto(null);
    };

    const inputClass =
        "w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow bg-white";
    const labelClass = "block text-xs font-medium text-slate-700 mb-1.5";
    const selectClass =
        "w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white appearance-none";

    return (
        <MainLayout>
            <Head title="Tambah Pengurus - Struktur Organisasi" />

            <div className="py-6">
                <div className="flex items-center gap-3 mb-6">
                    <Link
                        href="/dashboard/struktur-organisasi"
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Tambah Pengurus
                        </h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Tambahkan data pengurus baru untuk struktur organisasi
                        </p>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Kategori */}
                            <div className="md:col-span-2">
                                <label className={labelClass}>
                                    Kategori <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.kategori}
                                    onChange={(e) => setData("kategori", e.target.value)}
                                    className={selectClass}
                                >
                                    {Object.entries(kategoriOptions).map(([key, label]) => (
                                        <option key={key} value={key}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                                {errors.kategori && (
                                    <p className="text-red-500 text-xs mt-1">{errors.kategori}</p>
                                )}
                            </div>

                            {/* Nama */}
                            <div>
                                <label className={labelClass}>
                                    Nama Lengkap <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.nama}
                                    onChange={(e) => setData("nama", e.target.value)}
                                    className={inputClass}
                                    placeholder="Masukkan nama lengkap"
                                />
                                {errors.nama && (
                                    <p className="text-red-500 text-xs mt-1">{errors.nama}</p>
                                )}
                            </div>

                            {/* Jabatan */}
                            <div>
                                <label className={labelClass}>
                                    Jabatan <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.jabatan}
                                    onChange={(e) => setData("jabatan", e.target.value)}
                                    className={inputClass}
                                    placeholder="Contoh: Ketua, Sekretaris, Anggota"
                                />
                                {errors.jabatan && (
                                    <p className="text-red-500 text-xs mt-1">{errors.jabatan}</p>
                                )}
                            </div>

                            {/* Pokja */}
                            {isPokja && (
                                <div>
                                    <label className={labelClass}>Pokja</label>
                                    <select
                                        value={data.pokja || ""}
                                        onChange={(e) => setData("pokja", e.target.value)}
                                        className={selectClass}
                                    >
                                        <option value="">Pilih Pokja</option>
                                        <option value="I">Pokja I</option>
                                        <option value="II">Pokja II</option>
                                        <option value="III">Pokja III</option>
                                        <option value="IV">Pokja IV</option>
                                    </select>
                                    {errors.pokja && (
                                        <p className="text-red-500 text-xs mt-1">{errors.pokja}</p>
                                    )}
                                </div>
                            )}

                            {/* Urutan */}
                            <div>
                                <label className={labelClass}>Urutan Tampil</label>
                                <input
                                    type="number"
                                    value={data.urutan}
                                    onChange={(e) => setData("urutan", parseInt(e.target.value) || 0)}
                                    className={inputClass}
                                    min="0"
                                    placeholder="0"
                                />
                                {errors.urutan && (
                                    <p className="text-red-500 text-xs mt-1">{errors.urutan}</p>
                                )}
                            </div>

                            {/* Status */}
                            <div>
                                <label className={labelClass}>Status</label>
                                <select
                                    value={data.is_active ? "1" : "0"}
                                    onChange={(e) => setData("is_active", e.target.value === "1")}
                                    className={selectClass}
                                >
                                    <option value="1">Aktif</option>
                                    <option value="0">Nonaktif</option>
                                </select>
                            </div>

                            {/* Deskripsi */}
                            {data.kategori === "ketua" && (
                                <div className="md:col-span-2">
                                    <label className={labelClass}>Deskripsi / Kutipan</label>
                                    <textarea
                                        value={data.deskripsi || ""}
                                        onChange={(e) => setData("deskripsi", e.target.value)}
                                        className={`${inputClass} min-h-[80px] resize-y`}
                                        placeholder="Masukkan deskripsi atau kutipan untuk Ketua TP PKK"
                                        rows={3}
                                    />
                                    {errors.deskripsi && (
                                        <p className="text-red-500 text-xs mt-1">{errors.deskripsi}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Foto */}
                        <div className="border-t border-slate-200 pt-6">
                            <label className={labelClass}>Foto</label>
                            <div className="flex items-start gap-6">
                                <div
                                    className={`w-32 h-32 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden ${
                                        previewFoto
                                            ? "border-teal-500 bg-teal-50/30"
                                            : "border-slate-300 bg-slate-50"
                                    }`}
                                >
                                    {previewFoto ? (
                                        <div className="relative w-full h-full group">
                                            <img
                                                src={previewFoto}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeFoto}
                                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-slate-400">
                                            <ImageIcon size={28} />
                                            <span className="text-xs mt-1">No Image</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-slate-500 mb-2">
                                        Upload foto pengurus (format JPG, PNG, WebP, maks 2MB)
                                    </p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 transition-colors"
                                    />
                                    {errors.foto && (
                                        <p className="text-red-500 text-xs mt-1">{errors.foto}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tombol */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                            <Link
                                href="/dashboard/struktur-organisasi"
                                className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <Save size={16} />
                                {processing ? "Menyimpan..." : "Simpan"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
