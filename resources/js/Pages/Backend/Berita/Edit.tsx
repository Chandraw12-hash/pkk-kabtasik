import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import Card from "@/Components/UI/Card";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save, X, Image as ImageIcon, Images } from "lucide-react";

const KATEGORI_OPTIONS = [
    "Kegiatan",
    "Pengumuman",
    "Artikel",
    "Pemberitaan Desa",
];

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

interface BeritaFoto {
    id: number;
    foto_url?: string | null;
    foto?: string | null;
}

interface Berita {
    id: number;
    judul: string;
    slug: string;
    konten: string;
    kategori: string;
    kecamatan: string | null;
    foto: string | null;
    fotos?: BeritaFoto[];
    status_publikasi: boolean;
}

interface EditBeritaProps {
    berita: Berita;
    kecamatanList?: string[];
}

export default function EditBerita({
    berita,
    kecamatanList = [],
}: EditBeritaProps) {
    // ✅ FIX: useForm murni, TANPA FormData manual
    const { data, setData, post, processing, errors } = useForm({
        _method: "put",
        judul: berita.judul || "",
        kategori: berita.kategori || "Kegiatan",
        kecamatan: berita.kecamatan || "",
        konten: berita.konten || "",
        foto: null as File | null,
        galeri: [] as File[],
        hapus_galeri: [] as number[],
        remove_image: false,
        status_publikasi: berita.status_publikasi ?? true,
    });

    const galeriLama = (berita.fotos || []).filter(
        (f) => !data.hapus_galeri.includes(f.id)
    );
    const maksGaleri = 4;
    const sisaSlot = Math.max(0, maksGaleri - galeriLama.length);
    const [galeriBaruPreview, setGaleriBaruPreview] = useState<string[]>([]);

    const [previewImage, setPreviewImage] = useState<string | null>(
        berita.foto ? `/storage/${berita.foto}` : null
    );

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // ✅ FIX: Kirim pakai POST, tapi _method: "put" sudah di-set
        // forceFormData: true WAJIB karena ada upload file
        post(route("be.berita.update", berita.id), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                // Optional: reset preview image setelah sukses
                setPreviewImage(null);
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData("foto", file);
            setPreviewImage(URL.createObjectURL(file));
            setData("remove_image", false);
        }
    };

    const handleRemoveImage = () => {
        setPreviewImage(null);
        setData("foto", null);
        setData("remove_image", true);
    };

    const handleGaleriBaru = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []).filter((f) =>
            f.type.startsWith("image/")
        );
        const gabung = [...data.galeri, ...files].slice(0, sisaSlot);
        setData("galeri", gabung);
        setGaleriBaruPreview(gabung.map((f) => URL.createObjectURL(f)));
        e.target.value = "";
    };

    const hapusGaleriBaru = (idx: number) => {
        const gabung = data.galeri.filter((_, i) => i !== idx);
        setData("galeri", gabung);
        setGaleriBaruPreview(gabung.map((f) => URL.createObjectURL(f)));
    };

    const tandaiHapusGaleriLama = (id: number) => {
        setData("hapus_galeri", [...data.hapus_galeri, id]);
    };

    const selectClass =
        "w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 block py-3 px-4 transition-all outline-none dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600";

    const kecamatanOptions =
        kecamatanList.length > 0 ? kecamatanList : KECAMATAN_OPTIONS;

    return (
        <MainLayout>
            <Head title="Edit Berita" />

            <div className="flex items-center gap-3 mb-8">
                <Link
                    href={route("be.berita.index")}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all dark:hover:bg-slate-700"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Edit Berita
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Perbarui informasi kegiatan atau pengumuman
                    </p>
                </div>
            </div>

            <Card className="dark:bg-slate-800 dark:border-slate-700">
                <form
                    onSubmit={submit}
                    className="p-6 space-y-6"
                    encType="multipart/form-data"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Judul */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Judul Berita{" "}
                                <span className="text-rose-500">*</span>
                            </label>
                            <TextInput
                                placeholder="Masukkan judul berita"
                                value={data.judul}
                                onChange={(e) =>
                                    setData("judul", e.target.value)
                                }
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            />
                            {errors.judul && (
                                <div className="text-rose-500 text-xs mt-1">
                                    {errors.judul}
                                </div>
                            )}
                        </div>

                        {/* Kategori */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Kategori{" "}
                                <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={data.kategori}
                                onChange={(e) =>
                                    setData("kategori", e.target.value)
                                }
                                className={selectClass}
                            >
                                <option value="">Pilih Kategori</option>
                                {KATEGORI_OPTIONS.map((k) => (
                                    <option key={k} value={k}>
                                        {k}
                                    </option>
                                ))}
                            </select>
                            {errors.kategori && (
                                <div className="text-rose-500 text-xs mt-1">
                                    {errors.kategori}
                                </div>
                            )}
                        </div>

                        {/* Kecamatan */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Kecamatan
                            </label>
                            <select
                                value={data.kecamatan}
                                onChange={(e) =>
                                    setData("kecamatan", e.target.value)
                                }
                                className={selectClass}
                            >
                                <option value="">Pilih Kecamatan</option>
                                {kecamatanOptions.map((k) => (
                                    <option key={k} value={k}>
                                        {k}
                                    </option>
                                ))}
                            </select>
                            {errors.kecamatan && (
                                <div className="text-rose-500 text-xs mt-1">
                                    {errors.kecamatan}
                                </div>
                            )}
                        </div>

                        {/* Gambar */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Gambar Utama / Cover
                            </label>

                            {previewImage && (
                                <div className="relative inline-block mb-3">
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="w-40 h-32 object-cover rounded-xl border border-slate-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute -top-2 -right-2 p-1 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
                                        title="Hapus gambar"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className={`${selectClass} file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 transition-all cursor-pointer`}
                            />
                            {data.foto && (
                                <p className="text-xs text-teal-600 mt-1.5">
                                    File terpilih: {data.foto.name}
                                </p>
                            )}
                            {errors.foto && (
                                <div className="text-rose-500 text-xs mt-1">
                                    {errors.foto}
                                </div>
                            )}
                        </div>

                        {/* Galeri tambahan */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Foto Galeri (maks {maksGaleri} — total 5 sama cover)
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
                                                    src={f.foto_url || (f.foto ? `/storage/${f.foto}` : "")}
                                                    alt="Galeri"
                                                    className="w-full h-24 object-cover rounded-lg border border-slate-200"
                                                />
                                                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 text-[10px] font-bold rounded bg-slate-900/60 text-white">
                                                    Tersimpan
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => tandaiHapusGaleriLama(f.id)}
                                                    className="absolute -top-2 -right-2 p-1 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
                                                    title="Hapus foto ini saat disimpan"
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
                                                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 text-[10px] font-bold rounded bg-teal-600/80 text-white">
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
                                        className={`${selectClass} file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 transition-all cursor-pointer`}
                                    />
                                ) : (
                                    <p className="text-xs text-slate-400">
                                        Slot penuh — hapus salah satu foto dulu untuk tambah baru.
                                    </p>
                                )}
                                {data.hapus_galeri.length > 0 && (
                                    <p className="text-xs text-rose-500 mt-2">
                                        {data.hapus_galeri.length} foto lama akan dihapus saat disimpan.
                                    </p>
                                )}
                            </div>
                            {errors.galeri && <div className="text-rose-500 text-xs mt-1">{errors.galeri}</div>}
                        </div>

                        {/* Konten */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Konten Berita{" "}
                                <span className="text-rose-500">*</span>
                            </label>
                            <textarea
                                value={data.konten}
                                onChange={(e) =>
                                    setData("konten", e.target.value)
                                }
                                rows={8}
                                placeholder="Tulis isi berita di sini..."
                                className={selectClass}
                            />
                            {errors.konten && (
                                <div className="text-rose-500 text-xs mt-1">
                                    {errors.konten}
                                </div>
                            )}
                        </div>

                        {/* Status Publikasi */}
                        <div className="flex items-center gap-2 md:col-span-2">
                            <input
                                id="status_publikasi"
                                type="checkbox"
                                checked={data.status_publikasi}
                                onChange={(e) =>
                                    setData(
                                        "status_publikasi",
                                        e.target.checked
                                    )
                                }
                                className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                            />
                            <label
                                htmlFor="status_publikasi"
                                className="text-sm text-slate-600 dark:text-slate-300"
                            >
                                Publikasikan langsung (Draft jika tidak
                                dicentang)
                            </label>
                        </div>
                    </div>

                    {/* Tombol Aksi */}
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
                            <span>
                                {processing
                                    ? "Menyimpan..."
                                    : "Simpan Perubahan"}
                            </span>
                        </Button>
                    </div>
                </form>
            </Card>
        </MainLayout>
    );
}
