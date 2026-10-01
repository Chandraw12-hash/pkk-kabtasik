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
    AlertCircle,
    Info,
    Loader2,
    CheckCircle2,
} from "lucide-react";

// ============================================================
// INTERFACE
// ============================================================

interface CreateProps {
    kategoriOptions: Record<string, string>;
}

// ============================================================
// KONFIGURASI KATEGORI — ICON + WARNA
// ============================================================

const KATEGORI_ICON: Record<string, React.ReactNode> = {
    ketua: <Crown size={18} className="text-yellow-600" />,
    pimpinan_inti: <UserCog size={18} className="text-blue-600" />,
    pokja_i: <Heart size={18} className="text-rose-500" />,
    pokja_ii: <BookOpen size={18} className="text-green-600" />,
    pokja_iii: <HomeIcon size={18} className="text-orange-500" />,
    pokja_iv: <Activity size={18} className="text-teal-600" />,
};

const KATEGORI_HINT: Record<string, string> = {
    ketua: "Pimpinan tertinggi TP PKK. Hanya 1 orang. Deskripsi wajib diisi.",
    pimpinan_inti: "Ketua I–IV, Sekretaris, Bendahara, dan wakilnya.",
    pokja_i: "Bidang Penghayatan & Pengamalan Pancasila.",
    pokja_ii: "Bidang Pendidikan, Keterampilan & Koperasi.",
    pokja_iii: "Bidang Pangan, Sandang & Tata Laksana Rumah Tangga.",
    pokja_iv: "Bidang Kesehatan, Lingkungan & Perencanaan Sehat.",
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function Create({ kategoriOptions }: CreateProps) {
    const [previewFoto, setPreviewFoto] = useState<string | null>(null);

    const { data, setData, post, processing, errors, progress } = useForm({
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
    const isKetua = data.kategori === "ketua";

    // ========================================================
    // HANDLERS
    // ========================================================
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

    // ========================================================
    // STYLES
    // ========================================================
    const inputClass =
        "w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow bg-white placeholder:text-slate-400";
    const inputErrorClass =
        "w-full border border-red-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-shadow bg-white placeholder:text-slate-400";
    const labelClass = "block text-xs font-semibold text-slate-700 mb-1.5";
    const selectClass =
        "w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white appearance-none cursor-pointer";

    // ========================================================
    // RENDER
    // ========================================================
    return (
        <MainLayout>
            <Head title="Tambah Pengurus - Struktur Organisasi" />

            <div className="py-6">
                {/* Header */}
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
                    <form onSubmit={handleSubmit}>
                        {/* ==============================================
                            SECTION 1 — INFORMASI UTAMA
                        ============================================== */}
                        <div className="p-6 border-b border-slate-100">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center">
                                    <User size={18} className="text-teal-600" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900">
                                        Informasi Utama
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        Data dasar pengurus
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Nama */}
                                <div>
                                    <label className={labelClass}>
                                        Nama Lengkap{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nama}
                                        onChange={(e) => setData("nama", e.target.value)}
                                        className={errors.nama ? inputErrorClass : inputClass}
                                        placeholder="Contoh: Hj. Retno Widyastuti, SE."
                                        autoFocus
                                    />
                                    {errors.nama && (
                                        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                                            <AlertCircle size={12} />
                                            {errors.nama}
                                        </p>
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
                                        className={errors.jabatan ? inputErrorClass : inputClass}
                                        placeholder="Contoh: Ketua TP PKK Kabupaten Tasikmalaya"
                                    />
                                    {errors.jabatan && (
                                        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                                            <AlertCircle size={12} />
                                            {errors.jabatan}
                                        </p>
                                    )}
                                    <p className="text-xs text-slate-400 mt-1.5">
                                        Tulis jabatan lengkap — akan tampil di kartu struktur
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ==============================================
                            SECTION 2 — KLASIFIKASI
                        ============================================== */}
                        <div className="p-6 border-b border-slate-100">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <Crown size={18} className="text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900">
                                        Klasifikasi
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        Tentukan posisi dalam struktur
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Kategori */}
                                <div>
                                    <label className={labelClass}>
                                        Kategori <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={data.kategori}
                                            onChange={(e) => setData("kategori", e.target.value)}
                                            className={`${selectClass} pl-11`}
                                        >
                                            {Object.entries(kategoriOptions).map(
                                                ([key, label]) => (
                                                    <option key={key} value={key}>
                                                        {label}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                            {KATEGORI_ICON[data.kategori] || (
                                                <User size={18} className="text-slate-400" />
                                            )}
                                        </div>
                                    </div>
                                    {errors.kategori && (
                                        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                                            <AlertCircle size={12} />
                                            {errors.kategori}
                                        </p>
                                    )}
                                    {/* Hint kategori */}
                                    {KATEGORI_HINT[data.kategori] && (
                                        <div className="flex items-start gap-2 mt-2 p-2.5 bg-blue-50 border border-blue-100 rounded-lg">
                                            <Info
                                                size={14}
                                                className="text-blue-600 mt-0.5 shrink-0"
                                            />
                                            <p className="text-xs text-blue-700 leading-relaxed">
                                                {KATEGORI_HINT[data.kategori]}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Pokja — muncul conditional */}
                                {isPokja && (
                                    <div>
                                        <label className={labelClass}>
                                            Pokja <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.pokja || ""}
                                            onChange={(e) => setData("pokja", e.target.value)}
                                            className={errors.pokja ? inputErrorClass : selectClass}
                                        >
                                            <option value="">Pilih Pokja</option>
                                            <option value="I">Pokja I</option>
                                            <option value="II">Pokja II</option>
                                            <option value="III">Pokja III</option>
                                            <option value="IV">Pokja IV</option>
                                        </select>
                                        {errors.pokja && (
                                            <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                                                <AlertCircle size={12} />
                                                {errors.pokja}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ==============================================
                            SECTION 3 — FOTO
                        ============================================== */}
                        <div className="p-6 border-b border-slate-100">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center">
                                    <ImageIcon size={18} className="text-rose-600" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900">Foto</h2>
                                    <p className="text-xs text-slate-500">
                                        Foto resmi pengurus — rasio 3:4 (potrait)
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start gap-6">
                                {/* Preview 4x4 potrait */}
                                <div className="shrink-0 mx-auto sm:mx-0">
                                    <div
                                        className={`relative w-32 sm:w-36 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-colors ${
                                            previewFoto
                                                ? "border-teal-500 bg-gradient-to-br from-teal-50/30 to-white"
                                                : "border-slate-300 bg-slate-50"
                                        }`}
                                        style={{ aspectRatio: "3 / 4" }}
                                    >
                                        {previewFoto ? (
                                            <>
                                                <img
                                                    src={previewFoto}
                                                    alt="Preview"
                                                    className="w-full h-full object-contain object-bottom"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeFoto}
                                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
                                                    title="Hapus foto"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center text-slate-400 px-4 text-center">
                                                <ImageIcon size={32} />
                                                <span className="text-[11px] mt-2 font-medium">
                                                    Preview 3:4
                                                </span>
                                                <span className="text-[10px] mt-0.5">
                                                    Potrait
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    {previewFoto && (
                                        <p className="text-[10px] text-slate-400 text-center mt-2 max-w-[144px] truncate">
                                            {data.foto?.name}
                                        </p>
                                    )}
                                </div>

                                {/* Input */}
                                <div className="flex-1 w-full">
                                    <label className={labelClass}>Upload Foto</label>
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        onChange={handleFileChange}
                                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 transition-colors cursor-pointer"
                                    />
                                    {errors.foto && (
                                        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                                            <AlertCircle size={12} />
                                            {errors.foto}
                                        </p>
                                    )}

                                    <div className="mt-3 p-3 bg-slate-50 border border-slate-100 rounded-lg">
                                        <p className="text-xs font-semibold text-slate-700 mb-1.5">
                                            Panduan Foto:
                                        </p>
                                        <ul className="space-y-1 text-xs text-slate-500">
                                            <li>• Format: JPG, PNG, atau WebP</li>
                                            <li>• Ukuran maks: 2 MB</li>
                                            <li>• Rasio ideal: 3:4 (potrait)</li>
                                            <li>• Latar belakang polos — formal</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ==============================================
                            SECTION 4 — PENGATURAN TAMPILAN
                        ============================================== */}
                        <div className="p-6 border-b border-slate-100">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center">
                                    <Activity size={18} className="text-orange-600" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900">
                                        Pengaturan Tampilan
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        Urutan & status tampil di halaman publik
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Urutan */}
                                <div>
                                    <label className={labelClass}>Urutan Tampil</label>
                                    <input
                                        type="number"
                                        value={data.urutan}
                                        onChange={(e) =>
                                            setData("urutan", parseInt(e.target.value) || 0)
                                        }
                                        className={errors.urutan ? inputErrorClass : inputClass}
                                        min="0"
                                        placeholder="0"
                                    />
                                    {errors.urutan && (
                                        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                                            <AlertCircle size={12} />
                                            {errors.urutan}
                                        </p>
                                    )}
                                    <p className="text-xs text-slate-400 mt-1.5">
                                        Angka kecil = tampil lebih dulu
                                    </p>
                                </div>

                                {/* Status */}
                                <div>
                                    <label className={labelClass}>Status</label>
                                    <select
                                        value={data.is_active ? "1" : "0"}
                                        onChange={(e) =>
                                            setData("is_active", e.target.value === "1")
                                        }
                                        className={selectClass}
                                    >
                                        <option value="1">Aktif — tampil di publik</option>
                                        <option value="0">Nonaktif — disembunyikan</option>
                                    </select>
                                    <p className="text-xs text-slate-400 mt-1.5">
                                        Nonaktif = tidak muncul di halaman struktur
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ==============================================
                            SECTION 5 — DESKRIPSI (KETUA ONLY)
                        ============================================== */}
                        {isKetua && (
                            <div className="p-6 border-b border-slate-100 bg-yellow-50/30">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-9 h-9 rounded-lg bg-yellow-100 flex items-center justify-center">
                                        <Crown size={18} className="text-yellow-700" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-900">
                                            Deskripsi / Kutipan
                                        </h2>
                                        <p className="text-xs text-slate-500">
                                            Khusus Ketua TP PKK — tampil di section utama
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Deskripsi <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={data.deskripsi || ""}
                                        onChange={(e) => setData("deskripsi", e.target.value)}
                                        className={`${
                                            errors.deskripsi ? inputErrorClass : inputClass
                                        } min-h-[100px] resize-y`}
                                        placeholder="Contoh: Pemberdayaan keluarga merupakan pondasi penting dalam membangun masyarakat Kabupaten Tasikmalaya yang sejahtera, mandiri, dan berdaya saing."
                                        rows={4}
                                    />
                                    {errors.deskripsi && (
                                        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                                            <AlertCircle size={12} />
                                            {errors.deskripsi}
                                        </p>
                                    )}
                                    <p className="text-xs text-slate-400 mt-1.5">
                                        Akan tampil di section Ketua pada halaman struktur
                                        organisasi
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* ==============================================
                            FOOTER — TOMBOL AKSI
                        ============================================== */}
                        <div className="p-6 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
                            {/* Progress upload */}
                            {progress && (
                                <div className="w-full sm:w-auto flex items-center gap-2 text-xs text-slate-500">
                                    <Loader2 size={14} className="animate-spin" />
                                    Uploading... {progress.percentage}%
                                </div>
                            )}

                            <div className="flex items-center gap-3 ml-auto">
                                <Link
                                    href="/dashboard/struktur-organisasi"
                                    className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} />
                                            Simpan Pengurus
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
