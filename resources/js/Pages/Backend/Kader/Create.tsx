import React from "react";
import MainLayout from "@/Layouts/MainLayout";
import Card from "@/Components/UI/Card";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save } from "lucide-react";

const JABATAN_OPTIONS = [
    "Ketua",
    "Wakil Ketua",
    "Sekretaris",
    "Bendahara",
    "Ketua Pokja I",
    "Ketua Pokja II",
    "Ketua Pokja III",
    "Ketua Pokja IV",
    "Anggota",
];

const POKJA_OPTIONS = ["I", "II", "III", "IV", "Sekretariat"];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nama: "",
        nik: "",
        jabatan: "Anggota",
        pokja: "",
        kecamatan: "",
        desa_kelurahan: "",
        no_hp: "",
        alamat: "",
        status_aktif: true as boolean,
        tanggal_bergabung: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("be.kader.store"));
    };

    const selectClass =
        "w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 block py-3 px-4 transition-all outline-none dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600";

    return (
        <MainLayout>
            <Head title="Tambah Kader" />

            <div className="flex items-center gap-3 mb-8">
                <Link
                    href={route("be.kader.index")}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Tambah Kader
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Tambahkan data kader/anggota PKK baru
                    </p>
                </div>
            </div>

            <Card className="dark:bg-slate-800 dark:border-slate-700">
                <form onSubmit={submit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Nama Lengkap <span className="text-rose-500">*</span>
                            </label>
                            <TextInput
                                placeholder="Masukkan nama lengkap"
                                value={data.nama}
                                onChange={(e) => setData("nama", e.target.value)}
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            />
                            {errors.nama && <div className="text-red-500 text-xs mt-1">{errors.nama}</div>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                NIK
                            </label>
                            <TextInput
                                placeholder="Masukkan NIK (opsional)"
                                value={data.nik}
                                onChange={(e) => setData("nik", e.target.value)}
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            />
                            {errors.nik && <div className="text-red-500 text-xs mt-1">{errors.nik}</div>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Jabatan <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={data.jabatan}
                                onChange={(e) => setData("jabatan", e.target.value)}
                                className={selectClass}
                            >
                                {JABATAN_OPTIONS.map((j) => (
                                    <option key={j} value={j}>{j}</option>
                                ))}
                            </select>
                            {errors.jabatan && <div className="text-red-500 text-xs mt-1">{errors.jabatan}</div>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Pokja
                            </label>
                            <select
                                value={data.pokja}
                                onChange={(e) => setData("pokja", e.target.value)}
                                className={selectClass}
                            >
                                <option value="">Tidak ada</option>
                                {POKJA_OPTIONS.map((p) => (
                                    <option key={p} value={p}>{p === "Sekretariat" ? p : `Pokja ${p}`}</option>
                                ))}
                            </select>
                            {errors.pokja && <div className="text-red-500 text-xs mt-1">{errors.pokja}</div>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Kecamatan
                            </label>
                            <TextInput
                                placeholder="Masukkan kecamatan"
                                value={data.kecamatan}
                                onChange={(e) => setData("kecamatan", e.target.value)}
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            />
                            {errors.kecamatan && <div className="text-red-500 text-xs mt-1">{errors.kecamatan}</div>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Desa/Kelurahan
                            </label>
                            <TextInput
                                placeholder="Masukkan desa/kelurahan"
                                value={data.desa_kelurahan}
                                onChange={(e) => setData("desa_kelurahan", e.target.value)}
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            />
                            {errors.desa_kelurahan && <div className="text-red-500 text-xs mt-1">{errors.desa_kelurahan}</div>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                No. HP
                            </label>
                            <TextInput
                                placeholder="08xxxxxxxxxx"
                                value={data.no_hp}
                                onChange={(e) => setData("no_hp", e.target.value)}
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            />
                            {errors.no_hp && <div className="text-red-500 text-xs mt-1">{errors.no_hp}</div>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Tanggal Bergabung
                            </label>
                            <input
                                type="date"
                                value={data.tanggal_bergabung}
                                onChange={(e) => setData("tanggal_bergabung", e.target.value)}
                                className={selectClass}
                            />
                            {errors.tanggal_bergabung && <div className="text-red-500 text-xs mt-1">{errors.tanggal_bergabung}</div>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                                Alamat
                            </label>
                            <textarea
                                value={data.alamat}
                                onChange={(e) => setData("alamat", e.target.value)}
                                rows={3}
                                placeholder="Masukkan alamat lengkap"
                                className={selectClass}
                            />
                            {errors.alamat && <div className="text-red-500 text-xs mt-1">{errors.alamat}</div>}
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                id="status_aktif"
                                type="checkbox"
                                checked={data.status_aktif}
                                onChange={(e) => setData("status_aktif", e.target.checked)}
                                className="w-4 h-4 text-rose-600 border-slate-300 rounded focus:ring-rose-500"
                            />
                            <label htmlFor="status_aktif" className="text-sm text-slate-600 dark:text-slate-300">
                                Kader Aktif
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <Link
                            href={route("be.kader.index")}
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
                            <span>Simpan Kader</span>
                        </Button>
                    </div>
                </form>
            </Card>
        </MainLayout>
    );
}
