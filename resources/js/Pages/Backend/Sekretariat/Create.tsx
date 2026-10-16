import React, { useMemo } from "react";
import MainLayout from "@/Layouts/MainLayout";
import Card from "@/Components/UI/Card";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save } from "lucide-react";

const ANGKA: Array<{ key: string; label: string }> = [
    { key: "jumlah_dusun", label: "Jumlah Dusun" },
    { key: "jumlah_pkk_rw", label: "PKK RW" },
    { key: "jumlah_pkk_rt", label: "PKK RT" },
    { key: "jumlah_dasa_wisma", label: "Dasawisma" },
    { key: "jumlah_krt", label: "KRT" },
    { key: "jumlah_kk", label: "KK" },
    { key: "jiwa_l", label: "Jiwa L" },
    { key: "jiwa_p", label: "Jiwa P" },
    { key: "jiwa_tidak_terpilah", label: "Jiwa Tak Terpilah" },
    { key: "tp_pkk_l", label: "TP PKK L" },
    { key: "tp_pkk_p", label: "TP PKK P" },
    { key: "kader_umum_l", label: "Kader Umum L" },
    { key: "kader_umum_p", label: "Kader Umum P" },
    { key: "kader_khusus_l", label: "Kader Khusus L" },
    { key: "kader_khusus_p", label: "Kader Khusus P" },
    { key: "sekretariat_honorer_l", label: "Honorer L" },
    { key: "sekretariat_honorer_p", label: "Honorer P" },
    { key: "sekretariat_bantuan_l", label: "Bantuan L" },
    { key: "sekretariat_bantuan_p", label: "Bantuan P" },
];

interface CreateProps {
    kecamatanList: string[];
    desaByKecamatan: Record<string, string[]>;
}

export default function Create({ kecamatanList, desaByKecamatan }: CreateProps) {
    const initial: Record<string, any> = {
        kecamatan: "",
        desa: "",
        tahun: new Date().getFullYear(),
        keterangan: "",
    };
    for (const f of ANGKA) initial[f.key] = 0;

    const { data, setData, post, processing, errors } = useForm(initial);

    const desaOptions = useMemo(
        () => (data.kecamatan ? desaByKecamatan[data.kecamatan] || [] : []),
        [data.kecamatan, desaByKecamatan]
    );

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("be.sekretariat.store"));
    };

    const selectClass =
        "w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 py-2.5 px-3.5 transition-all outline-none cursor-pointer dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600";

    return (
        <MainLayout>
            <Head title="Tambah Data Sekretariat" />

            <div className="flex items-center gap-3 mb-8">
                <Link
                    href={route("be.sekretariat.index")}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all dark:hover:bg-slate-700"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Tambah Data Sekretariat
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Input langsung kabupaten — langsung tampil di tabel publik & export
                    </p>
                </div>
            </div>

            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-sm text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-200">
                <p className="font-semibold mb-1">Perhatian</p>
                <p className="text-[13px]">
                    Data tersimpan sebagai agregat approved — bila desa & tahun yang sama sudah ada
                    dari alur desa, angkanya <b>ditimpa</b> dan tercatat di log aktivitas.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-6">
                <Card className="p-6 dark:bg-slate-800 dark:border-slate-700 space-y-5">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                        Wilayah & Tahun
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Kecamatan <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={data.kecamatan}
                                onChange={(e) => {
                                    setData("kecamatan", e.target.value);
                                    setData("desa", "");
                                }}
                                className={selectClass}
                            >
                                <option value="">— Pilih kecamatan —</option>
                                {kecamatanList.map((k) => (
                                    <option key={k} value={k}>{k}</option>
                                ))}
                            </select>
                            {errors.kecamatan && <div className="text-red-500 text-xs mt-1">{errors.kecamatan}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Desa <span className="text-rose-500">*</span>
                            </label>
                            <select
                                value={data.desa}
                                onChange={(e) => setData("desa", e.target.value)}
                                className={selectClass}
                                disabled={!data.kecamatan}
                            >
                                <option value="">{data.kecamatan ? "— Pilih desa —" : "— Pilih kecamatan dulu —"}</option>
                                {desaOptions.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                            {errors.desa && <div className="text-red-500 text-xs mt-1">{errors.desa}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Tahun <span className="text-rose-500">*</span>
                            </label>
                            <TextInput
                                type="number"
                                min="2000"
                                max="2100"
                                value={data.tahun}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData("tahun", Number(e.target.value))}
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            />
                            {errors.tahun && <div className="text-red-500 text-xs mt-1">{errors.tahun}</div>}
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Keterangan
                            </label>
                            <TextInput
                                placeholder="Contoh: -"
                                value={data.keterangan}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData("keterangan", e.target.value)}
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            />
                            {errors.keterangan && <div className="text-red-500 text-xs mt-1">{errors.keterangan}</div>}
                        </div>
                    </div>
                </Card>

                <Card className="p-6 dark:bg-slate-800 dark:border-slate-700 space-y-5">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                        Angka (kolom tabel publik)
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {ANGKA.map((f) => (
                            <div key={f.key}>
                                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                                    {f.label}
                                </label>
                                <TextInput
                                    type="number"
                                    min="0"
                                    value={data[f.key] ?? 0}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setData(f.key, e.target.value === "" ? 0 : Number(e.target.value))
                                    }
                                    className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                />
                                {errors[f.key] && (
                                    <p className="text-xs text-rose-500 mt-1">{errors[f.key]}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="flex items-center justify-end gap-3">
                    <Button type="button" variant="secondary" href={route("be.sekretariat.index")}>
                        Batal
                    </Button>
                    <Button type="submit" variant="primary" disabled={processing} className="flex items-center gap-2">
                        <Save size={16} />
                        {processing ? "Menyimpan..." : "Simpan Data"}
                    </Button>
                </div>
            </form>
        </MainLayout>
    );
}
