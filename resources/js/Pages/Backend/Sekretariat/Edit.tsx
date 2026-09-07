import React from "react";
import MainLayout from "@/Layouts/MainLayout";
import Card from "@/Components/UI/Card";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save } from "lucide-react";

// 🔥 DAFTAR KECAMATAN
const KECAMATAN_OPTIONS = [
    "Bantarkalong", "Bojongasih", "Bojonggambir", "Ciawi", "Cibalong",
    "Cigalontang", "Cikalong", "Cikatomas", "Cineam", "Cipatujah",
    "Cisayong", "Culamega", "Gunungtanjung", "Jamanis", "Jatiwaras",
    "Kadipaten", "Karangjaya", "Karangnunggal", "Leuwisari", "Mangunreja",
    "Manonjaya", "Padakembang", "Pagerageung", "Pancatengah", "Parungponteng",
    "Puspahiang", "Rajapolah", "Salawu", "Salopa", "Sariwangi",
    "Singaparna", "Sodonghilir", "Sukahening", "Sukaraja", "Sukarame",
    "Sukaratu", "Sukaresik", "Tanjungjaya", "Taraju"
];

interface SekretariatProps {
    sekretariat: {
        id: number;
        kecamatan: string;
        nama_kecamatan: string;
        kategori: string;
        judul_kegiatan: string;
        deskripsi: string;
        jumlah_pkk_rw: number;
        jumlah_pkk_rt: number;
        jumlah_dasa_wisma: number;
        jumlah_krt: number;
        jumlah_kk: number;
        jiwa_l: number;
        jiwa_p: number;
        tp_pkk_l: number;
        tp_pkk_p: number;
        kader_umum_l: number;
        kader_umum_p: number;
        kader_khusus_l: number;
        kader_khusus_p: number;
    };
}

export default function Edit({ sekretariat }: SekretariatProps) {
    const { data, setData, put, processing, errors } = useForm({
        kecamatan: sekretariat.kecamatan || "",
        nama_kecamatan: sekretariat.nama_kecamatan || "",
        kategori: sekretariat.kategori || "Sekretariat",
        judul_kegiatan: sekretariat.judul_kegiatan || "",
        deskripsi: sekretariat.deskripsi || "",
        jumlah_pkk_rw: sekretariat.jumlah_pkk_rw?.toString() || "",
        jumlah_pkk_rt: sekretariat.jumlah_pkk_rt?.toString() || "",
        jumlah_dasa_wisma: sekretariat.jumlah_dasa_wisma?.toString() || "",
        jumlah_krt: sekretariat.jumlah_krt?.toString() || "",
        jumlah_kk: sekretariat.jumlah_kk?.toString() || "",
        jiwa_l: sekretariat.jiwa_l?.toString() || "",
        jiwa_p: sekretariat.jiwa_p?.toString() || "",
        tp_pkk_l: sekretariat.tp_pkk_l?.toString() || "",
        tp_pkk_p: sekretariat.tp_pkk_p?.toString() || "",
        kader_umum_l: sekretariat.kader_umum_l?.toString() || "",
        kader_umum_p: sekretariat.kader_umum_p?.toString() || "",
        kader_khusus_l: sekretariat.kader_khusus_l?.toString() || "",
        kader_khusus_p: sekretariat.kader_khusus_p?.toString() || "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // 🔥 Konversi string ke number untuk field angka
        const formData = {
            ...data,
            jumlah_pkk_rw: parseInt(data.jumlah_pkk_rw) || 0,
            jumlah_pkk_rt: parseInt(data.jumlah_pkk_rt) || 0,
            jumlah_dasa_wisma: parseInt(data.jumlah_dasa_wisma) || 0,
            jumlah_krt: parseInt(data.jumlah_krt) || 0,
            jumlah_kk: parseInt(data.jumlah_kk) || 0,
            jiwa_l: parseInt(data.jiwa_l) || 0,
            jiwa_p: parseInt(data.jiwa_p) || 0,
            tp_pkk_l: parseInt(data.tp_pkk_l) || 0,
            tp_pkk_p: parseInt(data.tp_pkk_p) || 0,
            kader_umum_l: parseInt(data.kader_umum_l) || 0,
            kader_umum_p: parseInt(data.kader_umum_p) || 0,
            kader_khusus_l: parseInt(data.kader_khusus_l) || 0,
            kader_khusus_p: parseInt(data.kader_khusus_p) || 0,
        };

        put(route("be.sekretariat.update", sekretariat.id), { data: formData });
    };

    const selectClass =
        "w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 block py-3 px-4 transition-all outline-none dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600";

    const inputClass =
        "w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 block py-3 px-4 transition-all outline-none dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600";

    return (
        <MainLayout>
            <Head title="Edit Data Sekretariat" />

            <div className="flex items-center gap-3 mb-8">
                <Link
                    href={route("be.sekretariat.index")}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all dark:hover:bg-slate-700"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Edit Data Sekretariat
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Edit data umum sekretariat untuk kecamatan {data.kecamatan}
                    </p>
                </div>
            </div>

            <Card className="dark:bg-slate-800 dark:border-slate-700">
                <form onSubmit={submit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* ===== KECAMATAN ===== */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Kecamatan <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={data.kecamatan}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setData("kecamatan", val);
                                    setData("nama_kecamatan", val);
                                }}
                                className={selectClass}
                            >
                                <option value="">Pilih Kecamatan</option>
                                {KECAMATAN_OPTIONS.map((kec) => (
                                    <option key={kec} value={kec}>
                                        {kec}
                                    </option>
                                ))}
                            </select>
                            {errors.kecamatan && <div className="text-red-500 text-xs mt-1">{errors.kecamatan}</div>}
                        </div>

                        {/* ===== KATEGORI ===== */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Kategori <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={data.kategori}
                                onChange={(e) => setData("kategori", e.target.value)}
                                className={selectClass}
                            >
                                <option value="Sekretariat">Sekretariat</option>
                                <option value="Umum">Umum</option>
                            </select>
                            {errors.kategori && <div className="text-red-500 text-xs mt-1">{errors.kategori}</div>}
                        </div>

                        {/* ===== JUDUL KEGIATAN ===== */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Judul Kegiatan <span className="text-rose-500">*</span>
                            </label>
                            <TextInput
                                placeholder="Contoh: Data Umum Sekretariat - Kecamatan X"
                                value={data.judul_kegiatan}
                                onChange={(e) => setData("judul_kegiatan", e.target.value)}
                                className={inputClass}
                            />
                            {errors.judul_kegiatan && <div className="text-red-500 text-xs mt-1">{errors.judul_kegiatan}</div>}
                        </div>

                        {/* ===== DESKRIPSI ===== */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Deskripsi
                            </label>
                            <textarea
                                value={data.deskripsi}
                                onChange={(e) => setData("deskripsi", e.target.value)}
                                rows={3}
                                placeholder="Penjelasan singkat mengenai data..."
                                className={selectClass}
                            />
                            {errors.deskripsi && <div className="text-red-500 text-xs mt-1">{errors.deskripsi}</div>}
                        </div>

                        {/* ===== DIVIDER ===== */}
                        <div className="md:col-span-2">
                            <hr className="border-slate-200 dark:border-slate-700" />
                            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-3">
                                Data Jumlah Kelompok & Penduduk
                            </p>
                        </div>

                        {/* ===== JUMLAH PKK RW ===== */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Jumlah PKK RW
                            </label>
                            <TextInput
                                type="number"
                                placeholder="0"
                                value={data.jumlah_pkk_rw}
                                onChange={(e) => setData("jumlah_pkk_rw", e.target.value)}
                                className={inputClass}
                            />
                            {errors.jumlah_pkk_rw && <div className="text-red-500 text-xs mt-1">{errors.jumlah_pkk_rw}</div>}
                        </div>

                        {/* ===== JUMLAH PKK RT ===== */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Jumlah PKK RT
                            </label>
                            <TextInput
                                type="number"
                                placeholder="0"
                                value={data.jumlah_pkk_rt}
                                onChange={(e) => setData("jumlah_pkk_rt", e.target.value)}
                                className={inputClass}
                            />
                            {errors.jumlah_pkk_rt && <div className="text-red-500 text-xs mt-1">{errors.jumlah_pkk_rt}</div>}
                        </div>

                        {/* ===== JUMLAH DASAWISMA ===== */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Jumlah Dasawisma
                            </label>
                            <TextInput
                                type="number"
                                placeholder="0"
                                value={data.jumlah_dasa_wisma}
                                onChange={(e) => setData("jumlah_dasa_wisma", e.target.value)}
                                className={inputClass}
                            />
                            {errors.jumlah_dasa_wisma && <div className="text-red-500 text-xs mt-1">{errors.jumlah_dasa_wisma}</div>}
                        </div>

                        {/* ===== JUMLAH KRT ===== */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Jumlah KRT
                            </label>
                            <TextInput
                                type="number"
                                placeholder="0"
                                value={data.jumlah_krt}
                                onChange={(e) => setData("jumlah_krt", e.target.value)}
                                className={inputClass}
                            />
                            {errors.jumlah_krt && <div className="text-red-500 text-xs mt-1">{errors.jumlah_krt}</div>}
                        </div>

                        {/* ===== JUMLAH KK ===== */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Jumlah KK
                            </label>
                            <TextInput
                                type="number"
                                placeholder="0"
                                value={data.jumlah_kk}
                                onChange={(e) => setData("jumlah_kk", e.target.value)}
                                className={inputClass}
                            />
                            {errors.jumlah_kk && <div className="text-red-500 text-xs mt-1">{errors.jumlah_kk}</div>}
                        </div>

                        {/* ===== DIVIDER ===== */}
                        <div className="md:col-span-2">
                            <hr className="border-slate-200 dark:border-slate-700" />
                            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-3">
                                Data Jiwa & Kader
                            </p>
                        </div>

                        {/* ===== JIWA L ===== */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Jiwa Laki-laki
                            </label>
                            <TextInput
                                type="number"
                                placeholder="0"
                                value={data.jiwa_l}
                                onChange={(e) => setData("jiwa_l", e.target.value)}
                                className={inputClass}
                            />
                            {errors.jiwa_l && <div className="text-red-500 text-xs mt-1">{errors.jiwa_l}</div>}
                        </div>

                        {/* ===== JIWA P ===== */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Jiwa Perempuan
                            </label>
                            <TextInput
                                type="number"
                                placeholder="0"
                                value={data.jiwa_p}
                                onChange={(e) => setData("jiwa_p", e.target.value)}
                                className={inputClass}
                            />
                            {errors.jiwa_p && <div className="text-red-500 text-xs mt-1">{errors.jiwa_p}</div>}
                        </div>

                        {/* ===== TP PKK L ===== */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                TP PKK Laki-laki
                            </label>
                            <TextInput
                                type="number"
                                placeholder="0"
                                value={data.tp_pkk_l}
                                onChange={(e) => setData("tp_pkk_l", e.target.value)}
                                className={inputClass}
                            />
                            {errors.tp_pkk_l && <div className="text-red-500 text-xs mt-1">{errors.tp_pkk_l}</div>}
                        </div>

                        {/* ===== TP PKK P ===== */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                TP PKK Perempuan
                            </label>
                            <TextInput
                                type="number"
                                placeholder="0"
                                value={data.tp_pkk_p}
                                onChange={(e) => setData("tp_pkk_p", e.target.value)}
                                className={inputClass}
                            />
                            {errors.tp_pkk_p && <div className="text-red-500 text-xs mt-1">{errors.tp_pkk_p}</div>}
                        </div>

                        {/* ===== KADER UMUM L ===== */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Kader Umum Laki-laki
                            </label>
                            <TextInput
                                type="number"
                                placeholder="0"
                                value={data.kader_umum_l}
                                onChange={(e) => setData("kader_umum_l", e.target.value)}
                                className={inputClass}
                            />
                            {errors.kader_umum_l && <div className="text-red-500 text-xs mt-1">{errors.kader_umum_l}</div>}
                        </div>

                        {/* ===== KADER UMUM P ===== */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Kader Umum Perempuan
                            </label>
                            <TextInput
                                type="number"
                                placeholder="0"
                                value={data.kader_umum_p}
                                onChange={(e) => setData("kader_umum_p", e.target.value)}
                                className={inputClass}
                            />
                            {errors.kader_umum_p && <div className="text-red-500 text-xs mt-1">{errors.kader_umum_p}</div>}
                        </div>

                        {/* ===== KADER KHUSUS L ===== */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Kader Khusus Laki-laki
                            </label>
                            <TextInput
                                type="number"
                                placeholder="0"
                                value={data.kader_khusus_l}
                                onChange={(e) => setData("kader_khusus_l", e.target.value)}
                                className={inputClass}
                            />
                            {errors.kader_khusus_l && <div className="text-red-500 text-xs mt-1">{errors.kader_khusus_l}</div>}
                        </div>

                        {/* ===== KADER KHUSUS P ===== */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Kader Khusus Perempuan
                            </label>
                            <TextInput
                                type="number"
                                placeholder="0"
                                value={data.kader_khusus_p}
                                onChange={(e) => setData("kader_khusus_p", e.target.value)}
                                className={inputClass}
                            />
                            {errors.kader_khusus_p && <div className="text-red-500 text-xs mt-1">{errors.kader_khusus_p}</div>}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <Link
                            href={route("be.sekretariat.index")}
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
                            <span>Update Data</span>
                        </Button>
                    </div>
                </form>
            </Card>
        </MainLayout>
    );
}
