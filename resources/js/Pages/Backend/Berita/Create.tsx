import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import Card from "@/Components/UI/Card";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save, X, Images } from "lucide-react";

const KATEGORI_OPTIONS = [
    "Kegiatan",
    "Pengumuman",
    "Artikel",
    "Pemberitaan Desa",
];

// 39 KECAMATAN KABUPATEN TASIKMALAYA (RESMI, sesuai Permendagri No. 137 Tahun 2017)
// Diurutkan alfabet A-Z
const KECAMATAN_OPTIONS = [
    "Bantarkalong",
    "Bojongasih",
    "Bojonggambir",
    "Ciawi",
    "Cibalong",
    "Cigalontang",
    "Cikalong",
    "Cikatomas",
    "Cineam",
    "Cipatujah",
    "Cisayong",
    "Culamega",
    "Gunungtanjung",
    "Jamanis",
    "Jatiwaras",
    "Kadipaten",
    "Karangjaya",
    "Karangnunggal",
    "Leuwisari",
    "Mangunreja",
    "Manonjaya",
    "Padakembang",
    "Pagerageung",
    "Pancatengah",
    "Parungponteng",
    "Puspahiang",
    "Rajapolah",
    "Salawu",
    "Salopa",
    "Sariwangi",
    "Singaparna",
    "Sodonghilir",
    "Sukahening",
    "Sukaraja",
    "Sukarame",
    "Sukaratu",
    "Sukaresik",
    "Tanjungjaya",
    "Taraju",
];

interface CreateBeritaProps {
    kecamatanList?: string[];
}

export default function CreateBerita({ kecamatanList = [] }: CreateBeritaProps) {
    const { data, setData, post, processing, errors } = useForm({
        judul: "",
        kategori: "Kegiatan",
        kecamatan: "",
        tanggal: new Date().toISOString().slice(0, 10),
        konten: "",
        foto: null as File | null,
        galeri: [] as File[],
        status_publikasi: true as boolean,
    });

    const [galeriPreview, setGaleriPreview] = useState<string[]>([]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("be.berita.store"));
    };

    // Galeri: maks 4 tambahan (total 5 sama cover). Kalau tak ada cover,
    // foto galeri pertama otomatis jadi cover di server.
    const maksGaleri = 4;

    const handleGaleriChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []).filter((f) =>
            f.type.startsWith("image/")
        );
        const gabung = [...data.galeri, ...files].slice(0, maksGaleri);
        setData("galeri", gabung);
        setGaleriPreview(gabung.map((f) => URL.createObjectURL(f)));
        e.target.value = "";
    };

    const hapusGaleri = (idx: number) => {
        const gabung = data.galeri.filter((_, i) => i !== idx);
        setData("galeri", gabung);
        setGaleriPreview(gabung.map((f) => URL.createObjectURL(f)));
    };

    const selectClass =
        "w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 block py-3 px-4 transition-all outline-none dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600";

    const kecamatanOptions = kecamatanList.length > 0 ? kecamatanList : KECAMATAN_OPTIONS;

    return (
        <MainLayout>
            <Head title="Tambah Berita" />

            <div className="flex items-center gap-3 mb-8">
                <Link
                    href={route("be.berita.index")}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all dark:hover:bg-slate-700"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Tambah Berita
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Publikasikan informasi kegiatan atau pengumuman baru
                    </p>
                </div>
            </div>

            <Card className="dark:bg-slate-800 dark:border-slate-700">
                <form onSubmit={submit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Judul Berita <span className="text-rose-500">*</span>
                            </label>
                            <TextInput
                                placeholder="Masukkan judul berita"
                                value={data.judul}
                                onChange={(e) => setData("judul", e.target.value)}
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            />
                            {errors.judul && <div className="text-rose-500 text-xs mt-1">{errors.judul}</div>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Kategori <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={data.kategori}
                                onChange={(e) => setData("kategori", e.target.value)}
                                className={selectClass}
                            >
                                {KATEGORI_OPTIONS.map((k) => (
                                    <option key={k} value={k}>{k}</option>
                                ))}
                            </select>
                            {errors.kategori && <div className="text-rose-500 text-xs mt-1">{errors.kategori}</div>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Kecamatan
                            </label>
                            <select
                                value={data.kecamatan}
                                onChange={(e) => setData("kecamatan", e.target.value)}
                                className={selectClass}
                            >
                                <option value="">Pilih Kecamatan</option>
                                {kecamatanOptions.map((k) => (
                                    <option key={k} value={k}>{k}</option>
                                ))}
                            </select>
                            {errors.kecamatan && <div className="text-rose-500 text-xs mt-1">{errors.kecamatan}</div>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Tanggal Kegiatan
                            </label>
                            <input
                                type="date"
                                value={data.tanggal}
                                onChange={(e) => setData("tanggal", e.target.value)}
                                className={selectClass}
                            />
                            {errors.tanggal && <div className="text-rose-500 text-xs mt-1">{errors.tanggal}</div>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Gambar Utama / Cover
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData("foto", e.target.files ? e.target.files[0] : null)}
                                className={selectClass}
                            />
                            {errors.foto && <div className="text-rose-500 text-xs mt-1">{errors.foto}</div>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Foto Galeri (maks {maksGaleri} tambahan — total 5 sama cover)
                            </label>
                            <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-700/30 p-4">
                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-3">
                                    <Images size={16} />
                                    <span>
                                        {data.galeri.length}/{maksGaleri} foto dipilih
                                        {data.foto
                                            ? " (+ 1 cover)"
                                            : " (foto pertama jadi cover otomatis)"}
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
                                        className={`${selectClass} file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 transition-all cursor-pointer`}
                                    />
                                )}
                            </div>
                            {errors.galeri && <div className="text-rose-500 text-xs mt-1">{errors.galeri}</div>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Konten Berita <span className="text-rose-500">*</span>
                            </label>
                            <textarea
                                value={data.konten}
                                onChange={(e) => setData("konten", e.target.value)}
                                rows={8}
                                placeholder="Tulis isi berita di sini..."
                                className={selectClass}
                            />
                            {errors.konten && <div className="text-rose-500 text-xs mt-1">{errors.konten}</div>}
                        </div>

                        <div className="flex items-center gap-2 md:col-span-2">
                            <input
                                id="status_publikasi"
                                type="checkbox"
                                checked={data.status_publikasi}
                                onChange={(e) => setData("status_publikasi", e.target.checked)}
                                className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                            />
                            <label htmlFor="status_publikasi" className="text-sm text-slate-600 dark:text-slate-300">
                                Publikasikan langsung (Draft jika tidak dicentang)
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <Link
                            href={route("be.berita.index")}
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
                            <span>Simpan Berita</span>
                        </Button>
                    </div>
                </form>
            </Card>
        </MainLayout>
    );
}
